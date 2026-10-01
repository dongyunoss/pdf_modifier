import type { Page } from '@playwright/test';
import { makePdf } from '../unit/helpers';
import { downloadVia, expect, pdfFile, test, upload } from './fixtures';

/** PDF 처리 워커 스크립트를 늦게 내려보내 처리 화면이 충분히 오래 떠 있게 합니다. */
async function delayWorker(page: Page, ms: number) {
  await page.route(/\/_astro\/worker-[^/]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    await route.continue().catch(() => {});
  });
}

/** 지금 페이지를 떠나려 하면 브라우저가 확인 창을 띄우는지 */
const leaveIsGuarded = (page: Page) =>
  page.evaluate(() => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  });

async function openMerge(page: Page) {
  await page.goto('/merge-pdf/');
  await upload(page, [pdfFile('a.pdf', await makePdf(1)), pdfFile('b.pdf', await makePdf(2))]);
  await expect(page.getByText('2쪽 ·')).toBeVisible();
}

test('처리하는 동안 진행 화면을 보여 주고, 결과를 받기 전에는 떠나기 전에 확인한다', async ({ page }) => {
  await delayWorker(page, 4500);
  await openMerge(page);
  await page.getByRole('button', { name: 'PDF 합치기' }).click();

  const busy = page.locator('.busy');
  await expect(busy.getByRole('heading', { name: '파일을 처리하고 있습니다…' })).toBeFocused();
  await expect(busy.getByText('PDF 합치기', { exact: true })).toBeVisible();
  await expect(busy.getByRole('progressbar', { name: '파일을 처리하고 있습니다…' })).toBeVisible();
  await expect(busy.getByText('작업이 끝날 때까지 이 페이지를 닫지 마세요.')).toBeVisible();
  await expect(page).toHaveTitle(/^⏳ 처리 중… · PDF 합치기/);
  expect(await leaveIsGuarded(page)).toBe(true);

  // 잠시 기다리면 팁과 경과 시간이 나타납니다.
  await expect(busy.getByRole('note')).toContainText('알고 계셨나요?');
  await expect(busy.locator('.busy-elapsed')).toContainText('경과');
  // 합치기 화면에서는 「PDF 합치기」를 권하는 팁을 보여 주지 않습니다.
  await expect(busy.getByRole('note')).not.toContainText('「PDF 합치기」를 사용해 보세요');

  await expect(page.getByRole('heading', { name: '완료되었습니다!' })).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveTitle(/^PDF 합치기/);
  // 결과를 받기 전에 떠나면 만든 파일이 사라지므로 확인합니다.
  expect(await leaveIsGuarded(page)).toBe(true);

  await downloadVia(page, '다운로드');
  await expect(page.getByRole('status').filter({ hasText: '다운로드를 시작했습니다.' })).toBeVisible();
  expect(await leaveIsGuarded(page)).toBe(false);
});

test('처리 중에 취소하면 파일 목록으로 돌아가고 확인 창과 탭 표시를 끈다', async ({ page }) => {
  await delayWorker(page, 5000);
  await openMerge(page);
  await page.getByRole('button', { name: 'PDF 합치기' }).click();
  await expect(page.locator('.busy')).toBeVisible();

  await page.locator('.busy').getByRole('button', { name: '취소' }).click();
  await expect(page.locator('.file-row')).toHaveCount(2);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveTitle(/^PDF 합치기/);
  expect(await leaveIsGuarded(page)).toBe(false);
});

test('다른 탭을 보는 동안 끝나면 탭 제목으로 알리고, 돌아오면 되돌린다', async ({ page }) => {
  await openMerge(page);
  await page.evaluate(() => Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }));
  await page.getByRole('button', { name: 'PDF 합치기' }).click();
  await expect(page).toHaveTitle(/^✅ 완료되었습니다! · PDF 합치기/);

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page).toHaveTitle(/^PDF 합치기/);
});

test('결과를 다른 도구로 넘길 때는 확인 창 없이 이동한다', async ({ page }) => {
  await openMerge(page);
  await page.getByRole('button', { name: 'PDF 합치기' }).click();
  let asked = false;
  page.on('dialog', (dialog) => {
    asked = true;
    void dialog.accept();
  });
  await page.getByRole('navigation', { name: '이어서 작업하기' }).getByRole('link', { name: 'PDF 압축' }).click();
  await expect(page).toHaveURL(/\/compress-pdf\/$/);
  expect(asked).toBe(false);
});

test('파일을 여는 동안에는 파일 이름과 크기를 보여 준다', async ({ page }) => {
  // pdf.js 를 늦게 내려보내 "불러오는 중" 화면을 확인합니다.
  await page.route(/\/_astro\/pdf\.[^/]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue().catch(() => {});
  });
  await page.goto('/rotate-pdf/');
  await upload(page, [pdfFile('scan.pdf', await makePdf(2))]);
  const busy = page.locator('.busy-loading');
  await expect(busy.getByRole('heading', { name: '불러오는 중…' })).toBeVisible();
  await expect(busy).toContainText('scan.pdf ·');
  expect(await leaveIsGuarded(page)).toBe(false);
  await expect(page.locator('.file-card')).toContainText('scan.pdf');
});
