export interface WltDshFieldCommissionStoreLine {
  readonly storeId: string;
  readonly storeName: string;
  readonly joinedAt: string;
  readonly activatedAt: string;
  readonly activationStatus: 'active' | 'pending_review' | 'rejected';
  readonly qualifiedOrderCount: number;
  readonly qualifiedOrderValueMinorUnits: number;
  readonly commissionRate: number;
  readonly commissionMinorUnits: number;
  readonly paidMinorUnits: number;
  readonly remainingMinorUnits: number;
  readonly holdReason: string;
  readonly settlementStatus: 'included' | 'held' | 'next_cycle' | 'disputed';
  readonly evidenceRef: string;
  readonly sourceOrderRefs: readonly string[];
}

export interface WltDshFieldCommissionStatement {
  readonly fieldAgentId: string;
  readonly fieldAgentName: string;
  readonly commissionCycleId: string;
  readonly cycleStart: string;
  readonly cycleEnd: string;
  readonly expectedPayoutDate: string;
  readonly eligibleStoreCount: number;
  readonly totalStoreCount: number;
  readonly commissionRate: number;
  readonly grossEligibleAmountMinorUnits: number;
  readonly totalCommissionMinorUnits: number;
  readonly paidMinorUnits: number;
  readonly remainingMinorUnits: number;
  readonly heldMinorUnits: number;
  readonly status: 'draft_preview' | 'ready_for_review' | 'held_by_wlt' | 'paid_preview';
  readonly evidenceStatus: 'none' | 'partial' | 'complete';
  readonly ledgerEntryRefs: readonly string[];
  readonly storeLines: readonly WltDshFieldCommissionStoreLine[];
  readonly isPreview: true;
}
