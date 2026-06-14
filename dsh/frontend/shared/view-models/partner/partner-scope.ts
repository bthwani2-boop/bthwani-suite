export type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

export const storeScopeOptions: readonly PartnerStoreScopeOption[] = [
  { id: 'all', label: 'كل الفروع', description: 'عرض موحّد لكل فروع الشريك.' },
  { id: 'fakhama-1', label: 'الفخامة 1', description: 'الفرع الأساسي الحالي.' },
  { id: 'fakhama-2', label: 'الفخامة 2', description: 'فرع المدينة الثاني للتشغيل.' },
  { id: 'fakhama-3', label: 'الفخامة 3', description: 'فرع داعم لنطاق الطلبات الممتد.' },
] as const;
