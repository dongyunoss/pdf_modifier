import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { fmt } from '../../i18n/format';
import { canPreview, downloadBlob, formatBytes, previewBlob } from '../../lib/files';
import { HANDOFF_PARAM, HANDOFF_VALUE, saveHandoff } from '../../lib/handoff';
import { holdPage } from '../../lib/leave-guard';
import { runTask } from '../../lib/pdf/client';
import { clearTabStatus, setTabStatus } from '../../lib/tab-status';
import { AdUnit } from './AdUnit';
import { BusyInline, type StepCount } from './Busy';
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
  const [zipCount, setZipCount] = useState<StepCount | null>(null);
  const [started, setStarted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  /** 결과를 받거나 열어 보기 전까지 켜 두는 페이지 떠나기 확인의 해제 함수 */
  const untaken = useRef<(() => void) | null>(null);
  const locale = localeOf(lang);
  const single = files.length === 1 ? files[0] : null;
  const pdf = single && single.blob.type === 'application/pdf' ? single : null;

  useEffect(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // 결과를 받기 전에 탭을 닫거나 다른 페이지로 가면 확인합니다 (만든 파일이 사라지므로).
  useEffect(() => {
    untaken.current = holdPage();
    return () => untaken.current?.();
  }, []);
  const markTaken = () => {
    untaken.current?.();
    untaken.current = null;
  };

  // 다른 탭을 보던 중에 끝났다면 탭 제목으로 알리고, 다시 돌아오면 원래 제목으로 되돌립니다.
  useEffect(() => {
    if (!document.hidden) return;
    setTabStatus(`✅ ${ui.doneTitle}`);
    const onVisible = () => {
      if (!document.hidden) clearTabStatus();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearTabStatus();
    };
  }, []);

  const save = async (blob: Blob, name: string) => {
    setSaveError(null);
    // 다운로드 링크를 누르는 순간 확인 창이 뜨지 않도록 먼저 해제합니다.
    markTaken();
    try {
      await downloadBlob(blob, name);
      setStarted(true);
    } catch (error) {
      setSaveError(describeError(error, errors));
    }
  };

  const preview = (blob: Blob) => {
    markTaken();
    previewBlob(blob);
  };

  const downloadZip = async () => {
    if (zip) {
      await save(zip, zipName);
      return;
    }
    setZipping(true);
    setZipCount(null);
    setSaveError(null);
    // ZIP 을 만드는 동안 페이지를 떠나면 작업이 사라지므로 확인합니다.
    const release = holdPage();
    let blob: Blob;
    try {
      const bytes = await runTask(
        'zip',
        { entries: files.map((file) => ({ name: file.name, data: file.blob })) },
        { onProgress: (done, total) => setZipCount({ done, total }) },
      );
      blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
      setZip(blob);
    } catch (error) {
      setSaveError(describeError(error, errors));
      return;
    } finally {
      release();
      setZipping(false);
    }
    await save(blob, zipName);
  };

  const continueWith = async (link: RelatedLink) => {
    markTaken();
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
            <button type="button" class="btn btn-secondary btn-lg" onClick={() => preview(pdf.blob)}>
              <Icon name="eye" size={20} />
              {ui.preview}
            </button>
          )}
          <p class="result-file">
            {single.name} · {formatBytes(single.blob.size, locale)}
          </p>
        </div>
      ) : (
        <div class="result-actions result-actions-multi">
          <p class="result-count">{fmt(ui.resultCount, { n: files.length })}</p>
          <button type="button" class="btn btn-primary btn-lg" disabled={zipping} onClick={downloadZip}>
            <Icon name="download" size={20} />
            {ui.downloadZip}
          </button>
          {zipping && <BusyInline label={ui.preparingZip} count={zipCount} />}
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

      {started && !saveError && (
        <p class="result-note" role="status">
          <Icon name="check" size={16} />
          {ui.downloadStarted}
        </p>
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
