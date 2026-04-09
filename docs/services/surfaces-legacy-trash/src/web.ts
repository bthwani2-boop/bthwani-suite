/**
 * Web-only entry for @bthwani/surfaces. No react-native.
 * Use: import { DshStoresListWeb, ... } from '@bthwani/surfaces/web'
 */

export type {
  AuthContract,
  NavigationContract,
  StorageContract,
  AuthContextValue,
  NavigationContextValue,
  StorageContextValue,
} from '@bthwani/domain-types/contracts';

export { WebAppUserSurface } from './web/webapp/WebAppUserSurface';
export type { WebAppUserSurfaceProps } from './web/webapp/WebAppUserSurface';

// TODO: add DshStoresListWeb when ./dsh/DshStoresListWeb.tsx exists (web variant of stores list)
// export { DshStoresListWeb } from './dsh/DshStoresListWeb';
export type { DshStoreItem, DshStoresListProps } from './dsh/types';

// ARB Web Pages (amn/kwd/mrf web pages: add when ./amn/web/pages, ./kwd/web/pages, ./mrf/web/pages exist)
export { ArbBookingsListPage, ArbBookingCreatePage } from './arb/web/pages';

// TODO: AMN Web Pages — create ./amn/web/pages.ts and export AmnTripCreatePage, AmnTripListPage, AmnTripDetailsPage, AmnTripRatePage
// TODO: KWD Web Pages — create ./kwd/web/pages and export KwdListingsSearchPage, KwdListingDetailsPage, KwdListingCreatePage, KwdJobDetailsPage
// TODO: MRF Web Pages — create ./mrf/web/pages and export MrfHomeDashboardPage
export { SndWorkspacePage } from './web/control panel/service-catalog/services/Snd/SndWorkspacePage';
export { ServiceCatalogServicesIndexPage } from './web/control panel/service-catalog/McpwServiceCatalogPages';

