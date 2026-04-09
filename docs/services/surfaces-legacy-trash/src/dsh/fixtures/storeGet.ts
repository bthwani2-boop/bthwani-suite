/**
 * Fixture for DSH store get (auto_dsh_store_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 * Enhanced with categories, subcategories, and rich product data.
 *
 * منطق الشاشة المعتمد في الفيكستشر:
 * - المتجر: logoUrl / logoThumbnailUrl (شعار)، priceMatch (شارة الأسعار مطابقة)، categories، deliveryModes.
 * - المنتج: thumbnailUrl أو imageUrl (صورة)، currency، preparationTime، isAvailable، stockQuantity (نفد/غير متوفر)،
 *   originalPrice / discountPercent (خصم)، hasOptions (يد = اختر الخيارات، غيابه = سلة = أضف للسلة).
 * - عند hasOptions: شيت الخيارات يستخدم optionGroups?.[0]?.options أو خيارات افتراضية (ربع/نصف/حبة).
 *
 * بيانات تجريبية موكاب لأنماط القياس (للاطلاع): كل منتج له خيارات مُربوط بنمط مختلف:
 * - item_1: حبة (ربع، نصف، حبة)
 * - item_2: نفر (نفر واحد، نفرين، ثلاثة نفر، أربعة نفر)
 * - item_4: وزن غرام (250 غ، 500 غ، 1 كغ)
 * - item_5: كيلو (نصف كيلو، كيلو، كيلوين)
 * - item_6: لوزن (لوزن، رطل، أوقية)
 * - item_7: حجم لتر (نصف لتر، لتر، لترين)
 * - item_8: عرفي (ربع صندوق، نصف صندوق، صندوق)
 * - item_9: طول (نصف متر، متر، مترين)
 * - item_10: نفر (نفر واحد … أربعة نفر)
 * - غيره: افتراضي حبة (ربع، نصف، حبة). يُحدد كل شيء من لوحة التحكم لاحقاً.
 */

export interface MenuItemOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

/** للتجريب/الموكاب فقط: نوع وحدة القياس لعرض التسمية (للحبة، للنفر، …). */
export type UomCode =
  | 'piece'
  | 'person'
  | 'weight_g'
  | 'weight_kg'
  | 'weight_oz'
  | 'volume_l'
  | 'length_m'
  | 'custom';

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: MenuItemOption[];
  /** موكاب فقط: كود وحدة القياس للاطلاع (يُحدد من لوحة التحكم لاحقاً). */
  unitType?: UomCode;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  /** Emoji fallback when no image url provided (dev/demo). */
  image: string;
  /** Optional image urls (closer to contract fields). */
  imageUrl?: string;
  thumbnailUrl?: string;
  /** Currency display label for UI (e.g. "ر.ي"). */
  currency?: string;
  categoryId: string;
  isPopular: boolean;
  isFavorite?: boolean;
  preparationTime: string;
  preparationTimeMinutes?: number;
  hasOptions?: boolean;
  optionGroups?: MenuItemOptionGroup[];
  calories?: number;
  /** Availability for ordering. */
  isAvailable?: boolean;
  stockQuantity?: number | null;
  isNew?: boolean;
  discountPercent?: number;
}

export interface StoreCategory {
  id: string;
  name: string;
  icon?: string;
  itemCount: number;
  isPopular?: boolean;
}

export interface StoreDeliveryMode {
  id: 'delivery' | 'pickup';
  name: string;
  isAvailable: boolean;
  estimatedTime?: string;
  fee?: number;
  address?: string;
}

export interface StoreDetail {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours?: string;
  image: string;
  coverImage?: string;
  /** Optional store brand logo (fast thumb preferred). */
  logoUrl?: string;
  logoThumbnailUrl?: string;
  categories: StoreCategory[];
  address: string;
  phone: string;
  deliveryModes: StoreDeliveryMode[];
  tags?: string[];
  hasFreeDelivery?: boolean;
  hasProDelivery?: boolean;
  acceptsOnlinePayment?: boolean;
  isFavorite?: boolean;
  followersCount?: number;
  priceMatch?: boolean;
  /** بثواني برو — هل المتجر يدعم اشتراك برو. */
  hasBthwaniPro?: boolean;
  /** شارات الاشتراكات/الباقات المتوفرة للمتجر (مثل: توصيل مجاني، أولوية). */
  subscriptionPackageChips?: string[];
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'dsh.app-client.mobile.auto_dsh_store_get';

/**
 * بيانات تجريبية موكاب لجميع أنماط القياس — للاطلاع فقط.
 * يُحدد من لوحة التحكم لاحقاً؛ هنا نربط كل itemId بنمط مختلف لعرض كل الأنماط.
 */
function getMockOptionGroupsForItem(
  itemId: string,
  basePrice: number,
  _t: TFunction
): MenuItemOptionGroup[] {
  const groups: Record<string, MenuItemOptionGroup> = {
    // حبة (ربع، نصف، حبة)
    item_1: {
      id: 'og_piece_1',
      name: 'اختر الكمية',
      required: true,
      maxSelect: 1,
      unitType: 'piece',
      options: [
        { id: 'quarter', name: 'ربع', price: Math.round(basePrice * 0.4), isDefault: false },
        { id: 'half', name: 'نصف', price: Math.round(basePrice * 0.7), isDefault: false },
        { id: 'whole', name: 'حبة', price: basePrice, isDefault: true },
      ],
    },
    // نفر (نفر واحد، نفرين، ثلاثة نفر)
    item_2: {
      id: 'og_person_1',
      name: 'اختر عدد النفر',
      required: true,
      maxSelect: 1,
      unitType: 'person',
      options: [
        { id: 'p1', name: 'نفر واحد', price: Math.round(basePrice * 0.35), isDefault: true },
        { id: 'p2', name: 'نفرين', price: Math.round(basePrice * 0.65), isDefault: false },
        { id: 'p3', name: 'ثلاثة نفر', price: basePrice, isDefault: false },
        { id: 'p4', name: 'أربعة نفر', price: Math.round(basePrice * 1.35), isDefault: false },
      ],
    },
    // وزن (غرام): 250غ، 500غ، 1 كغ
    item_4: {
      id: 'og_weight_g_1',
      name: 'اختر الوزن',
      required: true,
      maxSelect: 1,
      unitType: 'weight_g',
      options: [
        { id: 'w250', name: '250 غ', price: Math.round(basePrice * 0.25), isDefault: false },
        { id: 'w500', name: '500 غ', price: Math.round(basePrice * 0.5), isDefault: true },
        { id: 'w1k', name: '1 كغ', price: basePrice, isDefault: false },
      ],
    },
    // كيلو: نصف كيلو، كيلو، كيلوين
    item_5: {
      id: 'og_weight_kg_1',
      name: 'اختر الكيلو',
      required: true,
      maxSelect: 1,
      unitType: 'weight_kg',
      options: [
        { id: 'k05', name: 'نصف كيلو', price: Math.round(basePrice * 0.5), isDefault: false },
        { id: 'k1', name: 'كيلو', price: basePrice, isDefault: true },
        { id: 'k2', name: 'كيلوين', price: Math.round(basePrice * 1.9), isDefault: false },
      ],
    },
    // لوزن (لوزن، رطل، أوقية)
    item_6: {
      id: 'og_weight_oz_1',
      name: 'اختر اللوزن',
      required: true,
      maxSelect: 1,
      unitType: 'weight_oz',
      options: [
        { id: 'oz1', name: 'لوزن', price: Math.round(basePrice * 0.3), isDefault: false },
        { id: 'oz2', name: 'رطل', price: Math.round(basePrice * 0.6), isDefault: true },
        { id: 'oz3', name: 'أوقية', price: basePrice, isDefault: false },
      ],
    },
    // حجم (لتر): نصف لتر، لتر، لترين
    item_7: {
      id: 'og_volume_l_1',
      name: 'اختر الحجم',
      required: true,
      maxSelect: 1,
      unitType: 'volume_l',
      options: [
        { id: 'v05', name: 'نصف لتر', price: Math.round(basePrice * 0.5), isDefault: false },
        { id: 'v1', name: 'لتر', price: basePrice, isDefault: true },
        { id: 'v2', name: 'لترين', price: Math.round(basePrice * 1.8), isDefault: false },
      ],
    },
    // عرفي: صندوق، نصف صندوق، ربع صندوق
    item_8: {
      id: 'og_custom_1',
      name: 'اختر الكمية',
      required: true,
      maxSelect: 1,
      unitType: 'custom',
      options: [
        { id: 'c_quarter', name: 'ربع صندوق', price: Math.round(basePrice * 0.3), isDefault: false },
        { id: 'c_half', name: 'نصف صندوق', price: Math.round(basePrice * 0.55), isDefault: false },
        { id: 'c_whole', name: 'صندوق', price: basePrice, isDefault: true },
      ],
    },
    // طول (متر) — مشاوي/أطباق أحياناً بالصينية أو بالعرض
    item_9: {
      id: 'og_length_1',
      name: 'اختر الطول',
      required: true,
      maxSelect: 1,
      unitType: 'length_m',
      options: [
        { id: 'm05', name: 'نصف متر', price: Math.round(basePrice * 0.5), isDefault: false },
        { id: 'm1', name: 'متر', price: basePrice, isDefault: true },
        { id: 'm2', name: 'مترين', price: Math.round(basePrice * 1.9), isDefault: false },
      ],
    },
    // نفر (مشاوي مشكلة) — نفس نمط النفر
    item_10: {
      id: 'og_person_2',
      name: 'اختر عدد النفر',
      required: true,
      maxSelect: 1,
      unitType: 'person',
      options: [
        { id: 'p1', name: 'نفر واحد', price: Math.round(basePrice * 0.3), isDefault: true },
        { id: 'p2', name: 'نفرين', price: Math.round(basePrice * 0.55), isDefault: false },
        { id: 'p3', name: 'ثلاثة نفر', price: basePrice, isDefault: false },
        { id: 'p4', name: 'أربعة نفر', price: Math.round(basePrice * 1.4), isDefault: false },
      ],
    },
  };

  const group = groups[itemId];
  if (group) return [group];

  // افتراضي: حبة (ربع، نصف، حبة) لأي منتج له خيارات ولم يُربط أعلاه
  return [
    {
      id: 'og_piece_default',
      name: 'اختر الكمية',
      required: true,
      maxSelect: 1,
      unitType: 'piece',
      options: [
        { id: 'quarter', name: 'ربع', price: Math.round(basePrice * 0.4), isDefault: false },
        { id: 'half', name: 'نصف', price: Math.round(basePrice * 0.7), isDefault: false },
        { id: 'whole', name: 'حبة', price: basePrice, isDefault: true },
      ],
    },
  ];
}

export function buildDshStoreGetMock(t: TFunction): {
  store: StoreDetail;
  menuItems: MenuItem[];
} {
  const categories: StoreCategory[] = [
    { id: 'all', name: t(`${NS}.categoryAll`), icon: '📋', itemCount: 25 },
    {
      id: 'favorites',
      name: t(`${NS}.categoryFavorites`),
      icon: '❤️',
      itemCount: 3,
      isPopular: true,
    },
    {
      id: 'popular',
      name: t(`${NS}.categoryPopular`),
      icon: '🔥',
      itemCount: 8,
      isPopular: true,
    },
    {
      id: 'appetizers',
      name: t(`${NS}.categoryAppetizers`),
      icon: '🥗',
      itemCount: 6,
    },
    {
      id: 'chicken',
      name: t(`${NS}.categoryChicken`),
      icon: '🍗',
      itemCount: 8,
    },
    { id: 'meat', name: t(`${NS}.categoryMeat`), icon: '🥩', itemCount: 5 },
    {
      id: 'mixed_rice',
      name: t(`${NS}.categoryMixedRice`),
      icon: '🍚',
      itemCount: 4,
    },
    {
      id: 'grilled',
      name: t(`${NS}.categoryGrilled`),
      icon: '🔥',
      itemCount: 6,
    },
    { id: 'drinks', name: t(`${NS}.categoryDrinks`), icon: '🥤', itemCount: 5 },
  ];

  const menuItems: MenuItem[] = [
    // Chicken Category
    {
      id: 'item_1',
      name: t(`${NS}.chickenBroastName`),
      description: t(`${NS}.chickenBroastDesc`),
      price: 1500,
      originalPrice: 1800,
      image: '🍗',
      imageUrl:
        'https://images.unsplash.com/photo-1604908554162-77c3d9d6f3fd?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604908554162-77c3d9d6f3fd?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'chicken',
      isPopular: true,
      isFavorite: true,
      preparationTime: t(`${NS}.prepTime15_20`),
      preparationTimeMinutes: 18,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 12,
    },
    {
      id: 'item_2',
      name: t(`${NS}.turkishChickenName`),
      description: t(`${NS}.turkishChickenDesc`),
      price: 1500,
      image: '🍖',
      imageUrl:
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'chicken',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime20_30`),
      preparationTimeMinutes: 24,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 9,
    },
    {
      id: 'item_3',
      name: t(`${NS}.plainChickenName`),
      description: t(`${NS}.plainChickenDesc`),
      price: 1200,
      image: '🍗',
      imageUrl:
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=320&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'chicken',
      isPopular: false,
      preparationTime: t(`${NS}.prepTime15_20`),
      preparationTimeMinutes: 16,
      hasOptions: true,
      isAvailable: false,
      stockQuantity: 0,
    },
    {
      id: 'item_4',
      name: t(`${NS}.chickenMadfoonName`),
      description: t(`${NS}.chickenMadfoonDesc`),
      price: 2000,
      image: '🍚',
      imageUrl:
        'https://images.unsplash.com/photo-1604908177073-5c2c064b2f03?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604908177073-5c2c064b2f03?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'chicken',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime25_35`),
      preparationTimeMinutes: 30,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 3,
    },
    // Meat Category
    {
      id: 'item_5',
      name: t(`${NS}.meatKabsaName`),
      description: t(`${NS}.meatKabsaDesc`),
      price: 2500,
      image: '🥩',
      imageUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'meat',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime30_40`),
      preparationTimeMinutes: 38,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 5,
    },
    {
      id: 'item_6',
      name: t(`${NS}.grilledMeatName`),
      description: t(`${NS}.grilledMeatDesc`),
      price: 3000,
      originalPrice: 3400,
      image: '🍖',
      imageUrl:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=320&auto=format&fit=crop',
      categoryId: 'meat',
      isPopular: false,
      preparationTime: t(`${NS}.prepTime25_35`),
      hasOptions: true,
      isAvailable: true,
      isNew: true,
      stockQuantity: 2,
      currency: 'ر.ي',
    },
    // Mixed Rice Category
    {
      id: 'item_7',
      name: t(`${NS}.mixedRiceName`),
      description: t(`${NS}.mixedRiceDesc`),
      price: 1800,
      image: '🍚',
      imageUrl:
        'https://images.unsplash.com/photo-1604909052979-6b8a2f7d4bff?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604909052979-6b8a2f7d4bff?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'mixed_rice',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime20_30`),
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 7,
    },
    {
      id: 'item_8',
      name: t(`${NS}.biryaniFamilyName`),
      description: t(`${NS}.biryaniFamilyDesc`),
      price: 3500,
      originalPrice: 4000,
      discountPercent: 12,
      image: '🍛',
      imageUrl:
        'https://images.unsplash.com/photo-1604909052979-6b8a2f7d4bff?q=80&w=900&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1604909052979-6b8a2f7d4bff?q=80&w=360&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'mixed_rice',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime30_40`),
      preparationTimeMinutes: 35,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 6,
    },
    // Grilled Category
    {
      id: 'item_9',
      name: t(`${NS}.grilledKebabName`),
      description: t(`${NS}.grilledKebabDesc`),
      price: 2200,
      image: '🍢',
      imageUrl:
        'https://images.unsplash.com/photo-1555992336-03a23c9b0d48?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555992336-03a23c9b0d48?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'grilled',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime20_25`),
      preparationTimeMinutes: 22,
      hasOptions: true,
      isAvailable: true,
      stockQuantity: 4,
    },
    {
      id: 'item_10',
      name: t(`${NS}.mixedGrillName`),
      description: t(`${NS}.mixedGrillDesc`),
      price: 4500,
      originalPrice: 5200,
      image: '🥓',
      imageUrl:
        'https://images.unsplash.com/photo-1555992336-03a23c9b0d48?q=80&w=900&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555992336-03a23c9b0d48?q=80&w=360&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'grilled',
      isPopular: true,
      preparationTime: t(`${NS}.prepTime30_40`),
      hasOptions: true,
      isAvailable: true,
      isNew: true,
      stockQuantity: 1,
    },
    // Appetizers
    {
      id: 'item_11',
      name: t(`${NS}.hummusName`),
      description: t(`${NS}.hummusDesc`),
      price: 500,
      image: '🥣',
      imageUrl:
        'https://images.unsplash.com/photo-1617196034183-421b4917c92b?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1617196034183-421b4917c92b?q=80&w=320&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'appetizers',
      isPopular: false,
      preparationTime: t(`${NS}.prepTime5_10`),
      preparationTimeMinutes: 8,
      hasOptions: false,
      isAvailable: true,
      stockQuantity: 20,
    },
    {
      id: 'item_12',
      name: t(`${NS}.salatahName`),
      description: t(`${NS}.salatahDesc`),
      price: 400,
      image: '🥗',
      imageUrl:
        'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=320&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'appetizers',
      isPopular: false,
      preparationTime: t(`${NS}.prepTime5_10`),
      preparationTimeMinutes: 7,
      hasOptions: false,
      isAvailable: true,
      stockQuantity: 18,
    },
    // Drinks
    {
      id: 'item_13',
      name: t(`${NS}.pepsiName`),
      description: t(`${NS}.pepsiDesc`),
      price: 200,
      image: '🥤',
      imageUrl:
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=700&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'drinks',
      isPopular: false,
      preparationTime: t(`${NS}.prepTimeInstant`),
      preparationTimeMinutes: 1,
      hasOptions: false,
      isAvailable: true,
      stockQuantity: 0,
    },
    {
      id: 'item_14',
      name: t(`${NS}.juiceName`),
      description: t(`${NS}.juiceDesc`),
      price: 350,
      image: '🧃',
      imageUrl:
        'https://images.unsplash.com/photo-1542444459-db63c0a7f44d?q=80&w=800&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1542444459-db63c0a7f44d?q=80&w=400&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'drinks',
      isPopular: false,
      preparationTime: t(`${NS}.prepTime5_10`),
      preparationTimeMinutes: 6,
      hasOptions: false,
      isAvailable: true,
      stockQuantity: 11,
    },
    {
      id: 'item_15',
      name: t(`${NS}.waterName`),
      description: t(`${NS}.waterDesc`),
      price: 100,
      image: '💧',
      imageUrl:
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=700&auto=format&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=300&auto=format&fit=crop',
      currency: 'ر.ي',
      categoryId: 'drinks',
      isPopular: false,
      preparationTime: t(`${NS}.prepTimeInstant`),
      preparationTimeMinutes: 1,
      hasOptions: false,
      isAvailable: true,
      stockQuantity: 30,
    },
  ];

  // ربط بيانات تجريبية موكاب لجميع أنماط القياس (حبة، نفر، وزن، كيلو، لوزن، حجم، طول، عرفي) للاطلاع
  const menuItemsWithOptions = menuItems.map((item) => {
    if (!item.hasOptions) return item;
    const optionGroups = getMockOptionGroupsForItem(item.id, item.price, t);
    return { ...item, optionGroups };
  });

  return {
    store: {
      id: 'STORE-001',
      name: t(`${NS}.storeName`),
      rating: 5.0,
      reviews: 2102,
      deliveryTime: t(`${NS}.deliveryTime40_60`),
      deliveryFee: 500,
      minimumOrder: 1000,
      isOpen: true,
      openingHours: t(`${NS}.openingHours`),
      image: '🏰',
      coverImage: '🏰',
      logoUrl:
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=900&auto=format&fit=crop',
      logoThumbnailUrl:
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=200&auto=format&fit=crop',
      categories,
      address: t(`${NS}.storeAddress`),
      phone: '+967771234567',
      deliveryModes: [
        {
          id: 'delivery',
          name: t(`${NS}.deliveryModeDelivery`),
          isAvailable: true,
          estimatedTime: t(`${NS}.deliveryTime40_60`),
          fee: 500,
        },
        {
          id: 'pickup',
          name: t(`${NS}.deliveryModePickup`),
          isAvailable: true,
          address: t(`${NS}.pickupAddress`),
        },
      ],
      tags: [t(`${NS}.tagYemeni`), t(`${NS}.tagChicken`), t(`${NS}.tagRice`)],
      hasFreeDelivery: false,
      hasProDelivery: true,
      acceptsOnlinePayment: true,
      isFavorite: true,
      followersCount: 15200,
      priceMatch: true,
      hasBthwaniPro: true,
      subscriptionPackageChips: ['توصيل مجاني', 'أولوية'],
    },
    menuItems: menuItemsWithOptions,
  };
}

