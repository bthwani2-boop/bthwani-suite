// Dev/demo fixture for wlt_provider_webhook. Isolated per RULE_DEV_DATA_ENV_AND_LEAK.

export interface WebhookEvent {
  id: string;
  event: string;
  description: string;
  enabled: boolean;
  lastTriggered?: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  isActive: boolean;
  events: WebhookEvent[];
  createdAt: string;
  lastUsed?: string;
}

type TFunction = (key: string) => string;

export function buildWebhookMock(t: TFunction, secret: string = ''): WebhookEndpoint {
  return {
    id: 'wh_001',
    url: 'https://api.merchant.com/webhooks/wallet',
    secret,
    isActive: true,
    createdAt: '2024-01-01',
    lastUsed: '2024-01-15T10:30:00Z',
    events: [
      {
        id: 'evt_001',
        event: 'payment.succeeded',
        description: t('wlt.app-client.mobile.auto_wlt_provider_webhook.onPaymentSuccess'),
        enabled: true,
        lastTriggered: '2024-01-15T10:30:00Z',
      },
      {
        id: 'evt_002',
        event: 'payment.failed',
        description: t('wlt.app-client.mobile.auto_wlt_provider_webhook.errorMessage'),
        enabled: true,
        lastTriggered: '2024-01-10T14:20:00Z',
      },
      {
        id: 'evt_003',
        event: 'transfer.completed',
        description: t('wlt.app-client.mobile.auto_wlt_provider_webhook.onTransferComplete'),
        enabled: false,
      },
      {
        id: 'evt_004',
        event: 'refund.processed',
        description: t('wlt.app-client.mobile.auto_wlt_provider_webhook.onRefundProcessed'),
        enabled: true,
      },
    ],
  };
}

