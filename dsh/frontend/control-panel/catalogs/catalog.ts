export type CatalogMediaPolicy =
  | 'catalog-owned-media'
  | 'partner-owned-exception'
  | 'partner-proposed-review'
  | 'marketing-enhancement-required';

export type CatalogApprovalStage =
  | 'catalog-draft'
  | 'catalog-approved'
  | 'partner-proposed'
  | 'partner-review'
  | 'marketing-review'
  | 'catalog-adopted'
  | 'client-visible';

export type CatalogSurfaceAvailability = 'client' | 'partner' | 'marketing' | 'field';

export type CatalogQuickEntryMode =
  | 'search-name'
  | 'barcode-gtin'
  | 'csv-excel-batch'
  | 'partner-menu-import'
  | 'field-suggestion'
  | 'duplicate-resolution';

export type CatalogSubCategory = {
  id: string;
  label: string;
  subtitle: string;
};

export type CatalogMainCategory = {
  id: string;
  label: string;
  subtitle: string;
  subcategories: CatalogSubCategory[];
  emojiFallback: string;
  defaultMediaPolicy: CatalogMediaPolicy;
  renderMode?: 'stores' | 'manual-order';
};

export type CatalogPartnerOverride = {
  partnerId: string;
  price?: number;
  stock?: number;
  preparationTime?: string;
  isAvailable?: boolean;
};

export type CatalogCategoryProposal = {
  id: string;
  partnerId: string;
  proposedName: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
};

export type CatalogApprovalQueueItem = {
  id: string;
  productId: string;
  stage: CatalogApprovalStage;
  requestedBy: string;
};

export type CatalogSmartFilter = {
  id: string;
  label: string;
  count: number;
};

export type CatalogProductMaster = {
  id: string;
  name: string;
  sku: string;
  gtin?: string;
  barcode?: string;
  measurementUnit?: string;
  categoryPath: { main: string; sub?: string };
  price: number;
  mediaPolicy: CatalogMediaPolicy;
  approvalStage: CatalogApprovalStage;
  surfaces: CatalogSurfaceAvailability[];
  imageUri?: string;
  emojiFallback?: string;
  partnerOverrides?: CatalogPartnerOverride[];
  conflictReason?: string;
};

export const dshCatalogMetrics = {
  mainCategories: 13,
  subCategories: 24,
  approvedProducts: 14500,
  pendingPartnerReviews: 42,
  pendingMarketingReviews: 18,
  priceConflicts: 7,
  imageExceptions: 124,
} as const;

export const dshCatalogSmartFilters: CatalogSmartFilter[] = [
  { id: 'all', label: 'الكل', count: 14500 },
  { id: 'master', label: 'منتجات مركزية', count: 12300 },
  { id: 'partner-exception', label: 'استثناء صورة', count: 124 },
  { id: 'partner-review', label: 'مراجعة شريك', count: 42 },
  { id: 'marketing-review', label: 'مراجعة تسويق', count: 18 },
  { id: 'price-conflict', label: 'تعارض سعر', count: 7 },
  { id: 'non-matching', label: 'غير مطابق', count: 3 },
  { id: 'category-proposals', label: 'مقترحات فئات', count: 5 },
];

export const dshCatalogApprovalQueues: CatalogApprovalQueueItem[] = [
  { id: 'q-1', productId: 'prd-sweets-cake', stage: 'marketing-review', requestedBy: 'Partner 1002' },
  { id: 'q-2', productId: 'prd-review-coffee', stage: 'partner-review', requestedBy: 'Field Agent 3' },
];

export const dshCatalogCategories: CatalogMainCategory[] = [
  {
    id: 'restaurants', label: 'المطاعم', subtitle: 'طلب الوجبات والمأكولات الجاهزة', emojiFallback: '🍽️', defaultMediaPolicy: 'partner-owned-exception',
    subcategories: []
  },
  {
    id: 'grocery', label: 'مقاضي', subtitle: 'سوبر ماركت مواد غذائية', emojiFallback: '🛒', defaultMediaPolicy: 'catalog-owned-media',
    subcategories: [
      { id: 'grocery_vegetables_fruits', label: 'خضروات وفواكة', subtitle: 'منتجات طازجة' },
      { id: 'grocery_meat_fish_chicken', label: 'لحوم وأسماك ودجاج', subtitle: 'اختيارات بروتينية' },
      { id: 'grocery_roasted_spices', label: 'محامص وبهارات', subtitle: 'بهارات وتتبيلات' },
      { id: 'grocery_bakeries', label: 'مخابز', subtitle: 'خبز ومعجنات' },
      { id: 'grocery_deals_bundle', label: 'باكج عروضات', subtitle: 'سلال مجمعة' },
    ]
  },
  {
    id: 'sweets_juices', label: 'حلا وعصائر', subtitle: 'عصائر طازجة وحلويات', emojiFallback: '🧃', defaultMediaPolicy: 'partner-owned-exception',
    subcategories: [
      { id: 'sweets_juices_fresh', label: 'عصائر طازجة', subtitle: 'عصائر معصورة' },
      { id: 'sweets_juices_sweets', label: 'حلويات', subtitle: 'تحليات وكعك' },
      { id: 'sweets_juices_icecream', label: 'آيسكريم', subtitle: 'حلويات مجمدة' },
    ]
  },
  {
    id: 'anaqati', label: 'أناقتي', subtitle: 'عطور وإكسسوارات', emojiFallback: '👗', defaultMediaPolicy: 'catalog-owned-media',
    subcategories: [
      { id: 'anaqati_perfumes', label: 'عطور', subtitle: 'اختيارات عطرية' },
      { id: 'anaqati_accessories_beauty', label: 'إكسسوارات وأدوات تجميل', subtitle: 'العناية الشخصية' },
      { id: 'anaqati_clothing', label: 'ملابس', subtitle: 'ملابس يومية' },
    ]
  },
  { id: 'wani_store', label: 'بثواني ستور', subtitle: 'متجر شامل', emojiFallback: '🏪', defaultMediaPolicy: 'catalog-owned-media', subcategories: [] },
  { id: 'home_projects', label: 'مشاريع منزلية', subtitle: 'منتجات يدوية', emojiFallback: '🏠', defaultMediaPolicy: 'partner-owned-exception', subcategories: [] },
  { id: 'cloud_kitchens', label: 'مطابخ سحابية', subtitle: 'مطابخ مجهزة', emojiFallback: '🍳', defaultMediaPolicy: 'partner-owned-exception', subcategories: [] },
  { id: 'awnak', label: 'عونك', subtitle: 'خدمات ومشاوير', emojiFallback: '🤝', defaultMediaPolicy: 'catalog-owned-media', subcategories: [], renderMode: 'manual-order' },
  { id: 'gas_refill', label: 'تعبئة الغاز', subtitle: 'تعبئة وإصلاح', emojiFallback: '⛽', defaultMediaPolicy: 'catalog-owned-media', subcategories: [
    { id: 'gas_refill_refill', label: 'التعبئة', subtitle: 'تعبئة الأسطوانة' },
    { id: 'gas_refill_repair', label: 'الإصلاح', subtitle: 'صيانة وفحص' },
    { id: 'gas_refill_buy', label: 'شراء تعبئة', subtitle: 'وحدات جديدة' },
  ]},
  { id: 'shein', label: 'شي ان', subtitle: 'طلبات من شي إن', emojiFallback: '🛍️', defaultMediaPolicy: 'catalog-owned-media', subcategories: [], renderMode: 'manual-order' },
  { id: 'spare_parts', label: 'قطع غيار', subtitle: 'مستلزمات سيارات', emojiFallback: '🔧', defaultMediaPolicy: 'catalog-owned-media', subcategories: [] },
  { id: 'honey_dates', label: 'عسل وتمور', subtitle: 'منتجات طبيعية', emojiFallback: '🍯', defaultMediaPolicy: 'catalog-owned-media', subcategories: [] },
  { id: 'electronics', label: 'إلكترونيات', subtitle: 'أجهزة واكسسوارات', emojiFallback: '📱', defaultMediaPolicy: 'catalog-owned-media', subcategories: [] },
];

export const dshCatalogProducts: CatalogProductMaster[] = [
  {
    id: 'prd-grocery-apple',
    name: 'تفاح رويال غالا طازج 1 كجم',
    sku: 'BTH-GRO-FR-001',
    gtin: '6281000000012',
    measurementUnit: '1 كجم',
    categoryPath: { main: 'grocery', sub: 'grocery_vegetables_fruits' },
    price: 18.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing', 'field'],
    imageUri: '/dsh/media-fixtures/products/apple.v1.png',
    emojiFallback: '🍎',
  },
  {
    id: 'prd-grocery-milk',
    name: 'حليب عضوي 1.5 لتر',
    sku: 'BTH-GRO-DA-002',
    gtin: '6281000000029',
    measurementUnit: '1.5 لتر',
    categoryPath: { main: 'grocery' },
    price: 11.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/products/milk.v1.png',
    emojiFallback: '🥛',
  },
  {
    id: 'prd-bakery-bread',
    name: 'خبز قمح كامل',
    sku: 'BTH-GRO-BK-003',
    gtin: '6281000000036',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'grocery', sub: 'grocery_bakeries' },
    price: 7.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing', 'field'],
    imageUri: '/dsh/media-fixtures/products/bread.v1.png',
    emojiFallback: '🍞',
  },
  {
    id: 'prd-grocery-yogurt',
    name: 'زبادي يوناني',
    sku: 'BTH-GRO-DA-004',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'grocery' },
    price: 8.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/products/yogurt.v1.png',
    emojiFallback: '🥣',
  },
  {
    id: 'prd-grocery-bananas',
    name: 'موز طازج',
    sku: 'BTH-GRO-FR-005',
    measurementUnit: '1 كجم',
    categoryPath: { main: 'grocery', sub: 'grocery_vegetables_fruits' },
    price: 12.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing', 'field'],
    imageUri: '/dsh/media-fixtures/products/bananas.v1.png',
    emojiFallback: '🍌',
  },
  {
    id: 'prd-bakery-croissant',
    name: 'كرواسون زبدة',
    sku: 'BTH-GRO-BK-006',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'grocery', sub: 'grocery_bakeries' },
    price: 9.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/products/croissant.v1.png',
    emojiFallback: '🥐',
  },
  {
    id: 'prd-restaurant-chicken',
    name: 'دجاج مشوي مع بطاطس',
    sku: 'BTH-RES-001',
    measurementUnit: '1 وجبة',
    categoryPath: { main: 'restaurants' },
    price: 34.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/restaurants/chicken.v1.png',
    emojiFallback: '🍗',
    partnerOverrides: [
      { partnerId: 'store-1003', price: 34.00, preparationTime: '18-22 دقيقة' }
    ]
  },
  {
    id: 'prd-restaurant-pasta',
    name: 'باستا كريمية',
    sku: 'BTH-RES-002',
    measurementUnit: '1 وجبة',
    categoryPath: { main: 'restaurants' },
    price: 29.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/restaurants/pasta.v1.png',
    emojiFallback: '🍝',
    partnerOverrides: [
      { partnerId: 'store-1003', price: 29.00, preparationTime: '20-25 دقيقة' }
    ]
  },
  {
    id: 'prd-healthy-salad',
    name: 'سلطة جاردن',
    sku: 'BTH-RES-003',
    measurementUnit: '1 طبق',
    categoryPath: { main: 'restaurants' },
    price: 21.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/restaurants/salad.v1.png',
    emojiFallback: '🥗',
  },
  {
    id: 'prd-sweets-cake',
    name: 'شريحة شوكولاتة',
    sku: 'BTH-SWT-001',
    measurementUnit: '1 شريحة',
    categoryPath: { main: 'sweets_juices', sub: 'sweets_juices_sweets' },
    price: 14.00,
    mediaPolicy: 'partner-proposed-review',
    approvalStage: 'marketing-review',
    surfaces: ['partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/sweets/choco.v1.png',
    emojiFallback: '🍰',
  },
  {
    id: 'prd-dates-box',
    name: 'علبة تمر فاخر',
    sku: 'BTH-DAT-001',
    gtin: '6280001055001',
    measurementUnit: '1 علبة',
    categoryPath: { main: 'honey_dates' },
    price: 55.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'marketing-review',
    surfaces: ['partner', 'marketing', 'field'],
    imageUri: '/dsh/media-fixtures/dates/lead-5.dates-box.v1.png',
    emojiFallback: '🌴',
  },
  {
    id: 'prd-conflict-oil',
    name: 'زيت طبخ 1.5 لتر',
    sku: 'BTH-GRO-005',
    gtin: '6281000000043',
    measurementUnit: '1.5 لتر',
    categoryPath: { main: 'grocery' },
    price: 15.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'catalog-adopted',
    surfaces: ['partner', 'field'],
    emojiFallback: '🛢️',
    partnerOverrides: [
      { partnerId: 'store-1005', price: 19.50 }
    ],
    conflictReason: 'تجاوز الشريك السعر المرجعي بنسبة تزيد عن 20%'
  },
  {
    id: 'prd-review-coffee',
    name: 'قهوة مختصة برزيلي 250جم',
    sku: 'BTH-CAF-002',
    measurementUnit: '250 جم',
    categoryPath: { main: 'restaurants' },
    price: 65.00,
    mediaPolicy: 'marketing-enhancement-required',
    approvalStage: 'partner-review',
    surfaces: ['partner', 'marketing'],
    emojiFallback: '☕',
  },
];
