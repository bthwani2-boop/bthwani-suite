'use client';

import React from 'react';
import { Text, useTheme } from '@bthwani/ui-kit';
import { PRIMARY_TABS, SECONDARY_TABS } from './catalogs.hooks';
import { initialColumnFilters, type CatalogFilterColumnId, type FilterType } from './catalogs.model';
import type { CatalogMainCategory, CatalogSubCategory } from './catalogs.data';

const FILTER_LABELS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'active', label: 'نشط' },
  { id: 'review', label: 'مراجعة' },
  { id: 'conflict', label: 'تعارض' },
  { id: 'master', label: 'مركزي' },
  { id: 'partner', label: 'شريك' },
  { id: 'needs-link', label: 'يحتاج ربط' },
  { id: 'needs-image', label: 'يحتاج صورة' },
];

type CatalogBreadcrumbProps = {
  activeTab: string;
  activeSubTab: string;
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  colFilters: Record<CatalogFilterColumnId, string[]>;
  setColFilters: (v: Record<CatalogFilterColumnId, string[]>) => void;
  activeMainCategory: CatalogMainCategory | null;
  setActiveMainCategory: (cat: CatalogMainCategory | null) => void;
  activeSubCategory: CatalogSubCategory | null;
  setActiveSubCategory: (sub: CatalogSubCategory | null) => void;
  activeMainClassifId: string | null;
  setActiveMainClassifId: (id: string | null) => void;
  activeSubClassifId: string | null;
  setActiveSubClassifId: (id: string | null) => void;
  activeColFiltersCount: number;
  filteredProductCount: number;
};

export function CatalogBreadcrumb({
  activeTab, activeSubTab, activeFilter, setActiveFilter,
  searchQuery, setSearchQuery, colFilters, setColFilters,
  activeMainCategory, setActiveMainCategory, activeSubCategory, setActiveSubCategory,
  activeMainClassifId, setActiveMainClassifId, activeSubClassifId, setActiveSubClassifId,
  activeColFiltersCount, filteredProductCount,
}: CatalogBreadcrumbProps) {
  const { theme } = useTheme();

  const hasActiveFilters =
    activeFilter !== 'all' || searchQuery !== '' || activeColFiltersCount > 0 ||
    activeMainCategory !== null || activeSubCategory !== null ||
    activeMainClassifId !== null || activeSubClassifId !== null;

  const activeFilterCount =
    activeColFiltersCount +
    (activeFilter !== 'all' ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0) +
    (activeMainCategory ? 1 : 0) +
    (activeMainClassifId ? 1 : 0) +
    (activeSubClassifId ? 1 : 0);

  return (
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
              {FILTER_LABELS.find(f => f.id === activeFilter)?.label}
            </Text>
          </>
        )}
        <Text role="caption" tone="muted" style={{ fontSize: 10, marginRight: 8 }}>
          ({filteredProductCount} منتج)
        </Text>
      </div>

      {hasActiveFilters && (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Text role="caption" style={{ fontSize: 10, color: theme.brand }}>
            {`نشط: ${activeFilterCount} فلتر`}
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
  );
}
