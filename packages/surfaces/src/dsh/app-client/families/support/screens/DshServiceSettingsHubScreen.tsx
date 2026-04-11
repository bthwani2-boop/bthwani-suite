import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../_shared/screens';
import { clientSupportDefinitions, type ClientSupportScreenId } from './DshClientGeneratedSupportScreens';

type ServiceSettingsScreenId = 'listing-status-update' | 'service-modes-resolve' | 'zone-set' | 'shein-info';

export type DshServiceSettingsHubScreenProps = {
  screenId: ServiceSettingsScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshServiceSettingsHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshServiceSettingsHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'shein-info' ? 'Open store flow' : 'Confirm settings'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Zone" value="Central" deltaLabel={screenId === 'zone-set' ? 'Manual override ready' : definition.stageLabel} tone="info" />
            <BthStatCard label="Service mode" value="Merchant + pickup" deltaLabel="Visible to the client" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
                { label: 'Current behavior', value: screenId === 'shein-info' ? 'External info presented inside DSH client flow' : 'Settings remain explicit before order creation' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Zone visibility', subtitle: 'Make the active service zone readable before browsing.', meta: 'Coverage', badgeLabel: 'Zone' },
              { title: 'Service modes', subtitle: 'Resolve pickup versus merchant delivery without hidden assumptions.', meta: 'Modes', badgeLabel: 'Flow' },
              { title: 'Listing and Shein info', subtitle: 'Keep special listing states and external catalog info inside one customer lane.', meta: 'Info', badgeLabel: 'Read' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshServiceSettingsHubScreen;