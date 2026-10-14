// Word·PPT → PDF 변환 엔진(LibreOffice WebAssembly)을 내려받아 워커에서 실행합니다.
// 엔진은 여러 스레드(SharedArrayBuffer)를 쓰므로 교차 출처 격리(COOP/COEP)된 페이지에서만 돌아갑니다.
// 압축 풀기 워커는 페이지에 묶어(blob URL) 띄웁니다. 별도 파일로 두면 교차 출처 격리된 페이지가
// 그 파일에 COEP 헤더를 요구해 막히지만, blob 워커는 페이지의 격리 설정을 그대로 물려받습니다.
import DecodeWorker from './decode.worker.ts?worker&inline';
import type { FontPack } from './detect';
import type { DecodeRequest, DecodeResponse, EngineManifest, PackedAsset } from './types';

export const MANIFEST_URL = '/office/manifest.json';
/** 변환 한 번이 이보다 오래 걸리면 멈춘 것으로 봅니다. */
const CONVERT_TIMEOUT_MS = 3 * 60 * 1000;
/** 엔진 시작(글꼴 준비 포함)이 이보다 오래 걸리면 실패로 봅니다. */
const INIT_TIMEOUT_MS = 3 * 60 * 1000;

export type OfficeErrorCode = 'UNSUPPORTED' | 'NETWORK' | 'MEMORY' | 'ENGINE' | 'OPEN_FAILED' | 'TIMEOUT' | 'CANCELLED';

export class OfficeError extends Error {
  constructor(
    readonly code: OfficeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'OfficeError';
  }
}

export interface EngineProgress {
  /** download: 내려받는 중, prepare: 압축 풀기·엔진 시작 */
  phase: 'download' | 'prepare';
  loaded: number;
  total: number;
}

/** 이 브라우저·페이지에서 엔진을 돌릴 수 있는지 (교차 출처 격리 + SharedArrayBuffer + WebAssembly) */
export function engineSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.crossOriginIsolated === true &&
    typeof SharedArrayBuffer !== 'undefined' &&
    typeof WebAssembly === 'object'
  );
}

let manifestPromise: Promise<EngineManifest> | null = null;

export function getManifest(): Promise<EngineManifest> {
  manifestPromise ??= fetch(MANIFEST_URL, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      return response.json() as Promise<EngineManifest>;
    })
    .catch((error) => {
      manifestPromise = null;
      throw new OfficeError('NETWORK', String(error));
    });
  return manifestPromise;
}

/** 처음 변환할 때 내려받는 엔진 크기 (바이트) */
export async function engineDownloadSize(packs: FontPack[] = []): Promise<number> {
  const manifest = await getManifest();
  return assetsFor(manifest, packs).reduce((sum, asset) => sum + asset.packedSize, 0);
}

function assetsFor(manifest: EngineManifest, packs: FontPack[]): PackedAsset[] {
  return [manifest.wasm, manifest.data, ...packs.flatMap((pack) => manifest.fonts[pack] ?? [])];
}

// ────────────────────────────── 내려받기·압축 풀기 ──────────────────────────────

const memoryError = (text: string) => /memory|allocat|out of bounds|RangeError/i.test(text);

async function download(base: string, asset: PackedAsset, signal: AbortSignal, onBytes: (n: number) => void): Promise<ArrayBuffer> {
  const out = new Uint8Array(asset.packedSize);
  let offset = 0;
  for (const part of asset.parts) {
    let response: Response;
    try {
      response = await fetch(base + part.file, { signal });
    } catch (error) {
      if (signal.aborted) throw new OfficeError('CANCELLED', 'cancelled');
      throw new OfficeError('NETWORK', String(error));
    }
    if (!response.ok || !response.body) throw new OfficeError('NETWORK', `${part.file}: ${response.status}`);
    const reader = response.body.getReader();
    for (;;) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (error) {
        if (signal.aborted) throw new OfficeError('CANCELLED', 'cancelled');
        throw new OfficeError('NETWORK', String(error));
      }
      if (chunk.done) break;
      if (offset + chunk.value.length > out.length) throw new OfficeError('NETWORK', `${part.file}: unexpected size`);
      out.set(chunk.value, offset);
      offset += chunk.value.length;
      onBytes(chunk.value.length);
    }
  }
  if (offset !== out.length) throw new OfficeError('NETWORK', 'incomplete download');
  return out.buffer;
}

class Decoder {
  private readonly worker: Worker = new DecodeWorker({ name: 'office-decode' });
  private readonly pending = new Map<number, { resolve: (buffer: ArrayBuffer) => void; reject: (error: Error) => void }>();
  private sequence = 0;
  /** 워커가 죽었으면 그 이유 (이후 요청은 기다리지 않고 바로 실패) */
  private failure: OfficeError | null = null;

  constructor() {
    this.worker.onmessage = (event: MessageEvent<DecodeResponse>) => {
      const message = event.data;
      const task = this.pending.get(message.id);
      if (!task) return;
      this.pending.delete(message.id);
      if (message.error !== undefined) task.reject(new OfficeError('ENGINE', message.error));
      else task.resolve(message.buffer);
    };
    this.worker.onerror = (event) => {
      event.preventDefault();
      const text = event.message || 'decoder failed';
      this.failure = new OfficeError(memoryError(text) ? 'MEMORY' : 'ENGINE', text);
      for (const task of this.pending.values()) task.reject(this.failure);
      this.pending.clear();
    };
  }

  decode(asset: PackedAsset, buffer: ArrayBuffer): Promise<ArrayBuffer> {
    if (this.failure) return Promise.reject(this.failure);
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending.set(id, { resolve, reject });
      const request: DecodeRequest = { id, encoding: asset.encoding, buffer, size: asset.size };
      this.worker.postMessage(request, [buffer]);
    });
  }

  close() {
    this.worker.terminate();
  }
}

// ────────────────────────────── 엔진 워커 ──────────────────────────────

interface EngineMessage {
  type: 'ready' | 'result' | 'error' | 'progress' | string;
  id?: number;
  data?: Uint8Array;
  error?: string;
}

interface Pending {
  resolve: (message: EngineMessage) => void;
  reject: (error: OfficeError) => void;
  timer: ReturnType<typeof setTimeout>;
}

class Engine {
  readonly ready: Promise<void>;
  private worker: Worker | null = null;
  private readonly pending = new Map<number, Pending>();
  private sequence = 0;
  private readonly abort = new AbortController();

  constructor(
    readonly packs: Set<FontPack>,
    onProgress: (progress: EngineProgress) => void,
  ) {
    this.ready = this.start(onProgress);
    // 시작에 실패하면 다음 변환 때 새로 시작합니다.
    this.ready.catch(() => this.dispose());
  }

  private async start(onProgress: (progress: EngineProgress) => void) {
    const manifest = await getManifest();
    const { signal } = this.abort;
    const fonts = [...this.packs].flatMap((pack) => manifest.fonts[pack] ?? []);
    const assets = [manifest.wasm, manifest.data, ...fonts];
    const total = assets.reduce((sum, asset) => sum + asset.packedSize, 0);
    let loaded = 0;
    onProgress({ phase: 'download', loaded, total });
    const decoder = new Decoder();
    try {
      // 큰 파일부터 동시에 내려받고, 받는 대로 압축을 풉니다 (풀기는 워커 하나에서 차례로).
      const decoded = await Promise.all(
        assets.map(async (asset) => {
          const packed = await download(manifest.base, asset, signal, (n) => {
            loaded += n;
            onProgress({ phase: 'download', loaded, total });
          });
          return decoder.decode(asset, packed);
        }),
      );
      if (signal.aborted) throw new OfficeError('CANCELLED', 'cancelled');
      onProgress({ phase: 'prepare', loaded: total, total });
      const [wasmBinary, dataBinary, ...fontData] = decoded;
      const absolute = (file: string) => new URL(manifest.base + file, location.href).href;
      this.worker = new Worker(absolute(manifest.worker), { name: 'office-engine' });
      this.worker.onmessage = (event: MessageEvent<EngineMessage>) => this.receive(event.data);
      this.worker.onerror = (event) => {
        event.preventDefault();
        const text = event.message || 'engine crashed';
        this.failAll(new OfficeError(memoryError(text) ? 'MEMORY' : 'ENGINE', text));
        this.dispose();
      };
      await this.call(
        {
          type: 'init',
          sofficeJs: absolute(manifest.script),
          sofficeWorkerJs: absolute(manifest.pthreadScript),
          // 실제 파일은 아래에서 미리 풀어 넘기므로 이 이름으로 내려받지 않습니다.
          sofficeWasm: 'soffice.wasm',
          sofficeData: 'soffice.data',
          wasmBinary,
          dataBinary,
          fonts: fonts.map((font, index) => ({ name: font.name, data: new Uint8Array(fontData[index]) })),
        },
        [wasmBinary, dataBinary, ...fontData],
        INIT_TIMEOUT_MS,
      );
    } catch (error) {
      if (signal.aborted) throw new OfficeError('CANCELLED', 'cancelled');
      if (error instanceof OfficeError) throw error;
      const text = error instanceof Error ? error.message : String(error);
      throw new OfficeError(memoryError(text) ? 'MEMORY' : 'ENGINE', text);
    } finally {
      decoder.close();
    }
  }

  private receive(message: EngineMessage) {
    if (message.id === undefined) return;
    const task = this.pending.get(message.id);
    if (!task || message.type === 'progress') return;
    this.pending.delete(message.id);
    clearTimeout(task.timer);
    if (message.type === 'error') {
      const text = message.error ?? 'error';
      task.reject(new OfficeError(memoryError(text) ? 'MEMORY' : 'ENGINE', text));
    } else {
      task.resolve(message);
    }
  }

  private call(message: Record<string, unknown>, transfer: Transferable[], timeoutMs: number): Promise<EngineMessage> {
    const worker = this.worker;
    if (!worker) return Promise.reject(new OfficeError('ENGINE', 'engine stopped'));
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new OfficeError('TIMEOUT', 'timeout'));
        // 멈춘 엔진은 버리고 다음에 새로 시작합니다.
        this.dispose();
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      worker.postMessage({ ...message, id }, transfer);
    });
  }

  async convert(bytes: Uint8Array, ext: string): Promise<Uint8Array> {
    await this.ready;
    try {
      const result = await this.call({ type: 'convert', inputData: bytes, inputExt: ext, outputFormat: 'pdf' }, [bytes.buffer], CONVERT_TIMEOUT_MS);
      if (!result.data || result.data.length === 0) throw new OfficeError('OPEN_FAILED', 'empty output');
      return result.data;
    } catch (error) {
      // 엔진이 문서를 열지 못한 경우 (손상·암호·지원하지 않는 형식)
      if (error instanceof OfficeError && error.code === 'ENGINE' && /load|open|document|empty/i.test(error.message)) {
        throw new OfficeError('OPEN_FAILED', error.message);
      }
      throw error;
    }
  }

  private failAll(error: OfficeError) {
    for (const task of this.pending.values()) {
      clearTimeout(task.timer);
      task.reject(error);
    }
    this.pending.clear();
  }

  dispose() {
    this.abort.abort();
    this.failAll(new OfficeError('CANCELLED', 'cancelled'));
    this.worker?.terminate();
    this.worker = null;
    if (engine === this) engine = null;
  }
}

let engine: Engine | null = null;

/**
 * 필요한 글꼴 묶음을 갖춘 엔진을 준비합니다. 이미 떠 있는 엔진에 글꼴이 모자라면 새로 띄웁니다
 * (엔진 파일은 브라우저 캐시에 있으므로 두 번째부터는 내려받지 않습니다).
 */
export async function prepareEngine(packs: FontPack[], onProgress: (progress: EngineProgress) => void): Promise<void> {
  if (!engineSupported()) throw new OfficeError('UNSUPPORTED', 'not cross-origin isolated');
  if (engine && !packs.every((pack) => engine!.packs.has(pack))) {
    const merged = new Set([...engine.packs, ...packs]);
    engine.dispose();
    engine = new Engine(merged, onProgress);
  }
  engine ??= new Engine(new Set(packs), onProgress);
  await engine.ready;
}

/** 준비된 엔진으로 문서 하나를 PDF 로 바꿉니다. */
export async function convertToPdf(file: File, ext: string): Promise<Uint8Array> {
  if (!engine) throw new OfficeError('ENGINE', 'engine not prepared');
  const bytes = new Uint8Array(await file.arrayBuffer());
  return engine.convert(bytes, ext);
}

/** 내려받기·변환을 멈추고 엔진을 내립니다 (취소 버튼). */
export function stopEngine() {
  engine?.dispose();
  engine = null;
}
