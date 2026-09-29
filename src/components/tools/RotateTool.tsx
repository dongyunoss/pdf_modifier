import { useState } from 'preact/hooks';
import { fmt, type ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PageThumb } from './PageThumb';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

const normalize = (angle: number) => ((angle % 360) + 360) % 360;

function RotateTool({ t }: { t: ToolUi<'rotate'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [rotations, setRotations] = useState<number[]>([]);
  const files = usePdfFiles({
    multiple: false,
    onError: setError,
    onReady: (entry) => setRotations(new Array(entry.pageCount).fill(0)),
  });

  const apply = async (entry: ReadyEntry) => {
    setError(null);
    const changes = rotations
      .map((rotate, page) => ({ page, rotate }))
      .filter((change) => change.rotate !== 0);
    if (changes.length === 0) {
      setError(t.noChange);
      return;
    }
    setBusy(true);
    try {
      const bytes = await runTask('rotatePages', { file: toFileSource(entry), rotations: changes });
      setResult([{ name: `${safeFileName(baseName(entry.name))}_rotated.pdf`, blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setRotations([]);
    files.reset();
  };

  const rotateOne = (index: number, delta: number) =>
    setRotations((current) => current.map((value, i) => (i === index ? normalize(value + delta) : value)));
  const rotateAll = (delta: number) => setRotations((current) => current.map((value) => normalize(value + delta)));

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel files={result} onReset={reset} />
      ) : busy ? (
        <Busy message={ui.processing} onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              <div class="toolbar" role="toolbar">
                <button type="button" class="btn btn-ghost btn-sm" onClick={() => rotateAll(-90)}>
                  <Icon name="rotate-ccw" size={16} />
                  {t.rotateAllLeft}
                </button>
                <button type="button" class="btn btn-ghost btn-sm" onClick={() => rotateAll(90)}>
                  <Icon name="rotate-cw" size={16} />
                  {t.rotateAllRight}
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-sm"
                  onClick={() => setRotations((current) => current.map(() => 0))}
                  disabled={rotations.every((value) => value === 0)}
                >
                  <Icon name="undo" size={16} />
                  {t.reset}
                </button>
              </div>
              <p class="field-hint">{t.hint}</p>
              <div class="page-grid" aria-label={ui.pageGridLabel}>
                {Array.from({ length: entry.pageCount }, (_, index) => (
                  <div key={index} class={`page-card is-selectable${rotations[index] ? ' is-changed' : ''}`}>
                    <button
                      type="button"
                      class="page-card-hit"
                      aria-label={`${fmt(ui.pageLabel, { n: index + 1 })} · ${ui.rotateRight}`}
                      onClick={() => rotateOne(index, 90)}
                    >
                      <PageThumb
                        docId={entry.id}
                        doc={entry.doc}
                        page={index + 1}
                        rotation={rotations[index] ?? 0}
                        alt=""
                      />
                    </button>
                    {rotations[index] ? <span class="page-card-badge">{rotations[index]}°</span> : null}
                    <span class="page-card-label">{index + 1}</span>
                    <div class="page-card-actions">
                      <button
                        type="button"
                        class="icon-btn"
                        aria-label={ui.rotateLeft}
                        title={ui.rotateLeft}
                        onClick={() => rotateOne(index, -90)}
                      >
                        <Icon name="rotate-ccw" size={16} />
                      </button>
                      <button
                        type="button"
                        class="icon-btn"
                        aria-label={ui.rotateRight}
                        title={ui.rotateRight}
                        onClick={() => rotateOne(index, 90)}
                      >
                        <Icon name="rotate-cw" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div class="action-bar">
                <button type="button" class="btn btn-primary btn-lg" onClick={() => apply(entry)}>
                  <Icon name="rotate" size={20} />
                  {t.action}
                </button>
              </div>
            </div>
          )}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

export default withToolRoot(RotateTool);
