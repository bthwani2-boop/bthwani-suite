import React from 'react';
import {
  Box,
  FormScreenShell,
  KeyValueList,
  SectionHeader,
  StateView,
  Text,
  TextField,
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
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
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
      <StateView
        stateId="offline"
        title="Connection is unavailable"
        description="Keep the request draft visible and retry submission when connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="Activation request is ready"
        description="The request is captured and the next field step can move to geo pin confirmation."
        actionLabel={onRetry ? 'Open next step' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
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
    <FormScreenShell
      title="Store activation request"
      subtitle="Capture only the field-ready details needed before the store moves to pinning and visit evidence."
      submitLabel="Submit activation request"
      onSubmit={onSubmit}
      submitDisabled={isDisabled}
    >
      <Box gap={3}>
        <SectionHeader
          title="Store identity"
          subtitle="The activation request starts with the minimum accountable store profile."
        />
        <TextField
          label="Store name"
          value={values.storeName}
          onChangeText={(value) => onChange('storeName', value)}
          editable={!isDisabled}
          error={errors?.storeName}
        />
        <TextField
          label="Owner name"
          value={values.ownerName}
          onChangeText={(value) => onChange('ownerName', value)}
          editable={!isDisabled}
          error={errors?.ownerName}
        />
        <TextField
          label="Owner phone"
          value={values.ownerPhone}
          onChangeText={(value) => onChange('ownerPhone', value)}
          editable={!isDisabled}
          keyboardType="phone-pad"
          error={errors?.ownerPhone}
        />
      </Box>

      <Box gap={3}>
        <SectionHeader
          title="Coverage context"
          subtitle="Zone and city keep downstream dispatch ownership explicit."
        />
        <TextField
          label="City"
          value={values.city}
          onChangeText={(value) => onChange('city', value)}
          editable={!isDisabled}
          error={errors?.city}
        />
        <TextField
          label="Zone"
          value={values.zone}
          onChangeText={(value) => onChange('zone', value)}
          editable={!isDisabled}
          error={errors?.zone}
        />
      </Box>

      <Box gap={3}>
        <SectionHeader
          title="Field handoff note"
          subtitle="Keep the note practical and constrained to what the next action needs."
        />
        <TextField
          label="Activation note"
          value={values.activationNote ?? ''}
          onChangeText={(value) => onChange('activationNote', value)}
          editable={!isDisabled}
          hint="Examples: storefront ready, signage pending, owner available after 3 PM."
          error={errors?.activationNote}
        />
      </Box>

      <Box gap={3}>
        <SectionHeader
          title="Execution rules"
          subtitle="Field activation stays mutation-bound and must keep validation visible."
        />
        <KeyValueList
          items={[
            { label: 'Primary CTA', value: 'Submit activation request' },
            { label: 'Next owned step', value: 'Geo pin confirmation', tone: 'brand' },
            { label: 'Required states', value: 'loading, empty, error, success, offline, disabled' },
          ]}
        />
      </Box>

      <Text role="caption" tone="muted">
        Validation behavior: missing store identity or coverage data keeps the submit action blocked.
      </Text>
    </FormScreenShell>
  );
}