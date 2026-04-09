import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

export type BthLocale = 'ar' | 'en';
export type BthUiTextCatalogShape = typeof arCommon;

export const bthUiTextCatalog = {
  ar: arCommon,
  en: enCommon,
} as const satisfies Record<BthLocale, BthUiTextCatalogShape>;

export function getBthUiText(locale: BthLocale = 'ar') {
  return bthUiTextCatalog[locale];
}
