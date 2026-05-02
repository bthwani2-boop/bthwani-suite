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
