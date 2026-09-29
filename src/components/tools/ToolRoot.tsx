import type { ComponentChildren, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { Icon } from './Icon';
import { ToolContext, useTool, type ToolBaseProps } from './context';

/**
 * Astro 에서 hydrate 되는 도구 컴포넌트를 감쌉니다.
 * 공통 props(문구, 언어, 광고 설정)를 컨텍스트로 제공하고 나머지 props 는 내부 컴포넌트로 전달합니다.
 */
export function withToolRoot<T extends object>(Inner: FunctionComponent<T>) {
  function ToolRoot(props: ToolBaseProps & T) {
    const { lang, ui, errors, related, resultAd, ...rest } = props;
    return (
      <ToolContext.Provider value={{ lang, ui, errors, related, resultAd }}>
        <Inner {...(rest as unknown as T)} />
      </ToolContext.Provider>
    );
  }
  ToolRoot.displayName = `ToolRoot(${Inner.displayName ?? Inner.name ?? 'Tool'})`;
  return ToolRoot;
}

interface ToolFrameProps {
  children: ComponentChildren;
  error: string | null;
  onDismissError: () => void;
  /** 페이지 아무 곳에나 파일을 떨어뜨렸을 때 */
  onDropFiles?: (files: File[]) => void;
}

export function ToolFrame({ children, error, onDismissError, onDropFiles }: ToolFrameProps) {
  const { ui } = useTool();
  const dropHandler = useRef(onDropFiles);
  dropHandler.current = onDropFiles;

  useEffect(() => {
    const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');
    const onOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      // 브라우저가 파일을 열어 작업 중인 페이지를 떠나지 않도록 막습니다.
      event.preventDefault();
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length && dropHandler.current) dropHandler.current(files);
    };
    window.addEventListener('dragover', onOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  return (
    <div class="tool">
      {error && (
        <div class="alert alert-error" role="alert">
          <Icon name="alert" size={18} />
          <span>{error}</span>
          <button type="button" class="icon-btn" aria-label={ui.cancel} onClick={onDismissError}>
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
