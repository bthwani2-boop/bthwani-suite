// Runtime config resolution for the DSH discovery stores transport.
// Returns null when no API base URL is configured — callers must fall back to preview.
// No UI framework imports. No fetch. No React. Pure config.

export type DshDiscoveryStoresRuntimeConfig = {
  readonly baseUrl: string;
};

/**
 * Reads EXPO_PUBLIC_DSH_API_BASE_URL from the process environment.
 *
 * - Expo / Metro bundler: substitutes the value at bundle time via the
 *   EXPO_PUBLIC_ prefix convention.
 * - Web / Next.js local dev: set EXPO_PUBLIC_DSH_API_BASE_URL in the shell
 *   before starting the dev server.
 * - Tests or environments without the variable: returns null, which causes
 *   the caller to stay on the preview-fallback path.
 */
export function resolveDshDiscoveryStoresRuntimeConfig(): DshDiscoveryStoresRuntimeConfig | null {
  const raw =
    typeof process !== 'undefined'
      ? (
          process as {
            env?: Record<string, string | undefined>;
          }
        ).env?.EXPO_PUBLIC_DSH_API_BASE_URL
      : undefined;

  if (!raw || raw.trim() === '') {
    return null;
  }

  return { baseUrl: raw.trim() };
}
