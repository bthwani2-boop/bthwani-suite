import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { EsfBottomSheet } from './EsfBottomSheet';

export const DEFAULT_ESF_DONATION_ELIGIBILITY_ITEMS = [
  'أن تكون بصحة عامة جيدة اليوم ولا تعاني حرارة أو أعراض مرضية حالية.',
  'أن تكون قد أكملت المدة الدنيا منذ آخر تبرع بالدم حسب سياسة جهة الدم المحلية.',
  'ألا توجد لديك عدوى أو مانع طبي أو مرض قد يمنع التبرع الآمن.',
  'ألا يوجد سبب تأجيل مؤقت حديث مثل حمل أو ولادة أو وشم أو ثقب أو إجراء طبي حديث.',
  'أن يكون عمرك ووزنك وحالتك الصحية ضمن المعايير المعتمدة لدى جهة التبرع.',
] as const;

export type EsfDonationEligibilityCopy = {
  title: string;
  subtitle: string;
  note: string;
  confirmLabel: string;
  cancelLabel: string;
  activatingLabel: string;
};

export const DEFAULT_ESF_DONATION_ELIGIBILITY_COPY: EsfDonationEligibilityCopy =
  {
    title: 'قبل تفعيل الجاهزية للتبرع',
    subtitle:
      'راجع هذه الاشتراطات العامة أولًا. عند الموافقة سيتم تشغيل الجاهزية مباشرة.',
    note: 'مرجع الشروط العامة مستند إلى WHO وإرشادات NHS Blood and Transplant، لكن الحسم النهائي يكون حسب بروتوكول جهة الدم المحلية.',
    confirmLabel: 'أوافق وتفعيل الجاهزية',
    cancelLabel: 'ليس الآن',
    activatingLabel: 'جارٍ التفعيل...',
  };

interface EsfDonationEligibilitySheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming?: boolean;
  items?: readonly string[];
  title?: string;
  subtitle?: string;
  note?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  activatingLabel?: string;
}

export const EsfDonationEligibilitySheet: React.FC<
  EsfDonationEligibilitySheetProps
> = ({
  visible,
  onClose,
  onConfirm,
  confirming = false,
  items = DEFAULT_ESF_DONATION_ELIGIBILITY_ITEMS,
  title = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.title,
  subtitle = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.subtitle,
  note = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.note,
  confirmLabel = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.confirmLabel,
  cancelLabel = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.cancelLabel,
  activatingLabel = DEFAULT_ESF_DONATION_ELIGIBILITY_COPY.activatingLabel,
}) => {
  return (
    <EsfBottomSheet
      visible={visible}
      onClose={onClose}
      height='large'
      title={title}
    >
      <View style={styles.content}>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={`${index}-${item}`} style={styles.itemCard}>
              <View style={styles.itemIndexBadge}>
                <Text style={styles.itemIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.itemCopy}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{note}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClose}
            disabled={confirming}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>{cancelLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onConfirm}
            disabled={confirming}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {confirming ? activatingLabel : confirmLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </EsfBottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: BTHWANI_SPACING.md,
    paddingBottom: BTHWANI_SPACING.md,
  },
  subtitle: {
    fontSize: BTHWANI_SPACING.md,
    lineHeight: BTHWANI_SPACING.lg,
    color: semanticRoles.textMuted,
  },
  itemsList: {
    gap: BTHWANI_SPACING.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.sm,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  itemIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  itemIndexText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.sm,
    fontWeight: '800',
  },
  itemCopy: {
    flex: 1,
  },
  itemText: {
    fontSize: BTHWANI_SPACING.sm + 1,
    lineHeight: BTHWANI_SPACING.md + 4,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  noteCard: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.stateWarning.background,
  },
  noteText: {
    fontSize: BTHWANI_SPACING.sm + 1,
    lineHeight: BTHWANI_SPACING.md + 4,
    color: semanticRoles.text,
  },
  actions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  secondaryButtonText: {
    color: semanticRoles.text,
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1.4,
    minHeight: 48,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_SPACING.md,
    fontWeight: '800',
  },
});
