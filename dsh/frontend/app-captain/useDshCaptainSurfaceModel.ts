import {
  useDshCaptainSurfaceBinding,
  type DshCaptainNavigationCommand,
} from './captain';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from './captain';

export function useDshCaptainSurfaceModel(
  command: DshCaptainNavigationCommand,
  captainRuntimeId: string,
) {
  return useDshCaptainSurfaceBinding(command, captainRuntimeId);
}
