import { EncryptedPDFError, PDFArray, PDFDict, PDFDocument, PDFObject, PDFRef, PDFStream } from '@cantoo/pdf-lib';
import { PdfToolError } from './errors';

export type PdfBytes = Uint8Array | ArrayBuffer;

export interface PdfSource {
  bytes: PdfBytes;
  /** 암호화된 PDF 의 열기 암호 (소유자 암호도 가능) */
  password?: string;
}

export const toUint8 = (bytes: PdfBytes) => (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));

/**
 * PDF 를 불러옵니다. 암호화된 문서는 전달된 암호(없으면 빈 암호)로 복호화를 시도하고,
 * 실패하면 UI 가 암호를 물어볼 수 있도록 PASSWORD_REQUIRED/PASSWORD_INCORRECT 에러를 던집니다.
 * 복호화된 문서는 암호 없이 저장됩니다.
 */
export async function loadPdf(source: PdfSource, fileIndex?: number): Promise<PDFDocument> {
  return (await openPdf(source, fileIndex)).doc;
}

export async function openPdf(
  source: PdfSource,
  fileIndex?: number,
): Promise<{ doc: PDFDocument; wasEncrypted: boolean }> {
  const bytes = toUint8(source.bytes);
  try {
    return { doc: await PDFDocument.load(bytes, { updateMetadata: false }), wasEncrypted: false };
  } catch (error) {
    if (!(error instanceof EncryptedPDFError)) {
      throw new PdfToolError('INVALID_PDF', error instanceof Error ? error.message : String(error), fileIndex);
    }
  }

  const password = source.password ?? '';
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { updateMetadata: false, password });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/needs password|password incorrect/i.test(message) || error instanceof EncryptedPDFError) {
      throw new PdfToolError(password ? 'PASSWORD_INCORRECT' : 'PASSWORD_REQUIRED', message, fileIndex);
    }
    throw new PdfToolError('INVALID_PDF', message, fileIndex);
  }
  // 복호화 후 남는 암호화 사전(/Encrypt)과 옛 XRef 스트림은 더 이상 참조되지 않으므로 정리합니다.
  // 남겨두면 저장한 파일을 다시 열 때 암호화된 문서로 오인될 수 있습니다.
  removeUnreachableObjects(doc);
  return { doc, wasEncrypted: true };
}

/**
 * 트레일러(Root/Info)에서 도달할 수 없는 객체를 삭제합니다.
 * pdf-lib 는 저장 시 참조되지 않는 객체도 그대로 쓰기 때문에, 압축 시 용량을 줄이는 데 사용합니다.
 */
export function removeUnreachableObjects(doc: PDFDocument): number {
  const context = doc.context;
  const reachable = new Set<PDFRef>();
  const stack: PDFObject[] = [];
  const push = (object: PDFObject | undefined) => {
    if (object) stack.push(object);
  };
  push(context.trailerInfo.Root);
  push(context.trailerInfo.Info);
  push(context.trailerInfo.Encrypt);

  while (stack.length > 0) {
    const object = stack.pop()!;
    if (object instanceof PDFRef) {
      if (reachable.has(object)) continue;
      reachable.add(object);
      push(context.lookup(object));
    } else if (object instanceof PDFDict) {
      for (const [, value] of object.entries()) push(value);
    } else if (object instanceof PDFArray) {
      for (let i = 0; i < object.size(); i++) push(object.get(i));
    } else if (object instanceof PDFStream) {
      push(object.dict);
    }
  }

  let removed = 0;
  let largest = 0;
  for (const [ref] of context.enumerateIndirectObjects()) {
    if (!reachable.has(ref)) {
      context.delete(ref);
      removed++;
    } else {
      largest = Math.max(largest, ref.objectNumber);
    }
  }
  // 트레일러의 /Size 가 실제 객체 수와 맞도록 조정합니다.
  // (폰트/이미지 임베드 전에만 호출해야 예약된 객체 번호와 겹치지 않습니다)
  context.largestObjectNumber = largest;
  return removed;
}

export interface SaveOptions {
  /** 객체 스트림 사용 (용량 감소). 기본값은 pdf-lib 기본 동작 */
  useObjectStreams?: boolean;
}

export async function savePdf(doc: PDFDocument, options: SaveOptions = {}): Promise<Uint8Array> {
  if (doc.getPageCount() === 0) throw new PdfToolError('NO_PAGES', 'document has no pages');
  return doc.save({
    // 한글 등 WinAnsi 로 표현할 수 없는 양식 값이 있으면 외형 재생성 중 오류가 나므로 끕니다.
    updateFieldAppearances: false,
    addDefaultPage: false,
    ...(options.useObjectStreams === undefined ? {} : { useObjectStreams: options.useObjectStreams }),
  });
}

export function setProducer(doc: PDFDocument, producer: string | undefined): void {
  if (!producer) return;
  doc.setProducer(producer);
  doc.setCreator(producer);
}
