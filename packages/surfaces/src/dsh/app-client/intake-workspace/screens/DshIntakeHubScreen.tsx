import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../_shared/screens';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

type IntakeScreenId = 'booking-create' | 'estimate-create' | 'external-order-create' | 'gas-refill-order-create';

export type DshIntakeHubScreenProps = {
  screenId: IntakeScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

function getDraftPlaceholder(screenId: IntakeScreenId) {
  if (screenId === 'external-order-create') {
    return 'External ref: EXT-2048';
  }

  if (screenId === 'gas-refill-order-create') {
    return 'Gas station, cylinder count, arrival note';
  }

  if (screenId === 'estimate-create') {
    return 'Pickup, dropoff, weight, and urgency';
  }

  return 'Service date, location, and customer note';
}

export function DshIntakeHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshIntakeHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [draft, setDraft] = React.useState('');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'estimate-create' ? 'Create estimate' : 'Continue intake'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Intake lane" value="Focused" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Transition" value={screenId === 'estimate-create' ? 'Quote first' : 'Order-ready'} deltaLabel="No route noise" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Request draft"
              value={draft}
              onChangeText={setDraft}
              placeholder={getDraftPlaceholder(screenId)}
              hint="Keep special intake details visible before moving into the canonical order flow."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Stage', value: definition.stageLabel },
                { label: 'Primary outcome', value: definition.primaryOutcome, tone: 'brand' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Specialized intake', subtitle: 'Preserve the unique fields of this request type before entering the standard flow.', meta: 'Intake', badgeLabel: 'Specific' },
              { title: 'Canonical handoff', subtitle: 'Move into review or order creation without losing the source context.', meta: 'Handoff', badgeLabel: 'Flow' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshIntakeHubScreen;