"use client";

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection } from '@bthwani/ui-kit';
import {
  approveMarketingGrowthItem,
  duplicateMarketingGrowthItem,
  getLiveMarketingGrowthItems,
  getMarketingGrowthItems,
  getMarketingGrowthKpis,
  pauseMarketingGrowthItem,
  removeMarketingGrowthItem,
  submitMarketingGrowthItem,
  upsertMarketingGrowthItem,
  toggleMarketingGrowthStatus,
  type MarketingGrowthAudience,
  type MarketingGrowthFamily,
  type MarketingGrowthRecord,
  type MarketingGrowthSource,
  type MarketingGrowthRouteTarget,
  type MarketingGrowthStatus,
} from '../../shared/marketing/growth-store';

export type GrowthCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type GrowthDraft = {
  id?: string;
  title: string;
  subtitle: string;
  family: MarketingGrowthFamily;
  status: MarketingGrowthStatus;
  audience: MarketingGrowthAudience;
  source: MarketingGrowthSource;
  routeTarget: MarketingGrowthRouteTarget;
  routeTargetId: string;
  routeTargetExtra: string;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
  videoUrl: string;
  posterUrl: string;
};

function createDraft(item?: MarketingGrowthRecord | null): GrowthDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    family: item?.family ?? 'campaign',
    status: item?.status ?? 'draft',
    audience: item?.audience ?? 'client',
    source: item?.source ?? 'marketing',
    routeTarget: item?.routeTarget ?? 'home',
    routeTargetId: item?.routeTargetId ?? '',
    routeTargetExtra: item?.routeTargetExtra ?? '',
    ctaLabel: item?.ctaLabel ?? 'فتح الآن',
    highlight: item?.highlight ?? '',
    metricValue: item?.metricValue ?? '',
    accentColor: item?.accentColor ?? '#f97316',
    videoUrl: item?.videoUrl ?? '',
    posterUrl: item?.posterUrl ?? '',
  };
}

function familyLabel(family: MarketingGrowthFamily) {
  if (family === 'subscription') return 'اشتراك';
  if (family === 'promotion') return 'برومو';
  if (family === 'shorts') return 'شورتات';
  return 'حملة';
}

function statusLabel(status: MarketingGrowthStatus) {
  if (status === 'published') return 'منشور';
  if (status === 'pending-marketing') return 'بانتظار التسويق';
  if (status === 'paused') return 'موقوف';
  return 'مسودة';
}

function sourceLabel(source: MarketingGrowthSource) {
  if (source === 'partner') return 'من الشريك';
  return 'من التسويق';
}

function audienceLabel(audience: MarketingGrowthAudience) {
  if (audience === 'client') return 'واجهة العميل';
  if (audience === 'operations') return 'العمليات';
  return 'عام';
}

function routeTargetLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'home') return 'الرئيسية';
  if (target === 'main_category') return 'فئة رئيسية';
  if (target === 'sub_category') return 'فئة فرعية';
  if (target === 'store') return 'متجر';
  if (target === 'store_category') return 'متجر + فئة';
  if (target === 'product') return 'منتج';
  if (target === 'subscription') return 'اشتراك';
  if (target === 'search') return 'بحث';
  if (target === 'promo-apply') return 'تطبيق العروض';
  if (target === 'subscription-family-get') return 'إدارة الاشتراك';
  if (target === 'entitlements-get') return 'الاستحقاقات والمزايا';
  return 'الرئيسية';
}

function routeTargetPrimaryLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'store') return 'معرّف المتجر';
  if (target === 'product') return 'معرّف المنتج';
  return 'معرّف الفئة';
}

function routeTargetPrimaryHint(target: MarketingGrowthRouteTarget) {
  if (target === 'store') return 'مثال: store-1001';
  if (target === 'product') return 'مثال: item-apple-1';
  return 'مثال: grocery أو restaurants';
}

function routeTargetNeedsPrimaryInput(target: MarketingGrowthRouteTarget) {
  return target === 'main_category' || target === 'sub_category' || target === 'store' || target === 'store_category' || target === 'product';
}

function routeTargetNeedsSecondaryInput(target: MarketingGrowthRouteTarget) {
  return target === 'store_category' || target === 'product';
}

function routeTargetSecondaryLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'store_category') return 'معرّف الفئة';
  if (target === 'product') return 'معرّف المتجر';
  return 'معرّف إضافي';
}

function routeTargetSecondaryHint(target: MarketingGrowthRouteTarget) {
  if (target === 'store_category') return 'مثال: grocery_vegetables_fruits';
  if (target === 'product') return 'مثال: store-1001';
  return 'معرّف إضافي';
}

export function GrowthCommandDeckScreen(_: GrowthCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const [items, setItems] = React.useState<MarketingGrowthRecord[]>(() => getMarketingGrowthItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingGrowthItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find((item) => item.id === selectedId) ?? items[0] ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState<GrowthDraft>(() => createDraft(selected));

  React.useEffect(() => {
    setDraft(createDraft(selected));
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingGrowthKpis(), [items]);
  const livePreview = React.useMemo(
    () => getLiveMarketingGrowthItems('client').filter((item) => item.family === 'shorts').slice(0, 4),
    [items]
  );

  function refresh() {
    setItems(getMarketingGrowthItems());
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingGrowthItem({
      ...draft,
      status: draft.source === 'partner' ? 'pending-marketing' : draft.status,
    });
    refresh();
    setSelectedId(saved.id);
  }

  function handleApprove(item: MarketingGrowthRecord) {
    approveMarketingGrowthItem(item.id);
    refresh();
  }

  function handlePause(item: MarketingGrowthRecord) {
    pauseMarketingGrowthItem(item.id);
    refresh();
  }

  function handleToggle(item: MarketingGrowthRecord) {
    toggleMarketingGrowthStatus(item.id);
    refresh();
  }

  function handleQueue(item: MarketingGrowthRecord) {
    submitMarketingGrowthItem(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingGrowthRecord) {
    const duplicated = duplicateMarketingGrowthItem(item.id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
    }
  }

  function handleDelete(item: MarketingGrowthRecord) {
    removeMarketingGrowthItem(item.id);
    refresh();
    const next = getMarketingGrowthItems();
    setSelectedId(next[0]?.id ?? null);
  }

  return (
    <Box gap={4}>
      <Surface tone="raised" gap={3}>
        <Text role="caption" style={styles.brandEyebrow}>العروض والفيديوهات الآن مملوكة للتسويق</Text>
        <Text role="titleLg">إغلاق البرومو والفيديوهات والحملات والاشتراك داخل مسار واحد</Text>
        <Text role="bodySm" tone="muted">
          هذا السطح يجمع الحملات، الأكواد الترويجية، الاشتراكات، والفيديوهات القصيرة ثم يربطها بواجهة العميل ومساراتها الحية.
        </Text>

        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          {[
            { label: 'إجمالي البرامج', value: kpis.total, color: '#2563eb' },
            { label: 'حي الآن', value: kpis.live, color: '#16a34a' },
            { label: 'بانتظار الموافقة', value: kpis.pendingMarketing, color: '#f59e0b' },
            { label: 'اشتراكات', value: kpis.subscriptions, color: '#dc2626' },
            { label: 'حملات وبرومو', value: kpis.promotions, color: '#8b5cf6' },
          ].map((entry) => (
            <View key={entry.label} style={styles.kpiCard}>
              <Text role="caption" tone="muted">{entry.label}</Text>
              <Text role="titleLg" style={{ color: entry.color }}>{String(entry.value)}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={[styles.columnsWrap, isRtl && styles.rowReverse]}>
        <View style={styles.column}>
          <Surface tone="inset" gap={3}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm">المعاينة الحية في العميل</Text>
              <Button label="برنامج جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} />
            </View>

            {livePreview.length > 0 ? (
              <View style={styles.previewStack}>
                {livePreview.map((item) => (
                  <View key={item.id} style={[styles.previewCard, { backgroundColor: item.accentColor }]}>
                    <Text role="caption" style={styles.previewBadge}>{familyLabel(item.family)}</Text>
                    <Text role="titleSm" style={styles.previewTitle}>{item.title}</Text>
                    <Text role="bodySm" style={styles.previewSubtitle}>{item.highlight}</Text>
                    <Text role="caption" style={styles.previewMeta}>{sourceLabel(item.source)} · {item.ctaLabel}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Surface tone="inset" gap={2}>
                <Text role="bodySm" tone="muted">لا توجد فيديوهات معتمدة بعد. سيظهر هنا فقط ما وافق عليه التسويق.</Text>
              </Surface>
            )}
          </Surface>

          <Surface tone="raised" gap={3}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm">برامج التسويق الحية</Text>
              <Text role="caption" tone="muted">{items.length} عنصر</Text>
            </View>

            <Box gap={2}>
              {items.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.listCard, isSelected && styles.listCardSelected]}>
                    <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
                      <View style={styles.listTextWrap}>
                        <Text role="titleSm">{item.title}</Text>
                        <Text role="bodySm" tone="muted">{item.subtitle}</Text>
                      </View>
                      <View style={styles.statusStack}>
                        <View style={styles.statusPill}>
                          <Text role="caption" style={styles.statusText}>{statusLabel(item.status)}</Text>
                        </View>
                        <View style={styles.sourcePill}>
                          <Text role="caption" style={styles.sourceText}>{sourceLabel(item.source)}</Text>
                        </View>
                      </View>
                    </View>

                    <Text role="caption" tone="muted">
                      {familyLabel(item.family)}
                      {' · '}
                      {routeTargetLabel(item.routeTarget)}
                      {' · '}
                      {audienceLabel(item.audience)}
                    </Text>

                    <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
                      <Button
                        label={item.status === 'pending-marketing' ? 'اعتماد للنشر' : item.status === 'published' ? 'إيقاف' : 'إرسال للمراجعة'}
                        tone={item.status === 'published' ? 'ghost' : 'secondary'}
                        fullWidth={false}
                        onPress={() => (item.status === 'pending-marketing' ? handleApprove(item) : item.status === 'published' ? handlePause(item) : handleQueue(item))}
                      />
                      <Button label="نسخ" tone="ghost" fullWidth={false} onPress={() => handleDuplicate(item)} />
                      <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(item)} />
                    </View>
                  </Pressable>
                );
              })}
            </Box>
          </Surface>
        </View>

        <View style={styles.column}>
          <Surface tone="raised" gap={3}>
            <Text role="titleSm">تحرير البرنامج المحدد</Text>

            <Tabs<MarketingGrowthStatus>
              items={[
                { value: 'draft', label: 'مسودة' },
                { value: 'pending-marketing', label: 'بانتظار التسويق' },
                { value: 'published', label: 'منشور' },
                { value: 'paused', label: 'موقوف' },
              ]}
              value={draft.status}
              onValueChange={(value) => setDraft((current) => ({ ...current, status: value }))}
              variant="pill"
            />

            <Tabs<MarketingGrowthSource>
              items={[
                { value: 'marketing', label: 'التسويق' },
                { value: 'partner', label: 'الشريك' },
              ]}
              value={draft.source}
              onValueChange={(value) => setDraft((current) => ({ ...current, source: value }))}
              variant="pill"
            />

            <Tabs<MarketingGrowthFamily>
              items={[
                { value: 'campaign', label: 'حملة' },
                { value: 'promotion', label: 'برومو' },
                { value: 'subscription', label: 'اشتراك' },
                { value: 'shorts', label: 'شورتات' },
              ]}
              value={draft.family}
              onValueChange={(value) => setDraft((current) => ({ ...current, family: value }))}
              variant="pill"
            />

            <Tabs<MarketingGrowthAudience>
              items={[
                { value: 'client', label: 'العميل' },
                { value: 'operations', label: 'العمليات' },
                { value: 'all', label: 'الكل' },
              ]}
              value={draft.audience}
              onValueChange={(value) => setDraft((current) => ({ ...current, audience: value }))}
              variant="pill"
            />

            <TextField label="العنوان" value={draft.title} onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <TextField label="الوصف" value={draft.subtitle} onChangeText={(value) => setDraft((current) => ({ ...current, subtitle: value }))} />
            <TextField label="رابط الفيديو" value={draft.videoUrl} onChangeText={(value) => setDraft((current) => ({ ...current, videoUrl: value }))} hint="مثال: /media/shorts/launch.mp4" />
            <TextField label="صورة الغلاف" value={draft.posterUrl} onChangeText={(value) => setDraft((current) => ({ ...current, posterUrl: value }))} hint="مثال: /media/shorts/launch.jpg" />

            <Tabs<MarketingGrowthRouteTarget>
              items={[
                { value: 'home', label: 'الرئيسية' },
                { value: 'main_category', label: 'فئة رئيسية' },
                { value: 'sub_category', label: 'فئة فرعية' },
                { value: 'store', label: 'متجر' },
                { value: 'store_category', label: 'متجر + فئة' },
                { value: 'product', label: 'منتج' },
                { value: 'subscription', label: 'اشتراك' },
                { value: 'search', label: 'بحث' },
              ]}
              value={draft.routeTarget}
              onValueChange={(value) => setDraft((current) => ({ ...current, routeTarget: value }))}
              variant="pill"
            />

            <Surface tone="inset" gap={2}>
              <Text role="bodyStrong">الوجهة الحالية</Text>
              <Text role="bodySm" tone="muted">{routeTargetLabel(draft.routeTarget)} · هذا هو المسار الذي يفتحه CTA داخل الفيديو.</Text>
            </Surface>

            {routeTargetNeedsPrimaryInput(draft.routeTarget) ? (
              <TextField
                label={routeTargetPrimaryLabel(draft.routeTarget)}
                value={draft.routeTargetId}
                onChangeText={(value) => setDraft((current) => ({ ...current, routeTargetId: value }))}
                hint={routeTargetPrimaryHint(draft.routeTarget)}
              />
            ) : null}

            {routeTargetNeedsSecondaryInput(draft.routeTarget) ? (
              <TextField
                label={routeTargetSecondaryLabel(draft.routeTarget)}
                value={draft.routeTargetExtra}
                onChangeText={(value) => setDraft((current) => ({ ...current, routeTargetExtra: value }))}
                hint={routeTargetSecondaryHint(draft.routeTarget)}
              />
            ) : null}

            <TextField label="نص الزر" value={draft.ctaLabel} onChangeText={(value) => setDraft((current) => ({ ...current, ctaLabel: value }))} />
            <TextField label="الجملة البارزة" value={draft.highlight} onChangeText={(value) => setDraft((current) => ({ ...current, highlight: value }))} />
            <TextField label="المؤشر التجاري" value={draft.metricValue} onChangeText={(value) => setDraft((current) => ({ ...current, metricValue: value }))} />
            <TextField label="لون التمييز" value={draft.accentColor} onChangeText={(value) => setDraft((current) => ({ ...current, accentColor: value }))} hint="مثال: #8b5cf6" />

            <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
              <Button label="حفظ البرنامج" fullWidth={false} onPress={handleSave} />
              {selected ? (
                <Button label={selected.status === 'published' ? 'إيقاف الآن' : 'نشر الآن'} tone="secondary" fullWidth={false} onPress={() => handleToggle(selected)} />
              ) : null}
            </View>
          </Surface>
        </View>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  brandEyebrow: {
    color: '#8b5cf6',
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
    minHeight: 110,
    justifyContent: 'flex-end',
    gap: 6,
  },
  previewBadge: {
    color: 'rgba(255,255,255,0.92)',
  },
  previewTitle: {
    color: '#ffffff',
    fontWeight: '800',
  },
  previewSubtitle: {
    color: 'rgba(255,255,255,0.92)',
  },
  previewMeta: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '700',
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
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
  },
  listTextWrap: {
    flex: 1,
    gap: 3,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ede9fe',
  },
  sourcePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ecfeff',
  },
  statusStack: {
    gap: 6,
    alignItems: 'flex-end',
  },
  statusText: {
    color: '#6d28d9',
    fontWeight: '700',
  },
  sourceText: {
    color: '#0f766e',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});

export default GrowthCommandDeckScreen;
