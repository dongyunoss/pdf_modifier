import { useEffect, useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { fontStackFor, IMAGE_ACCEPT, imageSize, prepareImage, renderTextImage } from '../../lib/images';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { watermarkCenters } from '../../lib/pdf/geometry';
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

type Kind = 'text' | 'image';
type Layout = 'center' | 'tile';
type PagesMode = 'all' | 'custom';

interface Stamp {
  url: string;
  width: number;
  height: number;
}

const COLORS = ['#e11d48', '#6b7280', '#111827', '#2563eb'];

function WatermarkTool({ t }: { t: ToolUi<'watermark'> }) {
  const { ui, errors, lang } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [kind, setKind] = useState<Kind>('text');
  const [text, setText] = useState(t.textDefault);
  const [color, setColor] = useState(COLORS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scale, setScale] = useState(0.6);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(45);
  const [layout, setLayout] = useState<Layout>('center');
  const [pagesMode, setPagesMode] = useState<PagesMode>('all');
  const [pages, setPages] = useState('');
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const files = usePdfFiles({ multiple: false, onError: setError });

  // 미리보기용 워터마크 이미지 (문구는 입력이 잠시 멈추면 다시 그림)
  const stampUrl = useRef<string | null>(null);
  const showStamp = (next: Stamp | null) => {
    const previous = stampUrl.current;
    stampUrl.current = next?.url ?? null;
    setStamp(next);
    // 새 이미지가 그려질 때까지 이전 이미지를 잠시 유지해 깜박임을 막습니다.
    if (previous && previous !== next?.url) setTimeout(() => URL.revokeObjectURL(previous), 1000);
  };
  useEffect(
    () => () => {
      if (stampUrl.current) URL.revokeObjectURL(stampUrl.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        let next: Stamp | null = null;
        if (kind === 'text' && text.trim()) {
          const image = await renderTextImage(text, { color, fontFamily: fontStackFor(lang) });
          next = { url: URL.createObjectURL(image.blob), width: image.width, height: image.height };
        } else if (kind === 'image' && imageFile) {
          const size = await imageSize(imageFile);
          next = { url: URL.createObjectURL(imageFile), ...size };
        }
        if (cancelled) {
          if (next) URL.revokeObjectURL(next.url);
          return;
        }
        showStamp(next);
      } catch {
        if (!cancelled) showStamp(null);
      }
    }, kind === 'text' ? 150 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kind, text, color, imageFile]);

  const apply = async (entry: ReadyEntry) => {
    setError(null);
    let targetPages: number[] | undefined;
    if (pagesMode === 'custom') {
      try {
        targetPages = parsePageSelection(pages, entry.pageCount);
      } catch (err) {
        setError(describeError(err, errors));
        return;
      }
    }
    if (kind === 'text' && !text.trim()) {
      setError(t.needText);
      return;
    }
    if (kind === 'image' && !imageFile) {
      setError(t.needImage);
      return;
    }
    setBusy(true);
    try {
      let image: { bytes: Uint8Array; type: 'png' | 'jpeg' };
      if (kind === 'text') {
        const rendered = await renderTextImage(text, { color, fontFamily: fontStackFor(lang) });
        image = { bytes: new Uint8Array(await rendered.blob.arrayBuffer()), type: 'png' };
      } else {
        const prepared = await prepareImage(imageFile!);
        image = { bytes: new Uint8Array(await prepared.data.arrayBuffer()), type: prepared.type };
      }
      const bytes = await runTask('watermark', {
        file: toFileSource(entry),
        options: { image, scale, opacity, rotation, layout, pages: targetPages },
      });
      setResult([{ name: `${safeFileName(baseName(entry.name))}_watermarked.pdf`, blob: pdfBlob(bytes) }]);
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
        <Busy message={ui.processing} onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              <div class="split-layout">
                <div class="options">
                  <Segmented<Kind>
                    label={t.type}
                    value={kind}
                    onChange={setKind}
                    options={[
                      { value: 'text', label: t.typeText },
                      { value: 'image', label: t.typeImage },
                    ]}
                  />
                  {kind === 'text' ? (
                    <>
                      <Field label={t.text} htmlFor="wm-text">
                        <input
                          id="wm-text"
                          class="input"
                          value={text}
                          maxLength={120}
                          onInput={(event) => setText(event.currentTarget.value)}
                        />
                      </Field>
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
                          <input
                            type="color"
                            class="swatch-picker"
                            value={color}
                            aria-label={t.color}
                            onInput={(event) => setColor(event.currentTarget.value)}
                          />
                        </div>
                      </fieldset>
                    </>
                  ) : (
                    <Field label={t.image}>
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
                  )}
                  <Slider
                    label={t.size}
                    value={Math.round(scale * 100)}
                    min={10}
                    max={100}
                    step={5}
                    onChange={(value) => setScale(value / 100)}
                    display={(value) => `${value}%`}
                  />
                  <Slider
                    label={t.opacity}
                    value={Math.round(opacity * 100)}
                    min={5}
                    max={100}
                    step={5}
                    onChange={(value) => setOpacity(value / 100)}
                    display={(value) => `${value}%`}
                  />
                  <Slider
                    label={t.rotation}
                    value={rotation}
                    min={-90}
                    max={90}
                    step={5}
                    onChange={setRotation}
                    display={(value) => `${value}°`}
                  />
                  <Segmented<Layout>
                    label={t.layout}
                    value={layout}
                    onChange={(value) => {
                      setLayout(value);
                      // 바둑판 배치는 작게, 가운데 배치는 크게 찍는 것이 자연스럽습니다.
                      if (value === 'tile' && scale > 0.35) setScale(0.3);
                      if (value === 'center' && scale < 0.35) setScale(0.6);
                    }}
                    options={[
                      { value: 'center', label: t.layoutCenter },
                      { value: 'tile', label: t.layoutTile },
                    ]}
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
                    if (!stamp) return null;
                    const width = page.width * scale;
                    const height = (stamp.height / stamp.width) * width;
                    return watermarkCenters(page.width, page.height, width, height, rotation, layout).map(([cx, cy], i) => (
                      <img
                        key={i}
                        src={stamp.url}
                        alt=""
                        class="preview-stamp"
                        style={{
                          left: `${((cx - width / 2) / page.width) * 100}%`,
                          top: `${((page.height - cy - height / 2) / page.height) * 100}%`,
                          width: `${(width / page.width) * 100}%`,
                          opacity,
                          transform: `rotate(${-rotation}deg)`,
                        }}
                      />
                    ));
                  }}
                </PagePreview>
              </div>
              <div class="action-bar">
                <button type="button" class="btn btn-primary btn-lg" onClick={() => apply(entry)}>
                  <Icon name="watermark" size={20} />
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

export default withToolRoot(WatermarkTool);
