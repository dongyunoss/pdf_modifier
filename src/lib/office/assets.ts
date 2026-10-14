// 엔진·글꼴 파일 내려받기와 압축 풀기 (Word·PPT 변환 엔진과 HWP 변환 엔진이 함께 씁니다)
// 압축 풀기 워커는 페이지에 묶어(blob URL) 띄웁니다. 별도 파일로 두면 교차 출처 격리된 페이지가
// 그 파일에 COEP 헤더를 요구해 막히지만, blob 워커는 페이지의 격리 설정을 그대로 물려받습니다.
import DecodeWorker from './decode.worker.ts?worker&inline';
import type { DecodeRequest, DecodeResponse, PackedAsset } from './types';

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

// ────────────────────────────── 내려받기·압축 풀기 ──────────────────────────────

export const memoryError = (text: string) => /memory|allocat|out of bounds|RangeError/i.test(text);

export async function download(base: string, asset: PackedAsset, signal: AbortSignal, onBytes: (n: number) => void): Promise<ArrayBuffer> {
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

export class Decoder {
  private readonly worker: Worker = new DecodeWorker();
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

