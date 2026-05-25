'use client';

import React from 'react';
import { Box, Button, Surface, Tabs, Text, TextField, SelectField, ListItem, KeyValueList, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getPartnerOfferItems,
  getPartnerOfferKpis,
  upsertPartnerOfferItem,
  approvePartnerOfferItem,
  publishPartnerOfferItem,
  pausePartnerOfferItem,
  rejectPartnerOfferItem,
  archivePartnerOfferItem,
  removePartnerOfferItem,
  type PartnerOfferRecord,
  type PartnerOfferStatus,
  type PartnerOfferType,
  type PartnerOfferSource,
} from '../../data/partner-offer.preview-store';
import { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import { validatePartnerOfferForPublish } from '../../data/commercial.preview-contract';
import { CommercialParityPreview } from './commercial-parity-preview';

type PartnerOfferEditorSection = 'details' | 'governance' | 'preview';

const partnerOffersPageSize = 5;

export function PartnerOffersCommandDeckScreen() {
  const { theme } = useTheme();
  const [items, setItems] = React.useState<PartnerOfferRecord[]>(() => getPartnerOfferItems());
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getPartnerOfferItems()[0]?.id ?? null);
  const selected = React.useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);
  const [draft, setDraft] = React.useState<Partial<PartnerOfferRecord>>({});
  const [pipelineFilter, setPipelineFilter] = React.useState<PartnerOfferStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [offersPage, setOffersPage] = React.useState(1);
  const [editorSection, setEditorSection] = React.useState<PartnerOfferEditorSection>('details');
  const [publishGuardMessage, setPublishGuardMessage] = React.useState<string | null>(null);

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
    setPublishGuardMessage(null);
    setEditorSection('details');
    setSelectedId(null);
  };

  const handleSave = () => {
    const saved = upsertPartnerOfferItem(draft);
    refresh();
    setPublishGuardMessage(null);
    setEditorSection('details');
    setSelectedId(saved.id);
  };

  const handleDuplicate = () => {
    if (!selected) return;
    const saved = upsertPartnerOfferItem({ ...selected, id: undefined, title: `${selected.title} — نسخة`, status: 'inbound' });
    refresh();
    setPublishGuardMessage(null);
    setEditorSection('details');
    setSelectedId(saved.id);
  };

  const setStatus = (id: string, newStatus: PartnerOfferStatus) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    upsertPartnerOfferItem({ ...item, status: newStatus });
    refresh();
  };

  const filteredItems = React.useMemo(() => {
    let base = items;
    if (pipelineFilter !== 'all') {
      base = base.filter(i => i.status === pipelineFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(i => i.title.toLowerCase().includes(q) || i.partnerName.toLowerCase().includes(q));
    }
    return base;
  }, [items, pipelineFilter, searchQuery]);

  const offersTotalPages = Math.max(1, Math.ceil(filteredItems.length / partnerOffersPageSize));
  const visibleItems = React.useMemo(() => {
    const startIndex = (offersPage - 1) * partnerOffersPageSize;
    return filteredItems.slice(startIndex, startIndex + partnerOffersPageSize);
  }, [filteredItems, offersPage]);

  React.useEffect(() => {
    setOffersPage((currentPage) => Math.min(currentPage, offersTotalPages));
  }, [offersTotalPages]);

  React.useEffect(() => {
    setOffersPage(1);
  }, [pipelineFilter, searchQuery]);

  React.useEffect(() => {
    if (selectedId === null) {
      return;
    }

    if (filteredItems.length === 0) {
      setSelectedId(null);
      return;
    }

    if (filteredItems.some((item) => item.id === selectedId)) {
      return;
    }

    setSelectedId(filteredItems[0].id);
  }, [filteredItems, selectedId]);

  type OfferTone = 'default' | 'warning' | 'brand' | 'success' | 'danger';

  const translateStatus = (status: PartnerOfferStatus): { label: string, tone: OfferTone } => {
    switch (status) {
      case 'inbound': return { label: 'واردة', tone: 'default' };
      case 'review': return { label: 'مراجعة', tone: 'warning' };
      case 'marketing-ready': return { label: 'جاهز للتسويق', tone: 'brand' };
      case 'published': return { label: 'منشور', tone: 'success' };
      case 'paused': return { label: 'موقوف', tone: 'danger' };
      case 'rejected': return { label: 'مرفوض', tone: 'default' };
      case 'archived': return { label: 'مؤرشف', tone: 'default' };
      default: return { label: status, tone: 'default' };
    }
  };

  const translateOfferType = (type: PartnerOfferType) => {
    switch (type) {
      case 'discount': return 'خصم مباشر';
      case 'free-delivery': return 'توصيل مجاني';
      case 'bundle': return 'حزمة';
      case 'buy-x-get-y': return 'اشتر واحصل على';
      case 'coupon': return 'كوبون';
      default: return type;
    }
  };

  const translateSource = (source: PartnerOfferSource) => {
    switch (source) {
      case 'partner': return 'الشريك';
      case 'field': return 'ميداني';
      case 'marketing': return 'التسويق';
      case 'catalog': return 'الكتالوج';
      default: return source;
    }
  };

  const handlePublish = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const errors = validatePartnerOfferForPublish(item as unknown as Parameters<typeof validatePartnerOfferForPublish>[0]);
    if (errors.length > 0) {
      setPublishGuardMessage(errors[0] ?? 'تعذر نشر العرض قبل استكمال متطلبات الحوكمة.');
      return;
    }
    setPublishGuardMessage(null);
    publishPartnerOfferItem(id);
    refresh();
  };

  const renderActionButtons = () => {
    if (!selected) return null;
    const s = selected.status;
    return (
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {s === 'inbound' && <Button label="قبول للمراجعة" tone="secondary" size="sm" onPress={() => setStatus(selected.id, 'review')} />}
        {s === 'review' && <Button label="جاهز للتسويق" tone="secondary" size="sm" onPress={() => { approvePartnerOfferItem(selected.id); refresh(); }} />}
        {s === 'marketing-ready' && <Button label="نشر الآن" tone="success" size="sm" onPress={() => handlePublish(selected.id)} />}
        {s === 'published' && <Button label="إيقاف" tone="danger" size="sm" onPress={() => { pausePartnerOfferItem(selected.id); refresh(); }} />}
        {s === 'paused' && <Button label="إعادة النشر" tone="success" size="sm" onPress={() => handlePublish(selected.id)} />}

        {(s === 'inbound' || s === 'review') && (
          <Button label="رفض" tone="danger" size="sm" onPress={() => {
            rejectPartnerOfferItem(selected.id, 'لا يستوفي معايير السياسة التجارية.');
            refresh();
          }} />
        )}
        {(s === 'published' || s === 'paused' || s === 'rejected') && (
          <Button label="أرشفة" tone="ghost" size="sm" onPress={() => { archivePartnerOfferItem(selected.id); refresh(); }} />
        )}

        <Button label="نسخ" tone="ghost" size="sm" onPress={handleDuplicate} />
        <Button label="حذف" tone="danger" size="sm" onPress={() => { removePartnerOfferItem(selected.id); setSelectedId(null); }} />
      </Box>
    );
  };

  const renderStoreCardPreview = () => {
    const mockContext = {
      storeId: draft.storeId || 'store-preview',
      activeOffers: draft.id && draft.status === 'published' ? [draft as PartnerOfferRecord] : [draft as PartnerOfferRecord],
      activeSubscriptions: [],
      activeEntitlements: [],
      activeCampaigns: [],
      catalogFeatures: { priceMatch: true, hasNewProducts: false },
    };
    const features = mapStoreCommercialFeatures(mockContext);

    return (
      <Surface tone="inset" padding={4} gap={3}>
        <Text role="caption" style={{ fontWeight: '800' }}>محاكاة بطاقة المتجر</Text>
        <CommercialParityPreview features={features} storeName={draft.storeLabel || draft.partnerName} />
      </Surface>
    );
  };

  const renderEditorContent = () => {
    if (editorSection === 'details') {
      return (
        <Box gap={4}>
          <div style={{  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <TextField label="عنوان العرض" value={draft.title || ''} onChangeText={v => setDraft({ ...draft, title: v })} />
            <TextField label="اسم الشريك" value={draft.partnerName || ''} onChangeText={v => setDraft({ ...draft, partnerName: v })} />

            <TextField label="معرف المتجر" value={draft.storeId || ''} onChangeText={v => setDraft({ ...draft, storeId: v })} style={{ textAlign: 'left' }} />
            <TextField label="اسم المتجر" value={draft.storeLabel || ''} onChangeText={v => setDraft({ ...draft, storeLabel: v })} />

            <TextField label="معرف المنتج" value={draft.productId || ''} onChangeText={v => setDraft({ ...draft, productId: v })} style={{ textAlign: 'left' }} />
            <TextField label="اسم المنتج" value={draft.productLabel || ''} onChangeText={v => setDraft({ ...draft, productLabel: v })} />
          </div>
        </Box>
      );
    }

    if (editorSection === 'governance') {
      return (
        <Box gap={4}>
          <div style={{  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <TextField label="التصنيف" value={draft.category || ''} onChangeText={v => setDraft({ ...draft, category: v })} />
            <TextField label="قيمة العرض" value={draft.valueLabel || ''} onChangeText={v => setDraft({ ...draft, valueLabel: v })} hint="مثال: خصم 20%" />

            <SelectField
              label="نوع العرض"
              value={draft.offerType}
              onValueChange={(v) => setDraft({ ...draft, offerType: v as PartnerOfferType })}
              options={[
                { value: 'discount', label: 'خصم مباشر' },
                { value: 'free-delivery', label: 'توصيل مجاني' },
                { value: 'bundle', label: 'حزمة (Bundle)' },
                { value: 'buy-x-get-y', label: 'اشتر واحصل على' },
                { value: 'coupon', label: 'كوبون' },
              ]}
            />

            <SelectField
              label="المصدر"
              value={draft.source}
              onValueChange={(v) => setDraft({ ...draft, source: v as PartnerOfferSource })}
              options={[
                { value: 'partner', label: 'الشريك' },
                { value: 'field', label: 'المبيعات الميدانية' },
                { value: 'marketing', label: 'التسويق' },
                { value: 'catalog', label: 'الكتالوج' },
              ]}
            />

            <TextField label="الأهلية" value={draft.eligibility || ''} onChangeText={v => setDraft({ ...draft, eligibility: v })} />
            <TextField label="شارة العرض" value={draft.displayBadge || ''} onChangeText={v => setDraft({ ...draft, displayBadge: v })} />

            <TextField label="تاريخ البدء" value={draft.activeFromDate || ''} onChangeText={v => setDraft({ ...draft, activeFromDate: v })} style={{ textAlign: 'left' }} />
            <TextField label="تاريخ الانتهاء" value={draft.activeToDate || ''} onChangeText={v => setDraft({ ...draft, activeToDate: v })} style={{ textAlign: 'left' }} />
          </div>

          <TextField label="ملاحظات هامش الربح" value={draft.marginRiskNote || ''} onChangeText={v => setDraft({ ...draft, marginRiskNote: v })} hint="ملاحظات داخلية للفريق" />
          <TextField label="حملة مرتبطة" value={draft.linkedCampaignId || ''} onChangeText={v => setDraft({ ...draft, linkedCampaignId: v })} style={{ textAlign: 'left' }} />
        </Box>
      );
    }

    const statusMeta = draft.status ? translateStatus(draft.status) : { label: 'مسودة جديدة', tone: 'default' as OfferTone };

    return (
      <Box gap={4}>
        <KeyValueList
          items={[
            { label: 'حالة العرض', value: statusMeta.label },
            { label: 'نوع العرض', value: draft.offerType ? translateOfferType(draft.offerType) : 'غير محدد' },
            { label: 'المصدر', value: draft.source ? translateSource(draft.source) : 'غير محدد' },
            { label: 'مدة التفعيل', value: draft.activeFromDate && draft.activeToDate ? `${draft.activeFromDate} → ${draft.activeToDate}` : 'غير محددة' },
          ]}
        />
        {renderStoreCardPreview()}
      </Box>
    );
  };

  return (
    <Box gap={4} padding={4} style={{ height: '100%', overflow: 'hidden' }}>

      {/* Header & KPIs */}
      <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'واردة', value: kpis.inbound, color: theme.brandHeaderBackground },
          { label: 'مراجعة', value: kpis.review, color: theme.warning },
          { label: 'جاهز للتسويق', value: kpis.marketingReady, color: theme.brandHeaderBackground },
          { label: 'منشور', value: kpis.published, color: theme.success },
          { label: 'مرفوض', value: kpis.rejected, color: theme.textMuted },
        ].map(k => (
          <Surface key={k.label} tone="raised" padding={3} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 120, borderRadius: 10, borderStartWidth: 3, borderStartColor: k.color }}>
            <Text role="caption" style={{ fontWeight: 800, color: theme.textMuted }}>{k.label}</Text>
            <Text role="titleSm" style={{ fontWeight: 900, color: k.color, marginTop: 4, fontSize: 18 }}>{k.value}</Text>
          </Surface>
        ))}
      </Box>

      {/* Pipeline Filter */}
      <Surface tone="raised" padding={2}>
        <Tabs<PartnerOfferStatus | 'all'>
          items={[
            { value: 'all', label: 'الكل' },
            { value: 'inbound', label: 'واردة' },
            { value: 'review', label: 'مراجعة' },
            { value: 'marketing-ready', label: 'جاهز للتسويق' },
            { value: 'published', label: 'منشور' },
            { value: 'archived', label: 'مؤرشف' },
          ]}
          value={pipelineFilter}
          onValueChange={setPipelineFilter}
          variant="pill"
        />
      </Surface>

      <Box layoutDirection="row" gap={4} style={{ flex: 1, minHeight: 0 }}>
        {/* Offers Table / List */}
        <Surface tone="raised" padding={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box padding={4} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
            <Text role="bodyStrong">العروض ({filteredItems.length})</Text>
            <Button label="+ عرض جديد" tone="brand" size="sm" onPress={handleCreateNew} />
          </Box>
          <Box padding={3} gap={3}>
            <TextField
              label="بحث سريع"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ابحث بالعنوان أو اسم الشريك"
            />
          </Box>
          <Box style={{ flex: 1, minHeight: 0 }} padding={2} gap={2}>
            {visibleItems.length === 0 ? (
              <Surface tone="inset" padding={4} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text role="bodySm" tone="muted">لا توجد عروض تطابق الفلاتر الحالية.</Text>
              </Surface>
            ) : visibleItems.map(item => {
                const statusMeta = translateStatus(item.status);
                return (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    subtitle={`${item.partnerName} · ${translateOfferType(item.offerType)} · ${translateSource(item.source)}`}
                    onPress={() => {
                      setPublishGuardMessage(null);
                      setEditorSection('details');
                      setSelectedId(item.id);
                    }}
                    badgeLabel={statusMeta.label}
                    badgeTone={statusMeta.tone}
                  />
                );
              })}

            <WebControlPanelCompactPager
              page={offersPage}
              totalPages={offersTotalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${filteredItems.length} عروض`}
              onPrevious={offersPage > 1 ? () => setOffersPage((currentPage) => currentPage - 1) : undefined}
              onNext={offersPage < offersTotalPages ? () => setOffersPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>

        {/* Inspector / Editor Panel */}
        <Surface tone="raised" padding={0} style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box padding={4} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
            <Text role="bodyStrong">{selected ? 'مفتش العرض' : 'إنشاء عرض جديد'}</Text>
            {renderActionButtons()}
          </Box>

          {publishGuardMessage ? (
            <Box paddingX={4} style={{ paddingTop: 12 }}>
              <Surface tone="warning" padding={3}>
                <Text role="bodySm">{publishGuardMessage}</Text>
              </Surface>
            </Box>
          ) : null}

          <Box style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12 }}>
            <Tabs<PartnerOfferEditorSection>
              items={[
                { value: 'details', label: 'الأساسيات' },
                { value: 'governance', label: 'الحوكمة' },
                { value: 'preview', label: 'المعاينة' },
              ]}
              value={editorSection}
              onValueChange={setEditorSection}
              variant="pill"
            />
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }} padding={4} gap={4}>
            {renderEditorContent()}

            <Box layoutDirection="row" justify="flex-end" paddingY={4} style={{ marginTop: 'auto' }}>
              <Button label="حفظ التعديلات" tone="brand" onPress={handleSave} />
            </Box>
          </Box>
        </Surface>
      </Box>
    </Box>
  );
}

export default PartnerOffersCommandDeckScreen;
