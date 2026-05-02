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
      decisionBoard={{
        title: 'Partner activation board',
        purpose: 'Keep intake, activation, and document review in a compact control room.',
        primaryDecision: 'Activate, hold, or return for missing documents.',
        nextAction: 'Open document review for the selected partner package.',
        blockers: 'Documents and activation readiness still block final approval.',
        ownerSurface: 'partners',
        evidenceHint: 'activation package proof and readiness state',
        routeHint: '/operations?workspace=partners',
        decisionTone: 'warning',
      }}
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
      decisionBoard={{
        title: 'Document review board',
        purpose: 'Keep partner readiness tied to the document proof and activation handoff.',
        primaryDecision: 'Accept the package or request missing proof.',
        nextAction: 'Open activation once the document bundle is complete.',
        blockers: 'Missing identity proof or incomplete store nomination still block handoff.',
        ownerSurface: 'partners',
        evidenceHint: 'identity proof and document completeness',
        routeHint: '/operations?workspace=partners',
        decisionTone: 'brand',
      }}
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
