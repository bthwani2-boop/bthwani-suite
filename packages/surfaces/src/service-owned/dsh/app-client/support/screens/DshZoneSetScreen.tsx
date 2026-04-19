import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions } from './DshClientGeneratedSupportScreens';

export type DshZoneSetScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshZoneSetScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshZoneSetScreenProps) {
  const definition = clientSupportDefinitions['zone-set'];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel="Confirm zone"
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Active zone" value="Central Riyadh" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Coverage" value="Open" deltaLabel="Zone choice remains explicit before discovery" tone="success" />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList items={[{ label: 'Resolved from', value: 'Manual selection' }, { label: 'Zone id', value: 'zone-central-01' }, { label: 'Outcome', value: definition.primaryOutcome, tone: 'brand' }]} />
          </BthSurface>
          <BthSurface tone="raised" gap={2}>
            {[{ title: 'Zone selection', subtitle: 'Let the client confirm the service territory explicitly.', meta: 'Zone', badgeLabel: 'Area' }, { title: 'Discovery continuity', subtitle: 'Return to home or categories-list with the selected zone preserved.', meta: 'Flow', badgeLabel: 'Next' }].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshZoneSetScreen;