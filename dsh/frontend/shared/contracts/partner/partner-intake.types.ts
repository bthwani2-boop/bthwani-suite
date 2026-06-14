// Canonical location: dsh/frontend/shared/contracts/partner/partner-intake.types.ts
// Authority: dsh/frontend/shared — moved from control-panel/partners/workflow.ts
// Types specific to partner intake flow; runtime functions remain in shared/state-machines/workflow.

import type { DshCanonicalPublishStage, DshCanonicalSource } from '../../presentation-models/dshStoreProductCardModel';
import type { DshFulfillmentDeliveryMode } from '../dsh-client-binding.contracts';

export type DshPartnerIntakeSource = 'app-field' | 'app-partner';
export type DshPartnerIntakeQueue = 'offer-approval' | 'partner-review' | 'marketing-review';

export type DshPartnerIntakeItem = {
  storeName: string;
  categoryLabel: string;
  source: DshPartnerIntakeSource;
  queue: DshPartnerIntakeQueue;
  ownerLabel: string;
  fieldStatusLabel: string;
  note: string;
  nextStep: string;
  submittedAt: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  canonicalStage?: DshCanonicalPublishStage;
  canonicalSource?: DshCanonicalSource;
} & {
  id: string;
};

export type DshPartnerIntakeMetric = {
  id: string;
  label: string;
  value: number;
  description: string;
};

// SCAFFOLD - commission and settlement figures are WLT-owned, not authoritative here
export type DshPartnerFulfillmentMode = DshFulfillmentDeliveryMode;

export type DshPartnerModeAgreement = {
  mode: DshPartnerFulfillmentMode;
  modeLabel: string;
  enabled: boolean;
  /** SCAFFOLD - actual rate lives in WLT commission engine */
  commissionRatePreview: string;
  settlementBasis: string;
  operationalReadiness: 'ready' | 'pending' | 'unavailable';
  validityLabel: string;
  negotiationNote?: string;
};

export type DshPartnerFulfillmentAgreement = {
  partnerId: string;
  storeName: string;
  categoryLabel: string;
  modes: readonly DshPartnerModeAgreement[];
};

// Empty arrays — data moved to central preview data fixtures
export const dshPartnerIntakeMetrics: ReadonlyArray<DshPartnerIntakeMetric> = [];
export const dshPartnerIntakeItems: ReadonlyArray<DshPartnerIntakeItem> = [];
export const dshPartnerApprovalLanes: ReadonlyArray<string> = [];
