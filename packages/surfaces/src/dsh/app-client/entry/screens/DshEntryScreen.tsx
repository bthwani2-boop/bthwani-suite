import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthDashboardShell,
  BthStateView,
  BthText,
} from '@bthwani/ui-kit';

export type DshEntryScreenState = 'ready' | 'loading' | 'empty';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  onStartPress?: () => void;
  onBrowsePress?: () => void;
  onTrackOrdersPress?: () => void;
};

function renderHero(state: DshEntryScreenState, onStartPress?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        actionLabel="Start delivery"
        onActionPress={onStartPress}
      />
    );
  }

  return (
    <BthCard
      title="Deliver anything fast"
      subtitle="Start from one focused entry point for discovery, action, and review."
      footer={<BthButton label="Start delivery" onPress={onStartPress} />}
    />
  );
}

function renderDiscoverySection(onBrowsePress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Discover nearby stores"
        subtitle="Browse categories and featured offers with a consistent list card pattern."
        footer={<BthButton label="Browse stores" tone="secondary" onPress={onBrowsePress} />}
      />
      <BthCard
        title="Quick reorder"
        subtitle="Jump back into your common items without a full platform home flow."
      />
    </BthBox>
  );
}

function renderReviewSection(onTrackOrdersPress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Review before checkout"
        subtitle="Keep action CTA and review state visible before final confirmation."
      />
      <BthCard
        title="Track active orders"
        subtitle="Open the orders list and move to tracking from a single known pattern."
        footer={<BthButton label="Open orders" tone="ghost" onPress={onTrackOrdersPress} />}
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  onStartPress,
  onBrowsePress,
  onTrackOrdersPress,
}: DshEntryScreenProps) {
  return (
    <BthDashboardShell
      title="Delivery Entry"
      subtitle="Single-purpose entry for app-client delivery discovery and first action."
      hero={renderHero(state, onStartPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'Discovery',
                subtitle: 'Entry cards and content discovery pattern.',
                content: renderDiscoverySection(onBrowsePress),
              },
              {
                title: 'Review and Tracking',
                subtitle: 'Review pattern, success handoff, and orders list/track pattern.',
                content: renderReviewSection(onTrackOrdersPress),
              },
            ]
          : [
              {
                title: 'Entry State',
                subtitle: 'The screen keeps one clear purpose while handling base states.',
                content: (
                  <BthBox>
                    <BthText role="bodyMd" tone="muted">
                      Entry state is active. No business logic or network requests are executed here.
                    </BthText>
                  </BthBox>
                ),
              },
            ]
      }
    />
  );
}
