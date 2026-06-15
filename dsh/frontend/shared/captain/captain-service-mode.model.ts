// Canonical location: dsh/frontend/shared/captain/captain-service-mode.model.ts
// Authority: dsh/frontend/shared/captain — service type and store-courier mode switching.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CaptainServiceType, CaptainAppMode } from './captain.contract';
import type { DshCaptainSurfaceState } from './captain.surface.types';

type SetField = <k extends keyof DshCaptainSurfaceState>(
  key: k,
  value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
) => void;

export function useCaptainServiceModeModel({ set }: { set: SetField }) {
  const handleSelectServiceType = React.useCallback((typeId: string) => {
    set('activeServiceType', typeId === 'amn' ? 'amn' : ('dsh' as CaptainServiceType));
    set('route', 'home');
    set('inboxState', 'ready');
    set('activeOrderId', '');
    set('activeOrderExpanded', false);
    set('isPickupSheetVisible', false);
    set('isDeliverySheetVisible', false);
  }, [set]);

  const toggleStoreCourierMode = React.useCallback((next: boolean) => {
    set('captainAppMode', next ? 'store_courier_mode' : ('bthwani_captain_mode' as CaptainAppMode));
    set('route', 'home');
  }, [set]);

  return { handleSelectServiceType, toggleStoreCourierMode };
}
