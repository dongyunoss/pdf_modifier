import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { fmt } from '../../i18n/format';
import { canPreview, downloadBlob, formatBytes, previewBlob } from '../../lib/files';
import { HANDOFF_PARAM, HANDOFF_VALUE, saveHandoff } from '../../lib/handoff';
import { runTask } from '../../lib/pdf/client';
import { AdUnit } from './AdUnit';
import { Icon } from './Icon';
import { describeError, localeOf, useTool, type RelatedLink } from './context';

export interface ResultFile {
  name: string;
  blob: Blob;
}

interface ResultPanelProps {
  files: ResultFile[];
  /** 결과가 여러 개일 때 ZIP 파일 이름 */
  zipName?: string;
  /** 압축률 같은 추가 정보 */
  summary?: ComponentChildren;
  onReset: () => void;
}

export function ResultPanel({ files, zipName = 'files.zip', summary, onReset }: ResultPanelProps) {
  const { ui, errors, lang, related, resultAd, navigate } = useTool();
  const heading = useRef<HTMLHeadingElement>(null);
  const [zip, setZip] = useState<Blob | null>(null);
  const [zipping, setZipping] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const locale = localeOf(lang);
  const single = files.length === 1 ? files[0] : null;
  const pdf = single && single.blob.type === 'application/pdf' ? single : null;

  useEffect(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const save = async (blob: Blob, name: string) => {
    setSaveError(null);
    try {
      await downloadBlob(blob, name);
    } catch (error) {
      setSaveError(describeError(error, errors));
    }
  };

  const downloadZip = async () => {
    if (zip) {
      await save(zip, zipName);
      return;
    }
    setZipping(true);
    setSaveError(null);
    let blob: Blob;
    try {
      const bytes = await runTask('zip', { entries: files.map((file) => ({ name: file.name, data: file.blob })) });
      blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
      setZip(blob);
    } catch (error) {
      setSaveError(describeError(error, errors));
      return;
    } finally {
      setZipping(false);
    }
    await save(blob, zipName);
  };

  const continueWith = async (link: RelatedLink) => {
    const handOver = pdf && link.acceptsPdf ? pdf : null;
    if (navigate) {
      navigate(link.href, handOver ? [new File([handOver.blob], handOver.name, { type: 'application/pdf' })] : []);
      return;
    }
    if (handOver) await saveHandoff(handOver.name, handOver.blob);
    window.location.href = handOver ? `${link.href}?${HANDOFF_PARAM}=${HANDOFF_VALUE}` : link.href;
  };

  return (
    <section class="result" aria-live="polite">
      <div class="result-head">
        <span class="result-icon" aria-hidden="true">
          <Icon name="check" size={28} />
        </span>
        <h2 ref={heading} tabIndex={-1}>
          {ui.doneTitle}
        </h2>
        {summary}
      </div>

      {single ? (
        <div class="result-actions">
          <button type="button" class="btn btn-primary btn-lg" onClick={() => save(single.blob, single.name)}>
            <Icon name="download" size={20} />
            {ui.download}
          </button>
          {pdf && canPreview() && (
            <button type="button" class="btn btn-secondary btn-lg" onClick={() => previewBlob(pdf.blob)}>
              <Icon name="eye" size={20} />
              {ui.preview}
            </button>
          )}
          <p class="result-file">
            {single.name} · {formatBytes(single.blob.size, locale)}
          </p>
        </div>
      ) : (
        <div class="result-actions">
          <p class="result-count">{fmt(ui.resultCount, { n: files.length })}</p>
          <button type="button" class="btn btn-primary btn-lg" disabled={zipping} onClick={downloadZip}>
            <Icon name="download" size={20} />
            {zipping ? ui.processing : ui.downloadZip}
          </button>
          <ul class="result-list">
            {files.map((file) => (
              <li key={file.name}>
                <Icon name="file" size={16} />
                <span class="result-list-name" title={file.name}>
                  {file.name}
                </span>
                <span class="result-list-size">{formatBytes(file.blob.size, locale)}</span>
                <button type="button" class="btn btn-ghost btn-sm" onClick={() => save(file.blob, file.name)}>
                  {ui.download}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {saveError && (
        <p class="form-error" role="alert">
          {saveError}
        </p>
      )}

      <button type="button" class="btn btn-link" onClick={onReset}>
        <Icon name="undo" size={16} />
        {ui.startOver}
      </button>

      {resultAd && <AdUnit config={resultAd} label={ui.ad} />}

      {related.length > 0 && (
        <nav class="result-next" aria-label={ui.continueWith}>
          <h3>{ui.continueWith}</h3>
          <div class="chip-row">
            {related.map((link) => (
              <a
                key={link.href}
                class="chip"
                href={link.href}
                onClick={
                  (pdf && link.acceptsPdf) || navigate
                    ? (event) => {
                        event.preventDefault();
                        void continueWith(link);
                      }
                    : undefined
                }
              >
                {link.name}
                <Icon name="arrow-right" size={16} />
              </a>
            ))}
          </div>
        </nav>
      )}
    </section>
  );
}
