import { useAppClientAppearance } from '../../../app-client/shell/appearance';
import { useDshClientSurfaceBinding } from '../shared/discovery/client-surface.binding';
import type { DshClientSurfaceProps } from './dsh-client.types';
import type { DshAppearanceMode } from '../shared/platform/appearance.contract';

type UseDshClientSurfaceModelProps = DshClientSurfaceProps & {
  dshApiBaseUrl: string | undefined;
  dshAuthBearerToken: string | undefined;
  dshClientId: string | undefined;
  isAwnakEnabled: boolean;
};

export function useDshClientSurfaceModel(props: UseDshClientSurfaceModelProps) {
  const appearance = useAppClientAppearance();

  const dshAppearance = {
    hydrated: appearance.hydrated,
    mode: appearance.mode as DshAppearanceMode,
    setMode: (mode: DshAppearanceMode) =>
      appearance.setMode(mode as Parameters<typeof appearance.setMode>[0]),
  };

  return useDshClientSurfaceBinding({
    ...props,
    appearance: dshAppearance,
  });
}