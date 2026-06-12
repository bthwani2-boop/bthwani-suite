'use client';

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  KeyValueList,
  StateView,
  Surface,
  Text,
  useTheme,
  type KeyValueItem,
  spacing,
} from '@bthwani/ui-kit';
import {
  formatWltYer,
  type WltDshPaymentMethod,
  type WltDshPaymentOptionPreview,
  type WltDshPaymentPreviewState,
  resolveWltDshFinanceEventKindForPaymentMethod,
} from '../control-panel/financeContracts';

const PAYMENT_OPTIONS: readonly WltDshPaymentOptionPreview[] = [
  { id: 'cod', titleLabel: 'الدفع عند الاستلام', descriptionLabel: 'ادفع كامل المبلغ عند استلام الطلب.', availabilityLabel: 'متاح دائمًا', availabilityTone: 'success', isAvailable: true, isPreview: true },
  { id: 'wallet', titleLabel: 'رصيد المحفظة (WLT)', descriptionLabel: 'ادفع من رصيد محفظة WLT الداخلية إذا توفر الرصيد.', availabilityLabel: 'يتطلب ربط وكفاية الرصيد', availabilityTone: 'warning', isAvailable: false, isPreview: true },
  { id: 'mixed', titleLabel: 'دفع مدمج', descriptionLabel: 'جزء من المحفظة والباقي عند الاستلام.', availabilityLabel: 'يتطلب رصيدًا جزئيًا في WLT', availabilityTone: 'info', isAvailable: false, isPreview: true },
  { id: 'official-wallets', titleLabel: 'المحافظ الرسمية', descriptionLabel: 'اختر محفظة رسمية معتمدة لإتمام الدفع.', availabilityLabel: 'CONTRACT_TBD — غير مفعّل', availabilityTone: 'warning', isAvailable: false, isPreview: true },
];

function resolvePaymentState(method: WltDshPaymentMethod, orderTotalMinorUnits: number, walletBalanceMinorUnits: number, walletLinked: boolean): WltDshPaymentPreviewState {
  const fmt = (n: number) => formatWltYer(n);
  const base = { method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked, contractState: 'CONTRACT_TBD' as const, financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(method), isPreview: true as const };
  if (method === 'cod') return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: true, summaryLabel: `ستدفع ${fmt(orderTotalMinorUnits)} عند الاستلام.`, feedbackTone: 'info' };
  if (method === 'wallet') {
    if (!walletLinked) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'المحفظة غير مرتبطة.', blockingLabel: 'اربط محفظة WLT أولًا.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits < orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: false, summaryLabel: `الرصيد ${fmt(walletBalanceMinorUnits)} أقل من إجمالي الطلب.`, blockingLabel: `تحتاج شحن ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} إضافيًا.`, feedbackTone: 'warning' };
    return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: true, summaryLabel: `الرصيد يكفي — سيُخصم ${fmt(orderTotalMinorUnits)} من المحفظة.`, feedbackTone: 'success' };
  }
  if (method === 'mixed') {
    if (!walletLinked || walletBalanceMinorUnits <= 0) return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits, valid: false, summaryLabel: 'الدفع المدمج يحتاج رصيدًا في المحفظة.', blockingLabel: 'لا يوجد رصيد متاح.', feedbackTone: 'warning' };
    if (walletBalanceMinorUnits >= orderTotalMinorUnits) return { ...base, walletAmountMinorUnits: orderTotalMinorUnits, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'الرصيد يكفي للدفع الكامل من المحفظة.', blockingLabel: 'استخدم خيار "رصيد المحفظة".', feedbackTone: 'info' };
    return { ...base, walletAmountMinorUnits: walletBalanceMinorUnits, amountDueOnDeliveryMinorUnits: orderTotalMinorUnits - walletBalanceMinorUnits, valid: true, summaryLabel: `${fmt(walletBalanceMinorUnits)} من المحفظة + ${fmt(orderTotalMinorUnits - walletBalanceMinorUnits)} عند الاستلام.`, feedbackTone: 'info' };
  }
  return { ...base, walletAmountMinorUnits: 0, amountDueOnDeliveryMinorUnits: 0, valid: false, summaryLabel: 'المحافظ الرسمية غير مفعّلة — CONTRACT_TBD.', blockingLabel: 'يتطلب ربطًا بـ API لم يُعرَّف بعد.', feedbackTone: 'warning' };
}

function PaymentOptionCard({
  id,
  titleLabel,
  descriptionLabel,
  isSelected,
  isAvailable,
  availabilityLabel,
  availabilityTone,
  onSelect,
}: {
  id: WltDshPaymentMethod;
  titleLabel: string;
  descriptionLabel: string;
  isSelected: boolean;
  isAvailable: boolean;
  availabilityLabel: string;
  availabilityTone: 'success' | 'warning' | 'info' | 'danger';
  onSelect: (id: WltDshPaymentMethod) => void;
}) {
  const { theme } = useTheme();

  return (
    <Surface
      tone={isSelected ? 'raised' : 'default'}
      padding={3}
      gap={2}
      style={isSelected ? { borderWidth: 2, borderColor: theme.brand } : undefined}
    >
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[3] }}>
        <View style={{ flex: 1, alignItems: 'flex-end', gap: spacing[1] }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>
            {titleLabel}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {descriptionLabel}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-start', gap: 6, flexShrink: 0 }}>
          <Badge label={availabilityLabel} tone={availabilityTone} />
          {!isSelected && (
            <Button
              label="اختيار"
              size="sm"
              tone={isAvailable ? 'primary' : 'ghost'}
              fullWidth={false}
              onPress={() => onSelect(id)}
            />
          )}
          {isSelected && (
            <Badge label="محدد" tone="brand" />
          )}
        </View>
      </View>
    </Surface>
  );
}

function WalletBalancePanel({
  walletLinked,
  walletBalanceMinorUnits,
  heldMinorUnits = 0,
  pendingMinorUnits = 0,
}: {
  walletLinked: boolean;
  walletBalanceMinorUnits: number;
  heldMinorUnits?: number;
  pendingMinorUnits?: number;
}) {
  const items: KeyValueItem[] = walletLinked
    ? [
        { label: 'الرصيد المتاح', value: formatWltYer(walletBalanceMinorUnits), tone: walletBalanceMinorUnits > 0 ? 'success' : 'warning' },
        { label: 'محجوز', value: heldMinorUnits > 0 ? formatWltYer(heldMinorUnits) : 'لا يوجد', tone: heldMinorUnits > 0 ? 'warning' : 'default' },
        { label: 'معلق', value: pendingMinorUnits > 0 ? formatWltYer(pendingMinorUnits) : 'لا يوجد', tone: 'default' },
        { label: 'حالة المحفظة', value: 'مرتبطة', tone: 'success' },
      ]
    : [
        { label: 'حالة المحفظة', value: 'غير مرتبطة', tone: 'warning' },
      ];

  return (
    <Surface tone="raised" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        رصيد المحفظة
      </Text>
      <KeyValueList dense items={items} />
      {!walletLinked && (
        <StateView
          kind="warning"
          title="المحفظة غير مرتبطة"
          description="اربط محفظتك لتفعيل خيارات الدفع من الرصيد."
        />
      )}
      {walletLinked && walletBalanceMinorUnits === 0 && (
        <StateView
          kind="warning"
          title="رصيد المحفظة صفر"
          description="اشحن المحفظة لتفعيل الدفع منها."
        />
      )}
    </Surface>
  );
}

function CheckoutSummaryPanel({
  orderTotalMinorUnits,
  walletAmountMinorUnits,
  codAmountMinorUnits,
  isSplitPayment,
  blockingLabel,
  summaryLabel,
  walletBalanceAfterMinorUnits,
}: {
  orderTotalMinorUnits: number;
  walletAmountMinorUnits: number;
  codAmountMinorUnits: number;
  isSplitPayment: boolean;
  blockingLabel?: string;
  summaryLabel: string;
  walletBalanceAfterMinorUnits: number;
}) {
  const items: KeyValueItem[] = [
    { label: 'إجمالي الطلب', value: formatWltYer(orderTotalMinorUnits), tone: 'info' },
    ...(walletAmountMinorUnits > 0 ? [{ label: 'من المحفظة', value: formatWltYer(walletAmountMinorUnits), tone: 'success' as const }] : []),
    ...(codAmountMinorUnits > 0 ? [{ label: 'نقداً عند الاستلام', value: formatWltYer(codAmountMinorUnits), tone: 'brand' as const }] : []),
    ...(isSplitPayment ? [{ label: 'نوع الدفع', value: 'مختلط (محفظة + كاش)', tone: 'info' as const }] : []),
    ...(walletAmountMinorUnits > 0 ? [{ label: 'رصيد المحفظة بعد الدفع', value: formatWltYer(walletBalanceAfterMinorUnits), tone: (walletBalanceAfterMinorUnits >= 0 ? 'success' : 'danger') as KeyValueItem['tone'] }] : []),
  ];

  return (
    <Surface tone="inset" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        ملخص الدفع
      </Text>
      <KeyValueList dense items={items} />
      {blockingLabel ? (
        <StateView
          kind="warning"
          title="يتطلب إجراء"
          description={blockingLabel}
        />
      ) : (
        <Surface tone="default" padding={2}>
          <Text role="bodySm" style={{ textAlign: 'right' }}>
            {summaryLabel}
          </Text>
        </Surface>
      )}
    </Surface>
  );
}

export type WltDshClientPaymentPreviewProps = {
  orderTotalMinorUnits?: number;
  walletBalanceMinorUnits?: number;
  walletLinked?: boolean;
  selectedMethod?: WltDshPaymentMethod;
  onSelectMethod?: (method: WltDshPaymentMethod) => void;
};

export function WltDshClientPaymentPreview({
  orderTotalMinorUnits = 0,
  walletBalanceMinorUnits = 0,
  walletLinked = false,
  selectedMethod = 'cod',
  onSelectMethod,
}: WltDshClientPaymentPreviewProps) {
  const [method, setMethod] = React.useState<WltDshPaymentMethod>(selectedMethod);
  const handleSelect = React.useCallback(
    (id: WltDshPaymentMethod) => {
      setMethod(id);
      onSelectMethod?.(id);
    },
    [onSelectMethod],
  );

  const previewState = React.useMemo(
    () => resolvePaymentState(method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked),
    [method, orderTotalMinorUnits, walletBalanceMinorUnits, walletLinked],
  );

  const walletBalanceAfter = walletBalanceMinorUnits - previewState.walletAmountMinorUnits;
  const isSplit = previewState.walletAmountMinorUnits > 0 && previewState.amountDueOnDeliveryMinorUnits > 0;

  return (
    <Box gap={3}>
      <WalletBalancePanel
        walletLinked={walletLinked}
        walletBalanceMinorUnits={walletBalanceMinorUnits}
      />

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          طرق الدفع المتاحة
        </Text>
        <Box gap={2}>
          {PAYMENT_OPTIONS.map((opt) => (
            <PaymentOptionCard
              key={opt.id}
              id={opt.id}
              titleLabel={opt.titleLabel}
              descriptionLabel={opt.descriptionLabel}
              isSelected={method === opt.id}
              isAvailable={opt.isAvailable}
              availabilityLabel={opt.availabilityLabel}
              availabilityTone={opt.availabilityTone === 'error' ? 'danger' : opt.availabilityTone}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </Surface>

      <CheckoutSummaryPanel
        orderTotalMinorUnits={orderTotalMinorUnits}
        walletAmountMinorUnits={previewState.walletAmountMinorUnits}
        codAmountMinorUnits={previewState.amountDueOnDeliveryMinorUnits}
        isSplitPayment={isSplit}
        blockingLabel={previewState.blockingLabel}
        summaryLabel={previewState.summaryLabel}
        walletBalanceAfterMinorUnits={walletBalanceAfter}
      />
    </Box>
  );
}

export default WltDshClientPaymentPreview;
