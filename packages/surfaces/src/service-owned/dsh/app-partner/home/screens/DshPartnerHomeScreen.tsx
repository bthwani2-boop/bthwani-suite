import React from 'react';
import {
  Box,
  Button,
  Card,
  DashboardShell,
  StateView,
  Text,
} from '@bthwani/ui-kit';

export type DshPartnerHomeScreenState = 'ready' | 'loading' | 'empty';

export type DshPartnerHomeScreenProps = {
  state?: DshPartnerHomeScreenState;
  onOpenEntryPress?: () => void;
  onOpenOrdersInboxPress?: () => void;
  onOpenOrderDetailPress?: () => void;
  onOpenMaintenancePress?: () => void;
  onOpenInventoryManagementPress?: () => void;
  onOpenSupportDirectoryPress?: () => void;
};

function renderHero(state: DshPartnerHomeScreenState, onOpenOrdersInboxPress?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        title="لا توجد مهام شريك نشطة"
        description="تظهر هنا حركة الطلبات الجديدة بمجرد وصولها إلى لوحة الشريك."
        actionLabel={onOpenOrdersInboxPress ? 'فتح صندوق الطلبات' : undefined}
        onActionPress={onOpenOrdersInboxPress}
      />
    );
  }

  return (
    <Card
      title="لوحة الشريك"
      subtitle="نقطة تشغيل موحّدة للطلبات، الصيانة، وإدارة المنتجات بنفس أسلوب تطبيق العميل."
      footer={<Button label="فتح صندوق الطلبات" onPress={onOpenOrdersInboxPress} />}
    />
  );
}

function renderOperationsSection(
  onOpenEntryPress?: () => void,
  onOpenOrdersInboxPress?: () => void,
  onOpenOrderDetailPress?: () => void,
) {
  return (
    <Box gap={3}>
      <Card
        title="الدخول التشغيلي"
        subtitle="ابدأ من مدخل واحد واضح قبل أي انتقال."
        footer={<Button label="فتح شاشة الدخول" tone="secondary" onPress={onOpenEntryPress} />}
      />
      <Card
        title="صندوق الطلبات"
        subtitle="الطلب التالي يبقى واضحًا بدون أي ضجيج."
        footer={<Button label="عرض الطلبات" tone="secondary" onPress={onOpenOrdersInboxPress} />}
      />
      <Card
        title="تفاصيل الطلب"
        subtitle="افتح مساحة القرار السريع للطلب النشط."
        footer={<Button label="فتح تفاصيل الطلب" tone="ghost" onPress={onOpenOrderDetailPress} />}
      />
    </Box>
  );
}

function renderManagementSection(
  onOpenMaintenancePress?: () => void,
  onOpenInventoryManagementPress?: () => void,
  onOpenSupportDirectoryPress?: () => void,
) {
  return (
    <Box gap={3}>
      <Card
        title="صيانة الفرع"
        subtitle="التوفر، القنوات، والأوقات ضمن شاشة واحدة."
        footer={<Button label="فتح الصيانة" tone="secondary" onPress={onOpenMaintenancePress} />}
      />
      <Card
        title="إدارة المنتجات"
        subtitle="مسار واضح لإرسال المنتج إلى دورة الاعتماد."
        footer={<Button label="فتح إدارة المنتجات" tone="secondary" onPress={onOpenInventoryManagementPress} />}
      />
      <Card
        title="دليل الدعم"
        subtitle="الوصول السريع لكل أسطح دعم الشريك."
        footer={<Button label="فتح دليل الدعم" tone="ghost" onPress={onOpenSupportDirectoryPress} />}
      />
    </Box>
  );
}

export function DshPartnerHomeScreen({
  state = 'ready',
  onOpenEntryPress,
  onOpenOrdersInboxPress,
  onOpenOrderDetailPress,
  onOpenMaintenancePress,
  onOpenInventoryManagementPress,
  onOpenSupportDirectoryPress,
}: DshPartnerHomeScreenProps) {
  return (
    <DashboardShell
      title="Partner Home"
      subtitle="Thin host shell: composition and navigation only."
      hero={renderHero(state, onOpenOrdersInboxPress)}
      sections={
        state === 'ready'
          ? [
              {
                title: 'Operations',
                subtitle: 'Primary partner actions aligned with the client app layout style.',
                content: renderOperationsSection(onOpenEntryPress, onOpenOrdersInboxPress, onOpenOrderDetailPress),
              },
              {
                title: 'Maintenance and Support',
                subtitle: 'Branch maintenance, inventory workflow, and support access.',
                content: renderManagementSection(onOpenMaintenancePress, onOpenInventoryManagementPress, onOpenSupportDirectoryPress),
              },
            ]
          : [
              {
                title: 'Home State',
                subtitle: 'State-only rendering with no data side effects.',
                content: (
                  <Box>
                    <Text role="bodyMd" tone="muted">
                      الشاشة تستخدم نمط UI فقط بدون أي طلبات شبكة في هذا المسار.
                    </Text>
                  </Box>
                ),
              },
            ]
      }
    />
  );
}

export default DshPartnerHomeScreen;
