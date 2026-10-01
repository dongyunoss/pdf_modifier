import type { UiStrings } from '../../i18n';
import type { ToolId } from '../../tools/registry';

export type TipKey = keyof UiStrings['tips'];

/** 다른 도구를 소개하는 팁. 지금 그 도구를 쓰고 있다면 보여 주지 않습니다. */
const TIP_TOOL: Partial<Record<TipKey, ToolId>> = {
  merge: 'merge',
  compress: 'compress',
  rotate: 'rotate',
  protect: 'protect',
  jpgToPdf: 'jpg-to-pdf',
  organize: 'organize',
};

/** 처리 화면에서 돌아가며 보여 줄 팁 (사전에 적힌 순서) */
export function tipKeysFor(tips: UiStrings['tips'], tool?: ToolId): TipKey[] {
  return (Object.keys(tips) as TipKey[]).filter((key) => !tool || TIP_TOOL[key] !== tool);
}
