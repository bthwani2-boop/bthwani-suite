import fs from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator } from '@playwright/test';

const visualRegressionDir = path.resolve(__dirname, '../../../../packages/ui-kit/docs/generated/visual-regression');
const generatedDir = path.resolve(__dirname, '../../../../packages/ui-kit/docs/generated');

async function captureProofImage(locator: Locator, fileName: string) {
  await fs.mkdir(visualRegressionDir, { recursive: true });
  await locator.screenshot({
    animations: 'disabled',
    caret: 'hide',
    path: path.join(visualRegressionDir, fileName),
  });
}

async function writeAccessibilityArtifacts(report: {
  scannedRoute: string;
  scannedSection: string;
  scannedTheme: string;
  violationCount: number;
  incompleteCount: number;
  violations: Array<{ id: string; impact: string | null | undefined; description: string; help: string; nodes: number }>;
}) {
  const jsonPath = path.join(generatedDir, 'accessibility-report.json');
  const markdownPath = path.join(generatedDir, 'accessibility-report.md');

  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await fs.writeFile(
    markdownPath,
    [
      '# UI Kit Accessibility Proof',
      '',
      `- route: ${report.scannedRoute}`,
      `- section: ${report.scannedSection}`,
      `- theme: ${report.scannedTheme}`,
      `- violations: ${report.violationCount}`,
      `- incomplete: ${report.incompleteCount}`,
      '',
      '## Violations',
      '',
      ...(report.violations.length > 0
        ? report.violations.flatMap((violation) => [
            `### ${violation.id}`,
            '',
            `- impact: ${violation.impact ?? 'unknown'}`,
            `- help: ${violation.help}`,
            `- description: ${violation.description}`,
            `- nodes: ${violation.nodes}`,
            ''
          ])
        : ['- none', ''])
    ].join('\n'),
    'utf8'
  );
}

test.describe('ui-kit hosted preview', () => {
  test('interaction proof scenarios stay governed', async ({ page }) => {
    await page.goto('/ui-kit');

    const previewTabs = page.getByTestId('ui-kit-preview-sections');

    await expect(page.getByRole('heading', { name: 'UI Kit Hosted Preview' })).toBeVisible();
    await expect(page.getByTestId('ui-kit-preview-surface')).toHaveAttribute('data-bth-theme', 'light');

    await page.getByRole('button', { name: 'Dark' }).click();
    await expect(page.getByTestId('ui-kit-preview-surface')).toHaveAttribute('data-bth-theme', 'dark');

    await previewTabs.getByRole('tab', { name: 'States' }).click();
    await expect(page.getByTestId('ui-kit-preview-surface')).toHaveAttribute('data-preview-section', 'states');

    await previewTabs.getByRole('tab', { name: 'Lab' }).click();
    await expect(page.getByTestId('ui-kit-preview-surface')).toHaveAttribute('data-preview-section', 'lab');
    await page.getByTestId('lab-priority-select').click();
    await page.getByRole('button', { name: 'Same day' }).click();
    await expect(page.getByTestId('lab-priority-select')).toContainText('Same day');

    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(page.getByText('Shared dialog family')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Shared dialog family')).not.toBeVisible();

    await page.getByRole('button', { name: 'Show toast' }).click();
    await expect(page.getByText('Toast family ready')).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss' }).click();

    await previewTabs.getByRole('tab', { name: 'Proof' }).click();
    await expect(page.getByTestId('ui-kit-preview-surface')).toHaveAttribute('data-preview-section', 'proof');
    await expect(page.getByText('Mandatory gates before approval')).toBeVisible();
  });

  test('accessibility proof stays governed', async ({ page }) => {
    await page.goto('/ui-kit?theme=light&section=proof&language=ar');

    const previewSurface = page.getByTestId('ui-kit-preview-surface');
    await expect(previewSurface).toBeVisible();
    await expect(previewSurface).toHaveAttribute('data-preview-section', 'proof');
    await expect(page.getByText('Mandatory gates before approval')).toBeVisible();

    const scan = await new AxeBuilder({ page })
      .include('[data-testid="ui-kit-preview-surface"]')
      .analyze();

    const report = {
      scannedRoute: '/ui-kit',
      scannedSection: 'proof',
      scannedTheme: 'light',
      violationCount: scan.violations.length,
      incompleteCount: scan.incomplete.length,
      violations: scan.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        nodes: violation.nodes.length
      }))
    };

    await writeAccessibilityArtifacts(report);
    expect(scan.violations, JSON.stringify(report, null, 2)).toEqual([]);
  });

  for (const theme of ['light', 'dark', 'high-contrast'] as const) {
    test(`visual proof remains stable for ${theme}`, async ({ page }) => {
      await page.goto(`/ui-kit?theme=${theme}&section=lab&language=ar`);

      const previewSurface = page.getByTestId('ui-kit-preview-surface');
      await expect(previewSurface).toBeVisible();
      await expect(previewSurface).toHaveAttribute('data-bth-theme', theme);
      await expect(previewSurface).toHaveScreenshot(`ui-kit-preview-${theme}.png`);

      await captureProofImage(previewSurface, `ui-kit-preview-${theme}.png`);
    });
  }
});