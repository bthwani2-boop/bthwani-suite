import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthSwitch,
  BthText,
} from '@bthwani/ui-kit';

export type DshPartnerStoreMaintenanceWorkspaceState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'disabled';

export type DshPartnerStoreMaintenanceProfile = {
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  managerLabel: string;
  todayHoursLabel: string;
  activeZoneLabel: string;
};

export type DshPartnerServiceMode = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type DshPartnerStoreMaintenanceWorkspaceScreenProps = {
  state?: DshPartnerStoreMaintenanceWorkspaceState;
  profile?: DshPartnerStoreMaintenanceProfile;
  serviceModes?: DshPartnerServiceMode[];
  listingEnabled?: boolean;
  storeOpen?: boolean;
  onToggleListingEnabled?: (nextValue: boolean) => void;
  onToggleStoreOpen?: (nextValue: boolean) => void;
  onToggleServiceMode?: (modeId: string, nextValue: boolean) => void;
  onOpenHours?: () => void;
  onOpenZones?: () => void;
  onOpenDeliveryBoard?: () => void;
  onOpenSupportDirectory?: () => void;
  onSave?: () => void;
  onRetry?: () => void;
};

const demoProfile: DshPartnerStoreMaintenanceProfile = {
  storeName: 'Burger Lab',
  branchLabel: 'Yasmin branch',
  cityLabel: 'Riyadh',
  managerLabel: 'Khaled A.',
  todayHoursLabel: '09:00 - 23:30',
  activeZoneLabel: 'Yasmin + Al Malqa',
};

const demoServiceModes: DshPartnerServiceMode[] = [
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'Accept delivery demand and keep captain handoff open.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'Pickup',
    description: 'Expose pickup-only capacity without slowing the delivery branch flow.',
    enabled: true,
  },
  {
    id: 'scheduled',
    label: 'Scheduled orders',
    description: 'Allow future slots when the branch team can commit to preparation timing.',
    enabled: false,
  },
];

function renderState(
  state: Exclude<DshPartnerStoreMaintenanceWorkspaceState, 'ready' | 'disabled'>,
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No store profile is loaded"
        description="Load the owned branch profile before changing availability, service modes, or coverage."
        actionLabel={onRetry ? 'Reload profile' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="Store maintenance is offline"
        description="Keep branch controls visible and retry once connectivity returns."
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Store maintenance is unavailable"
      description="Retry the branch workspace without losing the maintenance context."
      onActionPress={onRetry}
    />
  );
}

export function DshPartnerStoreMaintenanceWorkspaceScreen({
  state = 'ready',
  profile = demoProfile,
  serviceModes = demoServiceModes,
  listingEnabled = true,
  storeOpen = true,
  onToggleListingEnabled,
  onToggleStoreOpen,
  onToggleServiceMode,
  onOpenHours,
  onOpenZones,
  onOpenDeliveryBoard,
  onOpenSupportDirectory,
  onSave,
  onRetry,
}: DshPartnerStoreMaintenanceWorkspaceScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">Store maintenance workspace</BthText>
        <BthText role="bodyMd" tone="muted">
          Partner branch controls stay centralized here: store profile, listing availability, service modes, hours, and coverage.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader
          title="Owned branch profile"
          subtitle="The maintenance slice starts from one accountable branch summary."
        />
        <BthKeyValueList
          items={[
            { label: 'Store', value: profile.storeName },
            { label: 'Branch', value: profile.branchLabel },
            { label: 'City', value: profile.cityLabel },
            { label: 'Manager', value: profile.managerLabel },
            { label: 'Today hours', value: profile.todayHoursLabel },
            { label: 'Coverage zone', value: profile.activeZoneLabel, tone: 'brand' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Availability controls"
          subtitle="Store status and listing status remain explicit and independently controlled."
        />
        <BthSwitch
          label="Store is open"
          description="Controls whether the branch can keep receiving new DSH work."
          value={storeOpen}
          disabled={isDisabled}
          onValueChange={onToggleStoreOpen}
        />
        <BthSwitch
          label="Listing is visible"
          description="Controls customer-side listing availability without changing branch identity."
          value={listingEnabled}
          disabled={isDisabled}
          onValueChange={onToggleListingEnabled}
        />
      </BthSurface>

      <BthSurface tone="default" gap={3}>
        <BthSectionHeader
          title="Service modes"
          subtitle="Each mode can be toggled directly from the branch workspace instead of spreading controls across multiple screens."
        />
        <BthBox gap={2}>
          {serviceModes.map((mode) => (
            <BthSwitch
              key={mode.id}
              label={mode.label}
              description={mode.description}
              value={mode.enabled}
              disabled={isDisabled}
              onValueChange={(nextValue) => onToggleServiceMode?.(mode.id, nextValue)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader
          title="Branch actions"
          subtitle="Hours, zones, and delivery monitoring stay one tap away from the same maintenance slice."
        />
        <BthBox gap={2}>
          <BthButton label="Update store hours" tone="secondary" onPress={onOpenHours} disabled={isDisabled} />
          <BthButton label="Update delivery zones" tone="secondary" onPress={onOpenZones} disabled={isDisabled} />
          <BthButton label="Open delivery ops board" tone="ghost" onPress={onOpenDeliveryBoard} disabled={isDisabled} />
          <BthButton label="Open support directory" tone="ghost" onPress={onOpenSupportDirectory} disabled={isDisabled} />
        </BthBox>
      </BthSurface>

      <BthButton label="Save maintenance changes" onPress={onSave} disabled={isDisabled} />
    </BthMobileScrollView>
  );
}

export default DshPartnerStoreMaintenanceWorkspaceScreen;