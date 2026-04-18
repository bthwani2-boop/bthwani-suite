import React from 'react';
import {
  BthBox,
  BthButton,
  BthMobileScrollView,
  BthSectionHeader,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';
import DshWalletButton from './DshWalletButton';

type Line = { id?: string; label: string; value: string };

export type DshSmartConfirmProps = {
  pickupAddress?: string;
  dropoffAddress?: string;
  contactName?: string;
  contactPhone?: string;
  pricingLines?: Line[];
  paymentMethod?: string;
  processing?: boolean;
  onConfirm: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
};

export default function DshSmartConfirm({
  pickupAddress,
  dropoffAddress,
  contactName,
  contactPhone,
  pricingLines = [],
  paymentMethod,
  processing,
  onConfirm,
  onEdit,
  onCancel,
}: DshSmartConfirmProps) {
  const total = pricingLines.length ? pricingLines[pricingLines.length - 1] : undefined;

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader title="تأكيد الطلب" subtitle="مراجعة سريعة قبل الدفع" />
        {total ? (
          <BthBox gap={1}>
            <BthText role="titleLg">{total.value}</BthText>
            <BthText role="caption" tone="muted">{total.label}</BthText>
          </BthBox>
        ) : null}
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="المسار والاتصال" />
        <BthBox gap={2}>
          {pickupAddress ? <BthText role="bodySm" tone="muted">التقاط: {pickupAddress}</BthText> : null}
          {dropoffAddress ? <BthText role="bodySm" tone="muted">تسليم: {dropoffAddress}</BthText> : null}
          {contactName ? <BthText role="bodyStrong">{contactName}</BthText> : null}
          {contactPhone ? <BthText role="bodySm" tone="muted">{contactPhone}</BthText> : null}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader title="الخلاصة" subtitle={paymentMethod ? `طريقة الدفع: ${paymentMethod}` : undefined} />
        <BthBox gap={2}>
          {pricingLines.map((p, i) => (
            <BthBox key={p.id ?? i} gap={0}>
              <BthText role="bodySm" tone="muted">{p.label}</BthText>
              <BthText role="bodyStrong">{p.value}</BthText>
            </BthBox>
          ))}
        </BthBox>

        <BthBox gap={2}>
          <BthText role="caption" tone="muted">اختر طريقة الدفع أو استخدم المحفظة المتصلة.</BthText>
          <DshWalletButton onChange={() => { /* noop: parent will re-query if needed */ }} />
        </BthBox>
      </BthSurface>

      <BthBox gap={2}>
        <BthButton label={processing ? 'جارٍ المعالجة…' : 'تأكيد ودفع'} onPress={onConfirm} disabled={processing} />
        <BthButton label="تعديل" tone="secondary" onPress={onEdit} />
      </BthBox>
    </BthMobileScrollView>
  );
}
