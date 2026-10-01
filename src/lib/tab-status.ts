// 다른 탭을 보고 있어도 진행 상황과 완료를 알 수 있도록 탭 제목 앞에 상태를 붙입니다.

let baseTitle: string | null = null;

/** 탭 제목 앞에 상태를 붙입니다 (예: "⏳ 처리 중… · PDF 합치기 - …"). 원래 제목은 기억해 둡니다. */
export function setTabStatus(status: string): void {
  if (typeof document === 'undefined') return;
  if (baseTitle === null) baseTitle = document.title;
  document.title = `${status} · ${baseTitle}`;
}

/** 원래 탭 제목으로 되돌립니다. */
export function clearTabStatus(): void {
  if (typeof document === 'undefined' || baseTitle === null) return;
  document.title = baseTitle;
  baseTitle = null;
}
