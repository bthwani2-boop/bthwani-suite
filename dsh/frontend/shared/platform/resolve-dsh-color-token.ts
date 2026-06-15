import {
  colorPalette,
  brandPalette,
  dangerPalette,
  infoPalette,
  successPalette,
} from '@bthwani/ui-kit';

const TOKEN_MAP: Record<string, string | undefined> = {
  white: colorPalette.white,
  black: colorPalette.black,
  brand: colorPalette.brand,
  brandStrong: colorPalette.brandStrong,
  accentOrange: colorPalette.accentOrange,
  accentBlue: colorPalette.accentBlue,
  ink: colorPalette.ink,
  danger: colorPalette.danger,
  success: colorPalette.success,
  info: colorPalette.info,
  warning: colorPalette.warning,
  'brand.400': (brandPalette as Record<number, string>)[400],
  'brand.500': brandPalette[500],
  'brand.600': brandPalette[600],
  'danger.400': (dangerPalette as Record<number, string>)[400],
  'danger.600': dangerPalette[600],
  'info.600': infoPalette[600],
  'info.700': infoPalette[700],
  'success.600': successPalette[600],
};

export function resolveDshColorToken(token: string): string {
  return TOKEN_MAP[token] ?? token;
}
