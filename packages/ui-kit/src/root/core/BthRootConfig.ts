import type { BthLanguage, Direction } from '../../foundation/direction';
import type { ThemeMode } from '../../foundation/themes';

// Central config types for root system
export interface BthRootConfig {
  direction?: Direction;
  language?: BthLanguage;
  themeMode?: ThemeMode;
}
