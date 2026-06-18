import { expect, test } from '@playwright/test';

test('finance surface loads the DSH/WLT bridge route', async ({ page }) => {
  await page.goto('/finance?workspace=wlt-finance-bridge');

  await expect(page).toHaveURL(/\/finance\?workspace=wlt-finance-bridge/);
  await expect(page.getByText('المالية', { exact: false })).toBeVisible();
});
