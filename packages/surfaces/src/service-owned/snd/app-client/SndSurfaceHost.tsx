import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type SndRoute = 'home' | 'entry';
export type SndCommandTarget = 'home' | 'back';

type SndNavigationCommand = {
  token: number;
  target: SndCommandTarget;
};

type SndSurfaceHostProps = {
  command: SndNavigationCommand;
  onExit?: () => void;
};

export function SndSurfaceHost({ command, onExit }: SndSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default SndSurfaceHost;
