'use client';

import React, { useState, useMemo } from 'react';
import {
  dshCatalogCategories,
  dshCatalogProducts,
  type CatalogProductMaster,
  type CatalogMainCategory,
  type CatalogSubCategory,
  type CatalogMediaPolicy,
  type CatalogApprovalStage,
} from './catalogs.data';
import {
  appendCatalogPreviewProposal,
  applyCatalogProductPreviewPatches,
  cloneCatalogCategories,
  createPreviewMainCategory,
  createPreviewMainClassification,
  createPreviewSubCategory,
  createPreviewSubClassification,
  hasDuplicateCatalogLabel,
  mergeCatalogProductPreviewPatch,
  toggleReadonlyStringSet,
  type CatalogProductPreviewPatch,
} from './catalogs.adapters';
import {
  createCatalogPreviewProposal,
  createCatalogProductPatchProposal,
  initialColumnFilters,
  type CatalogEditEntry,
  type CatalogFilterColumnId,
  type FilterType,
} from './catalogs.model';
import type { CatalogWorkspaceId, CatalogWorkspaceState, CatalogPreviewProposal } from './catalogs.model';
import { useCatalogFilteredProducts } from './catalogs.filter-products';
import { useCatalogMicroActions, type MicroAction } from './catalogs.micro-actions';

const catalogPageSize = 5;

export const PRIMARY_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'catalog', label: 'السجل الرئيسي' },
  { id: 'taxonomy', label: 'شجرة الفئات والتصنيفات' },
  { id: 'intake', label: 'الاستلام والإدخال' },
  { id: 'approvals', label: 'الاعتمادات والجودة' },
  { id: 'mapping', label: 'الربط والحوكمة' },
  { id: 'publishing', label: 'النشر والرؤية' },
];

export const SECONDARY_TABS: Record<string, { id: string; label: string }[]> = {
  all: [],
  catalog: [
    { id: 'all', label: 'الكل' },
    { id: 'master', label: 'مركزي' },
    { id: 'exceptions', label: 'استثناءات شريك' },
  ],
  taxonomy: [],
  intake: [
    { id: 'quick', label: 'إدخال سريع' },
    { id: 'partner', label: 'بوابة الشريك' },
    { id: 'field', label: 'المسح الميداني' },
  ],
  approvals: [
    { id: 'marketing', label: 'تسويق' },
    { id: 'quality', label: 'جودة' },
    { id: 'pricing', label: 'تعارض أسعار' },
    { id: 'media', label: 'صور' },
    { id: 'barcode', label: 'باركود' },
  ],
  mapping: [
    { id: 'categories', label: 'ربط الفئات' },
    { id: 'duplicates', label: 'معالجة التكرارات' },
    { id: 'media', label: 'حوكمة الميديا' },
    { id: 'gtin', label: 'GTIN' },
    { id: 'substitutions', label: 'البدائل' },
    { id: 'visibility-policy', label: 'سياسة الظهور' },
  ],
  publishing: [
    { id: 'ready', label: 'جاهز للنشر' },
    { id: 'client-visible', label: 'ظاهر للعميل' },
    { id: 'hidden', label: 'مخفي' },
    { id: 'needs-review', label: 'يحتاج مراجعة' },
  ],
};

export type { MicroAction };

export function useCatalogScreen() {
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [workspaceState, setWorkspaceState] = useState<CatalogWorkspaceState | null>(null);
  const [pendingProposals, setPendingProposals] = useState<CatalogPreviewProposal[]>([]);

  const openWorkspace = (workspace: CatalogWorkspaceId, productId?: string) => {
    setWorkspaceState({
      workspace,
      productId,
      sourceSurface: 'catalogs',
    });
  };

  const [activeMainCategory, setActiveMainCategory] = useState<CatalogMainCategory | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<CatalogSubCategory | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogPage, setCatalogPage] = useState(1);
  const [productPreviewPatches, setProductPreviewPatches] = useState<Record<string, CatalogProductPreviewPatch>>({});

  const products = useMemo(
    () => applyCatalogProductPreviewPatches(dshCatalogProducts, productPreviewPatches),
    [productPreviewPatches]
  );

  const pushPreviewProposal = React.useCallback((proposal: CatalogPreviewProposal) => {
    setPendingProposals((prev) => appendCatalogPreviewProposal(prev, proposal));
  }, []);

  const dismissPreviewProposal = React.useCallback(() => {
    setPendingProposals((prev) => prev.slice(1));
  }, []);

  const queueProductPreviewPatch = React.useCallback((
    product: CatalogProductMaster,
    patch: CatalogProductPreviewPatch,
    label: string,
    note: string,
    apiBoundary?: string,
  ) => {
    setProductPreviewPatches((prev) => mergeCatalogProductPreviewPatch(prev, product.id, patch));
    pushPreviewProposal(createCatalogProductPatchProposal({
      product,
      patchKeys: Object.keys(patch),
      label,
      note,
      apiBoundary,
    }));
    setActionMessage(label);
  }, [pushPreviewProposal]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalForm, setModalForm] = useState({
    id: '',
    name: '',
    sku: '',
    gtin: '',
    price: 10,
    mainCat: 'grocery',
    subCat: '',
    mainClassif: '',
    subClassif: '',
    mediaPolicy: 'catalog-owned-media' as CatalogMediaPolicy,
    approvalStage: 'catalog-draft' as CatalogApprovalStage,
    imageUri: '',
    mediaKey: '',
  });

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

  const [activeMainClassifId, setActiveMainClassifId] = useState<string | null>(null);
  const [activeSubClassifId, setActiveSubClassifId] = useState<string | null>(null);

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const [colFilters, setColFilters] = useState<Record<CatalogFilterColumnId, string[]>>(initialColumnFilters);
  const [openFilterCol, setOpenFilterCol] = useState<CatalogFilterColumnId | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleMainCategorySelect = (cat: CatalogMainCategory | null) => {
    setActiveMainCategory(cat);
    setActiveSubCategory(null);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
    setSelectedProductId(null);
  };

  const handleSubCategorySelect = (sub: CatalogSubCategory | null) => {
    setActiveSubCategory(sub);
    setActiveMainClassifId(null);
    setActiveSubClassifId(null);
    setSelectedProductId(null);
  };

  const effectiveCategories = useMemo(
    () => previewCategories.filter((c) => !hiddenCategoryIds.has(c.id)),
    [previewCategories, hiddenCategoryIds]
  );

  const getProductCountForCategory = React.useCallback(
    (mainId: string, subId?: string): number =>
      products.filter(
        (p) => p.categoryPath.main === mainId && (subId ? p.categoryPath.sub === subId : true)
      ).length,
    [products]
  );

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
          return {
            ...sub,
            mainClassifications: [...(sub.mainClassifications || []), createPreviewMainClassification(id, label)]
          };
        })
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
              return {
                ...mc,
                subClassifications: [...(mc.subClassifications || []), createPreviewSubClassification(id, label)]
              };
            })
          };
        })
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
            ...sub,
            mainClassifications: (sub.mainClassifications || []).filter(mc => mc.id !== mainClassifId)
          } : sub)
        } : c);
      } else {
        return prev.map(c => c.id === mainId ? {
          ...c,
          subcategories: c.subcategories.map(sub => sub.id === subId ? {
            ...sub,
            mainClassifications: (sub.mainClassifications || []).map(mc => mc.id === mainClassifId ? {
              ...mc,
              subClassifications: (mc.subClassifications || []).filter(sc => sc.id !== subClassifId)
            } : mc)
          } : sub)
        } : c);
      }
    });

    pushPreviewProposal(createCatalogPreviewProposal({
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
  }, [activeMainCategory, activeSubCategory, activeMainClassifId, activeSubClassifId, pushPreviewProposal]);

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
                )
              };
            })
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
                    )
                  };
                })
              };
            })
          };
        });
      }
    });

    if (clashing) {
      setCatError('الاسم المكتوب مكرر في هذا المستوى');
      return;
    }

    setEditingEntry(null); setEditLabel(''); setEditSubtitle(''); setCatError(null);
  }, [editingEntry, editLabel, editSubtitle]);

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) ?? null, [selectedProductId, products]);
  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useCatalogFilteredProducts({
    products, isManualOrderCategory, activeMainCategory, activeSubCategory,
    searchQuery, activeFilter, colFilters, hiddenCategoryIds, hiddenSubCategoryIds,
    activeTab, activeSubTab, activeMainClassifId, activeSubClassifId, previewCategories,
  });

  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const activeColFiltersCount = Object.values(colFilters).flat().length;
  const isCategoryMapped = useMemo(() => products.every(p => !!p.categoryPath.main), [products]);
  const isDuplicatesClean = useMemo(() => products.every(p => !p.conflictReason), [products]);
  const isMediaSatisfied = useMemo(() => products.every(p => !!p.mediaKey), [products]);
  const approvedCount = useMemo(() => products.filter(p => p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible').length, [products]);
  const totalCount = products.length;
  const catalogTotalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));

  const visibleProducts = useMemo(() => {
    const startIndex = (catalogPage - 1) * catalogPageSize;
    return filteredProducts.slice(startIndex, startIndex + catalogPageSize);
  }, [catalogPage, filteredProducts]);

  React.useEffect(() => {
    setCatalogPage(1);
  }, [activeMainCategory, activeSubCategory, activeFilter, activeTab, activeSubTab, searchQuery, colFilters]);

  React.useEffect(() => {
    setCatalogPage((currentPage) => Math.min(currentPage, catalogTotalPages));
  }, [catalogTotalPages]);

  const microActions = useCatalogMicroActions({
    activeTab, activeSubTab, filteredProducts,
    workspaceState, setWorkspaceState,
    setActionMessage, setProductPreviewPatches,
    categoryControlOpen, setCategoryControlOpen,
    addingMainCat, setAddingMainCat,
    pushPreviewProposal, handleResetCategoryPreview,
  });

  return {
    // Tab state
    activeTab, setActiveTab,
    activeSubTab, setActiveSubTab,
    // Bulk ops
    showBulkOps, setShowBulkOps,
    selectedProductIds, setSelectedProductIds,
    // Workspace
    workspaceState, setWorkspaceState, openWorkspace,
    // Proposals
    pendingProposals, pushPreviewProposal, dismissPreviewProposal,
    // Category navigation
    activeMainCategory, setActiveMainCategory,
    activeSubCategory, setActiveSubCategory,
    activeFilter, setActiveFilter,
    // Search & product selection
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    // Pagination
    catalogPage, setCatalogPage,
    catalogTotalPages,
    // Preview patches
    productPreviewPatches, setProductPreviewPatches,
    queueProductPreviewPatch,
    // Products (computed)
    products, filteredProducts, visibleProducts,
    counts, filterOptions,
    selectedProduct,
    totalCount,
    // Product modal
    showProductModal, setShowProductModal,
    modalMode, setModalMode,
    modalForm, setModalForm,
    // Category preview state
    previewCategories, setPreviewCategories,
    effectiveCategories,
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
    // Classification filters
    activeMainClassifId, setActiveMainClassifId,
    activeSubClassifId, setActiveSubClassifId,
    // Category handlers
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
    // Column filters
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    // Action feedback
    actionMessage, setActionMessage,
    // Gate computed
    isCategoryMapped, isDuplicatesClean, isMediaSatisfied, approvedCount,
    isManualOrderCategory,
    // Micro actions
    microActions,
  };
}
