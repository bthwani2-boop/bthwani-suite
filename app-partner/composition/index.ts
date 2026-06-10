import { DshPartnerSurface, type DshPartnerSurfaceProps } from '../../dsh/frontend/app-partner';

export type AppPartnerServiceId = 'dsh';

export type AppPartnerServiceRegistryEntry = {
	readonly SurfaceHost: typeof DshPartnerSurface;
};

export const appPartnerServiceLabels = {
	dsh: 'Delivery & Shopping',
} as const;

export const appPartnerSurfaceRegistry = {
	dsh: {
		SurfaceHost: DshPartnerSurface,
	},
} as const satisfies Record<AppPartnerServiceId, AppPartnerServiceRegistryEntry>;

export function getServiceLabels() {
	return appPartnerServiceLabels;
}

export function useServiceLabels() {
	return appPartnerServiceLabels;
}

export { DshPartnerSurface };
export type { DshPartnerSurfaceProps };
