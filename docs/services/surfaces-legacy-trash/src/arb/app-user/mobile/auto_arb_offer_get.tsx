// arb_offer_get — ARB_UX_SPEC_FINAL
// Surface: app-client | Service: arb
// CTA واحد "حجز الآن"، كاروسيل صور، تلخيص سياسة العربون والإلغاء

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ArbPrimaryCTA } from '../components';
import { resolveDevMediaUrl } from '../../../config';
import { buildArbOfferGetMock } from '../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 240;

interface auto_arb_offer_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string, params?: object) => void };
}

const getHeroImages = () => [
  resolveDevMediaUrl('products/arb/prod_0001.jpg') || '',
  resolveDevMediaUrl('products/general/prod_0002.jpg') || '',
  resolveDevMediaUrl('products/arb/prod_0003.jpg') || '',
].filter(Boolean);

export const auto_arb_offer_get: React.FC<auto_arb_offer_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = getHeroImages();

  const handleNavigate = (screen: string, params?: object) => {
    if (navigation?.navigate) (navigation.navigate as (s: string, p?: object) => void)(screen, params);
    else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    const loadOffer = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockSuccess = 0 > 0.1;
        if (!mockSuccess) setState('error');
        else setState('content');
      } catch {
        setState('error');
      }
    };
    loadOffer();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const offer = useMemo(() => buildArbOfferGetMock(t), [t]);

  const handleBook = () => {
    handleNavigate('ArbBookingCreate', { offerId: offer.id });
  };

  const getOfferStatus = () => {
    const now = new Date();
    const expiry = new Date(offer.offerDetails.expiryDate);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Using semantic tokens instead of raw hex colors (P1-2 fix)
    if (daysLeft > 3) return { status: 'active', color: semanticRoles.stateInfo.icon, text: t('arb.app-client.mobile.auto_arb_offer_get.active') };
    if (daysLeft > 0) return { status: 'urgent', color: semanticRoles.stateWarning.icon, text: t('arb.app-client.mobile.auto_arb_offer_get.urgent') };
    return { status: 'expired', color: semanticRoles.stateError.icon, text: t('arb.app-client.mobile.auto_arb_offer_get.expired') };
  };

  const offerStatus = getOfferStatus();

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (!Number.isNaN(index)) setHeroIndex(index);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* كاروسيل صور */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll}
            scrollEventThrottle={16}
            style={styles.heroCarousel}
          >
            {heroImages.length > 0 ? heroImages.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={[styles.heroImage, { width: SCREEN_WIDTH }]}
                resizeMode="cover"
              />
            )) : (
              <View style={[styles.heroImage, { width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', backgroundColor: semanticRoles.surfaceSubtle }]}>
                <Text style={{ fontSize: 48 }}>🖼️</Text>
              </View>
            )}
          </ScrollView>
          {heroImages.length > 1 && (
            <View style={styles.heroDots}>
              {heroImages.map((_, i) => (
                <View key={i} style={[styles.heroDot, i === heroIndex && styles.heroDotActive]} />
              ))}
            </View>
          )}

          {/* Offer Header */}
          <View style={styles.offerHeaderBar}>
            <View style={styles.offerHeaderLeft}>
              <Text style={styles.offerId}>{offer.id}</Text>
              <Text style={styles.title}>{offer.property.title}</Text>
            </View>
            <View style={[styles.offerStatusBadge, { backgroundColor: offerStatus.color }]}>
              <Text style={styles.offerStatusText}>{offerStatus.text}</Text>
            </View>
          </View>

          <View style={styles.propertyCard}>
            <View style={styles.propertyHeader}>
              <Text style={styles.propertyImage}>{offer.property.image}</Text>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{offer.property.title}</Text>
                <Text style={styles.propertyType}>{offer.property.type}</Text>
                <Text style={styles.propertyLocation}>📍 {offer.property.location}</Text>
              </View>
            </View>

            <View style={styles.propertyDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>السعر الأصلي:</Text>
                <Text style={styles.originalPrice}>{offer.property.price.toLocaleString()} {offer.property.currency}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>المساحة:</Text>
                <Text style={styles.detailValue}>{offer.property.area} م²</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الغرف:</Text>
                <Text style={styles.detailValue}>{offer.property.bedrooms} غرف</Text>
              </View>
            </View>
          </View>

          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_offer_get.sectionTitleOffer')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: offerStatus.color }]}>
                <Text style={styles.statusText}>{offerStatus.text}</Text>
              </View>
            </View>

            <View style={styles.priceComparison}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>{t('arb.app-client.mobile.auto_arb_offer_get.priceLabelOriginal')}</Text>
                <Text style={styles.priceValue}>{offer.offerDetails.originalPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>{t('arb.app-client.mobile.auto_arb_offer_get.priceLabelOffer')}</Text>
                <Text style={[styles.priceValue, styles.offerPrice]}>{offer.offerDetails.offeredPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>{t('arb.app-client.mobile.auto_arb_offer_get.priceLabelSavings')}</Text>
                <Text style={[styles.priceValue, styles.savingsPrice]}>{offer.offerDetails.discount.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.offerMeta}>
              <Text style={styles.discountText}>
                توفير {offer.offerDetails.discountPercentage}% ({offer.offerDetails.discount.toLocaleString()} ريال)
              </Text>
            </View>

            <View style={styles.expiryInfo}>
              <Text style={styles.expiryLabel}>ينتهي في:</Text>
              <Text style={styles.expiryValue}>{offer.offerDetails.expiryDate}</Text>
            </View>
          </View>

          <View style={styles.sellerCard}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_offer_get.sectionTitleSeller')}</Text>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                🏢 {offer.seller.name} {offer.seller.verified && '✅'}
              </Text>
              <View style={styles.sellerRating}>
                <Text style={styles.ratingText}>⭐ {offer.seller.rating}</Text>
              </View>
            </View>
            <View style={styles.sellerStats}>
              <Text style={styles.sellerStat}>⏱️ {offer.seller.responseTime}</Text>
              <Text style={styles.sellerStat}>{offer.seller.totalListings} إعلان</Text>
            </View>
            <Text style={styles.sellerStat}>{t('arb.app-client.mobile.auto_arb_offer_get.sellerStatCta')}</Text>
          </View>

          <View style={styles.conditionsCard}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_offer_get.sectionTitleTerms')}</Text>
            {offer.offerDetails.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <Text style={styles.conditionNumber}>{index + 1}.</Text>
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>

          <View style={styles.negotiationCard}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_offer_get.sectionTitleNegotiation')}</Text>
            {offer.negotiationHistory.map((entry, index) => (
              <View key={index} style={styles.negotiationItem}>
                <View style={styles.negotiationHeader}>
                  <Text style={styles.negotiationPrice}>
                    {entry.price.toLocaleString()} ريال
                  </Text>
                  <Text style={styles.negotiationDate}>{entry.date}</Text>
                </View>
                <View style={styles.negotiationDetails}>
                  <Text style={styles.negotiationBy}>بواسطة: {entry.by}</Text>
                  {entry.note && <Text style={styles.negotiationNote}>{entry.note}</Text>}
                </View>
              </View>
            ))}
          </View>

          {/* تلخيص سياسة العربون والإلغاء — ARB_UX_FLOW */}
          <View style={styles.policyBlock}>
            <Text style={[styles.policyTitle, textAlignStart]}>{t('arb.app-client.mobile.auto_arb_offer_get.policyTitle')}</Text>
            <Text style={[styles.policyText, textAlignStart]}>
              {t('surfaces.arb_offer_policy_text')}
            </Text>
          </View>

          {/* CTA واحد — حجز الآن */}
          <View style={styles.actionsCard}>
            <ArbPrimaryCTA title={t('surfaces.arb_book_now')} onPress={handleBook} fullWidth />
            <TouchableOpacity style={styles.backLink} onPress={() => handleNavigate('ArbOffersSearch')}>
              <Text style={styles.backLinkText}>{t('surfaces.arb_back_to_offers')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.arb_offer_loading')}
      errorMessage={t('surfaces.arb_offer_error')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.arb_offer_success')}
      successActionText={t('surfaces.arb_back_to_offers')}
      onSuccessAction={() => setState('content')}
      screenName="auto_arb_offer_get"
      operationName="arb_offer_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  heroCarousel: {
    height: HERO_HEIGHT,
  },
  heroImage: {
    height: HERO_HEIGHT,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  heroDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: semanticRoles.border,
    marginHorizontal: BTHWANI_SPACING.xs,
  },
  heroDotActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  policyBlock: {
    backgroundColor: semanticRoles.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  policyText: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 20,
  },
  offerHeaderBar: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  offerHeaderLeft: {
    flex: 1,
  },
  offerId: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.onSurface,
  },
  offerStatusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    marginStart: BTHWANI_SPACING.md,
  },
  offerStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  propertyCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  propertyImage: {
    fontSize: 40,
    marginEnd: BTHWANI_SPACING.md,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  propertyType: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  propertyLocation: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  propertyDetails: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textDecorationLine: 'line-through',
  },
  offerCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.md,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  offerPrice: {
    color: semanticRoles.primaryCTA,
  },
  savingsPrice: {
    color: semanticRoles.stateInfo.icon,
  },
  offerMeta: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  discountText: {
    fontSize: 14,
    color: semanticRoles.stateInfo.icon,
    fontWeight: '600',
  },
  expiryInfo: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  expiryLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  expiryValue: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  sellerCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  sellerRating: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  ratingText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  sellerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.md,
  },
  sellerStat: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  conditionsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  conditionNumber: {
    color: semanticRoles.primaryCTA,
    fontSize: 14,
    fontWeight: '600',
    marginEnd: BTHWANI_SPACING.sm,
    minWidth: 20,
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.onSurface,
    lineHeight: 20,
  },
  negotiationCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  negotiationItem: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  negotiationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  negotiationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  negotiationDate: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  negotiationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  negotiationBy: {
    fontSize: 14,
    color: semanticRoles.onSurface,
  },
  negotiationNote: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  actionsCard: {
    margin: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.sm,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.sm,
  },
  backLinkText: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  disclaimer: {
    backgroundColor: semanticRoles.stateWarning.background,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.stateWarning.icon,
  },
  disclaimerText: {
    fontSize: 14,
    color: semanticRoles.stateWarning.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default auto_arb_offer_get;

