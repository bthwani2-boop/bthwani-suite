import { createDshCheckoutHttpClient, type DshCheckoutAuthContext } from '../api/dsh-checkout-client';
import { createDshFieldReadinessHttpClient, resolveDshFieldReadinessBaseUrl } from '../api/dsh-field-readiness-client';
import { createDshMediaApiHttpClient } from '../api/dsh-media-api.client';
import { createDshOrderLifecycleHttpClient, resolveDshOrderApiBaseUrl } from '../api/dsh-order-lifecycle-client';
import { createDshProductApiHttpClient, resolveDshProductApiBaseUrl } from '../api/dsh-product-api.transport';
import { createDshStoreVisibilityHttpClient, resolveDshStoreVisibilityBaseUrl } from '../api/dsh-store-visibility-transport';
import { resolveDshAuthBaseUrl } from '../api/dsh-auth-client';
import { createDshDiscoveryStoresClient, type DshDiscoveryStoresRuntimeConfig } from '../adapters';

export function getDshProductRuntimeClient() {
  return createDshProductApiHttpClient(resolveDshProductApiBaseUrl());
}

export function getDshProductRuntimeBaseUrl() {
  return resolveDshProductApiBaseUrl();
}

export function getDshMediaRuntimeClient() {
  const baseUrl = resolveDshProductApiBaseUrl();
  return baseUrl ? createDshMediaApiHttpClient(baseUrl) : null;
}

export function getDshStoreVisibilityRuntimeClient() {
  const baseUrl = resolveDshStoreVisibilityBaseUrl();
  return baseUrl ? createDshStoreVisibilityHttpClient(baseUrl) : null;
}

export function getDshOrderLifecycleRuntimeClient(auth?: DshCheckoutAuthContext) {
  const baseUrl = resolveDshOrderApiBaseUrl();
  return baseUrl ? createDshOrderLifecycleHttpClient(baseUrl, undefined, auth) : null;
}

export function getDshOrderRuntimeBaseUrl() {
  return resolveDshOrderApiBaseUrl();
}

export function getDshCheckoutRuntimeClient(baseUrl: string, auth?: DshCheckoutAuthContext) {
  return createDshCheckoutHttpClient(baseUrl, globalThis.fetch, auth);
}

export function getDshDiscoveryStoresRuntimeClient(config: DshDiscoveryStoresRuntimeConfig) {
  return createDshDiscoveryStoresClient(config);
}

export function getDshFieldReadinessRuntimeClient() {
  return createDshFieldReadinessHttpClient(resolveDshFieldReadinessBaseUrl());
}

export function getDshAuthRuntimeBaseUrl() {
  return resolveDshAuthBaseUrl();
}
