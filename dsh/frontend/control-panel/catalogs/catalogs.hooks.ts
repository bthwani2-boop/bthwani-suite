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

export type MicroAction = { id: string; label: string; isActive: boolean; onAction: () => void };

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
  const [modalForm, setModalForm] = useState<
    Record<'id' | 'name', string> & {
      sku: string;
      gtin: string;
      price: number;
      mainCat: string;
      subCat: string;
      mainClassif: string;
      subClassif: string;
      mediaPolicy: CatalogMediaPolicy;
      approvalStage: CatalogApprovalStage;
      imageUri: string;
      mediaKey: string;
    }
  >({
    id: '',
    name: '',
    sku: '',
    gtin: '',
    price: 10,
    mainCat: 'grocery',
    subCat: '',
    mainClassif: '',
    subClassif: '',
    mediaPolicy: 'catalog-owned-media',
    approvalStage: 'catalog-draft',
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

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    if (isManualOrderCategory) {
      const emptyFilteredProducts: CatalogProductMaster[] = [];
      return {
        filteredProducts: emptyFilteredProducts,
        counts: {
          'all': 0, 'active': 0, 'review': 0, 'conflict': 0, 'master': 0, 'partner': 0, 'needs-link': 0, 'needs-image': 0
        },
        filterOptions: {
          ...initialColumnFilters
        }
      };
    }

    let productsList = products.filter(p => {
      if (hiddenCategoryIds.has(p.categoryPath.main) && !(activeTab === 'mapping' && activeSubTab === 'categories')) {
        return false;
      }
      if (p.categoryPath.sub && hiddenSubCategoryIds.has(p.categoryPath.sub) && !(activeTab === 'mapping' && activeSubTab === 'categories')) {
        return false;
      }
      if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
      if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;
      if (activeMainClassifId && p.categoryPath.mainClassification !== activeMainClassifId) return false;
      if (activeSubClassifId && p.categoryPath.subClassification !== activeSubClassifId) return false;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.gtin && p.gtin.includes(searchLower)) ||
        (p.barcode && p.barcode.includes(searchLower));

      return matchesSearch;
    });

    if (activeTab === 'catalog') {
      if (activeSubTab === 'master') {
        productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
      } else if (activeSubTab === 'exceptions') {
        productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
      }
    } else if (activeTab === 'intake') {
      if (activeSubTab === 'quick') {
        productsList = productsList.filter(p => p.sourceSurface === 'catalog' || p.sourceSurface === 'client');
      } else if (activeSubTab === 'partner') {
        productsList = productsList.filter(p => p.sourceSurface === 'partner');
      } else if (activeSubTab === 'field') {
        productsList = productsList.filter(p => p.sourceSurface === 'field');
      }
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        productsList = productsList.filter(p => p.approvalStage === 'marketing-review');
      } else if (activeSubTab === 'quality') {
        productsList = productsList.filter(p => p.approvalStage === 'partner-review');
      } else if (activeSubTab === 'pricing') {
        productsList = productsList.filter(p => p.price > 100);
      } else if (activeSubTab === 'media') {
        productsList = productsList.filter(p => p.mediaPolicy === 'partner-proposed-review' || p.mediaPolicy === 'marketing-enhancement-required' || !p.mediaKey);
      } else if (activeSubTab === 'barcode') {
        productsList = productsList.filter(p => !p.gtin || !!p.conflictReason);
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'duplicates') {
        productsList = productsList.filter(p => !!p.conflictReason);
      } else if (activeSubTab === 'gtin') {
        productsList = productsList.filter(p => !p.gtin);
      } else if (activeSubTab === 'media') {
        productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception' || p.mediaPolicy === 'catalog-owned-media' || !p.mediaKey);
      } else if (activeSubTab === 'categories') {
        productsList = productsList.filter(p => !!p.categoryPath.main);
      } else if (activeSubTab === 'substitutions') {
        productsList = productsList.filter(p => p.categoryPath.main === 'restaurants');
      } else if (activeSubTab === 'visibility-policy') {
        productsList = productsList.filter(p => p.surfaces.includes('client'));
      }
    } else if (activeTab === 'publishing') {
      if (activeSubTab === 'ready') {
        productsList = productsList.filter(p => p.approvalStage === 'catalog-adopted');
      } else if (activeSubTab === 'client-visible') {
        productsList = productsList.filter(p => p.approvalStage === 'client-visible');
      } else if (activeSubTab === 'hidden') {
        productsList = productsList.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed');
      } else if (activeSubTab === 'needs-review') {
        productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
      }
    }

    const dynamicCounts = {
      'all': productsList.length,
      'active': productsList.filter(p => p.approvalStage === 'client-visible').length,
      'review': productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review').length,
      'conflict': productsList.filter(p => !!p.conflictReason).length,
      'master': productsList.filter(p => p.mediaPolicy === 'catalog-owned-media').length,
      'partner': productsList.filter(p => p.mediaPolicy === 'partner-owned-exception').length,
      'needs-link': productsList.filter(p => !p.gtin).length,
      'needs-image': productsList.filter(p => !p.mediaKey).length,
    };

    if (activeFilter === 'active') {
      productsList = productsList.filter(p => p.approvalStage === 'client-visible');
    } else if (activeFilter === 'review') {
      productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
    } else if (activeFilter === 'conflict') {
      productsList = productsList.filter(p => !!p.conflictReason);
    } else if (activeFilter === 'master') {
      productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
    } else if (activeFilter === 'partner') {
      productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
    } else if (activeFilter === 'needs-link') {
      productsList = productsList.filter(p => !p.gtin);
    } else if (activeFilter === 'needs-image') {
      productsList = productsList.filter(p => !p.mediaKey);
    }

    const getCatName = (id: string) => previewCategories.find(c => c.id === id)?.label || dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';
    const getClassifName = (p: CatalogProductMaster) => {
      if (!p.categoryPath.mainClassification) return 'عام';
      const mainCat = previewCategories.find(c => c.id === p.categoryPath.main);
      const sub = mainCat?.subcategories?.find(s => s.id === p.categoryPath.sub);
      const classif = sub?.mainClassifications?.find(c => c.id === p.categoryPath.mainClassification);
      return classif?.label || p.categoryPath.mainClassification;
    };

    if (colFilters.name.length > 0) productsList = productsList.filter(p => colFilters.name.includes(p.name));
    if (colFilters.category.length > 0) productsList = productsList.filter(p => colFilters.category.includes(getCatName(p.categoryPath.main)));
    if (colFilters.classification.length > 0) productsList = productsList.filter(p => colFilters.classification.includes(getClassifName(p)));
    if (colFilters.sku.length > 0) productsList = productsList.filter(p => colFilters.sku.includes(p.sku));
    if (colFilters.price.length > 0) productsList = productsList.filter(p => colFilters.price.includes(p.price.toString()));
    if (colFilters.policy.length > 0) productsList = productsList.filter(p => colFilters.policy.includes(p.mediaPolicy));
    if (colFilters.status.length > 0) productsList = productsList.filter(p => colFilters.status.includes(p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'));
    if (colFilters.source.length > 0) productsList = productsList.filter(p => colFilters.source.includes(p.sourceSurface || 'catalog'));

    const builtFilterOptions = {
      name: Array.from(new Set(productsList.map(p => p.name))),
      category: Array.from(new Set(productsList.map(p => getCatName(p.categoryPath.main)))),
      classification: Array.from(new Set(productsList.map(p => getClassifName(p)))),
      sku: Array.from(new Set(productsList.map(p => p.sku))),
      price: Array.from(new Set(productsList.map(p => p.price.toString()))),
      policy: Array.from(new Set(productsList.map(p => p.mediaPolicy))),
      status: Array.from(new Set(productsList.map(p => p.conflictReason ? 'تعارض' : p.approvalStage === 'client-visible' ? 'نشط' : 'مراجعة'))),
      source: Array.from(new Set(productsList.map(p => p.sourceSurface || 'catalog'))),
      categoryMode: ['catalog-based', 'manual-order']
    };

    return { filteredProducts: productsList, counts: dynamicCounts, filterOptions: builtFilterOptions };
  }, [products, isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters, hiddenCategoryIds, hiddenSubCategoryIds, activeTab, activeSubTab, activeMainClassifId, activeSubClassifId, previewCategories]);

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

  const microActions = useMemo((): MicroAction[] => {
    const actions: MicroAction[] = [];

    if (activeTab === 'catalog') {
      actions.push(
        {
          id: 'ma-cat-add-item',
          label: '➕ إدخال سريع (مسودة)',
          isActive: workspaceState?.workspace === 'quick-entry-drafts',
          onAction: () => {
            setWorkspaceState({ workspace: 'quick-entry-drafts', sourceSurface: 'catalogs', reason: 'add-product' });
          }
        },
        {
          id: 'ma-cat-toggle-policy',
          label: '🔄 تبديل سياسة صور المجموعة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-media-policy-${Date.now()}`,
              type: 'media-policy-change',
              label: 'تبديل سياسة صور المجموعة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تبديل سياسة الصور للمنتجات المحددة في الجدول',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        },
        {
          id: 'ma-cat-reset',
          label: '↺ إعادة ضبط الكتالوج',
          isActive: false,
          onAction: () => {
            setProductPreviewPatches({});
            setActionMessage('تمت إعادة الكتالوج لحالة المصدر الأولية');
          }
        }
      );
    } else if (activeTab === 'intake') {
      actions.push(
        {
          id: 'ma-intake-adopt-all',
          label: '✅ اعتماد مقترحات الشركاء',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.approvalStage === 'partner-proposed' || p.sourceSurface === 'partner').map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-adopt-${Date.now()}`,
              type: 'bulk-approve',
              label: 'اعتماد مقترحات الشركاء',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | اعتماد مقترحات الشركاء المحددة ونقلها لمرحلة الجاهزية',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        }
      );
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        actions.push({
          id: 'ma-appr-marketing-approve-all',
          label: '📢 اعتماد كل مراجعات التسويق',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.approvalStage === 'marketing-review').map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-mkt-approve-${Date.now()}`,
              type: 'bulk-approve',
              label: 'اعتماد كل مراجعات التسويق',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | اعتماد مراجعات التسويق المحددة بنجاح',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'quality') {
        actions.push({
          id: 'ma-appr-quality-pass-all',
          label: '🛡️ تمرير جميع فحوصات الجودة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.approvalStage === 'partner-review').map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-quality-${Date.now()}`,
              type: 'bulk-approve',
              label: 'تمرير جميع فحوصات الجودة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تمرير فحوصات الجودة لمنتجات الشركاء بنجاح',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'pricing') {
        actions.push({
          id: 'ma-appr-pricing-resolve',
          label: '💸 تسوية تعارض الأسعار تلقائياً',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.price > 100).map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-price-${Date.now()}`,
              type: 'price-change',
              label: 'تسوية تعارض الأسعار تلقائياً',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | خفض وتعديل الأسعار المرتفعة وتسوية تعارض التسعير',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-assign-central',
          label: '📸 تعيين صور مركزية معتمدة',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => !p.mediaKey).map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-media-assign-${Date.now()}`,
              type: 'media-policy-change',
              label: 'تعيين صور مركزية معتمدة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعيين صورة مركزية افتراضية للمنتجات التي تنقصها صور',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'barcode') {
        actions.push({
          id: 'ma-barcode-generate-gtin',
          label: '🏷️ حوكمة الهوية والباركود',
          isActive: workspaceState?.workspace === 'identity-governance',
          onAction: () => {
            setWorkspaceState({ workspace: 'identity-governance', sourceSurface: 'catalogs', reason: 'barcode-governance' });
            setActionMessage('افتح Identity Governance Workspace لإدارة GTIN/SKU — لا توليد عشوائي');
          }
        });
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'categories') {
        actions.push(
          { id: 'ma-cat-manage', label: '🏷️ فتح/إغلاق لوحة الفئات', isActive: categoryControlOpen, onAction: () => setCategoryControlOpen((v) => !v) },
          { id: 'ma-cat-add-main', label: '➕ إضافة فئة رئيسية', isActive: addingMainCat, onAction: () => { setAddingMainCat(true); setCategoryControlOpen(true); } },
          { id: 'ma-cat-reset-all', label: '↺ إعادة ضبط شجرة الفئات', isActive: false, onAction: () => handleResetCategoryPreview() }
        );
      } else if (activeSubTab === 'duplicates') {
        actions.push({
          id: 'ma-dup-resolve-all',
          label: '🔗 دمج وحل جميع التكرارات',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-dup-${Date.now()}`,
              type: 'conflict-resolution',
              label: 'دمج وحل جميع التكرارات',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | دمج التكرارات وحل النزاعات للمنتجات المحددة',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'gtin') {
        actions.push({
          id: 'ma-gtin-sync',
          label: '🔄 مزامنة الباركود مع المعرف',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => !p.gtin).map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-gtin-${Date.now()}`,
              type: 'edit-product',
              label: 'مزامنة الباركود مع المعرف',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعيين GTIN بالاعتماد على SKU للمنتجات المحددة',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-policy-strict',
          label: '📸 فرض سياسة الصور المركزية',
          isActive: false,
          onAction: () => {
            setActionMessage('معاينة محلية فقط / preview-only: تم فرض سياسة الصور المركزية للمنتجات المؤهلة');
          }
        });
      } else if (activeSubTab === 'substitutions') {
        actions.push({
          id: 'ma-sub-set-strict',
          label: '🔒 تطبيق سياسة بدائل صارمة',
          isActive: false,
          onAction: () => {
            setActionMessage('تم تطبيق سياسة بدائل صارمة بنجاح عبر الكتالوج');
          }
        });
      } else if (activeSubTab === 'visibility-policy') {
        actions.push({
          id: 'ma-vis-toggle-client',
          label: '👁️ تبديل الظهور للمستهلكين',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-vis-${Date.now()}`,
              type: 'visibility-change',
              label: 'تبديل الظهور للمستهلكين',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعديل منصات العرض المتاحة للمنتجات المحددة',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        });
      }
    } else if (activeTab === 'publishing') {
      actions.push(
        {
          id: 'ma-pub-publish-ready',
          label: '🚀 نشر جميع المنتجات الجاهزة للعميل',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.approvalStage === 'catalog-adopted').map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-pub-${Date.now()}`,
              type: 'visibility-change',
              label: 'نشر جميع المنتجات الجاهزة للعميل',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | نشر جميع المنتجات الجاهزة بنجاح للعميل',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        },
        {
          id: 'ma-pub-hide-drafts',
          label: '🙈 إخفاء جميع المسودات والمقترحات',
          isActive: false,
          onAction: () => {
            const productIds = filteredProducts.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed').map(f => f.id);
            const proposal: CatalogPreviewProposal = {
              id: `prop-hide-${Date.now()}`,
              type: 'visibility-change',
              label: 'إخفاء جميع المسودات والمقترحات',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | التأكد من إخفاء جميع المسودات ومقترحات الشركاء',
              productIds
            };
            pushPreviewProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          }
        }
      );
    }
    return actions;
  }, [activeTab, activeSubTab, activeFilter, showBulkOps, filteredProducts, previewCategories, activeMainCategory, categoryControlOpen, addingMainCat, showProductModal, modalMode, workspaceState, pushPreviewProposal, handleResetCategoryPreview]);

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
