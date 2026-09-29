// 체험판(단일 페이지) 빌드 설정: npm run build:demo → dist-demo/
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  // 어느 경로에 올려도 동작하도록 모든 파일을 상대 경로로 참조합니다.
  base: './',
  publicDir: false,
  envDir: '..',
  envPrefix: 'PUBLIC_',
  plugins: [preact()],
  worker: { format: 'es' },
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    assetsDir: 'assets',
    modulePreload: { polyfill: false },
  },
});
