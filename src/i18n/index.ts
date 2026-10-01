import { getTool, type ToolId } from '../tools/registry';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { DEFAULT_LANG, LANGS, type Lang } from './languages';
import { pt } from './pt';
import { tr } from './tr';
import { vi } from './vi';
import { zhCn } from './zh-cn';
import { zhTw } from './zh-tw';

export { fmt } from './format';
export { DEFAULT_LANG, FALLBACK_LANG, LANG_STORAGE_KEY, LANGS, LANGUAGES, type Lang } from './languages';

export type Dictionary = typeof ko;
export type UiStrings = Dictionary['ui'];
export type ErrorStrings = Dictionary['errors'];
export type ToolUi<K extends ToolId> = Dictionary['tools'][K]['ui'];

const dictionaries: Record<Lang, Dictionary> = {
  ko, en, ja, 'zh-cn': zhCn, 'zh-tw': zhTw, es, pt, fr, de, it, id, vi, tr,
};

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** 언어별 URL 접두사: 기본 언어(한국어)는 루트, 나머지는 /en/, /ja/ 처럼 */
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

const prefixPattern = new RegExp(`^/(${LANGS.filter((code) => code !== DEFAULT_LANG).join('|')})(?=/|$)`);

/** 언어 접두사를 뗀 경로 (예: /ja/merge-pdf/ → /merge-pdf/) */
export function neutralPath(pathname: string): string {
  return pathname.replace(prefixPattern, '') || '/';
}

/** 현재 경로와 같은 페이지의 다른 언어 경로 */
export function switchLangPath(pathname: string, target: Lang): string {
  return `${langPrefix(target)}${neutralPath(pathname).slice(1)}`;
}

/** 기본 언어(루트)를 뺀 언어들 — /[lang]/ 경로를 만들 때 사용 */
export const PREFIXED_LANGS = LANGS.filter((code) => code !== DEFAULT_LANG);
