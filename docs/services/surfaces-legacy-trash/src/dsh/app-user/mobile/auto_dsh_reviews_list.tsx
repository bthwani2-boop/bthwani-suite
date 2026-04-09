// Auto-generated screen for dsh_reviews_list
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildDshReviewsListMock, type Review } from '../../hooks';

interface auto_dsh_reviews_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_reviews_list: React.FC<auto_dsh_reviews_listProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setState('content');
      } catch (error) {
        setState('error');
      }
    };

    loadReviews();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const reviews = useMemo(() => buildDshReviewsListMock(t), [t]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={i <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>{item.userAvatar}</Text>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
      </View>

      <View style={styles.reviewContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
        </View>
        <Text style={[styles.reviewComment, textAlignStart]}>{item.comment}</Text>
      </View>

      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.helpfulButton}>
          <Text style={styles.helpfulText}>👍 مفيد ({item.helpful})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_reviews_list.title')}</Text>
            <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_reviews_list.subtitle')}</Text>
            <View style={styles.stats}>
              <Text style={styles.statText}>⭐ 4.6 متوسط التقييم</Text>
              <Text style={styles.statText}>📝 {reviews.length} تقييم</Text>
            </View>
          </View>

          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReview}
            contentContainerStyle={styles.reviewsList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />

          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshHome')}>
            <Text style={styles.backText}>{t('dsh.app-client.mobile.auto_dsh_reviews_list.backText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_reviews_list.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_reviews_list.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_reviews_list"
      operationName="dsh_reviews_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  statText: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  reviewsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  reviewCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 32,
    marginEnd: BTHWANI_SPACING.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  reviewDate: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    color: semanticRoles.stateWarning.icon,
    fontSize: 16,
  },
  starEmpty: {
    color: semanticRoles.textMuted,
    fontSize: 16,
  },
  reviewContent: {
    marginBottom: BTHWANI_SPACING.md,
  },
  itemInfo: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  restaurantName: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  reviewComment: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    lineHeight: 20,
  },
  reviewFooter: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  helpfulButton: {
    alignSelf: 'flex-start',
    padding: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  helpfulText: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  backText: {
    color: semanticRoles.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_reviews_list;

