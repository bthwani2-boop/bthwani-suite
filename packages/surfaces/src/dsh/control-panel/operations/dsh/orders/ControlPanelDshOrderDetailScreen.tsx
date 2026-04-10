'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BthBox, BthButton, BthStateView, BthText } from '@bthwani/ui-kit';
import {
  BthWebMissionHeroCard,
  BthWebPageFrame,
  BthWebSectionCard,
  BthWebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  getSampleDshOrder,
  getSampleDshOrderActionPlan,
  getSampleDshOrderArrivalTimeline,
} from './order-fixtures';

type ControlPanelDshOrderDetailScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(state: Exclude<ControlPanelDshOrderDetailScreenState, 'ready'>, orderId: string) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: `جار تحميل الطلب ${orderId}`,
      description: 'المسار حي، وتبقى تفاصيل الطلب مرئية بمجرد اكتمال التحميل أو إعادة المحاولة.',
      actionLabel: 'العودة إلى الطلبات',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'notFound' as const,
      title: `الطلب ${orderId} غير موجود`,
      description: 'المعرف المطلوب غير موجود ضمن queue الحالية، ويمكن العودة إلى قائمة الطلبات بدون فقدان الاتجاه.',
      actionLabel: 'العودة إلى الطلبات',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح',
      description: 'تفاصيل الطلب ستعود بعد استعادة الاتصال، مع بقاء المسار الحالي معروفًا وآمنًا.',
      actionLabel: 'العودة إلى الطلبات',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'التفاصيل غير مفعلة بعد',
      description: 'هذا surface جاهز بصريًا لكن بعض إجراءات التنفيذ التفصيلية مؤجلة إلى slice لاحق.',
      actionLabel: 'العودة إلى الطلبات',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل تفاصيل الطلب',
    description: 'يمكنك الرجوع إلى قائمة الطلبات أو إعادة المحاولة من نفس المسار.',
    actionLabel: 'إعادة المحاولة',
  };
}

export type ControlPanelDshOrderDetailScreenProps = {
  orderId: string;
  state?: ControlPanelDshOrderDetailScreenState;
  ordersHref?: string;
  hubHref?: string;
  supportHref?: string;
};

export function ControlPanelDshOrderDetailScreen({
  orderId,
  state = 'ready',
  ordersHref = '/operations/dsh/orders',
  hubHref = '/operations/dsh',
  supportHref = '/support',
}: ControlPanelDshOrderDetailScreenProps) {
  const router = useRouter();
  const order = getSampleDshOrder(orderId);
  const resolvedState = state === 'ready' && !order ? 'empty' : state;

  if (resolvedState !== 'ready') {
    const stateCopy = resolveStateCopy(resolvedState, orderId);

    return (
      <BthWebPageFrame
        eyebrow="DSH / operations / orders / detail"
        title="تفاصيل طلب DSH"
        description="السطح يحتفظ بخروج واضح إلى قائمة الطلبات حتى عند غياب البيانات أو توقفها."
        maxWidth={1120}
      >
        <BthStateView
          {...stateCopy}
          onActionPress={() => {
            router.push(ordersHref);
          }}
        />
      </BthWebPageFrame>
    );
  }

  if (!order) {
    return null;
  }

  const resolvedOrder = order;
  const arrivalTimeline = getSampleDshOrderArrivalTimeline(orderId);
  const actionPlan = getSampleDshOrderActionPlan(orderId);

  return (
    <BthWebPageFrame
      eyebrow="DSH / operations / orders / detail"
      title={`تفاصيل ${resolvedOrder.id}`}
      description="أول detail route حي داخل DSH. يعرض هوية الطلب وحالته ومسار الرجوع السريع إلى القائمة أو hub."
      maxWidth={1120}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={[resolvedOrder.id, resolvedOrder.statusLabel, resolvedOrder.eta]}
          eyebrow="تفاصيل تشغيلية"
          title={resolvedOrder.customer}
          description={resolvedOrder.route}
          metaItems={[
            `القيمة: ${resolvedOrder.amount}`,
            `الإنشاء: ${resolvedOrder.createdLabel}`,
            `الكابتن: ${resolvedOrder.captainLabel}`,
          ]}
          primaryAction={{ label: actionPlan.primaryLabel, href: hubHref }}
          secondaryAction={{ label: 'العودة إلى الطلبات', href: ordersHref }}
        />

        <BthBox gap={2}>
          <BthWebSignalCard title="الحالة" value={resolvedOrder.statusLabel} description="الوضع الحالي لهذا الطلب داخل queue التشغيلية." tone="best" />
          <BthWebSignalCard title="الوجهة" value={resolvedOrder.destinationLabel} description="نقطة التسليم المرجعية لهذا الطلب." />
          <BthWebSignalCard title="ETA" value={resolvedOrder.eta} description="الوقت التقديري الحالي حتى إتمام التسليم أو المعالجة." />
          <BthWebSignalCard title="القيمة" value={resolvedOrder.amount} description="القيمة الحالية كما تظهر في هذا slice البصري." />
        </BthBox>

        <BthWebSectionCard
          title="هوية الطلب"
          description="ملخص ثابت وواضح للمعرف والمسار والملاحظات التشغيلية الأساسية."
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">المسار</BthText>
              <BthText role="bodySm" tone="muted">{resolvedOrder.route}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الوجهة النهائية</BthText>
              <BthText role="bodySm" tone="muted">{resolvedOrder.destinationLabel}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">ملاحظة تشغيلية</BthText>
              <BthText role="bodySm" tone="muted">{resolvedOrder.notes}</BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="Arrival timeline"
          description="البلوك الثانوي الأهم في هذه المرحلة: يوضّح الوصول، الرن، الإقرار، وسبب المنع الحالي إن وجد."
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الوصول</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.arrivedLabel ?? 'لا توجد بيانات وصول بعد'}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">سجل الرن</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline ? `${arrivalTimeline.ringCount} محاولات، ${arrivalTimeline.lastRingLabel}` : 'لا توجد محاولات حتى الآن'}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">إقرار العميل</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.acknowledgedLabel ?? 'لم يصل أي إقرار بعد'}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">التبريد وسبب المنع</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.cooldownLabel ?? 'غير متاح'}</BthText>
              <BthText role="bodySm" tone="muted">{arrivalTimeline?.blockReason ?? 'لا يوجد منع حالي'}</BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="قرار التشغيل"
          description="هذا البلوك يرفع الوضوح: ما هو الإجراء الأساسي الآن، وما البدائل المقبولة داخل هذا المسار."
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الإجراء الأساسي</BthText>
              <BthText role="bodySm">{actionPlan.primaryLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.primaryDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الإجراء الثانوي</BthText>
              <BthText role="bodySm">{actionPlan.secondaryLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.secondaryDescription}</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">مسار الدعم</BthText>
              <BthText role="bodySm">{actionPlan.supportLabel}</BthText>
              <BthText role="bodySm" tone="muted">{actionPlan.supportDescription}</BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="الإجراءات التالية"
          description="العقد يطلب أن يكون فتح مساحة العمليات هو الإجراء الرئيسي، مع بقاء الرجوع والدعم كمسارات ثانوية واضحة."
        >
          <BthBox gap={2}>
            <BthButton label={actionPlan.primaryLabel} onPress={() => router.push(hubHref)} />
            <BthButton label="العودة إلى قائمة الطلبات" tone="secondary" onPress={() => router.push(ordersHref)} />
            <BthButton label={actionPlan.supportLabel} tone="secondary" onPress={() => router.push(supportHref)} />
          </BthBox>
        </BthWebSectionCard>
      </BthBox>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshOrderDetailScreen;