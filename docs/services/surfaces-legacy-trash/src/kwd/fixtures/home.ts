/**
 * Fixture for KWD home screen (auto_kwd_home_get).
 * Dev/demo data only — see RULE_DEV_DATA_ENV_AND_LEAK.
 */

export interface KwdJobFixture {
  id: string;
  title: string;
  company?: string;
  location?: string;
  distance?: number;
  rating?: number;
  salary?: { min?: number; max?: number; currency?: string };
  jobType?: string;
  postedDate?: string;
  timestamp?: string;
  category?: string;
  description?: string;
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

const NS = 'kwd.app-client.mobile.auto_kwd_home_get';

/** Returns translated string or fallback when translation is missing (t returns key). Prevents key leakage in UI. */
function safeT(t: TFunction, key: string, fallback: string): string {
  const out = t(key);
  return out === key || out.includes('mockJobs') ? fallback : out;
}

export function buildKwdHomeMockJobs(t: TFunction): KwdJobFixture[] {
  const jobs: Array<{
    i: number;
    jobType: string;
    salary: { min: number; max: number; currency: string };
    rating: number;
    distance: number;
  }> = [
    { i: 1, jobType: 'daily', salary: { min: 8000, max: 10000, currency: 'YER' }, rating: 4.2, distance: 0.8 },
    { i: 2, jobType: 'one_time', salary: { min: 4000, max: 6000, currency: 'YER' }, rating: 4.8, distance: 2.1 },
    { i: 3, jobType: 'daily', salary: { min: 5000, max: 7000, currency: 'YER' }, rating: 3.5, distance: 1.3 },
    { i: 4, jobType: 'part_time', salary: { min: 70000, max: 90000, currency: 'YER' }, rating: 4.0, distance: 4.5 },
    { i: 5, jobType: 'one_time', salary: { min: 15000, max: 20000, currency: 'YER' }, rating: 4.9, distance: 0.5 },
    { i: 6, jobType: 'full_time', salary: { min: 45000, max: 55000, currency: 'YER' }, rating: 3.8, distance: 6.2 },
  ];
  return jobs.map(({ i, jobType, salary, rating, distance }) => {
    const j = `job${i}`;
    return {
      id: `mock_kwd_job_${i}`,
      title: safeT(t, `${NS}.home_get.mockJobs.${j}.title`, `Job ${i}`),
      company: safeT(t, `${NS}.home_get.mockJobs.${j}.company`, '—'),
      location: safeT(t, `${NS}.home_get.mockJobs.${j}.location`, '—'),
      distance,
      rating,
      salary,
      jobType,
      postedDate: safeT(t, `${NS}.home_get.mockJobs.${j}.postedDate`, '—'),
      timestamp: safeT(t, `${NS}.home_get.mockJobs.${j}.timestamp`, '—'),
      category: safeT(t, `${NS}.home_get.mockJobs.${j}.category`, '—'),
      description: safeT(t, `${NS}.home_get.mockJobs.${j}.description`, '—'),
    };
  });
}

