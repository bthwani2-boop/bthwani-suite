import { PlatformVarsRegistry } from '../platform/platform-vars';

export type DshDiscoveryStoresRuntimeConfig = {
  readonly baseUrl: string;
};

/**
 * Reads DSH API base URL from PlatformVarsRegistry.
 */
export function resolveDshDiscoveryStoresRuntimeConfig(): DshDiscoveryStoresRuntimeConfig | null {
  const raw = PlatformVarsRegistry.get('dshApiBaseUrl');

  if (!raw || raw.trim() === '') {
    return null;
  }

  return { baseUrl: raw.trim() };
}
