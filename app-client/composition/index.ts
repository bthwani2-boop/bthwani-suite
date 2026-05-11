import {
  DshHomeApprovedVideoReelsViewer,
  DshClientSurface,
  type DshCommandTarget,
  type DshHomeApprovedVideoReelsViewerProps,
} from '../../dsh/frontend/app-client';

export type AppClientServiceId = 'dsh';

export type AppClientServiceRegistryEntry = {
  readonly SurfaceHost: typeof DshClientSurface;
  readonly ApprovedVideoReelsViewer: typeof DshHomeApprovedVideoReelsViewer;
};

export const appClientServiceLabels = {
  dsh: 'Delivery & Shopping',
} as const;

export const appClientSurfaceRegistry = {
  dsh: {
    SurfaceHost: DshClientSurface,
    ApprovedVideoReelsViewer: DshHomeApprovedVideoReelsViewer,
  },
} as const satisfies Record<AppClientServiceId, AppClientServiceRegistryEntry>;

export function getServiceLabels() {
  return appClientServiceLabels;
}

export function useServiceLabels() {
  return appClientServiceLabels;
}

export { DshClientSurface, DshClientSurface as DshSurfaceHost, DshHomeApprovedVideoReelsViewer };
export type { DshCommandTarget, DshHomeApprovedVideoReelsViewerProps };
