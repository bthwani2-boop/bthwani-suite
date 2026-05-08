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

export type CatalogSourceSurface = 'client' | 'partner' | 'marketing' | 'field' | 'catalog';

export type CatalogSurfaceAvailability = 'client' | 'partner' | 'marketing' | 'field';

export type CatalogQuickEntryMode =
  | 'search-name'
  | 'barcode-gtin'
  | 'csv-excel-batch'
  | 'partner-menu-import'
  | 'field-suggestion'
  | 'duplicate-resolution';

export type CatalogSubClassification = {
  id: string;
  label: string;
};

export type CatalogMainClassification = {
  id: string;
  label: string;
  subClassifications?: CatalogSubClassification[];
};

export type CatalogSubCategory = {
  id: string;
  label: string;
  subtitle: string;
  mainClassifications?: CatalogMainClassification[];
};

export type CatalogCategoryMode = 'catalog-based' | 'manual-order';

export type CatalogMainCategory = {
  id: string;
  label: string;
  subtitle: string;
  subcategories: CatalogSubCategory[];
  emojiFallback: string;
  defaultMediaPolicy: CatalogMediaPolicy;
  renderMode?: 'stores' | 'manual-order';
  categoryMode?: CatalogCategoryMode;
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
  categoryPath: {
    main: string;
    sub?: string;
    mainClassification?: string;
    subClassification?: string;
  };
  price: number;
  mediaPolicy: CatalogMediaPolicy;
  approvalStage: CatalogApprovalStage;
  sourceSurface: CatalogSourceSurface;
  surfaces: CatalogSurfaceAvailability[];
  imageUri?: string;
  emojiFallback?: string;
  partnerOverrides?: CatalogPartnerOverride[];
  conflictReason?: string;
  categoryType?: string; // e.g. product, service
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
    categoryMode: 'catalog-based',
    subcategories: [
      {
        id: 'res_meals', label: 'وجبات', subtitle: '',
        mainClassifications: [
          { id: 'burger', label: 'برجر' },
          { id: 'grill', label: 'مشويات' },
          { id: 'pasta', label: 'باستا' }
        ]
      }
    ]
  },
  {
    id: 'grocery', label: 'مقاضي', subtitle: 'سوبر ماركت مواد غذائية', emojiFallback: '🛒', defaultMediaPolicy: 'catalog-owned-media',
    categoryMode: 'catalog-based',
    subcategories: [
      { id: 'grocery_dairy', label: 'ألبان', subtitle: 'منتجات الألبان والأجبان' },
      { id: 'grocery_bakeries', label: 'مخابز', subtitle: 'خبز ومعجنات' },
      { id: 'grocery_vegetables_fruits', label: 'خضار وفواكه', subtitle: 'منتجات طازجة' },
      { id: 'grocery_beverages', label: 'مشروبات', subtitle: 'مشروبات غازية وعصائر معلبة' },
    ]
  },
  {
    id: 'sweets_juices', label: 'حلا وعصائر', subtitle: 'عصائر طازجة وحلويات', emojiFallback: '🧃', defaultMediaPolicy: 'partner-owned-exception',
    categoryMode: 'catalog-based',
    subcategories: [
      { id: 'cake', label: 'كيك', subtitle: 'كيك ومخبوزات' },
      { id: 'fresh_juices', label: 'عصائر', subtitle: 'عصائر طازجة' },
      { id: 'sweets', label: 'حلويات', subtitle: 'حلويات شرقية وغربية' },
    ]
  },
  {
    id: 'honey_dates', label: 'عسل وتمور', subtitle: 'منتجات طبيعية', emojiFallback: '🍯', defaultMediaPolicy: 'catalog-owned-media',
    categoryMode: 'catalog-based',
    subcategories: [
      { id: 'honey', label: 'عسل', subtitle: 'عسل طبيعي' },
      { id: 'dates', label: 'تمور', subtitle: 'تمور فاخرة' },
      { id: 'gifts', label: 'هدايا', subtitle: 'باقات هدايا' }
    ]
  },
  {
    id: 'electronics', label: 'إلكترونيات', subtitle: 'أجهزة واكسسوارات', emojiFallback: '📱', defaultMediaPolicy: 'catalog-owned-media',
    categoryMode: 'catalog-based',
    subcategories: [
      { id: 'phones', label: 'جوالات', subtitle: 'أجهزة الجوال' },
      { id: 'accessories', label: 'إكسسوارات', subtitle: 'إكسسوارات الجوال' }
    ]
  },
  {
    id: 'spare_parts', label: 'قطع غيار', subtitle: 'مستلزمات سيارات', emojiFallback: '🔧', defaultMediaPolicy: 'catalog-owned-media',
    categoryMode: 'catalog-based',
    subcategories: [
      { id: 'oils', label: 'زيوت', subtitle: 'زيوت محركات' },
      { id: 'batteries', label: 'بطاريات', subtitle: 'بطاريات سيارات' },
      { id: 'tires', label: 'إطارات', subtitle: 'كفرات' }
    ]
  },
  { id: 'awnak', label: 'عونك', subtitle: 'خدمات ومشاوير', emojiFallback: '🤝', defaultMediaPolicy: 'catalog-owned-media', subcategories: [], renderMode: 'manual-order', categoryMode: 'manual-order' },
  { id: 'shein', label: 'شي ان', subtitle: 'طلبات من شي إن', emojiFallback: '🛍️', defaultMediaPolicy: 'catalog-owned-media', subcategories: [], renderMode: 'manual-order', categoryMode: 'manual-order' }
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
    sourceSurface: 'catalog',
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
    categoryPath: { main: 'grocery', sub: 'grocery_dairy' },
    price: 11.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'field',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/products/milk.v1.png',
    emojiFallback: '🥛',
  },
  {
    id: 'prd-grocery-bread',
    name: 'خبز قمح كامل',
    sku: 'BTH-GRO-BK-003',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'grocery', sub: 'grocery_bakeries' },
    price: 7.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    imageUri: '/dsh/media-fixtures/products/bread.v1.png',
    emojiFallback: '🍞',
  },
  {
    id: 'prd-restaurant-chicken',
    name: 'دجاج مشوي مع بطاطس',
    sku: 'BTH-RES-001',
    measurementUnit: '1 وجبة',
    categoryPath: { main: 'restaurants', sub: 'res_meals', mainClassification: 'grill' },
    price: 34.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    sourceSurface: 'partner',
    surfaces: ['client', 'partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/restaurants/chicken.v1.png',
    emojiFallback: '🍗',
    partnerOverrides: [
      { partnerId: 'store-1003', price: 34.00, preparationTime: '18-22 دقيقة' }
    ]
  },
  {
    id: 'prd-restaurant-burger',
    name: 'برجر لحم كلاسيك',
    sku: 'BTH-RES-002',
    measurementUnit: '1 وجبة',
    categoryPath: { main: 'restaurants', sub: 'res_meals', mainClassification: 'burger' },
    price: 25.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'marketing-review',
    sourceSurface: 'partner',
    surfaces: ['partner', 'marketing'],
    emojiFallback: '🍔',
    partnerOverrides: [
      { partnerId: 'store-1004', price: 25.00 }
    ]
  },
  {
    id: 'prd-restaurant-pasta',
    name: 'باستا ألفريدو',
    sku: 'BTH-RES-003',
    measurementUnit: '1 وجبة',
    categoryPath: { main: 'restaurants', sub: 'res_meals', mainClassification: 'pasta' },
    price: 35.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    sourceSurface: 'partner',
    surfaces: ['client', 'partner'],
    emojiFallback: '🍝',
  },
  {
    id: 'prd-sweets-cake',
    name: 'شريحة شوكولاتة',
    sku: 'BTH-SWT-001',
    measurementUnit: '1 شريحة',
    categoryPath: { main: 'sweets_juices', sub: 'cake' },
    price: 14.00,
    mediaPolicy: 'partner-proposed-review',
    approvalStage: 'marketing-review',
    sourceSurface: 'partner',
    surfaces: ['partner', 'marketing'],
    imageUri: '/dsh/media-fixtures/sweets/choco.v1.png',
    emojiFallback: '🍰',
  },
  {
    id: 'prd-sweets-juice',
    name: 'عصير برتقال طازج',
    sku: 'BTH-SWT-002',
    measurementUnit: '1 كوب',
    categoryPath: { main: 'sweets_juices', sub: 'fresh_juices' },
    price: 12.00,
    mediaPolicy: 'partner-owned-exception',
    approvalStage: 'client-visible',
    sourceSurface: 'partner',
    surfaces: ['client', 'partner'],
    emojiFallback: '🧃',
  },
  {
    id: 'prd-dates-box',
    name: 'علبة تمر فاخر',
    sku: 'BTH-DAT-001',
    gtin: '6280001055001',
    measurementUnit: '1 علبة',
    categoryPath: { main: 'honey_dates', sub: 'dates' },
    price: 55.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'marketing-review',
    sourceSurface: 'catalog',
    surfaces: ['partner', 'marketing', 'field'],
    imageUri: '/dsh/media-fixtures/dates/lead-5.dates-box.v1.png',
    emojiFallback: '🌴',
  },
  {
    id: 'prd-honey-jar',
    name: 'عسل سدر جبلي',
    sku: 'BTH-DAT-002',
    measurementUnit: '1 كيلو',
    categoryPath: { main: 'honey_dates', sub: 'honey' },
    price: 250.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🍯',
  },
  {
    id: 'prd-electronics-iphone',
    name: 'ايفون 15 برو ماكس',
    sku: 'BTH-ELE-001',
    gtin: '194253100010',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'electronics', sub: 'phones' },
    price: 4500.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner', 'marketing'],
    emojiFallback: '📱',
  },
  {
    id: 'prd-electronics-charger',
    name: 'شاحن سريع 20W',
    sku: 'BTH-ELE-002',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'electronics', sub: 'accessories' },
    price: 85.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🔌',
  },
  {
    id: 'prd-spare-oil',
    name: 'زيت محرك 5W30',
    sku: 'BTH-SPR-001',
    measurementUnit: '1 علبة',
    categoryPath: { main: 'spare_parts', sub: 'oils' },
    price: 150.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🛢️',
  },
  {
    id: 'prd-spare-battery',
    name: 'بطارية سيارة 70 امبير',
    sku: 'BTH-SPR-002',
    measurementUnit: '1 حبة',
    categoryPath: { main: 'spare_parts', sub: 'batteries' },
    price: 350.00,
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'client-visible',
    sourceSurface: 'catalog',
    surfaces: ['client', 'partner'],
    emojiFallback: '🔋',
  }
];
