// BTHWANI Unified Delivery Action Screen
// Zero-Noise Unification: Single screen for all delivery actions across DSH, KNZ

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// Unified Types Import
import {
  UnifiedEntity,
  EntityDomain,
  EntityAction,
} from '@bthwani/domain-types/entity-types';

import { getDomainConfig } from '@bthwani/domain-types/entity-config';

// import {
//   useEntity,
//   useEntityAction
// } from '@bthwani/states/entity-hooks';

interface AutoDeliveryActionProps {
  navigation?: any;
  route?: {
    name?: string;
    params?: {
      entityId: string;
      domain: EntityDomain;
      action: EntityAction; // 'pickup' | 'deliver' | 'start' | 'complete'
      entity?: UnifiedEntity;
    };
  };
}

type DeliveryStep = 'confirmation' | 'verification' | 'completion' | 'feedback';
type DeliveryEntity = UnifiedEntity & {
  customerName?: string;
  totalAmount?: number | string;
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

export const AutoDeliveryAction: React.FC<AutoDeliveryActionProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const routeParams = route?.params;
  const entityId = routeParams?.entityId || 'unknown';
  const domain = routeParams?.domain || 'dsh';
  const action = routeParams?.action || 'pickup';
  const passedEntity = routeParams?.entity;

  // Unified Hooks (TEMPORARILY DISABLED - fetch() removed from domain-types)
  // const { entity: loadedEntity, isLoading, error } = useEntity(domain, entityId, !passedEntity);
  // const { execute: executeAction, isExecuting } = useEntityAction(domain, entityId);

  // Temporary mock implementation
  const loadedEntity = passedEntity || null;
  const isLoading = false;
  const error = null;
  const executeAction = async (_requestedAction: EntityAction) => ({
    success: false,
    message: t('shared.auto_delivery_action.entityHooksNot'),
  });
  const isExecuting = false;

  // Local State
  const [currentEntity, setCurrentEntity] = useState<DeliveryEntity | null>(
    passedEntity || null
  );
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('confirmation');
  const [verificationCode, setVerificationCode] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  // Configuration
  const config = getDomainConfig(domain) as LegacyDomainConfig;
  const primaryColor = config.primaryColor ?? BTHWANI_COLORS.primary;

  useEffect(() => {
    if (loadedEntity) {
      setCurrentEntity(loadedEntity);
    }
  }, [loadedEntity]);

  const handleConfirmAction = async () => {
    if (action === 'pickup' || action === 'deliver') {
      setCurrentStep('verification');
    } else {
      await performAction();
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      Alert.alert(
        t('shared.auto_delivery_action.validationRequired'),
        t('shared.auto_delivery_action.validationRequired')
      );
      return;
    }

    // Here you would verify the code with the backend
    const isValid = await verifyCode(verificationCode);

    if (isValid) {
      await performAction();
    } else {
      Alert.alert(
        t('shared.auto_delivery_action.invalidVerificationCode'),
        t('shared.auto_delivery_action.invalidVerificationCode')
      );
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    // Mock verification - in real app this would call an API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(code.length >= 4); // Placeholder: replace with backend API verification
      }, 1000);
    });
  };

  const performAction = async () => {
    const result = await executeAction(action);

    if (result.success) {
      if (action === 'deliver' || action === 'complete') {
        setCurrentStep('feedback');
      } else {
        showSuccessAndNavigate();
      }
    } else {
      Alert.alert(
        t('shared.auto_delivery_action.errorMessage'),
        result.message
      );
    }
  };

  const handleFeedbackSubmit = async () => {
    // Here you would submit feedback/rating
    const feedbackData = {
      rating,
      notes: feedback,
      timestamp: new Date().toISOString(),
    };

    // Mock feedback submission
    await new Promise(resolve => setTimeout(resolve, 500));

    showSuccessAndNavigate();
  };

  const showSuccessAndNavigate = () => {
    const successMessage = getSuccessMessage(action);
    Alert.alert(
      t('shared.auto_delivery_action.successMessage'),
      successMessage,
      [
        {
          text: t('common.ok'),
          onPress: () => {
            navigation?.navigate('entity_list', { domain });
          },
        },
      ]
    );
  };

  const getSuccessMessage = (action: EntityAction): string => {
    const messages: Partial<Record<EntityAction, string>> = {
      pickup: t('surfaces.تم_استلام_الكيان_بنجاح'),
      deliver: t('surfaces.تم_توصيل_الكيان_بنجاح'),
      start: t('surfaces.تم_بدء_العملية_بنجاح'),
      complete: t('surfaces.تم_إكمال_العملية_بنجاح'),
    };
    return messages[action] || t('surfaces.تم_تنفيذ_العملية_بنجاح');
  };

  const getActionTitle = (action: EntityAction): string => {
    const titles: Partial<Record<EntityAction, string>> = {
      pickup: t('surfaces.استلام_الكيان'),
      deliver: t('surfaces.توصيل_الكيان'),
      start: t('surfaces.بدء_العملية'),
      complete: t('surfaces.إكمال_العملية'),
    };
    return titles[action] || t('surfaces.تنفيذ_العملية');
  };

  const getActionIcon = (action: EntityAction): string => {
    const icons: Partial<Record<EntityAction, string>> = {
      pickup: '📦',
      deliver: '🚚',
      start: '▶️',
      complete: '✅',
    };
    return icons[action] || '⚡';
  };

  const renderConfirmationStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.actionIconContainer}>
        <Text style={styles.actionIcon}>{getActionIcon(action)}</Text>
      </View>

      <Text style={styles.stepTitle}>
        {t('shared.auto_delivery_action.stepTitleConfirm', {
          action: getActionTitle(action),
        })}
      </Text>

      <Text style={styles.stepDescription}>{getActionDescription(action)}</Text>

      {currentEntity && (
        <View style={styles.entitySummary}>
          <Text style={styles.entityInfo}>
            {t('shared.auto_delivery_action.customerLabel')}:{' '}
            {currentEntity.customerName || `#${currentEntity.id}`}
          </Text>
          {currentEntity.totalAmount && (
            <Text style={styles.entityInfo}>
              {t('shared.auto_delivery_action.amountLabel')}:{' '}
              {currentEntity.totalAmount}{' '}
              {t('shared.auto_delivery_action.amountSuffix')}
            </Text>
          )}
          {action === 'deliver' && currentEntity.deliveryLocation && (
            <Text style={styles.entityInfo}>
              {t('shared.auto_delivery_action.addressLabel')}:{' '}
              {currentEntity.deliveryLocation.address ||
                t('shared.auto_delivery_action.notAvailable')}
            </Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: primaryColor }]}
          onPress={handleConfirmAction}
          disabled={isExecuting}
        >
          <Text style={styles.primaryButtonText}>
            {isExecuting
              ? t('surfaces.جاري_التنفيذ')
              : t('shared.auto_delivery_action.stepTitleConfirm', {
                  action: getActionTitle(action),
                })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.secondaryButtonText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {t('shared.auto_delivery_action.verificationStepTitle')}
      </Text>

      <Text style={styles.stepDescription}>
        {t('shared.auto_delivery_action.verificationPrompt', {
          action: getActionTitle(action),
        })}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.codeInput}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder={t('shared.auto_delivery_action.placeholder')}
          keyboardType='numeric'
          maxLength={6}
          textAlign='center'
        />
      </View>

      <Text style={styles.verificationNote}>
        💡 {t('shared.auto_delivery_action.verificationNote')}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: primaryColor }]}
          onPress={handleVerificationSubmit}
          disabled={isExecuting || verificationCode.length < 4}
        >
          <Text style={styles.primaryButtonText}>
            {isExecuting
              ? t('surfaces.جاري_التحقق')
              : t('surfaces.تحقق_وتأكيد')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCurrentStep('confirmation')}
        >
          <Text style={styles.secondaryButtonText}>
            {t('shared.auto_delivery_action.backButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeedbackStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {t('shared.auto_delivery_action.feedbackStepTitle')}
      </Text>

      <Text style={styles.stepDescription}>
        {t('shared.auto_delivery_action.feedbackStepDescription')}
      </Text>

      {/* Rating Stars */}
      <View
        style={[
          styles.ratingContainer,
          { flexDirection: 'row', direction: layoutDirection },
        ]}
      >
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, rating >= star && styles.starSelected]}>
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Text */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.feedbackInput}
          value={feedback}
          onChangeText={setFeedback}
          placeholder={t('shared.auto_delivery_action.optionalLabel')}
          multiline
          numberOfLines={3}
          textAlignVertical='top'
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: primaryColor }]}
          onPress={handleFeedbackSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.primaryButtonText}>
            {t('shared.auto_delivery_action.submitRating')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={showSuccessAndNavigate}
        >
          <Text style={styles.skipButtonText}>
            {t('shared.auto_delivery_action.skipRating')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getActionDescription = (action: EntityAction): string => {
    const descriptions: Partial<Record<EntityAction, string>> = {
      pickup: t('shared.auto_delivery_action.descriptionPickup'),
      deliver: t('shared.auto_delivery_action.descriptionDeliver'),
      start: t('surfaces.سوف_تبدأ_عملية_النقل_أو_التنفيذ'),
      complete: t('surfaces.سوف_تنهي_العملية_وتعتبرها_مكتملة'),
    };
    return descriptions[action] || t('surfaces.أنت_على_وشك_تنفيذ_عملية_مهمة');
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !currentEntity) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || t('surfaces.فشل_في_تحميل_بيانات_الكيان')}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Platform-safe retry: use navigation for mobile, window for web
              if (navigation) {
                navigation.goBack();
                setTimeout(() => {
                  navigation.navigate(
                    route?.name || 'DeliveryAction',
                    route?.params
                  );
                }, 100);
              }
            }}
          >
            <Text style={styles.retryButtonText}>
              {t('shared.auto_delivery_action.retryButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((['confirmation', 'verification', 'completion', 'feedback'].indexOf(currentStep) + 1) / 4) * 100}%`,
                  backgroundColor: primaryColor,
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.stepIndicators,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <View
              style={[
                styles.stepIndicator,
                currentStep === 'confirmation' && styles.stepActive,
              ]}
            />
            <View
              style={[
                styles.stepIndicator,
                currentStep === 'verification' && styles.stepActive,
              ]}
            />
            <View
              style={[
                styles.stepIndicator,
                currentStep === 'completion' && styles.stepActive,
              ]}
            />
            <View
              style={[
                styles.stepIndicator,
                currentStep === 'feedback' && styles.stepActive,
              ]}
            />
          </View>
        </View>

        {/* Current Step Content */}
        {currentStep === 'confirmation' && renderConfirmationStep()}
        {currentStep === 'verification' && renderVerificationStep()}
        {currentStep === 'feedback' && renderFeedbackStep()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenWrapper>
  );
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
  progressContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  progressBar: {
    height: 4,
    backgroundColor: BTHWANI_COLORS.border,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: BTHWANI_RADIUS.sm,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: BTHWANI_COLORS.border,
  },
  stepActive: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  stepContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  actionIconContainer: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  actionIcon: {
    fontSize: 64,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  stepDescription: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: BTHWANI_SPACING.xl,
  },
  entitySummary: {
    backgroundColor: BTHWANI_COLORS.white,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.xl,
    ...CARD_SHADOW,
  },
  entityInfo: {
    fontSize: 14,
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  inputContainer: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.border,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 4,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.border,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  verificationNote: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  starButton: {
    padding: BTHWANI_SPACING.sm,
  },
  star: {
    fontSize: 32,
    color: BTHWANI_COLORS.gray300,
  },
  starSelected: {
    color: semanticRoles.accent, // Using semantic accent color instead of raw hex
  },
  buttonContainer: {
    gap: BTHWANI_SPACING.md,
  },
  primaryButton: {
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: BTHWANI_COLORS.white,
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.border,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: BTHWANI_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  skipButtonText: {
    color: BTHWANI_COLORS.textSecondary,
    fontSize: 14,
  },
  bottomSpacing: {
    height: BTHWANI_SPACING.xl,
  },
});
