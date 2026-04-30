// Auto-generated screen for dsh_captain_tier_evaluate
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/captains/{captainId}/tier/evaluate
// Description: Evaluate DSH captain tier

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { postEvaluateDshCaptainTier } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface AutoDshCaptainTierEvaluateProps {
  navigation?: any;
  route?: {
    params?: {
      captainId: string;
    };
  };
}

export const AutoDshCaptainTierEvaluate: React.FC<AutoDshCaptainTierEvaluateProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [evaluationPeriod, setEvaluationPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [forceEvaluation, setForceEvaluation] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const captainId = route?.params?.captainId || '';

  const handleEvaluate = async () => {
    if (isEvaluating) return;

    setIsEvaluating(true);
    try {
      const success = await postEvaluateDshCaptainTier(evaluationPeriod, forceEvaluation);
      if (!success) throw new Error('فشل في التقييم');
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.successMessage'),
        t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.tierEvaluatedSuccess'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.okButton'), onPress: () => navigation?.navigate('dsh_captain_tier_info', { captainId }) }]
      );
    } catch (error) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.errorMessage'), t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.errorMessage'));
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>تقييم المستوى</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            قم بتقييم مستوى الكابتن بناءً على الأداء
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>فترة التقييم</Text>
            <View style={styles.optionsContainer}>
              {(['monthly', 'quarterly', 'annual'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.optionButton,
                    evaluationPeriod === period && styles.optionButtonActive
                  ]}
                  onPress={() => setEvaluationPeriod(period)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    evaluationPeriod === period && styles.optionTextActive
                  ]}>
                    {period === 'monthly' ? t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.quarterly') : period === 'quarterly' ? t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.quarterly') : 'سنوي'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setForceEvaluation(!forceEvaluation)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, forceEvaluation && styles.checkboxChecked]}>
                {forceEvaluation && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, textAlignStart]}>
                فرض التقييم حتى لو لم يحن موعده
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.evaluateButton, isEvaluating && styles.evaluateButtonDisabled]}
            onPress={handleEvaluate}
            disabled={isEvaluating}
            activeOpacity={0.8}
          >
            <Text style={styles.evaluateButtonText}>
              {isEvaluating ? t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.startEvaluation') : t('dsh.app-captain.mobile.auto_dsh_captain_tier_evaluate.startEvaluation')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  optionButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  optionText: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  optionTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BTHWANI_RADIUS.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    marginStart: BTHWANI_SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  checkmark: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  evaluateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  evaluateButtonDisabled: {
    opacity: 0.5,
  },
  evaluateButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainTierEvaluate;

