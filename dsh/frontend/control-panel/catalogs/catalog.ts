export type DshCatalogNodeKind = 'main-category' | 'sub-category' | 'approved-product';
export type DshCatalogApprovalStage = 'catalog-controlled' | 'partner-review' | 'marketing-review' | 'published';
export type DshMediaPolicy = 'catalog-owned-media' | 'partner-owned-exception' | 'review-required';

export type DshCatalogNode = {
  id: string;
  label: string;
  kind: DshCatalogNodeKind;
  stage: DshCatalogApprovalStage;
  owner: 'catalog' | 'partner' | 'marketing';
  summary: string;
  countLabel: string;
  iconUrl?: string;
  emojiFallback?: string;
};

export type DshCatalogProduct = {
  id: string;
  name: string;
  categoryLabel: string;
  sku: string;
  gtin?: string;
  price: number;
  oldPrice?: number;
  status: 'active' | 'review' | 'conflict' | 'draft';
  mediaPolicy: DshMediaPolicy;
  isMaster: boolean;
  partnerOverride?: {
    price?: number;
    stock?: number;
    preparationTime?: string;
  };
  imageUri?: string;
};

export type DshCatalogPipelineStep = {
  id: string;
  title: string;
  description: string;
  statusLabel: string;
};

export type DshCatalogMeasurementKind = 'piece' | 'weight' | 'portion';

export type DshCatalogMeasurementPolicy = {
  kind: DshCatalogMeasurementKind;
  label: string;
  options: ReadonlyArray<string>;
};

export const dshCatalogMetrics = {
  mainCategories: 6,
  subCategories: 14,
  approvedProducts: 28,
  pendingPartnerReviews: 4,
  pendingMarketingReviews: 2,
  priceConflicts: 3,
  imageExceptions: 5,
} as const;

export const dshCatalogProducts: DshCatalogProduct[] = [
  {
    id: 'prd-master-001',
    name: 'أرز بسمتي فاخر 5كجم',
    categoryLabel: 'المقاضي',
    sku: 'BTH-GRO-001',
    gtin: '6281234567890',
    price: 45.00,
    status: 'active',
    mediaPolicy: 'catalog-owned-media',
    isMaster: true,
    imageUri: 'catalog/rice-master.jpg',
  },
  {
    id: 'prd-restaurant-001',
    name: 'مندي دجاج ربع نفر',
    categoryLabel: 'المطاعم',
    sku: 'BTH-RES-001',
    price: 18.00,
    status: 'active',
    mediaPolicy: 'partner-owned-exception',
    isMaster: false,
    partnerOverride: {
      price: 20.00,
      stock: 50,
      preparationTime: '20 min',
    },
    imageUri: 'partner/mandi-custom.jpg',
  },
  {
    id: 'prd-conflict-001',
    name: 'زيت طبخ 1.5 لتر',
    categoryLabel: 'المقاضي',
    sku: 'BTH-GRO-005',
    price: 15.00,
    status: 'conflict',
    mediaPolicy: 'catalog-owned-media',
    isMaster: true,
    partnerOverride: {
      price: 19.50,
    },
  },
  {
    id: 'prd-review-001',
    name: 'قهوة مختصة برزيلي 250جم',
    categoryLabel: 'المقاهي',
    sku: 'BTH-CAF-002',
    price: 65.00,
    status: 'review',
    mediaPolicy: 'review-required',
    isMaster: true,
  },
];

export const dshCategoryMeasurementPolicies: Readonly<Record<string, DshCatalogMeasurementPolicy>> = {
  fresh: {
    kind: 'weight',
    label: 'يباع بالوزن',
    options: ['250 جرام', '500 جرام', '1 كجم'],
  },
  dairy: {
    kind: 'piece',
    label: 'يباع بالحبة',
    options: ['حبة', '2 حبة', '4 حبات'],
  },
  bakery: {
    kind: 'piece',
    label: 'يباع بالحبة',
    options: ['حبة', '2 حبة', '6 حبات'],
  },
  meals: {
    kind: 'portion',
    label: 'يباع بالنفر',
    options: ['ربع نفر', 'نصف نفر', 'نفر'],
  },
  healthy: {
    kind: 'portion',
    label: 'يباع بالنفر',
    options: ['ربع نفر', 'نصف نفر', 'نفر'],
  },
  sweets: {
    kind: 'piece',
    label: 'يباع بالحبة',
    options: ['حبة', '2 حبة', '4 حبات'],
  },
} as const;

export const dshCatalogNodes: ReadonlyArray<DshCatalogNode> = [
  {
    id: 'cat-restaurants',
    label: 'المطاعم',
    kind: 'main-category',
    stage: 'catalog-controlled',
    owner: 'catalog',
    summary: 'فئة رئيسية سيادية تُدار فقط من الكتالوج.',
    countLabel: '6 فروع',
    emojiFallback: '🍽️',
  },
  {
    id: 'cat-groceries',
    label: 'المقاضي',
    kind: 'main-category',
    stage: 'catalog-controlled',
    owner: 'catalog',
    summary: 'الفئات الفرعية تظل تحت الكتالوج حتى لو أُضيفت المنتجات من الحقل.',
    countLabel: '4 فروع',
    emojiFallback: '🛒',
  },
  {
    id: 'cat-cafes',
    label: 'المقاهي',
    kind: 'main-category',
    stage: 'catalog-controlled',
    owner: 'catalog',
    summary: 'تصنيف رئيسي جاهز للمراجعة والتوسعة فقط من لوحة التحكم.',
    countLabel: '3 فروع',
    emojiFallback: '☕',
  },
  {
    id: 'cat-partner-intake',
    label: 'منتجات الشركاء المراجعة',
    kind: 'approved-product',
    stage: 'partner-review',
    owner: 'partner',
    summary: 'المنتجات التي وصلت من الشريك وتنتظر اعتماد البوابة الأولى.',
    countLabel: '4 عناصر',
    emojiFallback: '🤝',
  },
  {
    id: 'cat-marketing-intake',
    label: 'منتجات التسويق المعلقة',
    kind: 'approved-product',
    stage: 'marketing-review',
    owner: 'marketing',
    summary: 'العناصر التي اجتازت مراجعة الشركاء وتنتظر العرض التسويقي النهائي.',
    countLabel: '2 عنصران',
    emojiFallback: '📣',
  },
  {
    id: 'cat-published',
    label: 'العناصر المنشورة',
    kind: 'approved-product',
    stage: 'published',
    owner: 'catalog',
    summary: 'كل ما وصل إلى الكتالوج النهائي وظهر لكل الشركاء.',
    countLabel: '28 منتجًا',
    emojiFallback: '✅',
  },
];

export const dshCatalogPipeline: ReadonlyArray<DshCatalogPipelineStep> = [
  {
    id: 'step-field',
    title: 'الإدخال من الميداني أو الشريك',
    description: 'تبدأ البطاقة في منطقة intake وتنزل إلى بوابة الشركاء أولًا.',
    statusLabel: 'مرحلة أولى',
  },
  {
    id: 'step-partner',
    title: 'مراجعة الشركاء',
    description: 'التحقق الأولي يثبت أن المنتج يستحق المرور إلى الخطوة التالية.',
    statusLabel: 'مراجعة أولية',
  },
  {
    id: 'step-marketing',
    title: 'مراجعة التسويق',
    description: 'بعد الاعتماد الأولي، يراجع التسويق العرض والتموضع واللغة.',
    statusLabel: 'مراجعة تسويقية',
  },
  {
    id: 'step-catalog',
    title: 'النشر في الكتالوج',
    description: 'بعد الاعتماد النهائي تظهر البطاقة بشكل واضح لكل الشركاء.',
    statusLabel: 'منشور',
  },
];
