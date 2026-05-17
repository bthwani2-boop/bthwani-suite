import React from 'react';
import { appCaptainSurfaceRegistry, type DshCaptainNavigationCommand } from '../composition';

export type CaptainSurfaceHostProps = Record<string, never>;

export function CaptainSurfaceHost(_props: CaptainSurfaceHostProps = {}) {
  const dsh = appCaptainSurfaceRegistry.dsh;
  const [command] = React.useState<DshCaptainNavigationCommand>({
    token: 1,
    target: 'home',
  });

  return <dsh.SurfaceHost command={command} />;
}

export default CaptainSurfaceHost;
