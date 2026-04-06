import type { Direction } from '../direction';

export const fontFamilies = {
  arabic: 'System',
  latin: 'System',
  display: 'System',
  mono: 'monospace'
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '800'
} as const;

export const letterSpacings = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.2,
  wider: 0.4
} as const;

export const textRoles = {
  displayXl: { fontSize: 40, lineHeight: 46, fontWeight: fontWeights.black, letterSpacing: letterSpacings.tighter },
  displayLg: { fontSize: 34, lineHeight: 40, fontWeight: fontWeights.bold, letterSpacing: letterSpacings.tight },
  hero: { fontSize: 30, lineHeight: 36, fontWeight: fontWeights.bold, letterSpacing: letterSpacings.tight },
  titleXl: { fontSize: 28, lineHeight: 34, fontWeight: fontWeights.bold, letterSpacing: letterSpacings.tight },
  titleLg: { fontSize: 24, lineHeight: 30, fontWeight: fontWeights.bold, letterSpacing: letterSpacings.tight },
  titleMd: { fontSize: 20, lineHeight: 27, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.normal },
  titleSm: { fontSize: 18, lineHeight: 24, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.normal },
  bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: fontWeights.regular, letterSpacing: letterSpacings.normal },
  bodyMd: { fontSize: 15, lineHeight: 23, fontWeight: fontWeights.regular, letterSpacing: letterSpacings.normal },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: fontWeights.regular, letterSpacing: letterSpacings.normal },
  bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.normal },
  labelLg: { fontSize: 14, lineHeight: 18, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.wide },
  label: { fontSize: 13, lineHeight: 17, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.wide },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeights.medium, letterSpacing: letterSpacings.wide },
  overline: { fontSize: 11, lineHeight: 15, fontWeight: fontWeights.semibold, letterSpacing: letterSpacings.wider, textTransform: 'uppercase' as const },
  code: { fontSize: 13, lineHeight: 18, fontWeight: fontWeights.medium, letterSpacing: letterSpacings.normal }
} as const;

export type TextRole = keyof typeof textRoles;
export type FontFamilyToken = keyof typeof fontFamilies;
export type FontWeightToken = keyof typeof fontWeights;

export function resolveFontFamily(direction: Direction, family: FontFamilyToken = 'latin') {
  if (family === 'mono') {
    return fontFamilies.mono;
  }

  if (family === 'display') {
    return fontFamilies.display;
  }

  return direction === 'rtl' ? fontFamilies.arabic : fontFamilies.latin;
}

export function resolveTextRole(role: TextRole) {
  return textRoles[role];
}
