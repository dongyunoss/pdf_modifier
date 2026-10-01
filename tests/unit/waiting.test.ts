import { afterEach, describe, expect, it, vi } from 'vitest';
import { unzipSync } from 'fflate';
import { getDictionary, LANGS } from '../../src/i18n';
import { holdPage, isPageHeld } from '../../src/lib/leave-guard';
import { estimatedProgress, formatDuration, nextProgress, PROGRESS_CAP } from '../../src/lib/progress';
import { clearTabStatus, setTabStatus } from '../../src/lib/tab-status';
import { zipFiles } from '../../src/lib/zip';
import { tipKeysFor } from '../../src/components/tools/tips';

describe('진행 막대', () => {
  it('추정치는 계속 늘어나지만 상한을 넘지 않는다', () => {
    const times = [0, 200, 800, 2000, 5000, 15000, 60000, 600000];
    const values = times.map((t) => estimatedProgress(t));
    for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThan(values[i - 1]);
    expect(values[0]).toBeGreaterThan(0);
    expect(values.at(-1)!).toBeLessThan(PROGRESS_CAP);
  });

  it('실제 진행률이 앞서면 따르고, 뒤로 가거나 끝나기 전에 100% 가 되지 않는다', () => {
    expect(nextProgress(100, 0.6)).toBeCloseTo(0.6 * PROGRESS_CAP);
    // 실제 값이 줄어도(다음 단계 시작) 막대는 뒤로 가지 않음
    expect(nextProgress(200, 0.1, 0.5)).toBe(0.5);
    // 모든 단계가 끝나도 결과가 나오기 전에는 상한까지만
    expect(nextProgress(300, 1)).toBe(PROGRESS_CAP);
    expect(nextProgress(300, Number.NaN)).toBeCloseTo(estimatedProgress(300));
    expect(nextProgress(999_999, null, 0.99)).toBe(PROGRESS_CAP);
  });

  it('경과 시간을 언어에 맞게 표시한다', () => {
    expect(formatDuration(12.7, 'ko-KR')).toBe('12초');
    expect(formatDuration(65, 'ko-KR')).toBe('1분 5초');
    expect(formatDuration(65, 'en-US')).toMatch(/^1 min 5 sec/);
    expect(formatDuration(-3, 'en-US')).toMatch(/^0 sec/);
  });
});

describe('페이지 떠나기 확인', () => {
  const listeners = new Map<string, EventListener>();
  const fakeWindow = {
    addEventListener: vi.fn((type: string, listener: EventListener) => listeners.set(type, listener)),
    removeEventListener: vi.fn((type: string) => listeners.delete(type)),
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('켜져 있는 동안에만 beforeunload 를 막고, 모두 해제되면 리스너를 뗀다', () => {
    vi.stubGlobal('window', fakeWindow);
    const releaseA = holdPage();
    const releaseB = holdPage();
    expect(isPageHeld()).toBe(true);
    expect(fakeWindow.addEventListener).toHaveBeenCalledTimes(1);

    const event = { preventDefault: vi.fn(), returnValue: undefined as unknown };
    listeners.get('beforeunload')!(event as unknown as Event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.returnValue).toBe(true);

    releaseA();
    releaseA(); // 두 번 불러도 다른 확인은 그대로
    expect(isPageHeld()).toBe(true);
    releaseB();
    expect(isPageHeld()).toBe(false);
    expect(fakeWindow.removeEventListener).toHaveBeenCalledTimes(1);
    expect(listeners.has('beforeunload')).toBe(false);
  });
});

describe('탭 제목 상태', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('원래 제목 앞에 상태를 붙였다가 되돌린다', () => {
    const doc = { title: 'PDF 합치기 | PDF Modifier' };
    vi.stubGlobal('document', doc);
    setTabStatus('⏳ 처리 중…');
    setTabStatus('⏳ 2 / 5 · 처리 중…');
    expect(doc.title).toBe('⏳ 2 / 5 · 처리 중… · PDF 합치기 | PDF Modifier');
    clearTabStatus();
    expect(doc.title).toBe('PDF 합치기 | PDF Modifier');
    clearTabStatus();
    expect(doc.title).toBe('PDF 합치기 | PDF Modifier');
  });
});

describe('ZIP 묶기', () => {
  it('파일을 그대로 담고 한글 이름을 지키며 파일마다 진행 상황을 알린다', async () => {
    const encode = (text: string) => new TextEncoder().encode(text);
    const progress: Array<[number, number]> = [];
    const bytes = await zipFiles(
      [
        { name: '보고서_1-2.pdf', read: async () => encode('first') },
        { name: 'b.jpg', read: async () => encode('second') },
        { name: 'c.png', read: async () => encode('') },
      ],
      (done, total) => progress.push([done, total]),
    );
    const files = unzipSync(bytes);
    expect(Object.keys(files)).toEqual(['보고서_1-2.pdf', 'b.jpg', 'c.png']);
    expect(new TextDecoder().decode(files['보고서_1-2.pdf'])).toBe('first');
    expect(files['c.png'].length).toBe(0);
    expect(progress).toEqual([
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });
});

describe('처리 화면 팁', () => {
  it('지금 쓰는 도구를 소개하는 팁은 빼고, 모든 언어에 같은 팁이 있다', () => {
    const tips = getDictionary('ko').ui.tips;
    const all = tipKeysFor(tips);
    expect(all.length).toBeGreaterThanOrEqual(8);
    expect(tipKeysFor(tips, 'compress')).not.toContain('compress');
    expect(tipKeysFor(tips, 'jpg-to-pdf')).not.toContain('jpgToPdf');
    expect(tipKeysFor(tips, 'split')).toEqual(all);
    for (const lang of LANGS) expect(tipKeysFor(getDictionary(lang).ui.tips), lang).toEqual(all);
  });
});
