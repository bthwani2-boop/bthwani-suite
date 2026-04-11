import React from 'react';
import {
  BthBox,
  BthButton,
  BthCard,
  BthDashboardShell,
  BthStateView,
  BthText,
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
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        actionLabel="Start delivery"
        onActionPress={onStartDelivery}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="Delivery entry is temporarily paused"
        description="This route is currently restricted. Keep retry and fallback visible."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Entry is unavailable"
      description="Retry first. If the issue persists, use the orders path as fallback."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

function renderHero(onStartDelivery?: () => void) {
  return (
    <BthCard
      title="ابدأ توصيل DSH"
      subtitle="مدخل واضح وسريع لاكتشاف المتاجر، مراجعة السلة، أو متابعة الطلبات دون تشتت."
      footer={<BthButton label="ابدأ التوصيل" onPress={onStartDelivery} />}
    />
  );
}

function renderDiscoverySection(onBrowseStores?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="استكشف المتاجر القريبة"
        subtitle="ابدأ من مسار اكتشاف سريع قبل التوسع في السلة أو الدفع."
        footer={<BthButton label="تصفح المتاجر" tone="secondary" onPress={onBrowseStores} />}
      />
      <BthCard
        title="أكمل من السلة"
        subtitle="ارجع إلى أول خطوة قابلة للتنفيذ دون فروع إضافية أو ضياع المسار."
      />
    </BthBox>
  );
}

function renderReviewSection(onOpenOrders?: () => void) {
  return (
    <BthBox gap={3}>
      <BthCard
        title="راجع قبل التأكيد"
        subtitle="إجراء رئيسي واحد مع مسار رجوع واضح وآمن."
      />
      <BthCard
        title="افتح الطلبات النشطة"
        subtitle="يبقى التتبع والطلبات متاحين دائمًا كمسار ثقة واسترجاع."
        footer={<BthButton label="عرض الطلبات" tone="ghost" onPress={onOpenOrders} />}
      />
    </BthBox>
  );
}

export function DshEntryScreen({
  state = 'ready',
  title = 'Delivery entry',
  subtitle = 'المدخل الأساسي لخدمة DSH داخل تطبيق العميل.',
  onStartDelivery,
  onBrowseStores,
  onOpenOrders,
  onRetry,
}: DshEntryScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onStartDelivery, onRetry);
  }

  return (
    <BthDashboardShell
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
          title: 'ضوابط التدفق',
          subtitle: 'هذه الشريحة مخصصة حاليًا للواجهة والتجربة والتدفق فقط.',
          content: (
            <BthBox>
              <BthText role="bodySm" tone="muted">
                لا يحتوي هذا المسار على ربط API أو تكامل أو منطق runtime في هذه المرحلة.
              </BthText>
            </BthBox>
          ),
        },
      ]}
    />
  );
}