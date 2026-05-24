import { dshCategoryMeasurementPolicies } from '../../shared/catalog';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';

import {
  type DshFulfillmentDeliveryMode,
  getDshFulfillmentDeliveryModeMeta,
} from '../contracts/dsh-client-binding.contracts';
import type { DshStoreOperationalState } from '../contracts/dsh-store-types';

export type StoreScreenDeliveryLabels = {
  pickup: string;
  storeDelivery: string;
  platformDelivery: string;
};

export function getAllDeliveryModes(): Array<{ id: DshFulfillmentDeliveryMode; label: string; icon: string }> {
  return (
    ['bthwani_delivery', 'partner_delivery', 'pickup'] as const
  ).map((id) => {
    const meta = getDshFulfillmentDeliveryModeMeta(id);
    return { id, label: meta.label, icon: meta.icon };
  });
}

export function normalizeDisplayText(value?: string) {
  if (!value) return '';

  return value
    .replace(/Hadda Fresh Market/gi, 'أسواق العليا الطازجة')
    .replace(/Hittin Bakery/gi, 'مخبز حطين')
    .replace(/Malqa Kitchen/gi, 'مطبخ الملقا')
    .replace(/Groceries and daily essentials/gi, 'مقاضي يومية ومنتجات طازجة')
    .replace(/Bread and pastries/gi, 'مخبوزات وخبز يومي')
    .replace(/Prepared meals/gi, 'وجبات جاهزة يومياً')
    .replace(/Royal Gala Apples/gi, 'تفاح رويال غالا')
    .replace(/Organic Milk/gi, 'حليب عضوي')
    .replace(/Whole Wheat Bread/gi, 'خبز قمح كامل')
    .replace(/Butter Croissant/gi, 'كرواسون زبدة')
    .replace(/Chocolate Slice/gi, 'شريحة شوكولاتة')
    .replace(/Creamy Pasta Box/gi, 'باستا كريمية')
    .replace(/Garden Salad/gi, 'سلطة جاردن')
    .replace(/Fresh box, 1 kg/gi, 'صندوق طازج 1 كجم')
    .replace(/1\.5L chilled bottle/gi, 'عبوة مبردة 1.5 لتر')
    .replace(/Daily fresh bakery/gi, 'مخبوز يومي طازج')
    .replace(/Baked every morning/gi, 'يخبز طازجًا كل صباح')
    .replace(/Single serving/gi, 'حصة فردية جاهزة')
    .replace(/Prepared meal ready to dispatch/gi, 'وجبة جاهزة للإرسال')
    .replace(/Light and fresh bowl/gi, 'طبق خفيف وطازج')
    .replace(/Popular/gi, 'الأكثر طلبًا')
    .replace(/Best seller/gi, 'الأكثر مبيعًا')
    .replace(/Chef pick/gi, 'اختيار الشيف')
    .replace(/Fresh/gi, 'طازج')
    .replace(/Dairy/gi, 'ألبان')
    .replace(/Bakery/gi, 'مخبوزات')
    .replace(/Meals/gi, 'وجبات')
    .replace(/Healthy/gi, 'صحي')
    .replace(/Sweets/gi, 'حلويات')
    .replace(/ETA\s*/gi, '')
    .replace(/\bmin\b/gi, 'دقيقة')
    .replace(/\bYER\b/gi, 'ر.ي')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function normalizeTagLabel(tag: string, storeText: StoreScreenDeliveryLabels) {
  const normalized = tag.trim().toLowerCase();

  if (normalized.includes('pro')) return 'بثواني برو';
  if (normalized.includes('pickup')) return storeText.pickup;
  if (normalized.includes('partner delivery') || normalized.includes('store delivery')) return storeText.storeDelivery;
  if (normalized.includes('offer')) return 'عرض مباشر';
  if (normalized.includes('km')) return tag.replace(/km/i, 'كم');

  return tag;
}

export function isDeliveryBenefitLabel(tag: string, storeText: StoreScreenDeliveryLabels) {
  const normalized = normalizeDisplayText(tag).trim().toLowerCase();

  return normalized === normalizeDisplayText(storeText.storeDelivery).toLowerCase()
    || normalized === normalizeDisplayText(storeText.pickup).toLowerCase()
    || normalized === normalizeDisplayText(storeText.platformDelivery).toLowerCase()
    || normalized.includes('توصيل المتجر')
    || normalized.includes('استلم بنفسك')
    || normalized.includes('توصيل بثواني');
}

export function resolveStoreOperationalState(
  statusLabel: string,
  deliveryLabel?: string,
  serviceLabel?: string,
): DshStoreOperationalState {
  const normalized = [statusLabel, deliveryLabel, serviceLabel]
    .filter(Boolean)
    .join(' ')
    .trim()
    .toLowerCase();

  if (
    normalized.includes('area_unserviceable')
    || normalized.includes('unserviceable')
    || normalized.includes('outside coverage')
    || normalized.includes('خارج التغطية')
    || normalized.includes('خارج النطاق')
    || normalized.includes('غير مخدوم')
  ) {
    return 'area_unserviceable';
  }

  if (normalized.includes('closed') || normalized.includes('مغلق')) {
    return 'store_closed';
  }

  return 'store_open';
}

export function resolveMeasurementOptions(item: DshStoreGetMenuItem) {
  if (item.measurementOptions?.length) {
    return item.measurementOptions;
  }

  return dshCategoryMeasurementPolicies[item.categoryId]?.options ?? ['حبة', '2 حبة'];
}

export function extractPriceValue(priceLabel?: string) {
  const normalized = Number((priceLabel ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(normalized) ? normalized : 0;
}

export function resolveMeasurementMultiplier(option: string) {
  const normalized = option.trim();

  if (normalized.includes('250')) return 0.25;
  if (normalized.includes('500')) return 0.5;
  if (normalized.includes('1 كجم')) return 1;
  if (normalized.includes('2 حبة')) return 2;
  if (normalized.includes('4 حبة')) return 4;
  if (normalized.includes('6 حبة')) return 6;
  if (normalized.includes('ربع')) return 0.25;
  if (normalized.includes('نصف')) return 0.5;
  if (normalized.includes('نفر')) return 1;

  return 1;
}

export function formatCurrencyValue(value: number) {
  const normalized = value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `${normalized} ر.ي`;
}

export function resolveMeasurementUnitPrice(item: DshStoreGetMenuItem, option: string) {
  return extractPriceValue(item.priceLabel) * resolveMeasurementMultiplier(option);
}
