/**
 * Fixture for KWD My Listings screen (KwdMyListingsScreen).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface KwdMyListingsJobItem {
  id: string;
  title: string;
  status?: string;
  location?: string;
  createdAt?: string;
}

export interface KwdMyListingsApplicationItem {
  id: string;
  job: { id: string; title: string };
  status: string;
  appliedAt?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'kwd.app-client.mobile.KwdMyListingsScreen';

/** Demo jobs when API returns empty or fails (IS_DEV). */
export function buildKwdMyListingsMockJobs(
  t: TFunction,
  variant: 'default' | 'alt' | 'city'
): KwdMyListingsJobItem[] {
  if (variant === 'city') {
    const label = t(`${NS}.mockCity`);
    return [{ id: 'demo_job_1', title: label, status: 'active', location: label, createdAt: label }];
  }
  if (variant === 'alt') {
    return [
      { id: 'demo_job_1', title: t(`${NS}.todayLabelAlt`), status: 'active', location: t(`${NS}.todayLabelAlt`), createdAt: t(`${NS}.todayLabelAlt`) },
      { id: 'demo_job_2', title: t(`${NS}.yesterdayLabelAlt`), status: 'active', location: t(`${NS}.yesterdayLabelAlt`), createdAt: t(`${NS}.yesterdayLabelAlt`) },
    ];
  }
  return [
    { id: 'demo_job_1', title: t(`${NS}.todayLabel`), status: 'active', location: t(`${NS}.todayLabel`), createdAt: t(`${NS}.todayLabel`) },
    { id: 'demo_job_2', title: t(`${NS}.yesterdayLabel`), status: 'active', location: t(`${NS}.yesterdayLabel`), createdAt: t(`${NS}.yesterdayLabel`) },
  ];
}

/** Demo applications when API returns empty or fails (IS_DEV). */
export function buildKwdMyListingsMockApplications(
  t: TFunction,
  variant: 'default' | 'alt'
): KwdMyListingsApplicationItem[] {
  if (variant === 'alt') {
    return [
      { id: 'demo_app_1', job: { id: 'mock_kwd_job_1', title: t(`${NS}.timeAgoHourAlt`) }, status: 'pending', appliedAt: t(`${NS}.timeAgoHourAlt`) },
      { id: 'demo_app_2', job: { id: 'mock_kwd_job_2', title: t(`${NS}.timeAgoDayAlt`) }, status: 'contacted', appliedAt: t(`${NS}.timeAgoDayAlt`) },
    ];
  }
  return [
    { id: 'demo_app_1', job: { id: 'mock_kwd_job_1', title: t(`${NS}.timeAgoHour`) }, status: 'pending', appliedAt: t(`${NS}.timeAgoHour`) },
    { id: 'demo_app_2', job: { id: 'mock_kwd_job_2', title: t(`${NS}.timeAgoDay`) }, status: 'contacted', appliedAt: t(`${NS}.timeAgoDay`) },
  ];
}

