/**
 * DSH Delivery Modes — Single Source of Truth (SSoT)
 * Spec: PLATFORM_FRAMEWORK_SPECIFICATION_GUIDE §16, DSH_SERVICE_ARCHITECTURE_ECOSYSTEM §16.3
 *
 * الأنماط الأربعة المعتمدة في DSH — متاحة ومفعلة داخلياً (default). التفاعيل/التعطيل يتم من لوحة التحكم (CONTROL PANEL) من قسم الخدمات عبر VAR_*.
 * اتفاقية الشريك: تحديد الأنماط يتم رسمياً مع الشريك؛ الدفع: WLT | COD | WLT+COD. انظر DSH_PARTNER_AGREEMENT_AND_CHECKOUT_SPEC.md.
 *
 * الأنماط:
 * 1. استلم بنفسك (Pickup)
 * 2. توصيل المنصة (Platform Fleet) — توصيل منتجات الشريك عبر أسطول المنصة
 * 3. توصيل الشريك (Merchant Self-Delivery) — توصيل منتجات الشريك عبر سائق الشريك
 * 4. دارك ستور (Dark Store) — البيع من منتجات المنصة نفسها (مخزون المنصة)، وليس من منتجات الشريك. التنفيذ عبر مستودع/دارك ستور تابع للمنصة.
 */

/** API value for store delivery-modes / order fulfillment type */
export type DshDeliveryModeId =
  | 'platform_delivery'
  | 'merchant_delivery'
  | 'pickup'
  | 'dark_store';

/** UI filter key used in orders list (short form) */
export type DshDeliveryModeFilterKey = 'all' | 'platform' | 'store' | 'pickup' | 'darkstore';

export const DSH_DELIVERY_MODE_IDS: readonly DshDeliveryModeId[] = [
  'platform_delivery',
  'merchant_delivery',
  'pickup',
  'dark_store',
] as const;

/** Runtime VAR keys لتفعيل/تعطيل كل نمط من لوحة التحكم → قسم الخدمات (CONTROL PANEL). القيمة الافتراضية: مفعل (true). */
export const DSH_DELIVERY_MODE_VAR_KEYS: Record<DshDeliveryModeId, string> = {
  platform_delivery: 'VAR_DSH_DELIVERY_MODE_PLATFORM_ENABLED',
  merchant_delivery: 'VAR_DSH_DELIVERY_MODE_MERCHANT_ENABLED',
  pickup: 'VAR_DSH_DELIVERY_MODE_PICKUP_ENABLED',
  dark_store: 'VAR_DSH_DELIVERY_MODE_DARK_STORE_ENABLED',
};

export interface DshDeliveryModeOption {
  id: DshDeliveryModeId;
  /** Short key for UI filters (e.g. orders list chips) */
  filterKey: DshDeliveryModeFilterKey;
  labelAr: string;
  labelEn: string;
  /** Optional: توضيح النمط (مثلاً: دارك ستور = منتجات المنصة وليس الشريك) */
  descriptionAr?: string;
  descriptionEn?: string;
}

/** يُستدعى من component مع t من useI18n(). */
export function getDshDeliveryModes(t: (key: string) => string): Record<DshDeliveryModeId, DshDeliveryModeOption> {
  return {
    pickup: {
      id: 'pickup',
      filterKey: 'pickup',
      labelAr: t('dsh.deliveryModes.labelPickup'),
      labelEn: 'Pickup',
    },
    platform_delivery: {
      id: 'platform_delivery',
      filterKey: 'platform',
      labelAr: t('dsh.deliveryModes.labelPlatformDelivery'),
      labelEn: 'Platform Fleet',
    },
    merchant_delivery: {
      id: 'merchant_delivery',
      filterKey: 'store',
      labelAr: t('dsh.deliveryModes.labelMerchantDelivery'),
      labelEn: 'Merchant Self-Delivery',
    },
    dark_store: {
      id: 'dark_store',
      filterKey: 'darkstore',
      labelAr: t('dsh.deliveryModes.labelDarkStore'),
      labelEn: 'Dark Store',
      descriptionAr: t('dsh.deliveryModes.descriptionDarkStore'),
      descriptionEn: 'Selling platform-owned inventory, not partner inventory',
    },
  };
}

/** Map UI filter key → API mode id(s) for a single selection */
export const DSH_FILTER_KEY_TO_MODE_ID: Record<Exclude<DshDeliveryModeFilterKey, 'all'>, DshDeliveryModeId> = {
  platform: 'platform_delivery',
  store: 'merchant_delivery',
  pickup: 'pickup',
  darkstore: 'dark_store',
};

/** All filter keys for chips (all + the four modes) */
export const DSH_DELIVERY_MODE_FILTER_KEYS: DshDeliveryModeFilterKey[] = [
  'all',
  'store',
  'platform',
  'pickup',
  'darkstore',
];

export function getDeliveryModeLabel(
  modes: Record<DshDeliveryModeId, DshDeliveryModeOption>,
  id: DshDeliveryModeId,
  lang: 'ar' | 'en' = 'ar'
): string {
  const opt = modes[id];
  return opt ? (lang === 'ar' ? opt.labelAr : opt.labelEn) : id;
}

export function getDeliveryModeFilterKey(
  modes: Record<DshDeliveryModeId, DshDeliveryModeOption>,
  modeId: DshDeliveryModeId
): DshDeliveryModeFilterKey {
  return modes[modeId]?.filterKey ?? 'all';
}

/** Label for UI filter chip by filter key (e.g. "توصيل المنصة") */
export function getDeliveryModeLabelByFilterKey(
  modes: Record<DshDeliveryModeId, DshDeliveryModeOption>,
  filterKey: Exclude<DshDeliveryModeFilterKey, 'all'>,
  lang: 'ar' | 'en' = 'ar'
): string {
  const entry = Object.values(modes).find((m) => m.filterKey === filterKey);
  return entry ? (lang === 'ar' ? entry.labelAr : entry.labelEn) : filterKey;
}

