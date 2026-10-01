// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
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
    }),
  ],
  vite: {
    worker: { format: 'es' },
  },
});
