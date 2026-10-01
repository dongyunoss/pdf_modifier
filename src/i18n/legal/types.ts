// 소개·개인정보처리방침·이용약관 본문 형식 (src/views/legal/LegalPage.astro 가 그립니다).
//
// - 문단 문자열에는 간단한 인라인 HTML(<strong>, <a>)을 쓸 수 있습니다.
// - 자리표시자: {site} → 사이트 이름, {date} → 시행일(언어별 날짜 형식)
// - 특수 문단: '{tools}' → 도구 목록, '{opensource}' → 사용한 오픈소스 목록, '{contact}' → 연락처 문장

/** 문단(문자열) 또는 글머리표 목록 */
export type LegalBlock = string | { list: readonly string[] };

export interface LegalSection {
  /** 없으면 제목 없이 문단만 보여 줍니다 (머리말). */
  title?: string;
  blocks: readonly LegalBlock[];
}

export interface LegalText {
  about: readonly LegalSection[];
  privacy: readonly LegalSection[];
  terms: readonly LegalSection[];
  contact: {
    /** 소개 페이지의 연락처 문장. {email} 자리에 메일 링크가 들어갑니다. */
    about: string;
    /** 개인정보처리방침의 문의 문장 */
    privacy: string;
    /** 연락처 메일(PUBLIC_CONTACT_EMAIL)이 없을 때 */
    none: string;
  };
  /** 도구 목록에서 이름 사이 구분자 (예: ', ' / '、') */
  listSeparator: string;
}
