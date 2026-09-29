// SNS 공유용 대표 이미지(public/og-image.png)와 홈 화면 아이콘(public/apple-touch-icon.png)을 만듭니다.
// 사이트 이름(PUBLIC_SITE_NAME)을 바꾼 뒤 한 번 실행하세요:  npm run generate:images
// 크로미움이 필요합니다: npx playwright install chromium  (또는 PW_CHROMIUM_PATH 로 실행 파일 지정)
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv('production', root, '');
const siteName = env.PUBLIC_SITE_NAME || 'PDF Modifier';
const favicon = readFileSync(join(root, 'public', 'favicon.svg'), 'utf8');

const escape = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const tools = [
  ['합치기', '#e5484d', '<path d="M4 4h6v7H4z"/><path d="M14 4h6v7h-6z"/><path d="M7 11v1a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-1"/><path d="M12 15v5"/><path d="m9.5 17.5 2.5 2.5 2.5-2.5"/>'],
  ['분할', '#e5484d', '<path d="M7 3h10v7H7z"/><path d="M7 14h10v7H7z"/><path d="M3 12h2"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M19 12h2"/>'],
  ['페이지 편집', '#e5484d', '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>'],
  ['압축', '#16a34a', '<path d="M4 9h5V4"/><path d="M20 9h-5V4"/><path d="M4 15h5v5"/><path d="M20 15h-5v5"/>'],
  ['JPG ↔ PDF', '#d97706', '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'],
  ['워터마크', '#7c3aed', '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'],
  ['페이지 번호', '#7c3aed', '<path d="M5 9h14"/><path d="M5 15h14"/><path d="M10 4 8 20"/><path d="m16 4-2 16"/>'],
  ['암호', '#0284c7', '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'],
];

const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR', 'Malgun Gothic', sans-serif;
    background: radial-gradient(circle at 85% 15%, #ffe4e4 0, transparent 45%), linear-gradient(135deg, #ffffff 0%, #f4f5f8 100%);
    color: #161a21; display: flex; align-items: center; padding: 72px; gap: 56px; }
  .left { flex: 1; }
  .brand { display: flex; align-items: center; gap: 18px; font-size: 40px; font-weight: 800; }
  .brand svg { width: 72px; height: 72px; }
  h1 { font-size: 64px; line-height: 1.18; margin: 36px 0 22px; letter-spacing: -1px; }
  p { font-size: 30px; color: #5a6272; }
  .badges { display: flex; gap: 12px; margin-top: 32px; }
  .badge { padding: 10px 20px; border-radius: 999px; background: #fff; border: 2px solid #e1e4ea; font-size: 24px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(2, 170px); gap: 16px; }
  .tile { background: #fff; border: 2px solid #e8ebf0; border-radius: 22px; padding: 18px; display: grid; gap: 10px; box-shadow: 0 8px 20px rgb(16 24 40 / 8%); }
  .tile svg { width: 44px; height: 44px; }
  .tile span { font-size: 22px; font-weight: 700; }
</style></head><body>
  <div class="left">
    <div class="brand">${favicon}<span>${escape(siteName)}</span></div>
    <h1>PDF 합치기·분할·편집<br>브라우저에서 무료로</h1>
    <p>설치 없음 · 회원가입 없음 · 파일 업로드 없음</p>
    <div class="badges"><span class="badge">100% 무료</span><span class="badge">Free PDF Tools</span></div>
  </div>
  <div class="grid">
    ${tools
      .map(
        ([name, color, path]) =>
          `<div class="tile"><svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg><span>${name}</span></div>`,
      )
      .join('')}
  </div>
</body></html>`;

const iconHtml = `<!doctype html><html><head><style>*{margin:0} body{width:180px;height:180px;background:#e5484d;display:grid;place-items:center}
svg{width:150px;height:150px}</style></head><body>${favicon.replace('rx="8"', 'rx="0"')}</body></html>`;

const executablePath = process.env.PW_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(ogHtml);
await page.screenshot({ path: join(root, 'public', 'og-image.png') });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(iconHtml);
await page.screenshot({ path: join(root, 'public', 'apple-touch-icon.png') });
await browser.close();
console.log('generated public/og-image.png, public/apple-touch-icon.png');
