/**
 * Success Evaluator — DSH_LOYALTY_MASTER_SPEC §6.7
 * العتبات عبر Policy Keys (قيم افتراضية حتى ربط VAR_LOYALTY_*)
 */

import type {
  LoyaltySuccessEvaluationInput,
  LoyaltySuccessEvaluationOutput,
} from '../types';

export interface SuccessEvaluatorPolicy {
  minRoiPct: number;
  maxPredictionErrorPct: number;
  maxAbuseRateSuccess: number;
  maxAbuseRateHardFail: number;
  maxRefundRatePct: number;
  maxCancelRatePct: number;
}

export const DEFAULT_POLICY: SuccessEvaluatorPolicy = {
  minRoiPct: 0,
  maxPredictionErrorPct: 20,
  maxAbuseRateSuccess: 3,
  maxAbuseRateHardFail: 5,
  maxRefundRatePct: 10,
  maxCancelRatePct: 10,
};

/**
 * Hard fail → failed, stop
 * Mixed → mixed, repeat_with_changes
 * Else → success, repeat
 */
export function evaluateProgramSuccess(
  input: LoyaltySuccessEvaluationInput,
  policy: Partial<SuccessEvaluatorPolicy> = {},
  translate?: (key: string) => string
): LoyaltySuccessEvaluationOutput {
  const p = { ...DEFAULT_POLICY, ...policy };
  const reasons: string[] = [];
  const t = translate ?? ((k: string) => k);

  const hardFail =
    input.netImpactYer < 0 ||
    input.roiPct <= p.minRoiPct ||
    input.abuseRatePct >= p.maxAbuseRateHardFail;

  if (hardFail) {
    if (input.netImpactYer < 0) reasons.push('netImpactYer < 0');
    if (input.roiPct <= p.minRoiPct) reasons.push('roiPct <= min');
    if (input.abuseRatePct >= p.maxAbuseRateHardFail) reasons.push('abuseRatePct >= hardFail threshold');
    return {
      successStatus: 'failed',
      recommendation: 'stop',
      reasons,
    };
  }

  const mixed =
    (input.predictionErrorPct > p.maxPredictionErrorPct) ||
    (input.refundRatePct >= p.maxRefundRatePct) ||
    (input.cancelRatePct >= p.maxCancelRatePct);

  if (mixed) {
    if (input.predictionErrorPct > p.maxPredictionErrorPct) reasons.push(t('surfaces.predictionErrorPct_max') || 'predictionErrorPct > max');
    if (input.refundRatePct >= p.maxRefundRatePct) reasons.push('refundRatePct >= max');
    if (input.cancelRatePct >= p.maxCancelRatePct) reasons.push('cancelRatePct >= max');
    return {
      successStatus: 'mixed',
      recommendation: 'repeat_with_changes',
      reasons,
    };
  }

  reasons.push('within policy limits');
  return {
    successStatus: 'success',
    recommendation: 'repeat',
    reasons,
  };
}
