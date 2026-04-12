import React from 'react';
import { BthBox, BthCard, BthListItem, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../patterns/screens/DshOperationScreen';

export type DshCategoriesListItem = { id: string; label: string; subtitle: string; countLabel?: string; };
export type DshCategoriesListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items: DshCategoriesListItem[];
  onOpenCategory?: (categoryId: string) => void;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshCategoriesListScreen({ state = 'ready', items, onOpenCategory, onOpenFavorites, onBack, onRetry, onSupport }: DshCategoriesListScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Categories list" subtitle="Browse categories and keep the next step one tap away." onRetry={onRetry} />;
  }

  if (!items.length) {
    return <DshOperationScreen state="empty" title="Categories list" subtitle="No categories found. Retry or return to discovery." onRetry={onRetry} />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title="Categories list"
      subtitle="Browse categories and keep the next step one tap away."
      content={
        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="Available categories" subtitle="Open one category to continue the discovery journey." count={items.length} />
          <BthBox gap={2}>
            {items.map((item) => (
              <BthListItem key={item.id} title={item.label} subtitle={item.subtitle} meta={item.countLabel ?? ''} onPress={() => onOpenCategory?.(item.id)} />
            ))}
          </BthBox>
          <BthCard title="Favorites" subtitle="Jump to saved items without losing discovery context." footer={<BthText role="caption" tone="muted">One tap to the saved list keeps the flow short.</BthText>} />
        </BthSurface>
      }
      primaryActionLabel="Open favorites"
      onPrimaryAction={onOpenFavorites}
      secondaryActionLabel="Back"
      onSecondaryAction={onBack}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}