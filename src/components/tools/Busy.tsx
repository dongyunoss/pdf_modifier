import { useTool } from './context';

interface BusyProps {
  message: string;
  /** 0 ~ 1. 없으면 진행률 막대를 표시하지 않음 */
  progress?: number | null;
  onCancel?: () => void;
}

export function Busy({ message, progress, onCancel }: BusyProps) {
  const { ui } = useTool();
  return (
    <div class="busy" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true" />
      <p class="busy-message">{message}</p>
      {progress != null && (
        <div class="progress" aria-hidden="true">
          <div class="progress-bar" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
        </div>
      )}
      {onCancel && (
        <button type="button" class="btn btn-ghost" onClick={onCancel}>
          {ui.cancel}
        </button>
      )}
    </div>
  );
}
