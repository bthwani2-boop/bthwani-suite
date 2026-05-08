'use client';

import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
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
import { ApprovalStage, resolveNextOwner } from '../../shared/workflow';

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

function stageLabel(stage: ApprovalStage): { text: string; bg: string; fg: string } {
  switch (stage) {
    case 'marketing-review': return { text: 'قيد المراجعة', bg: '#FEF3C7', fg: '#D97706' };
    case 'marketing-approved': return { text: 'معتمد تسويقياً', bg: '#DBEAFE', fg: '#1D4ED8' };
    case 'catalog-adopted': return { text: 'أُرسل للكتالوج', bg: '#DCFCE7', fg: '#16A34A' };
    case 'needs-fix': return { text: 'يتطلب تعديل', bg: '#FEF2F2', fg: '#DC2626' };
    case 'rejected': return { text: 'مرفوض', bg: '#F1F5F9', fg: '#64748B' };
    default: return { text: stage, bg: '#F1F5F9', fg: '#475569' };
  }
}

function entityLabel(type: string): string {
  switch (type) {
    case 'product': return 'منتج جديد';
    case 'product-media': return 'صورة منتج';
    case 'category-suggestion': return 'فئة مقترحة';
    case 'store': return 'وسائط متجر';
    default: return type;
  }
}

function policyLabel(p: MediaPolicyKind): string {
  switch (p) {
    case 'catalog-owned-media': return 'وسائط الكتالوج';
    case 'partner-owned-exception': return 'استثناء شريك';
    case 'restaurant-exception': return 'استثناء مطعم';
    case 'media-conflict': return 'تعارض وسائط';
  }
}

function policyColor(p: MediaPolicyKind): { bg: string; fg: string } {
  switch (p) {
    case 'catalog-owned-media': return { bg: '#F0FDF4', fg: '#166534' };
    case 'partner-owned-exception': return { bg: '#FEF3C7', fg: '#92400E' };
    case 'restaurant-exception': return { bg: '#FFEDD5', fg: '#9A3412' };
    case 'media-conflict': return { bg: '#FEF2F2', fg: '#991B1B' };
  }
}

function nextOwnerLabel(owner: string): string {
  switch (owner) {
    case 'control-panel-catalog': return 'الكتالوج';
    case 'control-panel-marketing': return 'التسويق';
    case 'app-partner': return 'الشريك';
    default: return owner;
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

  const kpis = React.useMemo(() => getMediaReviewKpis(), [items]);

  const refresh = () => setItems(getMediaReviewItems());

  const selected = React.useMemo(
    () => items.find(i => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  const filteredItems = React.useMemo(() => applyFilter(items, filter), [items, filter]);

  const handleApprove = (id: string) => { approveMediaReviewItem(id); refresh(); };
  const handleFix = (id: string) => { requestMediaFix(id); refresh(); };
  const handleReject = (id: string) => { rejectMediaReviewItem(id); refresh(); };
  const handleCatalog = (id: string) => { sendMediaToCatalog(id); refresh(); };

  // ── Style tokens ──────────────────────────
  const card: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid rgba(10,47,92,0.08)',
    padding: '14px',
  };

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', minHeight: 0 }}>

      {/* ── KPI Strip ─────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { label: 'قيد المراجعة', value: kpis.pending, bg: '#FEF3C7', fg: '#D97706' },
          { label: 'معتمد تسويقياً', value: kpis.approved, bg: '#DBEAFE', fg: '#1D4ED8' },
          { label: 'يتطلب تعديل', value: kpis.needsFix, bg: '#FEF2F2', fg: '#DC2626' },
          { label: 'جاهز للكتالوج', value: kpis.catalogReady, bg: '#DCFCE7', fg: '#16A34A' },
          { label: 'تعارضات', value: kpis.conflicts, bg: '#FFF7ED', fg: '#9A3412' },
        ].map(k => (
          <div key={k.label} style={{ flex: '1 1 90px', minWidth: 90, backgroundColor: k.bg, borderRadius: '10px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', color: k.fg, fontWeight: 700 }}>{k.label}</span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: k.fg, lineHeight: 1 }}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ───────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: filter === f.id ? '1.5px solid #0A2F5C' : '1px solid #E2E8F0',
              backgroundColor: filter === f.id ? '#0A2F5C' : '#fff',
              color: filter === f.id ? '#fff' : '#475569',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Main Layout: List + Inspector ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '14px', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Left: Review List */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2F5C' }}>قائمة المراجعة ({filteredItems.length})</span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>مراجعة الصور والمنتجات فقط</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '10px' }}>
            {filteredItems.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                لا توجد عناصر في هذا التصنيف
              </div>
            )}
            {filteredItems.map(item => {
              const stage = stageLabel(item.stage);
              const isSelected = item.id === selectedId;
              const policy = policyColor(item.mediaPolicy);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #FF500D' : '1px solid transparent',
                    backgroundColor: isSelected ? '#FFF7F5' : '#F8FAFC',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 800, color: '#0A2F5C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 700 }}>
                        {entityLabel(item.entityType)}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: policy.bg, color: policy.fg, fontWeight: 700 }}>
                        {policyLabel(item.mediaPolicy)}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '3px 8px', borderRadius: '6px', backgroundColor: stage.bg, flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: stage.fg }}>{stage.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {selected ? (
            <>
              {/* Preview */}
              <div style={card}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>معاينة الوسيط</p>
                <div style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: '8px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #CBD5E1',
                  overflow: 'hidden',
                }}>
                  <span style={{ fontSize: '32px' }}>
                    {selected.entityType === 'product-media' || selected.entityType === 'store' ? '🖼️'
                      : selected.entityType === 'product' ? '📦'
                      : selected.entityType === 'category-suggestion' ? '🗂️'
                      : '📁'}
                  </span>
                </div>
                {/* mediaKey — LTR only */}
                {selected.mediaKey && (
                  <p dir="ltr" style={{ margin: '8px 0 0 0', fontSize: '10px', color: '#64748B', fontFamily: 'monospace', textAlign: 'left', wordBreak: 'break-all' }}>
                    {selected.mediaKey}
                  </p>
                )}
              </div>

              {/* Inspector */}
              <div style={card}>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 800, color: '#0A2F5C' }}>المفتش</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {[
                    { label: 'العنوان', value: selected.title },
                    { label: 'النوع', value: entityLabel(selected.entityType) },
                    { label: 'الحالة', value: stageLabel(selected.stage).text },
                    { label: 'المصدر', value: selected.source },
                    { label: 'المالك التالي', value: nextOwnerLabel(selected.nextOwner) },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, flexShrink: 0 }}>{row.label}</span>
                      <span style={{ fontSize: '11px', color: '#0A2F5C', fontWeight: 700, textAlign: 'left' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Policy */}
              <div style={{ ...card, backgroundColor: policyColor(selected.mediaPolicy).bg }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 800, color: '#64748B' }}>سياسة الوسائط</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: policyColor(selected.mediaPolicy).fg }}>
                  {policyLabel(selected.mediaPolicy)}
                </p>
                {selected.systemNote && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>{selected.systemNote}</p>
                )}
              </div>

              {/* Next Owner */}
              <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>المالك التالي بعد الاعتماد</span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '3px 10px', borderRadius: '6px' }}>
                  {nextOwnerLabel(selected.nextOwner)}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 800, color: '#64748B' }}>الإجراءات</p>
                {selected.stage === 'marketing-review' && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { handleApprove(selected.id); }}
                      style={{ flex: 1, padding: '8px 10px', backgroundColor: '#0A2F5C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      اعتماد تسويقي ✓
                    </button>
                    <button
                      onClick={() => { handleFix(selected.id); }}
                      style={{ flex: 1, padding: '8px 10px', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FCD34D', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      طلب تعديل ✏️
                    </button>
                    <button
                      onClick={() => { handleReject(selected.id); }}
                      style={{ flex: 1, padding: '8px 10px', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      رفض ✕
                    </button>
                  </div>
                )}
                {selected.stage === 'marketing-approved' && (
                  <button
                    onClick={() => { handleCatalog(selected.id); }}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#16A34A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
                  >
                    إرسال للكتالوج 🚀
                  </button>
                )}
                {selected.stage === 'needs-fix' && (
                  <div style={{ padding: '8px', backgroundColor: '#FEF2F2', borderRadius: '8px', fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>
                    في انتظار تعديل الشريك — المالك: {nextOwnerLabel(selected.nextOwner)}
                  </div>
                )}
                {(selected.stage === 'catalog-adopted' || selected.stage === 'rejected') && (
                  <div style={{ padding: '8px', backgroundColor: '#F1F5F9', borderRadius: '8px', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                    {selected.stage === 'catalog-adopted' ? '✅ تم الإرسال للكتالوج — لا يمكن لتسويق نشره مباشرة.' : '❌ مرفوض'}
                  </div>
                )}
                {/* تحسين الصورة UI فقط */}
                {(selected.entityType === 'product-media' || selected.entityType === 'store') && selected.stage === 'marketing-review' && (
                  <button
                    onClick={() => { /* UI only — no backend */ }}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#F8FAFC', color: '#475569', border: '1px dashed #CBD5E1', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🎨 تحسين الصورة (UI فقط — قريباً)
                  </button>
                )}
              </div>

              {/* Ownership rule note */}
              <div style={{ ...card, backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#0369A1', fontWeight: 700, lineHeight: 1.6 }}>
                  📌 قاعدة الملكية: الاعتماد التسويقي لا يجعل العنصر مرئياً للعميل مباشرةً.
                  بعد الاعتماد ينتقل المالك إلى <strong>الكتالوج</strong> ثم يُنشر رسمياً من هناك.
                </p>
              </div>
            </>
          ) : (
            <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>اختر عنصراً من القائمة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketingMediaReviewCommandDeckScreen;
