// Canonical location: dsh/frontend/app-captain/captain/captain-availability.model.ts
// Authority: dsh/frontend/app-captain/captain — captain surface-local orchestration pending Phase 2 classification.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CaptainAvailabilityStatus } from '../../shared/delivery/captain/captain.contract';

export function useCaptainAvailabilityModel() {
  const [captainAvailabilityStatus, setCaptainAvailabilityStatus] =
    React.useState<CaptainAvailabilityStatus>('available');

  const toggleAvailability = React.useCallback(() => {
    setCaptainAvailabilityStatus((current) => (current === 'available' ? 'unavailable' : 'available'));
  }, []);

  return {
    captainAvailabilityStatus,
    setCaptainAvailabilityStatus,
    toggleAvailability,
  };
}
