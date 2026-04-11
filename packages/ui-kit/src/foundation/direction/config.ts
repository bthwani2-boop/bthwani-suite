import type { Direction } from './types';

export const directionConfig = {
  defaultDirection: 'rtl' as Direction,
  defaultLanguage: 'ar',
  languageStorageKey: 'bth-language',
  supportedDirections: ['rtl', 'ltr'] as const,
  rtlLanguages: ['ar', 'fa', 'he', 'ur'] as const,
  useLogicalStartEnd: true,
  mirroredDirectionalIcons: true
};
