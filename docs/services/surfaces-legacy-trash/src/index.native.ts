// BTH Surfaces Package - Mobile Entrypoint
// React Native implementation for app-client, app-partner
// This entrypoint prevents web screens from being bundled in mobile

// Injection contracts (§34) — shells implement; surfaces consume via props
export type {
  AuthContract,
  AuthUser,
  LoginCredentials,
  AuthResult,
  ChangePasswordData,
  NavigationContract,
  NavigationParams,
  ResetConfig,
  NavigationState,
  StorageContract,
  StorageChangeEvent,
  AuthContextValue,
  NavigationContextValue,
  StorageContextValue,
} from '@bthwani/domain-types';

// Logger: consume from @bthwani/ui-kit (no re-export — UIKIT-IMPORT-BOUNDARY-001)

// Mobile Surfaces ONLY
export { MobileUserSurface } from './mobile/MobileUserSurface.native';
export type { MobileUserSurfaceProps } from './mobile/MobileUserSurface.native';

// Partner Surfaces - REMOVED: Platform leakage risk

// DSH shared types (dsh_stores_list) — RN compatible
export type { DshStoresListProps, DshStoreItem } from './dsh';

// Hubs (tab screens for mobile app-client)

// ARB (Escrow Bookings) Service Surfaces - Mobile ONLY
export * from './arb/index.native';

// AMN (Transportation) Service Surfaces - Phase 2 Implementation
export * from './amn';

// KWD (Kuwait Directory) Service Surfaces - Phase 5 Implementation
export * from './kwd';

// MRF (Matching & Recovery Finder) Service Surfaces - Phase 5 Implementation
export * from './mrf';

// Universal Screens - Shared between APP-CLIENT and WebApp (§25)
// Note: These screens are not yet implemented - exports removed to prevent build failures

// Universal Screen Wrapper - Removed (not found in codebase)

// Unified Providers (§34 Universal Surface) - both shells must use these

// §87 Phase 0: Universal Surface Foundation
export { UserUniversalSurface } from './UserUniversalSurface.native';
export type { UserUniversalSurfaceProps } from './UserUniversalSurface.native';

// §87 Phase 1: Home Screen Migration

// §87 Phase 2: Placeholder Screens Migration

// §87 Shell Home Screens — SSoT

// §87 Captain operation screens (DSH, AMN, KNZ) — app-captain wires routes
export * from './captain';

// User Screens - Now exported from app-client/index.ts

// UI Kit: Surfaces import Card/Button/Loading directly from @bthwani/ui-kit.
// No re-export here to avoid pulling ui-kit into mobile surfaces-only consumers.



