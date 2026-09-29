export type PdfErrorCode =
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_INCORRECT'
  | 'INVALID_PDF'
  | 'INVALID_RANGE'
  | 'NO_PAGES'
  | 'UNSUPPORTED_IMAGE'
  | 'UNKNOWN';

/** UI에서 언어별 메시지로 바꿔 보여줄 수 있도록 코드를 가진 에러 */
export class PdfToolError extends Error {
  readonly code: PdfErrorCode;
  /** 여러 파일을 다룰 때 문제가 된 파일의 인덱스 */
  readonly fileIndex?: number;

  constructor(code: PdfErrorCode, message?: string, fileIndex?: number) {
    super(message ?? code);
    this.name = 'PdfToolError';
    this.code = code;
    this.fileIndex = fileIndex;
  }
}

export interface SerializedError {
  code: PdfErrorCode;
  message: string;
  fileIndex?: number;
}

export function serializeError(error: unknown): SerializedError {
  if (error instanceof PdfToolError) {
    return { code: error.code, message: error.message, fileIndex: error.fileIndex };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { code: 'UNKNOWN', message };
}
