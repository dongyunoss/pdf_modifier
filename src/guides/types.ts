// 가이드 글과 도구별 상세 설명의 형식입니다. 언어별 내용은 ko.ts, en.ts 에 있습니다.
import type { ToolId } from '../tools/registry';

/**
 * 본문 한 덩어리. 문자열은 문단이고, 문단 안에서
 * - {tool:merge} 는 그 도구 페이지로 가는 링크(도구 이름)가 되고,
 * - {ui:tools.compress.ui.levelMedium} 는 그 언어 사전의 화면 문구(버튼·선택지 이름)로 바뀝니다.
 *   화면 문구를 바꾸면 설명도 저절로 따라 바뀌므로, 버튼·선택지 이름은 직접 적지 말고 이 형식을 쓰세요.
 */
export type Block =
  | string
  | { list: string[] }
  | { steps: string[] }
  | { tip: string }
  | { table: { head: string[]; rows: string[][] } };

export interface Section {
  title?: string;
  blocks: Block[];
}

export interface Guide {
  /** 주소 (언어가 달라도 같은 글은 같은 slug) */
  slug: string;
  title: string;
  /** 검색 결과·목록에 보이는 한두 문장 */
  description: string;
  /** 글에서 쓰는 도구 (맨 앞이 대표 도구) */
  tools: ToolId[];
  /** YYYY-MM-DD */
  published: string;
  updated: string;
  sections: Section[];
}

export interface GuideStrings {
  nav: string;
  indexTitle: string;
  indexHeading: string;
  indexLead: string;
  indexDescription: string;
  homeTitle: string;
  homeMore: string;
  readMore: string;
  /** {n} 분 */
  minutes: string;
  /** {date} */
  updated: string;
  toolsTitle: string;
  /** {tool} */
  tryTool: string;
  moreGuides: string;
  /** {tool} */
  detailsTitle: string;
  relatedGuides: string;
  author: string;
}

/** 소개 페이지에 덧붙이는 운영자 소개와 업데이트 기록 */
export interface AboutExtra {
  operator: Section;
  updatesTitle: string;
  /** 최신순. date 는 YYYY-MM-DD (실제 배포한 날짜) */
  updates: { date: string; items: string[] }[];
}

export interface GuideSet {
  ui: GuideStrings;
  about: AboutExtra;
  guides: Guide[];
  /** 도구 페이지의 「자세히 알아보기」 */
  toolDetails: Record<ToolId, Section[]>;
}

/** 가이드가 없는 언어의 도구 페이지 「자세히 알아보기」 (src/guides/details/<언어>.ts) */
export interface ToolDetailSet {
  /** {tool} */
  title: string;
  sections: Record<ToolId, Section[]>;
}
