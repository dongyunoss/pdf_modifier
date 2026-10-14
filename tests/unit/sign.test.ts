import { describe, expect, it } from 'vitest';
import { PDFDocument, PDFName, PDFRawStream } from '@cantoo/pdf-lib';
import { PdfToolError } from '../../src/lib/pdf/errors';
import { placementBox, type PageFrame } from '../../src/lib/pdf/geometry';
import { addSignatures } from '../../src/lib/pdf/ops';
import { makePdf, makePng, pageContent } from './helpers';

const expectCode = async (promise: Promise<unknown>, code: string) => {
  await expect(promise).rejects.toBeInstanceOf(PdfToolError);
  await expect(promise).rejects.toMatchObject({ code });
};

/** drawImage 로 그려진 사각형의 네 모서리 (PDF 좌표, 반올림) */
function corners(box: ReturnType<typeof placementBox>) {
  const t = (box.rotate * Math.PI) / 180;
  const along = [Math.cos(t) * box.width, Math.sin(t) * box.width];
  const up = [-Math.sin(t) * box.height, Math.cos(t) * box.height];
  const points = [
    [box.x, box.y],
    [box.x + along[0], box.y + along[1]],
    [box.x + up[0], box.y + up[1]],
    [box.x + along[0] + up[0], box.y + along[1] + up[1]],
  ];
  return points.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('signature placement', () => {
  const place = { x: 0.1, y: 0.2, width: 0.5 };

  it('maps the top-left based fraction to PDF coordinates on an upright page', () => {
    const frame: PageFrame = { x: 0, y: 0, width: 300, height: 400, rotation: 0, displayWidth: 300, displayHeight: 400 };
    // 300pt 너비의 50% = 150, 이미지 비율 2:1 → 높이 75. 위에서 20%(80pt) 아래가 윗변.
    expect(placementBox(frame, place, 100, 50)).toEqual({ x: 30, y: 245, width: 150, height: 75, rotate: 0 });
  });

  it('lands in the same visible spot on a page rotated by 90°', () => {
    // 가로로 저장되고 /Rotate 90 으로 세로로 보이는 페이지 (보이는 크기 300×400)
    const frame: PageFrame = { x: 0, y: 0, width: 400, height: 300, rotation: 90, displayWidth: 300, displayHeight: 400 };
    // 보이는 좌표 x 30~180, 아래에서 245~320 → 페이지 좌표 x = 400 - (보이는 y), y = 보이는 x
    expect(corners(placementBox(frame, place, 100, 50))).toEqual([
      [80, 30],
      [80, 180],
      [155, 30],
      [155, 180],
    ]);
  });

  it('respects a crop box offset', () => {
    const frame: PageFrame = { x: 50, y: 20, width: 300, height: 400, rotation: 0, displayWidth: 300, displayHeight: 400 };
    expect(placementBox(frame, place, 100, 50)).toMatchObject({ x: 80, y: 265 });
  });
});

describe('add signatures', () => {
  it('draws each placement and embeds a reused image only once', async () => {
    const pdf = await makePdf(2, { rotate: [0, 90] });
    const out = await addSignatures(
      { bytes: pdf },
      {
        images: [{ bytes: makePng(40, 20, true), type: 'png' }],
        placements: [
          { page: 1, image: 0, x: 0.1, y: 0.7, width: 0.3 },
          { page: 1, image: 0, x: 0.6, y: 0.7, width: 0.3 },
        ],
      },
    );
    expect(await pageContent(out, 0)).not.toMatch(/ Do\b/);
    expect((await pageContent(out, 1)).match(/ Do\b/g)).toHaveLength(2);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    const images = doc.context
      .enumerateIndirectObjects()
      .filter(([, object]) => object instanceof PDFRawStream && object.dict.get(PDFName.of('Subtype')) === PDFName.of('Image'));
    // 이미지 1개 + 알파 채널(SMask) 1개
    expect(images).toHaveLength(2);
  });

  it('places different images (signature and stamp) on different pages', async () => {
    const out = await addSignatures(
      { bytes: await makePdf(3) },
      {
        images: [
          { bytes: makePng(40, 20, true), type: 'png' },
          { bytes: makePng(30, 30), type: 'png' },
        ],
        placements: [
          { page: 0, image: 0, x: 0.5, y: 0.8, width: 0.3 },
          { page: 2, image: 1, x: 0.7, y: 0.8, width: 0.15 },
        ],
      },
    );
    expect((await pageContent(out, 0)).match(/ Do\b/g)).toHaveLength(1);
    expect(await pageContent(out, 1)).not.toMatch(/ Do\b/);
    expect((await pageContent(out, 2)).match(/ Do\b/g)).toHaveLength(1);
  });

  it('rejects missing placements, pages out of range and broken images', async () => {
    const pdf = await makePdf(1);
    const image = { bytes: makePng(10, 10), type: 'png' as const };
    await expectCode(addSignatures({ bytes: pdf }, { images: [image], placements: [] }), 'NO_PAGES');
    await expectCode(
      addSignatures({ bytes: pdf }, { images: [image], placements: [{ page: 3, image: 0, x: 0, y: 0, width: 0.2 }] }),
      'INVALID_RANGE',
    );
    await expectCode(
      addSignatures(
        { bytes: pdf },
        { images: [{ bytes: new Uint8Array([1, 2, 3]), type: 'png' }], placements: [{ page: 0, image: 0, x: 0, y: 0, width: 0.2 }] },
      ),
      'UNSUPPORTED_IMAGE',
    );
  });
});

describe('white background removal', () => {
  it('clears near-white pixels, fades light grey and keeps ink', async () => {
    const { removeWhiteBackground } = await import('../../src/lib/signature');
    // 흰색, 연한 회색, 빨간 도장 잉크
    const data = new Uint8ClampedArray([255, 255, 255, 255, 212, 212, 212, 255, 200, 30, 40, 255]);
    removeWhiteBackground(data);
    expect(data[3]).toBe(0);
    expect(data[7]).toBeGreaterThan(0);
    expect(data[7]).toBeLessThan(255);
    expect(data[11]).toBe(255);
  });
});
