import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

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
              label={subscriptionMode ? 'Active tier' : 'Available balance'}
              value={subscriptionMode ? 'Pro Plus' : '2,840 pts'}
              deltaLabel={definition.stageLabel}
              tone="info"
            />
            <BthStatCard
              label={subscriptionMode ? 'Renewal' : 'Redeemable value'}
              value={subscriptionMode ? '26 Apr' : '18 SAR'}
              deltaLabel={subscriptionMode ? 'Auto-sync enabled' : 'Visible before checkout'}
              tone="success"
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Stage', value: definition.stageLabel },
                {
                  label: subscriptionMode ? 'Current plan' : 'Customer value',
                  value: subscriptionMode ? 'Priority delivery, family sharing, boosted points' : 'Redeem, inspect balance, and review history',
                  tone: 'brand',
                },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {(subscriptionMode
              ? [
                  { title: 'Pro catalog', subtitle: 'Compare plans with one clear upgrade path.', meta: 'Catalog', badgeLabel: 'Plan' },
                  { title: 'Family members', subtitle: 'Keep member management close to the active subscription state.', meta: 'Family', badgeLabel: 'Share' },
                  { title: 'Sync state', subtitle: 'Refresh benefits before the next paid action.', meta: 'Sync', badgeLabel: 'Live' },
                ]
              : [
                  { title: 'Points balance', subtitle: 'Show current value before redemption.', meta: 'Balance', badgeLabel: 'Value' },
                  { title: 'Redeem points', subtitle: 'Convert points into visible order savings.', meta: 'Redeem', badgeLabel: 'Action' },
                  { title: 'History', subtitle: 'Explain accrual and redemption without support friction.', meta: 'History', badgeLabel: 'Audit' },
                ]
            ).map((item) => (
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