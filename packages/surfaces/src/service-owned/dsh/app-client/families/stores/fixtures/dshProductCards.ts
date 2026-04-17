import type { BthProductCardProps } from '@bthwani/ui-kit';

export const dshProductCardSamples: BthProductCardProps[] = [
  {
    id: 'pd-apple-1',
    title: 'تفاح رويال غالا',
    subtitle: 'صندوق طازج 1 كجم',
    imageUri: 'https://placehold.co/900x700/ECFCCB/365314.png?text=APPLE',
    price: { label: '18 ر.س', value: 18, currency: 'SAR' },
    oldPrice: { label: '24 ر.س', value: 24, currency: 'SAR' },
    discountLabel: 'خصم 25%',
    badges: ['الأكثر طلبًا'],
    isFavorited: true,
  },
  {
    id: 'pd-milk-1',
    title: 'حليب عضوي',
    subtitle: 'عبوة مبردة 1.5 لتر',
    imageUri: 'https://placehold.co/900x700/F5F3FF/4C1D95.png?text=MILK',
    price: { label: '11 ر.س', value: 11, currency: 'SAR' },
    oldPrice: { label: '14 ر.س', value: 14, currency: 'SAR' },
    discountLabel: 'خصم 21%',
    badges: ['ألبان'],
  }
];
