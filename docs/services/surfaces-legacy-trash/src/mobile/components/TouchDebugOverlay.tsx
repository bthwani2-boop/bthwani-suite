import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, type GestureResponderEvent } from 'react-native';

type Props = {
  surfaceId: string;
  currentScreen?: string;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});

export const TouchDebugOverlay: React.FC<Props> = ({
  surfaceId,
  currentScreen,
}) => {
  const seqRef = useRef(0);
  const lastMsRef = useRef(0);

  const enabled =
    __DEV__ &&
    (
      process.env.EXPO_PUBLIC_TOUCH_DEBUG === '1' ||
      process.env.EXPO_PUBLIC_SURFACE_BINDING_MODE === 'design'
    );

  const onCapture = useCallback((e: GestureResponderEvent) => {
    if (!enabled) return false;

    const now = Date.now();
    if (now - lastMsRef.current < 80) return false;
    lastMsRef.current = now;
    seqRef.current += 1;

    const n = e.nativeEvent;
    console.log(
      '[TOUCH_DEBUG]',
      'surface=' + surfaceId,
      'screen=' + (currentScreen ?? 'unknown'),
      'seq=' + seqRef.current,
      'x=' + (typeof n.pageX === 'number' ? n.pageX : '?'),
      'y=' + (typeof n.pageY === 'number' ? n.pageY : '?'),
      'target=' + (n.target ?? '?')
    );

    return false;
  }, [enabled, surfaceId, currentScreen]);

  if (!enabled) return null;

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
      onStartShouldSetResponderCapture={onCapture}
    />
  );
};

export default TouchDebugOverlay;
