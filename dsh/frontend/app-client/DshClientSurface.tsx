import React from 'react';
import { DshSurfaceHost as LegacyDshSurfaceHost } from './DshSurfaceHost';
export type { DshCommandTarget, DshRoute } from './DshSurfaceHost';

export type DshClientSurfaceProps = React.ComponentProps<typeof LegacyDshSurfaceHost>;
export type DshSurfaceHostProps = DshClientSurfaceProps;

export function DshClientSurface(props: DshClientSurfaceProps) {
  return <LegacyDshSurfaceHost {...props} />;
}

export { DshClientSurface as DshSurfaceHost };
