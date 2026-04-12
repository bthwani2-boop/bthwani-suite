import React from 'react';
import { BthCard, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../patterns/screens/DshOperationScreen';

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
    return <DshOperationScreen state={state} title="Store overview" subtitle="Restore the store snapshot, then continue to item selection." onRetry={onRetry} />;
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
          <BthSectionHeader title="Store overview" subtitle="Keep the store context concise, then move directly into item selection." />
          <BthCard title={store.statusLabel} subtitle={`${store.etaLabel} · ${store.deliveryFeeLabel}`} />
          <BthText role="caption" tone="muted">This route is a compact store snapshot. Continue directly into the menu without adding another summary layer.</BthText>
        </BthSurface>
      }
      primaryActionLabel="Open menu"
      onPrimaryAction={onOpenItems}
      secondaryActionLabel="Back"
      onSecondaryAction={onBack}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}