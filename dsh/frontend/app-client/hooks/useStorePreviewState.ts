import * as React from 'react';
import { Animated } from 'react-native';
import type { DshStoreFixtureItem } from '../../shared/dshStoreProductCardModel';

type UseStorePreviewStateOptions = {
  setPreviewItem: React.Dispatch<React.SetStateAction<DshStoreFixtureItem | null>>;
  setPreviewActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  previewItems: DshStoreFixtureItem[];
};

export function useStorePreviewState({
  setPreviewItem,
  setPreviewActiveIndex,
  previewItems,
}: UseStorePreviewStateOptions) {
  const previewAnim = React.useRef(new Animated.Value(0)).current;

  const openImagePreview = React.useCallback((item: DshStoreFixtureItem) => {
    const items = Array.isArray(previewItems) ? previewItems : [];
    const activeIdx = items.findIndex((i) => i.id === item.id);
    setPreviewActiveIndex(Math.max(0, activeIdx));
    setPreviewItem(item);
    Animated.spring(previewAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [previewItems, setPreviewActiveIndex, setPreviewItem, previewAnim]);

  const closeImagePreview = React.useCallback(() => {
    Animated.timing(previewAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setPreviewItem(null);
      setPreviewActiveIndex(-1);
    });
  }, [previewAnim, setPreviewItem, setPreviewActiveIndex]);

  return {
    previewAnim,
    openImagePreview,
    closeImagePreview,
  };
}
