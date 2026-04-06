export const colorPalette = {
  brand: '#F97316',
  brandStrong: '#EA580C',
  brandSoft: '#FFF7ED',
  ink: '#0F172A',
  inkMuted: '#475569',
  inkSoft: '#64748B',
  line: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  surfaceRaised: '#FFFFFF',
  success: '#15803D',
  successSoft: '#DCFCE7',
  warning: '#CA8A04',
  warningSoft: '#FEF9C3',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  info: '#2563EB',
  infoSoft: '#DBEAFE',
  black: '#000000',
  white: '#FFFFFF'
} as const;

export type PaletteKey = keyof typeof colorPalette;
