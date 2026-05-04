'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, StateView, Text } from '@bthwani/ui-kit';
import { WebPageFrame, WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshDecisionBoard, ControlPanelDshWorkspaceFrame } from '../../shared';
import { useDshControlPanelText, type DshWorkspaceScreenState, resolveWorkspaceStateCopy } from '../shared';
import { getDshCapacityPreview } from './capacity-fixtures';

export type ControlPanelDshAreaCapacityMonitorScreenProps = {
  state?: DshWorkspaceScreenState;
  hubHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshAreaCapacityMonitorScreen({
  state = 'ready',
  hubHref = '/operations',
  embedded = false,
  showHeader = true,
}: ControlPanelDshAreaCapacityMonitorScreenProps) {
  const router = useRouter();
  const dshText = useDshControlPanelText();
  const preview = React.useMemo(() => getDshCapacityPreview(), []);

  if (state !== 'ready') {
    const stateCopy = resolveWorkspaceStateCopy(dshText, state);
    return (
      <WebPageFrame eyebrow='DSH / operations / capacity' title='Area capacity monitor' description='Preview-only area capacity monitor.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
        <StateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </WebPageFrame>
    );
  }

  return (
    <WebPageFrame eyebrow='DSH / operations / capacity' title='Area capacity monitor' description='A compact control room for area pressure, delivery mode load, and reserve windows.' maxWidth={1120} embedded={embedded} showHeader={showHeader}>
      <Box gap={4}>
        <ControlPanelDshDecisionBoard
          title='Capacity decision board'
          purpose='Keep area pressure and reserved windows visible so the ops lane can make a capacity call.'
          primaryDecision='Keep monitoring or switch pressure management into peak mode.'
          nextAction='Open peak mode or zone set when the area pressure becomes structural.'
          blockers='Reserved windows and delivery mode pressure remain explicit.'
          ownerSurface='operations'
          evidenceHint='busy area, captain supply, windows, and mode pressure'
          routeHint='/operations?workspace=capacity'
          decisionTone='warning'
        />

        <ControlPanelDshWorkspaceFrame
          eyebrow='Capacity preview'
          title='Area capacity monitor workspace'
          description='Local preview of capacity control without runtime truth claims.'
          badges={['capacity', 'preview', 'operations']}
          metaItems={[
            `Busy areas: ${preview.summary.busyAreas}`,
            `Low supply: ${preview.summary.lowSupply}`,
            `Reserved windows: ${preview.summary.reservedWindows}`,
            `Pressure modes: ${preview.summary.pressureModes}`,
          ]}
          primaryAction={{ label: 'Open peak mode', href: '/operations?workspace=peak-mode' }}
          secondaryAction={{ label: 'Open zone set', href: '/operations?workspace=zone-set' }}
          signals={[
            { id: 'capacity-busy', title: 'Busy areas', value: String(preview.summary.busyAreas), description: 'Areas currently under visible pressure.', tone: 'danger' },
            { id: 'capacity-supply', title: 'Low captain supply', value: String(preview.summary.lowSupply), description: 'Areas with a thin captain reserve.', tone: 'warning' },
            { id: 'capacity-windows', title: 'Reserved windows', value: String(preview.summary.reservedWindows), description: 'Capacity windows already reserved for delivery.', tone: 'best' },
            { id: 'capacity-pressure', title: 'Pressure modes', value: String(preview.summary.pressureModes), description: 'Mode pressure currently being monitored.', tone: 'brand' },
          ]}
          actions={[
            { id: 'capacity-peak-mode', label: 'Open peak mode', description: 'Move into pressure management when the area is overloaded.', href: '/operations?workspace=peak-mode', badge: 'Pressure' },
            { id: 'capacity-zone-set', label: 'Open zone set', description: 'Check the boundaries that define the delivery area.', href: '/operations?workspace=zone-set', badge: 'Boundary' },
            { id: 'capacity-serviceability', label: 'Open serviceability', description: 'Re-read coverage and delivery availability for the zone.', href: '/operations?workspace=serviceability', badge: 'Coverage' },
            { id: 'capacity-dispatch', label: 'Open dispatch', description: 'Send the capacity lane back to assignment when ready.', href: '/operations?workspace=dispatch', badge: 'Recovery' },
          ]}
          disclosures={[
            { id: 'capacity-instant', label: 'Instant / scheduled / pickup', description: 'The pressure map keeps the delivery modes separated.', href: '/operations?workspace=capacity' },
            { id: 'capacity-partner', label: 'Partner delivery / Bthwani delivery', description: 'Two delivery modes stay readable in the same preview lane.', href: '/operations?workspace=capacity' },
          ]}
        />

        <WebSectionCard title='Capacity lanes' description='Each row shows area pressure, captain supply, and the reserved window.'>
          <Box gap={2}>
            {preview.lanes.map((lane) => (
              <Box key={lane.id} padding={3} gap={1} border radiusToken='xl' background='surfaceRaised'>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='bodyStrong'>{lane.id}</Text>
                  <Badge label={lane.capacityState} tone={lane.capacityState.includes('high') ? 'danger' : lane.capacityState.includes('tight') ? 'warning' : 'success'} />
                </Box>
                <Text role='bodySm' tone='muted'>{lane.areaBusy} · captain supply low: {lane.captainSupplyLow}</Text>
                <Box layoutDirection='row' justify='space-between' align='center' style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Text role='caption' tone='soft'>Available windows: {lane.availableWindows}</Text>
                  <Text role='caption' tone='soft'>Reserved until: {lane.reservedUntil}</Text>
                </Box>
                <Text role='caption' tone='muted'>Delivery mode pressure: {lane.modePressure}</Text>
              </Box>
            ))}
          </Box>
        </WebSectionCard>
      </Box>
    </WebPageFrame>
  );
}

export default ControlPanelDshAreaCapacityMonitorScreen;
