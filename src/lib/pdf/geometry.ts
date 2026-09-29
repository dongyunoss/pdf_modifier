import type { PDFPage } from '@cantoo/pdf-lib';

/**
 * 화면에 보이는 방향(회전 적용 후)을 기준으로 한 페이지 좌표계 정보.
 * 워터마크/페이지 번호처럼 "보이는 페이지의 아래쪽 가운데"에 무언가를 그려야 할 때
 * /Rotate 값과 CropBox 를 고려해 PDF 사용자 좌표로 변환하기 위해 사용합니다.
 */
export interface PageFrame {
  /** 보이는 영역(CropBox)의 PDF 사용자 좌표 */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 시계 방향 표시 회전 (0, 90, 180, 270) */
  rotation: number;
  /** 회전이 적용된(똑바로 보이는) 페이지의 가로/세로 */
  displayWidth: number;
  displayHeight: number;
}

export const normalizeRotation = (angle: number) => {
  const snapped = Math.round(angle / 90) * 90;
  return ((snapped % 360) + 360) % 360;
};

export function getPageFrame(page: PDFPage): PageFrame {
  const box = page.getCropBox();
  const rotation = normalizeRotation(page.getRotation().angle);
  const swap = rotation % 180 !== 0;
  return {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    rotation,
    displayWidth: swap ? box.height : box.width,
    displayHeight: swap ? box.width : box.height,
  };
}

/** 보이는 페이지 기준 좌표(왼쪽 아래 원점, y 위쪽)를 PDF 사용자 좌표로 변환합니다. */
export function displayToPage(frame: PageFrame, dx: number, dy: number): { x: number; y: number } {
  const { x, y, width: w, height: h } = frame;
  switch (frame.rotation) {
    case 90:
      return { x: x + w - dy, y: y + dx };
    case 180:
      return { x: x + w - dx, y: y + h - dy };
    case 270:
      return { x: x + dy, y: y + h - dx };
    default:
      return { x: x + dx, y: y + dy };
  }
}

/**
 * 워터마크를 찍을 중심 좌표 목록 (보이는 페이지 기준, 왼쪽 아래 원점).
 * PDF 생성과 화면 미리보기가 같은 배치를 쓰도록 공유합니다.
 */
export function watermarkCenters(
  pageWidth: number,
  pageHeight: number,
  stampWidth: number,
  stampHeight: number,
  rotation: number,
  layout: 'center' | 'tile',
): Array<[number, number]> {
  if (layout !== 'tile') return [[pageWidth / 2, pageHeight / 2]];
  const t = (rotation * Math.PI) / 180;
  const boxW = Math.abs(stampWidth * Math.cos(t)) + Math.abs(stampHeight * Math.sin(t));
  const boxH = Math.abs(stampWidth * Math.sin(t)) + Math.abs(stampHeight * Math.cos(t));
  const stepX = Math.max(1, boxW * 1.3 + pageWidth * 0.04);
  const stepY = Math.max(1, boxH * 1.6 + pageHeight * 0.04);
  const centers: Array<[number, number]> = [];
  let row = 0;
  for (let cy = stepY / 2; cy - boxH / 2 < pageHeight; cy += stepY, row++) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let cx = stepX / 2 - offset; cx - boxW / 2 < pageWidth; cx += stepX) centers.push([cx, cy]);
  }
  return centers;
}

/**
 * 중심(cx, cy)을 기준으로 angle(반시계, 도)만큼 회전한 w×h 상자를 그릴 때
 * pdf-lib 의 drawImage/drawText 에 넘길 왼쪽 아래 기준점을 계산합니다.
 * (pdf-lib 는 기준점을 중심으로 회전시키기 때문)
 */
export function rotatedOrigin(cx: number, cy: number, w: number, h: number, angle: number) {
  const t = (angle * Math.PI) / 180;
  const cos = Math.cos(t);
  const sin = Math.sin(t);
  return {
    x: cx - ((w / 2) * cos - (h / 2) * sin),
    y: cy - ((w / 2) * sin + (h / 2) * cos),
  };
}
