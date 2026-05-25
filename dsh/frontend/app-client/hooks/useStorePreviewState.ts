import * as React from 'react';
import { Animated } from 'react-native';

export function useStorePreviewState({
  setPreviewItem,
  setPreviewActiveIndex,
  previewItems,
}: any) {
  const previewAnim = React.useRef(new Animated.Value(0)).current;

  const openImagePreview = React.useCallback((item: any) => {
    const activeIdx = previewItems.findIndex((i: any) => i.id === item.id);
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
