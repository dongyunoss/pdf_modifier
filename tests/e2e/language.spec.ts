import { DEFAULT_LANG, LANGS, LANGUAGES } from '../../src/i18n/languages';
import { expect, test } from './fixtures';

/** 언어별로 그 나라 브라우저가 보내는 대표 언어 설정 */
const BROWSER_LOCALE: Record<string, string> = {
  en: 'en-US',
  ja: 'ja-JP',
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  es: 'es-MX',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  id: 'id-ID',
  vi: 'vi-VN',
  tr: 'tr-TR',
};

test.describe('브라우저 언어에 맞춰 옮기기', () => {
  test.beforeEach(async ({ context }) => {
    // 자동화 브라우저 표시(navigator.webdriver)를 끄고 실제 방문자처럼 만듭니다.
    await context.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
    });
  });

  for (const lang of LANGS.filter((code) => code !== DEFAULT_LANG)) {
    test.describe(lang, () => {
      test.use({ locale: BROWSER_LOCALE[lang] });

      test(`${BROWSER_LOCALE[lang]} 브라우저는 같은 페이지의 ${LANGUAGES[lang].name} 버전으로 간다`, async ({ page }) => {
        await page.goto('/merge-pdf/?from=x#faq');
        await expect(page).toHaveURL(new RegExp(`/${lang}/merge-pdf/\\?from=x#faq$`));
        await expect(page.locator('html')).toHaveAttribute('lang', LANGUAGES[lang].htmlLang);
        await expect(page.locator('.lang-menu summary')).toContainText(LANGUAGES[lang].name);
      });
    });
  }

  test.describe('한국어 브라우저', () => {
    test.use({ locale: 'ko-KR' });

    test('한국어 페이지는 그대로 두고, 다른 언어 주소로 들어오면 한국어로 바꾼다', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
      await page.goto('/en/split-pdf/');
      await expect(page).toHaveURL(/:4321\/split-pdf\/$/);
    });
  });

  test.describe('지원하지 않는 언어', () => {
    test.use({ locale: 'th-TH' });

    test('영어 페이지로 보낸다', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/en\/$/);
    });
  });

  test.describe('언어 메뉴', () => {
    test.use({ locale: 'en-US' });

    test('직접 고른 언어는 그대로 두고, 다음 방문에도 기억한다', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/en\/$/);
      await page.locator('.lang-menu summary').click();
      await page.locator('.lang-menu').getByRole('link', { name: '한국어' }).click();
      await expect(page).toHaveURL(/:4321\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
      // 바깥에서 영어 주소로 다시 들어와도 고른 언어(한국어)로 보여 줍니다.
      await page.goto('/en/merge-pdf/');
      await expect(page).toHaveURL(/:4321\/merge-pdf\/$/);
    });
  });

  test.describe('검색엔진 크롤러', () => {
    test.use({ locale: 'en-US', userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' });

    test('옮기지 않아 모든 언어 페이지가 색인된다', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/:4321\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    });
  });
});

test('자동화 도구(navigator.webdriver)로 열면 옮기지 않는다', async ({ page }) => {
  await page.goto('/merge-pdf/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/:4321\/merge-pdf\/$/);
});
