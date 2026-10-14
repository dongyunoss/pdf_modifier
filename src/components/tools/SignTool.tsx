import { useEffect, useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName, uid } from '../../lib/files';
import { IMAGE_ACCEPT, UnsupportedImageError } from '../../lib/images';
import { cancelAllTasks, minBusyTime, runTask, startBusy, throwIfCancelled } from '../../lib/pdf/client';
import { getPageSizes, getThumbnail } from '../../lib/pdfjs';
import {
  loadSignatureImage,
  renderStrokes,
  renderTypedSignature,
  traceStrokes,
  type SignatureImage,
  type Stroke,
  type TypedStyle,
} from '../../lib/signature';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Checkbox, Field, Segmented } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

type Mode = 'draw' | 'type' | 'image';

/** 페이지에 놓은 서명 하나 (보이는 페이지 기준 비율, 왼쪽 위 모서리) */
interface Placed {
  id: string;
  /** 0부터 시작하는 페이지 번호 */
  page: number;
  x: number;
  y: number;
  width: number;
}

interface Signature extends SignatureImage {
  url: string;
}

const COLORS = ['#111827', '#1d4ed8', '#b91c1c'];
/** 서명 패드의 선 굵기 (CSS 픽셀) */
const LINE_WIDTH = 2.6;
/** 처음 놓을 때 서명 너비 (페이지 너비 대비) */
const DEFAULT_WIDTH = 0.28;
const MIN_WIDTH = 0.04;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

// ────────────────────────────── 서명 패드 ──────────────────────────────

interface PadProps {
  strokes: Stroke[];
  color: string;
  label: string;
  hint: string;
  onChange: (strokes: Stroke[]) => void;
}

function SignaturePad({ strokes, color, label, hint, onChange }: PadProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<Stroke | null>(null);
  const frame = useRef(0);

  const redraw = () => {
    const el = canvas.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (el.width !== width || el.height !== height) {
      el.width = width;
      el.height = height;
    }
    const ctx = el.getContext('2d')!;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    traceStrokes(ctx, current.current ? [...strokes, current.current] : strokes);
  };

  useEffect(redraw, [strokes, color]);
  useEffect(() => {
    const el = canvas.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => redraw());
    observer.observe(el);
    return () => observer.disconnect();
  });

  const point = (event: PointerEvent) => {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const schedule = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      redraw();
    });
  };

  return (
    <div class="sign-pad">
      <canvas
        ref={canvas}
        class="sign-pad-canvas"
        role="img"
        aria-label={label}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          canvas.current!.setPointerCapture(event.pointerId);
          current.current = [point(event)];
          schedule();
        }}
        onPointerMove={(event) => {
          if (!current.current) return;
          const events = event.getCoalescedEvents?.() ?? [event];
          for (const item of events.length ? events : [event]) current.current.push(point(item));
          schedule();
        }}
        onPointerUp={() => {
          if (!current.current) return;
          const stroke = current.current;
          current.current = null;
          onChange([...strokes, stroke]);
        }}
        onPointerCancel={() => {
          current.current = null;
          schedule();
        }}
      />
      <span class="sign-pad-line" aria-hidden="true" />
      {strokes.length === 0 && (
        <span class="sign-pad-hint" aria-hidden="true">
          {hint}
        </span>
      )}
    </div>
  );
}

// ────────────────────────────── 페이지에 놓기 ──────────────────────────────

interface BoardProps {
  entry: ReadyEntry;
  t: ToolUi<'sign'>;
  signature: Signature | null;
  placements: Placed[];
  onChange: (next: Placed[]) => void;
  onNeedSignature: () => void;
}

interface Drag {
  id: string;
  mode: 'move' | 'resize';
  startX: number;
  startY: number;
  origin: Placed;
  rect: DOMRect;
}

function PlacementBoard({ entry, t, signature, placements, onChange, onNeedSignature }: BoardProps) {
  const [page, setPage] = useState(0);
  const [sizes, setSizes] = useState<Array<{ width: number; height: number }> | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const board = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const latest = useRef(placements);
  latest.current = placements;
  const total = entry.pageCount;

  useEffect(() => {
    let cancelled = false;
    getPageSizes(entry.doc)
      .then((list) => !cancelled && setSizes(list))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [entry]);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    getThumbnail(`${entry.id}:${page + 1}:760`, entry.doc, page + 1, 760)
      .then((thumb) => !cancelled && setUrl(thumb))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [entry, page]);

  const size = sizes?.[page];
  const aspect = signature ? signature.height / signature.width : 0.35;
  /** 너비 비율 → 높이 비율 (페이지 가로세로 비를 반영) */
  const heightOf = (width: number) => width * aspect * (size ? size.width / size.height : 1);
  /** 서명이 페이지 아래로 넘치지 않는 최대 너비 */
  const maxWidthAt = (x: number, y: number) => Math.min(1 - x, (1 - y) / (aspect * (size ? size.width / size.height : 1)));

  const update = (id: string, change: Partial<Placed>) =>
    onChange(latest.current.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const remove = (id: string) => onChange(latest.current.filter((item) => item.id !== id));

  const placeAt = (event: MouseEvent) => {
    if ((event.target as Element).closest('.sign-item')) return;
    if (!signature) {
      onNeedSignature();
      return;
    }
    const rect = board.current!.getBoundingClientRect();
    const fx = (event.clientX - rect.left) / rect.width;
    const fy = (event.clientY - rect.top) / rect.height;
    // 가로로 긴 서명은 너비 기준, 도장처럼 정사각형에 가까우면 높이가 너무 커지지 않게 줄입니다.
    let width = DEFAULT_WIDTH;
    if (heightOf(width) > 0.2) width = 0.2 / (heightOf(1) || 1);
    const height = heightOf(width);
    const x = clamp(fx - width / 2, 0, 1 - width);
    const y = clamp(fy - height / 2, 0, 1 - height);
    onChange([...latest.current, { id: uid('sig'), page, x, y, width }]);
  };

  const startDrag = (event: PointerEvent, item: Placed, mode: Drag['mode']) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    drag.current = {
      id: item.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: item,
      rect: board.current!.getBoundingClientRect(),
    };
  };
  const moveDrag = (event: PointerEvent) => {
    const state = drag.current;
    if (!state) return;
    const dx = (event.clientX - state.startX) / state.rect.width;
    const dy = (event.clientY - state.startY) / state.rect.height;
    const { origin } = state;
    if (state.mode === 'move') {
      update(state.id, {
        x: clamp(origin.x + dx, 0, 1 - origin.width),
        y: clamp(origin.y + dy, 0, 1 - heightOf(origin.width)),
      });
    } else {
      update(state.id, { width: clamp(origin.width + dx, MIN_WIDTH, maxWidthAt(origin.x, origin.y)) });
    }
  };
  const endDrag = () => {
    drag.current = null;
  };

  const onKey = (event: KeyboardEvent, item: Placed) => {
    const step = event.shiftKey ? 0.05 : 0.01;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[event.key]) {
      event.preventDefault();
      const [dx, dy] = moves[event.key];
      update(item.id, {
        x: clamp(item.x + dx, 0, 1 - item.width),
        y: clamp(item.y + dy, 0, 1 - heightOf(item.width)),
      });
    } else if (event.key === '+' || event.key === '=' || event.key === '-') {
      event.preventDefault();
      const delta = event.key === '-' ? -step : step;
      update(item.id, { width: clamp(item.width + delta, MIN_WIDTH, maxWidthAt(item.x, item.y)) });
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      remove(item.id);
    }
  };

  const onPage = placements.filter((item) => item.page === page);

  return (
    <div class="sign-board">
      <div class="sign-board-head">
        <p class="field-label">{t.placeTitle}</p>
        <div class="sign-nav">
          <button
            type="button"
            class="btn btn-secondary btn-sm btn-icon"
            aria-label={t.prevPage}
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <span class="sign-nav-label">{fmt(t.pageOf, { page: page + 1, total })}</span>
          <button
            type="button"
            class="btn btn-secondary btn-sm btn-icon"
            aria-label={t.nextPage}
            disabled={page >= total - 1}
            onClick={() => setPage(page + 1)}
          >
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
      <p class="field-hint">{t.placeHint}</p>
      <div
        ref={board}
        class="sign-page"
        style={size ? { aspectRatio: `${size.width} / ${size.height}` } : undefined}
        onClick={placeAt}
      >
        {url ? <img src={url} alt="" draggable={false} /> : <div class="thumb-skeleton" />}
        {signature &&
          onPage.map((item) => (
            <div
              key={item.id}
              class="sign-item"
              role="group"
              tabIndex={0}
              aria-label={t.signatureLabel}
              style={{
                left: `${item.x * 100}%`,
                top: `${item.y * 100}%`,
                width: `${item.width * 100}%`,
                aspectRatio: `${signature.width} / ${signature.height}`,
              }}
              onPointerDown={(event) => startDrag(event, item, 'move')}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={(event) => onKey(event, item)}
            >
              <img src={signature.url} alt="" draggable={false} />
              <button
                type="button"
                class="sign-remove"
                aria-label={t.remove}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  remove(item.id);
                }}
              >
                <Icon name="x" size={14} />
              </button>
              <span
                class="sign-handle"
                aria-hidden="true"
                onPointerDown={(event) => startDrag(event, item, 'resize')}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            </div>
          ))}
      </div>
      {placements.length > 0 && <p class="sign-count">{fmt(t.placedCount, { n: placements.length })}</p>}
    </div>
  );
}

// ────────────────────────────── 도구 ──────────────────────────────

function SignTool({ t }: { t: ToolUi<'sign'> }) {
  const { ui, errors, lang } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [mode, setMode] = useState<Mode>('draw');
  const [color, setColor] = useState(COLORS[0]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [name, setName] = useState('');
  const [style, setStyle] = useState<TypedStyle>('script');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeWhite, setRemoveWhite] = useState(true);
  const [signature, setSignature] = useState<Signature | null>(null);
  const [placements, setPlacements] = useState<Placed[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);
  const files = usePdfFiles({ multiple: false, onError: setError });

  // 서명 이미지 (미리보기와 PDF 에 같은 이미지를 씁니다)
  const signatureUrl = useRef<string | null>(null);
  const showSignature = (next: SignatureImage | null) => {
    const previous = signatureUrl.current;
    const url = next ? URL.createObjectURL(next.blob) : null;
    signatureUrl.current = url;
    setSignature(next && url ? { ...next, url } : null);
    // 새 이미지가 그려질 때까지 이전 이미지를 잠시 유지해 깜박임을 막습니다.
    if (previous) setTimeout(() => URL.revokeObjectURL(previous), 1000);
  };
  useEffect(
    () => () => {
      if (signatureUrl.current) URL.revokeObjectURL(signatureUrl.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(
      async () => {
        let next: SignatureImage | null = null;
        try {
          if (mode === 'draw') next = await renderStrokes(strokes, color, LINE_WIDTH);
          else if (mode === 'type') next = await renderTypedSignature(name, style, color, lang);
          else if (imageFile) next = await loadSignatureImage(imageFile, removeWhite);
        } catch {
          if (!cancelled && mode === 'image') setError(describeError(new UnsupportedImageError(imageFile?.name ?? ''), errors));
        }
        if (!cancelled) showSignature(next);
      },
      mode === 'type' ? 150 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [mode, strokes, color, name, style, imageFile, removeWhite]);

  const apply = async (entry: ReadyEntry) => {
    setError(null);
    if (!signature) {
      setError(t.needSignature);
      return;
    }
    if (placements.length === 0) {
      setError(t.needPlacement);
      return;
    }
    const started = startBusy();
    setBusy(true);
    try {
      const bytes = new Uint8Array(await signature.blob.arrayBuffer());
      throwIfCancelled(started);
      const out = await runTask('sign', {
        file: toFileSource(entry),
        options: {
          images: [{ bytes, type: 'png' }],
          placements: placements.map(({ page, x, y, width }) => ({ page, image: 0, x, y, width })),
        },
      });
      await minBusyTime(started);
      setResult([{ name: `${safeFileName(baseName(entry.name))}_signed.pdf`, blob: pdfBlob(out) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPlacements([]);
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
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              <div class="split-layout sign-layout">
                <div class="options">
                  <Segmented<Mode>
                    label={t.create}
                    value={mode}
                    onChange={setMode}
                    options={[
                      { value: 'draw', label: t.modeDraw },
                      { value: 'type', label: t.modeType },
                      { value: 'image', label: t.modeImage },
                    ]}
                  />

                  {mode === 'draw' && (
                    <div class="field">
                      <SignaturePad strokes={strokes} color={color} label={t.modeDraw} hint={t.drawHint} onChange={setStrokes} />
                      <div class="input-row">
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          disabled={strokes.length === 0}
                          onClick={() => setStrokes(strokes.slice(0, -1))}
                        >
                          <Icon name="undo" size={16} />
                          {t.undo}
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm"
                          disabled={strokes.length === 0}
                          onClick={() => setStrokes([])}
                        >
                          <Icon name="trash" size={16} />
                          {t.clear}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === 'type' && (
                    <>
                      <Field label={t.name} htmlFor="sign-name">
                        <input
                          id="sign-name"
                          class="input"
                          value={name}
                          maxLength={60}
                          placeholder={t.namePlaceholder}
                          autoComplete="name"
                          onInput={(event) => setName(event.currentTarget.value)}
                        />
                      </Field>
                      <Segmented<TypedStyle>
                        label={t.style}
                        value={style}
                        onChange={setStyle}
                        options={[
                          { value: 'script', label: t.styleScript },
                          { value: 'serif', label: t.styleSerif },
                          { value: 'sans', label: t.styleSans },
                        ]}
                      />
                    </>
                  )}

                  {mode === 'image' && (
                    <>
                      <Field label={t.image} hint={t.imageHint}>
                        <input
                          ref={imageInput}
                          type="file"
                          accept={IMAGE_ACCEPT}
                          hidden
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            event.currentTarget.value = '';
                            if (file) setImageFile(file);
                          }}
                        />
                        <div class="input-row">
                          <button type="button" class="btn btn-secondary" onClick={() => imageInput.current?.click()}>
                            <Icon name="upload" size={16} />
                            {t.chooseImage}
                          </button>
                          {imageFile && <span class="file-meta">{imageFile.name}</span>}
                        </div>
                      </Field>
                      <Checkbox
                        label={t.removeBackground}
                        description={t.removeBackgroundDesc}
                        checked={removeWhite}
                        onChange={setRemoveWhite}
                      />
                    </>
                  )}

                  {mode !== 'image' && (
                    <fieldset class="field">
                      <legend class="field-label">{t.color}</legend>
                      <div class="swatches">
                        {COLORS.map((swatch) => (
                          <button
                            key={swatch}
                            type="button"
                            class={`swatch${swatch === color ? ' is-active' : ''}`}
                            style={{ background: swatch }}
                            aria-label={swatch}
                            aria-pressed={swatch === color}
                            onClick={() => setColor(swatch)}
                          />
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {signature && mode !== 'draw' && (
                    <figure class="sign-preview">
                      <figcaption class="field-label">{ui.preview}</figcaption>
                      <div class="sign-preview-box">
                        <img src={signature.url} alt={t.signatureLabel} />
                      </div>
                    </figure>
                  )}
                </div>

                <PlacementBoard
                  entry={entry}
                  t={t}
                  signature={signature}
                  placements={placements}
                  onChange={setPlacements}
                  onNeedSignature={() => setError(t.needSignature)}
                />
              </div>
              <div class="action-bar">
                <button type="button" class="btn btn-primary btn-lg" onClick={() => apply(entry)}>
                  <Icon name="sign" size={20} />
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

export default withToolRoot(SignTool);
