import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenWrapper, Card, Text, AmountInput, PaymentMethodList, Button, Icon, TopBar, amountToArabicText, useBThwaniAppearance, useI18n } from '@bthwani/ui-kit';
import { financeProviders } from '../../../dsh/control-panel/financeContracts';
import { createWltDshTypedClient } from '../../../dsh/contracts';

export const WltHomeGetScreen: React.FC<{
  onBack?: () => void;
  dshAuthBearerToken?: string | null;
  dshClientId?: string | null;
}> = ({ onBack, dshAuthBearerToken, dshClientId }) => {
  const { t } = useI18n();
  const { tokens } = useBThwaniAppearance();

  const tr = (key: string, fallback?: string) => {
    const v = t(key);
    return v === key ? (fallback ?? key) : v;
  };

  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<number>(0.0);
  const [method, setMethod] = useState<string | undefined>(undefined);
  const [state, setState] = useState<'content' | 'loading' | 'success' | 'error'>('content');
  const [trigger, setTrigger] = useState(0);

  const activeClientId = dshClientId || 'client-demo';

  const client = useMemo(() => createWltDshTypedClient({
    bearerToken: dshAuthBearerToken || undefined,
    devClientId: activeClientId,
  }), [dshAuthBearerToken, activeClientId]);

  React.useEffect(() => {
    let active = true;
    client.getClientWalletSummary(activeClientId)
      .then((summary) => {
        if (active) {
          setBalance(summary.balance);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch balance:', err);
      });
    return () => { active = false; };
  }, [client, activeClientId, trigger]);

  const topupAmount = Math.floor(parseFloat(amount.replace(/,/g, '')) || 0);
  const canSubmit = topupAmount > 0 && !!method;

  const methods = useMemo(() => (
    financeProviders.map((p) => ({ id: p.id, label: tr(p.labelKey, p.fallback), icon: p.icon }))
  ), [t]);

  const handleTopup = async () => {
    if (!canSubmit) return setState('error');
    setState('loading');
    try {
      const session = await client.createClientPaymentSession({
        checkout_intent_id: `topup-${Date.now()}`,
        client_id: activeClientId,
        amount: topupAmount,
        currency: 'YER',
        payment_method: method ?? 'wallet',
        idempotency_key: `topup-idem-${Date.now()}-${topupAmount}`,
      });

      await client.confirmPaymentSession(session.id, `ref-topup-${Date.now()}`);

      setState('success');
      setTrigger((t) => t + 1);
      setAmount('');
      setMethod(undefined);
    } catch (err) {
      console.error('Failed to top up:', err);
      setState('error');
    }
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
    <View style={{ flex: 1 }}>
      <TopBar title={tr('wlt.home.title', 'المحفظة')} />
    <ScreenWrapper state={state} loadingMessage={tr('surfaces.loading', 'جارٍ التحميل')} successMessage={tr('wlt.topup.success', 'تم الشحن')} onSuccessAction={() => setState('content')}>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {/* Prominent balance hero */}
        <Card
          title={tr('wlt.home.balanceTitle', 'رصيدك')}
          subtitle={tr('wlt.home.balanceSubtitle', '')}
          style={{ margin: 16, padding: 20 }}
        >
          <Text role="titleLg" style={{ textAlign: 'center', marginTop: 8 }}>{formattedBalance} {tr('wlt.currency', 'ريال')}</Text>
        </Card>

        {/* CTA below the card (pill) */}
        <View style={{ alignItems: 'center' }}>
          <Button
            label={tr('wlt.topup.add', 'اشحن رصيدك')}
            tone="primary"
            onPress={openTopup}
            fullWidth={false}
            size="md"
            leadingAccessory={<Icon name="add-outline" size={18} color={tokens.components.buttons.primary.default.iconColor} />}
            style={{ width: 220, marginTop: 8, alignSelf: 'center' }}
          />
        </View>

        {isTopupOpen && (
          <View onLayout={(e) => setAmountY(e.nativeEvent.layout.y)}>
            <Text role="titleSm" style={{ marginHorizontal: 16, marginTop: 12 }}>{tr('wlt.topup.inlineTitle', 'اشحن الآن')}</Text>
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <View style={{ width: 160 }}>
                <AmountInput value={amount} onChange={setAmount} placeholder="0.00" currencyLabel={tr('wlt.currency', 'ريال')} />
              </View>
            </View>
            <PaymentMethodList methods={methods} selectedId={method} onSelect={setMethod} />

            {topupAmount > 0 ? <Text role="caption" tone="muted" style={{ textAlign: 'center', marginTop: 8 }}>{amountToArabicText(topupAmount, (k) => tr(k))}</Text> : null}

            <Button label={tr('wlt.topup.confirmCta', 'تأكيد الشحن')} onPress={handleTopup} disabled={!canSubmit} style={{ margin: 16 }} />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
    </View>
  );
};

export default WltHomeGetScreen;
