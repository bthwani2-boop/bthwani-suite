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
import { sampleDshOrders } from './order-fixtures';

type ControlPanelDshOrdersScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

function resolveStateCopy(state: Exclude<ControlPanelDshOrdersScreenState, 'ready'>) {
  if (state === 'loading') {
    return {
      stateId: 'loading' as const,
      title: 'جار تحميل قائمة الطلبات',
      description: 'السطح حي، وتبقى حالة الطلبات غير مقفلة حتى تكتمل المزامنة أو يعود المصدر.',
      actionLabel: 'العودة إلى hub',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد طلبات مفتوحة الآن',
      description: 'المسار جاهز، لكن queue الحالية فارغة مؤقتًا ويمكن العودة إلى hub أو تحديث الحالة لاحقًا.',
      actionLabel: 'العودة إلى hub',
    };
  }

  if (state === 'offline') {
    return {
      stateId: 'offline' as const,
      title: 'الاتصال غير متاح',
      description: 'قائمة الطلبات ستعود عند استعادة الاتصال، مع بقاء المسار الحالي واضحًا وآمنًا.',
      actionLabel: 'العودة إلى hub',
    };
  }

  if (state === 'disabled') {
    return {
      kind: 'warning' as const,
      title: 'قائمة الطلبات غير مفعلة بعد',
      description: 'هذه الصفحة حية بصريًا، لكن التفاعل المعقد مؤجل إلى slice لاحق حتى يكتمل الربط.',
      actionLabel: 'العودة إلى hub',
    };
  }

  return {
    stateId: 'recoverableError' as const,
    title: 'تعذر تحميل الطلبات',
    description: 'يمكنك العودة إلى hub أو إعادة المحاولة بعد تثبيت الحالة الحالية.',
    actionLabel: 'إعادة المحاولة',
  };
}

export type ControlPanelDshOrdersScreenProps = {
  state?: ControlPanelDshOrdersScreenState;
  hubHref?: string;
  operationsHref?: string;
};

export function ControlPanelDshOrdersScreen({
  state = 'ready',
  hubHref = '/operations/dsh',
  operationsHref = '/operations',
}: ControlPanelDshOrdersScreenProps) {
  const router = useRouter();
  const readyForSelection = state === 'ready';
  const assignedCount = sampleDshOrders.filter((order) => order.statusTone === 'success').length;
  const openCount = sampleDshOrders.filter((order) => order.statusTone === 'brand').length;
  const reviewCount = sampleDshOrders.filter((order) => order.statusTone === 'warning').length;

  if (!readyForSelection) {
    const stateCopy = resolveStateCopy(state);

    return (
      <BthWebPageFrame
        eyebrow="DSH / operations / orders"
        title="إدارة طلبات DSH"
        description="السطح يبقى متاحًا حتى في الحالات غير الجاهزة، مع خروج آمن واضح إلى hub."
        maxWidth={1120}
      >
        <BthStateView
          {...stateCopy}
          onActionPress={() => {
            router.push(hubHref);
          }}
        />
      </BthWebPageFrame>
    );
  }

  return (
    <BthWebPageFrame
      eyebrow="DSH / operations / orders"
      title="إدارة طلبات DSH"
      description="أول child route حي داخل DSH للوحة التحكم. يعرض queue تشغيلية واضحة، ويُبقي العودة إلى hub خطوة واحدة فقط."
      maxWidth={1120}
    >
      <BthBox gap={4}>
        <BthWebMissionHeroCard
          badges={['/operations/dsh/orders', 'child route حي', `الطلبات: ${sampleDshOrders.length}`]}
          eyebrow="الطابور التشغيلي"
          title="طلبات DSH المفتوحة"
          description="هذه الصفحة تعرض قائمة تشغيلية مباشرة، مع مسار رجوع واضح إلى hub ومسار عام آمن إلى العمليات."
          metaItems={[
            `المعيّنة: ${assignedCount}`,
            `الجديدة: ${openCount}`,
            `تحت المراجعة: ${reviewCount}`,
          ]}
          primaryAction={{ label: 'العودة إلى hub', href: hubHref }}
          secondaryAction={{ label: 'لوحة العمليات', href: operationsHref }}
        />

        <BthWebSignalCard
          title="الحالة الحية"
          value="جاهز"
          description="الصفحة حية بالفعل، لكن التكامل مع الـ API أو التفاصيل المتفرعة مؤجل عمداً حتى لا ندخل binding مبكر."
          tone="best"
        />

        <BthWebSectionCard
          title="قائمة الطلبات"
          description="كل صف يلخص الطلب، وجهته، حالته، والوقت المقدر للتنفيذ. الضغط عليه يفتح صفحة التفاصيل الحية."
        >
          <BthBox gap={2}>
            {sampleDshOrders.map((order) => (
              <BthBox
                key={order.id}
                padding={3}
                gap={1}
                border
                radiusToken="xl"
                background="surfaceRaised"
              >
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="bodyStrong">{order.id}</BthText>
                  <BthText role="caption" tone={order.statusTone}>
                    {order.statusLabel}
                  </BthText>
                </BthBox>
                <BthText role="bodySm" tone="muted">
                  {order.customer}
                </BthText>
                <BthText role="bodySm" tone="muted">
                  {order.route}
                </BthText>
                <BthBox layoutDirection="row" justify="space-between" align="center">
                  <BthText role="caption" tone="soft">
                    ETA {order.eta}
                  </BthText>
                  <BthText role="caption" tone="soft">
                    {order.amount}
                  </BthText>
                </BthBox>
                <BthButton
                  label="افتح التفاصيل"
                  size="sm"
                  fullWidth={false}
                  onPress={() => router.push(`/operations/dsh/orders/${order.id}`)}
                />
              </BthBox>
            ))}
          </BthBox>
        </BthWebSectionCard>

        <BthWebSectionCard
          title="الخطوة التالية"
          description="العودة إلى hub تبقى أسرع مسار، بينما الصفحة الحالية تظل مرجع queue مباشر."
        >
          <BthBox gap={2}>
            <BthButton label="العودة إلى DSH hub" onPress={() => router.push(hubHref)} />
            <BthButton label="العودة إلى العمليات" tone="secondary" onPress={() => router.push(operationsHref)} />
          </BthBox>
        </BthWebSectionCard>
      </BthBox>
    </BthWebPageFrame>
  );
}

export default ControlPanelDshOrdersScreen;