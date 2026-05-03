import React from 'react';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../shared';

type MarketingReviewKind = 'approval' | 'video';

type MarketingReviewRow = {
  id: string;
  title: string;
  status: string;
  ownerSurface: string;
  blocker: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  evidenceActionLabel: string;
  tone: 'brand' | 'best' | 'warning' | 'danger';
};

function buildMarketingRows(kind: MarketingReviewKind) {
  const baseRows = kind === 'approval'
    ? [
        { id: 'campaign-approval', title: 'Campaign approval', status: 'Ready', blocker: 'Release gating still needs a final local pass.', evidence: 'Campaign proof and release gate', tone: 'brand' as const },
        { id: 'offer-review', title: 'Offer review', status: 'Queued', blocker: 'Offer copy needs clarity before release.', evidence: 'Offer copy and policy proof', tone: 'warning' as const },
        { id: 'handoff-review', title: 'Handoff review', status: 'Tracked', blocker: 'Cross-surface handoff still needs confirmation.', evidence: 'Handoff chain and owner proof', tone: 'best' as const },
      ]
    : [
        { id: 'video-review', title: 'Video submission review', status: 'Ready', blocker: 'Submission needs a final approval or edit.', evidence: 'Video proof and release gate', tone: 'brand' as const },
        { id: 'banner-review', title: 'Banner review', status: 'Queued', blocker: 'Visual copy still needs a local decision.', evidence: 'Banner proof and route handoff', tone: 'warning' as const },
        { id: 'growth-review', title: 'Growth review', status: 'Tracked', blocker: 'Growth lane proof remains visible.', evidence: 'Growth proof and owner handoff', tone: 'best' as const },
      ];

  return baseRows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    ownerSurface: 'marketing',
    blocker: row.blocker,
    evidence: row.evidence,
    primaryActionLabel: 'Approve',
    secondaryActionLabel: 'Request edit',
    evidenceActionLabel: kind === 'approval' ? 'Open handoff' : 'Open evidence',
    tone: row.tone,
  })) satisfies readonly MarketingReviewRow[];
}

function MarketingReviewBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: MarketingReviewKind;
}) {
  const items = React.useMemo(() => buildMarketingRows(kind), [kind]);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('Ready for marketing review');
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow={kind === 'approval' ? 'Marketing approval' : 'Video review'}
        title={title}
        description="A local marketing review lane with selected item state, approval actions, and explicit evidence handoff."
        badges={['marketing', kind]}
        metaItems={[selectedItem?.status ?? 'Ready', lastAction]}
        decisionBoard={{
          title: `${title} board`,
          purpose,
          primaryDecision: selectedItem?.status ?? 'Ready',
          nextAction: lastAction,
          blockers: selectedItem?.blocker ?? 'Select a marketing row.',
          ownerSurface: 'marketing',
          evidenceHint: selectedItem?.evidence ?? 'marketing evidence',
          routeHint: '/operations?workspace=marketing',
          decisionTone: selectedItem?.tone,
        }}
        primaryAction={{ label: 'Open marketing approval', href: '/operations?workspace=marketing' }}
        secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
        signals={[
          { id: `${kind}-ready`, title: 'Ready', value: 'Visible', description: 'Ready items stay selectable.', tone: 'best' },
          { id: `${kind}-queued`, title: 'Queued', value: 'Visible', description: 'Queued items still need review.', tone: 'warning' },
          { id: `${kind}-handoff`, title: 'Handoff', value: 'Tracked', description: 'Handoff evidence is explicit.', tone: 'brand' },
        ]}
      />

      <ControlPanelDshActionQueue
        title={kind === 'approval' ? 'Approval queue' : 'Video queue'}
        purpose="Choose a row, approve or request edits, then open evidence or handoff locally."
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`Approve: ${item.title}`);
        }}
        secondaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`Request edit: ${item.title}`);
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setLastAction(kind === 'approval' ? `Open handoff: ${item.title}` : `Open evidence: ${item.title}`);
        }}
      />

      <WebSectionCard
        title={kind === 'approval' ? 'Marketing handoff' : 'Video evidence'}
        description="The selected item stays visible while the local handoff or evidence step is triggered."
      >
        <Box gap={2}>
          <Text role="bodySm" tone="muted">
            {selectedItem ? `${selectedItem.title} · ${selectedItem.evidence}` : 'Select a row to continue.'}
          </Text>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button label="Approve" tone="primary" fullWidth={false} onPress={() => selectedItem && setLastAction(`Approve: ${selectedItem.title}`)} />
            <Button label="Request edit" tone="secondary" fullWidth={false} onPress={() => selectedItem && setLastAction(`Request edit: ${selectedItem.title}`)} />
            <Button
              label={kind === 'approval' ? 'Open handoff' : 'Open evidence'}
              tone="ghost"
              fullWidth={false}
              onPress={() => selectedItem && setLastAction(`${kind === 'approval' ? 'Open handoff' : 'Open evidence'}: ${selectedItem.title}`)}
            />
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export function ControlPanelDshMarketingApprovalScreen() {
  return (
    <MarketingReviewBoard
      kind="approval"
      title="Campaign and offer approval"
      purpose="Keep approval, video review, and release gating visible without a long page."
    />
  );
}

export function ControlPanelDshVideoSubmissionsReviewScreen() {
  return (
    <MarketingReviewBoard
      kind="video"
      title="Partner video submissions review"
      purpose="Keep video review tied to the release decision instead of a generic summary."
    />
  );
}

export default ControlPanelDshMarketingApprovalScreen;
