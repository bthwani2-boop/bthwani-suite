export { dshCatalogMetrics, dshCatalogCategories, dshCatalogProducts } from './catalog';
export type {
  CatalogMainCategory,
  CatalogSubCategory,
  CatalogMainClassification,
  CatalogProductMaster,
} from './catalog';
export { ControlPanelDshCatalogScreen } from './ControlPanelDshCatalogScreen';
export { ControlPanelDshCatalogApprovalScreen, ControlPanelDshListingGovernanceScreen } from './CatalogGovernanceScreens';
export { ControlPanelDshCatalogCategoriesScreen } from './ControlPanelDshCatalogCategoriesScreen';
export { default } from './CatalogGovernanceScreens';

// ML-053: Item approval section — UI_PREVIEW_ONLY flow implemented (catalog approval API not yet bound)
export { ItemApprovalSection } from './ItemApprovalSection';
export type { ItemApprovalSectionProps } from './ItemApprovalSection';

// ML-054: Catalog publishing gate section — UI_PREVIEW_ONLY flow implemented (catalog publish API not yet bound)
export { CatalogPublishingGateSection } from './CatalogPublishingGateSection';
export type { CatalogPublishingGateSectionProps } from './CatalogPublishingGateSection';

// CAT-S01: Item detail workspace — single product detail-on-open
export { CatalogItemDetailWorkspace } from './CatalogItemDetailWorkspace';
export type { CatalogItemDetailWorkspaceProps } from './CatalogItemDetailWorkspace';

// CAT-S03: Identity governance workspace — SKU/GTIN/barcode (replaces mapping/gtin + approvals/barcode subtabs)
export { CatalogIdentityGovernanceWorkspace } from './CatalogIdentityGovernanceWorkspace';
export type { CatalogIdentityGovernanceWorkspaceProps } from './CatalogIdentityGovernanceWorkspace';

// CAT-S02: Duplicate resolution workspace — pair-by-pair merge/reject/keep (replaces mapping/duplicates subtab)
export { CatalogDuplicateResolutionWorkspace } from './CatalogDuplicateResolutionWorkspace';
export type { CatalogDuplicateResolutionWorkspaceProps, DuplicatePair } from './CatalogDuplicateResolutionWorkspace';

// CAT-S04: Visibility policy workspace — client visibility gate (replaces mapping/visibility-policy + publishing subtabs)
export { CatalogVisibilityPolicyWorkspace } from './CatalogVisibilityPolicyWorkspace';
export type { CatalogVisibilityPolicyWorkspaceProps } from './CatalogVisibilityPolicyWorkspace';

// CAT-S07: Partner handoff workspace — bridge from partners/app-partner into catalog onboarding
export { CatalogPartnerHandoffWorkspace } from './CatalogPartnerHandoffWorkspace';
export type { CatalogPartnerHandoffWorkspaceProps } from './CatalogPartnerHandoffWorkspace';

// CAT-S06: Media governance workspace — media ownership separation (replaces mapping/media + approvals/media subtabs)
export { CatalogMediaGovernanceWorkspace } from './CatalogMediaGovernanceWorkspace';
export type { CatalogMediaGovernanceWorkspaceProps } from './CatalogMediaGovernanceWorkspace';
