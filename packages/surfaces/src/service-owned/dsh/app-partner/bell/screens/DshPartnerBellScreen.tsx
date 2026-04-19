import React from 'react';
import { BthBadge, BthBox, BthButton, BthKeyValueList, BthListItem, BthMobileScrollView, BthSectionHeader, BthStateView, BthStatCard, BthSurface, BthText } from '@bthwani/ui-kit';

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

type DshPartnerBellScreenProps = {
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
      <BthMobileScrollView padding={4} gap={4}>
        <BthStateView {...stateCopy} onActionPress={onRetry ?? onOpenInbox ?? onBack} />
      </BthMobileScrollView>
    );
  }

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthSurface tone="brand" gap={3}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthBadge label="Branch alerts" tone="warning" />
          <BthText role="titleLg" style={{ textAlign: 'right' }}>جرس الطلبات الجديدة للشريك</BthText>
          <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            هذا الجرس يضيء عندما يصل طلب جديد أو يحتاج الفرع إلى موافقة سريعة قبل تحريره للكابتن.
          </BthText>
        </BthBox>

        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthStatCard label="طلبات جديدة" value={String(items.length)} deltaLabel="مباشر" tone="warning" />
          <BthStatCard label="بحاجة موافقة" value="2" deltaLabel={summary.approvalLabel} tone="brand" />
          <BthStatCard label="جاهزة للإفراج" value="1" deltaLabel={summary.releaseLabel} tone="success" />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title={summary.inboxLabel} subtitle="أول قرار يبقى واضحًا حتى لا يتشتت الفريق بين الطلبات." />
        <BthKeyValueList
          items={[
            { label: 'الحالة', value: summary.approvalLabel, tone: 'brand' },
            { label: 'الإجراء التالي', value: summary.releaseLabel, tone: 'success' },
            { label: 'الأولوية', value: 'احفظ القرار القصير ثم حرر الطلب', tone: 'warning' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="الرنات الحالية" subtitle="كل رن يختصر القفز بين الشاشات ويقود إلى قرار واحد." />
        <BthBox gap={2}>
          {items.map((item) => (
            <BthListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="inset" gap={2}>
        <BthText role="bodyStrong" style={{ textAlign: 'right' }}>{summary.nextActionLabel}</BthText>
        <BthText role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          الجرس هنا لا يملأ الواجهة. هو فقط يسلط الضوء على الطلب الجديد حتى يصدر الفرع قراره بسرعة.
        </BthText>
      </BthSurface>

      <BthBox gap={2}>
        {onOpenNextOrder ? <BthButton label="فتح أول طلب" onPress={onOpenNextOrder} /> : null}
        {onOpenInbox ? <BthButton label="صندوق الطلبات" tone="secondary" onPress={onOpenInbox} /> : null}
        {onBack ? <BthButton label="العودة" tone="ghost" onPress={onBack} /> : null}
        {onRetry ? <BthButton label="إعادة المحاولة" tone="ghost" onPress={onRetry} /> : null}
      </BthBox>
    </BthMobileScrollView>
  );
}

export default DshPartnerBellScreen;
