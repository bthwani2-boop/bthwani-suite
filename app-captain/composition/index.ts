import {
  DshCaptainSurface,
  type DshCaptainCommandTarget,
  type DshCaptainNavigationCommand,
  type DshCaptainSurfaceProps,
} from '../../dsh/frontend/app-captain';

export type AppCaptainServiceId = 'dsh';

export type AppCaptainServiceRegistryEntry = {
  readonly SurfaceHost: typeof DshCaptainSurface;
};

export const appCaptainServiceLabels = {
  dsh: 'Delivery & Shopping',
} as const;

export const appCaptainSurfaceRegistry = {
  dsh: {
    SurfaceHost: DshCaptainSurface,
  },
} as const satisfies Record<AppCaptainServiceId, AppCaptainServiceRegistryEntry>;

export function getServiceLabels() {
  return appCaptainServiceLabels;
}

export function useServiceLabels() {
  return appCaptainServiceLabels;
}

export { DshCaptainSurface };
export type { DshCaptainCommandTarget, DshCaptainNavigationCommand, DshCaptainSurfaceProps };
