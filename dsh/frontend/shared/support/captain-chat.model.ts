// Canonical location: dsh/frontend/shared/support/captain-chat.model.ts
// Authority: dsh/frontend/shared/support — captain order support chat.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { CompactOrderChatMessage } from '../../app-captain/captain/captain.contract';

export function useCaptainChatModel() {
  const [activeOrderDraft, setActiveOrderDraft] = React.useState('');
  const [activeOrderMessages, setActiveOrderMessages] = React.useState<CompactOrderChatMessage[]>([]);

  const sendQuickMessage = React.useCallback(() => {
    const text = activeOrderDraft.trim();
    if (!text) return;
    setActiveOrderMessages((cur) => [
      ...cur,
      { id: `msg-${cur.length + 1}`, sender: 'الكابتن', text, time: 'الآن', side: 'end' },
    ]);
    setActiveOrderDraft('');
  }, [activeOrderDraft]);

  return {
    activeOrderDraft,
    setActiveOrderDraft,
    activeOrderMessages,
    setActiveOrderMessages,
    sendQuickMessage,
  };
}
