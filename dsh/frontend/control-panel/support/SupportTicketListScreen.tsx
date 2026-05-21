// P0-06: CP support ticket list — wraps the unified SupportHubScreen queue tab.
// The hub screen renders the ticket queue, escalation, SLA dashboard, and messaging inline.
import React from 'react';
import { ControlPanelDshSupportQueueScreen } from './SupportHubScreens';

export function SupportTicketListScreen() {
  return <ControlPanelDshSupportQueueScreen />;
}

export default SupportTicketListScreen;
