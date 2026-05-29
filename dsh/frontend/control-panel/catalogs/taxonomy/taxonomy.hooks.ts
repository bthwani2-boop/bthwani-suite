'use client';

import React, { useState, useMemo } from 'react';
import {
  dshCatalogCategories,
  dshCatalogProducts,
  type CatalogMainCategory,
} from '../catalogs.data';
import {
  filterCategoryTree,
} from '../catalogs.adapters';
import type {
  CatalogTaxonomyNodeRef,
  CatalogPreviewProposal,
} from '../catalogs.model';
import { useCatalogCategoryState } from '../catalogs.category-state';

export type UseTaxonomyScreenParams = {
  onPushProposal: (p: CatalogPreviewProposal) => void;
};

/**
 * Taxonomy screen hook.
 * CRUD logic (add/delete/edit categories and classifications) is delegated to
 * `useCatalogCategoryState` to avoid duplication. This hook owns only the
 * taxonomy-screen-specific UI state: tree expansion, node selection, search.
 */
export function useTaxonomyScreen({ onPushProposal }: UseTaxonomyScreenParams) {
  const categoryState = useCatalogCategoryState({
    pushPreviewProposal: onPushProposal,
    products: dshCatalogProducts,
  });

  const [selectedTaxonomyNode, setSelectedTaxonomyNode] = useState<CatalogTaxonomyNodeRef | null>(null);
  const [expandedMainCategoryIds, setExpandedMainCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedSubCategoryIds, setExpandedSubCategoryIds] = useState<ReadonlySet<string>>(new Set());
  const [expandedMainClassifIds, setExpandedMainClassifIds] = useState<ReadonlySet<string>>(new Set());
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const filteredCategories = useMemo(
    () => filterCategoryTree(categoryState.previewCategories, treeSearchQuery),
    [categoryState.previewCategories, treeSearchQuery]
  );

  const getProductCountForCategory = React.useCallback(
    (mainId: string, subId?: string): number =>
      dshCatalogProducts.filter(
        (p) => p.categoryPath.main === mainId && (subId ? p.categoryPath.sub === subId : true)
      ).length,
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

  return {
    // Category CRUD state (from shared hook)
    previewCategories: categoryState.previewCategories,
    setPreviewCategories: categoryState.setPreviewCategories,
    hiddenCategoryIds: categoryState.hiddenCategoryIds,
    addingMainCat: categoryState.addingMainCat,
    setAddingMainCat: categoryState.setAddingMainCat,
    addingSubUnder: categoryState.addingSubUnder,
    setAddingSubUnder: categoryState.setAddingSubUnder,
    addingMainClassifUnder: categoryState.addingMainClassifUnder,
    setAddingMainClassifUnder: categoryState.setAddingMainClassifUnder,
    addingSubClassifUnder: categoryState.addingSubClassifUnder,
    setAddingSubClassifUnder: categoryState.setAddingSubClassifUnder,
    formLabel: categoryState.formLabel,
    setFormLabel: categoryState.setFormLabel,
    formSubtitle: categoryState.formSubtitle,
    setFormSubtitle: categoryState.setFormSubtitle,
    catError: categoryState.catError,
    setCatError: categoryState.setCatError,
    editingEntry: categoryState.editingEntry,
    setEditingEntry: categoryState.setEditingEntry,
    editLabel: categoryState.editLabel,
    setEditLabel: categoryState.setEditLabel,
    editSubtitle: categoryState.editSubtitle,
    setEditSubtitle: categoryState.setEditSubtitle,
    handleAddMainCategory: categoryState.handleAddMainCategory,
    handleAddSubCategory: categoryState.handleAddSubCategory,
    handleAddMainClassification: categoryState.handleAddMainClassification,
    handleAddSubClassification: categoryState.handleAddSubClassification,
    handleToggleCategoryHide: categoryState.handleToggleCategoryHide,
    handleDeleteNode: categoryState.handleDeleteNode,
    handleStartCatEdit: categoryState.handleStartCatEdit,
    handleApplyCatEdit: categoryState.handleApplyCatEdit,
    // Taxonomy-only UI state
    filteredCategories,
    selectedTaxonomyNode, setSelectedTaxonomyNode,
    expandedMainCategoryIds,
    expandedSubCategoryIds,
    expandedMainClassifIds,
    treeSearchQuery, setTreeSearchQuery,
    hoveredNodeId, setHoveredNodeId,
    toggleMainCategoryExpand,
    toggleSubCategoryExpand,
    toggleMainClassifExpand,
    getProductCountForCategory,
  };
}
