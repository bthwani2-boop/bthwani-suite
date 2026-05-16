import React from 'react';
import {
  Badge,
  Box,
  Button,
  KeyValueList,
  Surface,
  Text,
  resolveRowDirection,
  useDirection,
} from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import {
  DSH_PLATFORM_AUDIT_PREVIEW,
  DSH_PLATFORM_OPERATIONAL_VARS,
  DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  DSH_PLATFORM_SCOPE_PRECEDENCE,
  DSH_PLATFORM_SIMULATION_PREVIEW,
  DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
} from './vars.preview';
import type {
  DshPlatformAuditEntry,
  DshPlatformProviderControlRecord,
  DshPlatformScopeLayer,
  DshPlatformSimulationScenario,
  DshPlatformVarOwner,
  DshPlatformVarRecord,
  DshPlatformVarRisk,
  DshPlatformVarStatus,
} from './vars.types';

const OWNER_TONES: Record<DshPlatformVarOwner, React.ComponentProps<typeof Badge>['tone']> = {
  DSH: 'brand',
  WLT: 'warning',
  Provider: 'info',
};

const STATUS_TONES: Record<DshPlatformVarStatus, React.ComponentProps<typeof Badge>['tone']> = {
  'preview-only': 'info',
  'contract-needed': 'warning',
  'ready-for-binding': 'success',
};

const RISK_TONES: Record<DshPlatformVarRisk, React.ComponentProps<typeof Badge>['tone']> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  financial: 'info',
};

type PreviewActionLabels = {
  primary: string;
  secondary: string;
};

function VarRecordCard({
  record,
  actionLabels,
  children,
}: {
  record: DshPlatformVarRecord;
  actionLabels: PreviewActionLabels;
  children?: React.ReactNode;
}) {
  return (
    <Surface
      tone="raised"
      border
      padding={3}
      radiusToken="xl"
      style={{ flexGrow: 1, flexBasis: 320, minWidth: 0 }}
    >
      <Box gap={3}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', rowGap: 8, columnGap: 8 }}>
          <Box gap={1} style={{ flexGrow: 1, minWidth: 220 }}>
            <Text role="titleMd">{record.label}</Text>
            <Text role="caption" tone="muted">{record.key}</Text>
          </Box>
          <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap' }}>
            <Badge label={record.owner} tone={OWNER_TONES[record.owner]} />
            <Badge label={record.status} tone={STATUS_TONES[record.status]} />
            <Badge label={record.risk} tone={RISK_TONES[record.risk]} />
          </Box>
        </Box>

        <KeyValueList
          dense
          items={[
            { label: 'scope', value: record.scope },
            { label: 'current preview value', value: record.currentPreviewValue },
            { label: 'proposed preview value', value: record.proposedPreviewValue ?? 'لا يوجد تغيير مقترح' },
            { label: 'effect summary', value: record.effectSummary },
            { label: 'audit/rollback hint', value: record.auditRollbackHint },
            { label: 'scope & precedence', value: record.precedenceNote },
          ]}
        />

        {children}

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label={actionLabels.primary} tone="secondary" disabled fullWidth={false} />
          <Button label={actionLabels.secondary} tone="ghost" disabled fullWidth={false} />
        </Box>
      </Box>
    </Surface>
  );
}

function ProviderControlCard({ record }: { record: DshPlatformProviderControlRecord }) {
  return (
    <VarRecordCard
      record={record}
      actionLabels={{ primary: 'تطبيق لاحقًا', secondary: 'rollback لاحقًا' }}
    >
      <Surface tone="default" border padding={3} radiusToken="lg">
        <KeyValueList
          dense
          items={[
            { label: 'provider_id', value: record.providerId },
            { label: 'capability', value: record.capability },
            { label: 'priority', value: record.priority },
            { label: 'fallback', value: record.fallback },
            { label: 'mode', value: record.mode },
            { label: 'test result', value: record.testResult },
            { label: 'rollback target', value: record.rollbackTarget },
          ]}
        />
      </Surface>
    </VarRecordCard>
  );
}

function ScopeLayerCard({ layer }: { layer: DshPlatformScopeLayer }) {
  return (
    <Surface tone="raised" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 240, minWidth: 0 }}>
      <Box gap={2}>
        <Box layoutDirection="row" justify="space-between" align="center" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Text role="titleMd">{layer.scope}</Text>
          <Badge label={`#${layer.order}`} tone="brand" />
        </Box>
        <Text role="bodyStrong">{layer.title}</Text>
        <Text role="bodySm">{layer.description}</Text>
        <Text role="caption" tone="muted">{layer.ownerGuard}</Text>
        <Text role="caption" tone="soft">{layer.note}</Text>
      </Box>
    </Surface>
  );
}

function SimulationCard({ scenario }: { scenario: DshPlatformSimulationScenario }) {
  return (
    <Surface tone="raised" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 300, minWidth: 0 }}>
      <Box gap={3}>
        <Box gap={1}>
          <Text role="titleMd">{scenario.title}</Text>
          <Text role="caption" tone="muted">{scenario.relatedKeys.join(' | ')}</Text>
        </Box>
        <KeyValueList
          dense
          items={[
            { label: 'owner', value: scenario.owner },
            { label: 'scope', value: scenario.scope },
            { label: 'expected impact', value: scenario.expectedImpact },
            { label: 'guardrail', value: scenario.guardrail },
            { label: 'blocked reason', value: scenario.blockedReason },
          ]}
        />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="محاكاة الأثر" tone="secondary" disabled fullWidth={false} />
          <Button label="طلب اعتماد" tone="ghost" disabled fullWidth={false} />
        </Box>
      </Box>
    </Surface>
  );
}

function AuditCard({ entry }: { entry: DshPlatformAuditEntry }) {
  return (
    <Surface tone="raised" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 300, minWidth: 0 }}>
      <Box gap={3}>
        <Box gap={1}>
          <Text role="titleMd">{entry.title}</Text>
          <Text role="caption" tone="muted">{entry.targetKey}</Text>
        </Box>
        <KeyValueList
          dense
          items={[
            { label: 'actor', value: entry.actor },
            { label: 'event', value: entry.event },
            { label: 'state', value: entry.stateLabel },
            { label: 'evidence hint', value: entry.evidenceHint },
            { label: 'rollback hint', value: entry.rollbackHint },
          ]}
        />
        <Button label="rollback لاحقًا" tone="ghost" disabled fullWidth={false} />
      </Box>
    </Surface>
  );
}

export function DshPlatformVarsWorkspace() {
  const { direction } = useDirection();
  const allVars = [
    ...DSH_PLATFORM_OPERATIONAL_VARS,
    ...DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS,
    ...DSH_PLATFORM_PROVIDER_CONTROL_VARS,
  ];

  const readyCount = allVars.filter((item) => item.status === 'ready-for-binding').length;
  const contractCount = allVars.filter((item) => item.status === 'contract-needed').length;
  const previewOnlyCount = allVars.filter((item) => item.status === 'preview-only').length;

  return (
    <Box gap={3}>
      <WebSectionCard
        title="Vars Workspace"
        description="غرفة تحكم preview-only لتجميع صورة المتغيرات التشغيلية والمالية والجسور ومزودي الخدمة بدون أي ادعاء runtime truth."
      >
        <Box gap={3}>
          <WebControlPanelKpiStrip
            items={[
              { id: 'all-vars', label: 'إجمالي السجلات', value: String(allVars.length), tone: 'neutral' },
              { id: 'ready', label: 'ready-for-binding', value: String(readyCount), tone: 'success' },
              { id: 'contract', label: 'contract-needed', value: String(contractCount), tone: 'warning' },
              { id: 'preview', label: 'preview-only', value: String(previewOnlyCount), tone: 'danger' },
            ]}
          />

          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
              <WebSignalCard
                title="DSH ownership"
                value="Operational only"
                description="المناطق والإسناد وSLA والجاهزية وأنماط التوصيل وعونك وشي إن تبقى داخل ملكية DSH التشغيلية فقط."
                tone="brand"
              />
            </Box>
            <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
              <WebSignalCard
                title="WLT ownership"
                value="Financial truth"
                description="الرسوم والعمولات والتسويات والاستردادات وذمم COD والرصيد الضامن تبقى WLT-owned، وDSH يعرضها كجسر فقط."
                tone="warning"
              />
            </Box>
            <Box style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
              <WebSignalCard
                title="Provider control"
                value="Preview only"
                description="provider_id / capability / priority / fallback / mode / scope / status / test result / rollback target معروضة فقط بدون switching فعلي."
                tone="info"
              />
            </Box>
          </Box>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="DSH Operational Vars"
        description="متغيرات تشغيلية يملكها DSH فقط، موجهة للمناطق والإسناد وSLA والجاهزية وأنماط التوصيل."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {DSH_PLATFORM_OPERATIONAL_VARS.map((record) => (
            <VarRecordCard
              key={record.id}
              record={record}
              actionLabels={{ primary: 'محاكاة الأثر', secondary: 'طلب اعتماد' }}
            />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="WLT Financial Vars Bridge"
        description="عرض مالي bridge فقط. DSH يرى الأثر التشغيلي، لكن الحقيقة المالية ومصادرها وتفعيلها تبقى داخل WLT."
      >
        <Box gap={2}>
          <Surface tone="default" border padding={3} radiusToken="xl">
            <Text role="bodyStrong">لا توجد حقيقة مالية محلية داخل DSH Platform.</Text>
            <Text role="bodySm" tone="muted">
              كل سجل هنا يظهر current/proposed preview values لغرض القرار البصري فقط، مع إبقاء source-of-truth والعقد والتنفيذ الفعلي داخل WLT.
            </Text>
          </Surface>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            {DSH_PLATFORM_WLT_FINANCIAL_BRIDGE_VARS.map((record) => (
              <VarRecordCard
                key={record.id}
                record={record}
                actionLabels={{ primary: 'محاكاة الأثر', secondary: 'طلب اعتماد' }}
              />
            ))}
          </Box>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="Provider Control"
        description="عرض preview-only لمسارات التحكم بالمزودين ونتائج الاختبار والأولوية وrollback target بدون أي switching فعلي."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {DSH_PLATFORM_PROVIDER_CONTROL_VARS.map((record) => (
            <ProviderControlCard key={record.id} record={record} />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="Scope & Precedence"
        description="ترتيب بصري واضح لمستويات النطاق ومن يملك القرار عند كل طبقة."
      >
        <Box gap={2}>
          <Surface tone="default" border padding={3} radiusToken="xl">
            <Text role="bodyStrong">قاعدة القراءة الحالية</Text>
            <Text role="bodySm" tone="muted">
              داخل نفس المالك تفوز الطبقة الأدق على الأوسع. إذا دخل المال، تبقى WLT صاحبة الحقيقة ولو ظهر العرض داخل DSH Platform.
            </Text>
          </Surface>
          <Box
            layoutDirection="row"
            gap={2}
            style={{
              flexWrap: 'wrap',
              flexDirection: resolveRowDirection(direction),
            }}
          >
            {DSH_PLATFORM_SCOPE_PRECEDENCE.map((layer) => (
              <ScopeLayerCard key={layer.id} layer={layer} />
            ))}
          </Box>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="Simulation / Impact Preview"
        description="محاكاة أثر فقط. كل الأزرار معطلة لإظهار أن هذه المرحلة لا تتجاوز UI/UX flow."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {DSH_PLATFORM_SIMULATION_PREVIEW.map((scenario) => (
            <SimulationCard key={scenario.id} scenario={scenario} />
          ))}
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="Audit / Rollback Preview"
        description="مسار تدقيق وإرجاع مرئي فقط لإثبات ماذا سيظهر للمستخدم قبل فتح أي binding أو mutation فعلي."
      >
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {DSH_PLATFORM_AUDIT_PREVIEW.map((entry) => (
            <AuditCard key={entry.id} entry={entry} />
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformVarsWorkspace;
