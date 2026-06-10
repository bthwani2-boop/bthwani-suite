import type { DiscoveryFilter, DshServiceId } from './dsh-discovery.contract';

export type DshHomeServiceDialItem = {
  id: string;
  key: DshServiceId;
  title: string;
  shortLabel?: string;
  subtitle?: string;
  iconUrl: string | null;
  emojiFallback?: string;
};

export type DshHomeDiscoveryFilterItem = {
  value: DiscoveryFilter;
  label: string;
  iconName: string;
};

export const DSH_HOME_SERVICE_DIAL_ITEMS: DshHomeServiceDialItem[] = [
  { id: 'service-dsh', key: 'dsh', title: 'توصيل', iconUrl: null, emojiFallback: '🚚' },
  { id: 'service-knz', key: 'knz', title: 'كنز', iconUrl: null, emojiFallback: '🪙' },
  { id: 'service-amn', key: 'amn', title: 'أمان', iconUrl: null, emojiFallback: '🛡️' },
  { id: 'service-arb', key: 'arb', title: 'عربون', iconUrl: null, emojiFallback: '💳' },
  { id: 'service-wlt', key: 'wlt', title: 'المحفظة', iconUrl: null, emojiFallback: '👛' },
  { id: 'service-esf', key: 'esf', title: 'أسعفني', iconUrl: null, emojiFallback: '🩺' },
  { id: 'service-kwd', key: 'kwd', title: 'كوادر', iconUrl: null, emojiFallback: '🧰' },
  { id: 'service-mrf', key: 'mrf', title: 'معروف', iconUrl: null, emojiFallback: '🏷️' },
  { id: 'service-snd', key: 'snd', title: 'سند', iconUrl: null, emojiFallback: '🤝' },
];

export const DSH_HOME_DISCOVERY_FILTERS: DshHomeDiscoveryFilterItem[] = [
  { value: 'all', label: 'الكل', iconName: 'reorder-three-outline' },
  { value: 'favorites', label: 'المفضلة', iconName: 'heart-outline' },
  { value: 'nearest', label: 'الأقرب', iconName: 'locate-outline' },
  { value: 'new', label: 'الجديدة', iconName: 'sparkles-outline' },
  { value: 'offers', label: 'العروض', iconName: 'pricetag-outline' },
];
