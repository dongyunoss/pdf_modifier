// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { CONTENT_UPDATED } from './src/config/content.ts';
import { DEFAULT_LANG, LANGS, LANGUAGES } from './src/i18n/languages.ts';

// .env 파일과 호스팅 플랫폼(Cloudflare Pages 등)의 환경변수를 모두 읽습니다.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = (env.PUBLIC_SITE_URL || 'https://pdfmodifier.app').replace(/\/+$/, '');

export default defineConfig({
  site,
  // 정적 호스팅(서버 비용 0원)을 위해 모든 페이지를 빌드 시점에 HTML로 생성합니다.
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    preact(),
    sitemap({
      // 사이트맵에도 언어별 주소(hreflang)를 넣습니다. 키: 주소 접두사, 값: hreflang
      i18n: {
        defaultLocale: DEFAULT_LANG,
        locales: Object.fromEntries(LANGS.map((code) => [code, LANGUAGES[code].htmlLang])),
      },
      filter: (page) => !/\/404\/?$/.test(page),
      // 페이지 내용을 크게 바꾼 날짜 (src/config/content.ts). 검색엔진이 다시 읽어 갈 페이지를 고르는 데 씁니다.
      lastmod: new Date(CONTENT_UPDATED),
    }),
  ],
  vite: {
    worker: { format: 'es' },
  },
});
