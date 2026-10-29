// rhwp 가 그린 쪽 SVG 를 svg2pdf.js·jsPDF 가 올바르게 PDF 로 옮기도록 다듬습니다.
// - 글꼴: 문서 글꼴(바탕, 맑은 고딕, 함초롬바탕 …)을 PDF 에 넣을 수 있는 무료 글꼴(나눔명조·나눔고딕)로 바꿉니다.
//   rhwp 는 글꼴 목록 끝에 serif / sans-serif 를 붙여 주므로 그것으로 명조·고딕을 고릅니다.
// - 나눔 글꼴에 없는 글자(한자, ①, ㉠ 등)가 든 글자는 보조 글꼴(Noto Sans KR)로 돌립니다.
// - 어느 글꼴에도 없는 수식 기호(∘ 등)는 모양이 거의 같은 글자(◦)로 바꿉니다.
// - 굵기: jsPDF 는 보통·굵게만 알아서, 500 같은 값은 등록 안 된 글꼴로 보고 한글이 깨집니다.
// - 한 글자짜리 textLength 는 svg2pdf 가 글자 간격을 0으로 나눠 PDF 에 -Infinity 를 씁니다.

export type FontRole = 'gothic' | 'myeongjo' | 'fallback';

/** jsPDF 에 등록하는 글꼴 이름 */
export const FONT_FAMILY: Record<FontRole, string> = {
  gothic: 'NanumGothic',
  myeongjo: 'NanumMyeongjo',
  fallback: 'NotoSansKR',
};

/** SVG 의 font-family 목록에서 명조(serif)·고딕(sans-serif)을 고릅니다. */
export function roleFor(fontFamily: string): 'gothic' | 'myeongjo' {
  const names = fontFamily.split(',').map((name) => name.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
  const generic = names.at(-1);
  if (generic === 'serif') return 'myeongjo';
  if (generic === 'sans-serif' || generic === 'monospace') return 'gothic';
  return /바탕|명조|궁서|batang|myeong|myungjo|gungsuh|times|serif/.test(names[0] ?? '') ? 'myeongjo' : 'gothic';
}

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

/** 넣을 수 있는 어느 글꼴에도 없는 수식 기호와, 모양이 거의 같아 대신 쓸 글자 */
const LOOKALIKES: Record<string, string> = {
  '∘': '◦', // ∘ 합성 연산자 → ◦
  '∙': '·', // ∙ 점 연산자 → ·
};

/** 글꼴에 없는 글자 중 닮은 글자가 그 글꼴에 있는 것만 바꿉니다. */
export function withLookalikes(coverage: ReadonlySet<number>, text: string): string {
  return text.replace(/[∘∙]/g, (char) => {
    const lookalike = LOOKALIKES[char];
    return coverage.has(char.codePointAt(0)!) || !coverage.has(lookalike.codePointAt(0)!) ? char : lookalike;
  });
}

function replaceText(node: Node, coverage: ReadonlySet<number>): void {
  if (node.nodeType === 3) {
    const text = node.nodeValue ?? '';
    const replaced = withLookalikes(coverage, text);
    if (replaced !== text) node.nodeValue = replaced;
    return;
  }
  for (const child of Array.from(node.childNodes)) replaceText(child, coverage);
}

/**
 * 글자 하나뿐인 ∘(수식 합성 기호)는 작은 원으로 그립니다. 나눔의 ◦ 는 글자 크기라 수식에서 너무 큽니다.
 * 크기와 자리는 수학 글꼴(Latin Modern)의 ∘ 를 따릅니다: 너비 0.5em 가운데, 기준선 0.25em 위, 지름 약 0.36em.
 */
function drawRing(text: Element): boolean {
  if ((text.textContent ?? '').trim() !== '∘') return false;
  const size = Number.parseFloat(text.closest('[font-size]')?.getAttribute('font-size') ?? '') || 16;
  const x = Number.parseFloat(text.getAttribute('x') ?? '0') || 0;
  const y = Number.parseFloat(text.getAttribute('y') ?? '0') || 0;
  const ring = text.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ring.setAttribute('cx', String(x + size * 0.25));
  ring.setAttribute('cy', String(y - size * 0.25));
  ring.setAttribute('r', String(size * 0.16));
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', text.closest('[fill]')?.getAttribute('fill') ?? '#000000');
  ring.setAttribute('stroke-width', String(size * 0.04));
  const transform = text.getAttribute('transform');
  if (transform) ring.setAttribute('transform', transform);
  text.replaceWith(ring);
  return true;
}

export interface Coverage {
  gothic: ReadonlySet<number>;
  myeongjo: ReadonlySet<number>;
  /** 보조 글꼴을 아직 받지 않았으면 null (그래도 필요 여부는 알려 줌) */
  fallback: ReadonlySet<number> | null;
}

/**
 * SVG 를 제자리에서 고칩니다. 보조 글꼴이 필요한 글자가 있으면 true 를 돌려줍니다
 * (coverage.fallback 이 없으면 해당 글자는 그대로 두므로, 받은 뒤 다시 부르면 됩니다).
 */
export function prepareSvg(svg: Element, coverage: Coverage): boolean {
  let needsFallback = false;
  for (const el of Array.from(svg.querySelectorAll('[font-weight]'))) {
    if (isBold(el.getAttribute('font-weight'))) el.setAttribute('font-weight', 'bold');
    else el.removeAttribute('font-weight');
  }
  // 기울임은 등록한 글꼴에 없으므로 바로 세웁니다 (기울인 글꼴이 없으면 jsPDF 가 다른 글꼴로 바꿔 한글이 깨짐).
  for (const el of Array.from(svg.querySelectorAll('[font-style]'))) el.removeAttribute('font-style');

  for (const text of Array.from(svg.querySelectorAll('text'))) {
    const content = text.textContent ?? '';
    if (text.hasAttribute('textLength') && Array.from(content).length <= 1) {
      text.removeAttribute('textLength');
      text.removeAttribute('lengthAdjust');
    }
    // 처음 고칠 때 원래 글꼴 목록을 남겨 두어, 보조 글꼴을 받은 뒤 다시 불러도 같은 판단을 합니다.
    if (!text.hasAttribute('data-font')) {
      text.setAttribute('data-font', text.closest('[font-family]')?.getAttribute('font-family') ?? 'sans-serif');
    }
    let role: FontRole = roleFor(text.getAttribute('data-font')!);
    // 수식의 ∘ 등은 브라우저가 시스템 수학 글꼴로 그려 주지만, PDF 에는 넣은 글꼴만 쓰이므로 빠집니다.
    if (!coverage[role].has(0x2218) && drawRing(text)) continue;
    replaceText(text, coverage[role]);
    const shown = text.textContent ?? '';
    if (!covers(coverage[role], shown)) {
      needsFallback = true;
      if (coverage.fallback && covers(coverage.fallback, shown)) role = 'fallback';
    }
    text.setAttribute('font-family', FONT_FAMILY[role]);
  }
  // 글자 바깥(묶음 g 등)에 남은 문서 글꼴 이름은 쓰이지 않지만, 혹시 모를 상속을 위해 같이 바꿉니다.
  for (const el of Array.from(svg.querySelectorAll('[font-family]:not(text)'))) {
    const family = el.getAttribute('font-family') ?? '';
    if (!Object.values(FONT_FAMILY).includes(family)) el.setAttribute('font-family', FONT_FAMILY[roleFor(family)]);
  }
  return needsFallback;
}
