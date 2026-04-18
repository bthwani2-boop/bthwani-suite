import * as React from 'react';

// Skeleton SurfaceHost for app-field following DshSurfaceHost style
export type ArbFieldRoute = 'home' | 'entry';
export type ArbFieldCommandTarget = 'home' | 'back';

type ArbFieldNavigationCommand = {
  token: number;
  target: ArbFieldCommandTarget;
};

type ArbFieldSurfaceHostProps = {
  command: ArbFieldNavigationCommand;
  onExit?: () => void;
};

export function ArbSurfaceHostField({ command, onExit }: ArbFieldSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default ArbSurfaceHostField;
