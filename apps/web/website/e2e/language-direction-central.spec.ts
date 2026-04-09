import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '../../../../');

const rootContractFiles = [
  'apps/mobile/app-client/App.tsx',
  'apps/mobile/app-partner/App.tsx',
  'apps/mobile/app-captain/App.tsx',
  'apps/mobile/app-field/App.tsx',
  'apps/web/webapp/app/layout.tsx',
  'apps/web/control-panel/app/layout.tsx',
];

test.describe('central language and direction governance', () => {
  test('ui-kit preview flips direction with language only', async ({ page }) => {
    await page.goto('/ui-kit?theme=light&section=lab&language=ar');

    const previewSurface = page.getByTestId('ui-kit-preview-surface');
    await expect(previewSurface).toHaveAttribute('data-preview-language', 'ar');
    await expect(previewSurface).toHaveAttribute('data-preview-direction', 'rtl');

    await page.getByRole('button', { name: 'English' }).click();
    await expect(previewSurface).toHaveAttribute('data-preview-language', 'en');
    await expect(previewSurface).toHaveAttribute('data-preview-direction', 'ltr');

    await page.getByRole('button', { name: 'Arabic' }).click();
    await expect(previewSurface).toHaveAttribute('data-preview-language', 'ar');
    await expect(previewSurface).toHaveAttribute('data-preview-direction', 'rtl');
  });

  test('all app roots avoid local direction overrides', async () => {
    for (const relativePath of rootContractFiles) {
      const filePath = path.join(repoRoot, relativePath);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content, `${relativePath} must not hardcode direction`).not.toMatch(/\bdirection\s*=/);
      expect(content, `${relativePath} must define a base language`).toMatch(/\blanguage\s*=\s*"ar"/);
    }
  });
});
