import React from 'react';
import { Platform, View } from 'react-native';
import {
  usePlatformVars,
  FeatureFlagProvider,
  PlatformVarsProvider,
  useFeatureFlag,
} from '../platform';
import type { DshClientSurfaceProps } from './dsh-client.types';
import { DshClientBottomNav } from './DshClientBottomNav';
import { DshClientRouteRenderer } from './DshClientRouteRenderer';
import { useDshClientSurfaceModel } from './useDshClientSurfaceModel';

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

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? 112 : 80 }}>
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
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <DshClientBottomNav
          route={model.routeContext.route}
          handleServiceLauncherPress={model.bell.handleServiceLauncherPress}
          handleClientBottomNavSelect={model.homeActions.handleClientBottomNavSelect}
        />
      </View>
    </View>
  );
}

export default DshClientSurface;
