// Word·PPT 변환 엔진 매니페스트(public/office/manifest.json)와 워커 메시지 형식
import type { FontPack } from './detect';

export type Encoding = 'zstd' | 'gzip';

/** 압축해서 여러 조각으로 나눈 파일 */
export interface PackedAsset {
  encoding: Encoding;
  /** 압축을 푼 크기 */
  size: number;
  /** 내려받을 크기 (조각 합계) */
  packedSize: number;
  parts: Array<{ file: string; size: number }>;
}

export interface EngineManifest {
  version: string;
  /** 엔진 파일이 있는 경로 (예: /office/engine/abc123/) */
  base: string;
  script: string;
  pthreadScript: string;
  worker: string;
  wasm: PackedAsset;
  data: PackedAsset;
  fonts: Record<FontPack, Array<PackedAsset & { name: string }>>;
}

export interface DecodeRequest {
  id: number;
  encoding: Encoding;
  buffer: ArrayBuffer;
  size: number;
}

export type DecodeResponse = { id: number; buffer: ArrayBuffer; error?: undefined } | { id: number; error: string };
