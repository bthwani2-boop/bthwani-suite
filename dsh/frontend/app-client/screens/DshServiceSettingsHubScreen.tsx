import React from 'react';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import { OperationScreenView } from './parts/OperationScreenView';

export type DshServiceSettingsHubScreenProps = {
  screenId: 'listing-status-update' | 'service-modes-resolve' | 'zone-set';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshServiceSettingsHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshServiceSettingsHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد الإعدادات"
      secondaryActionLabel="العودة للرئيسية"
    />
  );
}

export default DshServiceSettingsHubScreen;
