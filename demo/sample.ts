// 체험용 한글 샘플 PDF 를 브라우저에서 만듭니다 (캔버스로 그린 페이지 → JPEG → PDF).
import { DEFAULT_FONT_STACK } from '../src/lib/images';
import { runTask } from '../src/lib/pdf/client';
import { canvasToBlob } from '../src/lib/pdfjs';

const WIDTH = 992; // A4, 120dpi
const HEIGHT = 1403;

interface Palette {
  accent: string;
  soft: string;
}

const font = (size: number, weight = 400) => `${weight} ${size}px ${DEFAULT_FONT_STACK}`;

function textLines(ctx: CanvasRenderingContext2D, top: number, count: number, seed: number) {
  ctx.fillStyle = '#c9ced8';
  for (let i = 0; i < count; i++) {
    const width = 640 + ((i * 97 + seed * 31) % 180);
    ctx.fillRect(96, top + i * 34, i % 5 === 4 ? width * 0.55 : width, 12);
  }
}

function drawPhoto(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, palette: Palette) {
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, '#8ec5ff');
  sky.addColorStop(0.6, '#fde2c4');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(x + w * 0.72, y + h * 0.35, h * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4b6b52';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.3, y + h * 0.45);
  ctx.lineTo(x + w * 0.55, y + h * 0.75);
  ctx.lineTo(x + w * 0.78, y + h * 0.5);
  ctx.lineTo(x + w, y + h * 0.8);
  ctx.lineTo(x + w, y + h);
  ctx.fill();
  // 사진처럼 보이도록 약간의 노이즈 (압축 도구 체험용)
  const image = ctx.getImageData(x, y, w, h);
  let seed = 7;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const noise = (seed % 24) - 12;
    image.data[i] += noise;
    image.data[i + 1] += noise;
    image.data[i + 2] += noise;
  }
  ctx.putImageData(image, x, y);
}

function drawChart(ctx: CanvasRenderingContext2D, top: number, palette: Palette) {
  const values = [42, 58, 51, 73, 88, 95];
  const labels = ['4월', '5월', '6월', '7월', '8월', '9월'];
  ctx.strokeStyle = '#d5d9e1';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const y = top + 360 - i * 90;
    ctx.beginPath();
    ctx.moveTo(96, y);
    ctx.lineTo(WIDTH - 96, y);
    ctx.stroke();
  }
  values.forEach((value, i) => {
    const barWidth = 80;
    const x = 140 + i * 125;
    const height = value * 3.6;
    ctx.fillStyle = i === values.length - 1 ? palette.accent : palette.soft;
    ctx.fillRect(x, top + 360 - height, barWidth, height);
    ctx.fillStyle = '#4a5160';
    ctx.font = font(22);
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, top + 400);
    ctx.fillText(`${value}`, x + barWidth / 2, top + 346 - height);
  });
  ctx.textAlign = 'left';
}

function drawPage(
  title: string,
  subtitle: string,
  headings: string[],
  index: number,
  palette: Palette,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (index === 0) {
    ctx.fillStyle = palette.accent;
    ctx.fillRect(0, 0, WIDTH, 520);
    ctx.fillStyle = '#ffffff';
    ctx.font = font(34, 600);
    ctx.fillText(subtitle, 96, 250);
    ctx.font = font(72, 800);
    ctx.fillText(title, 96, 350);
    ctx.fillStyle = '#1f2430';
    ctx.font = font(30, 700);
    ctx.fillText('목차', 96, 660);
    ctx.font = font(26);
    headings.forEach((item, i) => ctx.fillText(`${i + 1}. ${item}`, 120, 730 + i * 52));
    ctx.fillStyle = '#8a92a1';
    ctx.font = font(22);
    ctx.fillText('체험용 샘플 문서 · 실제 데이터가 아닙니다', 96, HEIGHT - 110);
    return canvas;
  }

  ctx.fillStyle = palette.accent;
  ctx.fillRect(96, 110, 12, 56);
  ctx.fillStyle = '#1f2430';
  ctx.font = font(44, 800);
  ctx.fillText(`${index}. ${headings[index - 1]}`, 128, 156);
  textLines(ctx, 230, 8, index);
  if (index % 3 === 1) {
    drawPhoto(ctx, 96, 540, WIDTH - 192, 520, palette);
    ctx.fillStyle = '#6b7280';
    ctx.font = font(22);
    ctx.fillText('사진 1. 현장 사진 (샘플)', 96, 1100);
  } else if (index % 3 === 2) {
    drawChart(ctx, 560, palette);
    textLines(ctx, 1040, 6, index + 3);
  } else {
    textLines(ctx, 560, 18, index + 7);
  }
  return canvas;
}

async function buildPdf(
  name: string,
  title: string,
  subtitle: string,
  headings: string[],
  palette: Palette,
): Promise<File> {
  const images: Array<{ data: Blob; type: 'jpeg' }> = [];
  for (let i = 0; i <= headings.length; i++) {
    const canvas = drawPage(title, subtitle, headings, i, palette);
    images.push({ data: await canvasToBlob(canvas, 'image/jpeg', 0.9), type: 'jpeg' });
    canvas.width = canvas.height = 0;
  }
  const bytes = await runTask('imagesToPdf', {
    images,
    options: { pageSize: 'a4', orientation: 'portrait', margin: 0 },
  });
  return new File([bytes as BlobPart], name, { type: 'application/pdf' });
}

let cache: Promise<{ report: File; appendix: File }> | null = null;

/** 샘플 문서 두 개 (보고서 6쪽, 부록 3쪽). 한 번만 만들어 재사용합니다. */
export function getSamples() {
  cache ??= (async () => ({
    report: await buildPdf(
      '샘플_사업보고서.pdf',
      '3분기 사업 보고서',
      '샘플 주식회사',
      ['요약', '주요 성과', '월별 실적', '현장 사진', '다음 분기 계획'],
      { accent: '#e5484d', soft: '#f5b3b5' },
    ),
    appendix: await buildPdf('샘플_부록.pdf', '부록 자료', '샘플 주식회사', ['세부 실적표', '참고 사진'], {
      accent: '#2563eb',
      soft: '#a9c3f7',
    }),
  }))();
  cache.catch(() => {
    cache = null;
  });
  return cache;
}
