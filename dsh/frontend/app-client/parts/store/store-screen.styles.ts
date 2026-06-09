import { StyleSheet, Platform } from 'react-native';
import { colorPalette } from '@bthwani/ui-kit';

function hexToRgba(hex: string, opacity: number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const stylesTokens = {
  orange: colorPalette.brand,
  orangeSoft: colorPalette.brandSurface,
  orangeBorder: colorPalette.brandStrong,
  brandSoft: colorPalette.brandSoft,
  white: colorPalette.white,
  dark: colorPalette.ink,
  muted: colorPalette.inkMuted,
  light: colorPalette.surfaceAlt,
  line: colorPalette.line,
  lineStrong: colorPalette.lineStrong,
  chip: colorPalette.surfaceInset,
  chipText: colorPalette.inkMuted,
  green: colorPalette.success,
  blue: colorPalette.infoStrong,
  infoSurface: colorPalette.infoSoft,
  infoBorder: colorPalette.info,
  infoText: colorPalette.infoStrong,
  warning: colorPalette.warning,
  warningSurface: colorPalette.warningSoft,
  warningText: colorPalette.warningStrong,
  red: colorPalette.danger,
  black: colorPalette.black,
  overlaySoft: hexToRgba(colorPalette.brandStrong, 0.06),
  overlayDense: hexToRgba(colorPalette.brandStrong, 0.42),
  overlay: colorPalette.overlay,
  whiteOverlay: hexToRgba(colorPalette.white, 0.96),
};

const DARK_BLUE = stylesTokens.blue;
const ORANGE = stylesTokens.orange;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colorPalette.pageBackground,
  },
  blockingState: {
    flex: 1,
    backgroundColor: colorPalette.pageBackground,
    justifyContent: 'center',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textAlignRight: {
    textAlign: 'right',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: colorPalette.brandSurface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowColor: colorPalette.brandStrong,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // PREMIUM HERO 2026
  heroPremiumWrap: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  heroCoverWrap: {
    height: 480,
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: stylesTokens.dark,
  },
  heroCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 32,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  heroTopActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroActionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  stickyHeaderContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  stickyHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  heroLuxuryCard: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
    gap: 16,
  },
  heroLuxuryIdentityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  heroLuxuryInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  heroLuxuryMetricsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricsRowReverseFeather: {
    position: 'absolute',
    top: -16,
    bottom: -32,
    left: -32,
    right: -32,
    zIndex: -1,
  },
  metricsRowReverseFeatherBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  heroLuxuryDeliveryRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 4,
    borderRadius: 16,
    gap: 4,
  },
  heroLuxuryDeliveryChip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLuxuryDeliveryContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  heroLuxuryDeliveryTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroLogoWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: stylesTokens.white,
    borderWidth: 2,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heroNameText: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  heroLocationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  heroLocationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  heroStatusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
    marginTop: 4,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroStatusText: {
    fontSize: 10.5,
    fontWeight: '900',
  },
  heroFeatureChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    minHeight: 32,
  },
  heroFeatureValue: {
    fontSize: 12,
    fontWeight: '800',
    color: stylesTokens.white,
  },
  heroBadgePro: {
    backgroundColor: DARK_BLUE,
    borderColor: 'transparent',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: stylesTokens.white,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  storeStateNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 14,
    marginTop: 4,
  },
  storeStateNoticeWarning: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    borderColor: 'rgba(255, 149, 0, 0.25)',
  },
  storeStateNoticeDanger: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderColor: 'rgba(255, 59, 48, 0.25)',
  },
  storeStateNoticeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeStateNoticeCopy: {
    flex: 1,
    gap: 2,
    alignItems: 'flex-end',
  },
  storeStateNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  storeStateNoticeDescription: {
    color: stylesTokens.muted,
    fontSize: 11.5,
    lineHeight: 17,
  },
  storeStateNoticeAction: {
    paddingHorizontal: 8,
    alignSelf: 'stretch',
  },
  storeStateNoticeActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contentBlock: {
    width: '100%',
    overflow: 'hidden',
    marginTop: -140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  smartRailSection: {
    marginTop: 12,
    marginBottom: -6,
  },
  modePill: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: stylesTokens.white,
    borderColor: stylesTokens.orange,
  },
  modePillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modePillInnerActive: {
    flexDirection: 'row',
  },
  modePillLabel: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '700',
  },
  modePillLabelActive: {
    color: stylesTokens.orange,
  },

  sectionBlock: {
    marginTop: 0,
    paddingHorizontal: 12,
    width: '100%',
  },
  feedSection: {
    flex: 1,
    minHeight: 0,
  },
  feedList: {
    flex: 1,
  },
  stickyCategoriesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 110,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    elevation: 8,
    shadowColor: stylesTokens.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  stickyCategoriesContent: {
    width: '100%',
  },

  menuActionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuActionPlusBadge: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: stylesTokens.white,
    borderWidth: 1,
    borderColor: colorPalette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: stylesTokens.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  previewWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: stylesTokens.white,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  previewImageWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: stylesTokens.light,
  },
  previewSwipeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  previewImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewPartnerBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: stylesTokens.orange,
    borderWidth: 2,
    borderColor: stylesTokens.white,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  previewPartnerBadgeImageContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: stylesTokens.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPartnerBadgeImage: {
    width: '100%',
    height: '100%',
  },
  previewEmoji: {
    position: 'absolute',
    top: 36,
    right: 36,
    fontSize: 72,
    zIndex: 2,
    opacity: 0.18,
  },
  previewDetailsBox: {
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.black,
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 8,
      },
    }),
  },
  previewDetailsContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  previewDetailsContentRTL: {
    alignItems: 'flex-end',
  },
  previewDetailsTitle: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  previewStoreName: {
    color: stylesTokens.orange,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 2,
  },
  previewDetailsSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11,
    marginBottom: 0,
  },
  previewDetailsDiscount: {
    color: stylesTokens.red,
    fontSize: 12,
    fontWeight: '900',
  },
  previewDetailsPrice: {
    color: stylesTokens.dark,
    fontSize: 14,
    fontWeight: '900',
  },
  previewFavoriteCircle: {
    width: 44,
    height: 44,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: stylesTokens.orange,
  },
  previewDetailsFavoriteButton: {
    zIndex: 12,
  },
  previewActionButton: {
    width: 44,
    height: 44,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: stylesTokens.orange,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  previewActionPlusBadge: {
    position: 'absolute',
    top: -3,
    left: -5,
    backgroundColor: stylesTokens.white,
    borderRadius: 5,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewDetailsMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  emptyFeed: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 18,
    backgroundColor: stylesTokens.light,
    marginHorizontal: 12,
  },
  emptyFeedEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyFeedTitle: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyFeedText: {
    marginTop: 4,
    color: stylesTokens.muted,
    fontSize: 12,
    textAlign: 'center',
  },

  cbContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cbImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cbMilkyWash: {
    ...StyleSheet.absoluteFillObject,
  },
});
