import React from 'react';
import { DshBenefitsHubScreen } from './BenefitsScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshCommercialHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshBenefitsHubScreen
      initialSection="offers"
      onBack={onBack}
      onRetry={onRetry}
      state={state}
    />
  );
}

export default DshCommercialHubScreen;
