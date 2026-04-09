import type { Direction } from '../direction';
import { rawTypographyScale } from './source';

export const fontFamilies = rawTypographyScale.fontFamilies;

export const fontWeights = rawTypographyScale.fontWeights;

export const letterSpacings = rawTypographyScale.letterSpacings;

export const textRoles = rawTypographyScale.textRoles;

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
