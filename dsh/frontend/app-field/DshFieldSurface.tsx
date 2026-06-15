import React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { useAppFieldAppearance } from '../../../app-field/shell/appearance';
import { BottomNavBar, useTheme } from '@bthwani/ui-kit';
import {
  useDshFieldSurfaceModel,
} from '../shared/field';
import {
  PlatformVarsProvider,
  FeatureFlagProvider,
} from '../platform';
import type { DshFieldSurfaceProps } from './dsh-field.types';
import { DshFieldRouteRenderer } from './screens/DshFieldRouteRenderer';

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
  const fieldSurface = useDshFieldSurfaceModel(command);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fieldSurface.model.routeStackDepth > 1) { fieldSurface.actions.popRoute(); return true; }
      if (onExit) { onExit(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [fieldSurface.actions, fieldSurface.model.routeStackDepth, onExit]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: fieldSurface.model.bottomNav.visible ? 80 : 0 }}>
        <DshFieldRouteRenderer
          model={fieldSurface.model}
          actions={fieldSurface.actions}
          appearanceHydrated={appearanceHydrated}
          appearanceMode={appearanceMode}
          onAppearanceModeChange={setAppearanceMode}
        />
      </View>
      {fieldSurface.model.bottomNav.visible && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          <BottomNavBar
            activeId={fieldSurface.model.bottomNav.activeId}
            direction="rtl"
            launcherLabel="إضافة"
            launcherIcon="add-circle-outline"
            onLauncherPress={fieldSurface.actions.handleCreateStore}
            onSelect={(id: string) => {
              if (id === 'tasks') fieldSurface.actions.resetToStores();
              if (id === 'history') fieldSurface.actions.pushRoute({ kind: 'history' });
              if (id === 'finance') fieldSurface.actions.pushRoute({ kind: 'finance' });
              if (id === 'profile') fieldSurface.actions.pushRoute({ kind: 'account' });
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
