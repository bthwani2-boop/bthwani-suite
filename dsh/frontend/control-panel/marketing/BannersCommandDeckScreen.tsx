"use client";

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection } from '@bthwani/ui-kit';
import { ControlPanelDshDecisionBoard } from '../shared';
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
} from '../../shared/banner-store';

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
};

function createDraft(item?: MarketingBannerRecord | null): BannerDraft {
  return {
    id: item?.id,
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    mediaKey: item?.mediaKey ?? '',
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
  if (actionType === 'sub_category') return 'فئة فرعية';
  if (actionType === 'store') return 'متجر';
  if (actionType === 'store_category') return 'قسم داخل متجر';
  if (actionType === 'product') return 'منتج محدد';
  if (actionType === 'external') return 'وجهة عامة';
  return 'اشتراك';
}

function bannerTargetLabel(target?: string) {
  if (!target) return 'وجهة مخصصة';
  if (target === 'DshStoresList') return 'قائمة المتاجر';
  if (target.startsWith('store-')) return 'متجر محدد';
  if (target.startsWith('item-')) return 'منتج محدد';
  if (target === 'fresh' || target === 'dairy' || target === 'bakery') return 'قسم داخل متجر';
  if (target.includes('restaurant')) return 'فئة المطاعم';
  if (target.includes('subscription')) return 'صفحة الاشتراك';
  return 'وجهة مخصصة';
}

function bannerActionPrimaryLabel(actionType: MarketingBannerActionType) {
  if (actionType === 'store_category') return 'معرّف المتجر';
  if (actionType === 'product') return 'معرّف المنتج';
  if (actionType === 'store') return 'معرّف المتجر';
  if (actionType === 'main_category' || actionType === 'sub_category') return 'معرّف الفئة';
  return 'الوجهة التسويقية';
}

function bannerActionPrimaryHint(actionType: MarketingBannerActionType) {
  if (actionType === 'main_category') return 'مثال: restaurants';
  if (actionType === 'sub_category') return 'مثال: grocery';
  if (actionType === 'store') return 'مثال: store-1001';
  if (actionType === 'store_category') return 'مثال: store-1001';
  if (actionType === 'product') return 'مثال: item-apple-1';
  return 'مثال: DshStoresList أو shein';
}

function bannerActionExtraLabel(actionType: MarketingBannerActionType) {
  if (actionType === 'store_category') return 'معرّف الفئة داخل المتجر';
  if (actionType === 'product') return 'معرّف المتجر';
  return 'تفصيل إضافي';
}

function bannerActionExtraHint(actionType: MarketingBannerActionType) {
  if (actionType === 'store_category') return 'مثال: fresh أو dairy أو bakery';
  if (actionType === 'product') return 'مثال: store-1001';
  return 'اختياري';
}

export function BannersCommandDeckScreen({ activeSubTab = 'all' }: BannersCommandDeckScreenProps) {
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

  const qualityFeedback = React.useMemo(() => {
    const fb = [];
    if (!draft.title || draft.title.length <= 5) fb.push({ label: 'العنوان قصير جداً', tone: 'warning' });
    else fb.push({ label: 'العنوان مثالي', tone: 'success' });

    if (!draft.subtitle || draft.subtitle.length <= 10) fb.push({ label: 'الوصف يحتاج تفاصيل أكثر', tone: 'warning' });
    else fb.push({ label: 'الوصف واضح ومختصر', tone: 'success' });

    if (!draft.imageUrl) fb.push({ label: 'الصورة مفقودة', tone: 'error' });
    else fb.push({ label: 'تم ضبط الصورة', tone: 'success' });

    if (draft.actionType === 'external') fb.push({ label: 'يفضل استخدام وجهة داخلية للتحويل', tone: 'info' });
    else fb.push({ label: 'الوجهة ذكية وسريعة', tone: 'success' });

    return fb;
  }, [draft]);

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
      mediaKey: draft.mediaKey,
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
    if (!confirm('هل أنت متأكد من حذف هذا البنر؟')) return;
    removeMarketingBannerItem(item.id);
    refresh();
    const nextItems = getMarketingBannerItems();
    setSelectedId(nextItems[0]?.id ?? null);
  }

  const renderContent = () => {
    if (activeSubTab === 'preview') {
      return (
        <Surface tone="inset" gap={4} style={{ padding: 32, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 24 }}>
          <Text role="titleSm" style={{ color: '#0A2F5C', fontWeight: '800' }}>معاينة تجربة الهاتف</Text>
          <View style={{ width: 320, height: 600, backgroundColor: '#fff', borderRadius: 40, borderWidth: 8, borderColor: '#334155', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
             {/* Mock App Header */}
             <div style={{ height: 100, backgroundColor: '#0A2F5C', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 12 }} />
                <div style={{ color: '#fff', fontSize: 16, fontWeight: '900' }}>BThwani</div>
             </div>

             <Box gap={4} style={{ padding: 12 }}>
                {/* THE ACTUAL BANNER PREVIEW */}
                <div style={{
                  height: 180,
                  backgroundColor: draft.accentColor || '#f97316',
                  borderRadius: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 16,
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}>
                  {draft.imageUrl && (
                    <img src={draft.imageUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: '800', marginBottom: 4 }}>
                      {draft.title || 'عرض'}
                    </div>
                    <Text role="titleSm" style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>{draft.subtitle || 'أضف وصفاً جذاباً للبنر هنا'}</Text>
                    <div style={{ marginTop: 8, backgroundColor: '#fff', color: draft.accentColor || '#f97316', padding: '4px 12px', borderRadius: 99, alignSelf: 'flex-start', fontSize: 10, fontWeight: '900' }}>
                      {draft.ctaLabel || 'اكتشف الآن'}
                    </div>
                  </div>
                </div>

                {/* Mock Feed Content */}
                <Box gap={2}>
                   <div style={{ height: 80, backgroundColor: '#F1F5F9', borderRadius: 16, border: '1px dashed #CBD5E1' }} />
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ height: 50, backgroundColor: '#F1F5F9', borderRadius: 12 }} />)}
                   </div>
                </Box>
             </Box>
          </View>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Text role="caption" tone="muted">هذه المعاينة تقريبية وتعتمد على قياسات شاشة الجوال القياسية.</Text>
          </div>
        </Surface>
      );
    }

    if (activeSubTab === 'audience') {
      return (
        <Box gap={4}>
          <Surface tone="raised" gap={6} style={{ padding: 32, borderRadius: 20 }}>
            <Box gap={1}>
              <Text role="titleSm" style={{ color: '#0A2F5C', fontWeight: '800' }}>ضبط استهداف الجمهور</Text>
              <Text role="caption" tone="muted">حدد من يمكنه رؤية هذا البنر في التطبيق.</Text>
            </Box>
            <Box gap={4}>
              <Box gap={2}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>الجمهور المشمول بالعرض</label>
                <Tabs<MarketingBannerAudience>
                  items={[
                    { value: 'all', label: 'الجميع' },
                    { value: 'home', label: 'عملاء الرئيسية' },
                    { value: 'stores', label: 'رواد المتاجر' },
                  ]}
                  value={draft.audience}
                  onValueChange={(value) => setDraft((current) => ({ ...current, audience: value }))}
                  variant="pill"
                />
              </Box>
              <Box gap={2}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>نوع الإجراء البرمجي</label>
                <Tabs<MarketingBannerActionType>
                  items={[
                    { value: 'store', label: 'فتح متجر' },
                    { value: 'product', label: 'فتح منتج' },
                    { value: 'main_category', label: 'فئة' },
                    { value: 'subscription', label: 'اشتراك' },
                    { value: 'external', label: 'خارجي' },
                  ]}
                  value={draft.actionType}
                  onValueChange={(value) => setDraft((current) => ({ ...current, actionType: value }))}
                  variant="pill"
                />
              </Box>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <TextField
                  label={bannerActionPrimaryLabel(draft.actionType)}
                  value={draft.actionTarget}
                  onChangeText={(value) => setDraft((current) => ({ ...current, actionTarget: value }))}
                  hint={bannerActionPrimaryHint(draft.actionType)}
                />
                <TextField
                  label={bannerActionExtraLabel(draft.actionType)}
                  value={draft.actionExtra}
                  onChangeText={(value) => setDraft((current) => ({ ...current, actionExtra: value }))}
                  hint={bannerActionExtraHint(draft.actionType)}
                />
              </div>
            </Box>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
               <Button label="حفظ وتحديث الاستهداف" onPress={handleSave} />
            </div>
          </Surface>
        </Box>
      );
    }

    if (activeSubTab === 'quality') {
       return (
         <Surface tone="raised" gap={8} style={{ padding: 40, alignItems: 'center', borderRadius: 24 }}>
            <Box align="center" gap={1}>
              <div style={{ width: 120, height: 120, borderRadius: 60, border: `8px solid ${quality >= 80 ? '#16a34a' : '#f97316'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                <Text role="titleLg" style={{ fontSize: 32, fontWeight: '900', color: quality >= 80 ? '#16a34a' : '#f97316' }}>{quality}%</Text>
              </div>
              <Text role="titleSm" style={{ marginTop: 12, fontWeight: '800' }}>مؤشر الجودة</Text>
            </Box>

            <Box gap={3} style={{ width: '100%', maxWidth: 500 }}>
               {qualityFeedback.map((fb, idx) => (
                 <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', backgroundColor: fb.tone === 'success' ? '#F0FDF4' : fb.tone === 'warning' ? '#FFFBEB' : '#FEF2F2', borderRadius: 12, border: `1px solid ${fb.tone === 'success' ? '#BBF7D0' : fb.tone === 'warning' ? '#FEF3C7' : '#FECACA'}` }}>
                    <span style={{ fontSize: 16 }}>{fb.tone === 'success' ? '✅' : fb.tone === 'warning' ? '⚠️' : '❌'}</span>
                    <Text role="bodySm" style={{ fontWeight: '700', color: fb.tone === 'success' ? '#166534' : fb.tone === 'warning' ? '#92400E' : '#991B1B' }}>{fb.label}</Text>
                 </div>
               ))}
            </Box>

            <Box gap={2} style={{ maxWidth: 500, textAlign: 'center' }}>
               <Text role="caption" tone="muted">جودة البنر تؤثر بشكل مباشر على نسبة النقر (CTR) وظهورك في نتائج البحث الذكية.</Text>
            </Box>
         </Surface>
       );
    }

    return (
      <View style={[styles.columnsWrap, isRtl && styles.rowReverse]}>
        <View style={styles.column}>
          <Surface tone="raised" gap={3} style={{ borderRadius: 20 }}>
            <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
              <Text role="titleSm" style={{ fontWeight: '800' }}>قائمة البنرات</Text>
              <div style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: 6 }}>
                <Text role="caption" style={{ fontWeight: '800' }}>{items.length}</Text>
              </div>
            </View>
            <Box gap={2} style={{ maxHeight: 600, overflowY: 'auto' }}>
              {items.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedId(item.id)}
                    style={[styles.listCard, isSelected && styles.listCardSelected]}
                  >
                    <View style={[styles.headerRow, isRtl && styles.rowReverse]}>
                      <View style={styles.listTextWrap}>
                        <Text role="titleSm" style={{ fontWeight: isSelected ? '900' : '700' }}>{item.title}</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: '#64748B' }}>{bannerActionTypeLabel(item.actionType)}</span>
                          <span style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
                          <span style={{ fontSize: 10, color: '#64748B' }}>{item.clicks} نقرة</span>
                        </div>
                      </View>
                      <div style={{ backgroundColor: item.status === 'published' ? '#DCFCE7' : '#F1F5F9', padding: '3px 8px', borderRadius: 6 }}>
                        <Text role="caption" style={{ fontWeight: '900', fontSize: 9, color: item.status === 'published' ? '#16A34A' : '#64748B' }}>{item.status === 'published' ? 'منشور' : 'مسودة'}</Text>
                      </div>
                    </View>
                  </Pressable>
                );
              })}
            </Box>
          </Surface>
        </View>

        <View style={styles.column} style={{ flex: 1.5 }}>
          <Surface tone="raised" gap={4} style={{ borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box gap={0}>
                <Text role="titleSm" style={{ fontWeight: '900' }}>تعديل بيانات البنر</Text>
                <Text role="caption" tone="muted">المعرّف الفرعي: {draft.id || 'جديد'}</Text>
              </Box>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button label="تكرار" tone="ghost" fullWidth={false} onPress={() => handleDuplicate(selected!)} />
                <Button label="حفظ التغييرات" fullWidth={false} onPress={handleSave} />
              </div>
            </div>

            <Box gap={4}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <TextField label="العنوان التسويقي" value={draft.title} onChangeText={(v) => setDraft(c => ({ ...c, title: v }))} />
                <TextField label="اسم الشريك/المصدر" value={draft.partnerName} onChangeText={(v) => setDraft(c => ({ ...c, partnerName: v }))} />
              </div>
              <TextField label="الوصف الجذاب" value={draft.subtitle} onChangeText={(v) => setDraft(c => ({ ...c, subtitle: v }))} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <TextField label="لون الهوية (Hex)" value={draft.accentColor} onChangeText={(v) => setDraft(c => ({ ...c, accentColor: v }))} />
                <TextField label="ترتيب الظهور" value={draft.position} onChangeText={(v) => setDraft(c => ({ ...c, position: v }))} />
                <TextField label="نص الزر (CTA)" value={draft.ctaLabel} onChangeText={(v) => setDraft(c => ({ ...c, ctaLabel: v }))} />
              </div>

              <TextField label="رابط الصورة (URL)" value={draft.imageUrl} onChangeText={(v) => setDraft(c => ({ ...c, imageUrl: v }))} hint="يفضل استخدام صور بنسبة 16:9 بجودة عالية" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                 <Box gap={1}>
                    <Text role="bodySm" style={{ fontWeight: '800' }}>حالة النشر</Text>
                    <Text role="caption" tone="muted">{draft.status === 'published' ? 'البنر متاح حالياً للعملاء' : 'البنر في وضع المسودة'}</Text>
                 </Box>
                  <Tabs<MarketingBannerStatus>
                    items={[{ value: 'draft', label: 'مسودة' }, { value: 'published', label: 'نشر مباشر' }]}
                    value={draft.status}
                    onValueChange={(v) => setDraft(c => ({ ...c, status: v }))}
                    variant="pill"
                  />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button label="حذف البنر" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected!)} style={{ color: '#991B1B' }} />
              </div>
            </Box>
          </Surface>
        </View>
      </View>
    );
  };

  return (
    <Box gap={4}>
      <Surface tone="raised" gap={4} style={{ borderRadius: 24, borderWidth: 1, borderColor: 'rgba(10,47,92,0.05)', overflow: 'hidden' }}>
        <View style={[styles.headerRow, isRtl && styles.rowReverse, { padding: 4 }]}>
          <Box gap={1}>
            <Text role="caption" style={{ color: '#FF500D', fontWeight: '800', letterSpacing: 1 }}>استوديو البنرات والكارسول</Text>
            <Text role="titleLg" style={{ fontSize: 24, fontWeight: '900', color: '#0A2F5C' }}>إدارة الحملات والبنرات</Text>
          </Box>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button label="إضافة بنر جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={{ borderRadius: 12, paddingHorizontal: 20, backgroundColor: '#0A2F5C', color: '#fff' }} />
          </div>
        </View>

        <View style={[styles.kpiGrid, isRtl && styles.rowReverse]}>
          {[
            { label: 'إجمالي البنرات', value: kpis.total, color: '#1E40AF', bg: '#EFF6FF' },
            { label: 'حي الآن', value: kpis.live, color: '#166534', bg: '#F0FDF4' },
            { label: 'الظهور الكلي', value: kpis.impressions, color: '#5B21B6', bg: '#F5F3FF' },
            { label: 'النقرات', value: kpis.clicks, color: '#991B1B', bg: '#FEF2F2' },
          ].map((entry) => (
            <View key={entry.label} style={[styles.kpiCard, { backgroundColor: entry.bg }]}>
              <Text role="caption" tone="muted" style={{ fontWeight: '700', fontSize: 10 }}>{entry.label}</Text>
              <Text role="titleLg" style={{ color: entry.color, fontWeight: '900', fontSize: 20 }}>{String(entry.value)}</Text>
            </View>
          ))}
        </View>
      </Surface>

      {renderContent()}
    </Box>
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
