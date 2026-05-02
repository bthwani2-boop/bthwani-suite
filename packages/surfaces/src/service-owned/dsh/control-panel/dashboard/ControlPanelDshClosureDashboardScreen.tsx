import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard, WebControlDisclosureItem } from '@bthwani/ui-kit/web';
import { ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus, getDshClosureItemsBySurface } from '../shared';

function countByStatus(status: 'closed' | 'needs-evidence' | 'needs-ui-flow' | 'blocked') {
  return getDshClosureItemsByStatus(status).length;
}

export function ControlPanelDshClosureDashboardScreen() {
  const surfaceCounts = {
    client: getDshClosureItemsBySurface('client').length,
    partner: getDshClosureItemsBySurface('partner').length,
    captain: getDshClosureItemsBySurface('captain').length,
    field: getDshClosureItemsBySurface('field').length,
    'control-panel': getDshClosureItemsBySurface('control-panel').length,
  } as const;

  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="DSH closure dashboard"
      title="DSH closure matrix"
      description="لقطة واحدة توضح ما هو مغلق، وما يحتاج evidence، وما يحتاج UI flow قبل الخروج النهائي."
      badges={['DSH', 'closure', 'dashboard']}
      metaItems={[
        `closed: ${countByStatus('closed')}`,
        `needs-evidence: ${countByStatus('needs-evidence')}`,
        `needs-ui-flow: ${countByStatus('needs-ui-flow')}`,
        `blocked: ${countByStatus('blocked')}`,
      ]}
      primaryAction={{ label: 'Open evidence', href: '/control?tab=governance' }}
      secondaryAction={{ label: 'Open guard status', href: '/operations?workspace=guard-status' }}
      signals={[
        { id: 'surface-client', title: 'client', value: String(surfaceCounts.client), description: 'client order closure items', tone: 'best' },
        { id: 'surface-partner', title: 'partner', value: String(surfaceCounts.partner), description: 'partner order closure items', tone: 'best' },
        { id: 'surface-captain', title: 'captain', value: String(surfaceCounts.captain), description: 'captain order closure items', tone: 'warning' },
        { id: 'surface-field', title: 'field', value: String(surfaceCounts.field), description: 'field onboarding and visit items', tone: 'warning' },
        { id: 'surface-control', title: 'control-panel', value: String(surfaceCounts['control-panel']), description: 'control room closure items', tone: 'brand' },
      ]}
    />
  );
}

export function ControlPanelDshClosureEvidenceStream() {
  return (
    <WebSectionCard title="Closure evidence stream" description="Each item is a closure unit that can be routed to the right workspace.">
      <Box gap={2}>
        {DSH_CROSS_SURFACE_CLOSURE_MAP.map((item) => (
          <WebControlDisclosureItem
            key={`${item.surfaceId}-${item.area}`}
            id={`${item.surfaceId}-${item.area}`}
            label={`${item.surfaceId} / ${item.title}`}
            description={item.description}
            badge={item.status}
            href={item.routeHint}
          />
        ))}
      </Box>
      <Text role="bodySm" tone="muted">
        The dashboard stays read-only and does not mutate runtime state.
      </Text>
    </WebSectionCard>
  );
}

export default ControlPanelDshClosureDashboardScreen;
