import { describe, expect, it } from 'vitest';
import { getDictionary, LANGS, switchLangPath, neutralPath } from '../../src/i18n';
import { getLegalText, type LegalText } from '../../src/i18n/legal';

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

/** 기준(영어) 사전과 같은 자리에 있는 문자열·배열을 짝지어 돌려줍니다. */
function* pairs(source: unknown, target: unknown, path: string): Generator<[string, unknown, unknown]> {
  yield [path, source, target];
  if (source && typeof source === 'object') {
    for (const key of Object.keys(source)) {
      yield* pairs((source as Record<string, unknown>)[key], (target as Record<string, unknown> | undefined)?.[key], `${path}.${key}`);
    }
  }
}

const english = getDictionary('en');

describe.each(LANGS.filter((lang) => lang !== 'en'))('사전: %s', (lang) => {
  const dict = getDictionary(lang);

  it('영어 사전과 같은 구조와 자리표시자를 가진다', () => {
    for (const [path, source, target] of pairs(english, dict, lang)) {
      if (Array.isArray(source)) {
        expect(Array.isArray(target), path).toBe(true);
        expect((target as unknown[]).length, `${path} 길이`).toBe(source.length);
      } else if (typeof source === 'string') {
        expect(typeof target, path).toBe('string');
        expect((target as string).trim(), `${path} 비어 있음`).not.toBe('');
        expect(placeholders(target as string), `${path} 자리표시자`).toEqual(placeholders(source));
      }
    }
  });
});

const legalStrings = (text: LegalText) =>
  [...text.about, ...text.privacy, ...text.terms].flatMap((section) => [
    section.title ?? '',
    ...section.blocks.flatMap((block) => (typeof block === 'string' ? [block] : block.list)),
  ]);

describe.each(LANGS)('법적 문서: %s', (lang) => {
  const text = getLegalText(lang);
  const joined = (page: keyof Pick<LegalText, 'about' | 'privacy' | 'terms'>) =>
    text[page].flatMap((section) => section.blocks.flatMap((block) => (typeof block === 'string' ? [block] : block.list))).join('\n');

  it('필요한 자리표시자와 특수 문단이 있다', () => {
    expect(joined('about')).toContain('{tools}');
    expect(joined('about')).toContain('{opensource}');
    expect(joined('about')).toContain('{contact}');
    expect(joined('privacy')).toContain('{contact}');
    expect(joined('privacy')).toContain('{date}');
    expect(joined('terms')).toContain('{date}');
    expect(text.contact.about).toContain('{email}');
    expect(text.contact.privacy).toContain('{email}');
  });

  it('인라인 HTML 태그가 짝이 맞는다', () => {
    for (const html of legalStrings(text)) {
      expect((html.match(/<a /g) ?? []).length, html).toBe((html.match(/<\/a>/g) ?? []).length);
      expect((html.match(/<strong>/g) ?? []).length, html).toBe((html.match(/<\/strong>/g) ?? []).length);
    }
  });

  it('영어 문서와 같은 수의 항목을 가진다', () => {
    const en = getLegalText('en');
    for (const page of ['about', 'privacy', 'terms'] as const) expect(text[page].length, page).toBe(en[page].length);
  });
});

describe('언어별 주소', () => {
  it('같은 페이지의 다른 언어 주소를 만든다', () => {
    expect(neutralPath('/en/merge-pdf/')).toBe('/merge-pdf/');
    expect(neutralPath('/merge-pdf/')).toBe('/merge-pdf/');
    expect(switchLangPath('/merge-pdf/', 'en')).toBe('/en/merge-pdf/');
    expect(switchLangPath('/en/', 'ko')).toBe('/');
    expect(switchLangPath('/en/privacy/', 'ko')).toBe('/privacy/');
  });
});
