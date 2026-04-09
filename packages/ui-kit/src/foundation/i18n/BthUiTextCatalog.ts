export type BthLocale = 'ar' | 'en';

export type BthServiceKey = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

export type BthUiTextCatalogShape = {
  serviceHub: {
    availableServices: string;
    chooseService: string;
    more: string;
    newsStatus: string;
    newsPlaceholder: string;
  };
  serviceNames: Record<BthServiceKey, string>;
};

export const bthUiTextCatalog: Record<BthLocale, BthUiTextCatalogShape> = {
  ar: {
    serviceHub: {
      availableServices: 'الخدمات المتاحة',
      chooseService: 'اختر الخدمة المناسبة وابدأ مباشرة',
      more: 'المزيد',
      newsStatus: 'مغلق',
      newsPlaceholder: 'المساحة مخصصة للشريط الإخباري',
    },
    serviceNames: {
      dsh: 'توصيل',
      knz: 'كنز',
      amn: 'اماني',
      arb: 'عربون',
      wlt: 'محفظة',
      esf: 'اسعفني',
      kwd: 'كوادر',
      mrf: 'معروف',
      snd: 'سند',
    },
  },
  en: {
    serviceHub: {
      availableServices: 'Available Services',
      chooseService: 'Choose the right service and start now',
      more: 'More',
      newsStatus: 'Closed',
      newsPlaceholder: 'Reserved for the news ticker',
    },
    serviceNames: {
      dsh: 'Delivery',
      knz: 'Kanz',
      amn: 'Amani',
      arb: 'Arboon',
      wlt: 'Wallet',
      esf: 'Esafni',
      kwd: 'Kawader',
      mrf: 'Maarof',
      snd: 'Sanad',
    },
  },
};

export function getBthUiText(locale: BthLocale = 'ar') {
  return bthUiTextCatalog[locale];
}
