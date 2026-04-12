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
  categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
  deliveryModes?: Array<{ id: 'delivery' | 'pickup'; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  tags?: string[];
  followersLabel?: string;
  priceMatchLabel?: string;
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
          {store.followersLabel ? <BthChip label={store.followersLabel} /> : null}
          {store.priceMatchLabel ? <BthChip label={store.priceMatchLabel} /> : null}
        </BthBox>
      </BthSurface>

      {store.tags?.length ? (
        <BthSurface tone="inset" gap={2}>
          <BthSectionHeader title="Store tags" subtitle="Legacy truth carried forward as compact chips." />
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {store.tags.map((tag) => (
              <BthChip key={`${store.id}-${tag}`} label={tag} />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

      {store.categories?.length ? (
        <BthSurface tone="raised" gap={2}>
          <BthSectionHeader title="Store categories" subtitle="Keep the same category drill-down density as the legacy store screen." count={store.categories.length} />
          <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {store.categories.map((category) => (
              <BthChip
                key={category.id}
                label={`${category.label} (${category.itemCount})`}
                selected={Boolean(category.isPopular)}
              />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

      {store.deliveryModes?.length ? (
        <BthSurface tone="raised" gap={2}>
          <BthSectionHeader title="Delivery modes" subtitle="Expose the available handoff paths instead of hiding them behind the CTA." count={store.deliveryModes.length} />
          <BthBox gap={2}>
            {store.deliveryModes.map((mode) => (
              <BthCard
                key={mode.id}
                title={mode.name}
                subtitle={`${mode.isAvailable ? 'Available' : 'Unavailable'}${mode.estimatedTime ? ` · ${mode.estimatedTime}` : ''}${mode.fee != null ? ` · ${mode.fee} SAR` : ''}`}
              />
            ))}
          </BthBox>
        </BthSurface>
      ) : null}

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