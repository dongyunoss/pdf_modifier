import { readFileSync } from 'node:fs';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { detectScripts, extensionOf, fontPacksFor, isOfficeFile, officeAccept } from '../../src/lib/office/detect';
import {
  patchEngineWorker,
  patchSofficeJs,
  readPackageFiles,
  replaceOnce,
  splitParts,
  trimDataPackage,
} from '../../scripts/lib/office-engine.mjs';

const docx = (body: string) =>
  zipSync({
    '[Content_Types].xml': strToU8('<Types/>'),
    'word/document.xml': strToU8(`<w:document><w:body><w:p><w:r><w:t>${body}</w:t></w:r></w:p></w:body></w:document>`),
    // 실제 Office 테마처럼 여러 나라 글꼴 이름이 속성으로 들어 있습니다 (본문과 상관없음).
    'word/theme/theme1.xml': strToU8(
      '<a:theme><a:font script="Jpan" typeface="ＭＳ ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/></a:theme>',
    ),
    'word/media/image1.png': new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  });

const utf16 = (text: string) => {
  const out = new Uint8Array(text.length * 2 + 3);
  out.set([0xd0, 0xcf, 0x11]); // OLE 파일처럼 보이게 앞에 몇 바이트를 둡니다 (홀수 위치에서 시작하는 글자도 찾는지 확인)
  for (let i = 0; i < text.length; i++) {
    out[3 + i * 2] = text.charCodeAt(i) & 0xff;
    out[3 + i * 2 + 1] = text.charCodeAt(i) >> 8;
  }
  return out;
};

describe('Word·PPT 파일 구분', () => {
  it('도구별로 받는 확장자를 구분한다', () => {
    expect(isOfficeFile('word', '보고서.DOCX')).toBe(true);
    expect(isOfficeFile('word', 'slides.pptx')).toBe(false);
    expect(isOfficeFile('ppt', 'slides.pptx')).toBe(true);
    expect(isOfficeFile('ppt', 'show.ppsx')).toBe(true);
    expect(isOfficeFile('word', 'scan.pdf')).toBe(false);
    expect(extensionOf('a.b.Doc')).toBe('doc');
    expect(officeAccept('word')).toContain('.docx');
  });
});

describe('문서에 쓰인 문자 찾기', () => {
  it('본문 글자만 보고, 테마의 글꼴 이름(속성)은 무시한다', () => {
    expect(detectScripts(docx('Hello world'))).toEqual({ hangul: false, kana: false, han: false });
    expect(detectScripts(docx('서비스 이용 계약서'))).toEqual({ hangul: true, kana: false, han: false });
    expect(detectScripts(docx('ご確認ください'))).toMatchObject({ kana: true, hangul: false });
    expect(detectScripts(docx('会议纪要'))).toMatchObject({ han: true, hangul: false, kana: false });
  });

  it('옛 형식(UTF-16 바이너리)과 RTF 도 살펴본다', () => {
    expect(detectScripts(utf16('분기 실적 보고서')).hangul).toBe(true);
    // 우연히 한두 글자로 읽히는 바이트는 무시합니다.
    expect(detectScripts(utf16('ab가')).hangul).toBe(false);
    const rtf = new TextEncoder().encode('{\\rtf1\\ansi\\ansicpg949 {\\u-21504?\\u-20236?}}');
    expect(detectScripts(rtf).hangul).toBe(true);
  });

  it('손상된 압축 파일이어도 멈추지 않는다', () => {
    const broken = docx('한글').slice(0, 60);
    expect(() => detectScripts(broken)).not.toThrow();
  });

  it('문자에 맞는 글꼴 묶음을 고른다', () => {
    const none = { hangul: false, kana: false, han: false };
    expect(fontPacksFor(none, 'ko')).toEqual([]);
    expect(fontPacksFor({ ...none, hangul: true, han: true }, 'en')).toEqual(['ko']);
    expect(fontPacksFor({ ...none, kana: true, han: true }, 'ko')).toEqual(['ja']);
    expect(fontPacksFor({ ...none, han: true }, 'zh-tw')).toEqual(['tc']);
    expect(fontPacksFor({ ...none, han: true }, 'zh-cn')).toEqual(['sc']);
    expect(fontPacksFor({ ...none, han: true }, 'ja')).toEqual(['ja']);
    expect(fontPacksFor({ ...none, han: true }, 'de')).toEqual(['sc']);
  });
});

describe('변환 엔진 빌드 (scripts/lib/office-engine.mjs)', () => {
  const sample = [
    'var a=1;function loadPackage(metadata){}loadPackage({files:[',
    '{filename:"/instdir/a.txt",start:0,end:3},',
    '{filename:"/instdir/share/fonts/truetype/Big.ttf",start:3,end:7e0},',
    '{filename:"/instdir/b.txt",start:7,end:9}',
    '],remote_package_size:9})',
    ';var pthreadPoolSize=4;rest();',
  ].join('');
  const data = new TextEncoder().encode('AAABBBBCC');

  it('데이터 묶음 목록을 읽고(줄여 쓴 숫자 포함) 필요 없는 파일을 빼서 다시 만든다', () => {
    expect(readPackageFiles(sample).map((f: { filename: string }) => f.filename)).toHaveLength(3);
    const trimmed = trimDataPackage(sample, data, (name: string) => !name.endsWith('.ttf'));
    expect(new TextDecoder().decode(trimmed.data)).toBe('AAACC');
    expect(trimmed.removed).toBe(1);
    expect(readPackageFiles(trimmed.js)).toEqual([
      { filename: '/instdir/a.txt', start: 0, end: 3 },
      { filename: '/instdir/b.txt', start: 3, end: 5 },
    ]);
    expect(trimmed.js).toContain('remote_package_size:5})');
    expect(trimmed.js.endsWith(';var pthreadPoolSize=4;rest();')).toBe(true);
    expect(patchSofficeJs(trimmed.js)).toContain('var pthreadPoolSize=16;');
  });

  it('원본 패키지가 바뀌어 기준 문자열이 없으면 빌드를 멈춘다', () => {
    expect(() => replaceOnce('abc', 'x', 'y', 'test')).toThrow(/0번/);
    expect(() => replaceOnce('xx', 'x', 'y', 'test')).toThrow(/2번/);
  });

  it('설치된 엔진 워커에 패치를 모두 적용할 수 있다', () => {
    const original = readFileSync('node_modules/@bentopdf/libreoffice-wasm/assets/browser.worker.global.js', 'utf8');
    const patched = patchEngineWorker(original);
    expect(patched).toContain('wasmBinary:l.wasmBinary');
    expect(patched).toContain('/instdir/share/fonts/truetype/');
    expect(patched).toContain('SAL_LOG="-ALL"');
    const soffice = readFileSync('node_modules/@bentopdf/libreoffice-wasm/assets/soffice.js', 'utf8');
    expect(() => patchSofficeJs(soffice)).not.toThrow();
    expect(readPackageFiles(soffice).length).toBeGreaterThan(1000);
  });

  it('호스팅 한도보다 작은 조각으로 나눈다', () => {
    const parts = splitParts(new Uint8Array(25), 10);
    expect(parts.map((p: Uint8Array) => p.length)).toEqual([10, 10, 5]);
    expect(splitParts(new Uint8Array(0), 10)).toHaveLength(1);
  });
});
