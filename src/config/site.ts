// 사이트 전역 설정. 값은 모두 빌드 시점 환경변수(.env / 호스팅 대시보드)에서 읽습니다.
// 자세한 설명은 .env.example 과 docs/MONETIZATION.md 를 참고하세요.
const env = import.meta.env;

const clean = (value: string | undefined) => (value ?? '').trim();

export const SITE = {
  url: (clean(env.PUBLIC_SITE_URL) || 'https://pdfmodifier.app').replace(/\/+$/, ''),
  name: clean(env.PUBLIC_SITE_NAME) || 'PDF Modifier',
  contactEmail: clean(env.PUBLIC_CONTACT_EMAIL),
  donationUrl: clean(env.PUBLIC_DONATION_URL),
  adsense: {
    client: clean(env.PUBLIC_ADSENSE_CLIENT),
    slots: {
      tool: clean(env.PUBLIC_ADSENSE_SLOT_TOOL),
      result: clean(env.PUBLIC_ADSENSE_SLOT_RESULT),
      content: clean(env.PUBLIC_ADSENSE_SLOT_CONTENT),
    },
  },
  analytics: {
    cloudflareToken: clean(env.PUBLIC_CF_ANALYTICS_TOKEN),
    gaId: clean(env.PUBLIC_GA_ID),
  },
  verification: {
    google: clean(env.PUBLIC_GOOGLE_SITE_VERIFICATION),
    naver: clean(env.PUBLIC_NAVER_SITE_VERIFICATION),
    bing: clean(env.PUBLIC_BING_SITE_VERIFICATION),
  },
} as const;

export type AdSlotName = keyof typeof SITE.adsense.slots;

/** ads.txt 에 들어갈 게시자 ID (ca-pub-XXXX → pub-XXXX) */
export function adsensePublisherId(): string {
  return SITE.adsense.client.replace(/^ca-/, '');
}
