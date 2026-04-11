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

export type DshCartItemAddScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled' | 'success';

export type DshCartItemAddSubmission = {
  itemName: string;
  quantity: number;
  specialInstructions?: string;
};

export type DshCartItemAddScreenProps = {
  state?: DshCartItemAddScreenState;
  cartId?: string;
  storeName?: string;
  suggestedItemName?: string;
  suggestedQuantity?: number;
  suggestedInstructions?: string;
  onExecuteAdd?: (submission: DshCartItemAddSubmission) => void | Promise<void>;
  onOpenCart?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function renderNonReadyState(state: DshCartItemAddScreenState, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No item is selected"
        description="Choose an item before trying to add it to the cart."
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
        title="Add item is temporarily paused"
        description="Keep retry and fallback visible until this step is re-enabled."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Item could not be added"
      description="Retry first. If the issue continues, go back and re-open the item flow."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

function normalizeQuantity(rawValue: string, fallback: number) {
  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return Math.max(1, Math.floor(fallback) || 1);
  }

  return parsed;
}

export function DshCartItemAddScreen({
  state = 'ready',
  cartId,
  storeName,
  suggestedItemName = '',
  suggestedQuantity = 1,
  suggestedInstructions = '',
  onExecuteAdd,
  onOpenCart,
  onBack,
  onRetry,
  onSupport,
}: DshCartItemAddScreenProps) {
  const [itemName, setItemName] = React.useState(suggestedItemName);
  const [quantity, setQuantity] = React.useState(String(Math.max(1, Math.floor(suggestedQuantity))));
  const [specialInstructions, setSpecialInstructions] = React.useState(suggestedInstructions);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<'ready' | 'loading' | 'success'>('ready');
  const [submission, setSubmission] = React.useState<DshCartItemAddSubmission | null>(null);

  React.useEffect(() => {
    if (state === 'ready') {
      setPhase('ready');
    }
  }, [state]);

  const handleSubmit = React.useCallback(async () => {
    const normalizedItemName = itemName.trim();
    const normalizedQuantity = normalizeQuantity(quantity, suggestedQuantity);

    if (!normalizedItemName) {
      setValidationError('Item name is required.');
      return;
    }

    setValidationError(null);
    setPhase('loading');

    const nextSubmission: DshCartItemAddSubmission = {
      itemName: normalizedItemName,
      quantity: normalizedQuantity,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    try {
      await Promise.resolve(onExecuteAdd?.(nextSubmission));
      setSubmission(nextSubmission);
      setPhase('success');
    } catch {
      setPhase('ready');
      setValidationError('The add action failed. Retry to continue.');
    }
  }, [itemName, onExecuteAdd, quantity, specialInstructions, suggestedQuantity]);

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
          <BthText role="titleLg">Item added</BthText>
          <BthText role="bodySm" tone="muted">
            The cart now reflects the new item and is ready for the next cart action.
          </BthText>
        </BthBox>

        <BthSurface tone="success" gap={3}>
          <BthSectionHeader
            title="Add result"
            subtitle="Keep the confirmation and next action explicit."
          />
          <BthCard
            title={submission ? submission.itemName : 'Item added'}
            subtitle={storeName ? `Store: ${storeName}` : 'Store context confirmed'}
          >
            <BthBox gap={1}>
              <BthText role="bodySm">
                Quantity: {submission?.quantity ?? 1}
              </BthText>
              {submission?.specialInstructions ? (
                <BthText role="bodySm" tone="muted">
                  Notes: {submission.specialInstructions}
                </BthText>
              ) : null}
              {cartId ? (
                <BthText role="bodySm" tone="muted">
                  Cart: {cartId}
                </BthText>
              ) : null}
            </BthBox>
          </BthCard>
        </BthSurface>

        <BthSurface tone="inset" gap={3}>
          <BthSectionHeader
            title="Next step"
            subtitle="Continue into the item removal step, or return to the cart summary if needed."
          />
          <BthBox gap={2}>
            <BthButton label="Continue" onPress={onOpenCart} />
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
        <BthText role="titleLg">Add item to cart</BthText>
        <BthText role="bodySm" tone="muted">
          Keep the add flow narrow: one item, one quantity, one optional note.
        </BthText>
      </BthBox>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Cart context"
          subtitle="The current store and cart are shown before the mutation step."
        />
        <BthCard
          title={suggestedItemName || 'Selected item'}
          subtitle={storeName ? `Store: ${storeName}` : 'Store context confirmed'}
        >
          <BthBox gap={1}>
            {cartId ? <BthText role="bodySm">Cart: {cartId}</BthText> : null}
            <BthText role="bodySm" tone="muted">
              Add the selected item, then return to the cart view for review.
            </BthText>
          </BthBox>
        </BthCard>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Item details"
          subtitle="Validation is explicit before the add action runs."
        />
        <BthTextField
          label="Item name"
          value={itemName}
          onChangeText={(value) => {
            setItemName(value);
            setValidationError(null);
          }}
          placeholder="Enter or confirm item name"
          error={validationError ?? undefined}
        />
        <BthTextField
          label="Quantity"
          value={quantity}
          onChangeText={(value) => {
            setQuantity(value);
            setValidationError(null);
          }}
          keyboardType="number-pad"
          placeholder="1"
          hint="Keep the quantity explicit and at least one."
        />
        <BthTextField
          label="Special instructions"
          value={specialInstructions}
          onChangeText={(value) => {
            setSpecialInstructions(value);
            setValidationError(null);
          }}
          placeholder="Optional note"
          hint="Short practical instructions only."
        />
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Action"
          subtitle="Primary CTA performs the add action, secondary actions stay recovery-safe."
        />
        <BthBox gap={2}>
          <BthButton label="Add item" onPress={() => void handleSubmit()} />
          <BthButton label="Back" tone="secondary" onPress={onBack} />
          <BthButton label="Support" tone="ghost" onPress={onSupport} />
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}
