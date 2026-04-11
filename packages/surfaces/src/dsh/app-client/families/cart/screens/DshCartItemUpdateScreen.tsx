import React from 'react';
import { BthBox, BthCard, BthSectionHeader, BthStateView, BthSurface, BthText, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../_shared/screens';

export type DshCartItemUpdateScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  cartId?: string;
  suggestedCartItemId?: string;
  suggestedQuantity?: number;
  suggestedNotes?: string;
  onExecuteUpdate?: (cartItemId: string, quantity: number, notes?: string) => void | Promise<void>;
  onOpenCart?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshCartItemUpdateScreen({
  state = 'ready',
  cartId,
  suggestedCartItemId = '',
  suggestedQuantity = 1,
  suggestedNotes = '',
  onExecuteUpdate,
  onOpenCart,
  onBack,
  onRetry,
  onSupport,
}: DshCartItemUpdateScreenProps) {
  const [cartItemId, setCartItemId] = React.useState(suggestedCartItemId);
  const [quantity, setQuantity] = React.useState(String(Math.max(1, Math.floor(suggestedQuantity))));
  const [notes, setNotes] = React.useState(suggestedNotes);
  const [phase, setPhase] = React.useState<'ready' | 'loading' | 'success'>('ready');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [updatedLabel, setUpdatedLabel] = React.useState<string | null>(null);

  const submit = React.useCallback(async () => {
    const normalizedId = cartItemId.trim();
    const normalizedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    if (!normalizedId) {
      setValidationError('Cart item id is required.');
      return;
    }

    setValidationError(null);
    setPhase('loading');
    try {
      await Promise.resolve(onExecuteUpdate?.(normalizedId, normalizedQuantity, notes.trim() || undefined));
      setUpdatedLabel(`${normalizedId} x${normalizedQuantity}`);
      setPhase('success');
    } catch {
      setPhase('ready');
      setValidationError('The update action failed. Retry to continue.');
    }
  }, [cartItemId, notes, onExecuteUpdate, quantity]);

  if (state !== 'ready' && state !== 'success') {
    return <DshOperationScreen state={state} title="Update cart item" subtitle="Adjust quantity or note, then continue to cart review." onRetry={onRetry} />;
  }

  if (phase === 'loading') return <BthStateView stateId="loading" />;

  if (phase === 'success') {
    return (
      <DshOperationScreen
        state="ready"
        title="Item updated"
        subtitle="The cart reflects the updated quantity and note."
        content={
          <BthSurface tone="success" gap={3}>
            <BthSectionHeader title="Update result" subtitle="Keep the confirmation visible and the next route obvious." />
            <BthCard title={updatedLabel ?? 'Item updated'} subtitle={cartId ? `Cart: ${cartId}` : 'Cart context confirmed'}>
              <BthBox gap={1}>
                <BthText role="bodySm">Quantity updated successfully.</BthText>
                {notes ? <BthText role="bodySm" tone="muted">Notes: {notes}</BthText> : null}
              </BthBox>
            </BthCard>
          </BthSurface>
        }
        primaryActionLabel="Review cart"
        onPrimaryAction={onOpenCart}
        secondaryActionLabel="Back"
        onSecondaryAction={onBack}
        tertiaryActionLabel="Support"
        onTertiaryAction={onSupport}
      />
    );
  }

  return (
    <DshOperationScreen
      state="ready"
      title="Update cart item"
      subtitle="Change one item cleanly, with one dominant CTA and a safe return path."
      content={
        <>
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="Cart context" subtitle="Confirm the cart before changing the item." />
            <BthCard title={cartId ? `Cart ${cartId}` : 'Cart context confirmed'} subtitle="Keep the cart id visible before mutation." />
          </BthSurface>
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="Item details" subtitle="Validation is explicit before the update action runs." />
            <BthTextField label="Cart item id" value={cartItemId} onChangeText={(value) => { setCartItemId(value); setValidationError(null); }} placeholder="Enter cart item id" error={validationError ?? undefined} />
            <BthTextField label="Quantity" value={quantity} onChangeText={(value) => { setQuantity(value); setValidationError(null); }} keyboardType="number-pad" placeholder="1" hint="Keep the quantity at one or more." />
            <BthTextField label="Notes" value={notes} onChangeText={(value) => { setNotes(value); setValidationError(null); }} placeholder="Optional update note" hint="Short practical note only." />
          </BthSurface>
        </>
      }
      primaryActionLabel="Update item"
      onPrimaryAction={() => void submit()}
      secondaryActionLabel="Back"
      onSecondaryAction={onBack}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}
