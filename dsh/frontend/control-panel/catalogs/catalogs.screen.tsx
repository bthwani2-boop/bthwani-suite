'use client';

import React from 'react';
import { Box, Text, useTheme } from '@bthwani/ui-kit';
import { WebControlPanelCompactPager } from '@bthwani/ui-kit/web';
import styles from '../shared/control-panel-surface.module.css';
import { CatalogWorkspaceRouter } from './drawers/catalog-workspace-router';
import { useCatalogScreen } from './catalogs.hooks';
import { TaxonomyScreen } from './taxonomy/taxonomy.screen';
import { useTaxonomyScreen } from './taxonomy/taxonomy.hooks';
import { IntakeWorkspaceView } from './products/intake-workspace';
import { MappingWorkspaceView } from './products/mapping-workspace';
import { ProductInspectorPanel } from './products/product-inspector-panel';
import { ProductEditModal } from './products/product-edit-modal';
import { CategoryControlRoom } from './products/category-control-room';
import { CatalogControlStrip } from './catalogs.control-strip';
import { CatalogBreadcrumb } from './catalogs.breadcrumb';
import { CatalogProposalsBanner } from './catalogs.proposals-banner';
import { CatalogProductsTable } from './products/catalog-products-table';
import { PublishingGateChecklist } from './products/publishing-gate-checklist';

export type ControlPanelDshCatalogScreenProps = {
  hubHref?: string;
  operationsHref?: string;
  partnersHref?: string;
  marketingHref?: string;
};

export function ControlPanelDshCatalogScreen({
  hubHref = '/operations',
  operationsHref = '/operations',
  partnersHref = '/partners',
  marketingHref = '/marketing',
}: ControlPanelDshCatalogScreenProps) {
  const { theme } = useTheme();
  const screen = useCatalogScreen();
  const {
    activeTab, setActiveTab,
    activeSubTab, setActiveSubTab,
    showBulkOps, setShowBulkOps,
    selectedProductIds, setSelectedProductIds,
    workspaceState, setWorkspaceState, openWorkspace,
    pendingProposals, pushPreviewProposal, dismissPreviewProposal,
    activeMainCategory, setActiveMainCategory,
    activeSubCategory, setActiveSubCategory,
    activeFilter, setActiveFilter,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    catalogPage, setCatalogPage,
    catalogTotalPages,
    setProductPreviewPatches,
    queueProductPreviewPatch,
    products, filteredProducts, visibleProducts,
    filterOptions,
    selectedProduct,
    totalCount,
    showProductModal, setShowProductModal,
    modalMode, setModalMode,
    modalForm, setModalForm,
    previewCategories,
    effectiveCategories,
    hiddenCategoryIds,
    hiddenSubCategoryIds,
    categoryControlOpen, setCategoryControlOpen,
    catError,
    activeMainClassifId, setActiveMainClassifId,
    activeSubClassifId, setActiveSubClassifId,
    colFilters, setColFilters,
    openFilterCol, setOpenFilterCol,
    activeColFiltersCount,
    actionMessage, setActionMessage,
    isCategoryMapped, isDuplicatesClean, isMediaSatisfied, approvedCount,
    isManualOrderCategory,
    microActions,
  } = screen;

  const taxonomyHook = useTaxonomyScreen({ onPushProposal: pushPreviewProposal });

  // CategoryControlRoom props — built once, spread below
  const categoryRoomProps = {
    categoryControlOpen, setCategoryControlOpen,
    previewCategories,
    hiddenCategoryIds,
    hiddenSubCategoryIds: screen.hiddenSubCategoryIds,
    activeMainCategory,
    activeSubCategory,
    catError,
    setCatError: screen.setCatError,
    addingMainCat: screen.addingMainCat,
    setAddingMainCat: screen.setAddingMainCat,
    addingSubUnder: screen.addingSubUnder,
    setAddingSubUnder: screen.setAddingSubUnder,
    addingMainClassifUnder: screen.addingMainClassifUnder,
    setAddingMainClassifUnder: screen.setAddingMainClassifUnder,
    addingSubClassifUnder: screen.addingSubClassifUnder,
    setAddingSubClassifUnder: screen.setAddingSubClassifUnder,
    formLabel: screen.formLabel,
    setFormLabel: screen.setFormLabel,
    formSubtitle: screen.formSubtitle,
    setFormSubtitle: screen.setFormSubtitle,
    editingEntry: screen.editingEntry,
    setEditingEntry: screen.setEditingEntry,
    editLabel: screen.editLabel,
    setEditLabel: screen.setEditLabel,
    editSubtitle: screen.editSubtitle,
    setEditSubtitle: screen.setEditSubtitle,
    handleMainCategorySelect: screen.handleMainCategorySelect,
    handleSubCategorySelect: screen.handleSubCategorySelect,
    handleAddMainCategory: screen.handleAddMainCategory,
    handleAddSubCategory: screen.handleAddSubCategory,
    handleAddMainClassification: screen.handleAddMainClassification,
    handleAddSubClassification: screen.handleAddSubClassification,
    handleToggleCategoryHide: screen.handleToggleCategoryHide,
    handleToggleSubCategoryHide: screen.handleToggleSubCategoryHide,
    handleDeleteNode: screen.handleDeleteNode,
    handleResetCategoryPreview: screen.handleResetCategoryPreview,
    handleStartCatEdit: screen.handleStartCatEdit,
    handleApplyCatEdit: screen.handleApplyCatEdit,
    getProductCountForCategory: screen.getProductCountForCategory,
  } satisfies React.ComponentProps<typeof CategoryControlRoom>;

  return (
    <div className={styles.surfaceCockpit}>
      {/* Header */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <Box
            radiusToken="sm"
            elevationToken="raised"
            align="center"
            justify="center"
            style={{ width: 32, height: 32, backgroundColor: theme.brandHeaderBackground }}
          >
            <Text style={{ color: theme.textInverse, fontSize: 16 }}>⌗</Text>
          </Box>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle} style={{ letterSpacing: -0.18 }}>كتالوج DSH</h1>
              <Box paddingX={1} paddingY={1} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>حوكمة الماستر</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>إدارة المنتجات والفئات ومخاطر التبني عبر الأسطح</p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            {[
              { label: 'إجمالي المنتجات', value: '١٤,٥٨٢' },
              { label: 'بانتظار اعتماد', value: '١٢٤' },
              { label: 'تعارضات النشاط', value: '٨', tone: 'danger' }
            ].map((m) => (
              <div key={m.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{m.label}</span>
                <span className={m.tone === 'danger' ? `${styles.commandKpiValue} ${styles.commandKpiValueAlert}` : styles.commandKpiValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Three-Layer Control Strip */}
      <CatalogControlStrip
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        setSelectedProductId={setSelectedProductId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        effectiveCategories={effectiveCategories}
        hiddenCategoryIds={hiddenCategoryIds}
        hiddenSubCategoryIds={hiddenSubCategoryIds}
        activeMainCategory={activeMainCategory}
        handleMainCategorySelect={screen.handleMainCategorySelect}
        activeSubCategory={activeSubCategory}
        handleSubCategorySelect={screen.handleSubCategorySelect}
        activeMainClassifId={activeMainClassifId}
        setActiveMainClassifId={setActiveMainClassifId}
        activeSubClassifId={activeSubClassifId}
        setActiveSubClassifId={setActiveSubClassifId}
        showBulkOps={showBulkOps}
        setShowBulkOps={setShowBulkOps}
        selectedProductIds={selectedProductIds}
        setWorkspaceState={setWorkspaceState}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        microActions={microActions}
      />

      {/* Breadcrumb */}
      <CatalogBreadcrumb
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        colFilters={colFilters}
        setColFilters={setColFilters}
        activeMainCategory={activeMainCategory}
        setActiveMainCategory={setActiveMainCategory}
        activeSubCategory={activeSubCategory}
        setActiveSubCategory={setActiveSubCategory}
        activeMainClassifId={activeMainClassifId}
        setActiveMainClassifId={setActiveMainClassifId}
        activeSubClassifId={activeSubClassifId}
        setActiveSubClassifId={setActiveSubClassifId}
        activeColFiltersCount={activeColFiltersCount}
        filteredProductCount={filteredProducts.length}
      />

      {/* Action message banner */}
      {actionMessage ? (
        <div role="status" aria-live="polite" style={{ padding: '8px 14px', backgroundColor: theme.surfaceInset, borderBottom: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: theme.brandHeaderBackground, fontWeight: 600 }}>{actionMessage}</span>
          <span style={{ fontSize: '10px', color: theme.textMuted }}>UI_PREVIEW_ONLY</span>
          <button type="button" onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', color: theme.textMuted, fontSize: '12px', cursor: 'pointer', padding: '0 4px' }}>x</button>
        </div>
      ) : null}

      {/* Category Control Room */}
      {activeTab === 'mapping' && activeSubTab === 'categories' && (
        <CategoryControlRoom {...categoryRoomProps} />
      )}

      {/* Main Content */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', height: '100%' }}>
            {activeTab !== 'taxonomy' ? (
              <>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: theme.surface, minWidth: 0 }}>
                  <div style={{ flex: 1, minHeight: 0, backgroundColor: theme.surface }}>
                    {isManualOrderCategory ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '48px', opacity: 0.7 }}>
                        <Text role="titleMd" style={{ color: theme.brandHeaderBackground }}>فئة الطلب اليدوي</Text>
                        <Text role="bodySm" tone="muted" style={{ textAlign: 'center', maxWidth: 400, marginTop: 8 }}>
                          المنتجات في هذه الفئة (مثل شي إن، عونك) تُعامل كطلبات مرنة ولا تحتوي على منتجات كتالوج قياسية محددة مسبقاً.
                        </Text>
                      </div>
                    ) : (
                      <div style={{ overflow: 'auto', height: '100%' }}>
                        {activeTab === 'intake' ? (
                          <IntakeWorkspaceView
                            activeSubTab={activeSubTab}
                            filteredProducts={filteredProducts}
                            selectedProductId={selectedProductId}
                            setSelectedProductId={setSelectedProductId}
                            openWorkspace={openWorkspace}
                          />
                        ) : activeTab === 'mapping' ? (
                          <MappingWorkspaceView
                            activeSubTab={activeSubTab}
                            filteredProducts={filteredProducts}
                            selectedProductId={selectedProductId}
                            setSelectedProductId={setSelectedProductId}
                            openWorkspace={openWorkspace}
                            previewCategories={previewCategories}
                          />
                        ) : (
                          <>
                            {activeTab === 'publishing' && (
                              <PublishingGateChecklist
                                isCategoryMapped={isCategoryMapped}
                                isDuplicatesClean={isDuplicatesClean}
                                isMediaSatisfied={isMediaSatisfied}
                                approvedCount={approvedCount}
                                totalCount={totalCount}
                                products={products}
                                setProductPreviewPatches={setProductPreviewPatches}
                                pushPreviewProposal={pushPreviewProposal}
                                setActionMessage={setActionMessage}
                              />
                            )}
                            <CatalogProductsTable
                              showBulkOps={showBulkOps}
                              selectedProductIds={selectedProductIds}
                              setSelectedProductIds={setSelectedProductIds}
                              visibleProducts={visibleProducts}
                              previewCategories={previewCategories}
                              selectedProductId={selectedProductId}
                              setSelectedProductId={setSelectedProductId}
                              colFilters={colFilters}
                              setColFilters={setColFilters}
                              openFilterCol={openFilterCol}
                              setOpenFilterCol={setOpenFilterCol}
                              filterOptions={filterOptions}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {!isManualOrderCategory && activeTab !== 'intake' && activeTab !== 'mapping' ? (
                    <div style={{ padding: '10px 16px 12px', borderTop: `1px solid ${theme.line}`, backgroundColor: theme.surface }}>
                      <WebControlPanelCompactPager
                        page={catalogPage}
                        totalPages={catalogTotalPages}
                        onPrevious={() => setCatalogPage(p => Math.max(1, p - 1))}
                        onNext={() => setCatalogPage(p => Math.min(catalogTotalPages, p + 1))}
                      />
                    </div>
                  ) : null}
                </div>

                {selectedProductId && selectedProduct && (
                  <ProductInspectorPanel
                    selectedProduct={selectedProduct}
                    setSelectedProductId={setSelectedProductId}
                    openWorkspace={openWorkspace}
                    queueProductPreviewPatch={queueProductPreviewPatch}
                    previewCategories={previewCategories}
                    setModalMode={setModalMode}
                    setModalForm={setModalForm}
                    setShowProductModal={setShowProductModal}
                  />
                )}
              </>
            ) : (
              <TaxonomyScreen taxonomy={taxonomyHook} products={products} />
            )}
          </div>
        </div>
      </main>

      {showProductModal && (
        <ProductEditModal
          setShowProductModal={setShowProductModal}
          modalMode={modalMode}
          modalForm={modalForm}
          setModalForm={setModalForm}
          previewCategories={previewCategories}
          products={products}
          pushPreviewProposal={pushPreviewProposal}
          queueProductPreviewPatch={queueProductPreviewPatch}
          setActionMessage={setActionMessage}
        />
      )}

      <CatalogWorkspaceRouter
        workspaceState={workspaceState}
        products={products}
        selectedProductIds={selectedProductIds}
        onClose={() => setWorkspaceState(null)}
        onProposal={(proposal) => {
          pushPreviewProposal(proposal);
          setActionMessage(`📋 مقترح: ${proposal.label} (${proposal.status})`);
        }}
      />

      <CatalogProposalsBanner
        pendingProposals={pendingProposals}
        dismissPreviewProposal={dismissPreviewProposal}
      />
    </div>
  );
}

export default ControlPanelDshCatalogScreen;
