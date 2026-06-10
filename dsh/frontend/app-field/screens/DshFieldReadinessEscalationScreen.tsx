import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  SectionHeader,
  StateView,
  Text,
  TextField,
  TopBar,
  useTheme,
  spacing,
  radius,
  borders,
} from '@bthwani/ui-kit';
import { getOperationsSupportFlowPreview, getOperationsSupportFlowsForSurface } from '../../shared/support-flows';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';


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
  const { theme } = useTheme();
  const [reason, setReason] = React.useState('');
  const readinessFlow = getOperationsSupportFlowPreview('branch-readiness-escalation');
  const registryFlowSummary = getDshFlowPolicySummary('field-readiness-escalation');
  const registryEscalationOwner = resolveDshControlPanelSectionLabel('partners');
  const fieldFollowUpFlows = getOperationsSupportFlowsForSurface('app-field').filter(
    (item) => item.flowId === 'branch-readiness-escalation' || item.flowId === 'field-proof-required',
  );

  if (state === 'pending-response') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تصعيد عدم الجاهزية" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StateView
            stateId="loading"
            title="بانتظار رد الفريق المختص"
            description="تم إرسال بلاغ عدم الجاهزية. سيتم إعلامك عند صدور القرار."
            actionLabel="العودة"
            onActionPress={onBack}
          />
        </View>
      </View>
    );
  }

  if (state === 'approved') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تصعيد عدم الجاهزية" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StateView
            stateId="success"
            title="تمت الموافقة على التصعيد"
            description="تمت مراجعة العائق من قِبل الفريق المختص والموافقة على معالجته."
            actionLabel="العودة للمتاجر"
            onActionPress={onBack}
          />
        </View>
      </View>
    );
  }

  if (state === 'rejected') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تصعيد عدم الجاهزية" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StateView
            stateId="blockingError"
            title="تم رفض التصعيد"
            description="لم يتم قبول بلاغ عدم الجاهزية. يُرجى مراجعة المتطلبات وإعادة المحاولة."
            actionLabel="إعادة التصعيد"
            onActionPress={onRetry}
          />
        </View>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface, justifyContent: 'center' }}>
        <StateView stateId="loading" />
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تصعيد عدم الجاهزية" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StateView
            stateId="success"
            title="تم تصعيد العائق بنجاح"
            description="تم إرسال بلاغ عدم الجاهزية إلى الجهة المعنية للمتابعة."
            actionLabel="العودة للمتاجر"
            onActionPress={onBack}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="تصعيد عدم الجاهزية"
        subtitle="إبلاغ الفريق المختص بالعوائق الميدانية للمتجر"
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 96 }}>
        <Box padding={4} gap={4}>
          {/* Section 1: متطلبات المتجر */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title={storeName}
              subtitle="المتجر حالياً غير جاهز لاستلام الطلبات."
            />
            <Box gap={1}>
              <Text role="bodyStrong">المتطلبات الناقصة:</Text>
              {missingRequirements.map((req, index) => (
                <Text key={index} role="caption" tone="muted">• {req}</Text>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Section 2: سياق التصعيد */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title={readinessFlow.title}
              subtitle={`هذا التصعيد يبقى field-owned في التجميع، لكن مالك القرار والسياسة هو ${resolveDshControlPanelSectionLabel('partners')}.`}
            />
            <KeyValueList
              items={[
                { label: 'المالك الحالي', value: registryFlowSummary?.ownerSurface ?? readinessFlow.ownerLabel, tone: 'brand' as const },
                { label: 'مالك التصعيد (السجل المركزي)', value: registryEscalationOwner, tone: 'brand' as const },
                { label: 'سياسة فتح الأدلة', value: resolveDshOnDemandPolicyLabel(registryFlowSummary?.onDemandPolicy) },
                { label: 'الإجراء التالي', value: readinessFlow.nextAction, tone: 'brand' as const },
              ]}
            />
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {registryFlowSummary?.nextPolicyActionPreview ?? 'الأدلة لا تُفتح هنا إلا عند الطلب، ولا يوجد قرار مالي أو تفعيل نهائي محلي.'}
            </Text>
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {`الممنوع محليًا: ${registryFlowSummary?.forbiddenActions.join('، ') ?? 'اعتماد مالي أو تفعيل نهائي'}`}
            </Text>
            <Box gap={0}>
              {fieldFollowUpFlows.map((flow, index) => (
                <View key={flow.flowId}>
                  {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                  <Box gap={1} paddingY={2}>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, alignItems: 'flex-end', gap: 2 }}>
                        <Text role="bodyStrong" style={{ textAlign: 'right' }}>{flow.title}</Text>
                        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>{flow.description}</Text>
                        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{flow.nextAction}</Text>
                      </View>
                      <Badge
                        label={flow.requiresEvidence ? 'يتطلب إثباتًا' : 'متابعة'}
                        tone={flow.requiresEvidence ? 'warning' : 'default'}
                      />
                    </View>
                  </Box>
                </View>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Section 3: توجيه التصعيد */}
          <Box gap={3} paddingY={2}>
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
                    { borderColor: theme.line },
                    target.isSelected && {
                      borderColor: theme.brand,
                      backgroundColor: theme.brandSurface,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      { borderColor: theme.line },
                      target.isSelected && { borderColor: theme.brand },
                    ]}
                  >
                    {target.isSelected && (
                      <View style={[styles.radioInner, { backgroundColor: theme.brand }]} />
                    )}
                  </View>
                  <Text
                    role="bodyMd"
                    style={[
                      styles.targetLabel,
                      { color: theme.textMuted },
                      target.isSelected && { color: theme.text },
                    ]}
                  >
                    {target.label}
                  </Text>
                </Pressable>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Section 4: تفاصيل إضافية */}
          <Box gap={3} paddingY={2}>
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
          </Box>

          <Divider />

          <Box gap={2}>
            <Button
              label="تصعيد العائق الآن"
              tone="primary"
              onPress={() => onSubmit(reason)}
              disabled={!reason.trim()}
            />
            <Button label="إلغاء والرجوع" tone="secondary" onPress={onBack} />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
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
    borderWidth: borders.hairline,
    gap: spacing[3],
  },
  targetLabel: {
    flex: 1,
    textAlign: 'right',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: borders.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
