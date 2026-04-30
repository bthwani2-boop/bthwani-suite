// KNZ Listing Detail — تفاصيل إعلان مع زر تواصل (دردشة)، مفضلة، تقرير، وتكامل مع تقييمات كنز
// Surface: app-client | Service: knz
// §30 States: Loading/Error/Content/Success
// Contract (Phase 0.1 خيار ب): مصدر البيانات = entity_get(domain=KNZ, entityType=listing, entityId=listingId). استبدال المحاكاة عند توفر @bthwani/api-clients.

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Linking } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KNZ_LISTING_TYPES } from '../../shared/knz-constants';
import { buildKnzListingGetMock } from '../../hooks';
import { KnzDeliveryBySellerNotice } from './components/KnzDeliveryBySellerNotice';
import { rawFetch } from '@bthwani/api-clients';

const NS = 'knz.app-client.mobile.auto_knz_listing_get';
const NS_COMMON = 'knz.app-client.mobile.common';
import { KnzRatingSummary, KnzRatingsList, KnzRatingSubmitSheet, KnzPromotionSheet } from './components';
import type { KnzRatingItem } from './components/KnzRatingsList';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface auto_knz_listing_getProps {
  listingId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

export const auto_knz_listing_get: React.FC<auto_knz_listing_getProps> = ({
  listingId,
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const lid = listingId ?? '1';
  const sellerUserId = 'seller_1';

  const [ratingSummary, setRatingSummary] = useState<{ average: number; count: number } | null>(null);
  const [ratings, setRatings] = useState<KnzRatingItem[]>([]);
  const [ratingSheetVisible, setRatingSheetVisible] = useState(false);
  const [promotionSheetVisible, setPromotionSheetVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    primaryPhone?: string;
    whatsappNumber?: string;
    preferredContactChannel?: 'chat' | 'call' | 'whatsapp';
  } | null>(null);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    // Backend integration call
    const loadListing = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadListing();
  }, []);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const baseUrl = getBaseUrl();
        const [summaryRes, listRes, accountRes] = await Promise.all([
          rawFetch(`${baseUrl}/api/knz/ratings/summary?userId=${encodeURIComponent(sellerUserId)}`),
          rawFetch(
            `${baseUrl}/api/knz/ratings?targetType=listing&targetId=${encodeURIComponent(lid)}`,
          ),
          rawFetch(`${baseUrl}/api/knz/accounts/${encodeURIComponent(sellerUserId)}`),
        ]);

        if (summaryRes.ok) {
          const json = await summaryRes.json();
          if (json?.success && json?.data) {
            const average = typeof json.data.average === 'number' ? json.data.average : 0;
            const count = typeof json.data.count === 'number' ? json.data.count : 0;
            setRatingSummary({ average, count });
          }
        }

        if (listRes.ok) {
          const json = await listRes.json();
          const items = json?.data?.items as any[] | undefined;
          if (Array.isArray(items)) {
            const mapped: KnzRatingItem[] = items.map((r) => ({
              id: String(r.id ?? ''),
              score: Number(r.score ?? 0),
              comment: r.comment,
              createdAt: r.createdAt,
              ratorUserId: r.ratorUserId,
            }));
            setRatings(mapped);
          }
        }

        if (accountRes.ok) {
          const json = await accountRes.json();
          const account = json?.data?.account as
            | {
                primaryPhone?: string;
                whatsappNumber?: string;
                preferredContactChannel?: string;
              }
            | undefined;
          if (account) {
            const preferred =
              account.preferredContactChannel === 'call' ||
              account.preferredContactChannel === 'whatsapp' ||
              account.preferredContactChannel === 'chat'
                ? account.preferredContactChannel
                : undefined;
            setContactInfo({
              primaryPhone: account.primaryPhone,
              whatsappNumber: account.whatsappNumber,
              preferredContactChannel: preferred ?? 'chat',
            });
          }
        }
      } catch {
        // في حال الفشل، نُبقي الشاشة بدون تقييمات بدون عرض خطأ منفصل
      }
    };

    void loadRatings();
  }, [lid, sellerUserId]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleContact = () => {
    handleNavigate('KnzChatThreadList', { listingId: lid });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `إعلان كنز: ${mockListing.title} - السعر ${mockListing.price.toLocaleString()} ${mockListing.currency}`,
      });
    } catch {
      // تجاهل أي خطأ في المشاركة حتى لا نكسر التجربة
    }
  };

  const mockListing = useMemo(
    () => buildKnzListingGetMock(t, lid, sellerUserId),
    [t, lid, sellerUserId]
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return semanticRoles.success;
      case 'used': return semanticRoles.warning;
      case 'refurbished': return semanticRoles.info;
      default: return semanticRoles.textMuted;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return t('surfaces.جديد');
      case 'used': return t('surfaces.مستعمل');
      case 'refurbished': return t('surfaces.مجدد');
      default: return condition;
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {navigation?.goBack && (
              <TouchableOpacity style={styles.backRow} onPress={navigation.goBack}>
                <Text style={styles.backText}>← رجوع</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{mockListing.title}</Text>

            <View style={styles.priceCard}>
              <Text style={styles.price}>{mockListing.price.toLocaleString()} {mockListing.currency}</Text>
              <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(mockListing.condition) }]}>
                <Text style={styles.conditionText}>{getConditionText(mockListing.condition)}</Text>
              </View>
            </View>

            <View style={styles.imagesContainer}>
              {mockListing.images.map((image, index) => (
                <View key={index} style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>{image}</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📂 التصنيف:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{mockListing.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🏷️ نوع العرض:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{KNZ_LISTING_TYPES.find((t) => t.code === mockListing.listingType)?.labelAr ?? mockListing.listingType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 الموقع:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{mockListing.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 تاريخ النشر:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{mockListing.postedDate}</Text>
              </View>
              <KnzDeliveryBySellerNotice show={mockListing.deliveryAvailableFromSeller} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الوصف</Text>
              <Text style={styles.description}>{mockListing.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>المميزات</Text>
              <View style={styles.attributesGrid}>
                {mockListing.attributes.map((attr, index) => (
                  <View key={index} style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>{attr.label}:</Text>
                    <Text style={styles.attributeValue}>{attr.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.sellerCard}
              activeOpacity={0.7}
              onPress={() =>
                handleNavigate('KnzPage', {
                  sellerId: mockListing.sellerId,
                  sellerName: mockListing.seller.name,
                })
              }
            >
              <Text style={styles.sectionTitle}>البائع</Text>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>
                  {mockListing.seller.name} {mockListing.seller.verified && '✅'}
                </Text>
                <View style={styles.sellerRating}>
                  {ratingSummary ? (
                    <KnzRatingSummary average={ratingSummary.average} count={ratingSummary.count} />
                  ) : (
                    <Text style={styles.ratingText}>⭐ {mockListing.seller.rating}</Text>
                  )}
                </View>
              </View>
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerDetail}>عضو منذ {mockListing.seller.memberSince}</Text>
                <Text style={styles.sellerDetail}>{mockListing.seller.totalListings} إعلان نشر</Text>
              </View>
              {contactInfo && (contactInfo.primaryPhone || contactInfo.whatsappNumber) && (
                <View style={styles.contactBlock}>
                  <Text style={styles.contactTitle}>طرق التواصل</Text>
                  {contactInfo.primaryPhone ? (
                    <TouchableOpacity
                      style={[
                        styles.contactRow,
                        contactInfo.preferredContactChannel === 'call' && styles.contactRowPreferred,
                      ]}
                      onPress={() => Linking.openURL(`tel:${contactInfo.primaryPhone}`)}
                    >
                      <Text style={styles.contactIcon}>📞</Text>
                      <Text style={styles.contactText}>{contactInfo.primaryPhone}</Text>
                      <Text style={styles.contactHint}>اتصال هاتفي</Text>
                    </TouchableOpacity>
                  ) : null}
                  {contactInfo.whatsappNumber ? (
                    <TouchableOpacity
                      style={[
                        styles.contactRow,
                        contactInfo.preferredContactChannel === 'whatsapp' &&
                          styles.contactRowPreferred,
                      ]}
                      onPress={() =>
                        Linking.openURL(`https://wa.me/${encodeURIComponent(
                          contactInfo.whatsappNumber!,
                        )}`)
                      }
                    >
                      <Text style={styles.contactIcon}>💬</Text>
                      <Text style={styles.contactText}>{contactInfo.whatsappNumber}</Text>
                      <Text style={styles.contactHint}>واتساب</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
              {/* ثانوي: حفظ، إبلاغ — مرجع KNZ_UX_FORENSIC_AND_FINAL_DESIGN */}
              <View style={styles.secondaryActions}>
                <TouchableOpacity onPress={() => handleNavigate('KnzFavoritesList')}>
                  <Text style={styles.secondaryActionText}>❤️ حفظ في المفضلة</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('KnzListingReport', { listingId: lid })}>
                  <Text style={styles.secondaryActionText}>⚠️ تقرير إعلان</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRatingSheetVisible(true)}>
                  <Text style={styles.secondaryActionText}>⭐ إضافة تقييم للبائع</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                  <Text style={styles.secondaryActionText}>📤 مشاركة الإعلان</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {ratings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>أحدث التقييمات</Text>
                <KnzRatingsList items={ratings.slice(0, 3)} />
              </View>
            )}

            <View style={styles.safetyBanner}>
              <Text style={styles.safetyIcon}>🛡️</Text>
              <Text style={styles.safetyText}>
                نصيحة أمان: التقِ في أماكن عامة ولا ترسل أموالاً مسبقاً
              </Text>
            </View>
          </ScrollView>

          {/* CTA واحد ثابت أسفل: دردشة مع البائع — مرجع KNZ_UX_FORENSIC_AND_FINAL_DESIGN */}
          <View style={styles.fixedFooter}>
            <TouchableOpacity style={styles.primaryCTA} onPress={handleContact}>
              <Text style={styles.primaryCTAText}>دردشة مع البائع</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryCTA}
              onPress={() => setPromotionSheetVisible(true)}
            >
              <Text style={styles.secondaryCTAText}>ترقية الإعلان (ممول)</Text>
            </TouchableOpacity>
          </View>
        </View>
        {ratingSheetVisible && (
          <KnzRatingSubmitSheet
            visible={ratingSheetVisible}
            targetType="seller"
            targetId={sellerUserId}
            onClose={() => setRatingSheetVisible(false)}
            onSubmitted={() => {
              // إعادة تحميل الملخص والقائمة بعد إرسال تقييم جديد
              setRatingSummary(null);
              setRatings([]);
            }}
          />
        )}
        {promotionSheetVisible && (
          <KnzPromotionSheet
            visible={promotionSheetVisible}
            listingId={lid}
            onClose={() => setPromotionSheetVisible(false)}
          />
        )}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_listing_get.loadingMessage')}
      errorMessage={t('knz.app-client.mobile.auto_knz_listing_get.errorMessage')}
      onErrorAction={handleRetry}
      successMessage={t('knz.app-client.mobile.auto_knz_listing_get.successMessage')}
      successActionText={t('knz.app-client.mobile.auto_knz_listing_get.successActionText')}
      onSuccessAction={() => setState('content')}
      screenName="auto_knz_listing_get"
      operationName="knz_listing_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BTHWANI_SPACING.xl * 3,
  },
  fixedFooter: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  primaryCTA: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  primaryCTAText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryCTA: {
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  secondaryCTAText: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  secondaryActionText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  backRow: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  backText: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  priceCard: {
    backgroundColor: semanticRoles.primaryCTA,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  conditionBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  conditionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.contentH,
    justifyContent: 'space-around',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  imageEmoji: {
    fontSize: 32,
  },
  detailsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  deliveryBanner: {
    backgroundColor: semanticRoles.info + '18',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: semanticRoles.info,
  },
  deliveryBannerText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  description: {
    fontSize: 16,
    color: semanticRoles.text,
    lineHeight: 24,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeItem: {
    width: '50%',
    marginBottom: BTHWANI_SPACING.md,
  },
  attributeLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  attributeValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  sellerCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  sellerRating: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  ratingText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  sellerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerDetail: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  contactBlock: {
    marginTop: BTHWANI_SPACING.lg,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.xs,
  },
  contactRowPreferred: {
    backgroundColor: semanticRoles.primaryCTA + '10',
    borderRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  contactIcon: {
    fontSize: 18,
    marginEnd: BTHWANI_SPACING.sm,
  },
  contactText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  contactHint: {
    marginStart: BTHWANI_SPACING.sm,
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  safetyBanner: {
    backgroundColor: semanticRoles.warning + '20',
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.warning,
  },
  safetyIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
});

export default auto_knz_listing_get;

