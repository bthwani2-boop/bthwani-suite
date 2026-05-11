import React from 'react';
import { appPartnerSurfaceRegistry } from '../composition';

export type PartnerSurfaceHostProps = React.ComponentProps<typeof appPartnerSurfaceRegistry.dsh.SurfaceHost>;

export function PartnerSurfaceHost(props: PartnerSurfaceHostProps) {
  const dsh = appPartnerSurfaceRegistry.dsh;
  return <dsh.SurfaceHost {...props} />;
}

export default PartnerSurfaceHost;
