/**
 * Phase 7 — التحقق الآلي من قفل الولاء (DSH_LOYALTY_MASTER_SPEC)
 * ضمان: لا restaurant كمفرد، لا default/family كـ tier، استهداف بالمعرّفات فقط
 */

import {
  LOCKED_SCOPE_TYPES,
  LOCKED_SUBSCRIPTION_TIER_LOYALTY,
  FORBIDDEN_TIER_VALUES_IN_LOYALTY,
  isValidScopeType,
  isValidTargetingSubscriptionTier,
  targetingUsesIdsOnly,
} from '../constants';
import { validateLoyaltyGuardrails } from '../lib/guardrailsValidator';
import type { LoyaltyProgramDraft } from '../types';

describe('loyalty constants (LOCKED)', () => {
  it('LOCKED_SCOPE_TYPES contains only allowed values (no restaurant)', () => {
    expect(LOCKED_SCOPE_TYPES).toContain('restaurants');
    expect(LOCKED_SCOPE_TYPES).toContain('grocery');
    expect(LOCKED_SCOPE_TYPES).toContain('all');
    expect(LOCKED_SCOPE_TYPES).toContain('night');
    expect(LOCKED_SCOPE_TYPES).toContain('week');
    expect(LOCKED_SCOPE_TYPES).not.toContain('restaurant');
    expect(LOCKED_SCOPE_TYPES.length).toBe(5);
  });

  it('subscription tier in loyalty is pro only', () => {
    expect(LOCKED_SUBSCRIPTION_TIER_LOYALTY).toBe('pro');
    expect(FORBIDDEN_TIER_VALUES_IN_LOYALTY).toContain('default');
    expect(FORBIDDEN_TIER_VALUES_IN_LOYALTY).toContain('family');
  });
});

describe('isValidScopeType', () => {
  it('accepts all LOCKED_SCOPE_TYPES', () => {
    for (const v of LOCKED_SCOPE_TYPES) {
      expect(isValidScopeType(v)).toBe(true);
    }
  });

  it('rejects restaurant (singular)', () => {
    expect(isValidScopeType('restaurant')).toBe(false);
  });

  it('accepts undefined/null', () => {
    expect(isValidScopeType(undefined)).toBe(true);
  });

  it('rejects arbitrary values', () => {
    expect(isValidScopeType('')).toBe(false);
    expect(isValidScopeType('other')).toBe(false);
  });
});

describe('isValidTargetingSubscriptionTier', () => {
  it('accepts pro and undefined', () => {
    expect(isValidTargetingSubscriptionTier('pro')).toBe(true);
    expect(isValidTargetingSubscriptionTier(undefined)).toBe(true);
    expect(isValidTargetingSubscriptionTier('')).toBe(true);
  });

  it('rejects default and family', () => {
    expect(isValidTargetingSubscriptionTier('default')).toBe(false);
    expect(isValidTargetingSubscriptionTier('family')).toBe(false);
  });

  it('rejects other tiers', () => {
    expect(isValidTargetingSubscriptionTier('basic')).toBe(false);
    expect(isValidTargetingSubscriptionTier('premium')).toBe(false);
    expect(isValidTargetingSubscriptionTier('prime')).toBe(false);
  });
});

describe('targetingUsesIdsOnly', () => {
  it('returns true for targeting with only ID fields', () => {
    expect(targetingUsesIdsOnly({ storeIds: ['s1'], categoryIds: ['c1'] })).toBe(true);
    expect(targetingUsesIdsOnly({ scopeType: 'restaurants' })).toBe(true);
  });

  it('returns false when name fields present', () => {
    expect(targetingUsesIdsOnly({ categoryNames: ['مطاعم'] })).toBe(false);
    expect(targetingUsesIdsOnly({ storeNames: ['متجر ١'] })).toBe(false);
    expect(targetingUsesIdsOnly({ storeIds: ['s1'], storeNames: ['x'] })).toBe(false);
  });
});

function minimalDraft(overrides: Partial<LoyaltyProgramDraft> = {}): LoyaltyProgramDraft {
  return {
    kind: 'discount',
    targeting: {},
    funding: { merchantPct: 50, platformPct: 50, deliveryPct: 0 },
    ...overrides,
  };
}

describe('validateLoyaltyGuardrails', () => {
  it('passes when funding = 100 and valid targeting', () => {
    const r = validateLoyaltyGuardrails(
      minimalDraft({ targeting: { scopeType: 'restaurants', subscriptionTier: 'pro' } })
    );
    expect(r.valid).toBe(true);
    expect(r.riskScore).toBe(0);
  });

  it('reports warning when funding total !== 100', () => {
    const r = validateLoyaltyGuardrails(
      minimalDraft({ funding: { merchantPct: 60, platformPct: 30, deliveryPct: 0 } })
    );
    expect(r.warnings.some((w) => w.includes('fundingTotal'))).toBe(true);
    expect(r.riskScore).toBeGreaterThanOrEqual(30);
  });

  it('valid is false when riskScore >= 50', () => {
    const r = validateLoyaltyGuardrails(
      minimalDraft({
        funding: { merchantPct: 60, platformPct: 30, deliveryPct: 0 },
        targeting: { scopeType: 'restaurant' as 'restaurants' },
      })
    );
    expect(r.riskScore).toBeGreaterThanOrEqual(50);
    expect(r.valid).toBe(false);
  });

  it('fails when scopeType is restaurant (singular)', () => {
    const r = validateLoyaltyGuardrails(
      minimalDraft({ targeting: { scopeType: 'restaurant' as 'restaurants' } })
    );
    expect(r.warnings.some((w) => w.includes('scopeType') && w.includes('restaurant'))).toBe(true);
    expect(r.riskScore).toBeGreaterThanOrEqual(25);
  });

  it('fails when subscriptionTier is default or family', () => {
    const rDefault = validateLoyaltyGuardrails(
      minimalDraft({ targeting: { subscriptionTier: 'default' as 'pro' } })
    );
    expect(rDefault.warnings.some((w) => w.includes('subscriptionTier') || w.includes('pro'))).toBe(true);

    const rFamily = validateLoyaltyGuardrails(
      minimalDraft({ targeting: { subscriptionTier: 'family' as 'pro' } })
    );
    expect(rFamily.warnings.some((w) => w.includes('subscriptionTier') || w.includes('forbidden'))).toBe(true);
  });

  it('fails when targeting uses name fields', () => {
    const r = validateLoyaltyGuardrails(
      minimalDraft({
        targeting: { categoryNames: ['مطاعم'] } as unknown as LoyaltyProgramDraft['targeting'],
      })
    );
    expect(r.warnings.some((w) => w.includes('IDs only') || w.includes('storeNames') || w.includes('categoryNames'))).toBe(true);
  });

  it('totalBudgetYer must be positive when set', () => {
    const r = validateLoyaltyGuardrails(minimalDraft({ totalBudgetYer: 0 }));
    expect(r.warnings.some((w) => w.includes('totalBudgetYer'))).toBe(true);
  });
});
