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

export function validatePaymentDeepLink(urlStr: string): { orderId: string; amountYer: number; version: string } {
  const prefix = `${WLT_DEEPLINK_SCHEME}://pay?`;
  if (!urlStr.startsWith(prefix)) {
    throw new Error('wlt:deeplink:invalid_scheme_or_host');
  }

  const queryString = urlStr.slice(prefix.length);
  const params = new Map<string, string>();
  for (const part of queryString.split('&')) {
    const [key, val] = part.split('=');
    if (key) {
      params.set(key, decodeURIComponent(val || ''));
    }
  }

  const orderId = params.get('order');
  const amountStr = params.get('amount');
  const version = params.get('v');

  if (!orderId || !orderId.trim()) {
    throw new Error('wlt:deeplink:empty_order_id');
  }

  if (!amountStr) {
    throw new Error('wlt:deeplink:missing_amount');
  }

  const amountYer = parseFloat(amountStr);
  if (isNaN(amountYer) || amountYer <= 0) {
    throw new Error('wlt:deeplink:non_positive_amount');
  }

  if (version !== WLT_DEEPLINK_VERSION) {
    throw new Error('wlt:deeplink:unsupported_version');
  }

  return { orderId, amountYer, version };
}
