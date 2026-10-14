import { readFile } from 'node:fs/promises';
import { downloadVia, expect, openPdf, test, type UploadFile } from './fixtures';

const fixture = async (name: string): Promise<UploadFile> => ({
  name,
  mimeType: 'application/octet-stream',
  buffer: await readFile(`tests/fixtures/${name}`),
});
// 처음 한 번 엔진과 글꼴(약 6 MB)을 내려받습니다.
const TIMEOUT = 90_000;
const has = (bytes: Buffer, text: string) => bytes.includes(Buffer.from(text, 'latin1'));

test.describe('한글(HWP) → PDF', () => {
  test.describe.configure({ timeout: 180_000 });

  test('HWP 와 HWPX 를 한 번에 PDF 로 바꾼다 (광고 있는 도구 페이지에서 바로)', async ({ page }) => {
    await page.goto('/hwp-to-pdf/');
    await expect(page.locator('.office-notes')).not.toContainText('MB');
    await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
    await page.locator('.tool-area input[type=file]').setInputFiles([await fixture('plan.hwp'), await fixture('symbols.hwpx')]);
    await expect(page.getByRole('heading', { name: '완료되었습니다!' })).toBeVisible({ timeout: TIMEOUT });
    await expect(page).toHaveURL(/\/hwp-to-pdf\/$/);

    const { name, bytes } = await downloadVia(page, 'ZIP 파일로 모두 받기');
    expect(name).toBe('hwp-pdf.zip');
    const { unzipSync } = await import('fflate');
    const files = unzipSync(bytes);
    expect(Object.keys(files).sort()).toEqual(['plan.pdf', 'symbols.pdf']);

    const plan = Buffer.from(files['plan.pdf']);
    expect((await openPdf(plan)).getPageCount()).toBe(6);
    expect(has(plan, 'NanumMyeongjo') || has(plan, 'NanumGothic')).toBe(true);
    // 문서 글꼴 굵기(500 등)나 한 글자 textLength 때문에 깨진 값이 들어가면 안 됩니다.
    expect(has(plan, 'Infinity')).toBe(false);
    expect(has(plan, 'NaN')).toBe(false);

    // 나눔 글꼴에 없는 ①·漢字·㉠ 는 보조 글꼴(Noto Sans KR)로 넣습니다.
    const symbols = Buffer.from(files['symbols.pdf']);
    expect(has(symbols, 'NotoSansKR')).toBe(true);
    const pdf = await openPdf(symbols);
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1);
  });

  test('한글 파일이 아니면 알려 준다', async ({ page }) => {
    await page.goto('/en/hwp-to-pdf/');
    await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
    await page.locator('.tool-area input[type=file]').setInputFiles([{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') }]);
    await expect(page.getByText('“notes.txt” is not a Hangul (HWP) file.')).toBeVisible();
  });

  test('망가진 HWP 는 열 수 없다고 알려 준다', async ({ page }) => {
    await page.goto('/hwp-to-pdf/');
    await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
    await page.locator('.tool-area input[type=file]').setInputFiles([{ name: 'broken.hwp', mimeType: 'application/octet-stream', buffer: Buffer.from('not a real hwp file') }]);
    await expect(page.getByText('「broken.hwp」을(를) 변환하지 못했습니다.', { exact: false })).toBeVisible({ timeout: TIMEOUT });
  });
});
