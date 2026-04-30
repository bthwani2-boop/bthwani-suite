import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  MobileScrollView,
  SectionHeader,
  StateView,
  StatCard,
  Surface,
  Text,
  TextField,
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
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
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
      <StateView
        stateId="offline"
        title="Geo pin sync is paused"
        description="Keep the coordinates visible and retry confirmation when the connection returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="Geo pin confirmed"
        description="The store location is locked and the field flow can move to visit evidence."
        actionLabel={onRetry ? 'Open visit log' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
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
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">Store geo pin</Text>
        <Text role="bodyMd" tone="muted">
          Confirm the field location before dispatch and visit evidence depend on it.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Pin status"
          subtitle="Accuracy and landmark stay visible before final confirmation."
        />
        <Box gap={3}>
          <StatCard
            label="Accuracy"
            value={values.accuracyMeters ? `${values.accuracyMeters} m` : 'Pending'}
            deltaLabel={values.accuracyMeters ? 'Field captured' : 'Needs capture'}
            tone={values.accuracyMeters ? 'success' : 'warning'}
          />
          <KeyValueList
            items={[
              { label: 'Latitude', value: values.latitude || 'Not set' },
              { label: 'Longitude', value: values.longitude || 'Not set' },
              { label: 'Landmark', value: values.landmark || 'Not set', tone: 'brand' },
            ]}
          />
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Coordinate details"
          subtitle="Manual correction remains available when field capture needs cleanup."
        />
        <TextField
          label="Latitude"
          value={values.latitude}
          onChangeText={(value) => onChange('latitude', value)}
          editable={!isDisabled}
          keyboardType="decimal-pad"
          error={errors?.latitude}
        />
        <TextField
          label="Longitude"
          value={values.longitude}
          onChangeText={(value) => onChange('longitude', value)}
          editable={!isDisabled}
          keyboardType="decimal-pad"
          error={errors?.longitude}
        />
        <TextField
          label="Landmark"
          value={values.landmark}
          onChangeText={(value) => onChange('landmark', value)}
          editable={!isDisabled}
          hint="Example: side entrance next to pharmacy, rear loading gate, mall north door."
          error={errors?.landmark}
        />
      </Surface>

      <Surface tone="default" gap={3}>
        <SectionHeader
          title="Field actions"
          subtitle="Capture and confirm remain explicit separate actions."
        />
        <Box gap={2}>
          <Button label="Capture current pin" tone="secondary" onPress={onCapturePin} disabled={isDisabled} />
          <Button label="Confirm geo pin" onPress={onConfirmPin} disabled={isDisabled} />
        </Box>
      </Surface>
    </MobileScrollView>
  );
}