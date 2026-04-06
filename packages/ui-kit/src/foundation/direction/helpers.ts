import type { Direction } from './types';

export function isRtl(direction: Direction) {
  return direction === 'rtl';
}

export function resolveLogicalInsets(direction: Direction, start: number, end: number) {
  return isRtl(direction)
    ? { paddingRight: start, paddingLeft: end }
    : { paddingLeft: start, paddingRight: end };
}

export function resolveTextAlign(direction: Direction, align?: 'start' | 'center' | 'end') {
  if (!align || align === 'center') return align ?? 'start';
  if (align === 'start') return isRtl(direction) ? 'right' : 'left';
  return isRtl(direction) ? 'left' : 'right';
}
