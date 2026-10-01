import { useRef, useState } from 'preact/hooks';
import { fmt } from '../../i18n/format';
import { formatPageRanges, parsePageSelection } from '../../lib/pdf/ranges';
import type { ReadyEntry } from './FileGate';
import { Icon } from './Icon';
import { PageThumb } from './PageThumb';
import { describeError, useTool } from './context';

interface PageSelectGridProps {
  entry: ReadyEntry;
  /** 선택된 페이지 (0부터) */
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
  /** delete: 선택한 페이지를 빨간색으로 표시 */
  variant: 'delete' | 'select';
}

/** 클릭/Shift+클릭/범위 입력으로 페이지를 고르는 격자 */
export function PageSelectGrid({ entry, selected, onChange, variant }: PageSelectGridProps) {
  const { ui, errors } = useTool();
  const anchor = useRef<number | null>(null);
  const [range, setRange] = useState('');
  const [rangeError, setRangeError] = useState<string | null>(null);
  const count = entry.pageCount;
  const all = () => Array.from({ length: count }, (_, i) => i);

  const setSelection = (indices: Iterable<number>) => {
    const next = new Set(indices);
    onChange(next);
    setRange(next.size ? formatPageRanges([...next]) : '');
    setRangeError(null);
  };

  const toggle = (index: number, extend: boolean) => {
    const next = new Set(selected);
    if (extend && anchor.current !== null) {
      const [from, to] = [Math.min(anchor.current, index), Math.max(anchor.current, index)];
      const shouldSelect = !selected.has(index);
      for (let i = from; i <= to; i++) {
        if (shouldSelect) next.add(i);
        else next.delete(i);
      }
    } else if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    anchor.current = index;
    setSelection(next);
  };

  const applyRange = () => {
    if (!range.trim()) {
      setSelection([]);
      return;
    }
    try {
      setSelection(parsePageSelection(range, count));
    } catch (error) {
      setRangeError(describeError(error, errors));
    }
  };

  return (
    <div class="page-select">
      <div class="toolbar" role="toolbar">
        <button type="button" class="btn btn-ghost btn-sm" onClick={() => setSelection(all())}>
          {ui.selectAll}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" onClick={() => setSelection([])}>
          {ui.selectNone}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" onClick={() => setSelection(all().filter((i) => i % 2 === 0))}>
          {ui.odd}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" onClick={() => setSelection(all().filter((i) => i % 2 === 1))}>
          {ui.even}
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          onClick={() => setSelection(all().filter((i) => !selected.has(i)))}
        >
          {ui.invert}
        </button>
        <span class="toolbar-status">{fmt(ui.selectedCount, { n: selected.size })}</span>
      </div>

      <form
        class="range-form"
        onSubmit={(event) => {
          event.preventDefault();
          applyRange();
        }}
      >
        <label class="field-label" for={`range-${entry.id}`}>
          {ui.rangeLabel}
        </label>
        <div class="input-row">
          <input
            id={`range-${entry.id}`}
            class="input"
            value={range}
            placeholder={ui.rangePlaceholder}
            inputMode="numeric"
            onInput={(event) => setRange(event.currentTarget.value)}
            onBlur={applyRange}
          />
          <button type="submit" class="btn btn-secondary">
            {ui.apply}
          </button>
        </div>
        {rangeError && (
          <p class="form-error" role="alert">
            {rangeError}
          </p>
        )}
      </form>

      <div class="page-grid" role="listbox" aria-multiselectable="true" aria-label={ui.pageGridLabel}>
        {Array.from({ length: count }, (_, index) => {
          const isSelected = selected.has(index);
          return (
            <div
              key={index}
              role="option"
              aria-selected={isSelected}
              aria-label={fmt(ui.selectPage, { n: index + 1 })}
              tabIndex={0}
              class={`page-card is-selectable${isSelected ? ` is-selected is-${variant}` : ''}`}
              onClick={(event) => toggle(index, event.shiftKey)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  toggle(index, event.shiftKey);
                }
              }}
            >
              <PageThumb docId={entry.id} doc={entry.doc} page={index + 1} alt="" />
              {isSelected && (
                <span class="page-card-badge" aria-hidden="true">
                  <Icon name={variant === 'delete' ? 'trash' : 'check'} size={16} />
                </span>
              )}
              <span class="page-card-label">{index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
