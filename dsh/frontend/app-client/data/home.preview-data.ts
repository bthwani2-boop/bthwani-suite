import { dshDiscoveryStores } from './discovery.preview-data';
import type { DshDiscoveryStore } from '../types';
import { brandPalette, dangerPalette, infoPalette, successPalette } from '@bthwani/ui-kit';

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

export const dshHomeGetFixturePromos: DshHomeGetFixturePromo[] = [
	{
		id: 'promo-1',
		mediaKey: 'dsh.banner.home.promo-1.v1',
		title: 'تخفيضات حصرية',
		subtitle: 'خصم 30% على طلبك الأول عبر التطبيق',
		icon: '🔥',
		accentColor: brandPalette[500],
		actionType: 'main_category',
		actionTarget: 'restaurants',
	},
	{
		id: 'promo-2',
		mediaKey: 'dsh.banner.home.promo-2.v1',
		title: 'تتبع طلبك',
		subtitle: 'تابع حالة طلبك مباشرة وبدقة عالية',
		icon: '📍',
		accentColor: infoPalette[600],
		actionType: 'store',
		actionTarget: 'store-1001',
	},
	{
		id: 'promo-3',
		mediaKey: 'dsh.banner.home.promo-3.v1',
		title: 'خضروات طازجة',
		subtitle: 'أفضل الفواكه والخضروات تصلك لباب المنزل',
		icon: '✨',
		accentColor: dangerPalette[600],
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
		accentColor: successPalette[600],
		actionType: 'main_category',
		actionTarget: 'restaurants',
	},
	{
		id: 'promo-5',
		mediaKey: 'dsh.banner.home.promo-5.v1',
		title: 'حلويات ومشروبات',
		subtitle: 'أشهى الحلويات والعصائر الطازجة بخطوة واحدة',
		icon: '🧃',
		accentColor: brandPalette[400],
		actionType: 'main_category',
		actionTarget: 'sweets_juices',
	},
	{
		id: 'promo-6',
		mediaKey: 'dsh.banner.home.promo-6.v1',
		title: 'مخابز حطين',
		subtitle: 'خبز طازج يومياً مع توصيل مجاني',
		icon: '🍞',
		accentColor: dangerPalette[400],
		actionType: 'store',
		actionTarget: 'store-1002',
	},
	{
		id: 'promo-7',
		mediaKey: 'dsh.banner.home.promo-7.v1',
		title: 'اشتراك بثواني برو',
		subtitle: 'توصيل مجاني غير محدود + عروض حصرية',
		icon: '⭐',
		accentColor: infoPalette[700],
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
		logoImageUri: 'dsh.store.malqa.cover.v1',
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
	},
	{
		id: 'store-3001',
		name: 'عونك المباشر',
		address: 'خدمة توصيل ومشوار محلية',
		categoryId: 'awnak',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '1.1 كم',
		deliveryLabel: 'مباشر',
		serviceLabel: 'خدمة محلية',
		followerCount: 2100,
		multiplierLabel: 'x1',
		offerLabel: 'خدمة اليوم',
		isFavorite: false,
		isFollowing: true,
		hasOffer: false,
		rating: 4.0,
		mediaKey: 'dsh.store.hadda.cover.v1',

		imageUri: 'dsh.store.hadda.cover.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['مسار مباشر', 'تسليم سريع'],
		hasCouponAvailable: false,
		hasNewProducts: false,
	},
	{
		id: 'store-3002',
		name: 'SHEIN الطلبات',
		address: 'شراء وتوصيل من SHEIN',
		categoryId: 'shein',
		statusLabel: 'مفتوح',
		statusTone: 'open',
		distanceLabel: '2.4 كم',
		deliveryLabel: 'شراء مباشر',
		serviceLabel: 'توصيل برو',
		followerCount: 1800,
		multiplierLabel: 'x1',
		offerLabel: 'طلب اليوم',
		isFavorite: false,
		isFollowing: false,
		hasOffer: true,
		rating: 3.8,
		mediaKey: 'dsh.product.choco.v1',
		imageUri: 'dsh.product.choco.v1',
		hasBthwaniPro: false,
		subscriptionPackageChips: ['شراء مباشر', 'مراجعة الطلب'],
		hasCouponAvailable: true,
		hasNewProducts: false,
		publishStage: 'published-preview',
	},
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
				sourceOwner: 'loyalty.preview-store',
				sourceRecordId: 'sub-pro',
				sourceType: 'subscription',
				approvalStage: 'active',
				conflictStatus: 'blocker',
				conflictReason: 'تعارض أمني في الشارات'
			},
			'offerLabel': {
				sourceOwner: 'marketing-store',
				sourceRecordId: 'offer-123',
				sourceType: 'offer',
				approvalStage: 'approved',
				conflictStatus: 'blocker',
				conflictReason: 'تعارض في العروض'
			},
			'deliveryFeeLabel': {
				sourceOwner: 'logistics-store',
				sourceRecordId: 'del-456',
				sourceType: 'delivery',
				approvalStage: 'active',
				conflictStatus: 'blocker',
				conflictReason: 'تعارض في التوصيل'
			},
			'hasCouponAvailable': {
				sourceOwner: 'marketing-store',
				sourceRecordId: 'coupon-789',
				sourceType: 'partner',
				approvalStage: 'active',
				conflictStatus: 'blocker',
				conflictReason: 'تعارض في الكوبونات'
			}
		}
	},
];

export const dshHomeGetFixtureStores: DshHomeGetFixtureStore[] = [
	...dshDiscoveryStores.map(toDshHomeGetFixtureStore),
	...dshHomeGetFixtureStoresRaw.map(ensureFixtureStorePublishStage),
];
