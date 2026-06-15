'use client';

// Authority: control-panel/marketing — banner live preview component.
// Extracted from BannersCommandDeckScreen (inner component) as part of Giant Screen split.
// Owns its own styles via createStyles(theme).

import React from 'react';
import { Image, StyleSheet, View, type ImageStyle, type ViewStyle } from 'react-native';
import { Box, Text, shadowPresets, useTheme,
  radius,
} from '@bthwani/ui-kit';
import { resolveDshColorToken } from '../../shared';
import { resolveDshImageSource } from '../../shared/media/resolve-dsh-image-source';
import { BANNER_MOTION_OPTIONS } from './banner-types';
import type { BannerDraft, BannerTemplate } from './banner-types';

export type BannerViewerProps = {
  draft: BannerDraft;
  templates: ReadonlyArray<Pick<BannerTemplate, 'id' | 'label'>>;
};

export function BannerViewer({ draft, templates }: BannerViewerProps) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const resolvedAccentColor = resolveDshColorToken(draft.accentColor || theme.brandHeaderBackground);
  const resolvedBadgeColor = resolveDshColorToken(draft.offerBadgeColor || theme.brand);
  const previewMotionLabel = BANNER_MOTION_OPTIONS.find((o) => o.value === draft.motionStyle)?.label ?? 'انسياب';

  return (
    <View style={styles.previewContainer}>
      <View style={StyleSheet.flatten([styles.bannerBase, { backgroundColor: resolvedAccentColor }])}>
        {draft.imageUrl || draft.mediaKey ? (
          <Image
            source={resolveDshImageSource(draft.imageUrl || draft.mediaKey)}
            style={styles.bannerImage as ImageStyle}
            resizeMode={draft.imageFit}
          />
        ) : (
          <View
            style={[
              styles.bannerImageLayer as ViewStyle,
              { backgroundColor: resolvedAccentColor, justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={{ fontSize: 40 }}>
              {templates.find((t) => t.id === draft.templateId)?.label.slice(0, 1) || 'ب'}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.bannerOverlay,
            {
              backgroundColor:
                draft.motionStyle === 'subtle-fade'
                  ? theme.overlay
                  : draft.motionStyle === 'soft-parallax'
                    ? theme.overlaySoft
                    : `${resolvedAccentColor}44`,
            },
          ]}
        />
        <View style={styles.bannerShadeTop} />
        <View style={styles.bannerShadeBottom} />

        {/* Content Layout */}
        <View
          style={StyleSheet.flatten([
            styles.bannerContent,
            draft.titlePlacement === 'top' && { justifyContent: 'flex-start' },
            draft.titlePlacement === 'center' && { justifyContent: 'center' },
          ])}
        >
          <Box gap={1}>
            {draft.partnerName ? <Text weight="black" style={styles.bannerPartner}>{draft.partnerName}</Text> : null}
            <Text weight="black" style={styles.bannerTitle} numberOfLines={1}>{draft.title || 'عنوان البنر'}</Text>
            <Text weight="bold" style={styles.bannerSubtitle} numberOfLines={2}>{draft.subtitle || 'أضف وصفاً جذاباً هنا'}</Text>
          </Box>
          <View style={StyleSheet.flatten([styles.bannerCta, { backgroundColor: theme.surface }])}>
            <Text weight="black" style={StyleSheet.flatten([styles.bannerCtaText, { color: resolvedAccentColor }])}>
              {draft.ctaLabel}
            </Text>
          </View>
        </View>

        {/* Offer Badge */}
        {draft.offerBadgeText ? (
          <View
            style={StyleSheet.flatten([
              styles.bannerBadge,
              { backgroundColor: resolvedBadgeColor },
              draft.offerBadgePosition === 'top-left' ? { left: 20, top: 20 } : { right: 20, top: 20 },
            ])}
          >
            <Text weight="black" style={styles.bannerBadgeText}>{draft.offerBadgeText}</Text>
          </View>
        ) : null}

        {/* Partner Logo */}
        {draft.partnerLogoUrl ? (
          <View
            style={StyleSheet.flatten([
              styles.partnerLogoWrap,
              draft.partnerLogoPosition === 'top-left' && { top: 20, left: 20 },
              draft.partnerLogoPosition === 'top-right' && { top: 20, right: 20 },
              draft.partnerLogoPosition === 'bottom-left' && { bottom: 20, left: 20 },
              draft.partnerLogoPosition === 'bottom-right' && { bottom: 20, right: 20 },
            ])}
          >
            <Image
              source={resolveDshImageSource(draft.partnerLogoUrl)}
              style={styles.partnerLogo as ImageStyle}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>

      {/* Motion Meta */}
      <View style={styles.previewMetaRow}>
        <View style={styles.previewMetaPill}>
          <Text role="caption" weight="black" style={styles.previewMetaText}>{previewMotionLabel}</Text>
        </View>
        <View style={styles.previewMetaPill}>
          <Text role="caption" weight="black" style={styles.previewMetaText}>
            {draft.autoplayEnabled ? `تشغيل تلقائي ${draft.autoplayIntervalMs}ms` : 'تشغيل يدوي'}
          </Text>
        </View>
      </View>
      <Text role="caption" tone="muted" weight="black" style={{ marginTop: 10, textAlign: 'center' }}>
        معاينة حية مضغوطة
      </Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    previewContainer: {
      width: 288,
      alignSelf: 'center',
    },
    bannerBase: {
      width: 288,
      height: 300,
      borderRadius: radius.xl,
      overflow: 'hidden',
      position: 'relative',
      ...shadowPresets.overlay,
      shadowColor: theme.overlay,
    },
    bannerImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    } as ImageStyle,
    bannerImageLayer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    } as ViewStyle,
    bannerOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    bannerShadeTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '46%',
      backgroundColor: theme.brandHeaderSurfaceStrong,
    },
    bannerShadeBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '58%',
      backgroundColor: theme.overlaySoft,
    },
    bannerContent: {
      flex: 1,
      padding: 18,
      justifyContent: 'flex-end',
    },
    bannerPartner: {
      color: theme.brandContrast,
      fontSize: 11,
      opacity: 0.9,
      textShadowColor: theme.overlay,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    bannerTitle: {
      color: theme.brandContrast,
      fontSize: 22,
      textShadowColor: theme.overlay,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    bannerSubtitle: {
      color: theme.brandContrast,
      fontSize: 12,
      marginTop: 4,
    },
    bannerCta: {
      marginTop: 14,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: radius.pill,
      alignSelf: 'flex-start',
      elevation: 4,
    },
    bannerCtaText: {
      fontSize: 11,
      },
    bannerBadge: {
      position: 'absolute',
      top: 16,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      elevation: 5,
    },
    bannerBadgeText: {
      color: theme.brandContrast,
      fontSize: 10,
      },
    partnerLogoWrap: {
      position: 'absolute',
      width: 38,
      height: 38,
      borderRadius: radius.pill,
      backgroundColor: theme.surface,
      padding: 5,
      ...shadowPresets.raised,
      shadowColor: theme.overlay,
    },
    partnerLogo: {
      width: '100%',
      height: '100%',
    },
    previewMetaRow: {
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      marginTop: 12,
      flexWrap: 'wrap',
    },
    previewMetaPill: {
      borderRadius: radius.pill,
      backgroundColor: theme.infoSurface,
      borderWidth: 1,
      borderColor: theme.info,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    previewMetaText: {
      color: theme.brandHeaderBackground,
      },
  });
}
