import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, BthCard, BthText, AmountInput, PaymentMethodList, BthButton, amountToArabicText, useI18n } from '@bthwani/ui-kit';
import { financeProviders } from '../../../../control-panel/finance/providers';

export const WltHomeGetScreen: React.FC = () => {
  const { t } = useI18n();

  const tr = (key: string, fallback?: string) => {
    const v = t(key);
    return v === key ? (fallback ?? key) : v;
  };

  const [amount, setAmount] = useState('');
  // Temporary local balance until we wire real account data
  const [balance] = useState<number>(0.0);
  const [method, setMethod] = useState<string | undefined>(undefined);
  const [state, setState] = useState<'content' | 'loading' | 'success' | 'error'>('content');

  const topupAmount = Math.floor(parseFloat(amount.replace(/,/g, '')) || 0);
  const canSubmit = topupAmount > 0 && !!method;

  const methods = useMemo(() => (
    financeProviders.map((p) => ({ id: p.id, label: tr(p.labelKey, p.fallback), icon: p.icon }))
  ), [t]);

  const handleTopup = () => {
    if (!canSubmit) return setState('error');
    setState('loading');
    setTimeout(() => setState('success'), 800);
  };

  const scrollRef = useRef<ScrollView | null>(null);
  const [amountY, setAmountY] = useState<number>(0);
  const [isTopupOpen, setIsTopupOpen] = useState<boolean>(false);

  const openTopup = () => {
    if (!isTopupOpen) {
      setIsTopupOpen(true);
      // wait briefly for layout to update, then scroll to the amount input
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ y: Math.max(0, amountY - 40), animated: true });
        }
      }, 120);
      return;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, amountY - 40), animated: true });
    }
  };

  const formattedBalance = new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance);

  return (
    <ScreenWrapper state={state} loadingMessage={tr('surfaces.loading', 'جارٍ التحميل')} successMessage={tr('wlt.topup.success', 'تم الشحن')} onSuccessAction={() => setState('content')}>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {/* Prominent balance hero */}
        <BthCard
          title={tr('wlt.home.balanceTitle', 'رصيدك')}
          subtitle={tr('wlt.home.balanceSubtitle', '')}
          style={{ margin: 16, padding: 20 }}
        >
          <BthText role="titleLg" style={{ textAlign: 'center', marginTop: 8 }}>{formattedBalance} {tr('wlt.currency', 'ريال')}</BthText>
        </BthCard>

        {/* CTA below the card (pill) */}
        <View style={{ alignItems: 'center' }}>
          <BthButton
            label={tr('wlt.topup.add', 'اشحن رصيدك')}
            tone="primary"
            onPress={openTopup}
            fullWidth={false}
            size="md"
            leadingAccessory={<Ionicons name="add" size={18} color="#fff" />}
            style={{ width: 220, marginTop: 8, alignSelf: 'center' }}
          />
        </View>

        {isTopupOpen && (
          <View onLayout={(e) => setAmountY(e.nativeEvent.layout.y)}>
            <BthText role="titleSm" style={{ marginHorizontal: 16, marginTop: 12 }}>{tr('wlt.topup.inlineTitle', 'اشحن الآن')}</BthText>
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <View style={{ width: 160 }}>
                <AmountInput value={amount} onChange={setAmount} placeholder="0.00" currencyLabel={tr('wlt.currency', 'ريال')} />
              </View>
            </View>
            <PaymentMethodList methods={methods} selectedId={method} onSelect={setMethod} />

            {topupAmount > 0 ? <BthText role="caption" tone="muted" style={{ textAlign: 'center', marginTop: 8 }}>{amountToArabicText(topupAmount, (k) => tr(k))}</BthText> : null}

            <BthButton label={tr('wlt.topup.confirmCta', 'تأكيد الشحن')} onPress={handleTopup} disabled={!canSubmit} style={{ margin: 16 }} />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default WltHomeGetScreen;
