/**
 * Service Shorts — placement_id and analytics event constants (Execution Spec Phase 0).
 * Single source of truth for placement identifiers and event names.
 */

import type { ServiceShortPlacementId } from '@bthwani/domain-types';

/** DSH placement identifiers (exact values from execution plan). */
export const DSH_PLACEMENT_IDS = [
  'dsh_home_below_hero',
  'dsh_home_after_categories',
  'dsh_store_above_menu',
  'dsh_store_card_video_badge',
  'dsh_product_card_video_badge',
  'dsh_category_top',
  'dsh_home_promo_zone',
  'dsh_empty_reorder',
  'dsh_cart_recovery',
] as const;

/** ARB placement identifiers. */
export const ARB_PLACEMENT_IDS = [
  'arb_home_below_hero',
  'arb_home_after_featured',
  'arb_category_top',
  'arb_provider_profile',
  'arb_search_empty',
  'arb_offer_lead_in',
] as const;

export const SERVICE_SHORTS_PLACEMENT_IDS: readonly ServiceShortPlacementId[] = [
  ...DSH_PLACEMENT_IDS,
  ...ARB_PLACEMENT_IDS,
];

export type DshPlacementId = (typeof DSH_PLACEMENT_IDS)[number];
export type ArbPlacementId = (typeof ARB_PLACEMENT_IDS)[number];

/** Analytics event names (event taxonomy — execution plan §5). */
export const SHORTS_ANALYTICS_EVENTS = {
  shorts_impression: 'shorts_impression',
  shorts_preview_tap: 'shorts_preview_tap',
  shorts_open: 'shorts_open',
  shorts_play_start: 'shorts_play_start',
  shorts_play_25: 'shorts_play_25',
  shorts_play_50: 'shorts_play_50',
  shorts_play_75: 'shorts_play_75',
  shorts_complete: 'shorts_complete',
  shorts_skip_fast: 'shorts_skip_fast',
  shorts_mute_toggle: 'shorts_mute_toggle',
  shorts_cta_impression: 'shorts_cta_impression',
  shorts_cta_click: 'shorts_cta_click',
  shorts_exit: 'shorts_exit',
  shorts_return_to_origin: 'shorts_return_to_origin',
  shorts_conversion_assist: 'shorts_conversion_assist',
  shorts_direct_conversion: 'shorts_direct_conversion',
} as const;

export type ShortsAnalyticsEventName = keyof typeof SHORTS_ANALYTICS_EVENTS;
