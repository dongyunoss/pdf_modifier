import { useEffect, useRef, useState } from 'preact/hooks';

export interface SortPreview {
  /** 끌고 있는 항목 */
  from: number;
  /** 놓일 위치 (0 ~ count, 해당 인덱스 앞에 삽입) */
  to: number;
}

interface Session {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
  active: boolean;
  to: number;
  ghost?: HTMLElement;
}

interface Options {
  count: number;
  onMove: (from: number, to: number) => void;
  /** 'y' 는 세로 목록, 'grid' 는 줄바꿈되는 격자 */
  axis?: 'grid' | 'y';
}

/**
 * 마우스와 터치 모두에서 동작하는 끌어서 순서 바꾸기.
 * - 마우스: 항목 어디든 끌 수 있음
 * - 터치: 스크롤과 구분하기 위해 [data-drag-handle] 요소에서만 시작
 */
export function useSortable({ count, onMove, axis = 'grid' }: Options) {
  const [preview, setPreview] = useState<SortPreview | null>(null);
  const items = useRef<Array<HTMLElement | null>>([]);
  const session = useRef<Session | null>(null);
  const latest = useRef({ count, onMove, axis });
  latest.current = { count, onMove, axis };

  const itemRef = (index: number) => (element: HTMLElement | null) => {
    items.current[index] = element;
  };

  const onPointerDown = (index: number) => (event: PointerEvent) => {
    if (event.button !== 0 || latest.current.count < 2) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, select, textarea, a, label, [data-no-drag]')) return;
    if (event.pointerType !== 'mouse' && !target.closest('[data-drag-handle]')) return;
    session.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      offsetX: 0,
      offsetY: 0,
      active: false,
      to: index,
    };
  };

  useEffect(() => {
    let frame = 0;
    /** 끌기 직후 브라우저가 보내는 click 을 무시할 항목 */
    let suppressClickOn: HTMLElement | null = null;

    const targetAt = (x: number, y: number): number => {
      const { count: total, axis: direction } = latest.current;
      let best = -1;
      let bestDistance = Infinity;
      let before = true;
      for (let i = 0; i < total; i++) {
        const element = items.current[i];
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        const distance = inside ? 0 : Math.hypot(x - cx, y - cy);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
          before = direction === 'y' ? y < cy : x < cx;
        }
      }
      if (best < 0) return 0;
      return before ? best : best + 1;
    };

    const update = (s: Session) => {
      if (s.ghost) s.ghost.style.transform = `translate(${s.lastX - s.offsetX}px, ${s.lastY - s.offsetY}px)`;
      const to = targetAt(s.lastX, s.lastY);
      if (to !== s.to) {
        s.to = to;
        setPreview({ from: s.index, to });
      }
    };

    // 화면 가장자리로 끌면 자동으로 스크롤
    const autoScroll = () => {
      const s = session.current;
      if (!s?.active) return;
      const edge = 80;
      let delta = 0;
      if (s.lastY < edge) delta = -Math.ceil((edge - s.lastY) / 4);
      else if (s.lastY > window.innerHeight - edge) delta = Math.ceil((s.lastY - (window.innerHeight - edge)) / 4);
      if (delta !== 0) {
        window.scrollBy(0, delta);
        update(s);
      }
      frame = requestAnimationFrame(autoScroll);
    };

    const start = (s: Session) => {
      const element = items.current[s.index];
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      s.offsetX = s.startX - rect.left;
      s.offsetY = s.startY - rect.top;
      const ghost = element.cloneNode(true) as HTMLElement;
      ghost.classList.add('drag-ghost');
      ghost.removeAttribute('id');
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      document.body.appendChild(ghost);
      s.ghost = ghost;
      s.active = true;
      document.body.classList.add('is-sorting');
      setPreview({ from: s.index, to: s.index });
      frame = requestAnimationFrame(autoScroll);
      return true;
    };

    const onPointerMove = (event: PointerEvent) => {
      const s = session.current;
      if (!s || event.pointerId !== s.pointerId) return;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      if (!s.active) {
        if (Math.hypot(event.clientX - s.startX, event.clientY - s.startY) < 6) return;
        if (!start(s)) {
          session.current = null;
          return;
        }
      }
      event.preventDefault();
      update(s);
    };

    const finish = (event: PointerEvent) => {
      const s = session.current;
      if (!s || event.pointerId !== s.pointerId) return;
      session.current = null;
      if (!s.active) return;
      cancelAnimationFrame(frame);
      s.ghost?.remove();
      document.body.classList.remove('is-sorting');
      setPreview(null);
      if (event.type === 'pointercancel') return;
      // 끌던 항목 위에서 손을 떼면 브라우저가 click 을 보내므로, 그 click 이 선택을 바꾸지 않도록 막습니다.
      // 새로 누른(pointerdown) 뒤의 click 은 사용자가 의도한 것이므로 막지 않습니다.
      suppressClickOn = items.current[s.index];
      const to = s.to > s.index ? s.to - 1 : s.to;
      if (to !== s.index) latest.current.onMove(s.index, to);
    };

    const onPointerDownCapture = () => {
      suppressClickOn = null;
    };
    const onClickCapture = (click: MouseEvent) => {
      if (suppressClickOn?.contains(click.target as Node)) {
        click.stopPropagation();
        click.preventDefault();
      }
      suppressClickOn = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('pointerdown', onPointerDownCapture, true);
    window.addEventListener('click', onClickCapture, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('pointerdown', onPointerDownCapture, true);
      window.removeEventListener('click', onClickCapture, true);
      session.current?.ghost?.remove();
      document.body.classList.remove('is-sorting');
    };
  }, []);

  /** 항목에 붙일 CSS 클래스 (놓일 위치 표시) */
  const classFor = (index: number): string => {
    if (!preview) return '';
    const classes: string[] = [];
    if (preview.from === index) classes.push('is-dragging');
    if (preview.to === index && preview.to !== preview.from && preview.to !== preview.from + 1) classes.push('drop-before');
    if (preview.to === index + 1 && index === latest.current.count - 1 && preview.from !== index) classes.push('drop-after');
    return classes.join(' ');
  };

  return { preview, itemRef, onPointerDown, classFor };
}
