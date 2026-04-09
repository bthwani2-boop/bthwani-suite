/**
 * BTHWANI Clock Dial Categories — واجهة فئات دائرية مستوحاة من الشعار.
 * تنبثق من أيقونة الفئات، دوران بالسحب، snap، تمييز العنصر النشط عند الأعلى.
 * بدون مكتبات إضافية (Animated + PanResponder فقط).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dial fills most of the screen width with no max limit
const DIAL_SIZE = Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.6);
const DIAL_RADIUS = DIAL_SIZE / 2;
// Orbit radius for good spacing between items
const ORBIT_RADIUS = DIAL_SIZE * 0.38;
// Compact items to match selector icons
const ITEM_SIZE = 88;
const ITEM_HALF = ITEM_SIZE / 2;

export type CategoryDialItem = {
  id: string;
  key: string;
  title: string;
  /** URL من getDshCategoryIconUrl — خلفية بيضاء فقط */
  iconUrl: string | null;
  emojiFallback?: string;
};

export type DialAnchorLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  visible: boolean;
  items: CategoryDialItem[];
  anchorLayout?: DialAnchorLayout | null;
  onClose: () => void;
  onSelect: (item: CategoryDialItem) => void;
};

function normalizeDeg(deg: number) {
  let v = deg % 360;
  if (v < 0) v += 360;
  return v;
}

function nearestSnapAngle(rotation: number, step: number) {
  return Math.round(rotation / step) * step;
}

function indexFromRotation(rotation: number, step: number, count: number) {
  if (!count) return -1;
  const raw = -Math.round(rotation / step);
  const mod = ((raw % count) + count) % count;
  return mod;
}

function DialOrbitItem({
  item,
  isActive,
}: {
  item: CategoryDialItem;
  isActive: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = item.iconUrl && !imgFailed;

  return (
    <View
      style={[
        styles.itemCard,
        {
          transform: [{ scale: isActive ? 1.16 : 0.94 }],
          opacity: isActive ? 1 : 0.86,
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: item.iconUrl! }}
          style={styles.iconSolo}
          resizeMode='contain'
          onError={() => setImgFailed(true)}
        />
      ) : (
        <Text style={styles.iconEmoji}>{item.emojiFallback ?? '📦'}</Text>
      )}
      <View
        style={[
          styles.itemTitleContainer,
          isActive ? styles.itemTitleContainerActive : null,
        ]}
      >
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={[styles.itemTitle, isActive ? styles.itemTitleActive : null]}
        >
          {item.title}
        </Text>
      </View>
    </View>
  );
}

export default function CategoryClockDial({
  visible,
  items,
  anchorLayout,
  onClose,
  onSelect,
}: Props) {
  const itemCount = items.length;
  const angleStep = 360 / Math.max(itemCount, 1);

  const dialScale = useRef(new Animated.Value(0.88)).current;
  const dialOpacity = useRef(new Animated.Value(0)).current;
  const dialTranslateX = useRef(new Animated.Value(0)).current;
  const dialTranslateY = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const userInteractingRef = useRef(false);
  const autoSpinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalX = (SCREEN_WIDTH - DIAL_SIZE) / 2;
  const finalY = Math.max(60, (SCREEN_HEIGHT - DIAL_SIZE) / 2 - 20);

  const anchorCenter = useMemo(() => {
    if (!anchorLayout) {
      return {
        x: SCREEN_WIDTH / 2,
        y: SCREEN_HEIGHT - 120,
      };
    }
    return {
      x: anchorLayout.x + anchorLayout.width / 2,
      y: anchorLayout.y + anchorLayout.height / 2,
    };
  }, [anchorLayout]);

  const initialX = anchorCenter.x - DIAL_RADIUS;
  const initialY = anchorCenter.y - DIAL_RADIUS;

  useEffect(() => {
    const id = rotationAnim.addListener(({ value }) => {
      currentRotationRef.current = value;
    });
    return () => {
      rotationAnim.removeListener(id);
    };
  }, [rotationAnim]);

  const clearAutoSpinTimer = () => {
    if (autoSpinTimeoutRef.current) {
      clearTimeout(autoSpinTimeoutRef.current);
      autoSpinTimeoutRef.current = null;
    }
  };

  const scheduleAutoSpinResume = (delayMs = 2000) => {
    clearAutoSpinTimer();
    autoSpinTimeoutRef.current = setTimeout(() => {
      autoSpinTimeoutRef.current = null;
      if (userInteractingRef.current) return;
      if (!visible) return;
      startAutoSpin();
    }, delayMs);
  };

  const startAutoSpin = () => {
    clearAutoSpinTimer();
    if (!visible) return;
    if (userInteractingRef.current) return;
    rotationAnim.stopAnimation(v => {
      rotationAnim.setValue(v);
      const toValue = v + 360;
      Animated.timing(rotationAnim, {
        toValue,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        if (!visible) return;
        if (userInteractingRef.current) return;
        startAutoSpin();
      });
    });
  };

  useEffect(() => {
    if (!visible) {
      dialScale.setValue(0.88);
      dialOpacity.setValue(0);
      dialTranslateX.setValue(initialX);
      dialTranslateY.setValue(initialY);
      rotationAnim.setValue(0);
      currentRotationRef.current = 0;
      setActiveIndex(0);
      userInteractingRef.current = false;
      clearAutoSpinTimer();
      rotationAnim.stopAnimation();
      return;
    }

    dialTranslateX.setValue(initialX);
    dialTranslateY.setValue(initialY);
    dialScale.setValue(0.88);
    dialOpacity.setValue(0);
    rotationAnim.setValue(0);
    currentRotationRef.current = 0;
    setActiveIndex(0);
    userInteractingRef.current = false;
    clearAutoSpinTimer();

    Animated.parallel([
      Animated.timing(dialOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(dialScale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(dialTranslateX, {
        toValue: finalX,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(dialTranslateY, {
        toValue: finalY,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      startAutoSpin();
    });
  }, [
    visible,
    initialX,
    initialY,
    finalX,
    finalY,
    dialOpacity,
    dialScale,
    dialTranslateX,
    dialTranslateY,
    rotationAnim,
  ]);

  const rotationToDeg = useMemo(
    () =>
      rotationAnim.interpolate({
        inputRange: [-3600, 3600],
        outputRange: ['-3600deg', '3600deg'],
        extrapolate: 'extend',
      }),
    [rotationAnim]
  );

  const rotationToDegInverse = useMemo(
    () =>
      rotationAnim.interpolate({
        inputRange: [-3600, 3600],
        outputRange: ['3600deg', '-3600deg'],
        extrapolate: 'extend',
      }),
    [rotationAnim]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,

        onPanResponderGrant: () => {
          userInteractingRef.current = true;
          clearAutoSpinTimer();
          rotationAnim.stopAnimation(v => {
            currentRotationRef.current = v;
            rotationAnim.setValue(v);
          });
          dragStartRotationRef.current = currentRotationRef.current;
        },

        onPanResponderMove: (_, gesture) => {
          const dragRotation = dragStartRotationRef.current + gesture.dx * 0.7;
          rotationAnim.setValue(dragRotation);
          const nextActive = indexFromRotation(
            dragRotation,
            angleStep,
            itemCount
          );
          setActiveIndex(prev => (prev === nextActive ? prev : nextActive));
        },

        onPanResponderRelease: (_, gesture) => {
          const releaseRotation =
            dragStartRotationRef.current + gesture.dx * 0.7;
          const velocity = gesture.vx * 50;
          const snapped = nearestSnapAngle(
            releaseRotation + velocity,
            angleStep
          );

          Animated.spring(rotationAnim, {
            toValue: snapped,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }).start(() => {
            const nextActive = indexFromRotation(snapped, angleStep, itemCount);
            setActiveIndex(prev => (prev === nextActive ? prev : nextActive));
            userInteractingRef.current = false;
            scheduleAutoSpinResume(2000);
          });
        },

        onPanResponderTerminate: () => {
          const snapped = nearestSnapAngle(
            currentRotationRef.current,
            angleStep
          );
          Animated.spring(rotationAnim, {
            toValue: snapped,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }).start(() => {
            const nextActive = indexFromRotation(snapped, angleStep, itemCount);
            setActiveIndex(prev => (prev === nextActive ? prev : nextActive));
            userInteractingRef.current = false;
            scheduleAutoSpinResume(2000);
          });
        },
      }),
    [angleStep, itemCount, rotationAnim]
  );

  const handleSelect = (index: number) => {
    if (!items[index]) return;
    onSelect(items[index]);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType='none'
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayTouch} />
        </TouchableWithoutFeedback>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.dialWrap,
            {
              width: DIAL_SIZE,
              height: DIAL_SIZE,
              opacity: dialOpacity,
              transform: [
                { translateX: dialTranslateX },
                { translateY: dialTranslateY },
                { scale: dialScale },
              ],
            },
          ]}
        >
          <View style={styles.pointer} />

          <Animated.View
            style={[styles.orbit, { transform: [{ rotate: rotationToDeg }] }]}
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.itemPress,
                    {
                      width: ITEM_SIZE,
                      height: ITEM_SIZE,
                      start: DIAL_RADIUS - ITEM_HALF,
                      top: DIAL_RADIUS - ITEM_HALF,
                      transform: [
                        { rotate: `${index * angleStep}deg` },
                        { translateY: -ORBIT_RADIUS },
                      ],
                    },
                  ]}
                  onPress={() => handleSelect(index)}
                >
                  <Animated.View
                    style={{
                      transform: [
                        { rotate: `${-index * angleStep}deg` },
                        { rotate: rotationToDegInverse },
                      ],
                    }}
                  >
                    <DialOrbitItem item={item} isActive={isActive} />
                  </Animated.View>
                </Pressable>
              );
            })}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlayTouch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  dialWrap: {
    position: 'absolute',
  },
  orbit: {
    ...StyleSheet.absoluteFillObject,
  },
  pointer: {
    position: 'absolute',
    top: 14,
    start: DIAL_RADIUS - 10,
    width: 20,
    height: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: BTHWANI_COLORS.accent,
    shadowColor: BTHWANI_COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  itemPress: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 6,
  },
  iconSolo: {
    width: 52,
    height: 52,
  },
  iconEmoji: {
    fontSize: 32,
    marginBottom: 2,
  },
  itemTitleContainer: {
    backgroundColor: BTHWANI_COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 2,
    minWidth: 50,
  },
  itemTitleContainerActive: {
    backgroundColor: BTHWANI_COLORS.navyDark,
  },
  itemTitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  itemTitleActive: {
    color: '#FFFFFF',
  },
});
