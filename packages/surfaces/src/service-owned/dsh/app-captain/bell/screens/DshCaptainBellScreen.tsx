import React from 'react';
import { BthBadge, BthBox, BthButton, BthKeyValueList, BthListItem, BthMobileScrollView, BthSectionHeader, BthStateView, BthStatCard, BthSurface, BthText } from '@bthwani/ui-kit';

type DshCaptainBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type CaptainBellItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  tone: 'brand' | 'success' | 'warning' | 'info';
};

type CaptainBellSummary = {
  inboxLabel: string;
  approvalLabel: string;
  urgentLabel: string;
  nextActionLabel: string;
};

const defaultSummary: CaptainBellSummary = {
  inboxLabel: 'Captain inbox',
  approvalLabel: 'Approval needed',
  urgentLabel: 'Urgent order rings',
  nextActionLabel: 'A new order ring should push the captain toward approval or the inbox without extra noise.',
};

const defaultItems: CaptainBellItem[] = [
  {
    id: 'captain-bell-1',
    title: 'New order #9021',
    subtitle: 'Burger Lab is waiting for a captain to accept the route.',
    meta: 'Next: review and accept',
    badgeLabel: 'New',
    tone: 'warning',
  },
  {
    id: 'captain-bell-2',
    title: 'New order #9024',
    subtitle: 'Green Bowl needs an immediate review before the queue grows.',
    meta: 'Next: open task detail',
    badgeLabel: 'Urgent',
    tone: 'brand',
  },
  {
    id: 'captain-bell-3',
    title: 'New order #9027',
    subtitle: 'Bean House is ready if the captain confirms availability.',
    meta: 'Next: open inbox',
    badgeLabel: 'Ready',
    tone: 'info',
  },
];

type BellStateCopy = {
  stateId?: 'loading' | 'empty' | 'recoverableError' | 'offline';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel?: string;
};

function resolveStateCopy(state: Exclude<DshCaptainBellScreenState, 'ready'>): BellStateCopy {
  if (state === 'loading') {
    return { stateId: 'loading', title: 'Preparing captain bell', description: 'The next order ring will appear once queue data arrives.', actionLabel: 'Retry bell' };
  }

  if (state === 'empty') {
    return { stateId: 'empty', title: 'No new order rings', description: 'The bell stays quiet until a new order arrives in the queue.', actionLabel: 'Open inbox' };
  }

  if (state === 'offline') {
    return { stateId: 'offline', title: 'Captain bell is offline', description: 'Reconnect to restore the live new-order attention lane.', actionLabel: 'Retry bell' };
  }

  if (state === 'disabled') {
    return { kind: 'warning', title: 'Captain bell is disabled', description: 'The bell can stay read-only until the DSH captain queue is re-enabled.', actionLabel: 'Open inbox' };
  }

  return { stateId: 'recoverableError', title: 'Unable to load the captain bell', description: 'Reload the same path and keep the attention queue visible.', actionLabel: 'Retry bell' };
}

type DshCaptainBellScreenProps = {
  state?: DshCaptainBellScreenState;
  summary?: CaptainBellSummary;
  items?: CaptainBellItem[];
  onOpenInbox?: () => void;
  onOpenNextTask?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshCaptainBellScreen({
  state = 'ready',
  summary = defaultSummary,
  items = defaultItems,
  onOpenInbox,
  onOpenNextTask,
  onRetry,
  onBack,
}: DshCaptainBellScreenProps) {
  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthMobileScrollView padding={4} gap={4}>
        <BthStateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
      </BthMobileScrollView>
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthSurface tone="brand" gap={3}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label="New orders" tone="warning" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للكابتن</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            الرن هنا يلفت الانتباه فقط عند وصول طلب جديد أو عند الحاجة إلى موافقة سريعة من الكابتن.
          </BthText>
        </BthBox>

        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthStatCard label="طلبات جديدة" value={String(items.length)} deltaLabel="مباشر" tone="warning" />
          <BthStatCard label="بحاجة موافقة" value="2" deltaLabel={summary.approvalLabel} tone="brand" />
          <BthStatCard label="رنات عاجلة" value="1" deltaLabel={summary.urgentLabel} tone="info" />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title={summary.inboxLabel} subtitle="افتح الصندوق أو انتقل إلى أول مهمة من نفس الجرس." />
        <BthKeyValueList
          items={[
            { label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
            { label: 'الأولوية', value: summary.urgentLabel, tone: 'warning' },
            { label: 'الخطوة التالية', value: 'فتح الطلب والقبول أو الرفض السريع', tone: 'success' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="الرنات الحالية" subtitle="كل صف يوضح الطلب القادم من دون ضوضاء إضافية." />
        <BthBox gap={2}>
          {items.map((item) => (
            <BthListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          هذا الجرس لا يضيف ضوضاء. هو مجرد دفعة واضحة نحو صندوق المهام أو أول طلب يحتاج قرارًا.
        </BthText>
      </BthSurface>

      <BthBox gap={2}>
        {onOpenNextTask ? <BthButton label="فتح أول طلب" onPress={onOpenNextTask} /> : null}
        {onOpenInbox ? <BthButton label="صندوق المهام" tone="secondary" onPress={onOpenInbox} /> : null}
        {onBack ? <BthButton label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <BthButton label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </BthBox>
    </BthMobileScrollView>
  );
}

export default DshCaptainBellScreen;
