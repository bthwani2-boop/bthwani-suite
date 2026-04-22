export type BthDirection = 'rtl' | 'ltr';
export type BthLocale = 'ar' | 'en';
export type BthTone = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'muted';

export const bthDefaultLocale: BthLocale = 'ar';
export const bthDefaultDirection: BthDirection = 'rtl';

export const bthColors = {
  brand: {
    white: '#ffffff',
    orange: '#f97316',
    navy: '#0f172a',
  },
  surface: {
    canvas: '#f8fafc',
    card: '#ffffff',
    raised: '#fff7ed',
    inverse: '#0f172a',
  },
  text: {
    strong: '#0f172a',
    body: '#334155',
    muted: '#64748b',
    inverse: '#ffffff',
  },
  line: {
    soft: '#e2e8f0',
    strong: '#cbd5e1',
  },
  state: {
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#f59e0b',
    info: '#2563eb',
  },
} as const;

export const bthSpacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const bthRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const bthTypography = {
  family: {
    system: 'System',
  },
  size: {
    caption: 12,
    body: 14,
    title: 18,
    headline: 24,
  },
  weight: {
    regular: '400',
    medium: '600',
    bold: '800',
  },
} as const;

export const bthElevation = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
} as const;

export const bthToneColors: Record<BthTone, { background: string; foreground: string; border: string }> = {
  default: { background: bthColors.surface.card, foreground: bthColors.text.strong, border: bthColors.line.soft },
  primary: { background: bthColors.brand.orange, foreground: bthColors.brand.white, border: bthColors.brand.orange },
  success: { background: '#ecfdf5', foreground: bthColors.state.success, border: '#bbf7d0' },
  danger: { background: '#fef2f2', foreground: bthColors.state.danger, border: '#fecaca' },
  warning: { background: '#fffbeb', foreground: bthColors.state.warning, border: '#fde68a' },
  muted: { background: '#f1f5f9', foreground: bthColors.text.body, border: bthColors.line.soft },
};

export function resolveBthDirection(locale: BthLocale = bthDefaultLocale): BthDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
