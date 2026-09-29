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
  'pdf-to-jpg',
  'watermark',
  'page-numbers',
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
  { id: 'pdf-to-jpg', slug: 'pdf-to-jpg', category: 'convert', related: ['jpg-to-pdf', 'split', 'compress'] },
  { id: 'watermark', slug: 'add-watermark-to-pdf', category: 'edit', related: ['protect', 'page-numbers', 'compress'] },
  { id: 'page-numbers', slug: 'add-page-numbers-to-pdf', category: 'edit', related: ['watermark', 'merge', 'compress'] },
  { id: 'protect', slug: 'protect-pdf', category: 'security', related: ['unlock', 'watermark', 'compress'] },
  { id: 'unlock', slug: 'unlock-pdf', category: 'security', related: ['protect', 'merge', 'compress'] },
];

export const CATEGORY_ORDER: ToolCategory[] = ['organize', 'optimize', 'convert', 'edit', 'security'];

export function getTool(id: ToolId): ToolMeta {
  const tool = TOOLS.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
