// ML-040: CP partner settlement workspace skeleton (WLT bridge — view-only)
// BLOCKED_BY_WLT: replace with dedicated workspace once WLT exposes settlement read endpoints
import React from 'react';
import { ControlPanelDshSettlementScreen } from './FinanceHubScreens';

export type PartnerSettlementWorkspaceProps = {
  partnerId?: string;
};

export function PartnerSettlementWorkspace({ partnerId: _partnerId }: PartnerSettlementWorkspaceProps) {
  // WLT owns all settlement money semantics — DO NOT add payment logic here
  // BLOCKED_BY_CONTRACT: filter settlement rows by partnerId once CG-028 contract is proven
  return <ControlPanelDshSettlementScreen />;
}

export default PartnerSettlementWorkspace;
