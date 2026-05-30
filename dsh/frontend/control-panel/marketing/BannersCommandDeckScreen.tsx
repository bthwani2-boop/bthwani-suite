"use client";

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pressable, StyleSheet, View, Image, type ImageStyle, type ViewStyle } from 'react-native';
import { Box, Button, SearchField, SelectField, Surface, Tabs, Text, TextField, useDirection, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  computeMarketingBannerQuality,
  duplicateMarketingBannerItem,
  getMarketingBannerItems,
  getMarketingBannerSummaries,
  getMarketingBannerDetail,
  type MarketingBannerSummary,
  getMarketingBannerKpis,
  removeMarketingBannerItem,
  toggleMarketingBannerStatus,
  upsertMarketingBannerItem,
  type MarketingBannerActionType,
  type MarketingBannerAudience,
  type MarketingBannerMotionStyle,
  type MarketingBannerRecord,
  type MarketingBannerStatus,
} from '../../data/marketing.preview-data';
import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { dshDiscoveryStores } from '../../data/stores.preview-data';
import { storeItemsByStoreId } from '../../data/stores.preview-data';
import { resolveDshImageSource } from '../../app-client/shared/resolve-image-source';
import { resolvePreviewColor } from '../../shared/dsh-preview-color';
import { useMarketingPermissions } from './marketing-permissions.contract';

/**
 * Validation Rules:
 * - required fields: title, imageUrl or mediaKey, actionTarget (if type is not subscription)
 * - format rules: actionType must match the target logic (store, product, category, etc.)
 * - range: position (>=1), autoplayIntervalMs (>=2500)
 * - duplicate / conflict: Cannot activate a banner if another active banner occupies the same position.
 * - disabled reason: Missing 'marketing.edit' or 'marketing.publish'.
 * - error: Alerts "عنوان البنر مطلوب", "وجهة الحدث مطلوبة", "يوجد بنر مفعل آخر في الموضع"
 * - success: Updates the live visual grid and switches active editor state.
 *
 * Conflict Resolution:
 * - detect: duplicate product/category targets or position conflicts via array `some` checks
 * - display: top-level error strings before saving
 * - owner: control-panel-marketing
 * - resolution action: Rejects publish action and blocks UI commit
 * - audit/API-later: Relies on runtime position uniqueness constraints in the database
 *
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 */

export type BannersCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  activeSubTab?: string;
};

type BannerDraft = Record<'title' | 'subtitle' | 'mediaKey' | 'accentColor' | 'actionTarget' | 'actionExtra' | 'ctaLabel' | 'partnerName' | 'imageUrl' | 'position' | 'templateId' | 'offerBadgeText' | 'offerBadgeColor' | 'partnerLogoUrl' | 'overlayImageUrl', string> & {
  id?: string;
  audience: MarketingBannerAudience;
  status: MarketingBannerStatus;
  actionType: MarketingBannerActionType;
  offerBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  partnerLogoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
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

function createDraft(
  item: MarketingBannerRecord | null | undefined,
  defaults: { accentColor: string; offerBadgeColor: string },
): BannerDraft {
  const targetType = deriveSmartTargetType(item);
  const id = item?.id;
  const title = item?.title ?? '';
  const subtitle = item?.subtitle ?? '';
  const mediaKey = item?.mediaKey ?? '';
  const accentColor = item?.accentColor ?? defaults.accentColor;
  const audience = item?.audience ?? 'all';
  const status = item?.status ?? 'draft';
  const actionType = item?.actionType ?? 'store';
  const actionTarget = item?.actionTarget ?? 'store-1001';
  const actionExtra = item?.actionExtra ?? '';
  const ctaLabel = item?.ctaLabel ?? 'اكتشف الآن';
  const partnerName = item?.partnerName ?? '';
  const imageUrl = item?.imageUrl ?? '';
  const position = String(item?.position ?? '');
  const templateId = item?.templateId ?? 'default';
  const offerBadgeText = item?.offerBadgeText ?? '';
  const offerBadgeColor = item?.offerBadgeColor ?? defaults.offerBadgeColor;
  const offerBadgePosition = item?.offerBadgePosition ?? 'top-right';
  const partnerLogoUrl = item?.partnerLogoUrl ?? '';
  const partnerLogoPosition = item?.partnerLogoPosition ?? 'top-left';
  const overlayImageUrl = item?.overlayImageUrl ?? '';
  const overlayPosition = item?.overlayPosition ?? 'center';
  const titlePlacement = item?.titlePlacement ?? 'bottom';
  const imageFit = item?.imageFit ?? 'cover';
  const motionStyle = item?.motionStyle ?? 'slide';
  const autoplayEnabled = item?.autoplayEnabled ?? true;
  const autoplayIntervalMs = String(item?.autoplayIntervalMs ?? 4500);
  const pauseOnInteraction = item?.pauseOnInteraction ?? true;

  return {
    id, title, subtitle, mediaKey, accentColor, audience, status, actionType, actionTarget, actionExtra, ctaLabel, partnerName, imageUrl, position, templateId, offerBadgeText, offerBadgeColor, offerBadgePosition, partnerLogoUrl, partnerLogoPosition, overlayImageUrl, overlayPosition, titlePlacement, imageFit, targetType, motionStyle, autoplayEnabled, autoplayIntervalMs, pauseOnInteraction,
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

export function BannersCommandDeckScreen({ hubHref, operationsHref }: BannersCommandDeckScreenProps) {
  const { hasPermission } = useMarketingPermissions();
  const { direction } = useDirection();
  const { theme } = useTheme();
  const router = useRouter();
  const isRtl = direction === 'rtl';
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedId = searchParams?.get('id') ?? null;
  const activeEditorTab = (searchParams?.get('tab') as EditorWorkspaceTab) || 'content';
  const bannersPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const bannersPage = isNaN(bannersPageParam) || bannersPageParam < 1 ? 1 : bannersPageParam;

  const [summaries, setSummaries] = React.useState<MarketingBannerSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<MarketingBannerRecord | null>(null);

  const loadData = React.useCallback(() => {
    const result = getMarketingBannerSummaries({ page: bannersPage, pageSize: 5 });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [bannersPage]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getMarketingBannerDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      // Auto-select first item if none selected and we have items
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=content&page=${bannersPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, bannersPage]);

  const updateQueryParams = React.useCallback((updates: Record<string, string | null>, historyAction: 'push' | 'replace' = 'replace') => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    const newUrl = `${pathname}?${params.toString()}`;
    if (historyAction === 'push') {
      router.push(newUrl, { scroll: false });
    } else {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const setSelectedId = React.useCallback((id: string | null) => {
    updateQueryParams({ id, tab: 'content' }, 'push');
  }, [updateQueryParams]);

  const setActiveEditorTab = React.useCallback((tab: EditorWorkspaceTab) => {
    updateQueryParams({ tab }, 'replace');
  }, [updateQueryParams]);

  const setBannersPage = React.useCallback((page: number | ((p: number) => number)) => {
    const nextPage = typeof page === 'function' ? page(bannersPage) : page;
    updateQueryParams({ page: nextPage.toString() }, 'replace');
  }, [bannersPage, updateQueryParams]);

  const bannerDefaults = React.useMemo(() => ({
    accentColor: 'brandStrong',
    offerBadgeColor: 'brand',
  }), []);
  const [draft, setDraft] = React.useState<BannerDraft>(() => createDraft(selected, bannerDefaults));
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
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected, bannerDefaults));
    }
  }, [bannerDefaults, selected]);

  const kpis = React.useMemo(() => getMarketingBannerKpis(), [summaries]); // KPI relies on full data, adapter handles it internally
  const quality = React.useMemo(
    () => computeMarketingBannerQuality({ ...draft, position: Number.parseInt(draft.position, 10) || 0 } as unknown as Partial<MarketingBannerRecord>),
    [draft],
  );
  const totalPages = Math.max(1, Math.ceil(totalItems / 5));
  const visibleItems = summaries;

  React.useEffect(() => {
    setBannersPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages, setBannersPage]);

  function refresh() {
    loadData();
    if (selectedId) setSelected(getMarketingBannerDetail(selectedId));
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null, bannerDefaults));
  }

  const [saveError, setSaveError] = React.useState<string | null>(null);

  function handleSave() {
    if (!draft.title?.trim()) { setSaveError('عنوان البنر مطلوب.'); return; }
    if (!draft.imageUrl?.trim() && !draft.mediaKey?.trim()) { setSaveError('صورة البنر مطلوبة — أدخل رابط الصورة أو مفتاح الوسائط.'); return; }
    if (draft.actionType !== 'subscription' && !draft.actionTarget?.trim()) {
      setSaveError('وجهة الحدث (Target) مطلوبة لهذا النوع من الإجراءات.'); return;
    }

    const allItems = getMarketingBannerItems();
    const parsedPosition = Number.parseInt(draft.position as any, 10);
    const resolvedPosition = Number.isFinite(parsedPosition) ? parsedPosition : (allItems.length + 1);

    if (draft.status === 'published') {
      const isDuplicatePos = allItems.some(i => i.id !== draft.id && i.status === 'published' && i.position === resolvedPosition);
      if (isDuplicatePos) {
        setSaveError(`يوجد بنر مفعل آخر في الموضع (${resolvedPosition}). يرجى تغيير الموضع لتجنب التعارض.`);
        return;
      }
      if (draft.actionType === 'product' || draft.actionType === 'category') {
        const isDuplicateTarget = allItems.some(i => i.id !== draft.id && i.status === 'published' && i.actionType === draft.actionType && i.actionTarget === draft.actionTarget);
        if (isDuplicateTarget) {
          setSaveError(`يوجد بنر مفعل آخر يوجه لنفس الـ ${draft.actionType === 'product' ? 'منتج' : 'فئة'} لتجنب تكرار التوجيهات.`);
          return;
        }
      }
      if (draft.mediaKey === 'placeholder' || draft.imageUrl?.includes('placeholder')) {
         setSaveError('لا يمكن نشر البنر باستخدام صورة وهمية (Placeholder). يرجى توفير وسائط حقيقية.');
         return;
      }
    }

    setSaveError(null);
    const saved = upsertMarketingBannerItem({
      ...draft,
      position: resolvedPosition,
      autoplayIntervalMs: Math.max(2500, Number.parseInt(draft.autoplayIntervalMs as any, 10) || 4500),
    } as unknown as Partial<MarketingBannerRecord>);
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingBannerRecord) {
    const allItems = getMarketingBannerItems();
    if (item.status === 'draft') {
      const isDuplicatePos = allItems.some(i => i.id !== item.id && i.status === 'published' && i.position === item.position);
      if (isDuplicatePos) {
        alert(`لا يمكن التفعيل: يوجد بنر مفعل آخر في الموضع (${item.position}).`);
        return;
      }
      if (item.actionType === 'product' || item.actionType === 'category') {
        const isDuplicateTarget = allItems.some(i => i.id !== item.id && i.status === 'published' && i.actionType === item.actionType && i.actionTarget === item.actionTarget);
        if (isDuplicateTarget) {
          alert(`لا يمكن التفعيل: يوجد بنر مفعل آخر يوجه لنفس الـ ${item.actionType === 'product' ? 'منتج' : 'فئة'}.`);
          return;
        }
      }
      if (item.mediaKey === 'placeholder' || item.imageUrl?.includes('placeholder')) {
         alert('لا يمكن التفعيل: البنر يحتوي على صورة وهمية (Placeholder).');
         return;
      }
    }
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
    removeMarketingBannerItem(item.id);
    refresh();
    setDeleteConfirmId(null);
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  const templates = React.useMemo(() => ([
    { id: 'restaurant', label: 'مطعم', accent: 'danger', badge: 'خصم 20%', cta: 'اطلب الآن', icon: '' },
    { id: 'fashion', label: 'متجر أزياء', accent: 'info', badge: 'وصل حديثاً', cta: 'تسوق الآن', icon: '' },
    { id: 'tech', label: 'إلكترونيات', accent: 'brandStrong', badge: 'الأكثر مبيعاً', cta: 'اشترِ الآن', icon: '' },
    { id: 'pro', label: 'اشتراك برو', accent: 'warning', badge: 'شهر مجاني', cta: 'اشترك الآن', icon: '' },
  ]), []);

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
  const resolvedDraftAccentColor = resolvePreviewColor(draft.accentColor || theme.brandHeaderBackground);
  const resolvedDraftOfferBadgeColor = resolvePreviewColor(draft.offerBadgeColor || theme.brand);
  const bannerCtrPercent = `${((kpis.clicks / (kpis.impressions || 1)) * 100).toFixed(1)}%`;

  const styles = React.useMemo(() => StyleSheet.create({
    workspaceRoot: {
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
    },
    headerPanel: {
      borderRadius: 24,
      padding: 18,
      backgroundColor: theme.surface,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
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
      borderColor: theme.line,
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
      backgroundColor: theme.surface,
      minHeight: 0,
    },
    editorColumn: {
      flex: 1,
      borderRadius: 24,
      padding: 14,
      backgroundColor: theme.surface,
      minHeight: 0,
    },
    sidebarColumn: {
      width: 248,
      borderRadius: 24,
      padding: 14,
      backgroundColor: theme.surface,
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
      backgroundColor: theme.surfaceInset,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    listCardSelected: {
      borderColor: theme.brand,
      backgroundColor: theme.surface,
      elevation: 4,
      shadowColor: theme.brand,
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
      borderColor: theme.line,
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.surface,
    },
    templateBtnText: {
      fontSize: 10,
      fontWeight: '900',
      color: theme.textMuted,
    },
    editorCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.line,
      backgroundColor: theme.surfaceInset,
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
      shadowColor: theme.overlay,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 14,
    },
    bannerImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    } as ImageStyle,
    bannerImageLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    } as ViewStyle,
    bannerOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    bannerShadeTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '46%',
      backgroundColor: theme.brandHeaderSurfaceStrong,
    },
    bannerShadeBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '58%',
      backgroundColor: theme.overlaySoft,
    },
    bannerContent: {
      flex: 1,
      padding: 18,
      justifyContent: 'flex-end',
    },
    bannerPartner: {
      color: theme.brandContrast,
      fontSize: 11,
      fontWeight: '900',
      opacity: 0.9,
      textShadowColor: theme.overlay,
      textShadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
    },
    bannerTitle: {
      color: theme.brandContrast,
      fontSize: 22,
      fontWeight: '900',
      textShadowColor: theme.overlay,
      textShadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    bannerSubtitle: {
      color: theme.brandContrast,
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
      backgroundColor: theme.infoSurface,
      borderWidth: 1,
      borderColor: theme.info,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    previewMetaText: {
      color: theme.brandHeaderBackground,
      fontWeight: '800',
    },
    motionPanel: {
      backgroundColor: theme.warningSurface,
      padding: 12,
      borderRadius: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.warning,
    },
    motionInlineGrid: {
      gap: 10,
    },
    smartTargetPanel: {
      backgroundColor: theme.surfaceInset,
      padding: 12,
      borderRadius: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.line,
    },
    smartSummaryCard: {
      padding: 12,
      backgroundColor: theme.infoSurface,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.info,
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
      color: theme.brandContrast,
      fontSize: 10,
      fontWeight: '900',
    },
    partnerLogoWrap: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: theme.surface,
      padding: 5,
      elevation: 6,
      shadowColor: theme.overlay,
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    partnerLogo: {
      width: '100%',
      height: '100%',
    },
    qualityPanel: {
      padding: 12,
      backgroundColor: theme.surfaceInset,
      borderRadius: 14,
    },
    qualityTrack: {
      height: 8,
      backgroundColor: theme.line,
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 8,
    },
    qualityFill: {
      height: '100%',
    },
    divider: {
      height: 1,
      backgroundColor: theme.surfaceInset,
      marginVertical: 8,
    },
    actionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 18,
      backgroundColor: theme.surfaceInset,
      borderWidth: 1,
      borderColor: theme.line,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  }), [theme]);

  const BannerPreview = () => (
    <View style={styles.previewContainer}>
      <View style={StyleSheet.flatten([styles.bannerBase, { backgroundColor: resolvedDraftAccentColor }])}>
        {draft.imageUrl || draft.mediaKey ? (
          <Image
            source={resolveDshImageSource(draft.imageUrl || draft.mediaKey)}
            style={styles.bannerImage as ImageStyle}
            resizeMode={draft.imageFit}
          />
        ) : (
          <View style={[styles.bannerImageLayer as ViewStyle, { backgroundColor: resolvedDraftAccentColor, justifyContent: 'center', alignItems: 'center' }]}>
             <Text style={{ fontSize: 40 }}>{templates.find(t => t.id === draft.templateId)?.label.slice(0, 1) || 'ب'}</Text>
          </View>
        )}
        <View
          style={[
            styles.bannerOverlay,
            {
              backgroundColor:
                draft.motionStyle === 'subtle-fade'
                  ? theme.overlay
                  : draft.motionStyle === 'soft-parallax'
                    ? theme.overlaySoft
                    : `${resolvedDraftAccentColor}44`,
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

          <View style={StyleSheet.flatten([styles.bannerCta, { backgroundColor: theme.surface }])}>
            <Text style={StyleSheet.flatten([styles.bannerCtaText, { color: resolvedDraftAccentColor }])}>{draft.ctaLabel}</Text>
          </View>
        </View>

        {/* Badge */}
        {draft.offerBadgeText ? (
          <View style={StyleSheet.flatten([styles.bannerBadge, { backgroundColor: resolvedDraftOfferBadgeColor }, draft.offerBadgePosition === 'top-left' ? { left: 20, top: 20 } : { right: 20, top: 20 }])}>
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
            <Image source={resolveDshImageSource(draft.partnerLogoUrl)} style={styles.partnerLogo as ImageStyle} resizeMode="contain" />
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
        <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>القالب الذكي</Text>
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
        <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>لوحة التحرير</Text>
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
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>احتواء الصورة</label>
                <Tabs<BannerImageFit> items={IMAGE_FIT_TAB_ITEMS} value={draft.imageFit} onValueChange={(v) => setDraft(c => ({ ...c, imageFit: v }))} variant="pill" />
              </Box>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField label="رابط الشعار" value={draft.partnerLogoUrl} onChangeText={(v) => setDraft(c => ({ ...c, partnerLogoUrl: v }))} />
              <TextField label="نص الشارة" value={draft.offerBadgeText} onChangeText={(v) => setDraft(c => ({ ...c, offerBadgeText: v }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>موقع الشعار</label>
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
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>نطاق العرض</label>
                <Tabs<MarketingBannerAudience>
                  items={[{ value: 'all', label: 'الجميع' }, { value: 'home', label: 'الرئيسية' }, { value: 'stores', label: 'المتاجر' }]}
                  value={draft.audience}
                  onValueChange={(v) => setDraft((current) => ({ ...current, audience: v }))}
                  variant="pill"
                />
              </Box>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>نوع الوجهة الذكي</label>
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
                  <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>فلترة الحالة</label>
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
                    <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>فلترة الفئة</label>
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
              <Text role="caption" style={{ fontWeight: '900', color: theme.info }}>ملخص الربط النهائي</Text>
              <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>الوجهة: {smartTargetSummary.label}</Text>
              <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>المعرف: {smartTargetSummary.targetId}</Text>
              <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>الاسم: {smartTargetSummary.targetLabel}</Text>
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
        {saveError ? (
          <View style={{ paddingHorizontal: 8, paddingVertical: 6, backgroundColor: theme.dangerSurface ?? theme.surfaceInset, borderRadius: 8, marginBottom: 4 }}>
            <Text role="caption" style={{ color: theme.danger }}>{saveError}</Text>
          </View>
        ) : null}
        <View style={styles.actionButtonsRow}>
          <Button label="جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} disabled={!hasPermission('marketing.edit')} />
          <Button label="تكرار" tone="secondary" fullWidth={false} disabled={!selected || !hasPermission('marketing.edit')} onPress={() => selected && handleDuplicate(selected)} />
          <Button label={selected?.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" fullWidth={false} disabled={!selected || !hasPermission('marketing.publish')} onPress={() => selected && handleToggle(selected)} />
          {deleteConfirmId === selected?.id ? (
            <>
              <Button label="تأكيد الحذف" tone="danger" fullWidth={false} onPress={() => selected && handleDelete(selected)} disabled={!hasPermission('marketing.delete')} />
              <Button label="إلغاء" tone="secondary" fullWidth={false} onPress={() => setDeleteConfirmId(null)} />
            </>
          ) : (
            <Button label="حذف" tone="danger" fullWidth={false} disabled={!selected || !hasPermission('marketing.delete')} onPress={() => selected && setDeleteConfirmId(selected.id)} />
          )}
          <Button label="حفظ" tone="primary" fullWidth={false} onPress={handleSave} disabled={!draft.title?.trim() || !hasPermission('marketing.edit')} style={{ paddingHorizontal: 24 }} />
          {hubHref ? <Button label="المركز" tone="ghost" fullWidth={false} onPress={() => router.push(hubHref)} /> : null}
          {operationsHref ? <Button label="العمليات" tone="ghost" fullWidth={false} onPress={() => router.push(operationsHref)} /> : null}
        </View>
      </View>
    </Box>
  );

  return (
    <Box gap={3} style={styles.workspaceRoot}>
      <Surface tone="raised" gap={3} style={styles.headerPanel}>
        <View style={StyleSheet.flatten([styles.headerRow, isRtl && styles.rowReverse])}>
          <Box gap={0}>
            <Text role="caption" style={{ color: theme.brand, fontWeight: '900', letterSpacing: 0.5 }}>لوحة إدارة المحتوى الإعلاني</Text>
            <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground, fontSize: 24 }}>استوديو البنرات</Text>
          </Box>
          <Button label="إضافة بنر جديد" tone="primary" fullWidth={false} onPress={handleCreateNew} style={{ backgroundColor: theme.brandHeaderBackground, borderRadius: 10, height: 38 }} disabled={!hasPermission('marketing.edit')} />
        </View>

        <View style={styles.kpiGrid}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total.value, color: theme.brandHeaderBackground, bg: theme.surface },
            { label: 'البنرات النشطة', value: kpis.live.value, color: theme.success, bg: theme.surface },
            { label: 'مشاهدات اليوم', value: kpis.impressions.value, color: theme.brandHeaderBackground, bg: theme.surface },
            { label: 'نسبة التفاعل', value: kpis.ctr.value, color: theme.brand, bg: theme.surface },
          ].map(k => (
            <View key={k.label} style={StyleSheet.flatten([styles.kpiCard, { backgroundColor: k.bg }])}>
              <Text role="caption" style={{ fontWeight: '800', color: theme.textMuted }}>{k.label}</Text>
              <Text role="titleSm" style={{ color: k.color, fontWeight: '900', marginTop: 4, fontSize: 18 }}>{k.value}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={styles.studioBody}>
        <Surface tone="raised" gap={3} style={styles.previewColumn}>
          <Box gap={3} style={styles.columnBody}>
            <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>المعاينة والحركة</Text>
            <BannerPreview />
            <Box gap={2} style={styles.qualityPanel}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text role="caption" style={{ fontWeight: '900' }}>جودة المحتوى</Text>
                <Text role="caption" style={{ fontWeight: '900', color: quality > 70 ? theme.success : theme.warning }}>{quality}%</Text>
              </View>
              <View style={styles.qualityTrack}><View style={StyleSheet.flatten([styles.qualityFill, { width: `${quality}%`, backgroundColor: quality > 70 ? theme.success : theme.warning }])} /></View>
            </Box>
            <View style={styles.motionPanel}>
              <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>حركة البنر</Text>
              <SelectField<MarketingBannerMotionStyle>
                label="نمط الحركة"
                value={draft.motionStyle}
                options={BANNER_MOTION_OPTIONS}
                onValueChange={(value) => setDraft((current) => ({ ...current, motionStyle: value }))}
              />
              <View style={styles.motionInlineGrid}>
                <Box gap={1}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>التشغيل التلقائي</label>
                  <Tabs
                    items={[{ value: 'true', label: 'مفعل' }, { value: 'false', label: 'متوقف' }]}
                    value={draft.autoplayEnabled ? 'true' : 'false'}
                    onValueChange={(value) => setDraft((current) => ({ ...current, autoplayEnabled: value === 'true' }))}
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
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>الإيقاف عند التفاعل</label>
                <Tabs
                  items={[{ value: 'true', label: 'نعم' }, { value: 'false', label: 'لا' }]}
                  value={draft.pauseOnInteraction ? 'true' : 'false'}
                  onValueChange={(value) => setDraft((current) => ({ ...current, pauseOnInteraction: value === 'true' }))}
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
          <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground, paddingHorizontal: 4 }}>جميع الحملات</Text>
          <Box gap={3} style={styles.sidebarBody}>
            {visibleItems.length === 0 ? (
              <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceInset, borderRadius: 12 }}>
                <Text style={{ color: theme.textMuted, fontWeight: '800', textAlign: 'center' }}>لا توجد بنرات مطابقة للبحث أو الفلتر المختار.</Text>
              </View>
            ) : (
              visibleItems.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={StyleSheet.flatten([styles.listCard, selectedId === item.id && styles.listCardSelected])}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.statusDot, { backgroundColor: item.status === 'published' ? theme.success : theme.disabledText }]} />
                    <Box gap={0} style={{ flex: 1 }}>
                      <Text role="bodySm" style={{ fontWeight: '900', color: selectedId === item.id ? theme.brandHeaderBackground : theme.text }} numberOfLines={1}>{item.title}</Text>
                      <Text role="caption" tone="muted">{bannerActionTypeLabel(item)}</Text>
                    </Box>
                  </View>
                </Pressable>
              ))
            )}
            <WebControlPanelCompactPager
              page={bannersPage}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${totalItems} بنرات`}
              onPrevious={bannersPage > 1 ? () => setBannersPage((currentPage) => currentPage - 1) : undefined}
              onNext={bannersPage < totalPages ? () => setBannersPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>
      </View>
    </Box>
  );
}

export default BannersCommandDeckScreen;
