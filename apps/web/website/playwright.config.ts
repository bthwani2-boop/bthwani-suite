import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const generatedDir = path.resolve(__dirname, '../../../packages/ui-kit/docs/generated');

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.02,
    },
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(generatedDir, 'playwright-report') }],
  ],
  outputDir: path.join(generatedDir, 'playwright-artifacts'),
  use: {
    baseURL: 'http://127.0.0.1:3002',
    headless: true,
    viewport: { width: 1440, height: 1600 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm start',
    cwd: __dirname,
    url: 'http://127.0.0.1:3002/ui-kit',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});