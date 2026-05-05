import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type ArbRoute = 'home' | 'entry';
export type ArbCommandTarget = 'home' | 'back';

type ArbNavigationCommand = {
  token: number;
  target: ArbCommandTarget;
};

type ArbSurfaceHostProps = {
  command: ArbNavigationCommand;
  onExit?: () => void;
};

export function ArbSurfaceHost({ command, onExit }: ArbSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default ArbSurfaceHost;
