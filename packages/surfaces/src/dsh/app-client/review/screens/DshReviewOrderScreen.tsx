import React from 'react';
import {
  BthBox,
  BthButton,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
} from '@bthwani/ui-kit';

export type DshReviewLineItem = {
  id: string;
  label: string;
  value: string;
};

export type DshReviewOrderScreenProps = {
  state?: 'ready' | 'loading' | 'empty';
  blocks: {
    route: DshReviewLineItem[];
    contact: DshReviewLineItem[];
    pricing: DshReviewLineItem[];
  };
  onSubmit?: () => void;
  onEdit?: () => void;
};

function ReviewBlock({ title, items }: { title: string; items: DshReviewLineItem[] }) {
  return (
    <BthSurface tone="raised" gap={3}>
      <BthSectionHeader title={title} />
      <BthBox gap={2}>
        {items.map((item) => (
          <BthBox key={item.id} gap={1}>
            <BthText role="caption" tone="muted">{item.label}</BthText>
            <BthText role="bodyStrong">{item.value}</BthText>
          </BthBox>
        ))}
      </BthBox>
    </BthSurface>
  );
}

export function DshReviewOrderScreen({ state = 'ready', blocks, onSubmit, onEdit }: DshReviewOrderScreenProps) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return <BthStateView stateId="empty" actionLabel="Back to create" onActionPress={onEdit} />;
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">Review order</BthText>
        <BthText role="bodySm" tone="muted">
          Compact review only. Keep decision blocks short before submit.
        </BthText>
      </BthBox>

      <ReviewBlock title="Route" items={blocks.route} />
      <ReviewBlock title="Contact" items={blocks.contact} />
      <ReviewBlock title="Summary" items={blocks.pricing} />

      <BthSurface tone="inset" gap={3}>
        <BthText role="caption" tone="muted">
          Click budget: primary submit plus one edit action only.
        </BthText>
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="Edit details" tone="secondary" onPress={onEdit} />
          <BthButton label="Submit order" onPress={onSubmit} />
        </BthBox>
      </BthSurface>
    </BthMobileScrollView>
  );
}
