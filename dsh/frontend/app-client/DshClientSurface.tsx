import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  usePlatformVars,
  FeatureFlagProvider,
  PlatformVarsProvider,
  useFeatureFlag,
} from '../shared';
import type { DshClientSurfaceProps } from './dsh-client.types';
import { DshClientBottomNav } from './DshClientBottomNav';
import { DshClientRouteRenderer } from './DshClientRouteRenderer';
import { useDshClientSurfaceModel } from './useDshClientSurfaceModel';

// Routes where the bottom nav bar is visible — home-level only.
const PRIMARY_NAV_ROUTES = new Set(['home', 'orders-list', 'wlt-home', 'my-space']);

export function DshClientSurface(props: DshClientSurfaceProps) {
  return (
    <PlatformVarsProvider>
      <FeatureFlagProvider>
        <DshClientSurfaceInner {...props} />
      </FeatureFlagProvider>
    </PlatformVarsProvider>
  );
}

function DshClientSurfaceInner(props: DshClientSurfaceProps) {
  const { dshApiBaseUrl, dshAuthBearerToken, dshClientId } = usePlatformVars();
  const isAwnakEnabled = useFeatureFlag('DSH:capability:awnak');

  const model = useDshClientSurfaceModel({
    ...props,
    dshApiBaseUrl,
    dshAuthBearerToken,
    dshClientId,
    isAwnakEnabled,
  });

  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 8 : 12);
  const NAV_BAR_HEIGHT = 64 + bottomPadding; // mirrors BottomNavBar totalHeight

  const showBottomNav = PRIMARY_NAV_ROUTES.has(model.routeContext.route);
  const contentPaddingBottom = showBottomNav ? NAV_BAR_HEIGHT : 0;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: contentPaddingBottom }}>
        <DshClientRouteRenderer
          session={model.session}
          routeContext={model.routeContext}
          home={{
            ...model.home,
            renderApprovedVideoReelsViewer: props.renderApprovedVideoReelsViewer,
          }}
          store={model.store}
          checkout={model.checkout}
          orders={model.orders}
          marketing={model.marketing}
        />
      </View>
      {showBottomNav && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          <DshClientBottomNav
            route={model.routeContext.route}
            handleServiceLauncherPress={model.bell.handleServiceLauncherPress}
            handleClientBottomNavSelect={model.homeActions.handleClientBottomNavSelect}
          />
        </View>
      )}
    </View>
  );
}

export default DshClientSurface;
