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
  BthTextField,
} from '@bthwani/ui-kit';

export type DshCartItemRemoveScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'success';

export type DshCartItemRemoveScreenProps = {
  state?: DshCartItemRemoveScreenState;
  cartId?: string;
  storeName?: string;
  suggestedCartItemId?: string;
  suggestedItemLabel?: string;
  onExecuteRemove?: (cartItemId: string) => void | Promise<void>;
  onOpenCart?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function renderNonReadyState(state: DshCartItemRemoveScreenState, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No cart item is selected"
        description="Choose the exact item id before trying to remove it."
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
        title="Remove item is temporarily paused"
        description="Keep retry and fallback visible until this step is re-enabled."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Item could not be removed"
      description="Retry first. If the issue continues, go back and re-open the cart flow."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export function DshCartItemRemoveScreen({
  state = 'ready',
  cartId,
  storeName,
  suggestedCartItemId = '',
  suggestedItemLabel = 'Selected item',
  onExecuteRemove,
  onOpenCart,
  onBack,
  onRetry,
  onSupport,
}: DshCartItemRemoveScreenProps) {
  const [cartItemId, setCartItemId] = React.useState(suggestedCartItemId);
  const [phase, setPhase] = React.useState<'ready' | 'loading' | 'success'>('ready');
  const [removedItemId, setRemovedItemId] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (state === 'ready') {
      setPhase('ready');
    }
  }, [state]);

  const handleSubmit = React.useCallback(async () => {
    const normalizedCartItemId = cartItemId.trim();
    if (!normalizedCartItemId) {
      setValidationError('Cart item id is required.');
      return;
    }

    setValidationError(null);
    setPhase('loading');

    try {
      await Promise.resolve(onExecuteRemove?.(normalizedCartItemId));
      setRemovedItemId(normalizedCartItemId);
      setPhase('success');
    } catch {
      setPhase('ready');
      setValidationError('The remove action failed. Retry to continue.');
    }
  }, [cartItemId, onExecuteRemove]);

  if (state !== 'ready' && state !== 'success') {
    return renderNonReadyState(state, onRetry, onBack);
  }

  if (phase === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'success' || phase === 'success') {
    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthBox gap={2}>
          <BthText role="titleLg">Item removed</BthText>
          <BthText role="bodySm" tone="muted">
            The cart is ready for a fresh review after the removal step.
          </BthText>
        </BthBox>

        <BthSurface tone="success" gap={3}>
          <BthSectionHeader
            title="Remove result"
            subtitle="Keep the confirmation explicit and the next route obvious."
          />
          <BthCard
            title={removedItemId ? `Removed ${removedItemId}` : 'Item removed'}
            subtitle={storeName ? `Store: ${storeName}` : 'Store context confirmed'}
          >
            <BthBox gap={1}>
              <BthText role="bodySm">{suggestedItemLabel}</BthText>
              {cartId ? <BthText role="bodySm" tone="muted">Cart: {cartId}</BthText> : null}
            </BthBox>
          </BthCard>
        </BthSurface>

        <BthSurface tone="inset" gap={3}>
          <BthSectionHeader
            title="Next step"
            subtitle="Return to the cart summary to continue the checkout review."
          />
          <BthBox gap={2}>
            <BthButton label="Review cart" onPress={onOpenCart} />
            <BthButton label="Back" tone="secondary" onPress={onBack} />
            <BthButton label="Support" tone="ghost" onPress={onSupport} />
          </BthBox>
        </BthSurface>
      </BthMobileScrollView>
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Remove item from cart</BthText>
        <BthText role="bodySm" tone="muted">
          Remove one item id, then return to the cart view with the shortest recovery path.
        </BthText>
      </BthBox>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Cart context"
          subtitle="The current store and cart are visible before removal."
        />
        <BthCard
          title={suggestedItemLabel}
          subtitle={storeName ? `Store: ${storeName}` : 'Store context confirmed'}
        >
          <BthBox gap={1}>
            {cartId ? <BthText role="bodySm">Cart: {cartId}</BthText> : null}
            <BthText role="bodySm" tone="muted">
              Use the exact cart item id to keep removal deterministic.
            </BthText>
          </BthBox>
        </BthCard>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Item to remove"
          subtitle="Validation is explicit before the remove action runs."
        />
        <BthTextField
          label="Cart item id"
          value={cartItemId}
          onChangeText={(value) => {
            setCartItemId(value);
            setValidationError(null);
          }}
          placeholder="Enter cart item id"
          error={validationError ?? undefined}
        />
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Action"
          subtitle="Primary CTA performs the removal, secondary actions stay recovery-safe."
        />
        <BthBox gap={2}>
          <BthButton label="Remove item" onPress={() => void handleSubmit()} />
          <BthButton label="Back" tone="secondary" onPress={onBack} />
          <BthButton label="Support" tone="ghost" onPress={onSupport} />
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}