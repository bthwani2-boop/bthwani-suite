import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { commandTargetToRoute } from '../dsh-client.navigation-bridge';
import type { DshCommandTarget, DshRoute } from '../dsh-client.types';

type DshNavigationCommand = { token: number; target: DshCommandTarget };

type UseDshNavigationOptions = {
  command: DshNavigationCommand;
  onExit?: () => void;
};

export type UseDshNavigationResult = {
  route: DshRoute;
  setRoute: React.Dispatch<React.SetStateAction<DshRoute>>;
  sheinInlineOpen: boolean;
  setSheinInlineOpen: (open: boolean) => void;
  awnakInlineOpen: boolean;
  setAwnakInlineOpen: (open: boolean) => void;
  homeSearchAutoOpenToken: number;
  openHomeInlineSearch: () => void;
  handleRegisterBackHandler: (handler: (() => boolean) | null) => void;
};

function getWebWindow(): (Window & typeof globalThis) | null {
  if (Platform.OS !== 'web') return null;
  try { return typeof window !== 'undefined' ? window : null; } catch { return null; }
}

export function useDshNavigation({
  command,
  onExit,
}: UseDshNavigationOptions): UseDshNavigationResult {
  const [route, setRoute] = React.useState<DshRoute>('home');
  const [sheinInlineOpen, setSheinInlineOpen] = React.useState(false);
  const [awnakInlineOpen, setAwnakInlineOpen] = React.useState(false);
  const [homeSearchAutoOpenToken, setHomeSearchAutoOpenToken] = React.useState(0);

  const routeHistoryRef = React.useRef<DshRoute[]>(['home']);
  const routeTransitionFromBackRef = React.useRef(false);
  const homeBackResolverRef = React.useRef<(() => boolean) | null>(null);

  const handleRegisterBackHandler = React.useCallback(
    (handler: (() => boolean) | null) => { homeBackResolverRef.current = handler; },
    [],
  );

  const openHomeInlineSearch = React.useCallback(() => {
    setRoute('home');
    setHomeSearchAutoOpenToken((t) => t + 1);
  }, []);

  // Sync incoming command → route
  React.useEffect(() => {
    setRoute(commandTargetToRoute(command.target));
  }, [command]);

  // Maintain route history stack + web history.pushState
  React.useEffect(() => {
    const prev = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    if (route === prev) return;

    if (routeTransitionFromBackRef.current) {
      routeTransitionFromBackRef.current = false;
      return;
    }

    if (route === 'home') {
      routeHistoryRef.current = ['home'];
    } else {
      const idx = routeHistoryRef.current.indexOf(route);
      if (idx !== -1) {
        routeHistoryRef.current = routeHistoryRef.current.slice(0, idx + 1);
      } else {
        routeHistoryRef.current.push(route);
      }
    }
    getWebWindow()?.history.pushState({ route }, '');
  }, [route]);

  // Android hardware back button
  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (homeBackResolverRef.current?.()) return true;
      if (sheinInlineOpen) { setSheinInlineOpen(false); return true; }
      if (awnakInlineOpen) { setAwnakInlineOpen(false); return true; }

      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home');
        return true;
      }

      if (onExit) { onExit(); return true; }
      return false;
    });

    return () => sub.remove();
  }, [onExit, sheinInlineOpen, awnakInlineOpen]);

  // Web browser back button (popstate)
  React.useEffect(() => {
    const w = getWebWindow();
    if (!w) return undefined;

    const handlePopState = () => {
      if (homeBackResolverRef.current?.()) { w.history.pushState({ route }, ''); return; }
      if (sheinInlineOpen) { setSheinInlineOpen(false); w.history.pushState({ route }, ''); return; }
      if (awnakInlineOpen) { setAwnakInlineOpen(false); w.history.pushState({ route }, ''); return; }

      if (routeHistoryRef.current.length > 1) {
        routeTransitionFromBackRef.current = true;
        routeHistoryRef.current.pop();
        setRoute(routeHistoryRef.current[routeHistoryRef.current.length - 1] ?? 'home');
      } else if (onExit) {
        onExit();
      }
    };

    w.addEventListener('popstate', handlePopState);
    if (!w.history.state || (w.history.state as { route?: DshRoute }).route !== route) {
      w.history.replaceState({ route }, '');
    }

    return () => w.removeEventListener('popstate', handlePopState);
  }, [route, onExit, sheinInlineOpen, awnakInlineOpen]);

  return {
    route, setRoute,
    sheinInlineOpen, setSheinInlineOpen,
    awnakInlineOpen, setAwnakInlineOpen,
    homeSearchAutoOpenToken, openHomeInlineSearch,
    handleRegisterBackHandler,
  };
}
