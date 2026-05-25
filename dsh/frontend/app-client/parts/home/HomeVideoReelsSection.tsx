import * as React from 'react';

import { DshHomeApprovedVideoReelsViewer } from '../ApprovedVideoReelsViewer';

export const HomeVideoReelsSection = React.memo(function HomeVideoReelsSection({
  props,
  homeState,
  videoHandlers,
}: any) {
  if (!homeState.shortsVisible) {
    return null;
  }

  return props.renderApprovedVideoReelsViewer?.({
    visible: homeState.shortsVisible,
    items: videoHandlers.approvedVideoReels,
    initialIndex: 0,
    onClose: () => homeState.setShortsVisible(false),
    onCtaPress: videoHandlers.resolveVideoCtaPress,
    onItemImpression: (item: any) => props.onVideoImpression?.(item.id),
  }) ?? (
    <DshHomeApprovedVideoReelsViewer
      visible={homeState.shortsVisible}
      items={videoHandlers.approvedVideoReels}
      initialIndex={0}
      onClose={() => homeState.setShortsVisible(false)}
      onCtaPress={videoHandlers.resolveVideoCtaPress}
      onItemImpression={(item: any) => props.onVideoImpression?.(item.id)}
    />
  );
});
