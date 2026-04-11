import React from 'react';
import { BthBox, BthListItem, BthStatCard, BthSurface, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../_shared/screens';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

type ConversationScreenId = 'chat-read-ack' | 'chat-send';

export type DshConversationHubScreenProps = {
  screenId: ConversationScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshConversationHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshConversationHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [message, setMessage] = React.useState(screenId === 'chat-send' ? 'Captain is on the way.' : 'Latest message acknowledged.');

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'chat-send' ? 'Send message' : 'Acknowledge thread'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Order thread" value="Open" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Context" value="Pinned" deltaLabel="Stay inside the current order conversation" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Message"
              value={message}
              onChangeText={setMessage}
              hint="Keep messaging tied to the active order instead of dropping the user back to the orders list."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Latest delivery update', subtitle: 'Captain confirmed pickup and is moving toward dropoff.', meta: 'Live', badgeLabel: 'Update' },
              { title: 'Customer acknowledgement', subtitle: 'Read state stays explicit without leaving the thread.', meta: 'Ack', badgeLabel: 'Thread' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshConversationHubScreen;