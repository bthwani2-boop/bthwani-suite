// طلب سحب — شاشة مبسطة للشريك/الكابتن/الميداني فقط (غير متاحة في تطبيق العميل)
// §86 Smart Defaults + CTA واحد: زر "إرسال طلب السحب" + حقل مبلغ اختياري (مخزون الحساب من النظام)
// Surface: app-client (used by partner/captain/field route maps)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_wlt_withdraw_requestProps {
  onSuccessNavigate?: () => void;
}

const AVAILABLE_BALANCE = 245.5;
const MIN_WITHDRAW = 10;

export const auto_wlt_withdraw_request: React.FC<auto_wlt_withdraw_requestProps> = ({ onSuccessNavigate }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('content');
  const [amount, setAmount] = useState('');

  const numAmount = amount ? parseFloat(amount) : 0;
  const isValid = numAmount >= MIN_WITHDRAW && numAmount <= AVAILABLE_BALANCE;
  const canSubmit = amount === '' || isValid;

  const handleSubmit = () => {
    if (amount && !isValid) return;
    setState('loading');
    setTimeout(() => {
      const mockSuccess = 0 > 0.25;
      setState(mockSuccess ? 'success' : 'error');
    }, 1500);
  };

  const handleRetry = () => setState('content');
  const handleSuccessAction = () => {
    setState('content');
    setAmount('');
    onSuccessNavigate?.();
  };

  const quickAmounts = [50, 100, 200, 500];

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('wlt.withdraw_request_title')}</Text>
          <Text style={styles.subtitle}>{t('wlt.withdraw_request_subtitle')}</Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t('wlt.withdraw_balance_label')}</Text>
            <Text style={styles.balanceAmount}>{t('wlt.withdraw_balance_amount', { amount: AVAILABLE_BALANCE.toFixed(2) })}</Text>
            <Text style={styles.minWithdraw}>{t('wlt.withdraw_min_label', { amount: MIN_WITHDRAW })}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('wlt.withdraw_amount_optional')}</Text>
            <View style={[styles.quickAmountsRow, { flexDirection: 'row', direction: layoutDirection }]}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.quickBtn, amount === String(amt) && styles.quickBtnSelected]}
                  onPress={() => setAmount(String(amt))}
                >
                  <Text style={[styles.quickBtnText, amount === String(amt) && styles.quickBtnTextSelected]}>{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder={t('wlt.withdraw_amount_placeholder')}
              value={amount}
              onChangeText={(val) => setAmount(val.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>

          <TouchableOpacity
            style={[styles.cta, !canSubmit && styles.ctaDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.ctaText, !canSubmit && styles.ctaTextDisabled]}>{t('wlt.withdraw_submit_button')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('wlt.withdraw_loading')}
      errorMessage={t('wlt.withdraw_error')}
      onErrorAction={handleRetry}
      successMessage={amount ? t('wlt.withdraw_success', { amount }) : t('wlt.withdraw_success_short')}
      successActionText={t('common.ok')}
      onSuccessAction={handleSuccessAction}
      screenName="auto_wlt_withdraw_request"
      operationName="wlt_withdraw_request"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    paddingTop: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  balanceCard: {
    backgroundColor: BTHWANI_COLORS.primary,
    marginHorizontal: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  balanceLabel: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 12,
    marginBottom: BTHWANI_SPACING.xs,
  },
  balanceAmount: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 26,
    fontWeight: '700',
  },
  minWithdraw: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 11,
    opacity: 0.9,
    marginTop: BTHWANI_SPACING.xs,
  },
  section: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickBtn: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  quickBtnSelected: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderColor: BTHWANI_COLORS.primary,
  },
  quickBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  quickBtnTextSelected: {
    color: BTHWANI_COLORS.onPrimary,
  },
  amountInput: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  cta: {
    backgroundColor: BTHWANI_COLORS.primary,
    marginHorizontal: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  ctaTextDisabled: {
    color: BTHWANI_COLORS.onPrimary,
  },
});

export default auto_wlt_withdraw_request;

