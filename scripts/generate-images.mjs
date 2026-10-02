// 언어별 공유 미리보기 이미지(public/og/<언어>.png)와 홈 화면 아이콘(public/apple-touch-icon.png)을 만듭니다.
// 이미지 문구는 각 언어 사전의 home.h1 과 promise.points 입니다. 문구나 사이트 이름(PUBLIC_SITE_NAME)을 바꾼 뒤 실행하세요:
//   npm run generate:images
// 크로미움이 필요합니다: npx playwright install chromium  (또는 PW_CHROMIUM_PATH 로 실행 파일 지정)
// 글꼴은 컴퓨터에 설치된 Noto Sans(KR·JP·SC·TC 포함)를 우선 쓰고, 없으면 운영체제 기본 글꼴로 그립니다.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, runnerImport } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = loadEnv('production', root, '');
const siteName = env.PUBLIC_SITE_NAME || 'PDF Modifier';
const siteHost = new URL(env.PUBLIC_SITE_URL || 'https://pdfmodifier.app').hostname;
const favicon = readFileSync(join(root, 'public', 'favicon.svg'), 'utf8');

const { module: i18n } = await runnerImport(join(root, 'src/i18n/index.ts'));
const { module: icons } = await runnerImport(join(root, 'src/components/icon-paths.ts'));
const { LANGS, LANGUAGES, DEFAULT_LANG, getDictionary } = i18n;

const escape = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** 한자 모양이 언어마다 다르므로 언어별 글꼴을 앞에 둡니다. */
const FONTS = {
  ko: "'Noto Sans KR', 'Noto Sans CJK KR', 'Apple SD Gothic Neo', 'Malgun Gothic'",
  ja: "'Noto Sans JP', 'Noto Sans CJK JP', 'Hiragino Sans', 'Yu Gothic'",
  'zh-cn': "'Noto Sans SC', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei'",
  'zh-tw': "'Noto Sans TC', 'Noto Sans CJK TC', 'PingFang TC', 'Microsoft JhengHei'",
};
const fontFor = (lang) => `'Noto Sans', ${FONTS[lang] ? `${FONTS[lang]}, ` : ''}'Segoe UI', Roboto, Arial, sans-serif`;

// 오른쪽 타일: 대표 도구 9개 (색은 사이트의 분류 색)
const TILES = [
  ['merge', '#e5484d'],
  ['split', '#e5484d'],
  ['organize', '#e5484d'],
  ['compress', '#16a34a'],
  ['jpg-to-pdf', '#d97706'],
  ['pdf-to-jpg', '#d97706'],
  ['watermark', '#7c3aed'],
  ['page-numbers', '#7c3aed'],
  ['protect', '#0284c7'],
];

const check = icons.ICON_PATHS.check;

function ogHtml(lang) {
  const dict = getDictionary(lang);
  return `<!doctype html><html lang="${LANGUAGES[lang].htmlLang}"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: ${fontFor(lang)};
    background: radial-gradient(circle at 88% 12%, #ffe4e4 0, transparent 42%), linear-gradient(135deg, #ffffff 0%, #f4f5f8 100%);
    color: #161a21; display: flex; align-items: center; gap: 56px; padding: 64px 72px; }
  .left { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100%; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 800; }
  .brand svg { width: 60px; height: 60px; }
  .main { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  h1 { font-size: 64px; line-height: 1.16; font-weight: 800; letter-spacing: -0.02em; overflow-wrap: anywhere; }
  /* 한국어·중국어는 띄어쓰기와 문장 부호에서만 줄을 바꿉니다 (띄어쓰기가 없는 일본어는 글자 단위). */
  h1:lang(ko), h1:lang(zh) { word-break: keep-all; }
  .points { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; padding: 0; list-style: none; }
  .points li { display: flex; align-items: center; gap: 8px; padding: 10px 18px 10px 14px; border-radius: 999px;
    background: #fff; border: 2px solid #d9efe0; color: #15803d; font-size: 25px; font-weight: 700; white-space: nowrap; }
  .points svg { width: 26px; height: 26px; flex: none; }
  .host { font-size: 24px; font-weight: 600; color: #8a92a1; }
  .grid { display: grid; grid-template-columns: repeat(3, 104px); gap: 16px; flex: none; }
  .tile { display: grid; place-items: center; height: 104px; border-radius: 26px; background: #fff; border: 2px solid #e8ebf0;
    box-shadow: 0 8px 20px rgb(16 24 40 / 8%); }
  .tile svg { width: 50px; height: 50px; }
</style></head><body>
  <div class="left">
    <div class="brand">${favicon}<span>${escape(siteName)}</span></div>
    <div class="main">
      <h1>${escape(dict.home.h1)}</h1>
      <ul class="points">${dict.promise.points
        .map(
          (point) =>
            `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${check}</svg>${escape(point)}</li>`,
        )
        .join('')}</ul>
    </div>
    <div class="host">${escape(siteHost)}</div>
  </div>
  <div class="grid">${TILES.map(
    ([id, color]) =>
      `<div class="tile"><svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons.ICON_PATHS[id]}</svg></div>`,
  ).join('')}</div>
</body></html>`;
}

/** 제목이 길면 글자 크기를 줄여 이미지 안에 맞춥니다. */
async function fitText(page) {
  await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const main = document.querySelector('.main');
    const points = document.querySelector('.points');
    let size = 64;
    const overflowing = () =>
      h1.scrollWidth > h1.clientWidth ||
      h1.offsetHeight + points.offsetHeight + 30 > main.clientHeight - 40 ||
      h1.offsetHeight > size * 1.16 * 3 + 1;
    while (size > 36 && overflowing()) {
      size -= 2;
      h1.style.fontSize = `${size}px`;
    }
  });
}

const iconHtml = `<!doctype html><html><head><style>*{margin:0} body{width:180px;height:180px;background:#e5484d;display:grid;place-items:center}
svg{width:150px;height:150px}</style></head><body>${favicon.replace('rx="8"', 'rx="0"')}</body></html>`;

const executablePath = process.env.PW_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
mkdirSync(join(root, 'public', 'og'), { recursive: true });
for (const lang of LANGS) {
  await page.setContent(ogHtml(lang));
  await page.evaluate(() => document.fonts.ready);
  await fitText(page);
  await page.screenshot({ path: join(root, 'public', 'og', `${lang}.png`) });
  // 예전 주소(/og-image.png)를 기억하는 공유 링크를 위해 기본 언어 이미지를 한 장 더 둡니다.
  if (lang === DEFAULT_LANG) await page.screenshot({ path: join(root, 'public', 'og-image.png') });
}
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(iconHtml);
await page.screenshot({ path: join(root, 'public', 'apple-touch-icon.png') });
await browser.close();
console.log(`generated public/og/{${LANGS.join(',')}}.png, public/og-image.png, public/apple-touch-icon.png`);
