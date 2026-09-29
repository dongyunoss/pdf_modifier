// 모든 PDF 편집 작업의 순수 함수 구현. 브라우저(Web Worker)와 Node(단위 테스트) 모두에서 동작합니다.
import { PDFDocument, PDFName, type PDFImage, type PDFPage, StandardFonts, degrees, rgb } from '@cantoo/pdf-lib';
import {
  PAGE_SIZES,
  formatPageNumber,
  type NumberFormat,
  type NumberPosition,
  type PageSizeName,
} from './constants';
import { PdfToolError } from './errors';
import { displayToPage, getPageFrame, normalizeRotation, rotatedOrigin, watermarkCenters } from './geometry';
import { readJpegInfo } from './jpeg';
import { loadPdf, openPdf, type PdfSource, removeUnreachableObjects, savePdf, setProducer } from './load';

export { PAGE_SIZES, formatPageNumber, type NumberFormat, type NumberPosition, type PageSizeName };

export interface CommonOptions {
  /** 새로 만드는 문서의 Producer/Creator 메타데이터 */
  producer?: string;
}

/** 결과 문서에 들어갈 페이지 한 장: 원본 파일의 페이지 또는 빈 페이지 */
export type PageSpec =
  | { src: number; page: number; rotate?: number }
  | { blank: true; width: number; height: number };

const isSourcePage = (spec: PageSpec): spec is { src: number; page: number; rotate?: number } => 'src' in spec;

function rotatePage(page: PDFPage, delta: number) {
  if (!delta) return;
  page.setRotation(degrees(normalizeRotation(page.getRotation().angle + delta)));
}

async function buildDocument(
  docs: Array<PDFDocument | undefined>,
  specs: PageSpec[],
  options: CommonOptions,
): Promise<PDFDocument> {
  if (specs.length === 0) throw new PdfToolError('NO_PAGES', 'no pages selected');

  const out = await PDFDocument.create();
  setProducer(out, options.producer);

  // 같은 원본의 페이지는 한 번의 copyPages 로 복사해야 폰트 등 공유 리소스가 중복되지 않습니다.
  const wanted = new Map<number, number[]>();
  for (const spec of specs) {
    if (!isSourcePage(spec)) continue;
    const doc = docs[spec.src];
    if (!doc) throw new PdfToolError('INVALID_PDF', `missing source ${spec.src}`, spec.src);
    if (!Number.isInteger(spec.page) || spec.page < 0 || spec.page >= doc.getPageCount()) {
      throw new PdfToolError('INVALID_RANGE', `page ${spec.page + 1} out of range`, spec.src);
    }
    const list = wanted.get(spec.src) ?? [];
    list.push(spec.page);
    wanted.set(spec.src, list);
  }

  const copies = new Map<number, PDFPage[]>();
  for (const [src, indices] of wanted) {
    copies.set(src, await out.copyPages(docs[src]!, indices));
  }

  const cursor = new Map<number, number>();
  for (const spec of specs) {
    if (!isSourcePage(spec)) {
      out.addPage([spec.width, spec.height]);
      continue;
    }
    const k = cursor.get(spec.src) ?? 0;
    cursor.set(spec.src, k + 1);
    const page = copies.get(spec.src)![k];
    rotatePage(page, spec.rotate ?? 0);
    out.addPage(page);
  }
  return out;
}

async function loadReferencedSources(sources: PdfSource[], specs: PageSpec[]) {
  const needed = new Set(specs.filter(isSourcePage).map((spec) => spec.src));
  const docs: Array<PDFDocument | undefined> = [];
  for (let i = 0; i < sources.length; i++) {
    if (needed.has(i)) docs[i] = await loadPdf(sources[i], i);
  }
  return docs;
}

/**
 * 여러 PDF 의 페이지를 원하는 순서/회전으로 조합해 새 PDF 를 만듭니다.
 * 합치기, 페이지 편집(정리), 페이지 추출이 모두 이 함수를 사용합니다.
 */
export async function assemble(
  sources: PdfSource[],
  specs: PageSpec[],
  options: CommonOptions = {},
): Promise<Uint8Array> {
  const docs = await loadReferencedSources(sources, specs);
  const out = await buildDocument(docs, specs, options);
  return savePdf(out, { useObjectStreams: true });
}

/** 여러 PDF 를 순서대로 이어 붙입니다. */
export async function merge(sources: PdfSource[], options: CommonOptions = {}): Promise<Uint8Array> {
  const docs: PDFDocument[] = [];
  for (let i = 0; i < sources.length; i++) docs.push(await loadPdf(sources[i], i));
  const specs: PageSpec[] = docs.flatMap((doc, src) =>
    Array.from({ length: doc.getPageCount() }, (_, page) => ({ src, page })),
  );
  const out = await buildDocument(docs, specs, options);
  return savePdf(out, { useObjectStreams: true });
}

/** 하나의 PDF 를 페이지 그룹별로 여러 PDF 로 나눕니다. */
export async function split(
  source: PdfSource,
  groups: number[][],
  options: CommonOptions = {},
): Promise<Uint8Array[]> {
  if (groups.length === 0) throw new PdfToolError('NO_PAGES', 'no groups');
  const doc = await loadPdf(source, 0);
  const results: Uint8Array[] = [];
  for (const group of groups) {
    const out = await buildDocument([doc], group.map((page) => ({ src: 0, page })), options);
    results.push(await savePdf(out, { useObjectStreams: true }));
  }
  return results;
}

/** 선택한 페이지를 삭제합니다 (남은 페이지로 새 문서를 만들어 삭제된 페이지의 데이터까지 제거). */
export async function deletePages(
  source: PdfSource,
  pagesToDelete: number[],
  options: CommonOptions = {},
): Promise<Uint8Array> {
  const doc = await loadPdf(source, 0);
  const count = doc.getPageCount();
  for (const index of pagesToDelete) {
    if (!Number.isInteger(index) || index < 0 || index >= count) {
      throw new PdfToolError('INVALID_RANGE', `page ${index + 1} out of range`);
    }
  }
  const remove = new Set(pagesToDelete);
  const keep = Array.from({ length: count }, (_, i) => i).filter((i) => !remove.has(i));
  if (keep.length === 0) throw new PdfToolError('NO_PAGES', 'cannot delete every page');
  const out = await buildDocument([doc], keep.map((page) => ({ src: 0, page })), options);
  return savePdf(out, { useObjectStreams: true });
}

/** 선택한 페이지만 새 PDF 로 추출합니다. */
export async function extractPages(
  source: PdfSource,
  pages: number[],
  options: CommonOptions = {},
): Promise<Uint8Array> {
  return assemble([source], pages.map((page) => ({ src: 0, page })), options);
}

/**
 * 페이지를 회전합니다. 원본 문서를 그대로 수정하므로 북마크, 링크, 양식 등이 유지됩니다.
 * @param rotations 페이지 인덱스별 추가 회전 각도(시계 방향, 90의 배수)
 */
export async function rotatePages(
  source: PdfSource,
  rotations: Array<{ page: number; rotate: number }>,
): Promise<Uint8Array> {
  const doc = await loadPdf(source, 0);
  const pages = doc.getPages();
  for (const { page, rotate } of rotations) {
    if (!pages[page]) throw new PdfToolError('INVALID_RANGE', `page ${page + 1} out of range`);
    rotatePage(pages[page], rotate);
  }
  return savePdf(doc);
}

// ────────────────────────────── 페이지 번호 ──────────────────────────────

export interface PageNumberOptions {
  position: NumberPosition;
  format: NumberFormat;
  /** 첫 번호 (기본 1) */
  startAt?: number;
  /** 글자 크기 (pt) */
  fontSize?: number;
  /** 페이지 가장자리로부터의 여백 (pt) */
  margin?: number;
  /** 번호를 넣을 페이지 (0부터). 생략하면 전체. 번호는 이 목록 안에서 순서대로 매겨집니다. */
  pages?: number[];
  /** 0~1 범위 RGB */
  color?: [number, number, number];
}

export async function addPageNumbers(source: PdfSource, options: PageNumberOptions): Promise<Uint8Array> {
  const doc = await loadPdf(source, 0);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const targets = options.pages ?? pages.map((_, i) => i);
  if (targets.length === 0) throw new PdfToolError('NO_PAGES', 'no pages selected');
  const startAt = options.startAt ?? 1;
  const total = startAt + targets.length - 1;
  const size = options.fontSize ?? 12;
  const margin = options.margin ?? 28;
  const [r, g, b] = options.color ?? [0, 0, 0];
  const [vertical, horizontal] = options.position.split('-') as ['top' | 'bottom', 'left' | 'center' | 'right'];
  const capHeight = font.heightAtSize(size, { descender: false });

  targets.forEach((index, k) => {
    const page = pages[index];
    if (!page) throw new PdfToolError('INVALID_RANGE', `page ${index + 1} out of range`);
    const frame = getPageFrame(page);
    const text = formatPageNumber(options.format, startAt + k, total);
    const width = font.widthOfTextAtSize(text, size);
    const dx =
      horizontal === 'left'
        ? margin
        : horizontal === 'right'
          ? frame.displayWidth - margin - width
          : (frame.displayWidth - width) / 2;
    const dy = vertical === 'bottom' ? margin : frame.displayHeight - margin - capHeight;
    const point = displayToPage(frame, dx, dy);
    page.drawText(text, {
      x: point.x,
      y: point.y,
      size,
      font,
      color: rgb(r, g, b),
      rotate: degrees(frame.rotation),
    });
  });

  return savePdf(doc);
}

// ────────────────────────────── 워터마크 ──────────────────────────────

export interface WatermarkOptions {
  /**
   * 워터마크 이미지. 텍스트 워터마크도 브라우저에서 PNG 로 렌더링해서 전달하므로
   * 한글·일본어 등 모든 글꼴/언어를 폰트 임베드 없이 지원합니다.
   */
  image: { bytes: Uint8Array; type: 'png' | 'jpeg' };
  /** 페이지 너비 대비 워터마크 너비 비율 (0.05 ~ 1) */
  scale: number;
  /** 불투명도 0 ~ 1 */
  opacity: number;
  /** 반시계 방향 회전 각도 (화면에 보이는 페이지 기준) */
  rotation: number;
  layout: 'center' | 'tile';
  /** 적용할 페이지 (생략 시 전체) */
  pages?: number[];
}

export async function addWatermark(source: PdfSource, options: WatermarkOptions): Promise<Uint8Array> {
  const doc = await loadPdf(source, 0);
  const pages = doc.getPages();
  const targets = options.pages ?? pages.map((_, i) => i);
  if (targets.length === 0) throw new PdfToolError('NO_PAGES', 'no pages selected');
  const scale = Math.min(1, Math.max(0.05, options.scale));
  const opacity = Math.min(1, Math.max(0, options.opacity));

  let image: PDFImage;
  try {
    image =
      options.image.type === 'png' ? await doc.embedPng(options.image.bytes) : await doc.embedJpg(options.image.bytes);
  } catch (error) {
    throw new PdfToolError('UNSUPPORTED_IMAGE', error instanceof Error ? error.message : String(error));
  }

  for (const index of targets) {
    const page = pages[index];
    if (!page) throw new PdfToolError('INVALID_RANGE', `page ${index + 1} out of range`);
    const frame = getPageFrame(page);
    // 페이지 크기가 달라도 같은 비율로 보이도록 페이지 너비를 기준으로 크기를 정합니다.
    const width = frame.displayWidth * scale;
    const height = (image.height / image.width) * width;
    const angle = options.rotation + frame.rotation;
    const centers = watermarkCenters(frame.displayWidth, frame.displayHeight, width, height, options.rotation, options.layout);
    for (const [cx, cy] of centers) {
      const center = displayToPage(frame, cx, cy);
      const origin = rotatedOrigin(center.x, center.y, width, height, angle);
      page.drawImage(image, { x: origin.x, y: origin.y, width, height, rotate: degrees(angle), opacity });
    }
  }
  return savePdf(doc);
}

// ────────────────────────────── 이미지 → PDF ──────────────────────────────

export interface ImageInput {
  bytes: Uint8Array;
  type: 'jpeg' | 'png';
  /** 사용자가 지정한 추가 회전 (시계 방향, 90의 배수). 페이지 /Rotate 로 적용되어 화질 손실이 없습니다. */
  rotation?: number;
}

export interface ImagesToPdfOptions {
  pageSize: PageSizeName;
  orientation: 'auto' | 'portrait' | 'landscape';
  /** 여백 (pt) */
  margin: number;
}

/** CSS 픽셀(1/96 inch) → PDF 포인트(1/72 inch) */
const PX_TO_PT = 0.75;

export async function imagesToPdf(
  images: ImageInput[],
  options: ImagesToPdfOptions,
  common: CommonOptions = {},
): Promise<Uint8Array> {
  if (images.length === 0) throw new PdfToolError('NO_PAGES', 'no images');
  const doc = await PDFDocument.create();
  setProducer(doc, common.producer);
  const margin = Math.max(0, options.margin);

  for (let i = 0; i < images.length; i++) {
    const input = images[i];
    let image: PDFImage;
    let orientation = 1;
    try {
      if (input.type === 'jpeg') {
        image = await doc.embedJpg(input.bytes);
        orientation = readJpegInfo(input.bytes)?.orientation ?? 1;
      } else {
        image = await doc.embedPng(input.bytes);
      }
    } catch (error) {
      throw new PdfToolError('UNSUPPORTED_IMAGE', error instanceof Error ? error.message : String(error), i);
    }
    // EXIF 방향 중 회전만 있는 경우(3, 6, 8)는 그리기 변환으로 처리합니다. 뒤집힘이 있는 경우는 UI 에서 미리 정규화합니다.
    if (![1, 3, 6, 8].includes(orientation)) orientation = 1;
    const swapped = orientation === 6 || orientation === 8;
    const displayW = swapped ? image.height : image.width;
    const displayH = swapped ? image.width : image.height;

    let pageW: number;
    let pageH: number;
    let scale: number;
    if (options.pageSize === 'fit') {
      scale = PX_TO_PT;
      pageW = displayW * scale + margin * 2;
      pageH = displayH * scale + margin * 2;
    } else {
      [pageW, pageH] = PAGE_SIZES[options.pageSize];
      const landscape =
        options.orientation === 'landscape' || (options.orientation === 'auto' && displayW > displayH);
      if (landscape) [pageW, pageH] = [pageH, pageW];
      const availW = Math.max(1, pageW - margin * 2);
      const availH = Math.max(1, pageH - margin * 2);
      scale = Math.min(availW / displayW, availH / displayH);
    }

    const w = displayW * scale;
    const h = displayH * scale;
    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;
    const page = doc.addPage([pageW, pageH]);
    switch (orientation) {
      case 3:
        page.drawImage(image, { x: x + w, y: y + h, width: w, height: h, rotate: degrees(180) });
        break;
      case 6:
        page.drawImage(image, { x, y: y + h, width: h, height: w, rotate: degrees(-90) });
        break;
      case 8:
        page.drawImage(image, { x: x + w, y, width: h, height: w, rotate: degrees(90) });
        break;
      default:
        page.drawImage(image, { x, y, width: w, height: h });
    }
    if (input.rotation) page.setRotation(degrees(normalizeRotation(input.rotation)));
  }
  return savePdf(doc, { useObjectStreams: true });
}

/**
 * 페이지별로 렌더링된 JPEG 을 원래 페이지 크기 그대로 채워 새 PDF 를 만듭니다.
 * ('최대 압축' 모드: 페이지 전체를 이미지로 변환)
 */
export async function pagesFromImages(
  pages: Array<{ jpeg: Uint8Array; width: number; height: number }>,
  common: CommonOptions = {},
): Promise<Uint8Array> {
  if (pages.length === 0) throw new PdfToolError('NO_PAGES', 'no pages');
  const doc = await PDFDocument.create();
  setProducer(doc, common.producer);
  for (const { jpeg, width, height } of pages) {
    const image = await doc.embedJpg(jpeg);
    doc.addPage([width, height]).drawImage(image, { x: 0, y: 0, width, height });
  }
  return savePdf(doc, { useObjectStreams: true });
}

// ────────────────────────────── 보안 ──────────────────────────────

export interface ProtectOptions {
  /** 문서를 열 때 필요한 암호 */
  userPassword: string;
  /** 권한 변경용 소유자 암호. 생략 시 무작위로 생성 */
  ownerPassword?: string;
  permissions?: {
    printing?: boolean;
    copying?: boolean;
    modifying?: boolean;
    annotating?: boolean;
  };
}

function randomPassword(): string {
  const bytes = new Uint8Array(24);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** AES-256 으로 암호화합니다. */
export async function protectPdf(source: PdfSource, options: ProtectOptions): Promise<Uint8Array> {
  if (!options.userPassword) throw new PdfToolError('UNKNOWN', 'password required');
  const doc = await loadPdf(source, 0);
  const allow = { printing: true, copying: true, modifying: true, annotating: true, ...options.permissions };
  const encrypt = () =>
    doc.encrypt({
      userPassword: options.userPassword,
      ownerPassword: options.ownerPassword || randomPassword(),
      permissions: {
        printing: allow.printing ? 'highResolution' : false,
        copying: allow.copying,
        contentAccessibility: true,
        modifying: allow.modifying,
        documentAssembly: allow.modifying,
        annotating: allow.annotating,
        fillingForms: allow.annotating,
      },
    });
  try {
    encrypt();
  } catch (error) {
    // PDF/A 규격은 암호화를 금지하므로, 스캐너·오피스가 만든 PDF/A 문서는 PDF/A 선언(XMP)을 지우고 암호화합니다.
    if (!(error instanceof Error) || !/PDF\/A/.test(error.message)) throw error;
    doc.catalog.delete(PDFName.of('Metadata'));
    encrypt();
  }
  return savePdf(doc);
}

/** 암호(또는 권한 제한)를 제거한 사본을 만듭니다. */
export async function unlockPdf(
  source: PdfSource,
): Promise<{ bytes: Uint8Array; wasEncrypted: boolean }> {
  const { doc, wasEncrypted } = await openPdf(source, 0);
  if (!wasEncrypted) removeUnreachableObjects(doc);
  return { bytes: await savePdf(doc), wasEncrypted };
}
