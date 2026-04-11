import React from 'react';
import { BthBox, BthCard, BthListItem, BthSectionHeader, BthStateView, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../_shared/screens';

export type DshCategoryGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  category?: { id: string; label: string; subtitle: string; summary: string; itemCountLabel?: string; subcategories?: Array<{ id: string; label: string; subtitle: string }>; };
  onOpenList?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

export function DshCategoryGetScreen({ state = 'ready', category, onOpenList, onBack, onRetry, onSupport }: DshCategoryGetScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="Category detail" subtitle="Open the category detail or return to the list." onRetry={onRetry} />;
  }

  if (!category) {
    return <BthStateView stateId="blockingError" title="Category context is missing" description="Provide category data before rendering this screen." />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title={category.label}
      subtitle={category.subtitle}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthSectionHeader title="Category summary" subtitle="Keep the detail brief and decision-friendly." />
            <BthCard title={category.summary} subtitle={category.itemCountLabel ?? 'Item count available'} />
            <BthText role="caption" tone="muted">Use the category to continue into the next discovery step.</BthText>
          </BthSurface>

          {category.subcategories?.length ? (
            <BthSurface tone="raised" gap={2}>
              <BthSectionHeader title="Subcategories" subtitle="These items were present in the legacy seed and are now carried as test data." count={category.subcategories.length} />
              <BthBox gap={2}>
                {category.subcategories.map((subCategory) => (
                  <BthListItem
                    key={subCategory.id}
                    title={subCategory.label}
                    subtitle={subCategory.subtitle}
                    meta={subCategory.id}
                  />
                ))}
              </BthBox>
            </BthSurface>
          ) : null}
        </BthBox>
      }
      primaryActionLabel="Open list view"
      onPrimaryAction={onOpenList}
      secondaryActionLabel="Back"
      onSecondaryAction={onBack}
      tertiaryActionLabel="Support"
      onTertiaryAction={onSupport}
      onRetry={onRetry}
    />
  );
}