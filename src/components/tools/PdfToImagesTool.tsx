import { useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, safeFileName } from '../../lib/files';
import { canvasToBlob, releaseCanvas, renderPage } from '../../lib/pdfjs';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PageSelectGrid } from './PageSelectGrid';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Segmented } from './controls';
import { describeError, useTool } from './context';
import { usePdfFiles } from './usePdfFiles';

type Format = 'jpg' | 'png';
type Dpi = 72 | 150 | 300;

function PdfToImagesTool({ t }: { t: ToolUi<'pdf-to-jpg'> }) {
  const { errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<Format>('jpg');
  const [dpi, setDpi] = useState<Dpi>(150);
  const cancelled = useRef(false);
  const files = usePdfFiles({
    multiple: false,
    onError: setError,
    onReady: (entry) => setSelected(new Set(Array.from({ length: entry.pageCount }, (_, i) => i))),
  });

  const convert = async (entry: ReadyEntry) => {
    setError(null);
    const pages = [...selected].sort((a, b) => a - b);
    if (pages.length === 0) {
      setError(errors.NO_PAGES);
      return;
    }
    cancelled.current = false;
    const base = safeFileName(baseName(entry.name));
    const outputs: ResultFile[] = [];
    try {
      for (let k = 0; k < pages.length; k++) {
        if (cancelled.current) return;
        setProgress({ done: k + 1, total: pages.length });
        const canvas = await renderPage(entry.doc, pages[k] + 1, { scale: dpi / 72 });
        const blob = await canvasToBlob(canvas, format === 'png' ? 'image/png' : 'image/jpeg', 0.92);
        releaseCanvas(canvas);
        outputs.push({ name: `${base}_page-${pages[k] + 1}.${format}`, blob });
      }
      setResult(outputs);
    } catch (err) {
      setError(describeError(err, errors));
    } finally {
      setProgress(null);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    files.reset();
  };

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || progress ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel
          files={result}
          zipName={`${safeFileName(baseName(files.entries[0]?.name ?? 'pages'))}_${format}.zip`}
          onReset={reset}
        />
      ) : progress ? (
        <Busy
          message={fmt(t.rendering, progress)}
          progress={progress.done / progress.total}
          onCancel={() => {
            cancelled.current = true;
          }}
        />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              <div class="options options-row">
                <Segmented<Format>
                  label={t.format}
                  value={format}
                  onChange={setFormat}
                  options={[
                    { value: 'jpg', label: 'JPG' },
                    { value: 'png', label: 'PNG' },
                  ]}
                />
                <Segmented<Dpi>
                  label={t.resolution}
                  value={dpi}
                  onChange={setDpi}
                  options={[
                    { value: 72, label: t.dpiLow },
                    { value: 150, label: t.dpiMedium },
                    { value: 300, label: t.dpiHigh },
                  ]}
                />
              </div>
              <p class="field-hint">{t.hint}</p>
              <PageSelectGrid entry={entry} selected={selected} onChange={setSelected} variant="select" />
              <div class="action-bar">
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  disabled={selected.size === 0}
                  onClick={() => convert(entry)}
                >
                  <Icon name="pdf-to-jpg" size={20} />
                  {selected.size === entry.pageCount ? t.action : fmt(t.actionCount, { n: selected.size })}
                </button>
              </div>
            </div>
          )}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

export default withToolRoot(PdfToImagesTool);
