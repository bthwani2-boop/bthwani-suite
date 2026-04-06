import { colorPalette } from '../tokens';

export type ThemeMode = 'light' | 'dark';

export type SemanticTheme = {
  mode: ThemeMode;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceRaised: string;
  line: string;
  text: string;
  textMuted: string;
  textSoft: string;
  brand: string;
  brandContrast: string;
  success: string;
  successSurface: string;
  warning: string;
  warningSurface: string;
  danger: string;
  dangerSurface: string;
  info: string;
  infoSurface: string;
  focusRing: string;
};

export const lightTheme: SemanticTheme = {
  mode: 'light',
  background: colorPalette.surfaceAlt,
  backgroundAlt: colorPalette.white,
  surface: colorPalette.surface,
  surfaceRaised: colorPalette.surfaceRaised,
  line: colorPalette.line,
  text: colorPalette.ink,
  textMuted: colorPalette.inkMuted,
  textSoft: colorPalette.inkSoft,
  brand: colorPalette.brand,
  brandContrast: colorPalette.white,
  success: colorPalette.success,
  successSurface: colorPalette.successSoft,
  warning: colorPalette.warning,
  warningSurface: colorPalette.warningSoft,
  danger: colorPalette.danger,
  dangerSurface: colorPalette.dangerSoft,
  info: colorPalette.info,
  infoSurface: colorPalette.infoSoft,
  focusRing: colorPalette.brand
};

export const darkTheme: SemanticTheme = {
  mode: 'dark',
  background: '#020617',
  backgroundAlt: '#0F172A',
  surface: '#111827',
  surfaceRaised: '#1F2937',
  line: '#334155',
  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  textSoft: '#94A3B8',
  brand: '#FB923C',
  brandContrast: '#0F172A',
  success: '#22C55E',
  successSurface: '#052E16',
  warning: '#FACC15',
  warningSurface: '#422006',
  danger: '#F87171',
  dangerSurface: '#450A0A',
  info: '#60A5FA',
  infoSurface: '#172554',
  focusRing: '#FB923C'
};
