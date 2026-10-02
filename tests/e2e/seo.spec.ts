import type { Page } from '@playwright/test';
import { INDEXNOW_KEY } from '../../src/config/content';
import { expect, test } from './fixtures';

/** 페이지에 들어 있는 JSON-LD 가운데 지정한 종류(WebSite, WebApplication …)의 항목 */
const jsonLd = async (page: Page, type: string) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((text) => JSON.parse(text)).find((data) => data['@type'] === type);
};

test('홈: 무료·로그인 없음 약속과 비교표를 보여 준다', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('PDF 편집기 - 로그인 없이 무료로 합치기·분할·압축·변환 | PDF Modifier');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('로그인 없이, 모든 PDF 도구를 무료로');
  await expect(page.locator('.hero .badge')).toHaveText(['모든 기능 무료', '로그인 없음', '횟수 제한 없음', '파일 업로드 없음']);

  const table = page.getByRole('table');
  await expect(page.getByRole('heading', { name: '숨은 조건 없는 무료' })).toBeVisible();
  await expect(table.getByRole('columnheader')).toHaveText(['항목', '흔한 온라인 PDF 사이트', 'PDF Modifier']);
  await expect(table.getByRole('rowheader')).toHaveCount(5);
  await expect(table.getByRole('row', { name: /회원가입·로그인/ })).toContainText('필요 없음');

  await expect(page.locator('.faq summary').nth(1)).toHaveText('로그인이나 회원가입이 필요한가요?');
  const site = await jsonLd(page, 'WebSite');
  expect(site.name).toBe('PDF Modifier');
  expect(site.alternateName).toContain('pdfmodifier.app');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/ko\.png$/);
});

test('도구 페이지: 제목·설명·구조화 데이터·업로드 영역에 약속이 들어 있다', async ({ page }) => {
  await page.goto('/en/compress-pdf/');
  await expect(page).toHaveTitle('Compress PDF - Reduce PDF File Size Free, No Sign-Up | PDF Modifier');
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toMatch(/\. Free with no sign-up and no limits — your files are never uploaded\.$/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/en\.png$/);

  await expect(page.locator('.highlight-row li')).toHaveText(['Every tool free', 'No sign-up', 'No limits', 'No uploads']);
  await expect(page.locator('.dropzone')).toContainText('Start right away — free, no sign-up, no limits.');

  const app = await jsonLd(page, 'WebApplication');
  expect(app.description).toBe(description);
  expect(app.isAccessibleForFree).toBe(true);
  expect(app.featureList).toEqual(['Every tool free', 'No sign-up', 'No limits', 'No uploads']);
});

test('검색엔진 알림에 필요한 파일을 내려준다', async ({ request }) => {
  const key = await request.get(`/${INDEXNOW_KEY}.txt`);
  expect(key.status()).toBe(200);
  expect(await key.text()).toBe(INDEXNOW_KEY);

  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).toContain('<loc>https://pdfmodifier.app/ja/merge-pdf/</loc>');
  expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T/);
  expect(sitemap).not.toContain('.txt</loc>');

  const image = await request.get('/og/ja.png');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toBe('image/png');
});
