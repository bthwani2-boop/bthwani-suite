import { useDirection } from '@bthwani/ui-kit';

export type ServiceId = 'dsh' | 'knz' | 'amn' | 'arb' | 'wlt' | 'esf' | 'kwd' | 'mrf' | 'snd';

type ServiceLocale = 'ar' | 'en';

type ServiceLabels = Record<ServiceId, string>;

const serviceLabelsCatalog: Record<ServiceLocale, ServiceLabels> = {
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

export function getServiceLabels(locale: ServiceLocale = 'ar') {
  return serviceLabelsCatalog[locale];
}

export function useServiceLabels() {
  const { language } = useDirection();
  return getServiceLabels(language === 'en' ? 'en' : 'ar');
}