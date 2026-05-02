import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshPartnerActivationScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Partner activation"
      title="Partner activation intake"
      description="Intake review, document review, and activation decision stay in one visible flow."
      badges={['partners', 'activation']}
      metaItems={['intake', 'documents', 'decision']}
      primaryAction={{ label: 'Open document review', href: '/operations?workspace=partners' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'intake', title: 'Intake review', value: 'Open', description: 'Partner intake stays visible.', tone: 'brand' },
        { id: 'documents', title: 'Documents', value: 'Ready', description: 'Document review is explicit.', tone: 'warning' },
        { id: 'decision', title: 'Activation decision', value: 'Pending', description: 'Activation decision stays legible.', tone: 'best' },
      ]}
    />
  );
}

export function ControlPanelDshPartnerDocumentReviewScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Document review"
      title="Partner document review"
      description="Identity, store nomination, and document completeness remain visible."
      badges={['documents']}
      metaItems={['identity', 'store nomination', 'completeness']}
      primaryAction={{ label: 'Open activation', href: '/operations?workspace=partners' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'identity', title: 'Identity', value: 'Visible', description: 'Identity proof remains explicit.', tone: 'brand' },
        { id: 'nomination', title: 'Store nomination', value: 'Visible', description: 'Store nomination stays legible.', tone: 'warning' },
        { id: 'completeness', title: 'Completeness', value: 'Tracked', description: 'Document completeness remains obvious.', tone: 'best' },
      ]}
    />
  );
}

export default ControlPanelDshPartnerActivationScreen;
