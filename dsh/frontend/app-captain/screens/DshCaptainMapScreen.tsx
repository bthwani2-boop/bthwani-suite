'use client';

import React from 'react';
import { Badge, Box, Button, KeyValueList, SectionHeader, Surface, Text } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import { getDshCaptainFlowPolicy } from '../contracts/dshCaptainBinding.contracts';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';

type CaptainFieldStage = 'to-store' | 'to-customer' | 'near-customer' | 'at-door' | 'bell-rang' | 'proof';
type CaptainHeartbeatState = { lastUpdateMinutesAgo: number; etaMinutes: number | null };

const HEARTBEAT_INTERVAL_MS = 3 * 60 * 1000;

function useCaptainHeartbeat(stage: CaptainFieldStage): CaptainHeartbeatState {
  const [state, setState] = React.useState<CaptainHeartbeatState>({
    lastUpdateMinutesAgo: 0,
    etaMinutes: stage === 'to-store' ? 8 : stage === 'to-customer' ? 12 : stage === 'near-customer' ? 4 : 1,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => ({
        lastUpdateMinutesAgo: prev.lastUpdateMinutesAgo + 3,
        etaMinutes: prev.etaMinutes !== null ? Math.max(0, prev.etaMinutes - 3) : null,
      }));
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [stage]);

  return state;
}

const STAGE_CONFIG: Record<CaptainFieldStage, { title: string; description: string; nextStage: CaptainFieldStage | null; action: string; proximityLabel: string | null; lifecycleStatus: string }> = {
  'to-store': {
    title: 'التوجه للمتجر',
    description: 'في الطريق لاستلام الطلب من المتجر.',
    nextStage: 'to-customer',
    action: 'تأكيد الاستلام من المتجر',
    proximityLabel: null,
    lifecycleStatus: 'enroute_to_pickup',
  },
  'to-customer': {
    title: 'التوصيل للعميل',
    description: 'الطلب معك وأنت في الطريق للعميل.',
    nextStage: 'near-customer',
    action: 'تأكيد الاقتراب من العميل',
    proximityLabel: null,
    lifecycleStatus: 'enroute_to_dropoff',
  },
  'near-customer': {
    title: 'قريب من العميل',
    description: 'أنت على مقربة من موقع التسليم.',
    nextStage: 'at-door',
    action: 'تأكيد الوصول للموقع',
    proximityLabel: 'near_customer',
    lifecycleStatus: 'near_customer',
  },
  'at-door': {
    title: 'عند باب العميل',
    description: 'وصلت لموقع التسليم. أخطر العميل بوصولك.',
    nextStage: 'bell-rang',
    action: 'قرع الجرس',
    proximityLabel: 'at_door',
    lifecycleStatus: 'at_door',
  },
  'bell-rang': {
    title: 'تم قرع الجرس',
    description: 'أُرسل إشعار الوصول. انتظر العميل أو انتقل لإثبات التسليم.',
    nextStage: 'proof',
    action: 'انتقل لإثبات التسليم',
    proximityLabel: 'bell_rang',
    lifecycleStatus: 'bell_rang',
  },
  'proof': {
    title: 'إثبات التسليم',
    description: 'ثبّت استلام العميل للطلب وأغلق المهمة.',
    nextStage: null,
    action: 'رفع الإثبات الآن',
    proximityLabel: null,
    lifecycleStatus: 'arrived_at_dropoff',
  },
};

export function DshCaptainMapScreen() {
  const [taskStage, setTaskStage] = React.useState<CaptainFieldStage>('to-store');
  const [stagesVisible, setStagesVisible] = React.useState(false);
  const heartbeat = useCaptainHeartbeat(taskStage);
  const config = STAGE_CONFIG[taskStage];
  const mapFlowPolicy = getDshCaptainFlowPolicy('captain-map-navigation');
  const mapFlowSummary = getDshFlowPolicySummary('captain-map-navigation');

  const advanceStage = () => {
    if (config.nextStage) {
      setTaskStage(config.nextStage);
    }
  };

  const proximityTone = config.proximityLabel === 'bell_rang'
    ? 'brand' as const
    : config.proximityLabel === 'at_door'
      ? 'success' as const
      : config.proximityLabel === 'near_customer'
        ? 'warning' as const
        : 'info' as const;

  return (
    <DshOperationScreen
      title="التنفيذ الميداني"
      subtitle="شاشة داخلية للكابتن — لا تُعرض للعميل. تحديث الموقع كل 3 دقائق بدون خريطة حية."
      content={
        <Box gap={3}>
          <Surface tone="brand" gap={3}>
            <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
              <Text role="bodyStrong">{config.title}</Text>
              <Badge label="مهمة نشطة" tone="brand" />
            </Box>
            <Text role="bodySm" tone="muted">{config.description}</Text>
            {config.proximityLabel && (
              <Badge label={config.proximityLabel === 'near_customer' ? 'قريب من العميل' : config.proximityLabel === 'at_door' ? 'عند الباب' : 'تم قرع الجرس'} tone={proximityTone} />
            )}
            <Surface tone="inset" gap={2} padding={3} radiusToken="lg">
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة شاشة الملاحة</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {mapFlowSummary?.nextPolicyActionPreview ?? 'هذه الشاشة تعرض ملخص التنفيذ أولًا، وتبقي المحطات التفصيلية خلف فتح صريح.'}
              </Text>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {`النمط الحالي: ${mapFlowPolicy ?? 'summary-only'} · لا تظهر مشكلات الشريك الداخلية هنا.`}
              </Text>
            </Surface>
          </Surface>

          <Surface tone="raised" gap={3}>
            <SectionHeader title="حالة التحديث" subtitle="تحديث الموقع داخلي كل 3 دقائق — لا GPS live للعميل." />
            <KeyValueList
              items={[
                { label: 'آخر تحديث', value: heartbeat.lastUpdateMinutesAgo === 0 ? 'الآن' : `منذ ${heartbeat.lastUpdateMinutesAgo} دقيقة` },
                { label: 'الوقت التقريبي', value: heartbeat.etaMinutes !== null ? `${heartbeat.etaMinutes} دقيقة` : 'وصلت' },
                { label: 'حالة المرحلة', value: config.lifecycleStatus, tone: 'brand' },
              ]}
            />
          </Surface>

          <Surface tone="inset" gap={3}>
            <SectionHeader title="محطات التنفيذ" subtitle="المحطات التفصيلية تفتح عند الطلب فقط." />
            <Button
              label={stagesVisible ? 'إخفاء المحطات' : 'فتح المحطات'}
              tone={stagesVisible ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth={false}
              onPress={() => setStagesVisible((current) => !current)}
            />
            {stagesVisible ? (
              <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                {(Object.keys(STAGE_CONFIG) as CaptainFieldStage[]).map((stage) => (
                  <Button
                    key={stage}
                    label={STAGE_CONFIG[stage].title}
                    tone={taskStage === stage ? 'primary' : 'secondary'}
                    size="sm"
                    fullWidth={false}
                    onPress={() => setTaskStage(stage)}
                  />
                ))}
              </Box>
            ) : (
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                افتح المحطات فقط عندما تحتاج تعديل مرحلة التنفيذ أو مراجعة التقدم.
              </Text>
            )}
          </Surface>
        </Box>
      }
      primaryActionLabel={config.action}
      secondaryActionLabel={config.nextStage ? 'المرحلة التالية' : undefined}
      onPrimaryAction={advanceStage}
      onSecondaryAction={config.nextStage ? advanceStage : undefined}
    />
  );
}

export default DshCaptainMapScreen;
