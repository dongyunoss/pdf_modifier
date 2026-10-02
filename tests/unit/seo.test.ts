import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTENT_UPDATED, INDEXNOW_KEY } from '../../src/config/content';
import { getDictionary, LANGS, withPromise, type Lang } from '../../src/i18n';
import { TOOLS } from '../../src/tools/registry';

/** 모든 페이지 제목에 들어가야 하는 말: 각 언어의 "무료"와 "로그인(가입) 없이" */
const PROMISE_WORDS: Record<Lang, readonly [free: string, noSignUp: string]> = {
  ko: ['무료', '로그인 없이'],
  en: ['free', 'no sign-up'],
  ja: ['無料', '登録不要'],
  'zh-cn': ['免费', '无需注册'],
  'zh-tw': ['免費', '免註冊'],
  es: ['gratis', 'sin registro'],
  pt: ['grátis', 'sem cadastro'],
  fr: ['gratuit', 'sans inscription'],
  de: ['kostenlos', 'ohne anmeldung'],
  it: ['gratis', 'senza registrazione'],
  id: ['gratis', 'tanpa daftar'],
  vi: ['miễn phí', 'không cần đăng ký'],
  tr: ['ücretsiz', 'üye olmadan'],
};

describe.each(LANGS)('검색 결과에 보이는 문구: %s', (lang) => {
  const dict = getDictionary(lang);
  const titles = [dict.home.title, ...TOOLS.map((tool) => dict.tools[tool.id].title)];

  it('모든 제목에 "무료"와 "로그인 없이"가 들어 있다', () => {
    for (const title of titles) {
      for (const word of PROMISE_WORDS[lang]) expect(title.toLowerCase(), title).toContain(word);
    }
  });

  it('제목이 페이지마다 다르고 지나치게 길지 않다', () => {
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) expect(title.length, title).toBeLessThanOrEqual(80);
  });

  it('설명은 도구 소개 뒤에 약속 문장을 한 번 붙인다', () => {
    for (const tool of TOOLS) {
      const description = withPromise(lang, dict.tools[tool.id].description);
      expect(description.endsWith(dict.promise.sentence), tool.id).toBe(true);
      expect(description.split(dict.promise.sentence)).toHaveLength(2);
      expect(description).not.toMatch(/\s{2}|^\s|\s$/);
    }
  });

  it('공유 미리보기 이미지가 있다', () => {
    expect(existsSync(`public/og/${lang}.png`), `npm run generate:images 로 public/og/${lang}.png 생성`).toBe(true);
  });
});

describe('검색엔진 알림 설정', () => {
  it('IndexNow 키와 내용 날짜의 형식이 올바르다', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
    expect(CONTENT_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(CONTENT_UPDATED).toISOString().slice(0, 10)).toBe(CONTENT_UPDATED);
  });

  it('알림 스크립트(scripts/indexnow.mjs)가 읽는 형식 그대로 적혀 있다', () => {
    const source = readFileSync('src/config/content.ts', 'utf8');
    expect(source).toContain(`export const CONTENT_UPDATED = '${CONTENT_UPDATED}';`);
    expect(source).toContain(`export const INDEXNOW_KEY = '${INDEXNOW_KEY}';`);
  });
});
