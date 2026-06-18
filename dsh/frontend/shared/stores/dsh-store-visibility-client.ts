// Typed client for the DSH store visibility gate PATCH endpoints.
// Covers: partner-readiness, catalog-approval, marketing-visibility.
// No UI, no React, no fetch. Pure types + factory.

export type PartnerReadinessStatus = 'ready' | 'not_ready' | 'paused';
export type CatalogApprovalStatus = 'approved' | 'pending' | 'rejected';
export type MarketingVisibilityStatus = 'active' | 'inactive' | 'paused';

export type StoreVisibilityGateResponse = {
  readonly store_id: string;
  readonly partner_readiness_status: PartnerReadinessStatus;
  readonly catalog_quality_status: CatalogApprovalStatus;
  readonly catalog_pricing_status: CatalogApprovalStatus;
  readonly marketing_visibility_status: MarketingVisibilityStatus;
  readonly client_visible: boolean;
  readonly updated_at: string;
};

export type DshStoreVisibilityTransport = {
  patch(path: string, body: unknown): Promise<StoreVisibilityGateResponse>;
};

export type DshStoreVisibilityClient = {
  updatePartnerReadiness(
    storeId: string,
    status: PartnerReadinessStatus,
  ): Promise<StoreVisibilityGateResponse>;
  updateCatalogApproval(
    storeId: string,
    qualityStatus: CatalogApprovalStatus,
    pricingStatus: CatalogApprovalStatus,
  ): Promise<StoreVisibilityGateResponse>;
  updateMarketingVisibility(
    storeId: string,
    status: MarketingVisibilityStatus,
  ): Promise<StoreVisibilityGateResponse>;
};

export function createDshStoreVisibilityClient(
  transport: DshStoreVisibilityTransport,
): DshStoreVisibilityClient {
  return {
    updatePartnerReadiness: (storeId, status) =>
      transport.patch(`/stores/${storeId}/partner-readiness`, { status }),

    updateCatalogApproval: (storeId, qualityStatus, pricingStatus) =>
      transport.patch(`/stores/${storeId}/catalog-approval`, {
        quality_status: qualityStatus,
        pricing_status: pricingStatus,
      }),

    updateMarketingVisibility: (storeId, status) =>
      transport.patch(`/stores/${storeId}/marketing-visibility`, { status }),
  };
}
