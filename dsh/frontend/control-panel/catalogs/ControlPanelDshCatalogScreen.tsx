'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Box, Button, Surface, Text, SearchField, Chip, KeyValueList, Tabs, ListItem, Divider, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager, WebControlPanelRecommendation, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import {
  dshCatalogMetrics,
  dshCatalogCategories,
  dshCatalogProducts,
  CatalogProductMaster,
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification
} from './catalog';
import { getCatalogAdoptionItems } from '../../shared/catalog-adoption.preview-store';
import { ApprovalRecord, ApprovalStage, transitionApprovalStage, resolveNextOwner } from '../../shared/workflow';
import styles from '../shared/control-panel-surface.module.css';

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

const catalogPageSize = 5;

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
    <Surface tone="raised" paddingX={2} paddingY={1} radiusToken="pill" layoutDirection="row" align="center" gap={1}>
      <Text role="caption" style={{ fontWeight: 700 }}>{label}</Text>
      <Button label="✕" accessibilityLabel="إزالة" tone="secondary" size="sm" onPress={onRemove} style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }} />
    </Surface>
  );
}

function PolicyBadge({ mediaPolicy }: { mediaPolicy: string }) {
  const { theme } = useTheme();
  const isCentral = mediaPolicy === 'catalog-owned-media';
  return (
    <Text role="caption" numberOfLines={1} style={{ fontWeight: '700', color: isCentral ? theme.success : theme.warning }}>
      {isCentral ? 'مركزي' : 'شريك'}
    </Text>
  );
}

function InspectorTile({ title, children, dashed = false, warning = false }: { title: string, children: React.ReactNode, dashed?: boolean, warning?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box
      gap={2}
      style={{
        padding: 12,
        backgroundColor: warning ? theme.dangerSurface : dashed ? theme.surface : theme.surfaceInset,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: warning ? theme.danger : dashed ? theme.lineStrong : theme.line,
        borderStyle: dashed ? 'dashed' : 'solid',
      }}
    >
       <Text role="caption" style={{ fontWeight: '800', color: warning ? theme.danger : theme.brandHeaderBackground }}>{title}</Text>
       {children}
    </Box>
  );
}

function MiniInfoBox({ label, value, valueColor, isBoldValue = false }: { label: string, value: string | React.ReactNode, valueColor?: string, isBoldValue?: boolean }) {
  const { theme } = useTheme();
  return (
    <Box gap={0}>
      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>{label}</Text>
      <Text role="caption" style={{ color: valueColor || theme.brandHeaderBackground, fontWeight: isBoldValue ? '800' : '600', textAlign: 'right' }}>{value}</Text>
    </Box>
  );
}

const WATERMARK_URL = '/dsh/media-fixtures/assets/seed/dsh/logo.png';

function WatermarkedImage({ src, fallback, size = 32 }: { src?: string, fallback?: string, size?: number }) {
  const { theme } = useTheme();
  const fallbackLabel = 'ص';

  return (
    <Surface tone="inset" padding={0} border radiusToken="xs" style={{ width: size, height: size, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {src ? (
        <Image src={src} fill style={{ objectFit: 'cover' }} alt="صورة المنتج" />
      ) : (
        <Text style={{ fontSize: size / 2 }}>{fallbackLabel}</Text>
      )}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center', opacity: 0.4, backgroundColor: theme.brandHeaderSurface }}>
        <Image src={WATERMARK_URL} width={size * 0.8} height={size * 0.8} style={{ objectFit: 'contain' }} alt="شعار المنصة" />
      </Box>
    </Surface>
  );
}

const FilterDropdown = ({ title, options, selected, onChange, onClose }: FilterDropdownProps) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.toLowerCase()));

  return (
    <Surface tone="raised" padding={2} gap={2} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, width: 200, marginTop: 4 }}>
      <Box padding={1} style={{ borderBottomWidth: 1, borderBottomColor: theme.line }}>
        <SearchField
          placeholder={`بحث في ${title}...`}
          value={search}
          onChangeText={setSearch}
        />
      </Box>
      <Box style={{ maxHeight: 150 }}>
        {filteredOptions.length === 0 ? (
           <Box padding={2} align="center">
             <Text role="caption" tone="muted">لا توجد نتائج</Text>
           </Box>
        ) : filteredOptions.map((opt) => (
          <Box key={opt} layoutDirection="row" align="center" gap={2} paddingY={1}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, opt]);
                else onChange(selected.filter((selectedOption) => selectedOption !== opt));
              }}
              style={{ accentColor: theme.brandHeaderBackground }}
            />
            <Text role="caption" style={{ flex: 1, textAlign: 'right' }}>{opt}</Text>
          </Box>
        ))}
      </Box>
      <Box layoutDirection="row" justify="space-between" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8 }}>
         <Button label="تطبيق" tone="brand" size="sm" onPress={onClose} />
         <Button label="مسح" tone="secondary" size="sm" onPress={() => { onChange([]); onClose(); }} />
      </Box>
    </Surface>
  );
};

import { CatalogAdoptionQueue } from './CatalogAdoptionQueue';
import { ItemApprovalSection } from './ItemApprovalSection';
import { CatalogPublishingGateSection } from './CatalogPublishingGateSection';

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogPage, setCatalogPage] = useState(1);

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
  const catalogTotalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));
  const visibleProducts = useMemo(() => {
    const startIndex = (catalogPage - 1) * catalogPageSize;
    return filteredProducts.slice(startIndex, startIndex + catalogPageSize);
  }, [catalogPage, filteredProducts]);

  React.useEffect(() => {
    setCatalogPage(1);
  }, [activeMainCategory, activeSubCategory, activeFilter, activeTab, activeSubTab, searchQuery, colFilters]);

  React.useEffect(() => {
    setCatalogPage((currentPage) => Math.min(currentPage, catalogTotalPages));
  }, [catalogTotalPages]);

  const renderColHeader = (colId: CatalogFilterColumnId, title: string, width?: string) => (
    <th style={{ padding: '6px 12px', fontSize: '11px', color: theme.textMuted, textAlign: 'right', width, position: 'relative' }}>
       <button
          type="button"
          style={{ appearance: 'none', border: 'none', background: 'transparent', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setOpenFilterCol(openFilterCol === colId ? null : colId); }}
       >
          <span style={{ color: theme.textMuted }}>{title}</span>
          <span style={{ color: colFilters[colId]?.length > 0 ? theme.brand : theme.lineStrong, fontSize: 10 }}>▼</span>
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
    <div className={styles.surfaceCockpit}>
      {/* 1. Header Area - Catalog Command Deck */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box
            radiusToken="sm"
            elevationToken="raised"
            align="center"
            justify="center"
            style={{ width: 32, height: 32, backgroundColor: theme.brandHeaderBackground }}
          >
            <Text style={{ color: theme.textInverse, fontSize: 16 }}>⌗</Text>
          </Box>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle} style={{ letterSpacing: -0.18 }}>كتالوج DSH</h1>
              <Box paddingX={1} paddingY={1} background="brandSurface" radiusToken="xs">
                 <Text role="caption" className={styles.surfaceHeaderBadgeText}>حوكمة الماستر</Text>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>إدارة المنتجات والفئات ومخاطر التبني عبر الأسطح</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'إجمالي المنتجات', value: '١٤,٥٨٢' },
              { label: 'بانتظار اعتماد', value: '١٢٤' },
              { label: 'تعارضات النشاط', value: '٨', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={m.tone === 'danger' ? `${styles.commandKpiValue} ${styles.commandKpiValueAlert}` : styles.commandKpiValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Primary Tabs - Navigation Cockpit */}
      <nav className={styles.navigationDock}>
        {PRIMARY_TABS.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`${styles.surfaceTab} ${isSelected ? styles.surfaceTabActive : ''}`}
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
        <div className={`${styles.filterDock} ${styles.filterDockTint}`} style={{ padding: '4px 14px', minHeight: '36px' }}>
          {SECONDARY_TABS[activeTab].map((sub) => {
            const isSelected = sub.id === activeSubTab;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={styles.surfaceTab}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: isSelected ? theme.brandSurface : 'transparent',
                  color: isSelected ? theme.brand : theme.textMuted,
                  borderColor: isSelected ? theme.lineStrong : 'transparent',
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Filter Dock & Tools */}
      <div className={styles.filterDock}>
        <Box style={{ width: 300 }}>
          <SearchField placeholder="بحث شامل بالمنتج أو الباركود أو المعرف..." value={searchQuery} onChangeText={setSearchQuery} />
        </Box>

        {workspaceMode === 'catalog' && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontWeight: 800, color: theme.textMuted }}>الفئة:</Text>
            <Chip label="الكل" tone={!activeMainCategory ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(null)} selected={!activeMainCategory} />
            {dshCatalogCategories.map(cat => (
              <Chip key={cat.id} label={cat.label} tone={activeMainCategory?.id === cat.id ? 'brand' : 'default'} onPress={() => handleMainCategorySelect(cat)} selected={activeMainCategory?.id === cat.id} />
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <Button label={showBulkOps ? "إغلاق الإجراءات" : "إجراءات جماعية"} tone={showBulkOps ? "brand" : "secondary"} size="sm" onPress={() => setShowBulkOps(!showBulkOps)} />
      </div>

      {/* 5. Sub-filters & Active Tags */}
      {workspaceMode === 'catalog' && (
        <div className={`${styles.filterDock} ${styles.filterDockTint}`} style={{ padding: '4px 14px' }}>
          {(['all', 'master', 'partner-exception', 'partner-review', 'marketing-review', 'price-conflict'] as FilterType[]).map(f => {
              const labels: Record<string, string> = {
                all: 'الكل', 'master': 'مركزية', 'partner-exception': 'استثناء صورة', 'partner-review': 'مراجعة شريك', 'marketing-review': 'مراجعة تسويق', 'price-conflict': 'تعارض سعر'
              };
              return (
                <Chip key={f} label={labels[f]} tone={activeFilter === f ? 'brand' : 'default'} onPress={() => setActiveFilter(f)} selected={activeFilter === f} />
              );
          })}

          {(activeFilter !== 'all' || searchQuery || activeColFiltersCount > 0) && (
             <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginRight: 'auto' }}>
               <Button label="مسح الكل" tone="secondary" size="sm" onPress={() => { setActiveFilter('all'); setSearchQuery(''); setColFilters(initialColumnFilters); }} />
             </div>
          )}
        </div>
      )}

      <Box paddingX={4} paddingY={2}>
        <WebControlPanelRecommendation
          title="تثبيت حوكمة الكتالوج"
          reason="الكتالوج يحتوي على استثناءات ومراجعات معلقة، وأفضل خطوة الآن هي تصفية العناصر غير المطابقة قبل فتح التحرير الجماعي."
          confidence="high"
          auditTag="كتالوج DSH"
          primaryAction={{ id: 'open-approvals', label: 'فتح الاعتمادات', onAction: () => setActiveTab('approvals') }}
          secondaryAction={{ id: 'open-exceptions', label: 'فتح الاستثناءات', onAction: () => setActiveFilter('partner-exception') }}
        />
      </Box>

      {/* 6. MAIN CONTENT AREA */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
            {activeTab === 'approvals' && activeSubTab === 'marketing' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'hidden', minHeight: 0 }}>
                <CatalogAdoptionQueue />
              </div>
            )}

            {activeTab === 'approvals' && activeSubTab === 'quality' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'hidden', minHeight: 0 }}>
                <ItemApprovalSection />
              </div>
            )}

            {activeTab === 'approvals' && activeSubTab === 'pricing' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflow: 'auto', minHeight: 0 }}>
                <CatalogPublishingGateSection />
              </div>
            )}

            {activeTab === 'catalog' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: theme.surface, minWidth: 0 }}>
                <div style={{ flex: 1, minHeight: 0, backgroundColor: theme.surface }}>
                   {isManualOrderCategory ? (
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                       <Text role="titleMd" style={{ color: theme.brandHeaderBackground }}>فئة الطلب اليدوي</Text>
                       <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 400, marginTop: 8 }}>
                         المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                       </Text>
                     </div>
                   ) : (
                     <div style={{ overflow: 'auto', height: '100%' }}>
                       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
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
                            {visibleProducts.map(p => {
                              const cat = dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                              const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                              const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                              return (
                                <tr
                                  key={p.id}
                                  onClick={() => setSelectedProductId(p.id)}
                                  style={{ borderBottom: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: selectedProductId === p.id ? theme.overlaySoft : 'transparent' }}
                                >
                                  {showBulkOps && (
                                    <td onClick={e => e.stopPropagation()} style={{ padding: '8px' }}>
                                      <input type="checkbox" style={{ accentColor: theme.brandHeaderBackground }} />
                                    </td>
                                  )}
                                  <td style={{ padding: '8px' }}>
                                     <WatermarkedImage src={p.imageUri} size={32} />
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                     <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>{p.name}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{cat?.label}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{classif?.label || 'عام'}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" tone="muted" style={{ fontFamily: 'monospace', fontSize: 10 }}>{p.sku}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Text role="caption" style={{ color: theme.brandHeaderBackground, fontWeight: 700 }}>{p.price}</Text>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <PolicyBadge mediaPolicy={p.mediaPolicy} />
                                  </td>
                                  <td style={{ padding: '8px' }}>
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
                     </div>
                   )}
                </div>

                {!isManualOrderCategory ? (
                  <div style={{ padding: '10px 16px 12px', borderTop: `1px solid ${theme.line}`, backgroundColor: theme.surface }}>
                    <WebControlPanelCompactPager
                      page={catalogPage}
                      totalPages={catalogTotalPages}
                      onPrevious={() => setCatalogPage(p => Math.max(1, p - 1))}
                      onNext={() => setCatalogPage(p => Math.min(catalogTotalPages, p + 1))}
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Inspector Panel */}
            {activeTab === 'catalog' && selectedProductId && selectedProduct && (
              <div style={{ width: 320, borderRight: `1px solid ${theme.line}`, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column' }}>
                 <Box padding={3} background="surfaceRaised" style={{ borderBottomWidth: 1, borderBottomColor: theme.line }} layoutDirection="row" justify="space-between" align="center">
                    <Text role="bodyStrong" style={{ fontSize: 14 }}>تفاصيل المنتج</Text>
                    <Button label="✕" accessibilityLabel="إغلاق" tone="secondary" size="sm" onPress={() => setSelectedProductId(null)} />
                 </Box>
                 <Box gap={3} padding={3} style={{ flex: 1 }}>
                    <Box layoutDirection="row" gap={3} align="center">
                       <WatermarkedImage src={selectedProduct.imageUri} size={48} />
                       <Box style={{ flex: 1 }} gap={0}>
                          <Text role="bodyStrong" style={{ fontSize: 13 }}>{selectedProduct.name}</Text>
                         <Text role="caption" tone="muted" style={{ fontSize: 10 }}>المعرف: {selectedProduct.sku}</Text>
                       </Box>
                    </Box>

                    <InspectorTile title="تسلسل الفئة (Path)">
                       <Text role="caption" style={{ fontSize: 10, color: theme.textMuted, lineHeight: 14, textAlign: 'right' }}>
                         {dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.label || 'غير معروف'}
                         {selectedProduct.categoryPath.sub && ` > ${dshCatalogCategories.find(c => c.id === selectedProduct.categoryPath.main)?.subcategories.find(s => s.id === selectedProduct.categoryPath.sub)?.label}`}
                       </Text>
                    </InspectorTile>

                    <InspectorTile title="الحالة">
                       <div style={{  gridTemplateColumns: '1fr', gap: '4px' }}>
                          <MiniInfoBox label="العميل" value={selectedProduct.approvalStage === 'client-visible' ? 'مرئي' : 'مخفي'} valueColor={selectedProduct.approvalStage === 'client-visible' ? theme.success : theme.textMuted} isBoldValue />
                          <MiniInfoBox label="الشريك" value="متاح" />
                       </div>
                    </InspectorTile>

                    {selectedProduct.conflictReason && (
                       <InspectorTile title="تعارض" warning>
                          <Text role="caption" style={{ color: theme.danger, fontSize: 10 }}>{selectedProduct.conflictReason}</Text>
                       </InspectorTile>
                    )}

                    <Box gap={2} style={{ marginTop: 'auto' }}>
                       <Button label="اعتماد التغييرات" tone="primary" size="sm" fullWidth />
                       <Button label="طلب مراجعة تسويق" tone="secondary" size="sm" fullWidth />
                    </Box>
                 </Box>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
