import type { DshDiscoveryStore } from '../../shared/dshStoreProductCardModel';
import type { components } from '../contracts/dsh-openapi.types';
import type { DshHomeGetStore } from '../contracts/dsh-home-types';
import type { DshListDiscoveryStoresResponse } from './dsh-discovery-stores-client';

export type DshDiscoveryApiStore = components['schemas']['DiscoveryStore'];

function parseDistanceKm(distanceLabel: string): number {
  const parsed = Number.parseFloat(distanceLabel.replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatusLabel(store: DshDiscoveryApiStore): string {
  return store.status_label.trim() || (store.status_tone === 'open' ? 'Open' : 'Closed');
}

function mapCommonHomeStoreFields(store: DshDiscoveryApiStore): DshHomeGetStore {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    categoryId: store.category_id,
    imageUri: store.image_url,
    logoImageUri: store.logo_image_url,
    rating: store.rating,
    statusLabel: normalizeStatusLabel(store),
    statusTone: store.status_tone,
    distanceLabel: store.distance_label,
    deliveryLabel: store.delivery_label,
    serviceLabel: store.service_label,
    followerCount: 0,
    multiplierLabel: 'x1',
    offerLabel: store.offer_label,
    isFavorite: false,
    isFollowing: false,
    hasOffer: store.has_offer,
    publishStage: store.publish_stage,
  };
}

export function mapDiscoveryApiStoreToHomeStore(store: DshDiscoveryApiStore): DshHomeGetStore {
  return mapCommonHomeStoreFields(store);
}

export function mapDiscoveryApiStoreToDiscoveryStore(store: DshDiscoveryApiStore): DshDiscoveryStore {
  const homeStore = mapCommonHomeStoreFields(store);

  return {
    id: homeStore.id,
    name: homeStore.name,
    subtitle: homeStore.address,
    statusLabel: homeStore.statusLabel,
    meta: homeStore.deliveryLabel,
    etaMinutes: 0,
    distanceKm: parseDistanceKm(homeStore.distanceLabel),
    rating: homeStore.rating ?? 0,
    isOffer: Boolean(homeStore.hasOffer),
    isFavorite: homeStore.isFavorite,
    isFollowing: homeStore.isFollowing,
    imageUri: homeStore.imageUri ?? 'dsh.store.hadda.cover.v1',
    deliveryLabel: homeStore.deliveryLabel,
    serviceLabel: homeStore.serviceLabel,
    followerCount: homeStore.followerCount,
    multiplierLabel: homeStore.multiplierLabel,
    subscriptionPackageChips: [homeStore.deliveryLabel, homeStore.serviceLabel].filter(Boolean),
    offerLabel: homeStore.offerLabel,
    hasBthwaniPro: false,
    hasNewProducts: false,
    hasCouponAvailable: false,
    supportsPickup: true,
    supportsPartnerDelivery: true,
    publishStage: homeStore.publishStage,
    logoImageUri: homeStore.logoImageUri,
  };
}

export function mapDiscoveryStoresResponseToHomeStores(
  response: DshListDiscoveryStoresResponse,
): DshHomeGetStore[] {
  return response.stores.map(mapDiscoveryApiStoreToHomeStore);
}

export function mapDiscoveryStoresResponseToDiscoveryStores(
  response: DshListDiscoveryStoresResponse,
): DshDiscoveryStore[] {
  return response.stores.map(mapDiscoveryApiStoreToDiscoveryStore);
}
