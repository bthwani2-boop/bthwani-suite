import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';
import { StateManager } from '@bthwani/states';
import { UniversalChatScreen } from '@bthwani/surfaces/shared/chat';
import { useI18n } from '@bthwani/ui-kit';

export interface DshSupportChatScreenProps {
  StateManagerComponent?: React.ElementType;
  UniversalChatScreenComponent?: React.ElementType;
}

export const DshSupportChatScreen: React.FC<DshSupportChatScreenProps> = ({
  StateManagerComponent = StateManager,
  UniversalChatScreenComponent = UniversalChatScreen,
}) => {
  const { t } = useI18n();
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
      title: t('web.control panel.support.DshSupportChatScreen.Dsh'),
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
    <StateManagerComponent config={config}>
      <UniversalChatScreenComponent config={config} />
    </StateManagerComponent>
  );
};

