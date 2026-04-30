export type DshCategorySubcategoryFixture = {
  id: string;
  label: string;
  subtitle: string;
};

export type DshCategoryFixture = {
  id: string;
  label: string;
  subtitle: string;
  subcategories: DshCategorySubcategoryFixture[];
  renderMode?: 'stores' | 'manual-order';
};

export const dshCategoryFixtures: DshCategoryFixture[] = [
  {
    id: 'restaurants',
    label: 'المطاعم',
    subtitle: 'طلب الوجبات والمأكولات الجاهزة من المطاعم والكافتيريات',
    subcategories: [],
  },
  {
    id: 'grocery',
    label: 'مقاضي',
    subtitle: 'سوبر ماركت: مواد غذائية وتموينية كل الاحتيجات اليومية',
    subcategories: [
      { id: 'grocery_vegetables_fruits', label: 'خضروات وفواكة', subtitle: 'منتجات طازجة ومبردة' },
      { id: 'grocery_meat_fish_chicken', label: 'لحوم وأسماك ودجاج', subtitle: 'اختيارات بروتينية ومبردة' },
      { id: 'grocery_roasted_spices', label: 'محامص وبهارات', subtitle: 'بهارات وتتبيلات للمطبخ' },
      { id: 'grocery_bakeries', label: 'مخابز', subtitle: 'خبز ومعجنات وخبز يومي' },
      { id: 'grocery_deals_bundle', label: 'باكج عروضات', subtitle: 'سلال مجمعة وعروض موسمية' },
    ],
  },
  {
    id: 'sweets_juices',
    label: 'حلا وعصائر',
    subtitle: 'عصائر طازجة وحلويات وآيسكريم',
    subcategories: [
      { id: 'sweets_juices_fresh', label: 'عصائر طازجة', subtitle: 'عصائر معصورة ومخلوطة' },
      { id: 'sweets_juices_sweets', label: 'حلويات', subtitle: 'تحليات وكعك ومعجنات' },
      { id: 'sweets_juices_icecream', label: 'آيسكريم', subtitle: 'حلويات مجمدة وأحواض' },
    ],
  },
  {
    id: 'anaqati',
    label: 'أناقتي',
    subtitle: 'عطور، إكسسوارات، وملابس',
    subcategories: [
      { id: 'anaqati_perfumes', label: 'عطور', subtitle: 'اختيارات عطرية وروائح' },
      { id: 'anaqati_accessories_beauty', label: 'إكسسوارات وأدوات تجميل', subtitle: 'العناية الشخصية وأدوات الجمال' },
      { id: 'anaqati_clothing', label: 'ملابس', subtitle: 'ملابس وإطلالات يومية' },
    ],
  },
  {
    id: 'wani_store',
    label: 'بثواني ستور',
    subtitle: 'متجر شامل للمنتجات المختارة بعناية',
    subcategories: [],
  },
  {
    id: 'home_projects',
    label: 'مشاريع منزلية',
    subtitle: 'منتجات يدوية ومحلية من الأسر المنتجة',
    subcategories: [],
  },
  {
    id: 'cloud_kitchens',
    label: 'مطابخ سحابية',
    subtitle: 'مطابخ مجهزة ووجبات يومية سريعة',
    subcategories: [],
  },
  {
    id: 'awnak',
    label: 'عونك',
    subtitle: 'خدمات ومشاوير محلية',
    subcategories: [],
    renderMode: 'manual-order',
  },
  {
    id: 'gas_refill',
    label: 'تعبئة الغاز',
    subtitle: 'تعبئة، إصلاح، وشراء',
    subcategories: [
      { id: 'gas_refill_refill', label: 'التعبئة', subtitle: 'تعبئة الأسطوانة والتوصيل' },
      { id: 'gas_refill_repair', label: 'الإصلاح', subtitle: 'صيانة وفحص سلامة' },
      { id: 'gas_refill_buy', label: 'شراء تعبئة', subtitle: 'وحدات جديدة وتبديل' },
    ],
  },
  {
    id: 'shein',
    label: 'شي ان',
    subtitle: 'طلبات من شي إن (شراء وتوصيل)',
    subcategories: [],
    renderMode: 'manual-order',
  },
  {
    id: 'spare_parts',
    label: 'قطع غيار',
    subtitle: 'مستلزمات سيارات ودراجات',
    subcategories: [],
  },
  {
    id: 'honey_dates',
    label: 'عسل وتمور',
    subtitle: 'منتجات طبيعية يمنية',
    subcategories: [],
  },
  {
    id: 'electronics',
    label: 'إلكترونيات',
    subtitle: 'أجهزة واكسسوارات إلكترونية',
    subcategories: [],
  },
];

export const dshCategoryListFixtures = dshCategoryFixtures.map((category) => ({
  id: category.id,
  label: category.label,
  subtitle: category.subtitle,
  renderMode: category.renderMode,
  countLabel: category.subcategories.length > 0 ? `${category.subcategories.length} فئات فرعية` : 'فئة رئيسية',
}));

export function getDshCategoryFixture(categoryId: string) {
  return dshCategoryFixtures.find((category) => category.id === categoryId) ?? null;
}
export const DSH_CATEGORY_ICONS: Record<string, string> = {
  restaurants: '🍽️',
  grocery: '🛒',
  sweets_juices: '🧃',
  anaqati: '👗',
  wani_store: '🏪',
  home_projects: '🏠',
  cloud_kitchens: '🍳',
  awnak: '🤝',
  gas_refill: '⛽',
  shein: '🛍️',
  spare_parts: '🔧',
  honey_dates: '🍯',
  electronics: '📱',
};
