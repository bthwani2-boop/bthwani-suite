'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, Surface, Text, SearchField, Chip, KeyValueList, Tabs, ListItem, Divider } from '@bthwani/ui-kit';
import { WebControlPanelRecommendation, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
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

type CatalogFilterColumnId = keyof typeof initialColumnFilters;

type FilterDropdownProps = {
  title: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (nextValues: string[]) => void;
  onClose: () => void;
};

const initialColumnFilters = {
  name: [],
  category: [],
  classification: [],
  sku: [],
  price: [],
  policy: [],
  status: [],
  source: [],
  categoryMode: [],
} satisfies Record<string, string[]>;

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
  const fallbackLabel = 'ص';

  return (
    <Surface tone="inset" padding={0} border radiusToken="xs" style={{ width: size, height: size, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {src ? (
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="صورة المنتج" />
      ) : (
        <Text style={{ fontSize: `${size/2}px` }}>{fallbackLabel}</Text>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.4, backgroundColor: 'rgba(255,255,255,0.15)' }}>
        <img src={WATERMARK_URL} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt="شعار المنصة" />
      </Box>
    </Surface>
  );
}

const FilterDropdown = ({ title, options, selected, onChange, onClose }: FilterDropdownProps) => {
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));

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
        ) : filteredOptions.map((opt) => (
          <Box key={opt} layoutDirection="row" align="center" gap={2} paddingY={1} style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((selectedOption) => selectedOption !== opt));
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
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const PRIMARY_TABS = [
    { id: 'catalog', label: 'الكتالوج' },
    { id: 'intake', label: 'الاستلام والإدخال' },
    { id: 'approvals', label: 'الاعتمادات والجودة' },
    { id: 'mapping', label: 'الربط والحوكمة' },
  ];

  const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
    catalog: [
      { id: 'all', label: 'الكل' },
      { id: 'master', label: 'المركزية' },
      { id: 'exceptions', label: 'الاستثناءات' },
    ],
    intake: [
      { id: 'quick', label: 'إدخال سريع' },
      { id: 'partner', label: 'بوابة الشريك' },
      { id: 'field', label: 'المسح الميداني' },
    ],
    approvals: [
      { id: 'marketing', label: 'اعتمادات التسويق' },
      { id: 'quality', label: 'مراجعة الجودة' },
      { id: 'pricing', label: 'تعارض الأسعار' },
    ],
    mapping: [
      { id: 'categories', label: 'ربط الفئات' },
      { id: 'duplicates', label: 'معالجة التكرارات' },
      { id: 'media', label: 'حوكمة الميديا' },
    ],
  };

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const workspaceMode = activeTab; // Bridge for existing logic

  // Column Filters
  const [colFilters, setColFilters] = useState<Record<CatalogFilterColumnId, string[]>>(initialColumnFilters);
  const [openFilterCol, setOpenFilterCol] = useState<CatalogFilterColumnId | null>(null);

  // Handlers
  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setSelectedProductId(null);
  };

  const selectedProduct = useMemo(() => dshCatalogProducts.find(p => p.id === selectedProductId) ?? null, [selectedProductId]);
  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    // 1. Base set: filter by Category and Manual Order mode
    if (isManualOrderCategory) {
      return {
        filteredProducts: [] as CatalogProductMaster[],
        counts: {
          'all': 0, 'master': 0, 'partner-exception': 0, 'partner-review': 0, 'marketing-review': 0, 'price-conflict': 0, 'non-matching': 0, 'category-proposals': 0
        },
        filterOptions: {
          ...initialColumnFilters
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

  const renderColHeader = (colId: CatalogFilterColumnId, title: string, width?: string) => (
    <th style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', textAlign: 'right', width, position: 'relative' }}>
       <button
          type="button"
          style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setOpenFilterCol(openFilterCol === colId ? null : colId); }}
       >
          <span style={{ color: '#64748B' }}>{title}</span>
          <span style={{ color: colFilters[colId]?.length > 0 ? '#FF500D' : '#CBD5E1', fontSize: '10px' }}>▼</span>
       </button>
       {openFilterCol === colId && (
         <FilterDropdown
            title={title}
            options={filterOptions[colId as keyof typeof filterOptions] || []}
            selected={colFilters[colId]}
          onChange={(val) => setColFilters(prev => ({ ...prev, [colId]: val }))}
            onClose={() => setOpenFilterCol(null)}
         />
       )}
    </th>
  );

  return (
    <Box dir="rtl" gap={0} background="background" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* 1. Header Area - Catalog Command Deck */}
      <header className={styles.operationsTopBar}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#0A2F5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            ⌗
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em', color: 'var(--bth-deep-blue, #0A2F5C)' }}>كتالوج المنصة</h1>
              <WebControlPanelStatusTag label="جاهز للمراجعة" tone="success" />
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>إدارة المنتجات والفئات ومخاطر التبني عبر الأسطح من دون ضجيج تشغيلي زائد.</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {[
              { label: 'إجمالي المنتجات', value: '١٤,٥٨٢' },
              { label: 'بانتظار اعتماد', value: '١٢٤' },
              { label: 'تعارضات النشاط', value: '٨', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={styles.commandKpiValue} style={m.tone === 'danger' ? { color: '#DC2626' } : {}}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs - Navigation Cockpit */}
      <nav className={styles.navigationCockpit}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.operationsTab} ${isSelected ? styles.operationsTabActive : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedProductId(null);
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* 3. Secondary Tabs - Sub-Navigation Dock */}
      {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
        <div className={styles.filterDock} style={{ padding: '4px 14px', minHeight: '36px', backgroundColor: '#F8FAFC' }}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={styles.operationsTab}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: isSelected ? 'rgba(255, 80, 13, 0.1)' : 'transparent',
                  color: isSelected ? '#FF500D' : '#64748B',
                  borderColor: isSelected ? 'rgba(255, 80, 13, 0.2)' : 'transparent',
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Filter Dock & Tools */}
      <div className={styles.filterDock}>
        <Box style={{ width: 300 }}>
          <SearchField placeholder="بحث شامل بالمنتج أو الباركود أو المعرف..." value={searchQuery} onChangeText={setSearchQuery} />
        </Box>

        {workspaceMode === 'catalog' && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontWeight: 800, color: '#64748B' }}>الفئة:</Text>
            <Chip label="الكل" size="sm" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} selected={!activeMainCategory} />
            {dshCatalogCategories.map(cat => (
              <Chip key={cat.id} label={cat.label} size="sm" tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} selected={activeMainCategory?.id === cat.id} />
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <Button label={showBulkOps ? "إغلاق الإجراءات" : "إجراءات جماعية"} tone={showBulkOps ? "brand" : "secondary"} size="sm" onClick={() => setShowBulkOps(!showBulkOps)} />
      </div>

      {/* 4. Sub-filters & Active Tags */}
      {workspaceMode === 'catalog' && (
        <div className={styles.filterDock} style={{ backgroundColor: '#F8FAFC', padding: '4px 14px' }}>
          {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict'] as FilterType[]).map(f => {
              const labels: Record<string, string> = {
                all: 'الكل', 'master': 'مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر'
              };
              return (
                <Chip key={f} label={labels[f]} size="sm" tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} selected={activeFilter === f} />
              );
          })}

          {(activeFilter !== 'all' || searchQuery || activeColFiltersCount > 0) && (
             <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginRight: 'auto' }}>
               <Button label="مسح الكل" tone="secondary" size="xs" onPress={() => { setActiveFilter('all'); setSearchQuery(''); setColFilters(initialColumnFilters); }} />
             </div>
          )}
        </div>
      )}

      <Box paddingX={4} paddingBottom={3}>
        <WebControlPanelRecommendation
          title="تثبيت حوكمة الكتالوج"
          reason="الكتالوج يحتوي على استثناءات ومراجعات معلقة، وأفضل خطوة الآن هي تصفية العناصر غير المطابقة قبل فتح التحرير الجماعي."
          confidence="high"
          auditTag="كتالوج DSH"
          primaryAction={{ id: 'open-approvals', label: 'فتح الاعتمادات', onAction: () => setActiveTab('approvals') }}
          secondaryAction={{ id: 'open-exceptions', label: 'فتح الاستثناءات', onAction: () => setActiveFilter('partner-exception') }}
        />
      </Box>

      {/* 5. MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        {activeTab === 'approvals' && activeSubTab === 'marketing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'auto' }}>
            <CatalogAdoptionQueue />
          </div>
        )}

        {activeTab === 'catalog' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#FFFFFF', minWidth: 0 }}>
            {/* Scrollable Data Table */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', backgroundColor: '#FFFFFF' }}>
               {isManualOrderCategory ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                   <Text role="titleMd" style={{ color: '#0A2F5C' }}>فئة الطلب اليدوي</Text>
                   <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: '400px', marginTop: '8px' }}>
                     المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                   </Text>
                 </div>
               ) : (
                 <table className={styles.commandTable}>
                    <thead>
                      <tr>
                        {showBulkOps && <th style={{ width: '36px' }}></th>}
                        <th style={{ width: '48px' }}>صورة</th>
                        {renderColHeader('name', 'المنتج', '20%')}
                        {renderColHeader('category', 'الفئة', '12%')}
                        {renderColHeader('classification', 'التصنيف', '10%')}
                        {renderColHeader('sku', 'المعرف / الباركود', '15%')}
                        {renderColHeader('price', 'السعر', '8%')}
                        {renderColHeader('policy', 'السياسة', '10%')}
                        {renderColHeader('status', 'الحالة', '10%')}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const cat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                        const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                        const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                        return (
                          <tr key={p.id} onClick={() => setSelectedProductId(p.id)} className={selectedProductId === p.id ? styles.selected : ''}>
                            {showBulkOps && (
                              <td onClick={e => e.stopPropagation()}>
                                <input type="checkbox" style={{ accentColor: '#0A2F5C' }} />
                              </td>
                            )}
                            <td>
                               <WatermarkedImage src={p.imageUri} fallback={p.emojiFallback} size={32} />
                            </td>
                            <td>
                               <Text role="caption" style={{ fontWeight: 800, color: '#0A2F5C' }}>{p.name}</Text>
                            </td>
                            <td>
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{cat?.label}</Text>
                            </td>
                            <td>
                              <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>{classif?.label || 'عام'}</Text>
                            </td>
                            <td>
                              <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: '10px' }}>{p.sku}</Text>
                            </td>
                            <td>
                              <Text role="caption" style={{ color: '#0A2F5C', fontWeight: 700 }}>{p.price}</Text>
                            </td>
                            <td>
                              <PolicyBadge mediaPolicy={p.mediaPolicy} />
                            </td>
                            <td>
                               <WebControlPanelStatusTag
                                 label={p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'}
                                 tone={p.conflictReason ? 'danger' : p.approvalStage === 'client-visible' ? 'success' : 'warning'}
                               />
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

        {/* Inspector Panel */}
        {activeTab === 'catalog' && selectedProductId && selectedProduct && (
          <div className={styles.inspectorPanel} style={{ width: '320px' }}>
             <Box padding={3} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }} layoutDirection="row" justify="space-between" align="center">
                <Text role="bodyStrong" style={{ fontSize: '14px' }}>تفاصيل المنتج</Text>
                <Button label="✕" tone="secondary" size="xs" onPress={() => setSelectedProductId(null)} />
             </Box>
             <Box gap={3} padding={3}>
                <Box layoutDirection="row" gap={3} align="center">
                   <WatermarkedImage src={selectedProduct.imageUri} fallback={selectedProduct.emojiFallback} size={48} />
                   <Box style={{ flex: 1 }} gap={0}>
                      <Text role="bodyStrong" style={{ fontSize: '13px' }}>{selectedProduct.name}</Text>
                     <Text role="caption" tone="muted" style={{ fontSize: '10px' }}>المعرف: {selectedProduct.sku}</Text>
                   </Box>
                </Box>

                <InspectorTile title="تسلسل الفئة (Path)">
                   <Text role="caption" style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.4, textAlign: 'right' }}>
                     {dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.label || 'غير معروف'}
                     {selectedProduct.categoryPath.sub && ` > ${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.label}`}
                   </Text>
                </InspectorTile>

                <InspectorTile title="الحالة">
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                      <MiniInfoBox label="العميل" value={selectedProduct.surfaces.includes('client') ? 'مرئي' : 'مخفي'} valueColor={selectedProduct.surfaces.includes('client') ? '#16A34A' : '#64748B'} isBoldValue />
                      <MiniInfoBox label="الشريك" value={selectedProduct.surfaces.includes('partner') ? 'متاح' : 'مغلق'} />
                   </div>
                </InspectorTile>

                {selectedProduct.conflictReason && (
                   <InspectorTile title="تعارض" warning>
                      <Text role="caption" style={{ color: '#DC2626', fontSize: '10px' }}>{selectedProduct.conflictReason}</Text>
                   </InspectorTile>
                )}

                <Box gap={2} style={{ marginTop: 'auto' }}>
                   <Button label="اعتماد التغييرات" tone="primary" size="sm" block disabled />
                   <Button label="طلب مراجعة تسويق" tone="secondary" size="sm" block />
                </Box>
             </Box>
          </div>
        )}

        {/* Fallback for other modes */}
        {!(activeTab === 'catalog') && !(activeTab === 'approvals' && activeSubTab === 'marketing') && (
           <div style={{ flex: 1, padding: '32px', backgroundColor: '#FFFFFF' }}>
              <Text role="titleMd" tone="muted">يعرض هذا المسار عناصر الكتالوج والحوكمة المرتبطة به مباشرة.</Text>
           </div>
        )}
      </div>
    </Box>
  );
}

export default ControlPanelDshCatalogScreen;
