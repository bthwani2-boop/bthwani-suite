import { colorPalette, withAlpha } from '../tokens';

export type ThemeMode = 'light' | 'dark';

export type SemanticTheme = {
  mode: ThemeMode;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceRaised: string;
  surfaceInset: string;
  line: string;
  lineStrong: string;
  text: string;
  textMuted: string;
  textSoft: string;
  textInverse: string;
  brand: string;
  brandContrast: string;
  brandSurface: string;
  success: string;
  successSurface: string;
  successText: string;
  warning: string;
  warningSurface: string;
  warningText: string;
  danger: string;
  dangerSurface: string;
  dangerText: string;
  info: string;
  infoSurface: string;
  infoText: string;
  focusRing: string;
  overlay: string;
  overlaySoft: string;
  disabledSurface: string;
  disabledText: string;
  fieldBackground: string;
  fieldBorder: string;
  fieldBorderActive: string;
  fieldPlaceholder: string;
};

export const lightTheme: SemanticTheme = {
  mode: 'light',
  background: colorPalette.surfaceAlt,
  backgroundAlt: colorPalette.white,
  surface: colorPalette.surface,
  surfaceRaised: colorPalette.surfaceRaised,
  surfaceInset: colorPalette.surfaceInset,
  line: colorPalette.line,
  lineStrong: colorPalette.lineStrong,
  text: colorPalette.ink,
  textMuted: colorPalette.inkMuted,
  textSoft: colorPalette.inkSoft,
  textInverse: colorPalette.white,
  brand: colorPalette.brand,
  brandContrast: colorPalette.white,
  brandSurface: colorPalette.brandSurface,
  success: colorPalette.success,
  successSurface: colorPalette.successSoft,
  successText: colorPalette.successStrong,
  warning: colorPalette.warning,
  warningSurface: colorPalette.warningSoft,
  warningText: colorPalette.warningStrong,
  danger: colorPalette.danger,
  dangerSurface: colorPalette.dangerSoft,
  dangerText: colorPalette.dangerStrong,
  info: colorPalette.info,
  infoSurface: colorPalette.infoSoft,
  infoText: colorPalette.infoStrong,
  focusRing: colorPalette.focusRing,
  overlay: colorPalette.overlay,
  overlaySoft: colorPalette.overlaySoft,
  disabledSurface: colorPalette.disabledSurface,
  disabledText: colorPalette.disabledInk,
  fieldBackground: colorPalette.surface,
  fieldBorder: colorPalette.line,
  fieldBorderActive: colorPalette.brand,
  fieldPlaceholder: colorPalette.inkSoft
};

export const darkTheme: SemanticTheme = {
  mode: 'dark',
  background: '#020617',
  backgroundAlt: '#0F172A',
  surface: '#111827',
  surfaceRaised: '#182232',
  surfaceInset: '#0B1324',
  line: '#22304A',
  lineStrong: '#334155',
  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  textSoft: '#94A3B8',
  textInverse: colorPalette.ink,
  brand: '#FB923C',
  brandContrast: '#1C1917',
  brandSurface: withAlpha('#FB923C', 0.16),
  success: '#4ADE80',
  successSurface: withAlpha('#4ADE80', 0.16),
  successText: '#BBF7D0',
  warning: '#FBBF24',
  warningSurface: withAlpha('#FBBF24', 0.16),
  warningText: '#FDE68A',
  danger: '#F87171',
  dangerSurface: withAlpha('#F87171', 0.16),
  dangerText: '#FECACA',
  info: '#60A5FA',
  infoSurface: withAlpha('#60A5FA', 0.16),
  infoText: '#BFDBFE',
  focusRing: withAlpha('#FB923C', 0.4),
  overlay: withAlpha('#020617', 0.72),
  overlaySoft: withAlpha('#020617', 0.36),
  disabledSurface: '#1E293B',
  disabledText: '#64748B',
  fieldBackground: '#0F172A',
  fieldBorder: '#334155',
  fieldBorderActive: '#FB923C',
  fieldPlaceholder: '#64748B'
};
