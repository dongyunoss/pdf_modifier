// 한글(HWP·HWPX·HML) 문서를 브라우저 안에서 PDF 로 바꿉니다.
// rhwp(Rust → WebAssembly)가 쪽마다 SVG 를 그리면, svg2pdf.js 와 jsPDF 가 글꼴을 넣은 PDF 로 옮깁니다.
// 글자가 그림이 아니라 글자로 들어가므로 PDF 에서 검색·복사할 수 있습니다.
// Word·PPT 엔진과 달리 여러 스레드를 쓰지 않아 일반 도구 페이지에서 바로 돌아갑니다.
import type { jsPDF as JsPdf } from 'jspdf';
import { Decoder, download, memoryError, OfficeError } from '../office/assets';
import type { PackedAsset } from '../office/types';
import { readCoverage } from './cmap';
import { liftHmlVersion } from './hml';
import { FONT_FAMILY, prepareSvg, type Coverage } from './svg';

export const HWP_MANIFEST_URL = '/hwp/manifest.json';
/** CSS 픽셀(96 dpi) → PDF 포인트(72 dpi) */
const PX_TO_PT = 0.75;

type FontAsset = PackedAsset & { name: string };

interface HwpManifest {
  version: string;
  base: string;
  script: string;
  wasm: PackedAsset;
  fonts: { gothic: FontAsset[]; myeongjo: FontAsset[]; fallback: FontAsset[] };
}

interface RhwpDocument {
  pageCount(): number;
  renderPageSvg(page: number): string;
  free(): void;
}

interface RhwpModule {
  default: (input: { module_or_path: BufferSource }) => Promise<unknown>;
  HwpDocument: new (data: Uint8Array) => RhwpDocument;
}

export interface HwpProgress {
  /** download: 엔진·글꼴 내려받는 중, prepare: 준비 중, page: 쪽을 PDF 로 옮기는 중 */
  phase: 'download' | 'prepare' | 'page';
  loaded: number;
  total: number;
}

/** 내려받아 둔 글꼴 (jsPDF 에 넣을 base64 와, 그릴 수 있는 글자 목록) */
interface LoadedFont {
  base64: string;
  coverage: Set<number>;
}

let manifestPromise: Promise<HwpManifest> | null = null;

export function getHwpManifest(): Promise<HwpManifest> {
  manifestPromise ??= fetch(HWP_MANIFEST_URL, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      return response.json() as Promise<HwpManifest>;
    })
    .catch((error) => {
      manifestPromise = null;
      throw new OfficeError('NETWORK', String(error));
    });
  return manifestPromise;
}

/** 처음 변환할 때 내려받는 크기 (보조 글꼴 제외) */
export async function hwpDownloadSize(): Promise<number> {
  const manifest = await getHwpManifest();
  return [manifest.wasm, ...manifest.fonts.gothic, ...manifest.fonts.myeongjo].reduce((sum, asset) => sum + asset.packedSize, 0);
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

// ────────────────────────────── 엔진·글꼴 준비 ──────────────────────────────

interface Engine {
  rhwp: RhwpModule;
  fonts: Record<string, LoadedFont>;
}

let enginePromise: Promise<Engine> | null = null;
let fallbackPromise: Promise<Record<string, LoadedFont>> | null = null;

/** 내려받기 → 압축 풀기 (여러 파일을 동시에 받고, 진행 바이트를 알려 줌) */
async function fetchAssets(
  manifest: HwpManifest,
  assets: PackedAsset[],
  onProgress: (progress: HwpProgress) => void,
): Promise<ArrayBuffer[]> {
  const total = assets.reduce((sum, asset) => sum + asset.packedSize, 0);
  let loaded = 0;
  onProgress({ phase: 'download', loaded, total });
  const decoder = new Decoder();
  const signal = new AbortController().signal;
  try {
    return await Promise.all(
      assets.map(async (asset) => {
        const packed = await download(manifest.base, asset, signal, (n) => {
          loaded += n;
          onProgress({ phase: 'download', loaded, total });
        });
        return decoder.decode(asset, packed);
      }),
    );
  } finally {
    decoder.close();
  }
}

const loadFonts = (assets: FontAsset[], buffers: ArrayBuffer[]): Record<string, LoadedFont> =>
  Object.fromEntries(
    assets.map((asset, index) => {
      const bytes = new Uint8Array(buffers[index]);
      return [asset.name, { base64: toBase64(bytes), coverage: readCoverage(bytes) }];
    }),
  );

function prepareEngine(onProgress: (progress: HwpProgress) => void): Promise<Engine> {
  enginePromise ??= (async () => {
    const manifest = await getHwpManifest();
    const fontAssets = [...manifest.fonts.gothic, ...manifest.fonts.myeongjo];
    const [wasm, ...fontBuffers] = await fetchAssets(manifest, [manifest.wasm, ...fontAssets], onProgress);
    onProgress({ phase: 'prepare', loaded: 0, total: 0 });
    const rhwp = (await import(/* @vite-ignore */ new URL(manifest.base + manifest.script, location.href).href)) as RhwpModule;
    await rhwp.default({ module_or_path: wasm });
    return { rhwp, fonts: loadFonts(fontAssets, fontBuffers) };
  })().catch((error) => {
    enginePromise = null;
    if (error instanceof OfficeError) throw error;
    const text = error instanceof Error ? error.message : String(error);
    throw new OfficeError(memoryError(text) ? 'MEMORY' : 'ENGINE', text);
  });
  return enginePromise;
}

/** 나눔 글꼴에 없는 글자가 나왔을 때만 받는 보조 글꼴 */
function prepareFallback(onProgress: (progress: HwpProgress) => void): Promise<Record<string, LoadedFont>> {
  fallbackPromise ??= (async () => {
    const manifest = await getHwpManifest();
    const buffers = await fetchAssets(manifest, manifest.fonts.fallback, onProgress);
    return loadFonts(manifest.fonts.fallback, buffers);
  })().catch((error) => {
    fallbackPromise = null;
    throw error;
  });
  return fallbackPromise;
}

// ────────────────────────────── 변환 ──────────────────────────────

/** jsPDF 문서에 글꼴을 등록합니다 (굵은 보조 글꼴은 보통 글꼴로 대신합니다). */
function registerFonts(pdf: JsPdf, manifest: HwpManifest, fonts: Record<string, LoadedFont>, roles: Array<'gothic' | 'myeongjo' | 'fallback'>) {
  for (const role of roles) {
    const list = manifest.fonts[role];
    list.forEach((asset, index) => {
      const font = fonts[asset.name];
      if (!font) return;
      pdf.addFileToVFS(asset.name, font.base64);
      pdf.addFont(asset.name, FONT_FAMILY[role], index === 0 ? 'normal' : 'bold', undefined, 'Identity-H');
      if (list.length === 1) pdf.addFont(asset.name, FONT_FAMILY[role], 'bold', undefined, 'Identity-H');
    });
  }
}

/** rhwp 가 문서를 열지 못한 이유를 사용자에게 보여 줄 분류로 바꿉니다. */
function openError(error: unknown): OfficeError {
  const text = error instanceof Error ? error.message : String(error);
  if (memoryError(text)) return new OfficeError('MEMORY', text);
  return new OfficeError('OPEN_FAILED', text);
}

/**
 * HWP·HWPX·HML 파일 하나를 PDF 로 바꿉니다. isCancelled 가 true 를 돌려주면 다음 쪽으로 넘어가기 전에 멈춥니다.
 */
export async function hwpToPdf(
  file: File,
  onProgress: (progress: HwpProgress) => void,
  isCancelled: () => boolean = () => false,
): Promise<Uint8Array> {
  const engine = await prepareEngine(onProgress);
  const manifest = await getHwpManifest();
  const [{ jsPDF }, { svg2pdf }] = await Promise.all([import('jspdf'), import('svg2pdf.js')]);
  const cancelled = () => new OfficeError('CANCELLED', 'cancelled');

  let doc: RhwpDocument;
  try {
    doc = new engine.rhwp.HwpDocument(liftHmlVersion(new Uint8Array(await file.arrayBuffer())));
  } catch (error) {
    throw openError(error);
  }

  // svg2pdf 는 화면에 붙은 SVG 에서 글꼴·크기를 읽으므로, 보이지 않는 곳에 잠깐 붙입니다.
  const stage = document.createElement('div');
  stage.setAttribute('aria-hidden', 'true');
  stage.style.cssText = 'position:fixed;left:-100000px;top:0;width:0;height:0;overflow:hidden;';
  document.body.append(stage);
  const font = (name: string) => engine.fonts[name]?.coverage ?? new Set<number>();
  const coverage: Coverage = {
    gothic: font(manifest.fonts.gothic[0].name),
    myeongjo: font(manifest.fonts.myeongjo[0].name),
    fallback: null,
  };

  try {
    const pages = doc.pageCount();
    if (pages === 0) throw new OfficeError('OPEN_FAILED', 'empty document');
    let pdf: JsPdf | null = null;
    let fallbackRegistered = false;
    for (let page = 0; page < pages; page++) {
      if (isCancelled()) throw cancelled();
      onProgress({ phase: 'page', loaded: page, total: pages });
      let markup: string;
      try {
        markup = doc.renderPageSvg(page);
      } catch (error) {
        throw openError(error);
      }
      stage.innerHTML = markup;
      const svg = stage.querySelector('svg');
      if (!svg) throw new OfficeError('OPEN_FAILED', `page ${page + 1}: no svg`);

      if (prepareSvg(svg, coverage) && !coverage.fallback) {
        const fallback = await prepareFallback(onProgress);
        Object.assign(engine.fonts, fallback);
        coverage.fallback = fallback[manifest.fonts.fallback[0].name]?.coverage ?? null;
        prepareSvg(svg, coverage);
        onProgress({ phase: 'page', loaded: page, total: pages });
      }

      const width = parseFloat(svg.getAttribute('width') ?? '') * PX_TO_PT || 595.28;
      const height = parseFloat(svg.getAttribute('height') ?? '') * PX_TO_PT || 841.89;
      const orientation = width > height ? 'landscape' : 'portrait';
      if (!pdf) {
        pdf = new jsPDF({ unit: 'pt', format: [width, height], orientation, compress: true });
        registerFonts(pdf, manifest, engine.fonts, ['gothic', 'myeongjo']);
      } else {
        pdf.addPage([width, height], orientation);
      }
      if (coverage.fallback && !fallbackRegistered) {
        registerFonts(pdf, manifest, engine.fonts, ['fallback']);
        fallbackRegistered = true;
      }
      await svg2pdf(svg, pdf, { x: 0, y: 0, width, height });
      stage.replaceChildren();
      // 쪽 사이에 화면을 한 번 그리게 해서 진행 막대가 멈춰 보이지 않게 합니다.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    if (isCancelled()) throw cancelled();
    onProgress({ phase: 'page', loaded: pages, total: pages });
    pdf!.setProperties({ title: file.name.replace(/\.[^.]+$/, ''), creator: 'PDF Modifier' });
    return new Uint8Array(pdf!.output('arraybuffer'));
  } finally {
    stage.remove();
    doc.free();
  }
}
