import {
  type DshStoreFixtureItem,
  type StoreItemsByStoreId,
} from '../shared/dshStoreProductCardModel';
import {
  canonicalStoreId,
  canonicalProductId,
  canonicalStoreCard,
  canonicalPreviewStores,
  canonicalProductCard,
  canonicalPreviewProducts,
  getCanonicalPreviewStoreCard,
  getCanonicalPreviewProductCard,
  getCanonicalPreviewProductForStore,
  getCanonicalPreviewEvidence,
  buildCanonicalPreviewStoreItemsByStoreId,
} from './canonical.preview-data';


// ── Canonical Re-exports ──────────────────────────────────────────────────
// Defined in canonical.preview-data; re-exported here for backward compatibility.
export {
  canonicalStoreId,
  canonicalProductId,
  canonicalStoreCard,
  canonicalPreviewStores,
  canonicalProductCard,
  canonicalPreviewProducts,
  getCanonicalPreviewStoreCard,
  getCanonicalPreviewProductCard,
  getCanonicalPreviewProductForStore,
  getCanonicalPreviewEvidence,
  buildCanonicalPreviewStoreItemsByStoreId,
} from './canonical.preview-data';

// -----------------------------------------------------------------------------
// Store products
// -----------------------------------------------------------------------------
/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — SINGLE SOURCE OF TRUTH
 * Owner: dsh/frontend/data (central DSH domain preview data owner)
 * DEV_ONLY data fixture: not runtime truth, not backend/API/binding source
 *
 * Domain: store items / products (by storeId, with publish stages)
 * Used by: app-client (via surface adapter), control-panel/marketing
 */


export const itemsFixturesDataContract = {
	dataKind: 'DEV_ONLY_FIXTURE',
	runtimeTruth: false,
	backendSource: false,
	bindingSource: false,
	timezoneSemantics: 'preview-only local display / not runtime UTC source',
	moneySemantics: 'preview-only display values / not accounting source',
} as const;

function withPublishedPreviewStage(items: DshStoreFixtureItem[]): DshStoreFixtureItem[] {
	return items.map((item) => {
		if (item.publishStage) {
			return item;
		}

		return {
			...item,
			publishStage: 'published-preview',
		};
	});
}

export const storeItemsByStoreId: StoreItemsByStoreId = {
	'store-1001': withPublishedPreviewStage([
		{
			id: 'item-apple-1',
			name: 'تفاح رويال غالا',
			subtitle: 'صندوق طازج 1 كجم',
			priceLabel: '18 ر.ي',
			oldPriceLabel: '24 ر.ي',
			discountLabel: 'خصم 25%',
			measurementType: 'weight',
			measurementOptions: ['250 جرام', '500 جرام', '1 كجم'],
			categoryId: 'fresh',
			categoryLabel: 'طازج',
			statusLabel: 'الأكثر طلبًا',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-15 دقيقة',
			mediaKey: 'dsh.product.apple.v1',
			imageUri: 'dsh.product.apple.v1',
			publishStage: 'published-preview',
		},
		{
			id: 'item-milk-1',
			name: 'حليب عضوي',
			subtitle: 'عبوة مبردة 1.5 لتر',
			priceLabel: '11 ر.ي',
			oldPriceLabel: '14 ر.ي',
			discountLabel: 'خصم 21%',
			measurementType: 'piece',
			measurementOptions: ['حبة', '2 حبة', '4 حبات'],
			categoryId: 'dairy',
			categoryLabel: 'ألبان',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '5-10 دقائق',
			mediaKey: 'dsh.product.milk.v1',
			imageUri: 'dsh.product.milk.v1',
			publishStage: 'published-preview',
		},
		{
			id: 'item-bread-1',
			name: 'خبز قمح كامل',
			subtitle: 'مخبوز يومي طازج',
			priceLabel: '7 ر.ي',
			oldPriceLabel: '9 ر.ي',
			discountLabel: 'خصم 22%',
			measurementType: 'piece',
			measurementOptions: ['حبة', '2 حبة', '6 حبات'],
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-20 دقيقة',
			mediaKey: 'dsh.product.bread.v1',
			imageUri: 'dsh.product.bread.v1',
			publishStage: 'published-preview',
		},
		{
			id: 'item-yogurt-1',
			name: 'زبادي يوناني',
			subtitle: 'عبوة بروتين خفيفة',
			priceLabel: '8 ر.ي',
			oldPriceLabel: '10 ر.ي',
			discountLabel: 'خصم 20%',
			categoryId: 'dairy',
			categoryLabel: 'ألبان',
			statusLabel: 'جديد اليوم',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '5-8 دقائق',
			mediaKey: 'dsh.product.yogurt.v1',
			imageUri: 'dsh.product.yogurt.v1',
			publishStage: 'published-preview',
		},

		{
			id: 'item-croissant-2',
			name: 'كرواسون زبدة طازج',
			subtitle: 'مخبوز هشّ وطازج',
			priceLabel: '9 ر.ي',
			oldPriceLabel: '11 ر.ي',
			discountLabel: 'خصم 18%',
			measurementType: 'piece',
			measurementOptions: ['حبة', '2 حبة', '6 حبات'],
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			statusLabel: 'الأكثر طلبًا',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '8-12 دقيقة',
			mediaKey: 'dsh.product.croissant.v1',
			imageUri: 'dsh.product.croissant.v1',
		},
		{
			id: 'item-chicken-2',
			name: 'دجاج مشوي بالبطاطس',
			subtitle: 'تتبيلة منزلية مع بطاطس',
			priceLabel: '34 ر.ي',
			oldPriceLabel: '39 ر.ي',
			discountLabel: 'خصم 13%',
			measurementType: 'portion',
			measurementOptions: ['نفر', '2 نفر', '4 نفر'],
			categoryId: 'meals',
			categoryLabel: 'وجبات',
			statusLabel: 'جاهز الآن',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '18-22 دقيقة',
			mediaKey: 'dsh.product.chicken.v1',
			imageUri: 'dsh.product.chicken.v1',
		},
		{
			id: 'item-salad-2',
			name: 'سلطة جاردن خضراء',
			subtitle: 'خليط أخضر خفيف',
			priceLabel: '21 ر.ي',
			oldPriceLabel: '25 ر.ي',
			discountLabel: 'خصم 16%',
			categoryId: 'healthy',
			categoryLabel: 'صحي',
			statusLabel: 'الأكثر مبيعًا',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-15 دقيقة',
			mediaKey: 'dsh.product.salad.v1',
			imageUri: 'dsh.product.salad.v1',
		},
		{
			id: 'item-choco-2',
			name: 'شريحة كيكة شوكولاتة',
			subtitle: 'حلوى فردية جاهزة',
			priceLabel: '14 ر.ي',
			oldPriceLabel: '17 ر.ي',
			discountLabel: 'خصم 18%',
			categoryId: 'sweets',
			categoryLabel: 'حلويات',
			statusLabel: 'اختيار الشيف',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '12-18 دقيقة',
			mediaKey: 'dsh.product.choco.v1',
			imageUri: 'dsh.product.choco.v1',
			publishStage: 'published-preview'
		},

		{
			id: 'item-exception-visible',
			name: 'منتج استثناء شريك',
			subtitle: 'يظهر بسبب سياسة الوسائط بالرغم من أنه في المراجعة',
			priceLabel: '60 ر.ي',
			categoryId: 'fresh',
			categoryLabel: 'طازج',
			isAvailable: true,
			publishStage: 'marketing-review',
			mediaPolicy: 'partner-owned-exception',
			mediaKey: 'dsh.product.apple.v1',
			imageUri: 'dsh.product.apple.v1',
		},

		{
			id: 'prd-restaurant-chicken',
			name: 'دجاج مشوي مع بطاطس',
			subtitle: 'وجبة نصف دجاج مع البطاطس',
			priceLabel: '24.50 ر.ي',
			categoryId: 'chicken',
			categoryLabel: 'وجبة',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '20 دقيقة',
			mediaKey: 'dsh.product.chicken.v1',
			imageUri: 'dsh.product.chicken.v1',
			publishStage: 'client-visible',
		},
		{
			id: 'prd-restaurant-pasta',
			name: 'باستا ألفريدو',
			subtitle: 'باستا بصلصة الكريمة البيضاء والجبن',
			priceLabel: '8.00 ر.ي',
			categoryId: 'sides-pasta',
			categoryLabel: 'إضافات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '15 دقيقة',
			mediaKey: 'dsh.product.pasta.v1',
			imageUri: 'dsh.product.pasta.v1',
			publishStage: 'partner-submitted',
		},

		{
			id: 'prd-grocery-bread',
			name: 'خبز قمح كامل (مكثف)',
			subtitle: 'مخبوز هش وغني بالألياف',
			priceLabel: '2.50 ر.ي',
			categoryId: 'sides-bread',
			categoryLabel: 'إضافات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10 دقائق',
			mediaKey: 'dsh.product.bread.v1',
			imageUri: 'dsh.product.bread.v1',
			publishStage: 'partner-review',
		},
		{
			id: 'prd-grocery-apple',
			name: 'تفاح رويال غالا طازج 1 كجم (مكثف)',
			subtitle: 'تفاح أحمر حلو ومقرمش',
			priceLabel: '14.75 ر.ي',
			categoryId: 'meals-apple',
			categoryLabel: 'سلطات',
			isAvailable: false,
			hasOptions: false,
			preparationTime: '5 دقائق',
			mediaKey: 'dsh.product.apple.v1',
			imageUri: 'dsh.product.apple.v1',
			publishStage: 'partner-submitted',
		},
		{
			id: 'prd-sweets-cake',
			name: 'شريحة شوكولاتة (تعديل)',
			subtitle: 'كيكة شوكولاتة غنية ولذيذة',
			priceLabel: '9.00 ر.ي',
			categoryId: 'bakery-cake',
			categoryLabel: 'مخبوزات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10 دقائق',
			mediaKey: 'dsh.product.choco.v1',
			imageUri: 'dsh.product.choco.v1',
			publishStage: 'needs-fix',
		},
		{
			id: 'prd-dates-box',
			name: 'علبة تمر سيراميك — رفض',
			subtitle: 'عينة مرفوضة — تمر خلاص غير معتمد',
			priceLabel: '120.00 ر.ي',
			categoryId: 'bakery-dates',
			categoryLabel: 'حلويات',
			isAvailable: false,
			hasOptions: false,
			preparationTime: '5 دقائق',
			mediaKey: 'dsh.product.roll.v1',
			imageUri: 'dsh.product.roll.v1',
			publishStage: 'rejected',
		},

	]),

	'store-1002': withPublishedPreviewStage([
		{
			id: 'item-croissant-1',
			name: 'كرواسون زبدة',
			subtitle: 'يخبز طازجًا كل صباح',
			priceLabel: '9 ر.ي',
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			statusLabel: 'الأكثر مبيعًا',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '8-12 دقيقة',
			mediaKey: 'dsh.product.croissant.v1',
			imageUri: 'dsh.product.croissant.v1',
		},
		{
			id: 'item-cake-1',
			name: 'كيك تمر',
			subtitle: 'مزيج دافئ مع قهوة مختصة',
			priceLabel: '16 ر.ي',
			categoryId: 'dessert',
			categoryLabel: 'حلويات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '12-15 دقيقة',
			mediaKey: 'dsh.product.choco.v1',
			imageUri: 'dsh.product.choco.v1',
		},
		{
			id: 'item-bagel-1',
			name: 'باجل جبنة',
			subtitle: 'محشو بالجبنة الكريمية',
			priceLabel: '13 ر.ي',
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '10-14 دقيقة',
			mediaKey: 'dsh.product.roll.v1',
			imageUri: 'dsh.product.roll.v1',
		},
		{
			id: 'item-date-cookie-1',
			name: 'كوكيز تمر',
			subtitle: 'حلوى مخبوزة يوميًا',
			priceLabel: '11 ر.ي',
			categoryId: 'dessert',
			categoryLabel: 'حلويات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '8-10 دقائق',
			mediaKey: 'dsh.product.choco.v1',
			imageUri: 'dsh.product.choco.v1',
		},
		{
			id: 'item-roll-1',
			name: 'لفافة قرفة',
			subtitle: 'طبقات طرية مع صوص خفيف',
			priceLabel: '12 ر.ي',
			oldPriceLabel: '15 ر.ي',
			discountLabel: 'خصم 20%',
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-15 دقيقة',
			mediaKey: 'dsh.product.roll.v1',
			imageUri: 'dsh.product.roll.v1',
		},
		{
			id: 'item-choco-1',
			name: 'شريحة شوكولاتة',
			subtitle: 'حصة فردية جاهزة',
			priceLabel: '14 ر.ي',
			categoryId: 'sweets',
			categoryLabel: 'حلويات',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '12-18 دقيقة',
			mediaKey: 'dsh.product.choco.v1',
			imageUri: 'dsh.product.choco.v1',
		},
		{
			id: 'item-cheese-roll-1',
			name: 'لفافة جبن ساخنة',
			subtitle: 'مخبوزة ذهبية بطبقات خفيفة',
			priceLabel: '10 ر.ي',
			categoryId: 'bakery',
			categoryLabel: 'مخبوزات',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-14 دقيقة',
			mediaKey: 'dsh.product.roll.v1',
			imageUri: 'dsh.product.roll.v1',
			publishStage: 'published-preview',
		},
	]),

	'store-1003': withPublishedPreviewStage([
		{
			id: 'item-pasta-1',
			name: 'باستا كريمية',
			subtitle: 'وجبة جاهزة للإرسال',
			priceLabel: '29 ر.ي',
			categoryId: 'meals',
			categoryLabel: 'وجبات',
			statusLabel: 'اختيار الشيف',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '20-25 دقيقة',
			mediaKey: 'dsh.product.pasta.v1',
			imageUri: 'dsh.product.pasta.v1',
		},
		{
			id: 'item-salad-1',
			name: 'سلطة جاردن',
			subtitle: 'طبق خفيف وطازج',
			priceLabel: '21 ر.ي',
			categoryId: 'healthy',
			categoryLabel: 'صحي',
			isAvailable: true,
			hasOptions: false,
			preparationTime: '10-15 دقيقة',
			mediaKey: 'dsh.product.salad.v1',
			imageUri: 'dsh.product.salad.v1',
		},
		{
			id: 'item-chicken-1',
			name: 'دجاج مشوي',
			subtitle: 'تتبيلة منزلية مع أرز',
			priceLabel: '34 ر.ي',
			categoryId: 'meals',
			categoryLabel: 'وجبات',
			statusLabel: 'جاهز الآن',
			isAvailable: true,
			hasOptions: true,
			preparationTime: '18-22 دقيقة',
			mediaKey: 'dsh.product.chicken.v1',
			imageUri: 'dsh.product.chicken.v1',
		},
	]),

	...buildCanonicalPreviewStoreItemsByStoreId(),
};

export function selectDshClientProductPreview(productId: string) {
  for (const products of Object.values(storeItemsByStoreId)) {
    const product = products.find((item) => item.id === productId);
    if (product) return product;
  }
  return null;
}

export function selectDshPartnerCatalogPreview(storeOrBranchId: string) {
  return storeItemsByStoreId[storeOrBranchId] ?? [];
}

// CENTRAL_DATA_CLOSED: Centralized truth for metrics, smart filters, and approval queues.
// Moving these out of UI controllers into the data layer.
export const dshCatalogMetrics = {
  mainCategories: 13,
  subCategories: 24,
  approvedProducts: 14500,
  pendingPartnerReviews: 42,
  pendingMarketingReviews: 18,
  priceConflicts: 7,
  imageExceptions: 124,
} as const;

export type CatalogSmartFilter = {
  id: string;
  label: string;
  count: number;
};

export type CatalogApprovalQueueItem = {
  id: string;
  productId: string;
  stage: string;
  requestedBy: string;
};

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
