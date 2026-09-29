import { zlibSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { PDFDocument, PDFName, PDFNumber, PDFRawStream, PDFRef } from '@cantoo/pdf-lib';
import { compressPdf, type ImageRecoder, type RecodeInput, type RecodeTarget } from '../../src/lib/pdf/compress';
import { makeJpeg, makePdf, makePng } from './helpers';

/** 실제 인코딩 대신 호출 내역만 기록하고 작은 가짜 JPEG 을 돌려주는 인코더 */
function fakeRecoder() {
  const calls: Array<{ input: RecodeInput; target: RecodeTarget }> = [];
  const recoder: ImageRecoder = {
    async recode(input, target) {
      calls.push({ input, target });
      return { bytes: makeJpeg(target.width, target.height), width: target.width, height: target.height, components: 3 };
    },
  };
  return { recoder, calls };
}

interface ImageSummary {
  filter: string;
  width: number;
  height: number;
  colorSpace: string;
  hasSMask: boolean;
}

async function images(bytes: Uint8Array): Promise<ImageSummary[]> {
  const doc = await PDFDocument.load(bytes);
  const result: ImageSummary[] = [];
  for (const [, object] of doc.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFRawStream)) continue;
    const dict = object.dict;
    if (dict.get(PDFName.of('Subtype')) !== PDFName.of('Image')) continue;
    result.push({
      filter: String(dict.get(PDFName.of('Filter'))),
      width: (dict.get(PDFName.of('Width')) as PDFNumber).asNumber(),
      height: (dict.get(PDFName.of('Height')) as PDFNumber).asNumber(),
      colorSpace: String(dict.lookup(PDFName.of('ColorSpace'))),
      hasSMask: dict.has(PDFName.of('SMask')),
    });
  }
  return result.sort((a, b) => b.width - a.width);
}

describe('compressPdf', () => {
  it('downscales large JPEG and Flate images and keeps the document valid', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 800]);
    const jpeg = await doc.embedJpg(makeJpeg(3000, 2000, { padding: 200_000 }));
    const png = await doc.embedPng(makePng(400, 300));
    page.drawImage(jpeg, { x: 0, y: 0, width: 600, height: 400 });
    page.drawImage(png, { x: 0, y: 400, width: 400, height: 300 });
    const original = await doc.save();

    const { recoder, calls } = fakeRecoder();
    const { bytes, stats } = await compressPdf({ bytes: original }, { quality: 0.6, maxDimension: 1200 }, recoder);

    expect(stats.images).toBe(2);
    expect(stats.recompressed).toBe(2);
    expect(stats.compressedSize).toBe(bytes.length);
    expect(bytes.length).toBeLessThan(original.length / 4);

    const jpegCall = calls.find((call) => call.input.kind === 'jpeg')!;
    expect(jpegCall.target).toEqual({ width: 1200, height: 800, quality: 0.6 });
    const rawCall = calls.find((call) => call.input.kind === 'raw')!;
    expect(rawCall.input).toMatchObject({ width: 400, height: 300, components: 3 });
    expect(rawCall.input.kind === 'raw' && rawCall.input.pixels.length).toBe(400 * 300 * 3);

    const result = await images(bytes);
    expect(result).toEqual([
      { filter: '/DCTDecode', width: 1200, height: 800, colorSpace: '/DeviceRGB', hasSMask: false },
      { filter: '/DCTDecode', width: 400, height: 300, colorSpace: '/DeviceRGB', hasSMask: false },
    ]);
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
  });

  it('never touches soft masks and keeps the size of masked images', async () => {
    const doc = await PDFDocument.create();
    const png = await doc.embedPng(makePng(300, 200, true));
    doc.addPage().drawImage(png, { x: 0, y: 0, width: 300, height: 200 });
    const { recoder, calls } = fakeRecoder();
    const { bytes } = await compressPdf({ bytes: await doc.save() }, { quality: 0.5, maxDimension: 100 }, recoder);

    expect(calls).toHaveLength(1);
    expect(calls[0].target).toMatchObject({ width: 300, height: 200 });
    const result = await images(bytes);
    const base = result.find((image) => image.hasSMask)!;
    const mask = result.find((image) => !image.hasSMask)!;
    expect(base.filter).toBe('/DCTDecode');
    expect(mask).toMatchObject({ filter: '/FlateDecode', colorSpace: '/DeviceGray' });
  });

  it('decodes PNG-predicted Flate images', async () => {
    const width = 200;
    const height = 120;
    const raw = new Uint8Array(height * (width * 3 + 1));
    let seed = 7;
    for (let y = 0; y < height; y++) {
      raw[y * (width * 3 + 1)] = 2; // Up filter
      for (let x = 1; x <= width * 3; x++) {
        seed = (seed * 48271) % 2147483647;
        raw[y * (width * 3 + 1) + x] = seed & 0xff;
      }
    }
    const doc = await PDFDocument.create();
    const page = doc.addPage();
    const stream = doc.context.stream(zlibSync(raw), {
      Type: 'XObject',
      Subtype: 'Image',
      Width: width,
      Height: height,
      BitsPerComponent: 8,
      ColorSpace: 'DeviceRGB',
      Filter: 'FlateDecode',
      DecodeParms: { Predictor: 15, Colors: 3, BitsPerComponent: 8, Columns: width },
    });
    page.node.setXObject(PDFName.of('Im1'), doc.context.register(stream));

    const { recoder, calls } = fakeRecoder();
    await compressPdf({ bytes: await doc.save() }, { quality: 0.5, maxDimension: 2000 }, recoder);
    expect(calls).toHaveLength(1);
    const input = calls[0].input;
    expect(input.kind === 'raw' && input.pixels.length).toBe(width * height * 3);
  });

  it('keeps the original image when re-encoding does not help', async () => {
    const doc = await PDFDocument.create();
    const jpeg = await doc.embedJpg(makeJpeg(500, 500, { padding: 40_000 }));
    doc.addPage().drawImage(jpeg, { x: 0, y: 0, width: 100, height: 100 });
    const recoder: ImageRecoder = {
      async recode(_input, target) {
        return { bytes: new Uint8Array(60_000), width: target.width, height: target.height, components: 3 };
      },
    };
    const { stats } = await compressPdf({ bytes: await doc.save() }, { quality: 0.5, maxDimension: 2000 }, recoder);
    expect(stats.recompressed).toBe(0);
  });

  it('removes unreachable objects', async () => {
    const pdf = await PDFDocument.load(await makePdf(2));
    // 어디에서도 참조하지 않는 큰 스트림
    pdf.context.register(pdf.context.stream(new Uint8Array(100_000).fill(1)));
    const withGarbage = await pdf.save();
    const { bytes } = await compressPdf({ bytes: withGarbage }, { quality: 0.5, maxDimension: 1000 }, fakeRecoder().recoder);
    expect(bytes.length).toBeLessThan(withGarbage.length - 90_000);
    const reopened = await PDFDocument.load(bytes);
    expect(reopened.getPageCount()).toBe(2);
    expect(reopened.getPages().every((page) => page.ref instanceof PDFRef)).toBe(true);
  });
});
