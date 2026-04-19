import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';
import { loyaltyBenefitKeyValues, loyaltyBenefitSurfaceItems, type LoyaltyBenefitMode } from '../loyaltyCommercialDeck';

type BenefitsScreenId =
  | 'subscription-family-get'
  | 'subscription-family-members-get'
  | 'subscription-family-members-post'
  | 'subscription-pro-catalog'
  | 'subscription-sync'
  | 'subscription-tier-get'
  | 'subscription-upgrade-post'
  | 'loyalty-points-redeem'
  | 'loyalty-points-user-balance'
  | 'loyalty-points-user-history'
  | 'entitlements-get';

export type DshBenefitsHubScreenProps = {
  screenId: BenefitsScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

function isSubscriptionScreen(screenId: BenefitsScreenId) {
  return screenId.startsWith('subscription-');
}

function getBenefitMode(screenId: BenefitsScreenId): LoyaltyBenefitMode {
  return screenId === 'loyalty-points-redeem' || screenId === 'loyalty-points-user-balance' || screenId === 'loyalty-points-user-history'
    ? 'loyalty'
    : 'subscription';
}

function getPrimaryLabel(screenId: BenefitsScreenId) {
  if (screenId === 'loyalty-points-redeem') {
    return 'Redeem points';
  }

  if (screenId === 'subscription-upgrade-post' || screenId === 'subscription-pro-catalog') {
    return 'Continue to plan';
  }

  if (screenId === 'subscription-family-members-post') {
    return 'Invite member';
  }

  return 'Continue';
}

export function DshBenefitsHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshBenefitsHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const subscriptionMode = isSubscriptionScreen(screenId);
  const benefitMode = getBenefitMode(screenId);
  const surfaceItems = loyaltyBenefitSurfaceItems[benefitMode];
  const surfaceKeyValues = loyaltyBenefitKeyValues[benefitMode];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={getPrimaryLabel(screenId)}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard
              label="Screen"
              value={definition.title}
              deltaLabel={definition.stageLabel}
              tone="info"
            />
            <BthStatCard
              label="Mode"
              value={benefitMode}
              deltaLabel={subscriptionMode ? 'Subscription routes' : 'Loyalty routes'}
              tone="success"
            />
            <BthStatCard
              label="Live lanes"
              value={String(surfaceItems.length)}
              deltaLabel="Actual route-backed items"
              tone="warning"
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Stage', value: definition.stageLabel },
                {
                  label: 'Family',
                  value: subscriptionMode ? 'subscription' : 'loyalty',
                  tone: 'brand',
                },
                { label: 'Route count', value: String(surfaceKeyValues.length) },
                ...surfaceKeyValues,
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {surfaceItems.map((item) => (
              <BthListItem
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                meta={item.meta}
                badgeLabel={item.badgeLabel}
              />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshBenefitsHubScreen;