export type DshCaptainOperationsScreenState = 'ready' | 'loading' | 'empty' | 'error';

export type DshCaptainOperationsSection = 'availability' | 'route-readiness' | 'safety';

export type DshCaptainOperationsSnapshot = {
  availabilityLabel: string;
  routeReadinessLabel: string;
  safetyLabel: string;
};
