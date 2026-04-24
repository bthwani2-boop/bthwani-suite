import React from 'react';
import {
  Box,
  Button,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
} from '@bthwani/ui-kit';

export type DshPartnerZoneSetState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'success'
  | 'disabled';

export type DshPartnerZoneOption = {
  id: string;
  title: string;
  subtitle: string;
  deliveryFeeLabel: string;
  etaLabel: string;
  selected?: boolean;
  disabled?: boolean;
};

export type DshPartnerZoneSetScreenProps = {
  state?: DshPartnerZoneSetState;
  zones?: DshPartnerZoneOption[];
  onSelectZone?: (zoneId: string) => void;
  onSave?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

const demoZones: DshPartnerZoneOption[] = [
  {
    id: 'yasmin',
    title: 'Yasmin',
    subtitle: 'Primary branch catchment around the current branch.',
    deliveryFeeLabel: '12 SAR',
    etaLabel: '20-28 min',
    selected: true,
  },
  {
    id: 'malqa',
    title: 'Al Malqa',
    subtitle: 'High-value nearby district with stable captain availability.',
    deliveryFeeLabel: '15 SAR',
    etaLabel: '24-32 min',
  },
  {
    id: 'nakheel',
    title: 'Al Nakheel',
    subtitle: 'Extended zone with occasional delay risk during peak windows.',
    deliveryFeeLabel: '18 SAR',
    etaLabel: '28-38 min',
    disabled: true,
  },
];

function renderState(state: Exclude<DshPartnerZoneSetState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="No delivery zones are available"
        description="Load branch coverage options before assigning the active delivery zone."
        actionLabel={onRetry ? 'Reload zones' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <StateView
        stateId="offline"
        title="Zone assignment is offline"
        description="Keep the selected branch zone visible and retry once connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <StateView
        stateId="success"
        title="Delivery zone updated"
        description="Coverage is saved and the branch can return to maintenance or delivery monitoring."
        actionLabel={onBack ? 'Back to maintenance' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="Zone update failed"
      description="Retry the coverage change without losing the selected branch context."
      onActionPress={onRetry}
    />
  );
}

export function DshPartnerZoneSetScreen({
  state = 'ready',
  zones = demoZones,
  onSelectZone,
  onSave,
  onBack,
  onRetry,
}: DshPartnerZoneSetScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry, onBack);
  }

  const selectedZone = zones.find((zone) => zone.selected);
  const isDisabled = state === 'disabled';

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">Delivery zone set</Text>
        <Text role="bodyMd" tone="muted">
          Keep one active coverage decision visible so the branch knows exactly where it can fulfill DSH demand.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title="Current coverage"
          subtitle="The active branch zone remains visible while operators review alternatives."
        />
        <Text role="bodyStrong">{selectedZone ? selectedZone.title : 'No zone selected'}</Text>
        <Text role="bodySm" tone="muted">
          {selectedZone ? `${selectedZone.deliveryFeeLabel} | ${selectedZone.etaLabel}` : 'Select a zone to continue.'}
        </Text>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="Available branch zones"
          subtitle="Each option shows cost and ETA impact before the operator commits."
        />
        <Box gap={2}>
          {zones.map((zone) => (
            <ListItem
              key={zone.id}
              title={zone.title}
              subtitle={zone.subtitle}
              meta={`${zone.deliveryFeeLabel} | ${zone.etaLabel}`}
              badgeLabel={zone.disabled ? 'Unavailable' : zone.selected ? 'Selected' : 'Available'}
              onPress={zone.disabled || isDisabled ? undefined : () => onSelectZone?.(zone.id)}
            />
          ))}
        </Box>
      </Surface>

      <Button label="Save active zone" onPress={onSave} disabled={isDisabled || !selectedZone} />
      <Button label="Back to maintenance" tone="ghost" onPress={onBack} />
    </MobileScrollView>
  );
}

export default DshPartnerZoneSetScreen;