// 설명 글 속 {ui:경로} 를 그 언어 사전의 화면 문구로 바꿉니다 (예: {ui:tools.compress.ui.levelMedium} → "권장").
import { getDictionary, type Lang } from '../i18n';

export function uiLabel(lang: Lang, path: string): string {
  let value: unknown = getDictionary(lang);
  for (const key of path.split('.')) {
    value = value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined;
  }
  if (typeof value !== 'string') throw new Error(`사전에 없는 화면 문구: {ui:${path}} (${lang})`);
  if (/\{\w+\}/.test(value)) throw new Error(`자리표시자가 있는 문구는 쓸 수 없습니다: {ui:${path}} (${lang})`);
  return value;
}
