// Auto-generated screen for wlt_payout_request
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface auto_wlt_payout_requestProps {
  
}

export const auto_wlt_payout_request: React.FC<auto_wlt_payout_requestProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('content');
  const [amount, setAmount] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [description, setDescription] = useState('');

  const handlePayoutRequest = () => {
    if (!amount || !recipientPhone || !recipientName) {
      setState('error');
      return;
    }

    const payoutAmount = parseFloat(amount);
    const availableBalance = 245.50;
    const minPayout = 5;

    if (payoutAmount < minPayout || payoutAmount > availableBalance) {
      setState('error');
      return;
    }

    setState('loading');
    setTimeout(() => {
      // Simulate payout request success (80% success rate)
      const mockSuccess = 0 > 0.2;
      setState(mockSuccess ? 'success' : 'error');
    }, 2500);
  };

  const handleRetry = () => {
    setState('content');
  };

  const quickAmounts = [10, 25, 50, 100];

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>طلب دفعة</Text>
          <Text style={styles.subtitle}>إرسال أموال لمزودي الخدمات والمتاجر</Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.balanceLabel')}</Text>
            <Text style={styles.balanceAmount}>{t('wlt.app-client.mobile.auto_wlt_payout_request.balanceAmount', { amount: '245.50' })}</Text>
            <Text style={styles.minPayout}>{t('wlt.app-client.mobile.auto_wlt_payout_request.minPayout', { amount: 5 })}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('wlt.app-client.mobile.auto_wlt_payout_request.sectionTitleAmount')}</Text>

            <View style={[styles.quickAmountsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.quickAmountButton, amount === amt.toString() && styles.selectedAmount]}
                  onPress={() => setAmount(amt.toString())}
                >
                  <Text style={[styles.quickAmountText, amount === amt.toString() && styles.selectedAmountText]}>
                    {amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customAmount}>
              <Text style={styles.customLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.customLabel')}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder={t('wlt.app-client.mobile.auto_wlt_payout_request.placeholder')}
                value={amount}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9.]/g, '');
                  setAmount(numericText);
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.currencyLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.currencyLabel')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('wlt.app-client.mobile.auto_wlt_payout_request.sectionTitleRecipient')}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.phoneLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('wlt.app-client.mobile.auto_wlt_payout_request.phonePlaceholder')}
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recipientNameLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('wlt.app-client.mobile.auto_wlt_payout_request.storeOrCompanyName')}
                value={recipientName}
                onChangeText={setRecipientName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.descriptionLabel')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('wlt.app-client.mobile.auto_wlt_payout_request.placeholder_132')}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </View>

          <View style={styles.recentRecipients}>
            <Text style={styles.sectionTitle}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recentRecipientsTitle')}</Text>
            <TouchableOpacity style={[styles.recipientCard, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.recipientIcon}>🏪</Text>
              <View style={styles.recipientInfo}>
              <Text style={styles.recipientNameSmall}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recipient1Name')}</Text>
              <Text style={styles.recipientPhoneSmall}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recipient1Phone')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.recipientCard, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.recipientIcon}>🚗</Text>
              <View style={styles.recipientInfo}>
              <Text style={styles.recipientNameSmall}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recipient2Name')}</Text>
              <Text style={styles.recipientPhoneSmall}>{t('wlt.app-client.mobile.auto_wlt_payout_request.recipient2Phone')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.feesCard}>
            <Text style={styles.feesTitle}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feesTitle')}</Text>
            <View style={[styles.feeRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.feeLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeLabelAmount')}</Text>
              <Text style={styles.feeValue}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeValueAmount', { amount: amount || '0' })}</Text>
            </View>
            <View style={[styles.feeRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.feeLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeLabelService')}</Text>
              <Text style={styles.feeValue}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeValueService')}</Text>
            </View>
            <View style={[styles.feeRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.feeLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeLabelProcessingTime')}</Text>
              <Text style={styles.feeValue}>{t('wlt.app-client.mobile.auto_wlt_payout_request.feeValueProcessingTime')}</Text>
            </View>
            <View style={[styles.feeRow, styles.totalRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.totalLabel}>{t('wlt.app-client.mobile.auto_wlt_payout_request.totalLabel')}</Text>
              <Text style={styles.totalValue}>{t('wlt.app-client.mobile.auto_wlt_payout_request.totalValue', { amount: amount || '0' })}</Text>
            </View>
          </View>

          <View style={[styles.securityBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.securityIcon}>🛡️</Text>
            <Text style={styles.securityText}>
              {t('wlt.app-client.mobile.auto_wlt_payout_request.securityText')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payoutButton, (!amount || !recipientPhone || !recipientName) && styles.disabledButton]}
            onPress={handlePayoutRequest}
            disabled={!amount || !recipientPhone || !recipientName}
          >
            <Text style={[styles.payoutText, (!amount || !recipientPhone || !recipientName) && styles.disabledText]}>
              {t('wlt.app-client.mobile.auto_wlt_payout_request.payoutButtonText')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_إرسال_الدفعة')}
      errorMessage={t('surfaces.فشل_في_إرسال_الدفعة')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_إرسال_الدفعة_بنجاح', { amount })}
      successActionText={t('surfaces.العودة_إلى_المحفظة')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_payout_request"
      operationName="wlt_payout_request"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  balanceCard: {
    backgroundColor: BTHWANI_COLORS.primary,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 14,
    marginBottom: BTHWANI_SPACING.sm,
  },
  balanceAmount: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: BTHWANI_SPACING.xs,
  },
  minPayout: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 12,
    opacity: 0.9,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.lg,
  },
  quickAmountButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    margin: BTHWANI_SPACING.xs,
    width: '22%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  selectedAmount: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderColor: BTHWANI_COLORS.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  selectedAmountText: {
    color: BTHWANI_COLORS.onPrimary,
  },
  customAmount: {
    alignItems: 'center',
  },
  customLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  amountInput: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: 100,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  currencyLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  recentRecipients: {
    padding: BTHWANI_SPACING.contentH,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  recipientIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientNameSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  recipientPhoneSmall: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  feesCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  feeLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  feeValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  securityBanner: {
    backgroundColor: colorTokens.primary['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colorTokens.primary['500'],
  },
  securityIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: colorTokens.primary['800'],
    fontWeight: '600',
    lineHeight: 20,
  },
  payoutButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.onSurfaceMuted,
  },
  payoutText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: BTHWANI_COLORS.surface,
  },
});

export default auto_wlt_payout_request;

