import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type DshFieldStoreVisitLogState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitLogValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitLogErrors = Partial<Record<keyof DshFieldStoreVisitLogValues, string>>;

export type DshFieldStoreVisitLogScreenProps = {
  state?: DshFieldStoreVisitLogState;
  values: DshFieldStoreVisitLogValues;
  errors?: DshFieldStoreVisitLogErrors;
  evidenceItems?: readonly DshFieldVisitEvidenceItem[];
  onChange: (field: keyof DshFieldStoreVisitLogValues, value: string) => void;
  onSubmit?: () => void;
  onOpenEvidence?: (evidenceId: string) => void;
  onRetry?: () => void;
};

const demoEvidenceItems: DshFieldVisitEvidenceItem[] = [
  {
    id: 'front-signage-photo',
    title: 'Front signage photo',
    subtitle: 'Storefront proof captured from the main customer entrance.',
    statusLabel: 'Captured',
    capturedAtLabel: '10:14 AM',
  },
  {
    id: 'owner-availability-note',
    title: 'Owner availability note',
    subtitle: 'Owner confirmed operating hours and first dispatch readiness.',
    statusLabel: 'Logged',
    capturedAtLabel: '10:19 AM',
  },
];

function renderState(state: Exclude<DshFieldStoreVisitLogState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No visit evidence recorded"
        description="Capture the first field note or proof item so the visit can close with auditability."
        actionLabel={onRetry ? 'Start visit log' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="Visit log is waiting for sync"
        description="Keep local evidence visible and retry submission when the network returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <BthStateView
        stateId="success"
        title="Visit log submitted"
        description="The field visit now has captured evidence and a clear follow-up action."
        actionLabel={onRetry ? 'Return to field entry' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Visit log could not be submitted"
      description="Retry the submission or correct the summary without losing the captured evidence list."
      onActionPress={onRetry}
    />
  );
}

export function DshFieldStoreVisitLogScreen({
  state = 'ready',
  values,
  errors,
  evidenceItems = demoEvidenceItems,
  onChange,
  onSubmit,
  onOpenEvidence,
  onRetry,
}: DshFieldStoreVisitLogScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">Store visit log</BthText>
        <BthText role="bodyMd" tone="muted">
          Record evidence and close the field visit with one summary and one owned follow-up action.
        </BthText>
      </BthBox>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Visit summary"
          subtitle="The log should explain what was verified and what remains pending."
        />
        <BthTextField
          label="Visit summary"
          value={values.visitSummary}
          onChangeText={(value) => onChange('visitSummary', value)}
          editable={!isDisabled}
          error={errors?.visitSummary}
          hint="Example: storefront verified, staff briefed, activation request signed."
        />
        <BthTextField
          label="Follow-up action"
          value={values.followUpAction}
          onChangeText={(value) => onChange('followUpAction', value)}
          editable={!isDisabled}
          error={errors?.followUpAction}
          hint="Example: wait for pricing sync, revisit for final signage, ready for dispatch onboarding."
        />
      </BthSurface>

      <BthSurface tone="default" gap={3}>
        <BthSectionHeader
          title="Captured evidence"
          subtitle="Each evidence item remains openable without turning this screen into a gallery."
        />
        <BthBox gap={2}>
          {evidenceItems.map((item) => (
            <BthListItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              meta={`Captured at ${item.capturedAtLabel}`}
              badgeLabel={item.statusLabel}
              onPress={() => onOpenEvidence?.(item.id)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader
          title="Closure checks"
          subtitle="Visit evidence must keep the next accountable step visible."
        />
        <BthKeyValueList
          items={[
            { label: 'Primary CTA', value: 'Submit visit log' },
            { label: 'Evidence count', value: String(evidenceItems.length) },
            { label: 'Next accountable step', value: values.followUpAction || 'Pending definition', tone: 'brand' },
          ]}
        />
        <BthButton label="Submit visit log" onPress={onSubmit} disabled={isDisabled} />
      </BthSurface>
    </BthMobileScrollView>
  );
}