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
  const url = `${WLT_DEEPLINK_SCHEME}://pay?order=${encodeURIComponent(orderId)}&amount=${amountYer}`;
  return { kind: 'payment', url, scheme: WLT_DEEPLINK_SCHEME, version: WLT_DEEPLINK_VERSION };
}

export function createWalletFundingDeepLink(amountMinorUnits: number): WltPaymentDeepLink {
  const url = `${WLT_DEEPLINK_SCHEME}://pay?order=wallet-funding&amount=${amountMinorUnits}`;
  return { kind: 'wallet-funding', url, scheme: WLT_DEEPLINK_SCHEME, version: WLT_DEEPLINK_VERSION };
}

export function resolveDeepLinkUrl(link: WltPaymentDeepLink): string {
  return link.url;
}
