import React from 'react';
import { Badge, Box, Button, KeyValueList, MobileScrollView, SectionHeader, StateView, StatCard, Surface, Text } from '@bthwani/ui-kit';
import type { DshSignalSummary } from '../../shared/marketing/dsh-signal-layer.model';
import { getDshSignalEventLabel, getDshSignalEventTone } from '../../shared/marketing/dsh-signal-layer.model';

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
  orderLabel: 'طلب DSH رقم 1042',
  captainLabel: 'الكابتن سامر',
  etaLabel: '4 دقائق',
  distanceLabel: 'يبعد 0.9 كم',
  receiptLabel: 'بانتظار استلام العميل',
  nextActionLabel: 'يرن الجرس مرة عند اقتراب الكابتن، ثم مرة ثانية عند وصوله إلى نقطة العميل.',
};

const defaultEvents: ClientBellEvent[] = [
  {
    id: 'approach',
    title: 'الكابتن يقترب',
    subtitle: 'الرنة الأولى تظهر عند اقتراب الكابتن من نقطة العميل.',
    meta: 'اقتراب',
    badgeLabel: 'مباشر',
    tone: 'info',
  },
  {
    id: 'arrived',
    title: 'الكابتن وصل إلى نقطة العميل',
    subtitle: 'الرنة الثانية تؤكد لحظة التسليم والاستلام بوضوح.',
    meta: 'وصول',
    badgeLabel: 'تنبيه',
    tone: 'warning',
  },
  {
    id: 'received',
    title: 'اكتمل استلام العميل',
    subtitle: 'بعد الاستلام ينتقل الطلب إلى المراجعة والتقييم.',
    meta: 'مغلق',
    badgeLabel: 'تم',
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
      title: 'جاري تجهيز جرس العميل',
      description: 'تجري تهيئة حالة الوصول وسيظهر مسار الجرس فور جاهزية سياق الطلب.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty',
      title: 'لا يوجد جرس وصول نشط',
      description: 'يظهر الجرس فقط عندما يكون الطلب في حالة اقتراب أو وصول أو بانتظار الاستلام.',
      actionLabel: 'فتح التتبع',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline',
      title: 'جرس الوصول غير متصل',
      description: 'أعد الاتصال لاستعادة مسار وصول العميل وإبقاء حالة الجرس ظاهرة.',
      actionLabel: 'إعادة المحاولة',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning',
      title: 'جرس الوصول متوقف مؤقتًا',
      description: 'يبقى جرس العميل للعرض فقط حتى إعادة تفعيل تدفق الوصول.',
      actionLabel: 'فتح التتبع',
    };
  }

  return {
    stateId: 'recoverableError',
    title: 'تعذر تحميل جرس العميل',
    description: 'أعد التحميل لنفس المسار مع الحفاظ على تسلسل وصول العميل.',
    actionLabel: 'إعادة المحاولة',
  };
}

export type DshClientBellScreenProps = {
  state?: DshClientBellScreenState;
  summary?: ClientBellSummary;
  events?: ClientBellEvent[];
  /** Signal layer integration — summaries from getDshSignalSummaries('app-client', 'client').
   *  When provided, signal events are shown as bell events (summaries only; open detail on press). */
  signalEvents?: readonly DshSignalSummary[];
  onOpenTracking?: () => void;
  onOpenOrders?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

function signalToClientBellEvent(signal: DshSignalSummary): ClientBellEvent {
  const tone = getDshSignalEventTone(signal.kind);
  return {
    id: signal.eventId,
    title: getDshSignalEventLabel(signal.kind),
    subtitle: signal.title,
    meta: signal.entityId,
    badgeLabel: signal.priority === 'urgent' ? 'عاجل' : signal.priority === 'important' ? 'هام' : 'معتاد',
    tone: tone === 'danger' ? 'warning' : tone === 'brand' ? 'info' : tone === 'success' ? 'success' : 'info',
  };
}

function BellEventRow({ event }: { event: ClientBellEvent }) {
  return (
    <Surface tone={event.tone === 'success' ? 'raised' : 'default'} padding={3} gap={1} radiusToken="xl" border>
      <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{event.title}</Text>
        <Badge label={event.badgeLabel} tone={event.tone === 'info' ? 'brand' : event.tone} />
      </Box>
      <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{event.subtitle}</Text>
      <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{event.meta}</Text>
    </Surface>
  );
}

export function DshClientBellScreen({
  state = 'ready',
  summary = defaultSummary,
  events = defaultEvents,
  signalEvents,
  onOpenTracking,
  onOpenOrders,
  onRetry,
  onBack,
}: DshClientBellScreenProps) {
  // Merge signal events (summaries only) into bell events when provided
  const resolvedEvents = signalEvents && signalEvents.length > 0
    ? [...signalEvents.map(signalToClientBellEvent), ...events]
    : events;
  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <MobileScrollView padding={4} gap={4}>
        <StateView {...stateCopy} onActionPress={onRetry ?? onOpenTracking ?? onBack} />
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="جرس الوصول" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>جرس وصول الكابتن</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            يرن الجرس عند الاقتراب، ثم عند وصول الكابتن إلى نقطة العميل، وبعدها ينتقل الطلب إلى الاستلام والتقييم.
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="الرنات الفعالة" value="2" deltaLabel="اقتراب + وصول" tone="info" />
          <StatCard label="المرحلة الحالية" value="قريب" deltaLabel={summary.etaLabel} tone="warning" />
          <StatCard label="بعد الاستلام" value="التقييم" deltaLabel={summary.receiptLabel} tone="success" />
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="تفاصيل الطلب" subtitle="المعلومة المختصرة تبقى في نفس الصفحة مع الجرس." />
        <KeyValueList
          items={[
            { label: 'الطلب', value: summary.orderLabel, tone: 'brand' },
            { label: 'الكابتن', value: summary.captainLabel },
            { label: 'المسافة', value: summary.distanceLabel },
            { label: 'الـ ETA', value: summary.etaLabel, tone: 'warning' },
            { label: 'حالة التسليم', value: summary.receiptLabel, tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="متى يرن الجرس" subtitle="السطور التالية تختصر منطق الرن من دون ضوضاء." />
        <Box gap={2}>
          {resolvedEvents.map((event) => (
            <BellEventRow key={event.id} event={event} />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          هذا المسار يظل خفيفًا: رنين عند الاقتراب، رنين عند الوصول، ثم استلام وتقييم في نفس الرحلة.
        </Text>
      </Surface>

      <Box gap={2}>
        {onOpenTracking ? <Button label="فتح التتبع" onPress={onOpenTracking} /> : null}
        {onOpenOrders ? <Button label="الطلبات" tone="secondary" onPress={onOpenOrders} /> : null}
        {onBack ? <Button label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </Box>
    </MobileScrollView>
  );
}

export default DshClientBellScreen;
