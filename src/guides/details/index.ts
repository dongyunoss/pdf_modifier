// 가이드가 없는 언어의 도구 페이지 「자세히 알아보기」. 한국어·영어는 가이드 파일(../ko.ts, ../en.ts)에 있습니다.
import type { Lang } from '../../i18n/languages';
import type { ToolDetailSet } from '../types';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { pt } from './pt';
import { tr } from './tr';
import { vi } from './vi';
import { zhCn } from './zh-cn';
import { zhTw } from './zh-tw';

export const DETAILS: Partial<Record<Lang, ToolDetailSet>> = {
  ja, 'zh-cn': zhCn, 'zh-tw': zhTw, es, pt, fr, de, it, id, vi, tr,
};
