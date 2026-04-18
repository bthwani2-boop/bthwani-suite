import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { BthCard } from './BthCard';
import { BthText } from '../../primitives';
import { spacing } from '../../foundation/tokens';
import { BthButton } from '../actions/BthButton';

export type CartSummaryProps = {
  totalAmount: number;
  currency?: string;
  itemsCount?: number;
  storeName?: string;
  deliveryStatus?: string;
  onOpenCart?: () => void;
  onBack?: () => void;
  formatAmount?: (n: number) => string;
  showActions?: boolean;
  store?: {
    id?: string;
    name?: string;
    subtitle?: string;
    ratingLabel?: string;
    statusLabel?: string;
  };
  order?: {
    id?: string;
    title?: string;
    subtitle?: string;
    meta?: string;
    statusLabel?: string;
  };
};

export function CartSummary({
  totalAmount,
  currency = 'SAR',
  itemsCount,
  storeName,
  deliveryStatus,
  onOpenCart,
  onBack,
  formatAmount
  , showActions = true,
  store,
  order,
}: CartSummaryProps) {
  const format =
    formatAmount ??
    ((n: number) => {
      try {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(n);
      } catch {
        return `${n} ${currency}`;
      }
    });

  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ gap: spacing[3] }}>
      <BthCard title="Cart overview" subtitle="A compact view of everything in your cart.">
        <View style={{ gap: spacing[2], marginTop: spacing[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BthText role="bodyMd">Items</BthText>
            <BthText role="bodySm" tone="muted">{itemsCount ?? (order ? 1 : 0)} items</BthText>
          </View>

          {store || storeName ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <BthText role="bodyMd">Store</BthText>
              <BthText role="bodySm" tone="muted">{store?.name ?? storeName}</BthText>
            </View>
          ) : null}

          {deliveryStatus || store?.statusLabel ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <BthText role="bodyMd">Delivery status</BthText>
              <BthText role="bodySm" tone="muted">{deliveryStatus ?? store?.statusLabel}</BthText>
            </View>
          ) : null}

          {order ? (
            <Pressable onPress={() => setExpanded((s) => !s)}>
              <View style={{ marginTop: spacing[2] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BthText role="bodyMd">Order</BthText>
                  <BthText role="bodySm" tone="muted">{order.title ?? ''}</BthText>
                </View>

                {expanded ? (
                  <View style={{ marginTop: spacing[2], gap: spacing[2] }}>
                    {order.subtitle ? <BthText role="bodySm">{order.subtitle}</BthText> : null}
                    {order.meta ? <BthText role="caption" tone="muted">{order.meta}</BthText> : null}
                  </View>
                ) : null}
              </View>
            </Pressable>
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[2] }}>
            <BthText role="titleSm">Total</BthText>
            <BthText role="titleSm">{format(totalAmount)}</BthText>
          </View>
        </View>
      </BthCard>

      <BthCard title="Cart context confirmed" subtitle="One clear total keeps the next action obvious.">
        <View style={{ gap: spacing[3], marginTop: spacing[2] }}>
          <BthText role="bodyMd" align="center">Initialize the cart session before moving into the checkout route.</BthText>

          {showActions ? (
            <View style={{ gap: spacing[2], marginTop: spacing[3] }}>
              <BthButton label={`Open cart — ${format(totalAmount)}`} onPress={onOpenCart} />
              <BthButton label="Back" tone="secondary" onPress={onBack} />
            </View>
          ) : null}
        </View>
      </BthCard>
    </View>
  );
}

export default CartSummary;
