"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { Box, Button, SearchField, SelectField, Surface, Tabs, Text, TextField, useDirection, colorPalette } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
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
  type MarketingBannerMotionStyle,
  type MarketingBannerRecord,
  type MarketingBannerStatus,
} from '../../shared/banner.preview-store';
import { dshCategoryFixtures } from '../../app-client/data/categories.preview-data';
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
  offerBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  partnerLogoUrl: string;
  partnerLogoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayImageUrl: string;
  overlayPosition: 'center' | 'bottom' | 'top' | 'fill';
  titlePlacement: 'top' | 'center' | 'bottom';
  imageFit: 'cover' | 'contain';
  targetType: SmartBannerTargetType;
  motionStyle: MarketingBannerMotionStyle;
  autoplayEnabled: boolean;
  autoplayIntervalMs: string;
  pauseOnInteraction: boolean;
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
type EditorWorkspaceTab = 'content' | 'media' | 'target';
type BannerImageFit = BannerDraft['imageFit'];
type BannerLogoPosition = BannerDraft['partnerLogoPosition'];

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

const SUBSCRIPTION_OPTIONS: Array<{ value: string; label: string }> = [
  // { value: 'entitlements-get', label: 'المزايا الأساسية' },
  // { value: 'subscription-family-get', label: 'اشتراك العائلة' },
];

const BANNER_MOTION_OPTIONS: Array<{ value: MarketingBannerMotionStyle; label: string; description: string }> = [
  { value: 'slide', label: 'انسياب', description: 'انتقال نظيف وهادئ بين الشرائح.' },
  { value: 'soft-parallax', label: 'بارالاكس ناعم', description: 'عمق بصري خفيف للصورة أثناء التركيز.' },
  { value: 'subtle-fade', label: 'تلاشي خفيف', description: 'يبرز البطاقة الفعالة بهدوء بصري.' },
  { value: 'snap-focus', label: 'تركيز سناب', description: 'تكبير وتركيز بسيط على الشريحة الفعالة.' },
];

const IMAGE_FIT_TAB_ITEMS: Array<{ value: BannerImageFit; label: string }> = [
  { value: 'cover', label: 'كامل' },
  { value: 'contain', label: 'مناسب' },
];

const LOGO_POSITION_TAB_ITEMS: Array<{ value: BannerLogoPosition; label: string }> = [
  { value: 'top-left', label: 'أعلى يسار' },
  { value: 'top-right', label: 'أعلى يمين' },
  { value: 'bottom-left', label: 'أسفل يسار' },
  { value: 'bottom-right', label: 'أسفل يمين' },
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
    offerBadgePosition: item?.offerBadgePosition ?? 'top-right',
    partnerLogoUrl: item?.partnerLogoUrl ?? '',
    partnerLogoPosition: item?.partnerLogoPosition ?? 'top-left',
    overlayImageUrl: item?.overlayImageUrl ?? '',
    overlayPosition: item?.overlayPosition ?? 'center',
    titlePlacement: item?.titlePlacement ?? 'bottom',
    imageFit: item?.imageFit ?? 'cover',
    targetType,
    motionStyle: item?.motionStyle ?? 'slide',
    autoplayEnabled: item?.autoplayEnabled ?? true,
    autoplayIntervalMs: String(item?.autoplayIntervalMs ?? 4500),
    pauseOnInteraction: item?.pauseOnInteraction ?? true,
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
  const [bannersPage, setBannersPage] = React.useState(1);
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
  const [activeEditorTab, setActiveEditorTab] = React.useState<EditorWorkspaceTab>('content');

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
  const totalPages = Math.max(1, Math.ceil(items.length / 5));
  const visibleItems = React.useMemo(() => {
    const startIndex = (bannersPage - 1) * 5;
    return items.slice(startIndex, startIndex + 5);
  }, [bannersPage, items]);

  React.useEffect(() => {
    setBannersPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    if (!selectedId) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.id === selectedId);
    if (selectedIndex < 0) {
      return;
    }

    setBannersPage(Math.floor(selectedIndex / 5) + 1);
  }, [items, selectedId]);

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
      autoplayIntervalMs: Math.max(2500, Number.parseInt(draft.autoplayIntervalMs, 10) || 4500),
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
    { id: 'restaurant', label: 'مطعم', accent: '#E11D48', badge: 'خصم 20%', cta: 'اطلب الآن', icon: '' },
    { id: 'fashion', label: 'متجر أزياء', accent: '#2563EB', badge: 'وصل حديثاً', cta: 'تسوق الآن', icon: '' },
    { id: 'tech', label: 'إلكترونيات', accent: '#0F172A', badge: 'الأكثر مبيعاً', cta: 'اشترِ الآن', icon: '' },
    { id: 'pro', label: 'اشتراك برو', accent: '#7C3AED', badge: 'شهر مجاني', cta: 'اشترك الآن', icon: '' },
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
      motionStyle: tpl.id === 'pro' ? 'subtle-fade' : tpl.id === 'tech' ? 'snap-focus' : 'slide',
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

  const previewMotionLabel = React.useMemo(
    () => BANNER_MOTION_OPTIONS.find((option) => option.value === draft.motionStyle)?.label ?? 'انسياب',
    [draft.motionStyle],
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
             <Text style={{ fontSize: 40 }}>{templates.find(t => t.id === draft.templateId)?.label.slice(0, 1) || 'ب'}</Text>
          </View>
        )}
        <View
          style={[
            styles.bannerOverlay,
            {
              backgroundColor:
                draft.motionStyle === 'subtle-fade'
                  ? 'rgba(10, 47, 92, 0.28)'
                  : draft.motionStyle === 'soft-parallax'
                    ? 'rgba(10, 47, 92, 0.22)'
                    : `${draft.accentColor}44`,
            },
          ]}
        />
        <View style={styles.bannerShadeTop} />
        <View style={styles.bannerShadeBottom} />

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
      <View style={styles.previewMetaRow}>
        <View style={styles.previewMetaPill}>
          <Text role="caption" style={styles.previewMetaText}>{previewMotionLabel}</Text>
        </View>
        <View style={styles.previewMetaPill}>
          <Text role="caption" style={styles.previewMetaText}>{draft.autoplayEnabled ? `تشغيل تلقائي ${draft.autoplayIntervalMs}ms` : 'تشغيل يدوي'}</Text>
        </View>
      </View>
      <Text role="caption" tone="muted" style={{ marginTop: 10, textAlign: 'center', fontWeight: '800' }}>معاينة حية مضغوطة</Text>
    </View>
  );

  const EditorSection = () => (
    <Box gap={4}>
      <Box gap={2}>
        <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>القالب الذكي</Text>
        <View style={styles.templateRow}>
          {templates.map(tpl => (
            <Pressable
              key={tpl.id}
              onPress={() => applyTemplate(tpl)}
              style={[styles.templateBtn, draft.templateId === tpl.id && { borderColor: tpl.accent, backgroundColor: `${tpl.accent}11` }]}
            >
              <Text style={{ fontSize: 18 }}>{tpl.icon}</Text>
              <Text style={[styles.templateBtnText, draft.templateId === tpl.id && { color: tpl.accent }]}>{tpl.label}</Text>
            </Pressable>
          ))}
        </View>
      </Box>

      <Box gap={2}>
        <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>لوحة التحرير</Text>
        <Tabs<EditorWorkspaceTab>
          items={[
            { value: 'content', label: 'المحتوى' },
            { value: 'media', label: 'الوسائط' },
            { value: 'target', label: 'الربط' },
          ]}
          value={activeEditorTab}
          onValueChange={setActiveEditorTab}
          variant="pill"
        />
      </Box>

      {activeEditorTab === 'content' ? (
        <View style={styles.editorCard}>
          <Box gap={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField label="العنوان الرئيسي" value={draft.title} onChangeText={(v) => setDraft(c => ({ ...c, title: v }))} />
              <TextField label="اسم العلامة" value={draft.partnerName} onChangeText={(v) => setDraft(c => ({ ...c, partnerName: v }))} />
            </div>
            <TextField label="الوصف الترويجي" value={draft.subtitle} onChangeText={(v) => setDraft(c => ({ ...c, subtitle: v }))} multiline numberOfLines={2} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <TextField label="نص الزر" value={draft.ctaLabel} onChangeText={(v) => setDraft(c => ({ ...c, ctaLabel: v }))} />
              <TextField label="لون الهوية" value={draft.accentColor} onChangeText={(v) => setDraft(c => ({ ...c, accentColor: v }))} />
              <TextField label="ترتيب الظهور" value={draft.position} onChangeText={(v) => setDraft(c => ({ ...c, position: v }))} />
            </div>
          </Box>
        </View>
      ) : null}

      {activeEditorTab === 'media' ? (
        <View style={styles.editorCard}>
          <Box gap={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
              <TextField label="صورة الخلفية" value={draft.imageUrl} onChangeText={(v) => setDraft(c => ({ ...c, imageUrl: v }))} />
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>احتواء الصورة</label>
                <Tabs<BannerImageFit> items={IMAGE_FIT_TAB_ITEMS} value={draft.imageFit} onValueChange={(v) => setDraft(c => ({ ...c, imageFit: v }))} variant="pill" />
              </Box>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField label="رابط الشعار" value={draft.partnerLogoUrl} onChangeText={(v) => setDraft(c => ({ ...c, partnerLogoUrl: v }))} />
              <TextField label="نص الشارة" value={draft.offerBadgeText} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeText: v }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>موقع الشعار</label>
                <Tabs<BannerLogoPosition>
                  items={LOGO_POSITION_TAB_ITEMS}
                  value={draft.partnerLogoPosition}
                  onValueChange={(v) => setDraft(c => ({ ...c, partnerLogoPosition: v }))}
                  variant="pill"
                />
              </Box>
              <TextField label="لون الشارة" value={draft.offerBadgeColor} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeColor: v }))} />
            </div>
          </Box>
        </View>
      ) : null}

      {activeEditorTab === 'target' ? (
        <View style={styles.editorCard}>
          <Box gap={4}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
        </View>
      ) : null}

      <View style={styles.actionBar}>
        <Box gap={1} style={{ flex: 1 }}>
          <Text role="bodySm" style={{ fontWeight: '900' }}>حالة النشر</Text>
          <Tabs<MarketingBannerStatus>
            items={[{ value: 'draft', label: 'مسودة' }, { value: 'published', label: 'منشور' }]}
            value={draft.status}
            onValueChange={(v) => setDraft(c => ({ ...c, status: v }))}
            variant="pill"
          />
        </Box>
        <View style={styles.actionButtonsRow}>
          <Button label="جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} />
          <Button label="تكرار" tone="secondary" fullWidth={false} disabled={!selected} onPress={() => selected && handleDuplicate(selected)} />
          <Button label={selected?.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" fullWidth={false} disabled={!selected} onPress={() => selected && handleToggle(selected)} />
          <Button label="حذف" tone="ghost" fullWidth={false} disabled={!selected} onPress={() => selected && handleDelete(selected)} style={{ color: '#DC2626' }} />
          <Button label="حفظ" fullWidth={false} onPress={handleSave} style={{ backgroundColor: '#0A2F5C', paddingHorizontal: 24 }} />
        </View>
      </View>
    </Box>
  );

  return (
    <Box gap={3} style={styles.workspaceRoot}>
      <Surface tone="raised" gap={3} style={styles.headerPanel}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" style={{ color: colorPalette.brand, fontWeight: '900', letterSpacing: 0.5 }}>لوحة إدارة المحتوى الإعلاني</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: '#0A2F5C', fontSize: 24 }}>استوديو البنرات</Text>
          </Box>
          <Button label="إضافة بنر جديد" tone="primary" fullWidth={false} onPress={handleCreateNew} style={{ backgroundColor: colorPalette.brandStrong, borderRadius: 10, height: 38 }} />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total, color: '#0A2F5C', bg: '#fff' },
            { label: 'البنرات النشطة', value: kpis.live, color: '#16A34A', bg: '#fff' },
            { label: 'مشاهدات اليوم', value: kpis.impressions, color: '#0A2F5C', bg: '#fff' },
            { label: 'نسبة التفاعل', value: `${((kpis.clicks / (kpis.impressions || 1)) * 100).toFixed(1)}%`, color: '#FF500D', bg: '#fff' },
          ].map(k => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <Text role="caption" style={{ fontWeight: '800', color: '#64748B' }}>{k.label}</Text>
              <Text role="titleSm" style={{ color: k.color, fontWeight: '900', marginTop: 4, fontSize: 18 }}>{k.value}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.studioBody}>
        <Surface tone="raised" gap={3} style={styles.previewColumn}>
          <Box gap={3} style={styles.columnBody}>
            <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>المعاينة والحركة</Text>
            <BannerPreview />
            <Box gap={2} style={styles.qualityPanel}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '900' }}>جودة المحتوى</Text>
                <Text role="caption" style={{ fontWeight: '900', color: quality > 70 ? '#16A34A' : '#F97316' }}>{quality}%</Text>
              </View>
              <View style={styles.qualityTrack}><View style={StyleSheet.flatten([styles.qualityFill, { width: `${quality}%`, backgroundColor: quality > 70 ? '#16A34A' : '#F97316' }])} /></View>
            </Box>
            <View style={styles.motionPanel}>
              <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C' }}>حركة البنر</Text>
              <SelectField<MarketingBannerMotionStyle>
                label="نمط الحركة"
                value={draft.motionStyle}
                options={BANNER_MOTION_OPTIONS}
                onValueChange={(value) => setDraft((current) => ({ ...current, motionStyle: value }))}
              />
              <View style={styles.motionInlineGrid}>
                <Box gap={1}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>التشغيل التلقائي</label>
                  <Tabs<boolean>
                    items={[{ value: true, label: 'مفعل' }, { value: false, label: 'متوقف' }]}
                    value={draft.autoplayEnabled}
                    onValueChange={(value) => setDraft((current) => ({ ...current, autoplayEnabled: value }))}
                    variant="pill"
                  />
                </Box>
                <TextField
                  label="الفاصل الزمني"
                  value={draft.autoplayIntervalMs}
                  onChangeText={(value) => setDraft((current) => ({ ...current, autoplayIntervalMs: value.replace(/[^0-9]/g, '') }))}
                />
              </View>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>الإيقاف عند التفاعل</label>
                <Tabs<boolean>
                  items={[{ value: true, label: 'نعم' }, { value: false, label: 'لا' }]}
                  value={draft.pauseOnInteraction}
                  onValueChange={(value) => setDraft((current) => ({ ...current, pauseOnInteraction: value }))}
                  variant="pill"
                />
              </Box>
            </View>
          </Box>
        </Surface>

        <Surface tone="raised" gap={3} style={styles.editorColumn}>
          <Box gap={3} style={styles.columnBody}>
            <EditorSection />
          </Box>
        </Surface>

        <Surface tone="raised" gap={3} style={styles.sidebarColumn}>
          <Text role="titleSm" style={{ fontWeight: '900', color: '#0A2F5C', paddingHorizontal: 4 }}>جميع الحملات</Text>
          <Box gap={3} style={styles.sidebarBody}>
            {visibleItems.map(item => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                style={StyleSheet.flatten([styles.listCard, selectedId === item.id && styles.listCardSelected])}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.statusDot, { backgroundColor: item.status === 'published' ? '#16A34A' : '#94A3B8' }]} />
                  <Box gap={0} style={{ flex: 1 }}>
                    <Text role="bodySm" style={{ fontWeight: '900', color: selectedId === item.id ? colorPalette.brandStrong : '#1E293B' }} numberOfLines={1}>{item.title}</Text>
                    <Text role="caption" tone="muted">{bannerActionTypeLabel(item)}</Text>
                  </Box>
                </View>
              </Pressable>
            ))}
            <WebControlPanelCompactPager
              page={bannersPage}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${items.length} بنرات`}
              onPrevious={bannersPage > 1 ? () => setBannersPage((currentPage) => currentPage - 1) : undefined}
              onNext={bannersPage < totalPages ? () => setBannersPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  workspaceRoot: {
    height: 'calc(100vh - 168px)',
    maxHeight: 'calc(100vh - 168px)',
    overflow: 'hidden',
  },
  headerPanel: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  studioBody: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    minHeight: 0,
  },
  previewColumn: {
    width: 328,
    borderRadius: 24,
    padding: 14,
    backgroundColor: '#fff',
    minHeight: 0,
  },
  editorColumn: {
    flex: 1,
    borderRadius: 24,
    padding: 14,
    backgroundColor: '#fff',
    minHeight: 0,
  },
  sidebarColumn: {
    width: 248,
    borderRadius: 24,
    padding: 14,
    backgroundColor: '#fff',
    minHeight: 0,
  },
  columnBody: {
    flex: 1,
    minHeight: 0,
    gap: 12,
    paddingBottom: 4,
  },
  sidebarBody: {
    flex: 1,
    minHeight: 0,
    gap: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  listCard: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
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
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  templateRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  templateBtn: {
    flex: 1,
    minWidth: 82,
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
  },
  templateBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
  },
  editorCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    padding: 14,
  },
  previewContainer: {
    width: 288,
    alignSelf: 'center',
  },
  bannerBase: {
    width: 288,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  bannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerShadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerShadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: 'rgba(3,12,24,0.34)',
  },
  bannerContent: {
    flex: 1,
    padding: 18,
    justifyContent: 'flex-end',
  },
  bannerPartner: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  bannerCta: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
    elevation: 4,
  },
  bannerCtaText: {
    fontSize: 11,
    fontWeight: '900',
  },
  previewMetaRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  previewMetaPill: {
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewMetaText: {
    color: '#0A2F5C',
    fontWeight: '800',
  },
  motionPanel: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  motionInlineGrid: {
    gap: 10,
  },
  smartTargetPanel: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smartSummaryCard: {
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
    borderRadius: 999,
    elevation: 5,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  partnerLogoWrap: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: '#fff',
    padding: 5,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  partnerLogo: {
    width: '100%',
    height: '100%',
  },
  qualityPanel: {
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
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
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
});

export default BannersCommandDeckScreen;
