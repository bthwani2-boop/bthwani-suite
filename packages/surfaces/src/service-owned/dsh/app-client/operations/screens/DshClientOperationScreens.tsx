import React from 'react';
import { BthBox, BthKeyValueList, BthListItem, BthMobileScrollView, BthSectionHeader, BthStatCard, BthSurface, BthText, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../patterns/screens/DshOperationScreen';

export const clientOperationScreenIds = [
  'awnak-order-create',
  'booking-create',
  'chat-read-ack',
  'chat-send',
  'checkout-gate',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'delivery-eta-get',
  'delivery-get',
  'delivery-reassign',
  'delivery-track-get',
  'entitlements-get',
  'estimate-create',
  'estimate-get',
  'external-order-create',
  'gas-refill-order-create',
  'listing-status-update',
  'loyalty-points-redeem',
  'loyalty-points-user-balance',
  'loyalty-points-user-history',
  'order-accept',
  'order-cancel',
  'order-complete',
  'order-create',
  'order-escrow-hold',
  'order-escrow-release',
  'order-get',
  'order-issue-flag',
  'order-proof-code-generate',
  'order-proof-verify',
  'order-rate',
  'order-receipt-get',
  'order-status-get',
  'order-status-update',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
  'proxy-request-create',
  'proxy-request-approve',
  'proxy-request-review',
  'proxy-request-reject',
  'proxy-request-tracking',
  'review-create',
  'reviews-list',
  'service-modes-resolve',
  'subscription-family-get',
  'subscription-family-members-get',
  'subscription-family-members-post',
  'subscription-pro-catalog',
  'subscription-sync',
  'subscription-tier-get',
  'subscription-upgrade-post',
  'zone-set',
] as const;

export type ClientOperationScreenId = (typeof clientOperationScreenIds)[number];

export type ClientGeneratedOperationScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export type ClientOperationKind = 'create' | 'order' | 'delivery' | 'loyalty' | 'subscription' | 'proxy' | 'chat' | 'settings' | 'review';

export type ClientOperationGroupId =
  | 'create-checkout'
  | 'order-delivery'
  | 'messaging-reviews'
  | 'subscription-loyalty'
  | 'proxy-controls';

type ClientOperationDefinition = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  kind: ClientOperationKind;
  group: ClientOperationGroupId;
  stageLabel: string;
  primaryOutcome: string;
};

type ClientOperationDirectoryGroup = {
  id: ClientOperationGroupId;
  title: string;
  subtitle: string;
  itemIds: ClientOperationScreenId[];
};

const createCheckoutIds: ClientOperationScreenId[] = [
  'awnak-order-create',
  'booking-create',
  'estimate-create',
  'external-order-create',
  'gas-refill-order-create',
  'order-create',
  'estimate-get',
  'checkout-gate',
  'pricing-preview',
  'pricing-snapshot-get',
  'promo-apply',
];

const orderDeliveryIds: ClientOperationScreenId[] = [
  'order-accept',
  'order-cancel',
  'order-complete',
  'order-get',
  'order-issue-flag',
  'order-proof-code-generate',
  'order-proof-verify',
  'order-receipt-get',
  'order-status-get',
  'order-status-update',
  'order-escrow-hold',
  'order-escrow-release',
  'delivery-attempt-create',
  'delivery-attempts-list',
  'delivery-close',
  'delivery-eta-get',
  'delivery-get',
  'delivery-reassign',
  'delivery-track-get',
];

const messagingReviewIds: ClientOperationScreenId[] = ['chat-read-ack', 'chat-send', 'order-rate', 'review-create', 'reviews-list'];

const subscriptionLoyaltyIds: ClientOperationScreenId[] = [
  'entitlements-get',
  'loyalty-points-redeem',
  'loyalty-points-user-balance',
  'loyalty-points-user-history',
  'subscription-family-get',
  'subscription-family-members-get',
  'subscription-family-members-post',
  'subscription-pro-catalog',
  'subscription-sync',
  'subscription-tier-get',
  'subscription-upgrade-post',
];

const proxyControlIds: ClientOperationScreenId[] = [
  'proxy-request-create',
  'proxy-request-approve',
  'proxy-request-review',
  'proxy-request-reject',
  'proxy-request-tracking',
  'service-modes-resolve',
  'listing-status-update',
  'zone-set',
];

export const clientOperationDirectoryGroups: ClientOperationDirectoryGroup[] = [
  {
    id: 'create-checkout',
    title: 'Create and checkout',
    subtitle: 'Create, quote, price, and pre-submit controls stay in one lane.',
    itemIds: createCheckoutIds,
  },
  {
    id: 'order-delivery',
    title: 'Order and delivery control',
    subtitle: 'Execution, proof, status, and tracking stay together.',
    itemIds: orderDeliveryIds,
  },
  {
    id: 'messaging-reviews',
    title: 'Messaging and review',
    subtitle: 'Conversation, rating, and feedback stay close to the active order.',
    itemIds: messagingReviewIds,
  },
  {
    id: 'subscription-loyalty',
    title: 'Subscription and loyalty',
    subtitle: 'Benefits, family plans, upgrades, points, and entitlements stay visible.',
    itemIds: subscriptionLoyaltyIds,
  },
  {
    id: 'proxy-controls',
    title: 'Proxy and service controls',
    subtitle: 'Proxy requests and service-control surfaces stay out of the shopping lane.',
    itemIds: proxyControlIds,
  },
];

const badgeLabelByKind: Record<ClientOperationKind, string> = {
  create: 'Create',
  order: 'Order',
  delivery: 'Delivery',
  loyalty: 'Loyalty',
  subscription: 'Subscription',
  proxy: 'Control',
  chat: 'Comms',
  settings: 'Settings',
  review: 'Review',
};

const stageLabelByKind: Record<ClientOperationKind, string> = {
  create: 'Pre-submit control',
  order: 'Order snapshot',
  delivery: 'Live movement',
  loyalty: 'Benefit visibility',
  subscription: 'Benefit visibility',
  proxy: 'Control lane',
  chat: 'Conversation state',
  settings: 'Service control',
  review: 'Feedback capture',
};

const primaryOutcomeByKind: Record<ClientOperationKind, string> = {
  create: 'The request stays in the active creation lane without extra detours.',
  order: 'The order checkpoint stays visible and easy to continue.',
  delivery: 'The delivery state stays readable while the user remains in flow.',
  loyalty: 'Points and benefits stay visible before the next action.',
  subscription: 'Subscription value stays visible before the next action.',
  proxy: 'The control surface stays explicit without leaking into shopping.',
  chat: 'The conversation stays attached to the active order.',
  settings: 'The service control stays explicit before browsing continues.',
  review: 'Feedback is captured while the order is still fresh.',
};

const subtitleByKind: Record<ClientOperationKind, string> = {
  create: 'Compact create and pre-submit work stays in one lane.',
  order: 'Order context remains explicit and easy to continue.',
  delivery: 'Delivery control stays readable inside the tracking lane.',
  loyalty: 'Points and benefits stay visible without leaving the flow.',
  subscription: 'Subscription and family management stay close to the benefit path.',
  proxy: 'Proxy and service-control decisions stay explicit.',
  chat: 'Conversation stays attached to the current order.',
  settings: 'Service settings stay visible before the customer continues.',
  review: 'Feedback stays close to the order so the user can complete it quickly.',
};

function humanizeScreenId(screenId: ClientOperationScreenId) {
  return screenId
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function getOperationKind(screenId: ClientOperationScreenId): ClientOperationKind {
  if (screenId === 'chat-read-ack' || screenId === 'chat-send') {
    return 'chat';
  }

  if (screenId.startsWith('proxy-request-')) {
    return 'proxy';
  }

  if (screenId.startsWith('subscription-')) {
    return 'subscription';
  }

  if (screenId.startsWith('loyalty-') || screenId === 'entitlements-get') {
    return 'loyalty';
  }

  if (screenId.startsWith('delivery-')) {
    return 'delivery';
  }

  if (screenId === 'order-rate' || screenId === 'review-create' || screenId === 'reviews-list') {
    return 'review';
  }

  if (screenId === 'listing-status-update' || screenId === 'service-modes-resolve' || screenId === 'zone-set') {
    return 'settings';
  }

  if (screenId === 'awnak-order-create' || screenId === 'booking-create' || screenId === 'estimate-create' || screenId === 'external-order-create' || screenId === 'gas-refill-order-create' || screenId === 'checkout-gate' || screenId === 'estimate-get' || screenId === 'pricing-preview' || screenId === 'pricing-snapshot-get' || screenId === 'promo-apply') {
    return 'create';
  }

  return 'order';
}

function getOperationGroup(screenId: ClientOperationScreenId): ClientOperationGroupId {
  if (createCheckoutIds.includes(screenId)) {
    return 'create-checkout';
  }

  if (orderDeliveryIds.includes(screenId)) {
    return 'order-delivery';
  }

  if (messagingReviewIds.includes(screenId)) {
    return 'messaging-reviews';
  }

  if (subscriptionLoyaltyIds.includes(screenId)) {
    return 'subscription-loyalty';
  }

  return 'proxy-controls';
}

function getOperationDefinition(screenId: ClientOperationScreenId): ClientOperationDefinition {
  const kind = getOperationKind(screenId);
  const group = getOperationGroup(screenId);

  return {
    title: humanizeScreenId(screenId),
    subtitle: subtitleByKind[kind],
    badgeLabel: badgeLabelByKind[kind],
    kind,
    group,
    stageLabel: stageLabelByKind[kind],
    primaryOutcome: primaryOutcomeByKind[kind],
  };
}

function primaryLabelByKind(kind: ClientOperationKind) {
  if (kind === 'create') return 'Open create flow';
  if (kind === 'delivery') return 'Open tracking';
  if (kind === 'loyalty') return 'Open loyalty context';
  if (kind === 'subscription') return 'Open subscription context';
  if (kind === 'proxy') return 'Open control context';
  if (kind === 'review') return 'Open review flow';
  if (kind === 'settings') return 'Return to service context';
  if (kind === 'chat') return 'Open conversation';
  return 'Open order flow';
}

export const clientOperationDefinitions: Record<ClientOperationScreenId, ClientOperationDefinition> = Object.fromEntries(
  clientOperationScreenIds.map((screenId) => [screenId, getOperationDefinition(screenId)]),
) as Record<ClientOperationScreenId, ClientOperationDefinition>;

function buildOperationContent(definition: ClientOperationDefinition, draftValue: string, setDraftValue: (nextValue: string) => void) {
  const guidanceItems = [
    {
      title: definition.stageLabel,
      subtitle: definition.primaryOutcome,
      meta: 'Primary emphasis',
      badgeLabel: definition.badgeLabel,
    },
    {
      title: 'Next handoff',
      subtitle: 'Keep the customer in one clear lane after this step completes.',
      meta: 'Flow control',
      badgeLabel: 'Next',
    },
  ];

  if (definition.kind === 'chat') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Conversation lane" value="Live" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Expected behavior" value="Short" deltaLabel="Actionable and explicit" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={3}>
          <BthTextField
            label="Message draft"
            value={draftValue}
            onChangeText={setDraftValue}
            hint="Keep the note short, concrete, and tied to the active delivery or order."
          />
        </BthSurface>
      </BthBox>
    );
  }

  if (definition.kind === 'proxy') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Control state" value="Focused" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Decision style" value="Guarded" deltaLabel="Review before commit" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={3}>
          <BthKeyValueList
            items={[
              { label: 'Surface', value: definition.title },
              { label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'Scope', value: 'Proxy and service-control handling' },
            ]}
          />
        </BthSurface>
        <BthSurface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </BthSurface>
      </BthBox>
    );
  }

  if (definition.kind === 'subscription' || definition.kind === 'loyalty') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Benefit state" value="Visible" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Customer confidence" value="High" deltaLabel="Value is explicit before action" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={3}>
          <BthKeyValueList
            items={[
              { label: 'Surface', value: definition.title },
              { label: 'Customer benefit', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'Category', value: definition.kind === 'subscription' ? 'Subscription management' : 'Loyalty value' },
            ]}
          />
        </BthSurface>
      </BthBox>
    );
  }

  if (definition.kind === 'delivery') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Delivery lane" value="Active" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Recovery bias" value="Fast" deltaLabel="Minimize taps during active delivery" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </BthSurface>
      </BthBox>
    );
  }

  if (definition.kind === 'review') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Feedback lane" value="Ready" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Friction target" value="Low" deltaLabel="Capture sentiment while the order is still fresh" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={2}>
          {guidanceItems.map((item) => (
            <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
          ))}
        </BthSurface>
      </BthBox>
    );
  }

  if (definition.kind === 'settings') {
    return (
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthStatCard label="Control state" value="Visible" deltaLabel={definition.stageLabel} tone="info" />
          <BthStatCard label="Flow clarity" value="High" deltaLabel="Avoid hidden settings detours" tone="success" />
        </BthSurface>
        <BthSurface tone="raised" gap={3}>
          <BthKeyValueList
            items={[
              { label: 'Surface', value: definition.title },
              { label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
              { label: 'Group', value: definition.group },
            ]}
          />
        </BthSurface>
      </BthBox>
    );
  }

  return (
    <BthBox gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthStatCard label="Current lane" value="Ready" deltaLabel={definition.stageLabel} tone="info" />
        <BthStatCard label="Primary outcome" value="Visible" deltaLabel="One dominant next action" tone="success" />
      </BthSurface>
      <BthSurface tone="raised" gap={3}>
        <BthKeyValueList
          items={[
            { label: 'Surface', value: definition.title },
            { label: 'Purpose', value: definition.primaryOutcome, tone: 'brand' },
            { label: 'Group', value: definition.group },
          ]}
        />
      </BthSurface>
    </BthBox>
  );
}

type OperationScreenViewProps = ClientGeneratedOperationScreenProps & {
  screenId: ClientOperationScreenId;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

function OperationScreenView({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
  primaryActionLabel,
  secondaryActionLabel,
}: OperationScreenViewProps) {
  const [draftValue, setDraftValue] = React.useState('');
  const definition = clientOperationDefinitions[screenId];

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      content={buildOperationContent(definition, draftValue, setDraftValue)}
      primaryActionLabel={primaryActionLabel ?? primaryLabelByKind(definition.kind)}
      secondaryActionLabel={secondaryActionLabel ?? 'Back to operations directory'}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
    />
  );
}

function createOperationScreen(screenId: ClientOperationScreenId) {
  return function GeneratedClientOperationScreen(props: ClientGeneratedOperationScreenProps) {
    return <OperationScreenView screenId={screenId} {...props} />;
  };
}

export function DshClientOperationDirectoryScreen({ onOpenScreen }: { onOpenScreen?: (screenId: ClientOperationScreenId) => void }) {
  const operationScreenCount = clientOperationScreenIds.length;

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">DSH client operations library</BthText>
        <BthText role="bodyMd" tone="muted">
          Internal capability library for residual DSH client flows, grouped by customer journey instead of a flat fallback bucket.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthStatCard label="Covered capabilities" value={String(operationScreenCount)} deltaLabel="Documented internal client matrix" tone="info" />
        <BthStatCard label="Navigation model" value="Grouped" deltaLabel="Create, delivery, benefits, proxy, settings" tone="success" />
      </BthSurface>

      {clientOperationDirectoryGroups.map((group) => (
        <BthSurface key={group.title} tone="raised" gap={3}>
          <BthSectionHeader title={group.title} subtitle={group.subtitle} />
          <BthBox gap={2}>
            {group.itemIds.map((itemId) => {
              const item = clientOperationDefinitions[itemId];

              return <BthListItem key={itemId} title={item.title} subtitle={item.subtitle} meta={item.stageLabel} badgeLabel={item.badgeLabel} onPress={() => onOpenScreen?.(itemId)} />;
            })}
          </BthBox>
        </BthSurface>
      ))}
    </BthMobileScrollView>
  );
}

export const clientOperationScreenRegistry: Record<ClientOperationScreenId, React.ComponentType<ClientGeneratedOperationScreenProps>> = Object.fromEntries(
  clientOperationScreenIds.map((screenId) => [screenId, createOperationScreen(screenId)]),
) as Record<ClientOperationScreenId, React.ComponentType<ClientGeneratedOperationScreenProps>>;

type ConversationScreenId = 'chat-read-ack' | 'chat-send';

export type DshConversationHubScreenProps = {
  screenId: ConversationScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshConversationHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshConversationHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'chat-send' ? 'Send message' : 'Acknowledge thread'}
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshOrderIssueHubScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshOrderIssueHubScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshOrderIssueHubScreenProps) {
  return (
    <OperationScreenView
      screenId="order-issue-flag"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="Flag issue"
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshProxyHubScreenProps = {
  screenId: 'proxy-request-create' | 'proxy-request-approve' | 'proxy-request-review' | 'proxy-request-reject' | 'proxy-request-tracking';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshProxyHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshProxyHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'proxy-request-tracking' ? 'Open tracking' : screenId === 'proxy-request-reject' ? 'Reject request' : screenId === 'proxy-request-approve' ? 'Approve request' : screenId === 'proxy-request-review' ? 'Review request' : 'Create request'}
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshTrustHubScreenProps = {
  screenId: 'order-proof-code-generate' | 'order-proof-verify' | 'order-escrow-hold' | 'order-escrow-release';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshTrustHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshTrustHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel={screenId === 'order-proof-code-generate' ? 'Generate code' : screenId === 'order-proof-verify' ? 'Verify handoff' : screenId === 'order-escrow-hold' ? 'Hold funds' : 'Release funds'}
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshServiceSettingsHubScreenProps = {
  screenId: 'listing-status-update' | 'service-modes-resolve' | 'zone-set';
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshServiceSettingsHubScreen({ screenId, state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshServiceSettingsHubScreenProps) {
  return (
    <OperationScreenView
      screenId={screenId}
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="Confirm settings"
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshZoneSetScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshZoneSetScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshZoneSetScreenProps) {
  return (
    <OperationScreenView
      screenId="zone-set"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="Confirm zone"
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export type DshListingStatusUpdateScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshListingStatusUpdateScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshListingStatusUpdateScreenProps) {
  return (
    <OperationScreenView
      screenId="listing-status-update"
      state={state}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      primaryActionLabel="Confirm listing state"
      secondaryActionLabel="Back to operations directory"
    />
  );
}

export default DshClientOperationDirectoryScreen;

export type ClientSupportScreenId = ClientOperationScreenId;
export type ClientGeneratedSupportScreenProps = ClientGeneratedOperationScreenProps;
export type ClientSupportKind = ClientOperationKind;
export type ClientSupportGroupId = ClientOperationGroupId;

export const clientSupportDefinitions = clientOperationDefinitions;
export const clientSupportDirectoryGroups = clientOperationDirectoryGroups;
export const clientSupportScreenRegistry = clientOperationScreenRegistry;
export const DshClientSupportDirectoryScreen = DshClientOperationDirectoryScreen;
