'use client';

import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection } from '@bthwani/ui-kit';
import {
  getCampaignItems,
  getCampaignKpis,
  upsertCampaignItem,
  toggleCampaignStatus,
  duplicateCampaignItem,
  removeCampaignItem,
  type CampaignRecord,
  type CampaignStatus,
  type CampaignGoal,
  type CampaignAudience,
  type CampaignChannel,
  type CampaignPriority,
  type CampaignTargetType,
} from '../../shared/campaign-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

type EditorTab = 'plan' | 'audience' | 'channels' | 'schedule' | 'impact';

export function CampaignsCommandDeckScreen() {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  const [items, setItems] = React.useState<CampaignRecord[]>(() => getCampaignItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getCampaignItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState<Partial<CampaignRecord>>({});
  const [editorTab, setEditorTab] = React.useState<EditorTab>('plan');

  React.useEffect(() => {
    if (selected) {
      setDraft({ ...selected });
    } else {
      setDraft({
        title: '',
        subtitle: '',
        status: 'draft',
        priority: 'normal',
        goal: 'awareness',
        audience: 'all',
        channels: [],
        placement: 'hero',
        targetType: 'home',
        targetId: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [selectedId, items]);

  const kpis = React.useMemo(() => getCampaignKpis(), [items]);

  const refresh = () => setItems(getCampaignItems());

  const handleCreateNew = () => {
    setSelectedId(null);
    setEditorTab('plan');
  };

  const handleSave = () => {
    const saved = upsertCampaignItem(draft);
    refresh();
    setSelectedId(saved.id);
  };

  const handleToggle = (id: string) => {
    toggleCampaignStatus(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    removeCampaignItem(id);
    refresh();
    setSelectedId(getCampaignItems()[0]?.id ?? null);
  };

  const renderTargetIdOptions = () => {
    switch (draft.targetType) {
      case 'home':
      case 'stores':
      case 'search':
        return (
          <select
            value={draft.targetId}
            onChange={(e) => setDraft({ ...draft, targetId: e.target.value })}
            style={inlineStyles.selectInput}
          >
            <option value="">(تلقائي)</option>
          </select>
        );
      case 'category':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر الفئة --</option>
            <option value="food">طعام</option>
            <option value="grocery">مقاضي</option>
            <option value="health">صحة</option>
          </select>
        );
      case 'store':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- اختر المتجر --</option>
            <option value="store-1">متجر 1</option>
            <option value="store-2">متجر 2</option>
            <option value="store-3">متجر 3</option>
          </select>
        );
      default:
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput}>
            <option value="">-- غير متاح للنوع المختار --</option>
          </select>
        );
    }
  };

  const renderEditorContent = () => {
    switch (editorTab) {
      case 'plan':
        return (
          <Box gap={3}>
            <TextField label="عنوان الحملة" value={draft.title || ''} onChangeText={v => setDraft({ ...draft, title: v })} />
            <TextField label="الوصف" value={draft.subtitle || ''} onChangeText={v => setDraft({ ...draft, subtitle: v })} />
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الهدف</Text>
              <Tabs<CampaignGoal>
                items={[
                  { value: 'awareness', label: 'توعية' },
                  { value: 'conversion', label: 'تحويل' },
                  { value: 'retention', label: 'احتفاظ' },
                  { value: 'acquisition', label: 'استحواذ' },
                ]}
                value={draft.goal as CampaignGoal}
                onValueChange={v => setDraft({ ...draft, goal: v })}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الأولوية</Text>
              <Tabs<CampaignPriority>
                items={[
                  { value: 'low', label: 'منخفضة' },
                  { value: 'normal', label: 'عادية' },
                  { value: 'high', label: 'عالية' },
                  { value: 'critical', label: 'حرجة' },
                ]}
                value={draft.priority as CampaignPriority}
                onValueChange={v => setDraft({ ...draft, priority: v })}
                variant="pill"
              />
            </Box>
          </Box>
        );
      case 'audience':
        return (
          <Box gap={3}>
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الجمهور المستهدف</Text>
              <Tabs<CampaignAudience>
                items={[
                  { value: 'all', label: 'الجميع' },
                  { value: 'client', label: 'العملاء' },
                  { value: 'operations', label: 'العمليات' },
                  { value: 'targeted', label: 'مخصص' },
                ]}
                value={draft.audience as CampaignAudience}
                onValueChange={v => setDraft({ ...draft, audience: v })}
                variant="pill"
              />
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>نوع الوجهة (Target Type)</Text>
              <select
                value={draft.targetType}
                onChange={(e) => setDraft({ ...draft, targetType: e.target.value as CampaignTargetType, targetId: '' })}
                style={inlineStyles.selectInput}
              >
                <option value="home">الرئيسية (home)</option>
                <option value="stores">متاجر (stores)</option>
                <option value="store">متجر محدد (store)</option>
                <option value="category">فئة (category)</option>
                <option value="subcategory">فئة فرعية (subcategory)</option>
                <option value="product">منتج (product)</option>
                <option value="offer">عرض (offer)</option>
                <option value="campaign">حملة (campaign)</option>
                <option value="search">بحث (search)</option>
                <option value="custom">مخصص (custom)</option>
              </select>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>الوجهة المحددة</Text>
              {renderTargetIdOptions()}
            </Box>
          </Box>
        );
      case 'channels':
        return (
          <Box gap={3}>
            <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>القنوات المستخدمة</Text>
            <View style={[styles.chipsContainer, isRtl && styles.rowReverse]}>
              {(['banner', 'promo', 'video', 'ticker', 'store-card'] as CampaignChannel[]).map(ch => {
                const isActive = draft.channels?.includes(ch);
                return (
                  <Pressable
                    key={ch}
                    onPress={() => {
                      const current = draft.channels || [];
                      setDraft({
                        ...draft,
                        channels: isActive ? current.filter(c => c !== ch) : [...current, ch]
                      });
                    }}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{ch}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="معرف البنر المرتبط (اختياري)" value={draft.linkedBannerId || ''} onChangeText={v => setDraft({ ...draft, linkedBannerId: v })} dir="ltr" />
            <TextField label="معرف الفيديو المرتبط (اختياري)" value={draft.linkedVideoId || ''} onChangeText={v => setDraft({ ...draft, linkedVideoId: v })} dir="ltr" />
            <TextField label="معرف عرض الشريك (اختياري)" value={draft.linkedOfferId || ''} onChangeText={v => setDraft({ ...draft, linkedOfferId: v })} dir="ltr" />
            <TextField label="معرف ميزة الولاء (اختياري)" value={draft.linkedLoyaltyBenefitId || ''} onChangeText={v => setDraft({ ...draft, linkedLoyaltyBenefitId: v })} dir="ltr" />
          </Box>
        );
      case 'schedule':
        return (
          <Box gap={3}>
            <TextField label="تاريخ البدء" value={draft.startDate || ''} onChangeText={v => setDraft({ ...draft, startDate: v })} hint="مثال: 2026-05-01" dir="ltr" />
            <TextField label="تاريخ الانتهاء" value={draft.endDate || ''} onChangeText={v => setDraft({ ...draft, endDate: v })} hint="مثال: 2026-06-01" dir="ltr" />
            <Box gap={1}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>حالة الحملة</Text>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as CampaignStatus })}
                style={inlineStyles.selectInput}
              >
                <option value="draft">مسودة</option>
                <option value="pending">بانتظار الموافقة</option>
                <option value="published">منشورة</option>
                <option value="paused">موقوفة</option>
                <option value="archived">مؤرشفة</option>
              </select>
            </Box>
          </Box>
        );
      case 'impact': {
        const mockContext = {
          storeId: 'store-preview',
          activeOffers: [],
          activeSubscriptions: [],
          activeEntitlements: draft.linkedLoyaltyBenefitId ? [{ id: 'mock', type: 'reward', referenceId: draft.linkedLoyaltyBenefitId, status: 'active' }] as any : [],
          activeCampaigns: [draft as CampaignRecord],
        };
        const features = mapStoreCommercialFeatures(mockContext);

        return (
          <Box gap={3}>
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <h4 style={{ color: '#0A2F5C', margin: '0 0 12px 0', fontSize: '13px', fontWeight: '800' }}>مخرجات التأثير (Impact)</h4>
              <ul style={{ margin: 0, paddingInlineStart: '20px', color: '#475569', fontSize: '12px', lineHeight: '1.8' }}>
                <li><strong>الظهور:</strong> ستظهر هذه الحملة في <span style={{ color: '#FF500D' }}>{draft.targetType || 'غير محدد'}</span>.</li>
                <li><strong>الولاء:</strong> {draft.linkedLoyaltyBenefitId ? 'مرتبط بميزة ولاء فعالة.' : 'غير مرتبط بالولاء.'}</li>
                <li><strong>الشركاء:</strong> {draft.linkedOfferId ? 'مرتبط بعرض شريك.' : 'غير مرتبط.'}</li>
              </ul>
            </div>

            <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>محاكاة بطاقة المتجر (Store Card Parity)</Text>
            <CommercialParityPreview features={features} />
          </Box>
        );
      }
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <Box gap={4} style={{ padding: '24px' }}>
      {/* KPIs Header */}
      <View style={[styles.kpiRow, isRtl && styles.rowReverse]}>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">إجمالي الحملات</Text>
          <Text role="titleLg" style={{ color: '#0A2F5C' }}>{kpis.total}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">حي الآن</Text>
          <Text role="titleLg" style={{ color: '#16A34A' }}>{kpis.live}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">قيد المراجعة</Text>
          <Text role="titleLg" style={{ color: '#D97706' }}>{items.filter(i => i.status === 'pending').length}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">وصول تجريبي</Text>
          <Text role="titleLg" style={{ color: '#FF500D' }}>{kpis.impressions}</Text>
        </View>
      </View>

      <View style={[styles.mainLayout, isRtl && styles.rowReverse]}>
        {/* List Panel */}
        <Surface tone="raised" style={styles.listPanel}>
          <View style={[styles.listHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>الحملات ({items.length})</Text>
            <Button label="+ حملة" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={{ paddingHorizontal: 12, paddingVertical: 4, minHeight: 0 }} />
          </View>
          <ScrollView style={{ maxHeight: 450 }}>
            <Box gap={2} style={{ padding: 12 }}>
              {items.map(item => (
                <Pressable
                  key={item.id}
                  style={[styles.rowItem, selectedId === item.id && styles.rowItemSelected, isRtl && styles.rowReverse]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                    <Text role="bodyStrong" style={{ fontSize: 13, color: '#0A2F5C' }}>{item.title}</Text>
                    <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                      {item.goal} · {item.priority} · {item.channels.length} قنوات
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, item.status === 'published' && styles.statusBadgeActive]}>
                    <Text style={[styles.statusText, item.status === 'published' && styles.statusTextActive]}>{item.status}</Text>
                  </View>
                </Pressable>
              ))}
            </Box>
          </ScrollView>
        </Surface>

        {/* Editor Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={[styles.editorHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>{selected ? 'تعديل الحملة' : 'حملة جديدة'}</Text>
            {selected && (
              <View style={[styles.rowReverse, { gap: 8 }]}>
                <Button label={selected.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" fullWidth={false} onPress={() => handleToggle(selected.id)} />
                <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected.id)} />
              </View>
            )}
          </View>

          <Tabs<EditorTab>
            items={[
              { value: 'plan', label: 'الخطة' },
              { value: 'audience', label: 'الجمهور' },
              { value: 'channels', label: 'القنوات' },
              { value: 'schedule', label: 'الجدولة' },
              { value: 'impact', label: 'القياس' },
            ]}
            value={editorTab}
            onValueChange={setEditorTab}
            variant="line"
          />

          <Box gap={4} style={{ padding: 16 }}>
            {renderEditorContent()}
            <Box layoutDirection={isRtl ? 'row-reverse' : 'row'} justify="flex-end" style={{ marginTop: 16 }}>
              <Button label="حفظ التغييرات" onPress={handleSave} style={{ backgroundColor: '#FF500D' }} />
            </Box>
          </Box>
        </Surface>
      </View>
    </Box>
    </div>
  );
}

const inlineStyles = {
  selectInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#fff',
    color: '#0A2F5C',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
    outline: 'none',
  } as React.CSSProperties
};

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(10,47,92,0.06)',
    alignItems: 'center',
  },
  mainLayout: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  listPanel: {
    flex: 1,
    minWidth: 300,
    borderRadius: 20,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowItemSelected: {
    backgroundColor: '#fff',
    borderColor: '#FF500D',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  statusTextActive: {
    color: '#16A34A',
  },
  editorPanel: {
    flex: 2,
    minWidth: 400,
    borderRadius: 20,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  chipActive: {
    borderColor: '#0A2F5C',
    backgroundColor: '#0A2F5C',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#fff',
  },
});

export default CampaignsCommandDeckScreen;
