export const DSH_APPEARANCE_MODES = ['light', 'dark', 'system'] as const;

export type DshAppearanceMode = (typeof DSH_APPEARANCE_MODES)[number];

export function isDshAppearanceMode(value: unknown): value is DshAppearanceMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function normalizeDshAppearanceMode(value: unknown, fallback: DshAppearanceMode = 'system'): DshAppearanceMode {
  return isDshAppearanceMode(value) ? value : fallback;
}