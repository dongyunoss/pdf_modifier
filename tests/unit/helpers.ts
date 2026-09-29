import { unzlibSync, zlibSync } from 'fflate';
import { PDFArray, PDFDocument, PDFName, PDFStream, StandardFonts, degrees } from '@cantoo/pdf-lib';

/** 페이지마다 크기가 다르고 "Page N" 텍스트가 있는 테스트용 PDF */
export async function makePdf(
  pageCount: number,
  options: { label?: string; rotate?: number[]; width?: number } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pageCount; i++) {
    // 페이지 순서를 크기로 식별할 수 있도록 높이를 페이지마다 다르게 합니다.
    const page = doc.addPage([options.width ?? 300, 400 + i]);
    page.drawText(`${options.label ?? 'Page'} ${i + 1}`, { x: 40, y: 200, size: 20, font });
    const rotation = options.rotate?.[i];
    if (rotation) page.setRotation(degrees(rotation));
  }
  return doc.save();
}

export async function pageHeights(bytes: Uint8Array): Promise<number[]> {
  const doc = await PDFDocument.load(bytes);
  return doc.getPages().map((page) => Math.round(page.getMediaBox().height));
}

export async function pageRotations(bytes: Uint8Array): Promise<number[]> {
  const doc = await PDFDocument.load(bytes);
  return doc.getPages().map((page) => page.getRotation().angle);
}

/** 페이지의 모든 콘텐츠 스트림을 풀어서 하나의 문자열로 반환 */
export async function pageContent(bytes: Uint8Array, pageIndex: number, password?: string): Promise<string> {
  const doc = await PDFDocument.load(bytes, password === undefined ? {} : { password });
  const page = doc.getPage(pageIndex);
  const contents = page.node.Contents();
  const streams: PDFStream[] = [];
  if (contents instanceof PDFArray) {
    for (let i = 0; i < contents.size(); i++) {
      const item = contents.lookup(i);
      if (item instanceof PDFStream) streams.push(item);
    }
  } else if (contents instanceof PDFStream) {
    streams.push(contents);
  }
  return streams
    .map((stream) => {
      const raw = stream.getContents();
      const filter = stream.dict.get(PDFName.of('Filter'));
      const data = filter === PDFName.of('FlateDecode') ? unzlibSync(raw) : raw;
      return Buffer.from(data).toString('latin1');
    })
    .join('\n');
}

/** 텍스트를 WinAnsi hex 문자열로 (pdf-lib 가 표준 폰트 텍스트를 쓰는 형식) */
export const hexText = (text: string) =>
  Buffer.from(text, 'latin1').toString('hex').toUpperCase();

/**
 * 디코딩은 불가능하지만 헤더(SOF, EXIF)는 올바른 JPEG 바이트를 만듭니다.
 * pdf-lib 의 embedJpg 는 헤더만 읽으므로 테스트에 충분합니다.
 */
export function makeJpeg(width: number, height: number, options: { orientation?: number; padding?: number } = {}) {
  const parts: number[] = [0xff, 0xd8];
  if (options.orientation) {
    // APP1 Exif, big-endian TIFF, IFD0 with one entry (Orientation)
    const tiff = [
      0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, // header, IFD0 offset 8
      0x00, 0x01, // 1 entry
      0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, options.orientation, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // next IFD
    ];
    const payload = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff];
    const length = payload.length + 2;
    parts.push(0xff, 0xe1, length >> 8, length & 0xff, ...payload);
  }
  // SOF0: precision 8, height, width, 3 components
  parts.push(0xff, 0xc0, 0x00, 0x11, 0x08, height >> 8, height & 0xff, width >> 8, width & 0xff, 0x03);
  parts.push(0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01);
  // SOS (최소 형태) + 가짜 스캔 데이터 + EOI
  parts.push(0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00);
  const padding = options.padding ?? 16;
  for (let i = 0; i < padding; i++) parts.push((i * 37) & 0x7f);
  parts.push(0xff, 0xd9);
  return new Uint8Array(parts);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  const typeBytes = new TextEncoder().encode(type);
  out.set(typeBytes, 4);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** 노이즈가 섞인 RGB(A) PNG 를 만듭니다 (압축이 잘 되지 않아 용량이 큼). */
export function makePng(width: number, height: number, alpha = false): Uint8Array {
  const channels = alpha ? 4 : 3;
  const raw = new Uint8Array(height * (width * channels + 1));
  let seed = 12345;
  for (let y = 0; y < height; y++) {
    const row = y * (width * channels + 1);
    raw[row] = 0;
    for (let x = 0; x < width * channels; x++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      raw[row + 1 + x] = alpha && x % 4 === 3 ? 200 : (seed >> 16) & 0xff;
    }
  }
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = alpha ? 6 : 2;
  const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const parts = [signature, chunk('IHDR', ihdr), chunk('IDAT', zlibSync(raw)), chunk('IEND', new Uint8Array())];
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
