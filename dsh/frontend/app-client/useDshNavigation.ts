// Canonical location: dsh/frontend/app-client/useDshNavigation.ts
// Authority: dsh/frontend/app-client — route and navigation state for DshClientSurface.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { BackHandler } from 'react-native';
import type { DshRoute } from './dsh-client.types';
import type { DshNavigationCommand } from './dsh-client.types';
import { commandTargetToRoute } from './dsh-client.navigation-bridge';

type UseDshNavigationProps = {
  command: DshNavigationCommand;
  onExit?: () => void;
};

export function useDshNavigation({ command, onExit }: UseDshNavigationProps) {
  const initialRoute = React.useMemo<DshRoute>(
    () => commandTargetToRoute(command.target),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [route, setRoute] = React.useState<DshRoute>(initialRoute);
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [homeSearchAutoOpenToken, setHomeSearchAutoOpenToken] = React.useState(0);

  // Respond to imperative navigation commands from the shell
  React.useEffect(() => {
    const nextRoute = commandTargetToRoute(command.target);
    setRoute(nextRoute);
  }, [command.token, command.target]);

  const openHomeInlineSearch = React.useCallback(() => {
    setHomeSearchAutoOpenToken((t) => t + 1);
  }, []);

  // Back-handler registration — callers can override hardware back behaviour
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
