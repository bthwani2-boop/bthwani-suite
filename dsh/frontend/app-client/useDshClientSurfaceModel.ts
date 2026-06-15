// Thin composition shell — authority moved to dsh/frontend/shared/discovery/useDshClientSurfaceModel.ts
// Injects useAppClientAppearance (shell-specific) into the shared hook.

import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import {
  useDshClientSurfaceModel as useDshClientSurfaceModelShared,
  type DshClientSurfaceSharedProps,
} from '../shared/discovery/useDshClientSurfaceModel';
import type { DshClientSurfaceProps } from './dsh-client.types';

type UseDshClientSurfaceModelProps = DshClientSurfaceProps & {
  dshApiBaseUrl: string | undefined;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  isAwnakEnabled: boolean;
};

export function useDshClientSurfaceModel(props: UseDshClientSurfaceModelProps) {
  const appearance = useAppClientAppearance();
  const sharedProps: DshClientSurfaceSharedProps = { ...props, appearance };
  return useDshClientSurfaceModelShared(sharedProps);
}
