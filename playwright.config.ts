import { defineConfig, devices } from '@playwright/test';

// 로컬에 이미 설치된 크로미움을 쓰려면 PW_CHROMIUM_PATH 환경변수로 실행 파일 경로를 지정하세요.
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    acceptDownloads: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    // 배포 환경의 public/_headers(Word·PPT 변환용 교차 출처 격리 헤더)를 흉내 내는 정적 서버
    command: 'node scripts/serve-dist.mjs 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], launchOptions: executablePath ? { executablePath } : {} },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
});
