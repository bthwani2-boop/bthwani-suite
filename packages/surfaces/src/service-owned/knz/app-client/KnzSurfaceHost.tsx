import * as React from 'react';

// Skeleton SurfaceHost following the style of DshSurfaceHost
export type KnzRoute = 'home' | 'entry';
export type KnzCommandTarget = 'home' | 'back';

type KnzNavigationCommand = {
  token: number;
  target: KnzCommandTarget;
};

type KnzSurfaceHostProps = {
  command: KnzNavigationCommand;
  onExit?: () => void;
};

export function KnzSurfaceHost({ command, onExit }: KnzSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default KnzSurfaceHost;
