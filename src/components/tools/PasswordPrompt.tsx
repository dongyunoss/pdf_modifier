import { useState } from 'preact/hooks';
import { fmt } from '../../i18n/format';
import { Icon } from './Icon';
import { useTool } from './context';
import type { PdfEntry } from './usePdfFiles';

interface PasswordPromptProps {
  entry: PdfEntry;
  onSubmit: (password: string) => void;
  onSkip: () => void;
}

export function PasswordPrompt({ entry, onSubmit, onSkip }: PasswordPromptProps) {
  const { ui } = useTool();
  const [value, setValue] = useState('');
  return (
    <form
      class="password-card"
      onSubmit={(event) => {
        event.preventDefault();
        if (value) onSubmit(value);
      }}
    >
      <div class="password-card-title">
        <Icon name="lock" size={18} />
        <strong>{ui.passwordTitle}</strong>
      </div>
      <p>{fmt(ui.passwordPrompt, { name: entry.name })}</p>
      {entry.wrongPassword && (
        <p class="form-error" role="alert">
          {ui.passwordIncorrect}
        </p>
      )}
      <div class="password-card-row">
        <input
          type="password"
          class="input"
          autoComplete="off"
          placeholder={ui.passwordPlaceholder}
          value={value}
          onInput={(event) => setValue(event.currentTarget.value)}
          aria-label={ui.passwordPlaceholder}
          autoFocus
        />
        <button type="submit" class="btn btn-primary" disabled={!value}>
          {ui.unlockFile}
        </button>
        <button type="button" class="btn btn-ghost" onClick={onSkip}>
          {ui.skipFile}
        </button>
      </div>
    </form>
  );
}
