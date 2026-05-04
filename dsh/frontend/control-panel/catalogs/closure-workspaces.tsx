import React from 'react';
import { ControlPanelDshWorkspaceFrame } from '../shared';

export function ControlPanelDshCatalogApprovalScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Catalog approval"
      title="Catalog approval and price health"
      description="Item approval, listing status, price anomaly, and inventory approval stay visible."
      badges={['catalogs', 'approval']}
      metaItems={['item approval', 'listing status', 'price anomaly', 'inventory approval']}
      decisionBoard={{
        title: 'Catalog decision board',
        purpose: 'Keep catalog approvals, list health, and publish gating in one control-room read.',
        primaryDecision: 'Approve the item, hold it, or send it back for correction.',
        nextAction: 'Open listing governance for conflicts, duplicates, or price anomalies.',
        blockers: 'Pending approvals and inventory disagreements still block publish.',
        ownerSurface: 'catalogs',
        evidenceHint: 'catalog approval proof plus price health signals',
        routeHint: '/catalogs',
        decisionTone: 'warning',
      }}
      primaryAction={{ label: 'Open listing governance', href: '/operations?workspace=issues' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'item-approval', title: 'Item approval', value: 'Ready', description: 'Approval queue is visible.', tone: 'brand' },
        { id: 'listing-status', title: 'Listing status', value: 'Visible', description: 'Active and inactive items are legible.', tone: 'best' },
        { id: 'price-anomaly', title: 'Price anomaly', value: 'Reviewed', description: 'Anomaly signals remain explicit.', tone: 'warning' },
        { id: 'inventory-approval', title: 'Inventory approval', value: 'Open', description: 'Inventory approval queue is clear.', tone: 'warning' },
      ]}
    />
  );
}

export function ControlPanelDshListingGovernanceScreen() {
  return (
    <ControlPanelDshWorkspaceFrame
      eyebrow="Listing governance"
      title="Catalog listing governance"
      description="Active/inactive listing state, store catalog health, and duplicate/conflict signals stay visible."
      badges={['governance']}
      metaItems={['active', 'inactive', 'health', 'duplicates']}
      decisionBoard={{
        title: 'Listing governance board',
        purpose: 'Keep the final publish gate visible before anything leaves the catalog lane.',
        primaryDecision: 'Keep, merge, or block the listing before publish.',
        nextAction: 'Open catalog approval for the selected item or conflict cluster.',
        blockers: 'Duplicates, conflicts, and health gaps still need review.',
        ownerSurface: 'catalogs',
        evidenceHint: 'duplicate/conflict proof and store catalog health',
        routeHint: '/catalogs',
        decisionTone: 'brand',
      }}
      primaryAction={{ label: 'Open catalog approval', href: '/catalogs' }}
      secondaryAction={{ label: 'Open dashboard', href: '/operations?workspace=dashboard' }}
      signals={[
        { id: 'active-listing', title: 'Active listings', value: 'Visible', description: 'Active items remain easy to scan.', tone: 'best' },
        { id: 'inactive-listing', title: 'Inactive listings', value: 'Visible', description: 'Inactive items remain legible.', tone: 'warning' },
        { id: 'catalog-health', title: 'Store catalog health', value: 'Checked', description: 'Catalog health stays on the surface.', tone: 'brand' },
        { id: 'duplicate-conflict', title: 'Duplicate/conflict', value: 'Tracked', description: 'Signals are visible for escalation.', tone: 'warning' },
      ]}
    />
  );
}

export default ControlPanelDshCatalogApprovalScreen;
