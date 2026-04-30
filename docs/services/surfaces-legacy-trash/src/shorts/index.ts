/**
 * Service Shorts — shared constants and utilities (Execution Spec Phase 0/1).
 */

export {
  DSH_PLACEMENT_IDS,
  ARB_PLACEMENT_IDS,
  SERVICE_SHORTS_PLACEMENT_IDS,
  SHORTS_ANALYTICS_EVENTS,
} from './constants';
export type { DshPlacementId, ArbPlacementId, ShortsAnalyticsEventName } from './constants';
export { resolveShortCtaToNavigation } from './resolveShortCtaToNavigation';
export type { ResolvedShortCtaNavigation } from './resolveShortCtaToNavigation';
export { getShortsFeed } from './fixtures/shorts-feed';
export type { ShortsFeedService } from './fixtures/shorts-feed';
export { ServiceShortsPreviewRail } from './ServiceShortsPreviewRail';
export type { ServiceShortsPreviewRailProps, ShortsRailState } from './ServiceShortsPreviewRail';
export { ServiceShortsFullscreenViewer } from './ServiceShortsFullscreenViewer';
export type { ServiceShortsFullscreenViewerProps } from './ServiceShortsFullscreenViewer';
