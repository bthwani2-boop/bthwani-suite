// BTH Surfaces Package - Web Entrypoint
// Next.js implementation for webapp, CONTROL PANEL
// This entrypoint prevents mobile screens from being bundled in web

// Injection contracts (§34) — shells implement; surfaces consume via props
export type {
  AuthContract,
  NavigationContract,
  StorageContract,
  AuthContextValue,
  NavigationContextValue,
  StorageContextValue,
} from '@bthwani/domain-types';

// Logger: consume from @bthwani/ui-kit (no re-export — UIKIT-IMPORT-BOUNDARY-001)

// Web Surfaces ONLY
export { WebAppUserSurface } from './web/webapp';
export type { WebAppUserSurfaceProps } from './web/webapp';

// Admin Surfaces
export { AdminControlSurface } from './web/control panel/admin/AdminControlSurface';
export type { AdminControlSurfaceProps } from './web/control panel/admin/AdminControlSurface';

// Partner Surfaces - REMOVED: Missing implementation

// DSH shared screens (dsh_stores_list) — Web compatible
export type { DshStoresListProps, DshStoreItem } from './dsh';

// Hubs (tab screens for mobile app-client) - Web compatible

// ARB (Escrow Bookings) Service Surfaces - Web ONLY
export * from './arb/index.web';

// AMN (Transportation) Service Surfaces - Web-safe entry only
export * from './amn/index.web';

// KWD (Kuwait Directory) Service Surfaces - Web-safe entry only
export * from './kwd/index.web';

// MRF (Matching & Recovery Finder) Service Surfaces - Web-safe entry only
export * from './mrf/index.web';

// Universal Screens - Shared between APP-CLIENT and WebApp (§25)
// Note: These screens are not yet implemented - exports removed to prevent build failures

// Universal Screen Wrapper - Removed (not found in codebase)

// Unified Providers (§34 Universal Surface) - both shells must use these

// §87 Phase 0: Universal Surface Foundation
export { UserUniversalSurface } from './UserUniversalSurface.web';
export type { UserUniversalSurfaceProps } from './UserUniversalSurface.web';
export { UserWebSurface } from './web/UserWebSurface';
export type { UserWebSurfaceProps } from './web/UserWebSurface';

// §87 Phase 2: Placeholder Screens Migration

// §87 Phase 2b: Webapp Reference Model

// UI Kit: Surfaces import Card/Button/Loading directly from @bthwani/ui-kit.
// No re-export here to avoid pulling ui-kit into mobile surfaces-only consumers.
export { SndWorkspacePage } from './web/control panel/service-catalog/services/Snd/SndWorkspacePage';
export { ServiceCatalogServicesIndexPage } from './web/control panel/service-catalog/McpwServiceCatalogPages';

