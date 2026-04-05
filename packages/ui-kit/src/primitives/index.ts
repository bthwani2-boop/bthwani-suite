import type { Direction } from '../direction/index';
import { spacingScale, type SpacingStep } from '../spacing/index';

export const primitiveSet = [
  'box',
  'stack',
  'inline',
  'text',
  'surface'
] as const;

export function resolveInlinePadding(direction: Direction, start: SpacingStep, end: SpacingStep) {
  return direction === 'rtl'
    ? { paddingRight: spacingScale[start], paddingLeft: spacingScale[end] }
    : { paddingLeft: spacingScale[start], paddingRight: spacingScale[end] };
}
