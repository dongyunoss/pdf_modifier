// 사이트를 앱처럼 설치(홈 화면·바탕화면에 추가)하는 요청을 다룹니다.
// 크롬·엣지는 페이지를 연 직후 beforeinstallprompt 를 한 번만 보내므로, 머리말 스크립트가 곧바로 잡아 두고
// 나중에 그려지는 결과 화면이 꺼내 씁니다. 두 곳이 다른 묶음 파일에 있어도 같은 값을 보도록 window 에 둡니다.

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallState {
  prompt: InstallPrompt | null;
  installed: boolean;
}

declare global {
  interface Window {
    __pdfInstall?: InstallState;
  }
}

export const INSTALL_CHANGE = 'pdf-install-change';

const state = (): InstallState => (window.__pdfInstall ??= { prompt: null, installed: false });
const changed = () => window.dispatchEvent(new Event(INSTALL_CHANGE));

/** 머리말에서 페이지마다 한 번 부릅니다. */
export function watchInstall(): void {
  const current = state();
  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone) {
    current.installed = true;
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state().prompt = event as InstallPrompt;
    changed();
  });
  window.addEventListener('appinstalled', () => {
    Object.assign(state(), { prompt: null, installed: true });
    changed();
  });
}

/** 설치 창을 띄울 수 있으면 'prompt', iPhone·iPad Safari 면 'ios'(공유 → 홈 화면에 추가),
 *  PC 의 다른 브라우저면 'bookmark'(Ctrl + D), 이미 설치했거나 방법이 없으면 null */
export type InstallWay = 'prompt' | 'ios' | 'bookmark' | null;

export function installWay(): InstallWay {
  const current = state();
  if (current.installed) return null;
  if (current.prompt) return 'prompt';
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return 'ios';
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches ? 'bookmark' : null;
}

/** 설치 창을 띄웁니다. 사용자가 설치하면 true */
export async function promptInstall(): Promise<boolean> {
  const current = state();
  const prompt = current.prompt;
  if (!prompt) return false;
  current.prompt = null;
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  if (outcome === 'accepted') current.installed = true;
  changed();
  return outcome === 'accepted';
}

export const isMac = () => /Mac/.test(navigator.platform) && navigator.maxTouchPoints <= 1;
