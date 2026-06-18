import * as React from 'react';
import { PanResponder, FlatList } from 'react-native';
import type { DshStoreMenuItem as DshStoreGetMenuItem } from '../../shared/products';

type UseStoreGestureHandlersParams = {
  viewerActiveIndex: number;
  viewerItems: DshStoreGetMenuItem[];
  isRTL: boolean;
  setPreviewActiveIndex: (index: number) => void;
  setPreviewItem: (item: DshStoreGetMenuItem | null) => void;
  menuListRef: React.MutableRefObject<FlatList<DshStoreGetMenuItem> | null>;
};

type UseStoreGestureHandlersResult = {
  panResponder: ReturnType<typeof PanResponder.create>;
};

/**
 * Encapsulates the PanResponder for horizontal swipe navigation in the image
 * preview carousel. Isolated from main feed renders so preview gestures don't
 * trigger re-renders of the store menu list.
 */
export function useStoreGestureHandlers({
  viewerActiveIndex,
  viewerItems,
  isRTL,
  setPreviewActiveIndex,
  setPreviewItem,
  menuListRef,
}: UseStoreGestureHandlersParams): UseStoreGestureHandlersResult {
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          const { dx, dy } = gestureState;
          // Intercept only clear horizontal swipes; pass vertical moves to FlatList.
          return Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 20;
        },
        onPanResponderRelease: (_evt, gestureState) => {
          const { dx } = gestureState;
          const threshold = 40;

          if (Math.abs(dx) > threshold) {
            const direction = dx > 0 ? -1 : 1;
            const adjustedDirection = isRTL ? -direction : direction;
            const nextIndex = viewerActiveIndex + adjustedDirection;

            if (nextIndex >= 0 && nextIndex < viewerItems.length) {
              setPreviewActiveIndex(nextIndex);
              setPreviewItem(viewerItems[nextIndex] ?? null);
              menuListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }
          }
        },
      }),
    [viewerActiveIndex, viewerItems, isRTL, setPreviewActiveIndex, setPreviewItem, menuListRef],
  );

  return { panResponder };
}
