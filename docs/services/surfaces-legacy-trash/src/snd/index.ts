// SND - Services Service
// خدمات - خدمة طلب الخدمات المنزلية
// Exports only from existing paths (app-client/mobile, app-client/mobile/components).

// Mobile screens (app-client)
export {
  auto_snd_home_get,
  auto_snd_request_get,
  auto_snd_requests_list,
} from './app-client/mobile';

// Components
export {
  SndBottomSheet,
  type SndBottomSheetHeight,
  SndInterestQuickComposeSheet,
  type InterestData,
  SndInterestMiniDetailsSheet,
  type SndInterest,
  SndSwipeableCard,
  type ServiceDetail,
  SndServiceDetailWithFormSheet,
} from './app-client/mobile/components';

export {
  SND_SERVICE_ENABLED_VAR_KEY,
  SND_CLIENT_CATEGORIES_VAR_KEY,
  buildDefaultSndClientCategories,
  mergeSndClientCategories,
  filterEnabledSndClientCategories,
  parseRuntimeBoolean,
  type SndClientCategory,
  type SndClientCategoryOverride,
} from './hooks/sndClientCatalog';

// TODO: when shared/types/snd.types exists, export: SndService, SndBooking, SndProvider, SndServiceCategory, SndBookingStatus

