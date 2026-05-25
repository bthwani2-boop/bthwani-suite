import type { DshFulfillmentDeliveryMode } from '../app-client/contracts/dsh-client-binding.contracts';

// UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source.
export const dshPartnerOrderConversationPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'not_applicable',
} as const;

export type DshPartnerOrderConversationMode = DshFulfillmentDeliveryMode;

export type DshPartnerOrderConversationMessage = {
  id: string;
  authorLabel: string;
  body: string;
  timestampLabel: string;
  acknowledged?: boolean;
};

export type DshPartnerOrderConversationVisibility = 'enabled' | 'disabled-for-mode';

export function shouldShowDshPartnerOrderConversation(
  mode: DshPartnerOrderConversationMode
): DshPartnerOrderConversationVisibility {
  // bthwani_delivery: the platform manages tracking; partner-to-captain chat is out of scope here
  return mode === 'bthwani_delivery' ? 'disabled-for-mode' : 'enabled';
}
