import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readCoverage } from '../../src/lib/hwp/cmap';
import { liftHmlVersion } from '../../src/lib/hwp/hml';
import { covers, isBold, pickFont, roleFor, type Coverage } from '../../src/lib/hwp/svg';

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

  it('수식은 수식 글꼴로, 그 글꼴에 없는 기호는 수학 기호 글꼴로 쓴다', () => {
    const math = font('stix-two-text/400Regular/STIXTwoText_400Regular.ttf');
    const symbol = font('noto-sans-math/400Regular/NotoSansMath_400Regular.ttf');
    // 나눔·Noto Sans KR 어디에도 없는 수식 기호가 수학 글꼴엔 모두 있습니다.
    for (const char of '∘∼≤≥≠∠') expect(covers(symbol, char)).toBe(true);
    expect(covers(math, 'xπ°')).toBe(true);
    const equation = "'Latin Modern Math', 'STIX Two Text', 'STIX Two Math', 'Times New Roman', 'Times', serif";
    const body = "'함초롬바탕',serif";
    const none: Coverage = { gothic: new Set(), myeongjo: new Set([0x78]), fallback: null, math: null, symbol: null };
    // 아직 받지 않은 글꼴은 있는 글꼴로 두고 받아 달라고 알립니다.
    expect(pickFont(equation, 'x', none)).toEqual({ role: 'myeongjo', needs: 'math' });
    expect(pickFont(body, 'x', none)).toEqual({ role: 'myeongjo' });
    const all: Coverage = { ...none, fallback: new Set(), math, symbol };
    expect(pickFont(equation, 'x', all)).toEqual({ role: 'math' });
    expect(pickFont(equation, '∘', all)).toEqual({ role: 'symbol' });
    expect(pickFont(body, '∘', all)).toEqual({ role: 'symbol' });
  });
});

describe('HML(HWPML) 버전 맞추기', () => {
  const hml = (version: string) => `﻿<?xml version="1.0" encoding="UTF-8"?><HWPML Style="embed" SubVersion="8.0.1.0" Version="${version}"><HEAD/></HWPML>`;
  const lift = (text: string) => new TextDecoder('utf-8', { ignoreBOM: true }).decode(liftHmlVersion(new TextEncoder().encode(text)));

  it('rhwp 가 받지 않는 2.x 버전은 2.91 로 바꾼다', () => {
    expect(lift(hml('2.8'))).toBe(hml('2.91'));
    expect(lift(hml('2.7'))).toBe(hml('2.91'));
  });

  it('받는 버전, SubVersion, HML 이 아닌 파일은 그대로 둔다', () => {
    for (const version of ['2.1', '2.9', '2.91', '3.0']) expect(lift(hml(version))).toBe(hml(version));
    expect(lift('<HWPML Version="2.91" SubVersion="2.8"/>')).toBe('<HWPML Version="2.91" SubVersion="2.8"/>');
    const hwp = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    expect(liftHmlVersion(hwp)).toBe(hwp);
  });
});
