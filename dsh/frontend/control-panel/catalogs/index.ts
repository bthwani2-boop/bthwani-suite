export { dshCatalogMetrics, dshCatalogCategories, dshCatalogProducts } from './catalog';
export type {
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification,
  CatalogProductMaster,
} from './catalog';
export { ControlPanelDshCatalogScreen } from './ControlPanelDshCatalogScreen';
export { ControlPanelDshCatalogApprovalScreen, ControlPanelDshListingGovernanceScreen } from './closure-workspaces';
export { ControlPanelDshCatalogCategoriesScreen } from './ControlPanelDshCatalogCategoriesScreen';
export { default } from './closure-workspaces';

// ML-053: Item approval section skeleton — BLOCKED_BY_CONTRACT (catalog approval API not proven)
export { ItemApprovalSection } from './ItemApprovalSection';
export type { ItemApprovalSectionProps } from './ItemApprovalSection';

// ML-054: Catalog publishing gate section skeleton — BLOCKED_BY_CONTRACT (catalog publish API not proven)
export { CatalogPublishingGateSection } from './CatalogPublishingGateSection';
export type { CatalogPublishingGateSectionProps } from './CatalogPublishingGateSection';
