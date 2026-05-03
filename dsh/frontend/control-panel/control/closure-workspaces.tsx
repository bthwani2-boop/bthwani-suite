import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import { WebSectionCard, WebSegmentedTabs, WebSignalCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, DSH_CROSS_SURFACE_CLOSURE_MAP, getDshClosureItemsByStatus } from '../shared';

type GuardFilter = 'pass' | 'warn' | 'blocked';

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
  const [activeFilter, setActiveFilter] = React.useState<GuardFilter>('warn');
  const [reviewedIds, setReviewedIds] = React.useState<ReadonlySet<string>>(new Set());
  const selectedItems = activeFilter === 'pass'
    ? grouped.closed
    : activeFilter === 'blocked'
      ? grouped.blocked
      : [...grouped.needsEvidence, ...grouped.needsUiFlow];
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(selectedItems[0] ? `${selectedItems[0].surfaceId}-${selectedItems[0].area}` : null);

  React.useEffect(() => {
    setSelectedItemId(selectedItems[0] ? `${selectedItems[0].surfaceId}-${selectedItems[0].area}` : null);
  }, [activeFilter]);

  const queueItems = selectedItems.map((item) => {
    const id = `${item.surfaceId}-${item.area}`;
    return {
      id,
      title: `${item.surfaceId} / ${item.title}`,
      status: item.status.toUpperCase(),
      ownerSurface: 'control',
      blocker: item.description,
      evidence: reviewedIds.has(id) ? 'Reviewed locally' : 'Open evidence required',
      primaryActionLabel: 'Mark reviewed locally',
      secondaryActionLabel: 'Open blocker',
      evidenceActionLabel: 'Open evidence',
      tone: item.status === 'closed' ? 'best' : item.status === 'blocked' ? 'danger' : 'warning',
    } as const;
  });

  const selectedQueueItem = queueItems.find((item) => item.id === selectedItemId) ?? queueItems[0];

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
          nextAction: activeFilter === 'blocked' ? 'Open blocker and evidence' : 'Mark reviewed locally and reopen evidence if needed.',
          blockers: 'Blocked items and proof gaps remain visible here.',
          ownerSurface: 'control',
          evidenceHint: selectedQueueItem ? selectedQueueItem.evidence : 'guard verdicts and closure-map rows',
          routeHint: '/operations?workspace=evidence',
          decisionTone: activeFilter === 'blocked' ? 'danger' : activeFilter === 'pass' ? 'best' : 'warning',
        }}
        primaryAction={{ label: 'Open evidence', href: '/operations?workspace=evidence' }}
        secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: 'pass', title: 'PASS', value: String(grouped.closed.length), description: 'Closed items that already pass closure.', tone: 'best' },
          { id: 'warn', title: 'WARN', value: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), description: 'Items needing proof or UI cleanup.', tone: 'warning' },
          { id: 'blocked', title: 'BLOCKED', value: String(grouped.blocked.length), description: 'Items blocked outside the current scope.', tone: 'danger' },
        ]}
      />

      <WebSectionCard title="Guard filters" description="Filter the closure map by verdict, then mark a row reviewed locally.">
        <WebSegmentedTabs
          ariaLabel="Guard filters"
          items={[
            { id: 'pass', label: 'PASS', metaLabel: String(grouped.closed.length), active: activeFilter === 'pass' },
            { id: 'warn', label: 'WARN', metaLabel: String(grouped.needsEvidence.length + grouped.needsUiFlow.length), active: activeFilter === 'warn' },
            { id: 'blocked', label: 'BLOCKED', metaLabel: String(grouped.blocked.length), active: activeFilter === 'blocked' },
          ]}
          onSelect={(itemId) => setActiveFilter(itemId as GuardFilter)}
        />
        <ControlPanelDshActionQueue
          title="Guard rows"
          purpose="Review the selected verdict row, open the blocker, or open evidence."
          items={queueItems}
          selectedId={selectedItemId}
          onSelect={setSelectedItemId}
          primaryAction={(item) => setReviewedIds((current) => new Set([...current, item.id]))}
          secondaryAction={() => setActiveFilter('blocked')}
          evidenceAction={() => setActiveFilter('warn')}
        />
        <Box gap={2}>
          {DSH_CROSS_SURFACE_CLOSURE_MAP.slice(0, 3).map((item) => (
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
