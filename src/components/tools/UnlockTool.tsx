import { useState } from 'preact/hooks';
import { type ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

function UnlockTool({ t }: { t: ToolUi<'unlock'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [restricted, setRestricted] = useState(false);
  const files = usePdfFiles({
    multiple: false,
    onError: setError,
    onReady: (entry) => {
      setNotice(null);
      setRestricted(false);
      // 열기 암호 없이 권한(인쇄·복사 등)만 제한된 파일인지 확인
      void entry.doc
        ?.getPermissions()
        .then((flags) => setRestricted(!!flags && !entry.password))
        .catch(() => undefined);
    },
  });

  const unlock = async (entry: ReadyEntry) => {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const { bytes, wasEncrypted } = await runTask('unlock', { file: toFileSource(entry) });
      if (!wasEncrypted) {
        setNotice(t.notEncrypted);
        return;
      }
      setResult([{ name: `${safeFileName(baseName(entry.name))}_unlocked.pdf`, blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setNotice(null);
    files.reset();
  };

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel files={result} onReset={reset} summary={<p class="result-summary">{t.unlocked}</p>} />
      ) : busy ? (
        <Busy message={ui.processing} onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <div class="workspace">
              <FileCard entry={entry} onRemove={reset} />
              {entry.password && (
                <div class="alert alert-success" role="status">
                  <Icon name="check" size={18} />
                  <span>{t.passwordAccepted}</span>
                </div>
              )}
              {restricted && !notice && (
                <div class="alert alert-info" role="status">
                  <Icon name="info" size={18} />
                  <span>{t.restricted}</span>
                </div>
              )}
              {notice && (
                <div class="alert alert-info" role="status">
                  <Icon name="info" size={18} />
                  <span>{notice}</span>
                </div>
              )}
              <div class="action-bar">
                <button type="button" class="btn btn-primary btn-lg" onClick={() => unlock(entry)}>
                  <Icon name="unlock" size={20} />
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

export default withToolRoot(UnlockTool);
