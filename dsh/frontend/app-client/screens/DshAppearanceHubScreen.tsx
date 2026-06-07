import React from 'react';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshAppearanceHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="المظهر"
      subtitle="فاتح أبيض أو داكن زجاجي"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export default DshAppearanceHubScreen;
