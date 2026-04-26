import React from 'react';
import {
  Box,
  ListItem,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
} from '@bthwani/ui-kit';
import type { PartnerSupportScreenId } from './DshPartnerGeneratedSupportScreens';

export type DshPartnerSupportDirectoryScreenProps = {
  onOpenScreen?: (screenId: PartnerSupportScreenId) => void;
};

const groups: Array<{
  title: string;
  subtitle: string;
  items: Array<{ id: PartnerSupportScreenId; title: string; subtitle: string; badgeLabel: string }>;
}> = [
  {
    title: 'Store operations',
    subtitle: 'Branch state, listing, profile, and onboarding actions under account.',
    items: [
      { id: 'profile-get', title: 'Partner profile', subtitle: 'Read current branch profile.', badgeLabel: 'Read' },
      { id: 'store-update', title: 'Store update', subtitle: 'Apply branch profile updates.', badgeLabel: 'Update' },
      { id: 'store-status-update', title: 'Store status update', subtitle: 'Open or close the branch.', badgeLabel: 'Update' },
      { id: 'listing-status-update', title: 'Listing status update', subtitle: 'Control storefront visibility.', badgeLabel: 'Update' },
      { id: 'store-service-modes-update', title: 'Service modes update', subtitle: 'Publish delivery and pickup modes.', badgeLabel: 'Update' },
      { id: 'auction-status-update', title: 'Auction status update', subtitle: 'Control auction participation.', badgeLabel: 'Update' },
      { id: 'store-nomination', title: 'Store nomination', subtitle: 'Nominate a new branch.', badgeLabel: 'Onboarding' },
      { id: 'identity-submit', title: 'Identity submit', subtitle: 'Submit identity documents.', badgeLabel: 'Compliance' },
      { id: 'doc-upload', title: 'Document upload', subtitle: 'Upload branch compliance files.', badgeLabel: 'Compliance' },
      { id: 'video-upload', title: 'رفع الفيديو', subtitle: 'أرسل فيديو قصيرًا لمراجعة التسويق.', badgeLabel: 'وسائط' },
      { id: 'intake-start', title: 'Intake start', subtitle: 'Start the branch intake flow.', badgeLabel: 'Onboarding' },
      { id: 'manager-invite', title: 'Manager invite', subtitle: 'Invite a branch manager.', badgeLabel: 'Access' },
      { id: 'team-management', title: 'Team management', subtitle: 'Manage branch staff and roles.', badgeLabel: 'Access' },
    ],
  },
  {
    title: 'Catalog and messaging',
    subtitle: 'Inventory maintenance and branch communication tools.',
    items: [
      { id: 'inventory-adjust', title: 'Inventory adjust', subtitle: 'Apply fast stock corrections.', badgeLabel: 'Catalog' },
      { id: 'inventory-update', title: 'Inventory update', subtitle: 'Publish a broader stock update.', badgeLabel: 'Catalog' },
      { id: 'items-upsert', title: 'Items upsert', subtitle: 'Create or edit branch items.', badgeLabel: 'Catalog' },
      { id: 'chat-read-ack', title: 'Chat read acknowledgement', subtitle: 'Clear unread branch chat.', badgeLabel: 'Comms' },
      { id: 'chat-send', title: 'Chat send', subtitle: 'Send an operational message.', badgeLabel: 'Comms' },
      { id: 'quick-reply-config', title: 'Quick reply config', subtitle: 'Review quick-reply presets.', badgeLabel: 'Comms' },
      { id: 'quick-reply-settings', title: 'Quick reply settings', subtitle: 'Adjust quick-reply policy.', badgeLabel: 'Comms' },
      { id: 'quick-reply-setup', title: 'Quick reply setup', subtitle: 'Create a new preset.', badgeLabel: 'Comms' },
    ],
  },
  {
    title: 'التحكم التجاري والتحليلات',
    subtitle: 'الرؤية، العمولة، والاشتراك في مكان واحد.',
    items: [
      { id: 'audience-insights', title: 'Audience insights', subtitle: 'Review branch demand mix.', badgeLabel: 'Insights' },
      { id: 'staff-analytics', title: 'Staff analytics', subtitle: 'Inspect team execution load.', badgeLabel: 'Insights' },
      { id: 'commission-by-mode', title: 'Commission by mode', subtitle: 'Compare commercial mode impact.', badgeLabel: 'Commercial' },
      { id: 'subscription', title: 'بثواني برو', subtitle: 'راجع الخطة الحالية والعائلة ومسار الترقية.', badgeLabel: 'اشتراك' },
    ],
  },
];

export function DshPartnerSupportDirectoryScreen({ onOpenScreen }: DshPartnerSupportDirectoryScreenProps) {
  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">مداخل الحساب للشريك</Text>
        <Text role="bodyMd" tone="muted">
          تم تجميع المجالات غير الخاصة بالطلبات داخل الحساب في دليل واحد واضح لتقليل التشويش على مركز الطلبات.
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
                meta="Open the named support surface"
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

export default DshPartnerSupportDirectoryScreen;