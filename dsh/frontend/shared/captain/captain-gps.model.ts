// Canonical location: dsh/frontend/shared/captain/captain-gps.model.ts
// Authority: dsh/frontend/shared/captain — captain GPS status.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';

export function useCaptainGpsModel() {
  const [gpsStatus, setGpsStatus] = React.useState<'limited' | 'active' | 'inactive'>('limited');

  return {
    gpsStatus,
    setGpsStatus,
  };
}
