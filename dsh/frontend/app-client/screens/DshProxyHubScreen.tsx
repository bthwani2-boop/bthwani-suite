import React from 'react';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import { OperationScreenView } from './parts/OperationScreenView';

export type DshProxyHubScreenProps = {
  screenId: 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshProxyHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshProxyHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'proxy-request-tracking' ? 'فتح التتبع' : screenId === 'proxy-request-reject' ? 'رفض الطلب' : screenId === 'proxy-request-approve' ? 'اعتماد الطلب' : screenId === 'proxy-request-review' ? 'مراجعة الطلب' : 'إنشاء طلب'}
      secondaryActionLabel="العودة إلى الطلبات"
    />
  );
}

export default DshProxyHubScreen;
