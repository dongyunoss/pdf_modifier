import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readCoverage } from '../../src/lib/hwp/cmap';
import { covers, isBold, roleFor } from '../../src/lib/hwp/svg';

const font = (path: string) => readCoverage(new Uint8Array(readFileSync(`node_modules/@expo-google-fonts/${path}`)));

describe('HWP → PDF 글꼴 고르기', () => {
  it('rhwp 가 붙인 serif / sans-serif 로 명조·고딕을 고른다', () => {
    expect(roleFor("'함초롬바탕','HCR Batang','Noto Serif KR',serif")).toBe('myeongjo');
    expect(roleFor("'맑은 고딕','Malgun Gothic','Noto Sans KR',sans-serif")).toBe('gothic');
    expect(roleFor("'돋움체','Malgun Gothic',monospace")).toBe('gothic');
    // 끝에 일반 글꼴 이름이 없으면 첫 글꼴 이름으로 판단합니다.
    expect(roleFor("'HY신명조'")).toBe('myeongjo');
    expect(roleFor("'HY견고딕'")).toBe('gothic');
  });

  it('jsPDF 가 아는 굵기로 바꾼다', () => {
    expect(isBold('bold')).toBe(true);
    expect(isBold('700')).toBe(true);
    expect(isBold('500')).toBe(false);
    expect(isBold(null)).toBe(false);
  });

  it('글꼴 cmap 을 읽어 나눔에 없는 글자를 찾는다', () => {
    const gothic = font('nanum-gothic/400Regular/NanumGothic_400Regular.ttf');
    const fallback = font('noto-sans-kr/400Regular/NotoSansKR_400Regular.ttf');
    expect(gothic.size).toBe(11827);
    expect(covers(gothic, '사업 개요 Hello 123')).toBe(true);
    expect(covers(gothic, '①')).toBe(false);
    expect(covers(gothic, '漢字')).toBe(false);
    expect(covers(fallback, '① 漢字 ㉠ 사업')).toBe(true);
  });
});
