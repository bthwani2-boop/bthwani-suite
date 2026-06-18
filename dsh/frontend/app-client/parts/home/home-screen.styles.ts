import { StyleSheet } from 'react-native';
import { colorPalette, withAlpha, resolveRowDirection, resolveTextAlign, type Direction, spacing, shadowPresets,
  radius,
  typographyRoles,
} from '@bthwani/ui-kit';
import { useTheme } from '@bthwani/ui-kit';

export function buildHomeScreenStyles(direction: Direction, theme: ReturnType<typeof useTheme>['theme']) {
  const rowDirection = resolveRowDirection(direction);
  const textAlign = resolveTextAlign(direction);

  return StyleSheet.create({
    screenRoot: {
      flex: 1,
      backgroundColor: theme.background,
      position: 'relative',
    },
    brandTopBarShell: {
      marginTop: spacing[0],
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'visible',
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      paddingHorizontal: spacing[4],
      backgroundColor: theme.brand,
      borderWidth: 0,
      borderColor: 'transparent',
      ...shadowPresets.overlay,
      borderBottomWidth: 1,
      borderBottomColor: theme.brandHeaderStroke,
    },
    premiumBannerSection: {
      marginTop: spacing[0],
      marginBottom: 0,
      paddingHorizontal: 0,
      alignSelf: 'stretch',
    },
    premiumBannerScrollContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumBannerCard: {
      borderRadius: radius.xl,
      overflow: 'hidden',
      backgroundColor: theme.surfaceRaised,
      ...shadowPresets.raised,
    },
    premiumBannerCardActive: {
      borderColor: withAlpha(colorPalette.white, 0.2),
      borderWidth: 1,
      ...shadowPresets.overlay,
    },
    premiumBannerImageWrap: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.surfaceRaised,
    },
    premiumBannerImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      zIndex: 2,
    },
    premiumBannerOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 3,
    },
    bannerBrandAccentLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '36%',
      backgroundColor: withAlpha(colorPalette.white, 0.08),
      zIndex: 3,
    },
    premiumBannerBottomShade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '54%',
      backgroundColor: withAlpha(colorPalette.black, 0.4),
      zIndex: 3,
    },
    premiumBannerLogoWrap: {
      position: 'absolute',
      top: 12,
      width: 32,
      height: 32,
      borderRadius: radius.md2,
      backgroundColor: colorPalette.white,
      padding: 3,
      elevation: 6,
      zIndex: 5,
    },
    premiumBannerLogo: {
      width: '100%',
      height: '100%',
    },
    premiumBannerBadge: {
      position: 'absolute',
      top: 14,
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: radius.pill,
      elevation: 6,
      zIndex: 5,
    },
    premiumBannerBadgeText: {
      color: colorPalette.white,
      fontSize: typographyRoles.overline.fontSize,
    },
    premiumBannerContent: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: spacing[10],
      paddingBottom: 14,
      zIndex: 4,
      justifyContent: 'flex-end',
    },
    premiumBannerTitle: {
      color: colorPalette.white,
      fontSize: typographyRoles.bodyLg.fontSize,
      textShadowColor: withAlpha(colorPalette.black, 0.4),
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      lineHeight: typographyRoles.bodySm.lineHeight,
      textAlign,
    },
    premiumBannerSubtitle: {
      color: withAlpha(colorPalette.white, 0.95),
      fontSize: 10,
      marginTop: 3,
      textShadowColor: withAlpha(colorPalette.black, 0.3),
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      lineHeight: 13,
      textAlign,
    },
    premiumBannerCta: {
      marginTop: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: 6,
      borderRadius: radius.pill,
      alignSelf: 'flex-start',
      elevation: 5,
      zIndex: 5,
    },
    premiumBannerCtaText: {
      fontSize: 10,
    },
    premiumCarouselControls: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    premiumCarouselControlsRtl: {
      flexDirection: 'row-reverse',
    },
    premiumIndicatorRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      backgroundColor: withAlpha(colorPalette.black, 0.3),
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
      borderRadius: radius.pill,
    },
    premiumIndicator: {
      width: 5,
      height: 5,
      borderRadius: radius.pill,
      backgroundColor: withAlpha(colorPalette.white, 0.4),
    },
    premiumIndicatorActive: {
      width: 18,
      height: 6,
      backgroundColor: colorPalette.white,
    },
    premiumPauseBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: withAlpha(colorPalette.black, 0.4),
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesSelectorSection: {
      marginBottom: spacing[1], // Reduced from spacing[2]
    },
    categoriesSelectorRow: {
      flexDirection: rowDirection,
      alignItems: 'flex-start',
      gap: spacing[1], // Further reduced to minimize space as requested
    },
    fixedIconsContainer: {
      flexDirection: rowDirection,
      alignItems: 'flex-start',
      gap: spacing[2],
      flexShrink: 0,
    },
    categorySelectorCard: {
      alignItems: 'center',
      gap: spacing[1],
    },
    videoIconContainer: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.line,
    },
    categoryNameContainer: {
      alignItems: 'center',
      minHeight: 18,
    },
    categoryName: {
      color: theme.text,
      fontSize: typographyRoles.overline.fontSize,
      textAlign: 'center',
    },
    categoryIconContainer: {
      width: 56,
      height: 56,
      borderRadius: radius.lg2, // More premium rounded corner
      backgroundColor: theme.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 0.5,
      borderColor: withAlpha(colorPalette.black, 0.05),
      ...shadowPresets.raised,
    },
    categoryIconContainerSelected: {
      backgroundColor: theme.brandSurface,
      borderColor: theme.brand,
      borderWidth: 1.5,
    },
    categoryHubIconContainer: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.line,
    },
    categoryIconImage: {
      width: 32,
      height: 32,
    },
    categoryNameContainerSelected: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    heroPromoCard: {
      flex: 1.6,
      height: 74, // Matches the height of CategorySelectorItem (56 icon + 4 gap + 14 text)
      borderRadius: radius.lg,
      backgroundColor: theme.surfaceInset,
      borderWidth: 1,
      borderColor: theme.line,
      paddingHorizontal: spacing[3],
      justifyContent: 'center',
      overflow: 'hidden',
      ...shadowPresets.raised,
    },
    heroPromoBackground: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      opacity: 0.03,
    },
    heroPromoContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      zIndex: 2,
    },
    heroPromoIconContainer: {
      width: 44,
      height: 44,
      borderRadius: radius.sm2,
      backgroundColor: withAlpha(colorPalette.warning, 0.08),
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroPromoMascot: {
      width: 36,
      height: 36,
    },
    heroPromoTextWrap: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 1, // Tight vertical spacing to prevent distortion
    },
    heroPromoTitle: {
      color: theme.brand,
      fontSize: typographyRoles.bodyMd.fontSize, // Slightly larger for prominence
      lineHeight: typographyRoles.titleSm.lineHeight,
      textAlign: 'right',
    },
    heroPromoSubtitle: {
      color: theme.textMuted,
      fontSize: 9,
      marginTop: 0,
      textAlign: 'right',
      marginBottom: 2,
    },
    heroPromoCtaButton: {
      backgroundColor: colorPalette.brand,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[2],
      paddingVertical: 3,
      height: 22, // Fixed height for consistency
      borderRadius: radius.xs2,
      gap: 3,
    },
    heroPromoCtaText: {
      color: colorPalette.white,
      fontSize: 9,
    },
    heroPagerRow: {
      marginTop: spacing[1],
      alignItems: 'center',
    },
    heroPagerActive: {
      width: 12,
      height: 3,
      borderRadius: 2,
      backgroundColor: withAlpha(colorPalette.white, 0.3),
    },
    categoriesSelectorScroll: {
      flex: 1,
    },
    categoriesSelectorScrollContent: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: spacing[2],
    },
    subcategorySelectorCard: {
      flexDirection: rowDirection,
      alignItems: 'center',
      backgroundColor: theme.surfaceInset,
      borderRadius: radius.pill,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      gap: 6,
      borderWidth: 1,
      borderColor: theme.line,
    },
    subcategorySelectorCardActive: {
      backgroundColor: theme.brand,
      borderColor: theme.brand,
    },
    subcategoryIconContainer: {
      width: 32,
      height: 32,
      borderRadius: radius.md2,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subcategoryEmoji: {
      fontSize: typographyRoles.bodySm.fontSize,
    },
    subcategoryName: {
      color: theme.text,
      fontSize: typographyRoles.caption.fontSize,
    },
    subcategoryNameActive: {
      color: theme.textInverse,
    },
    filtersRail: {
      marginHorizontal: -spacing[3],
      paddingHorizontal: spacing[3],
      paddingTop: 0, // Removed top padding
      paddingBottom: spacing[2], // Reduced from spacing[3]
    },
    filterChipIcon: {
      width: 16,
      height: 16,
    },
    storeListViewport: {
      marginTop: 0, // Removed top margin for direct transition
      flex: 1,
    },
    storeListContent: {
      gap: spacing[1], // Adjusted to 4px for a clean, tight distance between cards
      paddingBottom: spacing[8],
    },
    emptyFeed: {
      borderRadius: radius.xl,
      backgroundColor: theme.surface,
      padding: spacing[8],
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[3],
      borderWidth: 1,
      borderColor: theme.line,
    },
    emptyFeedEmoji: {
      fontSize: 48,
    },
    emptyFeedTitle: {
      color: theme.text,
      textAlign: 'center',
    },
    emptyFeedText: {
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: typographyRoles.bodySm.lineHeight,
    },
    storeListCard: {
      width: '100%',
    },
  });
}
