import { expect, test } from './fixtures';

test.describe('가이드', () => {
  test('가이드 목록에서 글을 열고, 글에서 도구로 간다', async ({ page }) => {
    await page.goto('/guides/');
    await expect(page.locator('h1')).toHaveText('PDF 가이드');
    await page.locator('.guide-card', { hasText: 'PDF 용량 줄이는 방법' }).click();
    await expect(page).toHaveURL(/\/guides\/reduce-pdf-file-size\/$/);
    await expect(page.locator('.guide-body table').first()).toBeVisible();
    await page.locator('.guide-tools a', { hasText: 'PDF 압축' }).click();
    await expect(page).toHaveURL(/\/compress-pdf\/$/);
  });

  test('도구 페이지에 상세 설명과 관련 가이드가 있고, 가이드가 없는 언어에는 없다', async ({ page }) => {
    await page.goto('/en/compress-pdf/');
    await expect(page.locator('.tool-details h2')).toHaveText('More about Compress PDF');
    await expect(page.locator('.guide-card').first()).toHaveAttribute('href', '/en/guides/reduce-pdf-file-size/');
    await page.goto('/ja/compress-pdf/');
    await expect(page.locator('.tool-details')).toHaveCount(0);
    await expect(page.locator('.header-guides')).toHaveCount(0);
  });

  test('가이드의 언어 메뉴는 가이드가 없는 언어를 그 언어의 홈으로 보낸다', async ({ page }) => {
    await page.goto('/en/guides/merge-pdf-files/');
    await expect(page.locator('.lang-panel a[data-lang-choice="ko"]')).toHaveAttribute('href', '/guides/merge-pdf-files/');
    await expect(page.locator('.lang-panel a[data-lang-choice="ja"]')).toHaveAttribute('href', '/ja/');
    const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('hreflang')),
    );
    expect(alternates).toEqual(['ko', 'en', 'x-default']);
  });

  test.describe('일본어 브라우저로 가이드에 처음 들어오면', () => {
    test.use({ locale: 'ja-JP' });
    test.beforeEach(async ({ context }) => {
      await context.addInitScript(() => {
        Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
      });
    });

    test('없는 일본어 가이드 대신 영어 가이드로 간다', async ({ page }) => {
      await page.goto('/guides/photos-to-pdf/');
      await expect(page).toHaveURL(/\/en\/guides\/photos-to-pdf\/$/);
    });
  });
});
