
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

// DATA_CENTRALIZATION_DONE: dshCatalogMetrics was previously duplicated here with stale values.
// It has been removed. The authoritative version lives in:
//   control-panel/catalogs/catalog.ts → re-exported via control-panel/catalogs/index.ts
// UI_PREVIEW_ONLY — not runtime truth, not backend source.
// Consumers should import dshCatalogMetrics from control-panel/catalogs (if in control-panel context)
// or from shared/index.ts (which re-exports the CP version below).
export { dshCatalogMetrics } from '../control-panel/catalogs/catalog';


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


// ── Inventory UI Taxonomy ────────────────────────────────────────────

export type DshCatalogDomainId =
  | 'restaurants'
  | 'grocery'
  | 'bakery'
  | 'drinks'
  | 'pharmacy'
  | 'household'
  | 'retail'
  | 'services'
  | 'other';

export type DshCatalogMainCategoryId =
  | 'meals'
  | 'drinks'
  | 'sides'
  | 'desserts'
  | 'snacks'
  | 'offers'
  | 'household'
  | 'health'
  | 'beauty'
  | 'stationery';

export type DshCatalogSubcategoryId =
  | 'burgers'
  | 'chicken'
  | 'pizza'
  | 'salads'
  | 'sandwiches'
  | 'rice-bowls'
  | 'sauces'
  | 'juices'
  | 'smoothies'
  | 'coffee'
  | 'tea'
  | 'fries'
  | 'soups'
  | 'cakes'
  | 'sweets'
  | 'ice-cream'
  | 'breads'
  | 'cleaning'
  | 'personal-care'
  | 'baby-care'
  | 'vitamins'
  | 'makeup'
  | 'pens'
  | 'notebooks';

export type DshProductFacetId =
  | 'spicy'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'sugar-free'
  | 'organic'
  | 'halal'
  | 'kids-friendly'
  | 'premium'
  | 'budget'
  | 'bestseller'
  | 'new-arrival'
  | 'seasonal'
  | 'limited-edition'
  | 'fresh'
  | 'low-stock'
  | 'unavailable'
  | 'not-linked'
  | 'client-visible'
  | 'needs-review'
  | 'private-store'
  | 'canonical'
  | 'rejected'
  | 'pending-marketing'
  | 'pending-catalog';

export const DSH_OPERATIONAL_FACETS: ReadonlyArray<DshProductFacetId> = [
  'low-stock', 'unavailable', 'not-linked', 'client-visible', 'needs-review',
  'private-store', 'canonical', 'rejected', 'pending-marketing', 'pending-catalog',
];

export function isDshOperationalFacet(f: DshProductFacetId): boolean {
  return (DSH_OPERATIONAL_FACETS as ReadonlyArray<string>).includes(f);
}

export const DSH_DOMAIN_LABELS: Record<DshCatalogDomainId, string> = {
  restaurants: 'مطاعم',
  grocery: 'بقالة',
  pharmacy: 'صيدلية',
  bakery: 'مخبوزات',
  drinks: 'مشروبات',
  household: 'منزلية',
  retail: 'تجزئة',
  services: 'خدمات',
  other: 'أخرى',
};

export const DSH_MAIN_CATEGORY_LABELS: Record<DshCatalogMainCategoryId, string> = {
  meals: 'وجبات',
  drinks: 'مشروبات',
  sides: 'إضافات',
  desserts: 'حلويات',
  snacks: 'وجبات خفيفة',
  offers: 'عروض',
  household: 'منزلية',
  health: 'صحة',
  beauty: 'جمال',
  stationery: 'قرطاسية',
};

export const DSH_SUBCATEGORY_LABELS: Record<DshCatalogSubcategoryId, string> = {
  burgers: 'برغر',
  chicken: 'دجاج',
  pizza: 'بيتزا',
  salads: 'سلطات',
  sandwiches: 'ساندويتشات',
  'rice-bowls': 'أرز وأطباق',
  sauces: 'صوصات',
  juices: 'عصائر',
  smoothies: 'سموذي',
  coffee: 'قهوة',
  tea: 'شاي',
  fries: 'بطاطس',
  soups: 'شوربات',
  cakes: 'كيك',
  sweets: 'حلويات',
  'ice-cream': 'آيس كريم',
  breads: 'خبز',
  cleaning: 'تنظيف',
  'personal-care': 'عناية شخصية',
  'baby-care': 'عناية أطفال',
  vitamins: 'فيتامينات',
  makeup: 'مكياج',
  pens: 'أقلام',
  notebooks: 'دفاتر',
};

export const DSH_PRODUCT_FACET_LABELS: Record<DshProductFacetId, string> = {
  spicy: 'حار',
  vegetarian: 'نباتي',
  vegan: 'نباتي صرف',
  'gluten-free': 'خالٍ من الغلوتين',
  'sugar-free': 'خالٍ من السكر',
  organic: 'عضوي',
  halal: 'حلال',
  'kids-friendly': 'مناسب للأطفال',
  premium: 'مميز',
  budget: 'اقتصادي',
  bestseller: 'الأكثر مبيعاً',
  'new-arrival': 'جديد',
  seasonal: 'موسمي',
  'limited-edition': 'محدود',
  fresh: 'طازج',
  'low-stock': 'منخفض المخزون',
  'unavailable': 'غير متاح',
  'not-linked': 'غير مرتبط',
  'client-visible': 'ظاهر للعميل',
  'needs-review': 'يحتاج مراجعة',
  'private-store': 'منتج خاص',
  'canonical': 'منتج مركزي',
  'rejected': 'مرفوض',
  'pending-marketing': 'انتظار التسويق',
  'pending-catalog': 'انتظار الكتالوج',
};

export function getDshTaxonomyLabel(id: string): string {
  return (
    (DSH_DOMAIN_LABELS as Record<string, string>)[id] ??
    (DSH_MAIN_CATEGORY_LABELS as Record<string, string>)[id] ??
    (DSH_SUBCATEGORY_LABELS as Record<string, string>)[id] ??
    (DSH_PRODUCT_FACET_LABELS as Record<string, string>)[id] ??
    id
  );
}

export type DshInventoryHierarchyFilter = {
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
};

export function getDshActiveFilterSummary(filter: DshInventoryHierarchyFilter): string {
  const parts: string[] = [];
  if (filter.domainId) parts.push(DSH_DOMAIN_LABELS[filter.domainId]);
  if (filter.mainCategoryId) parts.push(DSH_MAIN_CATEGORY_LABELS[filter.mainCategoryId]);
  if (filter.subcategoryId) parts.push(DSH_SUBCATEGORY_LABELS[filter.subcategoryId]);
  if (filter.facetTags?.length) {
    parts.push(...filter.facetTags.map((f) => DSH_PRODUCT_FACET_LABELS[f] ?? f));
  }
  return parts.join(' › ');
}

// ── Static taxonomy helpers ──────────────────────────────────────────

export function getDshCatalogDomains(): ReadonlyArray<DshCatalogDomainId> {
  return Object.keys(DSH_DOMAIN_LABELS) as DshCatalogDomainId[];
}

export function getDshMainCategories(): ReadonlyArray<DshCatalogMainCategoryId> {
  return Object.keys(DSH_MAIN_CATEGORY_LABELS) as DshCatalogMainCategoryId[];
}

export function getDshSubcategories(): ReadonlyArray<DshCatalogSubcategoryId> {
  return Object.keys(DSH_SUBCATEGORY_LABELS) as DshCatalogSubcategoryId[];
}

export function getDshProductFacets(): ReadonlyArray<DshProductFacetId> {
  return (Object.keys(DSH_PRODUCT_FACET_LABELS) as DshProductFacetId[]).filter(
    (f) => !isDshOperationalFacet(f),
  );
}

export type DshProductTaxonomyLabels = {
  domainLabel?: string;
  mainCategoryLabel?: string;
  subcategoryLabel?: string;
  facetLabels?: string[];
};

export function resolveDshProductTaxonomy(product: {
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
}): DshProductTaxonomyLabels {
  return {
    domainLabel: product.domainId ? DSH_DOMAIN_LABELS[product.domainId] : undefined,
    mainCategoryLabel: product.mainCategoryId ? DSH_MAIN_CATEGORY_LABELS[product.mainCategoryId] : undefined,
    subcategoryLabel: product.subcategoryId ? DSH_SUBCATEGORY_LABELS[product.subcategoryId] : undefined,
    facetLabels: product.facetTags?.map((f) => DSH_PRODUCT_FACET_LABELS[f] ?? f),
  };
}

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
