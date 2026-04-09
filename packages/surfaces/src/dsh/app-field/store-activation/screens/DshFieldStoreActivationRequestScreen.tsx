import React from 'react';
import {
  BthBox,
  BthFormScreenShell,
  BthKeyValueList,
  BthSectionHeader,
  BthStateView,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type DshFieldStoreActivationRequestState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldStoreActivationRequestValues = {
  storeName: string;
  ownerName: string;
  ownerPhone: string;
  city: string;
  zone: string;
  activationNote?: string;
};

export type DshFieldStoreActivationRequestErrors = Partial<Record<keyof DshFieldStoreActivationRequestValues, string>>;

export type DshFieldStoreActivationRequestScreenProps = {
  state?: DshFieldStoreActivationRequestState;
  values: DshFieldStoreActivationRequestValues;
  errors?: DshFieldStoreActivationRequestErrors;
  onChange: (field: keyof DshFieldStoreActivationRequestValues, value: string) => void;
  onSubmit?: () => void;
  onRetry?: () => void;
};

function renderState(state: Exclude<DshFieldStoreActivationRequestState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No store request is active"
        description="Start a clean activation request so field work begins from one owned workspace."
        actionLabel={onRetry ? 'Start request' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="Connection is unavailable"
        description="Keep the request draft visible and retry submission when connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <BthStateView
        stateId="success"
        title="Activation request is ready"
        description="The request is captured and the next field step can move to geo pin confirmation."
        actionLabel={onRetry ? 'Open next step' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Activation request could not be completed"
      description="Correct the required data or retry without losing the field context."
      onActionPress={onRetry}
    />
  );
}

export function DshFieldStoreActivationRequestScreen({
  state = 'ready',
  values,
  errors,
  onChange,
  onSubmit,
  onRetry,
}: DshFieldStoreActivationRequestScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <BthFormScreenShell
      title="Store activation request"
      subtitle="Capture only the field-ready details needed before the store moves to pinning and visit evidence."
      submitLabel="Submit activation request"
      onSubmit={onSubmit}
      submitDisabled={isDisabled}
    >
      <BthBox gap={3}>
        <BthSectionHeader
          title="Store identity"
          subtitle="The activation request starts with the minimum accountable store profile."
        />
        <BthTextField
          label="Store name"
          value={values.storeName}
          onChangeText={(value) => onChange('storeName', value)}
          editable={!isDisabled}
          error={errors?.storeName}
        />
        <BthTextField
          label="Owner name"
          value={values.ownerName}
          onChangeText={(value) => onChange('ownerName', value)}
          editable={!isDisabled}
          error={errors?.ownerName}
        />
        <BthTextField
          label="Owner phone"
          value={values.ownerPhone}
          onChangeText={(value) => onChange('ownerPhone', value)}
          editable={!isDisabled}
          keyboardType="phone-pad"
          error={errors?.ownerPhone}
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="Coverage context"
          subtitle="Zone and city keep downstream dispatch ownership explicit."
        />
        <BthTextField
          label="City"
          value={values.city}
          onChangeText={(value) => onChange('city', value)}
          editable={!isDisabled}
          error={errors?.city}
        />
        <BthTextField
          label="Zone"
          value={values.zone}
          onChangeText={(value) => onChange('zone', value)}
          editable={!isDisabled}
          error={errors?.zone}
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="Field handoff note"
          subtitle="Keep the note practical and constrained to what the next action needs."
        />
        <BthTextField
          label="Activation note"
          value={values.activationNote ?? ''}
          onChangeText={(value) => onChange('activationNote', value)}
          editable={!isDisabled}
          hint="Examples: storefront ready, signage pending, owner available after 3 PM."
          error={errors?.activationNote}
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="Execution rules"
          subtitle="Field activation stays mutation-bound and must keep validation visible."
        />
        <BthKeyValueList
          items={[
            { label: 'Primary CTA', value: 'Submit activation request' },
            { label: 'Next owned step', value: 'Geo pin confirmation', tone: 'brand' },
            { label: 'Required states', value: 'loading, empty, error, success, offline, disabled' },
          ]}
        />
      </BthBox>

      <BthText role="caption" tone="muted">
        Validation behavior: missing store identity or coverage data keeps the submit action blocked.
      </BthText>
    </BthFormScreenShell>
  );
}