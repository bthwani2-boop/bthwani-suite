import React from 'react';
import { BthBox, BthCard, BthMobileScrollView, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../_shared/screens';

export type DshHomeGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  summaryTitle?: string;
  summarySubtitle?: string;
  onOpenList?: () => void;
  onOpenFavorites?: () => void;
  onOpenSearch?: () => void;
  onRetry?: () => void;
};

export function DshHomeGetScreen({ state = 'ready', summaryTitle = 'Home discovery', summarySubtitle = 'Keep one clear entry point into the delivery journey.', onOpenList, onOpenFavorites, onOpenSearch, onRetry }: DshHomeGetScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Home get" subtitle="Open the discovery home or retry the route." onRetry={onRetry} />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title="Home get"
      subtitle="Open the discovery home with a compact next-action setup."
      content={
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title={summaryTitle} subtitle={summarySubtitle} />
          <BthCard title="Fast entry" subtitle="Use the home slice to jump into categories, search, or favorites." />
          <BthText role="caption" tone="muted">This is a get-view surface with no runtime binding in this phase.</BthText>
        </BthSurface>
      }
      primaryActionLabel="Open categories"
      onPrimaryAction={onOpenList}
      secondaryActionLabel="Favorites"
      onSecondaryAction={onOpenFavorites}
      tertiaryActionLabel="Search"
      onTertiaryAction={onOpenSearch}
      onRetry={onRetry}
    />
  );
}