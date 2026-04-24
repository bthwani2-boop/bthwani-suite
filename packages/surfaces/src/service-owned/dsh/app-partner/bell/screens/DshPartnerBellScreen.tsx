import React from 'react';
import { Badge, Box, Button, KeyValueList, ListItem, MobileScrollView, SectionHeader, StateView, StatCard, Surface, Text } from '@bthwani/ui-kit';

type DshPartnerBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type PartnerBellItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
  tone: 'brand' | 'success' | 'warning' | 'info';
};

type PartnerBellSummary = {
  inboxLabel: string;
  approvalLabel: string;
  releaseLabel: string;
  nextActionLabel: string;
};

const defaultSummary: PartnerBellSummary = {
  inboxLabel: 'Partner orders inbox',
  approvalLabel: 'Approval needed',
  releaseLabel: 'Release to captain',
  nextActionLabel: 'A new order ring keeps the branch focused on approval, release, and a clear next step.',
};

const defaultItems: PartnerBellItem[] = [
  {
    id: 'partner-bell-1',
    title: 'Order #1042 waiting',
    subtitle: 'Burger Lab is ready for branch approval before captain handoff.',
    meta: 'Next: confirm ready',
    badgeLabel: 'New',
    tone: 'warning',
  },
  {
    id: 'partner-bell-2',
    title: 'Order #1048 needs attention',
    subtitle: 'Green Bowl should be reviewed before the queue advances.',
    meta: 'Next: review packaging',
    badgeLabel: 'Urgent',
    tone: 'brand',
  },
  {
    id: 'partner-bell-3',
    title: 'Order #1051 ready for release',
    subtitle: 'Bean House can move forward once the branch confirms readiness.',
    meta: 'Next: release captain',
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

function resolveStateCopy(state: Exclude<DshPartnerBellScreenState, 'ready'>): BellStateCopy {
  if (state === 'loading') {
    return { stateId: 'loading', title: 'Preparing partner bell', description: 'The new-order attention lane will appear once the branch queue arrives.', actionLabel: 'Retry bell' };
  }

  if (state === 'empty') {
    return { stateId: 'empty', title: 'No new partner rings', description: 'The bell stays quiet until a branch order needs approval or release.', actionLabel: 'Open inbox' };
  }

  if (state === 'offline') {
    return { stateId: 'offline', title: 'Partner bell is offline', description: 'Reconnect to restore the branch attention lane and keep the queue visible.', actionLabel: 'Retry bell' };
  }

  if (state === 'disabled') {
    return { kind: 'warning', title: 'Partner bell is disabled', description: 'The bell remains read-only until the branch workflow is re-enabled.', actionLabel: 'Open inbox' };
  }

  return { stateId: 'recoverableError', title: 'Unable to load the partner bell', description: 'Reload the same path and keep the branch attention lane stable.', actionLabel: 'Retry bell' };
}

export type DshPartnerBellScreenProps = {
  state?: DshPartnerBellScreenState;
  summary?: PartnerBellSummary;
  items?: PartnerBellItem[];
  onOpenInbox?: () => void;
  onOpenNextOrder?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshPartnerBellScreen({
  state = 'ready',
  summary = defaultSummary,
  items = defaultItems,
  onOpenInbox,
  onOpenNextOrder,
  onRetry,
  onBack,
}: DshPartnerBellScreenProps) {
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
          <Badge label="Branch alerts" tone="warning" />
          <Text role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للشريك</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            هذا الجرس يضيء عندما يصل طلب جديد أو يحتاج الفرع إلى موافقة سريعة قبل تحريره للكابتن.
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="طلبات جديدة" value={String(items.length)} deltaLabel="مباشر" tone="warning" />
          <StatCard label="بحاجة موافقة" value="2" deltaLabel={summary.approvalLabel} tone="brand" />
          <StatCard label="جاهزة للإفراج" value="1" deltaLabel={summary.releaseLabel} tone="success" />
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title={summary.inboxLabel} subtitle="أول قرار يبقى واضحًا حتى لا يتشتت الفريق بين الطلبات." />
        <KeyValueList
          items={[
            { label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
            { label: 'الإجراء التالي', value: summary.releaseLabel, tone: 'success' },
            { label: 'الأولوية', value: 'احفظ القرار القصير ثم حرر الطلب', tone: 'warning' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="الرنات الحالية" subtitle="كل رن يختصر القفز بين الشاشات ويقود إلى قرار واحد." />
        <Box gap={2}>
          {items.map((item) => (
            <ListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </Box>
      </Surface>

      <Surface tone="inset" gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          الجرس هنا لا يملأ الواجهة. هو فقط يسلط الضوء على الطلب الجديد حتى يصدر الفرع قراره بسرعة.
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

export default DshPartnerBellScreen;

