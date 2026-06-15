'use client';

import { useMemo } from 'react';
import { dshCatalogCategories, type CatalogMainCategory, type CatalogProductMaster } from './catalogs.data';
import { initialColumnFilters, type CatalogFilterColumnId, type FilterType } from './catalogs.model';

type UseCatalogFilteredProductsParams = {
  products: CatalogProductMaster[];
  isManualOrderCategory: boolean;
  activeMainCategory: CatalogMainCategory | null;
  activeSubCategory: { id: string } | null;
  searchQuery: string;
  activeFilter: FilterType;
  colFilters: Record<CatalogFilterColumnId, string[]>;
  hiddenCategoryIds: ReadonlySet<string>;
  hiddenSubCategoryIds: ReadonlySet<string>;
  activeTab: string;
  activeSubTab: string;
  activeMainClassifId: string | null;
  activeSubClassifId: string | null;
  previewCategories: CatalogMainCategory[];
};

type FilteredProductsResult = {
  filteredProducts: CatalogProductMaster[];
  counts: Record<FilterType, number>;
  filterOptions: Record<string, string[]>;
};

export function useCatalogFilteredProducts({
  products, isManualOrderCategory, activeMainCategory, activeSubCategory,
  searchQuery, activeFilter, colFilters, hiddenCategoryIds, hiddenSubCategoryIds,
  activeTab, activeSubTab, activeMainClassifId, activeSubClassifId, previewCategories,
}: UseCatalogFilteredProductsParams): FilteredProductsResult {
  return useMemo(() => {
    if (isManualOrderCategory) {
      return {
        filteredProducts: [],
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

    const dynamicCounts: Record<FilterType, number> = {
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
      previewCategories.find(c => c.id === id)?.label || dshCatalogCategories.find(c => c.id === id)?.label || 'غير معروف';

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
}
