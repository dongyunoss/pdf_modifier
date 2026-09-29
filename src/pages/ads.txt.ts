import type { APIRoute } from 'astro';
import { adsensePublisherId, SITE } from '../config/site';

// 애드센스 게시자 ID 가 설정되면 ads.txt 를 자동으로 만듭니다. (애드센스 수익 보호에 필요)
export const GET: APIRoute = () => {
  const body = SITE.adsense.client
    ? `google.com, ${adsensePublisherId()}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense publisher ID is not configured (set PUBLIC_ADSENSE_CLIENT)\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
