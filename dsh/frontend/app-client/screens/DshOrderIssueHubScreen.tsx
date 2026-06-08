import React from 'react';
import {
  Box,
  Button,
  Icon,
  MobileScrollView,
  Surface,
  Text,
  TextField,
  KeyValueList,
  Chip,
  useTheme,
} from '@bthwani/ui-kit';
import type { DshOperationScreenState } from '../parts/OperationScreen';
import {
  getOperationsSupportFlowsForSurface,
  getOperationsSupportSurfaceEntry,
  type DshOperationsSupportFlowId,
} from '../../data/support.preview-data';
import { getDshClientFlowPolicy } from '../contracts/dsh-client-binding.contracts';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

function resolveClientIssuePolicyLabel(policy: ReturnType<typeof getDshClientFlowPolicy>): string {
  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  if (policy === 'summary-only') {
    return 'ملخص أولًا';
  }

  return 'سياسة مرتبطة بالسجل';
}

function resolveClientIssueOwnerLabel(ownerSurface?: string): string {
  if (ownerSurface === 'control-panel') {
    return resolveDshControlPanelSectionLabel('support');
  }

  return ownerSurface ?? 'support';
}

export type DshOrderIssueHubScreenProps = {
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

export function DshOrderIssueHubScreen({ state = 'ready', onPrimaryAction, onSecondaryAction, onRetry }: DshOrderIssueHubScreenProps) {
  const [selectedIssue, setSelectedIssue] = React.useState<DshOperationsSupportFlowId | null>(null);
  const [detailsText, setDetailsText] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { theme } = useTheme();
  const issueFlowPolicy = getDshClientFlowPolicy('client-order-issue');
  const issueFlowSummary = getDshFlowPolicySummary('client-order-issue');
  const issueTypes = React.useMemo(
    () =>
      getOperationsSupportFlowsForSurface('app-client').filter((item) => {
        const visibility = getOperationsSupportSurfaceEntry(item.flowId, 'app-client');
        return visibility?.routeHint === 'order-issue-workspace';
      }),
    [],
  );
  const selectedFlow = selectedIssue ? issueTypes.find((item) => item.flowId === selectedIssue) ?? null : null;

  if (isSubmitted) {
    return (
      <MobileScrollView padding={4} gap={3} style={{ backgroundColor: theme.surface }}>
        <Box gap={3} align="center" style={{ marginTop: 40, paddingVertical: 20 }}>
          <Box
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: theme.brandSurface,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Icon name="checkmark-circle" size={48} color={theme.brand} />
          </Box>
          <Text role="titleLg" style={{ textAlign: 'center' }}>تم إرسال بلاغك بنجاح</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'center', paddingHorizontal: 20 }}>
            تلقينا تفاصيل مشكلتك وسيقوم فريق الدعم والمساعدة بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.
          </Text>
        </Box>

        <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: 16 }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>تفاصيل البلاغ:</Text>
          <KeyValueList
            dense
            items={[
              { label: 'نوع المشكلة', value: selectedFlow?.title ?? '' },
              { label: 'الإجراء التالي', value: selectedFlow?.nextAction ?? 'بانتظار المراجعة', tone: 'brand' },
              ...(selectedFlow?.financialImpactPreview
                ? [{ label: 'الأثر المالي Preview', value: selectedFlow.financialImpactPreview, tone: 'info' as const }]
                : []),
              { label: 'تفاصيل إضافية', value: detailsText.trim() || 'لا يوجد تفاصيل إضافية' },
            ]}
          />
        </Surface>

        <Box gap={2} style={{ marginTop: 20 }}>
          <Button
            label="العودة إلى الطلبات"
            onPress={() => {
              onSecondaryAction?.();
            }}
          />
        </Box>
      </MobileScrollView>
    );
  }

  const handleIssuePress = (id: DshOperationsSupportFlowId) => {
    setSelectedIssue(selectedIssue === id ? null : id);
  };

  const handleSubmit = () => {
    if (!selectedIssue) return;
    setIsSubmitted(true);
  };

  return (
    <MobileScrollView padding={4} gap={3} style={{ backgroundColor: theme.surface }}>
      {/* Header */}
      <Box gap={1} style={{ alignItems: 'flex-end', marginBottom: 8 }}>
        <Text role="titleLg" style={{ textAlign: 'right' }}>الدعم والمساعدة</Text>
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          دعم العميل يبقى داخل الطلب الحالي فقط. اختر نوع المشكلة ثم أضف ملاحظة مختصرة عند الحاجة.
        </Text>
      </Box>

      <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: 20 }}>
        <Box layoutDirection="row" justify="space-between" align="center" gap={2} style={{ flexDirection: 'row-reverse' }}>
          <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة البلاغ من السجل المركزي</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              {issueFlowSummary?.nextPolicyActionPreview ?? 'الأدلة والملفات لا تُفتح إلا عند طلبها من داخل هذا البلاغ.'}
            </Text>
          </Box>
          <Chip label={resolveClientIssuePolicyLabel(issueFlowPolicy)} tone="warning" />
        </Box>
        <KeyValueList
          dense
          items={[
            { label: 'الظهور', value: issueFlowSummary?.visibility ?? 'contextual' },
            { label: 'مالك التصعيد', value: resolveClientIssueOwnerLabel(issueFlowSummary?.escalationOwner), tone: 'brand' },
            { label: 'الممنوع', value: issueFlowSummary?.forbiddenActions.join('، ') ?? 'لا يوجد' },
          ]}
        />
      </Surface>

      {/* Interactive Chips list */}
      <Surface tone="raised" padding={3} gap={3} style={{ borderRadius: 20 }}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>ما هي المشكلة التي تواجهها؟</Text>

        <Box layoutDirection="row" gap={1} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {issueTypes.map((issue) => {
            const isSelected = selectedIssue === issue.flowId;
            return (
              <Chip
                key={issue.flowId}
                label={issue.title}
                tone={isSelected ? 'brand' : 'default'}
                onPress={() => handleIssuePress(issue.flowId)}
              />
            );
          })}
        </Box>
      </Surface>

      {selectedFlow ? (
        <Surface tone="inset" padding={3} gap={2} style={{ borderRadius: 20 }}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{selectedFlow.title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            {selectedFlow.description}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {`الإجراء التالي: ${selectedFlow.nextAction}`}
          </Text>
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {`يفتح هذا السياق الأدلة أو المرفقات عند الطلب فقط، ولا يفتح مركز عمليات مستقل للعميل.`}
          </Text>
          {selectedFlow.financialImpactPreview ? (
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {`Preview only: ${selectedFlow.financialImpactPreview}`}
            </Text>
          ) : null}
        </Surface>
      ) : null}

      {/* Details field */}
      <Surface tone="raised" padding={3} gap={2} style={{ borderRadius: 20 }}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>تفاصيل إضافية</Text>
        <TextField
          value={detailsText}
          onChangeText={setDetailsText}
          placeholder="اكتب ملاحظة قصيرة تساعد فريق الدعم"
          style={{ textAlign: 'right' }}
        />
      </Surface>

      {/* CTA Buttons */}
      <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 20 }}>
        <Box gap={2}>
          <Button
            label={selectedIssue ? 'إرسال البلاغ' : 'اختر نوع المشكلة أولاً'}
            disabled={!selectedIssue}
            onPress={handleSubmit}
          />
          <Button
            label="العودة إلى الطلبات"
            tone="ghost"
            onPress={() => {
              onSecondaryAction?.();
            }}
          />
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default DshOrderIssueHubScreen;
