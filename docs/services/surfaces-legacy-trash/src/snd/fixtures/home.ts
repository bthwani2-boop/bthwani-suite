/**
 * Fixture for SND home screen (auto_snd_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

import { buildDefaultSndClientCategories } from '../hooks/sndClientCatalog';

export interface SndServiceFixture {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SndInterestFixture {
  id: string;
  requestId: string;
  serviceType: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  preferredTime?: string;
  urgency?: 'low' | 'medium' | 'high';
  contactMethod?: 'phone' | 'whatsapp' | 'in_app';
  contactInfo?: string;
  budget?: string;
  timeline?: string;
  createdAt: string;
  updatedAt?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'snd.app-client.mobile.auto_snd_home_get';

/** Returns translated string or fallback when translation is missing. */
function safeT(t: TFunction, key: string, fallback: string): string {
  const out = t(key);
  return out === key ? fallback : out;
}

/** Default service categories for home grid (dev/demo or API fallback). */
export function buildSndHomeMockServices(
  t: TFunction,
  language: string = 'ar'
): SndServiceFixture[] {
  return buildDefaultSndClientCategories(t, language).map(item => ({
    id: item.id,
    name: item.name,
    icon: '',
    description: item.description,
  }));
}

/** Demo interest requests when API returns empty or fails (IS_DEV). */
export function buildSndHomeMockInterests(t: TFunction): SndInterestFixture[] {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 864e5).toISOString();
  return [
    {
      id: 'mock_snd_interest_1',
      requestId: 'REQ-MOCK-1',
      serviceType: safeT(
        t,
        'snd_catalog.specialized_graphic_design.name',
        'Design'
      ),
      serviceName: safeT(
        t,
        'snd_catalog.specialized_graphic_design.name',
        'Design'
      ),
      description: safeT(t, `${NS}.noDescriptionLabel`, 'No description'),
      status: 'pending',
      location: '—',
      createdAt: now,
    },
    {
      id: 'mock_snd_interest_2',
      requestId: 'REQ-MOCK-2',
      serviceType: safeT(
        t,
        'snd_catalog.specialized_app_development.name',
        'Apps & Web'
      ),
      serviceName: safeT(
        t,
        'snd_catalog.specialized_app_development.name',
        'Apps & Web'
      ),
      description: safeT(t, `${NS}.noDescriptionLabel`, 'No description'),
      status: 'in_progress',
      location: '—',
      createdAt: yesterday,
    },
  ];
}

