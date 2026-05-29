'use client';

import React from 'react';
import { Box, Button, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import type { CatalogProductMaster } from '../catalogs.data';
import type { useTaxonomyScreen } from './taxonomy.hooks';
import { TaxonomyNodeInspector } from './taxonomy-node-inspector';
import { TaxonomyMainCategoryNode } from './taxonomy-tree-nodes';

type TaxonomyScreenProps = {
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
  products: readonly CatalogProductMaster[];
};

export function TaxonomyScreen({ taxonomy, products }: TaxonomyScreenProps) {
  const { theme } = useTheme();
  const {
    previewCategories, setPreviewCategories,
    filteredCategories,
    addingMainCat, setAddingMainCat,
    setAddingSubUnder,
    setAddingMainClassifUnder,
    setAddingSubClassifUnder,
    formLabel, setFormLabel,
    formSubtitle, setFormSubtitle,
    catError, setCatError,
    setEditingEntry,
    selectedTaxonomyNode, setSelectedTaxonomyNode,
    treeSearchQuery, setTreeSearchQuery,
    handleAddMainCategory,
  } = taxonomy;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
      {/* Tree View Panel */}
      <div style={{ flex: 1.3, borderLeft: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', backgroundColor: theme.surface, overflowY: 'auto', padding: '20px' }}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 12, marginBottom: 16 }}>
          <Box gap={1}>
            <Text role="bodyStrong" style={{ fontSize: 16, color: theme.brandHeaderBackground }}>هيكل الفئات والتصنيفات المركزية</Text>
            <Text role="caption" tone="muted" style={{ fontSize: 11 }}>تصفح شجرة الفئات والتصنيفات، واضغط على أي عنصر لمراجعته وتعديل صورته</Text>
          </Box>
          <div style={{ flexShrink: 0, minWidth: 'fit-content', marginLeft: '8px' }}>
            <Button
              label="➕ فئة رئيسية جديدة"
              tone="brand"
              size="sm"
              onPress={() => {
                setAddingMainCat(true);
                setAddingSubUnder(null);
                setAddingMainClassifUnder(null);
                setAddingSubClassifUnder(null);
                setEditingEntry(null);
                setFormLabel('');
                setFormSubtitle('');
                setCatError(null);
              }}
            />
          </div>
        </Box>

        {catError && (
          <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset, border: '1px solid ' + theme.danger, fontSize: '11px', color: theme.danger, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{catError}</span>
            <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '12px', fontWeight: 950 }}>×</button>
          </div>
        )}

        {addingMainCat && (
          <div style={{ marginBottom: 16, padding: '10px 12px', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>إضافة فئة رئيسية جديدة</Text>
            <input type="text" placeholder="اسم الفئة *" value={formLabel} onChange={e => setFormLabel(e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }} />
            <input type="text" placeholder="وصف / ترجمة فرعية (اختياري)" value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleAddMainCategory} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
              <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); }} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <SearchField placeholder="ابحث عن فئة أو تصنيف..." value={treeSearchQuery} onChangeText={setTreeSearchQuery} />
        </div>

        {/* Taxonomy Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCategories.map(cat => (
            <TaxonomyMainCategoryNode key={cat.id} cat={cat} taxonomy={taxonomy} />
          ))}
        </div>
      </div>

      {/* Node Inspector Panel */}
      <TaxonomyNodeInspector
        previewCategories={previewCategories}
        setPreviewCategories={setPreviewCategories}
        selectedTaxonomyNode={selectedTaxonomyNode}
        setSelectedTaxonomyNode={setSelectedTaxonomyNode}
        products={products}
      />
    </div>
  );
}
