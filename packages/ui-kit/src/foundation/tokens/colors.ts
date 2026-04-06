export const neutralPalette = {
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
} as const;

export const brandPalette = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C'
} as const;

export const successPalette = {
  50: '#ECFDF3',
  100: '#DCFCE7',
  600: '#16A34A',
  700: '#15803D'
} as const;

export const warningPalette = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  600: '#D97706',
  700: '#B45309'
} as const;

export const dangerPalette = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  600: '#DC2626',
  700: '#B91C1C'
} as const;

export const infoPalette = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  600: '#2563EB',
  700: '#1D4ED8'
} as const;

export function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const offset = normalized.length === 3 ? 1 : 2;
  const values = normalized.length === 3
    ? normalized.split('').map((value) => parseInt(`${value}${value}`, 16))
    : [0, 1, 2].map((index) => parseInt(normalized.slice(index * offset, index * offset + offset), 16));

  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

export const colorPalette = {
  brand: brandPalette[500],
  brandStrong: brandPalette[600],
  brandSoft: brandPalette[50],
  brandSurface: brandPalette[100],
  ink: neutralPalette[900],
  inkMuted: neutralPalette[600],
  inkSoft: neutralPalette[500],
  line: neutralPalette[200],
  lineStrong: neutralPalette[300],
  surface: neutralPalette[0],
  surfaceAlt: neutralPalette[50],
  surfaceInset: neutralPalette[100],
  surfaceRaised: neutralPalette[0],
  success: successPalette[600],
  successStrong: successPalette[700],
  successSoft: successPalette[50],
  warning: warningPalette[600],
  warningStrong: warningPalette[700],
  warningSoft: warningPalette[50],
  danger: dangerPalette[600],
  dangerStrong: dangerPalette[700],
  dangerSoft: dangerPalette[50],
  info: infoPalette[600],
  infoStrong: infoPalette[700],
  infoSoft: infoPalette[50],
  overlay: withAlpha(neutralPalette[950], 0.48),
  overlaySoft: withAlpha(neutralPalette[950], 0.24),
  focusRing: withAlpha(brandPalette[500], 0.32),
  disabledSurface: neutralPalette[100],
  disabledInk: neutralPalette[400],
  black: neutralPalette[950],
  white: neutralPalette[0]
} as const;

export type PaletteKey = keyof typeof colorPalette;
