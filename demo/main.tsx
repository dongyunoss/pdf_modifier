// 체험판: 13개 도구를 한 페이지에서 바꿔 가며 써 볼 수 있는 단일 페이지 버전.
// 실제 사이트와 같은 도구 컴포넌트를 그대로 사용합니다. (npm run build:demo)
import { render, type JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import CompressTool from '../src/components/tools/CompressTool';
import { Icon } from '../src/components/tools/Icon';
import ImagesToPdfTool from '../src/components/tools/ImagesToPdfTool';
import MergeTool from '../src/components/tools/MergeTool';
import OrganizeTool from '../src/components/tools/OrganizeTool';
import PageNumbersTool from '../src/components/tools/PageNumbersTool';
import PageSelectTool from '../src/components/tools/PageSelectTool';
import PdfToImagesTool from '../src/components/tools/PdfToImagesTool';
import ProtectTool from '../src/components/tools/ProtectTool';
import RotateTool from '../src/components/tools/RotateTool';
import SplitTool from '../src/components/tools/SplitTool';
import UnlockTool from '../src/components/tools/UnlockTool';
import WatermarkTool from '../src/components/tools/WatermarkTool';
import type { ToolBaseProps } from '../src/components/tools/context';
import { ko } from '../src/i18n/ko';
import { configureFileActions } from '../src/lib/files';
import { handOffInPage } from '../src/lib/handoff';
import '../src/styles/global.css';
import { getTool, TOOLS, type ToolId } from '../src/tools/registry';
import './demo.css';
import './pdfjs-assets';
import { getSamples } from './sample';

interface DownloadsCapability {
  save(request: { filename: string; data: Blob }): Promise<unknown>;
}

declare global {
  interface Window {
    claude?: { use(name: 'downloads'): Promise<DownloadsCapability | null> };
  }
}

// 체험판은 한국어만 씁니다 (다른 언어 사전을 번들에 넣지 않도록 직접 불러옴).
const dict = ko;

// claude.ai 아티팩트 뷰어에서는 다운로드 링크와 새 창이 막혀 있으므로 뷰어의 저장 기능을 사용합니다.
if (window.claude) {
  const viewer = window.claude;
  configureFileActions({
    preview: null,
    save: async (blob, filename) => {
      const downloads = await viewer.use('downloads');
      if (!downloads) throw new Error('이 화면에서는 파일을 저장할 수 없습니다.');
      try {
        await downloads.save({ filename, data: blob });
      } catch (error) {
        const code = (error as { code?: string } | null)?.code;
        if (code === 'declined') return;
        throw new Error((error as { message?: string } | null)?.message ?? '파일을 저장하지 못했습니다.');
      }
    },
  });
}

const toolBySlug = (slug: string) => TOOLS.find((tool) => tool.slug === slug);

function renderTool(id: ToolId, base: ToolBaseProps): JSX.Element {
  const t = dict.tools;
  switch (id) {
    case 'merge':
      return <MergeTool {...base} t={t.merge.ui} />;
    case 'split':
      return <SplitTool {...base} t={t.split.ui} />;
    case 'organize':
      return <OrganizeTool {...base} t={t.organize.ui} />;
    case 'rotate':
      return <RotateTool {...base} t={t.rotate.ui} />;
    case 'delete-pages':
      return <PageSelectTool {...base} mode="delete" t={t['delete-pages'].ui} />;
    case 'extract-pages':
      return <PageSelectTool {...base} mode="extract" t={t['extract-pages'].ui} />;
    case 'compress':
      return <CompressTool {...base} t={t.compress.ui} />;
    case 'jpg-to-pdf':
      return <ImagesToPdfTool {...base} t={t['jpg-to-pdf'].ui} />;
    case 'pdf-to-jpg':
      return <PdfToImagesTool {...base} t={t['pdf-to-jpg'].ui} />;
    case 'watermark':
      return <WatermarkTool {...base} t={t.watermark.ui} />;
    case 'page-numbers':
      return <PageNumbersTool {...base} t={t['page-numbers'].ui} />;
    case 'protect':
      return <ProtectTool {...base} t={t.protect.ui} />;
    case 'unlock':
      return <UnlockTool {...base} t={t.unlock.ui} />;
  }
}

function initialTool(): ToolId {
  const fromHash = toolBySlug(window.location.hash.slice(1));
  return fromHash?.id ?? 'organize';
}

function Demo() {
  const [toolId, setToolId] = useState<ToolId>(initialTool);
  const [mountKey, setMountKey] = useState(0);
  const [preparing, setPreparing] = useState(true);
  const toolTop = useRef<HTMLDivElement>(null);
  const tool = getTool(toolId);
  const content = dict.tools[toolId];

  /** 도구를 열면서 샘플 문서를 넣어 줍니다 (합치기는 두 개). */
  const openWithSample = async (id: ToolId) => {
    if (id !== 'jpg-to-pdf') {
      setPreparing(true);
      try {
        const { report, appendix } = await getSamples();
        handOffInPage(id === 'merge' ? [report, appendix] : [report]);
      } catch {
        // 샘플을 만들지 못해도 파일을 직접 올려 쓸 수 있습니다.
      }
    }
    setPreparing(false);
    setToolId(id);
    setMountKey((key) => key + 1);
  };

  const select = (id: ToolId) => {
    if (id === toolId && !preparing) return;
    history.replaceState(null, '', `#${getTool(id).slug}`);
    void openWithSample(id);
    toolTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    void openWithSample(toolId);
  }, []);

  const base: ToolBaseProps = {
    lang: 'ko',
    ui: dict.ui,
    errors: dict.errors,
    resultAd: null,
    related: tool.related.map((relatedId) => ({
      href: `#${getTool(relatedId).slug}`,
      name: dict.tools[relatedId].name,
      acceptsPdf: relatedId !== 'jpg-to-pdf',
    })),
    // "이어서 작업하기": 결과 PDF 를 가지고 다른 도구로 전환 (넘길 파일이 없으면 샘플 문서로 시작)
    navigate: (href, files) => {
      const next = toolBySlug(href.replace(/^#/, ''));
      if (!next) return;
      history.replaceState(null, '', `#${next.slug}`);
      toolTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!files.length) {
        void openWithSample(next.id);
        return;
      }
      handOffInPage(files);
      setToolId(next.id);
      setMountKey((key) => key + 1);
    },
  };

  return (
    <div class="demo container">
      <header class="demo-bar">
        <div class="demo-brand">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path d="M10 8h8l5 5v11a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" />
              <path d="M18 8v5h5" fill="none" stroke="currentColor" stroke-width="1.6" />
              <path d="M11.5 18.5h9M11.5 21.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </span>
          <strong>PDF Modifier</strong>
          <span class="demo-badge">체험판</span>
        </div>
        <p class="demo-note">
          <Icon name="shield" size={16} />
          실제 사이트와 같은 코드로 동작합니다. 파일은 이 브라우저 안에서만 처리되며 어디에도 전송되지 않습니다.
        </p>
      </header>

      <nav class="demo-tools" aria-label="도구 선택">
        {TOOLS.map((item) => (
          <button
            key={item.id}
            type="button"
            class={`demo-chip${item.id === toolId ? ' is-active' : ''}`}
            data-category={item.category}
            aria-pressed={item.id === toolId}
            onClick={() => select(item.id)}
          >
            <Icon name={item.id} size={18} />
            {dict.tools[item.id].name}
          </button>
        ))}
      </nav>

      <div class="demo-tool" ref={toolTop}>
        <header class="tool-header" data-category={tool.category}>
          <span class="tool-header-icon">
            <Icon name={toolId} size={28} />
          </span>
          <div>
            <h1>{content.name}</h1>
            <p class="tool-tagline">{content.tagline}</p>
            {toolId !== 'jpg-to-pdf' && (
              <p class="demo-sample-note">
                샘플 문서가 미리 들어 있습니다. 내 PDF를 화면에 끌어다 놓거나 파일 선택 버튼으로 올려서 써 볼 수도 있습니다.
              </p>
            )}
          </div>
        </header>
        <section class="tool-area" aria-label={content.name}>
          {preparing ? (
            <div class="tool">
              <div class="busy" role="status">
                <div class="spinner" aria-hidden="true" />
                <p class="busy-message">샘플 문서를 준비하는 중…</p>
              </div>
            </div>
          ) : (
            <div key={mountKey}>{renderTool(toolId, base)}</div>
          )}
        </section>
      </div>

      <footer class="demo-footer">
        <p>
          결과 파일은 <strong>다운로드</strong> 버튼으로 저장할 수 있습니다. 실제 서비스에서는 도구마다 검색에 노출되는 별도 페이지(사용법·FAQ
          포함)와 광고 자리가 함께 제공됩니다.
        </p>
      </footer>
    </div>
  );
}

render(<Demo />, document.getElementById('app')!);
