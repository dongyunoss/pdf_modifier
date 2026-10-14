// 한글(HWP·HWPX) → PDF 변환에 쓰는 엔진(rhwp, Rust → WebAssembly, MIT)과 글꼴을 public/hwp 아래에 준비합니다.
// dev/build 전에 npm 스크립트가 자동으로 실행합니다. 결과물은 저장소에 올리지 않습니다(.gitignore).
//
// - rhwp 가 HWP 문서를 쪽마다 SVG 로 그리면, 브라우저에서 svg2pdf.js·jsPDF 로 글자가 살아 있는 PDF 를 만듭니다.
// - 글꼴: 나눔고딕·나눔명조(항상) + Noto Sans KR(나눔에 없는 한자·①·㉠ 등이 문서에 있을 때만 내려받음)
// - zstd 로 압축합니다(노드에 없으면 gzip). 결과를 node_modules/.cache 에 보관해 다음 빌드에서 다시 씁니다.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import zlib from 'node:zlib';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_PKG = '@rhwp/core';
const PART_SIZE = 20 * 1024 * 1024;

/** 글꼴 묶음: gothic·myeongjo 는 항상, fallback 은 필요할 때만 */
const FONTS = {
  gothic: [
    ['@expo-google-fonts/nanum-gothic', '400Regular/NanumGothic_400Regular.ttf'],
    ['@expo-google-fonts/nanum-gothic', '700Bold/NanumGothic_700Bold.ttf'],
  ],
  myeongjo: [
    ['@expo-google-fonts/nanum-myeongjo', '400Regular/NanumMyeongjo_400Regular.ttf'],
    ['@expo-google-fonts/nanum-myeongjo', '700Bold/NanumMyeongjo_700Bold.ttf'],
  ],
  fallback: [['@expo-google-fonts/noto-sans-kr', '400Regular/NotoSansKR_400Regular.ttf']],
};

const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));
const pkgVersion = (name) => JSON.parse(readFileSync(join(pkgDir(name), 'package.json'), 'utf8')).version;

const zstdAvailable = typeof zlib.zstdCompress === 'function';
const hash = createHash('sha256');
hash.update(readFileSync(fileURLToPath(import.meta.url)));
for (const name of [ENGINE_PKG, ...new Set(Object.values(FONTS).flat().map(([pkg]) => pkg))]) hash.update(`${name}@${pkgVersion(name)}`);
hash.update(zstdAvailable ? 'zstd' : 'gzip');
const key = hash.digest('hex').slice(0, 12);

const hwpDir = join(root, 'public', 'hwp');
const engineDir = join(hwpDir, 'engine');
const target = join(engineDir, key);
const manifestPath = join(hwpDir, 'manifest.json');
const cacheDir = join(root, 'node_modules', '.cache', 'hwp-engine', key);

const current = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
if (current?.version === key && existsSync(target)) process.exit(0);

const started = Date.now();
if (!existsSync(join(cacheDir, 'manifest.json'))) await build(cacheDir);
rmSync(engineDir, { recursive: true, force: true });
mkdirSync(engineDir, { recursive: true });
cpSync(cacheDir, target, { recursive: true });
rmSync(join(target, 'manifest.json'));
writeFileSync(manifestPath, readFileSync(join(cacheDir, 'manifest.json')));
console.log(`[hwp] engine ${key} → public/hwp (${((Date.now() - started) / 1000).toFixed(1)}s)`);

async function build(out) {
  console.log(`[hwp] building engine ${key} (${zstdAvailable ? 'zstd' : 'gzip'})`);
  const work = `${out}.tmp`;
  rmSync(work, { recursive: true, force: true });
  mkdirSync(join(work, 'fonts'), { recursive: true });
  const src = pkgDir(ENGINE_PKG);

  const compress = zstdAvailable
    ? (bytes) => promisify(zlib.zstdCompress)(bytes, { params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 } })
    : (bytes) => promisify(zlib.gzip)(bytes, { level: 9 });
  const encoding = zstdAvailable ? 'zstd' : 'gzip';
  const ext = zstdAvailable ? 'zst' : 'gz';
  const store = async (name, bytes) => {
    const packed = await compress(bytes);
    const parts = [];
    for (let offset = 0, index = 0; offset < packed.length || index === 0; offset += PART_SIZE, index++) {
      const file = `${name}.${ext}.${index}`;
      const part = packed.subarray(offset, offset + PART_SIZE);
      writeFileSync(join(work, file), part);
      parts.push({ file, size: part.length });
    }
    return { encoding, size: bytes.length, packedSize: packed.length, parts };
  };

  // wasm-bindgen 이 만든 JS 는 내용을 바꾸지 않고 그대로 둡니다 (wasm 은 압축을 풀어 직접 넘김).
  writeFileSync(join(work, 'rhwp.js'), readFileSync(join(src, 'rhwp.js')));
  const entries = Object.entries(FONTS).flatMap(([group, files]) =>
    files.map(([pkg, file]) => ({ group, name: file.slice(file.lastIndexOf('/') + 1), path: join(pkgDir(pkg), file) })),
  );
  const [wasm, ...fonts] = await Promise.all([
    store('rhwp_bg.wasm', readFileSync(join(src, 'rhwp_bg.wasm'))),
    ...entries.map((font) => store(`fonts/${font.name}`, readFileSync(font.path))),
  ]);
  const fontGroups = {};
  entries.forEach((font, index) => (fontGroups[font.group] ??= []).push({ name: font.name, ...fonts[index] }));

  writeFileSync(
    join(work, 'NOTICE.txt'),
    [
      'HWP/HWPX → PDF conversion engine used by PDF Modifier',
      '',
      `rhwp ${pkgVersion(ENGINE_PKG)} (npm ${ENGINE_PKG}) — MIT License — https://github.com/edwardkim/rhwp`,
      '본 제품은 한글과컴퓨터의 한글 문서 파일(.hwp) 공개 문서를 참고하여 개발되었습니다.',
      '"한글", "한컴", "HWP", "HWPX"는 주식회사 한글과컴퓨터의 등록 상표이며, 이 사이트는 한글과컴퓨터와 관련이 없습니다.',
      '',
      'Fonts: Nanum Gothic, Nanum Myeongjo, Noto Sans KR — SIL Open Font License 1.1 (https://openfontlicense.org).',
      '',
    ].join('\n'),
  );
  const manifest = { version: key, base: `/hwp/engine/${key}/`, script: 'rhwp.js', wasm, fonts: fontGroups };
  writeFileSync(join(work, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  rmSync(out, { recursive: true, force: true });
  cpSync(work, out, { recursive: true });
  rmSync(work, { recursive: true, force: true });
  for (const name of readdirSync(dirname(out))) if (name !== key) rmSync(join(dirname(out), name), { recursive: true, force: true });
  const mb = (n) => (n / 1e6).toFixed(1);
  console.log(
    `[hwp] download: wasm ${mb(wasm.packedSize)} MB; fonts ${Object.entries(fontGroups).map(([g, list]) => `${g} ${mb(list.reduce((s, f) => s + f.packedSize, 0))} MB`).join(', ')}`,
  );
}
