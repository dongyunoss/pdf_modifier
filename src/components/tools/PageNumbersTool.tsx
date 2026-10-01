import { useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, minBusyTime, runTask, startBusy } from '../../lib/pdf/client';
import { formatPageNumber, type NumberFormat, type NumberPosition } from '../../lib/pdf/constants';
import { parsePageSelection } from '../../lib/pdf/ranges';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PagePreview } from './PagePreview';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Field, Segmented, Slider } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

type Margin = 'small' | 'normal' | 'large';
type PagesMode = 'all' | 'custom';
const MARGINS: Record<Margin, number> = { small: 18, normal: 28, large: 42 };
const POSITIONS: NumberPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
const FORMATS: NumberFormat[] = ['n', 'n-of-total', 'dash-n', 'page-n', 'page-n-of-total'];

function PageNumbersTool({ t }: { t: ToolUi<'page-numbers'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [position, setPosition] = useState<NumberPosition>('bottom-center');
  const [format, setFormat] = useState<NumberFormat>('n');
  const [startAt, setStartAt] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [margin, setMargin] = useState<Margin>('normal');
  const [pagesMode, setPagesMode] = useState<PagesMode>('all');
  const [pages, setPages] = useState('2-');
  const files = usePdfFiles({ multiple: false, onError: setError });

  const apply = async (entry: ReadyEntry) => {
    setError(null);
    let targetPages: number[] | undefined;
    if (pagesMode === 'custom') {
      try {
        targetPages = parsePageSelection(pages, entry.pageCount).sort((a, b) => a - b);
      } catch (err) {
        setError(describeError(err, errors));
        return;
      }
    }
    const started = startBusy();
    setBusy(true);
    try {
      const bytes = await runTask('pageNumbers', {
        file: toFileSource(entry),
        options: { position, format, startAt, fontSize, margin: MARGINS[margin], pages: targetPages },
      });
      await minBusyTime(started);
      setResult([{ name: `${safeFileName(baseName(entry.name))}_numbered.pdf`, blob: pdfBlob(bytes) }]);
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
        <ResultPanel files={result} onReset={reset} />
      ) : busy ? (
        <Busy onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => {
            const total = startAt + entry.pageCount - 1;
            return (
              <div class="workspace">
                <FileCard entry={entry} onRemove={reset} />
                <div class="split-layout">
                  <div class="options">
                    <fieldset class="field">
                      <legend class="field-label">{t.position}</legend>
                      <div class="position-grid" role="radiogroup" aria-label={t.position}>
                        {POSITIONS.map((value) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={value === position}
                            class={`position-cell${value === position ? ' is-active' : ''}`}
                            title={t.positions[value]}
                            aria-label={t.positions[value]}
                            onClick={() => setPosition(value)}
                          >
                            <span class={`position-dot is-${value}`} />
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <Segmented<NumberFormat>
                      label={t.format}
                      value={format}
                      onChange={setFormat}
                      options={FORMATS.map((value) => ({ value, label: formatPageNumber(value, 1, total) }))}
                    />
                    <div class="options-inline">
                      <Field label={t.startAt} htmlFor="pn-start">
                        <input
                          id="pn-start"
                          class="input input-narrow"
                          type="number"
                          min={0}
                          value={startAt}
                          onInput={(event) => setStartAt(Math.max(0, Math.floor(Number(event.currentTarget.value) || 0)))}
                        />
                      </Field>
                      <Segmented<Margin>
                        label={t.margin}
                        value={margin}
                        onChange={setMargin}
                        options={[
                          { value: 'small', label: t.marginSmall },
                          { value: 'normal', label: t.marginNormal },
                          { value: 'large', label: t.marginLarge },
                        ]}
                      />
                    </div>
                    <Slider
                      label={t.fontSize}
                      value={fontSize}
                      min={7}
                      max={28}
                      onChange={setFontSize}
                      display={(value) => `${value}pt`}
                    />
                    <Segmented<PagesMode>
                      label={t.pages}
                      value={pagesMode}
                      onChange={setPagesMode}
                      options={[
                        { value: 'all', label: t.pagesAll },
                        { value: 'custom', label: t.pagesCustom },
                      ]}
                    />
                    {pagesMode === 'custom' && (
                      <input
                        class="input"
                        value={pages}
                        placeholder={ui.rangePlaceholder}
                        aria-label={t.pages}
                        onInput={(event) => setPages(event.currentTarget.value)}
                      />
                    )}
                  </div>
                  <PagePreview entry={entry} label={t.preview}>
                    {(page) => {
                      // 첫 페이지에 들어갈 번호 (직접 입력한 범위에 첫 페이지가 없으면 표시하지 않음)
                      let label: string | null = formatPageNumber(format, startAt, total);
                      if (pagesMode === 'custom') {
                        try {
                          const targets = parsePageSelection(pages, entry.pageCount).sort((a, b) => a - b);
                          const k = targets.indexOf(0);
                          label = k < 0 ? null : formatPageNumber(format, startAt + k, startAt + targets.length - 1);
                        } catch {
                          label = null;
                        }
                      }
                      if (label === null) return null;
                      const [vertical, horizontal] = position.split('-');
                      const inset = `${(MARGINS[margin] / page.width) * 100}%`;
                      const insetY = `${(MARGINS[margin] / page.height) * 100}%`;
                      return (
                        <span
                          class="preview-number"
                          style={{
                            fontSize: `${(fontSize / page.width) * 100}cqw`,
                            top: vertical === 'top' ? insetY : undefined,
                            bottom: vertical === 'bottom' ? insetY : undefined,
                            left: horizontal === 'left' ? inset : horizontal === 'center' ? '50%' : undefined,
                            right: horizontal === 'right' ? inset : undefined,
                            transform: horizontal === 'center' ? 'translateX(-50%)' : undefined,
                          }}
                        >
                          {label}
                        </span>
                      );
                    }}
                  </PagePreview>
                </div>
                <div class="action-bar">
                  <button type="button" class="btn btn-primary btn-lg" onClick={() => apply(entry)}>
                    <Icon name="page-numbers" size={20} />
                    {t.action}
                  </button>
                </div>
              </div>
            );
          }}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

export default withToolRoot(PageNumbersTool);
