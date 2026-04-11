import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../_shared/screens';
import { clientSupportDefinitions } from '../../support/screens/DshClientGeneratedSupportScreens';

export type DshListingStatusUpdateScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshListingStatusUpdateScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshListingStatusUpdateScreenProps) {
  const definition = clientSupportDefinitions['listing-status-update'];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel="Confirm listing state"
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Listing state" value="Visible" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Customer impact" value="Clear" deltaLabel="Availability does not disappear into generic settings" tone="success" />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList items={[{ label: 'Listing', value: 'مطعم القلعة' }, { label: 'Current status', value: 'Open for orders' }, { label: 'Outcome', value: definition.primaryOutcome, tone: 'brand' }]} />
          </BthSurface>
          <BthSurface tone="raised" gap={2}>
            {[{ title: 'Visibility control', subtitle: 'Explain if the listing is open, paused, or limited by zone.', meta: 'Status', badgeLabel: 'Live' }, { title: 'Recovery path', subtitle: 'Keep the user one step away from browsing after status clarification.', meta: 'Flow', badgeLabel: 'Next' }].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshListingStatusUpdateScreen;