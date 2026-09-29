import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { fmt } from '../../i18n';
import { looksLikePdf, uid } from '../../lib/files';
import { receiveHandoff } from '../../lib/handoff';
import { openPdfDocument, PasswordNeededError, releaseThumbnails } from '../../lib/pdfjs';
import type { FileSource } from '../../lib/pdf/protocol';
import { describeError, useTool } from './context';

export interface PdfEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'loading' | 'ready' | 'locked' | 'error';
  password?: string;
  /** 잘못된 암호를 입력했는지 */
  wrongPassword?: boolean;
  doc?: PDFDocumentProxy;
  pageCount: number;
  error?: string;
}

export const toFileSource = (entry: PdfEntry): FileSource => ({ data: entry.file, password: entry.password });

export function movedItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, item);
  return next;
}

interface Options {
  multiple: boolean;
  onError: (message: string) => void;
  /** 새 문서가 준비되었을 때 */
  onReady?: (entry: PdfEntry) => void;
}

/**
 * 사용자가 추가한 PDF 파일 목록을 관리합니다.
 * pdf.js 로 열어 페이지 수와 썸네일을 제공하고, 암호가 걸린 파일은 암호 입력 상태로 둡니다.
 */
export function usePdfFiles({ multiple, onError, onReady }: Options) {
  const { errors } = useTool();
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const live = useRef(new Map<string, PdfEntry>());
  const callbacks = useRef({ onError, onReady });
  callbacks.current = { onError, onReady };

  const patch = useCallback((id: string, changes: Partial<PdfEntry>) => {
    const current = live.current.get(id);
    if (!current) return;
    const next = { ...current, ...changes };
    live.current.set(id, next);
    setEntries((list) => list.map((entry) => (entry.id === id ? next : entry)));
  }, []);

  const dispose = (entry: PdfEntry) => {
    live.current.delete(entry.id);
    releaseThumbnails(`${entry.id}:`);
    void entry.doc?.loadingTask.destroy();
  };

  const open = useCallback(
    async (id: string, password?: string) => {
      const entry = live.current.get(id);
      if (!entry) return;
      try {
        const doc = await openPdfDocument(entry.file, password);
        if (!live.current.has(id)) {
          void doc.loadingTask.destroy();
          return;
        }
        patch(id, { status: 'ready', doc, pageCount: doc.numPages, password, wrongPassword: false });
        const ready = live.current.get(id);
        if (ready) callbacks.current.onReady?.(ready);
      } catch (error) {
        if (error instanceof PasswordNeededError) {
          patch(id, { status: 'locked', wrongPassword: password !== undefined });
        } else {
          patch(id, { status: 'error', error: describeError(error, errors) });
          callbacks.current.onError(fmt(errors.fileError, { name: entry.name, message: describeError(error, errors) }));
        }
      }
    },
    [errors, patch],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const accepted: PdfEntry[] = [];
      for (const file of files) {
        if (!(await looksLikePdf(file))) {
          callbacks.current.onError(fmt(errors.notPdf, { name: file.name }));
          continue;
        }
        accepted.push({ id: uid('pdf'), file, name: file.name, size: file.size, status: 'loading', pageCount: 0 });
      }
      if (accepted.length === 0) return;
      const added = multiple ? accepted : accepted.slice(0, 1);
      if (!multiple) {
        for (const entry of live.current.values()) dispose(entry);
      }
      for (const entry of added) live.current.set(entry.id, entry);
      setEntries((list) => (multiple ? [...list, ...added] : added));
      await Promise.all(added.map((entry) => open(entry.id)));
    },
    [errors, multiple, open],
  );

  const unlock = useCallback(
    (id: string, password: string) => {
      patch(id, { status: 'loading' });
      void open(id, password);
    },
    [open, patch],
  );

  const remove = useCallback((id: string) => {
    const entry = live.current.get(id);
    if (entry) dispose(entry);
    setEntries((list) => list.filter((item) => item.id !== id));
  }, []);

  const move = useCallback((from: number, to: number) => {
    setEntries((list) => movedItem(list, from, to));
  }, []);

  const reorder = useCallback((compare: (a: PdfEntry, b: PdfEntry) => number) => {
    setEntries((list) => list.slice().sort(compare));
  }, []);

  const reverse = useCallback(() => setEntries((list) => list.slice().reverse()), []);

  const reset = useCallback(() => {
    for (const entry of live.current.values()) dispose(entry);
    setEntries([]);
  }, []);

  // 다른 도구에서 "이어서 작업하기"로 넘어온 경우 결과 파일을 자동으로 불러옵니다.
  useEffect(() => {
    void receiveHandoff().then((handed) => {
      if (handed.length) void addFiles(handed);
    });
  }, []);

  useEffect(
    () => () => {
      for (const entry of live.current.values()) dispose(entry);
    },
    [],
  );

  return { entries, addFiles, unlock, remove, move, reorder, reverse, reset };
}
