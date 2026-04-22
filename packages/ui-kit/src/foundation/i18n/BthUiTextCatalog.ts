import { uiKitLocales } from '../../locales';
export type BthLocale = 'ar' | 'en';
export type BthUiTextCatalogShape = typeof uiKitLocales.ar.common;

export const bthUiTextCatalog = {
  ar: uiKitLocales.ar.common,
  en: uiKitLocales.en.common,
} as const satisfies Record<BthLocale, BthUiTextCatalogShape>;

export function getBthUiText(locale: BthLocale = 'ar') {
  return bthUiTextCatalog[locale];
}
