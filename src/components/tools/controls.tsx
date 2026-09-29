import type { ComponentChildren } from 'preact';
import { useId } from 'preact/hooks';

export interface Choice<T> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: Array<Choice<T>>;
  onChange: (value: T) => void;
  /** 설명이 있는 카드형 선택지 */
  cards?: boolean;
}

export function Segmented<T extends string | number>({ label, value, options, onChange, cards }: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset class="field">
      <legend class="field-label">{label}</legend>
      <div class={cards ? 'choice-cards' : 'segmented'}>
        {options.map((option) => (
          <label key={String(option.value)} class={`choice${option.value === value ? ' is-active' : ''}`}>
            <input
              type="radio"
              name={name}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span class="choice-label">{option.label}</span>
            {option.description && <small class="choice-desc">{option.description}</small>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  display?: (value: number) => string;
}

export function Slider({ label, value, min, max, step = 1, onChange, display }: SliderProps) {
  const id = useId();
  return (
    <div class="field">
      <label class="field-label field-label-row" for={id}>
        <span>{label}</span>
        <output for={id}>{display ? display(value) : value}</output>
      </label>
      <input
        id={id}
        type="range"
        class="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
      />
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function Checkbox({ label, checked, onChange, description }: CheckboxProps) {
  return (
    <label class="checkbox">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
      <span>
        <span class="checkbox-label">{label}</span>
        {description && <small class="checkbox-desc">{description}</small>}
      </span>
    </label>
  );
}

interface FieldProps {
  label: string;
  children: ComponentChildren;
  hint?: string;
  error?: string | null;
  htmlFor?: string;
}

export function Field({ label, children, hint, error, htmlFor }: FieldProps) {
  return (
    <div class="field">
      <label class="field-label" for={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p class="form-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p class="field-hint">{hint}</p>
      )}
    </div>
  );
}

/** 옵션 패널과 주 실행 버튼을 담는 영역 */
export function ActionBar({ children }: { children: ComponentChildren }) {
  return <div class="action-bar">{children}</div>;
}
