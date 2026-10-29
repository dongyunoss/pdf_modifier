// HML(한글 XML 형식, HWPML) 파일을 rhwp 에 넘기기 전에 손봅니다.
//
// rhwp 0.8.7 은 HWPML 2.1·2.9·2.91 만 받고, 한글 2010 등이 저장한 2.8 같은 다른 2.x 는
// "지원하지 않는 HWPML 버전"으로 거절합니다. rhwp 파서는 버전 값으로 해석을 나누지 않고
// 태그 이름으로만 읽으므로(src/parser/hml/reader.rs), 맨 앞 HWPML 태그의 Version 만 2.91 로 바꿔 넘깁니다.

/** rhwp 가 그대로 받는 HWPML 버전 */
const SUPPORTED = new Set(['2.1', '2.9', '2.91']);
/** 루트 태그를 찾을 앞부분 크기 (XML 선언·BOM 뒤 바로 나옵니다) */
const HEAD_BYTES = 4096;
/** SubVersion 은 건드리지 않도록 Version 앞에 공백을 요구합니다. */
const ROOT_VERSION = /<HWPML\b[^>]*?\sVersion\s*=\s*"([^"]*)"/;

/**
 * 받지 않는 HWPML 2.x 버전이면 Version 값만 2.91 로 바꾼 새 바이트를 돌려줍니다.
 * HML 이 아니거나(HWP·HWPX), 이미 받는 버전이거나, UTF-8 이 아닌 파일은 그대로 돌려줍니다.
 */
export function liftHmlVersion(bytes: Uint8Array): Uint8Array {
  // 버전 값은 ASCII 라서 latin1 로 읽어도 바이트 위치가 그대로 맞습니다.
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, HEAD_BYTES));
  const match = ROOT_VERSION.exec(head);
  if (!match) return bytes;
  const version = match[1].trim();
  if (SUPPORTED.has(version) || !/^2\.\d+$/.test(version)) return bytes;

  const start = match.index + match[0].length - match[1].length - 1;
  const end = start + match[1].length;
  const replacement = new TextEncoder().encode('2.91');
  const out = new Uint8Array(bytes.length - (end - start) + replacement.length);
  out.set(bytes.subarray(0, start));
  out.set(replacement, start);
  out.set(bytes.subarray(end), start + replacement.length);
  return out;
}
