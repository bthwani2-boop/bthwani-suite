import React from 'react';
import { DshBenefitsHubScreen } from './BenefitsScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshLoyaltyHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshBenefitsHubScreen
      initialSection="loyalty"
      onBack={onBack}
      onRetry={onRetry}
      state={state}
    />
  );
}

export default DshLoyaltyHubScreen;
