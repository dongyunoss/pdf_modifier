import { describe, expect, it } from 'vitest';
import { getGuideSet, GUIDE_LANGS, guidesForTool, readingMinutes, type Block } from '../../src/guides';
import { TOOLS } from '../../src/tools/registry';

const toolIds = new Set<string>(TOOLS.map((tool) => tool.id));
const texts = (block: Block): string[] => {
  if (typeof block === 'string') return [block];
  if ('list' in block) return block.list;
  if ('steps' in block) return block.steps;
  if ('tip' in block) return [block.tip];
  return [...block.table.head, ...block.table.rows.flat()];
};

describe('가이드', () => {
  const [base, ...others] = GUIDE_LANGS.map((lang) => getGuideSet(lang)!);

  it('한국어와 영어가 같은 글(slug)을 같은 순서로 가진다', () => {
    expect(GUIDE_LANGS).toEqual(['ko', 'en']);
    for (const set of others) expect(set.guides.map((g) => g.slug)).toEqual(base.guides.map((g) => g.slug));
  });

  describe.each(GUIDE_LANGS)('%s', (lang) => {
    const set = getGuideSet(lang)!;

    it('모든 도구에 상세 설명이 있다', () => {
      for (const tool of TOOLS) expect(set.toolDetails[tool.id]?.length, tool.id).toBeGreaterThanOrEqual(2);
    });

    it('글마다 제목·설명이 다르고, 날짜와 도구가 올바르다', () => {
      expect(new Set(set.guides.map((g) => g.title)).size).toBe(set.guides.length);
      for (const guide of set.guides) {
        expect(guide.slug).toMatch(/^[a-z0-9-]+$/);
        expect(guide.description.length, guide.slug).toBeLessThanOrEqual(200);
        expect(guide.updated >= guide.published).toBe(true);
        for (const id of guide.tools) expect(toolIds.has(id), id).toBe(true);
        expect(readingMinutes(lang, guide.sections), guide.slug).toBeGreaterThanOrEqual(2);
      }
    });

    it('본문의 도구 링크 {tool:id} 가 실제 도구를 가리킨다', () => {
      const sections = [...set.guides.flatMap((g) => g.sections), ...Object.values(set.toolDetails).flat()];
      for (const text of sections.flatMap((s) => s.blocks.flatMap(texts))) {
        for (const [, id] of text.matchAll(/\{tool:([^}]*)\}/g)) expect(toolIds.has(id), text).toBe(true);
      }
    });

    it('도구 페이지에 보여 줄 관련 가이드가 대표 도구 글부터 나온다', () => {
      expect(guidesForTool(lang, 'compress')[0].slug).toBe('reduce-pdf-file-size');
    });
  });
});
