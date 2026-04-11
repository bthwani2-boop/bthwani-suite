import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../_shared/screens';
import { clientSupportDefinitions } from '../../support/screens/DshClientGeneratedSupportScreens';

export type DshSheinInfoScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshSheinInfoScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshSheinInfoScreenProps) {
  const definition = clientSupportDefinitions['shein-info'];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel="Open SHEIN flow"
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Partner lane" value="SHEIN" deltaLabel="Branded intake stays explicit" tone="info" />
            <BthStatCard label="Availability" value="Ready" deltaLabel="Client can enter from DSH without generic fallback" tone="success" />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList items={[{ label: 'Partner', value: 'SHEIN' }, { label: 'Service', value: 'External catalog intake' }, { label: 'Outcome', value: definition.primaryOutcome, tone: 'brand' }]} />
          </BthSurface>
          <BthSurface tone="raised" gap={2}>
            {[{ title: 'Catalog handoff', subtitle: 'Keep the branded entry visible instead of collapsing it into a generic store route.', meta: 'Partner', badgeLabel: 'Brand' }, { title: 'Order continuity', subtitle: 'Move from partner info into the standard DSH customer flow cleanly.', meta: 'Flow', badgeLabel: 'Next' }].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshSheinInfoScreen;