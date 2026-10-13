// 사이트 전역 설정. 값은 빌드 시점 환경변수(.env / 호스팅 대시보드)에서 읽고, 비어 있으면 pdfmodifier.app 기본값을 씁니다.
// 자세한 설명은 .env.example 과 docs/MONETIZATION.md 를 참고하세요.
const env = import.meta.env;

const clean = (value: string | undefined) => (value ?? '').trim();

export const SITE = {
  url: (clean(env.PUBLIC_SITE_URL) || 'https://pdfmodifier.app').replace(/\/+$/, ''),
  name: clean(env.PUBLIC_SITE_NAME) || 'PDF Modifier',
  contactEmail: clean(env.PUBLIC_CONTACT_EMAIL) || 'contact@pdfmodifier.app',
  donationUrl: clean(env.PUBLIC_DONATION_URL),
  adsense: {
    client: clean(env.PUBLIC_ADSENSE_CLIENT) || 'ca-pub-2663525198080452',
    // 광고 단위 번호는 페이지에 그대로 공개되는 값이라 pdfmodifier.app 의 번호를 기본값으로 코드에 둡니다.
    // 다른 도메인에 배포할 때는 환경 변수로 바꾸세요.
    slots: {
      // 도구 바로 아래
      tool: clean(env.PUBLIC_ADSENSE_SLOT_TOOL) || '7472688457',
      // 작업 완료(다운로드) 화면 — 「이어서 작업하기」 아래
      result: clean(env.PUBLIC_ADSENSE_SLOT_RESULT) || '9128375896',
      // 설명 글 사이 (도구 페이지의 설명과 관련 가이드 사이, 홈, 가이드 글 중간)
      content: clean(env.PUBLIC_ADSENSE_SLOT_CONTENT) || '2562967543',
      // 넓은 PC 화면에서 도구 페이지 오른쪽 빈 공간에 고정되는 세로형 광고 (src/components/SideAd.astro)
      side: clean(env.PUBLIC_ADSENSE_SLOT_SIDE) || '3903969373',
    },
  },
  analytics: {
    cloudflareToken: clean(env.PUBLIC_CF_ANALYTICS_TOKEN),
    gaId: clean(env.PUBLIC_GA_ID),
  },
  verification: {
    google: clean(env.PUBLIC_GOOGLE_SITE_VERIFICATION),
    // pdfmodifier.app 의 네이버 서치어드바이저 소유 확인 값 (공개되는 값이라 코드에 둡니다)
    naver: clean(env.PUBLIC_NAVER_SITE_VERIFICATION) || '43dbab42e30fa1bbbfe19a176bf56bbe90e671b9',
    bing: clean(env.PUBLIC_BING_SITE_VERIFICATION),
  },
} as const;

export type AdSlotName = keyof typeof SITE.adsense.slots;

/** ads.txt 에 들어갈 게시자 ID (ca-pub-XXXX → pub-XXXX) */
export function adsensePublisherId(): string {
  return SITE.adsense.client.replace(/^ca-/, '');
}
