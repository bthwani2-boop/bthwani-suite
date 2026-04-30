import React from 'react';
import { Card, SectionHeader, StateView, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';

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

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Favorite toggle" subtitle="Mark or unmark a favorite without losing context." onRetry={onRetry} />;
  }

  if (phase === 'loading') return <StateView stateId="loading" />;

  if (phase === 'success') {
    return (
      <DshOperationScreen
        state="ready"
        title="Favorite updated"
        subtitle="The saved state is now ready for the favorites list."
        content={
          <Surface tone="success" gap={3}>
            <SectionHeader title="Toggle result" subtitle="Keep the result visible and the next route obvious." />
            <Card title={itemLabel} subtitle={isFavorite ? 'Marked as favorite' : 'Removed from favorites'} />
          </Surface>
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
        <Surface tone="raised" gap={3}>
          <SectionHeader title="Current item" subtitle="The item stays visible while you toggle its saved state." />
          <Card title={itemLabel} subtitle={isFavorite ? 'Currently favorited' : 'Currently not favorited'} />
          <Text role="caption" tone="muted">Use the save state to shorten future discovery.</Text>
        </Surface>
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