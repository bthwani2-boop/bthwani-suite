// Canonical location: dsh/frontend/shared/captain/captain-chat.model.ts
// Authority: dsh/frontend/shared/captain — order chat message composition.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CompactOrderChatMessage } from './captain.contract';
import type { DshCaptainSurfaceState } from './captain.surface.types';

type SetField = <k extends keyof DshCaptainSurfaceState>(
  key: k,
  value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
) => void;

export function useCaptainChatModel({
  activeOrderDraft,
  set,
}: {
  activeOrderDraft: string;
  set: SetField;
}) {
  const sendQuickMessage = React.useCallback(() => {
    const text = activeOrderDraft.trim();
    if (!text) return;
    set('activeOrderMessages', (cur: CompactOrderChatMessage[]) => [
      ...cur,
      { id: `msg-${cur.length + 1}`, sender: 'الكابتن', text, time: 'الآن', side: 'end' },
    ]);
    set('activeOrderDraft', '');
  }, [activeOrderDraft, set]);

  return { sendQuickMessage };
}
