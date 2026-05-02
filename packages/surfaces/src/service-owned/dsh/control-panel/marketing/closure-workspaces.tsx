import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshMarketingApprovalScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Marketing approval"
      title="Campaign and offer approval"
      description="Campaigns and offers stay in a dedicated approval lane before release."
      badges={['marketing', 'approval']}
      metaItems={['campaigns', 'offers', 'release']}
      decisionBoard={{
        title: 'Marketing approval board',
        purpose: 'Keep approval, video review, and release gating visible without a long page.',
        primaryDecision: 'Approve, send back, or hold for policy review.',
        nextAction: 'Open video submissions review for the selected lane.',
        blockers: 'Release gating and unreviewed offers still block launch.',
        ownerSurface: 'marketing',
        evidenceHint: 'approval lane proof and release gating',
        routeHint: '/operations?workspace=marketing',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'Open video review', href: '/operations?workspace=marketing' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'campaigns', title: 'Campaigns', value: 'Open', description: 'Campaign approval stays visible.', tone: 'brand' },
        { id: 'offers', title: 'Offers', value: 'Open', description: 'Offer approval remains explicit.', tone: 'warning' },
        { id: 'release', title: 'Release', value: 'Visible', description: 'Release state stays legible.', tone: 'best' },
      ]}
    />
  );
}

export function ControlPanelDshVideoSubmissionsReviewScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Video submissions"
      title="Partner video submissions review"
      description="Video submissions remain in a review lane before release to the wider surface."
      badges={['video', 'review']}
      metaItems={['submissions', 'review', 'release']}
      decisionBoard={{
        title: 'Video review board',
        purpose: 'Keep video review tied to the release decision instead of a generic summary.',
        primaryDecision: 'Release the submission or return it to review.',
        nextAction: 'Open marketing approval for the linked campaign or offer.',
        blockers: 'Pending review and release gating remain in the lane.',
        ownerSurface: 'marketing',
        evidenceHint: 'submission review and release gating proof',
        routeHint: '/operations?workspace=marketing',
        decisionTone: 'brand',
      }}
      primaryAction={{ label: 'Open marketing approval', href: '/operations?workspace=marketing' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'submissions', title: 'Submissions', value: 'Visible', description: 'Submission queue stays open.', tone: 'brand' },
        { id: 'review', title: 'Review', value: 'Queued', description: 'Review state stays visible.', tone: 'warning' },
        { id: 'release', title: 'Release', value: 'Pending', description: 'Release remains gated.', tone: 'best' },
      ]}
    />
  );
}

export default ControlPanelDshMarketingApprovalScreen;
