import React from 'react';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshAddressesHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="العناوين المحفوظة"
      subtitle="إدارة مواقع التوصيل والاستلام"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export default DshAddressesHubScreen;
