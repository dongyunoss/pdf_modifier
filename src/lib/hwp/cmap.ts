// TrueType 글꼴의 cmap 표를 읽어 어떤 글자를 그릴 수 있는지 알아냅니다.
// HWP → PDF 변환에서 기본 글꼴(나눔)에 없는 글자(한자, ①, ㉠ 등)만 보조 글꼴로 돌리는 데 씁니다.

/** 글꼴이 그릴 수 있는 유니코드 코드 포인트 집합 */
export function readCoverage(font: Uint8Array): Set<number> {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength);
  const tables = view.getUint16(4);
  let cmap = -1;
  for (let i = 0; i < tables; i++) {
    const record = 12 + i * 16;
    if (view.getUint32(record) === 0x636d6170 /* 'cmap' */) cmap = view.getUint32(record + 8);
  }
  if (cmap < 0) throw new Error('cmap table not found');

  // 유니코드 표 중 전체 범위(형식 12)를 우선, 없으면 BMP(형식 4)를 씁니다.
  let best = -1;
  let bestFormat = 0;
  const subtables = view.getUint16(cmap + 2);
  for (let i = 0; i < subtables; i++) {
    const platform = view.getUint16(cmap + 4 + i * 8);
    const encoding = view.getUint16(cmap + 6 + i * 8);
    const offset = cmap + view.getUint32(cmap + 8 + i * 8);
    const format = view.getUint16(offset);
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode || (format !== 4 && format !== 12)) continue;
    if (format > bestFormat) {
      best = offset;
      bestFormat = format;
    }
  }
  if (best < 0) throw new Error('no unicode cmap');

  const covered = new Set<number>();
  if (bestFormat === 12) {
    const groups = view.getUint32(best + 12);
    for (let i = 0; i < groups; i++) {
      const group = best + 16 + i * 12;
      const start = view.getUint32(group);
      const end = view.getUint32(group + 4);
      const glyph = view.getUint32(group + 8);
      for (let cp = start; cp <= end; cp++) if (glyph + (cp - start) !== 0) covered.add(cp);
    }
    return covered;
  }

  const segments = view.getUint16(best + 6) / 2;
  const ends = best + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const ranges = deltas + segments * 2;
  for (let s = 0; s < segments; s++) {
    const end = view.getUint16(ends + s * 2);
    const start = view.getUint16(starts + s * 2);
    const delta = view.getInt16(deltas + s * 2);
    const rangeOffset = view.getUint16(ranges + s * 2);
    for (let cp = start; cp <= end && cp !== 0xffff; cp++) {
      let glyph: number;
      if (rangeOffset === 0) {
        glyph = (cp + delta) & 0xffff;
      } else {
        const at = ranges + s * 2 + rangeOffset + (cp - start) * 2;
        glyph = view.getUint16(at);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      if (glyph !== 0) covered.add(cp);
    }
  }
  return covered;
}
