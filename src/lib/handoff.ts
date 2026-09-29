// 한 도구의 결과 PDF 를 다른 도구로 바로 넘기기 위한 임시 저장소 (IndexedDB, 브라우저 안에만 저장)
const DB_NAME = 'pdf-tools-handoff';
const STORE = 'files';
const KEY = 'latest';
/** 오래된 결과는 무시 (다른 날 방문 시 엉뚱한 파일이 열리지 않도록) */
const MAX_AGE_MS = 10 * 60 * 1000;

interface HandoffRecord {
  name: string;
  blob: Blob;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function saveHandoff(name: string, blob: Blob): Promise<boolean> {
  try {
    await run('readwrite', (store) => store.put({ name, blob, createdAt: Date.now() } satisfies HandoffRecord, KEY));
    return true;
  } catch {
    return false;
  }
}

/** 넘겨받은 파일을 꺼내고 저장소에서 지웁니다. */
async function takeHandoff(): Promise<File | null> {
  try {
    const record = await run<HandoffRecord | undefined>('readonly', (store) => store.get(KEY));
    await run('readwrite', (store) => store.delete(KEY));
    if (!record || Date.now() - record.createdAt > MAX_AGE_MS) return null;
    return new File([record.blob], record.name, { type: 'application/pdf' });
  } catch {
    return null;
  }
}

export const HANDOFF_PARAM = 'from';
export const HANDOFF_VALUE = 'previous';

let inPageFiles: File[] | null = null;

/** 페이지 이동 없이 도구를 바꿔 끼우는 화면(체험판 등)에서 다음 도구로 파일을 넘깁니다. */
export function handOffInPage(files: File[]) {
  inPageFiles = files;
}

/**
 * 이 도구로 넘어온 파일이 있으면 꺼냅니다.
 * 같은 페이지 안에서 넘긴 파일, 또는 `?from=previous` 로 넘어온 이전 도구의 결과(IndexedDB) 순으로 확인합니다.
 */
export async function receiveHandoff(): Promise<File[]> {
  if (inPageFiles) {
    const files = inPageFiles;
    inPageFiles = null;
    return files;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get(HANDOFF_PARAM) !== HANDOFF_VALUE) return [];
  params.delete(HANDOFF_PARAM);
  const query = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  const file = await takeHandoff();
  return file ? [file] : [];
}
