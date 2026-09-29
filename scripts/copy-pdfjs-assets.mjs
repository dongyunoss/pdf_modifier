// pdf.js가 런타임에 fetch하는 정적 리소스(CMap, 표준 폰트, wasm 디코더, ICC 프로파일)를
// public/pdfjs 아래로 복사합니다. 한글 PDF 중 폰트가 임베드되지 않은 문서는 CMap이 없으면
// 글자가 깨지므로 반드시 필요합니다. dev/build 전에 npm 스크립트가 자동으로 실행합니다.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pdfjsDir = dirname(require.resolve('pdfjs-dist/package.json'));
const { version } = JSON.parse(readFileSync(join(pdfjsDir, 'package.json'), 'utf8'));
const target = join(root, 'public', 'pdfjs');
const stamp = join(target, '.version');

if (existsSync(stamp) && readFileSync(stamp, 'utf8') === version) {
  process.exit(0);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const dir of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  const from = join(pdfjsDir, dir);
  if (existsSync(from)) cpSync(from, join(target, dir), { recursive: true });
}
writeFileSync(stamp, version);
console.log(`[pdfjs] copied runtime assets for pdfjs-dist@${version} → public/pdfjs`);
