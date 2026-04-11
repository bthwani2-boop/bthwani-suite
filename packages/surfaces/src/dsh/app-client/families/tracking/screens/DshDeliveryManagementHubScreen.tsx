import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

type DeliveryManagementScreenId = 'delivery-attempt-create' | 'delivery-attempts-list' | 'delivery-close' | 'delivery-reassign';

export type DshDeliveryManagementHubScreenProps = {
  screenId: DeliveryManagementScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshDeliveryManagementHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshDeliveryManagementHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'delivery-attempts-list' ? 'Open delivery history' : screenId === 'delivery-close' ? 'Close delivery' : 'Continue delivery action'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Delivery lane" value="Managed" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Recovery path" value="Visible" deltaLabel="No hidden reassignment or retry path" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Order id', value: 'dsh-10021' },
                { label: 'Current action', value: definition.primaryOutcome, tone: 'brand' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Attempts', subtitle: 'Read previous tries before creating another attempt.', meta: 'Attempts', badgeLabel: 'Retry' },
              { title: 'Reassign or close', subtitle: 'Keep last-mile recovery near the active delivery state.', meta: 'Management', badgeLabel: 'Control' },
              { title: 'Customer clarity', subtitle: 'Prevent delivery management from disappearing behind generic tracking.', meta: 'Clarity', badgeLabel: 'Visible' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshDeliveryManagementHubScreen;