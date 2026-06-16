// dsh/frontend/app-field/screens/DshFieldStoreOnboardingSteps.tsx
// Subcomponents representing each step of the field store onboarding process.
// No Tamagui. No direct UI-kit component customization outside standard exports.

import React from 'react';
import { ActivityIndicator, Image, Platform, Pressable, View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Divider,
  Icon,
  SectionHeader,
  SelectField,
  StateView,
  Text,
  TextField,
  useTheme,
  spacing,
  radius,
} from '@bthwani/ui-kit';
import type {
  FieldOnboardingDraft,
  FieldOnboardingSectionId,
  FieldStoreFile,
  FieldDocumentStatus,
} from '../dsh-field.routes';
import {
  PARTNER_STORE_TYPE_OPTIONS,
  PARTNER_MAIN_CATEGORY_OPTIONS,
  PARTNER_SUB_CATEGORY_OPTIONS,
  getOptionsWithFallback,
  type PartnerDocumentKind,
} from '../../shared';

// ─── Step 1: Basics ──────────────────────────────────────────────────────────

type StepProps = {
  draft: FieldOnboardingDraft;
  readOnly: boolean;
  errors: any;
  changeDraftField: (section: keyof FieldOnboardingDraft, key: string, value: any) => void;
};

export function OnboardingBasicsStep({ draft, readOnly, errors, changeDraftField }: StepProps) {
  return (
    <Box gap={4}>
      <SectionHeader
        title="البيانات الأساسية للمتجر"
      />

      <TextField
        label="اسم المتجر"
        value={draft.basics.storeName}
        editable={!readOnly}
        error={errors.storeName}
        onChangeText={(value) => changeDraftField('basics', 'storeName', value)}
        placeholder="مثال: أسواق العليا الطازجة"
      />

      <TextField
        label="اسم المالك الثنائي/الثلاثي"
        value={draft.basics.ownerName}
        editable={!readOnly}
        error={errors.ownerName}
        onChangeText={(value) => changeDraftField('basics', 'ownerName', value)}
        placeholder="الاسم مطابق للهوية أو السجل التجاري"
      />

      <TextField
        label="رقم جوال المالك"
        value={draft.basics.ownerPhone}
        editable={!readOnly}
        keyboardType="phone-pad"
        error={errors.ownerPhone}
        onChangeText={(value) => changeDraftField('basics', 'ownerPhone', value)}
        placeholder="مثال: 777123456 أو 0551234567"
        hint="يستخدم لإرسال كود التفعيل والاتفاق النهائي"
      />
    </Box>
  );
}

// ─── Step 2: Classification ──────────────────────────────────────────────────

export function OnboardingClassificationStep({ draft, readOnly, changeDraftField }: Omit<StepProps, 'errors'>) {
  return (
    <Box gap={4}>
      <SectionHeader
        title="النوع والتصنيف التشغيلي"
      />

      <SelectField
        label="نوع المتجر"
        value={draft.classification.storeType}
        disabled={readOnly}
        options={getOptionsWithFallback(PARTNER_STORE_TYPE_OPTIONS, draft.classification.storeType)}
        placeholder="اختر نوع المنفذ الميداني"
        onValueChange={(value) => changeDraftField('classification', 'storeType', value)}
      />

      <SelectField
        label="التصنيف الرئيسي"
        value={draft.classification.mainCategory}
        disabled={readOnly}
        options={getOptionsWithFallback(PARTNER_MAIN_CATEGORY_OPTIONS, draft.classification.mainCategory)}
        placeholder="اختر الفئة الرئيسية في بثواني"
        onValueChange={(value) => changeDraftField('classification', 'mainCategory', value)}
      />

      <SelectField
        label="التصنيف الفرعي للمتجر"
        value={draft.classification.subCategory}
        disabled={readOnly}
        options={getOptionsWithFallback(PARTNER_SUB_CATEGORY_OPTIONS, draft.classification.subCategory)}
        placeholder="اختر التصنيف الأكثر دقة للفرع"
        onValueChange={(value) => changeDraftField('classification', 'subCategory', value)}
      />
    </Box>
  );
}

// ─── Step 3: Location ────────────────────────────────────────────────────────

export function OnboardingLocationStep({ draft, readOnly, errors, changeDraftField }: StepProps) {
  return (
    <Box gap={4}>
      <SectionHeader
        title="الموقع الجغرافي ونطاق التغطية"
      />

      <TextField
        label="المدينة"
        value={draft.location.city}
        editable={!readOnly}
        error={errors.city}
        onChangeText={(value) => changeDraftField('location', 'city', value)}
        placeholder="مثال: الرياض"
      />

      <TextField
        label="العنوان المختصر ووصف الشارع"
        value={draft.location.addressLine}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('location', 'addressLine', value)}
        placeholder="مثال: طريق الملك فهد، بجانب البنك الأهلي"
      />

      <TextField
        label="ملخص التغطية الجغرافية"
        value={draft.location.coverageSummary}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('location', 'coverageSummary', value)}
        placeholder="وصف إضافي لحدود التوصيل المتفق عليها"
      />
    </Box>
  );
}

// ─── Step 4: Photos ──────────────────────────────────────────────────────────

type PhotosStepProps = {
  draft: FieldOnboardingDraft;
  readOnly: boolean;
  errors: any;
  cameraLoading: Record<string, boolean>;
  isNativePickerAvailable: boolean;
  handlePickFile: (photoKey: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef') => void;
};

export function OnboardingPhotosStep({
  draft,
  readOnly,
  errors,
  cameraLoading,
  isNativePickerAvailable,
  handlePickFile,
}: PhotosStepProps) {
  const { theme } = useTheme();

  const renderPhotoField = (photoKey: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef', label: string) => {
    const value = draft.photos[photoKey];
    const photoErr = photoKey === 'storefrontPhotoRef' ? errors.storefrontPhotoRef : undefined;
    const isCapturing = cameraLoading[photoKey];
    const hasRealImage = value && (
      value.startsWith('http') ||
      value.startsWith('blob:') ||
      value.startsWith('data:') ||
      value.startsWith('file:') ||
      value.startsWith('ph:')
    );

    return (
      <View key={photoKey} style={{ gap: spacing[1], marginVertical: 6 }}>
        <Pressable
          onPress={readOnly ? undefined : () => handlePickFile(photoKey)}
          style={{
            borderWidth: 1.5,
            borderStyle: hasRealImage ? 'solid' : 'dashed',
            borderColor: photoErr ? theme.danger : hasRealImage ? theme.success : theme.line,
            borderRadius: radius.md,
            backgroundColor: theme.surface,
            padding: spacing[3],
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 80,
            overflow: 'hidden',
          }}
        >
          {/* Right: Image Preview / Icon */}
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', flex: 1, gap: spacing[3] }}>
            {isCapturing ? (
              <View style={{ width: 56, height: 56, borderRadius: radius.xs, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.line }}>
                <ActivityIndicator size="small" color={theme.brand} />
              </View>
            ) : hasRealImage ? (
              <Image
                source={{ uri: value }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.xs,
                  backgroundColor: theme.line + '20',
                  borderWidth: 1,
                  borderColor: theme.line,
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: 56, height: 56, borderRadius: radius.xs, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.line }}>
                <Icon name="image-outline" size={24} tone={photoErr ? 'danger' : 'brand'} />
              </View>
            )}

            {/* Center: Info text */}
            <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text role="bodyStrong" weight="black" style={{ color: theme.text, fontSize: 14 }}>
                {label}
              </Text>
              {isCapturing ? (
                <Text role="caption" tone="brand">جاري رفع الملف...</Text>
              ) : hasRealImage ? (
                <Text role="caption" tone="success">جاهز للتدقيق ✓</Text>
              ) : (
                <Text role="caption" tone={value ? 'brand' : 'muted'} numberOfLines={1} style={{ maxWidth: 200, textAlign: 'right' }}>
                  {value ? value : 'اضغط للرفع أو التقاط صورة'}
                </Text>
              )}
            </Box>
          </View>

          {/* Left: Action Icon / Button */}
          {!readOnly && (
            <View style={{ paddingStart: spacing[2] }}>
              <Box
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.xs2,
                  backgroundColor: theme.surfaceSecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.line,
                }}
              >
                <Icon name={hasRealImage ? 'create-outline' : 'camera-outline'} size={18} tone="brand" />
              </Box>
            </View>
          )}
        </Pressable>
        {photoErr ? (
          <Text role="caption" tone="danger" style={{ textAlign: 'right', paddingHorizontal: spacing[1] }}>
            {photoErr}
          </Text>
        ) : (Platform.OS !== 'web' && !isNativePickerAvailable) ? (
          <Text role="caption" tone="warning" style={{ textAlign: 'right', paddingHorizontal: spacing[1], fontSize: 10 }}>
            * يرجى استخدام المتصفح (Web) لرفع صور حقيقية في بيئة المحاكاة الحالية.
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <Box gap={4}>
      <SectionHeader
        title="صور الفرع والتجهيزات"
      />

      {renderPhotoField('storefrontPhotoRef', 'صورة الواجهة الخارجية للمحل')}
      {renderPhotoField('interiorPhotoRef', 'صورة المتجر من الداخل والرفوف')}
      {renderPhotoField('signagePhotoRef', 'صورة اللوحة التجارية المطابقة للترخيص')}
    </Box>
  );
}

// ─── Step 5: Documents ───────────────────────────────────────────────────────

type DocumentsStepProps = {
  store: FieldStoreFile;
  documentItems: readonly DocumentItem[];
  onUploadDocument?: (storeId: string, kind: PartnerDocumentKind) => void;
  loadingMap?: Record<string, boolean>;
};

export function OnboardingDocumentsStep({ store, documentItems, onUploadDocument, loadingMap }: DocumentsStepProps) {
  return (
    <Box gap={3}>
      <SectionHeader
        title="المستندات والتراخيص الرسمية"
      />
      <DocumentVerificationSection
        state="ready"
        documents={documentItems}
        onUploadDocument={(kind) => onUploadDocument?.(store.id, kind)}
        loadingMap={loadingMap}
      />
    </Box>
  );
}

// ─── Step 6: Products ────────────────────────────────────────────────────────

export function OnboardingProductsStep({ draft, readOnly, errors, changeDraftField }: StepProps) {
  return (
    <Box gap={4}>
      <SectionHeader
        title="الكتالوج والمنتج الافتتاحي"
      />

      <TextField
        label="اسم المنتج الافتتاحي المميز"
        value={draft.products.featuredProductName}
        editable={!readOnly}
        error={errors.featuredProductName}
        onChangeText={(value) => changeDraftField('products', 'featuredProductName', value)}
        placeholder="مثال: برجر دجاج كلاسيك"
      />

      <TextField
        label="سعر المنتج الافتتاحي"
        value={draft.products.featuredProductPrice}
        editable={!readOnly}
        keyboardType="decimal-pad"
        error={errors.featuredProductPrice}
        onChangeText={(value) => changeDraftField('products', 'featuredProductPrice', value)}
        placeholder="السعر بالعملة المحلية شامل الضريبة"
      />

      <TextField
        label="ملاحظات وتفاصيل الكتالوج المختصرة"
        value={draft.products.sampleCatalogNote}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('products', 'sampleCatalogNote', value)}
        placeholder="تفاصيل إضافية للكتالوج الأولي للمتجر"
      />
    </Box>
  );
}

// ─── Step 7: Offer ───────────────────────────────────────────────────────────

export function OnboardingOfferStep({ draft, readOnly, errors, changeDraftField }: StepProps) {
  return (
    <Box gap={4}>
      <SectionHeader
        title="عرض العقد وساعات العمل"
      />

      <TextField
        label="عرض العمولة المبدئي (%)"
        value={draft.offer.preliminaryOffer}
        editable={!readOnly}
        error={errors.preliminaryOffer}
        onChangeText={(value) => changeDraftField('offer', 'preliminaryOffer', value)}
        placeholder="مثال: 12% من قيمة الطلب"
      />

      <TextField
        label="ساعات العمل اليومية"
        value={draft.offer.operatingHours}
        editable={!readOnly}
        error={errors.operatingHours}
        onChangeText={(value) => changeDraftField('offer', 'operatingHours', value)}
        placeholder="مثال: من 8:00 صباحًا إلى 11:30 مساءً"
      />

      <TextField
        label="وضعية وجاهزية التوصيل الأولي"
        value={draft.offer.deliveryReadiness}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('offer', 'deliveryReadiness', value)}
        placeholder="مثال: جاهز بتغطية سريعة كباتن بثواني"
      />

      <TextField
        label="ملاحظات المحاسبة والمالية"
        value={draft.offer.financeNote}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('offer', 'financeNote', value)}
        placeholder="ملاحظات مرجعية للحسابات والعمولات"
      />
    </Box>
  );
}

// ─── Step 8: Review ──────────────────────────────────────────────────────────

type ReviewStepProps = {
  draft: FieldOnboardingDraft;
  readOnly: boolean;
  changeDraftField: (section: keyof FieldOnboardingDraft, key: string, value: any) => void;
  missingItems: readonly string[];
};

export function OnboardingReviewStep({ draft, readOnly, changeDraftField, missingItems }: ReviewStepProps) {
  const { theme } = useTheme();

  return (
    <Box gap={4}>
      <SectionHeader
        title="مراجعة الملف الميداني وإرساله"
      />

      <TextField
        label="ملاحظات الميداني الشخصية"
        value={draft.review.fieldNotes}
        editable={!readOnly}
        onChangeText={(value) => changeDraftField('review', 'fieldNotes', value)}
        placeholder="دون أي عقبات واجهتها أثناء الزيارة الميدانية للفرع"
      />

      <TextField
        label="ملاحظة مراجعة الشركاء السابقة"
        value={draft.review.partnerReviewNote}
        editable={false}
        placeholder="لا توجد ملاحظات مراجعة حالية"
      />

      <Divider style={{ marginVertical: 8 }} />

      <Box gap={2}>
        <Text role="bodyStrong" style={{ textAlign: 'right' }}>تتبع الأساسيات والنواقص</Text>
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
          {missingItems.length
            ? 'العناصر التالية مفقودة أو غير مستوفاة وتمنع تفعيل خيار إرسال الملف:'
            : 'تم تعبئة كافة الحقول الأساسية المطلوبة. الملف جاهز للإرسال الفوري للتدقيق.'}
        </Text>
        <Box gap={2} style={{ marginTop: spacing[2] }}>
          {missingItems.length ? (
            missingItems.map((item) => (
              <View
                key={item}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: spacing[2],
                  paddingVertical: 4,
                }}
              >
                <Icon name="close-circle" size={16} tone="danger" />
                <Text role="bodySm" tone="danger" style={{ textAlign: 'right', flex: 1 }}>
                  {item}
                </Text>
              </View>
            ))
          ) : (
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: spacing[2],
                paddingVertical: 4,
              }}
            >
              <Icon name="checkmark-circle" size={16} tone="success" />
              <Text role="bodySm" tone="success" style={{ textAlign: 'right', flex: 1 }}>
                جاهز تمامًا للإرسال
              </Text>
            </View>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Sub-Component: DocumentVerificationSection ──────────────────────────────

export type DocumentItem = {
  id: PartnerDocumentKind;
  label: string;
  required: boolean;
  status: FieldDocumentStatus;
  referenceLabel?: string;
};

const defaultDocuments: readonly DocumentItem[] = [
  { id: 'commercial_registration', label: 'السجل التجاري', required: true, status: 'missing' },
  { id: 'identity_proof', label: 'إثبات هوية المالك', required: true, status: 'missing' },
];

export type DocumentVerificationSectionProps = {
  state?: 'ready' | 'loading' | 'complete' | 'error';
  documents?: readonly DocumentItem[];
  onUploadDocument?: (kind: PartnerDocumentKind) => void;
  onConfirm?: () => void;
  loadingMap?: Record<string, boolean>;
};

export function DocumentVerificationSection({
  state = 'ready',
  documents = defaultDocuments,
  onUploadDocument,
  onConfirm,
  loadingMap,
}: DocumentVerificationSectionProps) {
  const { theme } = useTheme();

  if (state === 'loading') {
    return <StateView stateId="loading" title="جاري التحقق من المستندات..." description="" />;
  }

  if (state === 'complete') {
    return (
      <StateView
        stateId="success"
        title="تم التحقق من جميع المستندات"
        description="يمكن المتابعة لإكمال تسجيل المتجر."
        actionLabel="التالي"
        onActionPress={onConfirm}
      />
    );
  }

  const allRequired = documents
    .filter((d) => d.required)
    .every((d) => d.status === 'uploaded' || d.status === 'approved');

  const resolveStatusTone = (status: FieldDocumentStatus) => {
    if (status === 'approved') return 'success' as const;
    if (status === 'uploaded') return 'brand' as const;
    if (status === 'needs_reupload') return 'warning' as const;
    if (status === 'rejected') return 'danger' as const;
    return 'muted' as const;
  };

  const resolveStatusLabel = (status: FieldDocumentStatus) => {
    if (status === 'approved') return 'معتمد';
    if (status === 'uploaded') return 'مرفوع';
    if (status === 'needs_reupload') return 'يحتاج إعادة رفع';
    if (status === 'rejected') return 'مرفوض';
    return 'مفقود';
  };

  return (
    <Box gap={4}>
      <Text role="titleSm" style={{ textAlign: 'right' }}>التحقق من المستندات</Text>
      <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>حالة المستندات المرفقة للمراجعة والتدقيق.</Text>
      <Box gap={2}>
        {documents.map((doc) => {
          const isUploading = loadingMap?.[doc.id];
          const hasFile = doc.status !== 'missing';

          return (
            <Pressable
              key={doc.id}
              disabled={isUploading || !onUploadDocument}
              onPress={() => onUploadDocument?.(doc.id)}
              style={({ pressed }) => [
                {
                  borderWidth: 1.5,
                  borderStyle: hasFile ? 'solid' : 'dashed',
                  borderColor: doc.status === 'rejected' ? theme.danger : hasFile ? theme.success : theme.line,
                  borderRadius: radius.md,
                  backgroundColor: theme.surface,
                  padding: spacing[3],
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 80,
                  overflow: 'hidden',
                  opacity: pressed ? 0.92 : 1,
                }
              ]}
            >
              {/* Right: Document Icon / Loading indicator */}
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', flex: 1, gap: spacing[3] }}>
                {isUploading ? (
                  <View style={{ width: 56, height: 56, borderRadius: radius.xs, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.line }}>
                    <ActivityIndicator size="small" color={theme.brand} />
                  </View>
                ) : (
                  <View style={{ width: 56, height: 56, borderRadius: radius.xs, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.line }}>
                    <Icon
                      name={hasFile ? 'document-text-outline' : 'document-outline'}
                      size={24}
                      tone={doc.status === 'rejected' ? 'danger' : hasFile ? 'success' : 'brand'}
                    />
                  </View>
                )}

                {/* Center: Info text */}
                <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text role="bodyStrong" weight="black" style={{ color: theme.text, fontSize: 14 }}>
                    {doc.label} {doc.required && <Text role="bodySm" tone="danger">*</Text>}
                  </Text>
                  {isUploading ? (
                    <Text role="caption" tone="brand">جاري رفع المستند...</Text>
                  ) : hasFile ? (
                    <Text role="caption" tone="success">تم الرفع ({resolveStatusLabel(doc.status)}) ✓</Text>
                  ) : (
                    <Text role="caption" tone="muted">اضغط للرفع أو التقاط صورة</Text>
                  )}
                  {doc.referenceLabel && !isUploading && (
                    <Text role="caption" tone="muted" style={{ fontSize: 10, textAlign: 'right', marginTop: 2 }} numberOfLines={1}>
                      {doc.referenceLabel}
                    </Text>
                  )}
                </Box>
              </View>

              {/* Left: Action Icon / Button */}
              {onUploadDocument && !isUploading && (
                <View style={{ paddingStart: spacing[2] }}>
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: radius.xs2,
                      backgroundColor: theme.surfaceSecondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.line,
                    }}
                  >
                    <Icon name={hasFile ? 'create-outline' : 'document-attach-outline'} size={18} tone="brand" />
                  </Box>
                </View>
              )}
            </Pressable>
          );
        })}
      </Box>
    </Box>
  );
}
