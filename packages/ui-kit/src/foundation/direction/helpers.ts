import { directionConfig } from './config';
import type { BthLanguage, Direction, LogicalTextAlign } from './types';

export function isRtl(direction: Direction) {
  return direction === 'rtl';
}

export function isRtlLanguage(language?: BthLanguage) {
  if (!language) {
    return directionConfig.defaultDirection === 'rtl';
  }

  const normalized = language.toLowerCase();
  return directionConfig.rtlLanguages.some((candidate) => normalized === candidate || normalized.startsWith(`${candidate}-`));
}

export function resolveDirectionFromLanguage(language?: BthLanguage, fallback: Direction = directionConfig.defaultDirection) {
  if (!language) {
    return fallback;
  }

  return isRtlLanguage(language) ? 'rtl' : 'ltr';
}

export function resolveLogicalInsets(direction: Direction, start: number, end: number, property: 'padding' | 'margin' = 'padding') {
  if (property === 'margin') {
    return isRtl(direction)
      ? { marginRight: start, marginLeft: end }
      : { marginLeft: start, marginRight: end };
  }

  return isRtl(direction)
    ? { paddingRight: start, paddingLeft: end }
    : { paddingLeft: start, paddingRight: end };
}

export function resolveLogicalPadding(direction: Direction, start: number, end: number) {
  return resolveLogicalInsets(direction, start, end, 'padding');
}

export function resolveLogicalMargin(direction: Direction, start: number, end: number) {
  return resolveLogicalInsets(direction, start, end, 'margin');
}

export function resolveLogicalBorderRadius(direction: Direction, start: number, end: number) {
  return isRtl(direction)
    ? {
        borderTopRightRadius: start,
        borderBottomRightRadius: start,
        borderTopLeftRadius: end,
        borderBottomLeftRadius: end
      }
    : {
        borderTopLeftRadius: start,
        borderBottomLeftRadius: start,
        borderTopRightRadius: end,
        borderBottomRightRadius: end
      };
}

export function resolveTextAlign(direction: Direction, align: LogicalTextAlign = 'start') {
  if (align === 'center') return 'center';
  if (align === 'start') return isRtl(direction) ? 'right' : 'left';
  return isRtl(direction) ? 'left' : 'right';
}

export function resolveRowDirection(direction: Direction, reversed = false) {
  const baseDirection = isRtl(direction) ? 'row-reverse' : 'row';

  if (!reversed) {
    return baseDirection;
  }

  return baseDirection === 'row' ? 'row-reverse' : 'row';
}
