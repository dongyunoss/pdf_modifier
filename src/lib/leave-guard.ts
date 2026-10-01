// 작업 중이거나 아직 받지 않은 결과가 있을 때, 페이지를 떠나려 하면 브라우저의 확인 창을 띄웁니다.
// (탭 닫기·새로 고침·다른 페이지로 이동 모두 해당. 창의 문구는 브라우저가 정합니다.)

const holds = new Set<symbol>();

function onBeforeUnload(event: BeforeUnloadEvent) {
  if (holds.size === 0) return;
  event.preventDefault();
  // Chrome 119 이전 등 오래된 브라우저는 (지금은 권장되지 않는) returnValue 를 설정해야 확인 창을 띄웁니다.
  (event as { returnValue: unknown }).returnValue = true;
}

/**
 * 페이지 떠나기 확인을 켭니다. 돌려받은 함수를 부르면 해제됩니다 (여러 번 불러도 안전).
 * 여러 곳에서 동시에 켤 수 있고, 모두 해제되어야 확인 창이 사라집니다.
 */
export function holdPage(): () => void {
  if (typeof window === 'undefined') return () => {};
  const token = Symbol('hold');
  if (holds.size === 0) window.addEventListener('beforeunload', onBeforeUnload);
  holds.add(token);
  return () => {
    if (!holds.delete(token)) return;
    if (holds.size === 0) window.removeEventListener('beforeunload', onBeforeUnload);
  };
}

/** 지금 페이지 떠나기 확인이 켜져 있는지 */
export const isPageHeld = (): boolean => holds.size > 0;
