import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Icon,
  SectionHeader,
  Surface,
  Text,
  useTheme,
  colorPalette,
  spacing,
  radius,
  withAlpha,
  StateView,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';
import { getDshCaptainFlowPolicy } from '../contracts/dshCaptainBinding.contracts';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';

function resolvePodPolicyLabel(policy: ReturnType<typeof getDshCaptainFlowPolicy>): string {
  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  return 'سياسة من السجل';
}

export type DshCaptainPoDSubmissionScreenProps = {
  // ML-031: added 'retry-required' — ops rejected proof and captain must re-capture
  state?: 'ready' | 'loading' | 'success' | 'error' | 'rejected' | 'retry-required';
  orderId: string;
  onCapturePhoto: () => void;
  onConfirm: () => void;
  onReportFailure: () => void;
  onBack?: () => void;
  photoUri?: string;
};

export function DshCaptainPoDSubmissionScreen({
  state = 'ready',
  orderId = 'ORD-9021',
  onCapturePhoto,
  onConfirm,
  onReportFailure,
  onBack,
  photoUri,
}: DshCaptainPoDSubmissionScreenProps) {
  const { theme } = useTheme();
  const podFlowPolicy = getDshCaptainFlowPolicy('captain-proof-of-delivery');
  const podFlowSummary = getDshFlowPolicySummary('captain-proof-of-delivery');
  const [proofGuideVisible, setProofGuideVisible] = React.useState(false);
  const [proofPreviewVisible, setProofPreviewVisible] = React.useState(false);

  if (state === 'success') {
    return (
      <Surface style={styles.root}>
        <StateView
          kind="success"
          title="تم رفع الإثبات بنجاح"
          description="تم تسجيل إثبات التسليم للطلب بنجاح. يمكنك الآن الانتقال للمهمة التالية."
          actionLabel="العودة لصندوق الطلبات"
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
          title="فشل إثبات التسليم"
          description="الصورة المرفوعة غير واضحة أو لا تستوفي المعايير المطلوبة. يرجى إعادة المحاولة."
          actionLabel="إعادة المحاولة"
          onActionPress={onCapturePhoto}
        />
      </Surface>
    );
  }

  // ML-031: retry-required — ops explicitly requires new proof capture
  if (state === 'retry-required') {
    return (
      <Surface style={styles.root}>
        <StateView
          stateId="blocked"
          title="مطلوب إعادة التقاط الإثبات"
          description="رفضت العمليات الإثبات المرفوع. يُرجى التقاط صورة جديدة واضحة وإعادة الإرسال."
          actionLabel="التقاط صورة جديدة"
          onActionPress={onCapturePhoto}
        />
      </Surface>
    );
  }

  return (
    <DshOperationScreen
      title="إثبات التسليم (PoD)"
      subtitle="يجب التقاط صورة واضحة للطلب عند باب العميل أو مع المستلم."
      onBack={onBack}
      content={
        <Box gap={3}>
          <Surface tone="brand" gap={2}>
            <Box layoutDirection="row" justify="space-between" align="center">
              <Badge label="إثبات مطلوب" tone="warning" />
              <Text role="caption" tone="soft">#{orderId}</Text>
            </Box>
            <Text role="bodySm" tone="muted">
              هذا الإثبات ضروري لإغلاق الطلب وضمان حقوق الكابتن والعميل.
            </Text>
            <Surface tone="inset" padding={3} radiusToken="lg" gap={2} style={{ borderWidth: 1, borderColor: theme.line }}>
              <Box layoutDirection="row" align="center" justify="space-between" gap={2} style={{ flexDirection: 'row-reverse' }}>
                <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Text role="bodyStrong" style={{ textAlign: 'right' }}>سياسة الإثبات من السجل المركزي</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    {podFlowSummary?.nextPolicyActionPreview ?? 'الإثبات أو معاينته لا يظهران إلا عند فتحهما من داخل المهمة.'}
                  </Text>
                </Box>
                <Badge label={resolvePodPolicyLabel(podFlowPolicy)} tone="brand" />
              </Box>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {`المراجعة التشغيلية النهائية يملكها ${podFlowSummary?.escalationOwner ?? 'control-panel'}.`}
              </Text>
            </Surface>
          </Surface>

          <Surface tone="raised" padding={0} overflow="hidden">
            <Pressable onPress={onCapturePhoto} style={styles.photoContainer}>
              {photoUri && proofPreviewVisible ? (
                <View style={styles.previewWrapper}>
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                  <View style={styles.changeOverlay}>
                    <Icon name="camera-outline" size={24} color={colorPalette.white} />
                    <Text role="bodySm" style={{ color: colorPalette.white }}>تغيير الصورة</Text>
                  </View>
                </View>
              ) : photoUri ? (
                <View style={styles.placeholderWrapper}>
                  <Icon name="image-outline" size={40} tone="brand" />
                  <Text role="titleMd" style={styles.placeholderText}>تم حفظ لقطة الإثبات</Text>
                  <Text role="caption" tone="muted">افتح المعاينة عند الحاجة فقط ثم ثبّت الإرسال.</Text>
                </View>
              ) : (
                <View style={styles.placeholderWrapper}>
                  <Icon name="camera" size={48} tone="brand" />
                  <Text role="titleMd" style={styles.placeholderText}>اضغط لالتقاط صورة</Text>
                  <Text role="caption" tone="muted">صورة واضحة للطلب في موقع التسليم</Text>
                </View>
              )}
            </Pressable>
          </Surface>

          {photoUri ? (
            <Button
              label={proofPreviewVisible ? 'إخفاء معاينة الإثبات' : 'عرض معاينة الإثبات'}
              tone={proofPreviewVisible ? 'secondary' : 'ghost'}
              fullWidth={false}
              size="sm"
              onPress={() => setProofPreviewVisible((current) => !current)}
            />
          ) : null}

          <Surface tone="inset" gap={2}>
            <SectionHeader title="شروط الإثبات الصحيح" subtitle="تأكد من النقاط التالية لتجنب رفض الإثبات." />
            <Button
              label={proofGuideVisible ? 'إخفاء الشروط' : 'فتح الشروط'}
              tone={proofGuideVisible ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth={false}
              onPress={() => setProofGuideVisible((current) => !current)}
            />
            {proofGuideVisible ? (
              <Box gap={1}>
                <Text role="caption" tone="muted">• ظهور الطلب بشكل كامل وواضح.</Text>
                <Text role="caption" tone="muted">• ظهور علامة واضحة للموقع (رقم الشقة أو الباب) إن أمكن.</Text>
                <Text role="caption" tone="muted">• تجنب تصوير وجوه الأشخاص حفاظاً على الخصوصية.</Text>
              </Box>
            ) : (
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                افتح هذا الجزء فقط عند مراجعة معايير الإثبات قبل الإرسال.
              </Text>
            )}
          </Surface>

          <Box paddingVertical={spacing[2]}>
            <Button
              label="لا يمكنني التقاط صورة"
              tone="secondary"
              onPress={onReportFailure}
              style={{ borderColor: colorPalette.line }}
            />
          </Box>
        </Box>
      }
      primaryActionLabel="تأكيد وإرسال الإثبات"
      onPrimaryAction={onConfirm}
      primaryActionDisabled={!photoUri || state === 'loading'}
      primaryActionLoading={state === 'loading'}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  photoContainer: {
    height: 240,
    backgroundColor: colorPalette.lightSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  placeholderText: {
    color: colorPalette.deepBlue,
  },
  previewWrapper: {
    width: '100%',
    height: '100%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: withAlpha(colorPalette.black, 0.5),
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
