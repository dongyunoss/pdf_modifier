import { useEffect } from 'preact/hooks';
import type { AdConfig } from './context';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** 결과 화면 등 동적으로 나타나는 위치의 애드센스 광고 단위 */
export function AdUnit({ config, label }: { config: AdConfig; label: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 도구 사용에는 영향이 없어야 합니다.
    }
  }, []);

  return (
    <aside class="ad-slot" aria-label={label}>
      <span class="ad-label">{label}</span>
      <ins
        class="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
