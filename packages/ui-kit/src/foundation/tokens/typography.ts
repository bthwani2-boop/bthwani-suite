export const fontFamilies = {
  arabic: 'System',
  latin: 'System'
} as const;

export const textRoles = {
  hero: { fontSize: 30, lineHeight: 38, fontWeight: '700' },
  titleLg: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  titleMd: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  titleSm: { fontSize: 18, lineHeight: 26, fontWeight: '700' },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMd: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' }
} as const;

export type TextRole = keyof typeof textRoles;
