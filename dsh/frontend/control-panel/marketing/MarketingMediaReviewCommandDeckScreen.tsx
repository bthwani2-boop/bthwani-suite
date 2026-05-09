'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, Chip, KeyValueList, ListItem } from '@bthwani/ui-kit';
import {
  getMediaReviewItems,
  getMediaReviewKpis,
  approveMediaReviewItem,
  requestMediaFix,
  rejectMediaReviewItem,
  sendMediaToCatalog,
  type MediaReviewRecord,
  type MediaPolicyKind,
} from '../../shared/marketing-review-store';
import {
  ApprovalStage,
  translateStage,
  translateEntityType,
  translateOwner,
} from '../../shared/workflow';

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

function policyTone(p: MediaPolicyKind): any {
  switch (p) {
    case 'catalog-owned-media': return 'success';
    case 'partner-owned-exception': return 'warning';
    case 'restaurant-exception': return 'warning';
    case 'media-conflict': return 'danger';
    default: return 'default';
  }
}

function getStageMeta(stage: ApprovalStage): { text: string; tone: any } {
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
  const [items, setItems] = React.useState<MediaReviewRecord[]>(() => getMediaReviewItems());
  const [filter, setFilter] = React.useState<FilterKind>('all');
  const [selectedId, setSelectedId] = React.useState<string | null>(() => getMediaReviewItems()[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const handleApprove = (id: string) => { approveMediaReviewItem(id); refresh(); };
  const handleFix = (id: string) => { requestMediaFix(id); refresh(); };
  const handleReject = (id: string) => { rejectMediaReviewItem(id); refresh(); };
  const handleCatalog = (id: string) => { sendMediaToCatalog(id); refresh(); };

  return (
    <Box dir="rtl" gap={4} style={{ height: '100%', overflow: 'hidden' }}>

      {/* ── KPI Strip ─────────────────────── */}
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'قيد المراجعة', value: kpis.pending, color: '#D97706' },
          { label: 'معتمد تسويقياً', value: kpis.approved, color: '#0A2F5C' },
          { label: 'يتطلب تعديل', value: kpis.needsFix, color: '#DC2626' },
          { label: 'جاهز للكتالوج', value: kpis.catalogReady, color: '#16A34A' },
          { label: 'تعارضات', value: kpis.conflicts, color: '#D97706' },
        ].map(k => (
          <Surface key={k.label} tone="raised" padding={3} style={{ flex: '1 1 120px', borderRadius: '10px', borderLeftWidth: 3, borderLeftColor: k.color }}>
            <Text role="caption" style={{ fontWeight: 800, textAlign: 'right', color: '#64748B' }}>{k.label}</Text>
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
          <Box padding={3} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }} layoutDirection="row" justify="space-between" align="center">
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>قائمة المراجعة ({filteredItems.length})</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'left' }}>مراجعة الصور والمنتجات</Text>
          </Box>
          <Box style={{ flex: 1 }} padding={2}>
            <Box style={{ overflowY: 'auto', flex: 1 }}>
              {filteredItems.length === 0 && (
                <Box padding={10} align="center">
                  <Text tone="muted">لا توجد عناصر مطابقة</Text>
                </Box>
              )}
              {filteredItems.map(item => {
                const meta = getStageMeta(item.stage);
                const isSelected = item.id === selectedId;
                return (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    subtitle={item.source}
                    onPress={() => setSelectedId(item.id)}
                    selected={isSelected}
                    badgeLabel={meta.text}
                    badgeTone={meta.tone}
                    meta={(
                      <Box layoutDirection="row" gap={1}>
                        <Chip label={translateEntityType(item.entityType)} size="sm" />
                        <Chip label={policyLabel(item.mediaPolicy)} size="sm" tone={policyTone(item.mediaPolicy)} />
                      </Box>
                    )}
                  />
                );
              })}
            </Box>
          </Box>
        </Surface>

        {/* Right: Inspector */}
        <Box style={{ width: 380 }} gap={3}>
          {selected ? (
            <Box gap={3} style={{ overflowY: 'auto', paddingBottom: 20 }}>
              {/* Preview */}
              <Surface padding={4} gap={3}>
                <Text role="caption" tone="muted" style={{ fontWeight: 700, textAlign: 'right' }}>معاينة الوسيط</Text>
                <Surface tone="inset" style={{ height: 160, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                  <Text role="caption" tone="muted" style={{ fontWeight: '800' }}>معاينة المحتوى</Text>
                </Surface>
                {selected.mediaKey && (
                  <Box dir="ltr" padding={2} style={{ backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '6px' }}>
                    <Text style={{ fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {selected.mediaKey}
                    </Text>
                  </Box>
                )}
              </Surface>

              {/* Inspector Details */}
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

              {/* Media Policy */}
              <Surface tone={policyTone(selected.mediaPolicy)} padding={4}>
                <Text role="caption" style={{ fontWeight: 800, opacity: 0.8 }}>سياسة الوسائط</Text>
                <Text role="bodyStrong" style={{ marginTop: 4 }}>{policyLabel(selected.mediaPolicy)}</Text>
                {selected.systemNote && (
                  <Text role="caption" style={{ marginTop: 8, lineHeight: 1.5 }}>{selected.systemNote}</Text>
                )}
              </Surface>

              {/* Actions */}
              <Surface padding={4} gap={3}>
                <Text role="caption" tone="muted" style={{ fontWeight: 800 }}>الإجراءات المتوفرة</Text>

                {selected.stage === 'marketing-review' && (
                  <Box gap={2}>
                    <Button label="اعتماد تسويقي" tone="brand" onPress={() => handleApprove(selected.id)} />
                    <Box layoutDirection="row" gap={2}>
                      <Button style={{ flex: 1 }} label="طلب تعديل" tone="warning" onPress={() => handleFix(selected.id)} />
                      <Button style={{ flex: 1 }} label="رفض" tone="danger" onPress={() => handleReject(selected.id)} />
                    </Box>
                  </Box>
                )}

                {selected.stage === 'marketing-approved' && (
                  <Button label="إرسال للكتالوج" tone="success" onPress={() => handleCatalog(selected.id)} />
                )}

                {selected.stage === 'needs-fix' && (
                  <Surface tone="warning" padding={3}>
                    <Text role="caption" style={{ fontWeight: 800 }}>في انتظار تعديل الشريك</Text>
                    <Text role="caption">المالك الحالي: {translateOwner(selected.nextOwner)}</Text>
                  </Surface>
                )}

                {(selected.stage === 'catalog-adopted' || selected.stage === 'rejected') && (
                  <Surface tone="inset" padding={3}>
                    <Text role="caption" style={{ fontWeight: 800 }}>
                      {selected.stage === 'catalog-adopted' ? '✅ تم الإرسال للكتالوج بنجاح' : '❌ العنصر مرفوض'}
                    </Text>
                  </Surface>
                )}

                {/* UI Only Tool */}
                {(selected.entityType === 'product-media' || selected.entityType === 'store') && selected.stage === 'marketing-review' && (
                  <Button
                    label="تحسين الصورة"
                    tone="default"
                    variant="ghost"
                    onPress={() => undefined}
                    disabled
                  />
                )}
              </Surface>

              {/* ownership notice */}
              <Box padding={3} style={{ backgroundColor: 'rgba(3,105,161,0.05)', borderRadius: '12px', borderLeftWidth: 4, borderLeftColor: '#0369A1' }}>
                <Text role="caption" style={{ color: '#0369A1', lineHeight: 1.6 }}>
                  📌 ملاحظة: الاعتماد التسويقي هو خطوة وسيطة. النشر الفعلي يتم عبر فريق الكتالوج لضمان الجودة المركزية.
                </Text>
              </Box>
            </Box>
          ) : (
            <Surface tone="raised" style={{ height: 300, alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
              <Text tone="muted">يرجى اختيار عنصر للمراجعة</Text>
            </Surface>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MarketingMediaReviewCommandDeckScreen;
