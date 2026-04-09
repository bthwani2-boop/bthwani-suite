import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BthMobileScrollView } from '../adapters';
import {
  BthButton,
  BthCheckbox,
  BthChip,
  BthDataTable,
  BthDialog,
  BthKeyValueList,
  BthRadio,
  BthSearchField,
  BthSelectField,
  BthSegmentedControl,
  BthSwitch,
  BthTabs,
  BthTextField,
  BthToast
} from '../components';
import { bthNativeTokenOutput } from '../foundation/tokens';
import { useDirection, useTheme } from '../hooks';
import { BthBox, BthSurface, BthText } from '../primitives';
import { bthComponentLabSections } from './catalog';

export function BthComponentLab() {
  const { direction, language } = useDirection();
  const { mode, theme } = useTheme();
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [chipSelected, setChipSelected] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState<'alpha' | 'beta'>('alpha');
  const [switchValue, setSwitchValue] = useState(true);
  const [segmentValue, setSegmentValue] = useState<'delivery' | 'pickup'>('delivery');
  const [priorityValue, setPriorityValue] = useState<'express' | 'same-day' | 'scheduled'>('express');
  const [navigationValue, setNavigationValue] = useState<'overview' | 'operations' | 'proof'>('overview');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const deliverySummary = useMemo(
    () => [
      { label: 'Order ID', value: 'BTH-42017' },
      { label: 'Coverage', value: 'Riyadh North Cluster', tone: 'brand' as const },
      { label: 'Driver', value: 'Maha Al-Qahtani', helperText: 'Shift handoff completed' }
    ],
    []
  );

  const dispatchRows = useMemo(
    () => [
      { id: 'run-1', trip: 'Dispatch Alpha', owner: 'Noura', status: 'Ready' },
      { id: 'run-2', trip: 'Dispatch Beta', owner: 'Saad', status: 'Blocked' },
      { id: 'run-3', trip: 'Dispatch Gamma', owner: 'Yousef', status: 'In review' }
    ],
    []
  );

  const tokenSummary = useMemo(
    () => `${Object.keys(bthNativeTokenOutput.colors.semantic).length} semantic colors • ${Object.keys(bthNativeTokenOutput.spacing).length} spacing tokens • ${Object.keys(bthNativeTokenOutput.breakpoints).length} breakpoints`,
    []
  );

  return (
    <BthMobileScrollView fill padding={4} gap={4}>
      <BthSurface tone="raised" padding={5} gap={3}>
        <BthText role="titleLg">BTH Component Lab</BthText>
        <BthText role="bodyMd" tone="muted">
          Live review surface for the shared system, built on the same runtime exports consumed by real surfaces.
        </BthText>
        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthChip label={`mode: ${mode}`} selected />
          <BthChip label={`direction: ${direction}`} selected />
          <BthChip label={`language: ${language}`} selected />
        </BthBox>
      </BthSurface>

      <BthSurface tone="info" padding={4} gap={2}>
        <BthText role="titleSm">Outputs Snapshot</BthText>
        <BthText role="bodySm" tone="info">{tokenSummary}</BthText>
        <BthText role="caption" tone="muted">brand {theme.brand} • background {theme.background} • focus ring {theme.focusRing}</BthText>
      </BthSurface>

      {bthComponentLabSections.map((section) => (
        <BthSurface key={section.id} tone="default" padding={4} gap={3}>
          <BthBox gap={1}>
            <BthText role="titleSm">{section.title}</BthText>
            <BthText role="bodySm" tone="muted">{section.description}</BthText>
            <BthText role="caption" tone="soft">{section.families.join(' • ')}</BthText>
          </BthBox>

          {section.id === 'actions-fields' ? (
            <BthBox gap={3}>
              <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                <BthButton label="Primary" fullWidth={false} onPress={() => undefined} />
                <BthButton label="Secondary" tone="secondary" fullWidth={false} onPress={() => undefined} />
                <BthButton label="Ghost" tone="ghost" fullWidth={false} onPress={() => undefined} />
              </BthBox>
              <BthTextField label="Display name" value={name} onChangeText={setName} hint="Shared input baseline" />
              <BthSearchField label="Search" value={search} onChangeText={setSearch} />
              <BthSelectField
                label="Delivery priority"
                value={priorityValue}
                onValueChange={setPriorityValue}
                testID="lab-priority-select"
                options={[
                  { value: 'express', label: 'Express', description: 'Fastest available fulfillment path.' },
                  { value: 'same-day', label: 'Same day', description: 'Balanced premium fulfillment window.' },
                  { value: 'scheduled', label: 'Scheduled', description: 'Best when the customer selects a later slot.' }
                ]}
              />
            </BthBox>
          ) : null}

          {section.id === 'selectors' ? (
            <BthBox gap={3}>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <BthChip label="Shared chip" selected={chipSelected} onPress={() => setChipSelected((current) => !current)} />
                <BthChip label="Static" selected={false} />
              </View>
              <BthCheckbox
                label="Enable central sync"
                description="The selector family keeps semantics and layout centralized."
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
              />
              <BthRadio
                label="Alpha track"
                description="Useful for single-choice selections."
                selected={radioValue === 'alpha'}
                onSelect={() => setRadioValue('alpha')}
              />
              <BthRadio
                label="Beta track"
                description="Mirrors the same shared family in a second option."
                selected={radioValue === 'beta'}
                onSelect={() => setRadioValue('beta')}
              />
              <BthSwitch
                label="Realtime updates"
                description="Uses the shared switch contract."
                value={switchValue}
                onValueChange={setSwitchValue}
              />
              <BthSegmentedControl
                value={segmentValue}
                onValueChange={setSegmentValue}
                options={[
                  { value: 'delivery', label: 'Delivery' },
                  { value: 'pickup', label: 'Pickup' }
                ]}
              />
            </BthBox>
          ) : null}

          {section.id === 'navigation' ? (
            <BthBox gap={3}>
              <BthTabs
                value={navigationValue}
                onValueChange={setNavigationValue}
                testID="lab-navigation-tabs"
                items={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'operations', label: 'Operations', badgeLabel: '3' },
                  { value: 'proof', label: 'Proof' }
                ]}
                stretch
              />
              <BthText role="bodySm" tone="muted">
                Active navigation branch: {navigationValue}
              </BthText>
            </BthBox>
          ) : null}

          {section.id === 'overlays' ? (
            <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              <BthButton label="Open dialog" fullWidth={false} onPress={() => setDialogVisible(true)} />
              <BthButton label="Show toast" tone="secondary" fullWidth={false} onPress={() => setToastVisible(true)} />
            </BthBox>
          ) : null}

          {section.id === 'display' ? (
            <BthBox gap={3}>
              <BthKeyValueList items={deliverySummary} />
              <BthDataTable
                caption="Dispatch proof sample"
                rows={dispatchRows}
                rowKey="id"
                columns={[
                  { id: 'trip', header: 'Run', renderCell: (row) => row.trip },
                  { id: 'owner', header: 'Owner', renderCell: (row) => row.owner },
                  {
                    id: 'status',
                    header: 'Status',
                    align: 'end',
                    renderCell: (row) => (
                      <BthChip
                        label={row.status}
                        selected={row.status === 'Ready'}
                        tone={row.status === 'Blocked' ? 'danger' : row.status === 'In review' ? 'warning' : 'brand'}
                      />
                    )
                  }
                ]}
              />
            </BthBox>
          ) : null}

          {section.id === 'states' ? (
            <BthText role="bodySm" tone="muted">
              Render the dedicated `BthStateGallery` export to review the complete state catalog side by side.
            </BthText>
          ) : null}
        </BthSurface>
      ))}

      <BthDialog
        visible={dialogVisible}
        tone="info"
        title="Shared dialog family"
        description="This confirmation surface now lives inside the central package instead of being re-authored locally."
        onClose={() => setDialogVisible(false)}
        primaryAction={{ label: 'Confirm', onPress: () => setDialogVisible(false) }}
        secondaryAction={{ label: 'Cancel', onPress: () => setDialogVisible(false), tone: 'secondary' }}
      />

      <BthToast
        visible={toastVisible}
        tone="success"
        title="Toast family ready"
        description="Transient feedback now has a shared contract too."
        onDismiss={() => setToastVisible(false)}
        actionLabel="Dismiss"
        onActionPress={() => setToastVisible(false)}
      />
    </BthMobileScrollView>
  );
}