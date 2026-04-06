import React from 'react';
import { BthStateView, type BthStateViewProps } from './BthStateView';

export function BthEmptyState(props: Omit<BthStateViewProps, 'kind'>) {
  return <BthStateView kind="empty" {...props} />;
}
