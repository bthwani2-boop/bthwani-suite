import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshCartInitScreenState = 'ready' | 'success' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshCartInitScreenProps = {
  state?: DshCartInitScreenState;
  cartId?: string;
  storeName?: string;
  summaryLabel?: string;
  summaryDescription?: string;
  onOpenCart?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function renderNonReadyState(state: DshCartInitScreenState, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No cart session yet"
        description="Initialize the cart first so the checkout route stays deterministic."
        actionLabel="Back"
        onActionPress={onBack}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="Cart initialization is temporarily paused"
        description="Keep retry and fallback visible until this step is re-enabled."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Cart initialization failed"
      description="Retry first. If the issue continues, go back and reopen the cart flow."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

function renderSuccessSummary(cartId?: string, storeName?: string, summaryLabel?: string, summaryDescription?: string) {
  return (
    <BthSurface tone="success" gap={3}>
      <BthSectionHeader
        title="Cart initialized"
        subtitle="The session is ready for the next checkout step."
      />
      <BthCard
        title={cartId ? `Session ${cartId}` : 'Cart session ready'}
        subtitle={storeName ? `Store context: ${storeName}` : 'Store context confirmed'}
      >
        <BthBox gap={1}>
          {summaryLabel ? <BthText role="bodySm">{summaryLabel}</BthText> : null}
          {summaryDescription ? <BthText role="bodySm" tone="muted">{summaryDescription}</BthText> : null}
        </BthBox>
      </BthCard>
    </BthSurface>
  );
}

export function DshCartInitScreen({
  state = 'ready',
  cartId,
  storeName,
  summaryLabel = 'Open cart',
  summaryDescription = 'Confirm the prepared cart session and continue into the checkout route.',
  onOpenCart,
  onBack,
  onRetry,
  onSupport,
}: DshCartInitScreenProps) {
  if (state !== 'ready' && state !== 'success') {
    return renderNonReadyState(state, onRetry, onBack);
  }

  if (!cartId) {
    return (
      <BthStateView
        stateId="blockingError"
        title="Cart session contract is missing"
        description="A cart id is required before this screen can continue."
      />
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">{state === 'success' ? 'Cart session ready' : 'Initialize cart'}</BthText>
        <BthText role="bodySm" tone="muted">
          {state === 'success'
            ? 'The cart is confirmed and ready to open.'
            : 'Prepare the cart session before moving to the next checkout step.'}
        </BthText>
      </BthBox>

      {state === 'success' ? (
        renderSuccessSummary(cartId, storeName, summaryLabel, summaryDescription)
      ) : (
        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader
            title="Cart session"
            subtitle="Keep the current store and checkout context visible."
          />
          <BthCard
            title={`Session ${cartId}`}
            subtitle={storeName ? `Store: ${storeName}` : 'Store context confirmed'}
          >
            <BthBox gap={1}>
              <BthText role="bodySm">{summaryLabel}</BthText>
              <BthText role="bodySm" tone="muted">
                {summaryDescription}
              </BthText>
            </BthBox>
          </BthCard>
        </BthSurface>
      )}

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Action"
          subtitle="One dominant CTA keeps the route deterministic and easy to recover."
        />
        <BthBox gap={2}>
          <BthButton label="Open cart" onPress={onOpenCart} />
          <BthButton label="Back" tone="secondary" onPress={onBack} />
          <BthButton label="Support" tone="ghost" onPress={onSupport} />
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}
