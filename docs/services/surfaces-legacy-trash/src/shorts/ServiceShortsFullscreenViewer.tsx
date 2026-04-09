/**
 * Service Shorts — fullscreen vertical viewer (Execution Spec Phase 1).
 * Vertical swipe between items; poster (video Phase 2); one CTA, mute, close; return on close.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import type { ServiceShortItem } from '@bthwani/domain-types';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { resolveDevShortVideoUrl } from '../config';
import type { ShortsAnalyticsEventName } from './constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type HitSlopBox = { top: number; bottom: number } & Record<string, number>;
const HIT_SLOP_SYMMETRIC: HitSlopBox = Object.fromEntries([
  ['top', 12],
  ['bottom', 12],
  ['left', 12],
  ['right', 12],
]) as HitSlopBox;

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function resolvePosterUrl(poster_url: string): string {
  if (isAbsoluteUrl(poster_url)) return poster_url;
  return resolveDevShortVideoUrl(poster_url) || poster_url;
}

function getCtaLabel(
  short: ServiceShortItem,
  lang: 'ar' | 'en',
  fallback: string
): string {
  const cta = short.cta;
  if (lang === 'ar' && cta.label_ar) return cta.label_ar;
  if (cta.label_en) return cta.label_en;
  return fallback;
}

export interface ServiceShortsFullscreenViewerProps {
  visible: boolean;
  items: ServiceShortItem[];
  initialIndex: number;
  onClose: () => void;
  onCtaPress: (short: ServiceShortItem) => void;
  /** Optional: current language for CTA label (ar/en). */
  language?: 'ar' | 'en';
  /** Optional: placement_id for analytics. */
  placementId?: string;
  /** Optional: analytics callback (Execution Spec §5). */
  onAnalyticsEvent?: (
    eventName: ShortsAnalyticsEventName,
    dimensions?: Record<string, unknown>
  ) => void;
}

export const ServiceShortsFullscreenViewer: React.FC<
  ServiceShortsFullscreenViewerProps
> = ({
  visible,
  items,
  initialIndex,
  onClose,
  onCtaPress,
  language = 'ar',
  placementId,
  onAnalyticsEvent,
}) => {
  const { t, isRTL } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const listRef = useRef<FlatList>(null);
  const openedOnceRef = useRef(false);

  const safeIndex = Math.min(
    Math.max(0, initialIndex),
    Math.max(0, items.length - 1)
  );

  useEffect(() => {
    if (visible) {
      setCurrentIndex(safeIndex);
      if (!openedOnceRef.current) {
        openedOnceRef.current = true;
        const short = items[safeIndex];
        if (short) {
          onAnalyticsEvent?.('shorts_open', {
            short_id: short.id,
            service: short.service,
            placement: placementId,
          });
        }
      }
    } else {
      openedOnceRef.current = false;
    }
  }, [visible, safeIndex, items, placementId, onAnalyticsEvent]);

  const handleClose = () => {
    onAnalyticsEvent?.('shorts_exit', { placement: placementId });
    onClose();
  };

  const handleCtaPress = (short: ServiceShortItem) => {
    onAnalyticsEvent?.('shorts_cta_click', {
      short_id: short.id,
      service: short.service,
      placement: placementId,
    });
    onCtaPress(short);
  };

  const handleMuteToggle = () => {
    setMuted(m => {
      onAnalyticsEvent?.('shorts_mute_toggle', { muted: !m });
      return !m;
    });
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const idx = viewableItems[0]?.index;
      if (idx != null) setCurrentIndex(idx);
    }
  ).current;
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 80,
  }).current;

  if (!visible) return null;

  const hasItems = items.length > 0;

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {hasItems ? (
          <FlatList
            ref={listRef}
            data={items}
            keyExtractor={item => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            initialScrollIndex={Math.min(safeIndex, items.length - 1)}
            getItemLayout={(_, index) => ({
              length: SCREEN_HEIGHT,
              offset: SCREEN_HEIGHT * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image
                  source={{ uri: resolvePosterUrl(item.poster_url) }}
                  style={styles.poster}
                  resizeMode='cover'
                />
                <View style={styles.overlay}>
                  <View style={styles.topBar}>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.iconButton}
                      hitSlop={HIT_SLOP_SYMMETRIC}
                      accessibilityLabel={t('marketing.shorts_viewer_close')}
                      accessibilityRole='button'
                    >
                      <Text style={styles.iconText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleMuteToggle}
                      style={styles.iconButton}
                      hitSlop={HIT_SLOP_SYMMETRIC}
                      accessibilityLabel={
                        muted
                          ? t('marketing.shorts_viewer_unmute')
                          : t('marketing.shorts_viewer_mute')
                      }
                      accessibilityRole='button'
                    >
                      <Text style={styles.iconText}>{muted ? '🔇' : '🔊'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomBar}>
                    <View style={styles.bottomBarOverlay}>
                      <Text style={styles.slideTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.ctaButton}
                        onPress={() => handleCtaPress(item)}
                        accessibilityLabel={getCtaLabel(
                          item,
                          language,
                          t('marketing.shorts_cta_go')
                        )}
                        accessibilityRole='button'
                      >
                        <Text style={styles.ctaText}>
                          {getCtaLabel(
                            item,
                            language,
                            t('marketing.shorts_cta_go')
                          )}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.empty}>
            <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
              <Text style={styles.iconText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasItems && items.length > 1 ? (
          <View
            style={[
              styles.progressDots,
              isRTL ? styles.progressDotsRTL : styles.progressDotsLTR,
            ]}
            pointerEvents='none'
          >
            {items.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.onPrimaryContainer,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 80,
    paddingHorizontal: BTHWANI_SPACING.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BTHWANI_COLORS.surfaceOverlay40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: BTHWANI_COLORS.surface,
  },
  bottomBar: {
    paddingBottom: 0,
  },
  bottomBarOverlay: {
    backgroundColor: BTHWANI_COLORS.overlay60,
    paddingHorizontal: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    gap: BTHWANI_SPACING.md,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
    textShadowColor: BTHWANI_COLORS.surfaceOverlay40,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ctaButton: {
    alignSelf: 'stretch',
    backgroundColor: semanticRoles.primary,
    paddingHorizontal: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  progressDots: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 20,
    flexDirection: 'column',
    gap: 8,
  },
  progressDotsLTR: Object.fromEntries([
    ['right', BTHWANI_SPACING.md],
  ]) as Record<string, number>,
  progressDotsRTL: Object.fromEntries([['left', BTHWANI_SPACING.md]]) as Record<
    string,
    number
  >,
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BTHWANI_COLORS.surfaceOverlay40,
  },
  dotActive: {
    backgroundColor: BTHWANI_COLORS.surface,
    transform: [{ scale: 1.2 }],
  },
  empty: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: BTHWANI_SPACING.lg,
  },
});
