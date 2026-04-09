// BTHWANI Unified Entity Accept Screen
// Zero-Noise Unification: Single screen for all entity accept actions across DSH, AMN, KNZ, ARB, ESF, MRF

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

// Unified Types Import
import {
  UnifiedEntity,
  EntityDomain,
  EntityAction,
} from '@bthwani/domain-types/entity-types';

import {
  getDomainConfig,
  getEntityTypeForDomain,
} from '@bthwani/domain-types/entity-config';

// import { useEntity, useEntityAction } from '@bthwani/states/entity-hooks';

interface AutoEntityAcceptProps {
  navigation?: any;
  route?: {
    name?: string;
    params?: {
      entityId: string;
      domain: EntityDomain;
      entity?: UnifiedEntity;
      action?: EntityAction;
    };
  };
}

type AcceptAction =
  | EntityAction
  | 'inspect'
  | 'rate'
  | 'track'
  | 'dispute'
  | 'resolve';
type AcceptEntity = UnifiedEntity & {
  customerName?: string;
  customerPhone?: string;
  totalAmount?: number | string;
  distanceKm?: number;
  pickupLocation?: {
    address?: string;
  } | null;
  deliveryLocation?: {
    address?: string;
  } | null;
};
type LegacyDomainConfig = ReturnType<typeof getDomainConfig> & {
  displayName?: string;
  icon?: string;
  primaryColor?: string;
};
const CARD_SHADOW = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
} as const;

export const AutoEntityAccept: React.FC<AutoEntityAcceptProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const routeParams = route?.params;
  const entityId = routeParams?.entityId || 'unknown';
  const domain = routeParams?.domain || 'dsh';
  const passedEntity = routeParams?.entity;
  const actionType: AcceptAction = routeParams?.action || 'accept';

  // Unified Hooks (TEMPORARILY DISABLED - fetch() removed from domain-types)
  // const { entity: loadedEntity, isLoading, error } = useEntity(domain, entityId, !passedEntity);
  // const { execute: executeAction, isExecuting } = useEntityAction(domain, entityId);

  // Temporary mock implementation
  const loadedEntity = passedEntity || null;
  const isLoading = false;
  const error = null;
  const executeAction = async (_requestedAction: AcceptAction) => ({
    success: false,
    message: t('shared.auto_entity_accept.entityHooksNot'),
  });
  const isExecuting = false;

  // Local State
  const [currentEntity, setCurrentEntity] = useState<AcceptEntity | null>(
    passedEntity || null
  );
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null);

  // Configuration
  const config = getDomainConfig(domain) as LegacyDomainConfig;
  const domainLabel =
    config.displayName ?? config.label ?? config.name.toUpperCase();
  const domainIcon = config.icon ?? config.label ?? config.name.toUpperCase();
  const primaryColor = config.primaryColor ?? BTHWANI_COLORS.primary;
  const allowedActions: EntityAction[] = [
    'accept',
    'reject',
    'pickup',
    'deliver',
    'start',
    'complete',
    'cancel',
  ];

  useEffect(() => {
    if (loadedEntity) {
      setCurrentEntity(loadedEntity);
    }
  }, [loadedEntity]);

  const handleAccept = async () => {
    if (!currentEntity) return;

    setDecision('accept');

    const result = await executeAction(
      actionType === 'accept' ? 'accept' : actionType
    );

    if (result.success) {
      const successMessage = getSuccessMessage(actionType);
      Alert.alert(
        t('shared.auto_entity_accept.successMessage'),
        successMessage,
        [
          {
            text: t('common.ok'),
            onPress: () => {
              const nextScreen = getNextScreenForAction(actionType);
              if (nextScreen) {
                navigation?.navigate(nextScreen, {
                  entityId: currentEntity.id,
                  domain,
                  entity: currentEntity,
                });
              } else {
                navigation?.goBack();
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(t('shared.auto_entity_accept.errorMessage'), result.message);
      setDecision(null);
    }
  };

  const handleReject = async () => {
    if (!currentEntity) return;

    Alert.alert(
      t('shared.auto_entity_accept.confirmRejectTitle'),
      t('surfaces.هل_أنت_متأكد_من_رفض_هذا_الكيان؟'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.reject'),
          style: 'destructive',
          onPress: async () => {
            setDecision('reject');

            const result = await executeAction('reject');

            if (result.success) {
              Alert.alert(
                t('shared.auto_entity_accept.entityRejectedSuccess'),
                t('shared.auto_entity_accept.entityRejectedSuccess'),
                [
                  {
                    text: t('common.ok'),
                    onPress: () => navigation?.goBack(),
                  },
                ]
              );
            } else {
              Alert.alert(
                t('shared.auto_entity_accept.errorMessage_132'),
                result.message
              );
              setDecision(null);
            }
          },
        },
      ]
    );
  };

  const getSuccessMessage = (action: EntityAction): string => {
    const name = domainLabel;
    const messages: Partial<Record<AcceptAction, string>> = {
      accept: t('shared.auto_entity_accept.successAccept', { name }),
      inspect: t('shared.auto_entity_accept.successInspect', { name }),
      start: t('shared.auto_entity_accept.successStart', { name }),
      complete: t('shared.auto_entity_accept.successComplete', { name }),
      pickup: t('shared.auto_entity_accept.successPickup', { name }),
      deliver: t('shared.auto_entity_accept.successDeliver', { name }),
      reject: t('shared.auto_entity_accept.successReject', { name }),
      cancel: t('shared.auto_entity_accept.successCancel', { name }),
      rate: t('shared.auto_entity_accept.successRate', { name }),
      track: t('shared.auto_entity_accept.successTrack', { name }),
      dispute: t('shared.auto_entity_accept.successDispute', { name }),
      resolve: t('shared.auto_entity_accept.successResolve', { name }),
    };
    return messages[action] || t('shared.auto_entity_accept.successGeneric');
  };

  const getNextScreenForAction = (action: AcceptAction): string | null => {
    const screenMap: Partial<Record<AcceptAction, string>> = {
      accept: 'entity_details',
      inspect: 'entity_details',
      pickup: 'entity_deliver',
      deliver: 'entity_rate',
      start: 'entity_track',
      complete: 'entity_rate',
      track: 'entity_track',
      rate: 'entity_rate',
    };
    return screenMap[action] || null;
  };

  const renderEntitySummary = () => {
    if (!currentEntity) return null;

    return (
      <View style={styles.entitySummary}>
        <View
          style={[
            styles.entityHeader,
            { flexDirection: 'row', direction: layoutDirection },
          ]}
        >
          <Text style={styles.domainIcon}>{domainIcon}</Text>
          <View style={styles.entityInfo}>
            <Text style={styles.entityType}>{domainLabel}</Text>
            <Text style={styles.entityId}>#{currentEntity.id}</Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            {currentEntity.customerName ||
              `${domainLabel} #${currentEntity.id}`}
          </Text>
          {currentEntity.customerPhone ? (
            <Text style={styles.customerPhone}>
              {currentEntity.customerPhone}
            </Text>
          ) : null}
        </View>

        {currentEntity.pickupLocation && (
          <View
            style={[
              styles.locationInfo,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <Text style={styles.locationLabel}>
              {t('shared.auto_entity_accept.locationFrom')}
            </Text>
            <Text style={styles.locationText} numberOfLines={2}>
              {currentEntity.pickupLocation.address}
            </Text>
          </View>
        )}

        {currentEntity.deliveryLocation && (
          <View
            style={[
              styles.locationInfo,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <Text style={styles.locationLabel}>
              {t('shared.auto_entity_accept.locationTo')}
            </Text>
            <Text style={styles.locationText} numberOfLines={2}>
              {currentEntity.deliveryLocation.address}
            </Text>
          </View>
        )}

        {currentEntity.totalAmount && (
          <View
            style={[
              styles.amountInfo,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <Text style={styles.amountLabel}>
              {t('shared.auto_entity_accept.amountLabel')}
            </Text>
            <Text style={styles.amountText}>
              {currentEntity.totalAmount}{' '}
              {t('shared.auto_entity_list.amountSuffix')}
            </Text>
          </View>
        )}

        {currentEntity.distanceKm && (
          <View
            style={[
              styles.distanceInfo,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <Text style={styles.distanceLabel}>
              {t('shared.auto_entity_accept.distanceLabel')}
            </Text>
            <Text style={styles.distanceText}>
              {currentEntity.distanceKm} {t('shared.auto_entity_list.unitKm')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderActionButtons = () => {
    const canAccept = actionType !== 'reject';
    const canReject =
      allowedActions.includes('reject') && actionType !== 'reject';

    return (
      <View style={styles.actionsContainer}>
        {canAccept && (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: primaryColor,
                opacity: isExecuting ? 0.6 : 1,
              },
            ]}
            onPress={handleAccept}
            disabled={isExecuting}
          >
            <Text style={styles.primaryButtonText}>
              {isExecuting
                ? t('surfaces.جاري_التنفيذ')
                : getActionButtonText(actionType)}
            </Text>
          </TouchableOpacity>
        )}

        {canReject && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReject}
            disabled={isExecuting}
          >
            <Text style={styles.secondaryButtonText}>{t('common.reject')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getActionButtonText = (action: AcceptAction): string => {
    const texts: Partial<Record<AcceptAction, string>> = {
      accept: t('surfaces.قبول'),
      inspect: t('surfaces.فحص'),
      start: t('surfaces.بدء'),
      complete: t('surfaces.إكمال'),
      pickup: t('surfaces.استلام'),
      deliver: t('shared.auto_entity_accept.deliverButton'),
      reject: t('common.reject'),
      cancel: t('common.cancel'),
      rate: t('surfaces.تقييم'),
      track: t('surfaces.تتبع'),
      dispute: t('surfaces.الإبلاغ_عن_نزاع'),
      resolve: t('surfaces.حل_النزاع'),
    };
    return texts[action] || t('surfaces.تنفيذ');
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {t('shared.auto_entity_accept.loadingData')}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !currentEntity) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || t('shared.auto_entity_accept.loadEntityError')}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Platform-safe retry: use navigation for mobile, window for web
              if (navigation) {
                navigation.goBack();
                setTimeout(() => {
                  navigation.navigate(
                    route?.name || 'EntityAccept',
                    route?.params
                  );
                }, 100);
              }
            }}
          >
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{getActionTitle(actionType, t)}</Text>
          <Text style={styles.subtitle}>
            {getActionSubtitle(actionType, t)}
          </Text>
        </View>

        {/* Entity Summary */}
        {renderEntitySummary()}

        {/* Action Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>
            {t('shared.auto_entity_accept.detailsTitle')}
          </Text>
          <Text style={styles.descriptionText}>
            {getActionDescription(actionType, t)}
          </Text>
        </View>

        {/* Consequences */}
        <View style={styles.consequencesCard}>
          <Text style={styles.consequencesTitle}>
            {t('shared.auto_entity_accept.consequencesTitle')}
          </Text>
          {renderActionConsequences(actionType, t)}
        </View>

        {/* Action Buttons */}
        {renderActionButtons()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const getActionTitle = (
  action: AcceptAction,
  translate: (key: string) => string
): string => {
  const titles: Partial<Record<AcceptAction, string>> = {
    accept: translate('surfaces.قبول_الكيان'),
    inspect: translate('surfaces.فحص_الكيان'),
    start: translate('shared.auto_entity_accept.titleStart'),
    complete: translate('shared.auto_entity_accept.titleComplete'),
    pickup: translate('shared.auto_entity_accept.titlePickup'),
    deliver: translate('shared.auto_entity_accept.titleDeliver'),
    reject: translate('surfaces.رفض_الكيان'),
    cancel: translate('surfaces.إلغاء_العملية'),
    rate: translate('surfaces.تقييم_الخدمة'),
    track: translate('surfaces.تتبع_الكيان'),
    dispute: translate('shared.auto_entity_accept.titleDispute'),
    resolve: translate('shared.auto_entity_accept.titleResolve'),
  };
  return titles[action] || translate('shared.auto_entity_accept.titleGeneric');
};

const getActionSubtitle = (
  action: AcceptAction,
  translate: (key: string) => string
): string => {
  const subtitles: Partial<Record<AcceptAction, string>> = {
    accept: translate('surfaces.قرر_قبول_هذا_الكيان_والبدء_في_تنفيذه'),
    inspect: translate('surfaces.قم_بفحص_الكيان_قبل_اتخاذ_القرار'),
    start: translate('surfaces.ابدأ_في_تنفيذ_العملية'),
    complete: translate('surfaces.أكمل_العملية_وأنهِ_المهمة'),
    pickup: translate('surfaces.قم_باستلام_الكيان_من_المكان_المحدد'),
    deliver: translate('surfaces.قم_بتوصيل_الكيان_إلى_العميل'),
    reject: translate('surfaces.رفض_هذا_الكيان'),
    cancel: translate('surfaces.إلغاء_العملية_الجارية'),
    rate: translate('surfaces.قيم_جودة_الخدمة_المقدمة'),
    track: translate('surfaces.تتبع_موقع_وحالة_الكيان'),
    dispute: translate('surfaces.الإبلاغ_عن_مشكلة_في_العملية'),
    resolve: translate('surfaces.حل_المشكلة_المبلغ_عنها'),
  };
  return subtitles[action] || translate('surfaces.اتخذ_قرارك_بحكمة');
};

const getActionDescription = (
  action: AcceptAction,
  translate: (key: string) => string
): string => {
  const descriptions: Partial<Record<AcceptAction, string>> = {
    accept: translate('shared.auto_entity_accept.descriptionAccept'),
    inspect: translate('shared.auto_entity_accept.descriptionInspect'),
    start: translate('surfaces.سيتم_بدء_تنفيذ_العملية_وتحديث_الحالة'),
    complete: translate('surfaces.سيتم_إنهاء_العملية_وإرسال_تقرير_الإن'),
    pickup: translate('shared.auto_entity_accept.descriptionPickup'),
    deliver: translate('surfaces.انتقل_إلى_عنوان_العميل_وقم_بتسليم_ال'),
    reject: translate('surfaces.لن_يتم_قبول_هذا_الكيان_ويمكن_للعميل'),
    cancel: translate('shared.auto_entity_accept.descriptionCancel'),
    rate: translate('surfaces.مساعدتك_في_تقييم_الخدمة_تساعدنا_على'),
    track: translate('surfaces.يمكنك_متابعة_موقع_الكيان_في_الوقت_ال'),
    dispute: translate('surfaces.إذا_واجهت_أي_مشاكل،_يرجى_الإبلاغ_عنه'),
    resolve: translate('surfaces.قم_بحل_المشكلة_بالطريقة_المناسبة'),
  };
  return (
    descriptions[action] || translate('surfaces.يرجى_اتخاذ_القرار_المناسب')
  );
};

const renderActionConsequences = (
  action: AcceptAction,
  translate: (key: string) => string
) => {
  const consequences: Partial<Record<AcceptAction, string[]>> = {
    accept: [
      translate('surfaces.سيتم_إشعار_العميل_بقبول_الطلب'),
      translate('surfaces.ستبدأ_عملية_التنفيذ_فوراً'),
      translate('surfaces.ستظهر_لك_تفاصيل_إضافية_للتنفيذ'),
      translate('surfaces.لن_تتمكن_من_التراجع_عن_هذا_القرار'),
    ],
    reject: [
      translate('surfaces.سيتم_إشعار_العميل_برفض_الطلب'),
      translate('surfaces.قد_يتم_نقل_الطلب_إلى_كابتن_آخر'),
      translate('surfaces.قد_يؤثر_على_تقييمك'),
      translate('surfaces.تأكد_من_وجود_سبب_وجيه_للرفض'),
    ],
    pickup: [
      translate('shared.auto_entity_accept.consequencePickupStatus'),
      translate('surfaces.ستبدأ_عملية_التوصيل'),
      translate('surfaces.سيتم_إشعار_العميل_بالاستلام'),
      translate('surfaces.تأكد_من_سلامة_الكيان_قبل_الاستلام'),
    ],
    deliver: [
      translate('surfaces.سيتم_إكمال_عملية_التوصيل'),
      translate('surfaces.سيتم_طلب_تقييم_من_العميل'),
      translate('surfaces.ستحصل_على_أجرك_عن_هذا_الطلب'),
      translate('surfaces.احصل_على_توقيع_أو_تأكيد_من_العميل'),
    ],
  };

  const actionConsequences = consequences[action] || [
    translate('surfaces.سيتم_تنفيذ_العملية_المطلوبة'),
    translate('surfaces.تأكد_من_اتباع_الإجراءات_الصحيحة'),
  ];

  return actionConsequences.map((consequence, index) => (
    <Text key={index} style={styles.consequenceText}>
      {consequence}
    </Text>
  ));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorText: {
    fontSize: 16,
    color: BTHWANI_COLORS.error,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  entitySummary: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  entityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  domainIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
  },
  entityInfo: {
    flex: 1,
  },
  entityType: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
  },
  entityId: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    marginTop: 2,
  },
  customerInfo: {
    marginBottom: BTHWANI_SPACING.md,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
  },
  locationInfo: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.sm,
    alignItems: 'flex-start',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    width: 40,
    marginEnd: BTHWANI_SPACING.sm,
  },
  locationText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  amountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginEnd: BTHWANI_SPACING.sm,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  distanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginEnd: BTHWANI_SPACING.sm,
  },
  distanceText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
  },
  descriptionCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    lineHeight: 20,
  },
  consequencesCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  consequencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.md,
  },
  consequenceText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 20,
  },
  actionsContainer: {
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryButton: {
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: BTHWANI_COLORS.white,
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.error,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: BTHWANI_COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: BTHWANI_SPACING.xl,
  },
});
