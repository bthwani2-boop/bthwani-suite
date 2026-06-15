// Canonical location: dsh/frontend/shared/captain/captain-pod.model.ts
// Authority: dsh/frontend/shared/captain — PoD (proof-of-delivery) upload state and flow trigger.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CaptainAppMode } from './captain.contract';
import type { DshCaptainSurfaceState } from './captain.surface.types';
import { getCaptainLifecycleForOrderStage } from '../delivery/delivery.policy';

type SetField = <k extends keyof DshCaptainSurfaceState>(
  key: k,
  value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
) => void;

export function useCaptainPodModel({
  captainAppMode,
  set,
}: {
  captainAppMode: CaptainAppMode;
  set: SetField;
}) {
  const openStoreCourierProof = React.useCallback(() => {
    set('captainPodState', 'ready');
    set('route', getCaptainLifecycleForOrderStage('proof', captainAppMode === 'store_courier_mode').captainRoute);
  }, [captainAppMode, set]);

  const resetPodFields = React.useCallback(() => {
    set('captainPodState', 'ready');
    set('captainPodPhotoUri', undefined);
    set('captainPodMediaKey', undefined);
  }, [set]);

  return { openStoreCourierProof, resetPodFields };
}
