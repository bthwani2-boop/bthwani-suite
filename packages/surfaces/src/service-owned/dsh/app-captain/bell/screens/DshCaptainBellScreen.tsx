import React from 'react';
import { Badge, Box, Button, KeyValueList, ListItem, MobileScrollView, SectionHeader, StateView, StatCard, Surface, Text } from '@bthwani/ui-kit';

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
  inboxLabel: 'صندوق طلبات الكابتن',
  approvalLabel: 'بحاجة إلى موافقة',
  urgentLabel: 'رنات الطلبات العاجلة',
  nextActionLabel: 'رنّة الطلب الجديدة يجب أن تدفع الكابتن إلى الموافقة أو الصندوق مباشرة من دون ضوضاء إضافية.',
};

const defaultItems: CaptainBellItem[] = [
  {
    id: 'captain-bell-1',
    title: 'طلب جديد #9021',
    subtitle: 'Burger Lab بانتظار كابتن يقبل المسار.',
    meta: 'التالي: مراجعة ثم قبول',
    badgeLabel: 'جديد',
    tone: 'warning',
  },
  {
    id: 'captain-bell-2',
    title: 'طلب جديد #9024',
    subtitle: 'Green Bowl تحتاج مراجعة فورية قبل أن يكبر الصف.',
    meta: 'التالي: فتح تفاصيل الطلب',
    badgeLabel: 'عاجل',
    tone: 'brand',
  },
  {
    id: 'captain-bell-3',
    title: 'طلب جديد #9027',
    subtitle: 'Bean House جاهزة إذا أكد الكابتن التوفر.',
    meta: 'التالي: فتح الصندوق',
    badgeLabel: 'جاهز',
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
    return { stateId: 'loading', title: 'جارٍ تجهيز جرس الكابتن', description: 'ستظهر رنّة الطلب التالية بمجرد وصول بيانات الصف.', actionLabel: 'إعادة المحاولة' };
  }

  if (state === 'empty') {
    return { stateId: 'empty', title: 'لا توجد رنات طلب جديدة', description: 'يبقى الجرس هادئًا حتى يصل طلب جديد إلى الصف.', actionLabel: 'فتح الصندوق' };
  }

  if (state === 'offline') {
    return { stateId: 'offline', title: 'جرس الكابتن غير متصل', description: 'أعد الاتصال لاسترجاع مسار التنبيه المباشر للطلبات الجديدة.', actionLabel: 'إعادة المحاولة' };
  }

  if (state === 'disabled') {
    return { kind: 'warning', title: 'جرس الكابتن متوقف', description: 'يمكن إبقاء الجرس للقراءة فقط حتى يعاد تفعيل صف DSH.', actionLabel: 'فتح الصندوق' };
  }

  return { stateId: 'recoverableError', title: 'تعذر تحميل جرس الكابتن', description: 'أعد تحميل المسار نفسه مع إبقاء صف التنبيه ظاهرًا.', actionLabel: 'إعادة المحاولة' };
}

export type DshCaptainBellScreenProps = {
  state?: DshCaptainBellScreenState;
  summary?: CaptainBellSummary;
  items?: CaptainBellItem[];
  onOpenInbox?: () => void;
  onOpenNextOrder?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshCaptainBellScreen({
  state = 'ready',
  summary = defaultSummary,
  items = defaultItems,
  onOpenInbox,
  onOpenNextOrder,
  onRetry,
  onBack,
}: DshCaptainBellScreenProps) {
  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <MobileScrollView padding={4} gap={4}>
        <StateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
      </MobileScrollView>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Badge label="طلبات جديدة" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للكابتن</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            هذا الجرس يلفت الانتباه فقط عند وصول طلب جديد أو عند الحاجة إلى موافقة سريعة من الكابتن.
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="طلبات جديدة" value={String(items.length)} deltaLabel="مباشر" tone="warning" />
          <StatCard label="بحاجة إلى موافقة" value="2" deltaLabel={summary.approvalLabel} tone="brand" />
          <StatCard label="رنات عاجلة" value="1" deltaLabel={summary.urgentLabel} tone="info" />
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title={summary.inboxLabel} subtitle="افتح الصندوق أو انتقل إلى أول طلب من نفس الجرس." />
        <KeyValueList
          items={[
            { label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
            { label: 'الأولوية', value: summary.urgentLabel, tone: 'warning' },
            { label: 'الخطوة التالية', value: 'فتح الطلب والقبول أو الرفض السريع', tone: 'success' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الرنات الحالية" subtitle="كل صف يوضح الطلب القادم من دون ضوضاء إضافية." />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          هذا الجرس لا يضيف ضوضاء. هو مجرد دفعة واضحة نحو صندوق الطلبات أو أول طلب يحتاج قرارًا.
        </Text>
      </Surface>

      <Box gap={2}>
        {onOpenNextOrder ? <Button label="فتح أول طلب" onPress={onOpenNextOrder} /> : null}
        {onOpenInbox ? <Button label="صندوق الطلبات" tone="secondary" onPress={onOpenInbox} /> : null}
        {onBack ? <Button label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <Button label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </Box>
    </MobileScrollView>
  );
}

export default DshCaptainBellScreen;


