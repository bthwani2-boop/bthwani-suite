'use client';

// Authority: control-panel/marketing — banner editor section component.
// Extracted from BannersCommandDeckScreen (EditorSection inner component) as part of Giant Screen split.
// Owns: all search states, all options memos, smart-target logic, template application, action bar.
// Owns its own styles via createStyles(theme).

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  SearchField,
  SelectField,
  Tabs,
  Text,
  TextField,
  useTheme,
} from '@bthwani/ui-kit';
import type {
  MarketingBannerAudience,
  MarketingBannerRecord,
  MarketingBannerStatus,
} from '../../data/marketing.preview-data';
import { dshCategoryFixtures } from '../../data/categories.preview-data';
import { dshDiscoveryStores, storeItemsByStoreId } from '../../data/stores.preview-data';
import type { MarketingPermission } from './marketing-permissions.contract';
import {
  BANNER_TEMPLATES,
  IMAGE_FIT_TAB_ITEMS,
  LOGO_POSITION_TAB_ITEMS,
  SMART_TARGET_OPTIONS,
  SUBSCRIPTION_OPTIONS,
} from './banner-types';
import { normalizeSearchText, getProductsForStore, resolveSmartTargetSummary } from './banner-target-utils';
import type {
  BannerDraft,
  BannerImageFit,
  BannerLogoPosition,
  EditorWorkspaceTab,
  SmartBannerTargetType,
  SmartTargetStoreFilter,
} from './banner-types';

export type BannerEditorSectionProps = {
  draft: BannerDraft;
  setDraft: React.Dispatch<React.SetStateAction<BannerDraft>>;
  activeEditorTab: EditorWorkspaceTab;
  setActiveEditorTab: (tab: EditorWorkspaceTab) => void;
  selected: MarketingBannerRecord | null;
  handleCreateNew: () => void;
  handleDuplicate: (item: MarketingBannerRecord) => void;
  handleToggle: (item: MarketingBannerRecord) => void;
  handleDelete: (item: MarketingBannerRecord) => void;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  hasPermission: (perm: MarketingPermission) => boolean;
  hubHref?: string;
  operationsHref?: string;
  saveError: string | null;
  handleSave: () => void;
};

export function BannerEditorSection({
  draft,
  setDraft,
  activeEditorTab,
  setActiveEditorTab,
  selected,
  handleCreateNew,
  handleDuplicate,
  handleToggle,
  handleDelete,
  deleteConfirmId,
  setDeleteConfirmId,
  hasPermission,
  hubHref,
  operationsHref,
  saveError,
  handleSave,
}: BannerEditorSectionProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // --- Internal search states (all target-panel scoped) ---
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

  // --- Default IDs used when switching smart target type ---
  const firstStoreId = dshDiscoveryStores[0]?.id ?? 'store-1001';
  const firstCategoryId = dshCategoryFixtures[0]?.id ?? 'restaurants';

  const firstCategoryWithSubcategories = React.useMemo(
    () => dshCategoryFixtures.find((c) => c.subcategories.length > 0) ?? dshCategoryFixtures[1],
    [],
  );
  const firstSubcategoryId = firstCategoryWithSubcategories?.subcategories[0]?.id ?? '';

  const firstProductStoreId = React.useMemo(
    () =>
      Object.keys(storeItemsByStoreId).find((id) => (storeItemsByStoreId[id] ?? []).length > 0) ??
      firstStoreId,
    [firstStoreId],
  );
  const firstProductId = storeItemsByStoreId[firstProductStoreId]?.[0]?.id ?? '';

  const firstOfferStoreId = React.useMemo(
    () => dshDiscoveryStores.find((s) => Boolean(s.isOffer || s.offerLabel))?.id ?? firstStoreId,
    [firstStoreId],
  );

  // --- Options memos ---
  const targetTypeOptions = React.useMemo(
    () => SMART_TARGET_OPTIONS.map((o) => ({ value: o.value, label: o.label, description: o.description })),
    [],
  );

  const storeOptions = React.useMemo(
    () =>
      dshDiscoveryStores
        .filter((store) => {
          if (storeFilter === 'offers' && !(store.isOffer || store.offerLabel)) return false;
          if (storeFilter === 'favorites' && !store.isFavorite) return false;
          if (storeFilter === 'available' && store.statusLabel !== 'مفتوح') return false;
          const query = normalizeSearchText(storeSearch);
          if (!query) return true;
          return [
            store.name,
            store.subtitle,
            store.statusLabel,
            store.deliveryLabel,
            store.serviceLabel,
            store.offerLabel ?? '',
          ]
            .join(' ')
            .toLowerCase()
            .includes(query);
        })
        .map((store) => ({
          value: store.id,
          label: store.name,
          description: `${store.subtitle} · ${store.offerLabel ?? store.statusLabel}`,
        })),
    [storeFilter, storeSearch],
  );

  const categoryOptions = React.useMemo(
    () =>
      dshCategoryFixtures
        .filter((c) => {
          const query = normalizeSearchText(categorySearch);
          if (!query) return true;
          return [c.label, c.subtitle, c.id].join(' ').toLowerCase().includes(query);
        })
        .map((c) => ({ value: c.id, label: c.label, description: c.subtitle })),
    [categorySearch],
  );

  const selectedSubcategorySource = React.useMemo(
    () =>
      dshCategoryFixtures.find((c) => c.id === draft.actionTarget) ??
      firstCategoryWithSubcategories ??
      null,
    [draft.actionTarget, firstCategoryWithSubcategories],
  );

  const parentCategoryOptions = React.useMemo(
    () =>
      dshCategoryFixtures
        .filter((c) => c.subcategories.length > 0)
        .filter((c) => {
          const query = normalizeSearchText(subcategoryParentSearch);
          if (!query) return true;
          return [c.label, c.subtitle, c.id].join(' ').toLowerCase().includes(query);
        })
        .map((c) => ({ value: c.id, label: c.label, description: c.subtitle })),
    [subcategoryParentSearch],
  );

  const subcategoryOptions = React.useMemo(
    () =>
      (selectedSubcategorySource?.subcategories ?? [])
        .filter((s) => {
          const query = normalizeSearchText(subcategoryChildSearch);
          if (!query) return true;
          return [s.label, s.subtitle, s.id].join(' ').toLowerCase().includes(query);
        })
        .map((s) => ({ value: s.id, label: s.label, description: s.subtitle })),
    [selectedSubcategorySource, subcategoryChildSearch],
  );

  const productStoreOptions = React.useMemo(
    () =>
      dshDiscoveryStores
        .filter((s) => getProductsForStore(s.id).length > 0)
        .filter((s) => {
          const query = normalizeSearchText(productStoreSearch);
          if (!query) return true;
          return [s.name, s.subtitle, s.offerLabel ?? ''].join(' ').toLowerCase().includes(query);
        })
        .map((s) => ({
          value: s.id,
          label: s.name,
          description: `${s.subtitle} · ${getProductsForStore(s.id).length} منتج`,
        })),
    [productStoreSearch],
  );

  const selectedProductStoreId = draft.actionExtra || firstProductStoreId;

  const productCategoryOptions = React.useMemo(() => {
    const categories = new Map<string, string>();
    getProductsForStore(selectedProductStoreId).forEach((p) => {
      if (p.categoryId && p.categoryLabel) categories.set(p.categoryId, p.categoryLabel);
    });
    return [
      { value: 'all', label: 'الكل' },
      ...Array.from(categories.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [selectedProductStoreId]);

  const productOptions = React.useMemo(
    () =>
      getProductsForStore(selectedProductStoreId)
        .filter((p) => {
          if (productCategoryFilter !== 'all' && p.categoryId !== productCategoryFilter) return false;
          const query = normalizeSearchText(productSearch);
          if (!query) return true;
          return [p.name, p.subtitle, p.categoryLabel, p.id].join(' ').toLowerCase().includes(query);
        })
        .map((p) => ({
          value: p.id,
          label: p.name,
          description: `${p.categoryLabel} · ${p.priceLabel ?? 'بدون سعر'}`,
        })),
    [productCategoryFilter, productSearch, selectedProductStoreId],
  );

  const offerOptions = React.useMemo(
    () =>
      dshDiscoveryStores
        .filter((s) => Boolean(s.isOffer || s.offerLabel))
        .filter((s) => {
          const query = normalizeSearchText(offerSearch);
          if (!query) return true;
          return [s.name, s.subtitle, s.offerLabel ?? ''].join(' ').toLowerCase().includes(query);
        })
        .map((s) => ({
          value: s.id,
          label: s.name,
          description: `${s.offerLabel ?? 'عرض'} · ${s.subtitle}`,
        })),
    [offerSearch],
  );

  const subscriptionOptions = React.useMemo(
    () =>
      SUBSCRIPTION_OPTIONS.filter((o) => {
        const query = normalizeSearchText(subscriptionSearch);
        if (!query) return true;
        return [o.label, o.value].join(' ').toLowerCase().includes(query);
      }),
    [subscriptionSearch],
  );

  const smartTargetSummary = React.useMemo(
    () => resolveSmartTargetSummary(draft.targetType, draft),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft.actionExtra, draft.actionTarget, draft.targetType],
  );

  // --- Smart target type switcher ---
  const handleSmartTargetTypeChange = React.useCallback(
    (targetType: SmartBannerTargetType) => {
      setDraft((current) => {
        const currentStoreIsValid = (id: string) => Boolean(dshDiscoveryStores.find((s) => s.id === id));
        const currentCategoryIsValid = (id: string) =>
          Boolean(dshCategoryFixtures.find((c) => c.id === id));
        const currentSubcategoryIsValid = (catId: string, subId: string) =>
          Boolean(
            dshCategoryFixtures
              .find((c) => c.id === catId)
              ?.subcategories.find((s) => s.id === subId),
          );
        const currentProductIsValid = (storeId: string, productId: string) =>
          Boolean(getProductsForStore(storeId).find((p) => p.id === productId));
        const currentOfferStoreIsValid = (id: string) =>
          Boolean(dshDiscoveryStores.find((s) => s.id === id && Boolean(s.isOffer || s.offerLabel)));
        const currentSubscriptionIsValid = (route: string) =>
          Boolean(SUBSCRIPTION_OPTIONS.find((o) => o.value === route));

        switch (targetType) {
          case 'home':
            return { ...current, targetType, actionType: 'external', actionTarget: 'home', actionExtra: '' };
          case 'stores':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: 'stores',
              actionExtra: '',
            };
          case 'store':
            return {
              ...current,
              targetType,
              actionType: 'store',
              actionTarget:
                current.actionType === 'store' && currentStoreIsValid(current.actionTarget)
                  ? current.actionTarget
                  : firstStoreId,
              actionExtra: '',
            };
          case 'category':
            return {
              ...current,
              targetType,
              actionType: 'main_category',
              actionTarget:
                current.actionType === 'main_category' &&
                currentCategoryIsValid(current.actionTarget)
                  ? current.actionTarget
                  : firstCategoryId,
              actionExtra: '',
            };
          case 'subcategory': {
            const keepSub =
              current.actionType === 'sub_category' &&
              currentCategoryIsValid(current.actionTarget) &&
              currentSubcategoryIsValid(current.actionTarget, current.actionExtra);
            return {
              ...current,
              targetType,
              actionType: 'sub_category',
              actionTarget: keepSub
                ? current.actionTarget
                : (firstCategoryWithSubcategories?.id || firstCategoryId),
              actionExtra: keepSub ? current.actionExtra : firstSubcategoryId,
            };
          }
          case 'product': {
            const keepProduct =
              current.actionType === 'product' &&
              currentProductIsValid(current.actionExtra, current.actionTarget);
            return {
              ...current,
              targetType,
              actionType: 'product',
              actionTarget: keepProduct ? current.actionTarget : firstProductId,
              actionExtra: keepProduct ? current.actionExtra : firstProductStoreId,
            };
          }
          case 'offer':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: 'offers',
              actionExtra:
                current.actionType === 'external' &&
                current.actionTarget === 'offers' &&
                currentOfferStoreIsValid(current.actionExtra)
                  ? current.actionExtra
                  : firstOfferStoreId,
            };
          case 'subscription':
            return {
              ...current,
              targetType,
              actionType: 'subscription',
              actionTarget:
                current.actionType === 'subscription' &&
                currentSubscriptionIsValid(current.actionTarget)
                  ? current.actionTarget
                  : 'entitlements-get',
              actionExtra: '',
            };
          case 'campaign':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget:
                current.actionType === 'external' &&
                current.actionTarget.startsWith('campaign')
                  ? current.actionTarget
                  : 'campaign',
              actionExtra: '',
            };
          case 'tracking':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: 'tracking',
              actionExtra: '',
            };
          case 'orders':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: 'orders-list',
              actionExtra: '',
            };
          case 'loyalty':
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: 'entitlements-get',
              actionExtra: '',
            };
          case 'custom':
          default:
            return {
              ...current,
              targetType,
              actionType: 'external',
              actionTarget: current.actionTarget || 'custom-route',
              actionExtra: '',
            };
        }
      });
    },
    [
      firstCategoryId,
      firstCategoryWithSubcategories?.id,
      firstOfferStoreId,
      firstProductId,
      firstProductStoreId,
      firstStoreId,
      firstSubcategoryId,
    ],
  );

  // --- Template application ---
  const applyTemplate = (tpl: (typeof BANNER_TEMPLATES)[number]) => {
    setDraft((c) => ({
      ...c,
      templateId: tpl.id,
      accentColor: tpl.accent,
      offerBadgeText: tpl.badge,
      ctaLabel: tpl.cta,
      title: `عرض ${tpl.label}`,
      subtitle: `استمتع بأفضل تجربة مع ${tpl.label} بأسعار حصرية.`,
      motionStyle:
        tpl.id === 'pro' ? 'subtle-fade' : tpl.id === 'tech' ? 'snap-focus' : 'slide',
    }));
  };

  return (
    <Box gap={4}>
      {/* Smart Templates */}
      <Box gap={2}>
        <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
          القالب الذكي
        </Text>
        <View style={styles.templateRow}>
          {BANNER_TEMPLATES.map((tpl) => (
            <Pressable
              key={tpl.id}
              onPress={() => applyTemplate(tpl)}
              style={[
                styles.templateBtn,
                draft.templateId === tpl.id && {
                  borderColor: tpl.accent,
                  backgroundColor: `${tpl.accent}11`,
                },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{tpl.icon}</Text>
              <Text
                style={[
                  styles.templateBtnText,
                  draft.templateId === tpl.id && { color: tpl.accent },
                ]}
              >
                {tpl.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Box>

      {/* Editor Tab Selector */}
      <Box gap={2}>
        <Text role="titleSm" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
          لوحة التحرير
        </Text>
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

      {/* Content Tab */}
      {activeEditorTab === 'content' ? (
        <View style={styles.editorCard}>
          <Box gap={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField
                label="العنوان الرئيسي"
                value={draft.title}
                onChangeText={(v) => setDraft((c) => ({ ...c, title: v }))}
              />
              <TextField
                label="اسم العلامة"
                value={draft.partnerName}
                onChangeText={(v) => setDraft((c) => ({ ...c, partnerName: v }))}
              />
            </div>
            <TextField
              label="الوصف الترويجي"
              value={draft.subtitle}
              onChangeText={(v) => setDraft((c) => ({ ...c, subtitle: v }))}
              multiline
              numberOfLines={2}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <TextField
                label="نص الزر"
                value={draft.ctaLabel}
                onChangeText={(v) => setDraft((c) => ({ ...c, ctaLabel: v }))}
              />
              <TextField
                label="لون الهوية"
                value={draft.accentColor}
                onChangeText={(v) => setDraft((c) => ({ ...c, accentColor: v }))}
              />
              <TextField
                label="ترتيب الظهور"
                value={draft.position}
                onChangeText={(v) => setDraft((c) => ({ ...c, position: v }))}
              />
            </div>
          </Box>
        </View>
      ) : null}

      {/* Media Tab */}
      {activeEditorTab === 'media' ? (
        <View style={styles.editorCard}>
          <Box gap={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
              <TextField
                label="صورة الخلفية"
                value={draft.imageUrl}
                onChangeText={(v) => setDraft((c) => ({ ...c, imageUrl: v }))}
              />
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                  احتواء الصورة
                </label>
                <Tabs<BannerImageFit>
                  items={IMAGE_FIT_TAB_ITEMS}
                  value={draft.imageFit}
                  onValueChange={(v) => setDraft((c) => ({ ...c, imageFit: v }))}
                  variant="pill"
                />
              </Box>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TextField
                label="رابط الشعار"
                value={draft.partnerLogoUrl}
                onChangeText={(v) => setDraft((c) => ({ ...c, partnerLogoUrl: v }))}
              />
              <TextField
                label="نص الشارة"
                value={draft.offerBadgeText}
                onChangeText={(v) => setDraft((c) => ({ ...c, offerBadgeText: v }))}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                  موقع الشعار
                </label>
                <Tabs<BannerLogoPosition>
                  items={LOGO_POSITION_TAB_ITEMS}
                  value={draft.partnerLogoPosition}
                  onValueChange={(v) => setDraft((c) => ({ ...c, partnerLogoPosition: v }))}
                  variant="pill"
                />
              </Box>
              <TextField
                label="لون الشارة"
                value={draft.offerBadgeColor}
                onChangeText={(v) => setDraft((c) => ({ ...c, offerBadgeColor: v }))}
              />
            </div>
          </Box>
        </View>
      ) : null}

      {/* Target Tab */}
      {activeEditorTab === 'target' ? (
        <View style={styles.editorCard}>
          <Box gap={4}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                  نطاق العرض
                </label>
                <Tabs<MarketingBannerAudience>
                  items={[
                    { value: 'all', label: 'الجميع' },
                    { value: 'home', label: 'الرئيسية' },
                    { value: 'stores', label: 'المتاجر' },
                  ]}
                  value={draft.audience}
                  onValueChange={(v) => setDraft((current) => ({ ...current, audience: v }))}
                  variant="pill"
                />
              </Box>
              <Box gap={1}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                  نوع الوجهة الذكي
                </label>
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
                  <SearchField
                    label="ابحث في المتاجر"
                    value={storeSearch}
                    onChangeText={setStoreSearch}
                  />
                  <Box gap={1}>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                      فلترة الحالة
                    </label>
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
                    onValueChange={(v) =>
                      setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))
                    }
                  />
                </Box>
              )}

              {draft.targetType === 'offer' && (
                <Box gap={2}>
                  <SearchField
                    label="ابحث في العروض"
                    value={offerSearch}
                    onChangeText={setOfferSearch}
                  />
                  <SelectField
                    label="اختر متجر العرض"
                    placeholder="اختر متجرًا يملك عرضًا"
                    value={
                      draft.actionExtra || (draft.actionTarget === 'offers' ? '' : draft.actionTarget)
                    }
                    options={offerOptions}
                    onValueChange={(v) =>
                      setDraft((current) => ({
                        ...current,
                        actionType: 'external',
                        actionTarget: 'offers',
                        actionExtra: v,
                      }))
                    }
                  />
                </Box>
              )}

              {draft.targetType === 'category' && (
                <Box gap={2}>
                  <SearchField
                    label="ابحث في الفئات"
                    value={categorySearch}
                    onChangeText={setCategorySearch}
                  />
                  <SelectField
                    label="اختر الفئة"
                    placeholder="اختر فئة رئيسية"
                    value={draft.actionTarget}
                    options={categoryOptions}
                    onValueChange={(v) =>
                      setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))
                    }
                  />
                </Box>
              )}

              {draft.targetType === 'subcategory' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Box gap={2}>
                    <SearchField
                      label="ابحث في الفئات الأم"
                      value={subcategoryParentSearch}
                      onChangeText={setSubcategoryParentSearch}
                    />
                    <SelectField
                      label="الفئة الأم"
                      placeholder="اختر فئة"
                      value={draft.actionTarget}
                      options={parentCategoryOptions}
                      onValueChange={(v) =>
                        setDraft((current) => ({ ...current, actionTarget: v, actionExtra: '' }))
                      }
                    />
                  </Box>
                  <Box gap={2}>
                    <SearchField
                      label="ابحث في الفئات الفرعية"
                      value={subcategoryChildSearch}
                      onChangeText={setSubcategoryChildSearch}
                    />
                    <SelectField
                      label="الفئة الفرعية"
                      placeholder={draft.actionTarget ? 'اختر فئة فرعية' : 'اختر فئة أولاً'}
                      value={draft.actionExtra}
                      options={
                        subcategoryOptions.length
                          ? subcategoryOptions
                          : [
                              {
                                value: '',
                                label: 'اختر فئة أولاً',
                                description: 'لا توجد فئات فرعية متاحة الآن',
                              },
                            ]
                      }
                      onValueChange={(v) =>
                        setDraft((current) => ({ ...current, actionExtra: v }))
                      }
                    />
                  </Box>
                </div>
              )}

              {draft.targetType === 'product' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Box gap={2}>
                    <SearchField
                      label="ابحث في المتاجر"
                      value={productStoreSearch}
                      onChangeText={setProductStoreSearch}
                    />
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
                    <SearchField
                      label="ابحث في المنتجات"
                      value={productSearch}
                      onChangeText={setProductSearch}
                    />
                    <Box gap={1}>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: theme.textMuted }}>
                        فلترة الفئة
                      </label>
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
                      options={
                        productOptions.length
                          ? productOptions
                          : [
                              {
                                value: '',
                                label: 'اختر متجراً أولاً',
                                description: 'تظهر المنتجات بعد اختيار المتجر',
                              },
                            ]
                      }
                      onValueChange={(v) =>
                        setDraft((current) => ({ ...current, actionTarget: v }))
                      }
                    />
                  </Box>
                </div>
              )}

              {draft.targetType === 'subscription' && (
                <Box gap={2}>
                  <SearchField
                    label="ابحث في الاشتراكات"
                    value={subscriptionSearch}
                    onChangeText={setSubscriptionSearch}
                  />
                  <SelectField
                    label="مسار الاشتراك"
                    placeholder="اختر مسار الاشتراك"
                    value={draft.actionTarget}
                    options={subscriptionOptions}
                    onValueChange={(v) =>
                      setDraft((current) => ({ ...current, actionTarget: v }))
                    }
                  />
                </Box>
              )}

              {draft.targetType === 'campaign' && (
                <TextField
                  label="مسار الحملة"
                  value={draft.actionTarget}
                  onChangeText={(value) =>
                    setDraft((current) => ({ ...current, actionTarget: value }))
                  }
                />
              )}

              {draft.targetType === 'custom' && (
                <TextField
                  label="المسار المخصص"
                  value={draft.actionTarget}
                  onChangeText={(value) =>
                    setDraft((current) => ({ ...current, actionTarget: value }))
                  }
                />
              )}

              {(
                ['home', 'stores', 'tracking', 'orders', 'loyalty'] as SmartBannerTargetType[]
              ).includes(draft.targetType) ? (
                <Text role="caption" tone="muted" style={{ fontWeight: '700' }}>
                  هذا النوع محدد مسبقًا ولا يحتاج حقول ربط إضافية.
                </Text>
              ) : null}

              {/* Smart Target Summary Card */}
              <View style={styles.smartSummaryCard}>
                <Text role="caption" style={{ fontWeight: '900', color: theme.info }}>
                  ملخص الربط النهائي
                </Text>
                <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>
                  الوجهة: {smartTargetSummary.label}
                </Text>
                <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>
                  المعرف: {smartTargetSummary.targetId}
                </Text>
                <Text role="caption" style={{ color: theme.info, marginTop: 4 }}>
                  الاسم: {smartTargetSummary.targetLabel}
                </Text>
                <Text role="caption" tone="muted" style={{ fontSize: 10, marginTop: 4 }}>
                  المسار النهائي: {smartTargetSummary.finalRoute}
                </Text>
              </View>
            </View>
          </Box>
        </View>
      ) : null}

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <Box gap={1} style={{ flex: 1 }}>
          <Text role="bodySm" style={{ fontWeight: '900' }}>
            حالة النشر
          </Text>
          <Tabs<MarketingBannerStatus>
            items={[
              { value: 'draft', label: 'مسودة' },
              { value: 'published', label: 'منشور' },
            ]}
            value={draft.status}
            onValueChange={(v) => setDraft((c) => ({ ...c, status: v }))}
            variant="pill"
          />
        </Box>
        {saveError ? (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 6,
              backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Text role="caption" style={{ color: theme.danger }}>
              {saveError}
            </Text>
          </View>
        ) : null}
        <View style={styles.actionButtonsRow}>
          <Button
            label="جديد"
            tone="secondary"
            fullWidth={false}
            onPress={handleCreateNew}
            disabled={!hasPermission('marketing.edit')}
          />
          <Button
            label="تكرار"
            tone="secondary"
            fullWidth={false}
            disabled={!selected || !hasPermission('marketing.edit')}
            onPress={() => selected && handleDuplicate(selected)}
          />
          <Button
            label={selected?.status === 'published' ? 'إيقاف' : 'نشر'}
            tone="secondary"
            fullWidth={false}
            disabled={!selected || !hasPermission('marketing.publish')}
            onPress={() => selected && handleToggle(selected)}
          />
          {deleteConfirmId === selected?.id ? (
            <>
              <Button
                label="تأكيد الحذف"
                tone="danger"
                fullWidth={false}
                onPress={() => selected && handleDelete(selected)}
                disabled={!hasPermission('marketing.delete')}
              />
              <Button
                label="إلغاء"
                tone="secondary"
                fullWidth={false}
                onPress={() => setDeleteConfirmId(null)}
              />
            </>
          ) : (
            <Button
              label="حذف"
              tone="danger"
              fullWidth={false}
              disabled={!selected || !hasPermission('marketing.delete')}
              onPress={() => selected && setDeleteConfirmId(selected.id)}
            />
          )}
          <Button
            label="حفظ"
            tone="primary"
            fullWidth={false}
            onPress={handleSave}
            disabled={!draft.title?.trim() || !hasPermission('marketing.edit')}
            style={{ paddingHorizontal: 24 }}
          />
          {hubHref ? (
            <Button
              label="المركز"
              tone="ghost"
              fullWidth={false}
              onPress={() => router.push(hubHref)}
            />
          ) : null}
          {operationsHref ? (
            <Button
              label="العمليات"
              tone="ghost"
              fullWidth={false}
              onPress={() => router.push(operationsHref)}
            />
          ) : null}
        </View>
      </View>
    </Box>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
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
  });
}
