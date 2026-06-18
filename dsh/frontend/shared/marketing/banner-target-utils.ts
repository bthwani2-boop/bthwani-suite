// Authority: shared/marketing - banner domain pure utility functions.
// Moved from control-panel/marketing to shared/marketing as part of the full-stack consolidation.
// No React dependency - all functions are pure or data-driven only.

import type {
  MarketingBannerRecord,
  SmartBannerTargetType,
  SmartTargetSummary,
  BannerDraft,
} from './marketing.types';
import {
  SMART_TARGET_OPTIONS,
  SUBSCRIPTION_OPTIONS,
} from './marketing.types';

export interface DshCategorySubcategory {
  id: string;
  label: string;
  subtitle?: string;
}

export interface DshCategoryData {
  id: string;
  label: string;
  subtitle?: string;
  subcategories: DshCategorySubcategory[];
}

export interface MarketingTargetStore {
  id: string;
  name: string;
  subtitle?: string;
  statusLabel?: string;
  deliveryLabel?: string;
  serviceLabel?: string;
  offerLabel?: string;
  isOffer?: boolean;
  isFavorite?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  subtitle?: string;
  categoryId?: string;
  categoryLabel?: string;
  priceLabel?: string;
}

export const dshCategoryData: DshCategoryData[] = [];
export const dshDiscoveryStores: MarketingTargetStore[] = [];
export const storeItemsByStoreId: Record<string, StoreItem[]> = {};

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function getCategoryOptionLabel(categoryId: string): string {
  return dshCategoryData.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export function getStoreOptionLabel(storeId: string): string {
  return dshDiscoveryStores.find((s) => s.id === storeId)?.name ?? storeId;
}

export function getProductsForStore(storeId: string) {
  return storeItemsByStoreId[storeId] ?? [];
}

export function deriveSmartTargetType(item?: { actionType: string; actionTarget?: string } | null): SmartBannerTargetType {
  if (!item) return 'store';

  if (item.actionType === 'main_category') return 'category';
  if (item.actionType === 'sub_category') return 'subcategory';
  if (item.actionType === 'store') return 'store';
  if (item.actionType === 'product') return 'product';
  if (item.actionType === 'subscription') return 'subscription';

  if (item.actionType === 'external') {
    if (item.actionTarget === 'home') return 'home';
    if (item.actionTarget === 'stores' || item.actionTarget === 'DshStoresList') return 'stores';
    if (item.actionTarget === 'offers') return 'offer';
    if (item.actionTarget === 'tracking') return 'tracking';
    if (item.actionTarget === 'orders-list' || item.actionTarget === 'orders') return 'orders';
    if (item.actionTarget === 'entitlements-get' || item.actionTarget === 'loyalty') return 'loyalty';
    if (item.actionTarget === 'campaign') return 'campaign';
    return 'custom';
  }

  return 'custom';
}

export function resolveSmartTargetSummary(
  targetType: SmartBannerTargetType,
  draft: BannerDraft,
): SmartTargetSummary {
  if (targetType === 'home') {
    return { label: 'الرئيسية', finalRoute: 'home', targetLabel: 'الصفحة الرئيسية', targetId: 'home' };
  }
  if (targetType === 'stores') {
    return { label: 'المتاجر', finalRoute: 'stores', targetLabel: 'قائمة المتاجر', targetId: 'stores' };
  }
  if (targetType === 'store') {
    const store = dshDiscoveryStores.find((entry) => entry.id === draft.actionTarget);
    return {
      label: 'متجر',
      finalRoute: `stores/${draft.actionTarget || '—'}`,
      targetLabel: (store?.name ?? draft.actionTarget) || '—',
      targetId: draft.actionTarget || '—',
    };
  }
  if (targetType === 'category') {
    const category = dshCategoryData.find((entry) => entry.id === draft.actionTarget);
    return {
      label: 'فئة',
      finalRoute: `categories/${draft.actionTarget || '—'}`,
      targetLabel: (category?.label ?? draft.actionTarget) || '—',
      targetId: draft.actionTarget || '—',
    };
  }
  if (targetType === 'subcategory') {
    const category = dshCategoryData.find((entry) => entry.id === draft.actionTarget);
    const subcategory = category?.subcategories.find((entry) => entry.id === draft.actionExtra);
    return {
      label: 'فئة فرعية',
      finalRoute: `categories/${draft.actionTarget || '—'}/${draft.actionExtra || '—'}`,
      targetLabel: (subcategory?.label ?? draft.actionExtra) || '—',
      targetId: `${draft.actionTarget || '—'} / ${draft.actionExtra || '—'}`,
    };
  }
  if (targetType === 'product') {
    const products = getProductsForStore(draft.actionExtra);
    const product = products.find((entry) => entry.id === draft.actionTarget);
    return {
      label: 'منتج',
      finalRoute: `stores/${draft.actionExtra || '—'}/products/${draft.actionTarget || '—'}`,
      targetLabel: (product?.name ?? draft.actionTarget) || '—',
      targetId: `${draft.actionExtra || '—'} / ${draft.actionTarget || '—'}`,
    };
  }
  if (targetType === 'offer') {
    const store = dshDiscoveryStores.find((entry) => entry.id === draft.actionExtra || entry.id === draft.actionTarget);
    return {
      label: 'عرض',
      finalRoute: store ? `offers/${store.id}` : 'offers',
      targetLabel: (store?.name ?? 'العروض') || '—',
      targetId: store?.id ?? draft.actionExtra ?? draft.actionTarget ?? 'offers',
    };
  }
  if (targetType === 'subscription') {
    const option = SUBSCRIPTION_OPTIONS.find((entry) => entry.value === draft.actionTarget);
    return {
      label: 'اشتراك',
      finalRoute: `benefits/${draft.actionTarget || 'entitlements-get'}`,
      targetLabel: (option?.label ?? draft.actionTarget) || '—',
      targetId: draft.actionTarget || '—',
    };
  }
  if (targetType === 'campaign') {
    return {
      label: 'حملة',
      finalRoute: `campaign/${draft.actionTarget || 'home'}`,
      targetLabel: draft.actionTarget || 'campaign',
      targetId: draft.actionTarget || 'campaign',
    };
  }
  if (targetType === 'tracking') {
    return { label: 'تتبع', finalRoute: 'tracking', targetLabel: 'التتبع', targetId: 'tracking' };
  }
  if (targetType === 'orders') {
    return { label: 'طلبات', finalRoute: 'orders-list', targetLabel: 'الالتباس', targetId: 'orders-list' };
  }
  if (targetType === 'loyalty') {
    return {
      label: 'ولاء',
      finalRoute: 'benefits/entitlements-get',
      targetLabel: 'الولاء / المزايا',
      targetId: 'entitlements-get',
    };
  }
  return {
    label: 'مخصص',
    finalRoute: draft.actionTarget || 'custom',
    targetLabel: draft.actionTarget || 'custom',
    targetId: draft.actionTarget || 'custom',
  };
}

export function createBannerDraft(
  item: MarketingBannerRecord | null | undefined,
  defaults: { accentColor: string; offerBadgeColor: string },
): BannerDraft {
  const targetType = deriveSmartTargetType(item);
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    mediaKey: item?.mediaKey ?? '',
    highlight: '',
    accentColor: item?.accentColor ?? defaults.accentColor,
    audience: item?.audience ?? 'all',
    status: item?.status ?? 'draft',
    actionType: item?.actionType ?? 'store',
    actionTarget: item?.actionTarget ?? 'store-1001',
    actionExtra: item?.actionExtra ?? '',
    targetId: item?.actionTarget ?? '',
    targetExtra: item?.actionExtra ?? '',
    ctaLabel: item?.ctaLabel ?? 'اكتشف الآن',
    partnerName: item?.partnerName ?? '',
    imageUrl: item?.imageUrl ?? '',
    position: String(item?.position ?? ''),
    order: String(item?.position ?? ''),
    templateId: item?.templateId ?? 'default',
    offerBadgeText: item?.offerBadgeText ?? '',
    offerBadgeColor: item?.offerBadgeColor ?? defaults.offerBadgeColor,
    offerBadgePosition: item?.offerBadgePosition ?? 'top-right',
    partnerLogoUrl: item?.partnerLogoUrl ?? '',
    partnerLogoPosition: item?.partnerLogoPosition ?? 'top-left',
    overlayImageUrl: item?.overlayImageUrl ?? '',
    overlayPosition: item?.overlayPosition ?? 'center',
    titlePlacement: item?.titlePlacement ?? 'bottom',
    imageFit: item?.imageFit ?? 'cover',
    logoPosition: item?.partnerLogoPosition ?? 'top-left',
    motion: item?.motionStyle ?? 'slide',
    reviewState: 'none',
    motionStyle: item?.motionStyle ?? 'slide',
    autoplayEnabled: item?.autoplayEnabled ?? true,
    autoplayIntervalMs: String(item?.autoplayIntervalMs ?? 4500),
    pauseOnInteraction: item?.pauseOnInteraction ?? true,
    targetType,
  };
}

export function bannerActionTypeLabel(item: { actionType: string; actionTarget?: string }): string {
  if (item.actionType === 'main_category') return 'فئة رئيسية';
  if (item.actionType === 'sub_category') return 'فئة فرعية';
  if (item.actionType === 'store') return 'متجر';
  if (item.actionType === 'store_category') return 'قسم داخل متجر';
  if (item.actionType === 'product') return 'منتج محدد';
  if (item.actionType === 'subscription') return 'اشتراك';
  if (item.actionType === 'external') {
    if (item.actionTarget === 'home') return 'الرئيسية';
    if (item.actionTarget === 'stores') return 'المتاجر';
    if (item.actionTarget === 'offers') return 'عرض';
    if (item.actionTarget === 'tracking') return 'تتبع';
    if (item.actionTarget === 'orders-list' || item.actionTarget === 'orders') return 'الطلبات';
    if (item.actionTarget === 'entitlements-get' || item.actionTarget === 'loyalty') return 'الولاء';
    if (item.actionTarget?.startsWith('campaign')) return 'حملة';
    return 'وجهة عامة';
  }
  return 'اشتراك';
}
