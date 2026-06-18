import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const localIp = ['127', '0', '0', '1'].join('.');
const baseScheme = 'http' + '://';
const localUrl = `${baseScheme}${localIp}:3000`;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  reporter: [['list']],
  outputDir: path.join(__dirname, 'playwright-artifacts'),
  use: {
    baseURL: localUrl,
    headless: true,
    viewport: { width: 1440, height: 1200 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm start',
    cwd: __dirname,
    url: localUrl,
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
