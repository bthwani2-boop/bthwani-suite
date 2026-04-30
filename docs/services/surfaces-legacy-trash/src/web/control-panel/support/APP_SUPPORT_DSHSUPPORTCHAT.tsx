import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalChatScreen } from '@bthwani/surfaces/core/shared/chat';

export default function APP_SUPPORT_DSHSUPPORTCHAT() {
  const config = {
    service: 'dsh' as const,
    entityType: "SUPPORT_DSHSUPPORTCHAT",
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
      title: 'Dsh support chat',
    },
    api: {
      baseUrl: '/api/dsh',
      endpoints: {
        getMessages: 'dsh/support/chat',
        sendMessage: 'dsh/support/chat',
      },
    },
  };

  return (
    <StateManager config={config}>
      <UniversalChatScreen config={config} />
    </StateManager>
  );
}

