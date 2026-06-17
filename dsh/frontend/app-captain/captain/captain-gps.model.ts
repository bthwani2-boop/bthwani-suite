// Canonical location: dsh/frontend/app-captain/captain/captain-gps.model.ts
// Authority: dsh/frontend/app-captain/captain — captain surface-local orchestration pending Phase 2 classification.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CaptainGpsStatus } from '../../shared/delivery/captain/captain.contract';

export function useCaptainGpsModel() {
  const [gpsStatus, setGpsStatus] = React.useState<CaptainGpsStatus>('limited');

  return {
    gpsStatus,
    setGpsStatus,
  };
}
