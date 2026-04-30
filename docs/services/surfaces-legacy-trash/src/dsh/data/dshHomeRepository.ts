import { fetchDshHome } from './dshHomeApi';
import { buildDshHomeDataMock } from './dshHomeSeed';
import type { DshHomeDataMock } from './dshHomeTypes';

function readPreviewFlag(): string {
  const raw =
    typeof process !== 'undefined' && process.env
      ? process.env.EXPO_PUBLIC_UI_PREVIEW_DSH_HOME ??
        process.env.NEXT_PUBLIC_UI_PREVIEW_DSH_HOME ??
        ''
      : '';

  return String(raw ?? '').trim().toLowerCase();
}

function isPreviewModeEnabled(): boolean {
  const flag = readPreviewFlag();
  return flag === '1' || flag === 'true' || flag === 'yes' || flag === 'on';
}

/**
 * Single runtime entry for DSH Home.
 *
 * Preview mode is EXPLICIT only:
 * - EXPO_PUBLIC_UI_PREVIEW_DSH_HOME=1  => design seed
 * - otherwise                           => live API
 *
 * No silent fallback.
 */
export async function getDshHomeRuntime(): Promise<DshHomeDataMock> {
  if (isPreviewModeEnabled()) {
    return buildDshHomeDataMock();
  }

  return fetchDshHome();
}
