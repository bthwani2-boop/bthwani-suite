import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BthBox, BthButton, BthSurface, BthTabs, BthText, BthTextField, useDirection } from '@bthwani/ui-kit';
import {
  duplicateMarketingGrowthItem,
  getLiveMarketingGrowthItems,
  getMarketingGrowthItems,
  getMarketingGrowthKpis,
  removeMarketingGrowthItem,
  toggleMarketingGrowthStatus,
  upsertMarketingGrowthItem,
  type MarketingGrowthAudience,
  type MarketingGrowthFamily,
  type MarketingGrowthRecord,
  type MarketingGrowthRouteTarget,
  type MarketingGrowthStatus,
} from './growth-store';

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
  routeTarget: MarketingGrowthRouteTarget;
  ctaLabel: string;
  highlight: string;
  metricValue: string;
  accentColor: string;
};

function createDraft(item?: MarketingGrowthRecord | null): GrowthDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    family: item?.family ?? 'campaign',
    status: item?.status ?? 'draft',
    audience: item?.audience ?? 'client',
    routeTarget: item?.routeTarget ?? 'home',
    ctaLabel: item?.ctaLabel ?? 'فتح الآن',
    highlight: item?.highlight ?? '',
    metricValue: item?.metricValue ?? '',
    accentColor: item?.accentColor ?? '#f97316',
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
  if (status === 'paused') return 'موقوف';
  return 'مسودة';
}

function audienceLabel(audience: MarketingGrowthAudience) {
  if (audience === 'client') return 'واجهة العميل';
  if (audience === 'operations') return 'العمليات';
  return 'عام';
}

function routeTargetLabel(target: MarketingGrowthRouteTarget) {
  if (target === 'home') return 'الرئيسية';
  if (target === 'promo-apply') return 'تطبيق العروض';
  if (target === 'subscription-family-get') return 'إدارة الاشتراك';
  if (target === 'entitlements-get') return 'الاستحقاقات والمزايا';
  if (target === 'categories-list') return 'التصنيفات';
  return 'الرئيسية';
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
  const livePreview = React.useMemo(() => getLiveMarketingGrowthItems('client').slice(0, 4), [items]);

  function refresh() {
    setItems(getMarketingGrowthItems());
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingGrowthItem({ ...draft });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingGrowthRecord) {
    toggleMarketingGrowthStatus(item.id);
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
    <BthBox gap={4}>
      <BthSurface tone="raised" gap={3}>
        <BthText role="caption" style={styles.brandEyebrow}>العروض والاشتراكات الآن مملوكة للتسويق</BthText>
        <BthText role="titleLg">إغلاق البرومو والحملات والاشتراك داخل مسار واحد</BthText>
        <BthText role="bodySm" tone="muted">
          هذا السطح يجمع الحملات، الأكواد الترويجية، الاشتراكات، ومواضع الشورتات ثم يربطها بواجهة العميل ومساراتها الحية.
        </BthText>

        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          {[
            { label: 'إجمالي البرامج', value: kpis.total, color: '#2563eb' },
            { label: 'حي الآن', value: kpis.live, color: '#16a34a' },
            { label: 'اشتراكات', value: kpis.subscriptions, color: '#dc2626' },
            { label: 'حملات وبرومو', value: kpis.promotions, color: '#8b5cf6' },
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
              <BthText role="titleSm">المعاينة الحية في العميل</BthText>
              <BthButton label="برنامج جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} />
            </View>

            <View style={styles.previewStack}>
              {livePreview.map((item) => (
                <View key={item.id} style={[styles.previewCard, { backgroundColor: item.accentColor }]}>
                  <BthText role="caption" style={styles.previewBadge}>{familyLabel(item.family)}</BthText>
                  <BthText role="titleSm" style={styles.previewTitle}>{item.title}</BthText>
                  <BthText role="bodySm" style={styles.previewSubtitle}>{item.highlight}</BthText>
                </View>
              ))}
            </View>
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <BthText role="titleSm">برامج التسويق الحية</BthText>
              <BthText role="caption" tone="muted">{items.length} عنصر</BthText>
            </View>

            <BthBox gap={2}>
              {items.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.listCard, isSelected && styles.listCardSelected]}>
                    <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
                      <View style={styles.listTextWrap}>
                        <BthText role="titleSm">{item.title}</BthText>
                        <BthText role="bodySm" tone="muted">{item.subtitle}</BthText>
                      </View>
                      <View style={styles.statusPill}>
                        <BthText role="caption" style={styles.statusText}>{statusLabel(item.status)}</BthText>
                      </View>
                    </View>

                    <BthText role="caption" tone="muted">
                      {familyLabel(item.family)}
                      {' · '}
                      {routeTargetLabel(item.routeTarget)}
                      {' · '}
                      {audienceLabel(item.audience)}
                    </BthText>

                    <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
                      <BthButton label={item.status === 'published' ? 'إيقاف' : 'نشر'} tone="ghost" fullWidth={false} onPress={() => handleToggle(item)} />
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
            <BthText role="titleSm">تحرير البرنامج المحدد</BthText>

            <BthTabs<MarketingGrowthStatus>
              items={[
                { value: 'draft', label: 'مسودة' },
                { value: 'published', label: 'منشور' },
                { value: 'paused', label: 'موقوف' },
              ]}
              value={draft.status}
              onValueChange={(value) => setDraft((current) => ({ ...current, status: value }))}
              variant="pill"
            />

            <BthTabs<MarketingGrowthFamily>
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

            <BthTabs<MarketingGrowthAudience>
              items={[
                { value: 'client', label: 'العميل' },
                { value: 'operations', label: 'العمليات' },
                { value: 'all', label: 'الكل' },
              ]}
              value={draft.audience}
              onValueChange={(value) => setDraft((current) => ({ ...current, audience: value }))}
              variant="pill"
            />

            <BthTextField label="العنوان" value={draft.title} onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))} />
            <BthTextField label="الوصف" value={draft.subtitle} onChangeText={(value) => setDraft((current) => ({ ...current, subtitle: value }))} />

            <BthTabs<MarketingGrowthRouteTarget>
              items={[
                { value: 'home', label: 'الرئيسية' },
                { value: 'categories-list', label: 'التصنيفات' },
                { value: 'promo-apply', label: 'العروض' },
                { value: 'subscription-family-get', label: 'الاشتراك' },
                { value: 'entitlements-get', label: 'الاستحقاقات' },
              ]}
              value={draft.routeTarget}
              onValueChange={(value) => setDraft((current) => ({ ...current, routeTarget: value }))}
              variant="pill"
            />

            <BthSurface tone="inset" gap={2}>
              <BthText role="bodyStrong">الوجهة الحالية</BthText>
              <BthText role="bodySm" tone="muted">{routeTargetLabel(draft.routeTarget)} · يتم استخدام الربط التشغيلي الحقيقي داخليًا دون إظهار أكواد تطويرية مزعجة.</BthText>
            </BthSurface>

            <BthTextField label="نص الزر" value={draft.ctaLabel} onChangeText={(value) => setDraft((current) => ({ ...current, ctaLabel: value }))} />
            <BthTextField label="الجملة البارزة" value={draft.highlight} onChangeText={(value) => setDraft((current) => ({ ...current, highlight: value }))} />
            <BthTextField label="المؤشر التجاري" value={draft.metricValue} onChangeText={(value) => setDraft((current) => ({ ...current, metricValue: value }))} />
            <BthTextField label="لون التمييز" value={draft.accentColor} onChangeText={(value) => setDraft((current) => ({ ...current, accentColor: value }))} hint="مثال: #8b5cf6" />

            <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
              <BthButton label="حفظ البرنامج" fullWidth={false} onPress={handleSave} />
              {selected ? (
                <BthButton label={selected.status === 'published' ? 'إيقاف الآن' : 'نشر الآن'} tone="secondary" fullWidth={false} onPress={() => handleToggle(selected)} />
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
  statusText: {
    color: '#6d28d9',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});

export default GrowthCommandDeckScreen;
