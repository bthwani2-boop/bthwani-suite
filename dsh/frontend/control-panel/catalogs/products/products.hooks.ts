'use client';

import React, { useState, useMemo } from 'react';
import {
  dshCatalogProducts,
  type CatalogProductMaster,
  type CatalogMainCategory,
  type CatalogSubCategory,
  type CatalogMediaPolicy,
  type CatalogApprovalStage,
} from '../catalogs.data';
import {
  appendCatalogPreviewProposal,
  applyCatalogProductPreviewPatches,
  mergeCatalogProductPreviewPatch,
  type CatalogProductPreviewPatch,
} from '../catalogs.adapters';
import {
  createCatalogProductPatchProposal,
  initialColumnFilters,
  type CatalogFilterColumnId,
  type FilterType,
  type CatalogPreviewProposal,
  type CatalogWorkspaceState,
} from '../catalogs.model';

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

const catalogPageSize = 5;

export type MicroAction = { id: string; label: string; isActive: boolean; onAction: () => void };

export type UseProductsScreenParams = {
  activeTab: string;
  activeSubTab: string;
  activeMainCategory: CatalogMainCategory | null;
  activeSubCategory: CatalogSubCategory | null;
  activeMainClassifId: string | null;
  activeSubClassifId: string | null;
  hiddenCategoryIds: ReadonlySet<string>;
  hiddenSubCategoryIds: ReadonlySet<string>;
  previewCategories: CatalogMainCategory[];
  categoryControlOpen: boolean;
  setCategoryControlOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addingMainCat: boolean;
  setAddingMainCat: React.Dispatch<React.SetStateAction<boolean>>;
  handleResetCategoryPreview: () => void;
  workspaceState: CatalogWorkspaceState | null;
  setWorkspaceState: React.Dispatch<React.SetStateAction<CatalogWorkspaceState | null>>;
  onPushProposal: (p: CatalogPreviewProposal) => void;
};

export function useProductsScreen(params: UseProductsScreenParams) {
  const {
    activeTab, activeSubTab,
    activeMainCategory, activeSubCategory,
    activeMainClassifId, activeSubClassifId,
    hiddenCategoryIds, hiddenSubCategoryIds,
    previewCategories,
    categoryControlOpen, setCategoryControlOpen,
    addingMainCat, setAddingMainCat,
    handleResetCategoryPreview,
    workspaceState, setWorkspaceState,
    onPushProposal,
  } = params;

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [catalogPage, setCatalogPage] = useState(1);
  const [productPreviewPatches, setProductPreviewPatches] = useState<Record<string, CatalogProductPreviewPatch>>({});
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
  const [showBulkOps, setShowBulkOps] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [colFilters, setColFilters] = useState<Record<CatalogFilterColumnId, string[]>>(initialColumnFilters);
  const [openFilterCol, setOpenFilterCol] = useState<CatalogFilterColumnId | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const products = useMemo(
    () => applyCatalogProductPreviewPatches(dshCatalogProducts, productPreviewPatches),
    [productPreviewPatches]
  );

  const pushPreviewProposal = React.useCallback((proposal: CatalogPreviewProposal) => {
    onPushProposal(appendCatalogPreviewProposal([], proposal)[0]);
  }, [onPushProposal]);

  const queueProductPreviewPatch = React.useCallback((
    product: CatalogProductMaster,
    patch: CatalogProductPreviewPatch,
    label: string,
    note: string,
    apiBoundary?: string,
  ) => {
    setProductPreviewPatches((prev) => mergeCatalogProductPreviewPatch(prev, product.id, patch));
    onPushProposal(createCatalogProductPatchProposal({
      product,
      patchKeys: Object.keys(patch),
      label,
      note,
      apiBoundary,
    }));
    setActionMessage(label);
  }, [onPushProposal]);

  React.useEffect(() => {
    setSelectedProductId(null);
  }, [activeMainCategory, activeSubCategory]);

  React.useEffect(() => {
    setCatalogPage(1);
  }, [activeMainCategory, activeSubCategory, activeFilter, activeTab, activeSubTab, searchQuery, colFilters]);

  React.useEffect(() => {
    const handleClick = () => setOpenFilterCol(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const isManualOrderCategory = activeMainCategory?.categoryMode === 'manual-order';

  const { filteredProducts, counts, filterOptions } = useMemo(() => {
    if (isManualOrderCategory) {
      return {
        filteredProducts: [] as CatalogProductMaster[],
        counts: { 'all': 0, 'active': 0, 'review': 0, 'conflict': 0, 'master': 0, 'partner': 0, 'needs-link': 0, 'needs-image': 0 },
        filterOptions: { ...initialColumnFilters },
      };
    }

    let productsList = products.filter(p => {
      if (hiddenCategoryIds.has(p.categoryPath.main) && !(activeTab === 'mapping' && activeSubTab === 'categories')) return false;
      if (p.categoryPath.sub && hiddenSubCategoryIds.has(p.categoryPath.sub) && !(activeTab === 'mapping' && activeSubTab === 'categories')) return false;
      if (activeMainCategory && p.categoryPath.main !== activeMainCategory.id) return false;
      if (activeSubCategory && p.categoryPath.sub !== activeSubCategory.id) return false;
      if (activeMainClassifId && p.categoryPath.mainClassification !== activeMainClassifId) return false;
      if (activeSubClassifId && p.categoryPath.subClassification !== activeSubClassifId) return false;
      const searchLower = searchQuery.toLowerCase();
      return !searchQuery ||
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.gtin && p.gtin.includes(searchLower)) ||
        (p.barcode && p.barcode.includes(searchLower));
    });

    if (activeTab === 'catalog') {
      if (activeSubTab === 'master') productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
      else if (activeSubTab === 'exceptions') productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
    } else if (activeTab === 'intake') {
      if (activeSubTab === 'quick') productsList = productsList.filter(p => p.sourceSurface === 'catalog' || p.sourceSurface === 'client');
      else if (activeSubTab === 'partner') productsList = productsList.filter(p => p.sourceSurface === 'partner');
      else if (activeSubTab === 'field') productsList = productsList.filter(p => p.sourceSurface === 'field');
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') productsList = productsList.filter(p => p.approvalStage === 'marketing-review');
      else if (activeSubTab === 'quality') productsList = productsList.filter(p => p.approvalStage === 'partner-review');
      else if (activeSubTab === 'pricing') productsList = productsList.filter(p => p.price > 100);
      else if (activeSubTab === 'media') productsList = productsList.filter(p => p.mediaPolicy === 'partner-proposed-review' || p.mediaPolicy === 'marketing-enhancement-required' || !p.mediaKey);
      else if (activeSubTab === 'barcode') productsList = productsList.filter(p => !p.gtin || !!p.conflictReason);
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'duplicates') productsList = productsList.filter(p => !!p.conflictReason);
      else if (activeSubTab === 'gtin') productsList = productsList.filter(p => !p.gtin);
      else if (activeSubTab === 'media') productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception' || p.mediaPolicy === 'catalog-owned-media' || !p.mediaKey);
      else if (activeSubTab === 'categories') productsList = productsList.filter(p => !!p.categoryPath.main);
      else if (activeSubTab === 'substitutions') productsList = productsList.filter(p => p.categoryPath.main === 'restaurants');
      else if (activeSubTab === 'visibility-policy') productsList = productsList.filter(p => p.surfaces.includes('client'));
    } else if (activeTab === 'publishing') {
      if (activeSubTab === 'ready') productsList = productsList.filter(p => p.approvalStage === 'catalog-adopted');
      else if (activeSubTab === 'client-visible') productsList = productsList.filter(p => p.approvalStage === 'client-visible');
      else if (activeSubTab === 'hidden') productsList = productsList.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed');
      else if (activeSubTab === 'needs-review') productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
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

    if (activeFilter === 'active') productsList = productsList.filter(p => p.approvalStage === 'client-visible');
    else if (activeFilter === 'review') productsList = productsList.filter(p => p.approvalStage === 'marketing-review' || p.approvalStage === 'partner-review');
    else if (activeFilter === 'conflict') productsList = productsList.filter(p => !!p.conflictReason);
    else if (activeFilter === 'master') productsList = productsList.filter(p => p.mediaPolicy === 'catalog-owned-media');
    else if (activeFilter === 'partner') productsList = productsList.filter(p => p.mediaPolicy === 'partner-owned-exception');
    else if (activeFilter === 'needs-link') productsList = productsList.filter(p => !p.gtin);
    else if (activeFilter === 'needs-image') productsList = productsList.filter(p => !p.mediaKey);

    const getCatName = (id: string) =>
      previewCategories.find(c => c.id === id)?.label || 'غير معروف';
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
      categoryMode: ['catalog-based', 'manual-order'],
    };

    return { filteredProducts: productsList, counts: dynamicCounts, filterOptions: builtFilterOptions };
  }, [products, isManualOrderCategory, activeMainCategory, activeSubCategory, searchQuery, activeFilter, colFilters, hiddenCategoryIds, hiddenSubCategoryIds, activeTab, activeSubTab, activeMainClassifId, activeSubClassifId, previewCategories]);

  const catalogTotalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogPageSize));

  React.useEffect(() => {
    setCatalogPage((p) => Math.min(p, catalogTotalPages));
  }, [catalogTotalPages]);

  const visibleProducts = useMemo(() => {
    const startIndex = (catalogPage - 1) * catalogPageSize;
    return filteredProducts.slice(startIndex, startIndex + catalogPageSize);
  }, [catalogPage, filteredProducts]);

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId) ?? null, [selectedProductId, products]);
  const activeColFiltersCount = Object.values(colFilters).flat().length;
  const isCategoryMapped = useMemo(() => products.every(p => !!p.categoryPath.main), [products]);
  const isDuplicatesClean = useMemo(() => products.every(p => !p.conflictReason), [products]);
  const isMediaSatisfied = useMemo(() => products.every(p => !!p.mediaKey), [products]);
  const approvedCount = useMemo(() => products.filter(p => p.approvalStage === 'catalog-adopted' || p.approvalStage === 'client-visible').length, [products]);
  const totalCount = products.length;

  const microActions = useMemo((): MicroAction[] => {
    const actions: MicroAction[] = [];

    if (activeTab === 'catalog') {
      actions.push(
        {
          id: 'ma-cat-add-item',
          label: '➕ إدخال سريع (مسودة)',
          isActive: workspaceState?.workspace === 'quick-entry-drafts',
          onAction: () => setWorkspaceState({ workspace: 'quick-entry-drafts', sourceSurface: 'catalogs', reason: 'add-product' }),
        },
        {
          id: 'ma-cat-toggle-policy',
          label: '🔄 تبديل سياسة صور المجموعة',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-media-policy-${Date.now()}`,
              type: 'media-policy-change',
              label: 'تبديل سياسة صور المجموعة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تبديل سياسة الصور للمنتجات المحددة في الجدول',
              productIds: filteredProducts.map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        },
        {
          id: 'ma-cat-reset',
          label: '↺ إعادة ضبط الكتالوج',
          isActive: false,
          onAction: () => {
            setProductPreviewPatches({});
            setActionMessage('تمت إعادة الكتالوج لحالة المصدر الأولية');
          },
        },
      );
    } else if (activeTab === 'intake') {
      actions.push({
        id: 'ma-intake-adopt-all',
        label: '✅ اعتماد مقترحات الشركاء',
        isActive: false,
        onAction: () => {
          const proposal: CatalogPreviewProposal = {
            id: `prop-adopt-${Date.now()}`,
            type: 'bulk-approve',
            label: 'اعتماد مقترحات الشركاء',
            status: 'ready-for-api',
            owner: 'control-panel-catalogs',
            note: 'UI_PREVIEW_ONLY | اعتماد مقترحات الشركاء المحددة ونقلها لمرحلة الجاهزية',
            productIds: filteredProducts.filter(p => p.approvalStage === 'partner-proposed' || p.sourceSurface === 'partner').map(f => f.id),
          };
          onPushProposal(proposal);
          setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
        },
      });
    } else if (activeTab === 'approvals') {
      if (activeSubTab === 'marketing') {
        actions.push({
          id: 'ma-appr-marketing-approve-all',
          label: '📢 اعتماد كل مراجعات التسويق',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-mkt-approve-${Date.now()}`,
              type: 'bulk-approve',
              label: 'اعتماد كل مراجعات التسويق',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | اعتماد مراجعات التسويق المحددة بنجاح',
              productIds: filteredProducts.filter(p => p.approvalStage === 'marketing-review').map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'quality') {
        actions.push({
          id: 'ma-appr-quality-pass-all',
          label: '🛡️ تمرير جميع فحوصات الجودة',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-quality-${Date.now()}`,
              type: 'bulk-approve',
              label: 'تمرير جميع فحوصات الجودة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تمرير فحوصات الجودة لمنتجات الشركاء بنجاح',
              productIds: filteredProducts.filter(p => p.approvalStage === 'partner-review').map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'pricing') {
        actions.push({
          id: 'ma-appr-pricing-resolve',
          label: '💸 تسوية تعارض الأسعار تلقائياً',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-price-${Date.now()}`,
              type: 'price-change',
              label: 'تسوية تعارض الأسعار تلقائياً',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | خفض وتعديل الأسعار المرتفعة وتسوية تعارض التسعير',
              productIds: filteredProducts.filter(p => p.price > 100).map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-assign-central',
          label: '📸 تعيين صور مركزية معتمدة',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-media-assign-${Date.now()}`,
              type: 'media-policy-change',
              label: 'تعيين صور مركزية معتمدة',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعيين صورة مركزية افتراضية للمنتجات التي تنقصها صور',
              productIds: filteredProducts.filter(p => !p.mediaKey).map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'barcode') {
        actions.push({
          id: 'ma-barcode-generate-gtin',
          label: '🏷️ حوكمة الهوية والباركود',
          isActive: workspaceState?.workspace === 'identity-governance',
          onAction: () => {
            setWorkspaceState({ workspace: 'identity-governance', sourceSurface: 'catalogs', reason: 'barcode-governance' });
            setActionMessage('افتح Identity Governance Workspace لإدارة GTIN/SKU — لا توليد عشوائي');
          },
        });
      }
    } else if (activeTab === 'mapping') {
      if (activeSubTab === 'categories') {
        actions.push(
          { id: 'ma-cat-manage', label: '🏷️ فتح/إغلاق لوحة الفئات', isActive: categoryControlOpen, onAction: () => setCategoryControlOpen((v) => !v) },
          { id: 'ma-cat-add-main', label: '➕ إضافة فئة رئيسية', isActive: addingMainCat, onAction: () => { setAddingMainCat(true); setCategoryControlOpen(true); } },
          { id: 'ma-cat-reset-all', label: '↺ إعادة ضبط شجرة الفئات', isActive: false, onAction: () => handleResetCategoryPreview() },
        );
      } else if (activeSubTab === 'duplicates') {
        actions.push({
          id: 'ma-dup-resolve-all',
          label: '🔗 دمج وحل جميع التكرارات',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-dup-${Date.now()}`,
              type: 'conflict-resolution',
              label: 'دمج وحل جميع التكرارات',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | دمج التكرارات وحل النزاعات للمنتجات المحددة',
              productIds: filteredProducts.map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'gtin') {
        actions.push({
          id: 'ma-gtin-sync',
          label: '🔄 مزامنة الباركود مع المعرف',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-gtin-${Date.now()}`,
              type: 'edit-product',
              label: 'مزامنة الباركود مع المعرف',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعيين GTIN بالاعتماد على SKU للمنتجات المحددة',
              productIds: filteredProducts.filter(p => !p.gtin).map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      } else if (activeSubTab === 'media') {
        actions.push({
          id: 'ma-media-policy-strict',
          label: '📸 فرض سياسة الصور المركزية',
          isActive: false,
          onAction: () => setActionMessage('معاينة محلية فقط / preview-only: تم فرض سياسة الصور المركزية للمنتجات المؤهلة'),
        });
      } else if (activeSubTab === 'substitutions') {
        actions.push({
          id: 'ma-sub-set-strict',
          label: '🔒 تطبيق سياسة بدائل صارمة',
          isActive: false,
          onAction: () => setActionMessage('تم تطبيق سياسة بدائل صارمة بنجاح عبر الكتالوج'),
        });
      } else if (activeSubTab === 'visibility-policy') {
        actions.push({
          id: 'ma-vis-toggle-client',
          label: '👁️ تبديل الظهور للمستهلكين',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-vis-${Date.now()}`,
              type: 'visibility-change',
              label: 'تبديل الظهور للمستهلكين',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | تعديل منصات العرض المتاحة للمنتجات المحددة',
              productIds: filteredProducts.map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        });
      }
    } else if (activeTab === 'publishing') {
      actions.push(
        {
          id: 'ma-pub-publish-ready',
          label: '🚀 نشر جميع المنتجات الجاهزة للعميل',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-pub-${Date.now()}`,
              type: 'visibility-change',
              label: 'نشر جميع المنتجات الجاهزة للعميل',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | نشر جميع المنتجات الجاهزة بنجاح للعميل',
              productIds: filteredProducts.filter(p => p.approvalStage === 'catalog-adopted').map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        },
        {
          id: 'ma-pub-hide-drafts',
          label: '🙈 إخفاء جميع المسودات والمقترحات',
          isActive: false,
          onAction: () => {
            const proposal: CatalogPreviewProposal = {
              id: `prop-hide-${Date.now()}`,
              type: 'visibility-change',
              label: 'إخفاء جميع المسودات والمقترحات',
              status: 'ready-for-api',
              owner: 'control-panel-catalogs',
              note: 'UI_PREVIEW_ONLY | التأكد من إخفاء جميع المسودات ومقترحات الشركاء',
              productIds: filteredProducts.filter(p => p.approvalStage === 'catalog-draft' || p.approvalStage === 'partner-proposed').map(f => f.id),
            };
            onPushProposal(proposal);
            setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
          },
        },
      );
    }

    return actions;
  }, [activeTab, activeSubTab, filteredProducts, categoryControlOpen, addingMainCat, workspaceState, onPushProposal, setCategoryControlOpen, setAddingMainCat, setWorkspaceState, handleResetCategoryPreview]);

  const openWorkspace = React.useCallback((workspace: import('../catalogs.model').CatalogWorkspaceId, productId?: string) => {
    setWorkspaceState({ workspace, productId, sourceSurface: 'catalogs' });
  }, [setWorkspaceState]);

  return {
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    catalogPage, setCatalogPage,
    catalogTotalPages,
    productPreviewPatches, setProductPreviewPatches,
    queueProductPreviewPatch,
    showProductModal, setShowProductModal,
    modalMode, setModalMode,
    modalForm, setModalForm,
    showBulkOps, setShowBulkOps,
    selectedProductIds, setSelectedProductIds,
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    actionMessage, setActionMessage,
    products,
    filteredProducts,
    visibleProducts,
    selectedProduct,
    counts,
    filterOptions,
    totalCount,
    isCategoryMapped,
    isDuplicatesClean,
    isMediaSatisfied,
    approvedCount,
    isManualOrderCategory,
    microActions,
    pushPreviewProposal,
    openWorkspace,
  };
}
