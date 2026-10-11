import { ja } from '../../src/i18n/ja';
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

  test('도구 페이지에 상세 설명과 관련 가이드가 있고, 가이드가 없는 언어에는 상세 설명만 있다', async ({ page }) => {
    await page.goto('/en/compress-pdf/');
    await expect(page.locator('.tool-details h2')).toHaveText('More about Compress PDF');
    await expect(page.locator('.guide-card').first()).toHaveAttribute('href', '/en/guides/reduce-pdf-file-size/');
    await page.goto('/ja/compress-pdf/');
    await expect(page.locator('.tool-details')).toHaveCount(1);
    await expect(page.locator('.guide-card')).toHaveCount(0);
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

  test('소개 페이지에 운영자와 업데이트 기록이 「문의」 앞에 있다', async ({ page }) => {
    await page.goto('/about/');
    const headings = await page.locator('article h2').allTextContents();
    expect(headings.slice(-3)).toEqual(['운영자와 운영 원칙', '업데이트 기록', '문의']);
    await expect(page.locator('.update-log time').first()).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  });

  test('일본어 도구 페이지에도 화면 문구와 같은 이름으로 상세 설명이 있다', async ({ page }) => {
    await page.goto('/ja/compress-pdf/');
    await expect(page.locator('.tool-details h2')).toContainText('詳しく');
    // 표의 압축 수준 이름은 일본어 사전(ja.ts)의 화면 문구에서 가져옵니다.
    await expect(page.locator('.tool-details th[scope="row"]').nth(1)).toHaveText(ja.tools.compress.ui.levelMedium);
  });

  test('설명 글에 바꾸지 못한 자리표시자({ui:…}, {tool:…})가 남지 않는다', async ({ page }) => {
    for (const path of ['/de/compress-pdf/', '/fr/add-page-numbers-to-pdf/', '/guides/organize-scanned-pdf/', '/en/guides/organize-scanned-pdf/']) {
      await page.goto(path);
      expect(await page.locator('main').innerText(), path).not.toMatch(/\{(ui|tool):/);
    }
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
