// PDF 처리 전용 Web Worker. 무거운 작업을 메인 스레드 밖에서 실행해 화면이 멈추지 않게 합니다.
import { zipFiles } from '../zip';
import { compressPdf, type ImageRecoder, type RecodeInput, type RecodeTarget } from './compress';
import { serializeError } from './errors';
import { stripJpegExif } from './jpeg';
import type { PdfSource } from './load';
import {
  addPageNumbers,
  addWatermark,
  assemble,
  deletePages,
  extractPages,
  imagesToPdf,
  merge,
  pagesFromImages,
  protectPdf,
  rotatePages,
  split,
  unlockPdf,
} from './ops';
import type { FileSource, TaskMap, TaskName, TaskRequest, TaskResponse } from './protocol';

const toBytes = async (data: Blob | Uint8Array): Promise<Uint8Array> =>
  data instanceof Uint8Array ? data : new Uint8Array(await data.arrayBuffer());

const toSource = async (file: FileSource): Promise<PdfSource> => ({
  bytes: await toBytes(file.data),
  password: file.password,
});

/** OffscreenCanvas 로 이미지를 다시 인코딩하는 브라우저용 구현 */
const canvasRecoder: ImageRecoder = {
  async recode(input: RecodeInput, target: RecodeTarget) {
    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') return null;
    let source: CanvasImageSource;
    if (input.kind === 'jpeg') {
      // EXIF 방향(APP1)을 제거하고 ICC 변환을 끄면 PDF 에 표시되던 모습과 같은 픽셀을 얻을 수 있습니다.
      const blob = new Blob([stripJpegExif(input.bytes) as BlobPart], { type: 'image/jpeg' });
      const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
      if (bitmap.width !== input.width || bitmap.height !== input.height) {
        bitmap.close();
        return null;
      }
      source = bitmap;
    } else {
      const canvas = new OffscreenCanvas(input.width, input.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const image = ctx.createImageData(input.width, input.height);
      const rgba = image.data;
      const px = input.pixels;
      const count = input.width * input.height;
      if (input.components === 3) {
        for (let i = 0, j = 0; i < count; i++, j += 3) {
          rgba[i * 4] = px[j];
          rgba[i * 4 + 1] = px[j + 1];
          rgba[i * 4 + 2] = px[j + 2];
          rgba[i * 4 + 3] = 255;
        }
      } else {
        for (let i = 0; i < count; i++) {
          rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = px[i];
          rgba[i * 4 + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
      source = canvas;
    }

    const out = new OffscreenCanvas(target.width, target.height);
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, target.width, target.height);
    if ('close' in source && typeof source.close === 'function') source.close();
    const blob = await out.convertToBlob({ type: 'image/jpeg', quality: target.quality });
    return {
      bytes: new Uint8Array(await blob.arrayBuffer()),
      width: target.width,
      height: target.height,
      components: 3,
    };
  },
};

type Handler<K extends TaskName> = (
  args: TaskMap[K]['args'],
  ctx: { producer?: string; progress: (done: number, total: number) => void },
) => Promise<TaskMap[K]['result']>;

const handlers: { [K in TaskName]: Handler<K> } = {
  merge: async ({ files }, { producer, progress }) =>
    merge(await Promise.all(files.map(toSource)), { producer, onProgress: progress }),
  assemble: async ({ files, pages }, { producer, progress }) =>
    assemble(await Promise.all(files.map(toSource)), pages, { producer, onProgress: progress }),
  split: async ({ file, groups }, { producer, progress }) =>
    split(await toSource(file), groups, { producer, onProgress: progress }),
  deletePages: async ({ file, pages }, { producer }) => deletePages(await toSource(file), pages, { producer }),
  extractPages: async ({ file, pages }, { producer }) => extractPages(await toSource(file), pages, { producer }),
  rotatePages: async ({ file, rotations }) => rotatePages(await toSource(file), rotations),
  pageNumbers: async ({ file, options }) => addPageNumbers(await toSource(file), options),
  watermark: async ({ file, options }) => addWatermark(await toSource(file), options),
  imagesToPdf: async ({ images, options }, { producer, progress }) =>
    imagesToPdf(
      await Promise.all(
        images.map(async (image) => ({ bytes: await toBytes(image.data), type: image.type, rotation: image.rotation })),
      ),
      options,
      { producer, onProgress: progress },
    ),
  pagesFromImages: async ({ pages }, { producer, progress }) =>
    pagesFromImages(
      await Promise.all(
        pages.map(async (page) => ({ jpeg: await toBytes(page.jpeg), width: page.width, height: page.height })),
      ),
      { producer, onProgress: progress },
    ),
  compress: async ({ file, options }, { progress }) =>
    compressPdf(await toSource(file), options, canvasRecoder, progress),
  protect: async ({ file, options }) => protectPdf(await toSource(file), options),
  unlock: async ({ file }) => unlockPdf(await toSource(file)),
  zip: async ({ entries }, { progress }) =>
    zipFiles(
      entries.map((entry) => ({ name: entry.name, read: () => toBytes(entry.data) })),
      progress,
    ),
};

function transferablesOf(value: unknown, list: ArrayBuffer[] = []): ArrayBuffer[] {
  if (value instanceof Uint8Array) {
    if (value.buffer instanceof ArrayBuffer && !list.includes(value.buffer)) list.push(value.buffer);
  } else if (Array.isArray(value)) {
    for (const item of value) transferablesOf(item, list);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) transferablesOf(item, list);
  }
  return list;
}

const post = (message: TaskResponse, transfer: ArrayBuffer[] = []) => self.postMessage(message, { transfer });

self.onmessage = async (event: MessageEvent<TaskRequest>) => {
  const { id, op, args, producer } = event.data;
  const handler = handlers[op] as Handler<TaskName>;
  try {
    const result = await handler(args, {
      producer,
      progress: (done, total) => post({ id, type: 'progress', done, total }),
    });
    post({ id, type: 'result', result }, transferablesOf(result));
  } catch (error) {
    post({ id, type: 'error', error: serializeError(error) });
  }
};
