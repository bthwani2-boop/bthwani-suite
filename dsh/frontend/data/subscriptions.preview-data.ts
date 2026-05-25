/**
 * UI_PREVIEW_ONLY — commercial subscriptions + loyalty consumer adapter.
 * Merged from: loyalty-commercial.preview-data.ts + subscriptions-commercial.preview-data.ts
 * Derives display fixtures from shared stores; NOT a source of truth.
 */
import { getLoyaltyPrograms, getLoyaltyRewards, getLoyaltyTiers, getSubscriptionPlans } from './loyalty.preview-store';
import {
  mapLoyaltyProgramToClientBenefits,
  mapSubscriptionPlansToClientCards,
  type LoyaltyClientBenefits,
  type LoyaltyClientSection,
  type LoyaltyClientMetric,
  type SubscriptionClientCard,
} from './commercial.preview-contract';

export const dshSubscriptionsPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'preview-only display values / not accounting source',
} as const;

// --- Loyalty ---

export type LoyaltyBenefitMode = 'loyalty';

export type LoyaltyBenefitItem = {
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type LoyaltyMetricFixture = LoyaltyClientMetric;
export type LoyaltySectionFixture = LoyaltyClientSection;
export type LoyaltyRewardsFixture = LoyaltyClientBenefits;

export const loyaltyBenefitSurfaceItems: Record<LoyaltyBenefitMode, LoyaltyBenefitItem[]> = {
  loyalty: [
    { title: 'loyalty-points-client-balance', subtitle: 'عرض الرصيد الحالي لنقاط الولاء.', meta: 'الرصيد', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-redeem', subtitle: 'استبدال النقاط داخل نفس السطح.', meta: 'استبدال', badgeLabel: 'مباشر' },
    { title: 'loyalty-points-client-history', subtitle: 'مراجعة سجل الكسب والاستبدال.', meta: 'السجل', badgeLabel: 'مراجعة' },
    { title: 'entitlements-get', subtitle: 'التحقق من الاستحقاقات المتاحة.', meta: 'المزايا', badgeLabel: 'تحقق' },
  ],
};

export const loyaltyBenefitKeyValues: Record<LoyaltyBenefitMode, Array<{ label: string; value: string }>> = {
  loyalty: [
    { label: 'الرصيد', value: 'loyalty-points-client-balance' },
    { label: 'الاستبدال', value: 'loyalty-points-redeem' },
    { label: 'السجل', value: 'loyalty-points-client-history' },
  ],
};

function buildLoyaltyRewardsFixture(): LoyaltyRewardsFixture {
  const programs = getLoyaltyPrograms();
  const rewards = getLoyaltyRewards();
  const tiers = getLoyaltyTiers();
  const program = programs[0];
  if (!program) {
    return {
      title: 'الولاء والمكافآت',
      subtitle: 'لا يوجد برنامج ولاء نشط.',
      note: 'بيانات معاينة للولاء.',
      metrics: [],
      sections: [],
    };
  }
  return mapLoyaltyProgramToClientBenefits(program.name, rewards, tiers);
}

export const loyaltyRewardsFixture: LoyaltyRewardsFixture = buildLoyaltyRewardsFixture();

// --- Subscriptions ---

export type SubscriptionPlanCard = SubscriptionClientCard;

export const subscriptionHeroCopy = {
  eyebrow: 'بثواني برو',
  title: 'الاشتراكات',
  subtitle: 'دفع وتبديل وإدارة من نفس الصفحة.',
  note: 'العائلة حزمة داخل بثواني برو وليست منتجاً منفصلاً.',
} as const;

export const subscriptionPlanCards: SubscriptionPlanCard[] = mapSubscriptionPlansToClientCards(getSubscriptionPlans());
