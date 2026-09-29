import { PdfToolError } from './errors';

/**
 * "1-3, 5, 8-" 같은 페이지 범위 문자열을 0부터 시작하는 페이지 인덱스 그룹으로 변환합니다.
 * - `a-b` : a부터 b까지 (b < a 이면 역순)
 * - `a-`  : a부터 마지막 페이지까지
 * - `-b`  : 첫 페이지부터 b까지
 * - 쉼표, 공백, 세미콜론으로 구분
 *
 * @returns 쉼표로 구분된 각 항목이 하나의 그룹 (분할 도구에서 파일 하나가 됨)
 */
export function parsePageRanges(input: string, pageCount: number): number[][] {
  const tokens = input
    .split(/[,;\n]+/)
    .map((token) => token.replace(/\s+/g, ''))
    .filter(Boolean);

  if (tokens.length === 0) {
    throw new PdfToolError('INVALID_RANGE', 'empty range');
  }

  const toIndex = (raw: string, token: string): number => {
    if (!/^\d+$/.test(raw)) throw new PdfToolError('INVALID_RANGE', `invalid token: ${token}`);
    const n = Number(raw);
    if (n < 1 || n > pageCount) {
      throw new PdfToolError('INVALID_RANGE', `page out of range: ${token}`);
    }
    return n - 1;
  };

  return tokens.map((token) => {
    const dash = token.match(/^(\d*)[-~–](\d*)$/);
    if (!dash) return [toIndex(token, token)];
    const [, startRaw, endRaw] = dash;
    if (!startRaw && !endRaw) throw new PdfToolError('INVALID_RANGE', `invalid token: ${token}`);
    const start = startRaw ? toIndex(startRaw, token) : 0;
    const end = endRaw ? toIndex(endRaw, token) : pageCount - 1;
    const step = start <= end ? 1 : -1;
    const group: number[] = [];
    for (let i = start; step > 0 ? i <= end : i >= end; i += step) group.push(i);
    return group;
  });
}

/** 범위 문자열을 하나의 페이지 목록으로 합칩니다 (중복 제거, 입력 순서 유지). */
export function parsePageSelection(input: string, pageCount: number): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (const group of parsePageRanges(input, pageCount)) {
    for (const index of group) {
      if (!seen.has(index)) {
        seen.add(index);
        result.push(index);
      }
    }
  }
  return result;
}

/** 0부터 시작하는 인덱스 목록을 "1-3, 5" 형태의 사람이 읽기 쉬운 문자열로 만듭니다. */
export function formatPageRanges(indices: number[]): string {
  const sorted = [...new Set(indices)].sort((a, b) => a - b);
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(i === j ? `${sorted[i] + 1}` : `${sorted[i] + 1}-${sorted[j] + 1}`);
    i = j + 1;
  }
  return parts.join(', ');
}

/** 전체 페이지를 N페이지씩 나눈 그룹 */
export function chunkPages(pageCount: number, size: number): number[][] {
  const chunk = Math.max(1, Math.floor(size));
  const groups: number[][] = [];
  for (let start = 0; start < pageCount; start += chunk) {
    const group: number[] = [];
    for (let i = start; i < Math.min(pageCount, start + chunk); i++) group.push(i);
    groups.push(group);
  }
  return groups;
}
