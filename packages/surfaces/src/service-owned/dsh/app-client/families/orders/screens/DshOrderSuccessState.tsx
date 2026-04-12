import React from 'react';
import { BthBox, BthButton, BthStateView } from '@bthwani/ui-kit';

export type DshOrderSuccessStateProps = {
  message?: string;
  nextTarget?: 'tracking' | 'orders-list';
  onNext?: () => void;
};

export function DshOrderSuccessState({
  message = 'Your order is confirmed and ready for tracking.',
  nextTarget = 'tracking',
  onNext,
}: DshOrderSuccessStateProps) {
  const nextLabel = nextTarget === 'tracking' ? 'Track order' : 'Open orders list';

  return (
    <BthBox gap={3}>
      <BthStateView
        stateId="success"
        title="Order submitted"
        description={message}
      />
      <BthButton label={nextLabel} onPress={onNext} />
    </BthBox>
  );
}