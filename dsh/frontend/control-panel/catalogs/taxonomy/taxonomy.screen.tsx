'use client';

import React from 'react';
import { Box, Button, Surface, Text, SearchField, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelStatusTag } from '@bthwani/ui-kit/web';
import type { CatalogProductMaster } from '../catalogs.data';
import { getActualPublicMediaPath } from '../../../shared/resolve-dsh-public-media-path';
import { WatermarkedImage } from '../catalogs.parts';
import type { useTaxonomyScreen } from './taxonomy.hooks';

type TaxonomyScreenProps = {
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
  products: readonly CatalogProductMaster[];
};

export function TaxonomyScreen({ taxonomy, products }: TaxonomyScreenProps) {
  const { theme } = useTheme();
  const {
    previewCategories, setPreviewCategories,
    filteredCategories,
    hiddenCategoryIds,
    addingMainCat, setAddingMainCat,
    addingSubUnder, setAddingSubUnder,
    addingMainClassifUnder, setAddingMainClassifUnder,
    addingSubClassifUnder, setAddingSubClassifUnder,
    formLabel, setFormLabel,
    formSubtitle, setFormSubtitle,
    catError, setCatError,
    editingEntry, setEditingEntry,
    selectedTaxonomyNode, setSelectedTaxonomyNode,
    expandedMainCategoryIds,
    expandedSubCategoryIds,
    expandedMainClassifIds,
    treeSearchQuery, setTreeSearchQuery,
    hoveredNodeId, setHoveredNodeId,
    toggleMainCategoryExpand,
    toggleSubCategoryExpand,
    toggleMainClassifExpand,
    handleAddMainCategory,
    handleAddSubCategory,
    handleAddMainClassification,
    handleAddSubClassification,
    handleToggleCategoryHide,
    handleToggleSubCategoryHide,
    handleDeleteNode,
    handleStartCatEdit,
    handleApplyCatEdit,
    editLabel, setEditLabel,
    editSubtitle, setEditSubtitle,
    getProductCountForCategory,
  } = taxonomy;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
      {/* Right Panel: Modern Tree View (RTL) */}
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
          <div style={{
            padding: '8px 12px', borderRadius: '6px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset,
            border: '1px solid ' + theme.danger, fontSize: '11px', color: theme.danger, fontWeight: 700,
            marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{catError}</span>
            <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '12px', fontWeight: 950 }}>×</button>
          </div>
        )}

        {addingMainCat && (
          <div style={{ marginBottom: 16, padding: '10px 12px', backgroundColor: theme.surfaceInset, borderRadius: '8px', border: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground }}>إضافة فئة رئيسية جديدة</Text>
            <input
              type="text"
              placeholder="اسم الفئة *"
              value={formLabel}
              onChange={e => setFormLabel(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
            />
            <input
              type="text"
              placeholder="وصف / ترجمة فرعية (اختياري)"
              value={formSubtitle}
              onChange={e => setFormSubtitle(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleAddMainCategory} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
              <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); }} style={{ padding: '4px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        )}

        {/* Search filter for taxonomy tree */}
        <div style={{ marginBottom: 16 }}>
          <SearchField
            placeholder="ابحث عن فئة أو تصنيف..."
            value={treeSearchQuery}
            onChangeText={setTreeSearchQuery}
          />
        </div>

        {/* Taxonomy Tree List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCategories.map(cat => {
            const isCatExpanded = treeSearchQuery.trim() !== '' || expandedMainCategoryIds.has(cat.id);
            const isSelected = selectedTaxonomyNode?.type === 'main' && selectedTaxonomyNode.mainId === cat.id;
            const isHidden = hiddenCategoryIds.has(cat.id);
            const pCount = getProductCountForCategory(cat.id);
            const showActions = hoveredNodeId === cat.id || isSelected;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredNodeId(cat.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{ borderRadius: '8px', border: '1px solid ' + (isSelected ? theme.brand : theme.line), backgroundColor: isHidden ? theme.surfaceInset : (isSelected ? theme.brandSurface : theme.surface), overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                  <button
                    onClick={() => setSelectedTaxonomyNode({ type: 'main', mainId: cat.id })}
                    style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, textAlign: 'right' }}
                  >
                    {cat.subcategories.length > 0 ? (
                      <span
                        onClick={(e) => { e.stopPropagation(); toggleMainCategoryExpand(cat.id); }}
                        style={{ fontSize: '11px', color: theme.textMuted, padding: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px' }}
                      >
                        {isCatExpanded ? '▼' : '◀'}
                      </span>
                    ) : (
                      <span style={{ width: '18px', display: 'inline-block' }} />
                    )}
                    <WatermarkedImage src={cat.imageUri} mediaKey={cat.mediaKey} fallback={cat.emojiFallback} size={36} productName={cat.label} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: theme.brandHeaderBackground }}>{cat.label}</span>
                      {cat.subtitle && <span style={{ fontSize: '10.5px', color: theme.textMuted }}>{cat.subtitle}</span>}
                    </div>
                    <span style={{ fontSize: '10.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{pCount} منتج</span>
                  </button>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', opacity: showActions ? 1 : 0, pointerEvents: showActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                    <button
                      onClick={() => { setAddingSubUnder(cat.id); setSelectedTaxonomyNode({ type: 'main', mainId: cat.id }); setFormLabel(''); }}
                      style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                    >
                      + فرعية
                    </button>
                    <button
                      onClick={() => handleToggleCategoryHide(cat.id)}
                      style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: isHidden ? theme.warning : theme.textMuted }}
                    >
                      {isHidden ? '👁️ إظهار' : '🙈 إخفاء'}
                    </button>
                    <button
                      onClick={() => handleStartCatEdit('main', cat.id)}
                      style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteNode('main', cat.id)}
                      style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Inline edit form for main cat */}
                {editingEntry?.type === 'main' && editingEntry.mainId === cat.id && (
                  <div style={{ padding: '8px 14px', borderTop: '1px solid ' + theme.line, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="الاسم *" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }} />
                    <input type="text" value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} placeholder="الوصف" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={handleApplyCatEdit} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                      <button onClick={() => setEditingEntry(null)} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                    </div>
                  </div>
                )}

                {/* Add sub-category form */}
                {addingSubUnder === cat.id && (
                  <div style={{ padding: '8px 14px', borderTop: '1px solid ' + theme.line, backgroundColor: theme.surfaceInset, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Text role="caption" style={{ fontSize: 10, fontWeight: 700, color: theme.brandHeaderBackground }}>إضافة فئة فرعية لـ: {cat.label}</Text>
                    <input type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={e => setFormLabel(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }} />
                    <input type="text" placeholder="وصف (اختياري)" value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                      <button onClick={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); }} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                    </div>
                  </div>
                )}

                {/* Subcategories */}
                {isCatExpanded && cat.subcategories.length > 0 && (
                  <div style={{ borderTop: '1px solid ' + theme.line, backgroundColor: theme.surfaceInset }}>
                    {cat.subcategories.map(sub => {
                      const isSubExpanded = treeSearchQuery.trim() !== '' || expandedSubCategoryIds.has(sub.id);
                      const isSubSelected = selectedTaxonomyNode?.type === 'sub' && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainId === cat.id;
                      const subNodeId = `${cat.id}-${sub.id}`;
                      const showSubActions = hoveredNodeId === subNodeId || isSubSelected;
                      const subPCount = getProductCountForCategory(cat.id, sub.id);

                      return (
                        <div
                          key={sub.id}
                          onMouseEnter={() => setHoveredNodeId(subNodeId)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          style={{ borderBottom: '1px solid ' + theme.line, backgroundColor: isSubSelected ? theme.brandSurface : 'transparent' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 8px 28px' }}>
                            <button
                              onClick={() => setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id })}
                              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'right' }}
                            >
                              {sub.mainClassifications && sub.mainClassifications.length > 0 ? (
                                <span onClick={(e) => { e.stopPropagation(); toggleSubCategoryExpand(sub.id); }} style={{ fontSize: '10px', color: theme.textMuted, padding: '3px', cursor: 'pointer', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {isSubExpanded ? '▼' : '◀'}
                                </span>
                              ) : <span style={{ width: '16px', display: 'inline-block' }} />}
                              <WatermarkedImage src={sub.imageUri} mediaKey={sub.mediaKey} fallback={sub.emojiFallback} size={28} productName={sub.label} />
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: theme.brandHeaderBackground }}>{sub.label}</span>
                                {sub.subtitle && <span style={{ fontSize: '9.5px', color: theme.textMuted }}>{sub.subtitle}</span>}
                              </div>
                              <span style={{ fontSize: '9.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '6px' }}>{subPCount} منتج</span>
                            </button>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', opacity: showSubActions ? 1 : 0, pointerEvents: showSubActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
                              <button onClick={() => { setAddingMainClassifUnder({ mainId: cat.id, subId: sub.id }); setSelectedTaxonomyNode({ type: 'sub', mainId: cat.id, subId: sub.id }); setFormLabel(''); }} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>+ تصنيف</button>
                              <button onClick={() => handleStartCatEdit('sub', cat.id, sub.id)} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>✏️</button>
                              <button onClick={() => handleDeleteNode('sub', cat.id, sub.id)} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>🗑️</button>
                            </div>
                          </div>

                          {editingEntry?.type === 'sub' && editingEntry.subId === sub.id && (
                            <div style={{ padding: '6px 28px', borderTop: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: theme.surfaceInset }}>
                              <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="الاسم *" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '10px' }} />
                              <input type="text" value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} placeholder="الوصف" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '10px' }} />
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={handleApplyCatEdit} style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                <button onClick={() => setEditingEntry(null)} style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '9px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                              </div>
                            </div>
                          )}

                          {addingMainClassifUnder?.mainId === cat.id && addingMainClassifUnder.subId === sub.id && (
                            <div style={{ padding: '6px 28px', borderTop: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: theme.surfaceInset }}>
                              <Text role="caption" style={{ fontSize: 9, fontWeight: 700, color: theme.brandHeaderBackground }}>تصنيف رئيسي جديد لـ: {sub.label}</Text>
                              <input type="text" placeholder="اسم التصنيف *" value={formLabel} onChange={e => setFormLabel(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '10px' }} />
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleAddMainClassification(cat.id, sub.id)} style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                                <button onClick={() => { setAddingMainClassifUnder(null); setFormLabel(''); }} style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '9px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                              </div>
                            </div>
                          )}

                          {isSubExpanded && sub.mainClassifications && sub.mainClassifications.map(mc => {
                            const isMcExpanded = treeSearchQuery.trim() !== '' || expandedMainClassifIds.has(mc.id);
                            const isMcSelected = selectedTaxonomyNode?.type === 'mainClassif' && selectedTaxonomyNode.mainClassifId === mc.id;
                            const mcNodeId = `${cat.id}-${sub.id}-${mc.id}`;
                            const showMcActions = hoveredNodeId === mcNodeId || isMcSelected;

                            return (
                              <div key={mc.id} onMouseEnter={() => setHoveredNodeId(mcNodeId)} onMouseLeave={() => setHoveredNodeId(null)}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 6px 44px', borderTop: '1px solid ' + theme.line }}>
                                  <button
                                    onClick={() => setSelectedTaxonomyNode({ type: 'mainClassif', mainId: cat.id, subId: sub.id, mainClassifId: mc.id })}
                                    style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'right' }}
                                  >
                                    {mc.subClassifications && mc.subClassifications.length > 0 ? (
                                      <span onClick={(e) => { e.stopPropagation(); toggleMainClassifExpand(mc.id); }} style={{ fontSize: '9px', color: theme.textMuted, padding: '2px', cursor: 'pointer', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center' }}>
                                        {isMcExpanded ? '▼' : '◀'}
                                      </span>
                                    ) : <span style={{ width: '14px', display: 'inline-block' }} />}
                                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: isMcSelected ? theme.brand : theme.brandHeaderBackground }}>
                                      {mc.emojiFallback || '🔷'} {mc.label}
                                    </span>
                                  </button>
                                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', opacity: showMcActions ? 1 : 0, pointerEvents: showMcActions ? 'auto' : 'none' }}>
                                    <button onClick={() => { setAddingSubClassifUnder({ mainId: cat.id, subId: sub.id, mainClassifId: mc.id }); setFormLabel(''); }} style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>+ فرعي</button>
                                    <button onClick={() => handleStartCatEdit('mainClassif', cat.id, sub.id, mc.id)} style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '9px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>✏️</button>
                                    <button onClick={() => handleDeleteNode('mainClassif', cat.id, sub.id, mc.id)} style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '9px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>🗑️</button>
                                  </div>
                                </div>

                                {editingEntry?.type === 'mainClassif' && editingEntry.mainClassifId === mc.id && (
                                  <div style={{ padding: '4px 44px', borderTop: '1px solid ' + theme.line, display: 'flex', gap: '4px', backgroundColor: theme.surfaceInset }}>
                                    <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="الاسم *" style={{ padding: '3px 6px', borderRadius: '3px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '9px', flex: 1 }} />
                                    <button onClick={handleApplyCatEdit} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                    <button onClick={() => setEditingEntry(null)} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                  </div>
                                )}

                                {addingSubClassifUnder?.mainClassifId === mc.id && (
                                  <div style={{ padding: '4px 44px', borderTop: '1px solid ' + theme.line, display: 'flex', flexDirection: 'column', gap: '3px', backgroundColor: theme.surfaceInset }}>
                                    <input type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={e => setFormLabel(e.target.value)} style={{ padding: '3px 6px', borderRadius: '3px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '9px' }} />
                                    <div style={{ display: 'flex', gap: '3px' }}>
                                      <button onClick={() => handleAddSubClassification(cat.id, sub.id, mc.id)} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                                      <button onClick={() => { setAddingSubClassifUnder(null); setFormLabel(''); }} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                    </div>
                                  </div>
                                )}

                                {isMcExpanded && mc.subClassifications && mc.subClassifications.map(sc => {
                                  const isScSelected = selectedTaxonomyNode?.type === 'subClassif' && selectedTaxonomyNode.subClassifId === sc.id;
                                  const scNodeId = `${cat.id}-${sub.id}-${mc.id}-${sc.id}`;
                                  const showScActions = hoveredNodeId === scNodeId || isScSelected;

                                  return (
                                    <div key={sc.id} onMouseEnter={() => setHoveredNodeId(scNodeId)} onMouseLeave={() => setHoveredNodeId(null)}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 5px 60px', borderTop: '1px solid ' + theme.line }}>
                                        <button
                                          onClick={() => setSelectedTaxonomyNode({ type: 'subClassif', mainId: cat.id, subId: sub.id, mainClassifId: mc.id, subClassifId: sc.id })}
                                          style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', flex: 1, textAlign: 'right' }}
                                        >
                                          <span style={{ fontSize: '9.5px', fontWeight: 500, color: isScSelected ? theme.brand : theme.textMuted }}>
                                            {sc.emojiFallback || '🔸'} {sc.label}
                                          </span>
                                        </button>
                                        <div style={{ display: 'flex', gap: '3px', opacity: showScActions ? 1 : 0, pointerEvents: showScActions ? 'auto' : 'none' }}>
                                          <button onClick={() => handleStartCatEdit('subClassif', cat.id, sub.id, mc.id, sc.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: '1px solid ' + theme.line, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground }}>✏️</button>
                                          <button onClick={() => handleDeleteNode('subClassif', cat.id, sub.id, mc.id, sc.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: '1px solid ' + theme.danger, cursor: 'pointer', backgroundColor: theme.surface, color: theme.danger }}>🗑️</button>
                                        </div>
                                      </div>
                                      {editingEntry?.type === 'subClassif' && editingEntry.subClassifId === sc.id && (
                                        <div style={{ padding: '3px 60px', borderTop: '1px solid ' + theme.line, display: 'flex', gap: '3px', backgroundColor: theme.surfaceInset }}>
                                          <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="الاسم *" style={{ padding: '2px 5px', borderRadius: '3px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '9px', flex: 1 }} />
                                          <button onClick={handleApplyCatEdit} style={{ padding: '1px 6px', borderRadius: '3px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
                                          <button onClick={() => setEditingEntry(null)} style={{ padding: '1px 6px', borderRadius: '3px', fontSize: '8px', border: '1px solid ' + theme.lineStrong, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
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

      {/* Left Panel: Node Inspector/Editor */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', backgroundColor: theme.surfaceInset, borderRight: '1px solid ' + theme.line, overflowY: 'auto', padding: '20px' }}>
        {selectedTaxonomyNode ? (() => {
          const mainCat = previewCategories.find(c => c.id === selectedTaxonomyNode.mainId);
          const subCat = mainCat?.subcategories.find(s => s.id === selectedTaxonomyNode.subId);
          const mainClassif = subCat?.mainClassifications?.find(mc => mc.id === selectedTaxonomyNode.mainClassifId);
          const subClassif = mainClassif?.subClassifications?.find(sc => sc.id === selectedTaxonomyNode.subClassifId);

          const updateNodeField = (fields: Partial<{ label: string; emojiFallback: string; imageUri: string; mediaKey: string } & Record<'subtitle', string>>) => {
            setPreviewCategories(prev => {
              return prev.map(c => {
                if (selectedTaxonomyNode.type === 'main' && c.id === selectedTaxonomyNode.mainId) {
                  return { ...c, ...fields };
                }
                if (c.id === selectedTaxonomyNode.mainId) {
                  return {
                    ...c,
                    subcategories: c.subcategories.map(s => {
                      if (selectedTaxonomyNode.type === 'sub' && s.id === selectedTaxonomyNode.subId) {
                        return { ...s, ...fields };
                      }
                      if (s.id === selectedTaxonomyNode.subId) {
                        return {
                          ...s,
                          mainClassifications: (s.mainClassifications || []).map(mc => {
                            if (selectedTaxonomyNode.type === 'mainClassif' && mc.id === selectedTaxonomyNode.mainClassifId) {
                              return { ...mc, ...fields };
                            }
                            if (mc.id === selectedTaxonomyNode.mainClassifId) {
                              return {
                                ...mc,
                                subClassifications: (mc.subClassifications || []).map(sc => {
                                  if (selectedTaxonomyNode.type === 'subClassif' && sc.id === selectedTaxonomyNode.subClassifId) {
                                    return { ...sc, ...fields };
                                  }
                                  return sc;
                                }),
                              };
                            }
                            return mc;
                          }),
                        };
                      }
                      return s;
                    }),
                  };
                }
                return c;
              });
            });
          };

          let nodeLabel = '';
          let nodeSubtitle = '';
          let nodeEmoji = '';
          let nodeImageUri = '';
          let nodeMediaKey = '';
          let nodeTypeLabel = '';

          if (selectedTaxonomyNode.type === 'main' && mainCat) {
            nodeLabel = mainCat.label; nodeSubtitle = mainCat.subtitle;
            nodeEmoji = mainCat.emojiFallback || ''; nodeImageUri = mainCat.imageUri || ''; nodeMediaKey = mainCat.mediaKey || '';
            nodeTypeLabel = 'فئة رئيسية';
          } else if (selectedTaxonomyNode.type === 'sub' && subCat) {
            nodeLabel = subCat.label; nodeSubtitle = subCat.subtitle;
            nodeEmoji = subCat.emojiFallback || ''; nodeImageUri = subCat.imageUri || ''; nodeMediaKey = subCat.mediaKey || '';
            nodeTypeLabel = 'فئة فرعية';
          } else if (selectedTaxonomyNode.type === 'mainClassif' && mainClassif) {
            nodeLabel = mainClassif.label; nodeEmoji = mainClassif.emojiFallback || '';
            nodeImageUri = mainClassif.imageUri || ''; nodeMediaKey = mainClassif.mediaKey || '';
            nodeTypeLabel = 'تصنيف رئيسي';
          } else if (selectedTaxonomyNode.type === 'subClassif' && subClassif) {
            nodeLabel = subClassif.label; nodeEmoji = subClassif.emojiFallback || '';
            nodeImageUri = subClassif.imageUri || ''; nodeMediaKey = subClassif.mediaKey || '';
            nodeTypeLabel = 'تصنيف فرعي';
          } else {
            return (
              <Box align="center" justify="center" style={{ flex: 1 }}>
                <Text role="caption" tone="muted">العنصر المختار لم يعد موجوداً في الشجرة.</Text>
              </Box>
            );
          }

          const bindedProducts = (products as CatalogProductMaster[]).filter(p => {
            if (selectedTaxonomyNode.type === 'main') return p.categoryPath.main === selectedTaxonomyNode.mainId;
            if (selectedTaxonomyNode.type === 'sub') return p.categoryPath.main === selectedTaxonomyNode.mainId && p.categoryPath.sub === selectedTaxonomyNode.subId;
            if (selectedTaxonomyNode.type === 'mainClassif') return p.categoryPath.mainClassification === selectedTaxonomyNode.mainClassifId;
            return p.categoryPath.subClassification === selectedTaxonomyNode.subClassifId;
          });

          return (
            <Box gap={4} style={{ flex: 1 }}>
              <Box layoutDirection="row" justify="space-between" align="center" style={{ borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 10 }}>
                <Box gap={1}>
                  <Text role="bodyStrong" style={{ fontSize: 14, color: theme.brandHeaderBackground }}>مراجعة وتعديل: {nodeTypeLabel}</Text>
                  <Text role="caption" tone="muted" style={{ fontSize: 10 }}>معرف النظام: {selectedTaxonomyNode.subClassifId || selectedTaxonomyNode.mainClassifId || selectedTaxonomyNode.subId || selectedTaxonomyNode.mainId}</Text>
                </Box>
                <Button label="✕ إغلاق" tone="secondary" size="sm" onPress={() => setSelectedTaxonomyNode(null)} />
              </Box>

              <Surface tone="raised" padding={4} style={{ borderRadius: '12px', borderWidth: 1, borderStyle: 'solid', borderColor: theme.lineStrong, backgroundColor: theme.surface, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} align="center" gap={2}>
                {nodeMediaKey || nodeImageUri ? (
                  <WatermarkedImage src={nodeImageUri} mediaKey={nodeMediaKey} fallback={nodeEmoji || '📦'} size={64} productName={nodeLabel} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: theme.brandSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '36px' }}>{nodeEmoji || '📦'}</span>
                  </div>
                )}
                <Text role="bodyStrong" style={{ fontSize: 14, marginTop: 6, color: theme.brandHeaderBackground }}>{nodeLabel}</Text>
                {nodeSubtitle ? <Text role="caption" tone="muted" style={{ fontSize: 11, textAlign: 'center', marginTop: 2 }}>{nodeSubtitle}</Text> : null}
              </Surface>

              <Box gap={3}>
                <Box gap={1}>
                  <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>اسم العنصر *</Text>
                  <input
                    type="text"
                    value={nodeLabel}
                    onChange={e => updateNodeField({ label: e.target.value })}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                  />
                </Box>

                {(selectedTaxonomyNode.type === 'main' || selectedTaxonomyNode.type === 'sub') && (
                  <Box gap={1}>
                    <Text role="caption" tone="muted" style={{ fontSize: 11, fontWeight: 700, textAlign: 'right' }}>الوصف أو الترجمة الفرعية</Text>
                    <input
                      type="text"
                      value={nodeSubtitle}
                      onChange={e => updateNodeField({ subtitle: e.target.value })}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '12px' }}
                    />
                  </Box>
                )}

                <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12, marginTop: 4 }}>
                  <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, textAlign: 'right', fontSize: 11 }}>إدارة وصورة الفئة (Category Image & Icon)</Text>

                  <Box layoutDirection="row" gap={2}>
                    <Box style={{ flex: 1 }} gap={1}>
                      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>أيقونة تعبيرية (Emoji)</Text>
                      <input
                        type="text"
                        value={nodeEmoji}
                        placeholder="أدخل الرمز التعبيري هنا..."
                        onChange={e => updateNodeField({ emojiFallback: e.target.value })}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                      />
                    </Box>
                    <Box style={{ flex: 1 }} gap={1}>
                      <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>مفتاح الصورة</Text>
                      <select
                        value={nodeMediaKey}
                        onChange={e => {
                          const key = e.target.value;
                          const uri = getActualPublicMediaPath(key);
                          updateNodeField({ mediaKey: key, imageUri: uri });
                        }}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                      >
                        <option value="">بدون صورة</option>
                        <option value="dsh.product.apple.v1">🍎 تفاح</option>
                        <option value="dsh.product.milk.v1">🥛 حليب</option>
                        <option value="dsh.product.bread.v1">🍞 خبز</option>
                        <option value="dsh.product.chicken.v1">🍗 دجاج</option>
                        <option value="dsh.product.pasta.v1">🍝 باستا</option>
                        <option value="dsh.product.choco.v1">🍰 كيكة</option>
                        <option value="dsh.product.roll.v1">🌴 تمر (مؤقت)</option>
                        <option value="dsh.product.lead-5.dates-box.v1">🌴 علبة التمر الفاخرة</option>
                      </select>
                    </Box>
                  </Box>

                  <Box gap={1}>
                    <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right' }}>رابط صورة مباشر (URL)</Text>
                    <input
                      type="text"
                      value={nodeImageUri}
                      placeholder="أدخل رابط الصورة"
                      onChange={e => updateNodeField({ mediaKey: '', imageUri: e.target.value })}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid ' + theme.lineStrong, direction: 'rtl', backgroundColor: theme.surface, color: theme.brandHeaderBackground, fontSize: '11px' }}
                    />
                  </Box>

                  {(nodeImageUri || nodeMediaKey) && (
                    <button
                      onClick={() => updateNodeField({ mediaKey: '', imageUri: '' })}
                      style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, fontSize: '10px', cursor: 'pointer', textAlign: 'right', padding: 0 }}
                    >
                      ✕ إزالة الصورة
                    </button>
                  )}
                </Box>

                {/* Bound products list */}
                {bindedProducts.length > 0 && (
                  <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 12 }}>
                    <Text role="caption" style={{ fontWeight: 800, color: theme.brandHeaderBackground, fontSize: 11 }}>المنتجات المرتبطة ({bindedProducts.length})</Text>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <thead>
                        <tr style={{ backgroundColor: theme.surfaceInset }}>
                          <th style={{ padding: '4px 6px', textAlign: 'right', color: theme.textMuted }}>المنتج</th>
                          <th style={{ padding: '4px 6px', textAlign: 'right', color: theme.textMuted }}>المعرف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bindedProducts.slice(0, 10).map(p => (
                          <tr key={p.id} style={{ borderTop: '1px solid ' + theme.line }}>
                            <td style={{ padding: '4px 6px', color: theme.brandHeaderBackground }}>{p.name}</td>
                            <td style={{ padding: '4px 6px', color: theme.textMuted, fontFamily: 'monospace' }}>
                              <Text role="caption" tone="muted" style={{ fontSize: 10 }}>{p.sku}</Text>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })() : (
          <Box align="center" justify="center" style={{ flex: 1, opacity: 0.6 }} gap={2}>
            <span style={{ fontSize: '56px' }}>📂</span>
            <Text role="bodyStrong" style={{ textAlign: 'center', fontSize: 14, color: theme.brandHeaderBackground }}>يرجى تحديد عنصر لبدء المراجعة</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'center', fontSize: 11, maxWidth: 280, lineHeight: 1.4 }}>اضغط على أي فئة رئيسية، فئة فرعية، تصنيف رئيسي أو تصنيف فرعي لمعاينة تفاصيله، تعديل بياناته، أو تغيير صورته وأيقونته فوراً.</Text>
          </Box>
        )}
      </div>
    </div>
  );
}
