const fs = require('fs');
const targetFile = 'C:/bthwani-suite/dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx';

const content = `'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, Surface, Text, SearchField, Chip } from '@bthwani/ui-kit';
import {
  dshCatalogMetrics,
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification
} from './catalog';
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
    <div style={{ width: size, height: size, borderRadius: '4px', backgroundColor: '#F8FAFC', position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {src ? (
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product" />
      ) : (
        <div style={{ fontSize: \`\${size/2}px\` }}>{fallback || '📦'}</div>
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4, backgroundColor: 'rgba(255,255,255,0.15)' }}>
        <img src={WATERMARK_URL} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt="Watermark" />
      </div>
    </div>
  );
}

const FilterDropdown = ({ title, options, selected, onChange, onClose }: any) => {
  const [search, setSearch] = useState('');

  // options is an object: { 'label': count }
  const optionKeys = Object.keys(options);
  const filteredKeys = optionKeys.filter((o: string) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, width: '220px', display: 'flex', flexDirection: 'column', marginTop: '4px' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '8px', borderBottom: '1px solid #E2E8F0' }}>
        <input
           type="text"
           placeholder={\`بحث في \${title}...\`}
           value={search}
           onChange={e => setSearch(e.target.value)}
           style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '11px', textAlign: 'right' }}
        />
      </div>
      <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '4px 0', textAlign: 'right' }}>
        {filteredKeys.length === 0 ? (
           <div style={{ padding: '8px', textAlign: 'center', color: '#94A3B8', fontSize: '11px' }}>لا توجد نتائج</div>
        ) : filteredKeys.map((opt: string) => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', color: '#0A2F5C', flexDirection: 'row-reverse' }}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((s: string) => s !== opt));
              }}
              style={{ accentColor: '#0A2F5C' }}
            />
            <span>{opt} <span style={{ color: '#94A3B8', fontSize: '9px' }}>({options[opt]})</span></span>
          </label>
        ))}
      </div>
      <div style={{ padding: '8px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
         <Button label="تطبيق" tone="primary" size="sm" onClick={onClose} style={{ padding: '2px 8px', fontSize: '10px' }} />
         <Button label="مسح" tone="secondary" size="sm" onClick={() => { onChange([]); onClose(); }} style={{ padding: '2px 8px', fontSize: '10px' }} />
      </div>
    </div>
  );
};

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

  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
  };

  const selectedProduct = useMemo(() => dshCatalogProducts.find(p => p.id === selectedProductId) ?? null, [selectedProductId]);
  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    let filtered = isManualOrderCategory ? [] : dshCatalogProducts.filter(p => {
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

    const getCatName = (id: string) => dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';
    const getClassifName = (p: CatalogProductMaster) => {
       if(!p.categoryPath.mainClassification) return 'عام';
       const mainCat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
       const sub = mainCat?.subcategories?.find(s => s.id === p.categoryPath.sub);
       const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
       return classif?.label || p.categoryPath.mainClassification;
    };

    const getCatModeName = (p: CatalogProductMaster) => {
       const cat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
       return cat?.categoryMode === 'manual-order' ? 'يدوي' : 'كتالوج';
    };

    const countOptions = (items: CatalogProductMaster[], extractor: (p: CatalogProductMaster) => string) => {
       return items.reduce((acc, p) => {
          const val = extractor(p);
          acc[val] = (acc[val] || 0) + 1;
          return acc;
       }, {} as Record<string, number>);
    };

    const filterOptions = {
       name: countOptions(filtered, p => p.name),
       category: countOptions(filtered, p => getCatName(p.categoryPath.main)),
       classification: countOptions(filtered, p => getClassifName(p)),
       sku: countOptions(filtered, p => p.sku),
       price: countOptions(filtered, p => p.price.toString()),
       policy: countOptions(filtered, p => p.mediaPolicy),
       status: countOptions(filtered, p => p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'),
       source: countOptions(filtered, p => p.sourceSurface || 'catalog'),
       categoryMode: countOptions(filtered, p => getCatModeName(p))
    };

    if (colFilters.name.length > 0) filtered = filtered.filter(p => colFilters.name.includes(p.name));
    if (colFilters.category.length > 0) filtered = filtered.filter(p => colFilters.category.includes(getCatName(p.categoryPath.main)));
    if (colFilters.classification.length > 0) filtered = filtered.filter(p => colFilters.classification.includes(getClassifName(p)));
    if (colFilters.sku.length > 0) filtered = filtered.filter(p => colFilters.sku.includes(p.sku));
    if (colFilters.price.length > 0) filtered = filtered.filter(p => colFilters.price.includes(p.price.toString()));
    if (colFilters.policy.length > 0) filtered = filtered.filter(p => colFilters.policy.includes(p.mediaPolicy));
    if (colFilters.status.length > 0) filtered = filtered.filter(p => colFilters.status.includes(p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'));
    if (colFilters.source.length > 0) filtered = filtered.filter(p => colFilters.source.includes(p.sourceSurface || 'catalog'));
    if (colFilters.categoryMode.length > 0) filtered = filtered.filter(p => colFilters.categoryMode.includes(getCatModeName(p)));

    const counts = {
      'all': dshCatalogProducts.length,
      'master': dshCatalogProducts.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
      'partner-exception': dshCatalogProducts.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
      'partner-review': dshCatalogProducts.filter(p => p.approvalStage === 'partner-review').length,
      'marketing-review': dshCatalogProducts.filter(p => p.approvalStage === 'marketing-review').length,
      'price-conflict': dshCatalogProducts.filter(p => !!p.conflictReason).length,
      'non-matching': 0,
      'category-proposals': 5
    };

    return { filteredProducts: filtered, counts, filterOptions };
  }, [isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters]);

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
            options={filterOptions[colId as keyof typeof filterOptions] || {}}
            selected={colFilters[colId]}
            onChange={(val: string[]) => setColFilters(prev => ({ ...prev, [colId]: val }))}
            onClose={() => setOpenFilterCol(null)}
         />
       )}
    </th>
  );

  return (
    <div className={styles.operationsCockpit} dir="rtl" style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#0A2F5C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🗂️</div>
          <div style={{ width: '300px' }}>
            <SearchField placeholder="بحث شامل بالمنتج، باركود، SKU..." value={searchQuery} onChangeText={setSearchQuery} />
          </div>
          <div style={{ flex: 1 }} />
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
                <div key={tab.id} onClick={() => { setWorkspaceMode(tab.id as WorkspaceMode); setSelectedProductId(null); }} style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', backgroundColor: workspaceMode === tab.id ? '#FFFFFF' : 'transparent', boxShadow: workspaceMode === tab.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
                   <Text role="caption" style={{ fontWeight: workspaceMode === tab.id ? 800 : 600, color: workspaceMode === tab.id ? '#0A2F5C' : '#64748B' }}>{tab.label}</Text>
                </div>
             ))}
          </div>
          <Button label="⚙️ إعدادات الأعمدة" tone="secondary" size="sm" onClick={() => {}} style={{ padding: '6px 12px' }} disabled title="غير متاح حالياً" />
        </div>

        {workspaceMode === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', padding: '8px 16px', overflowX: 'auto', borderBottom: '1px solid #F1F5F9', alignItems: 'center', whiteSpace: 'nowrap' }}>
             <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', marginLeft: '8px' }}>الفئات:</Text>
             <div onClick={() => handleMainCategorySelect(null)} style={{ cursor: 'pointer' }}>
               <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} />
             </div>
             {dshCatalogCategories.map(cat => (
               <div key={cat.id} onClick={() => handleMainCategorySelect(cat)} style={{ cursor: 'pointer' }}>
                 <Chip label={\`\${cat.emojiFallback} \${cat.label} \${cat.categoryMode === 'manual-order' ? '(يدوي)' : ''}\`} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} />
               </div>
             ))}
          </div>
        )}

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

        {workspaceMode === 'catalog' && (
          <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C', whiteSpace: 'nowrap', marginLeft: '4px' }}>فلاتر سريعة:</Text>
            {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict', 'non-matching', 'category-proposals'] as FilterType[]).map(f => {
              const labels: Record<FilterType, string> = {
                all: 'الكل', 'master': 'مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر', 'non-matching': 'غير مطابق', 'category-proposals': 'مقترحات فئات'
              };
              return (
                <div key={f} onClick={() => setActiveFilter(f)} style={{ cursor: 'pointer' }}>
                   <Chip label={\`\${labels[f]} (\${counts[f]})\`} tone={activeFilter === f ? 'brand' : 'default'} />
                </div>
              );
            })}

            <div style={{ flex: 1, minWidth: '16px' }} />

            {(activeFilter !== 'all' || searchQuery || activeColFiltersCount > 0) && (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '4px 8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                 <Text role="caption" tone="muted" style={{ whiteSpace: 'nowrap', marginLeft: '4px' }}>نشط:</Text>
                 {activeFilter !== 'all' && <FilterToken label={activeFilter} onRemove={() => setActiveFilter('all')} />}
                 {searchQuery && <FilterToken label={\`بحث: \${searchQuery}\`} onRemove={() => setSearchQuery('')} />}
                 {Object.entries(colFilters).map(([k, vals]) =>
                    vals.map(v => <FilterToken key={\`\${k}-\${v}\`} label={\`\${v}\`} onRemove={() => setColFilters(prev => ({...prev, [k]: prev[k].filter(x => x !== v)}))} />)
                 )}
                 <Button label="مسح الكل" tone="secondary" size="sm" onClick={() => { setActiveFilter('all'); setSearchQuery(''); setColFilters({ name: [], category: [], classification: [], sku: [], price: [], policy: [], status: [], source: [], categoryMode: [] }); }} style={{ padding: '2px 6px', fontSize: '10px', height: 'auto', minHeight: '0' }} />
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        {workspaceMode === 'catalog' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FFFFFF', minWidth: 0 }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
               <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                  <Button label="🛠️ تفعيل الـ Bulk Action" tone={showBulkOps ? "brand" : "secondary"} size="sm" onClick={() => setShowBulkOps(!showBulkOps)} style={{ padding: '4px 8px', fontSize: '10px' }} />
                  {showBulkOps && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', marginRight: '16px' }}>
                      <input type="checkbox" readOnly checked style={{ accentColor: '#0A2F5C' }} />
                      <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>1 محدد</Text>
                      <Button label="💰 تحديث أسعار" tone="secondary" size="sm" disabled title="سيتم الربط لاحقاً" style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="📦 تحديث توفر" tone="secondary" size="sm" disabled title="سيتم الربط لاحقاً" style={{ padding: '2px 8px', fontSize: '10px' }} />
                      <Button label="🚀 مراجعة" tone="primary" size="sm" disabled title="سيتم الربط لاحقاً" style={{ padding: '2px 8px', fontSize: '10px' }} />
                    </div>
                  )}
               </div>
               <Text role="caption" tone="muted">{filteredProducts.length} نتيجة</Text>
            </div>

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
                        {renderColHeader('name', 'المنتج', '15%')}
                        {renderColHeader('category', 'الفئة', '10%')}
                        {renderColHeader('classification', 'التصنيف', '10%')}
                        {renderColHeader('sku', 'SKU/GTIN', '12%')}
                        {renderColHeader('price', 'السعر', '8%')}
                        {renderColHeader('policy', 'السياسة', '10%')}
                        {renderColHeader('source', 'المصدر', '8%')}
                        {renderColHeader('categoryMode', 'نوع الفئة', '8%')}
                        {renderColHeader('status', 'الحالة', '8%')}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const cat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                        const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                        const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                        const catMode = cat?.categoryMode === 'manual-order' ? 'يدوي' : 'كتالوج';
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
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{catMode}</Text>
                            </td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                               <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, whiteSpace: 'nowrap', backgroundColor: p.conflictReason ? '#FEE2E2' : p.approvalStage === 'client-visible' ? '#DCFCE7' : '#FEF3C7', color: p.conflictReason ? '#DC2626' : p.approvalStage === 'client-visible' ? '#16A34A' : '#D97706' }}>
                                {p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr><td colSpan={showBulkOps ? 11 : 10} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '12px' }}>لا توجد منتجات مطابقة في هذه الفئة/الفلتر.</td></tr>
                      )}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        )}

        {workspaceMode === 'catalog' && selectedProductId && selectedProduct && (
          <div style={{ width: '340px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', zIndex: 30 }}>
             <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <Text role="bodyStrong" style={{ color: '#0A2F5C' }}>تفاصيل المنتج</Text>
                <div onClick={() => setSelectedProductId(null)} style={{ cursor: 'pointer', color: '#64748B', fontSize: '18px' }}>✕</div>
             </div>
             <Box gap={3} style={{ padding: '16px' }}>
                <Box style={{ flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                   <WatermarkedImage src={selectedProduct.imageUri} fallback={selectedProduct.emojiFallback} size={48} />
                   <Box style={{ flex: 1, gap: '2px' }}>
                      <Text role="caption" style={{ color: '#0A2F5C', fontSize: '14px', fontWeight: 800, textAlign: 'right' }}>{selectedProduct.name}</Text>
                      <Text role="caption" tone="muted" style={{ textAlign: 'right', fontSize: '10px' }}>SKU: {selectedProduct.sku}</Text>
                   </Box>
                </Box>

                <InspectorTile title="تسلسل الفئة (Hierarchy Path)">
                   <Text role="caption" style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.6, textAlign: 'right' }}>
                     {dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.label || 'غير معروف'}
                     {selectedProduct.categoryPath.sub && \` > \${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.label}\`}
                     {selectedProduct.categoryPath.mainClassification && \` > \${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.mainClassifications?.find(c => c.id === selectedProduct.categoryPath.mainClassification)?.label || selectedProduct.categoryPath.mainClassification}\`}
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
                      <MiniInfoBox label="السعر" value={selectedProduct.partnerOverrides?.[0]?.price ? \`\${selectedProduct.partnerOverrides[0].price} ر.س\` : 'مطابق'} valueColor={selectedProduct.partnerOverrides?.[0]?.price ? '#FF500D' : '#0A2F5C'} isBoldValue={!!selectedProduct.partnerOverrides?.[0]?.price} />
                      <MiniInfoBox label="التوفر" value={selectedProduct.partnerOverrides?.[0]?.isAvailable === false ? 'نفذت' : 'متاح'} />
                   </div>
                </InspectorTile>

                {selectedProduct.conflictReason && (
                   <InspectorTile title="تنبيه تعارض" warning>
                      <Text role="caption" style={{ color: '#DC2626' }}>{selectedProduct.conflictReason}</Text>
                   </InspectorTile>
                )}

                <Box gap={2} style={{ marginTop: '8px' }}>
                   <Button label="اعتماد التغييرات" tone="primary" size="sm" onClick={() => {}} disabled title="الربط سيتم في المرحلة التالية" />
                   <Button label="طلب مراجعة تسويق" tone="secondary" size="sm" onClick={() => { alert('تم إرسال طلب المراجعة محلياً (جاهز للربط لاحقاً)') }} />
                </Box>
             </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
`;

fs.writeFileSync(targetFile, content);
console.log('Successfully wrote ControlPanelDshCatalogScreen.tsx');
