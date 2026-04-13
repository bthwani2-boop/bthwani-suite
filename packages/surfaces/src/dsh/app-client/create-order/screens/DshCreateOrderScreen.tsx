import React from 'react';
import {
  BthBox,
  BthFormScreenShell,
  BthSectionHeader,
  BthStateView,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type DshCreateOrderFormValues = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note?: string;
};

export type DshCreateOrderFormErrors = Partial<Record<keyof DshCreateOrderFormValues, string>>;

export type DshCreateOrderScreenState = 'ready' | 'loading' | 'disabled';

export type DshCreateOrderScreenProps = {
  state?: DshCreateOrderScreenState;
  values: DshCreateOrderFormValues;
  errors?: DshCreateOrderFormErrors;
  onChange: (field: keyof DshCreateOrderFormValues, value: string) => void;
  onContinue?: () => void;
};

export function DshCreateOrderScreen({
  state = 'ready',
  values,
  errors,
  onChange,
  onContinue,
}: DshCreateOrderScreenProps) {
  const isDisabled = state !== 'ready';

  return (
    <BthFormScreenShell
      title="Create order"
      subtitle="Capture only the essential fields needed before review."
      submitLabel="Continue to review"
      onSubmit={onContinue}
      submitDisabled={isDisabled}
    >
      {state === 'loading' ? <BthStateView stateId="loading" /> : null}

      <BthBox gap={3}>
        <BthSectionHeader
          title="Delivery details"
          subtitle="Keep the route context simple and focused."
        />
        <BthTextField
          label="Pickup address"
          value={values.pickupAddress}
          onChangeText={(value) => onChange('pickupAddress', value)}
          editable={!isDisabled}
          error={errors?.pickupAddress}
        />
        <BthTextField
          label="Dropoff address"
          value={values.dropoffAddress}
          onChangeText={(value) => onChange('dropoffAddress', value)}
          editable={!isDisabled}
          error={errors?.dropoffAddress}
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="Contact"
          subtitle="One reachable contact is enough for this step."
        />
        <BthTextField
          label="Contact name"
          value={values.contactName}
          onChangeText={(value) => onChange('contactName', value)}
          editable={!isDisabled}
          error={errors?.contactName}
        />
        <BthTextField
          label="Contact phone"
          value={values.contactPhone}
          onChangeText={(value) => onChange('contactPhone', value)}
          editable={!isDisabled}
          keyboardType="phone-pad"
          error={errors?.contactPhone}
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader
          title="Optional note"
          subtitle="Keep this slice focused on the note that matters now."
        />
        <BthTextField
          label="Order note"
          value={values.note ?? ''}
          onChangeText={(value) => onChange('note', value)}
          editable={!isDisabled}
          hint="Keep this short and practical."
          error={errors?.note}
        />
      </BthBox>

      <BthText role="caption" tone="muted">
        Validation behavior: missing required fields or invalid phone keeps continue action blocked.
      </BthText>
    </BthFormScreenShell>
  );
}
