import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'preact/hooks';
import { getThumbnail } from '../../lib/pdfjs';

interface PageThumbProps {
  /** 썸네일 캐시 키에 쓰이는 문서 ID */
  docId: string;
  doc?: PDFDocumentProxy;
  /** 1부터 시작하는 페이지 번호 */
  page: number;
  /** 화면에만 적용하는 추가 회전 (시계 방향) */
  rotation?: number;
  alt: string;
  size?: number;
}

/** 화면에 보일 때만 렌더링되는 페이지 미리보기 */
export function PageThumb({ docId, doc, page, rotation = 0, alt, size = 200 }: PageThumbProps) {
  const box = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const element = box.current;
    if (!doc || !element) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (records) => {
        if (!records.some((record) => record.isIntersecting)) return;
        observer.disconnect();
        getThumbnail(`${docId}:${page}:${size}`, doc, page, size)
          .then((result) => {
            if (!cancelled) setUrl(result);
          })
          .catch((error: unknown) => console.warn('[thumbnail]', error));
      },
      { rootMargin: '400px' },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [doc, docId, page, size]);

  return (
    <div class="thumb" ref={box}>
      {url ? (
        <img
          src={url}
          alt={alt}
          draggable={false}
          style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
        />
      ) : (
        <div class="thumb-skeleton" aria-hidden="true" />
      )}
    </div>
  );
}

/** 빈 페이지 미리보기 */
export function BlankThumb({ width, height, rotation = 0 }: { width: number; height: number; rotation?: number }) {
  // 정사각형 칸의 86% 안에 페이지 비율을 유지하며 맞춥니다.
  const scale = 86 / Math.max(width, height);
  return (
    <div class="thumb">
      <div
        class="thumb-blank"
        style={{
          width: `${width * scale}%`,
          height: `${height * scale}%`,
          transform: rotation ? `rotate(${rotation}deg)` : undefined,
        }}
      />
    </div>
  );
}
