/**
 * DSH Client App Public API
 *
 * This file defines the clean, intentional public API for the DSH client surface.
 * Only components and types required by app-client composition/shell or WLT bridges
 * are exported here.
 */

// Core Surface & Host
export { DshClientSurface } from './DshClientSurface';

// Public Types required by Composition/Shell
export type {
	DshClientSurfaceProps,
	DshCommandTarget,
	DshNavigationCommand,
	DshRoute,
} from './dsh-client.types';

// Routing & Registry
export { dshClientRoutes } from './dsh-client.routes';
export type {
	DshClientLegacyRoute,
	DshClientRouteId,
	DshClientRouteRecord,
} from './dsh-client.routes';

export { dshClientScreenRegistry } from './dsh-client.screen-registry';
export type { DshClientScreenRegistryItem } from './dsh-client.screen-registry';

// Cross-App Integration Components
export { DshHomeApprovedVideoReelsViewer } from './parts/ApprovedVideoReelsViewer';
export type { DshHomeApprovedVideoReelsViewerProps } from './parts/ApprovedVideoReelsViewer';

// --- End of Public API ---
// Internal screens, parts, and data are now hidden from the public index
// to enforce strict architectural boundaries.
