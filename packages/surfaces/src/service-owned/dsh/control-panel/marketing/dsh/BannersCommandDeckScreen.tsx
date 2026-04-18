"use client";

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BthBox, BthButton, BthSurface, BthTabs, BthText, BthTextField, useDirection } from '@bthwani/ui-kit';
import {
  computeMarketingBannerQuality,
  duplicateMarketingBannerItem,
  getMarketingBannerItems,
  getMarketingBannerKpis,
  getPublishedMarketingHomePromos,
  removeMarketingBannerItem,
  toggleMarketingBannerStatus,
  upsertMarketingBannerItem,
  type MarketingBannerActionType,
  type MarketingBannerAudience,
  type MarketingBannerRecord,
  type MarketingBannerStatus,
} from './banner-store';

export type BannersCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type BannerDraft = {
  id?: string;
  title: string;
  subtitle: string;
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
};

function createDraft(item?: MarketingBannerRecord | null): BannerDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    accentColor: item?.accentColor ?? '#f97316',
    audience: item?.audience ?? 'all',
    status: item?.status ?? 'draft',
    actionType: item?.actionType ?? 'external',
    actionTarget: item?.actionTarget ?? 'DshStoresList',
    actionExtra: item?.actionExtra ?? '',
    ctaLabel: item?.ctaLabel ?? 'افتح الآن',
    partnerName: item?.partnerName ?? 'التسويق',
    imageUrl: item?.imageUrl ?? '',
    position: String(item?.position ?? ''),
  };
}

function bannerStatusLabel(status: MarketingBannerStatus) {
  return status === 'published' ? 'منشور' : 'مسودة';
}

function bannerActionTypeLabel(actionType: MarketingBannerActionType) {
  if (actionType === 'main_category') return 'فئة رئيسية';
  if (actionType === 'store') return 'متجر محدد';
  if (actionType === 'subscription') return 'اشتراك';
  return 'وجهة عامة';
}

function bannerTargetLabel(target?: string) {
  if (!target) return 'وجهة مخصصة';
  if (target === 'DshStoresList') return 'قائمة المتاجر';
  if (target.includes('restaurant')) return 'فئة المطاعم';
  if (target.includes('subscription')) return 'صفحة الاشتراك';
  return 'وجهة مخصصة';
}

export function BannersCommandDeckScreen(_: BannersCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const [items, setItems] = React.useState<MarketingBannerRecord[]>(() => getMarketingBannerItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingBannerItems()[0]?.id ?? null);
  const selected = React.useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0] ?? null,
    [items, selectedId],
  );
  const [draft, setDraft] = React.useState<BannerDraft>(() => createDraft(selected));

  React.useEffect(() => {
    setDraft(createDraft(selected));
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingBannerKpis(), [items]);
  const livePreview = React.useMemo(() => getPublishedMarketingHomePromos('all').slice(0, 3), [items]);
  const quality = React.useMemo(
    () => computeMarketingBannerQuality({ ...draft, position: Number.parseInt(draft.position, 10) || 0 }),
    [draft],
  );

  function refresh() {
    setItems(getMarketingBannerItems());
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingBannerItem({
      id: draft.id,
      title: draft.title,
      subtitle: draft.subtitle,
      accentColor: draft.accentColor,
      audience: draft.audience,
      status: draft.status,
      actionType: draft.actionType,
      actionTarget: draft.actionTarget,
      actionExtra: draft.actionExtra,
      ctaLabel: draft.ctaLabel,
      partnerName: draft.partnerName,
      imageUrl: draft.imageUrl,
      position: Number.parseInt(draft.position, 10) || undefined,
    });

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
    removeMarketingBannerItem(item.id);
    refresh();
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  return (
    <BthBox gap={4}>
      <BthSurface tone="raised" gap={3}>
        <BthText role="caption" style={styles.brandEyebrow}>مسار البنر مملوك للتسويق</BthText>
        <BthText role="titleLg">إغلاق نهائي للبنر في العميل ولوحة التسويق</BthText>
        <BthText role="bodySm" tone="muted">
          من هنا يتم إنشاء البنر، ترتيبه، نشره، ثم ظهوره مباشرة داخل واجهة العميل في المنزل وقائمة المتاجر.
        </BthText>

        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total, color: '#2563eb' },
            { label: 'حي الآن', value: kpis.live, color: '#16a34a' },
            { label: 'مسودات', value: kpis.drafts, color: '#f97316' },
            { label: 'النقرات', value: kpis.clicks, color: '#dc2626' },
          ].map((entry) => (
            <View key={entry.label} style={styles.kpiCard}>
              <BthText role="caption" tone="muted">{entry.label}</BthText>
              <BthText role="titleLg" style={{ color: entry.color }}>{String(entry.value)}</BthText>
            </View>
          ))}
        </View>
      </BthSurface>

      <View style={[styles.columnsWrap, isRtl && styles.rowReverse]}>
        <View style={styles.column}>
          <BthSurface tone="inset" gap={3}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <BthText role="titleSm">المعاينة الحية في التطبيق</BthText>
              <BthButton label="بنر جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} />
            </View>

            <View style={styles.previewStack}>
              {livePreview.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.previewCard,
                    { backgroundColor: item.accentColor ?? '#f97316' },
                  ]}
                >
                  <BthText role="titleSm" style={styles.previewTitle}>{item.title}</BthText>
                  <BthText role="bodySm" style={styles.previewSubtitle}>{item.subtitle}</BthText>
                </View>
              ))}
            </View>

            <BthText role="caption" tone="muted">
              التدفق الآن واضح: التسويق ⇠ تحكم مباشر ⇠ نشر ⇠ ظهور في التطبيق ⇠ قياس التفاعل.
            </BthText>
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <BthText role="titleSm">قائمة البنرات</BthText>
              <BthText role="caption" tone="muted">{items.length} عنصر</BthText>
            </View>

            <BthBox gap={2}>
              {items.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedId(item.id)}
                    style={[
                      styles.listCard,
                      isSelected && styles.listCardSelected,
                    ]}
                  >
                    <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
                      <View style={styles.listTextWrap}>
                        <BthText role="titleSm">{item.title}</BthText>
                        <BthText role="bodySm" tone="muted">{item.subtitle}</BthText>
                      </View>
                      <View style={[styles.statusPill, item.status === 'published' ? styles.statusLive : styles.statusDraft]}>
                        <BthText role="caption" style={styles.statusText}>{bannerStatusLabel(item.status)}</BthText>
                      </View>
                    </View>

                    <BthText role="caption" tone="muted">
                      {item.audience === 'all' ? 'المنزل + قائمة المتاجر' : item.audience === 'home' ? 'المنزل فقط' : 'قائمة المتاجر فقط'}
                      {' · '}
                      {bannerActionTypeLabel(item.actionType)}
                      {' · '}
                      {bannerTargetLabel(item.actionTarget)}
                    </BthText>

                    <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
                      <BthButton
                        label={item.status === 'published' ? 'إيقاف' : 'نشر'}
                        tone="ghost"
                        fullWidth={false}
                        onPress={() => handleToggle(item)}
                      />
                      <BthButton label="نسخ" tone="ghost" fullWidth={false} onPress={() => handleDuplicate(item)} />
                      <BthButton label="حذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(item)} />
                    </View>
                  </Pressable>
                );
              })}
            </BthBox>
          </BthSurface>
        </View>

        <View style={styles.column}>
          <BthSurface tone="raised" gap={3}>
            <BthText role="titleSm">تحرير البنر المحدد</BthText>

            <BthTabs<MarketingBannerStatus>
              items={[
                { value: 'draft', label: 'مسودة' },
                { value: 'published', label: 'منشور' },
              ]}
              value={draft.status}
              onValueChange={(value) => setDraft((current) => ({ ...current, status: value }))}
              variant="pill"
            />

            <BthTabs<MarketingBannerAudience>
              items={[
                { value: 'all', label: 'الكل' },
                { value: 'home', label: 'الرئيسية' },
                { value: 'stores', label: 'المتاجر' },
              ]}
              value={draft.audience}
              onValueChange={(value) => setDraft((current) => ({ ...current, audience: value }))}
              variant="pill"
            />

            <BthTabs<MarketingBannerActionType>
              items={[
                { value: 'main_category', label: 'فئة' },
                { value: 'store', label: 'متجر' },
                { value: 'external', label: 'قائمة' },
                { value: 'subscription', label: 'اشتراك' },
              ]}
              value={draft.actionType}
              onValueChange={(value) => setDraft((current) => ({ ...current, actionType: value }))}
              variant="pill"
            />

            <BthTextField label="عنوان البنر" value={draft.title} onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <BthTextField label="الوصف المختصر" value={draft.subtitle} onChangeText={(value) => setDraft((current) => ({ ...current, subtitle: value }))} />
            <BthTextField label="الوجهة التسويقية" value={draft.actionTarget} onChangeText={(value) => setDraft((current) => ({ ...current, actionTarget: value }))} hint="مثال: فئة المطاعم أو متجر مميز أو صفحة اشتراك" />
            <BthSurface tone="inset" gap={2}>
              <BthText role="bodyStrong">المسار الذي سيفتحه البنر</BthText>
              <BthText role="bodySm" tone="muted">{bannerTargetLabel(draft.actionTarget)} · الربط الفعلي يتم داخليًا بدون لغة تقنية ظاهرة للمستخدم.</BthText>
            </BthSurface>
            <BthTextField label="اسم الشريك أو المصدر" value={draft.partnerName} onChangeText={(value) => setDraft((current) => ({ ...current, partnerName: value }))} />
            <BthTextField label="نص زر الإجراء" value={draft.ctaLabel} onChangeText={(value) => setDraft((current) => ({ ...current, ctaLabel: value }))} />
            <BthTextField label="لون التمييز" value={draft.accentColor} onChangeText={(value) => setDraft((current) => ({ ...current, accentColor: value }))} hint="مثال: #f97316" />
            <BthTextField label="الترتيب" value={draft.position} onChangeText={(value) => setDraft((current) => ({ ...current, position: value }))} hint="1 يظهر أولاً" />
            <BthTextField label="رابط الصورة" value={draft.imageUrl} onChangeText={(value) => setDraft((current) => ({ ...current, imageUrl: value }))} hint="يمكن تركه فارغًا وسيتم توليد معاينة تلقائية" />

            <View>
              <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
                <BthText role="bodySm">جودة البنر</BthText>
                <BthText role="bodySm" style={{ color: quality >= 80 ? '#16a34a' : quality >= 60 ? '#f97316' : '#dc2626' }}>
                  {quality}%
                </BthText>
              </View>
              <View style={styles.qualityTrack}>
                <View
                  style={[
                    styles.qualityFill,
                    {
                      width: `${quality}%`,
                      backgroundColor: quality >= 80 ? '#16a34a' : quality >= 60 ? '#f97316' : '#dc2626',
                    },
                  ]}
                />
              </View>
            </View>

            <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
              <BthButton label="حفظ البنر" fullWidth={false} onPress={handleSave} />
              {selected ? (
                <BthButton
                  label={selected.status === 'published' ? 'إيقاف العرض' : 'نشر الآن'}
                  tone="secondary"
                  fullWidth={false}
                  onPress={() => handleToggle(selected)}
                />
              ) : null}
            </View>
          </BthSurface>
        </View>
      </View>
    </BthBox>
  );
}

const styles = StyleSheet.create({
  brandEyebrow: {
    color: '#f97316',
    fontWeight: '700',
  },
  columnsWrap: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  column: {
    flex: 1,
    minWidth: 320,
    gap: 16,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    minWidth: 140,
    flexGrow: 1,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  previewStack: {
    gap: 10,
  },
  previewCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  previewTitle: {
    color: '#ffffff',
    fontWeight: '800',
  },
  previewSubtitle: {
    color: 'rgba(255,255,255,0.92)',
  },
  listCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  listCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  listTextWrap: {
    flex: 1,
    gap: 3,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusLive: {
    backgroundColor: '#dcfce7',
  },
  statusDraft: {
    backgroundColor: '#e2e8f0',
  },
  statusText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  qualityTrack: {
    marginTop: 8,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  qualityFill: {
    height: '100%',
    borderRadius: 999,
  },
});

export default BannersCommandDeckScreen;
