// Word·PPT → PDF 변환에 쓰는 LibreOffice WebAssembly 엔진과 한·중·일 글꼴을 public/office 아래에 준비합니다.
// dev/build 전에 npm 스크립트가 자동으로 실행합니다. 결과물은 저장소에 올리지 않습니다(.gitignore).
//
// - 원본: @bentopdf/libreoffice-wasm (LibreOffice, MPL-2.0) — 브라우저 안에서 문서를 변환하므로 파일을 서버로 보내지 않습니다.
// - 이 사이트에 쓰지 않는 글꼴(히브리어·아랍어 장식 글꼴 등)을 빼서 내려받을 양을 줄입니다.
// - zstd 로 압축하고(노드에 없으면 gzip), 호스팅 한도(파일당 25 MiB)보다 작게 나눕니다.
// - 압축에 1~2분 걸리므로 결과를 node_modules/.cache 에 보관해 다음 빌드에서 다시 씁니다.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { patchEngineWorker, patchSofficeJs, splitParts, trimDataPackage } from './lib/office-engine.mjs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_PKG = '@bentopdf/libreoffice-wasm';
const PART_SIZE = 20 * 1024 * 1024;

/** 문서에 쓰인 글자에 따라 필요할 때만 내려받는 글꼴 묶음 */
const FONT_PACKS = {
  ko: [
    ['@expo-google-fonts/nanum-gothic', '400Regular/NanumGothic_400Regular.ttf'],
    ['@expo-google-fonts/nanum-gothic', '700Bold/NanumGothic_700Bold.ttf'],
    ['@expo-google-fonts/nanum-myeongjo', '400Regular/NanumMyeongjo_400Regular.ttf'],
    ['@expo-google-fonts/nanum-myeongjo', '700Bold/NanumMyeongjo_700Bold.ttf'],
  ],
  ja: [
    ['@expo-google-fonts/noto-sans-jp', '400Regular/NotoSansJP_400Regular.ttf'],
    ['@expo-google-fonts/noto-sans-jp', '700Bold/NotoSansJP_700Bold.ttf'],
  ],
  sc: [
    ['@expo-google-fonts/noto-sans-sc', '400Regular/NotoSansSC_400Regular.ttf'],
    ['@expo-google-fonts/noto-sans-sc', '700Bold/NotoSansSC_700Bold.ttf'],
  ],
  tc: [
    ['@expo-google-fonts/noto-sans-tc', '400Regular/NotoSansTC_400Regular.ttf'],
    ['@expo-google-fonts/noto-sans-tc', '700Bold/NotoSansTC_700Bold.ttf'],
  ],
};

/**
 * 엔진에 들어 있지만 이 사이트의 13개 언어에는 쓰지 않는 글꼴 (약 30 MB).
 * 아랍어·히브리어·조지아어·아르메니아어·라오어는 기본 Noto Sans 한 벌씩 남겨 글자가 빠지지 않게 합니다.
 */
const REMOVED_FONTS = [
  'LinLibertine', 'LinBiolinum', 'Amiri', 'Scheherazade', 'NotoNaskhArabic', 'NotoKufiArabic', 'ReemKufi', 'Rubik',
  'GenBas', 'GenBkBas', 'DavidCLM', 'DavidLibre', 'FrankRuehl', 'FrankRuhl', 'MiriamCLM', 'MiriamLibre', 'MiriamMono',
  'NachlieliCLM', 'Alef', 'NotoSerifHebrew', 'NotoSerifGeorgian', 'NotoSerifLao', 'NotoSerifArmenian', 'NotoSansLisu',
  'DejaVuSansCondensed', 'DejaVuSerifCondensed', 'DejaVuMathTeXGyre',
];
const keepFile = (filename) => {
  if (!filename.startsWith('/instdir/share/fonts/truetype/')) return true;
  const name = filename.slice(filename.lastIndexOf('/') + 1);
  return !REMOVED_FONTS.some((prefix) => name.startsWith(prefix));
};

const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));
const pkgVersion = (name) => JSON.parse(readFileSync(join(pkgDir(name), 'package.json'), 'utf8')).version;

// 이 스크립트·패치 내용·패키지 버전이 바뀌면 새 폴더(새 주소)가 되어 브라우저 캐시와 섞이지 않습니다.
const hash = createHash('sha256');
hash.update(readFileSync(fileURLToPath(import.meta.url)));
hash.update(readFileSync(join(root, 'scripts/lib/office-engine.mjs')));
for (const name of [ENGINE_PKG, ...new Set(Object.values(FONT_PACKS).flat().map(([pkg]) => pkg))]) hash.update(`${name}@${pkgVersion(name)}`);
const zstdAvailable = typeof zlib.zstdCompress === 'function';
hash.update(zstdAvailable ? 'zstd' : 'gzip');
const key = hash.digest('hex').slice(0, 12);

const officeDir = join(root, 'public', 'office');
const engineDir = join(officeDir, 'engine');
const target = join(engineDir, key);
const manifestPath = join(officeDir, 'manifest.json');
const cacheDir = join(root, 'node_modules', '.cache', 'office-engine', key);

const current = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
if (current?.version === key && existsSync(target)) process.exit(0);

const started = Date.now();
if (!existsSync(join(cacheDir, 'manifest.json'))) await build(cacheDir);
rmSync(engineDir, { recursive: true, force: true });
mkdirSync(engineDir, { recursive: true });
cpSync(cacheDir, target, { recursive: true });
rmSync(join(target, 'manifest.json'));
writeFileSync(manifestPath, readFileSync(join(cacheDir, 'manifest.json')));
console.log(`[office] engine ${key} → public/office (${((Date.now() - started) / 1000).toFixed(1)}s)`);

async function build(out) {
  console.log(`[office] building engine ${key} (${zstdAvailable ? 'zstd' : 'gzip'}) — 처음 한 번은 1~2분 걸립니다`);
  const work = `${out}.tmp`;
  rmSync(work, { recursive: true, force: true });
  mkdirSync(join(work, 'fonts'), { recursive: true });
  const src = join(pkgDir(ENGINE_PKG), 'assets');

  const compress = zstdAvailable
    ? (bytes) =>
        promisify(zlib.zstdCompress)(bytes, {
          params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 },
        })
    : (bytes) => promisify(zlib.gzip)(bytes, { level: 9 });
  const encoding = zstdAvailable ? 'zstd' : 'gzip';
  const ext = zstdAvailable ? 'zst' : 'gz';

  /** 압축해서 조각으로 저장하고, 매니페스트에 넣을 정보를 돌려줍니다. */
  const store = async (name, bytes) => {
    const packed = await compress(bytes);
    const parts = splitParts(packed, PART_SIZE).map((part, index) => {
      const file = `${name}.${ext}.${index}`;
      writeFileSync(join(work, file), part);
      return { file, size: part.length };
    });
    return { encoding, size: bytes.length, packedSize: packed.length, parts };
  };

  const trimmed = trimDataPackage(
    readFileSync(join(src, 'soffice.js'), 'utf8'),
    zlib.gunzipSync(readFileSync(join(src, 'soffice.data.gz'))),
    keepFile,
  );
  writeFileSync(join(work, 'soffice.js'), patchSofficeJs(trimmed.js));
  writeFileSync(join(work, 'soffice.worker.js'), readFileSync(join(src, 'soffice.worker.js')));
  writeFileSync(join(work, 'engine.worker.js'), patchEngineWorker(readFileSync(join(src, 'browser.worker.global.js'), 'utf8')));
  console.log(`[office] removed ${trimmed.removed} unused fonts (${(trimmed.removedBytes / 1e6).toFixed(1)} MB)`);

  const fontEntries = Object.entries(FONT_PACKS).flatMap(([pack, files]) =>
    files.map(([pkg, file]) => ({ pack, name: file.slice(file.lastIndexOf('/') + 1), path: join(pkgDir(pkg), file) })),
  );
  const [wasm, data, ...fonts] = await Promise.all([
    store('soffice.wasm', zlib.gunzipSync(readFileSync(join(src, 'soffice.wasm.gz')))),
    store('soffice.data', trimmed.data),
    ...fontEntries.map((font) => store(`fonts/${font.name}`, readFileSync(font.path))),
  ]);
  const fontPacks = {};
  fontEntries.forEach((font, index) => (fontPacks[font.pack] ??= []).push({ name: font.name, ...fonts[index] }));

  writeFileSync(
    join(work, 'NOTICE.txt'),
    [
      'Word·PPT → PDF conversion engine used by PDF Modifier',
      '',
      `LibreOffice compiled to WebAssembly, from the npm package ${ENGINE_PKG}@${pkgVersion(ENGINE_PKG)}.`,
      'License: Mozilla Public License 2.0 (https://www.mozilla.org/MPL/2.0/).',
      'LibreOffice source code: https://www.libreoffice.org/download/source-code/',
      'WebAssembly build: https://github.com/matbeedotcom/libreoffice-document-converter',
      '',
      'Changes made for this site (see scripts/build-office-engine.mjs and scripts/lib/office-engine.mjs):',
      '- soffice.js: unused fonts removed from the data package; pthread pool size raised to avoid stalls.',
      '- engine.worker.js (browser.worker.global.js): accepts preloaded binaries and extra fonts; logging turned off.',
      '',
      'Fonts: Nanum Gothic, Nanum Myeongjo, Noto Sans JP/SC/TC — SIL Open Font License 1.1 (https://openfontlicense.org).',
      '',
    ].join('\n'),
  );
  const manifest = {
    version: key,
    base: `/office/engine/${key}/`,
    script: 'soffice.js',
    pthreadScript: 'soffice.worker.js',
    worker: 'engine.worker.js',
    wasm,
    data,
    fonts: fontPacks,
  };
  writeFileSync(join(work, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  rmSync(out, { recursive: true, force: true });
  cpSync(work, out, { recursive: true });
  rmSync(work, { recursive: true, force: true });
  // 오래된 캐시 폴더 정리
  for (const name of readdirSync(dirname(out))) if (name !== key) rmSync(join(dirname(out), name), { recursive: true, force: true });
  const mb = (n) => (n / 1e6).toFixed(1);
  console.log(`[office] engine download: wasm ${mb(wasm.packedSize)} MB + data ${mb(data.packedSize)} MB; fonts ${Object.entries(fontPacks).map(([p, list]) => `${p} ${mb(list.reduce((s, f) => s + f.packedSize, 0))} MB`).join(', ')}`);
}
