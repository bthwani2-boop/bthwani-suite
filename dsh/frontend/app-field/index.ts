/**
 * DSH Field App Public API
 *
 * The primary surface contract now mirrors the app-client structure:
 * surface, route metadata, screen registry, and surface props are exported first.
 */

export { DshFieldSurface } from './DshFieldSurface';
export { DshFieldSurface as FieldSurfaceHost } from './DshFieldSurface';
export { default } from './mobile-entry';

export type {
	DshFieldCommandTarget,
	DshFieldNavigationCommand,
	DshFieldRoute,
	DshFieldRouteState,
	DshFieldSurfaceHostProps,
	DshFieldSurfaceProps,
} from './dsh-field.types';

export { dshFieldRoutes } from './dsh-field.routes';
export type {
	DshFieldLegacyRoute,
	DshFieldRouteId,
	DshFieldRouteRecord,
} from './dsh-field.routes';

export { dshFieldScreenRegistry } from './dsh-field.screen-registry';
export type { DshFieldScreenRegistryItem } from './dsh-field.screen-registry';
