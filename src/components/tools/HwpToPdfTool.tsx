import { useEffect, useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { hwpDownloadSize, hwpToPdf, type HwpProgress } from '../../lib/hwp/convert';
import { OfficeError } from '../../lib/office/assets';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { localeOf, useTool } from './context';

const ACCEPT = '.hwp,.hwpx';
const MB = 1024 * 1024;
const isHwp = (name: string) => /\.hwpx?$/i.test(name);

interface Stage {
  index: number;
  total: number;
  name: string;
  progress: HwpProgress;
}

/** 같은 이름의 결과가 겹치지 않게 (보고서.hwp, 보고서.hwpx → 보고서.pdf, 보고서 (2).pdf) */
function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name) => {
    let candidate = `${name}.pdf`;
    for (let n = 2; used.has(candidate.toLowerCase()); n++) candidate = `${name} (${n}).pdf`;
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

function HwpToPdfTool({ t }: { t: ToolUi<'hwp-to-pdf'> }) {
  const { ui, lang } = useTool();
  const office = ui.office;
  const locale = localeOf(lang);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [sizeMb, setSizeMb] = useState<number | null>(null);
  const run = useRef(0);

  useEffect(() => {
    hwpDownloadSize()
      .then((bytes) => setSizeMb(Math.max(1, Math.round(bytes / MB))))
      .catch(() => undefined);
  }, []);

  const describe = (err: unknown, name: string): string => {
    if (err instanceof OfficeError) {
      if (err.code === 'NETWORK') return office.network;
      if (err.code === 'MEMORY') return office.memory;
      if (err.code === 'OPEN_FAILED') return fmt(office.openFailed, { name });
    }
    return office.engine;
  };

  const convert = async (files: File[]) => {
    const id = ++run.current;
    const active = () => run.current === id;
    setError(null);
    setResult(null);
    const names = uniqueNames(files.map((file) => safeFileName(baseName(file.name))));
    const done: ResultFile[] = [];
    const failures: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        if (!active()) return;
        const update = (progress: HwpProgress) => {
          if (active()) setStage({ index, total: files.length, name: file.name, progress });
        };
        update({ phase: 'prepare', loaded: 0, total: 0 });
        try {
          const pdf = await hwpToPdf(file, update, () => !active());
          done.push({ name: names[index], blob: pdfBlob(pdf) });
        } catch (err) {
          if (!active()) return;
          // 문서 하나를 못 열어도 나머지는 계속 바꿉니다. 엔진을 못 받았으면 그만둡니다.
          if (!(err instanceof OfficeError && err.code === 'OPEN_FAILED')) throw err;
          failures.push(describe(err, file.name));
        }
      }
      if (!active()) return;
      if (failures.length) setError(failures.join(' '));
      if (done.length) setResult(done);
    } catch (err) {
      if (!active() || (err instanceof OfficeError && err.code === 'CANCELLED')) return;
      setError(describe(err, files[0]?.name ?? ''));
    } finally {
      if (active()) setStage(null);
    }
  };

  const addFiles = (files: File[]) => {
    const accepted = files.filter((file) => isHwp(file.name));
    const rejected = files.filter((file) => !isHwp(file.name));
    setError(rejected.length ? rejected.map((file) => fmt(t.notAccepted, { name: file.name })).join(' ') : null);
    if (accepted.length) void convert(accepted);
  };

  const cancel = () => {
    run.current++;
    setStage(null);
  };

  const mb = (bytes: number) => (bytes / MB).toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  let body;
  if (result) {
    body = <ResultPanel files={result} zipName="hwp-pdf.zip" onReset={() => setResult(null)} />;
  } else if (stage) {
    const { phase, loaded, total } = stage.progress;
    let detail: string;
    let progress: number | null;
    if (phase === 'download' && total > 0) {
      detail = fmt(office.downloading, { done: mb(loaded), total: mb(total) });
      progress = (loaded / total) * 0.5;
    } else if (phase === 'page' && total > 0) {
      detail = fmt(office.converting, { name: stage.name, n: stage.index + 1, total: stage.total });
      // 파일이 여러 개면 파일 단위, 하나면 쪽 단위로 막대를 채웁니다.
      progress = (stage.index + loaded / total) / stage.total;
    } else {
      detail = office.preparing;
      progress = null;
    }
    body = <Busy detail={detail} progress={progress} onCancel={cancel} />;
  } else {
    body = (
      <div class="workspace">
        <Dropzone accept={ACCEPT} multiple onFiles={addFiles} button={t.choose} hint={t.drop} />
        <ul class="office-notes">
          <li>
            <Icon name="file" size={16} />
            {t.formats}
          </li>
          {sizeMb !== null && (
            <li>
              <Icon name="download" size={16} />
              {fmt(office.engineNote, { size: sizeMb.toLocaleString(locale) })}
            </li>
          )}
          <li>
            <Icon name="info" size={16} />
            {office.fontNote}
          </li>
        </ul>
      </div>
    );
  }

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={stage ? undefined : addFiles}>
      {body}
    </ToolFrame>
  );
}

export default withToolRoot(HwpToPdfTool);
