import React from 'react';
import { DshOperationScreen } from '../parts/OperationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshLocationHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="الموقع الحالي"
      subtitle="تحديد وتحديث موقعك الميداني"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export default DshLocationHubScreen;
