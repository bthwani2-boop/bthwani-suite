// Canonical location: wlt/frontend/dsh/shared/clients/payment-session-ids.ts
// Authority: wlt/frontend/dsh/shared/clients — cryptographically unique IDs for WLT payment sessions.
// These IDs are sent to the backend. Never use Date.now() or Math.random() here.
// Uses crypto.randomUUID() (available in Hermes/RN 0.71+, all modern browsers).

function generateCryptoUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Polyfill via crypto.getRandomValues for environments without randomUUID
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant bits
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type PaymentSessionIds = {
  readonly checkoutIntentId: string;
  readonly idempotencyKey: string;
  readonly confirmationRef: string;
};

export function generatePaymentSessionIds(prefix: string): PaymentSessionIds {
  const base = generateCryptoUUID();
  return {
    checkoutIntentId: `${prefix}-${base}`,
    idempotencyKey: `idem-${prefix}-${base}`,
    confirmationRef: `ref-${prefix}-${base}`,
  };
}
