import { useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, formatBytes, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { COMPRESSION_PRESETS, RASTER_PRESETS, type CompressionLevel } from '../../lib/pdf/constants';
import { canvasToBlob, releaseCanvas, renderPage } from '../../lib/pdfjs';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Checkbox, Segmented } from './controls';
import { describeError, isCancelled, localeOf, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

class Cancelled extends Error {}

function CompressTool({ t }: { t: ToolUi<'compress'> }) {
  const { ui, errors, lang } = useTool();
  const locale = localeOf(lang);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ message: string; value: number | null } | null>(null);
  const [result, setResult] = useState<{ files: ResultFile[]; before: number; after: number } | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [rasterize, setRasterize] = useState(false);
  const cancelled = useRef(false);
  const files = usePdfFiles({ multiple: false, onError: setError, onReady: () => setNotice(null) });

  const rasterizePages = async (entry: ReadyEntry) => {
    const { dpi, quality } = RASTER_PRESETS[level];
    const pages: Array<{ jpeg: Blob; width: number; height: number }> = [];
    for (let i = 1; i <= entry.pageCount; i++) {
      if (cancelled.current) throw new Cancelled();
      setProgress({ message: fmt(t.rendering, { done: i, total: entry.pageCount }), value: (i - 1) / entry.pageCount });
      const page = await entry.doc.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      page.cleanup();
      const canvas = await renderPage(entry.doc, i, { scale: dpi / 72 });
      const jpeg = await canvasToBlob(canvas, 'image/jpeg', quality);
      releaseCanvas(canvas);
      pages.push({ jpeg, width: viewport.width, height: viewport.height });
    }
    setProgress({ message: ui.processing, value: null });
    return runTask('pagesFromImages', { pages });
  };

  const compress = async (entry: ReadyEntry) => {
    setError(null);
    setNotice(null);
    cancelled.current = false;
    setProgress({ message: ui.processing, value: null });
    try {
      let bytes: Uint8Array;
      if (rasterize) {
        bytes = await rasterizePages(entry);
      } else {
        const output = await runTask(
          'compress',
          { file: toFileSource(entry), options: COMPRESSION_PRESETS[level] },
          {
            onProgress: (done, total) =>
              setProgress({ message: fmt(t.analyzing, { done, total }), value: total ? done / total : null }),
          },
        );
        bytes = output.bytes;
      }
      if (bytes.length >= entry.size) {
        setNotice(t.notReduced);
        return;
      }
      setResult({
        files: [{ name: `${safeFileName(baseName(entry.name))}_compressed.pdf`, blob: pdfBlob(bytes) }],
        before: entry.size,
        after: bytes.length,
      });
    } catch (err) {
      if (!(err instanceof Cancelled) && !isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setProgress(null);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setNotice(null);
    files.reset();
  };

  const levels: CompressionLevel[] = ['low', 'medium', 'high'];
  const labels: Record<CompressionLevel, [string, string]> = {
    low: [t.levelLow, t.levelLowDesc],
    medium: [t.levelMedium, t.levelMediumDesc],
    high: [t.levelHigh, t.levelHighDesc],
  };

  return (
    <ToolFrame
      error={error}
      onDismissError={() => setError(null)}
      onDropFiles={result || progress ? undefined : files.addFiles}
    >
      {result ? (
        <ResultPanel
          files={result.files}
          onReset={reset}
          summary={
            <p class="result-summary">
              {fmt(t.result, {
                before: formatBytes(result.before, locale),
                after: formatBytes(result.after, locale),
                percent: Math.max(1, Math.round((1 - result.after / result.before) * 100)),
              })}
            </p>
          }
        />
      ) : progress ? (
        <Busy
          message={progress.message}
          progress={progress.value}
          onCancel={() => {
            cancelled.current = true;
            cancelAllTasks();
          }}
        />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              {notice && (
                <div class="alert alert-info" role="status">
                  <Icon name="info" size={18} />
                  <span>{notice}</span>
                </div>
              )}
              <div class="options">
                <Segmented<CompressionLevel>
                  label={t.level}
                  value={level}
                  onChange={setLevel}
                  cards
                  options={levels.map((value) => ({ value, label: labels[value][0], description: labels[value][1] }))}
                />
                <Checkbox label={t.rasterize} description={t.rasterizeDesc} checked={rasterize} onChange={setRasterize} />
              </div>
              <div class="action-bar">
                <button type="button" class="btn btn-primary btn-lg" onClick={() => compress(entry)}>
                  <Icon name="compress" size={20} />
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

export default withToolRoot(CompressTool);
