import { useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PageSelectGrid } from './PageSelectGrid';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Segmented } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

type Props =
  | { mode: 'delete'; t: ToolUi<'delete-pages'> }
  | { mode: 'extract'; t: ToolUi<'extract-pages'> };

/** 페이지 삭제 / 페이지 추출 (선택 방식이 같아 하나의 컴포넌트로 처리) */
function PageSelectTool(props: Props) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [separate, setSeparate] = useState(false);
  const files = usePdfFiles({ multiple: false, onError: setError, onReady: () => setSelected(new Set()) });
  const { t } = props;

  const run = async (entry: ReadyEntry) => {
    setError(null);
    const pages = [...selected].sort((a, b) => a - b);
    if (pages.length === 0) {
      setError(errors.NO_PAGES);
      return;
    }
    if (props.mode === 'delete' && pages.length >= entry.pageCount) {
      setError(props.t.allSelected);
      return;
    }
    setBusy(true);
    const base = safeFileName(baseName(entry.name));
    try {
      if (props.mode === 'delete') {
        const bytes = await runTask('deletePages', { file: toFileSource(entry), pages });
        setResult([{ name: `${base}_pages-removed.pdf`, blob: pdfBlob(bytes) }]);
      } else if (separate) {
        const parts = await runTask('split', { file: toFileSource(entry), groups: pages.map((page) => [page]) });
        setResult(parts.map((bytes, i) => ({ name: `${base}_page-${pages[i] + 1}.pdf`, blob: pdfBlob(bytes) })));
      } else {
        const bytes = await runTask('extractPages', { file: toFileSource(entry), pages });
        setResult([{ name: `${base}_extracted.pdf`, blob: pdfBlob(bytes) }]);
      }
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setSelected(new Set());
    files.reset();
  };

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel
          files={result}
          zipName={`${safeFileName(baseName(files.entries[0]?.name ?? 'pages'))}_pages.zip`}
          onReset={reset}
        />
      ) : busy ? (
        <Busy message={ui.processing} onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              <p class="field-hint">{t.hint}</p>
              <PageSelectGrid
                entry={entry}
                selected={selected}
                onChange={setSelected}
                variant={props.mode === 'delete' ? 'delete' : 'select'}
              />
              {props.mode === 'extract' && (
                <div class="options">
                  <Segmented<'single' | 'separate'>
                    label={props.t.output}
                    value={separate ? 'separate' : 'single'}
                    onChange={(value) => setSeparate(value === 'separate')}
                    options={[
                      { value: 'single', label: props.t.outputSingle },
                      { value: 'separate', label: props.t.outputSeparate },
                    ]}
                  />
                </div>
              )}
              <div class="action-bar">
                <button
                  type="button"
                  class={`btn btn-lg ${props.mode === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                  disabled={selected.size === 0}
                  onClick={() => run(entry)}
                >
                  <Icon name={props.mode === 'delete' ? 'trash' : 'extract-pages'} size={20} />
                  {selected.size ? fmt(t.action, { n: selected.size }) : t.actionNone}
                </button>
              </div>
            </div>
          )}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

export default withToolRoot(PageSelectTool);
