/**
 * Fixture for SND Requests List screen (auto_snd_requests_list).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface SndRequestFixture {
  id: string;
  requestId: string;
  serviceType: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  location?: { city?: string; region?: string };
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'surfaces.snd.requests_list';

/** Demo requests when API returns empty or fails (IS_DEV). */
export function buildSndRequestsListMockRequests(
  t: TFunction,
  variant: 'default' | 'alt' = 'default'
): SndRequestFixture[] {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 864e5).toISOString();
  if (variant === 'alt') {
    return [
      {
        id: 'demo_req_1',
        requestId: 'REQ-DEMO-1',
        serviceType: t(`${NS}.l245_ar_1`),
        serviceName: t(`${NS}.l246_ar_1`),
        description: t('snd.app-client.mobile.auto_snd_requests_list.noDescription'),
        status: 'completed',
        createdAt: yesterday,
        location: { city: '—', region: '—' },
      },
      {
        id: 'demo_req_2',
        requestId: 'REQ-DEMO-2',
        serviceType: t(`${NS}.l245_ar_1`),
        serviceName: t(`${NS}.l246_ar_1`),
        description: t('snd.app-client.mobile.auto_snd_requests_list.noDescription'),
        status: 'cancelled',
        createdAt: now,
        location: { city: '—', region: '—' },
      },
    ];
  }
  return [
    {
      id: 'demo_req_1',
      requestId: 'REQ-DEMO-1',
      serviceType: t(`${NS}.l245_ar_1`),
      serviceName: t(`${NS}.l246_ar_1`),
      description: t('snd.app-client.mobile.auto_snd_requests_list.noDescription'),
      status: 'pending',
      createdAt: now,
      location: { city: '—', region: '—' },
    },
    {
      id: 'demo_req_2',
      requestId: 'REQ-DEMO-2',
      serviceType: t(`${NS}.l245_ar_1`),
      serviceName: t(`${NS}.l246_ar_1`),
      description: t('snd.app-client.mobile.auto_snd_requests_list.noDescription'),
      status: 'in_progress',
      createdAt: yesterday,
      location: { city: '—', region: '—' },
    },
  ];
}

