import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../_shared/screens';
import { clientSupportDefinitions } from './DshClientGeneratedSupportScreens';

export type DshOrderIssueHubScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshOrderIssueHubScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshOrderIssueHubScreenProps) {
  const definition = clientSupportDefinitions['order-issue-flag'];
  const [issueNote, setIssueNote] = React.useState('Package quality issue detected on arrival.');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel="Flag issue"
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Issue state" value="Open" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Order impact" value="Visible" deltaLabel="Customer escalation stays explicit" tone="success" />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthTextField label="Issue note" value={issueNote} onChangeText={setIssueNote} hint="Describe the order issue without leaving the active customer lane." />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList items={[{ label: 'Order id', value: 'dsh-10021' }, { label: 'Surface', value: definition.title }, { label: 'Outcome', value: definition.primaryOutcome, tone: 'brand' }]} />
          </BthSurface>
          <BthSurface tone="raised" gap={2}>
            {[{ title: 'Quality issue', subtitle: 'Flag missing, damaged, or wrong-order cases directly on the order.', meta: 'Issue', badgeLabel: 'Flag' }, { title: 'Escalation continuity', subtitle: 'Keep the next support and refund path one tap away.', meta: 'Flow', badgeLabel: 'Recovery' }].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshOrderIssueHubScreen;