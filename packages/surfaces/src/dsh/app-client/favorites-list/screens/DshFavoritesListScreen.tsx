import React from 'react';
import { BthBox, BthListItem, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../_shared/screens';

export type DshFavoritesListItem = { id: string; name: string; subtitle: string; meta: string; };
export type DshFavoritesListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items: DshFavoritesListItem[];
  onOpenItem?: (itemId: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshFavoritesListScreen({ state = 'ready', items, onOpenItem, onBack, onRetry, onSupport }: DshFavoritesListScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Favorites list" subtitle="Open a favorite or return to discovery." onRetry={onRetry} />;
  }

  if (!items.length) {
    return <DshOperationScreen state="empty" title="Favorites list" subtitle="No saved items yet. Return to discovery or retry." onRetry={onRetry} />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title="Favorites list"
      subtitle="Open a saved item with the shortest possible path."
      content={
        <BthSurface tone="raised" gap={3}>
          <BthBox gap={2}>
            {items.map((item) => (
              <BthListItem key={item.id} title={item.name} subtitle={item.subtitle} meta={item.meta} onPress={() => onOpenItem?.(item.id)} />
            ))}
          </BthBox>
          <BthText role="caption" tone="muted">Saved items stay one tap away from active discovery.</BthText>
        </BthSurface>
      }
      primaryActionLabel="Back"
      onPrimaryAction={onBack}
      secondaryActionLabel="Support"
      onSecondaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}