import { readFile } from 'node:fs/promises';
import type { BrowserContext } from '@playwright/test';
import { downloadVia, expect, openPdf, test, upload, type UploadFile } from './fixtures';

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const fixture = async (name: string, mimeType: string): Promise<UploadFile> => ({
  name,
  mimeType,
  buffer: await readFile(`tests/fixtures/${name}`),
});

/**
 * 배포 환경의 public/_headers 처럼 변환 화면과 엔진 파일에 교차 출처 격리 헤더를 붙입니다
 * (astro preview 는 _headers 를 읽지 않으므로).
 */
async function applyHeaders(context: BrowserContext) {
  const add = (pattern: RegExp, extra: Record<string, string>) =>
    context.route(pattern, async (route) => {
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), ...extra } });
    });
  await add(/\/convert\//, { 'cross-origin-opener-policy': 'same-origin', 'cross-origin-embedder-policy': 'require-corp' });
  await add(/\/office\/engine\//, { 'cross-origin-resource-policy': 'same-origin', 'cross-origin-embedder-policy': 'require-corp' });
}

// 처음 한 번 변환 엔진(약 50 MB)을 내려받고 시작하므로 넉넉히 기다립니다.
const ENGINE_TIMEOUT = 150_000;

test.describe('Word·PPT → PDF', () => {
  test.describe.configure({ timeout: 240_000 });

  test('Word: 도구 페이지에서 고르면 변환 화면으로 넘어가 한글 문서를 PDF 로 바꾼다', async ({ page, context }) => {
    await applyHeaders(context);
    await page.goto('/word-to-pdf/');
    await expect(page.locator('.office-notes')).toContainText('MB');
    await upload(page, [await fixture('contract.docx', DOCX)]);
    await expect(page).toHaveURL(/\/convert\/word-to-pdf\/$/);
    await expect(page.getByRole('heading', { name: '완료되었습니다!' })).toBeVisible({ timeout: ENGINE_TIMEOUT });

    const { name, bytes } = await downloadVia(page, '다운로드');
    expect(name).toBe('contract.pdf');
    expect((await openPdf(bytes)).getPageCount()).toBe(2);
    // 한글이 든 문서이므로 한국어 글꼴이 PDF 에 들어가야 합니다 (없으면 글자가 네모로 나옴).
    expect(bytes.includes('NanumGothic') || bytes.includes('NanumMyeongjo')).toBe(true);

    // 결과를 다른 도구로 넘길 수 있습니다.
    await page.getByRole('navigation', { name: '이어서 작업하기' }).getByRole('link', { name: 'PDF 합치기' }).click();
    await expect(page).toHaveURL(/\/merge-pdf\/$/);
    await expect(page.locator('.file-row')).toContainText('contract.pdf');
  });

  test('PowerPoint: 변환 화면에서 바로 고르고, 잘못된 파일은 알려 준다', async ({ page, context }) => {
    await applyHeaders(context);
    await page.goto('/en/convert/ppt-to-pdf/');
    await upload(page, [{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }]);
    await expect(page.getByText('“notes.txt” is not a PowerPoint file.')).toBeVisible();

    await upload(page, [await fixture('report.pptx', PPTX)]);
    await expect(page.getByRole('heading', { name: 'Done!' })).toBeVisible({ timeout: ENGINE_TIMEOUT });
    const { name, bytes } = await downloadVia(page, 'Download');
    expect(name).toBe('report.pdf');
    const pdf = await openPdf(bytes);
    // 슬라이드 2장 → 2쪽, 가로로 긴 페이지
    expect(pdf.getPageCount()).toBe(2);
    const { width, height } = pdf.getPage(0).getSize();
    expect(width).toBeGreaterThan(height);
  });

  test('교차 출처 격리되지 않은 변환 화면에서는 지원하지 않는다고 안내한다', async ({ page }) => {
    await page.goto('/convert/word-to-pdf/');
    await expect(page.getByText('이 브라우저에서는 변환할 수 없습니다.', { exact: false })).toBeVisible();
  });

  test('변환 화면은 검색에 노출하지 않고 광고도 넣지 않는다', async ({ page }) => {
    await page.goto('/convert/word-to-pdf/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('script[src*="adsbygoogle"]')).toHaveCount(0);
    await page.goto('/word-to-pdf/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/word-to-pdf\/$/);
  });
});
