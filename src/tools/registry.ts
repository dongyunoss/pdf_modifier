// 도구 목록. 새 도구를 추가하려면 여기에 등록하고 i18n 사전과 컴포넌트를 추가하세요.
export const TOOL_IDS = [
  'merge',
  'split',
  'organize',
  'rotate',
  'delete-pages',
  'extract-pages',
  'compress',
  'jpg-to-pdf',
  'word-to-pdf',
  'ppt-to-pdf',
  'pdf-to-jpg',
  'watermark',
  'page-numbers',
  'sign',
  'protect',
  'unlock',
] as const;

export type ToolId = (typeof TOOL_IDS)[number];

export type ToolCategory = 'organize' | 'optimize' | 'convert' | 'edit' | 'security';

export interface ToolMeta {
  id: ToolId;
  /** URL 경로 (검색 키워드를 반영한 영문 슬러그) */
  slug: string;
  category: ToolCategory;
  /** 결과 화면에서 이어서 추천할 도구 */
  related: ToolId[];
}

export const TOOLS: ToolMeta[] = [
  { id: 'merge', slug: 'merge-pdf', category: 'organize', related: ['compress', 'organize', 'page-numbers'] },
  { id: 'split', slug: 'split-pdf', category: 'organize', related: ['extract-pages', 'merge', 'compress'] },
  { id: 'organize', slug: 'organize-pdf', category: 'organize', related: ['merge', 'compress', 'page-numbers'] },
  { id: 'rotate', slug: 'rotate-pdf', category: 'organize', related: ['organize', 'compress', 'merge'] },
  { id: 'delete-pages', slug: 'delete-pdf-pages', category: 'organize', related: ['organize', 'extract-pages', 'compress'] },
  { id: 'extract-pages', slug: 'extract-pdf-pages', category: 'organize', related: ['split', 'merge', 'compress'] },
  { id: 'compress', slug: 'compress-pdf', category: 'optimize', related: ['merge', 'protect', 'split'] },
  { id: 'jpg-to-pdf', slug: 'jpg-to-pdf', category: 'convert', related: ['merge', 'compress', 'organize'] },
  { id: 'word-to-pdf', slug: 'word-to-pdf', category: 'convert', related: ['merge', 'compress', 'sign'] },
  { id: 'ppt-to-pdf', slug: 'ppt-to-pdf', category: 'convert', related: ['compress', 'merge', 'pdf-to-jpg'] },
  { id: 'pdf-to-jpg', slug: 'pdf-to-jpg', category: 'convert', related: ['jpg-to-pdf', 'split', 'compress'] },
  { id: 'watermark', slug: 'add-watermark-to-pdf', category: 'edit', related: ['protect', 'page-numbers', 'compress'] },
  { id: 'page-numbers', slug: 'add-page-numbers-to-pdf', category: 'edit', related: ['watermark', 'merge', 'compress'] },
  { id: 'sign', slug: 'sign-pdf', category: 'edit', related: ['protect', 'merge', 'compress'] },
  { id: 'protect', slug: 'protect-pdf', category: 'security', related: ['unlock', 'watermark', 'compress'] },
  { id: 'unlock', slug: 'unlock-pdf', category: 'security', related: ['protect', 'merge', 'compress'] },
];

/**
 * Word·PPT → PDF 처럼 LibreOffice 엔진으로 변환하는 도구.
 * 엔진이 교차 출처 격리(COOP/COEP)를 요구하므로 실제 변환은 별도 화면(/convert/<slug>/)에서 합니다.
 */
export const OFFICE_TOOLS = { 'word-to-pdf': 'word', 'ppt-to-pdf': 'ppt' } as const satisfies Partial<Record<ToolId, 'word' | 'ppt'>>;
export type OfficeToolId = keyof typeof OFFICE_TOOLS;
export const isOfficeTool = (id: ToolId): id is OfficeToolId => id in OFFICE_TOOLS;

/** PDF 를 입력으로 받지 않는 도구 (결과 PDF 를 넘겨줄 수 없음) */
export const NON_PDF_INPUT: ReadonlySet<ToolId> = new Set(['jpg-to-pdf', 'word-to-pdf', 'ppt-to-pdf']);

export const CATEGORY_ORDER: ToolCategory[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

export function getTool(id: ToolId): ToolMeta {
  const tool = TOOLS.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
