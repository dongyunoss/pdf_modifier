import { useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { formatBytes, pdfBlob } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { PDF_ACCEPT } from './FileGate';
import { Icon } from './Icon';
import { PageThumb } from './PageThumb';
import { PasswordPrompt } from './PasswordPrompt';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { describeError, isCancelled, localeOf, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';
import { useSortable } from './useSortable';

function MergeTool({ t }: { t: ToolUi<'merge'> }) {
  const { ui, errors, lang } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const files = usePdfFiles({ multiple: true, onError: setError });
  const { entries } = files;
  const sortable = useSortable({ count: entries.length, onMove: files.move, axis: 'y' });
  const locale = localeOf(lang);
  const ready = entries.filter((entry) => entry.status === 'ready');
  const waiting = entries.some((entry) => entry.status === 'loading' || entry.status === 'locked');
  const totalPages = ready.reduce((sum, entry) => sum + entry.pageCount, 0);

  const merge = async () => {
    setError(null);
    if (ready.length < 2) {
      setError(t.needTwo);
      return;
    }
    setBusy(true);
    try {
      const bytes = await runTask('merge', { files: ready.map(toFileSource) });
      setResult([{ name: 'merged.pdf', blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    files.reset();
  };

  let body;
  if (result) {
    body = <ResultPanel files={result} onReset={reset} />;
  } else if (busy) {
    body = <Busy message={ui.processing} onCancel={cancelAllTasks} />;
  } else if (entries.length === 0) {
    body = (
      <Dropzone accept={PDF_ACCEPT} multiple onFiles={files.addFiles} button={ui.choosePdfs} hint={ui.dropPdfs} />
    );
  } else {
    body = (
      <div class="workspace">
        <div class="toolbar" role="toolbar">
          <span class="toolbar-status">
            {fmt(ui.fileCount, { n: entries.length })} · {fmt(ui.totalPages, { n: totalPages })}
          </span>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick={() => files.reorder((a, b) => a.name.localeCompare(b.name, locale, { numeric: true }))}
          >
            <Icon name="sort" size={16} />
            {ui.sortByName}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onClick={files.reverse}>
            <Icon name="reverse" size={16} />
            {ui.reverse}
          </button>
        </div>

        <ol class="file-list" aria-label={ui.fileListLabel}>
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              ref={sortable.itemRef(index)}
              class={`file-row ${sortable.classFor(index)}`}
              onPointerDown={sortable.onPointerDown(index)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (!event.altKey) return;
                if (event.key === 'ArrowUp' && index > 0) files.move(index, index - 1);
                if (event.key === 'ArrowDown' && index < entries.length - 1) files.move(index, index + 1);
              }}
            >
              <span class="drag-handle" data-drag-handle title={ui.dragHint} aria-hidden="true">
                <Icon name="grip" size={18} />
              </span>
              <span class="file-row-index">{index + 1}</span>
              <div class="file-row-thumb">
                {entry.doc ? (
                  <PageThumb docId={entry.id} doc={entry.doc} page={1} alt="" size={64} />
                ) : (
                  <div class="thumb">
                    <div class="thumb-skeleton" />
                  </div>
                )}
              </div>
              <div class="file-row-body">
                {entry.status === 'locked' ? (
                  <PasswordPrompt
                    entry={entry}
                    onSubmit={(password) => files.unlock(entry.id, password)}
                    onSkip={() => files.remove(entry.id)}
                  />
                ) : (
                  <>
                    <strong class="file-name" title={entry.name}>
                      {entry.name}
                    </strong>
                    <span class="file-meta">
                      {entry.status === 'loading' && ui.loading}
                      {entry.status === 'ready' && `${fmt(ui.pageCount, { n: entry.pageCount })} · `}
                      {entry.status === 'error' && <span class="text-error">{entry.error} · </span>}
                      {formatBytes(entry.size, locale)}
                    </span>
                  </>
                )}
              </div>
              <div class="file-row-actions">
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={ui.moveUp}
                  title={ui.moveUp}
                  disabled={index === 0}
                  onClick={() => files.move(index, index - 1)}
                >
                  <Icon name="arrow-up" size={18} />
                </button>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={ui.moveDown}
                  title={ui.moveDown}
                  disabled={index === entries.length - 1}
                  onClick={() => files.move(index, index + 1)}
                >
                  <Icon name="arrow-down" size={18} />
                </button>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={ui.removeFile}
                  title={ui.removeFile}
                  onClick={() => files.remove(entry.id)}
                >
                  <Icon name="x" size={18} />
                </button>
              </div>
            </li>
          ))}
        </ol>

        <Dropzone
          accept={PDF_ACCEPT}
          multiple
          compact
          onFiles={files.addFiles}
          button={ui.addFiles}
          hint={ui.dropPdfs}
        />

        <div class="action-bar">
          {ready.length < 2 && <p class="field-hint">{t.needTwo}</p>}
          <button type="button" class="btn btn-primary btn-lg" disabled={ready.length < 2 || waiting} onClick={merge}>
            <Icon name="merge" size={20} />
            {t.action}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {body}
    </ToolFrame>
  );
}

export default withToolRoot(MergeTool);
