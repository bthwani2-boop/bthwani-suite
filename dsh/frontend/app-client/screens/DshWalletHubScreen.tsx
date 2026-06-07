import React from 'react';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';
import { WltHomeGetScreen } from '../../../../wlt/frontend/app-client/home/screens/WltHomeGetScreen';

export type DshMySpaceSubScreenProps = {
  state?: DshOperationScreenState;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshWalletHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  if (state !== 'ready') {
    return (
      <DshOperationScreen
        state={state}
        title="المحفظة"
        subtitle="الرصيد، الاسترداد، وطرق الدفع"
        primaryActionLabel="العودة لمساحتي"
        onPrimaryAction={onBack}
        onRetry={onRetry}
      />
    );
  }

  return <WltHomeGetScreen onBack={onBack} />;
}

export default DshWalletHubScreen;
