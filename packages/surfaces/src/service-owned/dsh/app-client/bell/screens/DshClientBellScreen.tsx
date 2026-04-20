import React from 'react';
import { BthBadge, BthBox, BthButton, BthKeyValueList, BthMobileScrollView, BthSectionHeader, BthStateView, BthStatCard, BthSurface, BthText } from '@bthwani/ui-kit';

type DshClientBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type ClientBellEventTone = 'brand' | 'success' | 'warning' | 'info';

type ClientBellEvent = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  tone: ClientBellEventTone;
};

type ClientBellSummary = {
  orderLabel: string;
  captainLabel: string;
  etaLabel: string;
  distanceLabel: string;
  receiptLabel: string;
  nextActionLabel: string;
};

const defaultSummary: ClientBellSummary = {
  orderLabel: 'DSH order #1042',
  captainLabel: 'Captain Samer',
  etaLabel: '4 min',
  distanceLabel: '0.9 km away',
  receiptLabel: 'Awaiting customer receipt',
  nextActionLabel: 'The bell rings once the captain is close, then again when the order reaches the customer point.',
};

const defaultEvents: ClientBellEvent[] = [
  {
    id: 'approach',
    title: 'Captain is approaching',
    subtitle: 'The first bell rings when the captain is close enough to the customer point.',
    meta: 'Approaching',
    badgeLabel: 'Live',
    tone: 'info',
  },
  {
    id: 'arrived',
    title: 'Captain reached the customer point',
    subtitle: 'The second bell keeps the customer focused on the handoff and receipt moment.',
    meta: 'Arrival',
    badgeLabel: 'Alert',
    tone: 'warning',
  },
  {
    id: 'received',
    title: 'Customer receipt completed',
    subtitle: 'After receipt, the bell calms down and the order moves into review and rating.',
    meta: 'Closed',
    badgeLabel: 'Done',
    tone: 'success',
  },
];

type BellStateCopy = {
  stateId?: 'loading' | 'empty' | 'recoverableError' | 'offline';
  kind?: 'warning';
  title: string;
  description: string;
  actionLabel?: string;
};

function resolveStateCopy(state: Exclude<DshClientBellScreenState, 'ready'>): BellStateCopy {
  if (state === 'loading') {
    return {
      stateId: 'loading',
      title: 'Preparing the client bell',
      description: 'The arrival state is loading and the bell lane will show once the order context is ready.',
      actionLabel: 'Retry bell',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty',
      title: 'No active arrival bell',
      description: 'The bell is live only while an order is close, arriving, or ready for receipt.',
      actionLabel: 'Open tracking',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline',
      title: 'Arrival bell is offline',
      description: 'Reconnect to restore the customer arrival lane and keep the bell state visible.',
      actionLabel: 'Retry bell',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning',
      title: 'Arrival bell is temporarily disabled',
      description: 'The customer bell stays read-only until the arrival workflow is re-enabled.',
      actionLabel: 'Open tracking',
    };
  }

  return {
    stateId: 'recoverableError',
    title: 'Unable to load the client bell',
    description: 'Reload the same path and keep the customer arrival sequence intact.',
    actionLabel: 'Retry bell',
  };
}

export type DshClientBellScreenProps = {
  state?: DshClientBellScreenState;
  summary?: ClientBellSummary;
  events?: ClientBellEvent[];
  onOpenTracking?: () => void;
  onOpenOrders?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

function BellEventRow({ event }: { event: ClientBellEvent }) {
  return (
    <BthSurface tone={event.tone === 'success' ? 'raised' : 'default'} padding={3} gap={1} radiusToken="xl" border>
      <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{event.title}</BthText>
        <BthBadge label={event.badgeLabel} tone={event.tone === 'info' ? 'brand' : event.tone} />
      </BthBox>
      <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{event.subtitle}</BthText>
      <BthText role="caption" tone="soft" style={{ textAlign: 'right' }}>{event.meta}</BthText>
    </BthSurface>
  );
}

export function DshClientBellScreen({
  state = 'ready',
  summary = defaultSummary,
  events = defaultEvents,
  onOpenTracking,
  onOpenOrders,
  onRetry,
  onBack,
}: DshClientBellScreenProps) {
  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthMobileScrollView padding={4} gap={4}>
        <BthStateView {...stateCopy} onActionPress={onRetry ?? onOpenTracking ?? onBack} />
      </BthMobileScrollView>
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthSurface tone="brand" gap={3}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label="Arrival bell" tone="warning" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>جرس وصول الكابتن</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            يرن الجرس عند الاقتراب، ثم عند وصول الكابتن إلى نقطة العميل، وبعدها ينتقل الطلب إلى الاستلام والتقييم.
          </BthText>
        </BthBox>

        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthStatCard label="الرنات الفعالة" value="2" deltaLabel="اقتراب + وصول" tone="info" />
          <BthStatCard label="المرحلة الحالية" value="قريب" deltaLabel={summary.etaLabel} tone="warning" />
          <BthStatCard label="بعد الاستلام" value="التقييم" deltaLabel={summary.receiptLabel} tone="success" />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="تفاصيل الطلب" subtitle="المعلومة المختصرة تبقى في نفس الصفحة مع الجرس." />
        <BthKeyValueList
          items={[
            { label: 'الطلب', value: summary.orderLabel, tone: 'brand' },
            { label: 'الكابتن', value: summary.captainLabel },
            { label: 'المسافة', value: summary.distanceLabel },
            { label: 'الـ ETA', value: summary.etaLabel, tone: 'warning' },
            { label: 'حالة التسليم', value: summary.receiptLabel, tone: 'success' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="متى يرن الجرس" subtitle="السطور التالية تختصر منطق الرن من دون ضوضاء." />
        <BthBox gap={2}>
          {events.map((event) => (
            <BellEventRow key={event.id} event={event} />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          هذا المسار يظل خفيفًا: رنين عند الاقتراب، رنين عند الوصول، ثم استلام وتقييم في نفس الرحلة.
        </BthText>
      </BthSurface>

      <BthBox gap={2}>
        {onOpenTracking ? <BthButton label="فتح التتبع" onPress={onOpenTracking} /> : null}
        {onOpenOrders ? <BthButton label="الطلبات" tone="secondary" onPress={onOpenOrders} /> : null}
        {onBack ? <BthButton label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <BthButton label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </BthBox>
    </BthMobileScrollView>
  );
}

export default DshClientBellScreen;
