import type { MrfReport } from '../app-client/mobile/components/MrfSwipeableCard';

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'mrf.app-client.mobile.auto_mrf_home_get';

/**
 * Deterministic home list for design / partial binding when API is unreachable.
 */
export function buildMrfHomeReportsListMock(t: TFunction): MrfReport[] {
  return [
    {
      id: 'demo-mrf-missing-1',
      title: t(`${NS}.reportMissingTitle`),
      reportType: 'missing',
      status: 'active',
      location: 'Sanaa',
      timestamp: t(`${NS}.timestampNow`),
      urgency: 'high',
      distance: 0.8,
      category: t(`${NS}.categoryWallet`),
    },
    {
      id: 'demo-mrf-found-1',
      title: t(`${NS}.reportNoTitle`),
      reportType: 'found',
      status: 'active',
      location: 'Al-Tahrir',
      timestamp: t(`${NS}.timestampNow`),
      urgency: 'medium',
      distance: 1.2,
      category: t(`${NS}.categoryKeys`),
    },
    {
      id: 'demo-mrf-missing-2',
      title: t(`${NS}.categoryPhone`),
      reportType: 'missing',
      status: 'resolved',
      location: 'Hadda',
      timestamp: t(`${NS}.timestampNow`),
      urgency: 'low',
      category: t(`${NS}.categoryElectronics`),
    },
  ];
}

