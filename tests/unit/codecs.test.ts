import { describe, expect, it } from 'vitest';
import { displayToPage, normalizeRotation, rotatedOrigin, type PageFrame } from '../../src/lib/pdf/geometry';
import { readJpegInfo, stripJpegExif } from '../../src/lib/pdf/jpeg';
import { undoPngPredictor } from '../../src/lib/pdf/png-predictor';
import { makeJpeg } from './helpers';

describe('jpeg utilities', () => {
  it('reads size, components and EXIF orientation', () => {
    expect(readJpegInfo(makeJpeg(640, 480, { orientation: 6 }))).toEqual({
      width: 640,
      height: 480,
      components: 3,
      orientation: 6,
    });
    expect(readJpegInfo(makeJpeg(10, 20))?.orientation).toBe(1);
    expect(readJpegInfo(new Uint8Array([1, 2, 3]))).toBeNull();
  });

  it('strips APP1 (EXIF) segments but keeps the image header', () => {
    const jpeg = makeJpeg(100, 50, { orientation: 8 });
    const stripped = stripJpegExif(jpeg);
    expect(stripped.length).toBeLessThan(jpeg.length);
    expect(readJpegInfo(stripped)).toEqual({ width: 100, height: 50, components: 3, orientation: 1 });
    // EXIF 가 없으면 같은 객체를 그대로 반환
    const plain = makeJpeg(10, 10);
    expect(stripJpegExif(plain)).toBe(plain);
  });
});

describe('undoPngPredictor', () => {
  it('reverses Sub/Up/Average/Paeth filters', () => {
    // 2x2 RGB 이미지: 원본 픽셀
    const pixels = [
      [10, 20, 30, 40, 50, 60],
      [15, 25, 35, 45, 55, 65],
    ];
    const bpp = 3;
    const encode = (filter: number) => {
      const out: number[] = [];
      let prev = [0, 0, 0, 0, 0, 0];
      for (const row of pixels) {
        out.push(filter);
        row.forEach((value, i) => {
          const left = i >= bpp ? row[i - bpp] : 0;
          const up = prev[i];
          const upLeft = i >= bpp ? prev[i - bpp] : 0;
          let predicted = 0;
          if (filter === 1) predicted = left;
          if (filter === 2) predicted = up;
          if (filter === 3) predicted = (left + up) >> 1;
          if (filter === 4) {
            const p = left + up - upLeft;
            const pa = Math.abs(p - left);
            const pb = Math.abs(p - up);
            const pc = Math.abs(p - upLeft);
            predicted = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
          }
          out.push((value - predicted) & 0xff);
        });
        prev = row;
      }
      return new Uint8Array(out);
    };
    for (const filter of [0, 1, 2, 3, 4]) {
      expect(Array.from(undoPngPredictor(encode(filter), 3, 8, 2)!)).toEqual(pixels.flat());
    }
    expect(undoPngPredictor(new Uint8Array([9, 1, 2, 3]), 3, 8, 1)).toBeNull();
  });
});

describe('geometry', () => {
  const frame = (rotation: number): PageFrame => ({
    x: 10,
    y: 20,
    width: 600,
    height: 400,
    rotation,
    displayWidth: rotation % 180 ? 400 : 600,
    displayHeight: rotation % 180 ? 600 : 400,
  });

  it('normalizes rotation angles', () => {
    expect(normalizeRotation(-90)).toBe(270);
    expect(normalizeRotation(450)).toBe(90);
    expect(normalizeRotation(360)).toBe(0);
  });

  it('maps the visible bottom-left corner to the right PDF corner for every rotation', () => {
    expect(displayToPage(frame(0), 0, 0)).toEqual({ x: 10, y: 20 });
    // 90° 시계 회전: 보이는 왼쪽 아래 = 원래 오른쪽 아래
    expect(displayToPage(frame(90), 0, 0)).toEqual({ x: 610, y: 20 });
    expect(displayToPage(frame(180), 0, 0)).toEqual({ x: 610, y: 420 });
    expect(displayToPage(frame(270), 0, 0)).toEqual({ x: 10, y: 420 });
  });

  it('maps the visible bottom-center into the page edge that is displayed at the bottom', () => {
    // 90° 회전된 페이지의 아래쪽 가운데는 원래 페이지의 오른쪽 가장자리 가운데
    expect(displayToPage(frame(90), 200, 0)).toEqual({ x: 610, y: 220 });
    // 270° 회전된 페이지의 아래쪽 가운데는 원래 페이지의 왼쪽 가장자리 가운데
    expect(displayToPage(frame(270), 200, 0)).toEqual({ x: 10, y: 220 });
  });

  it('computes rotation origins that keep the box centered', () => {
    const origin = rotatedOrigin(100, 100, 40, 20, 90);
    // 90° 회전 시 (w/2, h/2) 벡터는 (-h/2, w/2) 가 됨
    expect(origin.x).toBeCloseTo(110);
    expect(origin.y).toBeCloseTo(80);
    expect(rotatedOrigin(100, 100, 40, 20, 0)).toEqual({ x: 80, y: 90 });
  });
});
