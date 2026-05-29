import React from 'react';
import { useTheme } from '@bthwani/ui-kit';
import { WatermarkedImage } from '../catalogs.parts';
import { TaxonomyInlineForm } from './taxonomy-inline-form';
import type { CatalogMainCategory, CatalogSubCategory, CatalogMainClassification, CatalogSubClassification } from '../catalogs.data';
import type { useTaxonomyScreen } from './taxonomy.hooks';

// ─── Shared ───────────────────────────────────────────────────────────────────

function actionButtonStyle(theme: any, isDanger = false) {
  return {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9.5px',
    fontWeight: 700,
    border: `1px solid ${isDanger ? theme.danger : theme.line}`,
    cursor: 'pointer',
    backgroundColor: theme.surface,
    color: isDanger ? theme.danger : theme.brandHeaderBackground,
  };
}

// ─── Sub-Classification ───────────────────────────────────────────────────────

export function TaxonomySubClassifNode({
  catId, subId, mcId, sc, taxonomy
}: {
  catId: string; subId: string; mcId: string; sc: CatalogSubClassification;
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
}) {
  const { theme } = useTheme();
  const { selectedTaxonomyNode, setSelectedTaxonomyNode, hoveredNodeId, setHoveredNodeId, handleStartCatEdit, handleDeleteNode, editingEntry, editLabel, setEditLabel, handleApplyCatEdit, setEditingEntry } = taxonomy;

  const isScSelected = selectedTaxonomyNode?.type === 'subClassif' && selectedTaxonomyNode.subClassifId === sc.id;
  const scNodeId = `${catId}-${subId}-${mcId}-${sc.id}`;
  const showScActions = hoveredNodeId === scNodeId || isScSelected;

  return (
    <div onMouseEnter={() => setHoveredNodeId(scNodeId)} onMouseLeave={() => setHoveredNodeId(null)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 5px 60px', borderTop: `1px solid ${theme.line}` }}>
        <button
          onClick={() => setSelectedTaxonomyNode({ type: 'subClassif', mainId: catId, subId: subId, mainClassifId: mcId, subClassifId: sc.id })}
          style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', flex: 1, textAlign: 'right' }}
        >
          <span style={{ fontSize: '9.5px', fontWeight: 500, color: isScSelected ? theme.brand : theme.textMuted }}>{sc.emojiFallback || '🔸'} {sc.label}</span>
        </button>
        <div style={{ display: 'flex', gap: '3px', opacity: showScActions ? 1 : 0, pointerEvents: showScActions ? 'auto' : 'none' }}>
          <button onClick={() => handleStartCatEdit('subClassif', catId, subId, mcId, sc.id)} style={actionButtonStyle(theme)}>✏️</button>
          <button onClick={() => handleDeleteNode('subClassif', catId, subId, mcId, sc.id)} style={actionButtonStyle(theme, true)}>🗑️</button>
        </div>
      </div>
      {editingEntry?.type === 'subClassif' && editingEntry.subClassifId === sc.id && (
        <TaxonomyInlineForm
          value={editLabel}
          onChange={setEditLabel}
          labelPlaceholder="الاسم *"
          showSubtitle={false}
          compact
          onConfirm={handleApplyCatEdit}
          onCancel={() => setEditingEntry(null)}
          confirmLabel="حفظ"
        />
      )}
    </div>
  );
}

// ─── Main Classification ──────────────────────────────────────────────────────

export function TaxonomyMainClassifNode({
  catId, subId, mc, taxonomy
}: {
  catId: string; subId: string; mc: CatalogMainClassification;
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
}) {
  const { theme } = useTheme();
  const {
    treeSearchQuery, expandedMainClassifIds, selectedTaxonomyNode, setSelectedTaxonomyNode,
    hoveredNodeId, setHoveredNodeId, toggleMainClassifExpand,
    setAddingSubClassifUnder, setFormLabel, handleStartCatEdit, handleDeleteNode,
    editingEntry, editLabel, setEditLabel, handleApplyCatEdit, setEditingEntry,
    addingSubClassifUnder, formLabel, handleAddSubClassification
  } = taxonomy;

  const isMcExpanded = treeSearchQuery.trim() !== '' || expandedMainClassifIds.has(mc.id);
  const isMcSelected = selectedTaxonomyNode?.type === 'mainClassif' && selectedTaxonomyNode.mainClassifId === mc.id;
  const mcNodeId = `${catId}-${subId}-${mc.id}`;
  const showMcActions = hoveredNodeId === mcNodeId || isMcSelected;

  return (
    <div onMouseEnter={() => setHoveredNodeId(mcNodeId)} onMouseLeave={() => setHoveredNodeId(null)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px 6px 44px', borderTop: `1px solid ${theme.line}` }}>
        <button
          onClick={() => setSelectedTaxonomyNode({ type: 'mainClassif', mainId: catId, subId: subId, mainClassifId: mc.id })}
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
          <button onClick={() => { setAddingSubClassifUnder({ mainId: catId, subId: subId, mainClassifId: mc.id }); setFormLabel(''); }} style={actionButtonStyle(theme)}>+ فرعي</button>
          <button onClick={() => handleStartCatEdit('mainClassif', catId, subId, mc.id)} style={actionButtonStyle(theme)}>✏️</button>
          <button onClick={() => handleDeleteNode('mainClassif', catId, subId, mc.id)} style={actionButtonStyle(theme, true)}>🗑️</button>
        </div>
      </div>

      {editingEntry?.type === 'mainClassif' && editingEntry.mainClassifId === mc.id && (
        <TaxonomyInlineForm
          value={editLabel}
          onChange={setEditLabel}
          labelPlaceholder="الاسم *"
          showSubtitle={false}
          compact
          onConfirm={handleApplyCatEdit}
          onCancel={() => setEditingEntry(null)}
          confirmLabel="حفظ"
        />
      )}

      {addingSubClassifUnder?.mainClassifId === mc.id && (
        <TaxonomyInlineForm
          labelPlaceholder="اسم التصنيف الفرعي *"
          showSubtitle={false}
          value={formLabel}
          onChange={setFormLabel}
          compact
          onConfirm={() => handleAddSubClassification(catId, subId, mc.id)}
          onCancel={() => { setAddingSubClassifUnder(null); setFormLabel(''); }}
          confirmLabel="تأكيد"
        />
      )}

      {isMcExpanded && mc.subClassifications && mc.subClassifications.map((sc: CatalogSubClassification) => (
        <TaxonomySubClassifNode key={sc.id} catId={catId} subId={subId} mcId={mc.id} sc={sc} taxonomy={taxonomy} />
      ))}
    </div>
  );
}

// ─── Sub Category ─────────────────────────────────────────────────────────────

export function TaxonomySubCategoryNode({
  catId, sub, taxonomy
}: {
  catId: string; sub: CatalogSubCategory;
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
}) {
  const { theme } = useTheme();
  const {
    treeSearchQuery, expandedSubCategoryIds, selectedTaxonomyNode, setSelectedTaxonomyNode,
    hoveredNodeId, setHoveredNodeId, toggleSubCategoryExpand, getProductCountForCategory,
    setAddingMainClassifUnder, setFormLabel, handleStartCatEdit, handleDeleteNode,
    editingEntry, editLabel, editSubtitle, setEditLabel, setEditSubtitle, handleApplyCatEdit, setEditingEntry,
    addingMainClassifUnder, formLabel, handleAddMainClassification
  } = taxonomy;

  const isSubExpanded = treeSearchQuery.trim() !== '' || expandedSubCategoryIds.has(sub.id);
  const isSubSelected = selectedTaxonomyNode?.type === 'sub' && selectedTaxonomyNode.subId === sub.id && selectedTaxonomyNode.mainId === catId;
  const subNodeId = `${catId}-${sub.id}`;
  const showSubActions = hoveredNodeId === subNodeId || isSubSelected;
  const subPCount = getProductCountForCategory(catId, sub.id);

  return (
    <div onMouseEnter={() => setHoveredNodeId(subNodeId)} onMouseLeave={() => setHoveredNodeId(null)} style={{ borderBottom: `1px solid ${theme.line}`, backgroundColor: isSubSelected ? theme.brandSurface : 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 8px 28px' }}>
        <button
          onClick={() => setSelectedTaxonomyNode({ type: 'sub', mainId: catId, subId: sub.id })}
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
          <button onClick={() => { setAddingMainClassifUnder({ mainId: catId, subId: sub.id }); setSelectedTaxonomyNode({ type: 'sub', mainId: catId, subId: sub.id }); setFormLabel(''); }} style={actionButtonStyle(theme)}>+ تصنيف</button>
          <button onClick={() => handleStartCatEdit('sub', catId, sub.id)} style={actionButtonStyle(theme)}>✏️</button>
          <button onClick={() => handleDeleteNode('sub', catId, sub.id)} style={actionButtonStyle(theme, true)}>🗑️</button>
        </div>
      </div>

      {editingEntry?.type === 'sub' && editingEntry.subId === sub.id && (
        <TaxonomyInlineForm
          value={editLabel}
          subtitleValue={editSubtitle}
          onChange={setEditLabel}
          onSubtitleChange={setEditSubtitle}
          labelPlaceholder="الاسم *"
          subtitlePlaceholder="الوصف"
          onConfirm={handleApplyCatEdit}
          onCancel={() => setEditingEntry(null)}
          confirmLabel="حفظ"
        />
      )}

      {addingMainClassifUnder?.mainId === catId && addingMainClassifUnder.subId === sub.id && (
        <TaxonomyInlineForm
          title={`تصنيف رئيسي جديد لـ: ${sub.label}`}
          labelPlaceholder="اسم التصنيف *"
          showSubtitle={false}
          value={formLabel}
          onChange={setFormLabel}
          compact
          onConfirm={() => handleAddMainClassification(catId, sub.id)}
          onCancel={() => { setAddingMainClassifUnder(null); setFormLabel(''); }}
          confirmLabel="تأكيد"
        />
      )}

      {isSubExpanded && sub.mainClassifications && sub.mainClassifications.map((mc: CatalogMainClassification) => (
        <TaxonomyMainClassifNode key={mc.id} catId={catId} subId={sub.id} mc={mc} taxonomy={taxonomy} />
      ))}
    </div>
  );
}

// ─── Main Category ────────────────────────────────────────────────────────────

export function TaxonomyMainCategoryNode({
  cat, taxonomy
}: {
  cat: CatalogMainCategory;
  taxonomy: ReturnType<typeof useTaxonomyScreen>;
}) {
  const { theme } = useTheme();
  const {
    treeSearchQuery, expandedMainCategoryIds, selectedTaxonomyNode, setSelectedTaxonomyNode, hiddenCategoryIds,
    getProductCountForCategory, hoveredNodeId, setHoveredNodeId, toggleMainCategoryExpand,
    setAddingSubUnder, setFormLabel, handleToggleCategoryHide, handleStartCatEdit, handleDeleteNode,
    editingEntry, editLabel, editSubtitle, setEditLabel, setEditSubtitle, handleApplyCatEdit, setEditingEntry,
    addingSubUnder, formLabel, formSubtitle, setFormSubtitle, handleAddSubCategory
  } = taxonomy;

  const isCatExpanded = treeSearchQuery.trim() !== '' || expandedMainCategoryIds.has(cat.id);
  const isSelected = selectedTaxonomyNode?.type === 'main' && selectedTaxonomyNode.mainId === cat.id;
  const isHidden = hiddenCategoryIds.has(cat.id);
  const pCount = getProductCountForCategory(cat.id);
  const showActions = hoveredNodeId === cat.id || isSelected;

  const btnStyle = { padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: theme.surface, color: theme.brandHeaderBackground };
  const dangerBtnStyle = { ...btnStyle, border: `1px solid ${theme.danger}`, color: theme.danger };

  return (
    <div
      onMouseEnter={() => setHoveredNodeId(cat.id)}
      onMouseLeave={() => setHoveredNodeId(null)}
      style={{
        borderRadius: '8px',
        border: `1px solid ${isSelected ? theme.brand : theme.line}`,
        backgroundColor: isHidden ? theme.surfaceInset : (isSelected ? theme.brandSurface : theme.surface),
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
        <button
          onClick={() => setSelectedTaxonomyNode({ type: 'main', mainId: cat.id })}
          style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, textAlign: 'right' }}
        >
          {cat.subcategories.length > 0 ? (
            <span onClick={(e) => { e.stopPropagation(); toggleMainCategoryExpand(cat.id); }} style={{ fontSize: '11px', color: theme.textMuted, padding: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px' }}>
              {isCatExpanded ? '▼' : '◀'}
            </span>
          ) : <span style={{ width: '18px', display: 'inline-block' }} />}
          <WatermarkedImage src={cat.imageUri} mediaKey={cat.mediaKey} fallback={cat.emojiFallback} size={36} productName={cat.label} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: theme.brandHeaderBackground }}>{cat.label}</span>
            {cat.subtitle && <span style={{ fontSize: '10.5px', color: theme.textMuted }}>{cat.subtitle}</span>}
          </div>
          <span style={{ fontSize: '10.5px', color: theme.textMuted, marginRight: 'auto', paddingLeft: '8px' }}>{pCount} منتج</span>
        </button>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', opacity: showActions ? 1 : 0, pointerEvents: showActions ? 'auto' : 'none', transition: 'opacity 0.2s ease' }}>
          <button onClick={() => { setAddingSubUnder(cat.id); setSelectedTaxonomyNode({ type: 'main', mainId: cat.id }); setFormLabel(''); }} style={btnStyle}>+ فرعية</button>
          <button onClick={() => handleToggleCategoryHide(cat.id)} style={{ ...btnStyle, color: isHidden ? theme.warning : theme.textMuted }}>{isHidden ? '👁️ إظهار' : '🙈 إخفاء'}</button>
          <button onClick={() => handleStartCatEdit('main', cat.id)} style={btnStyle}>✏️</button>
          <button onClick={() => handleDeleteNode('main', cat.id)} style={dangerBtnStyle}>🗑️</button>
        </div>
      </div>

      {editingEntry?.type === 'main' && editingEntry.mainId === cat.id && (
        <TaxonomyInlineForm
          value={editLabel}
          subtitleValue={editSubtitle}
          onChange={setEditLabel}
          onSubtitleChange={setEditSubtitle}
          labelPlaceholder="الاسم *"
          subtitlePlaceholder="الوصف"
          onConfirm={handleApplyCatEdit}
          onCancel={() => setEditingEntry(null)}
          confirmLabel="حفظ"
          cancelLabel="إلغاء"
        />
      )}

      {addingSubUnder === cat.id && (
        <TaxonomyInlineForm
          title={`إضافة فئة فرعية لـ: ${cat.label}`}
          labelPlaceholder="اسم الفئة الفرعية *"
          subtitlePlaceholder="وصف (اختياري)"
          value={formLabel}
          subtitleValue={formSubtitle}
          onChange={setFormLabel}
          onSubtitleChange={setFormSubtitle}
          onConfirm={() => handleAddSubCategory(cat.id)}
          onCancel={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); }}
          confirmLabel="تأكيد"
        />
      )}

      {isCatExpanded && cat.subcategories.length > 0 && (
        <div style={{ borderTop: `1px solid ${theme.line}`, backgroundColor: theme.surfaceInset }}>
          {cat.subcategories.map((sub: CatalogSubCategory) => (
            <TaxonomySubCategoryNode key={sub.id} catId={cat.id} sub={sub} taxonomy={taxonomy} />
          ))}
        </div>
      )}
    </div>
  );
}
