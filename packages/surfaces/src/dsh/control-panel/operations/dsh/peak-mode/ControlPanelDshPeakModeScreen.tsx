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
  dshPeakModePolicies,
  dshPeakModePressureLanes,
  dshPeakModeSummary,
} from './peak-mode-fixtures';

type ControlPanelDshPeakModeScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(state: Exclude<ControlPanelDshPeakModeScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'جار تجهيز وضع الذروة',
      description: 'المسار حي، وستظهر سياسات السعة ومناطق الضغط بعد اكتمال هذه المرحلة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد ضغوط تتطلب peak mode الآن',
      description: 'الوضع مستقر حاليًا ولا توجد مناطق مرشحة لتوسيع السعة في هذه اللحظة.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح',
      description: 'يبقى المسار محفوظًا لكن قراءات الضغط والسعة لن تتحدّث حتى يعود الاتصال.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'وضع الذروة غير مفعّل بالكامل',
      description: 'هذا slice يثبت القراءة والسياسة فقط، بينما التنفيذ الفعلي خارج النطاق الحالي.',
      actionLabel: 'العودة إلى DSH',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل وضع الذروة',
    description: 'يمكنك الرجوع إلى hub أو إعادة المحاولة من نفس المسار.',
    actionLabel: 'إعادة المحاولة',
  };
}

export type ControlPanelDshPeakModeScreenProps = {
  state?: ControlPanelDshPeakModeScreenState;
  hubHref?: string;
  ordersHref?: string;
  supportHref?: string;
};

export function ControlPanelDshPeakModeScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  ordersHref = '/operations/dsh/orders',
  supportHref = '/support',
}: ControlPanelDshPeakModeScreenProps) {
  const router = useRouter();

  if (state !== 'ready') {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthWebPageFrame
        eyebrow="DSH / operations / peak-mode"
        title="وضع الذروة"
        description="السطح يحافظ على مسار قرار واضح حتى عند غياب البيانات أو توقفها."
        maxWidth={1120}
      >
        <BthStateView {...stateCopy} onActionPress={() => router.push(hubHref)} />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow="DSH / operations / peak-mode"
      title="وضع الذروة"
      description="أول route حي لهذا المسار. يوضح مناطق الضغط وسياسات السعة والتوصية التشغيلية بدون toggle runtime كاذب."
      maxWidth={1120}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/peak-mode', 'حي', `مناطق الضغط: ${dshPeakModeSummary.pressureZones}`]}
          eyebrow="سعة تشغيلية"
          title="Peak Mode Workspace"
          description="هذا السطح يعرض أين يكون توسيع السعة منطقيًا وأين يجب منعه، مع الحفاظ على open operations workspace كقرار رئيسي وفق العقد."
          metaItems={[
            `المناطق النشطة: ${dshPeakModeSummary.activeZones}`,
            `الكباتن المرنون: ${dshPeakModeSummary.flexCaptains}`,
            `الطوابير المحمية: ${dshPeakModeSummary.protectedQueues}`,
          ]}
          primaryAction={{ label: 'افتح مساحة العمليات', href: hubHref }}
          secondaryAction={{ label: 'الطلبات', href: ordersHref }}
        />

        <BthBox gap={2}>
          <BthWebSignalCard title="المناطق النشطة" value={String(dshPeakModeSummary.activeZones)} description="المناطق التي تُقاس ضمن هذا slice." tone="best" />
          <BthWebSignalCard title="مناطق الضغط" value={String(dshPeakModeSummary.pressureZones)} description="مناطق تحتاج قرارًا حول السعة أو مراقبة أقرب." />
          <BthWebSignalCard title="كباتن مرنون" value={String(dshPeakModeSummary.flexCaptains)} description="احتياطي مرئي يمكنه امتصاص جزء من الضغط عند الحاجة." />
          <BthWebSignalCard title="طوابير محمية" value={String(dshPeakModeSummary.protectedQueues)} description="حالات يجب ألّا يغطيها peak mode بدل معالجة أصل المشكلة." />
        </BthBox>

        <BthWebSectionCard
          title="سياسات peak mode"
          description="هذه القواعد توضح أين ينتهي هذا السطح: قراءة وسياسة، لا toggle فعلي ولا mutation مخفي."
        >
          <BthBox gap={2}>
            {dshPeakModePolicies.map((policy) => (
              <BthBox key={policy.label} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{policy.label}</BthText>
                  <BthText role="caption" tone="brand">{policy.statusLabel}</BthText>
                </BthBox>
                <BthText role="bodySm" tone="muted">{policy.description}</BthText>
              </BthBox>
            ))}
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="مناطق الضغط"
          description="كل بطاقة تعطي قراءة سريعة للحمل والسعة والتوصية، بدون التظاهر بإمكانية التفعيل المباشر من هنا."
        >
          <BthBox gap={2}>
            {dshPeakModePressureLanes.map((lane) => (
              <BthBox key={lane.zoneLabel} padding={3} gap={1} border radiusToken="xl" background="surfaceRaised">
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{lane.zoneLabel}</BthText>
                  <BthText role="caption" tone={lane.tone}>{lane.recommendationLabel}</BthText>
                </BthBox>
                <BthText role="bodySm">{lane.loadLabel}</BthText>
                <BthText role="caption" tone="soft">{lane.captainCapacityLabel} · {lane.queueLabel}</BthText>
                <BthText role="bodySm" tone="muted">{lane.note}</BthText>
              </BthBox>
            ))}
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="الإجراءات التالية"
          description="الإجراء الرئيسي هنا هو العودة إلى workspace العمليات، ثم الطلبات أو الدعم عند الحاجة، لا تبديل runtime state مباشرة."
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

export default ControlPanelDshPeakModeScreen;