import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus } from '../shared';

export function ControlPanelDshGovernanceEvidenceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Governance evidence"
      title="DSH evidence matrix"
      description="A compact evidence matrix for closure state, surface coverage, and guard results."
      badges={['governance', 'evidence']}
      metaItems={['closure state', 'surface coverage', 'guard results']}
      decisionBoard={{
        title: 'Evidence closure board',
        purpose: 'Keep proof gaps visible before a surface is called closed.',
        primaryDecision: 'Close the evidence gap or leave the surface blocked.',
        nextAction: 'Open guard status and capture the missing proof.',
        blockers: 'Missing evidence and UI-flow cleanup still remain.',
        ownerSurface: 'control',
        evidenceHint: 'closure items, guard results, and route proof',
        routeHint: '/operations?workspace=guard-status',
        decisionTone: 'danger',
      }}
      primaryAction={{ label: 'Open guard status', href: '/operations?workspace=guard-status' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'closed', title: 'Closed', value: String(getDshClosureItemsByStatus('closed').length), description: 'Closed items are already proven.', tone: 'best' },
        { id: 'needs-evidence', title: 'Needs evidence', value: String(getDshClosureItemsByStatus('needs-evidence').length), description: 'Items waiting for evidence proof.', tone: 'warning' },
        { id: 'needs-ui-flow', title: 'Needs UI flow', value: String(getDshClosureItemsByStatus('needs-ui-flow').length), description: 'Items needing flow cleanup.', tone: 'warning' },
        { id: 'blocked', title: 'Blocked', value: String(getDshClosureItemsByStatus('blocked').length), description: 'Items blocked outside closure scope.', tone: 'danger' },
      ]}
    />
  );
}

export function ControlPanelDshGuardStatusScreen() {
  const grouped = {
    closed: getDshClosureItemsByStatus('closed'),
    needsEvidence: getDshClosureItemsByStatus('needs-evidence'),
    needsUiFlow: getDshClosureItemsByStatus('needs-ui-flow'),
    blocked: getDshClosureItemsByStatus('blocked'),
  } as const;

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow="Guard status"
        title="DSH guard status"
        description="DSH-related guards only, with PASS/WARN/BLOCKED style summaries."
        badges={['guards']}
        metaItems={['PASS', 'WARN', 'BLOCKED']}
        decisionBoard={{
          title: 'Guard decision board',
          purpose: 'Expose guard verdicts with the reason and the next step.',
          primaryDecision: 'Pass the surface, warn on review, or block it.',
          nextAction: 'Clear warnings before reopening evidence.',
          blockers: 'Blocked items and proof gaps remain visible here.',
          ownerSurface: 'control',
          evidenceHint: 'guard verdicts and closure-map rows',
          routeHint: '/operations?workspace=evidence',
          decisionTone: 'warning',
        }}
        primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: 'pass', title: 'PASS', value: String(grouped.closed.length), description: 'Closed items that already pass closure.', tone: 'best' },
          { id: 'warn', title: 'WARN', value: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), description: 'Items needing proof or UI cleanup.', tone: 'warning' },
          { id: 'blocked', title: 'BLOCKED', value: String(grouped.blocked.length), description: 'Items blocked outside the current scope.', tone: 'danger' },
        ]}
      />

      <WebSectionCard title="Guard detail" description="The guard view stays narrow and reads only the DSH signals.">
        <Box gap={2}>
          {DSH_CROSS_SURFACE_CLOSURE_MAP.map((item) => (
            <WebSignalCard
              key={`${item.surfaceId}-${item.area}`}
              title={`${item.surfaceId} / ${item.title}`}
              value={item.status.toUpperCase()}
              description={item.description}
              tone={item.status === 'closed' ? 'best' : item.status === 'blocked' ? 'danger' : 'warning'}
            />
          ))}
        </Box>
        <Text role="bodySm" tone="muted">
          Guard summaries remain UI-only and do not touch backend state.
        </Text>
      </WebSectionCard>
    </Box>
  );
}

export default ControlPanelDshGovernanceEvidenceScreen;
