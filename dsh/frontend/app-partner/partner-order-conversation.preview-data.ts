export type DshPartnerOrderConversationMode = 'pickup' | 'store_delivery' | 'platform_delivery';

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
  return mode === 'platform_delivery' ? 'disabled-for-mode' : 'enabled';
}
