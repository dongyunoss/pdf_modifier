// Word·PPT → PDF 변환 엔진(LibreOffice WebAssembly) 파일을 손보는 함수들.
// scripts/build-office-engine.mjs 가 쓰고, tests/unit/office-engine.test.ts 가 확인합니다.

/** 문자열에서 정확히 한 번 나오는 부분을 바꿉니다. 원본 패키지가 바뀌어 기준 문자열이 없으면 빌드를 멈춥니다. */
export function replaceOnce(source, from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`[office] ${label}: 기준 문자열이 ${count}번 나옵니다 (1번이어야 함): ${from.slice(0, 80)}`);
  return source.replace(from, () => to);
}

const PACKAGE_START = 'loadPackage({files:[';
const PACKAGE_END = '],remote_package_size:';

/** soffice.js 안의 데이터 묶음(soffice.data) 목록을 읽습니다. 숫자는 14924e3 처럼 줄여 쓴 형태일 수 있습니다. */
export function readPackageFiles(sofficeJs) {
  const start = sofficeJs.indexOf(PACKAGE_START);
  const end = sofficeJs.indexOf(PACKAGE_END, start);
  if (start < 0 || end < 0) throw new Error('[office] soffice.js 에서 데이터 묶음 목록을 찾지 못했습니다');
  const body = sofficeJs.slice(start + PACKAGE_START.length, end);
  const files = [];
  for (const entry of body.slice(1, -1).split('},{')) {
    const match = /^filename:"([^"]*)",start:([\d.e+]+),end:([\d.e+]+)$/.exec(entry);
    if (!match) throw new Error(`[office] 알 수 없는 데이터 묶음 항목: ${entry.slice(0, 120)}`);
    files.push({ filename: match[1], start: Number(match[2]), end: Number(match[3]) });
  }
  return files;
}

/**
 * 필요 없는 파일을 뺀 새 데이터 묶음과, 그 목록을 반영한 soffice.js 를 만듭니다.
 * @param {string} sofficeJs
 * @param {Uint8Array} data 원래 soffice.data
 * @param {(filename: string) => boolean} keep
 */
export function trimDataPackage(sofficeJs, data, keep) {
  const files = readPackageFiles(sofficeJs);
  const kept = files.filter((file) => keep(file.filename));
  const size = kept.reduce((sum, file) => sum + (file.end - file.start), 0);
  const out = new Uint8Array(size);
  let offset = 0;
  const entries = kept.map((file) => {
    out.set(data.subarray(file.start, file.end), offset);
    const entry = { filename: file.filename, start: offset, end: offset + (file.end - file.start) };
    offset = entry.end;
    return entry;
  });
  const start = sofficeJs.indexOf(PACKAGE_START);
  const sizeStart = sofficeJs.indexOf(PACKAGE_END, start) + PACKAGE_END.length;
  const sizeEnd = sizeStart + /^[\d.e+]+/.exec(sofficeJs.slice(sizeStart))[0].length;
  const list = entries.map((e) => `{filename:${JSON.stringify(e.filename)},start:${e.start},end:${e.end}}`).join(',');
  const js = `${sofficeJs.slice(0, start)}${PACKAGE_START}${list}${PACKAGE_END}${size}${sofficeJs.slice(sizeEnd)}`;
  return { js, data: out, removed: files.length - kept.length, removedBytes: data.length - size };
}

/** 한 번에 미리 띄워 두는 스레드 수. 4개로는 PPT 를 열 때 스레드를 기다리느라 1분 넘게 멈춥니다. */
export const PTHREAD_POOL_SIZE = 16;

/** soffice.js 패치: 스레드 풀 크기 */
export function patchSofficeJs(sofficeJs) {
  return replaceOnce(sofficeJs, 'var pthreadPoolSize=4;', `var pthreadPoolSize=${PTHREAD_POOL_SIZE};`, 'pthread pool');
}

/**
 * 엔진 워커(browser.worker.global.js) 패치
 * - 미리 받아 풀어 둔 wasm·데이터를 그대로 넘겨 받기 (다시 내려받거나 복사하지 않음)
 * - 한글·일본어·중국어 글꼴을 LibreOffice 가 시작하기 전에 넣기
 * - LibreOffice 의 상세 로그(SAL_LOG=+ALL)와 표준 출력을 끄기 (콘솔이 넘쳐 느려짐)
 */
export function patchEngineWorker(workerJs) {
  let js = workerJs;
  js = replaceOnce(
    js,
    'self.Module={mainScriptUrlOrBlob:e,',
    'self.Module={wasmBinary:l.wasmBinary,getPreloadedPackage:l.dataBinary?()=>l.dataBinary:void 0,mainScriptUrlOrBlob:e,',
    'preloaded binaries',
  );
  js = replaceOnce(js, 'print:console.log,printErr:console.error}', 'print:o?console.log:()=>{},printErr:o?console.error:()=>{}}', 'quiet output');
  js = replaceOnce(js, 'i.ENV.SAL_LOG="+ALL"', 'i.ENV.SAL_LOG="-ALL"', 'quiet SAL_LOG');
  js = replaceOnce(js, 'console.log("[Worker] Set SAL_LOG to +ALL")', 'console.log("[Worker] Set SAL_LOG to -ALL")', 'SAL_LOG message');
  js = replaceOnce(
    js,
    'if($("lok-init","Initializing LibreOfficeKit..."),',
    'for(let f of l.fonts||[])s.writeFile("/instdir/share/fonts/truetype/"+f.name,f.data);if($("lok-init","Initializing LibreOfficeKit..."),',
    'fonts',
  );
  return js;
}

/** 큰 파일을 호스팅 한도(파일당 25 MiB)보다 작은 조각으로 나눕니다. */
export function splitParts(bytes, partSize) {
  const parts = [];
  for (let offset = 0; offset < bytes.length; offset += partSize) parts.push(bytes.subarray(offset, offset + partSize));
  return parts.length ? parts : [bytes.subarray(0, 0)];
}
