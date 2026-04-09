import { BTHWANI_COLORS } from '@bthwani/ui-kit';
/**
 * Captain type and storage key — single source to avoid require cycles.
 * CaptainTypeContext imports from here; captain/index.ts re-exports.
 * §UX: Same content background as AMN map for unified look (DSH home + lists).
 */
export type CaptainType = 'dsh' | 'amn';
export const CAPTAIN_TYPE_STORAGE_KEY = '@bthwani/captain-type';
/** Background for main content area (matches CaptainMapScreen map green) */
export const CAPTAIN_CONTENT_BG = BTHWANI_COLORS.successSubtle;
