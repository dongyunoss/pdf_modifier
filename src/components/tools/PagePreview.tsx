import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getThumbnail } from '../../lib/pdfjs';
import type { ReadyEntry } from './FileGate';

export interface PageSize {
  width: number;
  height: number;
}

interface PagePreviewProps {
  entry: ReadyEntry;
  /** 페이지 크기(pt)를 알게 된 뒤 오버레이를 그립니다. */
  children: (size: PageSize) => ComponentChildren;
  label: string;
}

/** 첫 페이지 미리보기 위에 워터마크/페이지 번호 오버레이를 겹쳐 보여줍니다. */
export function PagePreview({ entry, children, label }: PagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [size, setSize] = useState<PageSize | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const page = await entry.doc.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      page.cleanup();
      if (!cancelled) setSize({ width: viewport.width, height: viewport.height });
      const thumb = await getThumbnail(`${entry.id}:1:520`, entry.doc, 1, 520);
      if (!cancelled) setUrl(thumb);
    })().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [entry]);

  return (
    <figure class="preview">
      <figcaption class="field-label">{label}</figcaption>
      <div
        class="preview-page"
        style={size ? { aspectRatio: `${size.width} / ${size.height}` } : undefined}
        aria-hidden="true"
      >
        {url ? <img src={url} alt="" draggable={false} /> : <div class="thumb-skeleton" />}
        {size && <div class="preview-overlay">{children(size)}</div>}
      </div>
    </figure>
  );
}
