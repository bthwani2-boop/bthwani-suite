import * as React from 'react';
import { PanResponder, FlatList } from 'react-native';
import type { DshStoreFixtureItem as DshStoreGetMenuItem } from '../../shared/dshStoreProductCardModel';

type UseStoreGestureHandlersParams = {
  previewActiveIndex: number;
  previewItems: DshStoreGetMenuItem[];
  isRTL: boolean;
  setPreviewActiveIndex: (index: number) => void;
  setPreviewItem: (item: DshStoreGetMenuItem | null) => void;
  previewListRef: React.MutableRefObject<FlatList<DshStoreGetMenuItem> | null>;
};

type UseStoreGestureHandlersResult = {
  previewPanResponder: ReturnType<typeof PanResponder.create>;
};

/**
 * Encapsulates the PanResponder for horizontal swipe navigation in the image
 * preview carousel. Isolated from main feed renders so preview gestures don't
 * trigger re-renders of the store menu list.
 */
export function useStoreGestureHandlers({
  previewActiveIndex,
  previewItems,
  isRTL,
  setPreviewActiveIndex,
  setPreviewItem,
  previewListRef,
}: UseStoreGestureHandlersParams): UseStoreGestureHandlersResult {
  const previewPanResponder = React.useMemo(
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
            const nextIndex = previewActiveIndex + adjustedDirection;

            if (nextIndex >= 0 && nextIndex < previewItems.length) {
              setPreviewActiveIndex(nextIndex);
              setPreviewItem(previewItems[nextIndex] ?? null);
              previewListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }
          }
        },
      }),
    [previewActiveIndex, previewItems, isRTL, setPreviewActiveIndex, setPreviewItem, previewListRef],
  );

  return { previewPanResponder };
}
