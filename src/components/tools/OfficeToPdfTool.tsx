import { useEffect, useRef, useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { fmt } from '../../i18n/format';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { saveOfficeFiles, takeOfficeFiles } from '../../lib/handoff';
import { detectScripts, extensionOf, fontPacksFor, isOfficeFile, officeAccept, type FontPack, type OfficeKind } from '../../lib/office/detect';
import {
  convertToPdf,
  engineDownloadSize,
  engineSupported,
  OfficeError,
  prepareEngine,
  stopEngine,
  type EngineProgress,
} from '../../lib/office/engine';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { localeOf, useTool } from './context';

type OfficeUi = ToolUi<'word-to-pdf'> | ToolUi<'ppt-to-pdf'>;

interface Props {
  kind: OfficeKind;
  /**
   * 변환 화면 주소. 엔진은 교차 출처 격리된 페이지에서만 돌아가므로,
   * 일반 도구 페이지에서는 고른 파일을 이 화면으로 넘깁니다. 없으면(체험판 등) 변환할 수 없다고 안내합니다.
   */
  convertUrl?: string;
  t: OfficeUi;
}

type Stage =
  | { type: 'moving' }
  | { type: 'engine'; progress: EngineProgress }
  | { type: 'converting'; index: number; total: number; name: string };

const MB = 1024 * 1024;

/** 같은 이름의 결과가 겹치지 않게 (보고서.docx, 보고서.doc → 보고서.pdf, 보고서 (2).pdf) */
function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name) => {
    let candidate = `${name}.pdf`;
    for (let n = 2; used.has(candidate.toLowerCase()); n++) candidate = `${name} (${n}).pdf`;
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

function OfficeToPdfTool({ kind, convertUrl, t }: Props) {
  const { ui, lang } = useTool();
  const office = ui.office;
  const locale = localeOf(lang);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [sizeMb, setSizeMb] = useState<number | null>(null);
  /** 이 화면에서 엔진을 돌릴 수 있는지 (변환 화면 = 교차 출처 격리됨). 첫 렌더 뒤에 확인합니다. */
  const [here, setHere] = useState<boolean | null>(null);
  const run = useRef(0);

  /** 지금 변환 화면에 있는지 (격리되지 않았다면 이 브라우저가 지원하지 않거나 헤더가 빠진 것) */
  const onConvertPage = () => !!convertUrl && new URL(convertUrl, window.location.href).pathname === window.location.pathname;

  useEffect(() => {
    const supported = engineSupported();
    setHere(supported);
    engineDownloadSize()
      .then((bytes) => setSizeMb(Math.max(1, Math.round(bytes / MB))))
      .catch(() => undefined);
    if (!supported) {
      if (onConvertPage()) {
        setError(office.unsupported);
        void takeOfficeFiles();
      }
      return;
    }
    // 도구 페이지에서 넘어온 파일이 있으면 바로 변환합니다.
    takeOfficeFiles().then((files) => {
      if (files.length) convert(files);
    });
    return () => stopEngine();
  }, []);

  const mb = (bytes: number) => (bytes / MB).toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  const describe = (err: unknown, name: string): string => {
    if (err instanceof OfficeError) {
      switch (err.code) {
        case 'UNSUPPORTED':
          return office.unsupported;
        case 'NETWORK':
          return office.network;
        case 'MEMORY':
          return office.memory;
        case 'OPEN_FAILED':
          return fmt(office.openFailed, { name });
        case 'TIMEOUT':
          return fmt(office.timeout, { name });
        default:
          return office.engine;
      }
    }
    return office.engine;
  };

  const convert = async (files: File[]) => {
    const id = ++run.current;
    const active = () => run.current === id;
    setError(null);
    setResult(null);
    try {
      // 문서에 쓰인 글자(한글·일본어·중국어)에 맞는 글꼴만 엔진과 함께 내려받습니다.
      const packs = new Set<FontPack>();
      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        for (const pack of fontPacksFor(detectScripts(bytes), lang)) packs.add(pack);
      }
      if (!active()) return;
      setStage({ type: 'engine', progress: { phase: 'prepare', loaded: 0, total: 0 } });
      await prepareEngine([...packs], (progress) => {
        if (active()) setStage({ type: 'engine', progress });
      });
      const names = uniqueNames(files.map((file) => safeFileName(baseName(file.name))));
      const done: ResultFile[] = [];
      const failures: string[] = [];
      for (const [index, file] of files.entries()) {
        if (!active()) return;
        setStage({ type: 'converting', index, total: files.length, name: file.name });
        try {
          const pdf = await convertToPdf(file, extensionOf(file.name));
          done.push({ name: names[index], blob: pdfBlob(pdf) });
        } catch (err) {
          if (!active()) return;
          // 문서 하나를 못 열어도 나머지는 계속 변환합니다. 엔진 자체가 멈췄다면 그만둡니다.
          if (err instanceof OfficeError && err.code !== 'OPEN_FAILED' && err.code !== 'TIMEOUT') throw err;
          failures.push(describe(err, file.name));
          if (err instanceof OfficeError && err.code === 'TIMEOUT') await prepareEngine([...packs], () => undefined);
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
    const accepted = files.filter((file) => isOfficeFile(kind, file.name));
    const rejected = files.filter((file) => !isOfficeFile(kind, file.name));
    setError(rejected.length ? rejected.map((file) => fmt(t.notAccepted, { name: file.name })).join(' ') : null);
    if (!accepted.length) return;
    if (here) {
      convert(accepted);
      return;
    }
    if (!convertUrl || onConvertPage()) {
      setError(office.unsupported);
      return;
    }
    // 변환 화면으로 파일을 넘기고 이동합니다. 넘기지 못하면(사생활 보호 모드 등) 그 화면에서 다시 고르게 됩니다.
    setStage({ type: 'moving' });
    saveOfficeFiles(accepted).finally(() => window.location.assign(convertUrl));
  };

  const cancel = () => {
    run.current++;
    stopEngine();
    setStage(null);
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  let detail: string | null = null;
  let progress: number | null = null;
  if (stage?.type === 'engine') {
    const { phase, loaded, total } = stage.progress;
    if (phase === 'download' && total > 0) {
      detail = fmt(office.downloading, { done: mb(loaded), total: mb(total) });
      progress = (loaded / total) * 0.85;
    } else {
      detail = office.preparing;
      progress = 0.9;
    }
  } else if (stage?.type === 'converting') {
    detail = fmt(office.converting, { name: stage.name, n: stage.index + 1, total: stage.total });
    progress = stage.total > 1 ? stage.index / stage.total : null;
  }

  let body;
  if (result) {
    body = <ResultPanel files={result} zipName={kind === 'word' ? 'word-pdf.zip' : 'ppt-pdf.zip'} onReset={reset} />;
  } else if (stage?.type === 'moving') {
    body = <Busy mode="loading" detail={office.moving} />;
  } else if (stage) {
    body = <Busy detail={detail} progress={progress} onCancel={cancel} />;
  } else {
    body = (
      <div class="workspace">
        <Dropzone accept={officeAccept(kind)} multiple onFiles={addFiles} button={t.choose} hint={t.drop} />
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

export default withToolRoot(OfficeToPdfTool);
