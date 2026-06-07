import React from 'react';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import { OperationScreenView } from './parts/OperationScreenView';

export type DshZoneSetScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshZoneSetScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshZoneSetScreenProps) {
  return (
    <OperationScreenView
      screenId="zone-set"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد النطاق"
      secondaryActionLabel="العودة للرئيسية"
    />
  );
}

export default DshZoneSetScreen;
