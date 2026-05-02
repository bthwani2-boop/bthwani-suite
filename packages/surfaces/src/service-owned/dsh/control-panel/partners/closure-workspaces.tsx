import React from 'react';
import { Box, Button, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame } from '../shared';

type PartnerReviewKind = 'activation' | 'documents';

function buildPartnerRows(kind: PartnerReviewKind) {
  const baseRows = kind === 'activation'
    ? [
        { id: 'partner-activation', title: 'Partner activation', status: 'Pending', blocker: 'Activation readiness still needs confirmation.', evidence: 'Activation package proof', tone: 'warning' as const },
        { id: 'catalog-handoff', title: 'Catalog handoff', status: 'Ready', blocker: 'Catalog handoff must be acknowledged locally.', evidence: 'Catalog handoff proof', tone: 'brand' as const },
        { id: 'marketing-handoff', title: 'Marketing handoff', status: 'Tracked', blocker: 'Marketing handoff still needs a final route check.', evidence: 'Marketing route proof', tone: 'best' as const },
      ]
    : [
        { id: 'identity-proof', title: 'Identity proof', status: 'Pending', blocker: 'Identity proof is missing or incomplete.', evidence: 'Identity documents', tone: 'warning' as const },
        { id: 'store-nomination', title: 'Store nomination', status: 'Ready', blocker: 'Store nomination needs a local review.', evidence: 'Store nomination proof', tone: 'brand' as const },
        { id: 'document-completeness', title: 'Document completeness', status: 'Tracked', blocker: 'The package is close but still needs signoff.', evidence: 'Document completeness proof', tone: 'best' as const },
      ];

  return baseRows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    ownerSurface: 'partners',
    blocker: row.blocker,
    evidence: row.evidence,
    primaryActionLabel: 'Approve',
    secondaryActionLabel: 'Request docs',
    evidenceActionLabel: kind === 'activation' ? 'Open handoff' : 'Open blocker',
    tone: row.tone,
  }));
}

function PartnerReviewBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: PartnerReviewKind;
}) {
  const items = React.useMemo(() => buildPartnerRows(kind), [kind]);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [lastAction, setLastAction] = React.useState('Ready for partner review');
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <Box gap={4}>
      <ControlPanelDshWorkspaceFrame
        eyebrow={kind === 'activation' ? 'Partner activation' : 'Document review'}
        title={title}
        description="A local partner control room with selected item state, approval actions, and explicit handoff or blocker routing."
        badges={['partners', kind]}
        metaItems={[selectedItem?.status ?? 'Pending', lastAction]}
        decisionBoard={{
          title: `${title} board`,
          purpose,
          primaryDecision: selectedItem?.status ?? 'Pending',
          nextAction: lastAction,
          blockers: selectedItem?.blocker ?? 'Select a partner row.',
          ownerSurface: 'partners',
          evidenceHint: selectedItem?.evidence ?? 'partner evidence',
          routeHint: '/operations?workspace=partners',
          decisionTone: selectedItem?.tone,
        }}
        primaryAction={{ label: 'Open catalog handoff', href: '/operations?workspace=catalogs' }}
        secondaryAction={{ label: 'Open marketing handoff', href: '/operations?workspace=marketing' }}
        signals={[
          { id: `${kind}-pending`, title: 'Pending', value: 'Visible', description: 'Items pending partner review.', tone: 'warning' },
          { id: `${kind}-ready`, title: 'Ready', value: 'Visible', description: 'Items ready for local action.', tone: 'best' },
          { id: `${kind}-handoff`, title: 'Handoff', value: 'Tracked', description: 'Selected handoff is explicit.', tone: 'brand' },
        ]}
      />

      <ControlPanelDshActionQueue
        title={kind === 'activation' ? 'Activation queue' : 'Document queue'}
        purpose="Choose a row, approve or request docs, then open handoff or blocker locally."
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        primaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`Approve: ${item.title}`);
        }}
        secondaryAction={(item) => {
          setSelectedId(item.id);
          setLastAction(`Request docs: ${item.title}`);
        }}
        evidenceAction={(item) => {
          setSelectedId(item.id);
          setLastAction(kind === 'activation' ? `Open handoff: ${item.title}` : `Open blocker: ${item.title}`);
        }}
      />

      <WebSectionCard
        title={kind === 'activation' ? 'Partner handoff' : 'Document blocker'}
        description="Keep the selected item visible while the local handoff or blocker step is triggered."
      >
        <Box gap={2}>
          <Text role="bodySm" tone="muted">
            {selectedItem ? `${selectedItem.title} · ${selectedItem.evidence}` : 'Select a row to continue.'}
          </Text>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button label="Approve" tone="primary" fullWidth={false} onPress={() => selectedItem && setLastAction(`Approve: ${selectedItem.title}`)} />
            <Button label="Request docs" tone="secondary" fullWidth={false} onPress={() => selectedItem && setLastAction(`Request docs: ${selectedItem.title}`)} />
            <Button
              label={kind === 'activation' ? 'Open handoff' : 'Open blocker'}
              tone="ghost"
              fullWidth={false}
              onPress={() => selectedItem && setLastAction(`${kind === 'activation' ? 'Open handoff' : 'Open blocker'}: ${selectedItem.title}`)}
            />
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export function ControlPanelDshPartnerActivationScreen() {
  return (
    <PartnerReviewBoard
      kind="activation"
      title="Partner activation intake"
      purpose="Keep intake, activation, and document review in a compact control room."
    />
  );
}

export function ControlPanelDshPartnerDocumentReviewScreen() {
  return (
    <PartnerReviewBoard
      kind="documents"
      title="Partner document review"
      purpose="Keep partner readiness tied to the document proof and activation handoff."
    />
  );
}

export default ControlPanelDshPartnerActivationScreen;
