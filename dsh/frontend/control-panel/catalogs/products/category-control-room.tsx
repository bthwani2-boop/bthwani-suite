'use client';

import React from 'react';
import { useTheme } from '@bthwani/ui-kit';
import type { CatalogMainCategory, CatalogSubCategory } from '../catalogs.data';
import type { CatalogEditEntry } from '../catalogs.model';
import { CategoryControlRoomRow, type CategoryControlRoomRowHandlers } from './category-control-room-row';

export type CategoryControlRoomProps = {
  categoryControlOpen: boolean;
  setCategoryControlOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewCategories: CatalogMainCategory[];
  hiddenCategoryIds: ReadonlySet<string>;
  hiddenSubCategoryIds: ReadonlySet<string>;
  activeMainCategory: CatalogMainCategory | null;
  activeSubCategory: CatalogSubCategory | null;
  catError: string | null;
  setCatError: React.Dispatch<React.SetStateAction<string | null>>;
  addingMainCat: boolean;
  setAddingMainCat: React.Dispatch<React.SetStateAction<boolean>>;
  addingSubUnder: string | null;
  setAddingSubUnder: React.Dispatch<React.SetStateAction<string | null>>;
  addingMainClassifUnder: { mainId: string; subId: string } | null;
  setAddingMainClassifUnder: React.Dispatch<React.SetStateAction<{ mainId: string; subId: string } | null>>;
  addingSubClassifUnder: { mainId: string; subId: string; mainClassifId: string } | null;
  setAddingSubClassifUnder: React.Dispatch<React.SetStateAction<{ mainId: string; subId: string; mainClassifId: string } | null>>;
  formLabel: string;
  setFormLabel: React.Dispatch<React.SetStateAction<string>>;
  formSubtitle: string;
  setFormSubtitle: React.Dispatch<React.SetStateAction<string>>;
  editingEntry: CatalogEditEntry | null;
  setEditingEntry: React.Dispatch<React.SetStateAction<CatalogEditEntry | null>>;
  editLabel: string;
  setEditLabel: React.Dispatch<React.SetStateAction<string>>;
  editSubtitle: string;
  setEditSubtitle: React.Dispatch<React.SetStateAction<string>>;
  handleMainCategorySelect: (cat: CatalogMainCategory | null) => void;
  handleSubCategorySelect: (sub: CatalogSubCategory | null) => void;
  handleAddMainCategory: () => void;
  handleAddSubCategory: (parentId: string) => void;
  handleAddMainClassification: (mainId: string, subId: string) => void;
  handleAddSubClassification: (mainId: string, subId: string, mainClassifId: string) => void;
  handleToggleCategoryHide: (id: string) => void;
  handleToggleSubCategoryHide: (id: string) => void;
  handleDeleteNode: (type: 'main' | 'sub' | 'mainClassif' | 'subClassif', mainId: string, subId?: string, mainClassifId?: string, subClassifId?: string) => void;
  handleResetCategoryPreview: () => void;
  handleStartCatEdit: (type: 'main' | 'sub' | 'mainClassif' | 'subClassif', mainId: string, subId?: string, mainClassifId?: string, subClassifId?: string) => void;
  handleApplyCatEdit: () => void;
  getProductCountForCategory: (mainId: string, subId?: string) => number;
};

export function CategoryControlRoom({
  categoryControlOpen, setCategoryControlOpen,
  previewCategories, hiddenCategoryIds, hiddenSubCategoryIds,
  activeMainCategory, activeSubCategory,
  catError, setCatError,
  addingMainCat, setAddingMainCat,
  addingSubUnder, setAddingSubUnder,
  addingMainClassifUnder, setAddingMainClassifUnder,
  addingSubClassifUnder, setAddingSubClassifUnder,
  formLabel, setFormLabel, formSubtitle, setFormSubtitle,
  editingEntry, setEditingEntry, editLabel, setEditLabel, editSubtitle, setEditSubtitle,
  handleMainCategorySelect, handleSubCategorySelect,
  handleAddMainCategory, handleAddSubCategory,
  handleAddMainClassification, handleAddSubClassification,
  handleToggleCategoryHide, handleToggleSubCategoryHide,
  handleDeleteNode, handleResetCategoryPreview,
  handleStartCatEdit, handleApplyCatEdit, getProductCountForCategory,
}: CategoryControlRoomProps) {
  const { theme } = useTheme();

  const rowHandlers: CategoryControlRoomRowHandlers = {
    activeSubCategory, hiddenSubCategoryIds,
    addingSubUnder, setAddingSubUnder,
    addingMainClassifUnder, setAddingMainClassifUnder,
    addingSubClassifUnder, setAddingSubClassifUnder,
    formLabel, setFormLabel, formSubtitle, setFormSubtitle,
    editingEntry, setEditingEntry, editLabel, setEditLabel, editSubtitle, setEditSubtitle,
    setCatError, setAddingMainCat,
    handleMainCategorySelect, handleSubCategorySelect,
    handleAddSubCategory, handleAddMainClassification, handleAddSubClassification,
    handleToggleCategoryHide, handleToggleSubCategoryHide, handleDeleteNode,
    handleStartCatEdit, handleApplyCatEdit, getProductCountForCategory,
  };

  return (
    <div style={{ backgroundColor: theme.surface, display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0, minHeight: 0 }}>
      <button
        onClick={() => setCategoryControlOpen((v) => !v)}
        aria-label="تبديل وضع إدارة الفئات"
        style={{ width: '100%', appearance: 'none', border: 'none', backgroundColor: categoryControlOpen ? theme.brandSurface : theme.surfaceInset, borderBottom: `1px solid ${theme.line}`, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: theme.brand }}>🏷️ هيكل الفئات والتصنيفات</span>
          <span style={{ fontSize: '9px', color: theme.warning, fontWeight: 700 }}>• معاينة</span>
          <span style={{ fontSize: '9px', color: theme.textMuted }}>({previewCategories.length} فئة • {hiddenCategoryIds.size > 0 ? `${hiddenCategoryIds.size} مخفي` : 'نشط'})</span>
        </div>
        <span style={{ fontSize: '9px', color: theme.textMuted }}>{categoryControlOpen ? '▲' : '▼'}</span>
      </button>

      {categoryControlOpen && (
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
          {catError && (
            <div style={{ padding: '6px 10px', borderRadius: '4px', backgroundColor: theme.dangerSurface ?? theme.surfaceInset, border: `1px solid ${theme.danger}`, fontSize: '10px', color: theme.danger, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{catError}</span>
              <button onClick={() => setCatError(null)} style={{ appearance: 'none', border: 'none', background: 'none', color: theme.danger, cursor: 'pointer', fontSize: '10px', fontWeight: 900 }}>×</button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setAddingMainCat(true); setAddingSubUnder(null); setEditingEntry(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} aria-label="إضافة فئة رئيسية" style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, cursor: 'pointer', backgroundColor: theme.brandSurface, color: theme.brand }}>+ فئة رئيسية</button>
            <button onClick={handleResetCategoryPreview} aria-label="إعادة ضبط المعاينة" style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>↺ إعادة ضبط المعاينة</button>
          </div>

          {addingMainCat && (
            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</span>
              <input aria-label="اسم الفئة الرئيسية" type="text" placeholder="اسم الفئة *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') { setAddingMainCat(false); setCatError(null); } }} autoFocus style={{ padding: '6px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
              <input aria-label="وصف الفئة الرئيسية" type="text" placeholder="وصف مختصر (اختياري)" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleAddMainCategory} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {previewCategories.map((cat) => (
              <CategoryControlRoomRow
                key={cat.id}
                cat={cat}
                isHidden={hiddenCategoryIds.has(cat.id)}
                isSelectedMain={activeMainCategory?.id === cat.id}
                handlers={rowHandlers}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
