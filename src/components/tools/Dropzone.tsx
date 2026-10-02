import { useRef, useState } from 'preact/hooks';
import { Icon } from './Icon';
import { useTool } from './context';

interface DropzoneProps {
  accept: string;
  multiple: boolean;
  onFiles: (files: File[]) => void;
  /** 버튼 문구 */
  button: string;
  /** 끌어다 놓기 안내 문구 */
  hint: string;
  /** 파일이 이미 있을 때 쓰는 작은 형태 */
  compact?: boolean;
}

export function Dropzone({ accept, multiple, onFiles, button, hint, compact }: DropzoneProps) {
  const { ui } = useTool();
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);

  const emit = (list: FileList | null | undefined) => {
    const files = Array.from(list ?? []);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      class={`dropzone${over ? ' is-over' : ''}${compact ? ' is-compact' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        depth.current++;
        setOver(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        // 페이지 전체 드롭 처리(ToolFrame)와 중복되지 않도록 전파를 막습니다.
        event.stopPropagation();
        depth.current = 0;
        setOver(false);
        emit(event.dataTransfer?.files);
      }}
    >
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(event) => {
          const target = event.currentTarget;
          emit(target.files);
          target.value = '';
        }}
      />
      {!compact && (
        <div class="dropzone-icon">
          <Icon name="upload" size={32} />
        </div>
      )}
      <button
        type="button"
        class={`btn btn-primary${compact ? '' : ' btn-lg'}`}
        onClick={() => input.current?.click()}
      >
        {compact && <Icon name="plus" size={18} />}
        {button}
      </button>
      {!compact && (
        <>
          <p class="dropzone-hint">
            {ui.or} {hint}
          </p>
          <p class="dropzone-promise">
            <Icon name="check" size={16} />
            {ui.startPromise}
          </p>
          <p class="dropzone-privacy">
            <Icon name="shield" size={16} />
            {ui.localOnly}
          </p>
        </>
      )}
    </div>
  );
}
