/**
 * Loyalty constants — DSH_LOYALTY_MASTER_SPEC قفل
 * مصدر واحد للقيم المقفولة: لا restaurant بالمفرد؛ لا default/family كـ subscription tier
 */

import type { LoyaltyScopeType } from './types';

/** قيم scope_type المسموح بها فقط — لا restaurant بالمفرد */
export const LOCKED_SCOPE_TYPES: readonly LoyaltyScopeType[] = [
  'restaurants',
  'grocery',
  'all',
  'night',
  'week',
] as const;

/** في منطق الولاء: اشتراك = pro فقط؛ لا default ولا family كـ tier */
export const LOCKED_SUBSCRIPTION_TIER_LOYALTY = 'pro' as const;

/** قيم ممنوعة كـ subscription tier في الاستهداف (للاكتشاف والتحقق) */
export const FORBIDDEN_TIER_VALUES_IN_LOYALTY = ['default', 'family', 'basic', 'premium', 'prime'] as const;

/**
 * يتحقق أن scopeType من القيم المقفولة فقط.
 * @returns true إذا كانت القيمة مسموحاً بها
 */
export function isValidScopeType(value: string | undefined): value is LoyaltyScopeType {
  if (value == null) return true;
  return (LOCKED_SCOPE_TYPES as readonly string[]).includes(value);
}

/**
 * يتحقق أن subscriptionTier للولاء هو pro فقط أو غير معرّف.
 * يرفض default و family وأي tier آخر غير pro.
 */
export function isValidTargetingSubscriptionTier(value: string | undefined): boolean {
  if (value == null || value === '') return true;
  if (value === LOCKED_SUBSCRIPTION_TIER_LOYALTY) return true;
  return false;
}

/**
 * يتحقق أن الاستهداف لا يستخدم أسماء (معرّفات فقط) — للتوثيق والفحص.
 * القيمة المرجعة: true = لا توجد أسماء في الحقول المعروفة.
 */
export function targetingUsesIdsOnly(_targeting: {
  storeIds?: string[];
  categoryIds?: string[];
  scopeType?: string;
  [k: string]: unknown;
}): boolean {
  const disallowed = ['storeNames', 'categoryNames', 'subcategoryNames', 'regionNames', 'cityNames'];
  for (const key of disallowed) {
    if (key in _targeting && (_targeting as Record<string, unknown>)[key] != null) return false;
  }
  return true;
}
