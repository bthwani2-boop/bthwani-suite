import * as React from 'react';

import { DshHomeApprovedVideoReelsViewer } from '../ApprovedVideoReelsViewer';
import type { HomeScreenShellProps } from './HomeScreenShell';

type HomeVideoReelsSectionProps = Pick<HomeScreenShellProps, 'props' | 'homeState' | 'videoHandlers'>;

export const HomeVideoReelsSection = React.memo(function HomeVideoReelsSection({
  props,
  homeState,
  videoHandlers,
}: HomeVideoReelsSectionProps) {
  if (!homeState.shortsVisible) {
    return null;
  }

  return props.renderApprovedVideoReelsViewer?.({
    visible: homeState.shortsVisible,
    items: videoHandlers.approvedVideoReels,
    initialIndex: 0,
    onClose: () => homeState.setShortsVisible(false),
    onCtaPress: videoHandlers.resolveVideoCtaPress,
    onItemImpression: (item: { id: string; [k: string]: unknown }) => props.onVideoImpression?.(item.id),
  }) ?? (
    <DshHomeApprovedVideoReelsViewer
      visible={homeState.shortsVisible}
      items={videoHandlers.approvedVideoReels}
      initialIndex={0}
      onClose={() => homeState.setShortsVisible(false)}
      onCtaPress={videoHandlers.resolveVideoCtaPress}
      onItemImpression={(item: { id: string; [k: string]: unknown }) => props.onVideoImpression?.(item.id)}
    />
  );
});
