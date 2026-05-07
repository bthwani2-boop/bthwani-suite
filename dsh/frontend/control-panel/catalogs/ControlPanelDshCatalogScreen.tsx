'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, Chip } from '@bthwani/ui-kit';
import {
  dshCatalogMetrics,
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogWorkspaceMode,
  LocalCatalogFilter
} from './catalog'; // Adjust imports if necessary, ensuring we import what's in catalog.ts
import styles from '../operations/dsh-surface.module.css';

// --- Types ---
export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

// Extracted from original file locally
type WorkspaceMode =
  | 'catalog'
  | 'quick-entry'
  | 'partner-entry'
  | 'field-intake'
  | 'duplicate-resolution'
  | 'category-mapping'
  | 'media-governance';

type FilterType = 'all' | 'master' | 'partner-exception' | 'partner-review' | 'marketing-review' | 'price-conflict' | 'non-matching' | 'category-proposals';

// --- Shared Components ---

function FilterToken({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
      <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>{label}</Text>
      <div onClick={onRemove} style={{ cursor: 'pointer', color: '#64748B', fontSize: '12px', lineHeight: 1 }}>✖</div>
    </div>
  );
}

function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" style={{ fontWeight: 700, color: isCentral ? '#16A34A' : '#D97706' }}>
      {isCentral ? 'مركزي' : 'شريك'}
    </Text>
  );
}

function InspectorTile({ title, children, dashed = false, warning = false }: { title: string, children: React.ReactNode, dashed?: boolean, warning?: boolean }) {
  return (
    <Box gap={2} style={{ padding: '12px', backgroundColor: warning ? '#FEF2F2' : dashed ? '#FFFFFF' : '#F8FAFC', borderRadius: '8px', borderWidth: 1, borderColor: warning ? '#FECACA' : dashed ? '#CBD5E1' : '#E2E8F0', borderStyle: dashed ? 'dashed' : 'solid' }}>
       <Text role="caption" style={{ fontWeight: 800, color: warning ? '#DC2626' : '#0A2F5C' }}>{title}</Text>
       {children}
    </Box>
  );
}

function MiniInfoBox({ label, value, valueColor, isBoldValue = false }: { label: string, value: string | React.ReactNode, valueColor?: string, isBoldValue?: boolean }) {
  return (
    <Box gap={0}>
      <Text role="caption" tone="muted" style={{ fontSize: '10px', textAlign: 'right' }}>{label}</Text>
      <Text role="caption" style={{ color: valueColor || '#0A2F5C', fontWeight: isBoldValue ? 800 : 600, textAlign: 'right' }}>{value}</Text>
    </Box>
  );
}

function GridMenuTile({ icon, title }: { icon: string, title: string }) {
  return (
    <Surface tone="inset" padding={4} style={{ borderRadius: 8, cursor: 'pointer', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: '8px' }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <Text role="caption" style={{ fontWeight: 700, textAlign: 'center' }}>{title}</Text>
    </Surface>
  );
}

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [workspaceMode, setWorkspaceMode] = React.useState<WorkspaceMode>('catalog');
  const [showBulkOps, setShowBulkOps] = React.useState(false);
  const [activeMainCategory, setActiveMainCategory] = React.useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = React.useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  // Handlers
  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
  };

  const selectedProduct = dshCatalogProducts.find(p => p.id === selectedProductId) ?? null;

  const isManualOrderCategory = activeMainCategory?.renderMode === 'manual-order';

  const filteredProducts = isManualOrderCategory ? [] : dshCatalogProducts.filter(p => {
    if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
    if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      (p.gtin && p.gtin.includes(searchLower)) ||
      (p.barcode && p.barcode.includes(searchLower));

    if (!matchesSearch) return false;

    if (activeFilter === 'master') return p.mediaPolicy === 'catalog-owned-media';
    if (activeFilter === 'partner-exception') return p.mediaPolicy === 'partner-owned-exception';
    if (activeFilter === 'partner-review') return p.approvalStage === 'partner-review';
    if (activeFilter === 'marketing-review') return p.approvalStage === 'marketing-review';
    if (activeFilter === 'price-conflict') return !!p.conflictReason;
    if (activeFilter === 'non-matching') return false;
    if (activeFilter === 'category-proposals') return false;

    return true;
  });

  const counts: Record<FilterType, number> = {
    'all': dshCatalogProducts.length,
    'master': dshCatalogProducts.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
    'partner-exception': dshCatalogProducts.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
    'partner-review': dshCatalogProducts.filter(p => p.approvalStage === 'partner-review').length,
    'marketing-review': dshCatalogProducts.filter(p => p.approvalStage === 'marketing-review').length,
    'price-conflict': dshCatalogProducts.filter(p => !!p.conflictReason).length,
    'non-matching': 0,
    'category-proposals': 5
  };

  // --- Operational Sub Views (Reused from previous phases but occupying full space) ---
  const renderQuickEntry = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
      <Box gap={1}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>إدخال سريع ذكي</Text>
        <Text role="bodySm" tone="muted">إضافة منتجات بأقل جهد تشغيلي.</Text>
      </Box>
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
         <GridMenuTile icon="➕" title="منتج مركزي جديد" />
         <GridMenuTile icon="📷" title="باركود / GTIN" />
         <GridMenuTile icon="📝" title="رقم SKU" />
         <GridMenuTile icon="📄" title="استيراد CSV" />
         <GridMenuTile icon="🤝" title="اقتراح شريك" />
         <GridMenuTile icon="🔗" title="مطابقة منتج" />
      </Box>
    </Box>
  );

  const renderPartnerEntry = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
      <Box gap={1}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>واجهة الشريك</Text>
        <Text role="bodySm" tone="muted">تعديل التوفر والسعر فقط.</Text>
      </Box>
      <Box style={{ flexDirection: 'row', gap: '16px' }}>
        <Box style={{ flex: 1, gap: '12px' }}>
          <SearchField placeholder="بحث..." />
          <Surface tone="default" padding={3} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
             <Box style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '20px', backgroundColor: '#F8FAFC', padding: '4px', borderRadius: '4px' }}>🍎</div>
                <Box>
                  <Text role="bodyStrong" style={{ color: '#0A2F5C', textAlign: 'right', fontSize: '12px' }}>تفاح رويال غالا</Text>
                  <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>المرجعي: 18 ر.س</Text>
                </Box>
             </Box>
          </Surface>
        </Box>
        <Surface tone="inset" padding={4} style={{ flex: 1, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }} gap={3}>
           <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>تجاوزات المتجر</Text>
           <Box gap={1}>
             <Text role="caption" tone="muted">السعر (ر.س)</Text>
             <input type="number" defaultValue={18.0} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', outline: 'none', width: '100%', fontSize: '12px' }} />
           </Box>
           <Box gap={1}>
             <Text role="caption" tone="muted">المخزون</Text>
             <input type="number" defaultValue={100} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', outline: 'none', width: '100%', fontSize: '12px' }} />
           </Box>
           <Box gap={1}>
             <Text role="caption" tone="muted">التوفر</Text>
             <select style={{ padding: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', outline: 'none', backgroundColor: '#FFFFFF', width: '100%', fontSize: '12px' }}>
                <option>متاح</option>
                <option>نفذت</option>
             </select>
           </Box>
           <Button label="تحديث" tone="primary" size="sm" style={{ marginTop: '8px' }} />
        </Surface>
      </Box>
    </Box>
  );

  const renderFieldIntake = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
      <Box gap={1}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>مهام الميدان</Text>
        <Text role="bodySm" tone="muted">اعتماد اقتراحات الميدان.</Text>
      </Box>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', border: '1px solid #E2E8F0' }}>
        <thead style={{ backgroundColor: '#F8FAFC' }}>
           <tr>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>المقترح</th>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>النوع</th>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>المندوب</th>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>الإجراء</th>
           </tr>
        </thead>
        <tbody>
           <tr>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}><Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>مخبوزات عضوية</Text></td>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}><Chip label="فئة جديدة" tone="brand" /></td>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}><Text role="caption">أحمد</Text></td>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                <Box style={{ flexDirection: 'row', gap: '4px' }}>
                  <Button label="اعتماد" tone="primary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
                  <Button label="رفض" tone="secondary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
                </Box>
             </td>
           </tr>
        </tbody>
      </table>
    </Box>
  );

  const renderDuplicateResolution = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
      <Box gap={1}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>حل التكرارات</Text>
        <Text role="bodySm" tone="muted">دمج المنتجات المتشابهة.</Text>
      </Box>
      <Box style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', borderWidth: 1, borderColor: '#E2E8F0' }}>
         <Surface tone="default" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed' }}>
            <Chip label="مركزي" tone="brand" />
            <Box gap={1} style={{ marginTop: '8px', textAlign: 'right' }}>
               <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>حليب المراعي طازج</Text>
               <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '10px' }}>GTIN: 6281000</Text>
               <Text role="caption" style={{ color: '#16A34A', fontWeight: 800 }}>6.00 ر.س</Text>
            </Box>
         </Surface>
         <Box style={{ alignItems: 'center', gap: '4px' }}>
            <Text role="caption" style={{ color: '#D97706', fontWeight: 700 }}>98% 🤖</Text>
            <Button label="دمج ⬅️" tone="primary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
            <Button label="تجاهل" tone="secondary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
         </Box>
         <Surface tone="inset" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Chip label="مكرر" tone="default" />
            <Box gap={1} style={{ marginTop: '8px', textAlign: 'right' }}>
               <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>حليب المراعي</Text>
               <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '10px' }}>GTIN: 6281000</Text>
               <Text role="caption" style={{ color: '#16A34A', fontWeight: 800 }}>6.50 ر.س</Text>
            </Box>
         </Surface>
      </Box>
    </Box>
  );

  const renderCategoryMapping = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#FFFFFF', overflowY: 'auto' }}>
      <Box gap={1}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>مساعد ربط الفئات</Text>
        <Text role="bodySm" tone="muted">اقتراحات ذكية للمنتجات غير المرتبطة.</Text>
      </Box>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', border: '1px solid #E2E8F0' }}>
        <thead style={{ backgroundColor: '#F8FAFC' }}>
           <tr>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>المنتج</th>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>المقترح (AI)</th>
             <th style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textAlign: 'right' }}>الإجراء</th>
           </tr>
        </thead>
        <tbody>
           <tr>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                   <div style={{ fontSize: '16px' }}>🧃</div>
                   <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>عصير برتقال</Text>
                </Box>
             </td>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                   <Text style={{ color: '#16A34A', fontWeight: 800, fontSize: '11px' }}>عصائر طازجة</Text>
                   <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: '9px', padding: '2px 4px', borderRadius: '4px' }}>98%</span>
                </Box>
             </td>
             <td style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', textAlign: 'right' }}>
                <Box style={{ flexDirection: 'row', gap: '4px' }}>
                  <Button label="قبول" tone="primary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
                  <Button label="تعديل" tone="secondary" size="sm" style={{ padding: '4px 8px', fontSize: '10px' }} />
                </Box>
             </td>
           </tr>
        </tbody>
      </table>
    </Box>
  );

  const renderMediaGovernance = () => (
    <Box padding={6} gap={4} style={{ flex: 1, backgroundColor: '#F8FAFC', overflowY: 'auto' }}>
      <Box gap={2}>
        <Text role="titleMd" style={{ color: '#0A2F5C' }}>حوكمة الميديا</Text>
        <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
           <Surface tone="inset" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }} gap={1}>
              <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800, textAlign: 'right' }}>🛒 المركزية (بقالات)</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right', fontSize: '10px' }}>
                صورة واحدة تدار بالكتالوج.
              </Text>
           </Surface>
           <Surface tone="inset" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }} gap={1}>
              <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800, textAlign: 'right' }}>🍽️ استثناءات (مطاعم)</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right', fontSize: '10px' }}>
                منتج فريد وصورة تدار بالشريك والتسويق.
              </Text>
           </Surface>
        </Box>
      </Box>

      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
         <Surface tone="default" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }} gap={3}>
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800 }}>مركزي (Catalog)</Text>
               <Chip label="صورة مركزية" tone="brand" />
            </Box>
            <Box style={{ backgroundColor: '#F1F5F9', padding: '8px', borderRadius: '4px', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
               <div style={{ width: '32px', height: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🍎</div>
               <Text role="caption" style={{ fontWeight: 700, textAlign: 'right' }}>تفاح رويال غالا</Text>
            </Box>
            <Text role="caption" style={{ color: '#16A34A', fontWeight: 800, textAlign: 'right' }}>✅ معتمدة للجميع</Text>
         </Surface>

         <Surface tone="default" padding={4} style={{ borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }} gap={3}>
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800 }}>استثناء (Partner)</Text>
               <Chip label="استثناء شريك" tone="default" />
            </Box>
            <Box style={{ backgroundColor: '#FEE2E2', padding: '8px', borderRadius: '4px', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
               <div style={{ width: '32px', height: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px dashed #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🍗</div>
               <Text role="caption" style={{ fontWeight: 700, textAlign: 'right' }}>دجاج مشوي</Text>
            </Box>
            <Text role="caption" style={{ color: '#D97706', fontWeight: 800, textAlign: 'right' }}>⏳ قيد تحسين التسويق</Text>
         </Surface>
      </Box>
    </Box>
  );

  return (
    <div className={styles.operationsCockpit} dir="rtl" style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>

      {/* 1. TOP BAR (Search, Actions, Filters, Categories) */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Row 1: Global Search & Tasks */}
        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#0A2F5C', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0
          }}>🗂️</div>

          <div style={{ width: '300px' }}>
            <SearchField
              placeholder="بحث شامل بالمنتج، باركود، SKU..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Operational Tabs (Tasks) */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
             {[
               { id: 'catalog', label: 'الكتالوج' },
               { id: 'quick-entry', label: 'إدخال سريع' },
               { id: 'partner-entry', label: 'الشريك' },
               { id: 'field-intake', label: 'الميدان' },
               { id: 'duplicate-resolution', label: 'تكرارات' },
               { id: 'category-mapping', label: 'ربط' },
               { id: 'media-governance', label: 'ميديا' }
             ].map(tab => (
                <div
                  key={tab.id}
                  onClick={() => { setWorkspaceMode(tab.id as WorkspaceMode); setSelectedProductId(null); }}
                  style={{
                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                    backgroundColor: workspaceMode === tab.id ? '#FFFFFF' : 'transparent',
                    boxShadow: workspaceMode === tab.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}>
                   <Text role="caption" style={{ fontWeight: workspaceMode === tab.id ? 800 : 600, color: workspaceMode === tab.id ? '#0A2F5C' : '#64748B' }}>{tab.label}</Text>
                </div>
             ))}
          </div>

          <Button label="⚙️ الأعمدة" tone="secondary" size="sm" style={{ padding: '6px 12px' }} />
        </div>

        {/* Row 2: Category Selector Rail (Only in catalog mode) */}
        {workspaceMode === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', padding: '8px 16px', overflowX: 'auto', borderBottom: '1px solid #F1F5F9', alignItems: 'center', whiteSpace: 'nowrap' }}>
             <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', marginLeft: '8px' }}>الفئات:</Text>

             <div onClick={() => handleMainCategorySelect(null)} style={{ cursor: 'pointer' }}>
               <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} />
             </div>
             {dshCatalogCategories.map(cat => (
               <div key={cat.id} onClick={() => handleMainCategorySelect(cat)} style={{ cursor: 'pointer' }}>
                 <Chip label={`${cat.emojiFallback} ${cat.label} ${cat.renderMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} />
               </div>
             ))}
          </div>
        )}

        {/* Row 2.1: Subcategory Selector Rail */}
        {workspaceMode === 'catalog' && activeMainCategory && activeMainCategory.subcategories.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', padding: '6px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9', alignItems: 'center', whiteSpace: 'nowrap' }}>
             <div onClick={() => setActiveSubCategory(null)} style={{ cursor: 'pointer' }}>
               <Text role="caption" style={{ fontWeight: !activeSubCategory ? 800 : 600, color: !activeSubCategory ? '#0A2F5C' : '#64748B', backgroundColor: !activeSubCategory ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>الكل</Text>
             </div>
             {activeMainCategory.subcategories.map(sub => (
               <div key={sub.id} onClick={() => setActiveSubCategory(sub)} style={{ cursor: 'pointer' }}>
                 <Text role="caption" style={{ fontWeight: activeSubCategory?.id === sub.id ? 800 : 600, color: activeSubCategory?.id === sub.id ? '#0A2F5C' : '#64748B', backgroundColor: activeSubCategory?.id === sub.id ? '#E2E8F0' : 'transparent', padding: '2px 8px', borderRadius: '12px' }}>{sub.label}</Text>
               </div>
             ))}
          </div>
        )}

        {/* Row 3: Operational Filters & Active Tokens */}
        {workspaceMode === 'catalog' && (
          <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto' }}>
            <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', whiteSpace: 'nowrap', marginLeft: '4px' }}>فلاتر:</Text>

            {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict', 'non-matching', 'category-proposals'] as FilterType[]).map(f => {
              const labels: Record<FilterType, string> = {
                all: 'الكل', 'master': 'مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر', 'non-matching': 'غير مطابق', 'category-proposals': 'مقترحات فئات'
              };
              return (
                <div key={f} onClick={() => setActiveFilter(f)} style={{ cursor: 'pointer' }}>
                   <Chip label={`${labels[f]} (${counts[f]})`} tone={activeFilter === f ? 'brand' : 'default'} />
                </div>
              );
            })}

            <div style={{ flex: 1, minWidth: '16px' }} />

            {(activeFilter !== 'all' || searchQuery) && (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                 <Text role="caption" tone="muted" style={{ whiteSpace: 'nowrap' }}>نشط:</Text>
                 {activeFilter !== 'all' && <FilterToken label={activeFilter} onRemove={() => setActiveFilter('all')} />}
                 {searchQuery && <FilterToken label={searchQuery} onRemove={() => setSearchQuery('')} />}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>

        {workspaceMode === 'quick-entry' && renderQuickEntry()}
        {workspaceMode === 'partner-entry' && renderPartnerEntry()}
        {workspaceMode === 'field-intake' && renderFieldIntake()}
        {workspaceMode === 'duplicate-resolution' && renderDuplicateResolution()}
        {workspaceMode === 'category-mapping' && renderCategoryMapping()}
        {workspaceMode === 'media-governance' && renderMediaGovernance()}

        {/* Excel-like Data Grid */}
        {workspaceMode === 'catalog' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FFFFFF', minWidth: 0 }}>

            {/* Grid Tools Row (Bulk Ops) */}
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
               <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                  <Button
                    label="🛠️ تفعيل الـ Bulk Action"
                    tone={showBulkOps ? "brand" : "secondary"}
                    size="sm"
                    onClick={() => setShowBulkOps(!showBulkOps)}
                    style={{ padding: '4px 8px', fontSize: '10px' }}
                  />
                  {showBulkOps && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', marginRight: '16px' }}>
                      <input type="checkbox" readOnly checked style={{ accentColor: '#0A2F5C' }} />
                      <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>1 محدد</Text>
                      <Button label="💰 تحديث أسعار" tone="secondary" size="sm" style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="📦 تحديث توفر" tone="secondary" size="sm" style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="🚀 مراجعة" tone="primary" size="sm" style={{ padding: '2px 8px', fontSize: '10px' }} />
                    </div>
                  )}
               </div>
               <Text role="caption" tone="muted">{filteredProducts.length} نتيجة</Text>
            </div>

            {/* Scrollable Data Table */}
            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
               {isManualOrderCategory ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                   <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
                   <Text role="titleMd" style={{ color: '#0A2F5C' }}>فئة الطلب اليدوي</Text>
                   <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: '400px', marginTop: '8px' }}>
                     المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                   </Text>
                 </div>
               ) : (
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', tableLayout: 'fixed' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F1F5F9', zIndex: 10, boxShadow: '0 1px 0 #E2E8F0' }}>
                      <tr>
                        {showBulkOps && <th style={{ padding: '6px 12px', width: '36px' }}></th>}
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '40px' }}>صورة</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '22%' }}>المنتج</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '15%' }}>الفئة</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '12%' }}>SKU/GTIN</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '12%' }}>السياسة</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '10%' }}>السعر</th>
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '12%' }}>الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedProductId(p.id)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: selectedProductId === p.id ? 'rgba(10,47,92,0.06)' : 'transparent',
                            borderBottom: '1px solid #E2E8F0'
                          }}
                        >
                          {showBulkOps && (
                            <td style={{ padding: '6px 12px' }} onClick={e => e.stopPropagation()}>
                              <input type="checkbox" style={{ accentColor: '#0A2F5C' }} />
                            </td>
                          )}
                          <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                             <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '1px solid #E2E8F0' }}>
                                {p.emojiFallback}
                             </div>
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                             <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>{p.name}</Text>
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{dshCatalogCategories.find(c => c.id === p.categoryPath.main)?.label}</Text>
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '10px' }}>{p.sku}</Text>
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                            <PolicyBadge mediaPolicy={p.mediaPolicy} />
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                            <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>{p.price} ر.س</Text>
                          </td>
                          <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                             <span style={{
                              padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, whiteSpace: 'nowrap',
                              backgroundColor: p.conflictReason ? '#FEE2E2' : p.approvalStage === 'client-visible' ? '#DCFCE7' : '#FEF3C7',
                              color: p.conflictReason ? '#DC2626' : p.approvalStage === 'client-visible' ? '#16A34A' : '#D97706'
                            }}>
                              {p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr><td colSpan={showBulkOps ? 8 : 7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '12px' }}>لا توجد منتجات مطابقة في هذه الفئة/الفلتر.</td></tr>
                      )}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        )}

        {/* Inspector Slide-out (Only visible when a row is selected) */}
        {workspaceMode === 'catalog' && selectedProductId && selectedProduct && (
          <div style={{ width: '340px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', zIndex: 30 }}>

             {/* Inspector Header */}
             <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>تفاصيل المنتج</Text>
                <div onClick={() => setSelectedProductId(null)} style={{ cursor: 'pointer', color: '#64748B', fontSize: '18px' }}>✕</div>
             </div>

             <Box gap={3} style={{ padding: '16px' }}>
                <Box style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                   <div style={{ width: '48px', height: '48px', backgroundColor: '#F8FAFC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid #E2E8F0', flexShrink: 0 }}>{selectedProduct.emojiFallback}</div>
                   <Box style={{ flex: 1, gap: '2px' }}>
                      <Text role="caption" style={{ color: '#0A2F5C', fontSize: '14px', fontWeight: 800, textAlign: 'right' }}>{selectedProduct.name}</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'right', fontSize: '10px' }}>SKU: {selectedProduct.sku} | GTIN: {selectedProduct.gtin || 'N/A'}</Text>
                   </Box>
                </Box>

                <InspectorTile title="أثر الكتالوج (Impact)">
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <MiniInfoBox label="📱 العميل" value="عرض فقط" />
                      <MiniInfoBox label="🏪 الشريك" value="تغيير سعر وتوفر" />
                      <MiniInfoBox label="📢 التسويق" value="تحسين صورة" />
                      <MiniInfoBox label="🗂️ الكتالوج" value="اعتماد نهائي" valueColor="#16A34A" />
                   </div>
                </InspectorTile>

                <InspectorTile title="توافق (Parity)">
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <MiniInfoBox label="ظهور للعميل" value="نعم" valueColor="#16A34A" isBoldValue />
                      <MiniInfoBox label="صورة مركزية" value={selectedProduct.mediaPolicy === 'catalog-owned-media' ? 'نعم' : 'لا'} valueColor={selectedProduct.mediaPolicy === 'catalog-owned-media' ? '#16A34A' : '#DC2626'} isBoldValue />
                      <MiniInfoBox label="مراجعة تسويق" value={selectedProduct.approvalStage === 'marketing-review' ? 'مطلوبة' : 'لا'} valueColor={selectedProduct.approvalStage === 'marketing-review' ? '#D97706' : '#16A34A'} isBoldValue />
                   </div>
                </InspectorTile>

                <InspectorTile title="معاينة (Preview)">
                   <Box style={{ flexDirection: 'row', gap: '8px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '24px' }}>{selectedProduct.emojiFallback}</div>
                      <Box style={{ flex: 1 }}>
                         <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800, textAlign: 'right', fontSize: '12px' }}>{selectedProduct.name}</Text>
                      </Box>
                      <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 800, textAlign: 'right' }}>{selectedProduct.price}</Text>
                   </Box>
                </InspectorTile>

                <InspectorTile title="تجاوزات الشريك" dashed>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <MiniInfoBox label="السعر" value={selectedProduct.partnerOverrides?.[0]?.price ? `${selectedProduct.partnerOverrides[0].price} ر.س` : 'مطابق'} valueColor={selectedProduct.partnerOverrides?.[0]?.price ? '#FF500D' : '#0A2F5C'} isBoldValue={!!selectedProduct.partnerOverrides?.[0]?.price} />
                      <MiniInfoBox label="التوفر" value={selectedProduct.partnerOverrides?.[0]?.isAvailable === false ? 'نفذت' : 'متاح'} />
                   </div>
                </InspectorTile>

                <InspectorTile title="التسويق">
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <MiniInfoBox label="الصورة" value={selectedProduct.mediaPolicy === 'marketing-enhancement-required' ? 'تحتاج تحسين' : 'جاهزة'} valueColor={selectedProduct.mediaPolicy === 'marketing-enhancement-required' ? '#DC2626' : '#16A34A'} isBoldValue />
                      <MiniInfoBox label="التموضع" value="قياسي" valueColor="#16A34A" isBoldValue />
                   </div>
                </InspectorTile>

                {selectedProduct.conflictReason && (
                   <InspectorTile title="تنبيه تعارض" warning>
                      <Text role="caption" style={{ color: '#DC2626' }}>{selectedProduct.conflictReason}</Text>
                   </InspectorTile>
                )}
             </Box>
          </div>
        )}

      </div>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
