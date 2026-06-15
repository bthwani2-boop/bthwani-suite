// Re-export from canonical location: dsh/frontend/shared/view-models/control-panel/platform/platform-audit-state.ts
import * as React from 'react';
import {
  PlatformAuditContext,
  usePlatformAuditStateHook,
} from '../../shared/platform/platform-audit-state';

export type { AuditEvent } from '../../shared/platform/platform-audit-state';
export {
  usePlatformAuditStateHook,
  PlatformAuditContext,
  usePlatformAuditState,
} from '../../shared/platform/platform-audit-state';

// Provider wrapper kept in control-panel (needs JSX runtime).
export function PlatformAuditProvider({ children }: { children: React.ReactNode }) {
  const state = usePlatformAuditStateHook();
  return <PlatformAuditContext.Provider value={state}>{children}</PlatformAuditContext.Provider>;
}
