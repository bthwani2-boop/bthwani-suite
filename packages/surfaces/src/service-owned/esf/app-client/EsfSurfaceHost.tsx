import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type EsfRoute = 'home' | 'entry';
export type EsfCommandTarget = 'home' | 'back';

type EsfNavigationCommand = {
  token: number;
  target: EsfCommandTarget;
};

type EsfSurfaceHostProps = {
  command: EsfNavigationCommand;
  onExit?: () => void;
};

export function EsfSurfaceHost({ command, onExit }: EsfSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default EsfSurfaceHost;
