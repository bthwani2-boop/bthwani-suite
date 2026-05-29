'use client';

import React from 'react';
import { Box, Button, Text, SearchField, Surface, useTheme } from '@bthwani/ui-kit';
import { PRIMARY_TABS, SECONDARY_TABS, type MicroAction } from './catalogs.hooks';
import { type FilterType } from './catalogs.model';
import type { CatalogMainCategory, CatalogSubCategory } from './catalogs.data';
import type { CatalogWorkspaceState } from './catalogs.model';

type CatalogControlStripProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubTab: string;
  setActiveSubTab: (sub: string) => void;
  setSelectedProductId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  effectiveCategories: CatalogMainCategory[];
  hiddenCategoryIds: ReadonlySet<string>;
  hiddenSubCategoryIds: ReadonlySet<string>;
  activeMainCategory: CatalogMainCategory | null;
  handleMainCategorySelect: (cat: CatalogMainCategory | null) => void;
  activeSubCategory: CatalogSubCategory | null;
  handleSubCategorySelect: (sub: CatalogSubCategory | null) => void;
  activeMainClassifId: string | null;
  setActiveMainClassifId: (id: string | null) => void;
  activeSubClassifId: string | null;
  setActiveSubClassifId: (id: string | null) => void;
  showBulkOps: boolean;
  setShowBulkOps: (v: boolean) => void;
  selectedProductIds: string[];
  setWorkspaceState: (state: CatalogWorkspaceState | null) => void;
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  microActions: MicroAction[];
};

const SMART_FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'active', label: 'نشط' },
  { id: 'review', label: 'مراجعة' },
  { id: 'conflict', label: 'تعارض' },
  { id: 'master', label: 'مركزي' },
  { id: 'partner', label: 'شريك' },
  { id: 'needs-link', label: 'يحتاج ربط' },
  { id: 'needs-image', label: 'يحتاج صورة' },
];

export function CatalogControlStrip({
  activeTab, setActiveTab, activeSubTab, setActiveSubTab, setSelectedProductId,
  searchQuery, setSearchQuery, effectiveCategories, hiddenCategoryIds, hiddenSubCategoryIds,
  activeMainCategory, handleMainCategorySelect, activeSubCategory, handleSubCategorySelect,
  activeMainClassifId, setActiveMainClassifId, activeSubClassifId, setActiveSubClassifId,
  showBulkOps, setShowBulkOps, selectedProductIds, setWorkspaceState,
  activeFilter, setActiveFilter, microActions,
}: CatalogControlStripProps) {
  const { theme } = useTheme();

  return (
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
                      padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
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
                          padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
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
                        padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 600,
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
                            padding: '1px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 600,
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
                {/* Main Classification chips */}
                {activeMainCategory && activeSubCategory && activeSubCategory.mainClassifications && activeSubCategory.mainClassifications.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', alignItems: 'center', paddingRight: '24px' }}>
                    <Text role="caption" numberOfLines={1} style={{ fontSize: 8, fontWeight: 800, color: theme.textMuted }}>└─ الرئيسي:</Text>
                    <button
                      onClick={() => { setActiveMainClassifId(null); setActiveSubClassifId(null); }}
                      style={{
                        padding: '1px 5px', borderRadius: '6px', fontSize: '8px', fontWeight: 600,
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
                            padding: '1px 5px', borderRadius: '6px', fontSize: '8px', fontWeight: 600,
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
                          padding: '1px 4px', borderRadius: '5px', fontSize: '8px', fontWeight: 600,
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
                              padding: '1px 4px', borderRadius: '5px', fontSize: '8px', fontWeight: 600,
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
              label={showBulkOps ? 'إغلاق الإجراءات' : 'إجراءات جماعية'}
              tone={showBulkOps ? 'brand' : 'secondary'}
              size="sm"
              onPress={() => setShowBulkOps(!showBulkOps)}
              style={{ paddingVertical: 2, paddingHorizontal: 8 }}
            />
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
          {SMART_FILTERS.map(f => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
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

        {/* Sub-row 3: Contextual Micro Action Strip */}
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
                    padding: '2px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700,
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
  );
}
