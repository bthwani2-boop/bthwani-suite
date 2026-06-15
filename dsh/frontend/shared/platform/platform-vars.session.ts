// Canonical location: dsh/frontend/shared/platform/platform-vars.session.ts
// Authority: dsh/frontend/shared/platform — session state for platform vars proposed-value edits.
// Rule: all mutation logic lives here; control-panel UI is a read-only binding consumer.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { AuditEvent } from './platform-audit-state';
import type { DshPlatformVarRecord, DshPlatformVarStatus } from './platform.types';
import {
  DSH_PLATFORM_OPERATIONAL_VARS,
  DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
  DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  DSH_PLATFORM_DESIGN_POLICY_VARS,
} from './platform-vars.view-model';
import {
  isPlatformVarMutationAllowed,
  isPlatformDesignValValid,
} from './platform-vars.policy';
import type { PlatformVarMutationAction } from './platform-vars.policy';

export type PlatformVarsSessionEntry = {
  readonly current: string;
  readonly proposed: string | null;
  readonly status: DshPlatformVarStatus;
};

function buildInitialVarsState(): Record<string, PlatformVarsSessionEntry> {
  const init: Record<string, PlatformVarsSessionEntry> = {};
  const all = [
    ...DSH_PLATFORM_OPERATIONAL_VARS,
    ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
    ...DSH_PLATFORM_PROVIDER_CONTROL_VARS,
    ...DSH_PLATFORM_DESIGN_POLICY_VARS,
  ];
  for (const v of all) {
    init[v.id] = { current: v.currentValue, proposed: v.proposedValue ?? null, status: v.status };
  }
  return init;
}

export function usePlatformVarsSession(
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void,
) {
  const [varsState, setVarsState] = React.useState<Record<string, PlatformVarsSessionEntry>>(buildInitialVarsState);

  const [editVal, setEditVal] = React.useState('');
  const [showConfirm, setShowConfirm] = React.useState<PlatformVarMutationAction | null>(null);

  const getLive = React.useCallback(
    (v: DshPlatformVarRecord): DshPlatformVarRecord => {
      const s = varsState[v.id];
      if (!s) return { ...v, proposedValue: v.proposedValue ?? null };
      return { ...v, currentValue: s.current, proposedValue: s.proposed };
    },
    [varsState],
  );

  const confirmSaveProposed = React.useCallback(
    (selectedVar: DshPlatformVarRecord, currentEditVal: string) => {
      if (!isPlatformVarMutationAllowed('save-proposed', selectedVar.key)) {
        setShowConfirm(null);
        return;
      }
      if (!isPlatformDesignValValid(selectedVar.key, currentEditVal)) return;
      const prev = varsState[selectedVar.id] ?? {
        current: selectedVar.currentValue,
        proposed: selectedVar.proposedValue ?? null,
        status: selectedVar.status,
      };
      setVarsState((s) => ({ ...s, [selectedVar.id]: { ...prev, proposed: currentEditVal || null } }));
      addAuditEvent({
        action: `حفظ مقترح (${selectedVar.label})`,
        operator: 'platform-operator',
        status: 'success',
        oldValue: prev.proposed ?? '',
        newValue: currentEditVal,
        reason: 'حفظ قيمة مقترحة (محلي فقط)',
        scope: selectedVar.scope,
        impact: selectedVar.effectSummary,
        rollbackAvailable: false,
      });
      setShowConfirm(null);
    },
    [varsState, addAuditEvent],
  );

  return { varsState, getLive, editVal, setEditVal, showConfirm, setShowConfirm, confirmSaveProposed };
}
