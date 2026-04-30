import type { DshHomeDataMock } from './dshHomeTypes';

function getApiBaseUrl(): string {
  const raw =
    typeof process !== 'undefined' && process.env
      ? process.env.EXPO_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''
      : '';
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    throw new Error('EXPO_PUBLIC_API_URL_OR_NEXT_PUBLIC_API_URL_MISSING');
  }
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

/**
 * Fetches DSH Home payload from api-host local-prod infra.
 * No silent success fallback; failures throw.
 */
export async function fetchDshHome(): Promise<DshHomeDataMock> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/infra/dsh/home`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DSH_HOME_FETCH_FAILED_${res.status}:${text.slice(0, 240)}`);
  }
  const data = await res.json() as any;

  const hasEmptyCategories =
    Array.isArray(data?.categories) && data.categories.length === 0;

  const derivedCategories =
    hasEmptyCategories && data?.storesByCategory && typeof data.storesByCategory === "object"
      ? Object.keys(data.storesByCategory)
          .filter((key) => Array.isArray(data.storesByCategory[key]))
          .map((key) => {
            const title = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return {
              id: key,
              key,
              slug: key,
              name: title,
              title,
              label: title,
              action_type: "main_category",
              action_target: key,
              icon: null,
              image: null,
            };
          })
      : data?.categories;

  return {
    ...data,
    categories: derivedCategories,
  } as DshHomeDataMock;
}



