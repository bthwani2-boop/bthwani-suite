import React from 'react';
import { ScrollView, View, Pressable, Platform, Image, ActivityIndicator } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Icon,
  KeyValueList,
  MobileScrollView,
  SectionHeader,
  SelectField,
  StateView,
  StickyActionBar,
  Text,
  TextField,
  TopBar,
  useTheme,
  colorPalette,
  borders,
  radius,
  spacing,
} from '@bthwani/ui-kit';
import {
  fieldSectionLabels,
  fieldSectionOrder,
  type FieldOnboardingDraft,
  type FieldOnboardingSectionId,
  type FieldStoreFile,
  type FieldDocumentStatus,
} from '../dsh-field.types';
import {
  isFieldStoreReadOnly,
  resolveFieldStoreLifecycleLabel,
  resolveFieldStoreStatusLabel,
  resolveFieldStoreStatusTone,
  touchFieldStoreDraft,
} from '../field.store-lifecycle';
import {
  // Partner rehome imports
  validatePartnerOnboarding,
  PARTNER_STORE_TYPE_OPTIONS,
  PARTNER_MAIN_CATEGORY_OPTIONS,
  PARTNER_SUB_CATEGORY_OPTIONS,
  getOptionsWithFallback,
  resolvePartnerSectionSummaryLabel,
  getPartnerRequiredMissingItems,
  resolvePartnerCompletionPercent,
  resolvePartnerSectionSummaries,
  resolvePartnerDocumentItems,
  type PartnerDocumentKind,
  getDshMediaRuntimeClient,
} from '../../shared';
import {
  simulateCameraCapture,
} from '../utils/onboarding-simulation';
import { DocumentVerificationSection } from '../sections/DocumentVerificationSection';
import { getOperationsSupportFlowsForSurface } from '../../shared';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/runtime/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared/control-panel/dsh-governance.map';

const FIELD_ONBOARDING_OPERATION_FLOWS = getOperationsSupportFlowsForSurface('app-field');
const FIELD_PRODUCT_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'catalog-barcode-issue' || item.flowId === 'store-nomination-intake',
);
const FIELD_REVIEW_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'field-proof-required' || item.flowId === 'branch-readiness-escalation',
);

export type DshFieldStoreOnboardingScreenState = 'onboarding' | 'activated' | 'exit';

type DshFieldStoreOnboardingScreenProps = {
  store: FieldStoreFile;
  screenState?: DshFieldStoreOnboardingScreenState;
  onBack: () => void;
  onStoreChange: (updater: (store: FieldStoreFile) => FieldStoreFile) => void;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
  onActivationComplete?: () => void;
  onEscalate?: () => void;
  onUploadDocument?: (storeId: string, kind: PartnerDocumentKind) => void;
};

function updateDraftSection<T extends keyof FieldOnboardingDraft>(draft: FieldOnboardingDraft, key: T, value: FieldOnboardingDraft[T]) {
  return {
    ...draft,
    [key]: value,
  };
}

export function DshFieldStoreOnboardingScreen({
  store,
  screenState = 'onboarding',
  onBack,
  onStoreChange,
  onSaveDraft,
  onSubmitReview,
  onActivationComplete,
  onEscalate,
  onUploadDocument,
}: DshFieldStoreOnboardingScreenProps) {
  const { theme } = useTheme();
  const [policyExpanded, setPolicyExpanded] = React.useState(false);
  const [cameraLoading, setCameraLoading] = React.useState<Record<string, boolean>>({});

  const isNativePickerAvailable = React.useMemo(() => {
    if (Platform.OS === 'web') return false;
    try {
      const expoModules = (global as any).ExpoModules || (globalThis as any).ExpoModules;
      return !!(expoModules && expoModules.ExponentImagePicker);
    } catch {
      return false;
    }
  }, []);

  if (screenState === 'activated') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تم تفعيل المتجر" />
        <StateView
          stateId="success"
          title="تم تفعيل المتجر بنجاح"
          description="اكتمل تسجيل المتجر وتمت الموافقة من قِبل قسم الشركاء (Partner Management). يمكن المتابعة للمتجر التالي."
          actionLabel="إنهاء"
          onActionPress={onActivationComplete ?? onBack}
        />
      </View>
    );
  }

  if (screenState === 'exit') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="الخروج" />
        <StateView
          stateId="empty"
          title="لم يكتمل التسجيل بعد"
          description="يمكنك العودة لاحقاً لإكمال الملف. تم حفظ المسودة."
          actionLabel="رجوع"
          onActionPress={onBack}
        />
      </View>
    );
  }

  const readOnly = isFieldStoreReadOnly(store);
  const draft = store.draft;
  const activeSectionId = draft.activeSectionId;
  const sections = React.useMemo(() => resolvePartnerSectionSummaries(draft), [draft]);
  const missingItems = React.useMemo(() => getPartnerRequiredMissingItems(draft), [draft]);
  const completionPercent = React.useMemo(() => resolvePartnerCompletionPercent(draft), [draft]);
  const documentItems = React.useMemo(() => resolvePartnerDocumentItems(draft), [draft]);

  const activeIndex = fieldSectionOrder.indexOf(activeSectionId);
  const isLastSection = activeIndex === fieldSectionOrder.length - 1;
  const canSubmit = missingItems.length === 0 && !readOnly;
  const onboardingFlowSummary = getDshFlowPolicySummary('field-store-onboarding');

  const patchStore = React.useCallback((updater: (current: FieldStoreFile) => FieldStoreFile) => {
    onStoreChange((current) => touchFieldStoreDraft(updater(current)));
  }, [onStoreChange]);

  const setActiveSection = React.useCallback((nextSectionId: FieldOnboardingSectionId) => {
    patchStore((current) => ({
      ...current,
      draft: {
        ...current.draft,
        activeSectionId: nextSectionId,
      },
    }));
  }, [patchStore]);

  const changeDraftField = React.useCallback(
    <T extends keyof FieldOnboardingDraft, K extends keyof FieldOnboardingDraft[T]>(
      sectionKey: T,
      fieldKey: K,
      value: FieldOnboardingDraft[T][K],
    ) => {
      patchStore((current) => ({
        ...current,
        draft: {
          ...current.draft,
          [sectionKey]: {
            ...(current.draft[sectionKey] as Record<string, unknown>),
            [fieldKey as string]: value,
          },
        },
      }));
    },
    [patchStore],
  );

  const goToNextSection = React.useCallback(() => {
    if (isLastSection) {
      if (canSubmit) {
        onSubmitReview();
      }
      return;
    }
    setActiveSection(fieldSectionOrder[activeIndex + 1]);
  }, [activeIndex, canSubmit, isLastSection, onSubmitReview, setActiveSection]);

  const goToPreviousSection = React.useCallback(() => {
    if (activeIndex <= 0) {
      onBack();
      return;
    }
    setActiveSection(fieldSectionOrder[activeIndex - 1]);
  }, [activeIndex, onBack, setActiveSection]);

  const errors = React.useMemo(() => validatePartnerOnboarding(draft), [draft]);


  const handleCameraCapture = (field: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef') => {
    setCameraLoading((prev) => ({ ...prev, [field]: true }));
    changeDraftField('photos', field, simulateCameraCapture(field));
    setCameraLoading((prev) => ({ ...prev, [field]: false }));
  };

  const resolveSectionSummary = (sectionId: FieldOnboardingSectionId): string => {
    return resolvePartnerSectionSummaryLabel(draft, sectionId);
  };

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

    const handlePickFile = async () => {
      if (Platform.OS !== 'web') {
        if (!isNativePickerAvailable) {
          console.warn('Native ExponentImagePicker module is not available in this build. Falling back to simulation.');
          handleCameraCapture(photoKey);
          return;
        }

        try {
          const ImagePicker = require('expo-image-picker');
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Media library permission was not granted');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            setCameraLoading((prev) => ({ ...prev, [photoKey]: true }));

            try {
              const client = getDshMediaRuntimeClient();
              if (client) {
                const response = await globalThis['fetch'](localUri);
                const blob = await response.blob();

                const intentResp = await client.createUploadIntent(
                  {
                    owner_type: 'store',
                    owner_id: store.id,
                    media_type: 'image',
                    purpose: 'inspection',
                    filename: localUri.split('/').pop() || 'photo.jpg',
                    mime_type: blob.type || 'image/jpeg',
                    file_size_bytes: blob.size,
                  },
                  {},
                );

                await client.putToPresignedUrl(intentResp.intent.upload_url, blob, blob.type);
                const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

                if (completedAsset && completedAsset.public_url) {
                  changeDraftField('photos', photoKey, completedAsset.public_url);
                  setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
                  return;
                }
              }
            } catch (err) {
              console.warn('Native upload failed, using local URI:', err);
            }

            changeDraftField('photos', photoKey, localUri);
            setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
          }
        } catch (e) {
          console.error('Failed to launch native expo-image-picker:', e);
          handleCameraCapture(photoKey);
        }
        return;
      }

      // Web: Hidden file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.position = 'absolute';
      input.style.opacity = '0';
      input.style.width = '0';
      input.style.height = '0';
      input.style.left = '0';
      input.style.top = '0';
      document.body.appendChild(input);

      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          setCameraLoading((prev) => ({ ...prev, [photoKey]: true }));
          try {
            const client = getDshMediaRuntimeClient();
            if (client) {
              const intentResp = await client.createUploadIntent(
                {
                  owner_type: 'store',
                  owner_id: store.id,
                  media_type: 'image',
                  purpose: 'inspection',
                  filename: file.name,
                  mime_type: file.type,
                  file_size_bytes: file.size,
                },
                {},
              );

              await client.putToPresignedUrl(intentResp.intent.upload_url, file, file.type);
              const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

              if (completedAsset && completedAsset.public_url) {
                changeDraftField('photos', photoKey, completedAsset.public_url);
                setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
                if (document.body.contains(input)) {
                  document.body.removeChild(input);
                }
                return;
              }
            }
          } catch (err) {
            console.warn('MinIO upload failed, falling back to local Blob URL:', err);
          }

          const localUrl = URL.createObjectURL(file);
          changeDraftField('photos', photoKey, localUrl);
          setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
        }
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      };

      const handleFocus = () => {
        window.removeEventListener('focus', handleFocus);
        setTimeout(() => {
          if (document.body.contains(input)) {
            document.body.removeChild(input);
          }
        }, 1000);
      };
      window.addEventListener('focus', handleFocus);

      input.click();
    };

    return (
      <View key={photoKey} style={{ gap: spacing[1], marginVertical: 6 }}>
        <Pressable
          onPress={readOnly ? undefined : handlePickFile}
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

  const renderSectionContent = () => {
    if (activeSectionId === 'basics') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="البيانات الأساسية للمتجر"
            subtitle="نلتقط بيانات المتجر والمالك بدقة لتأسيس الحساب الميداني الموحد."
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

    if (activeSectionId === 'classification') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="النوع والتصنيف التشغيلي"
            subtitle="نصنف المتجر لضمان ظهوره في القسم الصحيح للعملاء وجدولة السعاة."
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

    if (activeSectionId === 'location') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="الموقع الجغرافي ونطاق التغطية"
            subtitle="التقاط دقيق لإحداثيات GPS يضمن توزيعًا فعالًا لطلبات التوصيل الميدانية."
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

    if (activeSectionId === 'photos') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="صور الفرع والتجهيزات"
            subtitle="التقاط صور حية للمتجر يساعد الشركاء في التحقق وعملاء التطبيق في التعرف على واجهتك."
          />

          {renderPhotoField('storefrontPhotoRef', 'صورة الواجهة الخارجية للمحل')}
          {renderPhotoField('interiorPhotoRef', 'صورة المتجر من الداخل والرفوف')}
          {renderPhotoField('signagePhotoRef', 'صورة اللوحة التجارية المطابقة للترخيص')}
        </Box>
      );
    }

    if (activeSectionId === 'documents') {
      return (
        <Box gap={3}>
          <SectionHeader
            title="المستندات والتراخيص الرسمية"
            subtitle="الرجاء إرفاق المستندات الرسمية المطلوبة للتحقق من الحساب."
          />
          <DocumentVerificationSection
            state="ready"
            documents={documentItems}
            onUploadDocument={(kind) => onUploadDocument?.(store.id, kind)}
          />
        </Box>
      );
    }
    if (activeSectionId === 'products') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="الكتالوج والمنتج الافتتاحي"
            subtitle="نحتاج إلى منتج تجريبي واحد على الأقل لإعداد وبناء كتالوج المتجر وتفعيل الواجهة."
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

    if (activeSectionId === 'offer') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="عرض العقد وساعات العمل"
            subtitle="تفاصيل الاتفاق المبدئي، العمولة، وساعات التشغيل المتفق عليها للفرع."
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

    if (activeSectionId === 'review') {
      return (
        <Box gap={4}>
          <SectionHeader
            title="مراجعة الملف الميداني وإرساله"
            subtitle="حفظ الملف كمسودة متاح دائماً. إرسال الملف للمراجعة يظل معطلاً حتى استيفاء النواقص."
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
                  <Text key={item} role="bodySm" tone="danger" style={{ textAlign: 'right' }}>
                    • {item} (مطلوب)
                  </Text>
                ))
              ) : (
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
                  <Icon name="checkmark-circle" size={18} tone="success" />
                  <Text role="bodySm" tone="success" style={{ textAlign: 'right' }}>
                    كل المتطلبات الأساسية مستوفاة وجاهزة.
                  </Text>
                </View>
              )}
            </Box>
          </Box>

          {store.reviewFeedback ? (
            <>
              <Divider style={{ marginVertical: 8 }} />
              <Box gap={2} style={{ padding: spacing[3], backgroundColor: theme.dangerSurface, borderRadius: radius.xs2 }}>
                <Text role="bodyStrong" tone="danger" style={{ textAlign: 'right' }}>سبب رفض الملف من الإدارة</Text>
                <Text role="bodySm" tone="danger" style={{ textAlign: 'right', marginTop: spacing[1] }}>
                  {store.reviewFeedback}
                </Text>
              </Box>
            </>
          ) : null}
        </Box>
      );
    }

    return null;
  };

  const stickyNote = readOnly
    ? 'الملف في حالة للقراءة فقط الآن. بقي للميداني السجل والحالة والمالية فقط.'
    : missingItems.length
    ? `النواقص الحالية: ${
        missingItems.length > 3
          ? `${missingItems.slice(0, 3).join('، ')} (+${missingItems.length - 3} أخرى)`
          : missingItems.join('، ')
      }`
    : 'كل الأساسيات مكتملة. يمكنك الإرسال للمراجعة.';

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title={store.name}
        subtitle={`${resolveFieldStoreStatusLabel(store)} · ${resolveFieldStoreLifecycleLabel(store)}`}
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 148 }}>
        <Box padding={4} gap={4}>

          <Card padding={4} gap={3}>
            <Box gap={2} style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing[2] }}>
                <Badge label={resolveFieldStoreStatusLabel(store)} tone={resolveFieldStoreStatusTone(store)} />
                <Badge label={`اكتمال ${completionPercent}%`} tone="info" />
                <Badge label={draft.lastSavedLabel} tone="default" />
              </View>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginTop: spacing[1] }}>
                <Icon name="business-outline" size={20} tone="brand" />
                <Text role="titleMd" weight="black" style={{ textAlign: 'right' }}>
                  {store.name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
                <Icon name="pin-outline" size={14} tone="muted" />
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                  {store.location}
                </Text>
              </View>
              <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: spacing[1] }}>
                {`آخر تحديث للملف: ${store.lastUpdatedLabel} · موعد الزيارة التالي: ${store.nextVisitLabel}`}
              </Text>
            </Box>
          </Card>

          <Divider />

          {/* Section 2: Smart Linear Progress */}
          <Box gap={3} paddingY={1}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="titleSm" weight="black" style={{ textAlign: 'right' }}>
                التقدم الإجمالي لملف الانضمام
              </Text>
              <Text role="bodySm" tone="brand" weight="black">
                {`${completionPercent}% مكتمل`}
              </Text>
            </View>
            <View style={{ height: 8, width: '100%', backgroundColor: theme.line, borderRadius: radius.xxs, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${completionPercent}%`, backgroundColor: theme.brand, borderRadius: radius.xxs }} />
            </View>
          </Box>

          <Divider />

          {/* Section 3: Stepped Vertical Timeline Accordion */}
          <Box gap={2}>
            {sections.map((section, index) => {
              const isActive = activeSectionId === section.id;
              const isComplete = section.complete;
              const sectionMissing = section.missingCount;

              return (
                <View key={section.id} style={{ flexDirection: 'row-reverse', alignItems: 'stretch', marginVertical: 4 }}>
                  {/* Timeline Column */}
                  <View style={{ alignItems: 'center', width: 36, marginStart: spacing[3], position: 'relative' }}>
                    {index < sections.length - 1 && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 28,
                          bottom: -20,
                          width: 2,
                          backgroundColor: isComplete ? theme.success : theme.line,
                          zIndex: 1,
                        }}
                      />
                    )}
                    <Pressable
                      onPress={() => setActiveSection(section.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: radius.md,
                        backgroundColor: isComplete
                          ? theme.success
                          : isActive
                          ? theme.brand
                          : theme.surfaceSecondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: isActive ? 0 : borders.hairline,
                        borderColor: isComplete ? theme.success : theme.line,
                        zIndex: 2,
                      }}
                    >
                      {isComplete ? (
                        <Icon name="checkmark" size={14} color={theme.brandContrast} />
                      ) : (
                        <Text
                          role="caption"
                          weight="black"
                          style={{
                            color: isActive ? theme.brandContrast : theme.textMuted,
                          }}
                        >
                          {index + 1}
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  {/* Content Column */}
                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPress={() => setActiveSection(section.id)}
                      style={{
                        paddingVertical: spacing[3],
                        paddingHorizontal: spacing[2],
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box gap={1} style={{ alignItems: 'flex-end', flex: 1 }}>
                        <Text
                          role="bodyStrong"
                          weight="black"
                          style={{
                            color: isActive ? theme.brand : theme.text,
                            fontSize: 16,
                          }}
                        >
                          {section.label}
                        </Text>
                        {!isActive && (
                          <Text
                            role="caption"
                            tone={isComplete ? 'muted' : 'danger'}
                            style={{ textAlign: 'right' }}
                          >
                            {isComplete ? resolveSectionSummary(section.id) : 'يتطلب استكمال الحقول الإلزامية للمرحلة'}
                          </Text>
                        )}
                      </Box>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                        {isComplete ? (
                          <Icon name="checkmark-circle" size={18} tone="success" />
                        ) : sectionMissing > 0 ? (
                          <Badge label={`${sectionMissing} ناقص`} tone="danger" size="sm" />
                        ) : null}
                      </View>
                    </Pressable>

                    {isActive && (
                      <Box padding={4} gap={4} style={{ backgroundColor: theme.surfaceSecondary, borderRadius: radius.sm, marginTop: spacing[1], marginBottom: spacing[3] }}>
                        {renderSectionContent()}
                      </Box>
                    )}
                  </View>
                </View>
              );
            })}
          </Box>

          <View style={{ flexDirection: 'row-reverse', gap: spacing[3], marginTop: spacing[4], justifyContent: 'center' }}>
            <Pressable onPress={onSaveDraft}>
              <Text role="bodyStrong" style={{ color: theme.brand, padding: spacing[2] }}>
                حفظ المسودة
              </Text>
            </Pressable>
            <Pressable onPress={goToPreviousSection}>
              <Text role="body" style={{ color: theme.textMuted, padding: spacing[2] }}>
                الرجوع للسابق
              </Text>
            </Pressable>
          </View>
        </Box>
      </MobileScrollView>

      {/* Sleek Modern Bottom Navigation Bar */}
      <Box
        padding={3}
        layoutDirection="row-reverse"
        justify="space-between"
        align="center"
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.line,
          backgroundColor: theme.surface,
          paddingBottom: spacing[4] + 8,
        }}
      >
        <Button
          label={isLastSection ? 'إرسال للمراجعة' : `التالي: ${fieldSectionLabels[fieldSectionOrder[activeIndex + 1]]}`}
          tone={canSubmit && isLastSection ? 'success' : 'brand'}
          disabled={isLastSection ? !canSubmit : false}
          onPress={goToNextSection}
          style={{ flex: 2, marginStart: spacing[2] }}
        />
        {onEscalate && missingItems.length > 0 && !readOnly && (
          <Button
            label="تصعيد عائق"
            tone="secondary"
            onPress={onEscalate}
            style={{ flex: 1 }}
          />
        )}
      </Box>
    </View>
  );
}

export default DshFieldStoreOnboardingScreen;
