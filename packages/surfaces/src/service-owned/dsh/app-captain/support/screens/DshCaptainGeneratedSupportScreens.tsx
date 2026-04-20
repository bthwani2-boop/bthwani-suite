import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthStatCard,
  BthSurface,
  BthText,
  BthTextField,
} from '@bthwani/ui-kit';

export type CaptainSupportScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'success' | 'disabled';

export type CaptainSupportScreenId =
  | 'chat-read-ack'
  | 'chat-send'
  | 'cod-balance'
  | 'job-reject'
  | 'order-accept'
  | 'order-deliver'
  | 'order-details'
  | 'order-get'
  | 'order-pickup'
  | 'orders-list'
  | 'orders-offers-list'
  | 'profile-get'
  | 'proof-upload'
  | 'tier-evaluate'
  | 'tier-info';

type CaptainMetric = {
  label: string;
  value: string;
  deltaLabel: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

type CaptainConfig = {
  id: CaptainSupportScreenId;
  title: string;
  subtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  keyValues?: Array<{ label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }>;
  metrics?: CaptainMetric[];
  listItems?: Array<{ title: string; subtitle: string; meta: string; badgeLabel?: string }>;
  inputLabel?: string;
  inputHint?: string;
};

export type CaptainGeneratedSupportScreenProps = {
  state?: CaptainSupportScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
  onBack?: () => void;
};

const captainSupportConfigs: Record<CaptainSupportScreenId, CaptainConfig> = {
  'chat-read-ack': {
    id: 'chat-read-ack',
    title: 'Captain chat read acknowledgement',
    subtitle: 'Acknowledge the newest operational conversation without leaving the active order lane.',
    heroTitle: 'Unread operational messages',
    heroDescription: 'The captain clears unread communication while staying focused on the next route step.',
    primaryLabel: 'Mark chat as read',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Branch', subtitle: 'Order is ready at counter 2.', meta: '2 min ago', badgeLabel: 'Unread' },
      { title: 'Customer', subtitle: 'Please call on arrival.', meta: '5 min ago', badgeLabel: 'Unread' },
    ],
  },
  'chat-send': {
    id: 'chat-send',
    title: 'Captain chat send',
    subtitle: 'Send a route-specific message from a focused compose surface.',
    heroTitle: 'Route communication',
    heroDescription: 'Use one concise message so the receiving party can act immediately.',
    primaryLabel: 'Send message',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Message',
    inputHint: 'Example: arrived at the pickup gate and waiting for handoff.',
  },
  'cod-balance': {
    id: 'cod-balance',
    title: 'COD balance',
    subtitle: 'Review cash-on-delivery balance and pending reconciliation.',
    heroTitle: 'Cash visibility',
    heroDescription: 'The captain can verify collected cash before the settlement workflow continues.',
    primaryLabel: 'Refresh balance',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Collected today', value: '420 SAR', deltaLabel: 'Cash received', tone: 'info' },
      { label: 'Pending deposit', value: '180 SAR', deltaLabel: 'Needs settlement', tone: 'warning' },
      { label: 'Variance', value: '0 SAR', deltaLabel: 'Balanced', tone: 'success' },
    ],
  },
  'job-reject': {
    id: 'job-reject',
    title: 'Job reject',
    subtitle: 'Reject a order with a visible operational reason.',
    heroTitle: 'Exception handling',
    heroDescription: 'Rejection should remain rare and fully explicit so reassignment can happen cleanly.',
    primaryLabel: 'Reject order',
    secondaryLabel: 'Back to support directory',
    inputLabel: 'Rejection reason',
    inputHint: 'Example: vehicle issue or unsafe route condition.',
  },
  'order-accept': {
    id: 'order-accept',
    title: 'Order accept',
    subtitle: 'Confirm the captain accepts the order and is committing to pickup.',
    heroTitle: 'Captain acceptance',
    heroDescription: 'Acceptance moves the route from queued work into committed execution.',
    primaryLabel: 'Accept order',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Pickup ETA', value: '8 min' },
      { label: 'Dropoff zone', value: 'Olaya' },
      { label: 'Commitment', value: 'Pending captain confirmation', tone: 'warning' },
    ],
  },
  'order-deliver': {
    id: 'order-deliver',
    title: 'Order deliver',
    subtitle: 'Close the route with final delivery confirmation.',
    heroTitle: 'Last-mile closure',
    heroDescription: 'The captain should confirm delivery only once proof and recipient handoff are clear.',
    primaryLabel: 'Confirm delivery',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Recipient', value: 'Customer confirmed' },
      { label: 'Proof', value: 'Code entered', tone: 'success' },
      { label: 'Balance impact', value: 'Updates COD if applicable' },
    ],
  },
  'order-details': {
    id: 'order-details',
    title: 'Order details',
    subtitle: 'Review the captain-focused route snapshot.',
    heroTitle: 'Captain order snapshot',
    heroDescription: 'Only pickup, dropoff, timing, and current stage should remain visible here.',
    primaryLabel: 'Refresh order detail',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Pickup', value: 'Burger Lab - Hittin branch' },
      { label: 'Dropoff', value: 'Olaya District' },
      { label: 'Stage', value: 'Heading to pickup', tone: 'brand' },
    ],
  },
  'order-get': {
    id: 'order-get',
    title: 'Order get',
    subtitle: 'Open the compact read view for the assigned route.',
    heroTitle: 'Assigned route read view',
    heroDescription: 'The captain can reload route context without reopening the inbox.',
    primaryLabel: 'Refresh route snapshot',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Order', value: '#9021' },
      { label: 'Current ETA', value: '8 min' },
      { label: 'Traffic impact', value: 'Moderate', tone: 'warning' },
    ],
  },
  'order-pickup': {
    id: 'order-pickup',
    title: 'Order pickup',
    subtitle: 'Confirm branch pickup before the delivery leg starts.',
    heroTitle: 'Pickup confirmation',
    heroDescription: 'Pickup is a separate confirmation step so the route timeline stays honest.',
    primaryLabel: 'Confirm pickup',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Branch', value: 'Burger Lab - Hittin branch' },
      { label: 'Package status', value: 'Ready at counter 2' },
      { label: 'Next step', value: 'Navigate to customer', tone: 'brand' },
    ],
  },
  'orders-list': {
    id: 'orders-list',
    title: 'Orders list',
    subtitle: 'Browse all captain orders from one focused queue screen.',
    heroTitle: 'Captain route queue',
    heroDescription: 'This list complements the inbox with a broader yet still order-oriented view.',
    primaryLabel: 'Refresh order list',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Order #9021', subtitle: 'Burger Lab to Olaya', meta: 'Pickup in 8 min', badgeLabel: 'Next up' },
      { title: 'Order #9024', subtitle: 'Green Bowl to King Fahad Rd', meta: 'Pickup in 15 min', badgeLabel: 'Queued' },
    ],
  },
  'orders-offers-list': {
    id: 'orders-offers-list',
    title: 'Orders offers list',
    subtitle: 'Review open order offers that are not yet accepted.',
    heroTitle: 'Available order offers',
    heroDescription: 'Offer review stays separated from accepted orders so the captain always knows commitment level.',
    primaryLabel: 'Refresh offers',
    secondaryLabel: 'Back to support directory',
    listItems: [
      { title: 'Offer #440', subtitle: 'Bean House to Nakheel', meta: 'Estimated payout 22 SAR', badgeLabel: 'Open' },
      { title: 'Offer #441', subtitle: 'Green Bowl to Olaya', meta: 'Estimated payout 19 SAR', badgeLabel: 'Open' },
    ],
  },
  'profile-get': {
    id: 'profile-get',
    title: 'Captain profile',
    subtitle: 'Read the current captain profile and route readiness status.',
    heroTitle: 'Captain identity snapshot',
    heroDescription: 'The route profile remains accessible without leaving the DSH surface family.',
    primaryLabel: 'Refresh profile',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Captain', value: 'Captain #9021' },
      { label: 'Vehicle', value: 'Motorbike' },
      { label: 'Readiness', value: 'Online and available', tone: 'success' },
    ],
  },
  'proof-upload': {
    id: 'proof-upload',
    title: 'Proof upload',
    subtitle: 'Capture proof when final delivery confirmation needs media support.',
    heroTitle: 'Delivery evidence',
    heroDescription: 'Proof capture remains distinct from the delivery confirmation so exceptions can be handled clearly.',
    primaryLabel: 'Upload proof',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Required format', value: 'Photo or signed confirmation' },
      { label: 'Current status', value: 'Pending upload', tone: 'warning' },
      { label: 'Follow-up', value: 'Close route after proof' },
    ],
  },
  'tier-evaluate': {
    id: 'tier-evaluate',
    title: 'Tier evaluate',
    subtitle: 'Review whether the captain is ready for the next tier.',
    heroTitle: 'Tier progression check',
    heroDescription: 'Tier logic stays operationally visible so the captain knows what affects eligibility.',
    primaryLabel: 'Evaluate tier',
    secondaryLabel: 'Back to support directory',
    metrics: [
      { label: 'Completion rate', value: '97%', deltaLabel: 'Last 30 days', tone: 'success' },
      { label: 'Cancellation rate', value: '1.2%', deltaLabel: 'Last 30 days', tone: 'info' },
      { label: 'Incidents', value: '0', deltaLabel: 'Safety issues', tone: 'success' },
    ],
  },
  'tier-info': {
    id: 'tier-info',
    title: 'Tier info',
    subtitle: 'Read the current benefits and requirements of the active captain tier.',
    heroTitle: 'Current tier benefits',
    heroDescription: 'The captain should understand what the current tier unlocks and what the next tier requires.',
    primaryLabel: 'Refresh tier info',
    secondaryLabel: 'Back to support directory',
    keyValues: [
      { label: 'Current tier', value: 'Gold', tone: 'brand' },
      { label: 'Payout bonus', value: '+8%' },
      { label: 'Next tier threshold', value: '120 completed routes' },
    ],
  },
};

function renderCaptainSupportState(state: Exclude<CaptainSupportScreenState, 'ready' | 'disabled'>, onRetry?: () => void, onBack?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="No captain support content is loaded"
        description="Reload the screen and keep the order context stable."
        actionLabel={onRetry ? 'Reload support screen' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="Captain support screen is offline"
        description="Retry the support step when connectivity returns."
        actionLabel={onRetry ? 'Retry support screen' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'success') {
    return (
      <BthStateView
        stateId="success"
        title="Captain support action completed"
        description="The support step is complete and the captain can continue to the next route action."
        actionLabel={onBack ? 'Back to support directory' : undefined}
        onActionPress={onBack}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Captain support screen failed"
      description="Retry without leaving the order-focused support lane."
      actionLabel={onRetry ? 'Retry support step' : undefined}
      onActionPress={onRetry}
    />
  );
}

function createCaptainSupportScreen(config: CaptainConfig) {
  return function GeneratedCaptainSupportScreen({
    state = 'ready',
    onPrimaryAction,
    onSecondaryAction,
    onRetry,
    onBack,
  }: CaptainGeneratedSupportScreenProps) {
    const [draftValue, setDraftValue] = React.useState('');

    if (state !== 'ready' && state !== 'disabled') {
      return renderCaptainSupportState(state, onRetry, onBack);
    }

    const isDisabled = state === 'disabled';

    return (
      <BthMobileScrollView padding={4} gap={4}>
        <BthBox gap={2}>
          <BthText role="titleLg">{config.title}</BthText>
          <BthText role="bodyMd" tone="muted">{config.subtitle}</BthText>
        </BthBox>

        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title={config.heroTitle} subtitle={config.heroDescription} />
          {config.metrics?.map((metric) => (
            <BthStatCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              deltaLabel={metric.deltaLabel}
              tone={metric.tone ?? 'default'}
            />
          ))}
        </BthSurface>

        {config.keyValues?.length ? (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="Route details" subtitle="Only the details needed for the immediate captain action stay visible." />
            <BthKeyValueList items={config.keyValues} />
          </BthSurface>
        ) : null}

        {config.listItems?.length ? (
          <BthSurface tone="default" gap={3}>
            <BthSectionHeader title="Current queue" subtitle="Every item keeps the next route decision explicit." />
            <BthBox gap={2}>
              {config.listItems.map((item) => (
                <BthListItem
                  key={`${config.id}-${item.title}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  badgeLabel={item.badgeLabel}
                />
              ))}
            </BthBox>
          </BthSurface>
        ) : null}

        {config.inputLabel ? (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="Draft input" subtitle="One concise captain input keeps the workflow focused." />
            <BthTextField
              label={config.inputLabel}
              value={draftValue}
              onChangeText={setDraftValue}
              hint={config.inputHint}
              editable={!isDisabled}
            />
          </BthSurface>
        ) : null}

        <BthButton label={config.primaryLabel} onPress={onPrimaryAction} disabled={isDisabled} />
        {config.secondaryLabel ? <BthButton label={config.secondaryLabel} tone="secondary" onPress={onSecondaryAction ?? onBack} /> : null}
      </BthMobileScrollView>
    );
  };
}

export const DshCaptainChatReadAckScreen = createCaptainSupportScreen(captainSupportConfigs['chat-read-ack']);
export const DshCaptainChatSendScreen = createCaptainSupportScreen(captainSupportConfigs['chat-send']);
export const DshCaptainCodBalanceScreen = createCaptainSupportScreen(captainSupportConfigs['cod-balance']);
export const DshCaptainJobRejectScreen = createCaptainSupportScreen(captainSupportConfigs['job-reject']);
export const DshCaptainOrderAcceptScreen = createCaptainSupportScreen(captainSupportConfigs['order-accept']);
export const DshCaptainOrderDeliverScreen = createCaptainSupportScreen(captainSupportConfigs['order-deliver']);
export const DshCaptainOrderDetailsScreen = createCaptainSupportScreen(captainSupportConfigs['order-details']);
export const DshCaptainOrderGetScreen = createCaptainSupportScreen(captainSupportConfigs['order-get']);
export const DshCaptainOrderPickupScreen = createCaptainSupportScreen(captainSupportConfigs['order-pickup']);
export const DshCaptainOrdersListScreen = createCaptainSupportScreen(captainSupportConfigs['orders-list']);
export const DshCaptainOrdersOffersListScreen = createCaptainSupportScreen(captainSupportConfigs['orders-offers-list']);
export const DshCaptainProfileGetScreen = createCaptainSupportScreen(captainSupportConfigs['profile-get']);
export const DshCaptainProofUploadScreen = createCaptainSupportScreen(captainSupportConfigs['proof-upload']);
export const DshCaptainTierEvaluateScreen = createCaptainSupportScreen(captainSupportConfigs['tier-evaluate']);
export const DshCaptainTierInfoScreen = createCaptainSupportScreen(captainSupportConfigs['tier-info']);

