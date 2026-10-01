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

type ProgressListener = (done: number, total: number) => void;

const producer = SITE.url.includes('example.com') ? SITE.name : `${SITE.name} (${SITE.url})`;
const pending = new Map<number, Pending>();
const progressListeners = new Set<ProgressListener>();
let worker: Worker | null = null;
let sequence = 0;
/** cancelAllTasks 를 부를 때마다 1씩 늘어납니다 (기다리는 중에 취소되었는지 확인용). */
let cancelEpoch = 0;

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
      for (const listener of progressListeners) listener(message.done, message.total);
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
  cancelEpoch++;
  if (worker) {
    worker.terminate();
    worker = null;
  }
  rejectAll('CANCELLED', 'cancelled');
}

/**
 * 실행 중인 작업이 알려 주는 진행 상황(끝난 단계 수, 전체 단계 수)을 받습니다.
 * 처리 화면이 도구마다 따로 연결하지 않아도 진행률을 보여 줄 수 있게 합니다. 해제 함수를 돌려줍니다.
 */
export function onTaskProgress(listener: ProgressListener): () => void {
  progressListeners.add(listener);
  return () => {
    progressListeners.delete(listener);
  };
}

/** 처리 화면을 최소한 이만큼은 보여 줍니다. */
export const MIN_BUSY_MS = 800;

export interface BusyStart {
  at: number;
  epoch: number;
}

/** 처리를 시작할 때 부릅니다. 시작 시각과, 그 뒤에 취소되었는지 확인할 정보를 돌려줍니다. */
export const startBusy = (): BusyStart => ({ at: performance.now(), epoch: cancelEpoch });

/** start 이후에 취소 버튼을 눌렀다면 CANCELLED 오류를 던집니다. */
export function throwIfCancelled(start: BusyStart): void {
  if (start.epoch !== cancelEpoch) throw new TaskError({ code: 'CANCELLED', message: 'cancelled' });
}

/**
 * 작업이 아주 빨리 끝나도 처리 화면이 깜빡이듯 지나가지 않도록, 시작 후 minMs 가 지날 때까지 기다립니다.
 * 그사이(또는 시작 후 언제든) 취소 버튼을 눌렀다면 결과를 보여 주지 않도록 CANCELLED 오류를 던집니다.
 */
export async function minBusyTime(start: BusyStart, minMs = MIN_BUSY_MS): Promise<void> {
  const wait = start.at + minMs - performance.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  throwIfCancelled(start);
}
