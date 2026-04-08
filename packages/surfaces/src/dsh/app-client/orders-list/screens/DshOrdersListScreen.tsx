import React from 'react';
import { ScrollView } from 'react-native';
import {
  BthBox,
  BthListItem,
  BthSearchField,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshOrderListItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  meta: string;
};

export type DshOrdersListScreenProps = {
  state?: 'ready' | 'loading' | 'empty';
  items: DshOrderListItem[];
  query?: string;
  onQueryChange?: (query: string) => void;
  onOpenOrder?: (orderId: string) => void;
};

export function DshOrdersListScreen({
  state = 'ready',
  items,
  query = '',
  onQueryChange,
  onOpenOrder,
}: DshOrdersListScreenProps) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No orders yet"
        description="New users start here after their first successful order."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <BthBox gap={2}>
        <BthText role="titleLg">Orders list</BthText>
        <BthText role="bodySm" tone="muted">
          Returning-user list pattern with lightweight search. Filters are deferred.
        </BthText>
      </BthBox>

      <BthSurface tone="inset">
        <BthSearchField
          label="Find order"
          value={query}
          onChangeText={onQueryChange}
          hint="Advanced filters and sorting are planned later."
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Recent orders"
          subtitle="Open order should take user back to order details or tracking quickly."
        />
        <BthBox gap={2}>
          {items.map((item) => (
            <BthListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={item.meta}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenOrder?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>
    </ScrollView>
  );
}
