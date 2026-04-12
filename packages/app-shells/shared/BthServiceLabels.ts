import { useDirection } from '@bthwani/ui-kit';

export type BthServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

type BthServiceLocale = 'ar' | 'en';

type BthServiceLabels = Record<BthServiceId, string>;

const serviceLabelsCatalog: Record<BthServiceLocale, BthServiceLabels> = {
  ar: {
    dsh: 'توصيل',
    knz: 'كنز',
    amn: 'أمان',
    arb: 'عربون',
    wlt: 'المحفظة',
    esf: 'أسعفني',
    kwd: 'كوادر',
    mrf: 'معروف',
    snd: 'سند',
  },
  en: {
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
};

export function getBthServiceLabels(locale: BthServiceLocale = 'ar') {
  return serviceLabelsCatalog[locale];
}

export function useBthServiceLabels() {
  const { language } = useDirection();
  return getBthServiceLabels(language === 'en' ? 'en' : 'ar');
}