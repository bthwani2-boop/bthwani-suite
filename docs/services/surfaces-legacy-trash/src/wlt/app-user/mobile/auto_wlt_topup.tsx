// Auto-generated screen for wlt_topup
// Surface: app-client | Service: wlt
// § WLT TD قسم شحن رصيد المحفظة — مرجع: WLT_TOPUP_UX_FORENSIC_ANALYSIS.md والصور المرجعية

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';
import { rawFetch } from '@bthwani/api-clients';

const BORDER_COLOR = colorTokens.neutral['200'];

const TOPUP_AMOUNT_ARABIC_HUNDRED_KEY = 'wlt.app-client.mobile.auto_wlt_topup.amount_arabic_hundred';
const TOPUP_AMOUNT_ARABIC_AND_KEY = 'wlt.app-client.mobile.auto_wlt_topup.amount_arabic_and';

/** تحويل مبلغ إلى نص عربي تقريبي (آلاف + مئات) للمطابقة مع الواجهة المرجعية */
function amountToArabicText(n: number, t: (key: string) => string): string {
  if (n <= 0) return t('surfaces.صفر');
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const andStr = t(TOPUP_AMOUNT_ARABIC_AND_KEY);
  const hundredStr = t(TOPUP_AMOUNT_ARABIC_HUNDRED_KEY);
  if (n >= 1000) {
    const k = Math.floor(n / 1000);
    const rest = n % 1000;
    const kStr = k <= 19 ? (k === 10 ? 'عشرة' : k === 11 ? 'أحد عشر' : k < 10 ? ones[k] : ones[k % 10] + ' عشر') : k < 100 ? (tens[Math.floor(k / 10)] + (k % 10 ? andStr + ones[k % 10] : '')) : hundreds[Math.floor(k / 100)] + (k % 100 ? andStr + amountToArabicText(k % 100, t) : '');
    const thousandWord = k === 2 ? t('surfaces.ألفان') : k >= 3 && k <= 10 ? ones[k] + ' آلاف' : kStr + ' ألف';
    return rest > 0 ? thousandWord + andStr + amountToArabicText(rest, t) : thousandWord;
  }
  if (n >= 100) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return (hundreds[h] || amountToArabicText(h, t) + hundredStr) + (r > 0 ? andStr + amountToArabicText(r, t) : '');
  }
  if (n >= 20) return (n % 10 ? ones[n % 10] + andStr : '') + tens[Math.floor(n / 10)];
  if (n >= 10) return n === 10 ? t('surfaces.عشرة') : ones[n % 10] + ' عشر';
  return ones[n] || String(n);
}

interface auto_wlt_topupProps {}

export const auto_wlt_topup: React.FC<auto_wlt_topupProps> = () => {
  const ctx = useI18n();
  const t = typeof ctx.t === 'function' ? ctx.t : (k: string) => k;
  const { isRTL } = ctx;
  // #region agent log (L7: only when env set; no hardcoded dev URL)
  const _debugBase =
    typeof process !== 'undefined' && process.env
      ? (process.env.EXPO_PUBLIC_DEBUG_INGEST_URL || process.env.NEXT_PUBLIC_DEBUG_INGEST_URL || '').trim()
      : '';
  if (_debugBase && typeof globalThis !== 'undefined' && typeof fetch === 'function') {
    rawFetch(`${_debugBase.replace(/\/+$/, '')}/ingest/51df08f7-54d1-40e9-84cb-9cd0d243ec29`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '877241' }, body: JSON.stringify({ sessionId: '877241', location: 'auto_wlt_topup.tsx:useI18n', message: 'auto_wlt_topup t', data: { tIsFunction: typeof t === 'function' }, timestamp: Date.now(), hypothesisId: 'H3' }) }).catch(() => {});
  }
  // #endregion
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('content');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [modalType, setModalType] = useState<'amount_required' | 'insufficient_balance' | 'provider_code' | 'card_details' | null>(null);
  const [providerCode, setProviderCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const topupAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const isAmountValid = topupAmount > 0;
  const canSubmit = isAmountValid && !!paymentMethod;
  const amountNum = Math.floor(topupAmount);
  const amountArabic = amountNum > 0 ? amountToArabicText(amountNum, t) : '';

  const handleRetry = () => setState('content');
  const closeModal = () => {
    setModalType(null);
    setProviderCode('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardholderName('');
  };
  const handleConfirmCardPayment = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.length < 13) {
      setModalType('card_details');
      return;
    }
    if (!cardExpiry.trim() || !cardCvv.trim() || !cardholderName.trim()) return;
    setModalType(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardholderName('');
    setState('loading');
    setTimeout(() => {
      setState(0 > 0.1 ? 'success' : 'error');
    }, 1500);
  };
  const handleConfirmWithCode = () => {
    setModalType(null);
    setProviderCode('');
    setState('loading');
    setTimeout(() => {
      setState(0 > 0.1 ? 'success' : 'error');
    }, 1200);
  };
  const getProviderIcon = (id: string) =>
    resolveDevMediaUrl(`wlt/icon_${id}.png`) || resolveDevMediaUrl('wlt/icon_provider_placeholder.png');
  const paymentmethods = useMemo(
    () => [
      { id: 'card', label: t('wlt.app-client.mobile.auto_wlt_topup.methodCreditCard'), icon: getProviderIcon('card') },
      { id: 'mastercard', label: t('wlt.app-client.mobile.auto_wlt_topup.methodMastercard'), icon: getProviderIcon('mastercard') },
      { id: 'jawal', label: t('wlt.app-client.mobile.auto_wlt_topup.methodJawali'), icon: getProviderIcon('jawal') },
      { id: 'jeeb', label: t('wlt.app-client.mobile.auto_wlt_topup.methodJeeb'), icon: getProviderIcon('jeeb') },
      { id: 'karimi', label: t('wlt.app-client.mobile.auto_wlt_topup.methodKuraimi'), icon: getProviderIcon('karimi') },
      { id: 'one_cash', label: t('wlt.app-client.mobile.auto_wlt_topup.methodOneCash'), icon: getProviderIcon('one_cash') },
      { id: 'cash', label: t('wlt.app-client.mobile.auto_wlt_topup.methodCash'), icon: getProviderIcon('cash') },
      { id: 'pace', label: t('wlt.app-client.mobile.auto_wlt_topup.methodPay'), icon: getProviderIcon('pace') },
      { id: 'eazy', label: t('wlt.app-client.mobile.auto_wlt_topup.methodEasyWallet'), icon: getProviderIcon('eazy') },
      { id: 'saba', label: t('wlt.app-client.mobile.auto_wlt_topup.methodSabacash'), icon: getProviderIcon('saba') },
      { id: 'shamel', label: t('wlt.app-client.mobile.auto_wlt_topup.methodShamelMoney'), icon: getProviderIcon('shamel') },
      { id: 'mobile_money', label: t('wlt.app-client.mobile.auto_wlt_topup.methodMobileMoney'), icon: getProviderIcon('mobile_money') },
      { id: 'tadamon', label: t('wlt.app-client.mobile.auto_wlt_topup.methodMyBank'), icon: getProviderIcon('tadamon') },
    ],
    [t]
  );

  const handleTopup = () => {
    if (!isAmountValid) {
      setModalType('amount_required');
      return;
    }
    if (!paymentMethod) return;
    if (paymentMethod === 'card') {
      setModalType('card_details');
      return;
    }
    setState('loading');
    setTimeout(() => {
      const mockInsufficient = 0 > 0.85;
      if (mockInsufficient) {
        setState('content');
        setModalType('insufficient_balance');
        return;
      }
      setState('content');
      setModalType('provider_code');
    }, 1500);
  };

  const renderModal = () => {
    if (!modalType) return null;
    if (modalType === 'amount_required') {
      return (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalEmoji}>😢</Text>
              <Text style={styles.modalTitle}>يجب إدخال المبلغ</Text>
              <TouchableOpacity style={styles.modalButtonRed} onPress={closeModal}>
                <Text style={styles.modalButtonTextWhite}>اغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    if (modalType === 'insufficient_balance') {
      return (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalEmoji}>😢</Text>
              <Text style={styles.modalTitle}>لا يوجد رصيد كاف في حسابك لإتمام العملية</Text>
              <View style={styles.modalRow}>
                <TouchableOpacity style={styles.modalButtonRed} onPress={() => { closeModal(); handleTopup(); }}>
                  <Text style={styles.modalButtonTextWhite}>اعادة المحاولة</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonWhite} onPress={closeModal}>
                  <Text style={styles.modalButtonTextRed}>إغلاق</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
    if (modalType === 'provider_code') {
      return (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalIcon}>$</Text>
              <Text style={styles.modalTitle}>يرجى إدخال كود الشراء الذي تم توليده من تطبيق المحفظة</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('wlt.app-client.mobile.auto_wlt_topup.purchaseCodeLabel')}
                value={providerCode}
                onChangeText={setProviderCode}
                keyboardType="numeric"
              />
              <View style={styles.modalRow}>
                <TouchableOpacity style={styles.modalButtonRed} onPress={handleConfirmWithCode}>
                  <Text style={styles.modalButtonTextWhite}>تأكيد</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonWhite} onPress={closeModal}>
                  <Text style={styles.modalButtonTextRed}>إغلاق</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
    if (modalType === 'card_details') {
      return (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, styles.modalBoxCard]}>
              <Text style={styles.modalTitle}>إدخال بيانات البطاقة</Text>
              <Text style={styles.modalSubtitle}>أدخل بيانات البطاقة الائتمانية لإتمام الشحن</Text>
              <Text style={[styles.inputLabelModal, textAlignStart]}>رقم البطاقة</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChangeText={(val) => setCardNumber(val.replace(/[^0-9]/g, '').slice(0, 19))}
                keyboardType="numeric"
                maxLength={19}
              />
              <View style={styles.cardRowModal}>
                <View style={styles.cardHalf}>
                  <Text style={[styles.inputLabelModal, textAlignStart]}>تاريخ انتهاء البطاقة</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChangeText={(val) => {
                      const v = val.replace(/[^0-9]/g, '').slice(0, 4);
                      if (v.length >= 2) setCardExpiry(v.slice(0, 2) + '/' + v.slice(2));
                      else setCardExpiry(v);
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={styles.cardHalf}>
                  <Text style={[styles.inputLabelModal, textAlignStart]}>رمز التحقق (CVV)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="***"
                    value={cardCvv}
                    onChangeText={(val) => setCardCvv(val.replace(/[^0-9]/g, '').slice(0, 4))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              <Text style={[styles.inputLabelModal, textAlignStart]}>اسم حامل البطاقة (كما في البطاقة)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('wlt.app-client.mobile.auto_wlt_topup.cardNamePlaceholder')}
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
              />
              <View style={styles.modalRow}>
                <TouchableOpacity style={styles.modalButtonRed} onPress={handleConfirmCardPayment}>
                  <Text style={styles.modalButtonTextWhite}>تأكيد الدفع</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonWhite} onPress={closeModal}>
                  <Text style={styles.modalButtonTextRed}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('wlt.app-client.mobile.auto_wlt_topup.title')}</Text>

          <View style={styles.section}>
            <Text style={styles.amountLabel}>{t('wlt.app-client.mobile.auto_wlt_topup.amountLabel')}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9.]/g, '');
                setAmount(numericText);
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            <Text style={styles.currencyLabel}>ريال يمني</Text>
            {amountNum > 0 && amountArabic ? (
              <Text style={styles.amountArabicText}>{t('wlt.app-client.mobile.auto_wlt_topup.amountArabicText', { amountText: amountArabic })}</Text>
            ) : null}
            {!isAmountValid && amount !== '' && (
              <Text style={styles.inlineHint}>{t('wlt.app-client.mobile.auto_wlt_topup.inlineHint')}</Text>
            )}
          </View>

          <Text style={styles.instruction}>{t('wlt.app-client.mobile.auto_wlt_topup.instruction')}</Text>

          <View style={styles.paymentList}>
            {paymentmethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, paymentMethod === method.id && styles.paymentCardSelected]}
                onPress={() => setPaymentMethod(method.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.radio, paymentMethod === method.id && styles.radioSelected]} />
                <View style={styles.providerIconWrap}>
                  {method.icon ? (
                    <Image source={{ uri: method.icon }} style={styles.providerIcon} resizeMode="cover" />
                  ) : (
                    <View style={styles.providerIconPlaceholder}>
                      <Text style={styles.providerIconEmoji}>💳</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.paymentRowLabel, textAlignStart, paymentMethod === method.id && styles.paymentLabelSelected]} numberOfLines={2}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.topupButton, !canSubmit && styles.disabledButton]}
            onPress={handleTopup}
            disabled={!canSubmit}
          >
            <Text style={[styles.topupText, !canSubmit && styles.disabledText]}>{t('wlt.app-client.mobile.auto_wlt_topup.confirmCta')}</Text>
          </TouchableOpacity>
        </ScrollView>
        {renderModal()}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_معالجة_عملية_الشحن')}
      errorMessage={t('wlt.app-client.mobile.auto_wlt_topup.errorMessage')}
      onErrorAction={handleRetry}
      successMessage={t('wlt.app-client.mobile.auto_wlt_topup.successMessage', { amount })}
      successActionText={t('wlt.app-client.mobile.auto_wlt_topup.successActionText')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_topup"
      operationName="wlt_topup"
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
    borderColor: BORDER_COLOR,
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
    borderColor: BORDER_COLOR,
  },
  currencyLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  inlineHint: {
    fontSize: 12,
    color: BTHWANI_COLORS.error,
    marginTop: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  amountArabicText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  paymentList: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    backgroundColor: BTHWANI_COLORS.surface,
    shadowColor: colorTokens.neutral['900'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentCardSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.primary['50'],
    shadowOpacity: 0.1,
    elevation: 3,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    marginStart: BTHWANI_SPACING.md,
  },
  radioSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.primary,
  },
  providerIconWrap: {
    width: 44,
    height: 44,
    marginStart: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    overflow: 'hidden',
  },
  providerIcon: {
    width: 44,
    height: 44,
  },
  providerIconPlaceholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.primary['100'],
  },
  providerIconEmoji: { fontSize: 22 },
  paymentRowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
  },
  paymentLabelSelected: {
    color: BTHWANI_COLORS.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'BTHWANI_COLORS.overlay',
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.lg,
  },
  modalBox: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xl,
    width: '100%',
    maxWidth: 340,
  },
  modalBoxCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.xl,
    width: '100%',
    maxWidth: 340,
    maxHeight: '85%',
  },
  modalSubtitle: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabelModal: {
    fontSize: 13,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardRowModal: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  cardHalf: { flex: 1 },
  modalEmoji: { fontSize: 48, textAlign: 'center', marginBottom: BTHWANI_SPACING.md },
  modalIcon: { fontSize: 32, textAlign: 'center', marginBottom: BTHWANI_SPACING.md, color: BTHWANI_COLORS.primary },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  modalInput: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', gap: BTHWANI_SPACING.md },
  modalButtonRed: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.error || colorTokens.error['500'],
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonTextWhite: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
  modalButtonWhite: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.error || colorTokens.error['500'],
  },
  modalButtonTextRed: { color: BTHWANI_COLORS.error || colorTokens.error['500'], fontWeight: '600' },
  paymentmethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  selectedPaymentMethod: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.success['50'],
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: BTHWANI_SPACING.sm,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
  },
  selectedPaymentLabel: {
    color: BTHWANI_COLORS.primary,
  },
  cardDetails: {
    marginTop: BTHWANI_SPACING.lg,
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
    borderColor: BORDER_COLOR,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  summaryValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
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
  topupButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.onSurfaceMuted,
  },
  topupText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: BTHWANI_COLORS.surface,
  },
});

export default auto_wlt_topup;

