// 이미지 → PDF 변환과 워터마크를 위한 브라우저 이미지 처리
import { readJpegInfo } from './pdf/jpeg';
import { canvasToBlob } from './pdfjs';

export type EmbeddableType = 'jpeg' | 'png';

export interface PreparedImage {
  data: Blob;
  type: EmbeddableType;
}

export class UnsupportedImageError extends Error {
  constructor(name: string) {
    super(`unsupported image: ${name}`);
    this.name = 'UnsupportedImageError';
  }
}

async function sniff(file: Blob): Promise<'jpeg' | 'png' | 'other'> {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpeg';
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'png';
  return 'other';
}

async function decode(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      // 기본 옵션은 EXIF 방향을 적용합니다 (from-image).
      return await createImageBitmap(file);
    } catch {
      // SVG 등 createImageBitmap 이 지원하지 않는 형식은 <img> 로 시도
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** 브라우저가 디코딩할 수 있는 이미지를 캔버스를 거쳐 JPEG/PNG 로 바꿉니다. */
async function reencode(file: Blob, as: EmbeddableType, name: string): Promise<PreparedImage> {
  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    throw new UnsupportedImageError(name);
  }
  const width = 'naturalWidth' in source ? source.naturalWidth : source.width;
  const height = 'naturalHeight' in source ? source.naturalHeight : source.height;
  if (!width || !height) throw new UnsupportedImageError(name);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  if (as === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(source, 0, 0);
  if ('close' in source) source.close();
  const blob = await canvasToBlob(canvas, as === 'jpeg' ? 'image/jpeg' : 'image/png', 0.92);
  canvas.width = canvas.height = 0;
  return { data: blob, type: as };
}

/**
 * PDF 에 넣을 수 있는 형식으로 이미지를 준비합니다.
 * - JPEG/PNG 는 화질 손실 없이 그대로 사용
 * - 뒤집힌 EXIF 방향(2,4,5,7)이 있는 JPEG, WebP/GIF/BMP/AVIF 등은 캔버스로 변환
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const kind = await sniff(file);
  if (kind === 'jpeg') {
    const info = readJpegInfo(new Uint8Array(await file.arrayBuffer()));
    if (info && ![2, 4, 5, 7].includes(info.orientation)) return { data: file, type: 'jpeg' };
    return reencode(file, 'jpeg', file.name);
  }
  if (kind === 'png') return { data: file, type: 'png' };
  const photoLike = /webp|avif|heic|heif/i.test(file.type) || /\.(webp|avif|heic|heif)$/i.test(file.name);
  return reencode(file, photoLike ? 'jpeg' : 'png', file.name);
}

export const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif';

export interface TextImageOptions {
  color: string;
  fontFamily?: string;
  bold?: boolean;
}

export const DEFAULT_FONT_STACK =
  '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "Noto Sans CJK KR", "Hiragino Sans", "Segoe UI", Roboto, Arial, sans-serif';

/**
 * 텍스트를 투명 배경 PNG 로 렌더링합니다. PDF 에 폰트를 넣지 않고도
 * 한글을 포함한 모든 언어의 워터마크를 만들 수 있습니다.
 */
export async function renderTextImage(text: string, options: TextImageOptions): Promise<{ blob: Blob; width: number; height: number }> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  let fontSize = 220;
  const font = () => `${options.bold === false ? 400 : 700} ${fontSize}px ${options.fontFamily ?? DEFAULT_FONT_STACK}`;
  ctx.font = font();
  let metrics = ctx.measureText(text);
  // 캔버스 최대 크기를 넘지 않도록 글자 크기를 줄입니다.
  const maxWidth = 8000;
  if (metrics.width > maxWidth) {
    fontSize = Math.floor((fontSize * maxWidth) / metrics.width);
    ctx.font = font();
    metrics = ctx.measureText(text);
  }
  const pad = Math.ceil(fontSize * 0.08);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize * 0.8);
  const descent = Math.ceil(metrics.actualBoundingBoxDescent || fontSize * 0.2);
  const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
  const width = Math.max(1, Math.ceil(left + (metrics.actualBoundingBoxRight || metrics.width)) + pad * 2);
  const height = Math.max(1, ascent + descent + pad * 2);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font();
  ctx.fillStyle = options.color;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, pad + left, pad + ascent);
  const blob = await canvasToBlob(canvas, 'image/png');
  canvas.width = canvas.height = 0;
  return { blob, width, height };
}

/** 이미지 파일의 픽셀 크기 */
export async function imageSize(file: Blob): Promise<{ width: number; height: number }> {
  const source = await decode(file);
  const size =
    'naturalWidth' in source
      ? { width: source.naturalWidth, height: source.naturalHeight }
      : { width: source.width, height: source.height };
  if ('close' in source) source.close();
  return size;
}
