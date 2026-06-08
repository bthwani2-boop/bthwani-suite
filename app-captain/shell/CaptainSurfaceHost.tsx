import React from 'react';
import { appCaptainSurfaceRegistry, type DshCaptainNavigationCommand } from '../composition';

export type CaptainSurfaceHostProps = Record<string, never>;

const APP_CAPTAIN_PREVIEW_ID = 'CAP-0041';

function resolveCaptainRuntimeId(): string {
  const configuredCaptainId = process.env.EXPO_PUBLIC_DSH_CAPTAIN_ID?.trim();
  return configuredCaptainId || APP_CAPTAIN_PREVIEW_ID;
}

export function CaptainSurfaceHost(_props: CaptainSurfaceHostProps = {}) {
  const dsh = appCaptainSurfaceRegistry.dsh;
  const [command] = React.useState<DshCaptainNavigationCommand>({
    token: 1,
    target: 'home',
  });
  const captainId = React.useMemo(() => resolveCaptainRuntimeId(), []);

  return <dsh.SurfaceHost command={command} captainId={captainId} />;
}

export default CaptainSurfaceHost;
