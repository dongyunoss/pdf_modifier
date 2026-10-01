import { useMemo, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName, uniqueNames } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { chunkPages, formatPageRanges, parsePageRanges } from '../../lib/pdf/ranges';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PageThumb } from './PageThumb';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Field, Segmented } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

type Mode = 'ranges' | 'every' | 'each';

function groupsFor(mode: Mode, ranges: string, every: number, pageCount: number): number[][] {
  if (mode === 'each') return chunkPages(pageCount, 1);
  if (mode === 'every') return chunkPages(pageCount, every);
  return parsePageRanges(ranges, pageCount);
}

function SplitTool({ t }: { t: ToolUi<'split'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [mode, setMode] = useState<Mode>('ranges');
  const [ranges, setRanges] = useState('');
  const [every, setEvery] = useState(1);
  const files = usePdfFiles({
    multiple: false,
    onError: setError,
    onReady: (entry) => {
      // 기본값: 앞쪽 절반 / 뒤쪽 절반
      const half = Math.ceil(entry.pageCount / 2);
      setRanges(entry.pageCount > 1 ? `1-${half}, ${half + 1}-${entry.pageCount}` : '1');
      setEvery(Math.min(2, entry.pageCount));
    },
  });

  const split = async (entry: ReadyEntry, groups: number[][]) => {
    setError(null);
    setBusy(true);
    try {
      const parts = await runTask('split', { file: toFileSource(entry), groups });
      const base = safeFileName(baseName(entry.name));
      const names = uniqueNames(groups.map((group) => `${base}_${formatPageRanges(group).replace(/, /g, '_')}.pdf`));
      setResult(parts.map((bytes, i) => ({ name: names[i], blob: pdfBlob(bytes) })));
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

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel
          files={result}
          zipName={`${safeFileName(baseName(files.entries[0]?.name ?? 'split'))}_split.zip`}
          onReset={reset}
        />
      ) : busy ? (
        <Busy message={ui.processing} onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <SplitOptions
              t={t}
              entry={entry}
              mode={mode}
              ranges={ranges}
              every={every}
              onMode={setMode}
              onRanges={setRanges}
              onEvery={setEvery}
              onRemove={files.reset}
              onSplit={(groups) => split(entry, groups)}
            />
          )}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

interface SplitOptionsProps {
  t: ToolUi<'split'>;
  entry: ReadyEntry;
  mode: Mode;
  ranges: string;
  every: number;
  onMode: (mode: Mode) => void;
  onRanges: (value: string) => void;
  onEvery: (value: number) => void;
  onRemove: () => void;
  onSplit: (groups: number[][]) => void;
}

function SplitOptions({ t, entry, mode, ranges, every, onMode, onRanges, onEvery, onRemove, onSplit }: SplitOptionsProps) {
  const { ui, errors } = useTool();
  const plan = useMemo(() => {
    try {
      return { groups: groupsFor(mode, ranges, every, entry.pageCount), error: null };
    } catch (error) {
      return { groups: [] as number[][], error: describeError(error, errors) };
    }
  }, [mode, ranges, every, entry.pageCount, errors]);

  // 미리보기: 각 페이지가 몇 번째 결과 파일에 들어가는지 색으로 표시
  const groupOf = useMemo(() => {
    const map = new Map<number, number>();
    plan.groups.forEach((group, g) => group.forEach((page) => map.has(page) || map.set(page, g)));
    return map;
  }, [plan.groups]);

  return (
    <div class="workspace">
      <FileCard entry={entry} onRemove={onRemove} />
      <div class="options">
        <Segmented<Mode>
          label={t.mode}
          value={mode}
          onChange={onMode}
          options={[
            { value: 'ranges', label: t.modeRanges },
            { value: 'every', label: t.modeEvery },
            { value: 'each', label: t.modeEach },
          ]}
        />
        {mode === 'ranges' && (
          <Field label={t.rangesLabel} hint={t.rangesHelp} error={plan.error} htmlFor="split-ranges">
            <input
              id="split-ranges"
              class="input"
              value={ranges}
              placeholder={t.rangesPlaceholder}
              onInput={(event) => onRanges(event.currentTarget.value)}
            />
          </Field>
        )}
        {mode === 'every' && (
          <Field label={t.everyLabel} htmlFor="split-every">
            <input
              id="split-every"
              class="input input-narrow"
              type="number"
              min={1}
              max={entry.pageCount}
              value={every}
              onInput={(event) => onEvery(Math.max(1, Math.floor(Number(event.currentTarget.value) || 1)))}
            />
          </Field>
        )}
        {!plan.error && <p class="summary">{fmt(t.summary, { n: plan.groups.length })}</p>}
      </div>

      <div class="page-grid is-compact" aria-label={ui.pageGridLabel}>
        {Array.from({ length: entry.pageCount }, (_, index) => {
          const group = groupOf.get(index);
          return (
            <div key={index} class={`page-card${group === undefined ? ' is-muted' : ''}`} data-group={group === undefined ? undefined : group % 6}>
              <PageThumb docId={entry.id} doc={entry.doc} page={index + 1} alt={fmt(ui.pageLabel, { n: index + 1 })} size={140} />
              <span class="page-card-label">
                {index + 1}
                {group !== undefined && <span class="group-tag">#{group + 1}</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div class="action-bar">
        <button
          type="button"
          class="btn btn-primary btn-lg"
          disabled={!!plan.error || plan.groups.length === 0}
          onClick={() => onSplit(plan.groups)}
        >
          <Icon name="split" size={20} />
          {t.action}
        </button>
      </div>
    </div>
  );
}

export default withToolRoot(SplitTool);
