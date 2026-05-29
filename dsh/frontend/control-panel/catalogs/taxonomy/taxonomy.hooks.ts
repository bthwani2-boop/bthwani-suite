'use client';

import React, { useState, useMemo } from 'react';
import {
  dshCatalogCategories,
  dshCatalogProducts,
  type CatalogMainCategory,
  type CatalogSubCategory,
} from '../catalogs.data';
import {
  cloneCatalogCategories,
  createPreviewMainCategory,
  createPreviewMainClassification,
  createPreviewSubCategory,
  createPreviewSubClassification,
  filterCategoryTree,
  hasDuplicateCatalogLabel,
  toggleReadonlyStringSet,
} from '../catalogs.adapters';
import {
  createCatalogPreviewProposal,
  type CatalogEditEntry,
  type CatalogTaxonomyNodeRef,
  type CatalogPreviewProposal,
} from '../catalogs.model';

export type UseTaxonomyScreenParams = {
  onPushProposal: (p: CatalogPreviewProposal) => void;
};

export function useTaxonomyScreen({ onPushProposal }: UseTaxonomyScreenParams) {
  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeMainClassifId, setActiveMainClassifId] = useState<string | null>(null);
  const [activeSubClassifId, setActiveSubClassifId] = useState<string | null>(null);

  const [previewCategories, setPreviewCategories] = useState<CatalogMainCategory[]>(
    () => cloneCatalogCategories(dshCatalogCategories)
  );
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [hiddenSubCategoryIds, setHiddenSubCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [categoryControlOpen, setCategoryControlOpen] = useState(false);
  const [addingMainCat, setAddingMainCat] = useState(false);
  const [addingSubUnder, setAddingSubUnder] = useState<string | null>(null);
  const [addingMainClassifUnder, setAddingMainClassifUnder] = useState<{ mainId: string; subId: string } | null>(null);
  const [addingSubClassifUnder, setAddingSubClassifUnder] = useState<{ mainId: string; subId: string; mainClassifId: string } | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [catError, setCatError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<CatalogEditEntry | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [selectedTaxonomyNode, setSelectedTaxonomyNode] = useState<CatalogTaxonomyNodeRef | null>(null);
  const [expandedMainCategoryIds, setExpandedMainCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedSubCategoryIds, setExpandedSubCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedMainClassifIds, setExpandedMainClassifIds] = useState<ReadonlySet<string>>(new Set());
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const filteredCategories = useMemo(
    () => filterCategoryTree(previewCategories, treeSearchQuery),
    [previewCategories, treeSearchQuery]
  );

  const effectiveCategories = useMemo(
    () => previewCategories.filter((c) => !hiddenCategoryIds.has(c.id)),
    [previewCategories, hiddenCategoryIds]
  );

  const getProductCountForCategory = React.useCallback(
    (mainId: string, subId?: string): number => {
      return dshCatalogProducts.filter(
        (p) => p.categoryPath.main === mainId && (subId ? p.categoryPath.sub === subId : true)
      ).length;
    },
    []
  );

  const toggleMainCategoryExpand = (id: string) => {
    setExpandedMainCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSubCategoryExpand = (id: string) => {
    setExpandedSubCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleMainClassifExpand = (id: string) => {
    setExpandedMainClassifIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
  };

  const handleSubCategorySelect = (sub: CatalogSubCategory | null) => {
    setActiveSubCategory(sub);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
  };

  const handleAddMainCategory = React.useCallback(() => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    if (hasDuplicateCatalogLabel(label, previewCategories)) { setCatError('هذا الاسم موجود مسبقاً'); return; }
    const id = `cat-preview-${label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const newCat = createPreviewMainCategory(id, label, formSubtitle.trim());
    setPreviewCategories((prev) => [...prev, newCat]);
    setFormLabel(''); setFormSubtitle(''); setAddingMainCat(false); setCatError(null);
  }, [formLabel, formSubtitle, previewCategories]);

  const handleAddSubCategory = React.useCallback((parentId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    const parentCat = previewCategories.find(c => c.id === parentId);
    if (parentCat && hasDuplicateCatalogLabel(label, parentCat.subcategories)) {
      setCatError('اسم مكرر في هذه الفئة الفرعية'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== parentId) return cat;
      const id = `subcat-preview-${label.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      return { ...cat, subcategories: [...cat.subcategories, createPreviewSubCategory(id, label, formSubtitle.trim())] };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingSubUnder(null); setCatError(null);
  }, [formLabel, formSubtitle, previewCategories]);

  const handleAddMainClassification = React.useCallback((mainId: string, subId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    const parentCat = previewCategories.find(c => c.id === mainId);
    const parentSub = parentCat?.subcategories.find(s => s.id === subId);
    if (parentSub && hasDuplicateCatalogLabel(label, parentSub.mainClassifications || [])) {
      setCatError('اسم تصنيف رئيسي مكرر في هذه الفئة الفرعية'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== mainId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          const id = `classif-main-${subId}-${Date.now()}`;
          return { ...sub, mainClassifications: [...(sub.mainClassifications || []), createPreviewMainClassification(id, label)] };
        }),
      };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingMainClassifUnder(null); setCatError(null);
  }, [formLabel, previewCategories]);

  const handleAddSubClassification = React.useCallback((mainId: string, subId: string, mainClassifId: string) => {
    const label = formLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }
    const parentCat = previewCategories.find(c => c.id === mainId);
    const parentSub = parentCat?.subcategories.find(s => s.id === subId);
    const parentClassif = parentSub?.mainClassifications?.find(c => c.id === mainClassifId);
    if (parentClassif && hasDuplicateCatalogLabel(label, parentClassif.subClassifications || [])) {
      setCatError('اسم تصنيف فرعي مكرر في هذا التصنيف الرئيسي'); return;
    }
    setPreviewCategories((prev) => prev.map((cat) => {
      if (cat.id !== mainId) return cat;
      return {
        ...cat,
        subcategories: cat.subcategories.map(sub => {
          if (sub.id !== subId) return sub;
          return {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).map(mc => {
              if (mc.id !== mainClassifId) return mc;
              const id = `classif-sub-${mainClassifId}-${Date.now()}`;
              return { ...mc, subClassifications: [...(mc.subClassifications || []), createPreviewSubClassification(id, label)] };
            }),
          };
        }),
      };
    }));
    setFormLabel(''); setFormSubtitle(''); setAddingSubClassifUnder(null); setCatError(null);
  }, [formLabel, previewCategories]);

  const handleToggleCategoryHide = React.useCallback((id: string) => {
    setHiddenCategoryIds((prev) => toggleReadonlyStringSet(prev, id));
  }, []);

  const handleToggleSubCategoryHide = React.useCallback((id: string) => {
    setHiddenSubCategoryIds((prev) => toggleReadonlyStringSet(prev, id));
  }, []);

  const handleDeleteNode = React.useCallback((
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif',
    mainId: string,
    subId?: string,
    mainClassifId?: string,
    subClassifId?: string
  ) => {
    setPreviewCategories((prev) => {
      if (type === 'main') {
        return prev.filter(c => c.id !== mainId);
      } else if (type === 'sub') {
        return prev.map(c => c.id === mainId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c);
      } else if (type === 'mainClassif') {
        return prev.map(c => c.id === mainId ? {
          ...c,
          subcategories: c.subcategories.map(sub => sub.id === subId ? {
            ...sub, mainClassifications: (sub.mainClassifications || []).filter(mc => mc.id !== mainClassifId)
          } : sub),
        } : c);
      } else {
        return prev.map(c => c.id === mainId ? {
          ...c,
          subcategories: c.subcategories.map(sub => sub.id === subId ? {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).map(mc => mc.id === mainClassifId ? {
              ...mc, subClassifications: (mc.subClassifications || []).filter(sc => sc.id !== subClassifId)
            } : mc),
          } : sub),
        } : c);
      }
    });

    onPushProposal(createCatalogPreviewProposal({
      type: 'taxonomy-mapping',
      label: 'تم تسجيل تعديل شجرة الفئات كمعاينة',
      status: 'ready-for-api',
      note: `حذف ${type} ضمن شجرة الفئات. لم يتم تعديل بيانات المنتجات المركزية؛ يحتاج API لتحديث الروابط المتأثرة.`,
      apiBoundary: 'PATCH /catalog/taxonomy',
    }));

    if (type === 'main' && activeMainCategory?.id === mainId) {
      setActiveMainCategory(null);
      setActiveSubCategory(null);
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'sub' && activeSubCategory?.id === subId) {
      setActiveSubCategory(null);
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'mainClassif' && activeMainClassifId === mainClassifId) {
      setActiveMainClassifId(null);
      setActiveSubClassifId(null);
    } else if (type === 'subClassif' && activeSubClassifId === subClassifId) {
      setActiveSubClassifId(null);
    }

    setEditingEntry(null);
    setCatError(null);
  }, [activeMainCategory, activeSubCategory, activeMainClassifId, activeSubClassifId, onPushProposal]);

  const handleResetCategoryPreview = React.useCallback(() => {
    setPreviewCategories(cloneCatalogCategories(dshCatalogCategories));
    setHiddenCategoryIds(new Set());
    setHiddenSubCategoryIds(new Set());
    setAddingMainCat(false);
    setAddingSubUnder(null);
    setAddingMainClassifUnder(null);
    setAddingSubClassifUnder(null);
    setFormLabel('');
    setFormSubtitle('');
    setCatError(null);
    setEditingEntry(null);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
  }, []);

  const handleStartCatEdit = React.useCallback((
    type: 'main' | 'sub' | 'mainClassif' | 'subClassif',
    mainId: string,
    subId?: string,
    mainClassifId?: string,
    subClassifId?: string
  ) => {
    const cat = previewCategories.find((c) => c.id === mainId);
    if (!cat) return;
    if (type === 'main') {
      setEditLabel(cat.label);
      setEditSubtitle(cat.subtitle);
    } else if (type === 'sub') {
      const sub = cat.subcategories.find((s) => s.id === subId);
      if (!sub) return;
      setEditLabel(sub.label);
      setEditSubtitle(sub.subtitle);
    } else if (type === 'mainClassif') {
      const sub = cat.subcategories.find((s) => s.id === subId);
      const classif = sub?.mainClassifications?.find(c => c.id === mainClassifId);
      if (!classif) return;
      setEditLabel(classif.label);
      setEditSubtitle('');
    } else {
      const sub = cat.subcategories.find((s) => s.id === subId);
      const classif = sub?.mainClassifications?.find(c => c.id === mainClassifId);
      const subc = classif?.subClassifications?.find(s => s.id === subClassifId);
      if (!subc) return;
      setEditLabel(subc.label);
      setEditSubtitle('');
    }
    setEditingEntry({ type, mainId, subId, mainClassifId, subClassifId });
    setCatError(null);
    setAddingMainCat(false);
    setAddingSubUnder(null);
    setAddingMainClassifUnder(null);
    setAddingSubClassifUnder(null);
  }, [previewCategories]);

  const handleApplyCatEdit = React.useCallback(() => {
    if (!editingEntry) return;
    const label = editLabel.trim();
    if (!label) { setCatError('الاسم مطلوب'); return; }

    let clashing = false;

    setPreviewCategories((prev) => {
      if (editingEntry.type === 'main') {
        if (prev.some((c) => c.id !== editingEntry.mainId && c.label.trim().toLowerCase() === label.toLowerCase())) {
          clashing = true; return prev;
        }
        return prev.map((c) => c.id === editingEntry.mainId ? { ...c, label, subtitle: editSubtitle.trim() } : c);
      } else if (editingEntry.type === 'sub') {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          if (cat.subcategories.some((s) => s.id !== editingEntry.subId && s.label.trim().toLowerCase() === label.toLowerCase())) {
            clashing = true; return cat;
          }
          return {
            ...cat,
            subcategories: cat.subcategories.map((s) =>
              s.id === editingEntry.subId ? { ...s, label, subtitle: editSubtitle.trim() } : s
            ),
          };
        });
      } else if (editingEntry.type === 'mainClassif') {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id !== editingEntry.subId) return sub;
              if ((sub.mainClassifications || []).some(mc => mc.id !== editingEntry.mainClassifId && mc.label.trim().toLowerCase() === label.toLowerCase())) {
                clashing = true; return sub;
              }
              return {
                ...sub,
                mainClassifications: (sub.mainClassifications || []).map(mc =>
                  mc.id === editingEntry.mainClassifId ? { ...mc, label } : mc
                ),
              };
            }),
          };
        });
      } else {
        return prev.map((cat) => {
          if (cat.id !== editingEntry.mainId) return cat;
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id !== editingEntry.subId) return sub;
              return {
                ...sub,
                mainClassifications: (sub.mainClassifications || []).map(mc => {
                  if (mc.id !== editingEntry.mainClassifId) return mc;
                  if ((mc.subClassifications || []).some(sc => sc.id !== editingEntry.subClassifId && sc.label.trim().toLowerCase() === label.toLowerCase())) {
                    clashing = true; return mc;
                  }
                  return {
                    ...mc,
                    subClassifications: (mc.subClassifications || []).map(sc =>
                      sc.id === editingEntry.subClassifId ? { ...sc, label } : sc
                    ),
                  };
                }),
              };
            }),
          };
        });
      }
    });

    if (clashing) { setCatError('الاسم المكتوب مكرر في هذا المستوى'); return; }
    setEditingEntry(null); setEditLabel(''); setEditSubtitle(''); setCatError(null);
  }, [editingEntry, editLabel, editSubtitle]);

  return {
    activeMainCategory, setActiveMainCategory,
    activeSubCategory, setActiveSubCategory,
    activeMainClassifId, setActiveMainClassifId,
    activeSubClassifId, setActiveSubClassifId,
    previewCategories, setPreviewCategories,
    effectiveCategories,
    filteredCategories,
    hiddenCategoryIds, setHiddenCategoryIds,
    hiddenSubCategoryIds, setHiddenSubCategoryIds,
    categoryControlOpen, setCategoryControlOpen,
    addingMainCat, setAddingMainCat,
    addingSubUnder, setAddingSubUnder,
    addingMainClassifUnder, setAddingMainClassifUnder,
    addingSubClassifUnder, setAddingSubClassifUnder,
    formLabel, setFormLabel,
    formSubtitle, setFormSubtitle,
    catError, setCatError,
    editingEntry, setEditingEntry,
    editLabel, setEditLabel,
    editSubtitle, setEditSubtitle,
    selectedTaxonomyNode, setSelectedTaxonomyNode,
    expandedMainCategoryIds, setExpandedMainCategoryIds,
    expandedSubCategoryIds, setExpandedSubCategoryIds,
    expandedMainClassifIds, setExpandedMainClassifIds,
    treeSearchQuery, setTreeSearchQuery,
    hoveredNodeId, setHoveredNodeId,
    toggleMainCategoryExpand,
    toggleSubCategoryExpand,
    toggleMainClassifExpand,
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
  };
}
