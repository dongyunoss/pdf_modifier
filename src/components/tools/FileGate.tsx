import type { ComponentChildren } from 'preact';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { fmt } from '../../i18n';
import { formatBytes } from '../../lib/files';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { Icon } from './Icon';
import { PageThumb } from './PageThumb';
import { PasswordPrompt } from './PasswordPrompt';
import { localeOf, useTool } from './context';
import type { PdfEntry, usePdfFiles } from './usePdfFiles';

export const PDF_ACCEPT = 'application/pdf,.pdf';

export type ReadyEntry = PdfEntry & { doc: PDFDocumentProxy };

export const isReady = (entry: PdfEntry | undefined): entry is ReadyEntry =>
  !!entry && entry.status === 'ready' && !!entry.doc;

type Files = ReturnType<typeof usePdfFiles>;

/**
 * PDF 한 개를 다루는 도구의 공통 흐름:
 * 파일 선택 → (필요하면) 암호 입력 → 불러오기 → 도구 화면
 */
export function SingleFileGate({ files, children }: { files: Files; children: (entry: ReadyEntry) => ComponentChildren }) {
  const { ui } = useTool();
  const entry = files.entries[0];
  if (!entry || entry.status === 'error') {
    return (
      <Dropzone accept={PDF_ACCEPT} multiple={false} onFiles={files.addFiles} button={ui.choosePdf} hint={ui.dropPdf} />
    );
  }
  if (entry.status === 'locked') {
    return (
      <PasswordPrompt
        entry={entry}
        onSubmit={(password) => files.unlock(entry.id, password)}
        onSkip={() => files.remove(entry.id)}
      />
    );
  }
  if (!isReady(entry)) return <Busy message={ui.loading} />;
  return <>{children(entry)}</>;
}

interface FileCardProps {
  entry: PdfEntry;
  onRemove?: () => void;
  children?: ComponentChildren;
}

/** 선택한 파일 정보 (첫 페이지 미리보기, 이름, 쪽수, 크기) */
export function FileCard({ entry, onRemove, children }: FileCardProps) {
  const { ui, lang } = useTool();
  return (
    <div class="file-card">
      <div class="file-card-thumb">
        {entry.doc ? (
          <PageThumb docId={entry.id} doc={entry.doc} page={1} alt="" size={96} />
        ) : (
          <div class="thumb">
            <div class="thumb-skeleton" />
          </div>
        )}
      </div>
      <div class="file-card-body">
        <strong class="file-name" title={entry.name}>
          {entry.name}
        </strong>
        <span class="file-meta">
          {entry.status === 'ready' && `${fmt(ui.pageCount, { n: entry.pageCount })} · `}
          {formatBytes(entry.size, localeOf(lang))}
        </span>
        {children}
      </div>
      {onRemove && (
        <button type="button" class="icon-btn" aria-label={ui.removeFile} title={ui.removeFile} onClick={onRemove}>
          <Icon name="x" size={18} />
        </button>
      )}
    </div>
  );
}
