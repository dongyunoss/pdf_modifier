import { useEffect, useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName, uid } from '../../lib/files';
import { IMAGE_ACCEPT, prepareImage, UnsupportedImageError } from '../../lib/images';
import { cancelAllTasks, minBusyTime, runTask, startBusy, TaskError, throwIfCancelled } from '../../lib/pdf/client';
import type { PageSizeName } from '../../lib/pdf/constants';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Segmented } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { movedItem } from './usePdfFiles';
import { useSortable } from './useSortable';

interface ImageItem {
  id: string;
  file: File;
  url: string;
  rotation: number;
  broken?: boolean;
}

type Orientation = 'auto' | 'portrait' | 'landscape';
type Margin = 'none' | 'small' | 'large';
const MARGINS: Record<Margin, number> = { none: 0, small: 18, large: 40 };
const normalize = (angle: number) => ((angle % 360) + 360) % 360;
const isImage = (file: File) =>
  file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif|heic|heif)$/i.test(file.name);

function ImagesToPdfTool({ t }: { t: ToolUi<'jpg-to-pdf'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeName>('a4');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [margin, setMargin] = useState<Margin>('small');
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const sortable = useSortable({ count: items.length, onMove: (from, to) => setItems((list) => movedItem(list, from, to)) });

  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url)), []);

  const addFiles = (files: File[]) => {
    const accepted = files.filter(isImage);
    for (const file of files) {
      if (!isImage(file)) setError(fmt(errors.notImage, { name: file.name }));
    }
    if (accepted.length === 0) return;
    setItems((list) => [
      ...list,
      ...accepted.map((file) => ({ id: uid('img'), file, url: URL.createObjectURL(file), rotation: 0 })),
    ]);
  };

  const removeItem = (id: string) =>
    setItems((list) => {
      const item = list.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return list.filter((entry) => entry.id !== id);
    });

  const rotateItem = (id: string, delta: number) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, rotation: normalize(item.rotation + delta) } : item)));

  const convert = async () => {
    setError(null);
    const started = startBusy();
    setBusy(true);
    try {
      const images = [];
      for (const item of items) {
        // 이미지를 준비하는 도중에도 취소 버튼이 바로 듣도록 한 장마다 확인합니다.
        throwIfCancelled(started);
        try {
          const prepared = await prepareImage(item.file);
          images.push({ data: prepared.data, type: prepared.type, rotation: item.rotation });
        } catch (err) {
          setError(
            err instanceof UnsupportedImageError
              ? fmt(errors.notImage, { name: item.file.name })
              : describeError(err, errors),
          );
          return;
        }
      }
      const bytes = await runTask('imagesToPdf', {
        images,
        options: { pageSize, orientation, margin: MARGINS[margin] },
      });
      await minBusyTime(started);
      const name = items.length === 1 ? `${safeFileName(baseName(items[0].file.name))}.pdf` : 'images.pdf';
      setResult([{ name, blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) {
        const index = err instanceof TaskError ? err.fileIndex : undefined;
        const failed = index === undefined ? undefined : items[index];
        setError(failed ? fmt(errors.notImage, { name: failed.file.name }) : describeError(err, errors));
      }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
    setResult(null);
    setError(null);
  };

  let body;
  if (result) {
    body = <ResultPanel files={result} onReset={reset} />;
  } else if (busy) {
    body = <Busy onCancel={cancelAllTasks} />;
  } else if (items.length === 0) {
    body = <Dropzone accept={IMAGE_ACCEPT} multiple onFiles={addFiles} button={ui.chooseImages} hint={ui.dropImages} />;
  } else {
    body = (
      <div class="workspace">
        <div class="toolbar" role="toolbar">
          <span class="toolbar-status">{fmt(t.imageCount, { n: items.length })}</span>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick={() => setItems((list) => list.slice().sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true })))}
          >
            <Icon name="sort" size={16} />
            {ui.sortByName}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onClick={() => setItems((list) => list.slice().reverse())}>
            <Icon name="reverse" size={16} />
            {ui.reverse}
          </button>
        </div>
        <p class="field-hint">{ui.dragHint}</p>
        <div class="page-grid" aria-label={ui.fileListLabel}>
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={sortable.itemRef(index)}
              class={`page-card is-sortable ${sortable.classFor(index)}`}
              onPointerDown={sortable.onPointerDown(index)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (!event.altKey) return;
                if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp') && index > 0)
                  setItems((list) => movedItem(list, index, index - 1));
                if ((event.key === 'ArrowRight' || event.key === 'ArrowDown') && index < items.length - 1)
                  setItems((list) => movedItem(list, index, index + 1));
              }}
            >
              <div class="thumb">
                {item.broken ? (
                  <Icon name="jpg-to-pdf" size={40} class="thumb-placeholder" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.file.name}
                    draggable={false}
                    loading="lazy"
                    style={item.rotation ? { transform: `rotate(${item.rotation}deg)` } : undefined}
                    onError={() => setItems((list) => list.map((x) => (x.id === item.id ? { ...x, broken: true } : x)))}
                  />
                )}
              </div>
              <span class="page-card-label page-card-name" title={item.file.name}>
                {index + 1}. {item.file.name}
              </span>
              <div class="page-card-actions">
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={ui.rotateLeft}
                  title={ui.rotateLeft}
                  onClick={() => rotateItem(item.id, -90)}
                >
                  <Icon name="rotate-ccw" size={16} />
                </button>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label={ui.rotateRight}
                  title={ui.rotateRight}
                  onClick={() => rotateItem(item.id, 90)}
                >
                  <Icon name="rotate-cw" size={16} />
                </button>
                <button
                  type="button"
                  class="icon-btn icon-btn-danger"
                  aria-label={ui.delete}
                  title={ui.delete}
                  onClick={() => removeItem(item.id)}
                >
                  <Icon name="x" size={16} />
                </button>
              </div>
              <span class="drag-handle page-card-handle" data-drag-handle aria-hidden="true">
                <Icon name="grip" size={16} />
              </span>
            </div>
          ))}
        </div>

        <Dropzone accept={IMAGE_ACCEPT} multiple compact onFiles={addFiles} button={t.addImages} hint={ui.dropImages} />

        <div class="options options-row">
          <Segmented<PageSizeName>
            label={t.pageSize}
            value={pageSize}
            onChange={setPageSize}
            options={[
              { value: 'a4', label: t.sizeA4 },
              { value: 'letter', label: t.sizeLetter },
              { value: 'fit', label: t.sizeFit },
            ]}
          />
          {pageSize !== 'fit' && (
            <Segmented<Orientation>
              label={t.orientation}
              value={orientation}
              onChange={setOrientation}
              options={[
                { value: 'auto', label: t.orientAuto },
                { value: 'portrait', label: t.orientPortrait },
                { value: 'landscape', label: t.orientLandscape },
              ]}
            />
          )}
          <Segmented<Margin>
            label={t.margin}
            value={margin}
            onChange={setMargin}
            options={[
              { value: 'none', label: t.marginNone },
              { value: 'small', label: t.marginSmall },
              { value: 'large', label: t.marginLarge },
            ]}
          />
        </div>

        <div class="action-bar">
          <button type="button" class="btn btn-primary btn-lg" onClick={convert}>
            <Icon name="jpg-to-pdf" size={20} />
            {t.action}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : addFiles}>
      {body}
    </ToolFrame>
  );
}

export default withToolRoot(ImagesToPdfTool);
