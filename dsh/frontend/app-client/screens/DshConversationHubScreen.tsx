import React from 'react';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import { OperationScreenView } from './parts/OperationScreenView';

export type ConversationScreenId = 'chat-read-ack' | 'chat-send';

export type DshConversationHubScreenProps = {
  screenId: ConversationScreenId;
  threadType?: 'captain-thread' | 'support-thread';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshConversationHubScreen({ screenId, threadType, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshConversationHubScreenProps) {
  const threadLabel = threadType === 'captain-thread'
    ? 'محادثة الكابتن'
    : threadType === 'support-thread'
    ? 'محادثة الدعم'
    : 'المحادثة';

  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'chat-send' ? `إرسال رسالة · ${threadLabel}` : `تأكيد ${threadLabel}`}
      secondaryActionLabel="العودة إلى الطلبات"
    />
  );
}

export default DshConversationHubScreen;
