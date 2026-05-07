"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { Box, Button, SearchField, SelectField, Surface, Tabs, Text, TextField, useDirection, colorPalette } from '@bthwani/ui-kit';
import {
  computeMarketingBannerQuality,
  duplicateMarketingBannerItem,
  getMarketingBannerItems,
  getMarketingBannerKpis,
  removeMarketingBannerItem,
  toggleMarketingBannerStatus,
  upsertMarketingBannerItem,
  type MarketingBannerActionType,
  type MarketingBannerAudience,
  type MarketingBannerRecord,
  type MarketingBannerStatus,
} from '../../shared/banner-store';
import { dshCategoryFixtures } from '../../app-client/dshCategoriesFixtures';
import { dshDiscoveryStores } from '../../app-client/discoveryFixtures';
import { storeItemsByStoreId } from '../../app-client/itemsFixtures';
import { resolveDshImageSource } from '../../app-client/resolve-image-source';

export type BannersCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
};

type BannerDraft = {
  id?: string;
  title: string;
  subtitle: string;
  mediaKey: string;
  accentColor: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  actionTarget: string;
  actionExtra: string;
  ctaLabel: string;
  partnerName: string;
  imageUrl: string;
  position: string;
  // Template fields
  templateId: string;
  offerBadgeText: string;
  offerBadgeColor: string;
  partnerLogoUrl: string;
  partnerLogoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl: string;
  overlayPosition: 'center' | 'bottom' | 'top' | 'fill';
  titlePlacement: 'top' | 'center' | 'bottom';
  imageFit: 'cover' | 'contain';
  targetType: SmartBannerTargetType;
};

type SmartBannerTargetType =
  | 'home'
  | 'stores'
  | 'store'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'offer'
  | 'subscription'
  | 'campaign'
  | 'tracking'
  | 'orders'
  | 'loyalty'
  | 'custom';

type SmartTargetSummary = {
  label: string;
  finalRoute: string;
  targetLabel: string;
  targetId: string;
};

type SmartTargetStoreFilter = 'all' | 'offers' | 'favorites' | 'available';

const SMART_TARGET_OPTIONS: Array<{ value: SmartBannerTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط البنر بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط البنر بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط البنر بمنتج داخل متجر محدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'subscription', label: 'اشتراك', description: 'يفتح مسار الاشتراكات والمزايا.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'tracking', label: 'التتبع', description: 'يربط البنر بمسار تتبع الطلب.' },
  { value: 'orders', label: 'الطلبات', description: 'يربط البنر بقائمة الطلبات.' },
  { value: 'loyalty', label: 'الولاء', description: 'يفتح سياق الولاء أو الاستحقاقات.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
];

const SUBSCRIPTION_OPTIONS = [
  { value: 'entitlements-get', label: 'المزايا الأساسية' },
  { value: 'subscription-family-get', label: 'اشتراك العائلة' },
];

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function getCategoryOptionLabel(categoryId: string) {
  return dshCategoryFixtures.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function getStoreOptionLabel(storeId: string) {
  return dshDiscoveryStores.find((store) => store.id === storeId)?.name ?? storeId;
}

function getProductsForStore(storeId: string) {
  return storeItemsByStoreId[storeId] ?? [];
}

function deriveSmartTargetType(item?: MarketingBannerRecord | null): SmartBannerTargetType {
  if (!item) {
    return 'store';
  }

  if (item.actionType === 'main_category') {
    return 'category';
  }

  if (item.actionType === 'sub_category') {
    return 'subcategory';
  }

  if (item.actionType === 'store') {
    return 'store';
  }

  if (item.actionType === 'product') {
    return 'product';
  }

  if (item.actionType === 'subscription') {
    return 'subscription';
  }

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

function resolveSmartTargetSummary(
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
    const category = dshCategoryFixtures.find((entry) => entry.id === draft.actionTarget);
    return {
      label: 'فئة',
      finalRoute: `categories/${draft.actionTarget || '—'}`,
      targetLabel: (category?.label ?? draft.actionTarget) || '—',
      targetId: draft.actionTarget || '—',
    };
  }

  if (targetType === 'subcategory') {
    const category = dshCategoryFixtures.find((entry) => entry.id === draft.actionTarget);
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
    return {
      label: 'تتبع',
      finalRoute: 'tracking',
      targetLabel: 'التتبع',
      targetId: 'tracking',
    };
  }

  if (targetType === 'orders') {
    return {
      label: 'طلبات',
      finalRoute: 'orders-list',
      targetLabel: 'الطلبات',
      targetId: 'orders-list',
    };
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

function createDraft(item?: MarketingBannerRecord | null): BannerDraft {
  const targetType = deriveSmartTargetType(item);
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    mediaKey: item?.mediaKey ?? '',
    accentColor: item?.accentColor ?? '#0A2F5C',
    audience: item?.audience ?? 'all',
    status: item?.status ?? 'draft',
    actionType: item?.actionType ?? 'store',
    actionTarget: item?.actionTarget ?? 'store-1001',
    actionExtra: item?.actionExtra ?? '',
    ctaLabel: item?.ctaLabel ?? 'اكتشف الآن',
    partnerName: item?.partnerName ?? '',
    imageUrl: item?.imageUrl ?? '',
    position: String(item?.position ?? ''),
    templateId: item?.templateId ?? 'default',
    offerBadgeText: item?.offerBadgeText ?? '',
    offerBadgeColor: item?.offerBadgeColor ?? '#FF500D',
    partnerLogoUrl: item?.partnerLogoUrl ?? '',
    partnerLogoPosition: item?.partnerLogoPosition ?? 'top-left',
    overlayImageUrl: item?.overlayImageUrl ?? '',
    overlayPosition: item?.overlayPosition ?? 'center',
    titlePlacement: item?.titlePlacement ?? 'bottom',
    imageFit: item?.imageFit ?? 'cover',
    targetType,
  };
}

function bannerActionTypeLabel(item: MarketingBannerRecord) {
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

export function BannersCommandDeckScreen(_props: BannersCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const [items, setItems] = React.useState<MarketingBannerRecord[]>(() => getMarketingBannerItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingBannerItems()[0]?.id ?? null);
  const selected = React.useMemo(
    () => (selectedId ? (items.find((item) => item.id === selectedId) ?? null) : null),
    [items, selectedId],
  );
  const [draft, setDraft] = React.useState<BannerDraft>(() => createDraft(selected));
  const [storeSearch, setStoreSearch] = React.useState('');
  const [storeFilter, setStoreFilter] = React.useState<SmartTargetStoreFilter>('all');
  const [categorySearch, setCategorySearch] = React.useState('');
  const [subcategoryParentSearch, setSubcategoryParentSearch] = React.useState('');
  const [subcategoryChildSearch, setSubcategoryChildSearch] = React.useState('');
  const [productStoreSearch, setProductStoreSearch] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');
  const [productCategoryFilter, setProductCategoryFilter] = React.useState<string>('all');
  const [offerSearch, setOfferSearch] = React.useState('');
  const [subscriptionSearch, setSubscriptionSearch] = React.useState('');

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingBannerKpis(), [items]);
  const quality = React.useMemo(
    () => computeMarketingBannerQuality({ ...draft, position: Number.parseInt(draft.position, 10) || 0 } as unknown as Partial<MarketingBannerRecord>),
    [draft],
  );

  function refresh() {
    const nextItems = getMarketingBannerItems();
    setItems(nextItems);
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingBannerItem({
      ...draft,
      position: Number.parseInt(draft.position, 10) || undefined,
    } as unknown as Partial<MarketingBannerRecord>);
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingBannerRecord) {
    toggleMarketingBannerStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingBannerRecord) {
    const duplicated = duplicateMarketingBannerItem(item.id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
    }
  }

  function handleDelete(item: MarketingBannerRecord) {
    if (!confirm('هل أنت متأكد من حذف هذا البنر؟')) return;
    removeMarketingBannerItem(item.id);
    refresh();
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  const templates = [
    { id: 'restaurant', label: 'مطعم', accent: '#E11D48', badge: 'خصم 20%', cta: 'اطلب الآن', icon: '🍔' },
    { id: 'fashion', label: 'متجر أزياء', accent: '#2563EB', badge: 'وصل حديثاً', cta: 'تسوق الآن', icon: '👗' },
    { id: 'tech', label: 'إلكترونيات', accent: '#0F172A', badge: 'الأكثر مبيعاً', cta: 'اشترِ الآن', icon: '📱' },
    { id: 'pro', label: 'اشتراك برو', accent: '#7C3AED', badge: 'شهر مجاني', cta: 'اشترك الآن', icon: '💎' },
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setDraft(c => ({
      ...c,
      templateId: tpl.id,
      accentColor: tpl.accent,
      offerBadgeText: tpl.badge,
      ctaLabel: tpl.cta,
      title: `عرض ${tpl.label}`,
      subtitle: `استمتع بأفضل تجربة مع ${tpl.label} بأسعار حصرية.`,
    }));
  };

  const firstStoreId = dshDiscoveryStores[0]?.id ?? 'store-1001';
  const firstCategoryId = dshCategoryFixtures[0]?.id ?? 'restaurants';
  const firstCategoryWithSubcategories = dshCategoryFixtures.find((category) => category.subcategories.length > 0) ?? dshCategoryFixtures[1];
  const firstSubcategoryId = firstCategoryWithSubcategories?.subcategories[0]?.id ?? '';
  const firstProductStoreId = Object.keys(storeItemsByStoreId).find((storeId) => (storeItemsByStoreId[storeId] ?? []).length > 0) ?? firstStoreId;
  const firstProductId = storeItemsByStoreId[firstProductStoreId]?.[0]?.id ?? '';
  const firstOfferStoreId = dshDiscoveryStores.find((store) => Boolean(store.isOffer || store.offerLabel))?.id ?? firstStoreId;

  const smartTargetSummary = React.useMemo(
    () => resolveSmartTargetSummary(draft.targetType, draft),
    [draft.actionExtra, draft.actionTarget, draft.targetType],
  );

  const handleSmartTargetTypeChange = React.useCallback((targetType: SmartBannerTargetType) => {
    setDraft((current) => {
      const currentStoreIsValid = (storeId: string) => Boolean(dshDiscoveryStores.find((store) => store.id === storeId));
      const currentCategoryIsValid = (categoryId: string) => Boolean(dshCategoryFixtures.find((category) => category.id === categoryId));
      const currentSubcategoryIsValid = (categoryId: string, subcategoryId: string) =>
        Boolean(dshCategoryFixtures.find((category) => category.id === categoryId)?.subcategories.find((subcategory) => subcategory.id === subcategoryId));
      const currentProductIsValid = (storeId: string, productId: string) => Boolean(getProductsForStore(storeId).find((product) => product.id === productId));
      const currentOfferStoreIsValid = (storeId: string) => Boolean(dshDiscoveryStores.find((store) => store.id === storeId && Boolean(store.isOffer || store.offerLabel)));
      const currentSubscriptionIsValid = (route: string) => Boolean(SUBSCRIPTION_OPTIONS.find((option) => option.value === route));

      switch (targetType) {
        case 'home':
          return { ...current, targetType, actionType: 'external', actionTarget: 'home', actionExtra: '' };
        case 'stores':
          return { ...current, targetType, actionType: 'external', actionTarget: 'stores', actionExtra: '' };
        case 'store':
          return { ...current, targetType, actionType: 'store', actionTarget: current.actionType === 'store' && currentStoreIsValid(current.actionTarget) ? current.actionTarget : firstStoreId, actionExtra: '' };
        case 'category':
          return { ...current, targetType, actionType: 'main_category', actionTarget: current.actionType === 'main_category' && currentCategoryIsValid(current.actionTarget) ? current.actionTarget : firstCategoryId, actionExtra: '' };
        case 'subcategory':
          return {
            ...current,
            targetType,
            actionType: 'sub_category',
            actionTarget: current.actionType === 'sub_category' && currentCategoryIsValid(current.actionTarget) && currentSubcategoryIsValid(current.actionTarget, current.actionExtra)
              ? current.actionTarget
              : firstCategoryWithSubcategories?.id || firstCategoryId,
            actionExtra: current.actionType === 'sub_category' && currentCategoryIsValid(current.actionTarget) && currentSubcategoryIsValid(current.actionTarget, current.actionExtra)
              ? current.actionExtra
              : firstSubcategoryId,
          };
        case 'product':
          {
            const isCurrentProductSelectionValid = current.actionType === 'product'
              && currentProductIsValid(current.actionExtra, current.actionTarget);

          return {
            ...current,
            targetType,
            actionType: 'product',
            actionTarget: isCurrentProductSelectionValid ? current.actionTarget : firstProductId,
            actionExtra: isCurrentProductSelectionValid ? current.actionExtra : firstProductStoreId,
          };
          }
        case 'offer':
          return { ...current, targetType, actionType: 'external', actionTarget: 'offers', actionExtra: current.actionType === 'external' && current.actionTarget === 'offers' && currentOfferStoreIsValid(current.actionExtra) ? current.actionExtra : firstOfferStoreId };
        case 'subscription':
          return { ...current, targetType, actionType: 'subscription', actionTarget: current.actionType === 'subscription' && currentSubscriptionIsValid(current.actionTarget) ? current.actionTarget : 'entitlements-get', actionExtra: '' };
        case 'campaign':
          return { ...current, targetType, actionType: 'external', actionTarget: current.actionType === 'external' && current.actionTarget.startsWith('campaign') ? current.actionTarget : 'campaign', actionExtra: '' };
        case 'tracking':
          return { ...current, targetType, actionType: 'external', actionTarget: 'tracking', actionExtra: '' };
        case 'orders':
          return { ...current, targetType, actionType: 'external', actionTarget: 'orders-list', actionExtra: '' };
        case 'loyalty':
          return { ...current, targetType, actionType: 'external', actionTarget: 'entitlements-get', actionExtra: '' };
        case 'custom':
        default:
          return { ...current, targetType, actionType: 'external', actionTarget: current.actionTarget || 'custom-route', actionExtra: '' };
      }
    });
  }, [firstCategoryId, firstCategoryWithSubcategories?.id, firstOfferStoreId, firstProductId, firstProductStoreId, firstStoreId, firstSubcategoryId]);

  const targetTypeOptions = React.useMemo(
    () => SMART_TARGET_OPTIONS.map((option) => ({ value: option.value, label: option.label, description: option.description })),
    [],
  );

  const storeOptions = React.useMemo(
    () => dshDiscoveryStores
      .filter((store) => {
        if (storeFilter === 'offers' && !(store.isOffer || store.offerLabel)) {
          return false;
        }

        if (storeFilter === 'favorites' && !store.isFavorite) {
          return false;
        }

        if (storeFilter === 'available' && store.statusLabel !== 'مفتوح') {
          return false;
        }

        const query = normalizeSearchText(storeSearch);
        if (!query) {
          return true;
        }

        return [
          store.name,
          store.subtitle,
          store.statusLabel,
          store.deliveryLabel,
          store.serviceLabel,
          store.offerLabel ?? '',
        ].join(' ').toLowerCase().includes(query);
      })
      .map((store) => ({
        value: store.id,
        label: store.name,
        description: `${store.subtitle} · ${store.offerLabel ?? store.statusLabel}`,
      })),
    [storeFilter, storeSearch],
  );

  const categoryOptions = React.useMemo(
    () => dshCategoryFixtures
      .filter((category) => {
        const query = normalizeSearchText(categorySearch);
        if (!query) {
          return true;
        }

        return [category.label, category.subtitle, category.id].join(' ').toLowerCase().includes(query);
      })
      .map((category) => ({
        value: category.id,
        label: category.label,
        description: category.subtitle,
      })),
    [categorySearch],
  );

  const selectedSubcategorySource = React.useMemo(
    () => dshCategoryFixtures.find((category) => category.id === draft.actionTarget) ?? firstCategoryWithSubcategories ?? null,
    [draft.actionTarget, firstCategoryWithSubcategories],
  );

  const parentCategoryOptions = React.useMemo(
    () => dshCategoryFixtures
      .filter((category) => category.subcategories.length > 0)
      .filter((category) => {
        const query = normalizeSearchText(subcategoryParentSearch);
        if (!query) {
          return true;
        }

        return [category.label, category.subtitle, category.id].join(' ').toLowerCase().includes(query);
      })
      .map((category) => ({
        value: category.id,
        label: category.label,
        description: category.subtitle,
      })),
    [subcategoryParentSearch],
  );

  const subcategoryOptions = React.useMemo(
    () => (selectedSubcategorySource?.subcategories ?? [])
      .filter((subcategory) => {
        const query = normalizeSearchText(subcategoryChildSearch);
        if (!query) {
          return true;
        }

        return [subcategory.label, subcategory.subtitle, subcategory.id].join(' ').toLowerCase().includes(query);
      })
      .map((subcategory) => ({
        value: subcategory.id,
        label: subcategory.label,
        description: subcategory.subtitle,
      })),
    [selectedSubcategorySource, subcategoryChildSearch],
  );

  const productStoreOptions = React.useMemo(
    () => dshDiscoveryStores
      .filter((store) => getProductsForStore(store.id).length > 0)
      .filter((store) => {
        const query = normalizeSearchText(productStoreSearch);
        if (!query) {
          return true;
        }

        return [store.name, store.subtitle, store.offerLabel ?? ''].join(' ').toLowerCase().includes(query);
      })
      .map((store) => ({
        value: store.id,
        label: store.name,
        description: `${store.subtitle} · ${getProductsForStore(store.id).length} منتج`,
      })),
    [productStoreSearch],
  );

  const selectedProductStoreId = draft.actionExtra || firstProductStoreId;
  const productCategoryOptions = React.useMemo(() => {
    const categories = new Map<string, string>();
    getProductsForStore(selectedProductStoreId).forEach((product) => {
      if (product.categoryId && product.categoryLabel) {
        categories.set(product.categoryId, product.categoryLabel);
      }
    });

    return [
      { value: 'all', label: 'الكل' },
      ...Array.from(categories.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [selectedProductStoreId]);

  const productOptions = React.useMemo(
    () => getProductsForStore(selectedProductStoreId)
      .filter((product) => {
        if (productCategoryFilter !== 'all' && product.categoryId !== productCategoryFilter) {
          return false;
        }

        const query = normalizeSearchText(productSearch);
        if (!query) {
          return true;
        }

        return [product.name, product.subtitle, product.categoryLabel, product.id].join(' ').toLowerCase().includes(query);
      })
      .map((product) => ({
        value: product.id,
        label: product.name,
        description: `${product.categoryLabel} · ${product.priceLabel ?? 'بدون سعر'}`,
      })),
    [productCategoryFilter, productSearch, selectedProductStoreId],
  );

  const offerOptions = React.useMemo(
    () => dshDiscoveryStores
      .filter((store) => Boolean(store.isOffer || store.offerLabel))
      .filter((store) => {
        const query = normalizeSearchText(offerSearch);
        if (!query) {
          return true;
        }

        return [store.name, store.subtitle, store.offerLabel ?? ''].join(' ').toLowerCase().includes(query);
      })
      .map((store) => ({
        value: store.id,
        label: store.name,
        description: `${store.offerLabel ?? 'عرض'} · ${store.subtitle}`,
      })),
    [offerSearch],
  );

  const subscriptionOptions = React.useMemo(
    () => SUBSCRIPTION_OPTIONS
      .filter((option) => {
        const query = normalizeSearchText(subscriptionSearch);
        if (!query) {
          return true;
        }

        return [option.label, option.value].join(' ').toLowerCase().includes(query);
      }),
    [subscriptionSearch],
  );

  const BannerPreview = () => (
    <View style={styles.previewContainer}>
      <View style={StyleSheet.flatten([styles.bannerBase, { backgroundColor: draft.accentColor || '#0A2F5C' }])}>
        {draft.imageUrl || draft.mediaKey ? (
          <Image
            source={resolveDshImageSource(draft.imageUrl || draft.mediaKey)}
            style={styles.bannerImage}
            resizeMode={draft.imageFit}
          />
        ) : (
          <View style={[styles.bannerImage, { backgroundColor: draft.accentColor || '#0A2F5C', justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{ fontSize: 40 }}>{templates.find(t => t.id === draft.templateId)?.icon || '✨'}</Text>
          </View>
        )}
        <View style={[styles.bannerOverlay, { backgroundColor: `${draft.accentColor}44` }]} />

        {/* Content Layout */}
        <View style={StyleSheet.flatten([styles.bannerContent, draft.titlePlacement === 'top' && { justifyContent: 'flex-start' }, draft.titlePlacement === 'center' && { justifyContent: 'center' }])}>
          <Box gap={1}>
            {draft.partnerName ? <Text style={styles.bannerPartner}>{draft.partnerName}</Text> : null}
            <Text style={styles.bannerTitle} numberOfLines={1}>{draft.title || 'عنوان البنر'}</Text>
            <Text style={styles.bannerSubtitle} numberOfLines={2}>{draft.subtitle || 'أضف وصفاً جذاباً هنا'}</Text>
          </Box>

          <View style={StyleSheet.flatten([styles.bannerCta, { backgroundColor: '#fff' }])}>
            <Text style={StyleSheet.flatten([styles.bannerCtaText, { color: draft.accentColor || '#0A2F5C' }])}>{draft.ctaLabel}</Text>
          </View>
        </View>

        {/* Badge */}
        {draft.offerBadgeText ? (
          <View style={StyleSheet.flatten([styles.bannerBadge, { backgroundColor: draft.offerBadgeColor || '#FF500D' }, draft.offerBadgePosition === 'top-left' ? { left: 20, top: 20 } : { right: 20, top: 20 }])}>
            <Text style={styles.bannerBadgeText}>{draft.offerBadgeText}</Text>
          </View>
        ) : null}

        {/* Logo */}
        {draft.partnerLogoUrl ? (
          <View style={StyleSheet.flatten([styles.partnerLogoWrap,
            draft.partnerLogoPosition === 'top-left' && { top: 20, left: 20 },
            draft.partnerLogoPosition === 'top-right' && { top: 20, right: 20 },
            draft.partnerLogoPosition === 'bottom-left' && { bottom: 20, left: 20 },
            draft.partnerLogoPosition === 'bottom-right' && { bottom: 20, right: 20 },
          ])}>
            <Image source={resolveDshImageSource(draft.partnerLogoUrl)} style={styles.partnerLogo} resizeMode="contain" />
          </View>
        ) : null}
      </View>
      <Text role="caption" tone="muted" style={{ marginTop: 12, textAlign: 'center', fontWeight: '800' }}>معاينة حية (نسبة 4:5)</Text>
    </View>
  );

  const EditorSection = () => (
    <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 24, borderLeftWidth: 8, borderLeftColor: draft.accentColor }}>
      <Box gap={6}>
        <View style={styles.editorGrid}>
          <Box gap={5} style={{ flex: 1 }}>
            <Box gap={2}>
               <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>1. القالب الذكي</Text>
               <View style={styles.templateRow}>
                  {templates.map(tpl => (
                    <Pressable
                      key={tpl.id}
                      onPress={() => applyTemplate(tpl)}
                      style={[styles.templateBtn, draft.templateId === tpl.id && { borderColor: tpl.accent, backgroundColor: `${tpl.accent}11` }]}
                    >
                      <Text style={{ fontSize: 20 }}>{tpl.icon}</Text>
                      <Text style={[styles.templateBtnText, draft.templateId === tpl.id && { color: tpl.accent }]}>{tpl.label}</Text>
                    </Pressable>
                  ))}
               </View>
            </Box>

            <Box gap={4}>
               <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>2. المحتوى والنصوص</Text>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                 <TextField label="العنوان الرئيسي" value={draft.title} onChangeText={(v) => setDraft(c => ({ ...c, title: v }))} />
                 <TextField label="اسم العلامة التجارية" value={draft.partnerName} onChangeText={(v) => setDraft(c => ({ ...c, partnerName: v }))} />
               </div>
               <TextField label="الوصف الترويجي" value={draft.subtitle} onChangeText={(v) => setDraft(c => ({ ...c, subtitle: v }))} multiline numberOfLines={2} />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                 <TextField label="نص زر الإجراء" value={draft.ctaLabel} onChangeText={(v) => setDraft(c => ({ ...c, ctaLabel: v }))} />
                 <TextField label="لون الهوية السداسي" value={draft.accentColor} onChangeText={(v) => setDraft(c => ({ ...c, accentColor: v }))} />
                 <TextField label="ترتيب الظهور" value={draft.position} onChangeText={(v) => setDraft(c => ({ ...c, position: v }))} />
               </div>
            </Box>
          </Box>

          <Box gap={4} style={{ width: 340 }}>
            <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>معاينة التصميم</Text>
            <BannerPreview />
            <Box gap={2} style={{ padding: 16, backgroundColor: '#F1F5F9', borderRadius: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '900' }}>مؤشر جودة المحتوى</Text>
                <Text role="caption" style={{ fontWeight: '900', color: quality > 70 ? '#16A34A' : '#F97316' }}>{quality}%</Text>
              </View>
              <View style={styles.qualityTrack}><View style={StyleSheet.flatten([styles.qualityFill, { width: `${quality}%`, backgroundColor: quality > 70 ? '#16A34A' : '#F97316' }])} /></View>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>يتم احتساب الجودة بناءً على طول النصوص، وجود الوسائط، ووضوح الإجراء.</Text>
            </Box>
          </Box>
        </View>

        <View style={styles.divider} />

        <Box gap={4}>
          <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>3. الوسائط المتقدمة</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <TextField label="رابط صورة الخلفية (أو اترك فارغاً للقالب)" value={draft.imageUrl} onChangeText={(v) => setDraft(c => ({ ...c, imageUrl: v }))} />
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>احتواء الصورة</label>
              <Tabs<any> items={[{ value: 'cover', label: 'كامل' }, { value: 'contain', label: 'مناسب' }]} value={draft.imageFit} onValueChange={(v) => setDraft(c => ({ ...c, imageFit: v }))} variant="pill" />
            </Box>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="رابط شعار الشريك" value={draft.partnerLogoUrl} onChangeText={(v) => setDraft(c => ({ ...c, partnerLogoUrl: v }))} />
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>موقع الشعار</label>
              <Tabs<any>
                items={[
                  { value: 'top-left', label: 'أعلى يسار' },
                  { value: 'top-right', label: 'أعلى يمين' },
                  { value: 'bottom-left', label: 'أسفل يسار' },
                  { value: 'bottom-right', label: 'أسفل يمين' },
                ]}
                value={draft.partnerLogoPosition}
                onValueChange={(v) => setDraft(c => ({ ...c, partnerLogoPosition: v }))}
                variant="pill"
              />
            </Box>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="نص الشارة العلوية" value={draft.offerBadgeText} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeText: v }))} />
            <TextField label="لون الشارة" value={draft.offerBadgeColor} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeColor: v }))} />
          </div>
        </Box>

        <View style={styles.divider} />

        <Box gap={4}>
          <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>4. توجيه الجمهور والربط الذكي</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نطاق العرض</label>
              <Tabs<MarketingBannerAudience>
                items={[{ value: 'all', label: 'الجميع' }, { value: 'home', label: 'الرئيسية' }, { value: 'stores', label: 'المتاجر' }]}
                value={draft.audience}
                onValueChange={(v) => setDraft((current) => ({ ...current, audience: v }))}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نوع الوجهة الذكي</label>
              <SelectField<SmartBannerTargetType>
                options={targetTypeOptions}
                value={draft.targetType}
                onValueChange={handleSmartTargetTypeChange}
              />
            </Box>
          </div>

          <View style={styles.smartTargetPanel}>
            {draft.targetType === 'store' && (
              <Box gap={2}>
                <SearchField label="ابحث في المتاجر" value={storeSearch} onChangeText={setStoreSearch} />
                <Box gap={1}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>فلترة الحالة</label>
                  <Tabs<SmartTargetStoreFilter>
                    items={[
                      { value: 'all', label: 'الكل' },
                      { value: 'offers', label: 'العروض' },
                      { value: 'favorites', label: 'المفضلة' },
                      { value: 'available', label: 'المفتوحة' },
                    ]}
                    value={storeFilter}
                    onValueChange={(v) => setStoreFilter(v)}
                    variant="pill"
                  />
                </Box>
                <SelectField
                  label="اختر المتجر"
                  placeholder="اختر متجرًا"
                  value={draft.actionTarget}
                  options={storeOptions}
                  onValueChange={(v) => setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))}
                />
              </Box>
            )}

            {draft.targetType === 'offer' && (
              <Box gap={2}>
                <SearchField label="ابحث في العروض" value={offerSearch} onChangeText={setOfferSearch} />
                <SelectField
                  label="اختر متجر العرض"
                  placeholder="اختر متجرًا يملك عرضًا"
                  value={draft.actionExtra || (draft.actionTarget === 'offers' ? '' : draft.actionTarget)}
                  options={offerOptions}
                  onValueChange={(v) => setDraft((current) => ({ ...current, actionType: 'external', actionTarget: 'offers', actionExtra: v }))}
                />
              </Box>
            )}

            {draft.targetType === 'category' && (
              <Box gap={2}>
                <SearchField label="ابحث في الفئات" value={categorySearch} onChangeText={setCategorySearch} />
                <SelectField
                  label="اختر الفئة"
                  placeholder="اختر فئة رئيسية"
                  value={draft.actionTarget}
                  options={categoryOptions}
                  onValueChange={(v) => setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))}
                />
              </Box>
            )}

            {draft.targetType === 'subcategory' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Box gap={2}>
                  <SearchField label="ابحث في الفئات الأم" value={subcategoryParentSearch} onChangeText={setSubcategoryParentSearch} />
                  <SelectField
                    label="الفئة الأم"
                    placeholder="اختر فئة"
                    value={draft.actionTarget}
                    options={parentCategoryOptions}
                    onValueChange={(v) => setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))}
                  />
                </Box>
                <Box gap={2}>
                  <SearchField label="ابحث في الفئات الفرعية" value={subcategoryChildSearch} onChangeText={setSubcategoryChildSearch} />
                  <SelectField
                    label="الفئة الفرعية"
                    placeholder={draft.actionTarget ? 'اختر فئة فرعية' : 'اختر فئة أولاً'}
                    value={draft.actionExtra}
                    options={subcategoryOptions.length ? subcategoryOptions : [{ value: '', label: 'اختر فئة أولاً', description: 'لا توجد فئات فرعية متاحة الآن' }]}
                    onValueChange={(v) => setDraft((current) => ({ ...current, actionExtra: v }))}
                  />
                </Box>
              </div>
            )}

            {draft.targetType === 'product' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Box gap={2}>
                  <SearchField label="ابحث في المتاجر" value={productStoreSearch} onChangeText={setProductStoreSearch} />
                <SelectField
                  label="المتجر"
                  placeholder="اختر متجرًا"
                  value={draft.actionExtra}
                  options={productStoreOptions}
                  onValueChange={(v) => {
                    setProductCategoryFilter('all');
                    setDraft((current) => ({ ...current, actionExtra: v, actionTarget: '' }));
                  }}
                />
                </Box>
                <Box gap={2}>
                  <SearchField label="ابحث في المنتجات" value={productSearch} onChangeText={setProductSearch} />
                  <Box gap={1}>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>فلترة الفئة</label>
                    <Tabs<string>
                      items={productCategoryOptions}
                      value={productCategoryFilter}
                      onValueChange={(v) => setProductCategoryFilter(v)}
                      variant="pill"
                    />
                  </Box>
                  <SelectField
                    label="المنتج"
                    placeholder={draft.actionExtra ? 'اختر منتجًا' : 'اختر متجراً أولاً'}
                    value={draft.actionTarget}
                    options={productOptions.length ? productOptions : [{ value: '', label: 'اختر متجراً أولاً', description: 'تظهر المنتجات بعد اختيار المتجر' }]}
                    onValueChange={(v) => setDraft((current) => ({ ...current, actionTarget: v }))}
                  />
                </Box>
              </div>
            )}

            {draft.targetType === 'subscription' && (
              <Box gap={2}>
                <SearchField label="ابحث في الاشتراكات" value={subscriptionSearch} onChangeText={setSubscriptionSearch} />
                <SelectField
                  label="مسار الاشتراك"
                  placeholder="اختر مسار الاشتراك"
                  value={draft.actionTarget}
                  options={subscriptionOptions}
                  onValueChange={(v) => setDraft((current) => ({ ...current, actionTarget: v }))}
                />
              </Box>
            )}

            {draft.targetType === 'campaign' && (
              <TextField
                label="مسار الحملة"
                value={draft.actionTarget}
                onChangeText={(value) => setDraft((current) => ({ ...current, actionTarget: value }))}
              />
            )}

            {draft.targetType === 'custom' && (
              <TextField
                label="المسار المخصص"
                value={draft.actionTarget}
                onChangeText={(value) => setDraft((current) => ({ ...current, actionTarget: value }))}
              />
            )}

            {(draft.targetType === 'home' || draft.targetType === 'stores' || draft.targetType === 'tracking' || draft.targetType === 'orders' || draft.targetType === 'loyalty') ? (
              <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>
                هذا النوع محدد مسبقًا ولا يحتاج حقول ربط إضافية.
              </Text>
            ) : null}

            <View style={styles.smartSummaryCard}>
              <Text role="caption" style={{ fontWeight: '900', color: '#1E40AF' }}>ملخص الربط النهائي</Text>
              <Text role="caption" style={{ color: '#1E40AF', marginTop: 4 }}>الوجهة: {smartTargetSummary.label}</Text>
              <Text role="caption" style={{ color: '#1E40AF', marginTop: 4 }}>المعرف: {smartTargetSummary.targetId}</Text>
              <Text role="caption" style={{ color: '#1E40AF', marginTop: 4 }}>الاسم: {smartTargetSummary.targetLabel}</Text>
              <Text role="caption" tone="muted" style={{ fontSize: 10, marginTop: 4 }}>المسار النهائي: {smartTargetSummary.finalRoute}</Text>
            </View>
          </View>
        </Box>

        <View style={styles.divider} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20 }}>
          <Box gap={1}>
            <Text role="bodySm" style={{ fontWeight: '900' }}>حالة النشر الحالية</Text>
            <Tabs<MarketingBannerStatus>
              items={[{ value: 'draft', label: 'مسودة (داخلي)' }, { value: 'published', label: 'منشور (عام)' }]}
              value={draft.status}
              onValueChange={(v) => setDraft(c => ({ ...c, status: v }))}
              variant="pill"
            />
          </Box>
          <div style={{ display: 'flex', gap: 12 }}>
             <Button label="جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} />
             <Button label="تكرار" tone="secondary" fullWidth={false} disabled={!selected} onPress={() => selected && handleDuplicate(selected)} />
             <Button label={selected?.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" fullWidth={false} disabled={!selected} onPress={() => selected && handleToggle(selected)} />
             <Button label="حذف" tone="ghost" fullWidth={false} disabled={!selected} onPress={() => selected && handleDelete(selected)} style={{ color: '#DC2626' }} />
             <Button label="حفظ" fullWidth={false} onPress={handleSave} style={{ backgroundColor: '#0A2F5C', paddingHorizontal: 32 }} />
          </div>
        </div>
      </Box>
    </Surface>
  );

  return (
    <Box gap={6}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 24, backgroundColor: '#fff', elevation: 2 }}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" style={{ color: colorPalette.brand, fontWeight: '900', letterSpacing: 1 }}>إدارة التسويق الذكية</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: '#0A2F5C', fontSize: 32 }}>استوديو البنرات <Text style={{ color: colorPalette.brand }}>٢٠٢٧</Text></Text>
          </Box>
          <Button label="بنر جديد +" tone="primary" fullWidth={false} onPress={handleCreateNew} style={{ backgroundColor: colorPalette.brandStrong, borderRadius: 16, height: 48 }} />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total, color: '#1E40AF', bg: '#EFF6FF', icon: '📁' },
            { label: 'البنرات النشطة', value: kpis.live, color: '#166534', bg: '#F0FDF4', icon: '📡' },
            { label: 'مشاهدات اليوم', value: kpis.impressions, color: '#5B21B6', bg: '#F5F3FF', icon: '👁️' },
            { label: 'نسبة التفاعل', value: `${((kpis.clicks / (kpis.impressions || 1)) * 100).toFixed(1)}%`, color: '#991B1B', bg: '#FEF2F2', icon: '📈' },
          ].map(k => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '800', color: '#64748B' }}>{k.label}</Text>
                <Text>{k.icon}</Text>
              </View>
              <Text role="titleLg" style={{ color: k.color, fontWeight: '900', marginTop: 8 }}>{k.value}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.studioBody}>
        <View style={styles.sidebar}>
          <Surface tone="raised" gap={4} style={{ borderRadius: 28, padding: 16, backgroundColor: '#fff' }}>
            <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C', paddingHorizontal: 8 }}>جميع الحملات</Text>
            <Box gap={3}>
              {items.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={StyleSheet.flatten([styles.listCard, selectedId === item.id && styles.listCardSelected])}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.statusDot, { backgroundColor: item.status === 'published' ? '#16A34A' : '#94A3B8' }]} />
                    <Box gap={0} style={{ flex: 1 }}>
                      <Text role="bodySm" style={{ fontWeight: '900', color: selectedId === item.id ? colorPalette.brandStrong : '#1E293B' }} numberOfLines={1}>{item.title}</Text>
                      <Text role="caption" tone="muted">{bannerActionTypeLabel(item)}</Text>
                    </Box>
                  </View>
                </Pressable>
              ))}
            </Box>
          </Surface>
        </View>

        <View style={styles.mainEditor}>
          <EditorSection />
        </View>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  kpiCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  studioBody: {
    flexDirection: 'row',
    gap: 20,
  },
  sidebar: {
    width: 300,
  },
  mainEditor: {
    flex: 1,
  },
  listCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  listCardSelected: {
    borderColor: colorPalette.brand,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: colorPalette.brand,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  editorGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  templateRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  templateBtn: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  templateBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
  },
  previewContainer: {
    width: 320,
    alignSelf: 'center',
  },
  bannerBase: {
    width: 320,
    height: 400,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  bannerPartner: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  bannerCta: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    elevation: 4,
  },
  bannerCtaText: {
    fontSize: 11,
    fontWeight: '900',
  },
  smartTargetPanel: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smartSummaryCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  bannerBadge: {
    position: 'absolute',
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 5,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  partnerLogoWrap: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    padding: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  partnerLogo: {
    width: '100%',
    height: '100%',
  },
  qualityTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  qualityFill: {
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
});

export default BannersCommandDeckScreen;
