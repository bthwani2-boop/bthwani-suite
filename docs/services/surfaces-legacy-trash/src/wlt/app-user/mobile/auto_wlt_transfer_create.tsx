// Auto-generated screen for wlt_transfer_create
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface auto_wlt_transfer_createProps {}

export const auto_wlt_transfer_create: React.FC<
  auto_wlt_transfer_createProps
> = props => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? 'rtl' : 'ltr';
  const transfertypes = useMemo(
    () => [
      { id: 'phone', label: t('wlt.app-client.mobile.auto_wlt_transfer_create.phoneNumber'), icon: '📱' },
      { id: 'wallet', label: t('wlt.app-client.mobile.auto_wlt_transfer_create.walletNumber'), icon: '💳' },
      { id: 'bank', label: t('wlt.app-client.mobile.auto_wlt_transfer_create.bankAccountNumber'), icon: '🏦' },
    ],
    [t]
  );
  const [state, setState] = useState<ScreenState>('content');
  const [amount, setAmount] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [transferType, setTransferType] = useState('phone');

  const handleTransfer = () => {
    if (
      !amount ||
      !recipientPhone ||
      (transferType === 'phone' && !recipientName)
    ) {
      setState('error');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount < 1 || transferAmount > 5000) {
      setState('error');
      return;
    }

    setState('loading');
    setTimeout(() => {
      // Simulate transfer success (85% success rate)
      const mockSuccess = 0 > 0.15;
      setState(mockSuccess ? 'success' : 'error');
    }, 2500);
  };

  const handleRetry = () => {
    setState('content');
  };


  const quickAmounts = [50, 100, 200, 500, 1000];

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>تحويل رصيد</Text>
          <Text style={styles.subtitle}>أرسل أموالاً بسهولة وأمان</Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
            <Text style={styles.balanceAmount}>245.50 ريال</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نوع التحويل</Text>
            <View style={[styles.transfertypes, { flexDirection: 'row', direction: layoutDirection }]}>
              {transfertypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.transferTypeCard,
                    transferType === type.id && styles.selectedTransferType,
                  ]}
                  onPress={() => setTransferType(type.id)}
                >
                  <Text style={styles.transferIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.transferLabel,
                      transferType === type.id && styles.selectedTransferLabel,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات المستلم</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {transferType === 'phone'
                  ? 'رقم الهاتف'
                  : transferType === 'wallet'
                    ? t('surfaces.رقم_المحفظة')
                    : t('surfaces.رقم_الحساب_البنكي')}{' '}
                *
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  transferType === 'phone'
                    ? '05xxxxxxxx'
                    : transferType === 'wallet'
                      ? 'رقم المحفظة'
                      : t('surfaces.رقم_الحساب')
                }
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                keyboardType={
                  transferType === 'phone' ? 'phone-pad' : 'default'
                }
              />
            </View>

            {transferType === 'phone' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>اسم المستلم *</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('wlt.app-client.mobile.auto_wlt_transfer_create.fullName')}
                  value={recipientName}
                  onChangeText={setRecipientName}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مبلغ التحويل</Text>

            <View style={[styles.quickAmountsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {quickAmounts.map(amt => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.quickAmountButton,
                    amount === amt.toString() && styles.selectedAmount,
                  ]}
                  onPress={() => setAmount(amt.toString())}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === amt.toString() && styles.selectedAmountText,
                    ]}
                  >
                    {amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customAmount}>
              <Text style={styles.customLabel}>أو أدخل مبلغ مخصص</Text>
              <TextInput
                style={styles.amountInput}
                placeholder={t('wlt.app-client.mobile.auto_wlt_transfer_create.placeholder')}
                value={amount}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9.]/g, '');
                  setAmount(numericText);
                }}
                keyboardType='numeric'
                maxLength={6}
              />
              <Text style={styles.currencyLabel}>ريال</Text>
            </View>
          </View>

          <View style={styles.feesCard}>
            <Text style={styles.feesTitle}>تفاصيل الرسوم</Text>
            <View style={[styles.feeRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.feeLabel}>مبلغ التحويل</Text>
              <Text style={styles.feeValue}>{amount || '0'} ريال</Text>
            </View>
            <View style={[styles.feeRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.feeLabel}>رسوم التحويل</Text>
              <Text style={styles.feeValue}>مجاني</Text>
            </View>
            <View style={[styles.feeRow, styles.totalRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.totalLabel}>المجموع</Text>
              <Text style={styles.totalValue}>{amount || '0'} ريال</Text>
            </View>
          </View>

          <View style={[styles.securityBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              جميع التحويلات محمية بتشفير 256-bit
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.transferButton,
              (!amount ||
                !recipientPhone ||
                (transferType === 'phone' && !recipientName)) &&
                styles.disabledButton,
            ]}
            onPress={handleTransfer}
            disabled={
              !amount ||
              !recipientPhone ||
              (transferType === 'phone' && !recipientName)
            }
          >
            <Text
              style={[
                styles.transferText,
                (!amount ||
                  !recipientPhone ||
                  (transferType === 'phone' && !recipientName)) &&
                  styles.disabledText,
              ]}
            >
              تحويل الرصيد
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_معالجة_التحويل')}
      errorMessage={t('surfaces.فشل_في_إرسال_التحويل_يرجى_التأكد_من')}
      onErrorAction={handleRetry}
      successMessage={`تم تحويل ${amount} ريال بنجاح!`}
      successActionText='العودة للمحفظة'
      onSuccessAction={() => setState('content')}
      screenName='auto_wlt_transfer_create'
      operationName='wlt_transfer_create'
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
    fontSize: 24,
    fontWeight: '700',
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
  transfertypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transferTypeCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  selectedTransferType: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.success['50'],
  },
  transferIcon: {
    fontSize: 24,
    marginBottom: BTHWANI_SPACING.sm,
  },
  transferLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
  },
  selectedTransferLabel: {
    color: BTHWANI_COLORS.primary,
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
    width: '30%',
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
    width: 120,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  currencyLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
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
    alignItems: 'center',
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
  },
  transferButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.onSurfaceMuted,
  },
  transferText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: BTHWANI_COLORS.surface,
  },
});

export default auto_wlt_transfer_create;

