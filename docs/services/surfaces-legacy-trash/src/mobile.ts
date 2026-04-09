// Mobile-only entry: app-client (and other RN shells) must import from @bthwani/surfaces/mobile
// to avoid bundling web-only surfaces (WebAppUserSurface, AdminControlSurface) and ui-kit.
// No re-exports of WebAppUserSurface, AdminControlSurface, PartnerSurface, DshStoresListWeb, or MobileUserSurface.

import { Platform } from 'react-native';

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

// Mobile Components
export { ServiceIcon } from './mobile/components/ServiceIcon';
export * from './mobile/components';

// Design Tokens
export { semanticRoles, semanticRolesDark } from '@bthwani/ui-kit';
export type { SemanticRoles, SemanticRolesDark } from '@bthwani/ui-kit';
export { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS, BTHWANI_TYPOGRAPHY, BTHWANI_MOTION, BTHWANI_THEME } from '@bthwani/ui-kit';

// Platform-aware MobileUserSurface export
export const MobileUserSurface = Platform.select({
  native: () => require('./mobile/MobileUserSurface.native').MobileUserSurface,
  default: () => require('./mobile/MobileUserSurface.web').MobileUserSurface,
})();
export type { MobileUserSurfaceProps } from './mobile/MobileUserSurface.native';

// Field Mobile screens — removed: not exported from field/mobile (empty barrel)
// DSH: export component alias and types only (no *Screen names that don't exist)
export { DshCustomerProfileDetail as DshCustomerProfileDetailScreen } from './dsh';
export type {
  DshStoresListProps,
  DshStoreItem,
  DshCategoriesListProps,
  DshCategoryItem,
  DshPartnerOrdersListProps,
  DshPartnerOrderItem,
  DshBannersListProps,
  DshBannerItem,
  DshCustomerProfileDetailProps,
  DshCustomerProfileItem,
} from './dsh';

// KWD / MRF screens — consumed via main index (auto_* screens); no *Screen names here

// Universal Chat System - Service Agnostic
export { UniversalChatScreen } from './shared/chat';
export type { UniversalChatScreenProps } from './shared/chat';

// Universal Rating System - Service Agnostic
// Note: core/rating/ not found - exports removed

// Universal Forms System - Service Agnostic
export {
  UniversalFormScreen,
  useFormAdapter,
} from '@bthwani/surfaces/shared/forms';

// Universal Hub System - Dashboard Components
export {
  UniversalHubScreen,
} from './shared/hub';

// User Mobile Surface - Main Entry Point
export { UserMobileSurface } from './mobile/app-client/UserMobileSurface';
export type { MobileSurfaceProps as UserMobileSurfaceProps } from './mobile/app-client/UserMobileSurface';

// Captain Mobile Surface - Main Entry Point
export { CaptainMobileSurface } from './mobile/app-captain/CaptainMobileSurface';
export type { MobileSurfaceProps as CaptainMobileSurfaceProps } from './mobile/app-captain/CaptainMobileSurface';

// Field Mobile Surface - Main Entry Point
export { FieldMobileSurface } from './mobile/app-field/FieldMobileSurface';
export type { MobileSurfaceProps as FieldMobileSurfaceProps } from './mobile/app-field/FieldMobileSurface';

// Partner Mobile Surface - Main Entry Point
export { PartnerMobileSurface } from './mobile/app-partner/PartnerMobileSurface';
export type { MobileSurfaceProps as PartnerMobileSurfaceProps } from './mobile/app-partner/PartnerMobileSurface';

