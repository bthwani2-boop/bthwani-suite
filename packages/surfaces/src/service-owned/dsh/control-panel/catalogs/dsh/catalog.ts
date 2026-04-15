export type DshCatalogNodeKind = 'main-category' | 'sub-category' | 'approved-product';
export type DshCatalogApprovalStage = 'catalog-controlled' | 'partner-review' | 'marketing-review' | 'published';

export type DshCatalogNode = {
  id: string;
  label: string;
  kind: DshCatalogNodeKind;
  stage: DshCatalogApprovalStage;
  owner: 'catalog' | 'partner' | 'marketing';
  summary: string;
  countLabel: string;
};

export type DshCatalogPipelineStep = {
  id: string;
  title: string;
  description: string;
  statusLabel: string;
};

export const dshCatalogMetrics = {
  mainCategories: 6,
  subCategories: 14,
  approvedProducts: 28,
  pendingPartnerReviews: 4,
  pendingMarketingReviews: 2,
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
  },
  {
    id: 'cat-groceries',
    label: 'المقاضي',
    kind: 'main-category',
    stage: 'catalog-controlled',
    owner: 'catalog',
    summary: 'الفئات الفرعية تظل تحت الكتالوج حتى لو أُضيفت المنتجات من الحقل.',
    countLabel: '4 فروع',
  },
  {
    id: 'cat-cafes',
    label: 'المقاهي',
    kind: 'main-category',
    stage: 'catalog-controlled',
    owner: 'catalog',
    summary: 'تصنيف رئيسي جاهز للمراجعة والتوسعة فقط من لوحة التحكم.',
    countLabel: '3 فروع',
  },
  {
    id: 'cat-partner-intake',
    label: 'منتجات الشركاء المراجعة',
    kind: 'approved-product',
    stage: 'partner-review',
    owner: 'partner',
    summary: 'المنتجات التي وصلت من الشريك وتنتظر اعتماد البوابة الأولى.',
    countLabel: '4 عناصر',
  },
  {
    id: 'cat-marketing-intake',
    label: 'منتجات التسويق المعلقة',
    kind: 'approved-product',
    stage: 'marketing-review',
    owner: 'marketing',
    summary: 'العناصر التي اجتازت مراجعة الشركاء وتنتظر العرض التسويقي النهائي.',
    countLabel: '2 عنصران',
  },
  {
    id: 'cat-published',
    label: 'العناصر المنشورة',
    kind: 'approved-product',
    stage: 'published',
    owner: 'catalog',
    summary: 'كل ما وصل إلى الكتالوج النهائي وظهر لكل الشركاء.',
    countLabel: '28 منتجًا',
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
