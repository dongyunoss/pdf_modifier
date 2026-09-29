// PDF 압축: 문서 안의 사진(이미지)을 적정 해상도/화질의 JPEG 로 다시 인코딩합니다.
// 텍스트와 벡터 그래픽은 건드리지 않으므로 글자 선택/검색이 그대로 유지됩니다.
import { unzlibSync } from 'fflate';
import {
  PDFArray,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  PDFStream,
  type PDFDocument,
} from '@cantoo/pdf-lib';
import type { CompressOptions } from './constants';
import { undoPngPredictor } from './png-predictor';
import { loadPdf, type PdfSource, removeUnreachableObjects, savePdf } from './load';

export type RecodeInput =
  | { kind: 'jpeg'; bytes: Uint8Array; width: number; height: number }
  | { kind: 'raw'; pixels: Uint8Array; width: number; height: number; components: 1 | 3 };

export interface RecodeTarget {
  width: number;
  height: number;
  /** JPEG 품질 0~1 */
  quality: number;
}

export interface RecodedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
  components: 1 | 3;
}

/**
 * 이미지 디코딩/인코딩은 환경마다 다르므로 주입받습니다.
 * 브라우저 워커에서는 OffscreenCanvas 구현을, 테스트에서는 가짜 구현을 사용합니다.
 */
export interface ImageRecoder {
  recode(input: RecodeInput, target: RecodeTarget): Promise<RecodedImage | null>;
}

export interface CompressStats {
  images: number;
  recompressed: number;
  originalSize: number;
  compressedSize: number;
}

const NAME = {
  Subtype: PDFName.of('Subtype'),
  Image: PDFName.of('Image'),
  Filter: PDFName.of('Filter'),
  DecodeParms: PDFName.of('DecodeParms'),
  Width: PDFName.of('Width'),
  Height: PDFName.of('Height'),
  BitsPerComponent: PDFName.of('BitsPerComponent'),
  ColorSpace: PDFName.of('ColorSpace'),
  ImageMask: PDFName.of('ImageMask'),
  SMask: PDFName.of('SMask'),
  Mask: PDFName.of('Mask'),
  Decode: PDFName.of('Decode'),
  Length: PDFName.of('Length'),
  DCTDecode: PDFName.of('DCTDecode'),
  FlateDecode: PDFName.of('FlateDecode'),
  DeviceRGB: PDFName.of('DeviceRGB'),
  DeviceGray: PDFName.of('DeviceGray'),
  ICCBased: PDFName.of('ICCBased'),
  CalRGB: PDFName.of('CalRGB'),
  CalGray: PDFName.of('CalGray'),
  N: PDFName.of('N'),
  Predictor: PDFName.of('Predictor'),
  Colors: PDFName.of('Colors'),
  Columns: PDFName.of('Columns'),
  PieceInfo: PDFName.of('PieceInfo'),
  Thumb: PDFName.of('Thumb'),
} as const;

const MIN_PIXELS = 96 * 96;
const MIN_BYTES = 16 * 1024;

function numberOf(dict: PDFDict, key: PDFName): number | undefined {
  const value = dict.lookup(key);
  return value instanceof PDFNumber ? value.asNumber() : undefined;
}

function filtersOf(dict: PDFDict): PDFName[] | null {
  const filter = dict.lookup(NAME.Filter);
  if (!filter) return [];
  if (filter instanceof PDFName) return [filter];
  if (filter instanceof PDFArray) {
    const names: PDFName[] = [];
    for (let i = 0; i < filter.size(); i++) {
      const item = filter.lookup(i);
      if (!(item instanceof PDFName)) return null;
      names.push(item);
    }
    return names;
  }
  return null;
}

/** 지원하는 색 공간이면 채널 수(1 또는 3), 아니면 null */
function componentsOf(dict: PDFDict): 1 | 3 | null {
  const cs = dict.lookup(NAME.ColorSpace);
  if (cs === NAME.DeviceRGB) return 3;
  if (cs === NAME.DeviceGray) return 1;
  if (cs instanceof PDFArray && cs.size() >= 1) {
    const kind = cs.lookup(0);
    if (kind === NAME.CalRGB) return 3;
    if (kind === NAME.CalGray) return 1;
    if (kind === NAME.ICCBased) {
      const profile = cs.lookup(1);
      const n = profile instanceof PDFStream ? numberOf(profile.dict, NAME.N) : undefined;
      if (n === 3) return 3;
      if (n === 1) return 1;
    }
  }
  return null;
}

function decodeParmsOf(dict: PDFDict): PDFDict | undefined {
  const parms = dict.lookup(NAME.DecodeParms);
  if (parms instanceof PDFDict) return parms;
  if (parms instanceof PDFArray && parms.size() === 1) {
    const first = parms.lookup(0);
    if (first instanceof PDFDict) return first;
  }
  return undefined;
}

/** FlateDecode 이미지의 픽셀을 복원합니다. 지원하지 않는 형식이면 null */
function inflatePixels(stream: PDFRawStream, width: number, height: number, components: 1 | 3): Uint8Array | null {
  let data: Uint8Array;
  try {
    data = unzlibSync(stream.getContents());
  } catch {
    return null;
  }
  const parms = decodeParmsOf(stream.dict);
  const predictor = parms ? (numberOf(parms, NAME.Predictor) ?? 1) : 1;
  if (predictor >= 10) {
    const colors = numberOf(parms!, NAME.Colors) ?? 1;
    const bpc = numberOf(parms!, NAME.BitsPerComponent) ?? 8;
    const columns = numberOf(parms!, NAME.Columns) ?? 1;
    if (colors !== components || bpc !== 8 || columns !== width) return null;
    const restored = undoPngPredictor(data, colors, bpc, columns);
    if (!restored) return null;
    data = restored;
  } else if (predictor !== 1) {
    return null; // TIFF 예측자 등은 지원하지 않음
  }
  const expected = width * height * components;
  if (data.length < expected) return null;
  return data.length === expected ? data : data.subarray(0, expected);
}

function collectMaskRefs(doc: PDFDocument): Set<PDFRef> {
  const masks = new Set<PDFRef>();
  for (const [, object] of doc.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFStream)) continue;
    for (const key of [NAME.SMask, NAME.Mask]) {
      const value = object.dict.get(key);
      if (value instanceof PDFRef) masks.add(value);
    }
  }
  return masks;
}

export type ProgressCallback = (done: number, total: number) => void;

/** 문서 안의 이미지를 다시 인코딩합니다. 교체된 이미지 수를 반환합니다. */
export async function recompressImages(
  doc: PDFDocument,
  options: CompressOptions,
  recoder: ImageRecoder,
  onProgress?: ProgressCallback,
): Promise<{ images: number; recompressed: number }> {
  const masks = collectMaskRefs(doc);
  const candidates: Array<[PDFRef, PDFRawStream]> = [];
  for (const [ref, object] of doc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFRawStream && object.dict.get(NAME.Subtype) === NAME.Image && !masks.has(ref)) {
      candidates.push([ref, object]);
    }
  }

  let recompressed = 0;
  for (let i = 0; i < candidates.length; i++) {
    onProgress?.(i, candidates.length);
    const [ref, stream] = candidates[i];
    const replacement = await recodeImage(stream, options, recoder).catch(() => null);
    if (replacement) {
      doc.context.assign(ref, replacement);
      recompressed++;
    }
  }
  onProgress?.(candidates.length, candidates.length);
  return { images: candidates.length, recompressed };
}

async function recodeImage(
  stream: PDFRawStream,
  options: CompressOptions,
  recoder: ImageRecoder,
): Promise<PDFRawStream | null> {
  const dict = stream.dict;
  if (dict.lookup(NAME.ImageMask)?.toString() === 'true') return null;
  if (dict.has(NAME.Decode)) return null;
  const width = numberOf(dict, NAME.Width);
  const height = numberOf(dict, NAME.Height);
  const bpc = numberOf(dict, NAME.BitsPerComponent);
  if (!width || !height || bpc !== 8) return null;
  const originalLength = stream.getContentsSize();
  if (width * height < MIN_PIXELS || originalLength < MIN_BYTES) return null;
  const components = componentsOf(dict);
  if (!components) return null;
  const filters = filtersOf(dict);
  if (!filters || filters.length !== 1) return null;

  let input: RecodeInput;
  if (filters[0] === NAME.DCTDecode) {
    input = { kind: 'jpeg', bytes: stream.getContents(), width, height };
  } else if (filters[0] === NAME.FlateDecode) {
    const pixels = inflatePixels(stream, width, height, components);
    if (!pixels) return null;
    input = { kind: 'raw', pixels, width, height, components };
  } else {
    return null;
  }

  // 마스크가 있는 이미지는 크기를 바꾸지 않고 화질만 조정합니다.
  const hasMask = dict.has(NAME.SMask) || dict.has(NAME.Mask);
  const ratio = hasMask ? 1 : Math.min(1, options.maxDimension / Math.max(width, height));
  const target: RecodeTarget = {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
    quality: options.quality,
  };

  const result = await recoder.recode(input, target);
  // 10% 이상 줄어들지 않으면 원본을 유지합니다.
  if (!result || result.bytes.length >= originalLength * 0.9) return null;

  const newDict = dict.clone(dict.context);
  newDict.set(NAME.Filter, NAME.DCTDecode);
  newDict.delete(NAME.DecodeParms);
  newDict.set(NAME.Width, PDFNumber.of(result.width));
  newDict.set(NAME.Height, PDFNumber.of(result.height));
  newDict.set(NAME.BitsPerComponent, PDFNumber.of(8));
  newDict.set(NAME.ColorSpace, result.components === 1 ? NAME.DeviceGray : NAME.DeviceRGB);
  newDict.set(NAME.Length, PDFNumber.of(result.bytes.length));
  return PDFRawStream.of(newDict, result.bytes);
}

/** 렌더링에 필요 없는 편집 프로그램 전용 데이터(일러스트레이터 PieceInfo 등)를 제거합니다. */
function removePrivateData(doc: PDFDocument): void {
  doc.catalog.delete(NAME.PieceInfo);
  for (const page of doc.getPages()) {
    page.node.delete(NAME.PieceInfo);
    page.node.delete(NAME.Thumb);
  }
}

export async function compressPdf(
  source: PdfSource,
  options: CompressOptions,
  recoder: ImageRecoder,
  onProgress?: ProgressCallback,
): Promise<{ bytes: Uint8Array; stats: CompressStats }> {
  const originalSize = source.bytes.byteLength;
  const doc = await loadPdf(source, 0);
  const { images, recompressed } = await recompressImages(doc, options, recoder, onProgress);
  removePrivateData(doc);
  removeUnreachableObjects(doc);
  const bytes = await savePdf(doc, { useObjectStreams: true });
  return { bytes, stats: { images, recompressed, originalSize, compressedSize: bytes.length } };
}
