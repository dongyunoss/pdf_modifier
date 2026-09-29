// JPEG 바이트를 직접 파싱하는 작은 유틸리티 (디코딩 없이 크기/EXIF 방향만 읽음)

export interface JpegInfo {
  width: number;
  height: number;
  components: number;
  /** EXIF Orientation (1~8). 없으면 1 */
  orientation: number;
}

const isSofMarker = (marker: number) =>
  marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

const hasNoLength = (marker: number) =>
  marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);

interface Segment {
  marker: number;
  /** 마커(FF xx) 시작 위치 */
  start: number;
  /** 세그먼트 끝(다음 마커 시작) 위치 */
  end: number;
  /** 길이 필드 이후 데이터 시작 위치 */
  dataStart: number;
}

/** SOS(스캔 데이터) 직전까지의 세그먼트를 순회합니다. */
function* segments(bytes: Uint8Array): Generator<Segment> {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return;
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return;
    let markerPos = offset;
    while (markerPos < bytes.length && bytes[markerPos] === 0xff) markerPos++;
    const marker = bytes[markerPos];
    const start = markerPos - 1;
    if (hasNoLength(marker)) {
      offset = markerPos + 1;
      continue;
    }
    const length = (bytes[markerPos + 1] << 8) | bytes[markerPos + 2];
    const end = markerPos + 1 + length;
    if (length < 2 || end > bytes.length) return;
    yield { marker, start, end, dataStart: markerPos + 3 };
    if (marker === 0xda) return; // Start of Scan
    offset = end;
  }
}

function readExifOrientation(bytes: Uint8Array, start: number, end: number): number {
  // "Exif\0\0"
  if (end - start < 14) return 1;
  if (
    bytes[start] !== 0x45 ||
    bytes[start + 1] !== 0x78 ||
    bytes[start + 2] !== 0x69 ||
    bytes[start + 3] !== 0x66 ||
    bytes[start + 4] !== 0 ||
    bytes[start + 5] !== 0
  ) {
    return 1;
  }
  const tiff = start + 6;
  const little = bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49;
  const big = bytes[tiff] === 0x4d && bytes[tiff + 1] === 0x4d;
  if (!little && !big) return 1;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u16 = (pos: number) => view.getUint16(pos, little);
  const u32 = (pos: number) => view.getUint32(pos, little);
  if (tiff + 8 > end || u16(tiff + 2) !== 0x2a) return 1;
  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > end) return 1;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > end) break;
    if (u16(entry) === 0x0112) {
      const value = u16(entry + 8);
      return value >= 1 && value <= 8 ? value : 1;
    }
  }
  return 1;
}

export function readJpegInfo(bytes: Uint8Array): JpegInfo | null {
  let orientation = 1;
  for (const segment of segments(bytes)) {
    if (segment.marker === 0xe1) {
      const value = readExifOrientation(bytes, segment.dataStart, segment.end);
      if (value !== 1) orientation = value;
    } else if (isSofMarker(segment.marker)) {
      const p = segment.dataStart;
      if (p + 6 > segment.end) return null;
      const height = (bytes[p + 1] << 8) | bytes[p + 2];
      const width = (bytes[p + 3] << 8) | bytes[p + 4];
      const components = bytes[p + 5];
      return { width, height, components, orientation };
    }
  }
  return null;
}

/**
 * APP1(EXIF/XMP) 세그먼트를 제거합니다. PDF 뷰어는 EXIF 방향을 무시하므로,
 * 브라우저로 다시 디코딩할 때 자동 회전되지 않도록 하기 위해 사용합니다.
 */
export function stripJpegExif(bytes: Uint8Array): Uint8Array {
  const removals: Array<[number, number]> = [];
  for (const segment of segments(bytes)) {
    if (segment.marker === 0xe1) removals.push([segment.start, segment.end]);
  }
  if (removals.length === 0) return bytes;
  const removed = removals.reduce((sum, [s, e]) => sum + (e - s), 0);
  const out = new Uint8Array(bytes.length - removed);
  let read = 0;
  let write = 0;
  for (const [s, e] of removals) {
    out.set(bytes.subarray(read, s), write);
    write += s - read;
    read = e;
  }
  out.set(bytes.subarray(read), write);
  return out;
}
