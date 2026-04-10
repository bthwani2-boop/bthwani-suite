import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthChip,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshStoreDetailData = {
  id: string;
  name: string;
  subtitle: string;
  statusLabel: string;
  etaLabel: string;
  deliveryFeeLabel: string;
  highlights: string[];
};

export type DshStoreDetailScreenProps = {
  state?: 'ready' | 'loading' | 'error';
  store?: DshStoreDetailData;
  onOpenMenu?: (storeId: string) => void;
  onStartDelivery?: (storeId: string) => void;
  onOpenTracking?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(state: 'loading' | 'error', onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Store detail is unavailable"
      description="Retry to restore store context before creating the order."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshStoreDetailScreen({
  state = 'ready',
  store,
  onOpenMenu,
  onStartDelivery,
  onOpenTracking,
  onRetry,
}: DshStoreDetailScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  if (!store) {
    return (
      <BthStateView
        stateId="blockingError"
        title="Store context is missing"
        description="Provide store detail data before rendering this screen."
      />
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title={store.name}
          subtitle={store.subtitle}
          trailing={<BthChip label={store.statusLabel} selected />}
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthChip label={store.etaLabel} selected />
          <BthChip label={store.deliveryFeeLabel} />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Store highlights"
          subtitle="Keep details concise and confidence-building."
        />
        <BthBox gap={2}>
          {store.highlights.map((highlight, index) => (
            <BthCard
              key={`${store.id}-highlight-${index}`}
              title={highlight}
              subtitle="This highlight supports first-order confidence."
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Next action"
          subtitle="One dominant CTA, one safe fallback path."
        />
        <BthBox layoutDirection="row" gap={2}>
          <BthButton
            label="Open menu"
            tone="secondary"
            onPress={() => onOpenMenu?.(store.id)}
          />
          <BthButton
            label="Start delivery"
            onPress={() => onStartDelivery?.(store.id)}
          />
        </BthBox>
        <BthButton
          label="Open tracking"
          tone="ghost"
          onPress={onOpenTracking}
        />
        <BthText role="caption" tone="muted">
          This screen is UI/UX/Flow only and intentionally excludes API runtime logic.
        </BthText>
      </BthSurface>
    </BthMobileScrollView>
  );
}