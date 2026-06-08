import React from 'react';
import { DshAddressLocationScreen } from './AddressLocationScreen';
import type { DshMySpaceSubScreenProps } from './DshWalletHubScreen';

export function DshLocationHubScreen({ onBack }: DshMySpaceSubScreenProps) {
  return <DshAddressLocationScreen onBack={onBack} />;
}

export default DshLocationHubScreen;
