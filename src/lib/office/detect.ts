// Word·PPT 파일 종류 구분과, 문서에 쓰인 문자(한글·가나·한자)에 맞는 글꼴 묶음 고르기
import { unzipSync } from 'fflate';
import type { Lang } from '../../i18n';

export type OfficeKind = 'word' | 'ppt';
export type FontPack = 'ko' | 'ja' | 'sc' | 'tc';

const EXTENSIONS: Record<OfficeKind, string[]> = {
  word: ['docx', 'doc', 'docm', 'dotx', 'dot', 'odt', 'rtf'],
  ppt: ['pptx', 'ppt', 'pptm', 'ppsx', 'pps', 'potx', 'pot', 'odp'],
};

export const officeAccept = (kind: OfficeKind) => EXTENSIONS[kind].map((ext) => `.${ext}`).join(',');

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase();
}

/** 이 도구가 받는 파일인지 (확장자 기준) */
export const isOfficeFile = (kind: OfficeKind, name: string) => EXTENSIONS[kind].includes(extensionOf(name));

export interface Scripts {
  hangul: boolean;
  kana: boolean;
  han: boolean;
}

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힣]/;
const KANA = /[぀-ヿㇰ-ㇿｦ-ﾟ]/;
const HAN = /[㐀-䶿一-鿿豈-﫿]/;
/** 우연히 섞인 바이트가 글자로 읽히는 것을 걸러 내기 위한 최소 글자 수 (바이너리 파일 검사) */
const BINARY_MIN = 4;

function scanText(text: string, into: Scripts) {
  into.hangul ||= HANGUL.test(text);
  into.kana ||= KANA.test(text);
  into.han ||= HAN.test(text);
}

const countIn = (text: string, pattern: RegExp) => (text.match(new RegExp(pattern.source, 'g')) ?? []).length;

/** 옛 형식(.doc, .ppt)처럼 글자를 UTF-16 으로 담은 바이너리에서 문자를 찾습니다. */
function scanUtf16(bytes: Uint8Array, into: Scripts) {
  const decoder = new TextDecoder('utf-16le');
  for (const offset of [0, 1]) {
    const length = (bytes.length - offset) & ~1;
    const text = decoder.decode(bytes.subarray(offset, offset + length));
    into.hangul ||= countIn(text, HANGUL) >= BINARY_MIN;
    into.kana ||= countIn(text, KANA) >= BINARY_MIN;
    into.han ||= countIn(text, HAN) >= BINARY_MIN;
  }
}

/** RTF: \uN 이스케이프와 코드 페이지 선언(\ansicpg949 등)을 봅니다. */
function scanRtf(text: string, into: Scripts) {
  const chars = Array.from(text.matchAll(/\\u(-?\d+)/g), (match) => {
    const code = Number(match[1]);
    return String.fromCharCode(code < 0 ? code + 65536 : code);
  }).join('');
  scanText(chars, into);
  const codepage = /\\ansicpg(\d+)/.exec(text)?.[1];
  if (codepage === '949') into.hangul = true;
  if (codepage === '932') into.kana = true;
  if (codepage === '936' || codepage === '950') into.han = true;
}

const isZip = (bytes: Uint8Array) => bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

/** 문서 안에 한글·가나·한자가 있는지 살펴봅니다. 알 수 없는 형식이면 모두 false 입니다. */
export function detectScripts(bytes: Uint8Array): Scripts {
  const found: Scripts = { hangul: false, kana: false, han: false };
  if (isZip(bytes)) {
    // docx·pptx·odt 등: 글자가 들어 있는 XML 만 풀어서 봅니다 (이미지는 풀지 않음).
    try {
      const entries = unzipSync(bytes, { filter: (file) => /\.xml$/i.test(file.name) && file.originalSize < 64 * 1024 * 1024 });
      const decoder = new TextDecoder();
      // 태그와 속성은 지우고 본문 글자만 봅니다. 테마·글꼴 목록(theme1.xml 등)의 속성에는 문서 내용과 상관없이
      // 일본어·중국어·한국어 글꼴 이름이 들어 있어, 그대로 보면 모든 문서에 한·중·일 글꼴을 내려받게 됩니다.
      for (const data of Object.values(entries)) scanText(decoder.decode(data).replace(/<[^>]*>/g, ' '), found);
    } catch {
      // 손상된 압축이면 글꼴 없이 변환을 시도합니다 (변환 단계에서 오류를 알려 줌).
    }
    return found;
  }
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 5));
  if (head === '{\\rtf') scanRtf(new TextDecoder('latin1').decode(bytes), found);
  else scanUtf16(bytes, found);
  return found;
}

/**
 * 필요한 글꼴 묶음. 한글이 있으면 한국어 글꼴(한자 포함), 가나가 있으면 일본어 글꼴,
 * 한자만 있으면 화면 언어로 간체·번체·일본어 중 고릅니다.
 */
export function fontPacksFor(scripts: Scripts, lang: Lang): FontPack[] {
  const packs = new Set<FontPack>();
  if (scripts.hangul) packs.add('ko');
  if (scripts.kana) packs.add('ja');
  if (scripts.han && !scripts.hangul && !scripts.kana) {
    packs.add(lang === 'ja' ? 'ja' : lang === 'zh-tw' ? 'tc' : lang === 'ko' ? 'ko' : 'sc');
  }
  return [...packs];
}
