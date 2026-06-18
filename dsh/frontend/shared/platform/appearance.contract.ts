export const DSH_APPEARANCE_MODES = [
  'light',
  'dark',
  'system',
  'lightPremium',
  'darkPremium',
] as const;

export type DshAppearanceMode = (typeof DSH_APPEARANCE_MODES)[number];

export function isDshAppearanceMode(value: unknown): value is DshAppearanceMode {
  return DSH_APPEARANCE_MODES.includes(value as DshAppearanceMode);
}

export function normalizeDshAppearanceMode(
  value: unknown,
  fallback: DshAppearanceMode = 'system',
): DshAppearanceMode {
  return isDshAppearanceMode(value) ? value : fallback;
}