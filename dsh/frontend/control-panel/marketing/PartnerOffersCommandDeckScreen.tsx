'use client';

import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Box, Button, Surface, Tabs, Text, TextField, useDirection } from '@bthwani/ui-kit';
import {
  getPartnerOfferItems,
  getPartnerOfferKpis,
  upsertPartnerOfferItem,
  approvePartnerOfferItem,
  publishPartnerOfferItem,
  pausePartnerOfferItem,
  removePartnerOfferItem,
  type PartnerOfferRecord,
  type PartnerOfferStatus,
  type PartnerOfferType,
  type PartnerOfferSource,
} from '../../shared/partner-offer-store';
import { mapStoreCommercialFeatures, CommercialParityPreview } from '../../shared/store-card-commercial-map';

export function PartnerOffersCommandDeckScreen() {
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  const [items, setItems] = React.useState<PartnerOfferRecord[]>(() => getPartnerOfferItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getPartnerOfferItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState<Partial<PartnerOfferRecord>>({});
  const [pipelineFilter, setPipelineFilter] = React.useState<PartnerOfferStatus | 'all'>('all');

  React.useEffect(() => {
    if (selected) {
      setDraft({ ...selected });
    } else {
      setDraft({
        title: '',
        partnerName: '',
        storeId: '',
        storeLabel: '',
        productId: '',
        productLabel: '',
        category: '',
        offerType: 'discount',
        status: 'inbound',
        source: 'partner',
        valueLabel: '',
        eligibility: '',
        displayBadge: '',
        marginRiskNote: '',
        linkedCampaignId: '',
        activeFromDate: '',
        activeToDate: '',
      });
    }
  }, [selectedId, items]);

  const kpis = React.useMemo(() => getPartnerOfferKpis(), [items]);

  const refresh = () => setItems(getPartnerOfferItems());

  const handleCreateNew = () => {
    setSelectedId(null);
  };

  const handleSave = () => {
    const saved = upsertPartnerOfferItem(draft);
    refresh();
    setSelectedId(saved.id);
  };

  const handleDuplicate = () => {
    if (!selected) return;
    const saved = upsertPartnerOfferItem({ ...selected, id: undefined, title: `${selected.title} — نسخة`, status: 'inbound' });
    refresh();
    setSelectedId(saved.id);
  };

  const setStatus = (id: string, newStatus: PartnerOfferStatus) => {
    upsertPartnerOfferItem({ ...items.find(i => i.id === id)!, status: newStatus });
    refresh();
  };

  const filteredItems = React.useMemo(() => {
    if (pipelineFilter === 'all') return items;
    return items.filter(i => i.status === pipelineFilter);
  }, [items, pipelineFilter]);

  const translateStatus = (status: PartnerOfferStatus) => {
    switch (status) {
      case 'inbound': return 'واردة';
      case 'review': return 'مراجعة';
      case 'marketing-ready': return 'جاهز للتسويق';
      case 'published': return 'منشور';
      case 'paused': return 'موقوف';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const renderActionButtons = () => {
    if (!selected) return null;
    const s = selected.status;
    return (
      <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
        {s === 'inbound' && <Button label="قبول للمراجعة" tone="secondary" fullWidth={false} onPress={() => setStatus(selected.id, 'review')} />}
        {s === 'review' && <Button label="جاهز للتسويق" tone="secondary" fullWidth={false} onPress={() => approvePartnerOfferItem(selected.id)} />}
        {s === 'marketing-ready' && <Button label="نشر الآن" style={{ backgroundColor: '#16A34A' }} fullWidth={false} onPress={() => publishPartnerOfferItem(selected.id)} />}
        {s === 'published' && <Button label="إيقاف" tone="secondary" fullWidth={false} onPress={() => pausePartnerOfferItem(selected.id)} />}
        {s === 'paused' && <Button label="إعادة النشر" style={{ backgroundColor: '#16A34A' }} fullWidth={false} onPress={() => publishPartnerOfferItem(selected.id)} />}

        {(s === 'inbound' || s === 'review') && <Button label="رفض" tone="ghost" fullWidth={false} onPress={() => setStatus(selected.id, 'rejected')} style={{ color: '#DC2626' }} />}

        <Button label="نسخ" tone="ghost" fullWidth={false} onPress={handleDuplicate} />
        <Button label="حذف" tone="ghost" fullWidth={false} onPress={() => { removePartnerOfferItem(selected.id); setSelectedId(null); }} style={{ color: '#DC2626' }} />
      </View>
    );
  };

  const renderStoreCardPreview = () => {
    const mockContext = {
      storeId: draft.storeId || 'store-preview',
      activeOffers: draft.id && draft.status === 'published' ? [draft as PartnerOfferRecord] : [draft as PartnerOfferRecord], // Show preview even if draft
      activeSubscriptions: [],
      activeEntitlements: [],
      activeCampaigns: [],
      catalogFeatures: { priceMatch: true },
    };
    const features = mapStoreCommercialFeatures(mockContext);

    return (
      <Box gap={2} style={styles.previewContainer}>
        <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>محاكاة بطاقة المتجر</Text>
        <CommercialParityPreview features={features} storeName={draft.storeLabel || draft.partnerName} />
      </Box>
    );
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <Box gap={4} style={{ padding: '24px' }}>
      {/* Header & KPIs */}
      <View style={[styles.kpiRow, isRtl && styles.rowReverse]}>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">واردة</Text>
          <Text role="titleLg" style={{ color: '#0A2F5C' }}>{kpis.inbound}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">مراجعة</Text>
          <Text role="titleLg" style={{ color: '#D97706' }}>{kpis.review}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">جاهز للتسويق</Text>
          <Text role="titleLg" style={{ color: '#0369A1' }}>{kpis.marketingReady}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">منشور</Text>
          <Text role="titleLg" style={{ color: '#16A34A' }}>{kpis.published}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text role="caption" tone="muted">مرفوض</Text>
          <Text role="titleLg" style={{ color: '#DC2626' }}>{kpis.rejected}</Text>
        </View>
      </View>

      {/* Pipeline Filter */}
      <Surface tone="inset" style={{ padding: 4, borderRadius: 12 }}>
        <Tabs<PartnerOfferStatus | 'all'>
          items={[
            { value: 'all', label: 'الكل' },
            { value: 'inbound', label: 'واردة' },
            { value: 'review', label: 'مراجعة' },
            { value: 'marketing-ready', label: 'جاهز للتسويق' },
            { value: 'published', label: 'منشور' },
          ]}
          value={pipelineFilter}
          onValueChange={setPipelineFilter}
          variant="pill"
        />
      </Surface>

      <View style={[styles.mainLayout, isRtl && styles.rowReverse]}>
        {/* Offers Table / List */}
        <Surface tone="raised" style={styles.listPanel}>
          <View style={[styles.listHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>العروض ({filteredItems.length})</Text>
            <Button label="+ عرض جديد" tone="secondary" fullWidth={false} onPress={handleCreateNew} style={{ paddingHorizontal: 12, paddingVertical: 4, minHeight: 0 }} />
          </View>
          <ScrollView style={{ maxHeight: 500 }}>
            <Box gap={2} style={{ padding: 12 }}>
              {filteredItems.map(item => (
                <Pressable
                  key={item.id}
                  style={[styles.rowItem, selectedId === item.id && styles.rowItemSelected, isRtl && styles.rowReverse]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                    <Text role="bodyStrong" style={{ fontSize: 13, color: '#0A2F5C' }}>{item.title}</Text>
                    <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                      {item.partnerName} · {item.offerType} · {item.source}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, item.status === 'published' && styles.statusBadgeActive]}>
                    <Text style={[styles.statusText, item.status === 'published' && styles.statusTextActive]}>{translateStatus(item.status)}</Text>
                  </View>
                </Pressable>
              ))}
            </Box>
          </ScrollView>
        </Surface>

        {/* Inspector / Editor Panel */}
        <Surface tone="raised" style={styles.editorPanel}>
          <View style={[styles.editorHeader, isRtl && styles.rowReverse]}>
            <Text role="titleSm" style={{ color: '#0A2F5C' }}>{selected ? 'مفتش العرض' : 'عرض جديد'}</Text>
            {renderActionButtons()}
          </View>

          <ScrollView style={{ maxHeight: 500 }}>
            <Box gap={4} style={{ padding: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <TextField label="عنوان العرض" value={draft.title || ''} onChangeText={v => setDraft({ ...draft, title: v })} />
                <TextField label="اسم الشريك (الشركة)" value={draft.partnerName || ''} onChangeText={v => setDraft({ ...draft, partnerName: v })} />

                <TextField label="معرف المتجر" value={draft.storeId || ''} onChangeText={v => setDraft({ ...draft, storeId: v })} dir="ltr" />
                <TextField label="اسم المتجر" value={draft.storeLabel || ''} onChangeText={v => setDraft({ ...draft, storeLabel: v })} />

                <TextField label="معرف المنتج" value={draft.productId || ''} onChangeText={v => setDraft({ ...draft, productId: v })} dir="ltr" />
                <TextField label="اسم المنتج" value={draft.productLabel || ''} onChangeText={v => setDraft({ ...draft, productLabel: v })} />

                <TextField label="التصنيف" value={draft.category || ''} onChangeText={v => setDraft({ ...draft, category: v })} />
                <TextField label="قيمة العرض" value={draft.valueLabel || ''} onChangeText={v => setDraft({ ...draft, valueLabel: v })} hint="مثال: خصم 20%" />

                <Box gap={1}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>نوع العرض</Text>
                  <select
                    value={draft.offerType}
                    onChange={(e) => setDraft({ ...draft, offerType: e.target.value as PartnerOfferType })}
                    style={inlineStyles.selectInput}
                  >
                    <option value="discount">خصم مباشر</option>
                    <option value="free-delivery">توصيل مجاني</option>
                    <option value="bundle">حزمة (Bundle)</option>
                    <option value="buy-x-get-y">اشتر واحصل على</option>
                    <option value="coupon">كوبون</option>
                  </select>
                </Box>

                <Box gap={1}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>المصدر</Text>
                  <select
                    value={draft.source}
                    onChange={(e) => setDraft({ ...draft, source: e.target.value as PartnerOfferSource })}
                    style={inlineStyles.selectInput}
                  >
                    <option value="partner">الشريك</option>
                    <option value="field">المبيعات الميدانية</option>
                    <option value="marketing">التسويق</option>
                    <option value="catalog">الكتالوج</option>
                  </select>
                </Box>

                <TextField label="الأهلية" value={draft.eligibility || ''} onChangeText={v => setDraft({ ...draft, eligibility: v })} />
                <TextField label="شارة العرض" value={draft.displayBadge || ''} onChangeText={v => setDraft({ ...draft, displayBadge: v })} />

                <TextField label="تاريخ البدء" value={draft.activeFromDate || ''} onChangeText={v => setDraft({ ...draft, activeFromDate: v })} dir="ltr" />
                <TextField label="تاريخ الانتهاء" value={draft.activeToDate || ''} onChangeText={v => setDraft({ ...draft, activeToDate: v })} dir="ltr" />
              </div>

              <TextField label="ملاحظات هامش الربح" value={draft.marginRiskNote || ''} onChangeText={v => setDraft({ ...draft, marginRiskNote: v })} hint="ملاحظات داخلية لفريق المالية/التسويق" />
              <TextField label="حملة مرتبطة" value={draft.linkedCampaignId || ''} onChangeText={v => setDraft({ ...draft, linkedCampaignId: v })} dir="ltr" />

              {renderStoreCardPreview()}

              <Box layoutDirection={isRtl ? 'row-reverse' : 'row'} justify="flex-end" style={{ marginTop: 8 }}>
                <Button label="حفظ المسودة / التعديلات" onPress={handleSave} style={{ backgroundColor: '#0A2F5C' }} />
              </Box>
            </Box>
          </ScrollView>
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
    backgroundColor: '#F8FAFC',
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
    gap: 12,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
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
    minWidth: 450,
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
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  previewContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  }
});

export default PartnerOffersCommandDeckScreen;
