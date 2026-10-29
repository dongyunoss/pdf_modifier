import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readCoverage } from '../../src/lib/hwp/cmap';
import { liftHmlVersion } from '../../src/lib/hwp/hml';
import { covers, isBold, roleFor, withLookalikes } from '../../src/lib/hwp/svg';

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

  it('어느 글꼴에도 없는 합성 기호 ∘ 는 닮은 ◦ 로 바꾼다', () => {
    const myeongjo = font('nanum-myeongjo/400Regular/NanumMyeongjo_400Regular.ttf');
    const fallback = font('noto-sans-kr/400Regular/NotoSansKR_400Regular.ttf');
    expect(covers(myeongjo, '∘')).toBe(false);
    expect(covers(fallback, '∘')).toBe(false);
    expect(withLookalikes(myeongjo, '(f∘g)(x)')).toBe('(f◦g)(x)');
    expect(covers(myeongjo, withLookalikes(myeongjo, 'f∘g∙h'))).toBe(true);
    // 글꼴에 원래 글자가 있으면 그대로 둡니다.
    expect(withLookalikes(new Set([0x2218, 0x25e6]), '∘')).toBe('∘');
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
