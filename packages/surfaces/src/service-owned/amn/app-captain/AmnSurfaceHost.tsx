import * as React from 'react';

// Skeleton SurfaceHost for app-captain following DshSurfaceHost style
export type AmnCaptainRoute = 'home' | 'entry';
export type AmnCaptainCommandTarget = 'home' | 'back';

type AmnCaptainNavigationCommand = {
  token: number;
  target: AmnCaptainCommandTarget;
};

type AmnCaptainSurfaceHostProps = {
  command: AmnCaptainNavigationCommand;
  onExit?: () => void;
};

export function AmnSurfaceHostCaptain({ command, onExit }: AmnCaptainSurfaceHostProps) {
  // TODO: implement host logic mirroring DshSurfaceHost
  return null;
}

export default AmnSurfaceHostCaptain;
