// 지원 언어 목록 (사전 없이 가볍게 불러 쓸 수 있도록 따로 둡니다).
// 언어를 추가하려면 여기에 한 줄을 더하고, 같은 코드의 사전(./<코드>.ts)과 법적 문서(./legal/<코드>.ts)를 만든 뒤
// ./index.ts 와 ./legal/index.ts 에 등록하세요.

export interface LanguageInfo {
  /** 언어 선택 메뉴에 보이는 이름 (그 언어로) */
  name: string;
  /** <html lang> 과 hreflang 값 */
  htmlLang: string;
  /** og:locale 값 */
  ogLocale: string;
  /** 숫자·날짜 표시에 쓰는 Intl 로케일 */
  locale: string;
  /** 구조화 데이터(무료 가격 0)의 통화 */
  currency: string;
  /**
   * 브라우저 언어 태그와 맞춰 볼 접두사 (소문자). 가장 길게 일치하는 언어가 선택됩니다.
   * 예: zh-hk → zh-tw, zh → zh-cn
   */
  match: readonly string[];
}

export const LANGUAGES = {
  ko: { name: '한국어', htmlLang: 'ko', ogLocale: 'ko_KR', locale: 'ko-KR', currency: 'KRW', match: ['ko'] },
  en: { name: 'English', htmlLang: 'en', ogLocale: 'en_US', locale: 'en-US', currency: 'USD', match: ['en'] },
  ja: { name: '日本語', htmlLang: 'ja', ogLocale: 'ja_JP', locale: 'ja-JP', currency: 'JPY', match: ['ja'] },
  'zh-cn': {
    name: '简体中文',
    htmlLang: 'zh-CN',
    ogLocale: 'zh_CN',
    locale: 'zh-CN',
    currency: 'CNY',
    match: ['zh', 'zh-cn', 'zh-sg', 'zh-my', 'zh-hans'],
  },
  'zh-tw': {
    name: '繁體中文',
    htmlLang: 'zh-TW',
    ogLocale: 'zh_TW',
    locale: 'zh-TW',
    currency: 'TWD',
    match: ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'],
  },
  es: { name: 'Español', htmlLang: 'es', ogLocale: 'es_ES', locale: 'es', currency: 'USD', match: ['es'] },
  pt: { name: 'Português', htmlLang: 'pt', ogLocale: 'pt_BR', locale: 'pt-BR', currency: 'BRL', match: ['pt'] },
  fr: { name: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR', locale: 'fr-FR', currency: 'EUR', match: ['fr'] },
  de: { name: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE', locale: 'de-DE', currency: 'EUR', match: ['de'] },
  it: { name: 'Italiano', htmlLang: 'it', ogLocale: 'it_IT', locale: 'it-IT', currency: 'EUR', match: ['it'] },
  id: { name: 'Bahasa Indonesia', htmlLang: 'id', ogLocale: 'id_ID', locale: 'id-ID', currency: 'IDR', match: ['id', 'in'] },
  vi: { name: 'Tiếng Việt', htmlLang: 'vi', ogLocale: 'vi_VN', locale: 'vi-VN', currency: 'VND', match: ['vi'] },
  tr: { name: 'Türkçe', htmlLang: 'tr', ogLocale: 'tr_TR', locale: 'tr-TR', currency: 'TRY', match: ['tr'] },
} as const satisfies Record<string, LanguageInfo>;

export type Lang = keyof typeof LANGUAGES;

/** 메뉴·사이트맵에 나오는 순서 */
export const LANGS = Object.keys(LANGUAGES) as Lang[];

/** 주소에 언어 접두사가 붙지 않는 기본 언어 (루트 /) */
export const DEFAULT_LANG: Lang = 'ko';

/** 브라우저 언어가 어느 언어와도 맞지 않을 때 보여 줄 언어 (hreflang x-default) */
export const FALLBACK_LANG: Lang = 'en';

/** 언어 선택 메뉴에서 고른 언어를 기억하는 localStorage 키 */
export const LANG_STORAGE_KEY = 'pdfm:lang';
