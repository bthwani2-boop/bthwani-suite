/**
 * DSH Preview Color Resolver
 * Owner: dsh/frontend/shared
 *
 * Maps semantic preview-layer color token names to design-system hex values
 * via @bthwani/ui-kit. Data files store semantic token names (no raw hex);
 * this resolver is called at data-init time so consumers always receive
 * valid CSS color strings. The data layer imports from shared (correct
 * dependency direction: shared → data → surfaces).
 */
import {
  colorPalette,
  brandPalette,
  dangerPalette,
  infoPalette,
  successPalette,
} from '@bthwani/ui-kit';

export const dshPreviewColorContractMeta = {
  dataKind: 'SHARED_HELPER',
  purpose: 'Resolve semantic preview color tokens to ui-kit hex values at data-init time',
} as const;

/** Token → hex mapping derived from ui-kit design-system palette. */
const _TOKEN_MAP: Record<string, string | undefined> = {
  // Semantic color roles
  white: colorPalette.white,
  black: colorPalette.black,
  brand: colorPalette.brand,
  brandStrong: colorPalette.brandStrong,
  accentOrange: colorPalette.accentOrange,
  accentBlue: colorPalette.accentBlue,
  ink: colorPalette.ink,
  danger: colorPalette.danger,
  success: colorPalette.success,
  info: colorPalette.info,
  warning: colorPalette.warning,
  // Raw palette shade variants (used in preview home feature items)
  'brand.400': brandPalette[400],
  'brand.500': brandPalette[500],
  'brand.600': brandPalette[600],
  'danger.400': dangerPalette[400],
  'danger.600': dangerPalette[600],
  'info.600': infoPalette[600],
  'info.700': infoPalette[700],
  'success.600': successPalette[600],
};

/**
 * Resolve a preview-layer semantic color token name to its design-system hex value.
 * If the input is already an unrecognized string (e.g. an actual hex from a live
 * API response), it passes through unchanged.
 */
export function resolvePreviewColor(token: string): string {
  return _TOKEN_MAP[token] ?? token;
}
