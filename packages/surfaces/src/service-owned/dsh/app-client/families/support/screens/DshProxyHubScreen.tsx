import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from './DshClientGeneratedSupportScreens';

type ProxyScreenId = 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking';

export type DshProxyHubScreenProps = {
  screenId: ProxyScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshProxyHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshProxyHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [reviewNote, setReviewNote] = React.useState('Customer requested proxy purchase confirmation.');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'proxy-request-reject' ? 'Reject request' : screenId === 'proxy-request-tracking' ? 'Open tracking' : 'Continue request'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Proxy request" value="Active" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Decision lane" value={screenId === 'proxy-request-reject' ? 'Guarded' : 'Open'} deltaLabel="One approval path" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Request id', value: 'proxy-2048' },
                { label: 'Store', value: 'مطعم القلعة' },
                { label: 'Intent', value: definition.primaryOutcome, tone: 'brand' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Review note"
              value={reviewNote}
              onChangeText={setReviewNote}
              hint="Keep approval, review, or rejection rationale visible inside the same request workspace."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Create request', subtitle: 'Capture proxy demand without leaving the customer context.', meta: 'Create', badgeLabel: 'Request' },
              { title: 'Approve or reject', subtitle: 'Make the decision explicit and auditable.', meta: 'Decision', badgeLabel: 'Review' },
              { title: 'Track request', subtitle: 'Keep the follow-up visible after the decision lands.', meta: 'Tracking', badgeLabel: 'Live' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshProxyHubScreen;