import { PDFDocument } from '@cantoo/pdf-lib';
import { protectPdf } from '../../src/lib/pdf/ops';
import { hexText, makePdf, pageContent } from '../unit/helpers';
import { downloadVia, expect, makeImage, openPdf, pdfFile, test, unzip, upload } from './fixtures';

test.describe('PDF 합치기', () => {
  test('두 파일을 순서대로 합친다', async ({ page }) => {
    await page.goto('/merge-pdf/');
    await upload(page, [
      pdfFile('a.pdf', await makePdf(2, { label: 'A' })),
      pdfFile('b.pdf', await makePdf(3, { label: 'B', width: 500 })),
    ]);
    await expect(page.getByText('3쪽 ·')).toBeVisible();
    // 순서 바꾸기: 두 번째 파일을 위로
    await page.getByRole('button', { name: '위로 이동' }).nth(1).click();
    await expect(page.locator('.file-row').first()).toContainText('b.pdf');

    await page.getByRole('button', { name: 'PDF 합치기' }).click();
    await expect(page.getByRole('heading', { name: '완료되었습니다!' })).toBeVisible();
    const { name, bytes } = await downloadVia(page, '다운로드');
    expect(name).toBe('merged.pdf');
    const doc = await openPdf(bytes);
    expect(doc.getPages().map((p) => p.getWidth())).toEqual([500, 500, 500, 300, 300]);
  });

  test('암호가 걸린 파일은 암호를 입력받아 합친다', async ({ page }) => {
    const locked = await protectPdf({ bytes: await makePdf(2) }, { userPassword: 'pw123' });
    await page.goto('/merge-pdf/');
    await upload(page, [pdfFile('locked.pdf', locked), pdfFile('plain.pdf', await makePdf(1))]);
    await page.getByPlaceholder('PDF 암호').fill('wrong');
    await page.getByRole('button', { name: '열기' }).click();
    await expect(page.getByText('암호가 올바르지 않습니다. 다시 입력하세요.')).toBeVisible();
    await page.getByPlaceholder('PDF 암호').fill('pw123');
    await page.getByRole('button', { name: '열기' }).click();
    await expect(page.getByText('2쪽 ·')).toBeVisible();
    await page.getByRole('button', { name: 'PDF 합치기' }).click();
    const { bytes } = await downloadVia(page, '다운로드');
    expect((await openPdf(bytes)).getPageCount()).toBe(3);
  });

  test('결과를 다른 도구로 바로 넘긴다', async ({ page }) => {
    await page.goto('/merge-pdf/');
    await upload(page, [pdfFile('a.pdf', await makePdf(1)), pdfFile('b.pdf', await makePdf(1))]);
    await page.getByRole('button', { name: 'PDF 합치기' }).click();
    await page.getByRole('navigation', { name: '이어서 작업하기' }).getByRole('link', { name: 'PDF 압축' }).click();
    await expect(page).toHaveURL(/\/compress-pdf\/$/);
    await expect(page.locator('.file-card')).toContainText('merged.pdf');
    await expect(page.locator('.file-card')).toContainText('2쪽');
  });
});

test('PDF 분할: 범위별로 나누고 ZIP 으로 받는다', async ({ page }) => {
  await page.goto('/split-pdf/');
  await upload(page, [pdfFile('report.pdf', await makePdf(5))]);
  const ranges = page.getByLabel('페이지 범위');
  await expect(ranges).toHaveValue('1-3, 4-5');
  await ranges.fill('1-2, 3, 4-');
  await expect(page.getByText('PDF 파일 3개가 만들어집니다.')).toBeVisible();
  await page.getByRole('button', { name: 'PDF 분할' }).click();
  await expect(page.getByText('파일 3개가 만들어졌습니다.')).toBeVisible();
  const { name, bytes } = await downloadVia(page, 'ZIP 파일로 모두 받기');
  expect(name).toBe('report_split.zip');
  const files = unzip(bytes);
  expect(Object.keys(files).sort()).toEqual(['report_1-2.pdf', 'report_3.pdf', 'report_4-5.pdf']);
  expect((await openPdf(files['report_4-5.pdf'])).getPageCount()).toBe(2);
});

test('PDF 페이지 편집: 끌어서 순서 변경, 회전, 삭제, 빈 페이지, 실행 취소', async ({ page }) => {
  await page.goto('/organize-pdf/');
  await upload(page, [pdfFile('doc.pdf', await makePdf(3))]);
  const cards = page.locator('.page-grid .page-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(2).locator('img')).toBeVisible();
  await expect(page.getByRole('button', { name: '실행 취소' })).toBeDisabled();

  // 3쪽을 1쪽 앞으로 끌기
  const from = await cards.nth(2).boundingBox();
  const to = await cards.nth(0).boundingBox();
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 3);
  await page.mouse.down();
  await page.mouse.move(from!.x + from!.width / 2 - 20, from!.y + from!.height / 3, { steps: 4 });
  await page.mouse.move(to!.x + 10, to!.y + to!.height / 3, { steps: 10 });
  await page.mouse.up();

  // 첫 카드(원래 3쪽) 회전, 두 번째 카드(원래 1쪽) 삭제
  await cards.nth(0).hover();
  await cards.nth(0).getByRole('button', { name: '오른쪽으로 회전' }).click();
  await cards.nth(1).hover();
  await cards.nth(1).getByRole('button', { name: '삭제' }).click();
  await expect(cards).toHaveCount(2);
  // 실행 취소 후 다시 삭제
  await page.getByRole('button', { name: '실행 취소' }).click();
  await expect(cards).toHaveCount(3);
  await page.getByRole('button', { name: '다시 실행' }).click();
  await expect(cards).toHaveCount(2);

  await page.getByRole('button', { name: '빈 페이지 추가' }).click();
  await expect(cards).toHaveCount(3);

  await page.getByRole('button', { name: '변경 사항 저장' }).click();
  const { bytes } = await downloadVia(page, '다운로드');
  const doc = await PDFDocument.load(bytes);
  expect(doc.getPageCount()).toBe(3);
  expect(doc.getPages().map((p) => [Math.round(p.getHeight()), p.getRotation().angle])).toEqual([
    [402, 90],
    [401, 0],
    [401, 0],
  ]);
  expect(await pageContent(bytes, 0)).toContain(hexText('Page 3'));
  expect(await pageContent(bytes, 2)).not.toContain('Tj');
});

test('PDF 회전: 클릭한 페이지만 회전한다', async ({ page }) => {
  await page.goto('/rotate-pdf/');
  await upload(page, [pdfFile('scan.pdf', await makePdf(3))]);
  await page.getByRole('button', { name: '2쪽 · 오른쪽으로 회전' }).click();
  await page.getByRole('button', { name: '2쪽 · 오른쪽으로 회전' }).click();
  await page.getByRole('button', { name: '회전 적용' }).click();
  const { name, bytes } = await downloadVia(page, '다운로드');
  expect(name).toBe('scan_rotated.pdf');
  expect((await openPdf(bytes)).getPages().map((p) => p.getRotation().angle)).toEqual([0, 180, 0]);
});

test('PDF 페이지 삭제: 선택한 페이지를 지운다', async ({ page }) => {
  await page.goto('/delete-pdf-pages/');
  await upload(page, [pdfFile('doc.pdf', await makePdf(4))]);
  await page.getByRole('option', { name: '2쪽 선택' }).click();
  await page.getByRole('option', { name: '4쪽 선택' }).click();
  await expect(page.getByText('2쪽 선택됨')).toBeVisible();
  await page.getByRole('button', { name: '2쪽 삭제' }).click();
  const { bytes } = await downloadVia(page, '다운로드');
  expect((await openPdf(bytes)).getPages().map((p) => Math.round(p.getHeight()))).toEqual([400, 402]);
});

test('PDF 페이지 추출: 범위를 입력해 페이지마다 따로 저장한다', async ({ page }) => {
  await page.goto('/extract-pdf-pages/');
  await upload(page, [pdfFile('book.pdf', await makePdf(5))]);
  await page.getByLabel('페이지 번호로 선택').fill('2, 4-5');
  await page.getByRole('button', { name: '적용' }).click();
  await expect(page.getByText('3쪽 선택됨')).toBeVisible();
  await page.getByText('페이지마다 따로').click();
  await page.getByRole('button', { name: '3쪽 추출' }).click();
  const { bytes } = await downloadVia(page, 'ZIP 파일로 모두 받기');
  expect(Object.keys(unzip(bytes)).sort()).toEqual(['book_page-2.pdf', 'book_page-4.pdf', 'book_page-5.pdf']);
});

test('PDF 압축: 큰 사진이 든 PDF 용량을 줄인다', async ({ page }) => {
  await page.goto('/compress-pdf/');
  const jpeg = await makeImage(page, 3000, 2000, 'image/jpeg', 0.98);
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(jpeg);
  doc.addPage([600, 400]).drawImage(image, { x: 0, y: 0, width: 600, height: 400 });
  const original = await doc.save();

  await upload(page, [pdfFile('photo.pdf', original)]);
  await page.getByRole('button', { name: 'PDF 압축' }).click();
  await expect(page.getByText(/% 감소\)/)).toBeVisible();
  const { bytes } = await downloadVia(page, '다운로드');
  expect(bytes.length).toBeLessThan(original.length / 2);
  expect((await openPdf(bytes)).getPageCount()).toBe(1);
});

test('PDF 압축: 최대 압축(페이지 이미지화)', async ({ page }) => {
  await page.goto('/compress-pdf/');
  const jpeg = await makeImage(page, 2400, 1600, 'image/jpeg', 0.98);
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(jpeg);
  doc.addPage([612, 792]).drawImage(image, { x: 0, y: 0, width: 612, height: 408 });
  const original = await doc.save();

  await upload(page, [pdfFile('scan.pdf', original)]);
  await page.getByText('최대 압축 (모든 페이지를 이미지로 변환)').click();
  await page.getByRole('button', { name: 'PDF 압축' }).click();
  const { bytes } = await downloadVia(page, '다운로드');
  const out = await openPdf(bytes);
  expect(out.getPageCount()).toBe(1);
  expect([Math.round(out.getPage(0).getWidth()), Math.round(out.getPage(0).getHeight())]).toEqual([612, 792]);
  expect(bytes.length).toBeLessThan(original.length);
});

test('JPG → PDF: 여러 이미지를 A4 PDF 로 만든다', async ({ page }) => {
  await page.goto('/jpg-to-pdf/');
  const jpeg = await makeImage(page, 800, 600, 'image/jpeg');
  const png = await makeImage(page, 300, 600, 'image/png');
  await upload(page, [
    { name: 'photo.jpg', mimeType: 'image/jpeg', buffer: jpeg },
    { name: 'tall.png', mimeType: 'image/png', buffer: png },
  ]);
  await expect(page.getByText('이미지 2장')).toBeVisible();
  await page.getByRole('button', { name: 'PDF로 변환' }).click();
  const { name, bytes } = await downloadVia(page, '다운로드');
  expect(name).toBe('images.pdf');
  const doc = await openPdf(bytes);
  expect(doc.getPages().map((p) => [Math.round(p.getWidth()), Math.round(p.getHeight())])).toEqual([
    [842, 595],
    [595, 842],
  ]);
});

test('PDF → JPG: 페이지를 이미지로 변환한다', async ({ page }) => {
  await page.goto('/pdf-to-jpg/');
  await upload(page, [pdfFile('slides.pdf', await makePdf(2))]);
  await expect(page.getByText('2쪽 선택됨')).toBeVisible();
  await page.getByRole('button', { name: '이미지로 변환' }).click();
  const { bytes } = await downloadVia(page, 'ZIP 파일로 모두 받기');
  const files = unzip(bytes);
  expect(Object.keys(files).sort()).toEqual(['slides_page-1.jpg', 'slides_page-2.jpg']);
  expect([...files['slides_page-1.jpg'].subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
});

test('PDF 워터마크: 한글 문구를 넣는다', async ({ page }) => {
  await page.goto('/add-watermark-to-pdf/');
  await upload(page, [pdfFile('contract.pdf', await makePdf(2))]);
  await page.getByLabel('워터마크 문구').fill('대외비 문서');
  await expect(page.locator('.preview-stamp')).toHaveCount(1);
  await page.getByText('바둑판').click();
  await expect.poll(() => page.locator('.preview-stamp').count()).toBeGreaterThan(3);
  await page.getByRole('button', { name: '워터마크 적용' }).click();
  const { bytes } = await downloadVia(page, '다운로드');
  for (const index of [0, 1]) expect((await pageContent(bytes, index)).match(/ Do\b/g)!.length).toBeGreaterThan(3);
});

test('PDF 페이지 번호: 2쪽부터 번호를 넣는다', async ({ page }) => {
  await page.goto('/add-page-numbers-to-pdf/');
  await upload(page, [pdfFile('thesis.pdf', await makePdf(3))]);
  await page.getByRole('radio', { name: '1 / 3' }).check({ force: true });
  await page.getByText('직접 입력').click();
  await page.getByLabel('적용 페이지').fill('2-');
  await page.getByRole('button', { name: '페이지 번호 넣기' }).click();
  const { bytes } = await downloadVia(page, '다운로드');
  expect(await pageContent(bytes, 0)).not.toContain(hexText('1 / 2'));
  expect(await pageContent(bytes, 1)).toContain(hexText('1 / 2'));
  expect(await pageContent(bytes, 2)).toContain(hexText('2 / 2'));
});

test('PDF 암호 설정과 해제', async ({ page }) => {
  await page.goto('/protect-pdf/');
  await upload(page, [pdfFile('secret.pdf', await makePdf(1))]);
  await page.getByLabel('암호', { exact: true }).fill('open-sesame');
  await page.getByLabel('암호 확인').fill('different');
  await expect(page.getByText('암호가 일치하지 않습니다.')).toBeVisible();
  await page.getByLabel('암호 확인').fill('open-sesame');
  await page.getByRole('button', { name: '암호 설정' }).click();
  const { bytes: locked } = await downloadVia(page, '다운로드');
  await expect(openPdf(locked)).rejects.toThrow(/encrypted/i);
  expect((await openPdf(locked, 'open-sesame')).getPageCount()).toBe(1);

  await page.goto('/unlock-pdf/');
  await upload(page, [pdfFile('secret_protected.pdf', locked)]);
  await page.getByPlaceholder('PDF 암호').fill('open-sesame');
  await page.getByRole('button', { name: '열기' }).click();
  await expect(page.getByText('암호가 확인되었습니다.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: '암호 해제' }).click();
  const { name, bytes } = await downloadVia(page, '다운로드');
  expect(name).toBe('secret_protected_unlocked.pdf');
  const reopened = await openPdf(bytes);
  expect(reopened.isEncrypted).toBe(false);
  expect(await pageContent(bytes, 0)).toContain(hexText('Page 1'));
});

test('PDF 가 아닌 파일은 거절한다', async ({ page }) => {
  await page.goto('/merge-pdf/');
  await upload(page, [{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }]);
  await expect(page.getByRole('alert')).toContainText('「notes.txt」은(는) PDF 파일이 아닙니다.');
});

test('영어 페이지와 SEO 메타데이터', async ({ page }) => {
  await page.goto('/en/merge-pdf/');
  await expect(page).toHaveTitle(/^Merge PDF - Combine PDF Files into One for Free \| /);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel=alternate][hreflang=ko]')).toHaveAttribute('href', /\/merge-pdf\/$/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/en\/merge-pdf\/$/);
  await expect(page.getByRole('button', { name: 'Select PDF files' })).toBeVisible();
  await page.getByRole('link', { name: 'KO' }).click();
  await expect(page).toHaveURL(/\/merge-pdf\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PDF 합치기');
});
