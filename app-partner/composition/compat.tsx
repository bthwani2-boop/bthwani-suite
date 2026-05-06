import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import { DshEntryScreen } from '../../dsh/frontend/app-partner/DshPartnerEntryScreen';
import { PartnerOrdersInboxScreen, PartnerOrderDetailScreen } from '../../dsh/frontend/app-partner/DshPartnerOrdersScreen';
import { DshInventoryManagementScreen } from '../../dsh/frontend/app-partner/DshPartnerInventoryScreen';
import { PartnerDshConsoleScreen } from '../../dsh/frontend/app-partner/DshPartnerConsoleScreen';

export type PartnerWalletHubDestination = 'partner_subscription' | 'partner_settlement_summary' | 'partner_payouts';

export type PartnerStoreScopeOption = {
  id: string;
  label: string;
  description: string;
};

function PlaceholderScreen({
  title,
  subtitle,
  onBack,
  onSecondaryAction,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  onSecondaryAction?: () => void;
}) {
  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl">
      <Text role="titleMd">{title}</Text>
      <Text role="bodyMd" tone="muted">
        {subtitle}
      </Text>
      <Box layoutDirection="row" gap={3}>
        {onBack ? <Button onPress={onBack}>عودة</Button> : null}
        {onSecondaryAction ? <Button onPress={onSecondaryAction}>الإجراء التالي</Button> : null}
      </Box>
    </Surface>
  );
}

function createPlaceholderScreen(title: string, subtitle: string) {
  return function PartnerPlaceholderScreen(props: { onBack?: () => void; onSecondaryAction?: () => void }) {
    return <PlaceholderScreen title={title} subtitle={subtitle} onBack={props.onBack} onSecondaryAction={props.onSecondaryAction} />;
  };
}

export function MobileAccountSheet({
  visible,
  onClose,
  onOpenProfile,
  onOpenWalletHub,
  onOpenOrders,
  onOpenOperations,
  onOpenInventory,
  onOpenTeam,
  onOpenAnalytics,
  typeOptions,
  activeTypeId,
  onSelectType,
  typeSwitchTitle,
  typeSwitchPrompt,
}: {
  visible: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenWalletHub: () => void;
  onOpenOrders: () => void;
  onOpenOperations: () => void;
  onOpenInventory: () => void;
  onOpenTeam: () => void;
  onOpenAnalytics: () => void;
  typeOptions: ReadonlyArray<{ id: string; label: string; description?: string }>;
  activeTypeId: string;
  onSelectType: (typeId: string) => void;
  typeSwitchTitle?: string;
  typeSwitchPrompt?: string;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl" border={false} style={{ margin: 16 }}>
      <Text role="titleMd">الحساب</Text>
      {typeSwitchTitle ? <Text role="bodyStrong">{typeSwitchTitle}</Text> : null}
      {typeSwitchPrompt ? <Text role="bodySm" tone="muted">{typeSwitchPrompt}</Text> : null}
      <Box gap={2}>
        {typeOptions.map((option) => (
          <Button key={option.id} variant={option.id === activeTypeId ? 'primary' : 'secondary'} onPress={() => onSelectType(option.id)}>
            {option.label}
          </Button>
        ))}
      </Box>
      <Box gap={2}>
        <Button onPress={onOpenProfile}>الملف</Button>
        <Button onPress={onOpenWalletHub}>المحفظة</Button>
        <Button onPress={onOpenOrders}>الطلبات</Button>
        <Button onPress={onOpenOperations}>العمليات</Button>
        <Button onPress={onOpenInventory}>المخزون</Button>
        <Button onPress={onOpenTeam}>الفريق</Button>
        <Button onPress={onOpenAnalytics}>التحليلات</Button>
      </Box>
      <Button onPress={onClose}>إغلاق</Button>
    </Surface>
  );
}

export function PartnerWalletHubSheet({
  visible,
  onClose,
  onNavigate,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (destination: PartnerWalletHubDestination) => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl" border={false} style={{ margin: 16 }}>
      <Text role="titleMd">المحفظة</Text>
      <Button onPress={() => onNavigate('partner_subscription')}>الاشتراك</Button>
      <Button onPress={() => onNavigate('partner_settlement_summary')}>ملخص التسويات</Button>
      <Button onPress={onClose}>إغلاق</Button>
    </Surface>
  );
}

export function PartnerStoreScopeSheet({
  visible,
  onClose,
  options,
  selectedId,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  options: readonly PartnerStoreScopeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Surface tone="raised" padding={5} gap={4} radiusToken="xl" border={false} style={{ margin: 16 }}>
      <Text role="titleMd">نطاق الفرع</Text>
      {options.map((option) => (
        <Button key={option.id} variant={option.id === selectedId ? 'primary' : 'secondary'} onPress={() => onSelect(option.id)}>
          {option.label}
        </Button>
      ))}
      <Button onPress={onClose}>إغلاق</Button>
    </Surface>
  );
}

export const dshPartner = {
  DshEntryScreen,
  PartnerOrdersInboxScreen,
  PartnerOrderDetailScreen,
  DshInventoryManagementScreen,
  PartnerDshConsoleScreen,
  DshPartnerBellScreen: createPlaceholderScreen('تنبيهات الشريك', 'تم استبدال شاشة bell القديمة ببديل محلي مؤقت.'),
  DshPartnerSupportDirectoryScreen: createPlaceholderScreen('دليل الدعم', 'اختيار مسارات الدعم أصبح محليًا بعد إزالة طبقة surfaces القديمة.'),
  DshPartnerAuctionStatusUpdateScreen: createPlaceholderScreen('تحديث حالة المزاد', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerChatReadAckScreen: createPlaceholderScreen('تأكيد قراءة المحادثة', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerChatSendScreen: createPlaceholderScreen('إرسال محادثة', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerDocUploadScreen: createPlaceholderScreen('رفع المستندات', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerIntakeStartScreen: createPlaceholderScreen('بدء الإدخال', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerInventoryAdjustScreen: createPlaceholderScreen('تعديل المخزون', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerInventoryUpdateScreen: createPlaceholderScreen('تحديث المخزون', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerItemsUpsertScreen: createPlaceholderScreen('إضافة أو تحديث عنصر', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderAcceptScreen: createPlaceholderScreen('قبول الطلب', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderGetScreen: createPlaceholderScreen('استلام الطلب', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderHandoffScreen: createPlaceholderScreen('تسليم الطلب للكابتن', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderIssueQueueScreen: createPlaceholderScreen('طابور مشكلات الطلبات', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderOutForDeliveryScreen: createPlaceholderScreen('قيد التوصيل', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderPrepareScreen: createPlaceholderScreen('تحضير الطلب', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderReadyScreen: createPlaceholderScreen('الطلب جاهز', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderRejectScreen: createPlaceholderScreen('رفض الطلب', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerOrderStoreDeliveredScreen: createPlaceholderScreen('تم التسليم من الفرع', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerQuickReplyConfigGetScreen: createPlaceholderScreen('إعداد الردود السريعة', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerQuickReplySettingsScreen: createPlaceholderScreen('إعدادات الردود السريعة', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerQuickReplySetupScreen: createPlaceholderScreen('تهيئة الردود السريعة', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerStoreNominationScreen: createPlaceholderScreen('ترشيح الفرع', 'هذه شاشة توافق مؤقتة.'),
  DshPartnerVideoUploadScreen: createPlaceholderScreen('رفع الفيديو', 'هذه شاشة توافق مؤقتة.'),
};
