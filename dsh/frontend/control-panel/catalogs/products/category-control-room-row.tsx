'use client';

import React from 'react';
import { useTheme } from '@bthwani/ui-kit';
import type { CatalogMainCategory, CatalogSubCategory } from '../catalogs.data';
import type { CatalogEditEntry } from '../catalogs.model';

// ── Shared handler contract ────────────────────────────────────────────────────

export type CategoryControlRoomRowHandlers = {
  activeSubCategory: CatalogSubCategory | null;
  hiddenSubCategoryIds: ReadonlySet<string>;
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
  setCatError: React.Dispatch<React.SetStateAction<string | null>>;
  setAddingMainCat: React.Dispatch<React.SetStateAction<boolean>>;
  handleMainCategorySelect: (cat: CatalogMainCategory | null) => void;
  handleSubCategorySelect: (sub: CatalogSubCategory | null) => void;
  handleAddSubCategory: (parentId: string) => void;
  handleAddMainClassification: (mainId: string, subId: string) => void;
  handleAddSubClassification: (mainId: string, subId: string, mainClassifId: string) => void;
  handleToggleCategoryHide: (id: string) => void;
  handleToggleSubCategoryHide: (id: string) => void;
  handleDeleteNode: (type: 'main' | 'sub' | 'mainClassif' | 'subClassif', mainId: string, subId?: string, mainClassifId?: string, subClassifId?: string) => void;
  handleStartCatEdit: (type: 'main' | 'sub' | 'mainClassif' | 'subClassif', mainId: string, subId?: string, mainClassifId?: string, subClassifId?: string) => void;
  handleApplyCatEdit: () => void;
  getProductCountForCategory: (mainId: string, subId?: string) => number;
};

// ── Shared inline input style ─────────────────────────────────────────────────

function inlineInput(theme: ReturnType<typeof useTheme>['theme'], fontSize = '11px'): React.CSSProperties {
  return { padding: '2px 6px', borderRadius: '3px', fontSize, direction: 'rtl', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none', flex: 1, minWidth: '60px' };
}

// ── SubClassifRow ─────────────────────────────────────────────────────────────

type SubClassifRowProps = {
  subc: { id: string; label: string };
  cat: CatalogMainCategory;
  sub: CatalogSubCategory;
  mainClassifId: string;
  h: CategoryControlRoomRowHandlers;
};

function SubClassifRow({ subc, cat, sub, mainClassifId, h }: SubClassifRowProps) {
  const { theme } = useTheme();
  const isEditing = h.editingEntry?.type === 'subClassif' && h.editingEntry.mainId === cat.id && h.editingEntry.subId === sub.id && h.editingEntry.mainClassifId === mainClassifId && h.editingEntry.subClassifId === subc.id;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', backgroundColor: theme.surfaceInset, borderRadius: '2px', padding: '2px' }}>
      {isEditing ? (
        <div style={{ display: 'flex', flex: 1, gap: '3px', alignItems: 'center' }}>
          <input aria-label="تعديل التصنيف الفرعي" type="text" value={h.editLabel} onChange={(e) => h.setEditLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleApplyCatEdit(); if (e.key === 'Escape') { h.setEditingEntry(null); h.setCatError(null); } }} style={inlineInput(theme, '8px')} />
          <button onClick={h.handleApplyCatEdit} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
          <button onClick={() => { h.setEditingEntry(null); h.setCatError(null); }} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ fontSize: '8px', color: theme.textMuted }}>└── 🔸</span>
            <span style={{ fontSize: '8.5px', color: theme.brandHeaderBackground }}>{subc.label}</span>
          </div>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            <button onClick={() => h.handleStartCatEdit('subClassif', cat.id, sub.id, mainClassifId, subc.id)} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
            <button onClick={() => { if (globalThis.confirm('هل أنت متأكد من حذف هذا التصنيف الفرعي؟')) h.handleDeleteNode('subClassif', cat.id, sub.id, mainClassifId, subc.id); }} style={{ padding: '0 2px', borderRadius: '2px', fontSize: '7px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── MainClassifRow ────────────────────────────────────────────────────────────

type MainClassifRowProps = {
  classif: { id: string; label: string; subClassifications?: { id: string; label: string }[] };
  cat: CatalogMainCategory;
  sub: CatalogSubCategory;
  h: CategoryControlRoomRowHandlers;
};

function MainClassifRow({ classif, cat, sub, h }: MainClassifRowProps) {
  const { theme } = useTheme();
  const isEditing = h.editingEntry?.type === 'mainClassif' && h.editingEntry.mainId === cat.id && h.editingEntry.subId === sub.id && h.editingEntry.mainClassifId === classif.id;
  const isAddingSubClassif = h.addingSubClassifUnder?.mainId === cat.id && h.addingSubClassifUnder?.subId === sub.id && h.addingSubClassifUnder?.mainClassifId === classif.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: theme.surface, borderRadius: '3px', padding: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flex: 1, gap: '4px', alignItems: 'center' }}>
            <input aria-label="تعديل التصنيف الرئيسي" type="text" value={h.editLabel} onChange={(e) => h.setEditLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleApplyCatEdit(); if (e.key === 'Escape') { h.setEditingEntry(null); h.setCatError(null); } }} style={inlineInput(theme, '9px')} />
            <button onClick={h.handleApplyCatEdit} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
            <button onClick={() => { h.setEditingEntry(null); h.setCatError(null); }} style={{ padding: '1px 5px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
              <span style={{ fontSize: '9px', color: theme.textMuted }}>├── 🔹</span>
              <span style={{ fontSize: '9.5px', fontWeight: 600, color: theme.brandHeaderBackground }}>{classif.label}</span>
            </div>
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button onClick={() => { h.setAddingSubClassifUnder(isAddingSubClassif ? null : { mainId: cat.id, subId: sub.id, mainClassifId: classif.id }); h.setFormLabel(''); h.setCatError(null); h.setEditingEntry(null); h.setAddingMainCat(false); h.setAddingSubUnder(null); h.setAddingMainClassifUnder(null); }} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingSubClassif ? theme.brandSurface : 'transparent', color: isAddingSubClassif ? theme.brand : theme.textMuted }}>+ تصنيف فرعي</button>
              <button onClick={() => h.handleStartCatEdit('mainClassif', cat.id, sub.id, classif.id)} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
              <button onClick={() => { if (globalThis.confirm('هل أنت متأكد من حذف هذا التصنيف الرئيسي وتصنيفاته الفرعية؟')) h.handleDeleteNode('mainClassif', cat.id, sub.id, classif.id); }} style={{ padding: '1px 3px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
            </div>
          </>
        )}
      </div>

      {isAddingSubClassif && (
        <div style={{ margin: '3px 16px 3px 3px', padding: '4px', borderRadius: '2px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontSize: '7.5px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف فرعي جديد تحت: {classif.label}</span>
          <input aria-label="اسم التصنيف الفرعي" type="text" placeholder="اسم التصنيف الفرعي *" value={h.formLabel} onChange={(e) => h.setFormLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleAddSubClassification(cat.id, sub.id, classif.id); if (e.key === 'Escape') { h.setAddingSubClassifUnder(null); h.setCatError(null); } }} style={{ padding: '1px 4px', borderRadius: '2px', fontSize: '8.5px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
          <div style={{ display: 'flex', gap: '3px' }}>
            <button onClick={() => h.handleAddSubClassification(cat.id, sub.id, classif.id)} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => { h.setAddingSubClassifUnder(null); h.setFormLabel(''); h.setCatError(null); }} style={{ padding: '1px 6px', borderRadius: '2px', fontSize: '7.5px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {classif.subClassifications && classif.subClassifications.length > 0 && (
        <div style={{ margin: '2px 2px 2px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {classif.subClassifications.map((subc) => (
            <SubClassifRow key={subc.id} subc={subc} cat={cat} sub={sub} mainClassifId={classif.id} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── SubCategoryRow ────────────────────────────────────────────────────────────

type SubCategoryRowProps = {
  sub: CatalogSubCategory;
  cat: CatalogMainCategory;
  h: CategoryControlRoomRowHandlers;
};

function SubCategoryRow({ sub, cat, h }: SubCategoryRowProps) {
  const { theme } = useTheme();
  const isSelectedSub = h.activeSubCategory?.id === sub.id;
  const isSubHidden = h.hiddenSubCategoryIds.has(sub.id);
  const isEditingThisSub = h.editingEntry?.type === 'sub' && h.editingEntry.mainId === cat.id && h.editingEntry.subId === sub.id;
  const isAddingClassifThisSub = h.addingMainClassifUnder?.mainId === cat.id && h.addingMainClassifUnder?.subId === sub.id;

  return (
    <div style={{ borderRadius: '4px', border: `1px solid ${isSelectedSub ? theme.brand : 'transparent'}`, backgroundColor: isSubHidden ? theme.surfaceInset : (isSelectedSub ? theme.brandSurface : theme.surfaceInset), opacity: isSubHidden ? 0.6 : 1, overflow: 'hidden', padding: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
        {isEditingThisSub ? (
          <div style={{ display: 'flex', flex: 1, gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input aria-label="تعديل الفئة الفرعية" type="text" value={h.editLabel} onChange={(e) => h.setEditLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleApplyCatEdit(); if (e.key === 'Escape') { h.setEditingEntry(null); h.setCatError(null); } }} style={inlineInput(theme, '10px')} />
            <input aria-label="وصف الفئة الفرعية" type="text" value={h.editSubtitle} onChange={(e) => h.setEditSubtitle(e.target.value)} placeholder="وصف" style={inlineInput(theme, '10px')} />
            <button onClick={h.handleApplyCatEdit} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
            <button onClick={() => { h.setEditingEntry(null); h.setCatError(null); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        ) : (
          <>
            <button onClick={() => { h.handleSubCategorySelect(isSelectedSub ? null : sub); if (!isSelectedSub) h.handleMainCategorySelect(cat); }} style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>└── 📂</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px', fontWeight: isSelectedSub ? 700 : 600, color: isSelectedSub ? theme.brand : theme.brandHeaderBackground }}>{sub.label}</span>
                {sub.subtitle && <span style={{ fontSize: '8px', color: theme.textMuted }}>{sub.subtitle}</span>}
              </div>
              <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto' }}>{h.getProductCountForCategory(cat.id, sub.id)}</span>
            </button>
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button onClick={() => { h.setAddingMainClassifUnder(isAddingClassifThisSub ? null : { mainId: cat.id, subId: sub.id }); h.setFormLabel(''); h.setFormSubtitle(''); h.setCatError(null); h.setEditingEntry(null); h.setAddingMainCat(false); h.setAddingSubUnder(null); h.setAddingSubClassifUnder(null); }} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: isAddingClassifThisSub ? theme.brandSurface : 'transparent', color: isAddingClassifThisSub ? theme.brand : theme.textMuted }}>+ تصنيف رئيسي</button>
              <button onClick={() => h.handleStartCatEdit('sub', cat.id, sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
              <button onClick={() => h.handleToggleSubCategoryHide(sub.id)} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${isSubHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isSubHidden ? theme.success : theme.textMuted }}>{isSubHidden ? 'استعادة' : 'إخفاء'}</button>
              <button onClick={() => { if (globalThis.confirm('هل أنت متأكد من حذف هذه الفئة الفرعية وتصنيفاتها؟')) h.handleDeleteNode('sub', cat.id, sub.id); }} style={{ padding: '1px 4px', borderRadius: '3px', fontSize: '8px', border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
            </div>
          </>
        )}
      </div>

      {isAddingClassifThisSub && (
        <div style={{ margin: '4px 12px 4px 4px', padding: '5px', borderRadius: '3px', backgroundColor: theme.surface, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, color: theme.brand }}>إضافة تصنيف رئيسي جديد تحت: {sub.label}</span>
          <input aria-label="اسم التصنيف الرئيسي" type="text" placeholder="اسم التصنيف الرئيسي *" value={h.formLabel} onChange={(e) => h.setFormLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleAddMainClassification(cat.id, sub.id); if (e.key === 'Escape') { h.setAddingMainClassifUnder(null); h.setCatError(null); } }} style={{ padding: '2px 5px', borderRadius: '2px', fontSize: '9px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => h.handleAddMainClassification(cat.id, sub.id)} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => { h.setAddingMainClassifUnder(null); h.setFormLabel(''); h.setCatError(null); }} style={{ padding: '1px 8px', borderRadius: '2px', fontSize: '8px', border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {sub.mainClassifications && sub.mainClassifications.length > 0 && (
        <div style={{ margin: '4px 4px 2px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {sub.mainClassifications.map((classif) => (
            <MainClassifRow key={classif.id} classif={classif} cat={cat} sub={sub} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── CategoryControlRoomRow ────────────────────────────────────────────────────

type CategoryControlRoomRowProps = {
  cat: CatalogMainCategory;
  isHidden: boolean;
  isSelectedMain: boolean;
  handlers: CategoryControlRoomRowHandlers;
};

export function CategoryControlRoomRow({ cat, isHidden, isSelectedMain, handlers: h }: CategoryControlRoomRowProps) {
  const { theme } = useTheme();
  const productCount = h.getProductCountForCategory(cat.id);
  const isEditingThis = h.editingEntry?.type === 'main' && h.editingEntry.mainId === cat.id;

  return (
    <div style={{ borderRadius: '6px', border: `1px solid ${isSelectedMain ? theme.brand : theme.line}`, backgroundColor: isHidden ? theme.surfaceInset : (isSelectedMain ? theme.brandSurface : theme.surface), opacity: isHidden ? 0.6 : 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', gap: '6px' }}>
        {isEditingThis ? (
          <div style={{ display: 'flex', flex: 1, gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input aria-label="تعديل الفئة الرئيسية" type="text" value={h.editLabel} onChange={(e) => h.setEditLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleApplyCatEdit(); if (e.key === 'Escape') { h.setEditingEntry(null); h.setCatError(null); } }} style={inlineInput(theme)} />
            <input aria-label="وصف الفئة الرئيسية" type="text" value={h.editSubtitle} onChange={(e) => h.setEditSubtitle(e.target.value)} placeholder="وصف" style={inlineInput(theme)} />
            <button onClick={h.handleApplyCatEdit} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>حفظ</button>
            <button onClick={() => { h.setEditingEntry(null); h.setCatError(null); }} style={{ padding: '2px 8px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        ) : (
          <>
            <button onClick={() => h.handleMainCategorySelect(isSelectedMain ? null : cat)} style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, textAlign: 'right' }}>
              <span style={{ fontSize: '13px' }}>{cat.emojiFallback}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isSelectedMain ? theme.brand : theme.brandHeaderBackground }}>{cat.label}</span>
                {cat.subtitle && <span style={{ fontSize: '9px', color: theme.textMuted }}>{cat.subtitle}</span>}
              </div>
              <span style={{ fontSize: '9px', color: theme.textMuted, marginRight: 'auto', paddingRight: '4px' }}>{productCount} منتج</span>
            </button>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
              <button onClick={() => { h.setAddingSubUnder(h.addingSubUnder === cat.id ? null : cat.id); h.setFormLabel(''); h.setFormSubtitle(''); h.setCatError(null); h.setEditingEntry(null); h.setAddingMainCat(false); h.setAddingMainClassifUnder(null); h.setAddingSubClassifUnder(null); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: h.addingSubUnder === cat.id ? theme.brandSurface : 'transparent', color: h.addingSubUnder === cat.id ? theme.brand : theme.textMuted }}>+ فرعية</button>
              <button onClick={() => h.handleStartCatEdit('main', cat.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.textMuted }}>تعديل</button>
              <button onClick={() => h.handleToggleCategoryHide(cat.id)} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${isHidden ? theme.success : theme.line}`, cursor: 'pointer', backgroundColor: 'transparent', color: isHidden ? theme.success : theme.textMuted }}>{isHidden ? 'استعادة' : 'إخفاء'}</button>
              <button onClick={() => { if (globalThis.confirm('هل أنت متأكد من حذف هذه الفئة وجميع فئاتها وتصنيفاتها الفرعية؟')) h.handleDeleteNode('main', cat.id); }} style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.danger}`, cursor: 'pointer', backgroundColor: 'transparent', color: theme.danger }}>حذف</button>
            </div>
          </>
        )}
      </div>

      {h.addingSubUnder === cat.id && (
        <div style={{ margin: '0 8px 6px 8px', padding: '6px 8px', borderRadius: '4px', backgroundColor: theme.surfaceInset, border: `1px solid ${theme.brand}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: theme.brand }}>إضافة فئة فرعية تحت: {cat.label}</span>
          <input aria-label="اسم الفئة الفرعية" type="text" placeholder="اسم الفئة الفرعية *" value={h.formLabel} onChange={(e) => h.setFormLabel(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') h.handleAddSubCategory(cat.id); if (e.key === 'Escape') { h.setAddingSubUnder(null); h.setCatError(null); } }} style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
          <input aria-label="وصف الفئة الفرعية" type="text" placeholder="وصف (اختياري)" value={h.formSubtitle} onChange={(e) => h.setFormSubtitle(e.target.value)} style={{ padding: '3px 7px', borderRadius: '3px', fontSize: '10px', direction: 'rtl', textAlign: 'right', border: `1px solid ${theme.lineStrong}`, backgroundColor: theme.surface, color: theme.brandHeaderBackground, outline: 'none' }} />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => h.handleAddSubCategory(cat.id)} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: 'none', backgroundColor: theme.brand, color: theme.textInverse, cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => { h.setAddingSubUnder(null); h.setFormLabel(''); h.setFormSubtitle(''); h.setCatError(null); }} style={{ padding: '2px 10px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, border: `1px solid ${theme.lineStrong}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {cat.subcategories.length > 0 && (
        <div style={{ margin: '0 8px 6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {cat.subcategories.map((sub) => (
            <SubCategoryRow key={sub.id} sub={sub} cat={cat} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}
