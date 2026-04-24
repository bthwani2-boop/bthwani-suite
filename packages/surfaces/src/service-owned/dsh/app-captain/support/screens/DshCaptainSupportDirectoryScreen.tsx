import React from 'react';
import {
  Box,
  ListItem,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
} from '@bthwani/ui-kit';
import type { CaptainSupportScreenId } from './DshCaptainGeneratedSupportScreens';

export type DshCaptainSupportDirectoryScreenProps = {
  onOpenScreen?: (screenId: CaptainSupportScreenId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: CaptainSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'Execution flow',
    subtitle: 'The captain route lifecycle from offer to completion.',
    items: [
      { id: 'orders-offers-list', title: 'Orders offers list', subtitle: 'Review open offers before commitment.', badgeLabel: 'Offers' },
      { id: 'orders-list', title: 'Orders list', subtitle: 'Browse active route queue.', badgeLabel: 'Queue' },
      { id: 'order-accept', title: 'Order accept', subtitle: 'Accept the order.', badgeLabel: 'Execution' },
      { id: 'order-get', title: 'Order get', subtitle: 'Open route snapshot.', badgeLabel: 'Read' },
      { id: 'order-details', title: 'Order details', subtitle: 'Inspect order detail.', badgeLabel: 'Read' },
      { id: 'order-pickup', title: 'Order pickup', subtitle: 'Confirm pickup.', badgeLabel: 'Execution' },
      { id: 'order-deliver', title: 'Order deliver', subtitle: 'Confirm delivery.', badgeLabel: 'Closure' },
      { id: 'proof-upload', title: 'Proof upload', subtitle: 'Upload delivery evidence.', badgeLabel: 'Proof' },
      { id: 'job-reject', title: 'Job reject', subtitle: 'Reject with reason.', badgeLabel: 'Exception' },
    ],
  },
  {
    title: 'Captain support',
    subtitle: 'Communication, balance, profile, and performance.',
    items: [
      { id: 'chat-read-ack', title: 'Chat read acknowledgement', subtitle: 'Clear unread route messages.', badgeLabel: 'Comms' },
      { id: 'chat-send', title: 'Chat send', subtitle: 'Send a route message.', badgeLabel: 'Comms' },
      { id: 'cod-balance', title: 'COD balance', subtitle: 'Review cash collection.', badgeLabel: 'Finance' },
      { id: 'profile-get', title: 'Captain profile', subtitle: 'Read captain profile.', badgeLabel: 'Profile' },
      { id: 'tier-evaluate', title: 'Tier evaluate', subtitle: 'Evaluate next tier readiness.', badgeLabel: 'Tier' },
      { id: 'tier-info', title: 'Tier info', subtitle: 'Read current tier benefits.', badgeLabel: 'Tier' },
    ],
  },
];

export function DshCaptainSupportDirectoryScreen({ onOpenScreen }: DshCaptainSupportDirectoryScreenProps) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">Captain support directory</Text>
        <Text role="bodyMd" tone="muted">
          Central directory for the remaining DSH captain surfaces so every named workflow is reachable from one owned execution lane.
        </Text>
      </Box>

      {groups.map((group) => (
        <Surface key={group.title} tone="raised" gap={3}>
          <SectionHeader title={group.title} subtitle={group.subtitle} />
          <Box gap={2}>
            {group.items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                meta="Open the named captain surface"
                badgeLabel={item.badgeLabel}
                onPress={() => onOpenScreen?.(item.id)}
              />
            ))}
          </Box>
        </Surface>
      ))}
    </MobileScrollView>
  );
}

export default DshCaptainSupportDirectoryScreen;
