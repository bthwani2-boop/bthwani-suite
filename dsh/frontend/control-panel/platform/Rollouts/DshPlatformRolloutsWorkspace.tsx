'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

// Rollouts can target either a top-level service (e.g. DSH) or a capability inside one (e.g. عونك inside DSH).
// Service-level rollouts: affect the entire service across a region.
// Capability-level rollouts: activate a sub-feature/mode within an existing service.
type RolloutLevel = 'service' | 'capability';

type RolloutCardProps = {
  level: RolloutLevel;
  title: string;
  parentService?: string; // only for capability-level
  scope: string;
  auditKey: string;
  initialStage: string;
  stageOptions: string[];
  onStageChange?: (oldStage: string, newStage: string) => void;
};

function RolloutLevelBadge({ level }: { level: RolloutLevel }) {
  return (
    <Surface
      tone={level === 'service' ? 'brand' : 'warning'}
      padding={1}
      radiusToken="pill"
      border={false}
    >
      <Text role="caption" tone="inverse" weight="bold">
        {level === 'service' ? 'رول-أوت خدمة عليا' : 'رول-أوت قدرة DSH'}
      </Text>
    </Surface>
  );
}

function RolloutCard({
  level,
  title,
  parentService,
  scope,
  auditKey,
  initialStage,
  stageOptions,
}: RolloutCardProps) {
  const { addAuditEvent } = useDemoPlatformState();
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [activeStage, setActiveStage] = React.useState(initialStage);

  const isKillSwitch = activeStage.includes('Kill') || activeStage.includes('موقوف');

  const handleConfirm = (action: string) => {
    let newStage = activeStage;
    if (action === 'إيقاف فوري (Kill Switch)') {
      newStage = 'موقوف (Kill Switch)';
    } else if (stageOptions.includes(action)) {
      newStage = action;
    }

    if (action !== 'تأكيد الإطلاق' && action !== 'Rollback') {
      setActiveStage(newStage);
    }

    addAuditEvent({
      action: `رول-أوت (${auditKey}): ${action}`,
      operator: 'Demo Admin',
      status: action.includes('Kill Switch') ? 'danger' : 'success',
      oldValue: activeStage,
      newValue: newStage,
      reason: 'محاكاة محلية',
      scope,
      impact: `تغيير مرحلة الإطلاق إلى ${newStage}`,
      rollbackAvailable: true,
    });
    setShowConfirm(null);
  };

  return (
    <Surface tone="raised" border padding={3} radiusToken="xl">
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Box gap={1}>
            <Box layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
              <RolloutLevelBadge level={level} />
              {level === 'capability' && parentService && (
                <Text role="caption" tone="muted">داخل {parentService}</Text>
              )}
            </Box>
            <Text role="titleMd">{title}</Text>
            <Text role="caption" tone="muted">النطاق: {scope}</Text>
          </Box>
          <Surface tone={isKillSwitch ? 'danger' : 'brand'} padding={1} radiusToken="pill" border={false}>
            <Text role="caption" tone="inverse">{activeStage}</Text>
          </Surface>
        </Box>

        {!showConfirm ? (
          <>
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
              {stageOptions.map((opt) => (
                <Button key={opt} variant="secondary" onClick={() => setShowConfirm(opt)}>{opt}</Button>
              ))}
            </Box>
            <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
              <Button variant="primary" onClick={() => setShowConfirm('تأكيد الإطلاق')} style={{ flexGrow: 1 }}>
                تأكيد الإطلاق
              </Button>
              <Button variant="danger" onClick={() => setShowConfirm('إيقاف فوري (Kill Switch)')} style={{ flexGrow: 1 }}>
                إيقاف فوري (Kill Switch)
              </Button>
              <Button variant="secondary" onClick={() => setShowConfirm('Rollback')} style={{ flexGrow: 1 }}>
                Rollback (تجريبي)
              </Button>
            </Box>
          </>
        ) : (
          <Surface tone="warning" border padding={3} radiusToken="md">
            <Box gap={2}>
              <Text role="titleSm">تأكيد: {showConfirm}</Text>
              <Text role="bodySm">هل أنت متأكد من تنفيذ هذا الإجراء التجريبي؟</Text>
              <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
              </Box>
            </Box>
          </Surface>
        )}
      </Box>
    </Surface>
  );
}

export function DshPlatformRolloutsWorkspace() {
  return (
    <Box gap={4}>
      <WebSectionCard
        title="الإطلاق التدريجي (Rollouts)"
        description="رول-أوت الخدمات العليا يؤثر على الخدمة كاملاً في النطاق المحدد. رول-أوت القدرات يُفعّل ميزة داخل خدمة قائمة تدريجياً."
      >
        <Box gap={4}>
          {/* Section: Service-Level Rollouts */}
          <Box gap={2}>
            <Surface tone="default" border={false} padding={0}>
              <Text role="titleSm" tone="muted">رول-أوت الخدمات العليا</Text>
            </Surface>
            <RolloutCard
              level="service"
              title="DSH — تجربة محافظة صنعاء"
              scope="محافظة صنعاء فقط"
              auditKey="DSH:sanaa-pilot"
              initialStage="تفعيل تجريبي (Pilot)"
              stageOptions={['10% تفعيل', '25% تفعيل', '50% تفعيل', '100% تفعيل']}
            />
          </Box>

          {/* Divider */}
          <Surface tone="default" border padding={0} style={{ height: 1 }} />

          {/* Section: Capability-Level Rollouts */}
          <Box gap={2}>
            <Surface tone="default" border={false} padding={0}>
              <Text role="titleSm" tone="muted">رول-أوت القدرات الفرعية (داخل DSH)</Text>
            </Surface>
            <RolloutCard
              level="capability"
              title="نمط الاستلام من المتجر (Store Pickup)"
              parentService="DSH"
              scope="Global"
              auditKey="DSH:capability:store-pickup"
              initialStage="داخلي فقط (Internal Only)"
              stageOptions={['فتح لمجموعة Alpha', 'فتح لمجموعة Beta', 'فتح للجميع']}
            />
            <RolloutCard
              level="capability"
              title="قدرة عونك (Awnak)"
              parentService="DSH"
              scope="محافظة صنعاء"
              auditKey="DSH:capability:awnak"
              initialStage="نشط (Active)"
              stageOptions={['تقليص إلى 50%', 'توسيع نطاق جغرافي', 'تفعيل في مدينة جديدة']}
            />
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}
