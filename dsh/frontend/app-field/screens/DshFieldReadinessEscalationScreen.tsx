import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Text,
  TextField,
  colorPalette,
  spacing,
  radius,
} from '@bthwani/ui-kit';
import {
  getOperationsSupportFlowPreview,
  getOperationsSupportFlowsForSurface,
} from '../../shared/operations-support.preview';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

function resolveFieldPolicyLabel(policy?: string): string {
  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  return policy ?? 'سياسة من السجل';
}

export type DshFieldReadinessEscalationScreenProps = {
  // ML-004: added pending-response / approved / rejected states for ops response tracking
  state?: 'ready' | 'loading' | 'success' | 'error' | 'blocked' | 'pending-response' | 'approved' | 'rejected';
  storeName: string;
  missingRequirements: string[];
  escalationTargets: Array<{ id: string; label: string; isSelected: boolean }>;
  onSelectTarget: (id: string) => void;
  onSubmit: (reason: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
};

export function DshFieldReadinessEscalationScreen({
  state = 'ready',
  storeName = 'مطعم النجوم',
  missingRequirements = [
    'نقص في أجهزة التغليف الحراري',
    'عدم اكتمال تدريب طاقم العمل على النظام',
    'عدم توفر ملصقات العلامة التجارية',
  ],
  escalationTargets = [
    { id: 'partner-management', label: 'قسم الشركاء (Partner Management)', isSelected: true },
    { id: 'control-panel', label: 'قسم الدعم في لوحة التحكم', isSelected: false },
    { id: 'marketing', label: 'فريق التسويق (Marketing)', isSelected: false },
  ],
  onSelectTarget,
  onSubmit,
  onBack,
  onRetry,
}: DshFieldReadinessEscalationScreenProps) {
  const [reason, setReason] = React.useState('');
  const readinessFlow = getOperationsSupportFlowPreview('branch-readiness-escalation');
  const registryFlowSummary = getDshFlowPolicySummary('field-readiness-escalation');
  const registryEscalationOwner = resolveDshControlPanelSectionLabel('partners');
  const fieldFollowUpFlows = getOperationsSupportFlowsForSurface('app-field').filter(
    (item) => item.flowId === 'branch-readiness-escalation' || item.flowId === 'field-proof-required',
  );

  if (state === 'pending-response') {
    return (
      <Surface style={styles.root}>
        <StateView
          stateId="loading"
          title="بانتظار رد الفريق المختص"
          description="تم إرسال بلاغ عدم الجاهزية. سيتم إعلامك عند صدور القرار."
        />
      </Surface>
    );
  }

  if (state === 'approved') {
    return (
      <Surface style={styles.root}>
        <StateView
          stateId="success"
          title="تمت الموافقة على التصعيد"
          description="تمت مراجعة العائق من قِبل الفريق المختص والموافقة على معالجته."
          actionLabel="العودة للمتاجر"
          onActionPress={onBack}
        />
      </Surface>
    );
  }

  if (state === 'rejected') {
    return (
      <Surface style={styles.root}>
        <StateView
          stateId="blocked"
          title="تم رفض التصعيد"
          description="لم يتم قبول بلاغ عدم الجاهزية. يُرجى مراجعة المتطلبات وإعادة المحاولة."
          actionLabel="إعادة التصعيد"
          onActionPress={onRetry}
        />
      </Surface>
    );
  }

  if (state === 'loading') {
    return <Surface style={styles.root}><StateView stateId="loading" /></Surface>;
  }

  if (state === 'success') {
    return (
      <Surface style={styles.root}>
        <StateView
          stateId="success"
          title="تم تصعيد العائق بنجاح"
          description="تم إرسال بلاغ عدم الجاهزية إلى الجهة المعنية للمتابعة."
          actionLabel="العودة للمتاجر"
          onActionPress={onBack}
        />
      </Surface>
    );
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">تصعيد عدم الجاهزية</Text>
        <Text role="bodyMd" tone="muted">
          استخدم هذه الشاشة لإبلاغ الفريق المختص بوجود عوائق تمنع المتجر من البدء.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader
          title={storeName}
          subtitle="المتجر حالياً غير جاهز لاستلام الطلبات."
        />
        <Box gap={1}>
          <Text role="bodyStrong" style={{ color: colorPalette.white }}>المتطلبات الناقصة:</Text>
          {missingRequirements.map((req, index) => (
            <Text key={index} role="caption" style={{ color: colorPalette.white }}>• {req}</Text>
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title={readinessFlow.title}
          subtitle={`هذا التصعيد يبقى field-owned في التجميع، لكن مالك القرار والسياسة هو ${resolveDshControlPanelSectionLabel('partners')}.`}
        />
        <KeyValueList
          items={[
            { label: 'المالك الحالي', value: registryFlowSummary?.ownerSurface ?? readinessFlow.ownerLabel, tone: 'brand' as const },
            { label: 'مالك التصعيد (السجل المركزي)', value: registryEscalationOwner, tone: 'brand' as const },
            { label: 'سياسة فتح الأدلة', value: resolveFieldPolicyLabel(registryFlowSummary?.onDemandPolicy) },
            { label: 'الإجراء التالي', value: readinessFlow.nextAction, tone: 'brand' as const },
          ]}
        />
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {registryFlowSummary?.nextPolicyActionPreview ?? 'الأدلة لا تُفتح هنا إلا عند الطلب، ولا يوجد قرار مالي أو تفعيل نهائي محلي.'}
        </Text>
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`الممنوع محليًا: ${registryFlowSummary?.forbiddenActions.join('، ') ?? 'اعتماد مالي أو تفعيل نهائي'}`}
        </Text>
        <Box gap={2}>
          {fieldFollowUpFlows.map((flow) => (
            <ListItem
              key={flow.flowId}
              title={flow.title}
              subtitle={flow.description}
              meta={flow.nextAction}
              badgeLabel={flow.requiresEvidence ? 'يتطلب إثباتًا' : 'متابعة'}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader
          title="توجيه التصعيد"
          subtitle="اختر الجهة المسؤولة عن معالجة هذا العائق."
        />
        <Box gap={2}>
          {escalationTargets.map((target) => (
            <Pressable
              key={target.id}
              onPress={() => onSelectTarget(target.id)}
              style={[
                styles.targetItem,
                target.isSelected && styles.targetItemSelected,
              ]}
            >
              <View style={[styles.radioCircle, target.isSelected && styles.radioCircleActive]}>
                {target.isSelected && <View style={styles.radioInner} />}
              </View>
              <Text role="bodyMd" style={[styles.targetLabel, target.isSelected && { color: colorPalette.deepBlue }]}>
                {target.label}
              </Text>
            </Pressable>
          ))}
        </Box>
      </Surface>

      <Surface tone="default" gap={3}>
        <SectionHeader
          title="تفاصيل إضافية"
          subtitle="يرجى كتابة ملاحظات دقيقة لمساعدة فريق المعالجة."
        />
        <TextField
          label="سبب التصعيد"
          placeholder="اشرح العائق بالتفصيل هنا..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          style={{ minHeight: 100 }}
        />
      </Surface>

      <Box marginTop={spacing[2]} gap={2}>
        <Button
          label="تصعيد العائق الآن"
          tone="primary"
          onPress={() => onSubmit(reason)}
          disabled={!reason.trim()}
        />
        <Button label="إلغاء والرجوع" tone="secondary" onPress={onBack} />
      </Box>
    </MobileScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  targetItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colorPalette.line,
    gap: spacing[3],
  },
  targetItemSelected: {
    borderColor: colorPalette.deepBlue,
    backgroundColor: colorPalette.lightSurface,
  },
  targetLabel: {
    flex: 1,
    textAlign: 'right',
    color: colorPalette.deepBlueLighter,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colorPalette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colorPalette.deepBlue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colorPalette.deepBlue,
  },
});
