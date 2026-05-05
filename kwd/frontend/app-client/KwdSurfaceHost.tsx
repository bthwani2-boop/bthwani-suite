import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type KwdRoute = 'home' | 'entry';
export type KwdCommandTarget = 'home' | 'back';

type KwdNavigationCommand = {
  token: number;
  target: KwdCommandTarget;
};

type KwdSurfaceHostProps = {
  command: KwdNavigationCommand;
  onExit?: () => void;
};

export function KwdSurfaceHost({ command, onExit }: KwdSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default KwdSurfaceHost;
