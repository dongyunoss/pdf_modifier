import { getTool, type ToolId } from '../tools/registry';
import { en } from './en';
import { ko } from './ko';

export type Dictionary = typeof ko;
export type UiStrings = Dictionary['ui'];
export type ErrorStrings = Dictionary['errors'];
export type ToolUi<K extends ToolId> = Dictionary['tools'][K]['ui'];

export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ko';

const dictionaries: Record<Lang, Dictionary> = { ko, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** "{n}쪽" 같은 템플릿의 {이름} 자리에 값을 채웁니다. */
export function fmt(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** 언어별 URL 접두사: 기본 언어(한국어)는 루트, 나머지는 /en/ 처럼 */
export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}

export function toolPath(lang: Lang, id: ToolId): string {
  return `${langPrefix(lang)}${getTool(id).slug}/`;
}

export type StaticPage = 'about' | 'privacy' | 'terms';

export function pagePath(lang: Lang, page?: StaticPage): string {
  return page ? `${langPrefix(lang)}${page}/` : langPrefix(lang);
}

/** 현재 경로와 같은 페이지의 다른 언어 경로 */
export function switchLangPath(pathname: string, target: Lang): string {
  const pattern = new RegExp(`^/(${LANGS.filter((l) => l !== DEFAULT_LANG).join('|')})(?=/|$)`);
  const stripped = pathname.replace(pattern, '') || '/';
  return target === DEFAULT_LANG ? stripped : `/${target}${stripped === '/' ? '/' : stripped}`;
}
