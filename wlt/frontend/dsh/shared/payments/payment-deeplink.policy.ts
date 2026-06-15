// Canonical location: wlt/frontend/dsh/shared/payments/payment-deeplink.policy.ts
// Authority: wlt/frontend/dsh/shared/payments — payment deep-link schema and factory.
// Schema: wlt://pay?order=<orderId>&amount=<amountYer>
// Version: v1 (URL scheme). Bump version key on breaking schema change.

const WLT_DEEPLINK_SCHEME = 'wlt';
const WLT_DEEPLINK_VERSION = 'v1';

export type WltPaymentDeepLinkKind = 'payment' | 'wallet-funding';

export type WltPaymentDeepLink = {
  readonly kind: WltPaymentDeepLinkKind;
  readonly url: string;
  readonly scheme: string;
  readonly version: string;
};

export function createPaymentDeepLink(orderId: string, amountYer: number): WltPaymentDeepLink {
  if (!orderId.trim()) throw new Error('wlt:deeplink:empty_order_id');
  if (amountYer <= 0) throw new Error('wlt:deeplink:non_positive_amount');
  const url = `${WLT_DEEPLINK_SCHEME}://pay?order=${encodeURIComponent(orderId)}&amount=${amountYer}&v=${WLT_DEEPLINK_VERSION}`;
  return { kind: 'payment', url, scheme: WLT_DEEPLINK_SCHEME, version: WLT_DEEPLINK_VERSION };
}

export function createWalletFundingDeepLink(amountMinorUnits: number): WltPaymentDeepLink {
  if (amountMinorUnits <= 0) throw new Error('wlt:deeplink:non_positive_amount');
  const url = `${WLT_DEEPLINK_SCHEME}://pay?order=wallet-funding&amount=${amountMinorUnits}&v=${WLT_DEEPLINK_VERSION}`;
  return { kind: 'wallet-funding', url, scheme: WLT_DEEPLINK_SCHEME, version: WLT_DEEPLINK_VERSION };
}

export function resolveDeepLinkUrl(link: WltPaymentDeepLink): string {
  return link.url;
}
