import { mapCanonicalStoreToDiscoveryStore, type DshCanonicalProductCard, type DshCanonicalPublishStage, type DshCanonicalStoreCard, type DshDiscoveryStore, type MeasurementOption } from '../shared/dshStoreProductCardModel';
import { buildStoreCategories, buildStoreDeliveryModes, buildStoreTags, dshStoreBuildersContractMeta as buildersDataContract } from '../shared/dsh-store-builders';
import type { DshFulfillmentDeliveryMode } from '../shared/dsh-delivery-mode.model';
import type { DiscoveryFilter, DshServiceId } from '../shared/dsh-discovery.contract';
import type { Phase12FixtureLocation } from '../../types';

// -----------------------------------------------------------------------------
// Discovery stores
// -----------------------------------------------------------------------------
/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — SINGLE SOURCE OF TRUTH
 * Owner: dsh/frontend/data (central DSH domain preview data owner)
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 *
 * Domain: discovery stores (raw domain entities with publish stages)
 * Used by: app-client (via surface adapter), control-panel/marketing
 */


export const dshDiscoveryStoresDataContract = {
	dataKind: 'UI_PREVIEW_ONLY',
	runtimeTruth: false,
	backendSource: false,
	timezoneSemantics: 'not_applicable',
} as const;

export const dshDiscoveryStores: DshDiscoveryStore[] = [
	{
		id: 'store-1001',
		name: 'أسواق العليا الطازجة',
		subtitle: 'حي العليا • الرياض',
		statusLabel: 'مفتوح',
		meta: '18 دقيقة',
		etaMinutes: 18,
		distanceKm: 2.1,
		rating: 5,
		isOffer: true,
		isFavorite: true,
		isFollowing: false,
		mediaKey: 'dsh.store.hittin.cover.v1',
		imageUri: 'dsh.store.hittin.cover.v1',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 11000,
		multiplierLabel: 'x2',
		deliveryFeeLabel: 'رسوم التوصيل 12 ر.ي',
		priceMatchLabel: 'الأسعار مطابقة للمطعم',
		subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
		offerLabel: 'خصم 20%',
		hasBthwaniPro: true,
		hasNewProducts: true,
		hasCouponAvailable: false,
		supportsPickup: true,
		supportsPartnerDelivery: true,
		publishStage: 'published-preview',
		logoImageUri: 'dsh.store.hittin.logo.v1',
	},
	{
		id: 'store-1002',
		name: 'مخبز حطين',
		subtitle: 'حي حطين • الرياض',
		statusLabel: 'مفتوح',
		meta: '25 دقيقة',
		etaMinutes: 25,
		distanceKm: 1.8,
		rating: 4.8,
		isOffer: false,
		isFavorite: false,
		isFollowing: false,
		mediaKey: 'dsh.store.hittin.cover.v1',
		imageUri: 'dsh.store.hittin.cover.v1',
		deliveryLabel: 'كوبون',
		serviceLabel: 'توصيل برو',
		followerCount: 9000,
		multiplierLabel: 'x1',
		deliveryFeeLabel: 'رسوم التوصيل 8 ر.ي',
		priceMatchLabel: 'الأسعار مطابقة للمخبز',
		subscriptionPackageChips: ['كوبون', 'توصيل مجاني'],
		hasBthwaniPro: true,
		hasNewProducts: false,
		hasCouponAvailable: true,
		supportsPickup: true,
		supportsPartnerDelivery: true,
		publishStage: 'published-preview',
		logoImageUri: 'dsh.store.hittin.logo.v1',
	},
	{
		id: 'store-1003',
		name: 'مطبخ الملقا',
		subtitle: 'حي الملقا • الرياض',
		statusLabel: 'مشغول',
		meta: '32 دقيقة',
		etaMinutes: 32,
		distanceKm: 3.5,
		rating: 4.9,
		isOffer: true,
		isFavorite: false,
		isFollowing: false,
		mediaKey: 'dsh.store.malqa.cover.v1',
		imageUri: 'dsh.store.malqa.cover.v1',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 23400,
		multiplierLabel: 'x3',
		deliveryFeeLabel: 'رسوم التوصيل 14 ر.ي',
		priceMatchLabel: 'الأسعار مطابقة للمطبخ',
		subscriptionPackageChips: ['توصيل سريع', 'أولوية'],
		offerLabel: 'خصم 15%',
		hasBthwaniPro: true,
		hasNewProducts: true,
		hasCouponAvailable: false,
		supportsPickup: true,
		supportsPartnerDelivery: true,
		publishStage: 'published-preview',
		logoImageUri: 'dsh.store.malqa.logo.v1',
	},
	{
		id: 'store-hidden-marketing',
		name: 'متجر قيد المراجعة',
		subtitle: 'لا ينبغي ظهوره للعميل',
		statusLabel: 'مغلق',
		meta: '0 دقيقة',
		etaMinutes: 0,
		distanceKm: 0,
		rating: 0,
		isOffer: false,
		isFavorite: false,
		isFollowing: false,
		imageUri: 'dsh.store.malqa.cover.v1',
		deliveryLabel: '-',
		serviceLabel: '-',
		followerCount: 0,
		multiplierLabel: 'x0',
		subscriptionPackageChips: [],
		hasBthwaniPro: false,
		hasNewProducts: false,
		hasCouponAvailable: false,
		supportsPickup: false,
		supportsPartnerDelivery: false,
		publishStage: 'marketing-review',
	},
	{
		id: 'store-hidden-partner',
		name: 'متجر في الشريك',
		subtitle: 'لا ينبغي ظهوره',
		statusLabel: 'مغلق',
		meta: '0 دقيقة',
		etaMinutes: 0,
		distanceKm: 0,
		rating: 0,
		isOffer: false,
		isFavorite: false,
		isFollowing: false,
		imageUri: 'dsh.store.hadda.cover.v1',
		deliveryLabel: '-',
		serviceLabel: '-',
		followerCount: 0,
		multiplierLabel: 'x0',
		subscriptionPackageChips: [],
		hasBthwaniPro: false,
		hasNewProducts: false,
		hasCouponAvailable: false,
		supportsPickup: false,
		supportsPartnerDelivery: false,
		publishStage: 'partner-review',
	},
	{
		id: 'store-hidden-catalog',
		name: 'متجر معتمد كتالوج',
		subtitle: 'لا ينبغي ظهوره حتى التفعيل',
		statusLabel: 'مغلق',
		meta: '0 دقيقة',
		etaMinutes: 0,
		distanceKm: 0,
		rating: 0,
		isOffer: false,
		isFavorite: false,
		isFollowing: false,
		imageUri: 'dsh.store.malqa.cover.v1',
		deliveryLabel: '-',
		serviceLabel: '-',
		followerCount: 0,
		multiplierLabel: 'x0',
		subscriptionPackageChips: [],
		hasBthwaniPro: false,
		hasNewProducts: false,
		hasCouponAvailable: false,
		supportsPickup: false,
		supportsPartnerDelivery: false,
		publishStage: 'catalog-adopted',
	},
	{
		id: 'store-visible-client',
		name: 'متجر مرئي',
		subtitle: 'ظاهر للعميل',
		statusLabel: 'مفتوح',
		meta: '10 دقيقة',
		etaMinutes: 10,
		distanceKm: 1.0,
		rating: 5,
		isOffer: false,
		isFavorite: false,
		isFollowing: false,
		imageUri: 'dsh.store.hadda.cover.v1',
		deliveryLabel: 'سريع',
		serviceLabel: 'برو',
		followerCount: 100,
		multiplierLabel: 'x1',
		subscriptionPackageChips: [],
		hasBthwaniPro: false,
		hasNewProducts: false,
		hasCouponAvailable: false,
		supportsPickup: true,
		supportsPartnerDelivery: true,
		publishStage: 'client-visible',
	},
	{
		id: 'store-blocked-badge',
		name: 'متجر بتعارض بروموشن',
		subtitle: 'الشارة يجب أن تختفي',
		statusLabel: 'مفتوح',
		meta: '15 دقيقة',
		etaMinutes: 15,
		distanceKm: 1.5,
		rating: 4.5,
		isOffer: true,
		isFavorite: false,
		isFollowing: false,
		imageUri: 'dsh.store.hadda.cover.v1',
		deliveryLabel: 'سريع',
		serviceLabel: 'برو',
		followerCount: 50,
		multiplierLabel: 'x1',
		subscriptionPackageChips: [],
		hasBthwaniPro: false,
		hasNewProducts: false,
		hasCouponAvailable: false,
		supportsPickup: true,
		supportsPartnerDelivery: true,
		publishStage: 'client-visible',
		offerLabel: 'خصم وهمي',
		commercialSourceMap: {
			'offerLabel': {
				sourceOwner: 'marketing-hard-gate',
				sourceRecordId: 'conflict-001',
				sourceType: 'offer',
			}
		}
	},
	...buildCanonicalPreviewDiscoveryStores(),
];

// -----------------------------------------------------------------------------
// Home stores and discovery surface
// -----------------------------------------------------------------------------
// Semantic color tokens — stored as token strings; resolution happens at adapter/render boundary only.

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshHomeGetFixturesDataContract = {
	dataKind: 'UI_PREVIEW_ONLY',
	runtimeTruth: false,
	backendSource: false,
	bindingSource: false,
	timezoneSemantics: 'preview-only local display / not runtime UTC source',
	moneySemantics: 'preview-only display values / not accounting source',
} as const;

export type DshHomeGetFixtureProduct = {
	id: string;
	name: string;
	mediaKey: string;
	categoryId: string;
	storeId?: string;
};
export type DshHomeGetFixturePromo = {
	id: string;
	title: string;
	subtitle: string;
	icon: string;
	mediaKey?: string;
	actionType?: 'main_category' | 'sub_category' | 'store' | 'external' | 'store_category' | 'product' | 'subscription';
	actionTarget?: string;
	actionExtra?: string;
	imageUrl?: string;
	accentColor?: string;
	publishStage?: string;
	mediaPolicy?: string;
};

export type DshHomeServiceDialFixture = {
	id: string;
	key: DshServiceId;
	title: string;
	shortLabel?: string;
	subtitle?: string;
	iconUrl: string | null;
	emojiFallback?: string;
};

export type DshHomeDiscoveryFilterFixture = {
	value: DiscoveryFilter;
	label: string;
	iconName: string;
};

export type DshHomeGetFixtureStore = {
	id: string;
	name: string;
	address: string;
	categoryId?: string;
	statusLabel: string;
	statusTone: 'open' | 'closed';
	distanceLabel: string;
	deliveryLabel: string;
	serviceLabel: string;
	followerCount: number;
	multiplierLabel: string;
	offerLabel?: string;
	isFavorite: boolean;
	isFollowing: boolean;
	hasOffer?: boolean;
	rating?: number;
	mediaKey?: string;

	imageUri?: string;
	hasBthwaniPro?: boolean;
	subscriptionPackageChips?: string[];
	hasCouponAvailable?: boolean;
	hasNewProducts?: boolean;
	publishStage?: string;
	mediaPolicy?: string;
	sourceRecordId?: string;
	canonicalStoreId?: string;
	commercialSourceMap?: import('../shared/store-card-commercial-map').CommercialSourceMap;
	supportsPickup?: boolean;
	supportsPartnerDelivery?: boolean;
	// PREMIUM 2026
	locationLabel?: string;
	deliveryTimeLabel?: string;
	isPopular?: boolean;
	logoImageUri?: string;
};

function formatDistanceLabel(distanceKm: number) {
	return `${distanceKm.toFixed(1).replace(/\.0$/, '')} كم`;
}

function toDshHomeGetFixtureStore(store: DshDiscoveryStore): DshHomeGetFixtureStore {
	return {
		id: store.id,
		name: store.name,
		address: store.subtitle,
		categoryId: 'restaurants',
		statusLabel: store.statusLabel,
		statusTone: store.statusLabel === 'مفتوح' ? 'open' : 'closed',
		distanceLabel: formatDistanceLabel(store.distanceKm),
		deliveryLabel: store.deliveryLabel,
		serviceLabel: store.serviceLabel,
		followerCount: store.followerCount,
		multiplierLabel: store.multiplierLabel,
		offerLabel: store.offerLabel,
		isFavorite: store.isFavorite,
		isFollowing: store.isFollowing,
		hasOffer: store.isOffer,
		rating: store.rating,
		mediaKey: store.mediaKey,
		imageUri: store.imageUri,
		hasBthwaniPro: store.hasBthwaniPro,
		subscriptionPackageChips: store.subscriptionPackageChips,
		hasCouponAvailable: store.hasCouponAvailable,
		hasNewProducts: store.hasNewProducts,
		publishStage: store.publishStage,
		mediaPolicy: store.mediaPolicy,
		sourceRecordId: store.sourceRecordId,
		canonicalStoreId: store.canonicalStoreId,
		commercialSourceMap: store.commercialSourceMap,
		supportsPickup: store.supportsPickup,
		supportsPartnerDelivery: store.supportsPartnerDelivery,
		logoImageUri: store.logoImageUri,
	};
}

function ensureFixtureStorePublishStage(store: DshHomeGetFixtureStore): DshHomeGetFixtureStore {
	if (store.publishStage) {
		return store;
	}

	return {
		...store,
		publishStage: 'published-preview',
	};
}

export type DshHomeGetFixtureTickerBanner = {
	id: string;
	openHour: number;
	closeHour: number;
	openStatusLabel: string;
	closedStatusLabel: string;
	openMessage: string;
	closedMessage: string;
};

export const dshHomeGetFixtureTickerBanner: DshHomeGetFixtureTickerBanner = {
	id: 'dsh-home-ticker-banner',
	openHour: 8,
	closeHour: 23,
	openStatusLabel: 'مباشر',
	closedStatusLabel: 'مغلق',
	openMessage: 'المساحة مخصصة للشريط الإخباري • اطلب إلى المنزل أو افتح الطلب النشط خلال خطوة واحدة',
	closedMessage: 'خارج الدوام تظهر المساحة مغلقة مع بقاء المسارات محفوظة للعودة لاحقًا',
};

export const dshHomeServiceDialFixtures: DshHomeServiceDialFixture[] = [
	{
		id: 'service-dsh',
		key: 'dsh',
		title: 'توصيل',
		iconUrl: null,
		emojiFallback: '🚚',
	},
	{
		id: 'service-knz',
		key: 'knz',
		title: 'كنز',
		iconUrl: null,
		emojiFallback: '🪙',
	},
	{
		id: 'service-amn',
		key: 'amn',
		title: 'أمان',
		iconUrl: null,
		emojiFallback: '🛡️',
	},
	{
		id: 'service-arb',
		key: 'arb',
		title: 'عربون',
		iconUrl: null,
		emojiFallback: '💳',
	},
	{
		id: 'service-wlt',
		key: 'wlt',
		title: 'المحفظة',
		iconUrl: null,
		emojiFallback: '👛',
	},
	{
		id: 'service-esf',
		key: 'esf',
		title: 'أسعفني',
		iconUrl: null,
		emojiFallback: '🩺',
	},
	{
		id: 'service-kwd',
		key: 'kwd',
		title: 'كوادر',
		iconUrl: null,
		emojiFallback: '🧰',
	},
	{
		id: 'service-mrf',
		key: 'mrf',
		title: 'معروف',
		iconUrl: null,
		emojiFallback: '🏷️',
	},
	{
		id: 'service-snd',
		key: 'snd',
		title: 'سند',
		iconUrl: null,
		emojiFallback: '🤝',
	},
];

export const dshHomeDiscoveryFilterFixtures: DshHomeDiscoveryFilterFixture[] = [
	{ value: 'all', label: 'الكل', iconName: 'reorder-three-outline' },
	{ value: 'favorites', label: 'المفضلة', iconName: 'heart-outline' },
	{ value: 'nearest', label: 'الأقرب', iconName: 'locate-outline' },
	{ value: 'new', label: 'الجديدة', iconName: 'sparkles-outline' },
	{ value: 'offers', label: 'العروض', iconName: 'pricetag-outline' },
];

export const dshHomeGetFixturePromos: DshHomeGetFixturePromo[] = [
	{
		id: 'promo-1',
		mediaKey: 'dsh.banner.home.promo-1.v1',
		title: 'تخفيضات حصرية',
		subtitle: 'خصم 30% على طلبك الأول عبر التطبيق',
		icon: '🔥',
		accentColor: 'brand.500',
		actionType: 'main_category',
		actionTarget: 'restaurants',
	},
	{
		id: 'promo-2',
		mediaKey: 'dsh.banner.home.promo-2.v1',
		title: 'تتبع طلبك',
		subtitle: 'تابع حالة طلبك مباشرة وبدقة عالية',
		icon: '📍',
		accentColor: 'info.600',
		actionType: 'store',
		actionTarget: 'store-1001',
	},
	{
		id: 'promo-3',
		mediaKey: 'dsh.banner.home.promo-3.v1',
		title: 'خضروات طازجة',
		subtitle: 'أفضل الفواكه والخضروات تصلك لباب المنزل',
		icon: '✨',
		accentColor: 'danger.600',
		actionType: 'sub_category',
		actionTarget: 'grocery',
		actionExtra: 'grocery_vegetables_fruits',
	},
	{
		id: 'promo-4',
		mediaKey: 'dsh.banner.home.promo-4.v1',
		title: 'وجبات عائلية',
		subtitle: 'وفر 40% على منيو العائلة اليوم',
		icon: '🍽️',
		accentColor: 'success.600',
		actionType: 'main_category',
		actionTarget: 'restaurants',
	},
	{
		id: 'promo-5',
		mediaKey: 'dsh.banner.home.promo-5.v1',
		title: 'حلويات ومشروبات',
		subtitle: 'أشهى الحلويات والعصائر الطازجة بخطوة واحدة',
		icon: '🧃',
		accentColor: 'brand.400',
		actionType: 'main_category',
		actionTarget: 'sweets_juices',
	},
	{
		id: 'promo-6',
		mediaKey: 'dsh.banner.home.promo-6.v1',
		title: 'مخابز حطين',
		subtitle: 'خبز طازج يومياً مع توصيل مجاني',
		icon: '🍞',
		accentColor: 'danger.400',
		actionType: 'store',
		actionTarget: 'store-1002',
	},
	{
		id: 'promo-7',
		mediaKey: 'dsh.banner.home.promo-7.v1',
		title: 'اشتراك بثواني برو',
		subtitle: 'توصيل مجاني غير محدود + عروض حصرية',
		icon: '⭐',
		accentColor: 'info.700',
		actionType: 'subscription',
		actionTarget: 'subscription-family-get',
	},
];

export const dshHomeGetNormalizedFixturePromos: DshHomeGetFixturePromo[] = dshHomeGetFixturePromos.map((promo) => ({
	...promo,
	publishStage: promo.publishStage ?? 'published-preview',
}));

export const dshHomeGetFixtureProducts: DshHomeGetFixtureProduct[] = [
	{
		id: 'home-product-1',
		name: 'apple',
		mediaKey: 'dsh.product.apple.v1',
		categoryId: 'grocery',
	},
	{
		id: 'home-product-2',
		name: 'bread',
		mediaKey: 'dsh.product.bread.v1',
		categoryId: 'grocery',
	},
	{
		id: 'home-product-3',
		name: 'chicken',
		mediaKey: 'dsh.product.chicken.v1',
		categoryId: 'meals',
	},
	{
		id: 'home-product-4',
		name: 'choco',
		mediaKey: 'dsh.product.choco.v1',
		categoryId: 'sweets_juices',
	},
	{
		id: 'home-product-5',
		name: 'croissant',
		mediaKey: 'dsh.product.croissant.v1',
		categoryId: 'bakery',
	},
	{
		id: 'home-product-6',
		name: 'milk',
		mediaKey: 'dsh.product.milk.v1',
		categoryId: 'grocery',
	},
	{
		id: 'home-product-7',
		name: 'pasta',
		mediaKey: 'dsh.product.pasta.v1',
		categoryId: 'cloud_kitchens',
		storeId: 'store-2901',
	},
	{
		id: 'home-product-8',
		name: 'roll',
		mediaKey: 'dsh.product.roll.v1',
		categoryId: 'bakery',
	},
	{
		id: 'home-product-9',
		name: 'salad',
		mediaKey: 'dsh.product.salad.v1',
		categoryId: 'healthy',
	},
	{
		id: 'home-product-10',
		name: 'yogurt',
		mediaKey: 'dsh.product.yogurt.v1',
		categoryId: 'dairy',
	},
	{
		id: 'home-product-11',
		name: 'cloud-kitchen-pasta',
		mediaKey: 'dsh.product.pasta.v1',
		categoryId: 'cloud_kitchens',
		storeId: 'store-2901',
	},
	{
		id: 'home-product-12',
		name: 'cloud-kitchen-chicken',
		mediaKey: 'dsh.product.chicken.v1',
		categoryId: 'cloud_kitchens',
		storeId: 'store-2902',
	},
	{
		id: 'home-product-13',
		name: 'cloud-kitchen-salad',
		mediaKey: 'dsh.product.salad.v1',
		categoryId: 'cloud_kitchens',
		storeId: 'store-2903',
	},
];

export const dshHomeGetFixtureStoresRaw: DshHomeGetFixtureStore[] = [
	{
		id: 'store-2001',
		name: 'برجر هاوس',
		address: 'حي العليا، شارع الستين',
		categoryId: 'grocery',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '2.1 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 11000,
		multiplierLabel: 'x2',
		offerLabel: 'خصم 20%',
		isFavorite: false,
		isFollowing: true,
		hasOffer: true,
		rating: 4.8,
		mediaKey: 'dsh.store.hadda.cover.v1',

		imageUri: 'dsh.store.hadda.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['توصيل سريع', 'عروض يومية'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		// PREMIUM 2026
		locationLabel: 'حي العليا • الرياض',
		deliveryTimeLabel: '25-35 د',
		isPopular: true,
		logoImageUri: 'dsh.store.hadda.logo.v1',
	},
	{
		id: 'store-2002',
		name: 'خيرات المدينة',
		address: 'شارع الجامعة، باب اليمن',
		categoryId: 'grocery',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '1.6 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 5400,
		multiplierLabel: 'x1',
		isFavorite: true,
		isFollowing: false,
		hasOffer: false,
		rating: 3.9,
		mediaKey: 'dsh.store.hittin.cover.v1',

		imageUri: 'dsh.store.hittin.cover.v1',
		hasBthwaniPro: false, // NO PRO
		subscriptionPackageChips: [],
		hasCouponAvailable: false,
		hasNewProducts: false,
		// ADAPTIVE PREVIEW
		locationLabel: 'باب اليمن • صنعاء',
		deliveryTimeLabel: '15-25 د',
		isPopular: false,
		logoImageUri: 'dsh.store.hittin.logo.v1',
	},
	{
		id: 'store-2101',
		name: 'عصائر الساحة',
		address: 'حي الحصبة، شارع الأربعين',
		categoryId: 'sweets_juices',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '2.2 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 3200,
		multiplierLabel: 'x1',
		offerLabel: 'عرض 15%',
		isFavorite: false,
		isFollowing: false,
		hasOffer: true,
		rating: 4.1,
		mediaKey: 'dsh.store.malqa.cover.v1',

		imageUri: 'dsh.store.malqa.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['عصائر طازجة', 'حلويات'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		logoImageUri: 'dsh.store.malqa.logo.v1',
	},
	{
		id: 'store-2102',
		name: 'حلويات البلدة',
		address: 'شارع الستين الجنوبي',
		categoryId: 'sweets_juices',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '3.1 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 4100,
		multiplierLabel: 'x2',
		isFavorite: true,
		isFollowing: true,
		hasOffer: false,
		rating: 3.6,
		mediaKey: 'dsh.store.hadda.cover.v1',

		imageUri: 'dsh.store.hadda.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['حلويات', 'آيسكريم'],
		hasCouponAvailable: false,
		hasNewProducts: false,
		logoImageUri: 'dsh.store.hadda.logo.v1',
	},
	{
		id: 'store-2201',
		name: 'أناقتي بوتيك',
		address: 'شارع بغداد، قرب المجمع',
		categoryId: 'anaqati',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '4.0 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 2800,
		multiplierLabel: 'x1',
		offerLabel: 'عرض موسمي',
		isFavorite: false,
		isFollowing: true,
		hasOffer: true,
		rating: 2.7,
		mediaKey: 'dsh.store.hittin.cover.v1',

		imageUri: 'dsh.store.hittin.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['عطور', 'ملابس'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2202',
		name: 'جمال الورد',
		address: 'حي الشهداء، أمام الحدائق',
		categoryId: 'anaqati',
		statusLabel: 'مغلق',
		statusTone: 'closed',
		distanceLabel: '5.1 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 2500,
		multiplierLabel: 'x1',
		isFavorite: true,
		isFollowing: false,
		hasOffer: false,
		rating: 4.0,
		mediaKey: 'dsh.store.malqa.cover.v1',

		imageUri: 'dsh.store.malqa.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['إكسسوارات', 'تجميل'],
		hasCouponAvailable: false,
		hasNewProducts: false,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2301',
		name: 'بثواني ستور',
		address: 'المركز الرئيسي، شارع الستين',
		categoryId: 'wani_store',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '1.2 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 9800,
		multiplierLabel: 'x3',
		offerLabel: 'أولوية',
		isFavorite: true,
		isFollowing: true,
		hasOffer: true,
		rating: 5,
		mediaKey: 'dsh.store.hadda.cover.v1',

		imageUri: 'dsh.store.hadda.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['منتجات مختارة', 'أولوية'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2401',
		name: 'مشاريع البيت',
		address: 'حي الصافية، شارع الحرية',
		categoryId: 'home_projects',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '6.4 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 1500,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: false,
		hasOffer: false,
		rating: 3.1,
		mediaKey: 'dsh.store.hittin.cover.v1',

		imageUri: 'dsh.store.hittin.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['أسر منتجة', 'منتجات منزلية'],
		hasCouponAvailable: false,
		hasNewProducts: true,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2501',
		name: 'تعبئة الأمان',
		address: 'جولة الستين، مقابل المحطة',
		categoryId: 'gas_refill',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '3.8 كم',
		deliveryLabel: 'خدمة ميدانية',
		serviceLabel: 'توصيل برو',
		followerCount: 1900,
		multiplierLabel: 'x1',
		offerLabel: 'زيارة اليوم',
		isFavorite: false,
		isFollowing: true,
		hasOffer: true,
		rating: 4.2,
		mediaKey: 'dsh.store.malqa.cover.v1',

		imageUri: 'dsh.store.malqa.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['تعبئة', 'إصلاح'],
		hasCouponAvailable: false,
		hasNewProducts: false,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2601',
		name: 'قطع الغيار السريعة',
		address: 'شارع الجزائر، الصناعية',
		categoryId: 'spare_parts',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '5.0 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 2400,
		multiplierLabel: 'x2',
		isFavorite: false,
		isFollowing: false,
		hasOffer: false,
		rating: 3.0,
		mediaKey: 'dsh.store.hadda.cover.v1',

		imageUri: 'dsh.store.hadda.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['قطع غيار', 'إكسسوارات'],
		hasCouponAvailable: false,
		hasNewProducts: true,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2701',
		name: 'العسل والتمر الأصيلة',
		address: 'حي شعوب، شارع الأربعين',
		categoryId: 'honey_dates',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '4.7 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 3100,
		multiplierLabel: 'x1',
		offerLabel: 'صنف مميز',
		isFavorite: true,
		isFollowing: true,
		hasOffer: true,
		rating: 4.4,
		mediaKey: 'dsh.store.hittin.cover.v1',

		imageUri: 'dsh.store.hittin.cover.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['عسل', 'تمور'],
		hasCouponAvailable: true,
		hasNewProducts: false,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2801',
		name: 'تقنية 24',
		address: 'شارع خولان، بجانب الجامعة',
		categoryId: 'electronics',
		statusLabel: 'مغلق',
		statusTone: 'closed',
		distanceLabel: '7.2 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 2700,
		multiplierLabel: 'x2',
		isFavorite: false,
		isFollowing: false,
		hasOffer: false,
		rating: 2.5,
		mediaKey: 'dsh.store.malqa.cover.v1',

		imageUri: 'dsh.store.malqa.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['إلكترونيات', 'إكسسوارات'],
		hasCouponAvailable: false,
		hasNewProducts: true,
		logoImageUri: 'dsh.brand.logo.v1',
	},
	{
		id: 'store-2901',
		name: 'مطبخ النور السحابي',
		address: 'حي العليا، مطبخ مركزي سريع',
		categoryId: 'cloud_kitchens',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '2.0 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 6600,
		multiplierLabel: 'x2',
		offerLabel: 'خصم 18%',
		isFavorite: true,
		isFollowing: false,
		hasOffer: true,
		rating: 4.6,
		mediaKey: 'dsh.product.pasta.v1',

		imageUri: 'dsh.product.pasta.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['وجبات يومية', 'جاهز الآن'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		logoImageUri: 'dsh.store.malqa.logo.v1',
	},
	{
		id: 'store-2902',
		name: 'مطبخ الوجبات السريعة',
		address: 'حي المروج، إنتاج سحابي',
		categoryId: 'cloud_kitchens',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '3.3 كم',
		deliveryLabel: 'توصيل مجاني',
		serviceLabel: 'توصيل برو',
		followerCount: 4200,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: true,
		hasOffer: false,
		rating: 4.2,
		mediaKey: 'dsh.product.chicken.v1',

		imageUri: 'dsh.product.chicken.v1',
		hasBthwaniPro: true,
		subscriptionPackageChips: ['سندويشات', 'وجبات سريعة'],
		hasCouponAvailable: false,
		hasNewProducts: false,
		logoImageUri: 'dsh.store.hadda.logo.v1',
	},
	{
		id: 'store-2903',
		name: 'مطبخ اليوم الطازج',
		address: 'حي النرجس، إنتاج يومي',
		categoryId: 'cloud_kitchens',
		statusLabel: 'مشغول',
		statusTone: 'open',
		distanceLabel: '4.4 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 3700,
		multiplierLabel: 'x1',
		offerLabel: 'عرض 12%',
		isFavorite: false,
		isFollowing: false,
		hasOffer: true,
		rating: 4.1,
		mediaKey: 'dsh.product.salad.v1',

		imageUri: 'dsh.product.salad.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['سلطات', 'خيارات خفيفة'],
		hasCouponAvailable: true,
		hasNewProducts: true,
		logoImageUri: 'dsh.store.hittin.logo.v1',
	},
	// INVARIANT: awnak and shein are manual-order services, NOT store cards.
	// Any fixture with categoryId 'awnak' or 'shein' must NOT appear here.
	// Their entry points are DshAwnakOrderCreateScreen and DshSheinOrderCreateScreen.
	{
		id: 'store-test-marketing',
		name: 'متجر قيد المراجعة التسويقية',
		address: 'لا يجب أن يظهر للعميل',
		categoryId: 'restaurants',
		statusLabel: 'مخفي',
		statusTone: 'closed',
		distanceLabel: '0 كم',
		deliveryLabel: 'مخفي',
		serviceLabel: 'مخفي',
		followerCount: 0,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: false,
		rating: 0,
		publishStage: 'marketing-review',
	},
	{
		id: 'store-test-catalog',
		name: 'متجر معتمد كتالوج',
		address: 'لا يجب أن يظهر للعميل حتى التفعيل',
		categoryId: 'restaurants',
		statusLabel: 'مخفي',
		statusTone: 'closed',
		distanceLabel: '0 كم',
		deliveryLabel: 'مخفي',
		serviceLabel: 'مخفي',
		followerCount: 0,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: false,
		rating: 0,
		publishStage: 'catalog-adopted',
	},
	{
		id: 'store-test-visible',
		name: 'متجر مرئي للعميل (v2)',
		address: 'يجب أن يظهر بوضوح',
		categoryId: 'restaurants',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '1.0 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 500,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: false,
		rating: 4.5,
		publishStage: 'client-visible',
	},
	{
		id: 'store-test-blocked',
		name: 'متجر بتعارض برمجني (Blocked)',
		address: 'يجب ألا يظهر فيه أي شارات تجارية',
		categoryId: 'restaurants',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '1.2 كم',
		deliveryLabel: 'توصيل سريع',
		serviceLabel: 'توصيل برو',
		followerCount: 300,
		multiplierLabel: 'x1',
		isFavorite: false,
		isFollowing: false,
		rating: 4.2,
		publishStage: 'client-visible',
		commercialSourceMap: {
			'hasBthwaniPro': {
				sourceOwner: './subscriptions.preview-data',
				sourceRecordId: 'sub-pro',
				sourceType: 'subscription',
				approvalStage: 'active',
				conflictSeverity: 'blocker',
				conflictReason: 'تعارض أمني في الشارات'
			},
			'offerLabel': {
				sourceOwner: 'marketing-store',
				sourceRecordId: 'offer-123',
				sourceType: 'offer',
				approvalStage: 'approved',
				conflictSeverity: 'blocker',
				conflictReason: 'تعارض في العروض'
			},
			'deliveryFeeLabel': {
				sourceOwner: 'logistics-store',
				sourceRecordId: 'del-456',
				sourceType: 'delivery',
				approvalStage: 'active',
				conflictSeverity: 'blocker',
				conflictReason: 'تعارض في التوصيل'
			},
			'hasCouponAvailable': {
				sourceOwner: 'marketing-store',
				sourceRecordId: 'coupon-789',
				sourceType: 'partner',
				approvalStage: 'active',
				conflictSeverity: 'blocker',
				conflictReason: 'تعارض في الكوبونات'
			}
		}
	},
];

function assertNoManualOrderStoreLeakage(stores: DshHomeGetFixtureStore[]): DshHomeGetFixtureStore[] {
	const leaked = stores.filter((s) => s.categoryId === 'awnak' || s.categoryId === 'shein');
	if (leaked.length > 0) {
		throw new Error(
			`[DSH] Domain invariant violated: store fixtures may not use categoryId 'awnak' or 'shein'. ` +
			`These are manual-order services rendered by DshAwnakOrderCreateScreen / DshSheinOrderCreateScreen, ` +
			`not store cards. Found: ${leaked.map((s) => `${s.id}(${s.categoryId})`).join(', ')}.`
		);
	}
	return stores;
}

export const dshHomeGetFixtureStores: DshHomeGetFixtureStore[] = assertNoManualOrderStoreLeakage([
	...dshDiscoveryStores.map(toDshHomeGetFixtureStore),
	...dshHomeGetFixtureStoresRaw.map(ensureFixtureStorePublishStage),
]);

// -----------------------------------------------------------------------------
// Field store intake
// -----------------------------------------------------------------------------
export type FieldFulfillmentMode = DshFulfillmentDeliveryMode;

export type FieldFulfillmentModeAgreement = {
  mode: FieldFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  /** UI_PREVIEW_ONLY — actual rate is WLT-owned */
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
};

export type FieldStatusTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type FieldLeadSource = 'candidate' | 'manual';

export type FieldLeadStatus =
  | 'new-lead'
  | 'visit-planned'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'appointment-scheduled'
  | 'visited'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';

export type FieldLeadFilter = 'all' | 'today' | 'ready' | 'follow-up' | 'pending' | 'submitted' | 'done';

export type FieldOnboardingSectionId = 'basics' | 'classification' | 'location' | 'photos' | 'documents' | 'products' | 'offer' | 'review';

export type FieldDocumentPreviewStatus =
  | 'missing'
  | 'uploaded'
  | 'approved'
  | 'needs_reupload'
  | 'rejected';

export type FieldOnboardingDraft = {
  activeSectionId: FieldOnboardingSectionId;
  basics: {
    storeName: string;
    ownerName: string;
    ownerPhone: string;
    managerName: string;
  };
  classification: {
    storeType: string;
    mainCategory: string;
    subCategory: string;
  };
  location: {
    city: string;
    zone: string;
    addressLine: string;
    coverageSummary: string;
    latitude: string;
    longitude: string;
    landmark: string;
  };
  photos: {
    storefrontPhotoRef: string;
    interiorPhotoRef: string;
    signagePhotoRef: string;
  };
  documents: {
    commercialRegistrationRef: string;
    ownerIdRef: string;
    tradeLicenseRef: string;
    commercialRegistrationStatus: FieldDocumentPreviewStatus;
    ownerIdStatus: FieldDocumentPreviewStatus;
    tradeLicenseStatus: FieldDocumentPreviewStatus;
  };
  products: {
    featuredProductName: string;
    featuredProductPrice: string;
    sampleCatalogNote: string;
  };
  offer: {
    preliminaryOffer: string;
    operatingHours: string;
    deliveryReadiness: string;
    financeNote: string;
  };
  review: {
    fieldNotes: string;
    partnerReviewNote: string;
  };
  lastSavedLabel: string;
  submittedAt?: string;
};

export type FieldStoreFile = {
  id: string;
  source: FieldLeadSource;
  name: string;
  category: string;
  location: string;
  nextVisitLabel: string;
  assignedFieldMember: string;
  lastUpdatedLabel: string;
  lockedStatus?: FieldLeadStatus;
  stageLabelOverride?: string;
  statusNoteOverride?: string;
  lifecycleNote?: string;
  financeLabel: string;
  reviewFeedback?: string;
  draft: FieldOnboardingDraft;
  /** UI_PREVIEW_ONLY — agreed fulfillment modes for this store; authoritative in WLT/backend */
  fulfillmentAgreements?: readonly FieldFulfillmentModeAgreement[];
};

export type FieldSectionSummary = {
  id: FieldOnboardingSectionId;
  label: string;
  complete: boolean;
  missingCount: number;
};

export const fieldStatusLabels: Record<FieldLeadStatus, string> = {
  'new-lead': 'فرصة جديدة',
  'visit-planned': 'زيارة مخططة',
  'offer-pending-approval': 'بانتظار اعتماد العرض',
  'offer-approved': 'العرض معتمد',
  'appointment-scheduled': 'جاهز للزيارة',
  visited: 'بانتظار تسجيل النتيجة',
  'follow-up-required': 'تحتاج متابعة',
  'ready-for-onboarding': 'جاهز للإضافة',
  submitted: 'مرسل للمراجعة',
};

export const fieldStatusTones: Record<FieldLeadStatus, FieldStatusTone> = {
  'new-lead': 'default',
  'visit-planned': 'info',
  'offer-pending-approval': 'warning',
  'offer-approved': 'success',
  'appointment-scheduled': 'brand',
  visited: 'info',
  'follow-up-required': 'warning',
  'ready-for-onboarding': 'success',
  submitted: 'brand',
};

export const fieldFilterOptions: readonly { id: FieldLeadFilter; label: string; tone: FieldStatusTone }[] = [
  { id: 'all', label: 'الكل', tone: 'default' },
  { id: 'today', label: 'اليوم', tone: 'brand' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'follow-up', label: 'تحتاج متابعة', tone: 'warning' },
  { id: 'pending', label: 'بانتظار اعتماد', tone: 'info' },
  { id: 'submitted', label: 'مرسل', tone: 'brand' },
  { id: 'done', label: 'منتهٍ للميداني', tone: 'success' },
] as const;

export const fieldSectionOrder: readonly FieldOnboardingSectionId[] = [
  'basics',
  'classification',
  'location',
  'photos',
  'documents',
  'products',
  'offer',
  'review',
] as const;

export const fieldSectionLabels: Record<FieldOnboardingSectionId, string> = {
  basics: 'البيانات الأساسية',
  classification: 'النوع والتصنيف',
  location: 'الموقع والتغطية',
  photos: 'الصور',
  documents: 'التحقق من المستندات',
  products: 'المنتجات الأولية',
  offer: 'العرض والاتفاق',
  review: 'المراجعة والإرسال',
};

function formatNowLabel() {
  try {
    const time = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' }).format(new Date());
    return `اليوم ${time}`;
  } catch {
    return 'الآن';
  }
}

function resolveFieldCanonicalPublishStage(store: FieldStoreFile): DshCanonicalPublishStage {
  const status = resolveFieldStoreStatus(store);
  const lifecycleNote = store.lifecycleNote?.trim() ?? '';

  if (status === 'submitted') {
    return lifecycleNote.includes('مراجعة الشركاء') || store.draft.review.partnerReviewNote.trim().length > 0
      ? 'partner-review'
      : 'field-submitted';
  }

  if (status === 'offer-approved') {
    return lifecycleNote.includes('ظهر الشريك للعملاء') || lifecycleNote.includes('ظهر للعملاء')
      ? 'published-preview'
      : 'marketing-review';
  }

  return 'field-draft';
}

function formatFieldProductPriceLabel(price: string) {
  const trimmedPrice = price.trim();
  return trimmedPrice ? `${trimmedPrice} ر.ي` : 'غير محدد';
}

function parseFieldProductPriceValue(price: string) {
  const normalizedPrice = Number(price.trim());
  return Number.isFinite(normalizedPrice) ? normalizedPrice : undefined;
}

function resolveFieldProductCategoryId(store: FieldStoreFile) {
  const mainCategory = store.draft.classification.mainCategory.trim();
  const subCategory = store.draft.classification.subCategory.trim();
  return `field:${mainCategory || 'general'}:${subCategory || 'general'}`;
}

export function createEmptyDraft(overrides?: Partial<FieldOnboardingDraft>): FieldOnboardingDraft {
  return {
    activeSectionId: 'basics',
    basics: {
      storeName: '',
      ownerName: '',
      ownerPhone: '',
      managerName: '',
    },
    classification: {
      storeType: '',
      mainCategory: '',
      subCategory: '',
    },
    location: {
      city: '',
      zone: '',
      addressLine: '',
      coverageSummary: '',
      latitude: '',
      longitude: '',
      landmark: '',
    },
    photos: {
      storefrontPhotoRef: '',
      interiorPhotoRef: '',
      signagePhotoRef: '',
    },
    documents: {
      commercialRegistrationRef: '',
      ownerIdRef: '',
      tradeLicenseRef: '',
      commercialRegistrationStatus: 'missing',
      ownerIdStatus: 'missing',
      tradeLicenseStatus: 'missing',
    },
    products: {
      featuredProductName: '',
      featuredProductPrice: '',
      sampleCatalogNote: '',
    },
    offer: {
      preliminaryOffer: '',
      operatingHours: '',
      deliveryReadiness: '',
      financeNote: '',
    },
    review: {
      fieldNotes: '',
      partnerReviewNote: '',
    },
    lastSavedLabel: 'لم تحفظ بعد',
    ...overrides,
  };
}

export function getFieldRequiredMissingItems(draft: FieldOnboardingDraft) {
  const missing: string[] = [];
  const documentIsResolved = (ref: string, status: FieldDocumentPreviewStatus) => (
    ref.trim().length > 0 && (status === 'uploaded' || status === 'approved')
  );

  if (!draft.basics.storeName.trim()) missing.push('اسم المتجر');
  if (!draft.basics.ownerName.trim()) missing.push('اسم المالك');
  if (!draft.basics.ownerPhone.trim()) missing.push('جوال المالك');
  if (!draft.location.city.trim()) missing.push('المدينة');
  if (!draft.location.zone.trim()) missing.push('النطاق');
  if (!draft.location.latitude.trim() || !draft.location.longitude.trim() || !draft.location.landmark.trim()) missing.push('الإحداثية GPS');
  if (!draft.photos.storefrontPhotoRef.trim()) missing.push('صورة الواجهة');
  if (!documentIsResolved(draft.documents.commercialRegistrationRef, draft.documents.commercialRegistrationStatus)) missing.push('السجل التجاري');
  if (!documentIsResolved(draft.documents.ownerIdRef, draft.documents.ownerIdStatus)) missing.push('هوية المالك');
  if (draft.documents.tradeLicenseRef.trim() && (draft.documents.tradeLicenseStatus === 'needs_reupload' || draft.documents.tradeLicenseStatus === 'rejected')) missing.push('رخصة التجارة تحتاج معالجة');
  if (!draft.products.featuredProductName.trim()) missing.push('منتج افتتاحي واحد');
  if (!draft.offer.preliminaryOffer.trim()) missing.push('العرض أو الاتفاق المبدئي');
  if (!draft.offer.operatingHours.trim()) missing.push('ساعات العمل');

  return missing;
}

export function resolveFieldSectionSummaries(draft: FieldOnboardingDraft): FieldSectionSummary[] {
  const documentsMissing = [
    {
      ref: draft.documents.commercialRegistrationRef,
      status: draft.documents.commercialRegistrationStatus,
      required: true,
    },
    {
      ref: draft.documents.ownerIdRef,
      status: draft.documents.ownerIdStatus,
      required: true,
    },
    {
      ref: draft.documents.tradeLicenseRef,
      status: draft.documents.tradeLicenseStatus,
      required: false,
    },
  ].filter((item) => {
    if (item.required) {
      return !item.ref.trim() || (item.status !== 'uploaded' && item.status !== 'approved');
    }

    return item.ref.trim().length > 0 && (item.status === 'needs_reupload' || item.status === 'rejected');
  }).length;
  const sectionMissing: Record<FieldOnboardingSectionId, number> = {
    basics: [draft.basics.storeName, draft.basics.ownerName, draft.basics.ownerPhone].filter((value) => !value.trim()).length,
    classification: [draft.classification.storeType, draft.classification.mainCategory].filter((value) => !value.trim()).length,
    location: [draft.location.city, draft.location.zone, draft.location.addressLine, draft.location.latitude, draft.location.longitude, draft.location.landmark].filter((value) => !value.trim()).length,
    photos: [draft.photos.storefrontPhotoRef, draft.photos.interiorPhotoRef].filter((value) => !value.trim()).length,
    documents: documentsMissing,
    products: [draft.products.featuredProductName, draft.products.featuredProductPrice].filter((value) => !value.trim()).length,
    offer: [draft.offer.preliminaryOffer, draft.offer.operatingHours].filter((value) => !value.trim()).length,
    review: getFieldRequiredMissingItems(draft).length,
  };

  return fieldSectionOrder.map((id) => ({
    id,
    label: fieldSectionLabels[id],
    complete: sectionMissing[id] === 0,
    missingCount: sectionMissing[id],
  }));
}

export function resolveFieldCompletionPercent(draft: FieldOnboardingDraft) {
  const sections = resolveFieldSectionSummaries(draft);
  const complete = sections.filter((section) => section.complete).length;
  return Math.round((complete / sections.length) * 100);
}

export function resolveFieldStoreStatus(store: FieldStoreFile): FieldLeadStatus {
  if (store.lockedStatus) {
    return store.lockedStatus;
  }

  if (store.draft.submittedAt) {
    return 'submitted';
  }

  const missing = getFieldRequiredMissingItems(store.draft);
  const hasAnyData = [
    store.draft.basics.storeName,
    store.draft.basics.ownerName,
    store.draft.classification.storeType,
    store.draft.location.addressLine,
    store.draft.offer.preliminaryOffer,
    store.draft.review.fieldNotes,
  ].some((value) => value.trim().length > 0);

  if (missing.length === 0) {
    return 'ready-for-onboarding';
  }

  if (store.reviewFeedback) {
    return 'follow-up-required';
  }

  if (store.draft.offer.preliminaryOffer.trim() && store.draft.basics.storeName.trim() && store.draft.location.city.trim()) {
    return 'offer-pending-approval';
  }

  if (hasAnyData) {
    return 'follow-up-required';
  }

  return 'new-lead';
}

export function resolveFieldStoreStatusLabel(store: FieldStoreFile) {
  return store.statusNoteOverride ?? fieldStatusLabels[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreStatusTone(store: FieldStoreFile) {
  return fieldStatusTones[resolveFieldStoreStatus(store)];
}

export function resolveFieldStoreLifecycleLabel(store: FieldStoreFile) {
  if (store.lifecycleNote) {
    return store.lifecycleNote;
  }

  const status = resolveFieldStoreStatus(store);

  if (status === 'offer-approved') {
    return 'منتهٍ للميداني';
  }

  if (status === 'submitted') {
    return 'بانتظار مراجعة الشركاء';
  }

  if (status === 'ready-for-onboarding') {
    return 'الملف مكتمل وجاهز للإرسال';
  }

  if (status === 'follow-up-required') {
    return 'هناك نواقص عملية قبل الإرسال';
  }

  if (status === 'offer-pending-approval') {
    return 'العرض ما زال تحت المراجعة';
  }

  return 'ملف انضمام قيد البناء';
}

export function resolveFieldStoreNextActionLabel(store: FieldStoreFile) {
  const status = resolveFieldStoreStatus(store);

  if (status === 'offer-approved') {
    return 'عرض السجل والعمولة';
  }

  if (status === 'submitted') {
    return 'انتظار قرار المراجعة';
  }

  if (status === 'ready-for-onboarding') {
    return 'إرسال للمراجعة';
  }

  if (status === 'follow-up-required') {
    return 'إكمال النواقص';
  }

  if (status === 'offer-pending-approval') {
    return 'مراجعة العرض';
  }

  return 'بدء ملف الانضمام';
}

export function isFieldStoreReadOnly(store: FieldStoreFile) {
  return resolveFieldStoreStatus(store) === 'submitted' || resolveFieldStoreStatus(store) === 'offer-approved';
}

export function matchesFieldStoreFilter(store: FieldStoreFile, filter: FieldLeadFilter) {
  const status = resolveFieldStoreStatus(store);

  if (filter === 'all') return true;
  if (filter === 'today') return store.nextVisitLabel.includes('اليوم');
  if (filter === 'ready') return status === 'ready-for-onboarding';
  if (filter === 'follow-up') return status === 'follow-up-required';
  if (filter === 'pending') return status === 'new-lead' || status === 'offer-pending-approval';
  if (filter === 'submitted') return status === 'submitted';
  if (filter === 'done') return status === 'offer-approved';
  return true;
}

export function resolveFieldFilterCounts(stores: readonly FieldStoreFile[]): Record<FieldLeadFilter, number> {
  return {
    all: stores.length,
    today: stores.filter((store) => matchesFieldStoreFilter(store, 'today')).length,
    ready: stores.filter((store) => matchesFieldStoreFilter(store, 'ready')).length,
    'follow-up': stores.filter((store) => matchesFieldStoreFilter(store, 'follow-up')).length,
    pending: stores.filter((store) => matchesFieldStoreFilter(store, 'pending')).length,
    submitted: stores.filter((store) => matchesFieldStoreFilter(store, 'submitted')).length,
    done: stores.filter((store) => matchesFieldStoreFilter(store, 'done')).length,
  };
}

export function syncFieldStoreFromDraft(store: FieldStoreFile): FieldStoreFile {
  return {
    ...store,
    name: store.draft.basics.storeName.trim() || store.name,
    category: store.draft.classification.mainCategory.trim() || store.category,
    location: store.draft.location.zone.trim() || store.location,
  };
}

export function touchFieldStoreDraft(store: FieldStoreFile, note?: string): FieldStoreFile {
  return syncFieldStoreFromDraft({
    ...store,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: note ?? store.lifecycleNote,
    draft: {
      ...store.draft,
      lastSavedLabel: formatNowLabel(),
    },
  });
}

export function submitFieldStoreForReview(store: FieldStoreFile): FieldStoreFile {
  return syncFieldStoreFromDraft({
    ...store,
    lastUpdatedLabel: 'الآن',
    lifecycleNote: 'أُرسل الملف إلى مراجعة الشركاء، والميداني ينتظر القرار.',
    draft: {
      ...store.draft,
      lastSavedLabel: formatNowLabel(),
      submittedAt: new Date().toISOString(),
    },
  });
}

export function mapFieldStoreToCanonicalStoreCard(store: FieldStoreFile): DshCanonicalStoreCard {
  const storeName = store.draft.basics.storeName.trim() || store.name;
  const categoryLabel = store.draft.classification.mainCategory.trim() || store.category;
  const subcategoryLabel = store.draft.classification.subCategory.trim() || undefined;
  const branchLabel = `${store.draft.location.zone.trim() || store.location} • ${store.draft.location.city.trim() || 'الرياض'}`;
  const locationLabel = store.draft.location.addressLine.trim() || store.location;
  const operatingHoursLabel = store.draft.offer.operatingHours.trim() || 'غير محدد';
  const deliveryReadinessLabel = store.draft.offer.deliveryReadiness.trim() || 'غير محدد';
  const coverageSummary = store.draft.location.coverageSummary.trim() || store.location;
  const photoRef = store.draft.photos.storefrontPhotoRef.trim() || undefined;
  const featuredProductName = store.draft.products.featuredProductName.trim();
  const featuredProductPrice = store.draft.products.featuredProductPrice.trim();
  const reviewState = resolveFieldStoreStatus(store);
  const publishStage = resolveFieldCanonicalPublishStage(store);

  return {
    id: `canonical-store-field-${store.id}`,
    sourceRecordId: store.id,
    source: 'app-field',
    publishStage,
    storeName,
    branchLabel,
    cityLabel: store.draft.location.city.trim() || 'الرياض',
    categoryLabel,
    subcategoryLabel,
    addressLabel: locationLabel,
    zoneLabel: store.draft.location.zone.trim() || store.location,
    ownerName: store.draft.basics.ownerName.trim() || undefined,
    ownerPhone: store.draft.basics.ownerPhone.trim() || undefined,
    managerName: store.draft.basics.managerName.trim() || undefined,
    operatingHoursLabel,
    deliveryReadinessLabel,
    coverageSummary,
    latitude: store.draft.location.latitude.trim() || undefined,
    longitude: store.draft.location.longitude.trim() || undefined,
    landmark: store.draft.location.landmark.trim() || undefined,
    storefrontPhotoRef: photoRef,
    mediaKey: photoRef ? `${photoRef}.media` : undefined,
    imageUri: photoRef ? `${photoRef}.media` : undefined,
    statusLabel: resolveFieldStoreStatusLabel(store),
    statusTone: resolveFieldStoreStatusTone(store),
    rating: publishStage === 'published-preview' ? 4.9 : 4.6,
    distanceLabel: coverageSummary,
    etaLabel: operatingHoursLabel,
    deliveryLabel: deliveryReadinessLabel,
    serviceLabel: store.draft.offer.preliminaryOffer.trim() ? 'توصيل برو' : 'توصيل',
    deliveryFeeLabel: featuredProductPrice ? `السعر الافتتاحي ${featuredProductPrice} ر.ي` : undefined,
    priceMatchLabel: featuredProductName ? `المنتج الافتتاحي ${featuredProductName}` : undefined,
    offerLabel: store.draft.offer.preliminaryOffer.trim() || undefined,
    followerCount: 4200,
    supportsPickup: true,
    supportsPartnerDelivery: true,
    hasBthwaniPro: true,
    hasNewProducts: Boolean(featuredProductName),
    hasCouponAvailable: Boolean(store.draft.offer.preliminaryOffer.trim()),
    canonicalProductId: featuredProductName ? `canonical-product-field-${store.id}-featured` : undefined,
  };
}

export function mapFieldStoreToCanonicalProductCard(store: FieldStoreFile): DshCanonicalProductCard | null {
  const featuredProductName = store.draft.products.featuredProductName.trim();

  if (!featuredProductName) {
    return null;
  }

  const priceLabel = formatFieldProductPriceLabel(store.draft.products.featuredProductPrice);
  const categoryLabel = store.draft.classification.subCategory.trim() || store.draft.classification.mainCategory.trim() || store.category;

  return {
    id: `canonical-product-field-${store.id}-featured`,
    sourceRecordId: store.id,
    storeId: `canonical-store-field-${store.id}`,
    source: 'app-field',
    publishStage: resolveFieldCanonicalPublishStage(store),
    name: featuredProductName,
    subtitle: store.draft.products.sampleCatalogNote.trim() || undefined,
    categoryId: resolveFieldProductCategoryId(store),
    categoryLabel,
    priceLabel,
    priceValue: parseFieldProductPriceValue(store.draft.products.featuredProductPrice),
    measurementType: 'piece',
    measurementOptions: ['حبة'],
    isAvailable: true,
    hasOptions: false,
    preparationTime: store.draft.offer.deliveryReadiness.trim() || undefined,
    canonicalStoreId: `canonical-store-field-${store.id}`,
    canonicalProductId: `canonical-product-field-${store.id}-featured`,
  };
}

function createSeedStore(overrides: Partial<FieldStoreFile>): FieldStoreFile {
  return syncFieldStoreFromDraft({
    id: overrides.id ?? `field-store-${Date.now()}`,
    source: overrides.source ?? 'candidate',
    name: overrides.name ?? 'فرصة ميدانية',
    category: overrides.category ?? 'قيد التحديد',
    location: overrides.location ?? 'الرياض',
    nextVisitLabel: overrides.nextVisitLabel ?? 'اليوم',
    assignedFieldMember: overrides.assignedFieldMember ?? 'ناصر القحطاني',
    lastUpdatedLabel: overrides.lastUpdatedLabel ?? 'اليوم',
    lockedStatus: overrides.lockedStatus,
    stageLabelOverride: overrides.stageLabelOverride,
    statusNoteOverride: overrides.statusNoteOverride,
    lifecycleNote: overrides.lifecycleNote,
    financeLabel: overrides.financeLabel ?? '0 ر.ي',
    reviewFeedback: overrides.reviewFeedback,
    draft: overrides.draft ?? createEmptyDraft(),
  });
}

export function createManualFieldStore(): FieldStoreFile {
  return createSeedStore({
    id: `manual-${Date.now()}`,
    source: 'manual',
    name: 'ملف انضمام جديد',
    category: 'قيد التحديد',
    location: 'الرياض',
    nextVisitLabel: 'اليوم',
    lastUpdatedLabel: 'الآن',
    draft: createEmptyDraft({
      lastSavedLabel: 'مسودة جديدة',
    }),
  });
}

export function createFieldSeedStores(): FieldStoreFile[] {
  return [
    createSeedStore({
      id: 'lead-1',
      name: 'محمصة الساحة',
      category: 'مقاهٍ ومحمصات',
      location: 'حي الياسمين',
      nextVisitLabel: 'اليوم 5:30 م',
      financeLabel: 'بانتظار الإرسال',
      draft: createEmptyDraft({
        activeSectionId: 'offer',
        basics: {
          storeName: 'محمصة الساحة',
          ownerName: 'سعود الدوسري',
          ownerPhone: '0500000001',
          managerName: 'عبدالله',
        },
        classification: {
          storeType: 'مقهى',
          mainCategory: 'مقاهٍ ومحمصات',
          subCategory: 'قهوة مختصة',
        },
        location: {
          city: 'الرياض',
          zone: 'حي الياسمين',
          addressLine: 'طريق أنس بن مالك',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8123',
          longitude: '46.6521',
          landmark: 'بجوار الصيدلية',
        },
        photos: {
          storefrontPhotoRef: 'واجهة رئيسية',
          interiorPhotoRef: '',
          signagePhotoRef: '',
        },
        documents: {
          commercialRegistrationRef: 'cr-lead-1.pdf',
          ownerIdRef: '',
          tradeLicenseRef: '',
          commercialRegistrationStatus: 'uploaded',
          ownerIdStatus: 'missing',
          tradeLicenseStatus: 'missing',
        },
        products: {
          featuredProductName: '',
          featuredProductPrice: '',
          sampleCatalogNote: 'عينة الكتالوج ما زالت ناقصة.',
        },
        offer: {
          preliminaryOffer: 'خصم أول 3 أشهر + عمولة معيارية',
          operatingHours: '',
          deliveryReadiness: 'جاهز مبدئيًا',
          financeNote: 'بانتظار اعتماد نهائي.',
        },
        review: {
          fieldNotes: 'تمت مراجعة العرض المبدئي مع المالك.',
          partnerReviewNote: '',
        },
        lastSavedLabel: 'اليوم 4:55 م',
      }),
    }),
    createSeedStore({
      id: 'lead-2',
      name: 'بوفيه الشروق',
      category: 'بوفيهات',
      location: 'الملقا',
      nextVisitLabel: 'غدًا 1:00 م',
      financeLabel: 'راجع الملاحظات',
      reviewFeedback: 'معاد للتعديل: تحديث صورة الواجهة وتأكيد ساعات العمل.',
      lifecycleNote: 'عاد الملف للمراجعة الميدانية قبل إعادة الإرسال.',
      draft: createEmptyDraft({
        activeSectionId: 'photos',
        basics: {
          storeName: 'بوفيه الشروق',
          ownerName: 'فهد الشمري',
          ownerPhone: '0500000002',
          managerName: 'بدر',
        },
        classification: {
          storeType: 'مطعم خفيف',
          mainCategory: 'بوفيهات',
          subCategory: 'شاورما وسناك',
        },
        location: {
          city: 'الرياض',
          zone: 'الملقا',
          addressLine: 'شارع الأمير تركي',
          coverageSummary: 'شمال غرب الرياض',
          latitude: '24.7854',
          longitude: '46.6210',
          landmark: 'مقابل البنك',
        },
        photos: {
          storefrontPhotoRef: '',
          interiorPhotoRef: 'صورة داخلية أولية',
          signagePhotoRef: '',
        },
        documents: {
          commercialRegistrationRef: 'cr-lead-2.pdf',
          ownerIdRef: 'owner-id-lead-2.jpg',
          tradeLicenseRef: 'trade-lead-2.pdf',
          commercialRegistrationStatus: 'needs_reupload',
          ownerIdStatus: 'approved',
          tradeLicenseStatus: 'rejected',
        },
        products: {
          featuredProductName: 'وجبة شاورما',
          featuredProductPrice: '24',
          sampleCatalogNote: '',
        },
        offer: {
          preliminaryOffer: 'عرض مبدئي تحت المراجعة',
          operatingHours: '',
          deliveryReadiness: 'تحتاج متابعة',
          financeNote: '',
        },
        review: {
          fieldNotes: 'تحتاج مراجعة نهائية قبل إعادة الإرسال.',
          partnerReviewNote: 'معاد للتعديل',
        },
        lastSavedLabel: 'اليوم 1:20 م',
      }),
    }),
    createSeedStore({
      id: 'lead-3',
      name: 'مخبز الزاوية',
      category: 'مخابز',
      location: 'النرجس',
      nextVisitLabel: 'غدًا 10:30 ص',
      financeLabel: 'جاهز للإرسال',
      fulfillmentAgreements: [
        { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' },
        { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' },
        { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' },
      ],
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'مخبز الزاوية',
          ownerName: 'تركي العتيبي',
          ownerPhone: '0500000003',
          managerName: 'سلمان',
        },
        classification: {
          storeType: 'مخبز',
          mainCategory: 'مخابز',
          subCategory: 'مخبوزات يومية',
        },
        location: {
          city: 'الرياض',
          zone: 'النرجس',
          addressLine: 'طريق عثمان بن عفان',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8244',
          longitude: '46.6821',
          landmark: 'أمام محطة الوقود',
        },
        photos: {
          storefrontPhotoRef: 'واجهة واضحة',
          interiorPhotoRef: 'الفرن ومنطقة الخدمة',
          signagePhotoRef: 'لوحة خارجية',
        },
        documents: {
          commercialRegistrationRef: 'cr-lead-3.pdf',
          ownerIdRef: 'owner-id-lead-3.jpg',
          tradeLicenseRef: 'trade-lead-3.pdf',
          commercialRegistrationStatus: 'approved',
          ownerIdStatus: 'approved',
          tradeLicenseStatus: 'uploaded',
        },
        products: {
          featuredProductName: 'خبز بطاطس',
          featuredProductPrice: '8',
          sampleCatalogNote: 'المنتج الأول موثق بالكامل.',
        },
        offer: {
          preliminaryOffer: 'بداية بعمولة خفيفة',
          operatingHours: '6 ص - 11 م',
          deliveryReadiness: 'جاهز للتوصيل الخفيف',
          financeNote: 'مستحقات افتتاحية خفيفة.',
        },
        review: {
          fieldNotes: 'كل العناصر الأساسية مكتملة والملف جاهز للإرسال.',
          partnerReviewNote: '',
        },
        lastSavedLabel: 'اليوم 11:10 ص',
      }),
    }),
    createSeedStore({
      id: 'lead-4',
      name: 'مقهى الوادي',
      category: 'مقاهٍ',
      location: 'الصحافة',
      nextVisitLabel: 'اليوم 11:20 ص',
      financeLabel: 'قيد المراجعة',
      lifecycleNote: 'تم الإرسال للمراجعة وينتظر القرار، ولا يوجد إجراء ميداني جديد الآن.',
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'مقهى الوادي',
          ownerName: 'أحمد الحربي',
          ownerPhone: '0500000004',
          managerName: 'محمد',
        },
        classification: {
          storeType: 'مقهى',
          mainCategory: 'مقاهٍ',
          subCategory: 'قهوة وكيك',
        },
        location: {
          city: 'الرياض',
          zone: 'الصحافة',
          addressLine: 'طريق الأمير ناصر',
          coverageSummary: 'شمال الرياض',
          latitude: '24.8011',
          longitude: '46.6432',
          landmark: 'بجانب السوبرماركت',
        },
        photos: {
          storefrontPhotoRef: 'واجهة رئيسية',
          interiorPhotoRef: 'صالة الجلوس',
          signagePhotoRef: 'اللوحة الأمامية',
        },
        documents: {
          commercialRegistrationRef: 'cr-lead-4.pdf',
          ownerIdRef: 'owner-id-lead-4.jpg',
          tradeLicenseRef: 'trade-lead-4.pdf',
          commercialRegistrationStatus: 'uploaded',
          ownerIdStatus: 'uploaded',
          tradeLicenseStatus: 'uploaded',
        },
        products: {
          featuredProductName: 'لاتيه',
          featuredProductPrice: '18',
          sampleCatalogNote: 'العينة الأولية جاهزة.',
        },
        offer: {
          preliminaryOffer: 'الملف المرسل ينتظر مراجعة الشركاء',
          operatingHours: '7 ص - 12 ص',
          deliveryReadiness: 'جاهز للتوصيل',
          financeNote: 'بانتظار التثبيت النهائي.',
        },
        review: {
          fieldNotes: 'أرسل الملف للمراجعة بعد استكمال كافة المتطلبات.',
          partnerReviewNote: 'بانتظار قرار الشركاء',
        },
        lastSavedLabel: 'اليوم 11:20 ص',
        submittedAt: new Date().toISOString(),
      }),
    }),
    createSeedStore({
      id: 'lead-5',
      name: 'تمور النخبة',
      category: 'مواد غذائية',
      location: 'اليرموك',
      nextVisitLabel: 'مكتمل',
      financeLabel: '420 ر.ي',
      lockedStatus: 'offer-approved',
      fulfillmentAgreements: [
        { mode: 'bthwani_delivery', modeLabel: 'توصيل بثواني', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' },
        { mode: 'partner_delivery', modeLabel: 'توصيل المتجر', enabled: false, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'غير مفعّل', operationalReadiness: 'unavailable' },
        { mode: 'pickup', modeLabel: 'استلام بنفسي', enabled: true, commissionRatePreview: 'UI_PREVIEW_ONLY', settlementBasis: 'لكل طلب عبر WLT', operationalReadiness: 'ready' },
      ],
      stageLabelOverride: 'منتهٍ للميداني',
      lifecycleNote: 'اعتمد الملف داخل الشركاء وينتظر المراجعة التسويقية النهائية قبل الظهور للعملاء.',
      draft: createEmptyDraft({
        activeSectionId: 'review',
        basics: {
          storeName: 'تمور النخبة',
          ownerName: 'خالد المطيري',
          ownerPhone: '0500000005',
          managerName: 'عبدالعزيز',
        },
        classification: {
          storeType: 'متجر مواد غذائية',
          mainCategory: 'مواد غذائية',
          subCategory: 'تمور وهدايا',
        },
        location: {
          city: 'الرياض',
          zone: 'اليرموك',
          addressLine: 'شارع النجاح',
          coverageSummary: 'شرق الرياض',
          latitude: '24.7881',
          longitude: '46.7441',
          landmark: 'مقابل الحديقة',
        },
        photos: {
          storefrontPhotoRef: 'الواجهة مكتملة',
          interiorPhotoRef: 'الرفوف الداخلية',
          signagePhotoRef: 'صورة اللوحة',
        },
        documents: {
          commercialRegistrationRef: 'cr-lead-5.pdf',
          ownerIdRef: 'owner-id-lead-5.jpg',
          tradeLicenseRef: 'trade-lead-5.pdf',
          commercialRegistrationStatus: 'approved',
          ownerIdStatus: 'approved',
          tradeLicenseStatus: 'approved',
        },
        products: {
          featuredProductName: 'علبة تمر فاخر',
          featuredProductPrice: '55',
          sampleCatalogNote: 'المنتج الافتتاحي موثق.',
        },
        offer: {
          preliminaryOffer: 'اعتماد كامل بعد الظهور للعملاء',
          operatingHours: '9 ص - 11 م',
          deliveryReadiness: 'جاهز',
          financeNote: 'تم تثبيت المستحق النهائي.',
        },
        review: {
          fieldNotes: 'أغلق الدور الميداني بعد اكتمال الاعتماد.',
          partnerReviewNote: 'اعتماد نهائي',
        },
        lastSavedLabel: 'أمس',
        submittedAt: new Date().toISOString(),
      }),
    }),
  ];
}

// --- Surface state types (merged from field-state.preview-data.ts) ---

export type DshFieldSurfaceId = 'stores' | 'onboarding' | 'visits' | 'finance' | 'profile';

export type DshFieldSurfaceState = {
  surfaceId: DshFieldSurfaceId;
  storeCount: number;
  readyStoreCount: number;
  lastKnownStatus?: FieldLeadStatus;
};

export type DshFieldStateModel = {
  stores: readonly FieldStoreFile[];
  onboardingDraft?: FieldOnboardingDraft;
  surfaceState: DshFieldSurfaceState;
};

// -----------------------------------------------------------------------------
// App captain fixture locations
// -----------------------------------------------------------------------------
/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
 */
export const dshAppCaptainFixtureLocationsDataContract = {
	dataKind: 'UI_PREVIEW_ONLY',
	runtimeTruth: false,
	backendSource: false,
	bindingSource: false,
	timezoneSemantics: 'preview-only local display / not runtime UTC source',
	moneySemantics: 'not_applicable',
} as const;

export const dshAppCaptainFixtureLocations: Phase12FixtureLocation[] = [
	{
		candidateId: 'dsh_captain_offers_list',
		canonicalTarget: 'dsh_captain_offers_list',
		surface: 'app-captain',
		phase: 'Phase 12',
		mode: 'fixtures-only',
		dataKind: 'UI_PREVIEW_ONLY',
		timezoneSemantics: 'preview-only local display / not runtime UTC source',
		location: 'dsh/frontend/app-captain/dsh_captain_offers_list/fixtures',
		status: 'declared',
	},
	{
		candidateId: 'dsh_captain_execution_workspace',
		canonicalTarget: 'dsh_captain_execution_workspace',
		surface: 'app-captain',
		phase: 'Phase 12',
		mode: 'fixtures-only',
		dataKind: 'UI_PREVIEW_ONLY',
		timezoneSemantics: 'preview-only local display / not runtime UTC source',
		location: 'dsh/frontend/app-captain/dsh_captain_execution_workspace/fixtures',
		status: 'declared',
	},
	{
		candidateId: 'dsh_captain_proof_capture',
		canonicalTarget: 'dsh_captain_proof_capture',
		surface: 'app-captain',
		phase: 'Phase 12',
		mode: 'fixtures-only',
		dataKind: 'UI_PREVIEW_ONLY',
		timezoneSemantics: 'preview-only local display / not runtime UTC source',
		location: 'dsh/frontend/app-captain/dsh_captain_proof_capture/fixtures',
		status: 'declared',
	},
];

export const dshStoresPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export { buildStoreCategories, buildStoreDeliveryModes, buildStoreTags, buildersDataContract };
export {
  storeItemsByStoreId,
} from './products.preview-data';
export type {
  DshStoreFixtureItem,
  StoreItemsByStoreId,
} from '../shared/dshStoreProductCardModel';

export function selectDshClientStorePreview(storeId: string) {
  return dshHomeGetFixtureStores.find((store) => store.id === storeId) ?? dshDiscoveryStores.find((store) => store.id === storeId) ?? null;
}

export function selectDshClientHomePreview() {
  return {
    filters: dshHomeDiscoveryFilterFixtures,
    serviceDials: dshHomeServiceDialFixtures,
    stores: dshHomeGetFixtureStores,
    promos: dshHomeGetFixturePromos,
    ticker: dshHomeGetFixtureTickerBanner,
  };
}

export function selectDshFieldStoresPreview(fieldAgentId?: string) {
  void fieldAgentId;
  return createFieldSeedStores();
}

export function selectDshFieldBranchReadinessPreview(branchId: string) {
  return createFieldSeedStores().find((store) => store.id === branchId) ?? null;
}

export function selectDshFieldVisitPreview(branchId: string) {
  return selectDshFieldBranchReadinessPreview(branchId);
}

export function selectDshControlPanelCatalogPreview() {
  return {
    stores: dshDiscoveryStores,
    homeStores: dshHomeGetFixtureStores,
  };
}

// ── Canonical Mock Data ──────────────────────────────────────────────────

export const canonicalStoreId = 'canonical-store-field-lead-5';
export const canonicalProductId = 'canonical-product-field-lead-5-featured';

export const canonicalStoreCard: DshCanonicalStoreCard = {
  id: canonicalStoreId,
  sourceRecordId: 'lead-5',
  source: 'app-field',
  publishStage: 'marketing-review',
  storeName: 'تمور النخبة',
  branchLabel: 'اليرموك • الرياض',
  cityLabel: 'الرياض',
  categoryLabel: 'مواد غذائية',
  subcategoryLabel: 'تمور وهدايا',
  addressLabel: 'شارع النجاح',
  zoneLabel: 'اليرموك',
  ownerName: 'خالد المطيري',
  ownerPhone: '0500000005',
  managerName: 'عبدالعزيز',
  operatingHoursLabel: '9 ص - 11 م',
  deliveryReadinessLabel: 'جاهز',
  coverageSummary: 'شرق الرياض',
  latitude: '24.7881',
  longitude: '46.7441',
  landmark: 'مقابل الحديقة',
  storefrontPhotoRef: 'الواجهة مكتملة',
  mediaKey: 'dsh.store.lead-5.cover.v1',
  imageUri: 'dsh.store.lead-5.cover.v1',
  statusLabel: 'مفتوح',
  statusTone: 'success',
  rating: 4.9,
  distanceLabel: '2.4 كم',
  etaLabel: '18 دقيقة',
  deliveryLabel: 'توصيل سريع',
  serviceLabel: 'بثواني برو',
  deliveryFeeLabel: 'رسوم التوصيل 10 ر.ي',
  priceMatchLabel: 'الأسعار مطابقة للكتالوج',
  offerLabel: 'منتج افتتاحي موثق',
  followerCount: 4200,
  supportsPickup: true,
  supportsPartnerDelivery: true,
  hasBthwaniPro: true,
  hasNewProducts: true,
  hasCouponAvailable: true,
  canonicalProductId,
};

export const canonicalPreviewStores: ReadonlyArray<DshCanonicalStoreCard> = [canonicalStoreCard];

export function buildCanonicalPreviewDiscoveryStores(): DshDiscoveryStore[] {
  return canonicalPreviewStores.map((store) => mapCanonicalStoreToDiscoveryStore(store));
}
