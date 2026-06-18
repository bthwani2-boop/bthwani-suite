'use client';

import React from 'react';
import { Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogMainCategory, CatalogSubCategory } from './catalogs.data';

type CatalogCategoryChipsProps = {
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
};

function chipStyle(isSelected: boolean, theme: ReturnType<typeof useTheme>['theme'], size: 'sm' | 'xs' = 'sm'): React.CSSProperties {
  return {
    padding: size === 'sm' ? '2px 8px' : size === 'xs' ? '1px 5px' : '1px 4px',
    borderRadius: size === 'sm' ? '10px' : size === 'xs' ? '6px' : '5px',
    fontSize: size === 'sm' ? '10px' : size === 'xs' ? '8px' : '8px',
    fontWeight: 600,
    border: `1px solid ${isSelected ? theme.brand : theme.lineStrong}`,
    cursor: 'pointer',
    backgroundColor: isSelected ? theme.brandSurface : theme.surface,
    color: isSelected ? theme.brand : theme.textMuted,
    whiteSpace: 'nowrap' as const,
  };
}

export function CatalogCategoryChips({
  effectiveCategories, hiddenCategoryIds, hiddenSubCategoryIds,
  activeMainCategory, handleMainCategorySelect,
  activeSubCategory, handleSubCategorySelect,
  activeMainClassifId, setActiveMainClassifId,
  activeSubClassifId, setActiveSubClassifId,
}: CatalogCategoryChipsProps) {
  const { theme } = useTheme();

  const currentMC = activeMainClassifId
    ? activeSubCategory?.mainClassifications?.find(c => c.id === activeMainClassifId)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Main category chips */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center' }}>
        <Text role="caption" numberOfLines={1} weight="black" style={{ fontSize: 10, color: theme.textMuted }}>الفئة:</Text>
        <button onClick={() => handleMainCategorySelect(null)} style={chipStyle(!activeMainCategory, theme)}>الكل</button>
        {effectiveCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleMainCategorySelect(cat)}
            title={hiddenCategoryIds.has(cat.id) ? 'مخفي (معاينة)' : undefined}
            style={{ ...chipStyle(activeMainCategory?.id === cat.id, theme), opacity: hiddenCategoryIds.has(cat.id) ? 0.5 : 1 }}
          >
            {cat.emojiFallback} {cat.label}
          </button>
        ))}
      </div>

      {/* Sub-category chips */}
      {activeMainCategory && activeMainCategory.subcategories.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center', paddingRight: '12px' }}>
          <Text role="caption" numberOfLines={1} weight="black" style={{ fontSize: 9, color: theme.textMuted }}>└ الفرعية:</Text>
          <button onClick={() => handleSubCategorySelect(null)} style={{ ...chipStyle(!activeSubCategory, theme), padding: '1px 6px', borderRadius: '8px', fontSize: '9px' }}>الكل</button>
          {activeMainCategory.subcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => handleSubCategorySelect(sub)}
              title={hiddenSubCategoryIds.has(sub.id) ? 'مخفي (معاينة)' : undefined}
              style={{ ...chipStyle(activeSubCategory?.id === sub.id, theme), padding: '1px 6px', borderRadius: '8px', fontSize: '9px', opacity: hiddenSubCategoryIds.has(sub.id) ? 0.5 : 1 }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Main classification chips */}
      {activeMainCategory && activeSubCategory && activeSubCategory.mainClassifications && activeSubCategory.mainClassifications.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center', paddingRight: '24px' }}>
          <Text role="caption" numberOfLines={1} weight="black" style={{ fontSize: 8, color: theme.textMuted }}>└─ الرئيسي:</Text>
          <button onClick={() => { setActiveMainClassifId(null); setActiveSubClassifId(null); }} style={chipStyle(!activeMainClassifId, theme, 'xs')}>الكل</button>
          {activeSubCategory.mainClassifications.map(mc => (
            <button
              key={mc.id}
              onClick={() => { setActiveMainClassifId(activeMainClassifId === mc.id ? null : mc.id); setActiveSubClassifId(null); }}
              style={chipStyle(activeMainClassifId === mc.id, theme, 'xs')}
            >
              🔹 {mc.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-classification chips */}
      {currentMC && currentMC.subClassifications && currentMC.subClassifications.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center', paddingRight: '36px' }}>
          <Text role="caption" numberOfLines={1} weight="black" style={{ fontSize: 8, color: theme.textMuted }}>└─ الفرعي:</Text>
          <button onClick={() => setActiveSubClassifId(null)} style={{ ...chipStyle(!activeSubClassifId, theme, 'xs'), padding: '1px 4px', borderRadius: '5px' }}>الكل</button>
          {currentMC.subClassifications.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveSubClassifId(activeSubClassifId === sc.id ? null : sc.id)}
              style={{ ...chipStyle(activeSubClassifId === sc.id, theme, 'xs'), padding: '1px 4px', borderRadius: '5px' }}
            >
              🔸 {sc.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
