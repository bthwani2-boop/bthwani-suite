import React from 'react';
import { BthBox, BthButton, BthCard, BthListItem, BthMobileScrollView, BthSearchField, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../patterns/screens/DshOperationScreen';

export type DshSearchResult = { id: string; title: string; subtitle: string; meta?: string };
export type DshSearchScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  query?: string;
  results: DshSearchResult[];
  onQueryChange?: (query: string) => void;
  onOpenResult?: (resultId: string) => void;
  onOpenCategories?: () => void;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

export function DshSearchScreen({ state = 'ready', query = '', results, onQueryChange, onOpenResult, onOpenCategories, onOpenFavorites, onBack, onRetry }: DshSearchScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Search" subtitle="Find stores, categories, or saved items quickly." onRetry={onRetry} />;
  }

  const hasQuery = query.trim().length > 0;

  return (
    <DshOperationScreen
      state="ready"
      title="Search"
      subtitle="Find stores, categories, or saved items quickly."
      content={
        <BthSurface tone="inset" gap={3}>
          <BthSearchField label="Search" value={query} onChangeText={onQueryChange} hint="Use a store name, category, or item term." />
          <BthSectionHeader
            title={hasQuery ? 'Matching stores' : 'Browse stores'}
            subtitle={hasQuery ? 'The list narrows as you type.' : 'Start typing to narrow the current discovery set.'}
            count={results.length}
          />
          <BthBox layoutDirection="row" gap={2}>
            <BthButton label="Categories" tone="secondary" onPress={onOpenCategories} />
            <BthButton label="Favorites" tone="secondary" onPress={onOpenFavorites} />
          </BthBox>
          {results.length ? (
            <BthBox gap={2}>
              {results.map((result) => (
                <BthListItem key={result.id} title={result.title} subtitle={result.subtitle} meta={result.meta} onPress={() => onOpenResult?.(result.id)} />
              ))}
            </BthBox>
          ) : (
            <BthCard title="No results yet" subtitle="Adjust the query or jump back to discovery.">
              <BthBox layoutDirection="row" gap={2}>
                <BthButton label="Categories" tone="secondary" onPress={onOpenCategories} />
                <BthButton label="Favorites" tone="secondary" onPress={onOpenFavorites} />
              </BthBox>
            </BthCard>
          )}
          <BthText role="caption" tone="muted">
            Search stays within the current discovery set so you can move to a store in one step.
          </BthText>
        </BthSurface>
      }
      primaryActionLabel="Back"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}
