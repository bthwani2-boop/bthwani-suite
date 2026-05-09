/**
 * WLT-owned client payment preview component.
 *
 * PREVIEW ONLY — no real payment, no API, no backend.
 * Composable: mount inside any DSH checkout surface.
 * Contract state: CONTRACT_TBD — real payment flow blocked.
 */

import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  KeyValueList,
  StateView,
  Surface,
  Text,
  useTheme,
} from '@bthwani/ui-kit';
import {
  getWltDshPaymentOptionsPreview,
  resolveWltDshPaymentPreviewState,
  type WltDshPaymentMethod,
  type WltDshPaymentPreviewState,
} from '../../shared/finance/dshFinancePreview';

const CONTRACT_TBD_NOTICE =
  'هذه الواجهة عرض تجريبي فقط. لا يتم تنفيذ أي دفع حقيقي حتى يُرفع وضع CONTRACT_TBD ويُربط الـ API المالي.';

function PreviewBanner() {
  return (
    <Surface tone="inset" padding={3}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10 }}>
        <Icon name="information-circle-outline" size={18} tone="muted" />
        <Text role="bodySm" tone="muted" style={{ flex: 1, textAlign: 'right', lineHeight: 20 }}>
          {CONTRACT_TBD_NOTICE}
        </Text>
      </View>
    </Surface>
  );
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
  availabilityTone: 'success' | 'warning' | 'info' | 'error';
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
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
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

function PaymentStateSummary({ state }: { state: WltDshPaymentPreviewState }) {
  const statusTone = state.feedbackTone === 'success' ? 'success'
    : state.feedbackTone === 'warning' ? 'warning'
    : state.feedbackTone === 'error' ? 'error'
    : 'info';

  return (
    <Surface tone="inset" padding={3} gap={3}>
      <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
        ملخص طريقة الدفع
      </Text>
      <KeyValueList
        dense
        items={[
          { label: 'إجمالي الطلب', value: state.orderTotalHalalas > 0
              ? `${(state.orderTotalHalalas / 100).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س`
              : '— غير محدد —',
            tone: 'info' },
          { label: 'من المحفظة', value: `${(state.walletAmountHalalas / 100).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س`, tone: state.walletAmountHalalas > 0 ? 'success' : 'default' },
          { label: 'عند الاستلام', value: `${(state.amountDueOnDeliveryHalalas / 100).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س`, tone: state.amountDueOnDeliveryHalalas > 0 ? 'brand' : 'default' },
          { label: 'حالة الربط', value: state.walletLinked ? 'مرتبطة' : 'غير مرتبطة', tone: state.walletLinked ? 'success' : 'warning' },
          { label: 'نوع الحدث المالي', value: state.financeEventKind, tone: 'default' },
          { label: 'العقد', value: state.contractState, tone: 'warning' },
        ]}
      />
      {state.blockingLabel ? (
        <StateView
          kind="warning"
          title="يتطلب إجراء"
          description={state.blockingLabel}
        />
      ) : (
        <Surface tone="default" padding={2}>
          <Text role="bodySm" style={{ textAlign: 'right', color: statusTone === 'success' ? undefined : undefined }}>
            {state.summaryLabel}
          </Text>
        </Surface>
      )}
    </Surface>
  );
}

export type WltDshClientPaymentPreviewProps = {
  orderTotalHalalas?: number;
  walletBalanceHalalas?: number;
  walletLinked?: boolean;
  selectedMethod?: WltDshPaymentMethod;
  onSelectMethod?: (method: WltDshPaymentMethod) => void;
};

export function WltDshClientPaymentPreview({
  orderTotalHalalas = 0,
  walletBalanceHalalas = 0,
  walletLinked = false,
  selectedMethod = 'cod',
  onSelectMethod,
}: WltDshClientPaymentPreviewProps) {
  const [method, setMethod] = React.useState<WltDshPaymentMethod>(selectedMethod);
  const options = React.useMemo(() => getWltDshPaymentOptionsPreview(), []);

  const handleSelect = React.useCallback(
    (id: WltDshPaymentMethod) => {
      setMethod(id);
      onSelectMethod?.(id);
    },
    [onSelectMethod],
  );

  const previewState = React.useMemo(
    () => resolveWltDshPaymentPreviewState(method, orderTotalHalalas, walletBalanceHalalas, walletLinked),
    [method, orderTotalHalalas, walletBalanceHalalas, walletLinked],
  );

  return (
    <Box gap={3}>
      <PreviewBanner />

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          طرق الدفع المتاحة
        </Text>
        <Box gap={2}>
          {options.map((opt) => (
            <PaymentOptionCard
              key={opt.id}
              id={opt.id}
              titleLabel={opt.titleLabel}
              descriptionLabel={opt.descriptionLabel}
              isSelected={method === opt.id}
              isAvailable={opt.isAvailable}
              availabilityLabel={opt.availabilityLabel}
              availabilityTone={opt.availabilityTone}
              onSelect={handleSelect}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted" style={{ textAlign: 'right' }}>
          رصيد المحفظة (WLT Preview)
        </Text>
        <KeyValueList
          dense
          items={[
            {
              label: 'الرصيد الحالي',
              value: walletLinked
                ? `${(walletBalanceHalalas / 100).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س`
                : '— غير مرتبطة —',
              tone: walletLinked ? 'success' : 'warning',
            },
            { label: 'حالة الربط', value: walletLinked ? 'مرتبطة' : 'غير مرتبطة', tone: walletLinked ? 'success' : 'warning' },
          ]}
        />
        {!walletLinked && (
          <StateView
            kind="warning"
            title="المحفظة غير مرتبطة"
            description="اربط محفظة WLT لتفعيل خيارات الدفع من الرصيد. الربط الحالي تجريبي — CONTRACT_TBD."
          />
        )}
      </Surface>

      <PaymentStateSummary state={previewState} />

      <Surface tone="inset" padding={3}>
        <StateView
          kind="warning"
          title="الدفع الحقيقي مقفل — CONTRACT_TBD"
          description="لن يُنفَّذ أي دفع حقيقي من هذه الواجهة. جميع الأرقام تجريبية حتى يُرفع وضع العقد."
        />
      </Surface>
    </Box>
  );
}

export default WltDshClientPaymentPreview;
