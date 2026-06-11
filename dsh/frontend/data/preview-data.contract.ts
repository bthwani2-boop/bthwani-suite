/**
 * DEV_ONLY_FIXTURE canonical preview data contract.
 * This file owns lightweight ID brands and graph references only. It has no payload.
 */
export type DshPreviewEntityId = string;
export type DshCategoryId = string;
export type DshStoreId = string;
export type DshBranchId = string;
export type DshProductId = string;
export type DshMediaId = string;
export type DshCustomerId = string;
export type DshPartnerId = string;
export type DshCaptainId = string;
export type DshFieldAgentId = string;
export type DshOperatorId = string;
export type DshOrderId = string;
export type DshCartId = string;
export type DshDeliveryModeId = string;
export type DshTicketId = string;
export type DshInterventionId = string;
export type DshConversationId = string;
export type DshNotificationId = string;
export type DshOperationalStatusId = string;
export type DshOfferId = string;
export type DshCampaignId = string;
export type DshPromoId = string;
export type DshBannerId = string;
export type DshLoyaltyProgramId = string;
export type DshSubscriptionPlanId = string;
export type DshMarketingAssetId = string;
export type DshProviderId = string;
export type DshServiceIdRef = string;
export type DshVarId = string;
export type DshAdminPolicyId = string;
export type DshGeoZoneId = string;
export type DshRecommendationId = string;

export type DshPreviewDataContract = {
  readonly dataKind: 'DEV_ONLY_FIXTURE';
  readonly runtimeTruth: false;
  readonly backendSource: false;
  readonly bindingSource: false;
};

export type DshPreviewRef<TKind extends string, TId extends string = string> = {
  readonly kind: TKind;
  readonly id: TId;
};

export const dshCanonicalPreviewDataContract: DshPreviewDataContract = {
  dataKind: 'DEV_ONLY_FIXTURE',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;

export function uniquePreviewRefs<T extends { id: string }>(items: readonly T[]): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
