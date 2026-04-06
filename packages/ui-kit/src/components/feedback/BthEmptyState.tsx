import React from 'react';
import { BthStateView, type BthStateViewProps } from './BthStateView';

export function BthEmptyState(props: Omit<BthStateViewProps, 'kind' | 'stateId'>) {
  return <BthStateView stateId="empty" {...props} />;
}
