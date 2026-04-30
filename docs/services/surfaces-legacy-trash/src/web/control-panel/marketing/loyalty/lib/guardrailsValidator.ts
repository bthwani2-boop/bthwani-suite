/**
 * Guardrails Validator — DSH_LOYALTY_MASTER_SPEC §6.2
 * قواعد: fundingTotal === 100، ميزانية، scope_type مقفول، subscriptionTier = pro فقط
 */

import type { LoyaltyProgramDraft } from '../types';
import {
  isValidScopeType,
  isValidTargetingSubscriptionTier,
  targetingUsesIdsOnly,
  FORBIDDEN_TIER_VALUES_IN_LOYALTY,
} from '../constants';

export interface GuardrailsResult {
  valid: boolean;
  riskScore: number;
  warnings: string[];
}

export function validateLoyaltyGuardrails(draft: LoyaltyProgramDraft): GuardrailsResult {
  const warnings: string[] = [];
  let riskScore = 0;

  const totalFunding =
    (draft.funding.merchantPct ?? 0) +
    (draft.funding.platformPct ?? 0) +
    (draft.funding.deliveryPct ?? 0);
  if (Math.abs(totalFunding - 100) > 0.01) {
    warnings.push('fundingTotal !== 100');
    riskScore += 30;
  }

  if (draft.totalBudgetYer != null && draft.totalBudgetYer <= 0) {
    warnings.push('totalBudgetYer must be positive');
    riskScore += 20;
  }

  if (draft.targeting.scopeType != null && !isValidScopeType(draft.targeting.scopeType)) {
    warnings.push('targeting.scopeType must be one of: restaurants|grocery|all|night|week (not restaurant)');
    riskScore += 25;
  }

  const tier = draft.targeting.subscriptionTier;
  if (tier != null && !isValidTargetingSubscriptionTier(tier)) {
    warnings.push(
      `targeting.subscriptionTier must be "pro" only in loyalty; forbidden: ${FORBIDDEN_TIER_VALUES_IN_LOYALTY.join(', ')}`
    );
    riskScore += 25;
  }

  if (!targetingUsesIdsOnly(draft.targeting as Record<string, unknown>)) {
    warnings.push('targeting must use IDs only (no categoryNames, storeNames, etc.)');
    riskScore += 20;
  }

  return {
    valid: riskScore < 50,
    riskScore,
    warnings,
  };
}
