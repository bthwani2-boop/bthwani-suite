import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface KnzPromotionSheetProps {
  visible: boolean;
  listingId: string;
  onClose: () => void;
}

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

export const KnzPromotionSheet: React.FC<KnzPromotionSheetProps> = ({
  visible,
  listingId,
  onClose,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<'content' | 'loading' | 'success' | 'error'>('content');
  const [selectedDuration, setSelectedDuration] = useState<number>(7);

  if (!visible) return null;

  const promote = async () => {
    try {
      setState('loading');
      const baseUrl = getBaseUrl();
      const res = await rawFetch(
        `${baseUrl}/api/knz/listings/${encodeURIComponent(listingId)}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            durationDays: selectedDuration,
            promotionLevel: 'standard',
          }),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في تفعيل الترويج');
      setState('success');
      setTimeout(() => {
        onClose();
        setState('content');
      }, 1200);
    } catch {
      setState('error');
    }
  };

  if (state === 'loading' || state === 'error' || state === 'success') {
    return (
      <View style={styles.overlay}>
        <ScreenWrapper
          state={state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'success'}
          loadingMessage={t('knz.app-client.mobile.KnzPromotionSheet.loadingMessage')}
          errorMessage={t('knz.app-client.mobile.KnzPromotionSheet.errorMessage')}
          successMessage={t('knz.app-client.mobile.KnzPromotionSheet.successMessage')}
          onErrorAction={() => setState('content')}
          screenName="KnzPromotionSheet"
          operationName="knz_listing_promote"
        />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>ترقية الإعلان (ممول)</Text>
        <Text style={styles.subtitle}>
          هذه خدمة مدفوعة بينك وبين المنصة فقط، لا علاقة لها بثمن السلعة بينك وبين المشتري.
        </Text>

        <Text style={styles.sectionLabel}>مدة الترويج</Text>
        <View style={[styles.chipsRow, { flexDirection: 'row', direction: layoutDirection }]}>
          {[7, 14, 30].map((days) => (
            <TouchableOpacity
              key={days}
              style={[
                styles.chip,
                selectedDuration === days && styles.chipSelected,
              ]}
              onPress={() => setSelectedDuration(days)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDuration === days && styles.chipTextSelected,
                ]}
              >
                {days} يوم
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.note}>
          السعر النهائي ورسوم الترويج تُحدّد في منتج المنصة؛ هذه الواجهة لا تقوم بأي دفع داخل التطبيق.
        </Text>

        <View style={[styles.actionsRow, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryText}>إلغاء</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={promote}>
            <Text style={styles.primaryText}>تأكيد الترويج</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    backgroundColor: BTHWANI_COLORS.overlay38,
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  chip: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  chipText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  chipTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  note: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  primaryButton: {
    flex: 1,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
  },
});


