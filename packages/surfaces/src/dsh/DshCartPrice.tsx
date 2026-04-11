import React from 'react';
import { BthBox, BthButton, BthCard, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';

export type DshCartPriceLineItem = {
  id: string;
  label: string;
  value: string;
};

export type DshCartPriceScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshCartPriceProps = {
  state?: DshCartPriceScreenState;
  title?: string;
  subtitle?: string;
  priceLines: DshCartPriceLineItem[];
  totalLabel?: string;
  totalValue?: string;
  footnote?: string;
  onOpenCart?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function renderNonReadyState(state: DshCartPriceScreenState, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return <BthStateView stateId="empty" title="No price lines yet" description="Add one or more priced lines before opening the cart." actionLabel="Retry" onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <BthStateView stateId="warning" title="Pricing is temporarily paused" description="Retry remains visible when this step is re-enabled." actionLabel="Retry" onActionPress={onRetry} />;
  }

  return <BthStateView stateId="recoverableError" title="Price summary unavailable" description="Retry first, then continue with the cart flow." actionLabel="Retry" onActionPress={onRetry} />;
}

export function DshCartPrice({
  state = 'ready',
  title = 'Cart price',
  subtitle = 'Review the price snapshot before opening the cart.',
  priceLines,
  totalLabel = 'Total',
  totalValue = '-',
  footnote = 'Keep the pricing summary compact and easy to scan.',
  onOpenCart,
  onBack,
  onRetry,
  onSupport,
}: DshCartPriceProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry);
  }

  return (
    <BthSurface tone="raised" gap={3}>
      <BthSectionHeader title={title} subtitle={subtitle} />
      <BthBox gap={2}>
        {priceLines.map((line) => (
          <BthCard key={line.id} title={line.label} subtitle={line.value} />
        ))}
      </BthBox>
      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader title={totalLabel} subtitle="One clear total keeps the next action obvious." />
        <BthCard title={totalValue} subtitle={footnote} />
        <BthBox gap={2}>
          <BthButton label="Open cart" onPress={onOpenCart} />
          <BthButton label="Back" tone="secondary" onPress={onBack} />
          <BthButton label="Support" tone="ghost" onPress={onSupport} />
        </BthBox>
        <BthText role="caption" tone="muted">
          Pricing is UI-only in this phase.
        </BthText>
      </BthSurface>
    </BthSurface>
  );
}