import React from 'react';
import { BthBox, BthButton, BthListItem, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';

export type DshNotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshNotificationsScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items?: DshNotificationItem[];
  onOpenMySpace?: () => void;
  onOpenOrders?: () => void;
  onOpenSearch?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

const defaultItems: DshNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'تحديث الاشتراك',
    subtitle: 'تمت مزامنة subscription-sync داخل DSH بنجاح.',
    meta: 'الآن',
    badgeLabel: 'Live',
  },
  {
    id: 'notif-2',
    title: 'طلبك جاهز للمتابعة',
    subtitle: 'الطلب النشط يمكن فتحه من نفس المسار.',
    meta: 'قبل قليل',
    badgeLabel: 'Order',
  },
  {
    id: 'notif-3',
    title: 'عرض شخصي جديد',
    subtitle: 'خصم مرتبط بحسابك داخل المسار الحالي.',
    meta: 'اليوم',
    badgeLabel: 'Offer',
  },
];

function renderContent(
  items: DshNotificationItem[],
  onOpenMySpace?: () => void,
  onOpenOrders?: () => void,
  onOpenSearch?: () => void,
) {
  return (
    <BthBox gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader title="الإشعارات" subtitle="تنبيهات DSH فقط مع وصول سريع إلى المسار المناسب" />
        <BthText role="bodySm" tone="inverse" style={{ opacity: 0.9 }}>
          الإشعارات هنا مخصصة لهذه الخدمة فقط، وتبقى مرتبطة بالطلبات والعروض والمساحة الشخصية.
        </BthText>
        <BthBox layoutDirection="row" gap={2}>
          <BthButton label="مساحتي" tone="secondary" onPress={onOpenMySpace} />
          <BthButton label="طلباتي" tone="secondary" onPress={onOpenOrders} />
          <BthButton label="بحث" tone="ghost" onPress={onOpenSearch} />
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="آخر التنبيهات" subtitle="كل تنبيه يختصر خطوة ويقود إلى وجهة واضحة" />
        {items.map((item) => (
          <BthListItem key={item.id} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} onPress={onOpenOrders} />
        ))}
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthSectionHeader title="مسار سريع" subtitle="تحرك إلى المساحة الشخصية أو الطلبات أو البحث" />
        <BthListItem title="مساحتي" subtitle="الاشتراكات، التفضيلات، والعنوان" meta="Profile lane" badgeLabel="Space" onPress={onOpenMySpace} />
        <BthListItem title="طلباتي" subtitle="آخر الطلبات والحالة الحالية" meta="Order lane" badgeLabel="Orders" onPress={onOpenOrders} />
        <BthListItem title="بحث DSH" subtitle="العثور على متجر أو عنصر أو فئة" meta="Search lane" badgeLabel="Find" onPress={onOpenSearch} />
      </BthSurface>
    </BthBox>
  );
}

export function DshNotificationsScreen({
  state = 'ready',
  items = defaultItems,
  onOpenMySpace,
  onOpenOrders,
  onOpenSearch,
  onBack,
  onRetry,
}: DshNotificationsScreenProps) {
  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="الإشعارات" subtitle="تنبيهات DSH المخصصة" onRetry={onRetry} />;
  }

  return (
    <DshOperationScreen
      state="ready"
      title="الإشعارات"
      subtitle="قائمة إشعارات DSH مع وصول مباشر إلى المسارات الأكثر استخدامًا"
      content={renderContent(items, onOpenMySpace, onOpenOrders, onOpenSearch)}
      primaryActionLabel="مساحتي"
      secondaryActionLabel="طلباتي"
      tertiaryActionLabel="بحث"
      onPrimaryAction={onOpenMySpace}
      onSecondaryAction={onOpenOrders}
      onTertiaryAction={onOpenSearch ?? onBack}
      onRetry={onRetry}
    />
  );
}

export default DshNotificationsScreen;