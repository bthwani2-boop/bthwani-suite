// ML-046: CP support ticket list screen skeleton
// Wraps the existing ControlPanelDshSupportHubScreen which hosts the queue tab
import React from 'react';
import { ControlPanelDshSupportQueueScreen } from './closure-workspaces';

export function SupportTicketListScreen() {
  // BLOCKED_BY_CONTRACT: replace with dedicated ticket-list implementation once CG-032 contract is proven
  return <ControlPanelDshSupportQueueScreen />;
}

export default SupportTicketListScreen;
