import { readFile } from 'node:fs/promises';
import { expect, test as base, type Page } from '@playwright/test';
import { PDFDocument } from '@cantoo/pdf-lib';
import { unzipSync } from 'fflate';

export interface UploadFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export const pdfFile = (name: string, bytes: Uint8Array): UploadFile => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.from(bytes),
});

/** 페이지에서 오류(console.error, 처리되지 않은 예외)가 나면 테스트를 실패시킵니다. */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      // 애드센스 스크립트는 외부 서버에서 받아 오므로, 테스트에서는 빈 스크립트로 대신합니다.
      await page.route('https://pagead2.googlesyndication.com/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
      );
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      await use(errors);
      expect(errors, 'no errors in the page').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function upload(page: Page, files: UploadFile[]) {
  // 도구 컴포넌트가 hydrate(이벤트 연결)된 뒤에 파일을 넣어야 합니다.
  await page.locator('astro-island:not([ssr])').first().waitFor({ state: 'attached' });
  await page.locator('input[type=file]').first().setInputFiles(files);
}

/** 버튼을 눌러 받은 파일의 내용 */
export async function downloadVia(page: Page, name: string | RegExp): Promise<{ name: string; bytes: Buffer }> {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name, exact: typeof name === 'string' }).click(),
  ]);
  return { name: download.suggestedFilename(), bytes: await readFile((await download.path())!) };
}

export async function openPdf(bytes: Uint8Array, password?: string) {
  return PDFDocument.load(bytes, password === undefined ? {} : { password });
}

export function unzip(bytes: Uint8Array): Record<string, Uint8Array> {
  return unzipSync(bytes);
}

/** 브라우저 캔버스로 실제(디코딩 가능한) 이미지를 만듭니다. */
export async function makeImage(
  page: Page,
  width: number,
  height: number,
  type: 'image/jpeg' | 'image/png',
  quality = 0.95,
): Promise<Buffer> {
  const dataUrl = await page.evaluate(
    ({ width, height, type, quality }) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1d4ed8');
      gradient.addColorStop(1, '#f97316');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      // 노이즈를 섞어 JPEG 용량이 커지게 합니다 (압축 테스트용).
      const image = ctx.getImageData(0, 0, width, height);
      let seed = 1;
      for (let i = 0; i < image.data.length; i += 4) {
        seed = (seed * 16807) % 2147483647;
        const noise = (seed % 60) - 30;
        image.data[i] += noise;
        image.data[i + 1] += noise;
        image.data[i + 2] += noise;
      }
      ctx.putImageData(image, 0, 0);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.round(height / 6)}px sans-serif`;
      ctx.fillText('TEST', width / 10, height / 2);
      return canvas.toDataURL(type, quality);
    },
    { width, height, type, quality },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}
