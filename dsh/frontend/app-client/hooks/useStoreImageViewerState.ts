import * as React from 'react';
import { Animated } from 'react-native';
import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../shared/products';

type UseStoreImageViewerStateParams = {
  setPreviewItem: (item: DshStoreGetMenuItem | null) => void;
  setPreviewActiveIndex: (index: number) => void;
  viewerItems: DshStoreGetMenuItem[];
};

type UseStoreImageViewerStateResult = {
  viewerAnim: Animated.Value;
  openImageViewer: (item: DshStoreGetMenuItem) => void;
  closeImageViewer: () => void;
};

export function useStoreImageViewerState({
  setPreviewItem,
  setPreviewActiveIndex,
  viewerItems,
}: UseStoreImageViewerStateParams): UseStoreImageViewerStateResult {
  const viewerAnim = React.useRef(new Animated.Value(0)).current;

  const openImageViewer = React.useCallback(
    (item: DshStoreGetMenuItem) => {
      const index = viewerItems.findIndex((i) => i.id === item.id);
      setPreviewActiveIndex(index !== -1 ? index : 0);
      setPreviewItem(item);
      Animated.timing(viewerAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [viewerItems, setPreviewActiveIndex, setPreviewItem, viewerAnim],
  );

  const closeImageViewer = React.useCallback(() => {
    Animated.timing(viewerAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPreviewItem(null);
      setPreviewActiveIndex(-1);
    });
  }, [setPreviewItem, setPreviewActiveIndex, viewerAnim]);

  return {
    viewerAnim,
    openImageViewer,
    closeImageViewer,
  };
}
