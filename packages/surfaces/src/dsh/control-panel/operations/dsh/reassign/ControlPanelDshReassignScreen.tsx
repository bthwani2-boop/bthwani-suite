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
import { dshReassignCandidates, dshReassignSummary } from './reassign-fixtures';

type ControlPanelDshReassignScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(state: Exclude<ControlPanelDshReassignScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'جار تجهيز surface إعادة التوزيع',
      description: 'المسار حي، وسيظهر القرار والمرشحون بمجرد اكتمال هذه المرحلة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد حالات لإعادة التوزيع',
      description: 'الطابور الحالي لا يحتوي على قرارات نقل نشطة في هذه اللحظة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح',
      description: 'المسار محفوظ، لكن حالات إعادة التوزيع لن تتحدّث حتى يعود الاتصال.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'إعادة التوزيع غير مفعلة بالكامل',
      description: 'هذا slice يثبت القراءة والقرار فقط، بينما التنفيذ الفعلي مؤجل إلى خطوة لاحقة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل surface إعادة التوزيع',
    description: 'يمكنك الرجوع إلى hub أو إعادة المحاولة من نفس المسار.',
    actionLabel: 'إعادة المحاولة',
  };
}

export type ControlPanelDshReassignScreenProps = {
  state?: ControlPanelDshReassignScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
  embedded?: boolean;
  showHeader?: boolean;
};

export function ControlPanelDshReassignScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
  embedded = false,
  showHeader = true,
}: ControlPanelDshReassignScreenProps) {
  const router = useRouter();

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthWebPageFrame
        eyebrow="DSH / operations / reassign"
        title="إعادة التوزيع"
        description="المسار يبقى واضحًا حتى لو غابت الحالات أو توقفت البيانات."
        maxWidth={1120}
        embedded={embedded}
        showHeader={showHeader}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow="DSH / operations / reassign"
      title="إعادة التوزيع"
      description="أول route حي لهذا القرار. يوضح الحالات المرشحة والأسباب والبدائل بدون إدخال submit تشغيلي كاذب."
      maxWidth={1120}
      embedded={embedded}
      showHeader={showHeader}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/reassign', 'حي', `حالات نشطة: ${dshReassignSummary.activeCases}`]}
          eyebrow="قرار تشغيلي"
          title="Reassign Workspace"
          description="هذا السطح يرفع وضوح القرار: من يحتاج نقلًا، لماذا، وما fallback المقترح، مع إبقاء التنفيذ الفعلي خارج هذا slice."
          metaItems={[
            `عاجلة: ${dshReassignSummary.urgentCases}`,
            `محجوبة: ${dshReassignSummary.blockedCases}`,
            `fallback جاهز: ${dshReassignSummary.readyFallbacks}`,
          ]}
          primaryAction={{ label: 'افتح مساحة العمليات', href: hubHref }}
          secondaryAction={{ label: 'الطلبات', href: ordersHref }}
        />

        <BthBox gap={2}>
          <BthWebSignalCard title="الحالات النشطة" value={String(dshReassignSummary.activeCases)} description="طلبات لديها ضغط تشغيلي أو مرشح نقل واضح." tone="best" />
          <BthWebSignalCard title="الحالات العاجلة" value={String(dshReassignSummary.urgentCases)} description="تحتاج قرارًا سريعًا قبل أن تتحول إلى تأخر أو تصعيد." />
          <BthWebSignalCard title="الحالات المحجوبة" value={String(dshReassignSummary.blockedCases)} description="تحتاج workspace أوسع أو دعمًا قبل أي خطوة أخرى." />
          <BthWebSignalCard title="بدائل جاهزة" value={String(dshReassignSummary.readyFallbacks)} description="كباتن أو مسارات احتياطية متاحة بصريًا في هذا slice." />
        </BthBox>

        <BthWebSectionCard
          title="المرشحون لإعادة التوزيع"
          description="كل بطاقة تعرض delivery والطلب المرتبط والسبب والأولوية والبديل المقترح بدون التظاهر بوجود تنفيذ runtime فعلي."
        >
          <BthBox gap={2}>
            {dshReassignCandidates.map((candidate) => (
              <BthBox key={candidate.deliveryId} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{candidate.deliveryId}</BthText>
                  <BthText role="caption" tone={candidate.tone}>{candidate.statusLabel}</BthText>
                </BthBox>
                <BthText role="bodySm">{candidate.orderId}</BthText>
                <BthText role="caption" tone="soft">{candidate.reasonLabel} · {candidate.priorityLabel}</BthText>
                <BthText role="bodySm" tone="muted">الحالي: {candidate.currentCaptain}</BthText>
                <BthText role="bodySm" tone="muted">البديل: {candidate.fallbackCaptain}</BthText>
                <BthText role="bodySm" tone="muted">{candidate.note}</BthText>
              </BthBox>
            ))}
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="منطق القرار"
          description="الهدف هنا ليس التنفيذ، بل ترتيب القرار: متى تعود إلى workspace، ومتى تراجع الطلب، ومتى تصعّد الحالة."
        >
          <BthBox gap={2}>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الإجراء الأساسي</BthText>
              <BthText role="bodySm">افتح مساحة العمليات</BthText>
              <BthText role="bodySm" tone="muted">العقد يطلب بوضوح أن يكون open operations workspace هو الخروج الرئيسي بعد قراءة القرار.</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">الإجراء الثانوي</BthText>
              <BthText role="bodySm">ارجع إلى الطلبات</BthText>
              <BthText role="bodySm" tone="muted">الرجوع إلى queue مناسب عندما تريد مقارنة أكثر من حالة قبل اعتماد أي نقل.</BthText>
            </BthBox>
            <BthBox padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
              <BthText role="bodyStrong">مسار الدعم</BthText>
              <BthText role="bodySm">صعّد المحجوب فقط</BthText>
              <BthText role="bodySm" tone="muted">التصعيد يبقى للحالات المعطلة أو غير القابلة للحسم من هذا السطح.</BthText>
            </BthBox>
          </BthBox>
        </BthWebSectionCard>

        {!embedded ? (
          <BthWebSectionCard
            title="الإجراءات التالية"
            description="السطح يثبت القرار والتنقل فقط، ولا يقدّم submit زائف لإعادة التوزيع قبل slice التنفيذ الحقيقي."
          >
            <BthBox gap={2}>
              <BthButton label="افتح مساحة العمليات" onPress={() => router.push(hubHref)} />
              <BthButton label="افتح الطلبات" tone="secondary" onPress={() => router.push(ordersHref)} />
              <BthButton label="فتح الدعم" tone="secondary" onPress={() => router.push(supportHref)} />
            </BthBox>
          </BthWebSectionCard>
        ) : null}
      </BthBox>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshReassignScreen;