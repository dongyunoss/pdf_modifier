import { useState } from 'preact/hooks';
import type { ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName } from '../../lib/files';
import { cancelAllTasks, minBusyTime, runTask, startBusy } from '../../lib/pdf/client';
import { Busy } from './Busy';
import { FileCard, SingleFileGate, type ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { Checkbox, Field } from './controls';
import { describeError, isCancelled, useTool } from './context';
import { toFileSource, usePdfFiles } from './usePdfFiles';

function ProtectTool({ t }: { t: ToolUi<'protect'> }) {
  const { errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const [permissions, setPermissions] = useState({ printing: true, copying: true, modifying: true, annotating: true });
  const files = usePdfFiles({ multiple: false, onError: setError });

  const mismatch = confirm.length > 0 && password !== confirm;
  const validation = !password ? t.required : password !== confirm ? t.mismatch : null;

  const protect = async (entry: ReadyEntry) => {
    setTouched(true);
    setError(null);
    if (validation) return;
    const started = startBusy();
    setBusy(true);
    try {
      const bytes = await runTask('protect', {
        file: toFileSource(entry),
        options: { userPassword: password, permissions },
      });
      await minBusyTime(started);
      setResult([{ name: `${safeFileName(baseName(entry.name))}_protected.pdf`, blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPassword('');
    setConfirm('');
    setTouched(false);
    files.reset();
  };

  const toggle = (key: keyof typeof permissions) => (checked: boolean) =>
    setPermissions((current) => ({ ...current, [key]: checked }));

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {result ? (
        <ResultPanel files={result} onReset={reset} />
      ) : busy ? (
        <Busy onCancel={cancelAllTasks} />
      ) : (
        <SingleFileGate files={files}>
          {(entry) => (
            <form
              class="workspace"
              onSubmit={(event) => {
                event.preventDefault();
                void protect(entry);
              }}
            >
              <FileCard entry={entry} onRemove={reset} />
              <div class="options options-narrow">
                <Field label={t.password} htmlFor="pw-new">
                  <div class="input-row">
                    <input
                      id="pw-new"
                      class="input"
                      type={visible ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onInput={(event) => setPassword(event.currentTarget.value)}
                    />
                    <button type="button" class="btn btn-ghost" onClick={() => setVisible(!visible)} aria-pressed={visible}>
                      {visible ? t.hide : t.show}
                    </button>
                  </div>
                </Field>
                <Field
                  label={t.confirm}
                  htmlFor="pw-confirm"
                  error={mismatch || (touched && validation) ? (validation ?? t.mismatch) : null}
                >
                  <input
                    id="pw-confirm"
                    class="input"
                    type={visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirm}
                    onInput={(event) => setConfirm(event.currentTarget.value)}
                  />
                </Field>
                <fieldset class="field">
                  <legend class="field-label">{t.permissions}</legend>
                  <Checkbox label={t.allowPrinting} checked={permissions.printing} onChange={toggle('printing')} />
                  <Checkbox label={t.allowCopying} checked={permissions.copying} onChange={toggle('copying')} />
                  <Checkbox label={t.allowModifying} checked={permissions.modifying} onChange={toggle('modifying')} />
                  <Checkbox label={t.allowAnnotating} checked={permissions.annotating} onChange={toggle('annotating')} />
                </fieldset>
                <div class="alert alert-warning">
                  <Icon name="alert" size={18} />
                  <span>{t.warning}</span>
                </div>
              </div>
              <div class="action-bar">
                <button type="submit" class="btn btn-primary btn-lg">
                  <Icon name="protect" size={20} />
                  {t.action}
                </button>
              </div>
            </form>
          )}
        </SingleFileGate>
      )}
    </ToolFrame>
  );
}

export default withToolRoot(ProtectTool);
