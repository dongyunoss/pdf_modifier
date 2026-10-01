// 결과 파일 여러 개를 ZIP 하나로 묶습니다. 파일마다 진행 상황을 알리고, 한 번에 한 파일만 읽어 메모리를 아낍니다.
import { Zip, ZipPassThrough } from 'fflate';

export interface ZipSource {
  name: string;
  /** 파일 내용을 읽습니다 (차례가 되었을 때 한 번 호출) */
  read: () => Promise<Uint8Array>;
}

/**
 * PDF·JPEG·PNG 는 이미 압축되어 있으므로 다시 압축하지 않고 그대로(store) 담습니다.
 * onProgress 는 파일 하나를 담을 때마다 (담은 수, 전체 수)로 불립니다.
 */
export async function zipFiles(
  entries: ZipSource[],
  onProgress?: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  let failure: Error | null = null;
  const archive = new Zip((error, chunk) => {
    if (error) failure = error;
    else chunks.push(chunk);
  });
  for (let i = 0; i < entries.length; i++) {
    const file = new ZipPassThrough(entries[i].name);
    archive.add(file);
    file.push(await entries[i].read(), true);
    if (failure) throw failure;
    onProgress?.(i + 1, entries.length);
  }
  archive.end();
  if (failure) throw failure;

  const out = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
