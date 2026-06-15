// Canonical location: dsh/frontend/shared/field/field-navigation.model.ts
// Authority: dsh/frontend/shared/field — route stack management for field surface.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import type { DshFieldNavigationCommand, DshFieldRouteState } from './field.types';

function isSameRoute(left: DshFieldRouteState, right: DshFieldRouteState): boolean {
  if (left.kind !== right.kind) return false;
  if (
    (left.kind === 'onboarding' || left.kind === 'visit' || left.kind === 'readiness-escalation' || left.kind === 'document-upload') &&
    (right.kind === 'onboarding' || right.kind === 'visit' || right.kind === 'readiness-escalation' || right.kind === 'document-upload')
  ) {
    return (left as { storeId: string }).storeId === (right as { storeId: string }).storeId;
  }
  return true;
}

function resolveCommandRoute(command?: DshFieldNavigationCommand): DshFieldRouteState | null {
  if (!command) return null;
  if (
    command.target === 'onboarding' ||
    command.target === 'visit' ||
    command.target === 'readiness-escalation' ||
    command.target === 'document-upload'
  ) {
    return command.storeId ? { kind: command.target, storeId: command.storeId } : { kind: 'stores' };
  }
  return { kind: command.target };
}

export function resolveFieldBottomActiveId(route: DshFieldRouteState): string {
  if (route.kind === 'stores') return 'tasks';
  if (route.kind === 'history') return 'history';
  if (route.kind === 'finance') return 'finance';
  if (['account', 'profile', 'onboarding', 'visit', 'readiness-escalation'].includes(route.kind)) return 'profile';
  return '';
}

export function canFieldShowBottomNav(route: DshFieldRouteState): boolean {
  return route.kind === 'stores' || route.kind === 'history' || route.kind === 'finance' || route.kind === 'account';
}

export function useFieldNavigationModel({ command }: { command: DshFieldNavigationCommand | undefined }) {
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };

  // Command-driven navigation (token change triggers route reset)
  React.useEffect(() => {
    if (typeof command?.token !== 'number') return;
    const nextRoute = resolveCommandRoute(command);
    if (nextRoute) setRouteStack([nextRoute]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.token]);

  const pushRoute = React.useCallback((nextRoute: DshFieldRouteState) => {
    setRouteStack((current) => {
      const activeRoute = current[current.length - 1];
      return activeRoute && isSameRoute(activeRoute, nextRoute) ? current : [...current, nextRoute];
    });
  }, []);

  const popRoute = React.useCallback(() => {
    setRouteStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  }, []);

  const resetToStores = React.useCallback(() => setRouteStack([{ kind: 'stores' }]), []);

  return { route, routeStack, pushRoute, popRoute, resetToStores };
}
