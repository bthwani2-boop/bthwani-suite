/**
 * DSH Field App Public API
 *
 * The primary surface contract now mirrors the app-client structure:
 * surface, route metadata, screen registry, and surface props are exported first.
 */

export { DshFieldSurface } from './DshFieldSurface';
export { DshFieldSurface as FieldSurfaceHost } from './DshFieldSurface';
export { DshFieldSurface as default } from './DshFieldSurface';

export type {
	DshFieldCommandTarget,
	DshFieldNavigationCommand,
	DshFieldRoute,
	DshFieldRouteState,
	DshFieldSurfaceHostProps,
	DshFieldSurfaceProps,
} from './dsh-field.routes';

export {
	dshFieldRoutes,
	dshFieldScreenRegistry,
} from './dsh-field.routes';

export type {
	DshFieldLegacyRoute,
	DshFieldRouteId,
	DshFieldRouteRecord,
	DshFieldScreenRegistryItem,
} from './dsh-field.routes';
