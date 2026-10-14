// 내려받은 엔진·글꼴 파일의 압축을 화면이 멈추지 않도록 워커에서 풉니다 (zstd 또는 gzip).
import { decompress } from 'fzstd';
import type { DecodeRequest, DecodeResponse } from './types';

const post = (message: DecodeResponse, transfer: Transferable[] = []) =>
  (self as unknown as Worker).postMessage(message, transfer);

self.onmessage = async (event: MessageEvent<DecodeRequest>) => {
  const { id, encoding, buffer, size } = event.data;
  try {
    let out: Uint8Array;
    if (encoding === 'zstd') {
      out = decompress(new Uint8Array(buffer), new Uint8Array(size));
    } else {
      const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
      out = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    if (out.length !== size) throw new Error(`size mismatch: ${out.length} != ${size}`);
    const result = out.byteOffset === 0 && out.byteLength === out.buffer.byteLength ? out : out.slice();
    post({ id, buffer: result.buffer as ArrayBuffer }, [result.buffer as ArrayBuffer]);
  } catch (error) {
    post({ id, error: error instanceof Error ? error.message : String(error) });
  }
};
