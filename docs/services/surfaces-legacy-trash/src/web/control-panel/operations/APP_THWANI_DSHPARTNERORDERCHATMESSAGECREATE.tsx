import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalChatScreen } from '@bthwani/surfaces/core/shared/chat';

export default function APP_THWANI_DSHPARTNERORDERCHATMESSAGECREATE() {
  const config = {
    service: 'dsh' as const,
    entityType: "THWANI_DSHPARTNERORDERCHATMESSAGECREATE",
    entityId: '',
    features: {
      fileUpload: true,
      voiceMessages: false,
      locationSharing: false,
      readReceipts: true,
      typingIndicators: true,
    },
    styling: {
      primaryColor: semanticRoles.primaryCTA, 
      title: 'Dsh partner order chat message create',
    },
    api: {
      baseUrl: '/api/dsh',
      endpoints: {
        getMessages: 'dsh/partner/order/chat/message/create',
        sendMessage: 'dsh/partner/order/chat/message/create',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalChatScreen config={config} />
    </StateManager>
  );
}

