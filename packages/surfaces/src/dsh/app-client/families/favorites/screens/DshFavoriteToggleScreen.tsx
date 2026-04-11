import React from 'react';
import { BthCard, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../_shared/screens';

export type DshFavoriteToggleScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  itemLabel?: string;
  currentFavorite?: boolean;
  onToggleFavorite?: () => void | Promise<void>;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshFavoriteToggleScreen({ state = 'ready', itemLabel = 'Selected item', currentFavorite = false, onToggleFavorite, onOpenFavorites, onBack, onRetry, onSupport }: DshFavoriteToggleScreenProps) {
  const [isFavorite, setIsFavorite] = React.useState(currentFavorite);
  const [phase, setPhase] = React.useState<'ready' | 'loading' | 'success'>('ready');

  const submit = React.useCallback(async () => {
    setPhase('loading');
    try {
      await Promise.resolve(onToggleFavorite?.());
      setIsFavorite((current) => !current);
      setPhase('success');
    } catch {
      setPhase('ready');
    }
  }, [onToggleFavorite]);

  if (state !== 'ready' && state !== 'success') {
    return <DshOperationScreen state={state} title="Favorite toggle" subtitle="Mark or unmark a favorite without losing context." onRetry={onRetry} />;
  }

  if (phase === 'loading') return <BthStateView stateId="loading" />;

  if (phase === 'success') {
    return (
      <DshOperationScreen
        state="ready"
        title="Favorite updated"
        subtitle="The saved state is now ready for the favorites list."
        content={
          <BthSurface tone="success" gap={3}>
            <BthSectionHeader title="Toggle result" subtitle="Keep the result visible and the next route obvious." />
            <BthCard title={itemLabel} subtitle={isFavorite ? 'Marked as favorite' : 'Removed from favorites'} />
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

  return (
    <DshOperationScreen
      state="ready"
      title="Favorite toggle"
      subtitle="Mark or unmark a favorite without losing context."
      content={
        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="Current item" subtitle="The item stays visible while you toggle its saved state." />
          <BthCard title={itemLabel} subtitle={isFavorite ? 'Currently favorited' : 'Currently not favorited'} />
          <BthText role="caption" tone="muted">Use the save state to shorten future discovery.</BthText>
        </BthSurface>
      }
      primaryActionLabel={isFavorite ? 'Unfavorite' : 'Favorite'}
      onPrimaryAction={() => void submit()}
      secondaryActionLabel="Open favorites"
      onSecondaryAction={onOpenFavorites}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}