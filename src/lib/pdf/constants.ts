// UI(메인 번들)와 워커가 함께 쓰는 값들. pdf-lib 에 의존하지 않아야 메인 번들이 가벼워집니다.

export type PageSizeName = 'fit' | 'a4' | 'letter';

/** 포인트 단위 용지 크기 (세로 기준) */
export const PAGE_SIZES: Record<Exclude<PageSizeName, 'fit'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export interface CompressOptions {
  /** JPEG 품질 0~1 */
  quality: number;
  /** 이미지의 긴 변 최대 픽셀 */
  maxDimension: number;
}

export const COMPRESSION_PRESETS = {
  low: { quality: 0.82, maxDimension: 2400 },
  medium: { quality: 0.68, maxDimension: 1700 },
  high: { quality: 0.5, maxDimension: 1200 },
} satisfies Record<string, CompressOptions>;

export type CompressionLevel = keyof typeof COMPRESSION_PRESETS;

/** '최대 압축'(페이지를 이미지로 변환)의 수준별 해상도와 품질 */
export const RASTER_PRESETS: Record<CompressionLevel, { dpi: number; quality: number }> = {
  low: { dpi: 150, quality: 0.8 },
  medium: { dpi: 120, quality: 0.65 },
  high: { dpi: 96, quality: 0.5 },
};

export type NumberPosition =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export type NumberFormat = 'n' | 'n-of-total' | 'page-n' | 'page-n-of-total' | 'dash-n';

export function formatPageNumber(format: NumberFormat, n: number, total: number): string {
  switch (format) {
    case 'n-of-total':
      return `${n} / ${total}`;
    case 'page-n':
      return `Page ${n}`;
    case 'page-n-of-total':
      return `Page ${n} of ${total}`;
    case 'dash-n':
      return `- ${n} -`;
    default:
      return `${n}`;
  }
}
