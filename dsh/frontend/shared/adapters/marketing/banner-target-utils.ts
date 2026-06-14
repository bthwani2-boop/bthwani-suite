// Canonical location: dsh/frontend/shared/adapters/marketing/banner-target-utils.ts
// Authority: dsh/frontend/shared — moved from control-panel/marketing/banner-target-utils.ts
// Pure resolver helpers for banner target selection.
// No React dependency — all functions are pure or data-driven only.

import type { MarketingBannerRecord } from '../../contracts/dsh-marketing-types';
import type { SmartBannerTargetType, SmartTargetSummary, BannerDraft } from '../../contracts/marketing/banner-types';
import { SMART_TARGET_OPTIONS, SUBSCRIPTION_OPTIONS } from '../../contracts/marketing/banner-types';

export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function getAvailableTargetTypes(): ReadonlyArray<{ value: SmartBannerTargetType; label: string; description: string }> {
  return SMART_TARGET_OPTIONS;
}

export function getSubscriptionOptions(): ReadonlyArray<{ value: string; label: string }> {
  return SUBSCRIPTION_OPTIONS;
}

export function buildSmartTargetSummary(draft: Pick<BannerDraft, 'targetType' | 'targetId'>): SmartTargetSummary {
  const option = SMART_TARGET_OPTIONS.find((o) => o.value === draft.targetType);
  return {
    type: draft.targetType,
    id: draft.targetId || undefined,
    label: option?.label ?? draft.targetType,
  };
}

export function isBannerPublishable(banner: Pick<MarketingBannerRecord, 'imageUrl' | 'title'>): boolean {
  return Boolean(banner.imageUrl && banner.title);
}
