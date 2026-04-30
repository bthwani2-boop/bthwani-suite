import * as React from 'react';

// Skeleton SurfaceHost for app-partner following DshSurfaceHost style
export type ArbPartnerRoute = 'home' | 'entry';
export type ArbPartnerCommandTarget = 'home' | 'back';

type ArbPartnerNavigationCommand = {
  token: number;
  target: ArbPartnerCommandTarget;
};

type ArbPartnerSurfaceHostProps = {
  command: ArbPartnerNavigationCommand;
  onExit?: () => void;
};

export function ArbSurfaceHostPartner({ command, onExit }: ArbPartnerSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default ArbSurfaceHostPartner;
