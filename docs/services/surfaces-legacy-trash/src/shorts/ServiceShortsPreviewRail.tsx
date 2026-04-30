/**
 * Service Shorts — horizontal preview rail (Execution Spec Phase 1).
 * Poster + title + optional badge; no autoplay; tap opens fullscreen viewer.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import type { ServiceShortItem } from '@bthwani/domain-types';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import type { ShortsAnalyticsEventName } from './constants';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { resolveDevShortVideoUrl } from '../config';

const CARD_WIDTH = 140;
const CARD_ASPECT = 9 / 16;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT;
const CARD_GAP = BTHWANI_SPACING.sm;
const RAIL_TITLE_HEIGHT = 28;

export type ShortsRailState = 'loading' | 'empty' | 'error' | 'content';

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function resolvePosterUrl(poster_url: string): string {
  if (isAbsoluteUrl(poster_url)) return poster_url;
  return resolveDevShortVideoUrl(poster_url) || poster_url;
}

export interface ServiceShortsPreviewRailProps {
  items: ServiceShortItem[];
  state: ShortsRailState;
  sectionTitle?: string;
  /** Optional: placement_id for analytics (e.g. dsh_home_below_hero). */
  placementId?: string;
  /** Optional: analytics callback (Execution Spec §5). */
  onAnalyticsEvent?: (
    eventName: ShortsAnalyticsEventName,
    dimensions?: Record<string, unknown>
  ) => void;
  onCardPress: (item: ServiceShortItem, index: number) => void;
}

export const ServiceShortsPreviewRail: React.FC<
  ServiceShortsPreviewRailProps
> = ({
  items,
  state,
  sectionTitle,
  placementId,
  onAnalyticsEvent,
  onCardPress,
}) => {
  const { width: winWidth } = useWindowDimensions();
  const { isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);

  if (state === 'empty' || state === 'error') {
    return null;
  }

  if (state === 'loading') {
    return (
      <View style={styles.railContainer}>
        {sectionTitle ? (
          <Text style={styles.sectionTitle} numberOfLines={1}>
            {sectionTitle}
          </Text>
        ) : null}
        <View
          style={[
            styles.loadingRow,
            { flexDirection: 'row', direction: layoutDirection },
          ]}
        >
          {[1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.cardSkeleton,
                { width: CARD_WIDTH, height: CARD_HEIGHT },
              ]}
            />
          ))}
          <ActivityIndicator
            size='small'
            color={semanticRoles.primary}
            style={styles.loader}
          />
        </View>
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.railContainer}>
      {sectionTitle ? (
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {sectionTitle}
        </Text>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.cardTouchable}
            onPress={() => {
              onAnalyticsEvent?.('shorts_preview_tap', {
                short_id: item.id,
                service: item.service,
                placement: placementId,
              });
              onCardPress(item, index);
            }}
            accessibilityLabel={item.title}
            accessibilityRole='button'
          >
            <View style={styles.card}>
              <Image
                source={{ uri: resolvePosterUrl(item.poster_url) }}
                style={styles.poster}
                resizeMode='cover'
              />
              {item.campaign_badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {item.campaign_badge}
                  </Text>
                </View>
              ) : null}
              <View style={styles.titleOverlay}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  railContainer: {
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: CARD_GAP,
  },
  cardSkeleton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  loader: {
    marginStart: BTHWANI_SPACING.sm,
  },
  flatListContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingEnd: BTHWANI_SPACING.contentH + 8,
  },
  cardTouchable: {
    width: CARD_WIDTH,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  badge: {
    position: 'absolute',
    top: BTHWANI_SPACING.xs,
    start: BTHWANI_SPACING.xs,
    backgroundColor: 'BTHWANI_COLORS.overlay60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
    maxWidth: CARD_WIDTH - 12,
  },
  badgeText: {
    fontSize: 10,
    color: BTHWANI_COLORS.surface,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    padding: BTHWANI_SPACING.xs,
    backgroundColor: 'BTHWANI_COLORS.overlay',
  },
  cardTitle: {
    fontSize: 12,
    color: BTHWANI_COLORS.surface,
    fontWeight: '500',
  },
});
