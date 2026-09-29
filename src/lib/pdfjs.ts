// pdf.js(렌더링 라이브러리)를 필요할 때만 불러오고, 페이지를 캔버스/이미지로 렌더링합니다.
import type { PDFDocumentProxy } from 'pdfjs-dist';

type PdfjsModule = typeof import('pdfjs-dist/legacy/build/pdf.mjs');

let pdfjsPromise: Promise<PdfjsModule> | null = null;

/**
 * 첫 PDF 를 열 때 한 번만 pdf.js 와 워커를 내려받습니다 (초기 페이지 로딩을 가볍게 유지).
 * 기본 빌드는 최신 브라우저 전용 문법을 쓰므로, 구형 크롬·사파리·삼성 인터넷에서도 동작하도록
 * 폴리필이 포함된 legacy 빌드를 사용합니다.
 */
export function loadPdfjs(): Promise<PdfjsModule> {
  pdfjsPromise ??= Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]).then(([pdfjs, worker]) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return pdfjs;
  });
  return pdfjsPromise;
}

/** pdf.js 리소스(CMap, 폰트, wasm) 위치. 워커가 내려받으므로 절대 주소로 넘깁니다. */
const assetBase = () => new URL(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}pdfjs/`, document.baseURI).href;

/** 리소스 요청 종류별 기준 주소 (pdf.js 가 BinaryDataFactory 생성자에 넘겨 줌) */
export interface PdfjsAssetUrls {
  cMapUrl?: string | null;
  standardFontDataUrl?: string | null;
  wasmUrl?: string | null;
}

export interface PdfjsOverrides {
  /** CMap·표준 폰트·wasm 을 직접 가져오는 클래스. 지정하면 워커 대신 이 페이지에서 내려받습니다. */
  BinaryDataFactory?: new (urls: PdfjsAssetUrls) => {
    fetch(request: { kind: keyof PdfjsAssetUrls; filename: string }): Promise<Uint8Array>;
  };
  /** false 면 CMYK 색상 프로필(.icc)을 내려받지 않고 pdf.js 의 기본 CMYK 변환을 씁니다. */
  useIccProfile?: boolean;
}

let overrides: PdfjsOverrides = {};

/** 리소스를 기본 형식으로 제공할 수 없는 곳(체험판 등)에서 pdf.js 옵션을 바꿉니다. */
export function configurePdfjs(options: PdfjsOverrides) {
  overrides = options;
}

export class PasswordNeededError extends Error {
  readonly incorrect: boolean;
  constructor(incorrect: boolean) {
    super(incorrect ? 'incorrect password' : 'password required');
    this.name = 'PasswordNeededError';
    this.incorrect = incorrect;
  }
}

export class InvalidPdfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPdfError';
  }
}

export async function openPdfDocument(data: Blob | Uint8Array, password?: string): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfjs();
  // pdf.js 는 전달받은 버퍼를 워커로 넘겨(transfer) 원본을 비우므로 항상 새 버퍼를 넘깁니다.
  const bytes = data instanceof Blob ? new Uint8Array(await data.arrayBuffer()) : data.slice();
  const base = assetBase();
  const task = pdfjs.getDocument({
    data: bytes,
    password,
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    iccUrl: overrides.useIccProfile === false ? undefined : `${base}iccs/`,
    BinaryDataFactory: overrides.BinaryDataFactory,
    enableXfa: false,
  });
  try {
    return await task.promise;
  } catch (error) {
    const name = (error as { name?: string } | null)?.name;
    if (name === 'PasswordException') {
      const code = (error as { code?: number }).code;
      throw new PasswordNeededError(code === pdfjs.PasswordResponses.INCORRECT_PASSWORD);
    }
    console.warn('[pdf.js]', error);
    throw new InvalidPdfError(error instanceof Error ? error.message : String(error));
  }
}

export interface RenderOptions {
  /** 이 크기 안에 맞도록 축소/확대 (CSS 픽셀) */
  maxWidth?: number;
  maxHeight?: number;
  /** 직접 배율 지정 (1 = 72dpi) */
  scale?: number;
  /** 페이지 자체 회전에 더할 회전 각도 */
  extraRotation?: number;
  /** 결과 캔버스의 최대 픽셀 수 (모바일 사파리 캔버스 제한 대비) */
  maxPixels?: number;
  background?: string;
}

/** iOS Safari 의 캔버스 최대 면적(약 16.7MP)보다 약간 작게 */
const DEFAULT_MAX_PIXELS = 16_000_000;

export async function renderPage(
  doc: PDFDocumentProxy,
  pageNumber: number,
  options: RenderOptions = {},
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  try {
    const rotation = (((page.rotate + (options.extraRotation ?? 0)) % 360) + 360) % 360;
    const base = page.getViewport({ scale: 1, rotation });
    let scale = options.scale ?? 1;
    if (options.maxWidth || options.maxHeight) {
      scale = Math.min(
        options.maxWidth ? options.maxWidth / base.width : Infinity,
        options.maxHeight ? options.maxHeight / base.height : Infinity,
      );
    }
    const maxPixels = options.maxPixels ?? DEFAULT_MAX_PIXELS;
    if (base.width * base.height * scale * scale > maxPixels) {
      scale = Math.sqrt(maxPixels / (base.width * base.height));
    }
    const viewport = page.getViewport({ scale, rotation });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    await page.render({ canvas, viewport, background: options.background ?? 'rgb(255,255,255)' }).promise;
    return canvas;
  } finally {
    page.cleanup();
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob failed'))), type, quality);
  });
}

/** 캔버스 메모리를 즉시 해제 (모바일에서 연속 렌더링 시 중요) */
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

/** 페이지 크기(pt, 회전 적용 후) 목록 */
export async function getPageSizes(doc: PDFDocumentProxy): Promise<Array<{ width: number; height: number }>> {
  const sizes: Array<{ width: number; height: number }> = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    sizes.push({ width: viewport.width, height: viewport.height });
    page.cleanup();
  }
  return sizes;
}

// ───────────── 썸네일 렌더링 큐 (동시에 너무 많은 페이지를 그리지 않도록) ─────────────

type Job = () => Promise<void>;
const queue: Job[] = [];
let active = 0;
const CONCURRENCY = 2;

function pump() {
  while (active < CONCURRENCY && queue.length > 0) {
    const job = queue.shift()!;
    active++;
    job().finally(() => {
      active--;
      pump();
    });
  }
}

const thumbnailCache = new Map<string, Promise<string>>();

/**
 * 페이지 썸네일(JPEG object URL)을 만듭니다. 같은 키는 한 번만 렌더링합니다.
 * @param key 문서 식별자 + 페이지 번호 등 고유 키
 */
export function getThumbnail(key: string, doc: PDFDocumentProxy, pageNumber: number, size = 220): Promise<string> {
  const cached = thumbnailCache.get(key);
  if (cached) return cached;
  const promise = new Promise<string>((resolve, reject) => {
    queue.push(async () => {
      try {
        const ratio = Math.min(2, window.devicePixelRatio || 1);
        const canvas = await renderPage(doc, pageNumber, { maxWidth: size * ratio, maxHeight: size * ratio });
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.82);
        releaseCanvas(canvas);
        resolve(URL.createObjectURL(blob));
      } catch (error) {
        thumbnailCache.delete(key);
        reject(error);
      }
    });
    pump();
  });
  thumbnailCache.set(key, promise);
  return promise;
}

/** 문서를 닫을 때 해당 문서의 썸네일 URL 을 해제합니다. */
export function releaseThumbnails(prefix: string) {
  for (const [key, promise] of thumbnailCache) {
    if (!key.startsWith(prefix)) continue;
    thumbnailCache.delete(key);
    promise.then((url) => URL.revokeObjectURL(url)).catch(() => undefined);
  }
}
