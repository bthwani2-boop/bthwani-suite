import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { useAppFieldAppearance } from '../../../app-field/shell/appearance';
import { BottomNavBar, useTheme } from '@bthwani/ui-kit';
import {
  type DshFieldStoreVisitErrors,
  type DshFieldStoreVisitValues,
} from './screens/DshFieldStoreVisitScreen';
import {
  createManualFieldStore,
  type FieldStoreFile,
} from '../shared/contracts/field-store-model';
import {
  useFieldRuntimeActions,
} from '../shared';
import {
  PlatformVarsProvider,
  FeatureFlagProvider,
} from '../platform';
import type { DshFieldNavigationCommand, DshFieldRouteState, DshFieldSurfaceProps } from './dsh-field.types';
import { DshFieldRouteRenderer } from './screens/DshFieldRouteRenderer';
import type { DshFieldReadinessEscalationScreen } from './screens/DshFieldReadinessEscalationScreen';

type EscalationState = NonNullable<React.ComponentProps<typeof DshFieldReadinessEscalationScreen>['state']>;

function isSameRoute(left: DshFieldRouteState, right: DshFieldRouteState) {
  if (left.kind !== right.kind) return false;
  if ((left.kind === 'onboarding' || left.kind === 'visit') && (right.kind === 'onboarding' || right.kind === 'visit')) {
    return (left as { storeId: string }).storeId === (right as { storeId: string }).storeId;
  }
  return true;
}

function resolveCommandRoute(command?: DshFieldNavigationCommand): DshFieldRouteState | null {
  if (!command) return null;
  if (command.target === 'onboarding' || command.target === 'visit' ||
      command.target === 'readiness-escalation' || command.target === 'document-upload') {
    return command.storeId ? { kind: command.target, storeId: command.storeId } : { kind: 'stores' };
  }
  return { kind: command.target as 'stores' | 'account' | 'profile' | 'history' | 'finance' };
}

export function DshFieldSurface(props: DshFieldSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshFieldSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshFieldSurfaceInner({ command, onExit }: DshFieldSurfaceProps = {}) {
  const { theme } = useTheme();
  const { hydrated: appearanceHydrated, mode: appearanceMode, setMode: setAppearanceMode } = useAppFieldAppearance();
  const [stores, setStores] = React.useState<FieldStoreFile[]>([]);
  const [routeStack, setRouteStack] = React.useState<DshFieldRouteState[]>([{ kind: 'stores' }]);
  const [visitValues, setVisitValues] = React.useState<Record<string, DshFieldStoreVisitValues>>({});
  const [visitErrors, setVisitErrors] = React.useState<Record<string, DshFieldStoreVisitErrors>>({});
  const [selectedEscalationTargetByStore, setSelectedEscalationTargetByStore] = React.useState<Record<string, string>>({});
  const [readinessEscalationStateByStore, setReadinessEscalationStateByStore] = React.useState<Record<string, EscalationState>>({});
  const fieldRuntime = useFieldRuntimeActions();

  const route = routeStack[routeStack.length - 1] ?? { kind: 'stores' };
  const activeStore = (route.kind === 'onboarding' || route.kind === 'visit')
    ? stores.find((s) => s.id === (route as { storeId: string }).storeId) ?? null
    : null;

  // Merged: command routing + reset to stores if active store is gone
  React.useEffect(() => {
    if ((route.kind === 'onboarding' || route.kind === 'visit') && !activeStore) {
      setRouteStack([{ kind: 'stores' }]);
      return;
    }
    if (typeof command?.token !== 'number') return;
    const nextRoute = resolveCommandRoute(command);
    if (nextRoute) setRouteStack([nextRoute]);
  }, [command, route.kind, activeStore]);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (routeStack.length > 1) { popRoute(); return true; }
      if (onExit) { onExit(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [onExit, routeStack.length]);

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

  const patchStore = React.useCallback((storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => {
    setStores((current) => current.map((s) => (s.id === storeId ? updater(s) : s)));
  }, []);

  const handleCreateStore = React.useCallback(() => {
    const nextStore = createManualFieldStore();
    setStores((current) => [{
      ...nextStore,
      draft: {
        ...nextStore.draft,
        basics: { ...nextStore.draft.basics, storeName: nextStore.name },
        location: { ...nextStore.draft.location, city: nextStore.location },
      },
    }, ...current]);
    pushRoute({ kind: 'onboarding', storeId: nextStore.id });
  }, [pushRoute]);

  let fieldBottomActiveId = '';
  if (route.kind === 'stores') fieldBottomActiveId = 'tasks';
  else if (route.kind === 'history') fieldBottomActiveId = 'history';
  else if (route.kind === 'finance') fieldBottomActiveId = 'finance';
  else if (['account', 'profile', 'onboarding', 'visit', 'readiness-escalation'].includes(route.kind)) fieldBottomActiveId = 'profile';

  const showBottomNav = ['stores', 'history', 'finance', 'account'].includes(route.kind);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: showBottomNav ? 80 : 0 }}>
        <DshFieldRouteRenderer
          route={route}
          stores={stores}
          activeStore={activeStore}
          visitValues={visitValues}
          visitErrors={visitErrors}
          selectedEscalationTargetByStore={selectedEscalationTargetByStore}
          readinessEscalationStateByStore={readinessEscalationStateByStore}
          appearanceHydrated={appearanceHydrated}
          appearanceMode={appearanceMode}
          onAppearanceModeChange={setAppearanceMode}
          fieldRuntime={fieldRuntime}
          pushRoute={pushRoute}
          popRoute={popRoute}
          resetToStores={resetToStores}
          patchStore={patchStore}
          handleCreateStore={handleCreateStore}
          setVisitValues={setVisitValues}
          setVisitErrors={setVisitErrors}
          setSelectedEscalationTargetByStore={setSelectedEscalationTargetByStore}
          setReadinessEscalationStateByStore={setReadinessEscalationStateByStore}
        />
      </View>
      {showBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          <BottomNavBar
            activeId={fieldBottomActiveId}
            direction="rtl"
            launcherLabel="إضافة"
            launcherIcon="add-circle-outline"
            onLauncherPress={handleCreateStore}
            onSelect={(id: string) => {
              if (id === 'tasks') resetToStores();
              if (id === 'history') pushRoute({ kind: 'history' });
              if (id === 'finance') pushRoute({ kind: 'finance' });
              if (id === 'profile') pushRoute({ kind: 'account' });
            }}
            items={[
              { id: 'tasks', label: 'المهام', icon: 'list-outline', activeIcon: 'list' },
              { id: 'history', label: 'السجل', icon: 'time-outline', activeIcon: 'time' },
              { id: 'finance', label: 'المالية', icon: 'cash-outline', activeIcon: 'cash' },
              { id: 'profile', label: 'حسابي', icon: 'person-outline', activeIcon: 'person' },
            ]}
          />
        </View>
      )}
    </View>
  );
}

export default DshFieldSurface;
