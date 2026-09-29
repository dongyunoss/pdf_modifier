import { describe, expect, it } from 'vitest';
import { PDFDocument, PDFName, PDFRawStream } from '@cantoo/pdf-lib';
import { PdfToolError } from '../../src/lib/pdf/errors';
import {
  addPageNumbers,
  addWatermark,
  assemble,
  deletePages,
  extractPages,
  formatPageNumber,
  imagesToPdf,
  merge,
  pagesFromImages,
  protectPdf,
  rotatePages,
  split,
  unlockPdf,
} from '../../src/lib/pdf/ops';
import { hexText, makeJpeg, makePdf, makePng, pageContent, pageHeights, pageRotations } from './helpers';

/** 콘텐츠 스트림에 주어진 회전 성분(a b c d)을 가진 Tm/cm 연산자가 있는지 확인 */
const hasMatrix = (content: string, expected: number[], operator: 'Tm' | 'cm') =>
  content.split('\n').some((line) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 7 || parts[6] !== operator) return false;
    return expected.every((value, i) => Math.abs(Number(parts[i]) - value) < 1e-9);
  });

const expectCode = async (promise: Promise<unknown>, code: string) => {
  await expect(promise).rejects.toBeInstanceOf(PdfToolError);
  await expect(promise).rejects.toMatchObject({ code });
};

describe('merge / assemble', () => {
  it('merges files in order', async () => {
    const a = await makePdf(2);
    const b = await makePdf(3, { width: 500 });
    const merged = await merge([{ bytes: a }, { bytes: b }], { producer: 'Test Producer' });
    // updateMetadata: false — 기본값이면 pdf-lib 가 불러오는 순간 Producer 를 덮어씁니다.
    const doc = await PDFDocument.load(merged, { updateMetadata: false });
    expect(doc.getPageCount()).toBe(5);
    expect(doc.getPages().map((p) => p.getWidth())).toEqual([300, 300, 500, 500, 500]);
    expect(doc.getProducer()).toBe('Test Producer');
  });

  it('reorders, rotates, duplicates pages and inserts blank pages', async () => {
    const a = await makePdf(3);
    const b = await makePdf(2, { width: 500 });
    const out = await assemble(
      [{ bytes: a }, { bytes: b }],
      [
        { src: 1, page: 1 },
        { src: 0, page: 2, rotate: 90 },
        { blank: true, width: 200, height: 250 },
        { src: 0, page: 0 },
        { src: 0, page: 0, rotate: -90 },
      ],
    );
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(5);
    expect(await pageHeights(out)).toEqual([401, 402, 250, 400, 400]);
    expect(await pageRotations(out)).toEqual([0, 90, 0, 0, 270]);
    // 복제된 페이지는 서로 다른 페이지 객체여야 합니다.
    expect(doc.getPage(3).ref).not.toBe(doc.getPage(4).ref);
    expect(await pageContent(out, 3)).toContain(hexText('Page 1'));
  });

  it('combines existing rotation with the requested rotation', async () => {
    const a = await makePdf(1, { rotate: [270] });
    const out = await assemble([{ bytes: a }], [{ src: 0, page: 0, rotate: 180 }]);
    expect(await pageRotations(out)).toEqual([90]);
  });

  it('rejects empty selections and out-of-range pages', async () => {
    const a = await makePdf(2);
    await expectCode(assemble([{ bytes: a }], []), 'NO_PAGES');
    await expectCode(assemble([{ bytes: a }], [{ src: 0, page: 2 }]), 'INVALID_RANGE');
  });

  it('reports which file is not a PDF', async () => {
    const a = await makePdf(1);
    const promise = merge([{ bytes: a }, { bytes: new TextEncoder().encode('hello world') }]);
    await expectCode(promise, 'INVALID_PDF');
    await expect(promise).rejects.toMatchObject({ fileIndex: 1 });
  });
});

describe('split / extract / delete / rotate', () => {
  it('splits into groups', async () => {
    const a = await makePdf(5);
    const parts = await split({ bytes: a }, [[0, 1], [2], [4, 3]]);
    expect(parts).toHaveLength(3);
    expect(await pageHeights(parts[0])).toEqual([400, 401]);
    expect(await pageHeights(parts[1])).toEqual([402]);
    expect(await pageHeights(parts[2])).toEqual([404, 403]);
  });

  it('extracts selected pages', async () => {
    const out = await extractPages({ bytes: await makePdf(4) }, [3, 1]);
    expect(await pageHeights(out)).toEqual([403, 401]);
  });

  it('deletes selected pages and refuses to delete everything', async () => {
    const a = await makePdf(4);
    expect(await pageHeights(await deletePages({ bytes: a }, [0, 2]))).toEqual([401, 403]);
    await expectCode(deletePages({ bytes: a }, [0, 1, 2, 3]), 'NO_PAGES');
    await expectCode(deletePages({ bytes: a }, [7]), 'INVALID_RANGE');
  });

  it('rotates pages in place', async () => {
    const a = await makePdf(3, { rotate: [0, 90, 0] });
    const out = await rotatePages({ bytes: a }, [
      { page: 0, rotate: 90 },
      { page: 1, rotate: 270 },
    ]);
    expect(await pageRotations(out)).toEqual([90, 0, 0]);
  });
});

describe('page numbers', () => {
  it('formats numbers', () => {
    expect(formatPageNumber('n', 3, 9)).toBe('3');
    expect(formatPageNumber('n-of-total', 3, 9)).toBe('3 / 9');
    expect(formatPageNumber('page-n', 3, 9)).toBe('Page 3');
    expect(formatPageNumber('page-n-of-total', 3, 9)).toBe('Page 3 of 9');
    expect(formatPageNumber('dash-n', 3, 9)).toBe('- 3 -');
  });

  it('numbers only the selected pages, starting from startAt', async () => {
    const a = await makePdf(3);
    const out = await addPageNumbers(
      { bytes: a },
      { position: 'bottom-center', format: 'n-of-total', pages: [1, 2], startAt: 1 },
    );
    expect(await pageContent(out, 0)).not.toContain(hexText('1 / 2'));
    expect(await pageContent(out, 1)).toContain(hexText('1 / 2'));
    expect(await pageContent(out, 2)).toContain(hexText('2 / 2'));
  });

  it('draws rotated text on rotated pages so it reads upright', async () => {
    const a = await makePdf(1, { rotate: [90] });
    const out = await addPageNumbers({ bytes: a }, { position: 'bottom-right', format: 'n' });
    const content = await pageContent(out, 0);
    // 90° 회전 행렬 (cos, sin, -sin, cos) = (0 1 -1 0)
    expect(hasMatrix(content, [0, 1, -1, 0], 'Tm')).toBe(true);
  });
});

describe('watermark', () => {
  it('stamps one centered image per page and embeds the image only once', async () => {
    const a = await makePdf(2, { rotate: [0, 90] });
    const out = await addWatermark(
      { bytes: a },
      { image: { bytes: makePng(40, 10, true), type: 'png' }, scale: 0.6, opacity: 0.3, rotation: 45, layout: 'center' },
    );
    for (const page of [0, 1]) expect((await pageContent(out, page)).match(/ Do\b/g)).toHaveLength(1);
    const doc = await PDFDocument.load(out);
    const images = doc.context
      .enumerateIndirectObjects()
      .filter(([, object]) => object instanceof PDFRawStream && object.dict.get(PDFName.of('Subtype')) === PDFName.of('Image'));
    // 이미지 1개 + 알파 채널(SMask) 1개
    expect(images).toHaveLength(2);
  });

  it('adds a tiled image watermark to selected pages', async () => {
    const a = await makePdf(2);
    const out = await addWatermark(
      { bytes: a },
      { image: { bytes: makePng(20, 10, true), type: 'png' }, scale: 0.2, opacity: 0.5, rotation: 30, layout: 'tile', pages: [1] },
    );
    const first = await pageContent(out, 0);
    const second = await pageContent(out, 1);
    expect(first).not.toMatch(/ Do\b/);
    expect((second.match(/ Do\b/g) ?? []).length).toBeGreaterThan(4);
  });

  it('rejects broken watermark images', async () => {
    await expectCode(
      addWatermark(
        { bytes: await makePdf(1) },
        { image: { bytes: new Uint8Array([1, 2, 3]), type: 'png' }, scale: 0.5, opacity: 0.5, rotation: 0, layout: 'center' },
      ),
      'UNSUPPORTED_IMAGE',
    );
  });
});

describe('images to pdf', () => {
  it('fits images on A4 pages and follows the image orientation', async () => {
    const out = await imagesToPdf(
      [
        { bytes: makeJpeg(800, 600), type: 'jpeg' },
        { bytes: makeJpeg(800, 600, { orientation: 6 }), type: 'jpeg' },
        { bytes: makePng(30, 60), type: 'png' },
      ],
      { pageSize: 'a4', orientation: 'auto', margin: 20 },
    );
    const doc = await PDFDocument.load(out);
    const sizes = doc.getPages().map((p) => [Math.round(p.getWidth()), Math.round(p.getHeight())]);
    // 가로 사진 → 가로 A4, EXIF 6(세로로 찍은 사진) → 세로 A4, 세로 PNG → 세로 A4
    expect(sizes).toEqual([
      [842, 595],
      [595, 842],
      [595, 842],
    ]);
    // EXIF 6 은 -90° 회전 행렬로 그려져야 합니다.
    expect(hasMatrix(await pageContent(out, 1), [0, -1, 1, 0], 'cm')).toBe(true);
  });

  it('applies user rotation as page rotation', async () => {
    const out = await imagesToPdf([{ bytes: makeJpeg(400, 200), type: 'jpeg', rotation: 90 }], {
      pageSize: 'a4',
      orientation: 'auto',
      margin: 0,
    });
    expect(await pageRotations(out)).toEqual([90]);
  });

  it('uses the image size for "fit" pages', async () => {
    const out = await imagesToPdf([{ bytes: makeJpeg(400, 200), type: 'jpeg' }], {
      pageSize: 'fit',
      orientation: 'auto',
      margin: 0,
    });
    const page = (await PDFDocument.load(out)).getPage(0);
    expect([page.getWidth(), page.getHeight()]).toEqual([300, 150]);
  });

  it('reports unsupported images', async () => {
    await expectCode(
      imagesToPdf([{ bytes: new Uint8Array([1, 2, 3]), type: 'png' }], { pageSize: 'a4', orientation: 'auto', margin: 0 }),
      'UNSUPPORTED_IMAGE',
    );
  });

  it('builds full-page image documents', async () => {
    const out = await pagesFromImages([{ jpeg: makeJpeg(100, 100), width: 612, height: 792 }]);
    const page = (await PDFDocument.load(out)).getPage(0);
    expect([page.getWidth(), page.getHeight()]).toEqual([612, 792]);
  });
});

describe('protect / unlock', () => {
  it('encrypts with a password that unlock can remove', async () => {
    const a = await makePdf(2);
    const locked = await protectPdf({ bytes: a }, { userPassword: 's3cret', permissions: { copying: false } });
    await expect(PDFDocument.load(locked)).rejects.toThrow(/encrypted/i);
    expect((await PDFDocument.load(locked, { password: 's3cret' })).getPageCount()).toBe(2);

    await expectCode(unlockPdf({ bytes: locked }), 'PASSWORD_REQUIRED');
    await expectCode(unlockPdf({ bytes: locked, password: 'wrong' }), 'PASSWORD_INCORRECT');

    const unlocked = await unlockPdf({ bytes: locked, password: 's3cret' });
    expect(unlocked.wasEncrypted).toBe(true);
    const reopened = await PDFDocument.load(unlocked.bytes);
    expect(reopened.isEncrypted).toBe(false);
    expect(reopened.getPageCount()).toBe(2);
    expect(await pageContent(unlocked.bytes, 1)).toContain(hexText('Page 2'));
  });

  it('lets other tools open encrypted inputs when the password is given', async () => {
    const locked = await protectPdf({ bytes: await makePdf(2) }, { userPassword: 'pw' });
    await expectCode(merge([{ bytes: locked }]), 'PASSWORD_REQUIRED');
    const merged = await merge([{ bytes: locked, password: 'pw' }, { bytes: await makePdf(1) }]);
    const doc = await PDFDocument.load(merged);
    expect(doc.getPageCount()).toBe(3);
  });

  it('protects PDF/A documents by dropping the PDF/A declaration', async () => {
    const pdfa = await PDFDocument.load(await makePdf(1));
    pdfa.convertToPDFA({ conformance: '2B' });
    const bytes = await pdfa.save();
    const locked = await protectPdf({ bytes }, { userPassword: 'pw' });
    expect((await PDFDocument.load(locked, { password: 'pw' })).getPageCount()).toBe(1);
  });

  it('reports unencrypted files', async () => {
    const result = await unlockPdf({ bytes: await makePdf(1) });
    expect(result.wasEncrypted).toBe(false);
  });
});
