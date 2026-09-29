import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { fmt, type ToolUi } from '../../i18n';
import { baseName, pdfBlob, safeFileName, uid } from '../../lib/files';
import { cancelAllTasks, runTask } from '../../lib/pdf/client';
import { PAGE_SIZES } from '../../lib/pdf/constants';
import type { PageSpec } from '../../lib/pdf/ops';
import { Busy } from './Busy';
import { Dropzone } from './Dropzone';
import { PDF_ACCEPT } from './FileGate';
import { Icon } from './Icon';
import { BlankThumb, PageThumb } from './PageThumb';
import { PasswordPrompt } from './PasswordPrompt';
import { ResultPanel, type ResultFile } from './ResultPanel';
import { ToolFrame, withToolRoot } from './ToolRoot';
import { describeError, isCancelled, useTool } from './context';
import { movedItem, toFileSource, usePdfFiles, type PdfEntry } from './usePdfFiles';
import { useSortable } from './useSortable';

interface PageItem {
  key: string;
  /** 원본 파일 ID (빈 페이지는 '') */
  src: string;
  /** 원본 파일 안의 페이지 인덱스 (0부터) */
  page: number;
  /** 사용자가 추가한 회전 (시계 방향) */
  rotation: number;
  blank?: { width: number; height: number };
}

const HISTORY_LIMIT = 100;
const normalize = (angle: number) => ((angle % 360) + 360) % 360;

function OrganizeTool({ t }: { t: ToolUi<'organize'> }) {
  const { ui, errors } = useTool();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ResultFile[] | null>(null);
  const [items, setItemsState] = useState<PageItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const history = useRef<{ past: PageItem[][]; future: PageItem[][] }>({ past: [], future: [] });
  const [, forceRender] = useState(0);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const anchor = useRef<number | null>(null);

  /** 변경 사항을 적용하면서 실행 취소 기록을 남깁니다. */
  const commit = useCallback((next: PageItem[] | ((current: PageItem[]) => PageItem[])) => {
    const current = itemsRef.current;
    const value = typeof next === 'function' ? next(current) : next;
    if (value === current) return;
    history.current.past = [...history.current.past.slice(-HISTORY_LIMIT + 1), current];
    history.current.future = [];
    itemsRef.current = value;
    setItemsState(value);
  }, []);

  const undo = useCallback(() => {
    const { past, future } = history.current;
    const previous = past.pop();
    if (!previous) return;
    future.push(itemsRef.current);
    itemsRef.current = previous;
    setItemsState(previous);
    forceRender((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    const { past, future } = history.current;
    const next = future.pop();
    if (!next) return;
    past.push(itemsRef.current);
    itemsRef.current = next;
    setItemsState(next);
    forceRender((n) => n + 1);
  }, []);

  const files = usePdfFiles({
    multiple: true,
    onError: setError,
    onReady: (entry) => {
      const added = Array.from({ length: entry.pageCount }, (_, page) => ({
        key: uid('pg'),
        src: entry.id,
        page,
        rotation: 0,
      }));
      if (itemsRef.current.length === 0) {
        // 첫 파일을 불러오는 것은 실행 취소 대상이 아닙니다.
        itemsRef.current = added;
        setItemsState(added);
      } else {
        commit((current) => [...current, ...added]);
      }
    },
  });

  const entryById = useMemo(() => new Map(files.entries.map((entry) => [entry.id, entry])), [files.entries]);
  const colorOf = useMemo(() => new Map(files.entries.map((entry, i) => [entry.id, i % 6])), [files.entries]);
  const multiFile = files.entries.length > 1;
  const sortable = useSortable({
    count: items.length,
    onMove: (from, to) => commit((current) => movedItem(current, from, to)),
  });

  // 존재하지 않는 항목은 선택에서 제거
  useEffect(() => {
    setSelected((current) => {
      const keys = new Set(items.map((item) => item.key));
      const next = new Set([...current].filter((key) => keys.has(key)));
      return next.size === current.size ? current : next;
    });
  }, [items]);

  // Ctrl/⌘+Z 실행 취소, Ctrl/⌘+Shift+Z 또는 Ctrl+Y 다시 실행
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea')) return;
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (mod && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const rotate = (keys: Set<string>, delta: number) =>
    commit((current) => current.map((item) => (keys.has(item.key) ? { ...item, rotation: normalize(item.rotation + delta) } : item)));

  const removeKeys = (keys: Set<string>) => commit((current) => current.filter((item) => !keys.has(item.key)));

  const duplicate = (key: string) =>
    commit((current) => {
      const index = current.findIndex((item) => item.key === key);
      if (index < 0) return current;
      const next = current.slice();
      next.splice(index + 1, 0, { ...current[index], key: uid('pg') });
      return next;
    });

  const blankSizeNear = async (index: number): Promise<{ width: number; height: number }> => {
    const reference = items[index];
    if (reference?.blank) return reference.blank;
    const entry = reference ? entryById.get(reference.src) : undefined;
    if (reference && entry?.doc) {
      const page = await entry.doc.getPage(reference.page + 1);
      const viewport = page.getViewport({ scale: 1, rotation: normalize(page.rotate + reference.rotation) });
      return { width: Math.round(viewport.width), height: Math.round(viewport.height) };
    }
    const [width, height] = PAGE_SIZES.a4;
    return { width, height };
  };

  const insertBlank = async () => {
    const indices = items.map((item, i) => (selected.has(item.key) ? i : -1)).filter((i) => i >= 0);
    const after = indices.length ? Math.max(...indices) : items.length - 1;
    const blank = await blankSizeNear(after);
    commit((current) => {
      const next = current.slice();
      next.splice(after + 1, 0, { key: uid('blank'), src: '', page: 0, rotation: 0, blank });
      return next;
    });
  };

  const toggle = (index: number, extend: boolean) => {
    const item = items[index];
    const next = new Set(selected);
    if (extend && anchor.current !== null) {
      const [from, to] = [Math.min(anchor.current, index), Math.max(anchor.current, index)];
      for (let i = from; i <= to; i++) next.add(items[i].key);
    } else if (next.has(item.key)) {
      next.delete(item.key);
    } else {
      next.add(item.key);
    }
    anchor.current = index;
    setSelected(next);
  };

  const save = async () => {
    setError(null);
    const used = files.entries.filter((entry) => entry.status === 'ready');
    const indexOf = new Map(used.map((entry, i) => [entry.id, i]));
    const specs: PageSpec[] = items.map((item) =>
      item.blank
        ? { blank: true, width: item.blank.width, height: item.blank.height }
        : { src: indexOf.get(item.src) ?? -1, page: item.page, rotate: item.rotation },
    );
    if (specs.some((spec) => 'src' in spec && spec.src < 0)) return;
    setBusy(true);
    try {
      const bytes = await runTask('assemble', { files: used.map(toFileSource), pages: specs });
      const first = used[0]?.name ?? 'document.pdf';
      setResult([{ name: `${safeFileName(baseName(first))}_edited.pdf`, blob: pdfBlob(bytes) }]);
    } catch (err) {
      if (!isCancelled(err)) setError(describeError(err, errors));
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    files.reset();
    history.current = { past: [], future: [] };
    itemsRef.current = [];
    setItemsState([]);
    setSelected(new Set());
  };

  const pending = files.entries.filter((entry) => entry.status === 'loading');
  const locked = files.entries.filter((entry): entry is PdfEntry => entry.status === 'locked');
  const canUndo = history.current.past.length > 0;
  const canRedo = history.current.future.length > 0;

  let body;
  if (result) {
    body = <ResultPanel files={result} onReset={reset} />;
  } else if (busy) {
    body = <Busy message={ui.processing} onCancel={cancelAllTasks} />;
  } else if (files.entries.length === 0) {
    body = (
      <Dropzone accept={PDF_ACCEPT} multiple onFiles={files.addFiles} button={ui.choosePdfs} hint={ui.dropPdfs} />
    );
  } else {
    body = (
      <div class="workspace">
        {locked.map((entry) => (
          <PasswordPrompt
            key={entry.id}
            entry={entry}
            onSubmit={(password) => files.unlock(entry.id, password)}
            onSkip={() => files.remove(entry.id)}
          />
        ))}

        <div class="toolbar toolbar-sticky" role="toolbar">
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick={undo}
            disabled={!canUndo}
            title={`${t.undo} (Ctrl+Z)`}
            aria-label={t.undo}
          >
            <Icon name="undo" size={16} />
            <span class="btn-label">{t.undo}</span>
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick={redo}
            disabled={!canRedo}
            title={`${t.redo} (Ctrl+Shift+Z)`}
            aria-label={t.redo}
          >
            <Icon name="redo" size={16} />
            <span class="btn-label">{t.redo}</span>
          </button>
          <span class="toolbar-sep" aria-hidden="true" />
          <button type="button" class="btn btn-ghost btn-sm" onClick={() => rotate(selected, 90)} disabled={!selected.size}>
            <Icon name="rotate-cw" size={16} />
            {t.rotateSelected}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onClick={() => removeKeys(selected)} disabled={!selected.size}>
            <Icon name="trash" size={16} />
            {t.deleteSelected}
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onClick={insertBlank}>
            <Icon name="file-plus" size={16} />
            {t.insertBlank}
          </button>
          <span class="toolbar-status">
            {selected.size > 0
              ? fmt(ui.selectedCount, { n: selected.size })
              : fmt(ui.totalPages, { n: items.length })}
          </span>
        </div>

        <p class="field-hint">{t.hint}</p>

        {items.length === 0 && pending.length === 0 ? (
          <p class="empty-note">{t.emptyPages}</p>
        ) : (
          <div
            class="page-grid"
            role="listbox"
            aria-multiselectable="true"
            aria-label={ui.pageGridLabel}
            onKeyDown={(event) => {
              if ((event.key === 'Delete' || event.key === 'Backspace') && selected.size) {
                event.preventDefault();
                removeKeys(selected);
              }
            }}
          >
            {items.map((item, index) => {
              const entry = entryById.get(item.src);
              const isSelected = selected.has(item.key);
              return (
                <div
                  key={item.key}
                  ref={sortable.itemRef(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={fmt(ui.pageLabel, { n: index + 1 })}
                  tabIndex={0}
                  class={`page-card is-sortable is-selectable${isSelected ? ' is-selected is-select' : ''} ${sortable.classFor(index)}`}
                  onPointerDown={sortable.onPointerDown(index)}
                  onClick={(event) => toggle(index, event.shiftKey)}
                  onKeyDown={(event) => {
                    // 카드 안의 버튼에서 누른 키는 버튼이 처리합니다.
                    if (event.target !== event.currentTarget) return;
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault();
                      toggle(index, event.shiftKey);
                    } else if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowUp') && index > 0) {
                      event.preventDefault();
                      commit((current) => movedItem(current, index, index - 1));
                    } else if (
                      event.altKey &&
                      (event.key === 'ArrowRight' || event.key === 'ArrowDown') &&
                      index < items.length - 1
                    ) {
                      event.preventDefault();
                      commit((current) => movedItem(current, index, index + 1));
                    }
                  }}
                >
                  {item.blank ? (
                    <BlankThumb width={item.blank.width} height={item.blank.height} rotation={item.rotation} />
                  ) : (
                    <PageThumb docId={item.src} doc={entry?.doc} page={item.page + 1} rotation={item.rotation} alt="" />
                  )}
                  {isSelected && (
                    <span class="page-card-badge" aria-hidden="true">
                      <Icon name="check" size={16} />
                    </span>
                  )}
                  <span class="page-card-label">
                    {multiFile && !item.blank && (
                      <span class="file-dot" data-color={colorOf.get(item.src)} title={entry?.name} />
                    )}
                    {item.blank ? ui.blankPage : index + 1}
                  </span>
                  {/* 버튼 클릭이 카드 선택으로 이어지지 않도록 막습니다. */}
                  <div class="page-card-actions" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label={ui.rotateLeft}
                      title={ui.rotateLeft}
                      onClick={() => rotate(new Set([item.key]), -90)}
                    >
                      <Icon name="rotate-ccw" size={16} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label={ui.rotateRight}
                      title={ui.rotateRight}
                      onClick={() => rotate(new Set([item.key]), 90)}
                    >
                      <Icon name="rotate-cw" size={16} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label={ui.duplicate}
                      title={ui.duplicate}
                      onClick={() => duplicate(item.key)}
                    >
                      <Icon name="copy" size={16} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn icon-btn-danger"
                      aria-label={ui.delete}
                      title={ui.delete}
                      onClick={() => removeKeys(new Set([item.key]))}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                  <span
                    class="drag-handle page-card-handle"
                    data-drag-handle
                    aria-hidden="true"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Icon name="grip" size={16} />
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {pending.length > 0 && <p class="field-hint">{ui.loading}</p>}

        <Dropzone accept={PDF_ACCEPT} multiple compact onFiles={files.addFiles} button={t.addFiles} hint={ui.dropPdfs} />

        <div class="action-bar">
          <button
            type="button"
            class="btn btn-primary btn-lg"
            disabled={items.length === 0 || pending.length > 0}
            onClick={save}
          >
            <Icon name="download" size={20} />
            {t.action}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToolFrame error={error} onDismissError={() => setError(null)} onDropFiles={result || busy ? undefined : files.addFiles}>
      {body}
    </ToolFrame>
  );
}

export default withToolRoot(OrganizeTool);
