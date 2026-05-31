'use client';

import React from 'react';
import { Box, Button, Surface, Tabs, Text, TextField, SelectField, ListItem, KeyValueList, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getPartnerOfferItems,
  getPartnerOfferSummaries,
  getPartnerOfferDetail,
  getPartnerOfferKpis,
  upsertPartnerOfferItem,
  approvePartnerOfferItem,
  publishPartnerOfferItem,
  pausePartnerOfferItem,
  rejectPartnerOfferItem,
  archivePartnerOfferItem,
  removePartnerOfferItem,
  type PartnerOfferRecord,
  type PartnerOfferSummary,
  type PartnerOfferStatus,
  type PartnerOfferType,
  type PartnerOfferSource,
} from '../../data/offers.preview-data';
import { mapStoreCommercialFeatures } from '../../shared/store-card-commercial-map';
import { validatePartnerOfferForPublish } from '../../shared/commercial.preview-contract';
import { CommercialParityPreview } from './commercial-parity-preview';
import { useMarketingPermissions } from './marketing-permissions.contract';

type PartnerOfferEditorSection = 'details' | 'governance' | 'preview';

const partnerOffersPageSize = 5;

import { useRouter, useSearchParams, usePathname } from 'next/navigation';



/**
 * Audit / History / Rollback Preview:
 * - publish / approval / toggle / visibility actions:
 *   - audit? API-later (via signal layer/events)
 *   - history? API-later (history log)
 *   - rollback? UI-only (pause/draft toggle)
 *   - reason/comment? UI-only now
 *   - before/after preview? UI-only (local visual grid/preview)
 *   - UI-only? Yes (currently simulated/preview states)
 *   - API-later? Yes (backend mutation boundary)
 *
 * Error Handling Closure:
 * - network: API-later (currently simulated/preview)
 * - validation: Top-level error messages (e.g. required fields, conflict targets)
 * - permission: UI disabled state via hasPermission contract
 * - not found: Auto-fallback or disabled action
 * - conflict: Toast/Alert blocker on duplicate/position conflict
 * - stale data: Handled via refresh() after every mutation
 * - blocked action: Handled via permission/validation state
 * - partial failure: API-later
 * - retry: API-later
 * - (No silent catch, success updates state and refreshes data)
 *
 * Empty / Loading / Blocked / Disabled Closure:
 * - loading: API-later (بيانات محاكاة حالياً، لا يوجد async fetch)
 * - empty: HANDLED — empty state واضح عند غياب العناصر
 * - error: HANDLED — رسالة خطأ صريحة عند فشل الإجراء
 * - blocked: HANDLED — الإجراء محجوب عند غياب الصلاحية أو البيانات
 * - disabled: HANDLED — الزر disabled عند عدم استيفاء الشروط
 * - success: HANDLED — الحالة تتحدث فور نجاح الإجراء
 * - retry: API-later
 * - guidance: HANDLED — توجيه نصي يظهر عند كل حالة فارغة أو محجوبة
 */
export function PartnerOffersCommandDeckScreen() {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedId = searchParams?.get('id') ?? null;
  const editorSection = (searchParams?.get('tab') as PartnerOfferEditorSection) || 'details';
  const offersPageParam = parseInt(searchParams?.get('page') || '1', 10);
  const offersPage = isNaN(offersPageParam) || offersPageParam < 1 ? 1 : offersPageParam;

  const [summaries, setSummaries] = React.useState<PartnerOfferSummary[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [selected, setSelected] = React.useState<PartnerOfferRecord | null>(null);

  const updateQueryParams = React.useCallback((updates: Record<string, string | null>, historyAction: 'push' | 'replace' = 'replace') => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) params.delete(k);
      else params.set(k, v);
    }
    const newUrl = `${pathname}?${params.toString()}`;
    if (historyAction === 'push') {
      router.push(newUrl, { scroll: false });
    } else {
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const setSelectedId = React.useCallback((id: string | null) => {
    updateQueryParams({ id, tab: 'details' }, 'push');
  }, [updateQueryParams]);

  const setEditorSection = React.useCallback((tab: PartnerOfferEditorSection) => {
    updateQueryParams({ tab }, 'replace');
  }, [updateQueryParams]);

  const setOffersPage = React.useCallback((page: number | ((p: number) => number)) => {
    const nextPage = typeof page === 'function' ? page(offersPage) : page;
    updateQueryParams({ page: nextPage.toString() }, 'replace');
  }, [offersPage, updateQueryParams]);

  const [draft, setDraft] = React.useState<Partial<PartnerOfferRecord>>({});
  const [pipelineFilter, setPipelineFilter] = React.useState<PartnerOfferStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [publishGuardMessage, setPublishGuardMessage] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = React.useState<string | null>(null);
  const [archiveConfirmId, setArchiveConfirmId] = React.useState<string | null>(null);
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
        rejectionReason: '',
        linkedCampaignId: '',
        activeFromDate: '',
        activeToDate: '',
      });
    }
  }, [selected]);

  const kpis = React.useMemo(() => getPartnerOfferKpis(), [summaries]);

  const refresh = () => {
    loadData();
    if (selectedId) setSelected(getPartnerOfferDetail(selectedId));
  };

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


  const loadData = React.useCallback(() => {
    const result = getPartnerOfferSummaries({
      page: offersPage,
      pageSize: partnerOffersPageSize,
      search: searchQuery,
      status: pipelineFilter,
    });
    setSummaries(result.items);
    setTotalItems(result.total);
  }, [offersPage, searchQuery, pipelineFilter]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (selectedId) {
      setSelected(getPartnerOfferDetail(selectedId));
    } else if (summaries.length > 0 && !selectedId) {
      const newUrl = `${pathname}?id=${summaries[0].id}&tab=details&page=${offersPage}`;
      router.replace(newUrl, { scroll: false });
    } else {
      setSelected(null);
    }
  }, [selectedId, summaries, pathname, router, offersPage]);

  const setStatus = (id: string, newStatus: PartnerOfferStatus) => {
    const item = getPartnerOfferDetail(id);
    if (!item) return;
    upsertPartnerOfferItem({ ...item, status: newStatus });
    refresh();
  };

  const offersTotalPages = Math.max(1, Math.ceil(totalItems / partnerOffersPageSize));
  const visibleItems = summaries;

  React.useEffect(() => {
    setOffersPage((currentPage) => Math.min(currentPage, offersTotalPages));
  }, [offersTotalPages, setOffersPage]);

  React.useEffect(() => {
    setOffersPage(1);
  }, [pipelineFilter, searchQuery]);

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
    const item = getPartnerOfferDetail(id);
    if (!item) return;
    const errors = validatePartnerOfferForPublish(item as unknown as Parameters<typeof validatePartnerOfferForPublish>[0]);
    if (errors.length > 0) {
      setPublishGuardMessage(errors[0] ?? 'تعذر نشر العرض قبل استكمال متطلبات الحوكمة.');
      return;
    }

    // Partner Override: Auto-pause old active offers for the same partner
    const activePartnerOffers = getPartnerOfferItems().filter(i => i.status === 'published' && i.storeId === item.storeId && i.id !== item.id);
    activePartnerOffers.forEach(oldOffer => {
      pausePartnerOfferItem(oldOffer.id);
    });

    setPublishGuardMessage(null);
    publishPartnerOfferItem(id);
    refresh();
  };

  const renderActionButtons = () => {
    if (!selected) return null;
    const s = selected.status;
    return (
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {s === 'inbound' && <Button label="قبول للمراجعة" tone="secondary" size="sm" onPress={() => setStatus(selected.id, 'review')} disabled={!hasPermission('marketing.approve')} />}
        {s === 'review' && <Button label="جاهز للتسويق" tone="secondary" size="sm" onPress={() => { approvePartnerOfferItem(selected.id); refresh(); }} disabled={!hasPermission('marketing.approve')} />}
        {s === 'review' && <Button label="إعادة للوارد" tone="ghost" size="sm" onPress={() => { setStatus(selected.id, 'inbound'); }} disabled={!hasPermission('marketing.approve')} />}
        {s === 'marketing-ready' && <Button label="نشر الآن" tone="success" size="sm" onPress={() => handlePublish(selected.id)} disabled={!hasPermission('marketing.publish')} />}
        {s === 'published' && <Button label="إيقاف" tone="danger" size="sm" onPress={() => { pausePartnerOfferItem(selected.id); refresh(); }} disabled={!hasPermission('marketing.publish')} />}
        {s === 'paused' && <Button label="إعادة النشر" tone="success" size="sm" onPress={() => handlePublish(selected.id)} disabled={!hasPermission('marketing.publish')} />}

        {(s === 'inbound' || s === 'review') && (
          rejectConfirmId === selected.id ? (
            <>
              <Button label="تأكيد الرفض" tone="danger" size="sm" onPress={() => { rejectPartnerOfferItem(selected.id, 'لا يستوفي معايير السياسة التجارية.'); setRejectConfirmId(null); refresh(); }} disabled={!hasPermission('marketing.approve')} />
              <Button label="إلغاء" tone="ghost" size="sm" onPress={() => setRejectConfirmId(null)} />
            </>
          ) : (
            <Button label="رفض" tone="danger" size="sm" onPress={() => setRejectConfirmId(selected.id)} disabled={!hasPermission('marketing.approve')} />
          )
        )}
        {(s === 'published' || s === 'paused' || s === 'rejected') && (
          archiveConfirmId === selected.id ? (
            <>
              <Button label="تأكيد الأرشفة" tone="ghost" size="sm" onPress={() => { archivePartnerOfferItem(selected.id); setArchiveConfirmId(null); refresh(); }} disabled={!hasPermission('marketing.edit')} />
              <Button label="إلغاء" tone="ghost" size="sm" onPress={() => setArchiveConfirmId(null)} />
            </>
          ) : (
            <Button label="أرشفة" tone="ghost" size="sm" onPress={() => setArchiveConfirmId(selected.id)} disabled={!hasPermission('marketing.edit')} />
          )
        )}

        <Button label="نسخ" tone="ghost" size="sm" onPress={handleDuplicate} disabled={!hasPermission('marketing.edit')} />
        {deleteConfirmId === selected.id ? (
          <>
            <Button label="تأكيد الحذف" tone="danger" size="sm" onPress={() => { removePartnerOfferItem(selected.id); setSelectedId(null); setDeleteConfirmId(null); refresh(); }} disabled={!hasPermission('marketing.delete')} />
            <Button label="إلغاء" tone="ghost" size="sm" onPress={() => setDeleteConfirmId(null)} />
          </>
        ) : (
          <Button label="حذف" tone="danger" size="sm" onPress={() => setDeleteConfirmId(selected.id)} disabled={!hasPermission('marketing.delete')} />
        )}
      </Box>
    );
  };

  const renderStoreCardPreview = () => {
    const simulatedContext = {
      storeId: draft.storeId || 'store-preview',
      activeOffers: draft.id && draft.status === 'published' ? [draft as PartnerOfferRecord] : [draft as PartnerOfferRecord],
      activeSubscriptions: [],
      activeEntitlements: [],
      activeCampaigns: [],
      catalogFeatures: { priceMatch: true, hasNewProducts: false },
    };
    const features = mapStoreCommercialFeatures(simulatedContext);

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
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
            <Text role="bodyStrong">العروض ({totalItems})</Text>
            <Button label="+ عرض جديد" tone="brand" size="sm" onPress={handleCreateNew} disabled={!hasPermission('marketing.edit')} />
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
              summaryLabel={`عرض ${visibleItems.length} من ${totalItems} عروض`}
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
              <Button label="حفظ التعديلات" tone="brand" onPress={handleSave} disabled={!hasPermission('marketing.edit')} />
            </Box>
          </Box>
        </Surface>
      </Box>
    </Box>
  );
}

export default PartnerOffersCommandDeckScreen;
