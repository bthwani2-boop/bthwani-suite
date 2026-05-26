/**
 * CENTRAL DSH DOMAIN PREVIEW DATA — SINGLE SOURCE OF TRUTH
 * Owner: dsh/frontend/data (central DSH domain preview data owner)
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 *
 * Domain: categories, subcategories, category icons
 * Used by: app-client (via surface adapter), control-panel/marketing
 */

export type DshCategorySubcategoryFixture = {
	id: string;
	label: string;
	subtitle: string;
};

export type DshCategoryFixture = {
	id: string;
	label: string;
	shortLabel?: string;
	subtitle: string;
	subcategories: DshCategorySubcategoryFixture[];
	renderMode?: 'stores' | 'manual-order';
	emojiFallback?: string;
	priority?: number;
	orbitWeight?: number;
	isManualLike?: boolean;
};

export const dshCategoriesFixturesDataContract = {
	dataKind: 'UI_PREVIEW_ONLY',
	runtimeTruth: false,
	backendSource: false,
	bindingSource: false,
	timezoneSemantics: 'not_applicable',
	moneySemantics: 'not_applicable',
} as const;

export const dshCategoryFixtures: DshCategoryFixture[] = [
	{
		id: 'restaurants',
		label: 'المطاعم',
		shortLabel: 'المطاعم',
		subtitle: 'طلب الوجبات والمأكولات الجاهزة',
		subcategories: [],
		emojiFallback: '🍽️',
		priority: 1,
		orbitWeight: 1.2,
	},
	{
		id: 'grocery',
		label: 'مقاضي',
		shortLabel: 'مقاضي',
		subtitle: 'سوبر ماركت ومواد تموينية',
		subcategories: [
			{ id: 'grocery_vegetables_fruits', label: 'خضروات وفواكة', subtitle: 'منتجات طازجة ومبردة' },
			{ id: 'grocery_meat_fish_chicken', label: 'لحوم وأسماك ودجاج', subtitle: 'اختيارات بروتينية ومبردة' },
			{ id: 'grocery_roasted_spices', label: 'محامص وبهارات', subtitle: 'بهارات وتتبيلات للمطبخ' },
			{ id: 'grocery_bakeries', label: 'مخابز', subtitle: 'خبز ومعجنات وخبز يومي' },
			{ id: 'grocery_deals_bundle', label: 'باكج عروضات', subtitle: 'سلال مجمعة وعروض موسمية' },
		],
		emojiFallback: '🛒',
		priority: 2,
		orbitWeight: 1.1,
	},
	{
		id: 'sweets_juices',
		label: 'حلا وعصائر',
		shortLabel: 'حلا',
		subtitle: 'عصائر طازجة وحلويات وآيسكريم',
		subcategories: [
			{ id: 'sweets_juices_fresh', label: 'عصائر طازجة', subtitle: 'عصائر معصورة ومخلوطة' },
			{ id: 'sweets_juices_sweets', label: 'حلويات', subtitle: 'تحليات وكعك ومعجنات' },
			{ id: 'sweets_juices_icecream', label: 'آيسكريم', subtitle: 'حلويات مجمدة وأحواض' },
		],
		emojiFallback: '🧃',
		priority: 3,
		orbitWeight: 1.0,
	},
	{
		id: 'anaqati',
		label: 'أناقتي',
		shortLabel: 'أناقتي',
		subtitle: 'عطور، إكسسوارات، وملابس',
		subcategories: [
			{ id: 'anaqati_perfumes', label: 'عطور', subtitle: 'اختيارات عطرية وروائح' },
			{ id: 'anaqati_accessories_beauty', label: 'إكسسوارات وأدوات تجميل', subtitle: 'العناية الشخصية وأدوات الجمال' },
			{ id: 'anaqati_clothing', label: 'ملابس', subtitle: 'ملابس وإطلالات يومية' },
		],
		emojiFallback: '👗',
		priority: 4,
		orbitWeight: 0.9,
	},
	{
		id: 'wani_store',
		label: 'بثواني ستور',
		shortLabel: 'ستور',
		subtitle: 'متجر شامل للمنتجات المختارة',
		subcategories: [],
		emojiFallback: '🏪',
		priority: 5,
		orbitWeight: 1.0,
	},
	{
		id: 'home_projects',
		label: 'مشاريع منزلية',
		shortLabel: 'مشاريع',
		subtitle: 'منتجات يدوية ومحلية',
		subcategories: [],
		emojiFallback: '🏠',
		priority: 6,
		orbitWeight: 0.8,
	},
	{
		id: 'cloud_kitchens',
		label: 'مطابخ سحابية',
		shortLabel: 'مطابخ',
		subtitle: 'مطابخ مجهزة ووجبات سريعة',
		subcategories: [],
		emojiFallback: '🍳',
		priority: 7,
		orbitWeight: 0.8,
	},
	{
		id: 'awnak',
		label: 'عونك',
		shortLabel: 'عونك',
		subtitle: 'خدمات ومشاوير محلية',
		subcategories: [],
		renderMode: 'manual-order',
		emojiFallback: '🤝',
		priority: 8,
		orbitWeight: 0.7,
		isManualLike: true,
	},
	{
		id: 'gas_refill',
		label: 'تعبئة الغاز',
		shortLabel: 'غاز',
		subtitle: 'تعبئة، إصلاح، وشراء',
		subcategories: [
			{ id: 'gas_refill_refill', label: 'التعبئة', subtitle: 'تعبئة الأسطوانة والتوصيل' },
			{ id: 'gas_refill_repair', label: 'الإصلاح', subtitle: 'صيانة وفحص سلامة' },
			{ id: 'gas_refill_buy', label: 'شراء تعبئة', subtitle: 'وحدات جديدة وتبديل' },
		],
		emojiFallback: '⛽',
		priority: 9,
		orbitWeight: 0.7,
		isManualLike: true,
	},
	{
		id: 'shein',
		label: 'شي ان',
		shortLabel: 'شي ان',
		subtitle: 'طلبات شراء وتوصيل',
		subcategories: [],
		renderMode: 'manual-order',
		emojiFallback: '🛍️',
		priority: 10,
		orbitWeight: 0.7,
		isManualLike: true,
	},
	{
		id: 'spare_parts',
		label: 'قطع غيار',
		shortLabel: 'قطع غيار',
		subtitle: 'مستلزمات سيارات ودراجات',
		subcategories: [],
		emojiFallback: '🔧',
		priority: 11,
		orbitWeight: 0.8,
	},
	{
		id: 'honey_dates',
		label: 'عسل وتمور',
		shortLabel: 'عسل',
		subtitle: 'منتجات طبيعية يمنية',
		subcategories: [],
		emojiFallback: '🍯',
		priority: 12,
		orbitWeight: 0.8,
	},
	{
		id: 'electronics',
		label: 'إلكترونيات',
		shortLabel: 'إلكترونيات',
		subtitle: 'أجهزة واكسسوارات إلكترونية',
		subcategories: [],
		emojiFallback: '📱',
		priority: 13,
		orbitWeight: 0.9,
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

export function selectDshClientCategoriesPreview() {
	return dshCategoryListFixtures;
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

export const DSH_SUBCATEGORY_ICONS: Record<string, string> = {
	grocery_vegetables_fruits: '🥬',
	grocery_meat_fish_chicken: '🥩',
	grocery_roasted_spices: '🌰',
	grocery_bakeries: '🍞',
	grocery_deals_bundle: '🎁',
	sweets_juices_fresh: '🧃',
	sweets_juices_sweets: '🍰',
	sweets_juices_icecream: '🍦',
	anaqati_perfumes: '🌸',
	anaqati_accessories_beauty: '💄',
	anaqati_clothing: '👕',
	gas_refill_refill: '🧯',
	gas_refill_repair: '🛠️',
	gas_refill_buy: '🧰',
};

export const DSH_STORE_CATEGORY_ICONS: Record<string, string> = {
	popular: '🔥',
	fresh: '🥦',
	dairy: '🥛',
	bakery: '🥐',
	meals: '🍲',
	healthy: '🥗',
	sweets: '🍰',
};

export const CATEGORY_TAXONOMY_MAP = {
  fresh: { domainId: 'grocery', mainCategoryId: 'meals', subcategoryId: 'salads', facetTags: ['fresh', 'vegetarian'] },
  dairy: { domainId: 'grocery', mainCategoryId: 'health', facetTags: ['halal'] },
  bakery: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'breads', facetTags: ['premium'] },
  meals: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'chicken', facetTags: ['halal'] },
  healthy: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'salads', facetTags: ['vegetarian'] },
  sweets: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'sweets', facetTags: ['premium'] },
  dessert: { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'cakes' },
  // Workflow categories
  burgers: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'burgers', facetTags: ['bestseller', 'halal'] },
  chicken: { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'chicken', facetTags: ['spicy', 'halal'] },
  'sides-pasta': { domainId: 'restaurants', mainCategoryId: 'sides', subcategoryId: 'fries', facetTags: ['spicy'] },
  'drinks-juice': { domainId: 'restaurants', mainCategoryId: 'drinks', subcategoryId: 'juices', facetTags: ['fresh', 'halal'] },
  'sides-bread': { domainId: 'restaurants', mainCategoryId: 'sides', subcategoryId: 'sauces', facetTags: ['premium'] },
  'meals-apple': { domainId: 'restaurants', mainCategoryId: 'meals', subcategoryId: 'salads', facetTags: ['vegetarian', 'gluten-free'] },
  'bakery-cake': { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'breads', facetTags: ['premium', 'new-arrival'] },
  'bakery-dates': { domainId: 'bakery', mainCategoryId: 'desserts', subcategoryId: 'cakes', facetTags: ['seasonal', 'limited-edition'] },
  'drinks-honey': { domainId: 'restaurants', mainCategoryId: 'drinks', subcategoryId: 'coffee', facetTags: ['premium', 'new-arrival'] },
} as const;
