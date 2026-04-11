import React from 'react';
import { BthBox, BthButton, BthCard, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../_shared/screens';

export type DshStoreGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    etaLabel: string;
    deliveryFeeLabel: string;
  };
  onOpenItems?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshStoreGetScreen({ state = 'ready', store, onOpenItems, onBack, onRetry, onSupport }: DshStoreGetScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Store detail" subtitle="Open the store detail or retry the route." onRetry={onRetry} />;
  }

  if (!store) {
    return <BthStateView stateId="blockingError" title="Store context is missing" description="Provide store data before rendering this screen." />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title={store.name}
      subtitle={store.subtitle}
      content={
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title="Store summary" subtitle="Keep the store context concise and action-first." />
          <BthCard title={store.statusLabel} subtitle={`${store.etaLabel} · ${store.deliveryFeeLabel}`} />
          <BthText role="caption" tone="muted">Open detail first, then continue into item selection and cart flow.</BthText>
        </BthSurface>
      }
      primaryActionLabel="Open detail"
      onPrimaryAction={onOpenItems}
      secondaryActionLabel="Back"
      onSecondaryAction={onBack}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}