import { makePdf } from '../unit/helpers';
import { downloadVia, expect, openPdf, pdfFile, test, upload } from './fixtures';

test('모바일: 가로 스크롤 없이 표시되고 합치기가 동작한다', async ({ page }) => {
  for (const path of ['/', '/de/', '/vi/', '/organize-pdf/', '/en/add-watermark-to-pdf/']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
  }

  await page.goto('/merge-pdf/');
  await upload(page, [pdfFile('a.pdf', await makePdf(1)), pdfFile('b.pdf', await makePdf(2))]);
  await page.getByRole('button', { name: 'PDF 합치기' }).tap();
  const { bytes } = await downloadVia(page, '다운로드');
  expect((await openPdf(bytes)).getPageCount()).toBe(3);
});

test('모바일: 홈의 비교표는 항목마다 카드처럼 위아래로 쌓인다', async ({ page }) => {
  await page.goto('/de/');
  const table = page.locator('.compare-table');
  const width = (await table.boundingBox())!.width;
  // 긴 독일어 낱말도 중간에서 끊기지 않도록 항목 이름과 우리 쪽 칸이 카드 너비를 다 씁니다.
  for (const cell of [table.locator('tbody th').first(), table.locator('td.compare-us').first()]) {
    expect((await cell.boundingBox())!.width).toBeGreaterThan(width * 0.8);
  }
  await expect(table.locator('td').first()).toBeVisible();
});

test('모바일: 손잡이를 끌어 페이지 순서를 바꾼다', async ({ page }) => {
  await page.goto('/organize-pdf/');
  await upload(page, [pdfFile('doc.pdf', await makePdf(3))]);
  const cards = page.locator('.page-grid .page-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(2).locator('img')).toBeVisible();
  const handle = cards.nth(2).locator('[data-drag-handle]');
  const from = await handle.boundingBox();
  const target = await cards.nth(0).boundingBox();
  // 터치 포인터로 손잡이를 끌어 첫 페이지 앞에 놓기
  const cdp = await page.context().newCDPSession(page);
  const point = (x: number, y: number) => [{ x, y, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: point(from!.x + 10, from!.y + 10) });
  for (let step = 1; step <= 12; step++) {
    const x = from!.x + 10 + ((target!.x + 8 - (from!.x + 10)) * step) / 12;
    const y = from!.y + 10 + ((target!.y + target!.height / 3 - (from!.y + 10)) * step) / 12;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x, y) });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  // 사람처럼 잠시 쉰 뒤 다음 탭 (크롬은 직전 터치 직후 ~100ms 안의 탭에 click 을 만들지 않음)
  await page.waitForTimeout(300);
  await expect(page.getByRole('button', { name: '실행 취소' })).toBeEnabled();

  await page.getByRole('button', { name: '변경 사항 저장' }).tap();
  const { bytes } = await downloadVia(page, '다운로드');
  const doc = await openPdf(bytes);
  expect(doc.getPages().map((p) => Math.round(p.getHeight()))).toEqual([402, 400, 401]);
});
