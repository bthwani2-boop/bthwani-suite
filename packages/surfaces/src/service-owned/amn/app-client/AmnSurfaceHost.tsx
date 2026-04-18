import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type AmnRoute = 'home' | 'entry';
export type AmnCommandTarget = 'home' | 'back';

type AmnNavigationCommand = {
  token: number;
  target: AmnCommandTarget;
};

type AmnSurfaceHostProps = {
  command: AmnNavigationCommand;
  onExit?: () => void;
};

export function AmnSurfaceHost({ command, onExit }: AmnSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default AmnSurfaceHost;
