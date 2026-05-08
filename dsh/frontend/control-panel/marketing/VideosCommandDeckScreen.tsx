"use client";

import React from 'react';
import { Pressable, StyleSheet, View, Image, ScrollView } from 'react-native';
import {
  Box,
  Button,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
  colorPalette,
  SelectField,
  SearchField
} from '@bthwani/ui-kit';
import {
  getMarketingVideoItems,
  getMarketingVideoKpis,
  upsertMarketingVideoItem,
  toggleMarketingVideoStatus,
  duplicateMarketingVideoItem,
  removeMarketingVideoItem,
  type MarketingVideoRecord,
  type MarketingVideoStatus,
  type MarketingVideoAudience,
  type MarketingVideoSource,
  type MarketingVideoTargetType,
} from '../../shared/video-store';
import { dshCategoryFixtures } from '../../app-client/dshCategoriesFixtures';
import { dshDiscoveryStores } from '../../app-client/discoveryFixtures';
import { storeItemsByStoreId } from '../../app-client/itemsFixtures';

export type VideosCommandDeckScreenProps = {
  hubHref?: string;
  operationsHref?: string;
};

type VideoDraft = {
  id?: string;
  title: string;
  subtitle: string;
  status: MarketingVideoStatus;
  audience: MarketingVideoAudience;
  source: MarketingVideoSource;
  videoUrl: string;
  posterUrl: string;
  durationSeconds: string;
  mute: boolean;
  autoplay: boolean;
  loop: boolean;
  ctaLabel: string;
  highlight: string;
  targetType: MarketingVideoTargetType;
  targetId: string;
  targetExtra: string;
  order: string;
  reviewState: 'none' | 'pending' | 'approved' | 'rejected';
};

function createDraft(item?: MarketingVideoRecord | null): VideoDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    status: item?.status ?? 'draft',
    audience: item?.audience ?? 'client',
    source: item?.source ?? 'marketing',
    videoUrl: item?.videoUrl ?? '',
    posterUrl: item?.posterUrl ?? '',
    durationSeconds: String(item?.durationSeconds ?? 15),
    mute: item?.mute ?? true,
    autoplay: item?.autoplay ?? true,
    loop: item?.loop ?? true,
    ctaLabel: item?.ctaLabel ?? 'اكتشف الآن',
    highlight: item?.highlight ?? '',
    targetType: item?.targetType ?? 'home',
    targetId: item?.targetId ?? 'home',
    targetExtra: item?.targetExtra ?? '',
    order: String(item?.order ?? 1),
    reviewState: item?.reviewState ?? 'none',
  };
}

const TARGET_TYPE_OPTIONS: Array<{ value: MarketingVideoTargetType; label: string; description: string }> = [
  { value: 'home', label: 'الرئيسية', description: 'يعيد المستخدم إلى واجهة DSH الرئيسية.' },
  { value: 'stores', label: 'المتاجر', description: 'يفتح قائمة المتاجر أو تجربة التصفح العامة.' },
  { value: 'store', label: 'متجر', description: 'يربط الفيديو بمتجر واحد محدد.' },
  { value: 'category', label: 'فئة', description: 'يربط الفيديو بفئة رئيسية داخل DSH.' },
  { value: 'subcategory', label: 'فئة فرعية', description: 'يفتح فئة فرعية بعد اختيار الفئة الأم.' },
  { value: 'product', label: 'منتج', description: 'يربط الفيديو بمنتج داخل متجر محدد.' },
  { value: 'offer', label: 'عرض', description: 'يعرض متجرًا فيه عرض نشط وملفت.' },
  { value: 'campaign', label: 'حملة', description: 'يفتح وجهة حملات عامة ضمن القناة الحالية.' },
  { value: 'search', label: 'بحث', description: 'يفتح واجهة البحث.' },
  { value: 'custom', label: 'مخصص', description: 'مسار محدود ومضبوط عندما لا تكفي الخيارات المنظمة.' },
  { value: 'loyalty', label: 'الولاء', description: 'ينتقل إلى نظام الولاء.' },
];

export function VideosCommandDeckScreen(_: VideosCommandDeckScreenProps) {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';
  const [items, setItems] = React.useState<MarketingVideoRecord[]>(() => getMarketingVideoItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMarketingVideoItems()[0]?.id ?? null);
  const selected = React.useMemo(() => (selectedId ? (items.find((item) => item.id === selectedId) ?? null) : null), [items, selectedId]);
  const [draft, setDraft] = React.useState<VideoDraft>(() => createDraft(selected));

  const [storeSearch, setStoreSearch] = React.useState('');
  const [categorySearch, setCategorySearch] = React.useState('');
  const [productStoreSearch, setProductStoreSearch] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');

  React.useEffect(() => {
    if (selected) {
      setDraft(createDraft(selected));
    }
  }, [selected]);

  const kpis = React.useMemo(() => getMarketingVideoKpis(), [items]);

  function refresh() {
    setItems(getMarketingVideoItems());
  }

  function handleCreateNew() {
    setSelectedId(null);
    setDraft(createDraft(null));
  }

  function handleSave() {
    const saved = upsertMarketingVideoItem({
      ...draft,
      durationSeconds: Number(draft.durationSeconds) || 0,
      order: Number(draft.order) || 0,
    });
    refresh();
    setSelectedId(saved.id);
  }

  function handleToggle(item: MarketingVideoRecord) {
    toggleMarketingVideoStatus(item.id);
    refresh();
  }

  function handleDuplicate(item: MarketingVideoRecord) {
    const duplicated = duplicateMarketingVideoItem(item.id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
    }
  }

  function handleDelete(item: MarketingVideoRecord) {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
    removeMarketingVideoItem(item.id);
    refresh();
    const next = getMarketingVideoItems();
    setSelectedId(next[0]?.id ?? null);
  }

  const statusLabel = (s: MarketingVideoStatus) => {
    if (s === 'published') return 'منشور';
    if (s === 'paused') return 'موقوف';
    if (s === 'review') return 'مراجعة';
    return 'مسودة';
  };

  const reviewStateLabel = (rs: string) => {
    if (rs === 'approved') return 'معتمد';
    if (rs === 'rejected') return 'مرفوض';
    if (rs === 'pending') return 'معلق';
    return 'غير مراجع';
  };

  // Helper for product store selection
  const getProductsForStore = (storeId: string) => storeItemsByStoreId[storeId] ?? [];

  return (
    <Box gap={4}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)' }}>
        <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
          <Box gap={1}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text role="caption" style={{ color: '#0A2F5C', fontWeight: '900', letterSpacing: 1 }}>استوديو الفيديو DSH v1</Text>
              <View style={{ backgroundColor: '#FF500D', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text role="caption" style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>احترافي</Text>
              </View>
            </View>
            <Text role="titleLg" style={{ fontSize: 28, fontWeight: '900', color: '#0A2F5C' }}>استوديو الفيديو التسويقي</Text>
          </Box>
          <Button label="+ فيديو جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={{ borderRadius: 12, paddingHorizontal: 24, height: 48 }} />
        </View>

        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          {[
            { label: 'إجمالي المحتوى', value: kpis.total, color: '#0A2F5C', bg: '#F8FAFC' },
            { label: 'نشط الآن', value: kpis.live, color: '#16A34A', bg: '#DCFCE7' },
            { label: 'قيد المراجعة', value: kpis.review, color: '#D97706', bg: '#FEF3C7' },
            { label: 'إجمالي الوصول', value: (kpis.impressions / 1000).toFixed(1) + 'K', color: '#0A2F5C', bg: '#F8FAFC' },
            { label: 'معدل التفاعل', value: kpis.impressions > 0 ? ((kpis.clicks / kpis.impressions) * 100).toFixed(1) + '%' : '0%', color: '#0A2F5C', bg: '#F8FAFC' },
          ].map((kpi) => (
            <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: kpi.bg, borderBottomWidth: 3, borderBottomColor: kpi.color + '22' }]}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800', fontSize: 11 }}>{kpi.label}</Text>
              <Text role="titleLg" style={{ color: kpi.color, fontWeight: '900', fontSize: 24 }}>{String(kpi.value)}</Text>
            </View>
          ))}
        </View>
      </Surface>

      <View style={[styles.columnsWrap, isRtl && styles.rowReverse]}>
        {/* List Column */}
        <View style={styles.column}>
          <Surface tone="raised" gap={3} style={{ borderRadius: 20 }}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm" style={{ fontWeight: '900' }}>مكتبة المحتوى</Text>
              <Text role="caption" tone="muted">{items.length} فيديوهات</Text>
            </View>
            <ScrollView style={{ maxHeight: 600 }}>
              <Box gap={2}>
                {items.map((item) => {
                  const isSelected = selected?.id === item.id;
                  return (
                    <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.listCard, isSelected && styles.listCardSelected]}>
                      <View style={[styles.headerRow, isRtl && styles.rowReverse, { alignItems: 'flex-start' }]}>
                        <View style={{ width: 70, height: 90, backgroundColor: '#000', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                          {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={{ width: '100%', height: '100%', opacity: 0.8 }} resizeMode="cover" /> : null}
                          <View style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 4, borderRadius: 2 }}>
                            <Text role="caption" style={{ color: '#fff', fontSize: 9 }}>{item.durationSeconds} ث</Text>
                          </View>
                        </View>
                        <View style={{ flex: 1, gap: 4 }}>
                          <Box layoutDirection="row" justify="space-between" align="center">
                            <Text role="bodyStrong" numberOfLines={1} style={{ fontSize: 15, color: '#0A2F5C' }}>{item.title}</Text>
                            <View style={[styles.statusPill, { backgroundColor: item.status === 'published' ? '#DCFCE7' : '#F1F5F9' }]}>
                              <Text role="caption" style={{ color: item.status === 'published' ? '#16A34A' : '#64748B', fontWeight: '900', fontSize: 9 }}>{statusLabel(item.status).toUpperCase()}</Text>
                            </View>
                          </Box>
                          <Text role="caption" tone="muted" numberOfLines={2}>{item.subtitle}</Text>
                          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                            <View style={styles.metaBadge}><Text style={styles.metaBadgeText}>{item.source === 'partner' ? '🤝 شريك' : '🎨 داخلي'}</Text></View>
                            <View style={styles.metaBadge}><Text style={styles.metaBadgeText}>📍 {TARGET_TYPE_OPTIONS.find(o => o.value === item.targetType)?.label}</Text></View>
                            <View style={[styles.metaBadge, { backgroundColor: item.reviewState === 'approved' ? '#ECFDF5' : '#FFF7ED' }]}><Text style={[styles.metaBadgeText, { color: item.reviewState === 'approved' ? '#059669' : '#D97706' }]}>{reviewStateLabel(item.reviewState)}</Text></View>
                          </View>
                        </View>
                      </View>
                      {isSelected && (
                        <View style={[styles.actionsRow, isRtl && styles.rowReverse, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }]}>
                          <Button label={item.status === 'published' ? 'إيقاف مؤقت' : 'تفعيل النشر'} tone={item.status === 'published' ? 'ghost' : 'secondary'} fullWidth={false} size="sm" onPress={() => handleToggle(item)} />
                          <Button label="نسخ كمسودة" tone="ghost" fullWidth={false} size="sm" onPress={() => handleDuplicate(item)} />
                          <Button label="حذف الفيديو" tone="ghost" fullWidth={false} size="sm" onPress={() => handleDelete(item)} style={{ color: '#DC2626' }} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </Box>
            </ScrollView>
          </Surface>
        </View>

        {/* Editor Column */}
        <View style={styles.column}>
          <Surface tone="raised" gap={4} style={{ borderRadius: 20 }}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm" style={{ fontWeight: '900' }}>محرر الفيديو الذكي</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button label="نسخة" tone="ghost" size="sm" onPress={() => selected && handleDuplicate(selected)} disabled={!selected} />
                <Button label="حذف" tone="ghost" size="sm" onPress={() => selected && handleDelete(selected)} disabled={!selected} />
              </View>
            </View>

            <Box gap={3}>
              <TextField label="العنوان التسويقي" value={draft.title} onChangeText={(v) => setDraft(d => ({ ...d, title: v }))} placeholder="مثال: خصومات الجمعة البيضاء" />
              <TextField label="وصف موجز" value={draft.subtitle} onChangeText={(v) => setDraft(d => ({ ...d, subtitle: v }))} placeholder="وصف يظهر أسفل العنوان في المعاينة" />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <TextField label="رابط الفيديو (MP4)" value={draft.videoUrl} onChangeText={(v) => setDraft(d => ({ ...d, videoUrl: v }))} placeholder="https://..." />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField label="رابط الغلاف (Poster)" value={draft.posterUrl} onChangeText={(v) => setDraft(d => ({ ...d, posterUrl: v }))} placeholder="https://..." />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <TextField label="المدة (ثانية)" value={draft.durationSeconds} onChangeText={(v) => setDraft(d => ({ ...d, durationSeconds: v }))} type="number" />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField label="الترتيب" value={draft.order} onChangeText={(v) => setDraft(d => ({ ...d, order: v }))} type="number" />
                </View>
              </View>

              <Box gap={2}>
                <Text role="caption" style={{ fontWeight: '900', color: '#64748B' }}>سلوك التشغيل</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  <Button label={draft.mute ? "صامت ✓" : "صوت"} tone={draft.mute ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, mute: !d.mute }))} />
                  <Button label={draft.autoplay ? "تشغيل تلقائي ✓" : "يدوي"} tone={draft.autoplay ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, autoplay: !d.autoplay }))} />
                  <Button label={draft.loop ? "تكرار ✓" : "مرة واحدة"} tone={draft.loop ? "secondary" : "ghost"} fullWidth={false} size="sm" onPress={() => setDraft(d => ({ ...d, loop: !d.loop }))} />
                </View>
              </Box>

              <Box gap={2}>
                <Text role="caption" style={{ fontWeight: '900', color: '#64748B' }}>الوجهة الذكية (Smart Target)</Text>
                <Tabs<MarketingVideoTargetType>
                  items={TARGET_TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
                  value={draft.targetType}
                  onValueChange={(v) => setDraft(d => ({ ...d, targetType: v }))}
                  variant="pill"
                />

                {/* Dynamic Target Selection UI */}
                <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: 12 }}>
                   {draft.targetType === 'store' && (
                     <SelectField
                       label="اختر المتجر"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={dshDiscoveryStores.map(s => ({ value: s.id, label: s.name }))}
                     />
                   )}
                   {draft.targetType === 'category' && (
                     <SelectField
                       label="اختر الفئة"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={dshCategoryFixtures.map(c => ({ value: c.id, label: c.label }))}
                     />
                   )}
                   {draft.targetType === 'product' && (
                     <Box gap={2}>
                        <SelectField
                          label="اختر متجر المنتج"
                          value={draft.targetExtra}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetExtra: v, targetId: getProductsForStore(v)[0]?.id ?? '' }))}
                          options={dshDiscoveryStores.filter(s => getProductsForStore(s.id).length > 0).map(s => ({ value: s.id, label: s.name }))}
                        />
                        <SelectField
                          label="اختر المنتج"
                          value={draft.targetId}
                          onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                          options={getProductsForStore(draft.targetExtra || dshDiscoveryStores[0].id).map(p => ({ value: p.id, label: p.name }))}
                        />
                     </Box>
                   )}
                   {draft.targetType === 'loyalty' && (
                     <SelectField
                       label="وجهة الولاء"
                       value={draft.targetId}
                       onValueChange={(v) => setDraft(d => ({ ...d, targetId: v }))}
                       options={[
                         { value: 'entitlements-get', label: 'المزايا والاستحقاقات' },
                         { value: 'loyalty-points', label: 'رصيد النقاط' },
                         { value: 'subscription-family', label: 'الاشتراك العائلي' },
                       ]}
                     />
                   )}
                   {['home', 'stores', 'search', 'offer', 'campaign', 'custom'].includes(draft.targetType) && (
                     <TextField label="معرف الوجهة / الرابط" value={draft.targetId} onChangeText={(v) => setDraft(d => ({ ...d, targetId: v }))} />
                   )}
                </Surface>
              </Box>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <TextField label="نص الزر (CTA)" value={draft.ctaLabel} onChangeText={(v) => setDraft(d => ({ ...d, ctaLabel: v }))} />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField label="الجملة البارزة" value={draft.highlight} onChangeText={(v) => setDraft(d => ({ ...d, highlight: v }))} />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label="المصدر"
                    value={draft.source}
                    onValueChange={(v) => setDraft(d => ({ ...d, source: v as any }))}
                    options={[
                      { value: 'marketing', label: 'فريق التسويق' },
                      { value: 'partner', label: 'الشريك / العلامة التجارية' },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label="الجمهور"
                    value={draft.audience}
                    onValueChange={(v) => setDraft(d => ({ ...d, audience: v as any }))}
                    options={[
                      { value: 'all', label: 'الكل' },
                      { value: 'client', label: 'واجهة العميل' },
                      { value: 'operations', label: 'العمليات' },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.actionsRow, isRtl && styles.rowReverse, { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 20 }]}>
                <Button label="حفظ مسودة الفيديو" tone="primary" fullWidth={false} onPress={handleSave} style={{ borderRadius: 10, paddingHorizontal: 32 }} />
                {selected && (
                  <Button
                    label={selected.status === 'published' ? 'إيقاف العرض' : 'نشر الآن'}
                    tone="secondary"
                    fullWidth={false}
                    onPress={() => handleToggle(selected)}
                    style={{ borderRadius: 10 }}
                  />
                )}
              </View>
            </Box>
          </Surface>

          {/* Premium Preview */}
          <Surface tone="inset" gap={3} style={{ borderRadius: 20, padding: 20, backgroundColor: '#0A2F5C' }}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" style={{ fontWeight: '900', color: '#fff' }}>المعاينة الحية (PREVIEW)</Text>
              <View style={{ backgroundColor: '#FF500D', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                <Text role="caption" style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>محاكاة مباشرة</Text>
              </View>
            </Box>

            <View style={styles.previewFrame}>
              {draft.posterUrl ? (
                <Image source={{ uri: draft.posterUrl }} style={styles.previewImage} resizeMode="cover" />
              ) : (
                <View style={[styles.previewImage, { backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 40 }}>🎬</Text>
                </View>
              )}

              <View style={styles.previewOverlay}>
                <View style={styles.previewTopBar}>
                  <View style={styles.previewBadge}><Text style={styles.previewBadgeText}>{draft.highlight || 'عرض جديد'}</Text></View>
                  <View style={styles.previewTime}><Text style={styles.previewTimeText}>{draft.durationSeconds} ث</Text></View>
                </View>

                <View style={styles.previewBottomContent}>
                  <Box gap={1}>
                    <Text role="titleSm" style={{ color: '#fff', fontWeight: '900' }}>{draft.title || 'عنوان الفيديو يظهر هنا'}</Text>
                    <Text role="caption" style={{ color: '#fff', opacity: 0.9 }}>{draft.subtitle || 'وصف الفيديو يظهر هنا بشكل مختصر وجذاب'}</Text>
                  </Box>
                  <View style={styles.previewCta}>
                    <Text style={styles.previewCtaText}>{draft.ctaLabel}</Text>
                    <Text style={{ color: '#0A2F5C', fontSize: 12 }}>←</Text>
                  </View>
                </View>
              </View>

              <View style={styles.previewControls}>
                <View style={styles.previewProgress} />
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <View style={styles.previewIndicator} />
                  <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
                  <View style={[styles.previewIndicator, { opacity: 0.3 }]} />
                </View>
              </View>
            </View>

            <Box gap={1} align="center">
              <Text role="caption" style={{ color: '#fff', opacity: 0.6, fontSize: 10 }}>الوجهة: {TARGET_TYPE_OPTIONS.find(o => o.value === draft.targetType)?.label} · {draft.targetId}</Text>
            </Box>
          </Surface>
        </View>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowReverse: { flexDirection: 'row-reverse' },
  kpiGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  kpiCard: { minWidth: 130, flexGrow: 1, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  columnsWrap: { flexDirection: 'row', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' },
  column: { flex: 1, minWidth: 380, gap: 20 },
  listCard: { borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#fff', padding: 12, gap: 10, transition: 'all 0.2s' },
  listCardSelected: { borderColor: '#0A2F5C', backgroundColor: '#F8FAFC', shadowColor: '#0A2F5C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  actionsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  metaBadgeText: { fontSize: 10, fontWeight: '800', color: '#64748B' },

  previewFrame: {
    height: 480,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 8,
    borderColor: '#1E293B'
  },
  previewImage: { width: '100%', height: '100%', opacity: 0.8 },
  previewOverlay: { position: 'absolute', inset: 0, padding: 24, justifyContent: 'space-between' },
  previewTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewBadge: { backgroundColor: '#FF500D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  previewBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  previewTime: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  previewTimeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  previewBottomContent: { gap: 16 },
  previewCta: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewCtaText: { color: '#0A2F5C', fontWeight: '900', fontSize: 14 },
  previewControls: { position: 'absolute', bottom: 12, left: 24, right: 24, gap: 12 },
  previewProgress: { height: 3, backgroundColor: '#fff', borderRadius: 2, width: '40%' },
  previewIndicator: { width: 40, height: 2, backgroundColor: '#fff', borderRadius: 1 },
});

export default VideosCommandDeckScreen;
