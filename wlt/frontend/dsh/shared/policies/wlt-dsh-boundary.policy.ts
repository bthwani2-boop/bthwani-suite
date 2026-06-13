/**
 * WLT/DSH boundary rules:
 * - DSH reads wallet summary and ledger entries; never mutates money.
 * - Payment sessions are initiated by DSH; confirmed by WLT via webhook (never by DSH directly).
 * - topUp is a WLT-side operation; DSH deep-links into WLT UI or delegates entirely.
 * - All settlement, refund, payout decisions live in WLT; DSH shows read-models only.
 */

export const WLT_DSH_BOUNDARY_POLICY = {
  dshCanRead: ['wallet-summary', 'ledger-entries', 'payment-session-status', 'refund-status', 'settlement-status'] as const,
  dshCanInitiate: ['payment-session-create', 'deep-link-topup'] as const,
  dshMustNotCall: ['confirm-payment-session', 'create-refund', 'create-settlement', 'payout-decision', 'reconciliation-run'] as const,
  wltOwns: ['money-mutation', 'payment-confirmation', 'refund-approval', 'settlement-cycle', 'payout-approval', 'ledger-write'] as const,
} as const;

export type WltDshAllowedRead = (typeof WLT_DSH_BOUNDARY_POLICY.dshCanRead)[number];
export type WltDshAllowedInitiation = (typeof WLT_DSH_BOUNDARY_POLICY.dshCanInitiate)[number];
export type WltDshForbiddenMutation = (typeof WLT_DSH_BOUNDARY_POLICY.dshMustNotCall)[number];
