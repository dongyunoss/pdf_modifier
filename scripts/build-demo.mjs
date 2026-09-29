// 체험판을 빌드합니다: dist-demo/index.html (일반 정적 페이지) 과
// dist-demo/artifact.html (claude.ai 아티팩트로 게시할 때 쓰는 본문 전용 페이지).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist-demo');

await build({ configFile: join(root, 'vite.demo.config.ts'), logLevel: 'warn' });

// pdf.js 런타임 리소스 (CMap·표준 폰트·디코더). 라이선스 파일과 쓰지 않는 스크립트 엔진은 제외합니다.
// 아티팩트가 제공하지 않는 바이너리 형식(.bcmap, .pfb)은 base64 텍스트(<이름>.b64.txt)로 바꿔 두고
// demo/pdfjs-assets.ts 가 풀어서 씁니다. 색상 프로필(.icc)은 체험판에서 쓰지 않습니다.
const pdfjsSource = join(root, 'public', 'pdfjs');
if (!existsSync(pdfjsSource)) throw new Error('public/pdfjs 가 없습니다. 먼저 npm run build 또는 npm run dev 를 한 번 실행하세요.');
const copy = /\.(ttf|wasm)$|_nowasm_fallback\.js$/;
const encode = /\.(bcmap|pfb)$/;
rmSync(join(out, 'pdfjs'), { recursive: true, force: true });
for (const dir of ['cmaps', 'standard_fonts', 'wasm']) {
  const target = join(out, 'pdfjs', dir);
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(join(pdfjsSource, dir))) {
    if (name.startsWith('quickjs')) continue;
    const source = join(pdfjsSource, dir, name);
    if (encode.test(name)) writeFileSync(join(target, `${name}.b64.txt`), readFileSync(source).toString('base64'));
    else if (copy.test(name)) cpSync(source, join(target, name));
  }
}

// 압축된 JS 의 문자열 안에 제어 문자나 대체 문자(U+FFFD)가 그대로 들어 있으면 일부 호스팅(아티팩트 등)이 거부합니다.
// 문자열·템플릿·정규식 안에서 같은 의미인 \xNN / \uFFFD 이스케이프로 바꿉니다. (String.raw 는 쓰지 않음)
const RAW_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/g;
const listFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)],
  );
for (const path of listFiles(out).filter((file) => /\.m?js$/.test(file))) {
  const source = readFileSync(path, 'utf8');
  if (source.includes('String.raw')) throw new Error(`${path}: String.raw 가 있어 제어 문자를 안전하게 바꿀 수 없습니다.`);
  const escaped = source.replace(RAW_CHARS, (c) =>
    c === '\ufffd' ? '\\uFFFD' : `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`,
  );
  if (escaped !== source) writeFileSync(path, escaped);
}

// 아티팩트용 페이지: 게시할 때 문서 뼈대(doctype, head, body)가 자동으로 씌워지므로
// <title>, 인라인 스타일, 본문, 모듈 스크립트만 남깁니다.
const html = readFileSync(join(out, 'index.html'), 'utf8');
const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'PDF Modifier';
const styles = [...html.matchAll(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g)].map((match) =>
  readFileSync(join(out, match[1]), 'utf8'),
);
const scripts = [...html.matchAll(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g)].map(
  (match) => `<script type="module" src="${match[1]}"></script>`,
);
const artifact = [
  `<title>${title}</title>`,
  `<style>${styles.join('\n')}</style>`,
  '<div id="app"></div>',
  ...scripts,
  '',
].join('\n');
writeFileSync(join(out, 'artifact.html'), artifact);

// 텍스트 파일에 제어 문자나 U+FFFD 가 남아 있으면 게시할 때 거부되므로 여기서 멈춥니다.
const files = listFiles(out);
const hasRawChars = new RegExp(RAW_CHARS.source);
for (const path of files.filter((file) => /\.(html|css|m?js|txt)$/.test(file))) {
  if (hasRawChars.test(readFileSync(path, 'utf8'))) throw new Error(`${path}: 제어 문자 또는 U+FFFD 가 남아 있습니다.`);
}
console.log(`[demo] dist-demo/ 에 ${files.length}개 파일을 만들었습니다 (artifact.html 포함).`);
