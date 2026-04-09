/**
 * KNZ (كنز) — ثوابت موحّدة وفق KNZ_OPENSOOQ_YEMENMAZAD_ANALYSIS §4 و §5
 * مرجع: kdt/analysis/knz/KNZ_OPENSOOQ_YEMENMAZAD_ANALYSIS.md
 * استخدام: فئات معيارية لحقل category؛ مدن يمنية لحقل location/city
 */

/** فئات KNZ المعيارية (§4) — قيم مسموحة لـ category في knz_listing_create و knz_listings_list */
export const KNZ_CATEGORIES = [
  { code: 'vehicles', labelKey: 'surfaces.مركبات', labelAr: 'مركبات' },
  { code: 'real_estate', labelKey: 'surfaces.عقارات', labelAr: 'عقارات' },
  { code: 'services', labelKey: 'surfaces.خدمات', labelAr: 'خدمات' },
  {
    code: 'home_garden',
    labelKey: 'surfaces.منزل_وحديقة',
    labelAr: 'منزل وحديقة',
  },
  {
    code: 'electronics',
    labelKey: 'surfaces.إلكترونيات',
    labelAr: 'إلكترونيات',
  },
  { code: 'jobs', labelKey: 'surfaces.وظائف', labelAr: 'وظائف' },
  {
    code: 'family_kids',
    labelKey: 'surfaces.احتياجات_أسرة_وأطفال',
    labelAr: 'احتياجات أسرة وأطفال',
  },
  {
    code: 'sports',
    labelKey: 'surfaces.رياضة_ولياقة',
    labelAr: 'رياضة ولياقة',
  },
  {
    code: 'animals',
    labelKey: 'surfaces.حيوانات_وطيور',
    labelAr: 'حيوانات وطيور',
  },
  {
    code: 'numbers_plates',
    labelKey: 'surfaces.أرقام_ولوحات',
    labelAr: 'أرقام ولوحات',
  },
  { code: 'travel', labelKey: 'surfaces.سفر_ورحلات', labelAr: 'سفر ورحلات' },
  { code: 'other', labelKey: 'surfaces.أخرى', labelAr: 'أخرى' },
] as const;

/** عدّ إعلانات تجريبي لكل فئة (مرجع يمن مزاد — للتجربة حتى توفر knz_home_get/knz_categories_list). يُستبدل بقيم من API عند التوفر. */
export const KNZ_CATEGORY_MOCK_COUNTS: Record<string, number> = {
  vehicles: 13260,
  real_estate: 17320,
  services: 6361,
  home_garden: 4200,
  electronics: 8900,
  jobs: 2100,
  family_kids: 3500,
  sports: 1800,
  animals: 1200,
  numbers_plates: 800,
  travel: 950,
  other: 5400,
};

/** قائمة المدن اليمنية (§5) — قيم مسموحة لـ location / city */
export const KNZ_YEMEN_CITY_KEYS = [
  'surfaces.صنعاء',
  'surfaces.عدن',
  'surfaces.تعز',
  'surfaces.إب',
  'surfaces.الحديدة',
  'surfaces.ذمار',
  'surfaces.المكلا',
  'surfaces.سيئون',
  'surfaces.عمران',
  'surfaces.البيضاء',
  'surfaces.الجوف',
  'surfaces.المحويت',
  'surfaces.حجة',
  'surfaces.مأرب',
  'surfaces.ريمة',
  'surfaces.صعدة',
  'surfaces.أبين',
  'surfaces.الضالع',
  'surfaces.المهرة',
  'surfaces.حضرموت',
  'surfaces.أرخبيل_سقطرى',
  'surfaces.لحج',
  'surfaces.شبوة',
] as const;

/** مدن يمنية (قيم للعرض — استخدم t(KNZ_YEMEN_CITY_KEYS[i]) للترجمة). يُصدَّر للتوافق مع الشاشات التي تستخدمه. */
export const KNZ_YEMEN_CITIES: readonly string[] = KNZ_YEMEN_CITY_KEYS;

/** أحياء/مناطق اختيارية لكل مدينة (مرجع KNZ_OPENSOOQ_YEMENMAZAD_ANALYSIS — فلترة حي). قائمة ثابتة حتى توفر knz_areas_by_city. */
export const KNZ_AREAS_BY_CITY_KEYS: Record<string, readonly string[]> = {
  صنعاء: [
    'جدر',
    'الاصبحي',
    'الجراف الشرقي',
    'surfaces.الجراف_الغربي',
    'surfaces.حي_الثورة',
    'surfaces.حي_الزهراء',
  ],
  عدن: [
    'الدرين',
    'شيخ عثمان',
    'surfaces.كريتر',
    'surfaces.مديرية_البريقه',
    'surfaces.المعلا',
    'surfaces.التواهي',
  ],
  تعز: [
    'مديرية التعزية',
    'surfaces.المدينة',
    'surfaces.الراهدة',
    'surfaces.القاهرة',
  ],
  إب: [
    'surfaces.السائلة',
    'surfaces.الظهار',
    'surfaces.القاعده',
    'surfaces.سبأ',
  ],
};

/** نوع العرض (يمن مزاد / OpenSooq) — للبيع، للإيجار، خدمة، مطلوب. مرجع: KNZ_ADDITIONS_RECOMMENDATIONS 1.3 */
export const KNZ_LISTING_TYPES = [
  { code: 'sale', labelKey: 'surfaces.للبيع', labelAr: 'للبيع' },
  { code: 'rent', labelKey: 'surfaces.للإيجار', labelAr: 'للإيجار' },
  { code: 'service', labelKey: 'surfaces.خدمة', labelAr: 'خدمة' },
  { code: 'wanted', labelKey: 'surfaces.مطلوب', labelAr: 'مطلوب' },
] as const;

export type KnzCategoryCode = (typeof KNZ_CATEGORIES)[number]['code'];
export type KnzCityKey = (typeof KNZ_YEMEN_CITY_KEYS)[number];
export type KnzListingTypeCode = (typeof KNZ_LISTING_TYPES)[number]['code'];
