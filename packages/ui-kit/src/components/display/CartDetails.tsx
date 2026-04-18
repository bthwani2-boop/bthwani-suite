import React from 'react';
import { View, FlatList } from 'react-native';
import { BthSheetFrame } from '../overlays/BthSheetFrame';
import { BthListItem } from './BthListItem';
import { BthSurface } from '../../primitives';
import { BthText } from '../../primitives';
import { BthButton } from '../actions/BthButton';
import { spacing } from '../../foundation/tokens';

export type CartLine = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  qty: number;
};

export type CartDetailsProps = {
  visible: boolean;
  onClose: () => void;
  items: CartLine[];
  currency?: string;
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: () => void;
};

export function CartDetails({ visible, onClose, items, currency = 'SAR', onChangeQty, onRemove, onCheckout }: CartDetailsProps) {
  const format = (n: number) => {
    try {
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(n);
    } catch {
      return `${n} ${currency}`;
    }
  };

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <BthSheetFrame visible={visible} onClose={onClose} title={`Cart — ${format(total)}`}>
      <View style={{ gap: spacing[3] }}>
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <BthListItem
              title={item.title}
              subtitle={item.subtitle}
              meta={`${item.qty} × ${format(item.price)} = ${format(item.qty * item.price)}`}
              onPress={() => undefined}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing[2] }} />}
        />

        <BthSurface tone="inset" gap={2}>
          <BthText role="bodyMd">Order total</BthText>
          <BthText role="titleSm">{format(total)}</BthText>
          <View style={{ flexDirection: 'row', gap: spacing[3] }}>
            <BthButton label="Proceed to checkout" onPress={() => onCheckout && onCheckout()} />
            <BthButton label="Close" tone="secondary" onPress={onClose} />
          </View>
        </BthSurface>
      </View>
    </BthSheetFrame>
  );
}

export default CartDetails;
