import React from 'react';
import { DshBenefitsHubScreen } from './BenefitsScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshSubscriptionsHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshBenefitsHubScreen
      initialSection="subscription"
      onBack={onBack}
      onRetry={onRetry}
      state={state}
    />
  );
}

export default DshSubscriptionsHubScreen;
