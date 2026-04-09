export const tokenSourceMetadata = {
  authorityPackage: '@bthwani/ui-kit',
  authorityFile: 'src/foundation/tokens/source.ts',
  format: 'bth-token-source.v1',
  version: '2026.04.09',
  stage: 'phase-b-bootstrap'
} as const;

export const rawColorPalettes = {
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617'
  },
  brand: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C'
  },
  success: {
    50: '#ECFDF3',
    100: '#DCFCE7',
    600: '#16A34A',
    700: '#15803D'
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    600: '#D97706',
    700: '#B45309'
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    600: '#DC2626',
    700: '#B91C1C'
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    600: '#2563EB',
    700: '#1D4ED8'
  }
} as const;

export function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const offset = normalized.length === 3 ? 1 : 2;
  const values = normalized.length === 3
    ? normalized.split('').map((value) => parseInt(`${value}${value}`, 16))
    : [0, 1, 2].map((index) => parseInt(normalized.slice(index * offset, index * offset + offset), 16));

  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

export const semanticColorRoles = {
  brand: rawColorPalettes.brand[500],
  brandStrong: rawColorPalettes.brand[600],
  brandSoft: rawColorPalettes.brand[50],
  brandSurface: rawColorPalettes.brand[100],
  ink: rawColorPalettes.neutral[900],
  inkMuted: rawColorPalettes.neutral[600],
  inkSoft: rawColorPalettes.neutral[500],
  line: rawColorPalettes.neutral[200],
  lineStrong: rawColorPalettes.neutral[300],
  surface: rawColorPalettes.neutral[0],
  surfaceAlt: rawColorPalettes.neutral[50],
  surfaceInset: rawColorPalettes.neutral[100],
  surfaceRaised: rawColorPalettes.neutral[0],
  success: rawColorPalettes.success[600],
  successStrong: rawColorPalettes.success[700],
  successSoft: rawColorPalettes.success[50],
  warning: rawColorPalettes.warning[600],
  warningStrong: rawColorPalettes.warning[700],
  warningSoft: rawColorPalettes.warning[50],
  danger: rawColorPalettes.danger[600],
  dangerStrong: rawColorPalettes.danger[700],
  dangerSoft: rawColorPalettes.danger[50],
  info: rawColorPalettes.info[600],
  infoStrong: rawColorPalettes.info[700],
  infoSoft: rawColorPalettes.info[50],
  overlay: withAlpha(rawColorPalettes.neutral[950], 0.48),
  overlaySoft: withAlpha(rawColorPalettes.neutral[950], 0.24),
  focusRing: withAlpha(rawColorPalettes.brand[500], 0.32),
  disabledSurface: rawColorPalettes.neutral[100],
  disabledInk: rawColorPalettes.neutral[400],
  black: rawColorPalettes.neutral[950],
  white: rawColorPalettes.neutral[0]
} as const;

export const rawSpacingScale = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64
} as const;

export const rawRadiusScale = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999
} as const;

export const rawElevationScale = {
  flat: 0,
  raised: 1,
  overlay: 2,
  floating: 3
} as const;

export const shadowPresets = {
  flat: undefined,
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  overlay: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  floating: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  }
} as const;

export const rawMotionScale = {
  instant: 0,
  quick: 120,
  standard: 180,
  calm: 240,
  emphasized: 320
} as const;

export const rawSizingScale = {
  controlSm: 36,
  controlMd: 44,
  controlLg: 52,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  avatarSm: 28,
  avatarMd: 40,
  avatarLg: 56
} as const;

export const rawBreakpointScale = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  wide: 1440
} as const;

export const rawSafeAreaScale = {
  none: 0,
  compact: 8,
  comfortable: 16,
  spacious: 24
} as const;

export const rawZIndexScale = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500
} as const;

export const rawOpacityScale = {
  disabled: 0.48,
  pressed: 0.9,
  subtle: 0.72,
  overlay: 0.4
} as const;

export const rawBorderScale = {
  none: 0,
  hairline: 1,
  strong: 2
} as const;

export const rawTypographyScale = {
  fontFamilies: {
    arabic: 'System',
    latin: 'System',
    display: 'System',
    mono: 'monospace'
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '800'
  },
  letterSpacings: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.2,
    wider: 0.4
  },
  textRoles: {
    displayXl: { fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -0.8 },
    displayLg: { fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.4 },
    hero: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4 },
    titleXl: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
    titleLg: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
    titleMd: { fontSize: 20, lineHeight: 27, fontWeight: '600', letterSpacing: 0 },
    titleSm: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
    bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: '400', letterSpacing: 0 },
    bodyMd: { fontSize: 15, lineHeight: 23, fontWeight: '400', letterSpacing: 0 },
    bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
    bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600', letterSpacing: 0 },
    labelLg: { fontSize: 14, lineHeight: 18, fontWeight: '600', letterSpacing: 0.2 },
    label: { fontSize: 13, lineHeight: 17, fontWeight: '600', letterSpacing: 0.2 },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.2 },
    overline: { fontSize: 11, lineHeight: 15, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' as const },
    code: { fontSize: 13, lineHeight: 18, fontWeight: '500', letterSpacing: 0 }
  }
} as const;
