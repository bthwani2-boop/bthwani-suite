// Canonical location: dsh/frontend/shared/captain/captain-navigation.model.ts
// Authority: dsh/frontend/shared/captain — route history, back navigation, command-driven routing.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshCaptainRoute, CaptainSupportRoute, DshCaptainCommandTarget } from './captain.contract';
import { getRouteForCommandTarget } from '../delivery/delivery.policy';
import type { DshCaptainSurfaceState } from './captain.surface.types';

type SetField = <k extends keyof DshCaptainSurfaceState>(
  key: k,
  value: DshCaptainSurfaceState[k] | ((c: DshCaptainSurfaceState[k]) => DshCaptainSurfaceState[k]),
) => void;

type CaptainNavigationDeps = {
  command: { target: DshCaptainCommandTarget; token?: number };
  route: DshCaptainRoute;
  set: SetField;
};

export function useCaptainNavigationModel({ command, route, set }: CaptainNavigationDeps) {
  const routeHistoryRef = React.useRef<DshCaptainRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const commandKeyRef = React.useRef(`${command.target}:${command.token ?? ''}`);

  React.useEffect(() => {
    const commandKey = `${command.target}:${command.token ?? ''}`;
    if (commandKey !== commandKeyRef.current) {
      commandKeyRef.current = commandKey;
      const nextRoute = getRouteForCommandTarget(command.target);
      routeHistoryRef.current = [nextRoute];
      routeTransitionFromBackRef.current = false;
      set('route', nextRoute);
      return;
    }
    const previousRoute = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route !== previousRoute) {
      if (routeTransitionFromBackRef.current) {
        routeTransitionFromBackRef.current = false;
      } else {
        routeHistoryRef.current.push(route);
      }
    }
  }, [command.target, command.token, route, set]);

  const goBack = React.useCallback(() => {
    if (routeHistoryRef.current.length > 1) {
      routeTransitionFromBackRef.current = true;
      routeHistoryRef.current.pop();
      const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home';
      set('route', prev);
      return true;
    }
    if (route !== 'home') { set('route', 'home'); return true; }
    return false;
  }, [route, set]);

  const goToInbox = React.useCallback(() => set('route', 'inbox'), [set]);
  const openOrderDetail = React.useCallback((id: string) => { set('activeOrderId', id); set('route', 'detail'); }, [set]);
  const openCaptainAccount = React.useCallback(() => set('route', 'account'), [set]);
  const openCaptainAccountSection = React.useCallback((r: DshCaptainRoute) => set('route', r), [set]);
  const openSupportDirectory = React.useCallback(() => set('route', 'support-directory'), [set]);
  const openCaptainSupportScreen = React.useCallback((screenId: CaptainSupportRoute) => {
    set('selectedSupportScreen', screenId);
    set('route', 'support-screen');
  }, [set]);

  return {
    goBack,
    goToInbox,
    openOrderDetail,
    openCaptainAccount,
    openCaptainAccountSection,
    openSupportDirectory,
    openCaptainSupportScreen,
  };
}
