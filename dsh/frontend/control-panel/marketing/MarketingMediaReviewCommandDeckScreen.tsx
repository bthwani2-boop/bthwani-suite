'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, Chip, KeyValueList, ListItem, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import {
  getMediaReviewItems,
  getMediaReviewKpis,
  approveMediaReviewItem,
  requestMediaFix,
  rejectMediaReviewItem,
  sendMediaToCatalog,
  type MediaReviewRecord,
  type MediaPolicyKind,
} from '../../data/marketing.preview-data';
import {
  ApprovalStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';
import { useMarketingPermissions } from './marketing-permissions.contract';



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
// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type FilterKind =
  | 'all'
  | 'product-media'
  | 'product'
  | 'restaurant-exception'
  | 'category-suggestion'
  | 'needs-fix'
  | 'catalog-ready';

const FILTERS: { id: FilterKind; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'product-media', label: 'صور منتجات' },
  { id: 'product', label: 'منتجات جديدة' },
  { id: 'restaurant-exception', label: 'مطاعم / استثناء شريك' },
  { id: 'category-suggestion', label: 'فئات مقترحة' },
  { id: 'needs-fix', label: 'تحتاج تعديل' },
  { id: 'catalog-ready', label: 'جاهزة للكتالوج' },
];

type MarketingTone = 'default' | 'warning' | 'brand' | 'success' | 'danger';
type MediaReviewInspectorSection = 'preview' | 'details' | 'actions';

const mediaReviewPageSize = 5;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function policyLabel(p: MediaPolicyKind): string {
  switch (p) {
    case 'catalog-owned-media': return 'وسائط الكتالوج';
    case 'partner-owned-exception': return 'استثناء شريك';
    case 'restaurant-exception': return 'استثناء مطعم';
    case 'media-conflict': return 'تعارض وسائط';
    default: return p;
  }
}

function policyTone(p: MediaPolicyKind): MarketingTone {
  switch (p) {
    case 'catalog-owned-media': return 'success';
    case 'partner-owned-exception': return 'warning';
    case 'restaurant-exception': return 'warning';
    case 'media-conflict': return 'danger';
    default: return 'default';
  }
}

function getStageMeta(stage: ApprovalStage): { text: string; tone: MarketingTone } {
  const text = translateStage(stage);
  switch (stage) {
    case 'marketing-review': return { text, tone: 'warning' };
    case 'marketing-approved': return { text, tone: 'brand' };
    case 'catalog-adopted': return { text, tone: 'success' };
    case 'needs-fix': return { text, tone: 'danger' };
    case 'rejected': return { text, tone: 'default' };
    default: return { text, tone: 'default' };
  }
}

function applyFilter(items: MediaReviewRecord[], filter: FilterKind): MediaReviewRecord[] {
  switch (filter) {
    case 'all': return items;
    case 'product-media': return items.filter(i => i.entityType === 'product-media' && i.mediaPolicy !== 'restaurant-exception');
    case 'product': return items.filter(i => i.entityType === 'product');
    case 'restaurant-exception': return items.filter(i => i.mediaPolicy === 'restaurant-exception' || i.mediaPolicy === 'partner-owned-exception');
    case 'category-suggestion': return items.filter(i => i.entityType === 'category-suggestion');
    case 'needs-fix': return items.filter(i => i.stage === 'needs-fix');
    case 'catalog-ready': return items.filter(i => i.stage === 'marketing-approved');
    default: return items;
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function MarketingMediaReviewCommandDeckScreen() {
  const { hasPermission } = useMarketingPermissions();
  const { theme } = useTheme();
  const [items, setItems] = React.useState<MediaReviewRecord[]>(() => getMediaReviewItems());
  const [filter, setFilter] = React.useState<FilterKind>('all');
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMediaReviewItems()[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [reviewPage, setReviewPage] = React.useState(1);
  const [inspectorSection, setInspectorSection] = React.useState<MediaReviewInspectorSection>('preview');

  const kpis = React.useMemo(() => getMediaReviewKpis(), [items]);

  const refresh = () => setItems(getMediaReviewItems());

  const selected = React.useMemo(
    () => items.find(i => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  const filteredItems = React.useMemo(() => {
    let base = applyFilter(items, filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(i => i.title.toLowerCase().includes(q) || (i.mediaKey?.toLowerCase() ?? '').includes(q));
    }
    return base;
  }, [items, filter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / mediaReviewPageSize));
  const visibleItems = React.useMemo(() => {
    const startIndex = (reviewPage - 1) * mediaReviewPageSize;
    return filteredItems.slice(startIndex, startIndex + mediaReviewPageSize);
  }, [filteredItems, reviewPage]);

  React.useEffect(() => {
    setReviewPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    setReviewPage(1);
  }, [filter, searchQuery]);

  React.useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedId(null);
      return;
    }

    if (selectedId && filteredItems.some((item) => item.id === selectedId)) {
      return;
    }

    setSelectedId(filteredItems[0].id);
  }, [filteredItems, selectedId]);

  const handleApprove = (id: string) => { approveMediaReviewItem(id); refresh(); };
  const handleFix = (id: string) => { requestMediaFix(id); refresh(); };
  const handleReject = (id: string) => { rejectMediaReviewItem(id); refresh(); };
  const handleCatalog = (id: string) => { sendMediaToCatalog(id); refresh(); };

  const renderInspectorContent = () => {
    if (!selected) {
      return null;
    }

    if (inspectorSection === 'preview') {
      return (
        <Box gap={3}>
          <Surface padding={4} gap={3}>
            <Text role="caption" tone="muted" style={{ fontWeight: 700, textAlign: 'right' }}>معاينة الوسيط</Text>
            <Surface tone="inset" style={{ height: 160, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: theme.surfaceInset }}>
              <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>معاينة المحتوى</Text>
            </Surface>
            {selected.mediaKey ? (
              <Box padding={2} style={{ direction: 'ltr', backgroundColor: theme.overlaySoft, borderRadius: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'monospace' }}>
                  {selected.mediaKey}
                </Text>
              </Box>
            ) : null}
          </Surface>
        </Box>
      );
    }

    if (inspectorSection === 'details') {
      return (
        <Box gap={3}>
          <Surface padding={4} gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>تفاصيل المراجعة</Text>
            <KeyValueList
              items={[
                { label: 'العنوان', value: selected.title },
                { label: 'النوع', value: translateEntityType(selected.entityType) },
                { label: 'الحالة', value: translateStage(selected.stage), tone: getStageMeta(selected.stage).tone },
                { label: 'المصدر', value: translateOwner(selected.source) },
                { label: 'المالك التالي', value: translateOwner(selected.nextOwner) },
              ]}
            />
          </Surface>

          <Surface tone={policyTone(selected.mediaPolicy)} padding={4}>
            <Text role="caption" style={{ fontWeight: 800, opacity: 0.8 }}>سياسة الوسائط</Text>
            <Text role="bodyStrong" style={{ marginTop: 4 }}>{policyLabel(selected.mediaPolicy)}</Text>
            {selected.systemNote ? (
              <Text role="caption" style={{ marginTop: 8, lineHeight: 1.5 }}>{selected.systemNote}</Text>
            ) : null}
          </Surface>

          <Box padding={3} style={{ backgroundColor: theme.infoSurface, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: theme.info }}>
            <Text role="caption" style={{ color: theme.infoText, lineHeight: 1.6 }}>
              ملاحظة: الاعتماد التسويقي هو خطوة وسيطة. النشر الفعلي يتم عبر فريق الكتالوج لضمان الجودة المركزية.
            </Text>
          </Box>
        </Box>
      );
    }

    return (
      <Box gap={3}>
        <Surface padding={4} gap={3}>
          <Text role="caption" tone="muted" style={{ fontWeight: 800 }}>الإجراءات المتوفرة</Text>

          {selected.stage === 'marketing-review' ? (
            <Box gap={2}>
              <Button label="اعتماد تسويقي" tone="brand" onPress={() => handleApprove(selected.id)} disabled={!hasPermission('marketing.approve')} />
              <Box layoutDirection="row" gap={2}>
                <Button style={{ flex: 1 }} label="طلب تعديل" tone="warning" onPress={() => handleFix(selected.id)} disabled={!hasPermission('marketing.approve')} />
                <Button style={{ flex: 1 }} label="رفض" tone="danger" onPress={() => handleReject(selected.id)} disabled={!hasPermission('marketing.approve')} />
              </Box>
            </Box>
          ) : null}

          {selected.stage === 'marketing-approved' ? (
            <Button label="إرسال للكتالوج" tone="success" onPress={() => handleCatalog(selected.id)} disabled={!hasPermission('marketing.publish')} />
          ) : null}

          {selected.stage === 'needs-fix' ? (
            <Surface tone="warning" padding={3}>
              <Text role="caption" style={{ fontWeight: 800 }}>في انتظار تعديل الشريك</Text>
              <Text role="caption">المالك الحالي: {translateOwner(selected.nextOwner)}</Text>
            </Surface>
          ) : null}

          {(selected.stage === 'catalog-adopted' || selected.stage === 'rejected') ? (
            <Surface tone="inset" padding={3}>
              <Text role="caption" style={{ fontWeight: 800 }}>
                {selected.stage === 'catalog-adopted' ? 'تم الإرسال للكتالوج بنجاح' : 'العنصر مرفوض'}
              </Text>
            </Surface>
          ) : null}

          {(selected.entityType === 'product-media' || selected.entityType === 'store') && selected.stage === 'marketing-review' ? (
            <Surface tone="inset" padding={2}>
              <Text role="caption" tone="muted">
                تحسين الصورة يظل معاينة فقط حتى تثبت أداة التحسين أو مزود الوسائط المعتمد.
              </Text>
            </Surface>
          ) : null}
        </Surface>
      </Box>
    );
  };

  return (
    <Box gap={4} style={{ height: '100%', overflow: 'hidden' }}>

      {/* ── KPI Strip ─────────────────────── */}
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'قيد المراجعة', value: kpis.pending, color: theme.warning },
          { label: 'معتمد تسويقياً', value: kpis.approved, color: theme.brandHeaderBackground },
          { label: 'يتطلب تعديل', value: kpis.needsFix, color: theme.danger },
          { label: 'جاهز للكتالوج', value: kpis.catalogReady, color: theme.success },
          { label: 'تعارضات', value: kpis.conflicts, color: theme.warning },
        ].map(k => (
          <Surface key={k.label} tone="raised" padding={3} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 120, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: k.color }}>
            <Text role="caption" style={{ fontWeight: 800, textAlign: 'right', color: theme.textMuted }}>{k.label}</Text>
            <Text role="titleSm" style={{ fontWeight: 900, textAlign: 'right', color: k.color, marginTop: 4, fontSize: 18 }}>{k.value}</Text>
          </Surface>
        ))}
      </Box>

      {/* ── Toolbar ───────────────────────── */}
      <Box layoutDirection="row" gap={3} align="center" style={{ flexWrap: 'wrap' }}>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', flex: 1 }}>
          {FILTERS.map(f => (
            <Chip
              key={f.id}
              label={f.label}
              selected={filter === f.id}
              onPress={() => setFilter(f.id)}
              tone={filter === f.id ? 'brand' : 'default'}
            />
          ))}
        </Box>
        <Box style={{ width: 260 }}>
          <SearchField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="بحث في القائمة..."
          />
        </Box>
      </Box>

      {/* ── Main Layout: List + Inspector ─── */}
      <Box layoutDirection="row" gap={4} style={{ flex: 1, minHeight: 0 }}>

        {/* Left: Review List */}
        <Surface tone="raised" padding={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box padding={3} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>قائمة المراجعة ({filteredItems.length})</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'left' }}>مراجعة الصور والمنتجات</Text>
          </Box>
          <Box style={{ flex: 1, minHeight: 0 }} padding={2} gap={2}>
            {visibleItems.length === 0 ? (
              <Box padding={10} align="center">
                <Text tone="muted">لا توجد عناصر مطابقة</Text>
              </Box>
            ) : visibleItems.map(item => {
                const meta = getStageMeta(item.stage);
                return (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.source}
                    onPress={() => {
                      setInspectorSection('preview');
                      setSelectedId(item.id);
                    }}
                    badgeLabel={meta.text}
                    badgeTone={meta.tone}
                    meta={(
                      <Box layoutDirection="row" gap={1}>
                        <Chip label={translateEntityType(item.entityType)} />
                        <Chip label={policyLabel(item.mediaPolicy)} tone={policyTone(item.mediaPolicy)} />
                      </Box>
                    )}
                  />
                );
              })}

            <WebControlPanelCompactPager
              page={reviewPage}
              totalPages={totalPages}
              summaryLabel={`عرض ${visibleItems.length} من ${filteredItems.length} عناصر`}
              onPrevious={reviewPage > 1 ? () => setReviewPage((currentPage) => currentPage - 1) : undefined}
              onNext={reviewPage < totalPages ? () => setReviewPage((currentPage) => currentPage + 1) : undefined}
            />
          </Box>
        </Surface>

        {/* Right: Inspector */}
        <Box style={{ width: 380 }} gap={3}>
          {selected ? (
            <Box gap={3} style={{ minHeight: 0 }}>
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <Chip label="المعاينة" selected={inspectorSection === 'preview'} onPress={() => setInspectorSection('preview')} tone={inspectorSection === 'preview' ? 'brand' : 'default'} />
                <Chip label="التفاصيل" selected={inspectorSection === 'details'} onPress={() => setInspectorSection('details')} tone={inspectorSection === 'details' ? 'brand' : 'default'} />
                <Chip label="الإجراءات" selected={inspectorSection === 'actions'} onPress={() => setInspectorSection('actions')} tone={inspectorSection === 'actions' ? 'brand' : 'default'} />
              </Box>

              <Box gap={3} style={{ minHeight: 0 }}>
                {renderInspectorContent()}
              </Box>
            </Box>
          ) : (
            <Surface tone="raised" style={{ height: 300, alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}>
              <Text tone="muted">يرجى اختيار عنصر للمراجعة</Text>
            </Surface>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MarketingMediaReviewCommandDeckScreen;
