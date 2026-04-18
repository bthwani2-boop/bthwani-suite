import React from 'react';
import { BthBox, BthButton, BthSectionHeader, BthSurface, BthText, BthTextField } from '@bthwani/ui-kit';

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
  onSmartEdit,
}: {
  blocks: CombinedBlocks;
  onEdit?: () => void;
  values?: { pickupAddress?: string; dropoffAddress?: string; contactName?: string; contactPhone?: string };
  onSmartEdit?: (field: 'pickupAddress' | 'dropoffAddress' | 'contactName' | 'contactPhone', value: string) => void;
}) {
  const [smartEditOpen, setSmartEditOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({
    pickupAddress: values?.pickupAddress ?? blocks.route?.[0]?.value ?? '',
    dropoffAddress: values?.dropoffAddress ?? blocks.route?.[1]?.value ?? '',
    contactName: values?.contactName ?? blocks.contact?.[0]?.value ?? '',
    contactPhone: values?.contactPhone ?? blocks.contact?.[1]?.value ?? '',
  });

  React.useEffect(() => {
    setDraft({
      pickupAddress: values?.pickupAddress ?? blocks.route?.[0]?.value ?? '',
      dropoffAddress: values?.dropoffAddress ?? blocks.route?.[1]?.value ?? '',
      contactName: values?.contactName ?? blocks.contact?.[0]?.value ?? '',
      contactPhone: values?.contactPhone ?? blocks.contact?.[1]?.value ?? '',
    });
  }, [values, blocks]);

  function handleSaveSmartEdit() {
    if (onSmartEdit) {
      if (draft.pickupAddress !== (values?.pickupAddress ?? blocks.route?.[0]?.value ?? '')) onSmartEdit('pickupAddress', draft.pickupAddress);
      if (draft.dropoffAddress !== (values?.dropoffAddress ?? blocks.route?.[1]?.value ?? '')) onSmartEdit('dropoffAddress', draft.dropoffAddress);
      if (draft.contactName !== (values?.contactName ?? blocks.contact?.[0]?.value ?? '')) onSmartEdit('contactName', draft.contactName);
      if (draft.contactPhone !== (values?.contactPhone ?? blocks.contact?.[1]?.value ?? '')) onSmartEdit('contactPhone', draft.contactPhone);
    }
    setSmartEditOpen(false);
  }

  return (
    <BthSurface tone="raised" padding={3} gap={2} style={{ borderRadius: 14 }}>
      <BthBox layoutDirection="row" justify="space-between" align="center">
        <BthSectionHeader title="ملخّص الطلب" />
        <BthBox layoutDirection="row" gap={2} align="center">
          <BthButton label="تعديل" tone="secondary" onPress={onEdit} />
          <BthButton label="تعديل ذكي" tone="ghost" onPress={() => setSmartEditOpen((s) => !s)} />
        </BthBox>
      </BthBox>

      {smartEditOpen ? (
        <BthSurface tone="inset" padding={2} gap={2}>
          <BthText role="bodySm" tone="muted">تعديل سريع للحقل المطلوب</BthText>
          <BthTextField label="Pickup address" value={draft.pickupAddress} onChangeText={(v) => setDraft((d) => ({ ...d, pickupAddress: v }))} />
          <BthTextField label="Dropoff address" value={draft.dropoffAddress} onChangeText={(v) => setDraft((d) => ({ ...d, dropoffAddress: v }))} />
          <BthTextField label="Contact name" value={draft.contactName} onChangeText={(v) => setDraft((d) => ({ ...d, contactName: v }))} />
          <BthTextField label="Contact phone" value={draft.contactPhone} onChangeText={(v) => setDraft((d) => ({ ...d, contactPhone: v }))} />
          <BthBox layoutDirection="row" gap={2} justify="flex-end">
            <BthButton label="إلغاء" tone="secondary" onPress={() => setSmartEditOpen(false)} />
            <BthButton label="حفظ" onPress={handleSaveSmartEdit} />
          </BthBox>
        </BthSurface>
      ) : null}

      <BthBox layoutDirection="row" gap={3} style={{ alignItems: 'flex-start' }}>
        <BthBox gap={2} style={{ flex: 1 }}>
          <BthBox gap={1}>
            <BthText role="caption" tone="muted">المسار</BthText>
            {blocks.route.map((r) => (
              <BthText key={r.id} role="bodyStrong">{r.value}</BthText>
            ))}
          </BthBox>

          <BthBox gap={1}>
            <BthText role="caption" tone="muted">جهة الاتصال</BthText>
            {blocks.contact.map((c) => (
              <BthBox key={c.id} gap={0}>
                <BthText role="bodySm" tone="muted">{c.label}</BthText>
                <BthText role="bodyStrong">{c.value}</BthText>
              </BthBox>
            ))}
          </BthBox>
        </BthBox>

        <BthBox gap={1} style={{ width: 140, alignItems: 'flex-end' }}>
          <BthText role="caption" tone="muted">الخلاصة</BthText>
          {blocks.pricing.map((p) => (
            <BthBox key={p.id} gap={0} style={{ minWidth: 120, alignItems: 'flex-end' }}>
              <BthText role="bodySm" tone="muted">{p.label}</BthText>
              <BthText role="bodyStrong">{p.value}</BthText>
            </BthBox>
          ))}

          {blocks.pricing[blocks.pricing.length - 1] ? (
            <BthBox gap={0} style={{ marginTop: 6 }}>
              <BthText role="bodyStrong" style={{ fontSize: 18 }}>{blocks.pricing[blocks.pricing.length - 1].value}</BthText>
            </BthBox>
          ) : null}
        </BthBox>
      </BthBox>
    </BthSurface>
  );
}
