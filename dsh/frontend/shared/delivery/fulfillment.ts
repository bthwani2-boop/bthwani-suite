export type PartnerStoreHoursDay = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export const defaultStoreHours: readonly PartnerStoreHoursDay[] = [
  { id: 'sun', label: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'mon', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'tue', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'wed', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'thu', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'fri', label: 'Friday', isOpen: false, openTime: '14:00', closeTime: '23:30' },
  { id: 'sat', label: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
] as const;

export const defaultServiceModes = [
  {
    id: 'partner_delivery',
    label: 'توصيل المتجر',
    description: 'تفعيل توصيل المتجر عبر موصل الشريك عند الجاهزية التشغيلية.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'استلام بنفسي',
    description: 'إظهار الاستلام الذاتي عندما يكون المتجر جاهزًا لتسليم العميل مباشرة.',
    enabled: true,
  },
  {
    id: 'bthwani_delivery',
    label: 'توصيل بثواني',
    description: 'فتح توصيل بثواني فقط عند توفر تغطية الكباتن والإسناد.',
    enabled: false,
  },
] as const;

export const defaultZone = {
  title: 'Yasmin',
} as const;
