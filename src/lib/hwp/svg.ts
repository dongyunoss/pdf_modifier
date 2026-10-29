// rhwp 가 그린 쪽 SVG 를 svg2pdf.js·jsPDF 가 올바르게 PDF 로 옮기도록 다듬습니다.
// - 글꼴: 문서 글꼴(바탕, 맑은 고딕, 함초롬바탕 …)을 PDF 에 넣을 수 있는 무료 글꼴(나눔명조·나눔고딕)로 바꿉니다.
//   rhwp 는 글꼴 목록 끝에 serif / sans-serif 를 붙여 주므로 그것으로 명조·고딕을 고릅니다.
// - 나눔 글꼴에 없는 글자(한자, ①, ㉠ 등)가 든 글자는 보조 글꼴(Noto Sans KR)로 돌립니다.
// - 수식은 한글이 수식 글꼴을 PDF 에 넣듯, 수식 글꼴(STIX Two Text, 변수는 기울임)로 쓰고
//   그 글꼴에 없는 기호(∘ ≤ ≠ ∼ 등)는 Noto Sans Math 로 씁니다.
// - 굵기·기울임: jsPDF 는 등록한 모양만 알아서, 500 같은 값이나 없는 모양은 다른 글꼴로 보고 한글이 깨집니다.
//   모양마다 PDF 에 글꼴이 하나씩 더 들어가므로, 글꼴에 있는 모양(BOLD·ITALIC)만 씁니다.
// - 한 글자짜리 textLength 는 svg2pdf 가 글자 간격을 0으로 나눠 PDF 에 -Infinity 를 씁니다.

export type FontRole = 'gothic' | 'myeongjo' | 'fallback' | 'math' | 'symbol';
/** 필요할 때만 내려받는 글꼴 */
export type ExtraRole = Exclude<FontRole, 'gothic' | 'myeongjo'>;

/** jsPDF 에 등록하는 글꼴 이름 */
export const FONT_FAMILY: Record<FontRole, string> = {
  gothic: 'NanumGothic',
  myeongjo: 'NanumMyeongjo',
  fallback: 'NotoSansKR',
  math: 'STIXTwoText',
  symbol: 'NotoSansMath',
};

/** SVG 의 font-family 목록에서 명조(serif)·고딕(sans-serif)을 고릅니다. */
export function roleFor(fontFamily: string): 'gothic' | 'myeongjo' {
  const names = fontFamily.split(',').map((name) => name.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
  const generic = names.at(-1);
  if (generic === 'serif') return 'myeongjo';
  if (generic === 'sans-serif' || generic === 'monospace') return 'gothic';
  return /바탕|명조|궁서|batang|myeong|myungjo|gungsuh|times|serif/.test(names[0] ?? '') ? 'myeongjo' : 'gothic';
}

/** 굵은 모양이 있는 글꼴과 기울인 모양이 있는 글꼴 (build-hwp-engine.mjs 의 FONTS 와 맞춥니다) */
const BOLD: ReadonlySet<FontRole> = new Set(['gothic', 'myeongjo']);
const ITALIC: ReadonlySet<FontRole> = new Set(['math']);

/** rhwp 는 수식 글자에 'Latin Modern Math', 'STIX Two Math' … 목록을 붙입니다. */
export const isEquation = (fontFamily: string): boolean => /Latin Modern Math|STIX Two Math/i.test(fontFamily);

/** jsPDF 가 아는 굵기 (bold 또는 보통) */
export const isBold = (weight: string | null): boolean =>
  weight === 'bold' || weight === 'bolder' || Number(weight) >= 600;

/** 공백을 뺀 글자들이 모두 그 글꼴에 있는지 */
export function covers(coverage: ReadonlySet<number>, text: string): boolean {
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code > 0x20 && code !== 0xa0 && !coverage.has(code)) return false;
  }
  return true;
}

/** 글꼴마다 그릴 수 있는 글자. 아직 받지 않은 글꼴은 null */
export type Coverage = Record<'gothic' | 'myeongjo', ReadonlySet<number>> & Record<ExtraRole, ReadonlySet<number> | null>;

/**
 * 글자를 그릴 글꼴을 고릅니다. 후보를 차례로 보다가 아직 받지 않은 글꼴을 만나면, 지금 있는 글꼴로 고르고
 * 그 글꼴을 needs 로 알려 줍니다 (받은 뒤 다시 고르면 됨).
 */
export function pickFont(fontFamily: string, text: string, coverage: Coverage): { role: FontRole; needs?: ExtraRole } {
  const order: FontRole[] = isEquation(fontFamily)
    ? ['math', 'symbol', 'myeongjo', 'fallback']
    : [roleFor(fontFamily), 'fallback', 'symbol'];
  const loaded = order.find((role) => coverage[role]) ?? 'myeongjo';
  for (const role of order) {
    const set = coverage[role];
    if (!set) return { role: loaded, needs: role as ExtraRole };
    if (covers(set, text)) return { role };
  }
  return { role: loaded };
}

function toMinus(node: Node): void {
  if (node.nodeType === 3) node.nodeValue = (node.nodeValue ?? '').replaceAll('-', '−');
  else for (const child of Array.from(node.childNodes)) toMinus(child);
}

/**
 * SVG 를 제자리에서 고칩니다. 아직 받지 않았지만 필요한 글꼴을 돌려줍니다
 * (그 글자는 있는 글꼴로 두므로, 받은 뒤 다시 부르면 됩니다).
 */
export function prepareSvg(svg: Element, coverage: Coverage): Set<ExtraRole> {
  const needs = new Set<ExtraRole>();
  for (const el of Array.from(svg.querySelectorAll('[font-weight]'))) {
    if (isBold(el.getAttribute('font-weight'))) el.setAttribute('font-weight', 'bold');
    else el.removeAttribute('font-weight');
  }

  for (const text of Array.from(svg.querySelectorAll('text'))) {
    const content = text.textContent ?? '';
    if (text.hasAttribute('textLength') && Array.from(content).length <= 1) {
      text.removeAttribute('textLength');
      text.removeAttribute('lengthAdjust');
    }
    // 처음 고칠 때 원래 글꼴 목록·굵기·기울임을 남겨 두어, 글꼴을 받은 뒤 다시 불러도 같은 판단을 합니다.
    if (!text.hasAttribute('data-font')) {
      text.setAttribute('data-font', text.closest('[font-family]')?.getAttribute('font-family') ?? 'sans-serif');
      if (text.closest('[font-weight]')) text.setAttribute('data-bold', '');
      if (text.closest('[font-style]')?.getAttribute('font-style') === 'italic') text.setAttribute('data-italic', '');
      // 한글 수식처럼 빼기는 붙임표(-)가 아니라 빼기 기호(−)로 씁니다.
      if (isEquation(text.getAttribute('data-font')!) && content.includes('-')) toMinus(text);
    }
    const picked = pickFont(text.getAttribute('data-font')!, text.textContent ?? '', coverage);
    if (picked.needs) needs.add(picked.needs);
    text.setAttribute('font-family', FONT_FAMILY[picked.role]);
    text.setAttribute('font-weight', BOLD.has(picked.role) && text.hasAttribute('data-bold') ? 'bold' : 'normal');
    text.setAttribute('font-style', ITALIC.has(picked.role) && text.hasAttribute('data-italic') ? 'italic' : 'normal');
  }
  for (const el of Array.from(svg.querySelectorAll('[font-style]:not(text)'))) el.removeAttribute('font-style');
  for (const el of Array.from(svg.querySelectorAll('[font-weight]:not(text)'))) el.removeAttribute('font-weight');
  // 글자 바깥(묶음 g 등)에 남은 문서 글꼴 이름은 쓰이지 않지만, 혹시 모를 상속을 위해 같이 바꿉니다.
  for (const el of Array.from(svg.querySelectorAll('[font-family]:not(text)'))) {
    const family = el.getAttribute('font-family') ?? '';
    if (!Object.values(FONT_FAMILY).includes(family)) el.setAttribute('font-family', FONT_FAMILY[roleFor(family)]);
  }
  return needs;
}
