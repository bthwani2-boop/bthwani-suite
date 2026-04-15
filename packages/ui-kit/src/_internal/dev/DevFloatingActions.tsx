import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  DevSettings,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BthPortalLayer } from '../../root/core/BthPortalHost';
import type { BthLanguage } from '../../foundation/direction';
import { useDirection } from '../../hooks';
import { resolveRowDirection } from '../../foundation/direction';

function getNextLanguage(language: BthLanguage | undefined): BthLanguage {
  return language === 'ar' ? 'en' : 'ar';
}

export const DevFloatingActions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, direction } = useDirection();
  const rowDirection = resolveRowDirection(direction);
  const pan = useRef(new Animated.ValueXY()).current;

  const nextLanguage = getNextLanguage(language);
  const nextLanguageLabel = nextLanguage === 'en' ? 'AR -> EN' : 'EN -> AR';

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
        onPanResponderGrant: () => {
          pan.extractOffset();
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        },
        onPanResponderTerminate: () => {
          pan.flattenOffset();
        },
      }),
    [pan]
  );

  const requestReload = () => {
    setOpen(false);
    if (Platform.OS !== 'web' && typeof DevSettings.reload === 'function') {
      // native reload
      // @ts-ignore - DevSettings may be typed differently across RN versions
      DevSettings.reload();
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleLanguageToggle = async () => {
    setOpen(false);
    try {
      setLanguage(getNextLanguage(language));
    } catch {
      // ignore
    }
    requestReload();
  };

  const content = (
    <Animated.View
      style={[styles.shell, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setOpen((current) => !current)}
          style={[styles.handle, { flexDirection: rowDirection }]}
        >
          <View style={styles.handleGrip}>
            <View style={styles.gripDot} />
            <View style={styles.gripDot} />
            <View style={styles.gripDot} />
          </View>
          <View style={styles.copyBlock}>
            <View style={[styles.badgeRow, { flexDirection: rowDirection }]}>
              <Text style={styles.devBadge}>DEV ONLY</Text>
              <Text style={styles.tempBadge}>TEMP</Text>
            </View>
            <Text style={styles.title}>{open ? 'Development Tools' : 'DEV'}</Text>
            <Text style={styles.subtitle}>Drag to move</Text>
          </View>
        </TouchableOpacity>

        {open ? (
          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={requestReload}
              style={styles.primaryAction}
            >
              <Text style={styles.primaryActionLabel}>Reload App</Text>
              <Text style={styles.primaryActionHint}>R</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                void handleLanguageToggle();
              }}
              style={styles.secondaryAction}
            >
              <Text style={styles.secondaryActionLabel}>{nextLanguageLabel}</Text>
              <Text style={styles.secondaryActionHint}>Language</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );

  return <BthPortalLayer fallback={content}>{content}</BthPortalLayer>;
};

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    right: 12,
    bottom: 96,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    minWidth: 156,
    maxWidth: 188,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
    backgroundColor: '#1f1300',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 12,
  },
  handle: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  handleGrip: {
    width: 28,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: '#432000',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  gripDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#fde68a',
  },
  copyBlock: {
    flex: 1,
  },
  badgeRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  devBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tempBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#f59e0b',
    color: '#1f1300',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    color: '#fff7ed',
    fontSize: 13,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: '#fdba74',
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  primaryAction: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#f59e0b',
  },
  primaryActionLabel: {
    color: '#1f1300',
    fontSize: 13,
    fontWeight: '800',
  },
  primaryActionHint: {
    marginTop: 2,
    color: '#78350f',
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryAction: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#fbbf24',
    backgroundColor: '#2b1900',
  },
  secondaryActionLabel: {
    color: '#fff7ed',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryActionHint: {
    marginTop: 2,
    color: '#fdba74',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default DevFloatingActions;
