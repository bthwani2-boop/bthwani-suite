import React from 'react';
import {
  Box,
  Button,
  Card,
  DashboardShell,
  StateView,
  Text,
} from '@bthwani/ui-kit';

export type DshEntryScreenState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error'
  | 'disabled';

export type DshEntryScreenProps = {
  state?: DshEntryScreenState;
  title?: string;
  subtitle?: string;
  onStartDelivery?: () => void;
  onBrowseStores?: () => void;
  onOpenOrders?: () => void;
  onRetry?: () => void;
};

function renderNonReadyState(
  state: DshEntryScreenState,
  onStartDelivery?: () => void,
  onRetry?: () => void
) {
  if (state === 'loading') {
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
        stateId="empty"
        actionLabel="ابدأ التوصيل"
        onActionPress={onStartDelivery}
      />
    );
  }

  if (state === 'offline') {
    return <StateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <StateView
        stateId="warning"
        title="مدخل التوصيل متوقف مؤقتًا"
        description="هذا المسار مقيّد حاليًا. أبقِ مسار إعادة المحاولة والبديل واضحين."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
      stateId="recoverableError"
      title="المدخل غير متاح"
      description="أعد المحاولة أولًا، وإذا استمرت المشكلة استخدم مسار الطلبات كبديل."
      actionLabel="إعادة المحاولة"
      onActionPress={onRetry}
    />
  );
}

function renderHero(onStartDelivery?: () => void) {
  return (
    <Card
      title="ابدأ طلبك"
      subtitle="مسار عميل واحد وواضح: اكتشاف متجر، مراجعة السلة، تأكيد الطلب، ثم متابعة التتبع."
      footer={<Button label="ابدأ الطلب" onPress={onStartDelivery} />}
    />
  );
}

function renderDiscoverySection(onBrowseStores?: () => void) {
  return (
    <Box gap={3}>
      <Card
        title="استكشف المتاجر القريبة"
        subtitle="ابدأ من اكتشاف المتاجر والعروض المناسبة قبل الانتقال إلى السلة أو الدفع."
        footer={<Button label="تصفح المتاجر" tone="secondary" onPress={onBrowseStores} />}
      />
      <Card
        title="أكمل من السلة"
        subtitle="ارجع إلى أول خطوة قابلة للتنفيذ من دون فروع إضافية أو تشتيت خارج رحلة العميل."
      />
    </Box>
  );
}

function renderReviewSection(onOpenOrders?: () => void) {
  return (
    <Box gap={3}>
      <Card
        title="راجع قبل التأكيد"
        subtitle="إجراء رئيسي واحد مع مسار رجوع واضح وآمن قبل تثبيت الطلب."
      />
      <Card
        title="افتح الطلبات النشطة"
        subtitle="يبقى التتبع والطلبات متاحين دائمًا كمسار ثقة واسترجاع داخل تطبيق العميل فقط."
        footer={<Button label="عرض الطلبات" tone="ghost" onPress={onOpenOrders} />}
      />
    </Box>
  );
}

export function DshEntryScreen({
  state = 'ready',
  title = 'مدخل العميل',
  subtitle = 'المدخل الأساسي لاكتشاف المتاجر والسلة والطلبات داخل تطبيق العميل فقط.',
  onStartDelivery,
  onBrowseStores,
  onOpenOrders,
  onRetry,
}: DshEntryScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onStartDelivery, onRetry);
  }

  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      hero={renderHero(onStartDelivery)}
      sections={[
        {
          title: 'الاكتشاف',
          subtitle: 'خيارات قصيرة ومباشرة دون ضجيج قرار.',
          content: renderDiscoverySection(onBrowseStores),
        },
        {
          title: 'المراجعة والتتبع',
          subtitle: 'حافظ على وضوح الإغلاق واستمرارية مسار الرجوع.',
          content: renderReviewSection(onOpenOrders),
        },
        {
          title: 'نطاق العميل',
          subtitle: 'يبقى هذا السطح محصورًا في رحلة العميل دون أي أسطح تشغيلية أو إدارية موازية.',
          content: (
            <Box>
              <Text role="bodySm" tone="muted">
                هذا المسار يقتصر على الاكتشاف والسلة والطلبات والتتبع. لا يحتوي على خريطة تشغيلية أو أدوات شريك أو لوحات تحكم إدارية في هذه المرحلة.
              </Text>
            </Box>
          ),
        },
      ]}
    />
  );
}
