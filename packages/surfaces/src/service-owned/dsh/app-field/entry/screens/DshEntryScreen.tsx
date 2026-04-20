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
  onOpenActivationPress?: () => void;
  onOpenGeoPinPress?: () => void;
  onOpenVisitLogPress?: () => void;
};

function renderHero(state: DshEntryScreenState, onOpenActivationPress?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No active field workspace"
        description="Keep the activation workspace visible so field teams can restart the store activation path quickly."
        actionLabel="Open activation workspace"
        onActionPress={onOpenActivationPress}
      />
    );
  }

  return (
    <BthCard
      title="Field activation entry"
      subtitle="Start from one field workspace for store activation, geo pin confirmation, and visit evidence."
      footer={<BthButton label="Open activation workspace" onPress={onOpenActivationPress} />}
    />
  );
}

function renderActivationSection(onOpenActivationPress?: () => void, onOpenGeoPinPress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Start store activation"
        subtitle="Open the main activation request flow without branching into extra service layers."
        footer={<BthButton label="Open activation" tone="secondary" onPress={onOpenActivationPress} />}
      />
      <BthCard
        title="Confirm geo pin"
        subtitle="Geo-pin capture stays as a companion step inside the same field activation family."
        footer={<BthButton label="Open geo pin" tone="ghost" onPress={onOpenGeoPinPress} />}
      />
    </BthBox>
  );
}

function renderEvidenceSection(onOpenVisitLogPress?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="Record visit log"
        subtitle="Visit evidence stays close to activation so the operator can complete the order without losing context."
        footer={<BthButton label="Open visit log" tone="secondary" onPress={onOpenVisitLogPress} />}
      />
      <BthCard
        title="Keep support optional"
        subtitle="Support fallback remains visible, but the main field entry keeps the activation workspace as the default path."
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  onOpenActivationPress,
  onOpenGeoPinPress,
  onOpenVisitLogPress,
}: DshEntryScreenProps) {
  return (
    <BthDashboardShell
      title="Field Entry"
      subtitle="Single-purpose entry for app-field store activation and first execution action."
      hero={renderHero(state, onOpenActivationPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'Activation Workspace',
                subtitle: 'Primary activation request and geo-pin companion pattern.',
                content: renderActivationSection(onOpenActivationPress, onOpenGeoPinPress),
              },
              {
                title: 'Evidence and Completion',
                subtitle: 'Visit log and completion evidence stay in the same entry family.',
                content: renderEvidenceSection(onOpenVisitLogPress),
              },
            ]
          : [
              {
                title: 'Entry State',
                subtitle: 'The screen keeps one clear field purpose while handling base states.',
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
