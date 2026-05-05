import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '../../../');

const rootContractFiles = [
  'app-client/runtime/App.tsx',
  'app-partner/runtime/App.tsx',
  'app-captain/runtime/App.tsx',
  'app-field/runtime/App.tsx',
  'webapp/runtime/app/layout.tsx',
  'website/runtime/app/layout.tsx',
  'control-panel/runtime/app/layout.tsx',
];

test.describe('central language and direction governance', () => {
  test('all app roots avoid local direction overrides', async () => {
    for (const relativePath of rootContractFiles) {
      const filePath = path.join(repoRoot, relativePath);
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content, `${relativePath} must not hardcode direction`).not.toMatch(/\bdirection\s*=/);
      expect(content, `${relativePath} must define a base language`).toMatch(/\blanguage\s*=\s*"ar"/);
    }
  });
});
