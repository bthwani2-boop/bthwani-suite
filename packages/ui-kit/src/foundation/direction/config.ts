import type { Direction } from './types';

export const directionConfig = {
  defaultDirection: 'rtl' as Direction,
  supportedDirections: ['rtl', 'ltr'] as const,
  useLogicalStartEnd: true,
  mirroredDirectionalIcons: true
};
