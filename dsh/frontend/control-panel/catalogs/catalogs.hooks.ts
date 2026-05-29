'use client';

import React, { useState, useMemo } from 'react';
import {
  dshCatalogProducts,
  type CatalogMediaPolicy,
  type CatalogApprovalStage,
  type CatalogProductMaster,
} from './catalogs.data';
import {
  applyCatalogProductPreviewPatches,
  appendCatalogPreviewProposal,
  mergeCatalogProductPreviewPatch,
  type CatalogProductPreviewPatch,
} from './catalogs.adapters';
import {
  createCatalogProductPatchProposal,
  initialColumnFilters ,
  type CatalogFilterColumnId,
  type FilterType,
} from './catalogs.model';
import type { CatalogWorkspaceId, CatalogWorkspaceState, CatalogPreviewProposal } from './catalogs.model';
import { useCatalogFilteredProducts } from './catalogs.filter-products';
import { useCatalogMicroActions, type MicroAction } from './catalogs.micro-actions';
import { useCatalogCategoryState } from './catalogs.category-state';

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
    setWorkspaceState({ workspace, productId, sourceSurface: 'catalogs' });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogPage, setCatalogPage] = useState(1);
  const [productPreviewPatches, setProductPreviewPatches] = useState<Record<string, CatalogProductPreviewPatch>>({});

  const [actionMessage, setActionMessage] = useState<string | null>(null);

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

  const [colFilters, setColFilters] = useState<Record<CatalogFilterColumnId, string[]>>(initialColumnFilters);
  const [openFilterCol, setOpenFilterCol] = useState<CatalogFilterColumnId | null>(null);

  const pushPreviewProposal = React.useCallback((proposal: CatalogPreviewProposal) => {
    setPendingProposals((prev) => appendCatalogPreviewProposal(prev, proposal));
  }, []);

  const dismissPreviewProposal = React.useCallback(() => {
    setPendingProposals((prev) => prev.slice(1));
  }, []);

  const products = useMemo(
    () => applyCatalogProductPreviewPatches(dshCatalogProducts, productPreviewPatches),
    [productPreviewPatches]
  );

  // Category state extracted — delegates to focused hook
  const categoryState = useCatalogCategoryState({ pushPreviewProposal, products });

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

  React.useEffect(() => {
    if (SECONDARY_TABS[activeTab]?.length > 0) {
      setActiveSubTab(SECONDARY_TABS[activeTab][0].id);
    } else {
      setActiveSubTab('');
    }
  }, [activeTab]);

  const { filteredProducts, counts, filterOptions } = useCatalogFilteredProducts({
    products,
    isManualOrderCategory: categoryState.activeMainCategory?.categoryMode === 'manual-order',
    activeMainCategory: categoryState.activeMainCategory,
    activeSubCategory: categoryState.activeSubCategory,
    searchQuery, activeFilter, colFilters,
    hiddenCategoryIds: categoryState.hiddenCategoryIds,
    hiddenSubCategoryIds: categoryState.hiddenSubCategoryIds,
    activeTab, activeSubTab,
    activeMainClassifId: categoryState.activeMainClassifId,
    activeSubClassifId: categoryState.activeSubClassifId,
    previewCategories: categoryState.previewCategories,
  });

  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    globalThis.addEventListener('click', handleClick);
    return () => globalThis.removeEventListener('click', handleClick);
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

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) ?? null, [selectedProductId, products]);

  React.useEffect(() => { setCatalogPage(1); }, [
    categoryState.activeMainCategory, categoryState.activeSubCategory,
    activeFilter, activeTab, activeSubTab, searchQuery, colFilters,
  ]);

  React.useEffect(() => {
    setCatalogPage((currentPage) => Math.min(currentPage, catalogTotalPages));
  }, [catalogTotalPages]);

  const microActions = useCatalogMicroActions({
    activeTab, activeSubTab, filteredProducts,
    workspaceState, setWorkspaceState,
    setActionMessage, setProductPreviewPatches,
    categoryControlOpen: categoryState.categoryControlOpen,
    setCategoryControlOpen: categoryState.setCategoryControlOpen,
    addingMainCat: categoryState.addingMainCat,
    setAddingMainCat: categoryState.setAddingMainCat,
    pushPreviewProposal,
    handleResetCategoryPreview: categoryState.handleResetCategoryPreview,
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
    // Search & filter
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    // Product selection
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
    // Column filters
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    // Action feedback
    actionMessage, setActionMessage,
    // Gate computed
    isCategoryMapped, isDuplicatesClean, isMediaSatisfied, approvedCount,
    isManualOrderCategory: categoryState.activeMainCategory?.categoryMode === 'manual-order',
    // Micro actions
    microActions,
    // Category state (spread for screen compatibility)
    ...categoryState,
  };
}
