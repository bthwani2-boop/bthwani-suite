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
  dshArrivalBellCaptainLane,
  dshArrivalBellCustomerLane,
  dshArrivalBellSummary,
  type DshArrivalBellLane,
} from './arrival-bell-fixtures';

type ControlPanelDshArrivalBellScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(state: Exclude<ControlPanelDshArrivalBellScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'جار تجهيز arrival bell workspace',
      description: 'الهيكل حاضر، وسيظهر صف الكابتن والعميل بوضوح بعد اكتمال هذا slice.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد حالات arrival bell الآن',
      description: 'المسار حي، لكن لا توجد حالات وصول أو رن تحتاج متابعة في هذه اللحظة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح',
      description: 'يبقى المسار واضحًا، لكن حالات الوصول والرن لا تُحدّث حتى يعود الاتصال.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'مسار arrival bell غير مفعّل بالكامل',
      description: 'هذا slice يثبّت القراءة والتنقل فقط، أما التنفيذ التفصيلي فيأتي لاحقًا.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل arrival bell',
    description: 'يمكنك الرجوع إلى hub أو إعادة المحاولة من نفس المسار بدون فقدان الاتجاه.',
    actionLabel: 'إعادة المحاولة',
  };
}

function renderLaneBlock(title: string, description: string, lanes: ReadonlyArray<DshArrivalBellLane>) {
  return (
    <BthWebSectionCard title={title} description={description}>
      <BthBox gap={2}>
        {lanes.map((lane) => (
          <BthBox key={`${title}-${lane.orderId}`} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
            <BthBox layoutDirection="row" justify="space-between" align="center">
              <BthText role="bodyStrong">{lane.orderId}</BthText>
              <BthText role="caption" tone={lane.tone}>{lane.statusLabel}</BthText>
            </BthBox>
            <BthText role="bodySm">{lane.actorLabel}</BthText>
            <BthText role="caption" tone="soft">{lane.etaLabel} · {lane.ringLabel}</BthText>
            <BthText role="bodySm" tone="muted">{lane.actionHint}</BthText>
          </BthBox>
        ))}
      </BthBox>
    </BthWebSectionCard>
  );
}

export type ControlPanelDshArrivalBellScreenProps = {
  state?: ControlPanelDshArrivalBellScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
};

export function ControlPanelDshArrivalBellScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
}: ControlPanelDshArrivalBellScreenProps) {
  const router = useRouter();

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthWebPageFrame
        eyebrow="DSH / operations / arrival-bell"
        title="جرس الوصول"
        description="المسار يظل واضحًا حتى عندما لا تكون البيانات جاهزة أو متاحة."
        maxWidth={1120}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow="DSH / operations / arrival-bell"
      title="جرس الوصول"
      description="أول surface حي لهذا المسار. يوضح صف الوصول من جهة الكابتن ومن جهة العميل مع footer صريح للقرار التالي."
      maxWidth={1120}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/arrival-bell', 'حي', `نشط: ${dshArrivalBellSummary.activeArrivals}`]}
          eyebrow="workspace تشغيلية"
          title="Arrival Bell Workspace"
          description="هذا السطح لا ينفذ runtime actions، لكنه يثبت القراءة التشغيلية الصحيحة ويعطي مسارًا حقيقيًا من hub إلى حالات الوصول والرن."
          metaItems={[
            `بانتظار إقرار: ${dshArrivalBellSummary.awaitingAcknowledgement}`,
            `رنات محجوبة: ${dshArrivalBellSummary.blockedRings}`,
            `حالات منتهية اليوم: ${dshArrivalBellSummary.resolvedToday}`,
          ]}
          primaryAction={{ label: 'افتح مساحة العمليات', href: hubHref }}
          secondaryAction={{ label: 'الطلبات', href: ordersHref }}
        />

        <BthBox gap={2}>
          <BthWebSignalCard title="الوصولات النشطة" value={String(dshArrivalBellSummary.activeArrivals)} description="حالات لديها حضور فعلي داخل arrival workflow." tone="best" />
          <BthWebSignalCard title="بانتظار الإقرار" value={String(dshArrivalBellSummary.awaitingAcknowledgement)} description="طلبات وصل فيها الكابتن لكن العميل لم يؤكد بعد." />
          <BthWebSignalCard title="الرنات المحجوبة" value={String(dshArrivalBellSummary.blockedRings)} description="حالات تحت cooldown أو منع تشغيلي ولا يجب تحويلها إلى CTA زائف." />
          <BthWebSignalCard title="مغلق اليوم" value={String(dshArrivalBellSummary.resolvedToday)} description="مؤشر مرئي فقط على الإغلاق اليومي داخل هذا slice." />
        </BthBox>

        {renderLaneBlock(
          'مسار الكابتن',
          'يوضح من وصل، من رن، وما الحالات التي تتطلب قرار ops أوسع بدل تكرار المحاولة محليًا.',
          dshArrivalBellCaptainLane,
        )}

        {renderLaneBlock(
          'مسار العميل',
          'يعرض الإقرار، غياب الرد، والحالات التي يجب أن تعود إلى workspace بدل دفع المستخدم إلى تفاصيل غير موجودة.',
          dshArrivalBellCustomerLane,
        )}

        <BthWebSectionCard
          title="الإجراءات التالية"
          description="العقد هنا واضح: الإجراء الرئيسي هو فتح workspace العمليات، مع إبقاء الطلبات والدعم كمسارات ثانوية صريحة."
        >
          <BthBox gap={2}>
            <BthButton label="افتح مساحة العمليات" onPress={() => router.push(hubHref)} />
            <BthButton label="افتح الطلبات" tone="secondary" onPress={() => router.push(ordersHref)} />
            <BthButton label="فتح الدعم" tone="secondary" onPress={() => router.push(supportHref)} />
          </BthBox>
        </BthWebSectionCard>
      </BthBox>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshArrivalBellScreen;