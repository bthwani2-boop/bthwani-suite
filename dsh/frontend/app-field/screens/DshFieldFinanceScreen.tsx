import React from 'react';
import { StateView } from '@bthwani/ui-kit';
import { WltDshFieldBridge } from '../../../../wlt/frontend/dsh/app-field';
import { resolveFieldStoreStatus, type FieldStoreFile } from '../../data/stores.preview-data';

type DshFieldFinanceScreenProps = {
  state?: 'ready' | 'loading' | 'error' | 'offline';
  stores: readonly FieldStoreFile[];
  onBack: () => void;
  onRetry?: () => void;
};

export function DshFieldFinanceScreen({ state = 'ready', stores, onBack, onRetry }: DshFieldFinanceScreenProps) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©" description="Ù†Ø­Ø³Ø¨ Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø§Øª ÙˆØ§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª Ù„Ù„Ù…Ù„ÙØ§Øª Ø§Ù„Ù…Ø¹ØªÙ…Ø¯Ø©." />;
  }

  if (state === 'error' || state === 'offline') {
    return (
      <StateView
        stateId={state === 'offline' ? 'offline' : 'recoverableError'}
        title="ØªØ¹Ø°Ø± Ø§Ù„ÙˆØµÙˆÙ„ Ù„Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø§Ù„ÙŠØ©"
        description="ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø®Ø§Ø¯Ù… Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø§Øª Ø§Ù„Ù…ÙŠØ¯Ø§Ù†ÙŠØ©."
        actionLabel="Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©"
        onActionPress={onRetry}
      />
    );
  }

  const eligibleStoreIds = stores
    .filter((store) => resolveFieldStoreStatus(store) === 'offer-approved')
    .map((store) => store.id);

  return <WltDshFieldBridge storeIds={eligibleStoreIds} onBack={onBack} />;
}

export default DshFieldFinanceScreen;
