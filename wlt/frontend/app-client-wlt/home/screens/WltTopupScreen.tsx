import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { ScreenWrapper, ScreenState, Text, useI18n, Dialog,
  spacing,
} from '@bthwani/ui-kit';
import { AmountInput, PaymentMethodList, SummaryCard, QuickAmountGrid, Button, TextField, amountToArabicText } from '@bthwani/ui-kit';
import { financeProviders, createWltDshTypedClient, type FinanceProvider } from '../../../dsh/shared';

export const WltTopupScreen: React.FC = () => {
  const { t } = useI18n();
  const tr = (key: string, fallback?: string) => {
    const v = t(key);
    return v === key ? (fallback ?? key) : v;
  };
  const [state, setState] = useState<ScreenState>('content');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);
  const [dialogVisible, setDialogVisible] = useState(false);

  const client = useMemo(() => createWltDshTypedClient({ devClientId: 'client-demo' }), []);

  const methods = useMemo(() => (
    financeProviders.map((p: FinanceProvider) => ({ id: p.id, label: tr(p.labelKey, p.fallback), icon: p.icon }))
  ), [t]);

  const topupAmount = Math.floor(parseFloat(amount.replace(/,/g, '')) || 0);
  const canSubmit = topupAmount > 0 && !!paymentMethod;

  const handleTopup = async () => {
    if (!canSubmit) return setDialogVisible(true);
    setState('loading');
    try {
      const session = await client.createClientPaymentSession({
        checkout_intent_id: `topup-${Date.now()}`,
        client_id: 'client-demo',
        amount: topupAmount,
        currency: 'YER',
        payment_method: paymentMethod ?? 'wallet',
        idempotency_key: `topup-idem-${Date.now()}-${topupAmount}`,
      });

      await client.confirmPaymentSession(session.id, `ref-topup-${Date.now()}`);

      setState('success');
      setAmount('');
      setPaymentMethod(undefined);
    } catch (err) {
      console.error('Failed to top up:', err);
      setState('error');
    }
  };

  const summaryItems = [
    { label: t('wlt.summary.amount'), value: amount || '0.00' },
  ];

  return (
    <ScreenWrapper state={state} loadingMessage={t('surfaces.loading')}
      successMessage={t('wlt.topup.success', { amount })} onSuccessAction={() => setState('content')}>
      <ScrollView style={{ flex: 1 }}>
        <Text role="titleMd" style={{ textAlign: 'center', marginVertical: 16 }}>{t('wlt.topup.title')}</Text>

        <AmountInput value={amount} onChange={setAmount} placeholder="0.00" currencyLabel={t('wlt.currency')} />

        <QuickAmountGrid amounts={[50,100,200]} onSelect={(n) => setAmount(String(n))} selected={topupAmount} />

        <Text role="label" tone="muted" style={{ marginTop: spacing[3], marginHorizontal: 16 }}>{t('wlt.topup.instruction')}</Text>

        <PaymentMethodList methods={methods} selectedId={paymentMethod} onSelect={setPaymentMethod} />

        {topupAmount > 0 ? <Text role="caption" tone="muted" style={{ textAlign: 'center', marginTop: spacing[2] }}>{amountToArabicText(topupAmount, (k) => t(k))}</Text> : null}

        <SummaryCard items={summaryItems} totalLabel={t('wlt.summary.total')} totalValue={amount || '0.00'} />

        <Button label={t('wlt.topup.confirmCta')} onPress={handleTopup} disabled={!canSubmit} style={{ marginHorizontal: 16, marginVertical: 20 }} />

        <Dialog
          visible={dialogVisible}
          title={t('wlt.topup.missingData')}
          description={t('wlt.topup.missingDataDesc')}
          onClose={() => setDialogVisible(false)}
          primaryAction={{ label: t('surfaces.ok'), onPress: () => setDialogVisible(false) }}
        >
          <TextField label={t('wlt.topup.enterAmountLabel')} value={amount} onChangeText={setAmount} />
        </Dialog>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default WltTopupScreen;
