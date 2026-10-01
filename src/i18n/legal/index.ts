import type { Lang } from '../languages';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { tr } from './tr';
import type { LegalText } from './types';
import { vi } from './vi';
import { zhCn } from './zh-cn';
import { zhTw } from './zh-tw';

export type { LegalBlock, LegalSection, LegalText } from './types';

const texts: Record<Lang, LegalText> = {
  ko, en, ja, 'zh-cn': zhCn, 'zh-tw': zhTw, es, pt, fr, de, it, id, vi, tr,
};

export function getLegalText(lang: Lang): LegalText {
  return texts[lang];
}
