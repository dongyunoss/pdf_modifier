import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { fmt } from '../../i18n/format';
import { holdPage } from '../../lib/leave-guard';
import { onTaskProgress } from '../../lib/pdf/client';
import { formatDuration, nextProgress } from '../../lib/progress';
import { clearTabStatus, setTabStatus } from '../../lib/tab-status';
import { Icon } from './Icon';
import { localeOf, useTool } from './context';
import { tipKeysFor } from './tips';

const TICK_MS = 250;
/** 팁은 잠시 기다린 뒤부터 이 간격으로 바꿔 가며 보여 줍니다. */
const TIP_AFTER_MS = 1500;
const TIP_EVERY_MS = 6500;
/** 경과 시간, "오래 걸릴 수 있음" 안내를 보여 주기 시작하는 시점 */
const ELAPSED_AFTER_MS = 3000;
const SLOW_AFTER_MS = 15000;

export interface StepCount {
  done: number;
  total: number;
}

const formatCount = ({ done, total }: StepCount, locale: string) =>
  `${done.toLocaleString(locale)} / ${total.toLocaleString(locale)}`;

/** 시작한 뒤 흐른 시간과 막대에 표시할 값 (실제 진행률을 모르면 시간에 따른 추정치) */
function useWaitProgress(actual: number | null) {
  const [startedAt] = useState(() => performance.now());
  const [now, setNow] = useState(startedAt);
  const shown = useRef(0);
  useEffect(() => {
    const timer = setInterval(() => setNow(performance.now()), TICK_MS);
    return () => clearInterval(timer);
  }, []);
  const elapsed = Math.max(0, now - startedAt);
  shown.current = nextProgress(elapsed, actual, shown.current);
  return { elapsed, value: shown.current };
}

/** 이 화면이 떠 있는 동안 워커가 알려 주는 진행 단계 */
function useWorkerCount(): StepCount | null {
  const [count, setCount] = useState<StepCount | null>(null);
  useEffect(() => onTaskProgress((done, total) => setCount(total > 0 ? { done, total } : null)), []);
  return count;
}

function ProgressBar({ value, actual, label, small }: { value: number; actual: number | null; label: string; small?: boolean }) {
  return (
    <div
      class={small ? 'busy-bar busy-bar-sm' : 'busy-bar'}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={actual == null ? undefined : Math.round(Math.min(1, Math.max(0, actual)) * 100)}
    >
      <span class="busy-bar-fill" style={{ width: `${(value * 100).toFixed(1)}%` }} />
    </div>
  );
}

/** 문서를 훑어 처리하는 모습의 그림 */
function BusyArt() {
  return (
    <div class="busy-art" aria-hidden="true">
      <svg viewBox="0 0 96 96" width="96" height="96">
        <circle class="busy-art-halo" cx="48" cy="48" r="40" />
        <circle class="busy-art-orbit" cx="48" cy="48" r="45" pathLength="100" />
        <g>
          <path class="busy-art-page" d="M36 22h18l10 10v38a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z" />
          <path class="busy-art-fold" d="M54 22v10h10" />
          <rect class="busy-art-line" x="37" y="40" width="21" height="3.5" rx="1.75" />
          <rect class="busy-art-line" x="37" y="48" width="23" height="3.5" rx="1.75" />
          <rect class="busy-art-line" x="37" y="56" width="16" height="3.5" rx="1.75" />
          <rect class="busy-art-line" x="37" y="64" width="20" height="3.5" rx="1.75" />
        </g>
        <rect class="busy-art-scan" x="29" y="30" width="38" height="2.5" rx="1.25" />
      </svg>
    </div>
  );
}

/** 다음 처리 화면이 이어서 보여 줄 팁의 위치 (처음에는 무작위) */
let tipCursor = -1;

interface BusyProps {
  /** loading: 파일을 여는 중, working: 작업을 처리하는 중 (페이지 떠나기 확인과 탭 제목 표시를 켭니다) */
  mode?: 'loading' | 'working';
  /** 세부 진행 상황 (예: "이미지 분석 중 3/12"). 없으면 워커가 알려 주는 단계 수를 보여 줍니다. */
  detail?: string | null;
  /** 실제 진행률 0~1. 없으면 워커가 알려 주는 진행률이나 시간에 따른 추정치를 씁니다. */
  progress?: number | null;
  onCancel?: () => void;
}

/**
 * 파일을 열거나 처리하는 동안 보여 주는 화면.
 * 진행 막대·경과 시간·안심 문구·팁으로 기다리는 동안 무슨 일이 일어나는지 알려 이탈을 줄입니다.
 */
export function Busy({ mode = 'working', detail, progress, onCancel }: BusyProps) {
  const { ui, lang, tool } = useTool();
  const locale = localeOf(lang);
  const working = mode === 'working';
  const count = useWorkerCount();
  const actual = progress ?? (count ? count.done / count.total : null);
  const { elapsed, value } = useWaitProgress(actual);
  const countText = count ? formatCount(count, locale) : null;
  const title = working ? ui.workingTitle : ui.loading;
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const tipKeys = useMemo(() => tipKeysFor(ui.tips, tool?.id), [ui, tool?.id]);
  const [firstTip] = useState(() => {
    if (tipCursor < 0) tipCursor = Math.floor(Math.random() * Math.max(1, tipKeys.length));
    return tipCursor;
  });
  const tipStep = elapsed < TIP_AFTER_MS ? -1 : Math.floor((elapsed - TIP_AFTER_MS) / TIP_EVERY_MS);
  const lastTipStep = useRef(tipStep);
  lastTipStep.current = tipStep;
  const tip = tipStep >= 0 && tipKeys.length ? ui.tips[tipKeys[(firstTip + tipStep) % tipKeys.length]] : null;

  useEffect(() => {
    // 다음 처리 화면은 이번에 보여 준 팁 다음부터 보여 줍니다.
    return () => {
      tipCursor = firstTip + lastTipStep.current + 1;
    };
  }, []);

  // 작업 중에는 화면을 보이게 하고, 페이지를 떠나기 전에 확인합니다.
  useEffect(() => {
    if (!working) return;
    heading.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    root.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    return holdPage();
  }, [working]);

  // 다른 탭을 보고 있어도 진행 중임을 알 수 있도록 탭 제목에 표시합니다.
  const tabText = `⏳ ${countText ? `${countText} · ` : ''}${ui.processing}`;
  useEffect(() => {
    if (working) setTabStatus(tabText);
  }, [working, tabText]);
  useEffect(() => (working ? clearTabStatus : undefined), [working]);

  return (
    <div ref={root} class={`busy busy-${mode}`} aria-busy="true">
      <BusyArt />
      {tool && <p class="busy-eyebrow">{tool.name}</p>}
      <h2 ref={heading} class="busy-title" tabIndex={-1}>
        {title}
      </h2>
      <p class="busy-detail">{detail ?? countText ?? ''}</p>
      <ProgressBar value={value} actual={actual} label={title} />
      <p class="busy-elapsed">
        {elapsed >= ELAPSED_AFTER_MS && (
          <>
            <Icon name="clock" size={14} />
            {fmt(ui.elapsed, { time: formatDuration(elapsed / 1000, locale) })}
          </>
        )}
      </p>
      {onCancel && (
        <button type="button" class="btn btn-ghost" onClick={onCancel}>
          {ui.cancel}
        </button>
      )}
      <div class="busy-note">
        <Icon name="shield" size={18} />
        <p>
          {ui.localOnly}
          {working && (
            <>
              <br />
              {ui.keepOpen}
            </>
          )}
        </p>
      </div>
      {tip && (
        <div class="busy-tip" role="note" key={tipStep}>
          <Icon name="bulb" size={18} />
          <p>
            <strong>{ui.tipLabel}</strong>
            {tip}
          </p>
        </div>
      )}
      {elapsed >= SLOW_AFTER_MS && <p class="busy-slow">{ui.slowNotice}</p>}
    </div>
  );
}

/** 결과 화면 안에서 짧게 기다릴 때(ZIP 만들기 등) 쓰는 작은 진행 표시 */
export function BusyInline({ label, count }: { label: string; count: StepCount | null }) {
  const { lang } = useTool();
  const actual = count ? count.done / count.total : null;
  const { value } = useWaitProgress(actual);
  return (
    <div class="busy-inline">
      <p class="busy-inline-label">
        <span class="spinner spinner-sm" aria-hidden="true" />
        <span role="status">{label}</span>
        {count && <span class="busy-inline-count">{formatCount(count, localeOf(lang))}</span>}
      </p>
      <ProgressBar value={value} actual={actual} label={label} small />
    </div>
  );
}
