export type Direction = 'ltr' | 'rtl';

export const directionRules = {
  defaultDirection: 'rtl' as Direction,
  supportedDirections: ['ltr', 'rtl'] as const,
  logicalSpacingOnly: true,
  rowOrderOwnedBySharedLayer: true
};
