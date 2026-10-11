// 가이드 글과 도구별 상세 설명의 형식입니다. 언어별 내용은 ko.ts, en.ts 에 있습니다.
import type { ToolId } from '../tools/registry';

/**
 * 본문 한 덩어리. 문자열은 문단이고, 문단 안의 {tool:merge} 는 그 도구 페이지로 가는 링크(도구 이름)가 됩니다.
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

export interface GuideSet {
  ui: GuideStrings;
  guides: Guide[];
  /** 도구 페이지의 「자세히 알아보기」 */
  toolDetails: Record<ToolId, Section[]>;
}
