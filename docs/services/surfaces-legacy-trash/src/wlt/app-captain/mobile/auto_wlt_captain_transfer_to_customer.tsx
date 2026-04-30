// تحويل فكه — من محفظة الكابتن إلى محفظة العميل
// Surface: app-captain | Service: wlt
// يقبل كود استلام مؤقت (4 أرقام) أو معرف المحفظة الكامل (BTHW-xxx). مبلغ + موافقة. لا هاتف ولا اسم.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoWltCaptainTransferToCustomerProps {
  navigation?: any;
}

export const AutoWltCaptainTransferToCustomer: React.FC<
  AutoWltCaptainTransferToCustomerProps
> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('content');
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');

  const handleScanCode = () => {
    // في الإنتاج: فتح كاميرا/قارئ QR وملء الحقل من النتيجة (4 أرقام أو BTHW-xxx)
    Alert.alert(
      t('surfaces.قراءة_كود_الاستلام'),
      'امسح الكود المعروض في تطبيق العميل (كود 4 أرقام) أو أدخل الأربعة أرقام يدوياً في الحقل أعلاه.',
      [{ text: 'حسناً' }]
    );
  };

  const handleTransfer = () => {
    if (!walletId.trim() || !amount) {
      setState('error');
      return;
    }
    const transferAmount = parseFloat(amount.replace(/,/g, ''));
    if (transferAmount < 1 || transferAmount > 5000) {
      setState('error');
      return;
    }
    setState('loading');
    setTimeout(() => {
      const mockSuccess = 0 > 0.15;
      setState(mockSuccess ? 'success' : 'error');
    }, 2500);
  };

  const handleRetry = () => setState('content');

  const quickAmounts = [50, 100, 200, 500, 1000];
  const canSubmit = walletId.trim().length > 0 && parseFloat(amount.replace(/,/g, '')) >= 1;

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>تحويل فكه</Text>
          <Text style={styles.subtitle}>
            تحويل الكفة المتبقية من محفظتك إلى محفظة العميل (مسح كود الاستلام أو إدخال رقم المحفظة)
          </Text>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
            <Text style={styles.balanceAmount}>245.50 ريال</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>كود الاستلام أو رقم المحفظة</Text>
            <View style={[styles.walletIdRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <TextInput
                style={styles.walletIdInput}
                placeholder={t('wlt.app-captain.mobile.auto_wlt_captain_transfer_to_customer.4')}
                placeholderTextColor={BTHWANI_COLORS.onSurfaceMuted}
                value={walletId}
                onChangeText={setWalletId}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={14}
              />
              <TouchableOpacity style={styles.scanButton} onPress={handleScanCode} activeOpacity={0.8}>
                <Text style={styles.scanIcon}>📷</Text>
                <Text style={styles.scanLabel}>قراءة الكود</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>مبلغ التحويل (ريال)</Text>
            <View style={[styles.quickAmountsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.quickAmountButton, amount === amt.toString() && styles.selectedAmount]}
                  onPress={() => setAmount(amt.toString())}
                >
                  <Text style={[styles.quickAmountText, amount === amt.toString() && styles.selectedAmountText]}>{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder={t('wlt.app-captain.mobile.auto_wlt_captain_transfer_to_customer.placeholder')}
              placeholderTextColor={BTHWANI_COLORS.onSurfaceMuted}
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.transferButton, !canSubmit && styles.disabledButton]}
            onPress={handleTransfer}
            disabled={!canSubmit}
          >
            <Text style={[styles.transferText, !canSubmit && styles.disabledText]}>موافقة وتحويل</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_التحويل')}
      errorMessage={t('surfaces.فشل_التحويل_تحقق_من_رقم_المحفظة_والم')}
      onErrorAction={handleRetry}
      successMessage={t('wlt.app-captain.mobile.auto_wlt_captain_transfer_to_customer.successAmountTemplate', { amount })}
      successActionText={t('surfaces.العودة_للمحفظة')}
      onSuccessAction={() => navigation?.goBack?.() ?? setState('content')}
      screenName="auto_wlt_captain_transfer_to_customer"
      operationName="wlt_captain_transfer_to_customer"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BTHWANI_COLORS.surfaceSubtle },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 14,
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
  balanceLabel: { color: BTHWANI_COLORS.onPrimary, fontSize: 14, marginBottom: BTHWANI_SPACING.sm },
  balanceAmount: { color: BTHWANI_COLORS.onPrimary, fontSize: 24, fontWeight: '700' },
  section: { padding: BTHWANI_SPACING.contentH },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  walletIdRow: { flexDirection: 'row', alignItems: 'center', gap: BTHWANI_SPACING.md },
  walletIdInput: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
    color: BTHWANI_COLORS.onSurface,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.primary,
    minWidth: 90,
  },
  scanIcon: { fontSize: 24, marginBottom: 2 },
  scanLabel: { fontSize: 11, fontWeight: '600', color: BTHWANI_COLORS.primary },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  quickAmountButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
  },
  selectedAmount: { backgroundColor: BTHWANI_COLORS.primary, borderColor: BTHWANI_COLORS.primary },
  quickAmountText: { fontSize: 14, fontWeight: '600', color: BTHWANI_COLORS.onSurface },
  selectedAmountText: { color: BTHWANI_COLORS.onPrimary },
  amountInput: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.outline,
    color: BTHWANI_COLORS.onSurface,
  },
  transferButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: BTHWANI_COLORS.onSurfaceMuted },
  transferText: { color: BTHWANI_COLORS.onPrimary, fontSize: 18, fontWeight: '600' },
  disabledText: { color: BTHWANI_COLORS.surface },
});

export default AutoWltCaptainTransferToCustomer;
