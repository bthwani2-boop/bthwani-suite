// Canonical location: dsh/frontend/app-captain/captain/captain-profile.model.ts
// Authority: dsh/frontend/app-captain/captain — captain surface-local orchestration pending Phase 2 classification.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CaptainServiceType, CaptainAppMode } from '../../shared/delivery/captain/captain.contract';

export function useCaptainProfileModel() {
  const [activeServiceType, setActiveServiceType] = React.useState<CaptainServiceType>('dsh');
  const [captainAppMode, setCaptainAppMode] = React.useState<CaptainAppMode>('bthwani_captain_mode');

  return {
    activeServiceType,
    setActiveServiceType,
    captainAppMode,
    setCaptainAppMode,
  };
}
