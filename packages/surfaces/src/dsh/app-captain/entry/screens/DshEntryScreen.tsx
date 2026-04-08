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
  onOpenOffersPress?: () => void;
  onOpenExecutionPress?: () => void;
  onOpenProofCapturePress?: () => void;
};

function renderHero(state: DshEntryScreenState, onOpenOffersPress?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No active offers right now"
        description="Keep the offers entry visible so captains can retry without leaving the service shell."
        actionLabel="Open offers"
        onActionPress={onOpenOffersPress}
      />
    );
  }

  return (
    <BthCard
      title="Captain dispatch entry"
      subtitle="One focused start point for offer review, active execution, and proof handoff."
      footer={<BthButton label="Open offers" onPress={onOpenOffersPress} />}
    />
  );
}

function renderOffersSection(onOpenOffersPress?: () => void, onOpenExecutionPress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Review incoming offers"
        subtitle="Start from the captain offers list so the next dispatch decision is obvious within seconds."
        footer={<BthButton label="View offers" tone="secondary" onPress={onOpenOffersPress} />}
      />
      <BthCard
        title="Open execution workspace"
        subtitle="Accepted work, reject companion actions, and operational chat stay grouped in one captain pattern."
        footer={<BthButton label="Open execution" tone="ghost" onPress={onOpenExecutionPress} />}
      />
    </BthBox>
  );
}

function renderCompletionSection(onOpenProofCapturePress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Capture delivery proof"
        subtitle="Proof upload remains an explicit completion gate before the order fully closes."
        footer={<BthButton label="Open proof capture" tone="secondary" onPress={onOpenProofCapturePress} />}
      />
      <BthCard
        title="Stay inside one captain flow"
        subtitle="Finance, tier, and other non-critical clusters stay out of this first entry so delivery actions remain primary."
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  onOpenOffersPress,
  onOpenExecutionPress,
  onOpenProofCapturePress,
}: DshEntryScreenProps) {
  return (
    <BthDashboardShell
      title="Captain Entry"
      subtitle="Single-purpose entry for app-captain delivery operations and first dispatch action."
      hero={renderHero(state, onOpenOffersPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'Offers and Acceptance',
                subtitle: 'Open-list entry and captain execution handoff pattern.',
                content: renderOffersSection(onOpenOffersPress, onOpenExecutionPress),
              },
              {
                title: 'Execution and Proof',
                subtitle: 'Completion gate and proof-capture handoff stay explicit.',
                content: renderCompletionSection(onOpenProofCapturePress),
              },
            ]
          : [
              {
                title: 'Entry State',
                subtitle: 'The screen keeps one clear captain purpose while handling base states.',
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