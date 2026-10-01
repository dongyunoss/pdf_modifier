import { describe, expect, it } from 'vitest';
import source from '../../src/i18n/auto-language.js?raw';

// BaseLayout 이 <head> 에 넣는 것과 같은 함수를 가짜 window 로 실행해 봅니다.
const autoLanguage = new Function(`return (\n${source}\n);`)() as (cfg: object, win: object) => string | null;

const cfg = {
  current: 'ko',
  path: '/merge-pdf/',
  prefixes: { ko: '/', en: '/en/', ja: '/ja/', 'zh-cn': '/zh-cn/', 'zh-tw': '/zh-tw/', es: '/es/', pt: '/pt/' },
  match: {
    ko: ['ko'],
    en: ['en'],
    ja: ['ja'],
    'zh-cn': ['zh', 'zh-cn', 'zh-sg', 'zh-hans'],
    'zh-tw': ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'],
    es: ['es'],
    pt: ['pt'],
  },
  fallback: 'en',
  storageKey: 'pdfm:lang',
};

interface Visit {
  languages?: string[];
  userAgent?: string;
  webdriver?: boolean;
  referrer?: string;
  saved?: string | null;
  storageThrows?: boolean;
  search?: string;
  hash?: string;
}

const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

function visit(page: Partial<typeof cfg>, options: Visit = {}) {
  const replaced: string[] = [];
  const languages = options.languages ?? ['ko-KR', 'ko'];
  const win = {
    navigator: { languages, language: languages[0], userAgent: options.userAgent ?? CHROME, webdriver: options.webdriver ?? false },
    document: { referrer: options.referrer ?? '' },
    location: {
      origin: 'https://pdf.example',
      search: options.search ?? '',
      hash: options.hash ?? '',
      replace: (url: string) => replaced.push(url),
    },
    get localStorage() {
      if (options.storageThrows) throw new Error('SecurityError');
      return { getItem: (key: string) => (key === cfg.storageKey ? (options.saved ?? null) : null) };
    },
  };
  const result = autoLanguage({ ...cfg, ...page }, win);
  expect(replaced).toEqual(result ? [result] : []);
  return result;
}

describe('브라우저 언어로 옮기기', () => {
  it('브라우저 언어와 페이지 언어가 같으면 그대로 둔다', () => {
    expect(visit({})).toBeNull();
    expect(visit({ current: 'en', path: '/' }, { languages: ['en-US', 'en'] })).toBeNull();
  });

  it('다른 언어 사용자는 같은 페이지의 그 언어 버전으로 옮긴다', () => {
    expect(visit({}, { languages: ['ja-JP', 'ja'] })).toBe('/ja/merge-pdf/');
    expect(visit({ path: '/' }, { languages: ['es-MX'] })).toBe('/es/');
    expect(visit({ current: 'ja', path: '/privacy/' }, { languages: ['ko-KR'] })).toBe('/privacy/');
    expect(visit({ current: 'en' }, { languages: ['pt-BR', 'en-US'] })).toBe('/pt/merge-pdf/');
  });

  it('중국어는 간체·번체를 지역과 문자 체계로 구분한다', () => {
    expect(visit({}, { languages: ['zh-CN'] })).toBe('/zh-cn/merge-pdf/');
    expect(visit({}, { languages: ['zh'] })).toBe('/zh-cn/merge-pdf/');
    expect(visit({}, { languages: ['zh-TW'] })).toBe('/zh-tw/merge-pdf/');
    expect(visit({}, { languages: ['zh-HK'] })).toBe('/zh-tw/merge-pdf/');
    expect(visit({}, { languages: ['zh-Hant-TW'] })).toBe('/zh-tw/merge-pdf/');
    expect(visit({}, { languages: ['zh-Hans-HK'] })).toBe('/zh-cn/merge-pdf/');
  });

  it('선호 언어 목록을 순서대로 보고, 지원하지 않으면 영어로 보낸다', () => {
    expect(visit({}, { languages: ['th-TH', 'es-ES', 'en'] })).toBe('/es/merge-pdf/');
    expect(visit({}, { languages: ['th-TH'] })).toBe('/en/merge-pdf/');
    expect(visit({}, { languages: [] })).toBe('/en/merge-pdf/');
  });

  it('주소의 쿼리와 해시를 유지한다', () => {
    expect(visit({}, { languages: ['ja'], search: '?a=1', hash: '#faq' })).toBe('/ja/merge-pdf/?a=1#faq');
  });

  it('언어 메뉴에서 고른 언어를 브라우저 언어보다 우선한다', () => {
    expect(visit({ current: 'ja' }, { languages: ['ja-JP'], saved: 'ko' })).toBe('/merge-pdf/');
    expect(visit({}, { languages: ['ja-JP'], saved: 'ko' })).toBeNull();
    // 알 수 없는 값은 무시
    expect(visit({}, { languages: ['ja-JP'], saved: 'xx' })).toBe('/ja/merge-pdf/');
    // 저장소를 쓸 수 없어도 브라우저 언어로 동작
    expect(visit({}, { languages: ['ja-JP'], storageThrows: true })).toBe('/ja/merge-pdf/');
  });

  it('사이트 안에서 이동했으면 옮기지 않는다', () => {
    expect(visit({}, { languages: ['ja'], referrer: 'https://pdf.example/ja/' })).toBeNull();
    expect(visit({}, { languages: ['ja'], referrer: 'https://www.google.com/' })).toBe('/ja/merge-pdf/');
    // 비슷한 이름의 다른 사이트는 바깥 사이트로 봅니다.
    expect(visit({}, { languages: ['ja'], referrer: 'https://pdf.example.evil.com/' })).toBe('/ja/merge-pdf/');
  });

  it('검색엔진·광고 크롤러와 자동화 도구는 옮기지 않는다', () => {
    const bots = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mediapartners-Google',
      'Mozilla/5.0 (compatible; Google-InspectionTool/1.0)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)',
      'facebookexternalhit/1.1;kakaotalk-scrap/1.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0 Safari/537.36',
    ];
    for (const userAgent of bots) expect(visit({}, { languages: ['en-US'], userAgent })).toBeNull();
    expect(visit({}, { languages: ['en-US'], webdriver: true })).toBeNull();
  });

  it('오래된 브라우저에서도 돌도록 ES5 문법만 쓴다', () => {
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/=>|\blet\b|\bconst\b|`|\.\.\.|\?\.|\?\?/);
  });
});
