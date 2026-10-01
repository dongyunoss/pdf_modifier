// 기다리는 동안 보여 줄 진행 막대와 경과 시간 계산 (화면과 무관한 순수 함수)

/** 막대가 처음부터 비어 보이지 않도록 시작하는 값 */
const START = 0.04;
/** 작업이 실제로 끝나기 전에는 막대가 이 값을 넘지 않습니다. */
export const PROGRESS_CAP = 0.95;

/**
 * 실제 진행률을 모를 때의 추정치.
 * 처음에는 빠르게, 시간이 지날수록 천천히 PROGRESS_CAP 에 다가가므로 오래 걸려도 멈춘 것처럼 보이지 않습니다.
 * halfMs 가 지나면 시작값과 상한의 중간쯤에 이릅니다.
 */
export function estimatedProgress(elapsedMs: number, halfMs = 4000): number {
  const t = Math.max(0, elapsedMs);
  return START + (PROGRESS_CAP - START) * (t / (t + halfMs));
}

/**
 * 막대에 표시할 다음 값.
 * 실제 진행률(0~1)이 추정치보다 앞서면 실제 값을 따르고, 이전 값보다 뒤로 가지 않으며,
 * 작업이 끝나기 전에는 PROGRESS_CAP 을 넘지 않습니다.
 */
export function nextProgress(elapsedMs: number, actual: number | null | undefined, previous = 0): number {
  const real = actual == null || !Number.isFinite(actual) ? 0 : Math.min(1, Math.max(0, actual)) * PROGRESS_CAP;
  return Math.min(PROGRESS_CAP, Math.max(previous, estimatedProgress(elapsedMs), real));
}

const unitFormats = new Map<string, Intl.NumberFormat>();

function unitFormat(locale: string, unit: 'minute' | 'second'): Intl.NumberFormat {
  const key = `${locale}|${unit}`;
  let format = unitFormats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short' });
    unitFormats.set(key, format);
  }
  return format;
}

/** 경과 시간을 그 언어의 단위로 표시합니다 (예: "12초", "1분 5초", "1 min 5 sec"). */
export function formatDuration(totalSeconds: number, locale: string): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = unitFormat(locale, 'second').format(seconds % 60);
  return minutes ? `${unitFormat(locale, 'minute').format(minutes)} ${rest}` : rest;
}
