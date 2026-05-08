'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, Surface, Text, SearchField, Chip, KeyValueList, Tabs, ListItem, Divider } from '@bthwani/ui-kit';
import {
  dshCatalogMetrics,
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification
} from './catalog';
import { getCatalogAdoptionItems } from '../../shared/catalog-adoption-store';
import { ApprovalRecord, ApprovalStage, transitionApprovalStage, resolveNextOwner } from '../../shared/workflow';
import styles from '../operations/dsh-surface.module.css';

// --- Types ---
export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

type WorkspaceMode =
  | 'catalog'
  | 'quick-entry'
  | 'partner-entry'
  | 'field-intake'
  | 'duplicate-resolution'
  | 'category-mapping'
  | 'media-governance'
  | 'marketing-approvals';

type FilterType = 'all' | 'master' | 'partner-exception' | 'partner-review' | 'marketing-review' | 'price-conflict' | 'non-matching' | 'category-proposals';

// --- Shared Components ---

function FilterToken({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <Surface tone="raised" paddingX={2} paddingY={0.5} radiusToken="full" layoutDirection="row" align="center" gap={1}>
      <Text role="caption" style={{ fontWeight: 700 }}>{label}</Text>
      <Button label="✕" tone="secondary" size="sm" onPress={onRemove} style={{ minWidth: 0, padding: 0, background: 'transparent', border: 'none' }} />
    </Surface>
  );
}

function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" style={{ fontWeight: 700, color: isCentral ? '#16A34A' : '#D97706', whiteSpace: 'nowrap' }}>
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

const WATERMARK_URL = '/dsh/media-fixtures/assets/seed/dsh/logo.png';

function WatermarkedImage({ src, fallback, size = 32 }: { src?: string, fallback?: string, size?: number }) {
  return (
    <Surface tone="inset" padding={0} border radiusToken="xs" style={{ width: size, height: size, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {src ? (
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product" />
      ) : (
        <Text style={{ fontSize: `${size/2}px` }}>{fallback || '📦'}</Text>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.4, backgroundColor: 'rgba(255,255,255,0.15)' }}>
        <img src={WATERMARK_URL} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt="Watermark" />
      </Box>
    </Surface>
  );
}

const FilterDropdown = ({ title, options, selected, onChange, onClose }: any) => {
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((o: string) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <Surface tone="raised" padding={2} gap={2} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200, marginTop: 4 }}>
      <Box padding={1} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
        <SearchField
          placeholder={`بحث في ${title}...`}
          value={search}
          onChangeText={setSearch}
        />
      </Box>
      <Box style={{ maxHeight: 150, overflowY: 'auto' }}>
        {filteredOptions.length === 0 ? (
           <Box padding={2} align="center">
             <Text role="caption" tone="muted">لا توجد نتائج</Text>
           </Box>
        ) : filteredOptions.map((opt: string) => (
          <Box key={opt} layoutDirection="row" align="center" gap={2} paddingY={1} style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((s: string) => s !== opt));
              }}
              style={{ accentColor: '#0A2F5C' }}
            />
            <Text role="caption" style={{ flex: 1, textAlign: 'right' }}>{opt}</Text>
          </Box>
        ))}
      </Box>
      <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 8 }}>
         <Button label="تطبيق" tone="brand" size="sm" onPress={onClose} />
         <Button label="مسح" tone="secondary" size="sm" onPress={() => { onChange([]); onClose(); }} />
      </Box>
    </Surface>
  );
};

import { CatalogAdoptionQueue } from './CatalogAdoptionQueue';

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('catalog');
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Column Filters
  const [colFilters, setColFilters] = useState<Record<string, string[]>>({
    name: [], category: [], classification: [], sku: [], price: [], policy: [], status: [], source: [], categoryMode: []
  });
  const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);

  // Handlers
  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
  };

  const selectedProduct = useMemo(() => dshCatalogProducts.find(p => p.id === selectedProductId) ?? null, [selectedProductId]);
  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    console.log('[CatalogScreen] Recalculating filters...', { searchQuery, activeFilter, activeMainCategory: activeMainCategory?.id });

    // 1. Base set: filter by Category and Manual Order mode
    if (isManualOrderCategory) {
      return {
        filteredProducts: [] as CatalogProductMaster[],
        counts: {
          'all': 0, 'master': 0, 'partner-exception': 0, 'partner-review': 0, 'marketing-review': 0, 'price-conflict': 0, 'non-matching': 0, 'category-proposals': 0
        },
        filterOptions: {
          name: [], category: [], classification: [], sku: [], price: [], policy: [], status: [], source: [], categoryMode: []
        }
      };
    }

    // 2. Initial filter by category and search
    let products = dshCatalogProducts.filter(p => {
      if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
      if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.gtin && p.gtin.includes(searchLower)) ||
        (p.barcode && p.barcode.includes(searchLower));

      return matchesSearch;
    });

    // 3. Dynamic counts for quick filters (based on current category/search)
    const dynamicCounts = {
      'all': products.length,
      'master': products.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
      'partner-exception': products.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
      'partner-review': products.filter(p => p.approvalStage === 'partner-review').length,
      'marketing-review': products.filter(p => p.approvalStage === 'marketing-review').length,
      'price-conflict': products.filter(p => !!p.conflictReason).length,
      'non-matching': 0,
      'category-proposals': 5
    };

    // 4. Apply Active Quick Filter
    if (activeFilter === 'master') products = products.filter(p => p.mediaPolicy === 'catalog-owned-media');
    else if (activeFilter === 'partner-exception') products = products.filter(p => p.mediaPolicy === 'partner-owned-exception');
    else if (activeFilter === 'partner-review') products = products.filter(p => p.approvalStage === 'partner-review');
    else if (activeFilter === 'marketing-review') products = products.filter(p => p.approvalStage === 'marketing-review');
    else if (activeFilter === 'price-conflict') products = products.filter(p => !!p.conflictReason);

    // 5. Apply Column Filters
    const getCatName = (id: string) => dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';
    const getClassifName = (p: CatalogProductMaster) => {
       if(!p.categoryPath.mainClassification) return 'عام';
       const mainCat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
       const sub = mainCat?.subcategories?.find(s => s.id === p.categoryPath.sub);
       const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
       return classif?.label || p.categoryPath.mainClassification;
    };

    if (colFilters.name.length > 0) products = products.filter(p => colFilters.name.includes(p.name));
    if (colFilters.category.length > 0) products = products.filter(p => colFilters.category.includes(getCatName(p.categoryPath.main)));
    if (colFilters.classification.length > 0) products = products.filter(p => colFilters.classification.includes(getClassifName(p)));
    if (colFilters.sku.length > 0) products = products.filter(p => colFilters.sku.includes(p.sku));
    if (colFilters.price.length > 0) products = products.filter(p => colFilters.price.includes(p.price.toString()));
    if (colFilters.policy.length > 0) products = products.filter(p => colFilters.policy.includes(p.mediaPolicy));
    if (colFilters.status.length > 0) products = products.filter(p => colFilters.status.includes(p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'));
    if (colFilters.source.length > 0) products = products.filter(p => colFilters.source.includes(p.sourceSurface || 'catalog'));

    // 6. Generate options for column filters from the CURRENT product set
    const filterOptions = {
       name: Array.from(new Set(products.map(p => p.name))),
       category: Array.from(new Set(products.map(p => getCatName(p.categoryPath.main)))),
       classification: Array.from(new Set(products.map(p => getClassifName(p)))),
       sku: Array.from(new Set(products.map(p => p.sku))),
       price: Array.from(new Set(products.map(p => p.price.toString()))),
       policy: Array.from(new Set(products.map(p => p.mediaPolicy))),
       status: Array.from(new Set(products.map(p => p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'))),
       source: Array.from(new Set(products.map(p => p.sourceSurface || 'catalog'))),
       categoryMode: ['catalog-based', 'manual-order']
    };

    return { filteredProducts: products, counts: dynamicCounts, filterOptions };
  }, [isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters]);

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const activeColFiltersCount = Object.values(colFilters).flat().length;

  const renderColHeader = (colId: string, title: string, width?: string) => (
    <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width, position: 'relative' }}>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setOpenFilterCol(openFilterCol === colId ? null : colId); }}>
          <span>{title}</span>
          <span style={{ color: colFilters[colId]?.length > 0 ? '#FF500D' : '#CBD5E1', fontSize: '10px' }}>▼</span>
       </div>
       {openFilterCol === colId && (
         <FilterDropdown
            column={colId}
            title={title}
            options={filterOptions[colId as keyof typeof filterOptions] || []}
            selected={colFilters[colId]}
            onChange={(val: string[]) => setColFilters(prev => ({ ...prev, [colId]: val }))}
            onClose={() => setOpenFilterCol(null)}
         />
       )}
    </th>
  );

  return (
    <Box dir="rtl" gap={0} background="background" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>

      <Surface tone="default" padding={0} border={false} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
        {/* Row 1: Search & Tabs */}
        <Box padding={2} layoutDirection="row" gap={3} align="center" style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.02)' }}>
          <Surface tone="brand" padding={1} radiusToken="sm">
            <Text style={{ fontSize: '16px' }}>🗂️</Text>
          </Surface>
          <Box style={{ width: 300 }}>
            <SearchField placeholder="بحث شامل بالمنتج، باركود، SKU..." value={searchQuery} onChangeText={setSearchQuery} />
          </Box>
          <Box style={{ flex: 1 }} />
          <Tabs
            items={[
              { id: 'catalog', label: 'الكتالوج' },
              { id: 'quick-entry', label: 'إدخال سريع' },
              { id: 'partner-entry', label: 'الشريك' },
              { id: 'field-intake', label: 'الميدان' },
              { id: 'marketing-approvals', label: 'اعتمادات التسويق' },
              { id: 'duplicate-resolution', label: 'تكرارات' },
              { id: 'category-mapping', label: 'ربط' },
              { id: 'media-governance', label: 'ميديا' }
            ].map(t => ({ ...t, value: t.id }))}
            value={workspaceMode}
            onValueChange={(v) => { setWorkspaceMode(v as WorkspaceMode); setSelectedProductId(null); }}
          />
          <Button label="إعدادات الأعمدة" tone="secondary" size="sm" onPress={() => {}} />
        </Box>

        {/* Row 2: Categories */}
        {workspaceMode === 'catalog' && (
          <Box layoutDirection="row" gap={2} padding={2} style={{ flexWrap: 'wrap', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.02)', alignItems: 'center' }}>
             <Text role="caption" style={{ fontWeight: 800, marginLeft: 8 }}>الفئات:</Text>
             <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} selected={!activeMainCategory} />
             {dshCatalogCategories.map(cat => (
               <Chip key={cat.id} label={`${cat.emojiFallback} ${cat.label} ${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} selected={activeMainCategory?.id === cat.id} />
             ))}
          </Box>
        )}

        {/* Row 2.1: Subcategories */}
        {workspaceMode === 'catalog' && activeMainCategory && activeMainCategory.subcategories.length > 0 && (
          <Box layoutDirection="row" gap={2} paddingX={3} paddingY={1} background="surfaceInset" style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.02)', alignItems: 'center', flexWrap: 'wrap' }}>
             <Chip label="الكل" size="sm" tone={!activeSubCategory ? 'brand' : 'default'} onPress={() => setActiveSubCategory(null)} selected={!activeSubCategory} />
             {activeMainCategory.subcategories.map(sub => (
               <Chip key={sub.id} label={sub.label} size="sm" tone={activeSubCategory?.id === sub.id ? 'brand' : 'default'} onPress={() => setActiveSubCategory(sub)} selected={activeSubCategory?.id === sub.id} />
             ))}
          </Box>
        )}

        {/* Row 3: Quick Filters & Active Chips */}
        {workspaceMode === 'catalog' && (
          <Box padding={2} layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
            <Text role="caption" style={{ fontWeight: 800, whiteSpace: 'nowrap', marginLeft: 4 }}>فلاتر سريعة:</Text>
            {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict', 'non-matching', 'category-proposals'] as FilterType[]).map(f => {
              const labels: Record<FilterType, string> = {
                all: 'الكل', 'master': 'مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر', 'non-matching': 'غير مطابق', 'category-proposals': 'مقترحات فئات'
              };
              const count = (counts as any)[f] || 0;
              return (
                <Chip key={f} label={`${labels[f]} (${count})`} tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} selected={activeFilter === f} />
              );
            })}

            <Box style={{ flex: 1, minWidth: 16 }} />

            {/* Active Chips Bar */}
            {(activeFilter !== 'all' || searchQuery || activeColFiltersCount > 0) && (
              <Surface tone="inset" padding={1} radiusToken="sm" layoutDirection="row" gap={1} align="center">
                 <Text role="caption" tone="muted" style={{ whiteSpace: 'nowrap', marginLeft: 4 }}>نشط:</Text>
                 {activeFilter !== 'all' && <FilterToken label={activeFilter} onRemove={() => setActiveFilter('all')} />}
                 {searchQuery && <FilterToken label={`بحث: ${searchQuery}`} onRemove={() => setSearchQuery('')} />}
                 {Object.entries(colFilters).map(([k, vals]) =>
                    vals.map(v => <FilterToken key={`${k}-${v}`} label={`${v}`} onRemove={() => setColFilters(prev => ({...prev, [k]: prev[k].filter(x => x !== v)}))} />)
                 )}
                 <Button label="مسح الكل" tone="secondary" size="sm" onPress={() => { setActiveFilter('all'); setSearchQuery(''); setColFilters({ name: [], category: [], classification: [], sku: [], price: [], policy: [], status: [], source: [], categoryMode: [] }); }} style={{ height: 24, paddingX: 2 }} />
              </Surface>
            )}
          </Box>
        )}
      </Surface>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        {workspaceMode === 'marketing-approvals' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'auto' }}>
            <CatalogAdoptionQueue />
          </div>
        )}

        {workspaceMode === 'catalog' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FFFFFF', minWidth: 0 }}>
            {/* Grid Tools Row (Bulk Ops) */}
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
               <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                  <Button label="🛠️ تفعيل الـ Bulk Action" tone={showBulkOps ? "brand" : "secondary"} size="sm" onClick={() => setShowBulkOps(!showBulkOps)} style={{ padding: '4px 8px', fontSize: '10px' }} />
                  {showBulkOps && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', marginRight: '16px' }}>
                      <input type="checkbox" readOnly checked style={{ accentColor: '#0A2F5C' }} />
                      <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>1 محدد</Text>
                      <Button label="💰 تحديث أسعار" tone="secondary" size="sm" disabled style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="📦 تحديث توفر" tone="secondary" size="sm" disabled style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="🚀 مراجعة" tone="primary" size="sm" disabled style={{ padding: '2px 8px', fontSize: '10px' }} />
                    </div>
                  )}
               </div>
               <Text role="caption" tone="muted">نتائج الكتالوج</Text>
            </div>

            {/* Scrollable Data Table */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#FFFFFF' }}>
               {isManualOrderCategory ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                   <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
                   <Text role="titleMd" style={{ color: '#0A2F5C' }}>فئة الطلب اليدوي</Text>
                   <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: '400px', marginTop: '8px' }}>
                     المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً. يمكن للعميل إدخال تفاصيل طلبه يدوياً.
                   </Text>
                 </div>
               ) : (
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', tableLayout: 'fixed' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F1F5F9', zIndex: 10, boxShadow: '0 1px 0 #E2E8F0' }}>
                      <tr>
                        {showBulkOps && <th style={{ padding: '6px 12px', width: '36px' }}></th>}
                        <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width: '48px' }}>صورة</th>
                        {renderColHeader('name', 'المنتج', '18%')}
                        {renderColHeader('category', 'الفئة', '12%')}
                        {renderColHeader('classification', 'التصنيف', '10%')}
                        {renderColHeader('sku', 'SKU/GTIN', '12%')}
                        {renderColHeader('price', 'السعر', '8%')}
                        {renderColHeader('policy', 'السياسة', '10%')}
                        {renderColHeader('source', 'المصدر', '8%')}
                        {renderColHeader('status', 'الحالة', '10%')}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const cat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                        const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                        const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                        return (
                          <tr key={p.id} onClick={() => setSelectedProductId(p.id)} style={{ cursor: 'pointer', backgroundColor: selectedProductId === p.id ? 'rgba(10,47,92,0.06)' : 'transparent', borderBottom: '1px solid #E2E8F0' }}>
                            {showBulkOps && (
                              <td style={{ padding: '6px 12px' }} onClick={e => e.stopPropagation()}>
                                <input type="checkbox" style={{ accentColor: '#0A2F5C' }} />
                              </td>
                            )}
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                               <WatermarkedImage src={p.imageUri} fallback={p.emojiFallback} size={32} />
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                               <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>{p.name}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{cat?.label}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{classif?.label || 'عام'}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '10px' }}>{p.sku}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                              <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>{p.price}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                              <PolicyBadge mediaPolicy={p.mediaPolicy} />
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{p.sourceSurface || 'catalog'}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                               <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, whiteSpace: 'nowrap', backgroundColor: p.conflictReason ? '#FEE2E2' : p.approvalStage === 'client-visible' ? '#DCFCE7' : '#FEF3C7', color: p.conflictReason ? '#DC2626' : p.approvalStage === 'client-visible' ? '#16A34A' : '#D97706' }}>
                                {p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        )}

        {/* 3. Inspector Slide-out */}
        {workspaceMode === 'catalog' && selectedProductId && selectedProduct && (
          <div style={{ width: '340px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', zIndex: 30 }}>
             <Box padding={4} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }} layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong">تفاصيل المنتج</Text>
                <Button label="✕" tone="secondary" size="sm" onPress={() => setSelectedProductId(null)} />
             </Box>
             <Box gap={3} padding={4}>
                <Box layoutDirection="row" gap={3} align="center">
                   <WatermarkedImage src={selectedProduct.imageUri} fallback={selectedProduct.emojiFallback} size={48} />
                   <Box style={{ flex: 1 }} gap={1}>
                      <Text role="bodyStrong">{selectedProduct.name}</Text>
                      <Text role="caption" tone="muted">SKU: {selectedProduct.sku}</Text>
                   </Box>
                </Box>

                <InspectorTile title="تسلسل الفئة (Hierarchy Path)">
                   <Text role="caption" style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.6, textAlign: 'right' }}>
                     {dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.label || 'غير معروف'}
                     {selectedProduct.categoryPath.sub && ` > ${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.label}`}
                     {selectedProduct.categoryPath.mainClassification && ` > ${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.mainClassifications?.find(c => c.id === selectedProduct.categoryPath.mainClassification)?.label || selectedProduct.categoryPath.mainClassification}`}
                   </Text>
                </InspectorTile>

                <InspectorTile title="حالة الواجهات (Cross-Surface Status)">
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                      <MiniInfoBox label="العميل" value={selectedProduct.surfaces.includes('client') ? 'يرى المنتج المنشور' : 'غير مرئي'} valueColor={selectedProduct.surfaces.includes('client') ? '#16A34A' : '#64748B'} isBoldValue />
                      <MiniInfoBox label="الشريك" value={selectedProduct.surfaces.includes('partner') ? 'يعدل السعر/المخزون/التوفر' : 'غير متاح'} />
                      <MiniInfoBox label="الميداني" value={selectedProduct.surfaces.includes('field') ? 'يقترح/يدخل أوليًا' : 'غير متاح'} />
                      <MiniInfoBox label="التسويق" value={selectedProduct.surfaces.includes('marketing') ? 'يراجع الصورة/اللغة' : 'غير متاح'} />
                   </div>
                   <Text role="caption" tone="muted" style={{ fontSize: '9px', textAlign: 'center', marginTop: '8px' }}>*حالة واجهة/Fixture - جاهز للربط لاحقًا</Text>
                </InspectorTile>

                <InspectorTile title="تجاوزات الشريك (Partner Override)" dashed>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <MiniInfoBox label="السعر" value={selectedProduct.partnerOverrides?.[0]?.price ? `${selectedProduct.partnerOverrides[0].price} ر.س` : 'مطابق'} valueColor={selectedProduct.partnerOverrides?.[0]?.price ? '#FF500D' : '#0A2F5C'} isBoldValue={!!selectedProduct.partnerOverrides?.[0]?.price} />
                      <MiniInfoBox label="التوفر" value={selectedProduct.partnerOverrides?.[0]?.isAvailable === false ? 'نفذت' : 'متاح'} />
                   </div>
                </InspectorTile>

                {selectedProduct.conflictReason && (
                   <InspectorTile title="تنبيه تعارض" warning>
                      <Text role="caption" style={{ color: '#DC2626' }}>{selectedProduct.conflictReason}</Text>
                   </InspectorTile>
                )}

                <Box gap={2} style={{ marginTop: '8px' }}>
                   <Button label="اعتماد التغييرات" tone="primary" size="sm" onClick={() => {}} disabled />
                   <Button label="طلب مراجعة تسويق" tone="secondary" size="sm" onClick={() => {}} />
                </Box>
             </Box>
          </div>
        )}
        {workspaceMode === 'quick-entry' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '32px' }}>
             <Box gap={6}>
                <Box gap={1}>
                   <Text role="titleLg" style={{ color: '#0A2F5C' }}>مركز الإدخال السريع (Rapid Intake)</Text>
                   <Text role="body" tone="muted">أضف منتجات جديدة للكتالوج المركزي عبر المسح الضوئي أو البحث الذكي.</Text>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                   <Surface tone="inset" padding={6} style={{ borderRadius: 12, cursor: 'pointer', border: '2px dashed #0A2F5C', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', backgroundColor: '#F0F9FF' }}>
                      <div style={{ fontSize: '40px' }}>📸</div>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>مسح باركود / GTIN</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>استخدم الكاميرا أو الماسح الضوئي لإضافة منتج فوراً</Text>
                   </Surface>

                   <Surface tone="inset" padding={6} style={{ borderRadius: 12, cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '40px' }}>🔍</div>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>بحث وإضافة سريعة</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>البحث في قاعدة بيانات المنتجات العالمية (GS1)</Text>
                   </Surface>

                   <Surface tone="inset" padding={6} style={{ borderRadius: 12, cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '40px' }}>📊</div>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>رفع ملف (Excel/CSV)</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>استيراد آلاف المنتجات دفعة واحدة عبر قوالب بثواني</Text>
                   </Surface>

                   <Surface tone="inset" padding={6} style={{ borderRadius: 12, cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '40px' }}>🤖</div>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>الإدخال المدعوم بالذكاء الاصطناعي</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'center' }}>استخراج البيانات تلقائياً من صور المنتجات أو القوائم</Text>
                   </Surface>
                </div>

                <Box gap={3} style={{ marginTop: '20px' }}>
                   <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>المسودات الأخيرة (Recent Drafts)</Text>
                   <div style={{ border: '1px solid #F1F5F9', borderRadius: '8px', overflow: 'hidden' }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                           <Box style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                              <div style={{ width: '32px', height: '32px', backgroundColor: '#F8FAFC', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                              <Text role="caption" style={{ fontWeight: 700 }}>منتج جديد #{1024 + i}</Text>
                           </Box>
                           <Chip label="مسودة" tone="default" />
                        </div>
                      ))}
                   </div>
                </Box>
             </Box>
          </div>
        )}

        {workspaceMode === 'partner-entry' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '32px' }}>
             <Box gap={6}>
                <Box gap={1}>
                   <Text role="titleLg" style={{ color: '#0A2F5C' }}>مراجعة تجاوزات الشركاء (Partner Overrides)</Text>
                   <Text role="body" tone="muted">إدارة طلبات تعديل الأسعار، الصور، والبيانات من قبل المتاجر والشركاء.</Text>
                </Box>

                <div style={{ display: 'flex', gap: '16px' }}>
                   <Surface tone="brand" padding={6} style={{ flex: 1, borderRadius: 12, backgroundColor: '#0A2F5C' }}>
                      <Text role="caption" style={{ color: '#FFFFFF', opacity: 0.8 }}>بانتظار المراجعة</Text>
                      <Text role="titleLg" style={{ color: '#FFFFFF', fontSize: '32px' }}>42</Text>
                   </Surface>
                   <Surface tone="inset" padding={6} style={{ flex: 1, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                      <Text role="caption" tone="muted">تم اعتمادها اليوم</Text>
                      <Text role="titleLg" style={{ color: '#16A34A', fontSize: '32px' }}>12</Text>
                   </Surface>
                   <Surface tone="inset" padding={6} style={{ flex: 1, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                      <Text role="caption" tone="muted">تنبيهات تعارض السعر</Text>
                      <Text role="titleLg" style={{ color: '#DC2626', fontSize: '32px' }}>7</Text>
                   </Surface>
                </div>

                 <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                    <div style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>قائمة الانتظار (Approval Queue)</Text>
                       <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>3 طلبات معلقة</Text>
                    </div>
                    {[
                       { partner: 'مطعم السعادة', product: 'برجر دجاج كلاسيك', change: 'تعديل سعر (25 -> 28)', time: 'منذ 10 دقائق', status: 'urgent' },
                       { partner: 'سوبر ماركت الخليج', product: 'حليب كامل الدسم 2 لتر', change: 'صورة جديدة (استثناء)', time: 'منذ ساعة', status: 'pending' },
                       { partner: 'حلويات ركن القصيم', product: 'معمول بالتمر 1 كجم', change: 'إضافة وصف مخصص', time: 'منذ 3 ساعات', status: 'pending' }
                    ].map((item, idx) => (
                       <div key={idx} style={{
                          padding: '16px 24px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: idx < 2 ? '1px solid #F1F5F9' : 'none',
                          position: 'relative',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFCFD'
                       }}>
                          {/* Status Indicator Bar */}
                          <div style={{
                             position: 'absolute',
                             right: 0,
                             top: '15%',
                             bottom: '15%',
                             width: '4px',
                             backgroundColor: item.status === 'urgent' ? '#FF500D' : '#CBD5E1',
                             borderRadius: '0 4px 4px 0'
                          }} />

                          <Box gap={1} style={{ flex: 1 }}>
                             <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', fontSize: '13px' }}>{item.product}</Text>
                             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{item.partner}</Text>
                                <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                                <Text role="caption" style={{ fontSize: '10px', color: '#FF500D', fontWeight: 600 }}>{item.change}</Text>
                             </div>
                             <Text role="caption" tone="muted" style={{ fontSize: '9px', marginTop: '2px' }}>{item.time}</Text>
                          </Box>

                          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                             <Button label="عرض التفاصيل" tone="secondary" size="sm" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px' }} />
                             <Button label="اعتماد سريع" tone="primary" size="sm" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px' }} />
                          </div>
                       </div>
                    ))}
                 </div>
             </Box>
          </div>
        )}

        {workspaceMode === 'field-intake' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '32px' }}>
             <Box gap={6}>
                <Box gap={1}>
                   <Text role="titleLg" style={{ color: '#0A2F5C' }}>مدخلات الميدان (Field Intelligence)</Text>
                   <Text role="body" tone="muted">متابعة البيانات والصور المرفوعة من قبل المناديب الميدانيين أثناء الجولات التفقدية.</Text>
                </Box>

                <Box gap={3}>
                   <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>آخر التحديثات الميدانية (Live Stream)</Text>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                      {[1, 2, 3, 4].map(i => (
                         <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ height: '140px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📸</div>
                            <div style={{ padding: '12px' }}>
                               <Text role="caption" style={{ fontWeight: 800 }}>صورة منتج جديدة</Text>
                               <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>عبر المندوب: أحمد علي</Text>
                               <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Text role="caption" style={{ color: '#0A2F5C', fontSize: '9px' }}>فرع السليمانية</Text>
                                  <Chip label="قيد المراجعة" tone="default" />
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </Box>
             </Box>
          </div>
        )}

        {workspaceMode === 'duplicate-resolution' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: '48px' }}>
             <div style={{ fontSize: '80px', marginBottom: '24px' }}>👯‍♂️</div>
             <Text role="titleLg" style={{ color: '#0A2F5C' }}>محرك حل التكرارات (De-duplication)</Text>
             <Text role="body" tone="muted" style={{ marginTop: '12px', textAlign: 'center', maxWidth: '500px' }}>
                يقوم النظام حالياً بتحليل الكتالوج للعثور على المنتجات المتكررة بناءً على الاسم، الـ SKU، والباركود.
             </Text>
             <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#F0F9FF', borderRadius: '12px', border: '1px solid #B9E6FE', width: '100%', maxWidth: '600px' }}>
                <Box gap={2}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text role="caption" style={{ fontWeight: 800, color: '#0369A1' }}>جاري التحليل والربط الذكي...</Text>
                      <Text role="caption" style={{ fontWeight: 800, color: '#0369A1' }}>85%</Text>
                   </div>
                   <div style={{ height: '8px', width: '100%', backgroundColor: '#E0F2FE', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '85%', backgroundColor: '#0EA5E9' }} />
                   </div>
                   <Text role="caption" tone="muted" style={{ fontSize: '11px', marginTop: '8px' }}>تم العثور على 14 مجموعة محتملة من المنتجات المتكررة.</Text>
                </Box>
             </div>
             <Button label="عرض المجموعات المكتشفة" tone="primary" style={{ marginTop: '24px' }} />
          </div>
        )}

        {workspaceMode === 'category-mapping' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '32px' }}>
             <Box gap={6}>
                <Box gap={1}>
                   <Text role="titleLg" style={{ color: '#0A2F5C' }}>ربط التصنيفات (Category Mapping)</Text>
                   <Text role="body" tone="muted">مزامنة شجرة التصنيفات بين الشركاء وبثواني لضمان دقة ظهور المنتجات.</Text>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                   <Box gap={3}>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>تصنيفات بثواني (Central)</Text>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', height: '400px', overflowY: 'auto' }}>
                         {dshCatalogCategories.map(cat => (
                            <div key={cat.id} style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}>
                               <Text role="caption" style={{ fontWeight: 700 }}>{cat.emojiFallback} {cat.label}</Text>
                            </div>
                         ))}
                      </div>
                   </Box>
                   <Box gap={3}>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>تصنيفات الشركاء (Unmapped)</Text>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', height: '400px', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
                         {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <Text role="caption">تصنيف خارجي #{100 + i}</Text>
                               <div style={{ color: '#0A2F5C', fontSize: '18px' }}>↔️</div>
                            </div>
                         ))}
                      </div>
                   </Box>
                </div>
             </Box>
          </div>
        )}

        {workspaceMode === 'media-governance' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '32px' }}>
             <Box gap={6}>
                <Box gap={1}>
                   <Text role="titleLg" style={{ color: '#0A2F5C' }}>حوكمة الوسائط (Media Governance)</Text>
                   <Text role="body" tone="muted">إدارة الأصول المرئية، العلامات المائية، والتحقق من جودة صور المنتجات.</Text>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                   {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} style={{ position: 'relative', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', height: '180px' }}>
                         <div style={{ height: '100%', width: '100%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ opacity: 0.2, fontSize: '40px' }}>🖼️</div>
                         </div>
                         <div style={{ position: 'absolute', top: 8, right: 8 }}>
                            <Chip label="مركزي" tone="brand" />
                         </div>
                         <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', backgroundColor: 'rgba(255,255,255,0.9)', borderTop: '1px solid #E2E8F0' }}>
                            <Text role="caption" style={{ fontSize: '10px', fontWeight: 800 }}>asset_product_{i}.png</Text>
                         </div>
                      </div>
                   ))}
                </div>
             </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
