'use client';

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
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
} from '../../shared/campaign.preview-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';
import type { Entitlement } from '../../shared/loyalty.preview-store';

type EditorTab = 'plan' | 'audience' | 'channels' | 'schedule' | 'impact';

const campaignsPageSize = 5;

export function CampaignsCommandDeckScreen() {
  const [items, setItems] = React.useState<CampaignRecord[]>(() => getCampaignItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getCampaignItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState<Partial<CampaignRecord>>({});
  const [editorTab, setEditorTab] = React.useState<EditorTab>('plan');
  const [campaignsPage, setCampaignsPage] = React.useState(1);

  React.useEffect(() => {
    if (selected) {
			setDraft({ ...selected, placement: selected.placement === 'hero' ? 'banner' : selected.placement });
    } else {
      setDraft({
        title: '',
        subtitle: '',
        status: 'draft',
        priority: 'normal',
        goal: 'awareness',
        audience: 'all',
        channels: [],
        placement: 'banner',
        targetType: 'home',
        targetId: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [selectedId, items]);

  const kpis = React.useMemo(() => getCampaignKpis(), [items]);

  const refresh = () => setItems(getCampaignItems());

  const totalPages = Math.max(1, Math.ceil(items.length / campaignsPageSize));
  const visibleItems = React.useMemo(() => {
    const startIndex = (campaignsPage - 1) * campaignsPageSize;
    return items.slice(startIndex, startIndex + campaignsPageSize);
  }, [campaignsPage, items]);

  React.useEffect(() => {
    setCampaignsPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }

    if (selectedId && items.some((item) => item.id === selectedId)) {
      return;
    }

    setSelectedId(items[0].id);
  }, [items, selectedId]);

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

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateCampaignItem(id);
    refresh();
    if (duplicated) {
      setSelectedId(duplicated.id);
      setEditorTab('plan');
    }
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
            dir="rtl"
          >
            <option value="">(تلقائي)</option>
          </select>
        );
      case 'category':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput} dir="rtl">
            <option value="">-- اختر الفئة --</option>
            <option value="food">طعام</option>
            <option value="grocery">مقاضي</option>
            <option value="health">صحة</option>
          </select>
        );
      case 'store':
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput} dir="rtl">
            <option value="">-- اختر المتجر --</option>
            <option value="store-1">متجر 1</option>
            <option value="store-2">متجر 2</option>
            <option value="store-3">متجر 3</option>
          </select>
        );
      default:
        return (
          <select value={draft.targetId} onChange={(e) => setDraft({ ...draft, targetId: e.target.value })} style={inlineStyles.selectInput} dir="rtl">
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
            <TextField label="عنوان الحملة" value={draft.title || ''} onChangeText={v => setDraft({ ...draft, title: v })} style={{ textAlign: 'right' }} />
            <TextField label="الوصف" value={draft.subtitle || ''} onChangeText={v => setDraft({ ...draft, subtitle: v })} style={{ textAlign: 'right' }} />
            <Box gap={1}>
              <Text role="caption" tone="muted" style={styles.labelTitle}>الهدف</Text>
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
              <Text role="caption" tone="muted" style={styles.labelTitle}>الأولوية</Text>
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
              <Text role="caption" tone="muted" style={styles.labelTitle}>الجمهور المستهدف</Text>
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
              <Text role="caption" tone="muted" style={styles.labelTitle}>نوع الوجهة</Text>
              <select
                value={draft.targetType}
                onChange={(e) => setDraft({ ...draft, targetType: e.target.value as CampaignTargetType, targetId: '' })}
                style={inlineStyles.selectInput}
                dir="rtl"
              >
                <option value="home">الرئيسية</option>
                <option value="stores">متاجر</option>
                <option value="store">متجر محدد</option>
                <option value="category">فئة</option>
                <option value="subcategory">فئة فرعية</option>
                <option value="product">منتج</option>
                <option value="offer">عرض</option>
                <option value="campaign">حملة</option>
                <option value="search">بحث</option>
                <option value="custom">مخصص</option>
              </select>
            </Box>
            <Box gap={1}>
              <Text role="caption" tone="muted" style={styles.labelTitle}>الوجهة المحددة</Text>
              {renderTargetIdOptions()}
            </Box>
          </Box>
        );
      case 'channels':
        return (
          <Box gap={3}>
            <Text role="caption" tone="muted" style={styles.labelTitle}>القنوات المستخدمة</Text>
            <View style={styles.chipsContainer}>
              {(['banner', 'promo', 'video', 'ticker', 'store-card'] as CampaignChannel[]).map(ch => {
                const isActive = draft.channels?.includes(ch);
                const arabicLabels: Record<string, string> = {
                  'banner': 'بنر',
                  'promo': 'عرض ترويجي',
                  'video': 'فيديو',
                  'ticker': 'شريط إخباري',
                  'store-card': 'بطاقة متجر'
                };
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
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{arabicLabels[ch] || ch}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="معرف البنر المرتبط (اختياري)" value={draft.linkedBannerId || ''} onChangeText={v => setDraft({ ...draft, linkedBannerId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف الفيديو المرتبط (اختياري)" value={draft.linkedVideoId || ''} onChangeText={v => setDraft({ ...draft, linkedVideoId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف عرض الشريك (اختياري)" value={draft.linkedOfferId || ''} onChangeText={v => setDraft({ ...draft, linkedOfferId: v })} style={{ textAlign: 'left' }} />
            <TextField label="معرف ميزة الولاء (اختياري)" value={draft.linkedLoyaltyBenefitId || ''} onChangeText={v => setDraft({ ...draft, linkedLoyaltyBenefitId: v })} style={{ textAlign: 'left' }} />
          </Box>
        );
      case 'schedule':
        return (
          <Box gap={3}>
            <TextField label="تاريخ البدء" value={draft.startDate || ''} onChangeText={v => setDraft({ ...draft, startDate: v })} hint="مثال: 2026-05-01" style={{ textAlign: 'left' }} />
            <TextField label="تاريخ الانتهاء" value={draft.endDate || ''} onChangeText={v => setDraft({ ...draft, endDate: v })} hint="مثال: 2026-06-01" style={{ textAlign: 'left' }} />
            <Box gap={1}>
              <Text role="caption" tone="muted" style={styles.labelTitle}>حالة الحملة</Text>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as CampaignStatus })}
                style={inlineStyles.selectInput}
                dir="rtl"
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
          activeEntitlements: draft.linkedLoyaltyBenefitId ? [{ id: 'mock', type: 'reward', referenceId: draft.linkedLoyaltyBenefitId, status: 'active' } as Entitlement] : [],
          activeCampaigns: [draft as CampaignRecord],
        };
        const features = mapStoreCommercialFeatures(mockContext);

        return (
          <Box gap={3}>
            <div style={inlineStyles.impactBox}>
              <h4 style={inlineStyles.impactTitle}>مخرجات التأثير</h4>
              <ul style={inlineStyles.impactList}>
                <li><strong>الظهور:</strong> ستظهر هذه الحملة في <span style={{ color: '#FF500D' }}>{draft.targetType || 'غير محدد'}</span>.</li>
                <li><strong>الولاء:</strong> {draft.linkedLoyaltyBenefitId ? 'مرتبط بميزة ولاء فعالة.' : 'غير مرتبط بالولاء.'}</li>
                <li><strong>الشركاء:</strong> {draft.linkedOfferId ? 'مرتبط بعرض شريك.' : 'غير مرتبط.'}</li>
              </ul>
            </div>

            <Text role="caption" tone="muted" style={styles.labelTitle}>محاكاة بطاقة المتجر</Text>
            <CommercialParityPreview features={features} />
          </Box>
        );
      }
    }
  };

  const getStatusArabic = (status: string) => {
    switch(status) {
      case 'draft': return 'مسودة';
      case 'pending': return 'بانتظار الموافقة';
      case 'published': return 'منشورة';
      case 'paused': return 'موقوفة';
      case 'archived': return 'مؤرشفة';
      default: return status;
    }
  };

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
      {/* KPIs Header */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>إجمالي الحملات</Text>
          <Text role="titleLg" style={{ color: '#0A2F5C', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.total}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>حي الآن</Text>
          <Text role="titleLg" style={{ color: '#16A34A', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.live}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>قيد المراجعة</Text>
          <Text role="titleLg" style={{ color: '#D97706', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{items.filter(i => i.status === 'pending').length}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" style={{ fontWeight: '800', color: '#64748B', textAlign: 'right', width: '100%' }}>وصول تجريبي</Text>
          <Text role="titleLg" style={{ color: '#FF500D', textAlign: 'right', width: '100%', fontSize: 20, fontWeight: '900', marginTop: 4 }}>{kpis.impressions}</Text>
        </View>
      </View>

      <View style={styles.mainLayout}>
        {/* List Panel */}
        <Surface tone="raised" style={styles.listPanel}>
          <View style={styles.panelHeader}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>الحملات ({items.length})</Text>
            <Button label="+ حملة جديدة" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={styles.smallButton} />
          </View>
          <Box gap={2} style={{ flex: 1, minHeight: 0, padding: 12 }}>
            {visibleItems.map(item => (
              <Pressable
                key={item.id}
                style={[styles.rowItem, selectedId === item.id && styles.rowItemSelected]}
                onPress={() => setSelectedId(item.id)}
              >
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text role="bodyStrong" style={{ fontSize: 13, color: '#0A2F5C', textAlign: 'right' }}>{item.title}</Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 11, textAlign: 'right' }}>
                    {item.goal} · {item.priority} · {item.channels.length} قنوات
                  </Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'published' && styles.statusBadgeActive]}>
                  <Text style={[styles.statusText, item.status === 'published' && styles.statusTextActive]}>{getStatusArabic(item.status)}</Text>
                </View>
              </Pressable>
            ))}
            <WebControlPanelCompactPager
				page={campaignsPage}
				totalPages={totalPages}
				summaryLabel={`عرض ${visibleItems.length} من ${items.length} حملات`}
				onPrevious={campaignsPage > 1 ? () => setCampaignsPage((currentPage) => currentPage - 1) : undefined}
				onNext={campaignsPage < totalPages ? () => setCampaignsPage((currentPage) => currentPage + 1) : undefined}
			/>
          </Box>
        </Surface>

        {/* Editor Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={styles.panelHeader}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>{selected ? 'تعديل الحملة' : 'حملة جديدة'}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {selected ? <Button label="نسخ" tone="ghost" fullWidth={false} onPress={() => handleDuplicate(selected.id)} style={styles.smallButton} /> : null}
              {selected ? <Button label={selected.status === 'published' ? 'إيقاف' : 'نشر'} tone="secondary" fullWidth={false} onPress={() => handleToggle(selected.id)} style={styles.smallButton} /> : null}
              {selected ? <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => handleDelete(selected.id)} style={styles.smallButtonTextRed} /> : null}
              <Button label="حفظ" onPress={handleSave} tone="primary" fullWidth={false} style={styles.smallButtonPrimary} />
            </View>
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

          <Box gap={4} style={{ padding: 16, flex: 1, minHeight: 0 }}>
            {renderEditorContent()}
          </Box>
        </Surface>
      </View>
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
    textAlign: 'right',
  } as React.CSSProperties,
  impactBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #E2E8F0',
    marginBottom: '16px'
  },
  impactTitle: {
    color: '#0A2F5C',
    margin: '0 0 12px 0',
    fontSize: '13px',
    fontWeight: '800',
    textAlign: 'right' as const,
  },
  impactList: {
    margin: 0,
    paddingInlineStart: '20px',
    color: '#475569',
    fontSize: '12px',
    lineHeight: '1.8',
    textAlign: 'right' as const,
  }
};

const styles = StyleSheet.create({
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(10,47,92,0.06)',
    alignItems: 'flex-start',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'stretch',
  },
  listPanel: {
    flex: 1,
    minWidth: 300,
    borderRadius: 16,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
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
    borderRadius: 16,
    borderColor: 'rgba(10,47,92,0.06)',
    borderWidth: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
  labelTitle: {
    fontWeight: '800',
    textAlign: 'right',
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 0,
  },
  smallButtonTextRed: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 0,
    color: '#DC2626',
  },
  smallButtonPrimary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 0,
    backgroundColor: '#0A2F5C',
  }
});

export default CampaignsCommandDeckScreen;
