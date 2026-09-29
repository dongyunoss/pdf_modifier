// 메인 스레드 ↔ PDF 워커 간 메시지 형식
import type { CompressStats } from './compress';
import type { CompressOptions } from './constants';
import type { SerializedError } from './errors';
import type {
  ImagesToPdfOptions,
  PageNumberOptions,
  PageSpec,
  ProtectOptions,
  WatermarkOptions,
} from './ops';

/** 워커로 보내는 파일. File/Blob 은 복사 없이 전달되고 워커에서 읽습니다. */
export interface FileSource {
  data: Blob | Uint8Array;
  password?: string;
}

export interface ZipEntry {
  name: string;
  data: Blob | Uint8Array;
}

export interface TaskMap {
  merge: { args: { files: FileSource[] }; result: Uint8Array };
  assemble: { args: { files: FileSource[]; pages: PageSpec[] }; result: Uint8Array };
  split: { args: { file: FileSource; groups: number[][] }; result: Uint8Array[] };
  deletePages: { args: { file: FileSource; pages: number[] }; result: Uint8Array };
  extractPages: { args: { file: FileSource; pages: number[] }; result: Uint8Array };
  rotatePages: { args: { file: FileSource; rotations: Array<{ page: number; rotate: number }> }; result: Uint8Array };
  pageNumbers: { args: { file: FileSource; options: PageNumberOptions }; result: Uint8Array };
  watermark: { args: { file: FileSource; options: WatermarkOptions }; result: Uint8Array };
  imagesToPdf: {
    args: { images: Array<{ data: Blob | Uint8Array; type: 'jpeg' | 'png'; rotation?: number }>; options: ImagesToPdfOptions };
    result: Uint8Array;
  };
  pagesFromImages: {
    args: { pages: Array<{ jpeg: Blob | Uint8Array; width: number; height: number }> };
    result: Uint8Array;
  };
  compress: { args: { file: FileSource; options: CompressOptions }; result: { bytes: Uint8Array; stats: CompressStats } };
  protect: { args: { file: FileSource; options: ProtectOptions }; result: Uint8Array };
  unlock: { args: { file: FileSource }; result: { bytes: Uint8Array; wasEncrypted: boolean } };
  zip: { args: { entries: ZipEntry[] }; result: Uint8Array };
}

export type TaskName = keyof TaskMap;

export interface TaskRequest<K extends TaskName = TaskName> {
  id: number;
  op: K;
  args: TaskMap[K]['args'];
  producer?: string;
}

export type TaskResponse =
  | { id: number; type: 'progress'; done: number; total: number }
  | { id: number; type: 'result'; result: unknown }
  | { id: number; type: 'error'; error: SerializedError };
