/**
 * UI_PREVIEW_ONLY — consumer adapter.
 * Derives display fixtures from shared loyalty.preview-store + commercial.preview-contract helpers.
 * NOT a source of truth. Do not add raw fixture data here.
 */
import { getLoyaltyPrograms, getLoyaltyRewards, getLoyaltyTiers } from './loyalty.preview-store';
import {
  mapLoyaltyProgramToClientBenefits,
  type LoyaltyClientBenefits,
  type LoyaltyClientSection,
  type LoyaltyClientMetric,
} from './commercial.preview-contract';

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
