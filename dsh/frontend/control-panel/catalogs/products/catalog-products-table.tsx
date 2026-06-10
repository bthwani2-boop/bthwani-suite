'use client';

import React from 'react';
import { Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import { dshCatalogCategories, type CatalogMainCategory, type CatalogProductMaster } from '../catalogs.data';
import { PolicyBadge, WatermarkedImage, FilterDropdown } from '../catalogs.parts';
import type { CatalogFilterColumnId } from '../catalogs.model';

type CatalogProductsTableProps = {
  showBulkOps: boolean;
  selectedProductIds: string[];
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  visibleProducts: CatalogProductMaster[];
  previewCategories: CatalogMainCategory[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  colFilters: Record<CatalogFilterColumnId, string[]>;
  setColFilters: React.Dispatch<React.SetStateAction<Record<CatalogFilterColumnId, string[]>>>;
  openFilterCol: CatalogFilterColumnId | null;
  setOpenFilterCol: (col: CatalogFilterColumnId | null) => void;
  filterOptions: Record<string, string[]>;
};

export function CatalogProductsTable({
  showBulkOps, selectedProductIds, setSelectedProductIds,
  visibleProducts, previewCategories, selectedProductId, setSelectedProductId,
  colFilters, setColFilters, openFilterCol, setOpenFilterCol, filterOptions,
}: CatalogProductsTableProps) {
  const { theme } = useTheme();

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
                <Text role="caption" weight="black" style={{ color: theme.brandHeaderBackground }}>{p.name}</Text>
              </td>
              <td style={{ padding: '8px' }}>
                <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{cat?.label}</Text>
              </td>
              <td style={{ padding: '8px' }}>
                <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{classif?.label || 'عام'}</Text>
              </td>
              <td style={{ padding: '8px' }}>
                <Text role="code" tone="muted" style={{ fontSize: 10 }}>{p.sku}</Text>
              </td>
              <td style={{ padding: '8px' }}>
                <Text role="caption" weight="bold" style={{ color: theme.brandHeaderBackground }}>{p.price}</Text>
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
  );
}
