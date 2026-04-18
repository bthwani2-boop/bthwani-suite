import React from 'react';
import { BthBox, BthButton, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';

type Line = { id: string; label: string; value: string };

export type CombinedBlocks = {
  route: Line[];
  contact: Line[];
  pricing: Line[];
};

export default function DshCombinedReviewBlock({
  blocks,
  onEdit,
  values,
}: {
  blocks: CombinedBlocks;
  onEdit?: () => void;
  values?: { pickupAddress?: string; dropoffAddress?: string; contactName?: string; contactPhone?: string };
}) {
  // Minimal condensed view: keep only essential lines to reduce noise.
  const pickup = values?.pickupAddress ?? blocks.route?.[0]?.value ?? '';
  const dropoff = values?.dropoffAddress ?? blocks.route?.[1]?.value ?? '';

  const contactName = values?.contactName ?? blocks.contact?.[0]?.value ?? '';
  const contactPhone = values?.contactPhone ?? blocks.contact?.[1]?.value ?? '';

  const total = blocks.pricing?.[blocks.pricing.length - 1];
  const delivery = blocks.pricing?.find((p) => /رسوم|delivery|fee|delivery fee|delivery_fee/i.test(p.label)) ?? blocks.pricing?.[0];
  const estTime = blocks.pricing?.find((p) => /وقت|time|min|دق/i.test(p.label));

  return (
    <BthSurface tone="raised" padding={3} gap={2}>
      <BthBox layoutDirection="row" justify="space-between" align="center">
        <BthSectionHeader title="ملخّص الطلب" />
        <BthButton label="تعديل" tone="ghost" onPress={onEdit} />
      </BthBox>

      <BthBox gap={1}>
        <BthText role="bodyStrong">{pickup}</BthText>
        {dropoff ? <BthText role="bodySm" tone="muted">{dropoff}</BthText> : null}
      </BthBox>

      <BthBox layoutDirection="row" justify="space-between" align="center">
        <BthBox>
          {contactName || contactPhone ? (
            <>
              <BthText role="caption" tone="muted">جهة الاتصال</BthText>
              <BthText role="bodyStrong">{[contactName, contactPhone].filter(Boolean).join(' · ')}</BthText>
            </>
          ) : null}
        </BthBox>

        <BthBox style={{ alignItems: 'flex-end' }}>
          {total ? <BthText role="bodyStrong" style={{ fontSize: 18 }}>{total.value}</BthText> : null}
          <BthText role="bodySm" tone="muted">
            {delivery?.value ? `${delivery.value}` : ''}
            {estTime?.value ? ` · ${estTime.value}` : ''}
          </BthText>
        </BthBox>
      </BthBox>
    </BthSurface>
  );
}
