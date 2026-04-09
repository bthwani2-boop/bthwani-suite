// ESF Match Get — detail + accept/decline via decision component
// Surface: app-client | Service: esf

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildEsfMatchPreviewMock } from '../../hooks';
import { EsfMatchDecisionSheet } from './components/EsfMatchDecisionSheet';
import type { EsfContactMethod } from '../../uiTypes';

function getContactMethodMeta(method?: EsfContactMethod): {
  icon: string;
  label: string;
  hint: string;
} {
  switch (method) {
    case 'whatsapp':
      return {
        icon: '📱',
        label: 'واتساب',
        hint: 'يظهر هذا الخيار هنا للمتبرع لأن الطلب يسمح بالتواصل عبر واتساب.',
      };
    case 'phone':
      return {
        icon: '☎️',
        label: 'هاتف',
        hint: 'الاتصال المباشر يظهر هنا عندما يكون هو القناة المعتمدة للطلب.',
      };
    case 'in_app':
    default:
      return {
        icon: '💬',
        label: 'دردشة داخلية',
        hint: 'أيقونة الدردشة تظهر هنا داخل تفاصيل التطابق لأنها المكان الصحيح للتواصل الفعلي.',
      };
  }
}

interface auto_esf_match_getProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route?: { params?: { matchId?: string } };
}

export const auto_esf_match_get: React.FC<auto_esf_match_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();

  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

  const matchId = route?.params?.matchId || '';

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      const nav = navigation?.navigate as
        | ((s: string, p?: Record<string, unknown>) => void)
        | undefined;
      if (nav) nav(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const matchPreview = useMemo(
    () => buildEsfMatchPreviewMock(t, matchId || 'MATCH-001'),
    [t, matchId]
  );
  const contactMeta = useMemo(
    () => getContactMethodMeta(matchPreview.contactMethod),
    [matchPreview.contactMethod]
  );

  return (
    <ScreenWrapper state='content'>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          {t('esf.app-client.mobile.auto_esf_match_get.title')}
        </Text>
        <Text style={styles.matchId}>
          {matchId
            ? t('esf.app-client.mobile.auto_esf_match_get.matchId', {
                id: matchId,
              })
            : t('esf.app-client.mobile.auto_esf_match_get.loadingMessage')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('esf.app-client.mobile.auto_esf_match_accept.matchId', {
              id: matchPreview.id,
            })}
          </Text>

          <View style={styles.card}>
            <View style={styles.bloodTypeRow}>
              <View
                style={[
                  styles.bloodTypeBadge,
                  { backgroundColor: semanticRoles.stateError.icon },
                ]}
              >
                <Text style={styles.bloodTypeText}>
                  {matchPreview.requestBloodType}
                </Text>
              </View>
              <View style={styles.requestInfo}>
                <Text style={styles.unitsText}>
                  {t(
                    'esf.app-client.mobile.auto_esf_match_accept.unitsRequired',
                    {
                      count: matchPreview.requestUnits,
                    }
                  )}
                </Text>
                <Text style={styles.hospitalName}>
                  {matchPreview.donorName}
                </Text>
                <Text style={[styles.locationText, textAlignStart]}>
                  {matchPreview.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>سبب الحاجة</Text>
          <View style={styles.card}>
            <View style={styles.reasonBadge}>
              <Text style={styles.reasonBadgeText}>
                {matchPreview.medicalReasonLabel || 'سبب طبي غير محدد'}
              </Text>
            </View>
            {matchPreview.medicalReasonNote ? (
              <Text style={[styles.reasonNote, textAlignStart]}>
                {matchPreview.medicalReasonNote}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التواصل المتاح</Text>
          <View style={styles.card}>
            <View style={styles.contactMethodCard}>
              <Text style={styles.contactMethodIcon}>{contactMeta.icon}</Text>
              <View style={styles.contactMethodCopy}>
                <Text style={styles.contactMethodTitle}>
                  {contactMeta.label}
                </Text>
                <Text style={[styles.contactMethodHint, textAlignStart]}>
                  {contactMeta.hint}
                </Text>
              </View>
            </View>
            {matchPreview.contactMethod !== 'in_app' &&
            matchPreview.contactInfo ? (
              <Text style={[styles.contactValue, textAlignStart]}>
                {matchPreview.contactInfo}
              </Text>
            ) : null}
          </View>
        </View>

        <EsfMatchDecisionSheet
          matchId={matchId}
          matchPreview={matchPreview}
          onViewMatchesInbox={() => handleNavigate('EsfMatchesInbox')}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  matchId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  section: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bloodTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodTypeBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 20,
    fontWeight: '700',
  },
  requestInfo: {
    flex: 1,
  },
  reasonBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateError.background,
    marginBottom: BTHWANI_SPACING.sm,
  },
  reasonBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: semanticRoles.stateError.icon,
  },
  reasonNote: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  unitsText: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  contactMethodIcon: {
    fontSize: 22,
  },
  contactMethodCopy: {
    flex: 1,
    gap: 2,
  },
  contactMethodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  contactMethodHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  contactValue: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
});

export default auto_esf_match_get;

