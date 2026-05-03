import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type MrfRoute = 'home' | 'entry';
export type MrfCommandTarget = 'home' | 'back';

type MrfNavigationCommand = {
  token: number;
  target: MrfCommandTarget;
};

type MrfSurfaceHostProps = {
  command: MrfNavigationCommand;
  onExit?: () => void;
};

export function MrfSurfaceHost({ command, onExit }: MrfSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default MrfSurfaceHost;
