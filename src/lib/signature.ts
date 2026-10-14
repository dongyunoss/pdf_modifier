// 서명 넣기 도구의 서명 이미지 만들기: 손으로 그린 서명, 입력한 이름, 서명·도장 사진.
// 모두 배경이 투명한 PNG 로 만들어 PDF 에 넣습니다. (파일은 브라우저 밖으로 나가지 않습니다)
import { fontStackFor, renderTextImage } from './images';
import { canvasToBlob } from './pdfjs';

export interface SignatureImage {
  blob: Blob;
  width: number;
  height: number;
}

export type Stroke = Array<{ x: number; y: number }>;

/** 그린 획을 매끄러운 선으로 그립니다 (점 사이를 중간점 기준 2차 곡선으로 잇기). */
export function traceStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[], offsetX = 0, offsetY = 0, scale = 1) {
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    const p = (i: number) => ({ x: (stroke[i].x - offsetX) * scale, y: (stroke[i].y - offsetY) * scale });
    ctx.beginPath();
    const first = p(0);
    ctx.moveTo(first.x, first.y);
    if (stroke.length === 1) {
      // 점 하나만 찍은 경우에도 보이도록 아주 짧은 선을 그립니다.
      ctx.lineTo(first.x + 0.1, first.y + 0.1);
    } else {
      for (let i = 1; i < stroke.length - 1; i++) {
        const a = p(i);
        const b = p(i + 1);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
      const last = p(stroke.length - 1);
      ctx.lineTo(last.x, last.y);
    }
    ctx.stroke();
  }
}

/**
 * 서명 패드에 그린 획을 서명 부분만 잘라 투명 PNG 로 만듭니다.
 * @param lineWidth 패드에서 그린 선 굵기 (CSS 픽셀)
 */
export async function renderStrokes(strokes: Stroke[], color: string, lineWidth: number): Promise<SignatureImage | null> {
  const points = strokes.flat();
  if (points.length === 0) return null;
  const pad = lineWidth * 2;
  const minX = Math.min(...points.map((point) => point.x)) - pad;
  const minY = Math.min(...points.map((point) => point.y)) - pad;
  const maxX = Math.max(...points.map((point) => point.x)) + pad;
  const maxY = Math.max(...points.map((point) => point.y)) + pad;
  // PDF 에서 크게 키워도 선이 매끄럽도록 3배로 그립니다.
  const scale = 3;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil((maxX - minX) * scale));
  canvas.height = Math.max(1, Math.ceil((maxY - minY) * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  traceStrokes(ctx, strokes, minX, minY, scale);
  const blob = await canvasToBlob(canvas, 'image/png');
  const size = { width: canvas.width, height: canvas.height };
  canvas.width = canvas.height = 0;
  return { blob, ...size };
}

export type TypedStyle = 'script' | 'serif' | 'sans';

/** 입력한 이름을 서명처럼 그릴 글꼴. 손글씨 글꼴이 없는 문자는 그 언어의 기본 글꼴로 넘어갑니다. */
function typedFont(style: TypedStyle, lang: string): { fontFamily: string; italic: boolean; bold: boolean } {
  const base = fontStackFor(lang);
  if (style === 'script') {
    return {
      // 한글은 맥의 나눔 손글씨, 윈도의 궁서체가 있으면 그것으로 씁니다.
      fontFamily: `"Segoe Script", "Brush Script MT", "Snell Roundhand", "Apple Chancery", "Lucida Handwriting", "Nanum Pen Script", "Nanum Brush Script", Gungsuh, "궁서", cursive, ${base}`,
      italic: true,
      bold: false,
    };
  }
  if (style === 'serif') {
    return {
      fontFamily: `Georgia, "Times New Roman", "AppleMyungjo", "Batang", "Noto Serif KR", "Hiragino Mincho ProN", "Yu Mincho", "Songti SC", serif`,
      italic: false,
      bold: false,
    };
  }
  return { fontFamily: base, italic: false, bold: true };
}

export async function renderTypedSignature(text: string, style: TypedStyle, color: string, lang: string): Promise<SignatureImage | null> {
  if (!text.trim()) return null;
  return renderTextImage(text.trim(), { color, ...typedFont(style, lang) });
}

/** 너무 큰 사진은 이 크기(긴 변, 픽셀)로 줄입니다. 서명·도장에는 충분하고 PDF 용량도 작게 유지됩니다. */
const MAX_IMAGE_SIDE = 1200;

/**
 * 서명·도장 사진을 PNG 로 준비합니다.
 * @param removeWhite 흰 종이 배경을 투명하게 만듭니다 (도장·종이 서명 사진용).
 */
export async function loadSignatureImage(file: Blob, removeWhite: boolean): Promise<SignatureImage> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  if (removeWhite) {
    const image = ctx.getImageData(0, 0, width, height);
    removeWhiteBackground(image.data);
    ctx.putImageData(image, 0, 0);
  }
  const blob = await canvasToBlob(canvas, 'image/png');
  canvas.width = canvas.height = 0;
  return { blob, width, height };
}

/**
 * 밝은 배경을 투명하게 만듭니다 (RGBA 배열을 바로 고칩니다).
 * 아주 밝은 픽셀은 완전히 투명하게, 그보다 조금 어두운 픽셀은 점점 불투명하게 해서 가장자리가 부드럽게 남습니다.
 */
export function removeWhiteBackground(data: Uint8ClampedArray, clear = 235, keep = 190) {
  for (let i = 0; i < data.length; i += 4) {
    const light = Math.min(data[i], data[i + 1], data[i + 2]);
    if (light >= clear) data[i + 3] = 0;
    else if (light > keep) data[i + 3] = Math.round((data[i + 3] * (clear - light)) / (clear - keep));
  }
}
