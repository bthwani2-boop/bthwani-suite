import React from 'react';
import {
  Box,
  Button,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Switch,
  Text,
  TextField,
} from '@bthwani/ui-kit';

export type DshPartnerHoursUpdateState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'success'
  | 'disabled';

export type DshPartnerHoursDay = {
  id: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type DshPartnerHoursUpdateScreenProps = {
  state?: DshPartnerHoursUpdateState;
  days?: DshPartnerHoursDay[];
  onToggleDay?: (dayId: string, nextValue: boolean) => void;
  onChangeDayTime?: (dayId: string, field: 'openTime' | 'closeTime', value: string) => void;
  onSave?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

const demoDays: DshPartnerHoursDay[] = [
  { id: 'sun', label: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'mon', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'tue', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
  { id: 'wed', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'thu', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '23:30' },
  { id: 'fri', label: 'Friday', isOpen: false, openTime: '14:00', closeTime: '23:30' },
  { id: 'sat', label: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:30' },
];

function renderState(state: Exclude<DshPartnerHoursUpdateState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="No hours profile is loaded"
        description="Load the branch schedule before editing daily availability."
        actionLabel={onRetry ? 'Reload hours' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="Hours update is offline"
        description="Keep the draft visible and retry once the branch connection is back."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="Store hours updated"
        description="The branch schedule is ready and the maintenance workspace can continue with coverage or listing changes."
        actionLabel={onBack ? 'Back to maintenance' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="Hours update failed"
      description="Retry the schedule update without dropping the branch context."
      onActionPress={onRetry}
    />
  );
}

export function DshPartnerHoursUpdateScreen({
  state = 'ready',
  days = demoDays,
  onToggleDay,
  onChangeDayTime,
  onSave,
  onBack,
  onRetry,
}: DshPartnerHoursUpdateScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry, onBack);
  }

  const isDisabled = state === 'disabled';

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">Store hours update</Text>
        <Text role="bodyMd" tone="muted">
          Update the weekly schedule without leaving the branch maintenance slice.
        </Text>
      </Box>

      <Box gap={3}>
        {days.map((day) => (
          <Surface key={day.id} tone="raised" gap={3}>
            <SectionHeader
              title={day.label}
              subtitle="Open or close the day, then keep the visible time window explicit."
            />
            <Switch
              label="Branch accepts orders"
              description="Close the day completely when the branch should stop receiving DSH demand."
              value={day.isOpen}
              disabled={isDisabled}
              onValueChange={(nextValue) => onToggleDay?.(day.id, nextValue)}
            />
            {day.isOpen ? (
              <Box gap={2}>
                <TextField
                  label="Open time"
                  value={day.openTime}
                  onChangeText={(value) => onChangeDayTime?.(day.id, 'openTime', value)}
                  editable={!isDisabled}
                />
                <TextField
                  label="Close time"
                  value={day.closeTime}
                  onChangeText={(value) => onChangeDayTime?.(day.id, 'closeTime', value)}
                  editable={!isDisabled}
                />
              </Box>
            ) : null}
          </Surface>
        ))}
      </Box>

      <Button label="Save hours" onPress={onSave} disabled={isDisabled} />
      <Button label="Back to maintenance" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}

export default DshPartnerHoursUpdateScreen;