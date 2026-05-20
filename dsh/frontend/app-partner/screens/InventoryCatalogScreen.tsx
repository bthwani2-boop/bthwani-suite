import React from 'react';
import { Image } from 'react-native';
import { getCanonicalPreviewProductCard, type DshCanonicalProductCard } from '../../shared/dshStoreProductCardModel';
import { resolveDshImageSource } from '../../shared/resolve-dsh-image-source';
import {
  type DshCatalogDomainId,
  type DshCatalogMainCategoryId,
  type DshCatalogSubcategoryId,
  type DshProductFacetId,
  DSH_DOMAIN_LABELS as DOMAIN_LABELS,
  DSH_MAIN_CATEGORY_LABELS as MAIN_CATEGORY_LABELS,
  DSH_SUBCATEGORY_LABELS as SUBCATEGORY_LABELS,
  DSH_PRODUCT_FACET_LABELS as FACET_LABELS,
} from '../../shared/catalog';
import {
  Box,
  Button,
  Chip,
  Icon,
  KeyValueList,
  MobileScrollView,
  MobileStickyPrimaryAction,
  SearchField,
  StateView,
  Surface,
  Text,
  TextField,
  TopBar,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';
import {
  type ApprovalStage,
  getPartnerQueueRecords,
  isPartnerOwnedException,
  translateOwner,
  translateStage,
  resolveNextOwner,
  canRenderInClientSurface,
} from '../../shared/workflow';


// ── Local types (screen-scoped, no new shared files needed) ──────────

type InventoryCatalogItem = {
  id: string;
  // Canonical identity — owned by catalog
  name: string;
  categoryLabel: string;
  canonicalProductId?: string;
  canonicalStoreId?: string;
  sourceRecordId?: string;
  source?: string;
  // Identity codes
  sku: string;
  gtin: string;
  barcode: string;
  manufacturerCode: string;
  // Catalog linkage
  catalogLinked: boolean;
  isCatalogOwned: boolean; // name/image/category locked
  // PHASE 1: Hierarchical browsing
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
  isPrivateStoreProduct: boolean; // true = partner-created, false = canonical
  mediaKey?: string; // resolved via resolveDshImageSource
  // Partner local override
  priceLabel: string;
  stockCount: number;
  available: boolean;
  lowStock: boolean;
  preparationNote?: string;
  internalNote?: string;
  // Approval workflow
  publishStage?: string;
  reviewNeeded: boolean;
};

type PartnerLocalOverride = {
  price: string;
  stock: string;
  available: boolean;
  preparationNote: string;
  internalNote: string;
};

// ── PHASE 2: Multi-layer filter state ────────────────────────────────

type InventoryFilterId =
  | 'all'
  | 'low-stock'
  | 'needs-review'
  | 'not-linked'
  | 'rejected'
  | 'ready'
  | 'client-visible';

type ViewMode = 'cards' | 'dense-list';

type ActiveHierarchyFilter = {
  domainId?: DshCatalogDomainId;
  mainCategoryId?: DshCatalogMainCategoryId;
  subcategoryId?: DshCatalogSubcategoryId;
  facetTags?: DshProductFacetId[];
  isPrivateStoreProduct?: boolean;
};


// ── Stage display helpers ────────────────────────────────────────────

function resolveStageChipTone(
  stage: string | undefined,
): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' {
  switch (stage) {
    case 'client-visible':
      return 'success';
    case 'catalog-adopted':
      return 'info';
    case 'marketing-approved':
    case 'marketing-review':
      return 'brand';
    case 'partner-approved':
    case 'partner-review':
    case 'partner-submitted':
    case 'field-submitted':
      return 'warning';
    case 'needs-fix':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

function resolveNextActionLabel(stage: string | undefined, available: boolean, stockCount: number): string {
  if (stage === 'rejected') return 'إصلاح سبب الرفض';
  if (stage === 'needs-fix') return 'تطبيق التعديل المطلوب';
  if (stage === 'partner-submitted' || stage === 'field-submitted') return 'بانتظار مراجعة الشركاء';
  if (stage === 'partner-review' || stage === 'partner-approved') return 'بانتظار التسويق';
  if (stage === 'marketing-review' || stage === 'marketing-approved') return 'بانتظار اعتماد الكتالوج';
  if (stage === 'catalog-adopted') return 'بانتظار التفعيل للعميل';
  if (stage === 'client-visible') {
    if (!available || stockCount === 0) return 'موقوف — راجع التوفر';
    return 'ظاهر للعميل';
  }
  if (!available || stockCount === 0) return 'تحقق من التوفر';
  return 'راجع الحالة';
}

// ── Mapping ──────────────────────────────────────────────────────────

function mapCanonicalToInventoryItem(product: DshCanonicalProductCard): InventoryCatalogItem {
  return {
    id: product.id,
    name: product.name,
    categoryLabel: product.categoryLabel,
    canonicalProductId: product.canonicalProductId,
    canonicalStoreId: product.canonicalStoreId,
    sourceRecordId: product.sourceRecordId,
    source: product.source,
    sku: product.sku ?? `CANONICAL-${product.sourceRecordId.toUpperCase()}`,
    gtin: product.gtin ?? product.id,
    barcode: product.barcode ?? product.gtin ?? product.id,
    manufacturerCode: product.manufacturerCode ?? `FIELD-${product.sourceRecordId.toUpperCase()}`,
    catalogLinked: true,
    isCatalogOwned: product.publishStage === 'catalog-adopted' || product.publishStage === 'client-visible',
    isPrivateStoreProduct: false,
    mediaKey: product.mediaKey,
    priceLabel: product.priceLabel,
    stockCount: product.stockCount ?? 0,
    available: product.isAvailable,
    lowStock: typeof product.stockCount === 'number' ? product.stockCount <= 3 : false,
    publishStage: product.publishStage,
    reviewNeeded: product.publishStage !== 'client-visible',
  };
}

const canonicalPreviewInventoryItems: readonly InventoryCatalogItem[] = (() => {
  const canonicalProduct = getCanonicalPreviewProductCard('canonical-product-field-lead-5-featured');
  return canonicalProduct ? [mapCanonicalToInventoryItem(canonicalProduct)] : [];
})();

function dedupeItems(items: ReadonlyArray<InventoryCatalogItem>) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function buildInitialItems(canonicalStoreId?: string): InventoryCatalogItem[] {
  const scopedCanonical = canonicalPreviewInventoryItems.filter(
    (item) => !canonicalStoreId || item.canonicalStoreId === canonicalStoreId,
  );

  return dedupeItems([
    {
      id: 'prod-1',
      name: 'برغر كلاسيك',
      sku: 'BL-BRG-001', gtin: '6280001000018', barcode: '6280001000018', manufacturerCode: 'MFR-CL-01',
      categoryLabel: 'برغر',
      catalogLinked: true, isCatalogOwned: true,
      domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'burgers',
      facetTags: ['bestseller', 'halal'],
      isPrivateStoreProduct: false,
      mediaKey: 'dsh.product.chicken.v1',
      reviewNeeded: false,
      available: true, lowStock: false, stockCount: 42,
      priceLabel: '18.00 ر.ي',
      publishStage: 'client-visible',
    },
    {
      id: 'prod-2',
      name: 'باول دجاج',
      sku: 'BL-BWL-014', gtin: '6280001000148', barcode: '6280001000148', manufacturerCode: 'MFR-CH-14',
      categoryLabel: 'وجبة',
      catalogLinked: true, isCatalogOwned: true,
      domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'chicken',
      facetTags: ['spicy', 'halal'],
      isPrivateStoreProduct: false,
      mediaKey: 'dsh.product.chicken.v1',
      reviewNeeded: false,
      available: true, lowStock: true, stockCount: 3,
      priceLabel: '24.50 ر.ي',
      publishStage: 'client-visible',
    },
    {
      id: 'prod-3',
      name: 'بطاطس حارة',
      sku: 'BL-SID-022', gtin: '6280001000223', barcode: '6280001000223', manufacturerCode: 'MFR-SD-22',
      categoryLabel: 'إضافات',
      catalogLinked: false, isCatalogOwned: false,
      domainId: 'restaurants', mainCategoryId: 'sides', subcategoryId: 'fries',
      facetTags: ['spicy'],
      isPrivateStoreProduct: true,
      reviewNeeded: true,
      available: true, lowStock: false, stockCount: 18,
      priceLabel: '8.00 ر.ي',
      publishStage: 'partner-submitted',
    },
    {
      id: 'prod-4',
      name: 'عصير ليمون',
      sku: 'BL-DRK-090', gtin: '6280001000902', barcode: '6280001000902', manufacturerCode: 'MFR-DR-90',
      categoryLabel: 'مشروبات',
      catalogLinked: true, isCatalogOwned: true,
      domainId: 'restaurants', mainCategoryId: 'drinks', subcategoryId: 'juices',
      facetTags: ['fresh', 'halal'],
      isPrivateStoreProduct: false,
      reviewNeeded: false,
      available: true, lowStock: true, stockCount: 2,
      priceLabel: '9.50 ر.ي',
      publishStage: 'client-visible',
    },
    {
      id: 'prod-5',
      name: 'صوص خاص',
      sku: 'BL-SAU-003', gtin: '6280001000308', barcode: '6280001000308', manufacturerCode: 'MFR-SA-03',
      categoryLabel: 'إضافات',
      catalogLinked: true, isCatalogOwned: false,
      domainId: 'restaurants', mainCategoryId: 'sides', subcategoryId: 'sauces',
      facetTags: ['premium'],
      isPrivateStoreProduct: false,
      reviewNeeded: true,
      available: true, lowStock: false, stockCount: 9,
      priceLabel: '2.50 ر.ي',
      publishStage: 'partner-review',
    },
    {
      id: 'prod-6',
      name: 'سلطة سيزر',
      sku: 'BL-SLD-044', gtin: '6280001000445', barcode: '6280001000445', manufacturerCode: 'MFR-SL-44',
      categoryLabel: 'سلطات',
      catalogLinked: false, isCatalogOwned: false,
      domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'salads',
      facetTags: ['vegetarian', 'gluten-free'],
      isPrivateStoreProduct: true,
      mediaKey: 'dsh.product.salad.v1',
      reviewNeeded: true,
      available: false, lowStock: false, stockCount: 0,
      priceLabel: '14.75 ر.ي',
      publishStage: 'partner-submitted',
    },
    {
      id: 'prod-fix-me',
      name: 'كرواسون زبدة',
      sku: 'BL-BKR-005', gtin: '6280001000551', barcode: '6280001000551', manufacturerCode: 'MFR-BKR-05',
      categoryLabel: 'مخبوزات',
      catalogLinked: true, isCatalogOwned: false,
      domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'breads',
      facetTags: ['premium', 'new-arrival'],
      isPrivateStoreProduct: false,
      mediaKey: 'dsh.product.bread.v1',
      reviewNeeded: true,
      available: true, lowStock: false, stockCount: 12,
      priceLabel: '9.00 ر.ي',
      publishStage: 'needs-fix',
      internalNote: 'يرجى تحديث صورة المنتج بدقة أعلى.',
    },
    {
      id: 'prod-rejected',
      name: 'كيكة العيد',
      sku: 'BL-SWT-099', gtin: '6280001000995', barcode: '6280001000995', manufacturerCode: 'MFR-SW-99',
      categoryLabel: 'حلويات',
      catalogLinked: false, isCatalogOwned: false,
      domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'cakes',
      facetTags: ['seasonal', 'limited-edition'],
      isPrivateStoreProduct: true,
      mediaKey: 'dsh.product.choco.v1',
      reviewNeeded: false,
      available: false, lowStock: false, stockCount: 0,
      priceLabel: '120.00 ر.ي',
      publishStage: 'rejected',
      internalNote: 'نسبة الخصم عالية جداً وتؤثر على هامش الربح.',
    },
    {
      id: 'prod-pending-mkt',
      name: 'قهوة مثلجة',
      sku: 'BL-DRK-102', gtin: '6280001001022', barcode: '6280001001022', manufacturerCode: 'MFR-DR-102',
      categoryLabel: 'مشروبات',
      catalogLinked: true, isCatalogOwned: false,
      domainId: 'restaurants', mainCategoryId: 'drinks', subcategoryId: 'coffee',
      facetTags: ['premium', 'new-arrival'],
      isPrivateStoreProduct: false,
      reviewNeeded: true,
      available: true, lowStock: false, stockCount: 25,
      priceLabel: '15.00 ر.ي',
      publishStage: 'marketing-review',
    },
    ...scopedCanonical,
  ]);
}

// ── Search dedup detection ───────────────────────────────────────────

type SearchMatchState = 'catalog-match' | 'needs-match' | 'not-in-catalog' | 'duplicate';

function detectSearchMatch(
  items: InventoryCatalogItem[],
  query: string,
): SearchMatchState {
  if (!query.trim()) return 'catalog-match';
  const q = query.trim().toLowerCase();

  const results = items.filter((item) =>
    [item.name, item.sku, item.gtin, item.barcode, item.manufacturerCode, item.categoryLabel]
      .join(' ').toLowerCase().includes(q),
  );

  if (results.length === 0) return 'not-in-catalog';

  // Check for duplicates (same sku or gtin across different ids)
  const skuSet = new Set<string>();
  const gtinSet = new Set<string>();
  let hasDupe = false;
  for (const item of results) {
    if (skuSet.has(item.sku) || gtinSet.has(item.gtin)) { hasDupe = true; break; }
    skuSet.add(item.sku);
    gtinSet.add(item.gtin);
  }
  if (hasDupe) return 'duplicate';

  if (results.some((item) => item.catalogLinked)) return 'catalog-match';
  return 'needs-match';
}

// ── Props ────────────────────────────────────────────────────────────

type InventoryCatalogContentProps = {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
  canonicalStoreId?: string;
};

export type InventoryCatalogScreenProps = InventoryCatalogContentProps & {
  onBack?: () => void;
};

// ── PHASE 2: Filter rail ──────────────────────────────────────────────

const FILTER_ITEMS: { id: InventoryFilterId; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'low-stock', label: 'منخفض' },
  { id: 'needs-review', label: 'يحتاج مراجعة' },
  { id: 'not-linked', label: 'غير مرتبط' },
  { id: 'rejected', label: 'مرفوض' },
  { id: 'ready', label: 'جاهز للنشر' },
  { id: 'client-visible', label: 'ظاهر للعميل' },
];

function applyFilter(items: InventoryCatalogItem[], filterId: InventoryFilterId): InventoryCatalogItem[] {
  switch (filterId) {
    case 'low-stock': return items.filter((item) => item.lowStock);
    case 'needs-review': return items.filter((item) => item.reviewNeeded);
    case 'not-linked': return items.filter((item) => !item.catalogLinked);
    case 'rejected': return items.filter((item) => item.publishStage === 'rejected');
    case 'ready': return items.filter((item) => item.publishStage === 'catalog-adopted');
    case 'client-visible': return items.filter((item) => canRenderInClientSurface(item.publishStage, 'product'));
    default: return items;
  }
}

// ── PHASE 2: Hierarchical filter helpers ─────────────────────────────

function applyHierarchyFilter(
  items: InventoryCatalogItem[],
  hierarchy: ActiveHierarchyFilter,
): InventoryCatalogItem[] {
  return items.filter((item) => {
    if (hierarchy.domainId && item.domainId !== hierarchy.domainId) return false;
    if (hierarchy.mainCategoryId && item.mainCategoryId !== hierarchy.mainCategoryId) return false;
    if (hierarchy.subcategoryId && item.subcategoryId !== hierarchy.subcategoryId) return false;
    if (hierarchy.isPrivateStoreProduct !== undefined && item.isPrivateStoreProduct !== hierarchy.isPrivateStoreProduct) return false;
    if (hierarchy.facetTags?.length) {
      const hasAllFacets = hierarchy.facetTags.every((f) => item.facetTags?.includes(f));
      if (!hasAllFacets) return false;
    }
    return true;
  });
}

function getAvailableDomains(items: InventoryCatalogItem[]): DshCatalogDomainId[] {
  const seen = new Set<DshCatalogDomainId>();
  items.forEach((item) => { if (item.domainId) seen.add(item.domainId); });
  return Array.from(seen);
}

function getAvailableMainCategories(items: InventoryCatalogItem[], domainId?: DshCatalogDomainId): DshCatalogMainCategoryId[] {
  const seen = new Set<DshCatalogMainCategoryId>();
  items.forEach((item) => {
    if (item.mainCategoryId && (!domainId || item.domainId === domainId)) seen.add(item.mainCategoryId);
  });
  return Array.from(seen);
}

function getAvailableSubcategories(
  items: InventoryCatalogItem[],
  domainId?: DshCatalogDomainId,
  mainCategoryId?: DshCatalogMainCategoryId,
): DshCatalogSubcategoryId[] {
  const seen = new Set<DshCatalogSubcategoryId>();
  items.forEach((item) => {
    if (item.subcategoryId && (!domainId || item.domainId === domainId) && (!mainCategoryId || item.mainCategoryId === mainCategoryId)) {
      seen.add(item.subcategoryId);
    }
  });
  return Array.from(seen);
}

function getAvailableFacets(items: InventoryCatalogItem[]): DshProductFacetId[] {
  const seen = new Set<DshProductFacetId>();
  items.forEach((item) => { item.facetTags?.forEach((f) => seen.add(f)); });
  return Array.from(seen);
}

// ── PHASE 2: Hierarchy filter rail component ─────────────────────────

function HierarchyFilterRail({
  hierarchy,
  onChange,
  items,
}: {
  hierarchy: ActiveHierarchyFilter;
  onChange: (update: Partial<ActiveHierarchyFilter>) => void;
  items: InventoryCatalogItem[];
}) {
  const { direction } = useDirection();
  const availableDomains = getAvailableDomains(items);
  const availableMainCategories = getAvailableMainCategories(items, hierarchy.domainId);
  const availableSubcategories = getAvailableSubcategories(items, hierarchy.domainId, hierarchy.mainCategoryId);
  const availableFacets = getAvailableFacets(items);

  const hasActiveFilters = hierarchy.domainId || hierarchy.mainCategoryId || hierarchy.subcategoryId || hierarchy.facetTags?.length;

  return (
    <Surface tone="inset" padding={2} gap={2} border={false}>
      {/* Domain rail */}
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 4 }}>
        <Chip
          label="الكل"
          tone={!hierarchy.domainId ? 'brand' : 'default'}
          selected={!hierarchy.domainId}
          onPress={() => onChange({ domainId: undefined, mainCategoryId: undefined, subcategoryId: undefined })}
        />
        {availableDomains.map((d) => (
          <Chip
            key={d}
            label={DOMAIN_LABELS[d]}
            tone={hierarchy.domainId === d ? 'brand' : 'default'}
            selected={hierarchy.domainId === d}
            onPress={() => onChange({ domainId: d, mainCategoryId: undefined, subcategoryId: undefined })}
          />
        ))}
      </Box>

      {/* Main category rail */}
      {hierarchy.domainId && availableMainCategories.length > 0 ? (
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 4 }}>
          <Chip
            label="الكل"
            tone={!hierarchy.mainCategoryId ? 'brand' : 'default'}
            selected={!hierarchy.mainCategoryId}
            onPress={() => onChange({ mainCategoryId: undefined, subcategoryId: undefined })}
          />
          {availableMainCategories.map((mc) => (
            <Chip
              key={mc}
              label={MAIN_CATEGORY_LABELS[mc]}
              tone={hierarchy.mainCategoryId === mc ? 'brand' : 'default'}
              selected={hierarchy.mainCategoryId === mc}
              onPress={() => onChange({ mainCategoryId: mc, subcategoryId: undefined })}
            />
          ))}
        </Box>
      ) : null}

      {/* Subcategory rail */}
      {hierarchy.mainCategoryId && availableSubcategories.length > 0 ? (
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 4 }}>
          <Chip
            label="الكل"
            tone={!hierarchy.subcategoryId ? 'brand' : 'default'}
            selected={!hierarchy.subcategoryId}
            onPress={() => onChange({ subcategoryId: undefined })}
          />
          {availableSubcategories.map((sc) => (
            <Chip
              key={sc}
              label={SUBCATEGORY_LABELS[sc]}
              tone={hierarchy.subcategoryId === sc ? 'brand' : 'default'}
              selected={hierarchy.subcategoryId === sc}
              onPress={() => onChange({ subcategoryId: sc })}
            />
          ))}
        </Box>
      ) : null}

      {/* Facet chips */}
      {availableFacets.length > 0 ? (
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 4 }}>
          {availableFacets.map((facet) => {
            const isActive = hierarchy.facetTags?.includes(facet);
            return (
              <Chip
                key={facet}
                label={FACET_LABELS[facet]}
                tone={isActive ? 'brand' : 'default'}
                selected={isActive}
                onPress={() => {
                  const current = hierarchy.facetTags ?? [];
                  const next = isActive
                    ? current.filter((f) => f !== facet)
                    : [...current, facet];
                  onChange({ facetTags: next.length ? next : undefined });
                }}
              />
            );
          })}
        </Box>
      ) : null}

      {/* Active filter summary + clear */}
      {hasActiveFilters ? (
        <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between' }}>
          <Text role="caption" tone="muted">
            {[
              hierarchy.domainId ? DOMAIN_LABELS[hierarchy.domainId] : null,
              hierarchy.mainCategoryId ? MAIN_CATEGORY_LABELS[hierarchy.mainCategoryId] : null,
              hierarchy.subcategoryId ? SUBCATEGORY_LABELS[hierarchy.subcategoryId] : null,
              hierarchy.facetTags?.length ? `${hierarchy.facetTags.length} خاصية` : null,
            ].filter(Boolean).join(' › ')}
          </Text>
          <Button
            label="مسح"
            size="sm"
            tone="secondary"
            fullWidth={false}
            onPress={() => onChange({ domainId: undefined, mainCategoryId: undefined, subcategoryId: undefined, facetTags: undefined })}
          />
        </Box>
      ) : null}
    </Surface>
  );
}

// ── Help block (collapsible) ──────────────────────────────────────────

function HelpBlock() {
  const [open, setOpen] = React.useState(false);
  const { direction } = useDirection();

  return (
    <Surface tone="inset" padding={3} gap={2} border={false}>
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="bodySm" tone="muted">كيف أضيف منتجاً؟</Text>
        <Button
          label={open ? 'إخفاء' : 'عرض الخطوات'}
          size="sm"
          tone="secondary"
          fullWidth={false}
          onPress={() => setOpen((v) => !v)}
        />
      </Box>
      {open ? (
        <Box gap={2}>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>١. ابحث أولاً بـ SKU أو GTIN أو الباركود أو الاسم.</Text>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>٢. طابق مع المنتج القياسي في الكتالوج المركزي.</Text>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>٣. عدّل السعر والتوفر والمخزون محلياً فقط.</Text>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>٤. أرسل للمراجعة إذا المنتج غير موجود في الكتالوج.</Text>
        </Box>
      ) : null}
    </Surface>
  );
}

// ── Inline local edit block ───────────────────────────────────────────

function InlineLocalEdit({
  item,
  override,
  onChange,
  onApply,
}: {
  item: InventoryCatalogItem;
  override: PartnerLocalOverride;
  onChange: (field: keyof PartnerLocalOverride, value: string | boolean) => void;
  onApply: () => void;
}) {
  const { direction } = useDirection();
  const isRejected = item.publishStage === 'rejected';
  const isNeedsFix = item.publishStage === 'needs-fix';

  return (
    <Surface tone="inset" padding={3} gap={3} border={false}>
      {item.isCatalogOwned ? (
        <Surface tone="info" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="info" align={direction === 'rtl' ? 'end' : 'start'}>
            الاسم والصورة والفئة من الكتالوج المركزي — لا يمكن تعديلها.
          </Text>
        </Surface>
      ) : null}

      {isNeedsFix && item.internalNote ? (
        <Surface tone="warning" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="warning" align={direction === 'rtl' ? 'end' : 'start'}>
            التعديل المطلوب: {item.internalNote}
          </Text>
        </Surface>
      ) : null}

      {isRejected ? (
        <Surface tone="danger" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="danger" align={direction === 'rtl' ? 'end' : 'start'}>
            المنتج مرفوض: {item.internalNote || 'يرجى مراجعة سبب الرفض قبل إعادة التقديم.'}
          </Text>
        </Surface>
      ) : null}

      <TextField
        label="السعر"
        value={override.price}
        onChangeText={(v) => onChange('price', v)}
        placeholder="18.00"
        dir="ltr"
        keyboardType="decimal-pad"
      />
      <TextField
        label="المخزون"
        value={override.stock}
        onChangeText={(v) => onChange('stock', v)}
        placeholder="42"
        keyboardType="numeric"
        dir="ltr"
      />
      <TextField
        label="ملاحظة داخلية"
        value={override.internalNote}
        onChangeText={(v) => onChange('internalNote', v)}
        placeholder="ملاحظة للفريق الداخلي فقط"
      />
      <Button
        label={override.available ? 'التوفر: متاح' : 'التوفر: موقوف'}
        tone={override.available ? 'success' : 'danger'}
        fullWidth={false}
        onPress={() => onChange('available', !override.available)}
      />

      {isRejected ? (
        <Button
          label="إصلاح سبب الرفض وإعادة التقديم"
          tone="warning"
          fullWidth={false}
          onPress={onApply}
        />
      ) : (
        <Button
          label="تطبيق التعديل المحلي"
          tone="secondary"
          fullWidth={false}
          onPress={onApply}
          disabled={isRejected}
        />
      )}
    </Surface>
  );
}

// ── PHASE 3: Dense list row ───────────────────────────────────────────

function DenseListRow({
  item,
  isEditExpanded,
  onToggleEdit,
  override,
  onOverrideChange,
  onApplyOverride,
}: {
  item: InventoryCatalogItem;
  isEditExpanded: boolean;
  onToggleEdit: () => void;
  override: PartnerLocalOverride;
  onOverrideChange: (field: keyof PartnerLocalOverride, value: string | boolean) => void;
  onApplyOverride: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const isRejected = item.publishStage === 'rejected';
  const isNeedsFix = item.publishStage === 'needs-fix';
  const stageTone = resolveStageChipTone(item.publishStage);
  const stockTone = item.lowStock ? 'warning' : item.available ? 'success' : 'danger';
  const borderColor = isRejected ? theme.danger : isNeedsFix ? theme.warning : theme.line;

  const resolvedImage = item.mediaKey ? resolveDshImageSource(item.mediaKey) : undefined;

  return (
    <Surface tone="default" padding={2} gap={2} border style={{ borderColor }}>
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 8 }}>
        {/* Product thumbnail or fallback */}
        {resolvedImage ? (
          <Image
            source={resolvedImage}
            style={{ width: 36, height: 36, borderRadius: 4 }}
            resizeMode="cover"
          />
        ) : (
          <Surface
            tone="inset"
            padding={1}
            gap={0}
            style={{ width: 36, height: 36, borderRadius: 4, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Text role="bodyStrong">{item.name.slice(0, 1)}</Text>
          </Surface>
        )}
        {/* Canonical vs private badge (PHASE 8) */}
        <Chip
          label={item.isPrivateStoreProduct ? 'منتج خاص' : 'مركزي'}
          tone={item.isPrivateStoreProduct ? 'warning' : 'info'}
          selected
        />
        <Text role="bodySm" numberOfLines={1} style={{ flex: 1 }}>{item.name}</Text>
        <Chip label={item.priceLabel} tone="brand" />
        <Chip label={item.stockCount === 0 ? 'نفد' : String(item.stockCount)} tone={stockTone} />
        {item.publishStage ? <Chip label={translateStage(item.publishStage)} tone={stageTone} selected /> : null}
        <Button label="تعديل" size="sm" tone="secondary" fullWidth={false} onPress={onToggleEdit} disabled={isRejected} />
      </Box>
      {isEditExpanded ? (
        <InlineLocalEdit item={item} override={override} onChange={onOverrideChange} onApply={onApplyOverride} />
      ) : null}
    </Surface>
  );
}

// ── Product Card ──────────────────────────────────────────────────────

function ProductCard({
  item,
  expanded,
  onToggleEdit,
  onToggleDetails,
  showDetails,
  override,
  onOverrideChange,
  onApplyOverride,
  onSendForReview,
  onMatchCatalog,
}: {
  item: InventoryCatalogItem;
  expanded: boolean;
  showDetails: boolean;
  onToggleEdit: () => void;
  onToggleDetails: () => void;
  override: PartnerLocalOverride;
  onOverrideChange: (field: keyof PartnerLocalOverride, value: string | boolean) => void;
  onApplyOverride: () => void;
  onSendForReview: () => void;
  onMatchCatalog: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const isRejected = item.publishStage === 'rejected';
  const isNeedsFix = item.publishStage === 'needs-fix';
  const isClientVisible = canRenderInClientSurface(item.publishStage, 'product');

  const stageTone = resolveStageChipTone(item.publishStage);
  const stockTone = item.lowStock ? 'warning' : item.available ? 'success' : 'danger';
  const linkedTone: 'success' | 'warning' | 'danger' = item.catalogLinked ? 'success' : 'warning';

  const borderColor = isRejected
    ? theme.danger
    : isNeedsFix
    ? theme.warning
    : expanded
    ? theme.brand
    : theme.line;

  // Resolve partner queue metadata for this item
  const partnerRecord = React.useMemo(
    () => getPartnerQueueRecords().find((r) => r.id === item.id || r.title.includes(item.name)),
    [item.id, item.name],
  );

  const fixReason = partnerRecord?.metadata?.requiredFix ?? item.internalNote;
  const rejectReason = partnerRecord?.metadata?.rejectionReason ?? item.internalNote;

  const nextAction = resolveNextActionLabel(item.publishStage, item.available, item.stockCount);
  const nextOwnerLabel = item.publishStage
    ? translateOwner(resolveNextOwner(item.publishStage as ApprovalStage))
    : undefined;

  return (
    <Surface
      tone="default"
      padding={3}
      gap={3}
      border
      style={{ borderColor }}
    >
      {/* ── Header row ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'flex-start', gap: 10 }}>
        {/* Product image or letter fallback */}
        {resolveDshImageSource(item.mediaKey) ? (
          <Image
            source={resolveDshImageSource(item.mediaKey)!}
            style={{ width: 44, height: 44, borderRadius: 6, flexShrink: 0 }}
            resizeMode="cover"
          />
        ) : (
          <Surface
            tone={isRejected ? 'danger' : isNeedsFix ? 'warning' : 'inset'}
            padding={2}
            gap={0}
            style={{ width: 44, height: 44, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Text role="bodyStrong">{item.name.slice(0, 1)}</Text>
          </Surface>
        )}

        {/* Name + stage + action */}
        <Box style={{ flex: 1, minWidth: 0, gap: 4, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
          <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
            {item.name}
          </Text>
          <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 4 }}>
            {item.publishStage ? (
              <Chip label={translateStage(item.publishStage)} tone={stageTone} selected />
            ) : null}
            {nextOwnerLabel ? (
              <Chip label={`← ${nextOwnerLabel}`} tone="default" />
            ) : null}
          </Box>
          <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
            {nextAction}
          </Text>
        </Box>
      </Box>

      {/* ── rejected/needs-fix banners (compact) ── */}
      {isRejected && rejectReason ? (
        <Surface tone="danger" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="danger" align={direction === 'rtl' ? 'end' : 'start'}>
            سبب الرفض: {rejectReason}
          </Text>
        </Surface>
      ) : null}
      {isNeedsFix && fixReason ? (
        <Surface tone="warning" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="warning" align={direction === 'rtl' ? 'end' : 'start'}>
            التعديل المطلوب: {fixReason}
          </Text>
        </Surface>
      ) : null}

      {/* ── Commercial chips ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 6 }}>
        {/* PHASE 8: Canonical vs private product type */}
        <Chip
          label={item.isPrivateStoreProduct ? 'منتج خاص بالمتجر' : 'منتج مركزي'}
          tone={item.isPrivateStoreProduct ? 'warning' : 'info'}
          selected
        />
        <Chip label={item.priceLabel} tone="brand" />
        <Chip
          label={item.stockCount === 0 ? 'نفد المخزون' : `المخزون ${item.stockCount}`}
          tone={stockTone}
        />
        <Chip label={item.available ? 'متاح' : 'موقوف'} tone={item.available ? 'success' : 'danger'} />
        {item.lowStock && item.stockCount > 0 ? <Chip label="منخفض" tone="warning" /> : null}
        <Chip label={item.catalogLinked ? 'مرتبط بالكتالوج' : 'يحتاج مطابقة'} tone={linkedTone} />
        {isClientVisible ? <Chip label="ظاهر للعميل" tone="success" selected /> : null}
      </Box>

      {/* ── Action row ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 6 }}>
        <Button
          label={expanded ? 'إخفاء التعديل' : 'تعديل محلي'}
          size="sm"
          tone={expanded ? 'secondary' : 'primary'}
          fullWidth={false}
          onPress={onToggleEdit}
          disabled={isRejected && !expanded}
        />
        <Button
          label={showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          size="sm"
          tone="secondary"
          fullWidth={false}
          onPress={onToggleDetails}
        />
        {!item.catalogLinked ? (
          <Button
            label="مطابقة بالكتالوج"
            size="sm"
            tone="secondary"
            fullWidth={false}
            onPress={onMatchCatalog}
          />
        ) : null}
        {item.reviewNeeded && !isRejected ? (
          <Button
            label="إرسال للمراجعة"
            size="sm"
            tone="secondary"
            fullWidth={false}
            onPress={onSendForReview}
          />
        ) : null}
      </Box>

      {/* ── Inline local edit ── */}
      {expanded ? (
        <InlineLocalEdit
          item={item}
          override={override}
          onChange={onOverrideChange}
          onApply={onApplyOverride}
        />
      ) : null}

      {/* ── Expanded details ── */}
      {showDetails ? (
        <Surface tone="inset" padding={3} gap={2} border={false}>
          <KeyValueList
            dense
            items={[
              { label: 'SKU', value: item.sku },
              { label: 'GTIN', value: item.gtin },
              { label: 'الباركود', value: item.barcode },
              { label: 'رمز المُصنِّع', value: item.manufacturerCode },
              ...(item.sourceRecordId ? [{ label: 'مرجع المصدر', value: item.sourceRecordId }] : []),
              ...(item.canonicalProductId ? [{ label: 'معرف المنتج المركزي', value: item.canonicalProductId }] : []),
              ...(item.canonicalStoreId ? [{ label: 'معرف المتجر المركزي', value: item.canonicalStoreId }] : []),
              ...(item.source ? [{ label: 'مصدر الإدخال', value: translateOwner(item.source) }] : []),
              { label: 'ملكية الوسائط', value: item.isCatalogOwned ? 'كتالوج مركزي' : isPartnerOwnedException(item.publishStage as ApprovalStage, 'product-media') ? 'استثناء شريك' : 'بحاجة مراجعة', tone: item.isCatalogOwned ? 'info' : 'warning' },
            ]}
          />

          {/* Audit trail if available */}
          {partnerRecord?.auditTrail?.length ? (
            <Box gap={2}>
              <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
                سجل المراحل:
              </Text>
              {partnerRecord.auditTrail.map((entry, idx) => (
                <Text key={idx} role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
                  {translateStage(entry.fromStage)} → {translateStage(entry.toStage)} · {translateOwner(entry.owner)}
                </Text>
              ))}
            </Box>
          ) : null}
        </Surface>
      ) : null}
    </Surface>
  );
}

// ── Main content ──────────────────────────────────────────────────────

function InventoryCatalogContent({
  storeName: _storeName,
  branchLabel,
  activeZoneLabel: _activeZoneLabel,
  todayHoursLabel: _todayHoursLabel,
  canonicalStoreId,
}: InventoryCatalogContentProps) {
  const { direction } = useDirection();
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<InventoryFilterId>('all');
  // PHASE 2: Hierarchy filter state
  const [hierarchy, setHierarchy] = React.useState<ActiveHierarchyFilter>({});
  // PHASE 3: View mode — dense list is default for 5000+ products
  const [viewMode, setViewMode] = React.useState<ViewMode>('dense-list');
  const [items, setItems] = React.useState<InventoryCatalogItem[]>(() =>
    buildInitialItems(canonicalStoreId),
  );
  const [expandedEditId, setExpandedEditId] = React.useState<string | null>(null);
  const [expandedDetailsId, setExpandedDetailsId] = React.useState<string | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, PartnerLocalOverride>>(() => {
    const initial: Record<string, PartnerLocalOverride> = {};
    buildInitialItems(canonicalStoreId).forEach((item) => {
      initial[item.id] = {
        price: item.priceLabel.replace(/[^0-9.]/g, '').trim(),
        stock: String(item.stockCount),
        available: item.available,
        preparationNote: item.preparationNote ?? '',
        internalNote: item.internalNote ?? '',
      };
    });
    return initial;
  });
  const [lastSavedLabel, setLastSavedLabel] = React.useState<string | null>(null);
  const [toolMessage, setToolMessage] = React.useState<string | null>(null);
  const [bulkPrice, setBulkPrice] = React.useState<{ kind: 'percent' | 'fixed'; value: string } | null>(null);
  const [bulkPreviewMessage, setBulkPreviewMessage] = React.useState<string | null>(null);

  const totalProducts = items.length;
  const lowStockCount = items.filter((item) => item.lowStock).length;
  const reviewCount = items.filter((item) => item.reviewNeeded).length;
  const notLinkedCount = items.filter((item) => !item.catalogLinked).length;
  const clientVisibleCount = items.filter((item) => canRenderInClientSurface(item.publishStage, 'product')).length;

  const searchMatchState = React.useMemo(
    () => detectSearchMatch(items, query),
    [items, query],
  );

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q
      ? items.filter((item) =>
          [item.name, item.sku, item.gtin, item.barcode, item.manufacturerCode, item.categoryLabel]
            .join(' ')
            .toLowerCase()
            .includes(q),
        )
      : items;
    // PHASE 2: Apply hierarchy filter
    const hierarchyFiltered = applyHierarchyFilter(searched, hierarchy);
    return applyFilter(hierarchyFiltered, activeFilter);
  }, [items, query, activeFilter, hierarchy]);

  const handleOverrideChange = React.useCallback(
    (id: string, field: keyof PartnerLocalOverride, value: string | boolean) => {
      setOverrides((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), [field]: value } as PartnerLocalOverride,
      }));
    },
    [],
  );

  const handleApplyOverride = React.useCallback(
    (item: InventoryCatalogItem) => {
      const override = overrides[item.id];
      if (!override) return;

      const parsedStock = Number(override.stock.replace(/[^0-9]/g, ''));
      const cleanedPrice = override.price.replace(/[^0-9.]/g, '').trim();
      const resolvedPrice = cleanedPrice.length > 0
        ? `${Number(cleanedPrice).toFixed(2)} ر.ي`
        : item.priceLabel;
      const normalizedStock = Number.isFinite(parsedStock) ? parsedStock : item.stockCount;

      setItems((current) =>
        current.map((p) =>
          p.id === item.id
            ? {
                ...p,
                priceLabel: resolvedPrice,
                stockCount: normalizedStock,
                available: override.available,
                lowStock: normalizedStock <= 3,
                reviewNeeded: normalizedStock <= 3 || !override.available || !p.catalogLinked,
              }
            : p,
        ),
      );
      setLastSavedLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
      setExpandedEditId(null);
      setToolMessage(`تم تطبيق التعديل المحلي على ${item.name}.`);
    },
    [overrides],
  );

  const handleSendForReview = React.useCallback((item: InventoryCatalogItem) => {
    setToolMessage(`تم إرسال ${item.name} للمراجعة — سيظهر في قائمة انتظار الشركاء.`);
  }, []);

  const handleMatchCatalog = React.useCallback((item: InventoryCatalogItem) => {
    setToolMessage(`ابدأ البحث بـ SKU أو GTIN لمطابقة ${item.name} مع الكتالوج المركزي.`);
  }, []);

  const publishLabel = reviewCount > 0 || lowStockCount > 0 ? 'مراجعة ونشر التغييرات' : 'حفظ تحديثات المخزون';

  return (
    <Box gap={4} dir="rtl">

      {/* ── Summary compact ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 8 }}>
        {[
          { label: 'المنتجات', value: String(totalProducts), tone: 'brand' as const },
          { label: 'منخفض المخزون', value: String(lowStockCount), tone: lowStockCount > 0 ? 'warning' as const : 'success' as const },
          { label: 'تحتاج مراجعة', value: String(reviewCount), tone: reviewCount > 0 ? 'warning' as const : 'success' as const },
          { label: 'غير مرتبط', value: String(notLinkedCount), tone: notLinkedCount > 0 ? 'danger' as const : 'success' as const },
          { label: 'ظاهر للعميل', value: String(clientVisibleCount), tone: 'success' as const },
        ].map((tile) => (
          <Surface
            key={tile.label}
            tone="raised"
            padding={2}
            gap={1}
            border
            style={{ minWidth: 90, flex: 1 }}
          >
            <Text role="caption" tone="muted" numberOfLines={1}>{tile.label}</Text>
            <Text role="bodyStrong" tone={tile.tone}>{tile.value}</Text>
          </Surface>
        ))}
      </Box>

      {/* ── Search command ── */}
      <Surface tone="raised" padding={3} gap={3}>
        <SearchField
          label="بحث في الكتالوج المركزي"
          value={query}
          onChangeText={setQuery}
          placeholder="اسم المنتج، SKU، GTIN، الباركود"
          hint="ابدأ بالكتالوج المركزي ثم طابق السعر والتوفر محلياً."
        />
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 6 }}>
          <Button
            label="مسح باركود"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => { setQuery('6280001000018'); setToolMessage('وضع المسح جاهز.'); }}
          />
          <Button
            label="إدخال جماعي"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار الإدخال الجماعي — Excel/CSV.')}
          />
          <Button
            label="منتج جديد"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setToolMessage('ابدأ من الكتالوج المركزي قبل إنشاء مسودة جديدة.')}
          />
        </Box>

        {/* Search match state */}
        {query.trim() ? (
          <Surface
            tone={
              searchMatchState === 'duplicate' ? 'warning'
              : searchMatchState === 'not-in-catalog' ? 'danger'
              : searchMatchState === 'needs-match' ? 'warning'
              : 'inset'
            }
            padding={2}
            gap={0}
            border={false}
          >
            <Text
              role="bodySm"
              tone={
                searchMatchState === 'duplicate' ? 'warning'
                : searchMatchState === 'not-in-catalog' ? 'danger'
                : searchMatchState === 'needs-match' ? 'warning'
                : 'muted'
              }
              align={direction === 'rtl' ? 'end' : 'start'}
            >
              {searchMatchState === 'catalog-match' && 'مطابق بالكتالوج'}
              {searchMatchState === 'needs-match' && 'يحتاج مطابقة بالكتالوج المركزي'}
              {searchMatchState === 'not-in-catalog' && 'غير موجود في الكتالوج — أرسل طلب إضافة'}
              {searchMatchState === 'duplicate' && 'تكرار محتمل — راجع SKU أو GTIN'}
            </Text>
          </Surface>
        ) : null}
      </Surface>

      {/* ── Tool message ── */}
      {toolMessage ? (
        <Surface tone="inset" padding={2} gap={0} border={false}>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>{toolMessage}</Text>
        </Surface>
      ) : null}

      {/* ── Help block (collapsible) ── */}
      <HelpBlock />

      {/* ── PHASE 2: Hierarchy filter rail ── */}
      <HierarchyFilterRail hierarchy={hierarchy} onChange={setHierarchy} items={items} />

      {/* ── PHASE 3: View mode toggle ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="label" tone="muted">{filteredItems.length} منتج</Text>
        <Box style={{ flexDirection: resolveRowDirection(direction), gap: 4 }}>
          <Button
            label="بطاقات"
            size="sm"
            tone={viewMode === 'cards' ? 'brand' : 'secondary'}
            fullWidth={false}
            onPress={() => setViewMode('cards')}
          />
          <Button
            label="قائمة كثيفة"
            size="sm"
            tone={viewMode === 'dense-list' ? 'brand' : 'secondary'}
            fullWidth={false}
            onPress={() => setViewMode('dense-list')}
          />
        </Box>
      </Box>

      {/* ── Filter rail ── */}
      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 6 }}>
        {FILTER_ITEMS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            tone={activeFilter === f.id ? 'brand' : 'default'}
            selected={activeFilter === f.id}
            onPress={() => setActiveFilter(f.id)}
          />
        ))}
      </Box>

      {/* ── PHASE 3: Product stream (cards or dense list) ── */}
      <Box gap={3}>
        {filteredItems.length === 0 ? (
          <StateView
            stateId="empty"
            title="لا توجد نتائج مطابقة"
            description="جرّب اسم مختلفاً أو SKU أو GTIN أو الباركود."
            actionLabel="إعادة ضبط الفلتر والبحث"
            onActionPress={() => { setQuery(''); setActiveFilter('all'); }}
          />
        ) : viewMode === 'dense-list' ? (
          filteredItems.map((item) => (
            <DenseListRow
              key={item.id}
              item={item}
              isEditExpanded={expandedEditId === item.id}
              onToggleEdit={() => setExpandedEditId((prev) => (prev === item.id ? null : item.id))}
              override={overrides[item.id] ?? {
                price: item.priceLabel.replace(/[^0-9.]/g, '').trim(),
                stock: String(item.stockCount),
                available: item.available,
                preparationNote: '',
                internalNote: item.internalNote ?? '',
              }}
              onOverrideChange={(field, value) => handleOverrideChange(item.id, field, value)}
              onApplyOverride={() => handleApplyOverride(item)}
            />
          ))
        ) : (
          filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              expanded={expandedEditId === item.id}
              showDetails={expandedDetailsId === item.id}
              onToggleEdit={() => setExpandedEditId((prev) => (prev === item.id ? null : item.id))}
              onToggleDetails={() => setExpandedDetailsId((prev) => (prev === item.id ? null : item.id))}
              override={overrides[item.id] ?? {
                price: item.priceLabel.replace(/[^0-9.]/g, '').trim(),
                stock: String(item.stockCount),
                available: item.available,
                preparationNote: '',
                internalNote: item.internalNote ?? '',
              }}
              onOverrideChange={(field, value) => handleOverrideChange(item.id, field, value)}
              onApplyOverride={() => handleApplyOverride(item)}
              onSendForReview={() => handleSendForReview(item)}
              onMatchCatalog={() => handleMatchCatalog(item)}
            />
          ))
        )}
      </Box>

      {/* ── Bulk actions ── */}
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>إجراءات جماعية</Text>

        {/* Quick actions */}
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap', gap: 6 }}>
          <Button
            label={bulkPrice ? 'إلغاء تحديث الأسعار' : 'تحديث أسعار جماعي'}
            size="sm"
            tone={bulkPrice ? 'danger' : 'secondary'}
            fullWidth={false}
            onPress={() => {
              setBulkPrice(bulkPrice ? null : { kind: 'percent', value: '' });
              setBulkPreviewMessage(null);
            }}
          />
          <Button label="استيراد Excel/CSV" size="sm" tone="secondary" fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار الاستيراد.')} />
          <Button label="مراجعة غير المطابقة" size="sm" tone="secondary" fullWidth={false}
            onPress={() => { setActiveFilter('not-linked'); setToolMessage('عرض المنتجات غير المرتبطة بالكتالوج.'); }} />
          <Button label="مراجعة المنتجات الخاصة" size="sm" tone="secondary" fullWidth={false}
            onPress={() => setToolMessage('عرض المنتجات الخاصة بالمتجر التي تنتظر المراجعة.')} />
        </Box>

        {/* Bulk price update panel */}
        {bulkPrice ? (
          <Surface tone="inset" padding={3} gap={3} border={false}>
            <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
              تحديث أسعار المنتجات ضمن الفلتر الحالي — تطبيق محلي (preview فقط)
            </Text>

            {/* Kind selector */}
            <Box style={{ flexDirection: resolveRowDirection(direction), gap: 6 }}>
              <Button
                label="نسبة مئوية %"
                size="sm"
                tone={bulkPrice.kind === 'percent' ? 'brand' : 'secondary'}
                fullWidth={false}
                onPress={() => setBulkPrice({ ...bulkPrice, kind: 'percent' })}
              />
              <Button
                label="مبلغ ثابت ر.ي"
                size="sm"
                tone={bulkPrice.kind === 'fixed' ? 'brand' : 'secondary'}
                fullWidth={false}
                onPress={() => setBulkPrice({ ...bulkPrice, kind: 'fixed' })}
              />
            </Box>

            <TextField
              label={bulkPrice.kind === 'percent' ? 'نسبة الزيادة/النقص (مثال: +10 أو -5)' : 'المبلغ المضاف/المطروح (مثال: +2 أو -1.5)'}
              value={bulkPrice.value}
              onChangeText={(v: string) => { setBulkPrice({ ...bulkPrice, value: v }); setBulkPreviewMessage(null); }}
              placeholder={bulkPrice.kind === 'percent' ? '+10' : '+2.00'}
              dir="ltr"
              keyboardType="decimal-pad"
            />

            {/* Preview button */}
            <Button
              label="معاينة التغييرات قبل التطبيق"
              tone="secondary"
              fullWidth={false}
              onPress={() => {
                const rawVal = parseFloat(bulkPrice.value.replace(/[^0-9.\-]/g, ''));
                if (Number.isNaN(rawVal)) {
                  setBulkPreviewMessage('أدخل قيمة صحيحة أولاً.');
                  return;
                }
                const eligible = filteredItems.filter((item) => !item.isCatalogOwned);
                const excluded = filteredItems.filter((item) => item.isCatalogOwned);
                const sign = rawVal >= 0 ? '+' : '';
                const summary = bulkPrice.kind === 'percent'
                  ? `${sign}${rawVal}%`
                  : `${sign}${rawVal.toFixed(2)} ر.ي`;
                setBulkPreviewMessage(
                  `المتأثرة: ${eligible.length} منتج | التغيير: ${summary} على كل سعر | المستثناة: ${excluded.length} منتج مركزي (الأسعار مقفلة) | تطبيق محلي فقط — لا يؤثر على الكتالوج المركزي.`,
                );
              }}
            />

            {/* Preview result */}
            {bulkPreviewMessage ? (
              <Surface tone="warning" padding={2} gap={0} border={false}>
                <Text role="bodySm" tone="warning" align={direction === 'rtl' ? 'end' : 'start'}>
                  {bulkPreviewMessage}
                </Text>
              </Surface>
            ) : null}

            {/* Apply button — only after preview */}
            {bulkPreviewMessage && !bulkPreviewMessage.startsWith('أدخل') ? (
              <Button
                label="تطبيق التعديل المحلي على المنتجات المتأثرة"
                tone="primary"
                fullWidth={false}
                onPress={() => {
                  const rawVal = parseFloat(bulkPrice.value.replace(/[^0-9.\-]/g, ''));
                  if (Number.isNaN(rawVal)) return;
                  setItems((current) =>
                    current.map((item) => {
                      if (item.isCatalogOwned) return item;
                      if (!filteredItems.some((f) => f.id === item.id)) return item;
                      const currentNum = parseFloat(item.priceLabel.replace(/[^0-9.]/g, ''));
                      if (!Number.isFinite(currentNum)) return item;
                      const newPrice = bulkPrice.kind === 'percent'
                        ? currentNum * (1 + rawVal / 100)
                        : currentNum + rawVal;
                      const clamped = Math.max(0, newPrice);
                      return { ...item, priceLabel: `${clamped.toFixed(2)} ر.ي` };
                    }),
                  );
                  setLastSavedLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
                  setBulkPrice(null);
                  setBulkPreviewMessage(null);
                  setToolMessage('تم تطبيق تحديث الأسعار الجماعي على المنتجات المؤهلة.');
                }}
              />
            ) : null}
          </Surface>
        ) : null}
      </Surface>

      <MobileStickyPrimaryAction
        label={publishLabel}
        helperText={lastSavedLabel ? `آخر حفظ: ${lastSavedLabel}` : 'الكتالوج المركزي هو المرجع الأول قبل النشر.'}
        onPress={() => setLastSavedLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }))}
      />
    </Box>
  );
}

// ── Screen shell ──────────────────────────────────────────────────────

export function InventoryCatalogScreen({ onBack, ...props }: InventoryCatalogScreenProps) {
  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 120 }}>
      <TopBar
        variant="secondary"
        title="كتالوج المخزون"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={
          onBack
            ? {
                id: 'back',
                icon: <Icon name="arrow-back" size={24} tone="brand" />,
                mirrorInRtl: true,
                accessibilityLabel: 'رجوع',
                onPress: onBack,
              }
            : undefined
        }
      />

      <InventoryCatalogContent {...props} />
    </MobileScrollView>
  );
}

export default InventoryCatalogScreen;
