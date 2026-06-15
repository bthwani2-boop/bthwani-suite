// Canonical location: dsh/frontend/shared/discovery/useDshClientNavigation.ts
// Authority: dsh/frontend/shared/discovery — route and navigation state for DshClientSurface.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { BackHandler } from 'react-native';
import type { DshRoute, DshNavigationCommand } from '../checkout/dsh-client-binding.contracts';
import { commandTargetToRoute } from './client.navigation-bridge';

type UseDshClientNavigationProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
};

export function useDshClientNavigation({ command, onExit }: UseDshClientNavigationProps) {
  const initialRoute = React.useMemo<DshRoute>(
    () => commandTargetToRoute(command.target),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [route, setRoute] = React.useState<DshRoute>(initialRoute);
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [homeSearchAutoOpenToken, setHomeSearchAutoOpenToken] = React.useState(0);

  React.useEffect(() => {
    const nextRoute = commandTargetToRoute(command.target);
    setRoute(nextRoute);
  }, [command.token, command.target]);

  const openHomeInlineSearch = React.useCallback(() => {
    setHomeSearchAutoOpenToken((t) => t + 1);
  }, []);

  const backHandlerRef = React.useRef<(() => boolean) | null>(null);

  const handleRegisterBackHandler = React.useCallback(
    (handler: (() => boolean) | null) => {
      backHandlerRef.current = handler;
    },
    [],
  );

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backHandlerRef.current) {
        return backHandlerRef.current();
      }
      if (route !== 'home') {
        setRoute('home');
        return true;
      }
      onExit?.();
      return false;
    });
    return () => subscription.remove();
  }, [route, onExit]);

  return {
    route,
    setRoute,
    sheinInlineOpen,
    setSheinInlineOpen,
    awnakInlineOpen,
    setAwnakInlineOpen,
    homeSearchAutoOpenToken,
    openHomeInlineSearch,
    handleRegisterBackHandler,
  } as const;
}
