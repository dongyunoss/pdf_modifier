// 메인 스레드에서 PDF 워커에 작업을 요청하는 클라이언트
import { SITE } from '../../config/site';
import type { PdfErrorCode, SerializedError } from './errors';
import type { TaskMap, TaskName, TaskRequest, TaskResponse } from './protocol';

export class TaskError extends Error {
  readonly code: PdfErrorCode | 'CANCELLED' | 'WORKER_CRASHED';
  readonly fileIndex?: number;

  constructor(error: SerializedError | { code: 'CANCELLED' | 'WORKER_CRASHED'; message: string; fileIndex?: number }) {
    super(error.message);
    this.name = 'TaskError';
    this.code = error.code;
    this.fileIndex = error.fileIndex;
  }
}

interface Pending {
  resolve: (value: unknown) => void;
  reject: (error: TaskError) => void;
  onProgress?: (done: number, total: number) => void;
}

const producer = SITE.url.includes('example.com') ? SITE.name : `${SITE.name} (${SITE.url})`;
const pending = new Map<number, Pending>();
let worker: Worker | null = null;
let sequence = 0;

function rejectAll(code: 'CANCELLED' | 'WORKER_CRASHED', message: string) {
  for (const [, task] of pending) task.reject(new TaskError({ code, message }));
  pending.clear();
}

function getWorker(): Worker {
  if (worker) return worker;
  const instance = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module', name: 'pdf-worker' });
  instance.onmessage = (event: MessageEvent<TaskResponse>) => {
    const message = event.data;
    const task = pending.get(message.id);
    if (!task) return;
    if (message.type === 'progress') {
      task.onProgress?.(message.done, message.total);
      return;
    }
    pending.delete(message.id);
    if (message.type === 'result') task.resolve(message.result);
    else task.reject(new TaskError(message.error));
  };
  instance.onerror = (event) => {
    event.preventDefault();
    instance.terminate();
    if (worker === instance) worker = null;
    // 메모리 부족 등으로 워커가 죽은 경우
    rejectAll('WORKER_CRASHED', event.message || 'worker crashed');
  };
  worker = instance;
  return instance;
}

export interface RunOptions {
  onProgress?: (done: number, total: number) => void;
}

/** 워커에서 PDF 작업을 실행합니다. */
export function runTask<K extends TaskName>(
  op: K,
  args: TaskMap[K]['args'],
  options: RunOptions = {},
): Promise<TaskMap[K]['result']> {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve: resolve as (value: unknown) => void, reject, onProgress: options.onProgress });
    const request: TaskRequest<K> = { id, op, args, producer };
    try {
      getWorker().postMessage(request);
    } catch (error) {
      pending.delete(id);
      reject(new TaskError({ code: 'UNKNOWN', message: error instanceof Error ? error.message : String(error) }));
    }
  });
}

/** 진행 중인 모든 작업을 취소합니다 (워커를 종료하고 다음 작업 때 새로 만듭니다). */
export function cancelAllTasks(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  rejectAll('CANCELLED', 'cancelled');
}
