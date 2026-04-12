import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthStatCard,
  BthSurface,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type DshFieldStoreGeoPinState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldStoreGeoPinValues = {
  latitude: string;
  longitude: string;
  landmark: string;
  accuracyMeters?: string;
};

export type DshFieldStoreGeoPinErrors = Partial<Record<keyof DshFieldStoreGeoPinValues, string>>;

export type DshFieldStoreGeoPinScreenProps = {
  state?: DshFieldStoreGeoPinState;
  values: DshFieldStoreGeoPinValues;
  errors?: DshFieldStoreGeoPinErrors;
  onChange: (field: keyof DshFieldStoreGeoPinValues, value: string) => void;
  onCapturePin?: () => void;
  onConfirmPin?: () => void;
  onRetry?: () => void;
};

function renderState(state: Exclude<DshFieldStoreGeoPinState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No geo pin captured yet"
        description="Capture the store location from the field device before the activation path can close safely."
        actionLabel={onRetry ? 'Start pin capture' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="Geo pin sync is paused"
        description="Keep the coordinates visible and retry confirmation when the connection returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <BthStateView
        stateId="success"
        title="Geo pin confirmed"
        description="The store location is locked and the field flow can move to visit evidence."
        actionLabel={onRetry ? 'Open visit log' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Geo pin confirmation failed"
      description="Retry capture or correct the coordinate details without leaving the field workspace."
      onActionPress={onRetry}
    />
  );
}

export function DshFieldStoreGeoPinScreen({
  state = 'ready',
  values,
  errors,
  onChange,
  onCapturePin,
  onConfirmPin,
  onRetry,
}: DshFieldStoreGeoPinScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">Store geo pin</BthText>
        <BthText role="bodyMd" tone="muted">
          Confirm the field location before dispatch and visit evidence depend on it.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Pin status"
          subtitle="Accuracy and landmark stay visible before final confirmation."
        />
        <BthBox gap={3}>
          <BthStatCard
            label="Accuracy"
            value={values.accuracyMeters ? `${values.accuracyMeters} m` : 'Pending'}
            deltaLabel={values.accuracyMeters ? 'Field captured' : 'Needs capture'}
            tone={values.accuracyMeters ? 'success' : 'warning'}
          />
          <BthKeyValueList
            items={[
              { label: 'Latitude', value: values.latitude || 'Not set' },
              { label: 'Longitude', value: values.longitude || 'Not set' },
              { label: 'Landmark', value: values.landmark || 'Not set', tone: 'brand' },
            ]}
          />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Coordinate details"
          subtitle="Manual correction remains available when field capture needs cleanup."
        />
        <BthTextField
          label="Latitude"
          value={values.latitude}
          onChangeText={(value) => onChange('latitude', value)}
          editable={!isDisabled}
          keyboardType="decimal-pad"
          error={errors?.latitude}
        />
        <BthTextField
          label="Longitude"
          value={values.longitude}
          onChangeText={(value) => onChange('longitude', value)}
          editable={!isDisabled}
          keyboardType="decimal-pad"
          error={errors?.longitude}
        />
        <BthTextField
          label="Landmark"
          value={values.landmark}
          onChangeText={(value) => onChange('landmark', value)}
          editable={!isDisabled}
          hint="Example: side entrance next to pharmacy, rear loading gate, mall north door."
          error={errors?.landmark}
        />
      </BthSurface>

      <BthSurface tone="default" gap={3}>
        <BthSectionHeader
          title="Field actions"
          subtitle="Capture and confirm remain explicit separate actions."
        />
        <BthBox gap={2}>
          <BthButton label="Capture current pin" tone="secondary" onPress={onCapturePin} disabled={isDisabled} />
          <BthButton label="Confirm geo pin" onPress={onConfirmPin} disabled={isDisabled} />
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}