// Auto-generated screen for amn_captain_tier_evaluate
// Surface: app-captain | Service: amn
// Operation: POST /api/amn/captains/{captainId}/tier/evaluate
// Description: Evaluate AMN captain tier (performance-based)

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoAmnCaptainTierEvaluateProps {
  navigation?: any;
  route?: {
    params?: {
      captainId: string;
    };
  };
}

export const AutoAmnCaptainTierEvaluate: React.FC<
  AutoAmnCaptainTierEvaluateProps
> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [evaluationCriteria, setEvaluationCriteria] = useState({
    tripCompletionRate: '',
    averageRating: '',
    customerComplaints: '',
    onTimeDelivery: '',
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const captainId = route?.params?.captainId || '';

  const handleEvaluate = async () => {
    if (isEvaluating) return;

    setIsEvaluating(true);
    try {
      // Backend integration call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(`✅ ${t('surfaces.rating_done')}`, t('surfaces.rating_success'), [
        {
          text: t('common.ok'),
          onPress: () =>
            navigation?.navigate('amn_captain_tier_info', { captainId }),
        },
      ]);
    } catch (error) {
      Alert.alert(t('common.error'), t('surfaces.error_during_rating'));
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <ScreenWrapper state='content'>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>تقييم المستوى</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            قم بتقييم مستوى الكابتن بناءً على معايير الأداء
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>معايير التقييم (اختياري)</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStart]}>معدل إكمال الرحلات (%)</Text>
              <TextInput
                style={[styles.input, textAlignStart]}
                placeholder='0-100'
                placeholderTextColor={semanticRoles.textMuted}
                value={evaluationCriteria.tripCompletionRate}
                onChangeText={text =>
                  setEvaluationCriteria({
                    ...evaluationCriteria,
                    tripCompletionRate: text,
                  })
                }
                keyboardType='numeric'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStart]}>متوسط التقييم</Text>
              <TextInput
                style={[styles.input, textAlignStart]}
                placeholder='0-5'
                placeholderTextColor={semanticRoles.textMuted}
                value={evaluationCriteria.averageRating}
                onChangeText={text =>
                  setEvaluationCriteria({
                    ...evaluationCriteria,
                    averageRating: text,
                  })
                }
                keyboardType='numeric'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStart]}>شكاوى العملاء</Text>
              <TextInput
                style={[styles.input, textAlignStart]}
                placeholder='0'
                placeholderTextColor={semanticRoles.textMuted}
                value={evaluationCriteria.customerComplaints}
                onChangeText={text =>
                  setEvaluationCriteria({
                    ...evaluationCriteria,
                    customerComplaints: text,
                  })
                }
                keyboardType='numeric'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStart]}>التسليم في الوقت المحدد (%)</Text>
              <TextInput
                style={[styles.input, textAlignStart]}
                placeholder='0-100'
                placeholderTextColor={semanticRoles.textMuted}
                value={evaluationCriteria.onTimeDelivery}
                onChangeText={text =>
                  setEvaluationCriteria({
                    ...evaluationCriteria,
                    onTimeDelivery: text,
                  })
                }
                keyboardType='numeric'
              />
            </View>
          </View>

          <Text style={[styles.note, textAlignStart]}>
            ملاحظة: إذا تركت الحقول فارغة، سيتم استخدام البيانات الفعلية من
            النظام
          </Text>

          <TouchableOpacity
            style={[
              styles.evaluateButton,
              isEvaluating && styles.evaluateButtonDisabled,
            ]}
            onPress={handleEvaluate}
            disabled={isEvaluating}
            activeOpacity={0.8}
          >
            <Text style={styles.evaluateButtonText}>
              {isEvaluating ? t('amn.app-captain.mobile.auto_amn_captain_tier_evaluate.startEvaluation') : t('amn.app-captain.mobile.auto_amn_captain_tier_evaluate.startEvaluation')}
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
  inputGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  note: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
    fontStyle: 'italic',
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

export default AutoAmnCaptainTierEvaluate;
