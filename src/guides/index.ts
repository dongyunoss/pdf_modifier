// 가이드(직접 쓴 설명 글)는 한국어와 영어로만 제공합니다. 다른 언어 페이지에서는 가이드 링크를 보여 주지 않습니다.
import { langPrefix, type Lang } from '../i18n';
import type { ToolId } from '../tools/registry';
import { en } from './en';
import { ko } from './ko';
import { DETAILS } from './details';
import type { Block, Guide, GuideSet, Section, ToolDetailSet } from './types';

export type { Block, Guide, GuideSet, Section, ToolDetailSet } from './types';

const sets: Partial<Record<Lang, GuideSet>> = { ko, en };

/** 가이드가 있는 언어 */
export const GUIDE_LANGS = Object.keys(sets) as Lang[];

export function getGuideSet(lang: Lang): GuideSet | undefined {
  return sets[lang];
}

/** 도구 페이지의 「자세히 알아보기」 — 가이드가 있는 언어는 가이드 파일에서, 나머지는 details/ 에서 가져옵니다. */
export function getToolDetails(lang: Lang): ToolDetailSet | undefined {
  const set = sets[lang];
  return set ? { title: set.ui.detailsTitle, sections: set.toolDetails } : DETAILS[lang];
}

export function guidesPath(lang: Lang): string {
  return `${langPrefix(lang)}guides/`;
}

export function guidePath(lang: Lang, slug: string): string {
  return `${guidesPath(lang)}${slug}/`;
}

/** 이 도구를 다루는 가이드 (대표 도구로 다루는 글이 먼저) */
export function guidesForTool(lang: Lang, id: ToolId): Guide[] {
  const set = sets[lang];
  if (!set) return [];
  return set.guides
    .filter((guide) => guide.tools.includes(id))
    .sort((a, b) => a.tools.indexOf(id) - b.tools.indexOf(id));
}

const textOf = (block: Block): string => {
  if (typeof block === 'string') return block;
  if ('list' in block) return block.list.join(' ');
  if ('steps' in block) return block.steps.join(' ');
  if ('tip' in block) return block.tip;
  return [...block.table.head, ...block.table.rows.flat()].join(' ');
};

/** 읽는 데 걸리는 시간(분). 한국어는 분당 약 500자, 영어는 분당 약 220단어로 셉니다. */
export function readingMinutes(lang: Lang, sections: Section[]): number {
  const text = sections.flatMap((section) => [section.title ?? '', ...section.blocks.map(textOf)]).join(' ');
  const amount = lang === 'ko' ? text.replace(/\s+/g, '').length / 500 : text.split(/\s+/).length / 220;
  return Math.max(1, Math.round(amount));
}
