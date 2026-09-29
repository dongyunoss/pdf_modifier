import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { fmt, type ErrorStrings, type Lang, type UiStrings } from '../../i18n';
import { UnsupportedImageError } from '../../lib/images';
import { TaskError } from '../../lib/pdf/client';
import { PdfToolError } from '../../lib/pdf/errors';
import { InvalidPdfError, PasswordNeededError } from '../../lib/pdfjs';

export interface RelatedLink {
  href: string;
  name: string;
  /** PDF 결과물을 그대로 넘겨받을 수 있는 도구인지 */
  acceptsPdf: boolean;
}

export interface AdConfig {
  client: string;
  slot: string;
}

/** Astro 페이지에서 모든 도구 컴포넌트로 전달되는 공통 props */
export interface ToolBaseProps {
  lang: Lang;
  ui: UiStrings;
  errors: ErrorStrings;
  related: RelatedLink[];
  resultAd?: AdConfig | null;
  /**
   * 페이지 이동 대신 화면 안에서 도구를 바꾸는 경우(체험판 등)의 이동 함수.
   * files 는 다음 도구로 넘길 결과 파일입니다(넘길 것이 없으면 빈 배열). 없으면 링크 주소로 페이지를 이동합니다.
   */
  navigate?: (href: string, files: File[]) => void;
}

export const ToolContext = createContext<ToolBaseProps | null>(null);

export function useTool(): ToolBaseProps {
  const value = useContext(ToolContext);
  if (!value) throw new Error('ToolContext missing');
  return value;
}

export const localeOf = (lang: Lang) => (lang === 'ko' ? 'ko-KR' : 'en-US');

/** 어떤 에러든 사용자에게 보여줄 문장으로 바꿉니다. */
export function describeError(error: unknown, errors: ErrorStrings): string {
  if (error instanceof TaskError || error instanceof PdfToolError) {
    if (error.code === 'UNKNOWN') return fmt(errors.UNKNOWN, { message: error.message });
    return errors[error.code];
  }
  if (error instanceof PasswordNeededError) {
    return error.incorrect ? errors.PASSWORD_INCORRECT : errors.PASSWORD_REQUIRED;
  }
  if (error instanceof InvalidPdfError) return errors.INVALID_PDF;
  if (error instanceof UnsupportedImageError) return errors.UNSUPPORTED_IMAGE;
  const message = error instanceof Error ? error.message : String(error);
  return fmt(errors.UNKNOWN, { message });
}

export const isCancelled = (error: unknown) => error instanceof TaskError && error.code === 'CANCELLED';
