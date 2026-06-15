import {
  useDshCaptainSurfaceBinding,
  type DshCaptainNavigationCommand,
} from '../shared/captain';

export type {
  ActiveOrderPhase,
  StoreCourierStage,
  DshCaptainNavigationCommand,
  DshCaptainSurfaceState,
  DshCaptainSurfaceDerived,
} from '../shared/captain';

export function useDshCaptainSurfaceModel(
  command: DshCaptainNavigationCommand,
  captainRuntimeId: string,
) {
  return useDshCaptainSurfaceBinding(command, captainRuntimeId);
}
