'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager, WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { dshCatalogCategories } from './catalogs.data';
import styles from '../shared/control-panel-surface.module.css';
import { CatalogWorkspaceRouter } from './drawers/catalog-workspace-router';
import { mergeCatalogProductPreviewPatch } from './catalogs.adapters';
import {
  createCatalogPreviewProposal,
  initialColumnFilters,
  type CatalogFilterColumnId,
  type FilterType,
} from './catalogs.model';
import { PolicyBadge, WatermarkedImage, FilterDropdown } from './catalogs.parts';
import { useCatalogScreen, PRIMARY_TABS, SECONDARY_TABS } from './catalogs.hooks';
import { TaxonomyScreen } from './taxonomy/taxonomy.screen';
import { useTaxonomyScreen } from './taxonomy/taxonomy.hooks';
import { IntakeWorkspaceView } from './products/intake-workspace';
import { MappingWorkspaceView } from './products/mapping-workspace';
import { ProductInspectorPanel } from './products/product-inspector-panel';
import { ProductEditModal } from './products/product-edit-modal';

// --- Types ---
export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

// --- Main Screen Component ---

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const { theme } = useTheme();
  const {
    activeTab, setActiveTab,
    activeSubTab, setActiveSubTab,
    showBulkOps, setShowBulkOps,
    selectedProductIds, setSelectedProductIds,
    workspaceState, setWorkspaceState, openWorkspace,
    pendingProposals, pushPreviewProposal, dismissPreviewProposal,
    activeMainCategory, setActiveMainCategory,
    activeSubCategory, setActiveSubCategory,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    catalogPage, setCatalogPage,
    catalogTotalPages,
    setProductPreviewPatches,
    queueProductPreviewPatch,
    products, filteredProducts, visibleProducts,
    filterOptions,
    selectedProduct,
    totalCount,
    showProductModal, setShowProductModal,
    modalMode, setModalMode,
    modalForm, setModalForm,
    previewCategories,
    effectiveCategories,
    hiddenCategoryIds,
    hiddenSubCategoryIds,
    categoryControlOpen, setCategoryControlOpen,
    addingMainCat, setAddingMainCat,
    addingSubUnder, setAddingSubUnder,
    addingMainClassifUnder, setAddingMainClassifUnder,
    addingSubClassifUnder, setAddingSubClassifUnder,
    formLabel, setFormLabel,
    formSubtitle, setFormSubtitle,
    catError, setCatError,
    editingEntry, setEditingEntry,
    editLabel, setEditLabel,
    editSubtitle, setEditSubtitle,
    activeMainClassifId, setActiveMainClassifId,
    activeSubClassifId, setActiveSubClassifId,
    handleMainCategorySelect,
    handleSubCategorySelect,
    handleAddMainCategory,
    handleAddSubCategory,
    handleAddMainClassification,
    handleAddSubClassification,
    handleToggleCategoryHide,
    handleToggleSubCategoryHide,
    handleDeleteNode,
    handleResetCategoryPreview,
    handleStartCatEdit,
    handleApplyCatEdit,
    getProductCountForCategory,
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    actionMessage, setActionMessage,
    isCategoryMapped, isDuplicatesClean, isMediaSatisfied, approvedCount,
    isManualOrderCategory,
    microActions,
  } = useCatalogScreen();

  const taxonomyHook = useTaxonomyScreen({ onPushProposal: pushPreviewProposal });

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
            titleText={title}
            options={filterOptions[colId] || []}
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
                 <span className={styles.surfaceHeaderBadgeText}>حوكمة الماستر</span>
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

      {/* Three-Layer Unified Compact Control Strip */}
      <Surface
        tone="inset"
        padding={2}
        gap={2}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          backgroundColor: theme.surface,
          flexShrink: 0,
        }}
      >
        {/* Layer 1: Primary Compact Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {PRIMARY_TABS.map((tab) => {
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedProductId(null);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? theme.brandHeaderBackground : theme.surfaceInset,
                  color: isSelected ? theme.textInverse : theme.textMuted,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Layer 2: Context Sub-tabs */}
        {SECONDARY_TABS[activeTab] && SECONDARY_TABS[activeTab].length > 0 && (
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', msOverflowStyle: 'none', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
            {SECONDARY_TABS[activeTab].map((sub) => {
              const isSelected = sub.id === activeSubTab;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : 'transparent'}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : 'transparent',
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Layer 3: Smart Filters, Search, Category Selector & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
          {/* Sub-row 1: Search & Category selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '220px' }}>
                <SearchField placeholder="بحث شامل بالمنتج أو الباركود..." value={searchQuery} onChangeText={setSearchQuery} />
              </div>
              {(activeTab === 'all' || activeTab === 'catalog') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center' }}>
                    <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>الفئة:</Text>
                    <button
                      onClick={() => handleMainCategorySelect(null)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 600,
                        border: `1px solid ${!activeMainCategory ? theme.brand : theme.lineStrong}`,
                        cursor: 'pointer',
                        backgroundColor: !activeMainCategory ? theme.brandSurface : theme.surface,
                        color: !activeMainCategory ? theme.brand : theme.textMuted,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      الكل
                    </button>
                    {effectiveCategories.map(cat => {
                      const isSelected = activeMainCategory?.id === cat.id;
                      const isHidden = hiddenCategoryIds.has(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleMainCategorySelect(cat)}
                          title={isHidden ? 'مخفي (معاينة)' : undefined}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 600,
                            border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                            color: isSelected ? theme.brand : theme.textMuted,
                            whiteSpace: 'nowrap',
                            opacity: isHidden ? 0.5 : 1,
                          }}
                        >
                          {cat.emojiFallback} {cat.label}
                        </button>
                      );
                    })}
                  </div>
                  {activeMainCategory && activeMainCategory.subcategories.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '12px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 9, fontWeight: 800, color: theme.textMuted }}>└ الفرعية:</Text>
                      <button
                        onClick={() => handleSubCategorySelect(null)}
                        style={{
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '9px',
                          fontWeight: 600,
                          border: `1px solid ${!activeSubCategory ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeSubCategory ? theme.brandSurface : theme.surface,
                          color: !activeSubCategory ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeMainCategory.subcategories.map(sub => {
                        const isSubSelected = activeSubCategory?.id === sub.id;
                        const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubCategorySelect(sub)}
                            title={isSubHidden ? 'مخفي (معاينة)' : undefined}
                            style={{
                              padding: '1px 6px',
                              borderRadius: '8px',
                              fontSize: '9px',
                              fontWeight: 600,
                              border: `1px solid ${isSubSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSubSelected ? theme.brandSurface : theme.surface,
                              color: isSubSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                              opacity: isSubHidden ? 0.5 : 1,
                            }}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Classification chips */}
                  {activeMainCategory && activeSubCategory && activeSubCategory.mainClassifications && activeSubCategory.mainClassifications.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '24px' }}>
                      <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الرئيسي:</Text>
                      <button
                        onClick={() => { setActiveMainClassifId(null); setActiveSubClassifId(null); }}
                        style={{
                          padding: '1px 5px',
                          borderRadius: '6px',
                          fontSize: '8px',
                          fontWeight: 600,
                          border: `1px solid ${!activeMainClassifId ? theme.brand : theme.lineStrong}`,
                          cursor: 'pointer',
                          backgroundColor: !activeMainClassifId ? theme.brandSurface : theme.surface,
                          color: !activeMainClassifId ? theme.brand : theme.textMuted,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        الكل
                      </button>
                      {activeSubCategory.mainClassifications.map(mc => {
                        const isSelected = activeMainClassifId === mc.id;
                        return (
                          <button
                            key={mc.id}
                            onClick={() => { setActiveMainClassifId(isSelected ? null : mc.id); setActiveSubClassifId(null); }}
                            style={{
                              padding: '1px 5px',
                              borderRadius: '6px',
                              fontSize: '8px',
                              fontWeight: 600,
                              border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                              cursor: 'pointer',
                              backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                              color: isSelected ? theme.brand : theme.textMuted,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            🔹 {mc.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-Classification chips */}
                  {activeMainCategory && activeSubCategory && activeMainClassifId && (() => {
                    const currentMC = activeSubCategory.mainClassifications?.find(c => c.id === activeMainClassifId);
                    if (!currentMC || !currentMC.subClassifications || currentMC.subClassifications.length === 0) return null;
                    return (
                      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '36px' }}>
                        <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الفرعي:</Text>
                        <button
                          onClick={() => setActiveSubClassifId(null)}
                          style={{
                            padding: '1px 4px',
                            borderRadius: '5px',
                            fontSize: '8px',
                            fontWeight: 600,
                            border: `1px solid ${!activeSubClassifId ? theme.brand : theme.lineStrong}`,
                            cursor: 'pointer',
                            backgroundColor: !activeSubClassifId ? theme.brandSurface : theme.surface,
                            color: !activeSubClassifId ? theme.brand : theme.textMuted,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          الكل
                        </button>
                        {currentMC.subClassifications.map(sc => {
                          const isSelected = activeSubClassifId === sc.id;
                          return (
                            <button
                              key={sc.id}
                              onClick={() => setActiveSubClassifId(isSelected ? null : sc.id)}
                              style={{
                                padding: '1px 4px',
                                borderRadius: '5px',
                                fontSize: '8px',
                                fontWeight: 600,
                                border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                                cursor: 'pointer',
                                backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                                color: isSelected ? theme.brand : theme.textMuted,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              🔸 {sc.label}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Button
                label={showBulkOps ? "إغلاق الإجراءات" : "إجراءات جماعية"}
                tone={showBulkOps ? "brand" : "secondary"}
                size="sm"
                onPress={() => setShowBulkOps(!showBulkOps)}
                style={{ paddingVertical: 2, paddingHorizontal: 8 }}
              />
              {/* Open bulk workspace — disabled if no selection */}
              <Button
                label={`📋 تنفيذ مجمع${selectedProductIds.length > 0 ? ` (${selectedProductIds.length})` : ''}`}
                tone={selectedProductIds.length > 0 ? 'brand' : 'secondary'}
                size="sm"
                onPress={() => setWorkspaceState({ workspace: 'bulk-operations', sourceSurface: 'catalogs' })}
                style={{ paddingVertical: 2, paddingHorizontal: 8 }}
              />
            </div>
          </div>

          {/* Sub-row 2: Smart Filters chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>تصفية ذكية:</Text>
            {([
              { id: 'all', label: 'الكل' },
              { id: 'active', label: 'نشط' },
              { id: 'review', label: 'مراجعة' },
              { id: 'conflict', label: 'تعارض' },
              { id: 'master', label: 'مركزي' },
              { id: 'partner', label: 'شريك' },
              { id: 'needs-link', label: 'يحتاج ربط' },
              { id: 'needs-image', label: 'يحتاج صورة' },
            ] satisfies { id: FilterType; label: string }[]).map(f => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 600,
                    border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? theme.brandSurface : theme.surface,
                    color: isSelected ? theme.brand : theme.textMuted,
                    transition: 'all 0.12s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Sub-row 3: Contextual Micro Action Strip — no tab label repetition */}
          {microActions.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', borderTop: `1px solid ${theme.line}`, paddingTop: '6px' }}>
              <Text role="caption" numberOfLines={1} style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted }}>إجراء:</Text>
              {microActions.map((action) => {
                const isActive = action.isActive;
                return (
                  <button
                    key={action.id}
                    onClick={action.onAction}
                    aria-label={action.label}
                    style={{
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      border: `1px solid ${isActive ? theme.brand : theme.line}`,
                      cursor: 'pointer',
                      backgroundColor: isActive ? theme.brandSurface : theme.surfaceInset,
                      color: isActive ? theme.brand : theme.brandHeaderBackground,
                      transition: 'all 0.12s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Surface>

      {/* Current Context Crumb Box */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>الكتالوج</Text>
          <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
          <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{PRIMARY_TABS.find(t => t.id === activeTab)?.label}</Text>
          {SECONDARY_TABS[activeTab]?.find(s => s.id === activeSubTab)?.label && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>{SECONDARY_TABS[activeTab].find(s => s.id === activeSubTab)?.label}</Text>
            </>
          )}
          {activeFilter !== 'all' && (
            <>
              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>›</Text>
              <Text role="caption" style={{ fontSize: 10, color: theme.brand, fontWeight: 700 }}>
                {
                  ([
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط' },
                    { id: 'review', label: 'مراجعة' },
                    { id: 'conflict', label: 'تعارض' },
                    { id: 'master', label: 'مركزي' },
                    { id: 'partner', label: 'شريك' },
                    { id: 'needs-link', label: 'يحتاج ربط' },
                    { id: 'needs-image', label: 'يحتاج صورة' },
                  ].find(f => f.id === activeFilter)?.label)
                }
              </Text>
            </>
          )}
          <Text role="caption" tone="muted" style={{ fontSize: 10, marginRight: 8 }}>
            ({filteredProducts.length} منتج)
          </Text>
        </div>

        {/* Clear Filters indicator & trigger */}
        {(activeFilter !== 'all' || searchQuery !== '' || activeColFiltersCount > 0 || activeMainCategory !== null || activeSubCategory !== null || activeMainClassifId !== null || activeSubClassifId !== null) && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Text role="caption" style={{ fontSize: 10, color: theme.brand }}>
              {`نشط: ${activeColFiltersCount + (activeFilter !== 'all' ? 1 : 0) + (searchQuery !== '' ? 1 : 0) + (activeMainCategory ? 1 : 0) + (activeMainClassifId ? 1 : 0) + (activeSubClassifId ? 1 : 0)} فلتر`}
            </Text>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setColFilters(initialColumnFilters);
                setActiveMainCategory(null);
                setActiveSubCategory(null);
                setActiveMainClassifId(null);
                setActiveSubClassifId(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: theme.danger,
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ✕ مسح الفلاتر
            </button>
          </div>
        )}
      </div>


      {/* Action message banner -- replaces alert() calls; UI_PREVIEW_ONLY, no backend */}
      {actionMessage ? (
        <div role="status" aria-live="polite" style={{ padding: '8px 14px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: theme.brandHeaderBackground, fontWeight: 600 }}>{actionMessage}</span>
          <span style={{ fontSize: '10px', color: theme.textMuted }}>UI_PREVIEW_ONLY</span>
          <button type="button" onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '12px', cursor: 'pointer', padding: '0 4px' }}>x</button>
        </div>
      ) : null}
      {/* Category Control Room — preview-only, shows when mapping/categories */}
      {activeTab === 'mapping' && activeSubTab === 'categories' && (
        <div style={{
          backgroundColor: theme.surface,
          borderBottom: `1px solid ${theme.line}`,
          flexShrink: 0,
        }}>
          {/* Toggle header */}
          <button
            onClick={() => setCategoryControlOpen((v) => !v)}
            aria-label="تبديل وضع إدارة الفئات"
            style={{
              width: '100%', appearance: 'none', border: 'none',
              backgroundColor: categoryControlOpen ? theme.brandSurface : theme.surfaceInset,
              borderBottom: categoryControlOpen ? `1px solid ${theme.brand}` : 'none',
              padding: '5px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: categoryControlOpen ? theme.brand : theme.textMuted }}>
                🏷️ إدارة الفئات
              </span>
              <span style={{ fontSize: '9px', color: theme.warning, fontWeight: 700 }}>
                • معاينة فقط — لا حفظ دائم
              </span>
              <span style={{ fontSize: '9px', color: theme.textMuted }}>
                ({previewCategories.length} فئة • {hiddenCategoryIds.size > 0 ? `${hiddenCategoryIds.size} مخفي` : 'لا مخفي'})
              </span>
            </div>
            <span style={{ fontSize: '9px', color: theme.textMuted }}>{categoryControlOpen ? '▲' : '▼'}</span>
          </button>

          {/* Expanded panel */}
          {categoryControlOpen && (
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>

              {/* Error banner */}
              {catError && (
                <div style={{
                  padding: '4px 10px', borderRadius: '4px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
                  border: `1px solid ${theme.danger}`, fontSize: '10px', color: theme.danger, fontWeight: 700,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{catError}</span>
                  <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '10px', fontWeight: 900 }}>×</button>
                </div>
              )}

              {/* Action header row */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setAddingMainCat(true); setAddingSubUnder(null); setEditingEntry(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }}
                  aria-label="إضافة فئة رئيسية"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.brand}`, cursor: 'pointer',
                    backgroundColor: theme.brandSurface, color: theme.brand,
                  }}
                >
                  + فئة رئيسية
                </button>
                <button
                  onClick={handleResetCategoryPreview}
                  aria-label="إعادة ضبط المعاينة"
                  style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${theme.danger}`, cursor: 'pointer',
                    backgroundColor: 'transparent', color: theme.danger,
                  }}
                >
                  ↺ إعادة ضبط المعاينة
                </button>
              </div>

              {/* Add main category form */}
              {addingMainCat && (
                <div style={{
                  padding: '8px 10px', borderRadius: '6px', backgroundColor: theme.surfaceInset,
                  border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '6px',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</span>
                  <input
                    type="text" placeholder="اسم الفئة *" value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') { setAddingMainCat(false); setCatError(null); } }}
                    autoFocus
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <input
                    type="text" placeholder="وصف مختصر (اختياري)" value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right',
                      border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleAddMainCategory} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                    <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                  </div>
                </div>
              )}

              {/* Categories list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {previewCategories.map((cat) => {
                  const isHidden = hiddenCategoryIds.has(cat.id);
                  const isSelectedMain = activeMainCategory?.id === cat.id;
                  const productCount = getProductCountForCategory(cat.id);
                  const isEditingThis = editingEntry?.type === 'main' && editingEntry.mainId === cat.id;

                  return (
                    <div key={cat.id} style={{
                      borderRadius: '6px', border: `1px solid ${isSelectedMain ? theme.brand : theme.line}`,
                      backgroundColor: isHidden ? theme.surfaceInset : (isSelectedMain ? theme.brandSurface : theme.surface),
                      opacity: isHidden ? 0.6 : 1, overflow: 'hidden',
                    }}>
                      {/* Main category row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', gap: '6px' }}>
                        {isEditingThis ? (
                          <div style={{ display: 'flex', flex: 1, gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                              type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                              autoFocus
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <input
                              type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                              style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                            />
                            <button onClick={handleApplyCatEdit} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                            <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMainCategorySelect(isSelectedMain ? null : cat)}
                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                            >
                              <span style={{ fontSize: '13px' }}>{cat.emojiFallback}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: isSelectedMain ? theme.brand : theme.brandHeaderBackground }}>{cat.label}</span>
                                {cat.subtitle && <span style={{ fontSize: '9px', color: theme.textMuted }}>{cat.subtitle}</span>}
                              </div>
                              <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto', paddingRight: '4px' }}>{productCount} منتج</span>
                            </button>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                              <button
                                onClick={() => { setAddingSubUnder(addingSubUnder === cat.id ? null : cat.id); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingMainClassifUnder(null); setAddingSubClassifUnder(null); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: addingSubUnder === cat.id ? theme.brandSurface : 'transparent', color: addingSubUnder === cat.id ? theme.brand : theme.textMuted }}
                              >+ فرعية</button>
                              <button
                                onClick={() => handleStartCatEdit('main', cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}
                              >تعديل</button>
                              <button
                                onClick={() => handleToggleCategoryHide(cat.id)}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}
                              >{isHidden ? 'استعادة' : 'إخفاء'}</button>
                              <button
                                onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة وجميع فئاتها وتصنيفاتها الفرعية؟')) handleDeleteNode('main', cat.id); }}
                                style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}
                              >حذف</button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Add subcategory form */}
                      {addingSubUnder === cat.id && (
                        <div style={{ margin: '0 8px 6px 8px', padding: '6px 8px', borderRadius: '4px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                          <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(cat.id); if (e.key === 'Escape') { setAddingSubUnder(null); setCatError(null); } }}
                            autoFocus
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <input type="text" placeholder="وصف (اختياري)" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)}
                            style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                            <button onClick={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                          </div>
                        </div>
                      )}

                      {/* Subcategories list */}
                      {cat.subcategories.length > 0 && (
                        <div style={{ margin: '0 8px 6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {cat.subcategories.map((sub) => {
                            const subCount = getProductCountForCategory(cat.id, sub.id);
                            const isSelectedSub = activeSubCategory?.id === sub.id;
                            const isSubHidden = hiddenSubCategoryIds.has(sub.id);
                            const isEditingThisSub = editingEntry?.type === 'sub' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id;
                            const isAddingClassifThisSub = addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder?.subId === sub.id;

                            return (
                              <div key={sub.id} style={{
                                borderRadius: '4px', border: `1px solid ${isSelectedSub ? theme.brand : 'transparent'}`,
                                backgroundColor: isSubHidden ? theme.surfaceInset : (isSelectedSub ? theme.brandSurface : theme.surfaceInset),
                                opacity: isSubHidden ? 0.6 : 1, overflow: 'hidden', padding: '4px'
                              }}>
                                {/* Subcategory row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                  {isEditingThisSub ? (
                                    <div style={{ display: 'flex', flex: 1, gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                        autoFocus
                                        style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                      />
                                      <input type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
                                        style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                      />
                                      <button onClick={handleApplyCatEdit} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                      <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => { handleSubCategorySelect(isSelectedSub ? null : sub); if (!isSelectedSub) handleMainCategorySelect(cat); }}
                                        style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}
                                      >
                                        <span style={{ fontSize: '10px', color: theme.textMuted }}>└── 📂</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                          <span style={{ fontSize: '10px', fontWeight: isSelectedSub ? 700 : 600, color: isSelectedSub ? theme.brand : theme.brandHeaderBackground }}>{sub.label}</span>
                                          {sub.subtitle && <span style={{ fontSize: '8px', color: theme.textMuted }}>{sub.subtitle}</span>}
                                        </div>
                                        <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto' }}>{subCount}</span>
                                      </button>
                                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                        <button
                                          onClick={() => { setAddingMainClassifUnder(isAddingClassifThisSub ? null : { mainId: cat.id, subId: sub.id }); setFormLabel(''); setFormSubtitle(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingSubClassifUnder(null); }}
                                          style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingClassifThisSub ? theme.brandSurface : 'transparent', color: isAddingClassifThisSub ? theme.brand : theme.textMuted }}
                                        >+ تصنيف رئيسي</button>
                                        <button onClick={() => handleStartCatEdit('sub', cat.id, sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                        <button onClick={() => handleToggleSubCategoryHide(sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${isSubHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isSubHidden ? theme.success : theme.textMuted }}>{isSubHidden ? 'استعادة' : 'إخفاء'}</button>
                                        <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية وتصنيفاتها؟')) handleDeleteNode('sub', cat.id, sub.id); }} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Add main classification form */}
                                {isAddingClassifThisSub && (
                                  <div style={{ margin: '4px 12px 4px 4px', padding: '5px', borderRadius: '3px', backgroundColor: theme.surface, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '8px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                    <input type="text" placeholder="اسم التصنيف الرئيسي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainClassification(cat.id, sub.id); if (e.key === 'Escape') { setAddingMainClassifUnder(null); setCatError(null); } }}
                                      autoFocus
                                      style={{ padding: '2px 5px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                      <button onClick={() => { setAddingMainClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  </div>
                                )}

                                {/* Main Classifications */}
                                {sub.mainClassifications && sub.mainClassifications.length > 0 && (
                                  <div style={{ margin: '4px 4px 2px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {sub.mainClassifications.map((classif) => {
                                      const isEditingThisClassif = editingEntry?.type === 'mainClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id;
                                      const isAddingSubClassif = addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id;

                                      return (
                                        <div key={classif.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: theme.surface, borderRadius: '3px', padding: '3px' }}>
                                          {/* Main Classification Row */}
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                            {isEditingThisClassif ? (
                                              <div style={{ display: 'flex', flex: 1, gap: '4px', alignItems: 'center' }}>
                                                <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                  autoFocus
                                                  style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                />
                                                <button onClick={handleApplyCatEdit} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            ) : (
                                              <>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                  <span style={{ fontSize: '9px', color: theme.textMuted }}>├── 🔹</span>
                                                  <span style={{ fontSize: '9.5px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                  <button
                                                    onClick={() => { setAddingSubClassifUnder(isAddingSubClassif ? null : { mainId: cat.id, subId: sub.id, mainClassifId: classif.id }); setFormLabel(''); setCatError(null); setEditingEntry(null); setAddingMainCat(false); setAddingSubUnder(null); setAddingMainClassifUnder(null); }}
                                                    style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingSubClassif ? theme.brandSurface : 'transparent', color: isAddingSubClassif ? theme.brand : theme.textMuted }}
                                                  >+ تصنيف فرعي</button>
                                                  <button onClick={() => handleStartCatEdit('mainClassif', cat.id, sub.id, classif.id)} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                  <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي وتصنيفاته الفرعية؟')) handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); }} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                                </div>
                                              </>
                                            )}
                                          </div>

                                          {/* Add sub classification form */}
                                          {isAddingSubClassif && (
                                            <div style={{ margin: '3px 16px 3px 3px', padding: '4px', borderRadius: '2px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                              <span style={{ fontSize: '7.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                              <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubClassification(cat.id, sub.id, classif.id); if (e.key === 'Escape') { setAddingSubClassifUnder(null); setCatError(null); } }}
                                                autoFocus
                                                style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '8.5px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                                              />
                                              <div style={{ display: 'flex', gap: '3px' }}>
                                                <button onClick={() => handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                                                <button onClick={() => { setAddingSubClassifUnder(null); setFormLabel(''); setCatError(null); }} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Sub-Classifications */}
                                          {classif.subClassifications && classif.subClassifications.length > 0 && (
                              <div style={{ margin: '2px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                              {classif.subClassifications.map((subc) => {
                                                const isEditingThisSubClassif = editingEntry?.type === 'subClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id && editingEntry.subClassifId === subc.id;

                                                return (
                                                  <div key={subc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', backgroundColor: theme.surfaceInset, borderRadius: '2px', padding: '2px' }}>
                                                    {isEditingThisSubClassif ? (
                                                      <div style={{ display: 'flex', flex: 1, gap: '3px', alignItems: 'center' }}>
                                                        <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                                          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                                          autoFocus
                                                          style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '8px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1 }}
                                                        />
                                                        <button onClick={handleApplyCatEdit} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                                        <button onClick={() => { setEditingEntry(null); setCatError(null); }} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
                                                          <span style={{ fontSize: '8px', color: theme.textMuted }}>└── 🔸</span>
                                                          <span style={{ fontSize: '8.5px', color: theme.brandHeaderBackground }}>{subc.label}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                                                          <button onClick={() => handleStartCatEdit('subClassif', cat.id, sub.id, classif.id, subc.id)} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                                                          <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) handleDeleteNode('subClassif', cat.id, sub.id, classif.id, subc.id); }} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. MAIN CONTENT AREA */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
            {activeTab !== 'taxonomy' ? (
              <>
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
                          {activeTab === 'intake' ? (
                            <IntakeWorkspaceView
                              activeSubTab={activeSubTab}
                              filteredProducts={filteredProducts}
                              selectedProductId={selectedProductId}
                              setSelectedProductId={setSelectedProductId}
                              openWorkspace={openWorkspace}
                            />
                          ) : activeTab === 'mapping' ? (
                            <MappingWorkspaceView
                              activeSubTab={activeSubTab}
                              filteredProducts={filteredProducts}
                              selectedProductId={selectedProductId}
                              setSelectedProductId={setSelectedProductId}
                              openWorkspace={openWorkspace}
                              previewCategories={previewCategories}
                            />
                          ) : (
                            <>
                              {activeTab === 'publishing' && (
                                <Box
                                  padding={3}
                                  gap={2}
                                  style={{
                                    backgroundColor: theme.surfaceInset,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.line,
                                    margin: 12,
                                    borderRadius: 8,
                                  }}
                                >
                                  <Text role="bodyStrong" style={{ color: theme.brandHeaderBackground, fontWeight: '700', textAlign: 'right' }}>بوابة النشر النهائية (Publishing Gate Checklist)</Text>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', margin: '8px 0' }}>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isCategoryMapped ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>ربط الفئات (Category Mapping)</Text>
                                      <Text style={{ color: isCategoryMapped ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isCategoryMapped ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isDuplicatesClean ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>خلو الكتالوج من التكرارات (No Duplicates)</Text>
                                      <Text style={{ color: isDuplicatesClean ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isDuplicatesClean ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                    <Box layoutDirection="row" align="center" gap={2} style={{ justifyContent: 'flex-end' }}>
                                      <Text role="caption" tone={isMediaSatisfied ? 'default' : 'danger'} style={{ fontSize: 11, textAlign: 'right' }}>اعتماد الصور والسياسة (Media Satisfied)</Text>
                                      <Text style={{ color: isMediaSatisfied ? theme.success : theme.danger, fontWeight: 'bold', fontSize: 14 }}>
                                        {isMediaSatisfied ? '✓' : '✗'}
                                      </Text>
                                    </Box>
                                  </div>
                                  <Box layoutDirection="row" justify="space-between" align="center" style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 8, marginTop: 4 }}>
                                    <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
                                      {approvedCount} من {totalCount} منتجات معتمدة وجاهزة للنشر.
                                    </Text>
                                    <Button
                                      label="🚀 نشر الكتالوج بالكامل للعميل"
                                      tone="brand"
                                      size="sm"
                                      disabled={!(isCategoryMapped && isDuplicatesClean && isMediaSatisfied && approvedCount > 0)}
                                      onPress={() => {
                                        const readyProducts = products.filter((p) => p.approvalStage === 'catalog-adopted');
                                        setProductPreviewPatches((prev) => readyProducts.reduce(
                                          (next, product) => mergeCatalogProductPreviewPatch(next, product.id, { approvalStage: 'client-visible' }),
                                          prev
                                        ));
                                        pushPreviewProposal(createCatalogPreviewProposal({
                                          type: 'visibility-change',
                                          productIds: readyProducts.map((product) => product.id),
                                          label: 'نشر الكتالوج بالكامل للعميل',
                                          note: 'UI_PREVIEW_ONLY: تحويل المنتجات المعتمدة إلى client-visible كمعاينة فقط.',
                                          apiBoundary: 'POST /catalog/products/publish',
                                        }));
                                        setActionMessage('تم تسجيل مقترح نشر المنتجات الجاهزة للعميل');
                                      }}
                                    />
                                  </Box>
                                </Box>
                              )}
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}` }}>
                                    {showBulkOps && <th style={{ width: '36px' }} aria-label="تحديد"></th>}
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
                                    const cat = previewCategories.find(c => c.id === p.categoryPath.main) ?? dshCatalogCategories.find(c => c.id === p.categoryPath.main);
                                    const sub = cat?.subcategories.find(s => s.id === p.categoryPath.sub);
                                    const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
                                    const resolvedStage = p.approvalStage;
                                    return (
                                      <tr
                                        key={p.id}
                                        onClick={() => setSelectedProductId(p.id)}
                                        style={{ borderBottom: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: selectedProductId === p.id ? theme.overlaySoft : 'transparent' }}
                                      >
                                        {showBulkOps && (
                                          <td onClick={e => e.stopPropagation()} style={{ padding: '8px' }}>
                                            {/* Controlled selection — required for CatalogBulkOperationsWorkspace */}
                                            <input
                                              type="checkbox"
                                              checked={selectedProductIds.includes(p.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedProductIds((prev) => [...prev, p.id]);
                                                } else {
                                                  setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                                                }
                                              }}
                                              style={{ accentColor: theme.brandHeaderBackground }}
                                            />
                                          </td>
                                        )}
                                        <td style={{ padding: '8px' }}>
                                           <WatermarkedImage src={p.imageUri} mediaKey={p.mediaKey} fallback={p.emojiFallback} size={32} productName={p.name} />
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
                                             label={p.conflictReason ? 'تعارض' : resolvedStage === 'client-visible' ? 'نشط' : resolvedStage === 'catalog-approved' ? 'معتمد' : resolvedStage === 'marketing-review' ? 'تسويق' : 'مراجعة'}
                                             tone={p.conflictReason ? 'danger' : resolvedStage === 'client-visible' ? 'success' : resolvedStage === 'catalog-approved' ? 'success' : 'warning'}
                                           />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                             </table>
                            </>
                          )}
                        </div>
                     )}
                  </div>

                  {!isManualOrderCategory && activeTab !== 'intake' && activeTab !== 'mapping' ? (
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

              {/* Inspector Panel */}
              {selectedProductId && selectedProduct && (
                <ProductInspectorPanel
                  selectedProduct={selectedProduct}
                  setSelectedProductId={setSelectedProductId}
                  openWorkspace={openWorkspace}
                  queueProductPreviewPatch={queueProductPreviewPatch}
                  previewCategories={previewCategories}
                  setModalMode={setModalMode}
                  setModalForm={setModalForm}
                  setShowProductModal={setShowProductModal}
                />
              )}
              </>
            ) : (
              <TaxonomyScreen taxonomy={taxonomyHook} products={products} />
            )}

          </div>
        </div>
      </main>
      {showProductModal && (
        <ProductEditModal
          setShowProductModal={setShowProductModal}
          modalMode={modalMode}
          modalForm={modalForm}
          setModalForm={setModalForm}
          previewCategories={previewCategories}
          products={products}
          pushPreviewProposal={pushPreviewProposal}
          queueProductPreviewPatch={queueProductPreviewPatch}
          setActionMessage={setActionMessage}
        />
      )}

      {/* ─── Workspace Overlay Layer — CatalogWorkspaceRouter (UI_PREVIEW_ONLY) ─────
          Extracted from monolith. All workspace rendering delegated to router.
          router-ready: CatalogWorkspaceState maps to future URL query params.
          Owner: control-panel/catalogs. No backend/API. ─────────────────────── */}
      <CatalogWorkspaceRouter
        workspaceState={workspaceState}
        products={products}
        selectedProductIds={selectedProductIds}
        onClose={() => setWorkspaceState(null)}
        onProposal={(proposal) => {
          pushPreviewProposal(proposal);
          setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
        }}
      />

      {/* ─── Pending Proposals Banner ────────────────────────────────────────────
          Displays the last submitted preview proposal. No canonical data change.
          All proposals require API binding before taking effect. ────────────── */}
      {pendingProposals.length > 0 && pendingProposals[0] && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 300,
            maxWidth: 560,
            width: '90%',
          }}
        >
          <Surface
            tone="raised"
            padding={3}
            gap={2}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              borderWidth: 2,
              borderColor: pendingProposals[0].status === 'ready-for-api' ? theme.success : theme.warning,
              borderStyle: 'solid',
            }}
          >
            <Box layoutDirection="row" justify="space-between" align="center">
              <Text role="caption" style={{ fontWeight: '800', fontSize: 13 }}>
                📋 {pendingProposals[0].label}
              </Text>
              <Button
                label="✕"
                tone="secondary"
                size="sm"
                onPress={() => dismissPreviewProposal()}
                style={{ minWidth: 0, padding: 0, backgroundColor: 'transparent', borderWidth: 0 }}
              />
            </Box>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>
              {pendingProposals[0].note}
            </Text>
            <Text role="caption" style={{ fontSize: 10, fontWeight: '600', direction: 'ltr' }}>
              status: {pendingProposals[0].status} | owner: {pendingProposals[0].owner}
              {pendingProposals[0].apiBoundary ? ` | API: ${pendingProposals[0].apiBoundary}` : ''}
            </Text>
          </Surface>
        </div>
      )}
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
