/**
 * ESF Hooks — data layer for ESF screens (runtime reads/writes go through api-clients adapter).
 */

// ============================================
// Hooks
// ============================================
export type {
  UseEsfRequestsListResult,
  UseEsfRequestsListOptions,
  EsfRequestStatus,
  EsfUrgency,
  EsfRequestStatusUi,
  EsfUrgencyUi,
  BloodDonationRequest,
} from './useEsfRequestsList';

export { useEsfRequestGet } from './useEsfRequestGet';
export type {
  UseEsfRequestGetResult,
  EsfRequestDetail,
} from './useEsfRequestGet';

export { useEsfRequestsList } from './useEsfRequestsList';
export { useEsfRequestsSearch } from './useEsfRequestsSearch';
export type {
  UseEsfRequestsSearchResult,
  UseEsfRequestsSearchOptions,
} from './useEsfRequestsSearch';

export { useEsfRequestCancel } from './useEsfRequestCancel';
export type {
  UseEsfRequestCancelResult,
  EsfRequestCancelDetail,
} from './useEsfRequestCancel';

// ============================================
// Fixture builders (dev/demo only — screens may import until migrated)
// ============================================
export { buildEsfRequestsListMock } from '../fixtures/requestsList';

export { buildEsfRequestGetMock } from '../fixtures/requestGet';

export { buildEsfRequestsSearchMock } from '../fixtures/requestsSearch';

export { buildEsfMatchPreviewMock } from '../fixtures/matchPreview';

export { buildEsfRequestCancelMock } from '../fixtures/requestCancel';
