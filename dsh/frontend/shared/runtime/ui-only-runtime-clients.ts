import { createDshCheckoutHttpClient, type DshCheckoutAuthContext } from '../checkout';
import { createDshFieldReadinessHttpClient, resolveDshFieldReadinessBaseUrl } from '../field/dsh-field-readiness-client';
import { createDshMediaApiHttpClient } from '../media/dsh-media-api.client';
import { createDshOrderLifecycleHttpClient, resolveDshOrderApiBaseUrl } from '../orders/dsh-order-lifecycle-client';
import { createDshProductApiHttpClient, resolveDshProductApiBaseUrl } from '../products/dsh-product-api.transport';
import { createDshStoreVisibilityHttpClient, resolveDshStoreVisibilityBaseUrl } from '../stores/dsh-store-visibility-transport';
import { resolveDshAuthBaseUrl } from '../runtime/dsh-auth-client';
import { createDshDiscoveryStoresClient, type DshDiscoveryStoresRuntimeConfig } from '../stores';

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
