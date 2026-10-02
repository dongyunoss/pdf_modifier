// 사이트맵의 모든 주소를 IndexNow 로 알립니다. 한 번 보내면 빙·네이버·얀덱스·Seznam·Yep 이 함께 받습니다.
//   node scripts/indexnow.mjs            지금 공개된 사이트맵의 주소를 바로 알림
//   node scripts/indexnow.mjs --wait     src/config/content.ts 의 날짜가 공개 사이트맵에 반영될 때까지(=새 배포 완료) 기다렸다가 알림
//   node scripts/indexnow.mjs --dry-run  보낼 주소만 출력
// 사이트 주소는 환경 변수 PUBLIC_SITE_URL (없으면 https://pdfmodifier.app) 입니다. INDEXNOW_ENDPOINT 로 받는 곳을 바꿀 수 있습니다(시험용).
// main 브랜치에서는 .github/workflows/indexnow.yml 이 --wait 로 자동 실행합니다.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const WAIT_MINUTES = 20;
const POLL_SECONDS = 30;
/**
 * 거절되었을 때 다시 보내기 전에 기다리는 시간(분). 키를 처음 쓰거나 막 공개했을 때는 검색엔진이 키 파일을
 * 확인하는 동안 403 SiteVerificationNotCompleted 가 오므로, 잠시 뒤 다시 보내면 됩니다. (합계 15분)
 */
const RETRY_MINUTES = [1, 2, 3, 4, 5];
/** IndexNow 한 번에 보낼 수 있는 최대 주소 수 */
const BATCH = 10_000;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const site = (process.env.PUBLIC_SITE_URL || 'https://pdfmodifier.app').trim().replace(/\/+$/, '');
const host = new URL(site).host;

// 빌드 도구 없이 실행할 수 있도록 TS 설정 파일에서 값만 읽습니다.
const config = readFileSync(join(root, 'src/config/content.ts'), 'utf8');
const setting = (name) => {
  const match = config.match(new RegExp(`export const ${name} = '([^']+)'`));
  if (!match) throw new Error(`src/config/content.ts 에서 ${name} 값을 찾지 못했습니다.`);
  return match[1];
};
const updated = setting('CONTENT_UPDATED');
const key = setting('INDEXNOW_KEY');
const keyLocation = `${site}/${key}.txt`;

async function fetchText(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return response.text();
}

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));

/** 공개 사이트맵의 주소들과, 모든 주소의 lastmod 가 CONTENT_UPDATED 인지(새 배포가 공개되었는지) */
async function readSitemap() {
  const urls = [];
  let fresh = true;
  for (const sitemap of locs(await fetchText(`${site}/sitemap-index.xml`))) {
    const xml = await fetchText(sitemap);
    const entries = locs(xml);
    const current = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].filter((match) => match[1].startsWith(updated));
    if (current.length < entries.length) fresh = false;
    urls.push(...entries);
  }
  return { urls, fresh };
}

async function waitForDeploy() {
  const deadline = Date.now() + WAIT_MINUTES * 60_000;
  for (;;) {
    let status;
    try {
      const [{ urls, fresh }, keyFile] = await Promise.all([readSitemap(), fetchText(keyLocation)]);
      if (fresh && keyFile.trim() === key) return urls;
      status = `사이트맵 날짜 ${fresh ? '반영됨' : '아직 이전 값'}, 키 파일 ${keyFile.trim() === key ? '확인됨' : '내용 다름'}`;
    } catch (error) {
      status = error.message;
    }
    if (Date.now() > deadline) throw new Error(`${WAIT_MINUTES}분 동안 새 배포를 확인하지 못했습니다 (${status}).`);
    console.log(`배포를 기다리는 중… (${status})`);
    await new Promise((resolve) => setTimeout(resolve, POLL_SECONDS * 1000));
  }
}

async function submit(urlList) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    // 200: 접수됨, 202: 접수됨(키 확인 대기 중). 나머지는 실패입니다 (403 키 불일치·확인 전, 422 다른 호스트 주소, 429 너무 잦은 요청).
    if (response.status === 200 || response.status === 202) {
      console.log(`IndexNow 에 주소 ${urlList.length}개를 보냈습니다 (HTTP ${response.status}).`);
      return;
    }
    const body = (await response.text()).slice(0, 500);
    const temporary =
      response.status === 429 || response.status >= 500 || body.includes('SiteVerificationNotCompleted');
    if (!temporary || attempt >= RETRY_MINUTES.length) {
      throw new Error(`IndexNow 가 거절했습니다: HTTP ${response.status} ${body}`);
    }
    console.log(`IndexNow 응답 HTTP ${response.status} ${body} — ${RETRY_MINUTES[attempt]}분 뒤 다시 보냅니다.`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_MINUTES[attempt] * 60_000));
  }
}

try {
  let urls;
  if (args.has('--wait')) {
    urls = await waitForDeploy();
  } else {
    const sitemap = await readSitemap();
    if (!sitemap.fresh) console.warn(`주의: 공개 사이트맵의 lastmod 가 ${updated} 가 아닙니다. 새 배포가 끝났는지 확인하세요.`);
    urls = sitemap.urls;
  }
  const own = [...new Set(urls)].filter((url) => new URL(url).host === host);
  if (own.length === 0) throw new Error(`${site} 사이트맵에서 주소를 찾지 못했습니다.`);
  if (args.has('--dry-run')) {
    console.log(own.join('\n'));
    console.log(`(--dry-run: ${own.length}개, 보내지 않음)`);
  } else {
    for (let start = 0; start < own.length; start += BATCH) await submit(own.slice(start, start + BATCH));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
