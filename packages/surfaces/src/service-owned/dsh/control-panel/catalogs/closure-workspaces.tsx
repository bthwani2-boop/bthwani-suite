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
      primaryAction={{ label: 'Open catalog approval', href: '/operations?workspace=catalogs' }}
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
