'use client';

import React from 'react';
import { Text, useTheme } from '@bthwani/ui-kit';
import type { CatalogMainCategory, CatalogSubCategory } from '../catalogs.data';
import type { CatalogEditEntry } from '../catalogs.model';

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
  categoryControlOpen,
  setCategoryControlOpen,
  previewCategories,
  hiddenCategoryIds,
  hiddenSubCategoryIds,
  activeMainCategory,
  activeSubCategory,
  catError,
  setCatError,
  addingMainCat,
  setAddingMainCat,
  addingSubUnder,
  setAddingSubUnder,
  addingMainClassifUnder,
  setAddingMainClassifUnder,
  addingSubClassifUnder,
  setAddingSubClassifUnder,
  formLabel,
  setFormLabel,
  formSubtitle,
  setFormSubtitle,
  editingEntry,
  setEditingEntry,
  editLabel,
  setEditLabel,
  editSubtitle,
  setEditSubtitle,
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
}: CategoryControlRoomProps) {
  const { theme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.surface, borderBottom: `1px solid ${theme.line}`, flexShrink: 0 }}>
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
          <span style={{ fontSize: '10px', fontWeight: 800, color: categoryControlOpen ? theme.brand : theme.textMuted }}>🏷️ إدارة الفئات</span>
          <span style={{ fontSize: '9px', color: theme.warning, fontWeight: 700 }}>• معاينة فقط — لا حفظ دائم</span>
          <span style={{ fontSize: '9px', color: theme.textMuted }}>({previewCategories.length} فئة • {hiddenCategoryIds.size > 0 ? `${hiddenCategoryIds.size} مخفي` : 'لا مخفي'})</span>
        </div>
        <span style={{ fontSize: '9px', color: theme.textMuted }}>{categoryControlOpen ? '▲' : '▼'}</span>
      </button>

      {categoryControlOpen && (
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>

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

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setAddingMainCat(true); setAddingSubUnder(null); setEditingEntry(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }}
              aria-label="إضافة فئة رئيسية"
              style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, cursor: 'pointer', backgroundColor: theme.brandSurface, color: theme.brand }}
            >+ فئة رئيسية</button>
            <button
              onClick={handleResetCategoryPreview}
              aria-label="إعادة ضبط المعاينة"
              style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}
            >↺ إعادة ضبط المعاينة</button>
          </div>

          {addingMainCat && (
            <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: theme.brand }}>إضافة فئة رئيسية جديدة</span>
              <input
                aria-label="اسم الفئة الرئيسية"
                type="text" placeholder="اسم الفئة *" value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddMainCategory(); if (e.key === 'Escape') { setAddingMainCat(false); setCatError(null); } }}
                autoFocus
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
              />
              <input
                aria-label="وصف الفئة الرئيسية"
                type="text" placeholder="وصف مختصر (اختياري)" value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleAddMainCategory} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.brand}`, backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>تأكيد</button>
                <button onClick={() => { setAddingMainCat(false); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '3px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
              </div>
            </div>
          )}

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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', gap: '6px' }}>
                    {isEditingThis ? (
                      <div style={{ display: 'flex', flex: 1, gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          aria-label="تعديل اسم الفئة الرئيسية"
                          type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                          autoFocus
                          style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '80px' }}
                        />
                        <input
                          aria-label="تعديل وصف الفئة الرئيسية"
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
                          <button onClick={() => handleStartCatEdit('main', cat.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
                          <button onClick={() => handleToggleCategoryHide(cat.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}>{isHidden ? 'استعادة' : 'إخفاء'}</button>
                          <button onClick={() => { if (confirm('هل أنت متأكد من حذف هذه الفئة وجميع فئاتها وتصنيفاتها الفرعية؟')) handleDeleteNode('main', cat.id); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
                        </div>
                      </>
                    )}
                  </div>

                  {addingSubUnder === cat.id && (
                    <div style={{ margin: '0 8px 6px 8px', padding: '6px 8px', borderRadius: '4px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
                      <input aria-label="اسم الفئة الفرعية" type="text" placeholder="اسم الفئة الفرعية *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(cat.id); if (e.key === 'Escape') { setAddingSubUnder(null); setCatError(null); } }}
                        autoFocus
                        style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                      />
                      <input aria-label="وصف الفئة الفرعية" type="text" placeholder="وصف (اختياري)" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)}
                        style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleAddSubCategory(cat.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
                        <button onClick={() => { setAddingSubUnder(null); setFormLabel(''); setFormSubtitle(''); setCatError(null); }} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
                      </div>
                    </div>
                  )}

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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              {isEditingThisSub ? (
                                <div style={{ display: 'flex', flex: 1, gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <input aria-label="تعديل اسم الفئة الفرعية" type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCatEdit(); if (e.key === 'Escape') { setEditingEntry(null); setCatError(null); } }}
                                    autoFocus
                                    style={{ padding: '2px 5px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', border: `1px solid ${theme.brand}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' }}
                                  />
                                  <input aria-label="تعديل وصف الفئة الفرعية" type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="وصف"
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

                            {isAddingClassifThisSub && (
                              <div style={{ margin: '4px 12px 4px 4px', padding: '5px', borderRadius: '3px', backgroundColor: theme.surface, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '8px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
                                <input aria-label="اسم التصنيف الرئيسي" type="text" placeholder="اسم التصنيف الرئيسي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
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

                            {sub.mainClassifications && sub.mainClassifications.length > 0 && (
                              <div style={{ margin: '4px 4px 2px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {sub.mainClassifications.map((classif) => {
                                  const isEditingThisClassif = editingEntry?.type === 'mainClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id;
                                  const isAddingSubClassif = addingSubClassifUnder?.mainId === cat.id && addingSubClassifUnder?.subId === sub.id && addingSubClassifUnder?.mainClassifId === classif.id;

                                  return (
                                    <div key={classif.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: theme.surface, borderRadius: '3px', padding: '3px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                        {isEditingThisClassif ? (
                                          <div style={{ display: 'flex', flex: 1, gap: '4px', alignItems: 'center' }}>
                                            <input aria-label="تعديل اسم التصنيف الرئيسي" type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
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

                                      {isAddingSubClassif && (
                                        <div style={{ margin: '3px 16px 3px 3px', padding: '4px', borderRadius: '2px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                          <span style={{ fontSize: '7.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
                                          <input aria-label="اسم التصنيف الفرعي" type="text" placeholder="اسم التصنيف الفرعي *" value={formLabel} onChange={(e) => setFormLabel(e.target.value)}
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

                                      {classif.subClassifications && classif.subClassifications.length > 0 && (
                                        <div style={{ margin: '2px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                          {classif.subClassifications.map((subc) => {
                                            const isEditingThisSubClassif = editingEntry?.type === 'subClassif' && editingEntry.mainId === cat.id && editingEntry.subId === sub.id && editingEntry.mainClassifId === classif.id && editingEntry.subClassifId === subc.id;

                                            return (
                                              <div key={subc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', backgroundColor: theme.surfaceInset, borderRadius: '2px', padding: '2px' }}>
                                                {isEditingThisSubClassif ? (
                                                  <div style={{ display: 'flex', flex: 1, gap: '3px', alignItems: 'center' }}>
                                                    <input aria-label="تعديل اسم التصنيف الفرعي" type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
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
  );
}
