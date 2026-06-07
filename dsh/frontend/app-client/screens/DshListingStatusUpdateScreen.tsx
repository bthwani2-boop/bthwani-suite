import React from 'react';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import { OperationScreenView } from './parts/OperationScreenView';

export type DshListingStatusUpdateScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshListingStatusUpdateScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshListingStatusUpdateScreenProps) {
  return (
    <OperationScreenView
      screenId="listing-status-update"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="تأكيد حالة الإدراج"
      secondaryActionLabel="العودة للرئيسية"
    />
  );
}

export default DshListingStatusUpdateScreen;
