// P0-07: CP partner settlement workspace — WLT bridge, view-only.
// DSH displays WLT-owned settlement data. No settlement initiation, approval, or mutation inside DSH.
// Filtering by partnerId is a WLT-side concern; DSH receives pre-filtered read views.
import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { WltBoundaryBanner } from './WltBoundaryBanner';
import { ControlPanelDshSettlementScreen } from './FinanceHubScreens';
import { buildDshWltFinanceBoundaryRecord } from '../../../shared/dshFinancePreviewModel';

export type PartnerSettlementWorkspaceProps = {
  partnerId?: string;
};

export function PartnerSettlementWorkspace({ partnerId }: PartnerSettlementWorkspaceProps) {
  const boundaryRecord = buildDshWltFinanceBoundaryRecord({
    domain: 'settlement',
    contractStatus: 'pending_contract',
    affectedActor: 'شريك',
    affectedEntityId: partnerId,
    auditVisibilityRequired: true,
  });

  return (
    <Box gap={4} padding={4}>
      <WltBoundaryBanner record={boundaryRecord} />
      <ControlPanelDshSettlementScreen />
    </Box>
  );
}

export default PartnerSettlementWorkspace;
