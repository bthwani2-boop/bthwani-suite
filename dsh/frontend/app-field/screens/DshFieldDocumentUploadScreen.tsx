import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
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
  useDirection,
  borders,
  radius,
  spacing,
} from '@bthwani/ui-kit';
import { getDshFlowPolicySummary } from '../../shared/policies/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared/control-panel/dsh-governance.map';
import { resolveFieldDocumentDraftMediaKey } from '../../shared/view-models/field';
import type { DshFieldDocumentKind } from '../../shared/api/dsh-field-document-client';

export type DshFieldDocumentUploadScreenProps = {
  storeId: string;
  onBack: () => void;
  onSubmit: (documentKind: DshFieldDocumentKind, documentRef: string) => Promise<void>;
  state?: 'ready' | 'loading' | 'success' | 'error' | 'offline' | 'disabled';
  onRetry?: () => void;
};

const documentKinds: { id: DshFieldDocumentKind; label: string; description: string; icon: string }[] = [
  {
    id: 'commercial_registration',
    label: 'السجل التجاري',
    description: 'نسخة سارية وصالحة من السجل التجاري الرسمي.',
    icon: 'assignment',
  },
  {
    id: 'tax_certificate',
    label: 'الشهادة الضريبية',
    description: 'الرقم الضريبي الموحد للمتجر.',
    icon: 'text-snippet',
  },
  {
    id: 'identity_proof',
    label: 'إثبات هوية المالك',
    description: 'بطاقة الهوية الوطنية أو جواز السفر للمالك.',
    icon: 'badge',
  },
  {
    id: 'storefront_photo',
    label: 'صورة واجهة المتجر',
    description: 'صورة خارجية واضحة تُظهر اللوحة والمدخل الرئيسي.',
    icon: 'photo-camera',
  },
  {
    id: 'interior_photo',
    label: 'صورة المتجر من الداخل',
    description: 'صورة توضح الأقسام الرئيسية وتنسيق المنتجات.',
    icon: 'image',
  },
];

export function DshFieldDocumentUploadScreen({
  storeId,
  onBack,
  onSubmit,
  state = 'ready',
  onRetry,
}: DshFieldDocumentUploadScreenProps) {
  const { theme } = useTheme();
  const { direction } = useDirection();
  const isRtl = direction === 'rtl';

  const [selectedKind, setSelectedKind] = React.useState<DshFieldDocumentKind>('commercial_registration');
  const [documentRef, setDocumentRef] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successDocId, setSuccessDocId] = React.useState<string | null>(null);

  const documentFlowSummary = getDshFlowPolicySummary('field-proof-required');

  React.useEffect(() => {
    setDocumentRef(resolveFieldDocumentDraftMediaKey(selectedKind));
  }, [selectedKind]);

  const handleFormSubmit = async () => {
    if (!documentRef.trim()) {
      setErrorMessage('يرجى تحديد أو إدخال رمز الوسائط (media key).');
      return;
    }
    setErrorMessage(null);
    try {
      await onSubmit(selectedKind, documentRef.trim());
      setSuccessDocId(documentRef);
    } catch (err: any) {
      if (err && err.kind === 'offline') {
        setErrorMessage('تعذر الاتصال بالخادم. أنت غير متصل بالإنترنت حاليًا.');
      } else {
        setErrorMessage(err?.body || 'فشل إرسال المستند، يرجى المحاولة لاحقًا.');
      }
    }
  };

  if (state === 'loading') {
    return <StateView stateId="loading" title="جاري رفع المستند..." description="نحن بصدد تسجيل المستند المرفق وتحديث الجاهزية." />;
  }

  if (state === 'success' || successDocId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <TopBar variant="surface" title="تم الرفع" />
        <StateView
          stateId="success"
          title="تم إرسال المستند بنجاح"
          description={`تم تسجيل مستند الإثبات بالرمز ${successDocId} بنجاح وهو الآن بانتظار المراجعة والتدقيق.`}
          actionLabel="العودة للمتجر"
          onActionPress={onBack}
        />
      </View>
    );
  }

  if (state === 'offline') {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <TopBar variant="surface" title="وضع عدم الاتصال" />
        <StateView
          stateId="offline"
          title="تعذر الرفع"
          description="لا يمكن حفظ مستندات الإثبات محليًا في هذا الوضع. أعد المحاولة عند استقرار الشبكة."
          actionLabel="تحديث المحاولة"
          onActionPress={onRetry || onBack}
        />
      </View>
    );
  }

  const isSubmitDisabled = state === 'disabled' || !documentRef.trim();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TopBar
        variant="surface"
        title="إثبات الوثائق والصور"
        subtitle={`معرف المتجر: ${storeId}`}
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={styles.scrollContent}>
        <Box padding={4} gap={4}>
          {/* Policy context */}
          <Box gap={2} paddingY={2}>
            <SectionHeader
              title="سياسة المستندات والجاهزية"
              subtitle="الوثائق والصور المرفوعة تظل on-demand للتأكد من حماية خصوصية الشركاء."
            />
            <KeyValueList
              dense
              items={[
                { label: 'المالك والمصدر', value: documentFlowSummary?.ownerSurface ?? 'app-field', tone: 'brand' },
                { label: 'سياسة العرض', value: documentFlowSummary?.onDemandPolicy ?? 'evidence-on-open' },
                { label: 'المراجع والاعتماد', value: resolveDshControlPanelSectionLabel('partners') },
              ]}
            />
          </Box>

          <Divider />

          {/* Selector */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="نوع المستند المطلوب"
              subtitle="اختر نوع المرفق أو الصورة لإضافتها كإثبات."
            />
            <Box gap={2}>
              {documentKinds.map((kind) => {
                const isSelected = selectedKind === kind.id;
                return (
                  <Pressable
                    key={kind.id}
                    onPress={() => setSelectedKind(kind.id)}
                    style={[
                      styles.kindRow,
                      {
                        borderColor: isSelected ? theme.brand : theme.line,
                        backgroundColor: isSelected ? theme.surfaceInset : 'transparent',
                        flexDirection: isRtl ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <Icon name={kind.icon} size={24} tone={isSelected ? 'brand' : 'muted'} />
                    <Box gap={0} style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start', marginHorizontal: 12 }}>
                      <Text role="bodyStrong" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {kind.label}
                      </Text>
                      <Text role="caption" tone="muted" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {kind.description}
                      </Text>
                    </Box>
                    <View style={[styles.radioOuter, { borderColor: isSelected ? theme.brand : theme.line }]}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.brand }]} />}
                    </View>
                  </Pressable>
                );
              })}
            </Box>
          </Box>

          <Divider />

          {/* Media Key Field */}
          <Box gap={3} paddingY={2}>
            <SectionHeader
              title="تفاصيل الملف المرفق"
              subtitle="مستندات الإثبات مسجلة بواسطة مفاتيح الوسائط الفريدة."
            />
            <TextField
              label="رمز إثبات الوسائط (Media Key)"
              value={documentRef}
              onChangeText={setDocumentRef}
              editable={state !== 'disabled'}
              error={errorMessage ?? undefined}
              hint="سيتم إنشاء هذا الرمز تلقائيًا لغرض المحاكاة."
            />
          </Box>

          <Divider />

          {/* Submit */}
          <Box gap={3} paddingY={2}>
            <KeyValueList
              dense
              items={[
                { label: 'النوع المحدد', value: documentKinds.find((d) => d.id === selectedKind)?.label ?? '' },
                { label: 'رمز الملف المعين', value: documentRef || '—', tone: 'brand' },
                { label: 'حالة الاعتماد الأولية', value: 'قيد الانتظار (Pending)' },
              ]}
            />
            <Button
              label="إرسال وثيقة الإثبات"
              onPress={handleFormSubmit}
              disabled={isSubmitDisabled}
            />
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  kindRow: {
    padding: spacing[3],
    borderRadius: radius.xs2,
    borderWidth: borders.hairline,
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: borders.strong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default DshFieldDocumentUploadScreen;
