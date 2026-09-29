// @ts-check
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// .env 파일과 호스팅 플랫폼(Cloudflare Pages 등)의 환경변수를 모두 읽습니다.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = (env.PUBLIC_SITE_URL || 'https://example.com').replace(/\/+$/, '');

export default defineConfig({
  site,
  // 정적 호스팅(서버 비용 0원)을 위해 모든 페이지를 빌드 시점에 HTML로 생성합니다.
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    preact(),
    sitemap({
      i18n: {
        defaultLocale: 'ko',
        locales: { ko: 'ko-KR', en: 'en-US' },
      },
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  vite: {
    worker: { format: 'es' },
  },
});
