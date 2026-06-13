import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
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
  getFieldRequiredMissingItems,
  isFieldStoreReadOnly,
  resolveFieldCompletionPercent,
  resolveFieldSectionSummaries,
  resolveFieldStoreLifecycleLabel,
  resolveFieldStoreStatusLabel,
  resolveFieldStoreStatusTone,
  touchFieldStoreDraft,
  type FieldOnboardingDraft,
  type FieldOnboardingSectionId,
  type FieldStoreFile,
  type FieldDocumentPreviewStatus,
} from '../../shared/contracts/field-store-model';
import { DocumentVerificationSection } from '../sections/DocumentVerificationSection';
import { getOperationsSupportFlowsForSurface } from '../../shared/state-machines/support-flows';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/policies/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

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
  onUploadDocument?: (storeId: string) => void;
};

function updateDraftSection<T extends keyof FieldOnboardingDraft>(draft: FieldOnboardingDraft, key: T, value: FieldOnboardingDraft[T]) {
  return {
    ...draft,
    [key]: value,
  };
}

const getOptionsWithFallback = (defaultOpts: { value: string; label: string }[], currentValue: string) => {
  if (!currentValue) return defaultOpts;
  const exists = defaultOpts.some((opt) => opt.value === currentValue);
  if (exists) return defaultOpts;
  return [...defaultOpts, { value: currentValue, label: currentValue }];
};

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
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const [ocrLoading, setOcrLoading] = React.useState(false);
  const [cameraLoading, setCameraLoading] = React.useState<Record<string, boolean>>({});

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
  const sections = React.useMemo(() => resolveFieldSectionSummaries(draft), [draft]);
  const missingItems = React.useMemo(() => getFieldRequiredMissingItems(draft), [draft]);
  const completionPercent = React.useMemo(() => resolveFieldCompletionPercent(draft), [draft]);
  const documentItems = React.useMemo(() => ([
    {
      id: 'commercial_registration' as const,
      label: 'السجل التجاري',
      required: true,
      status: draft.documents.commercialRegistrationStatus,
      referenceLabel: draft.documents.commercialRegistrationRef || 'لا يوجد مرجع مرفوع بعد',
    },
    {
      id: 'id_card' as const,
      label: 'هوية المالك',
      required: true,
      status: draft.documents.ownerIdStatus,
      referenceLabel: draft.documents.ownerIdRef || 'لا يوجد مرجع مرفوع بعد',
    },
    {
      id: 'trade_license' as const,
      label: 'رخصة التجارة',
      required: false,
      status: draft.documents.tradeLicenseStatus,
      referenceLabel: draft.documents.tradeLicenseRef || 'اختياري — غير مرفوع',
    },
  ]), [draft.documents]);

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

  const updateNestedField = React.useCallback(
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

  const errors = React.useMemo(() => {
    const errs: Record<string, string | undefined> = {};

    // Basics
    if (!draft.basics.storeName.trim()) {
      errs.storeName = 'اسم المتجر مطلوب لتحديد الهوية الميدانية';
    }
    if (!draft.basics.ownerName.trim()) {
      errs.ownerName = 'اسم المالك مطلوب للمطابقة القانونية';
    }
    if (!draft.basics.ownerPhone.trim()) {
      errs.ownerPhone = 'رقم جوال المالك مطلوب للتواصل المباشر';
    } else {
      const phone = draft.basics.ownerPhone.trim();
      const isValidYemen = /^(77|73|71|70|78)[0-9]{7}$/.test(phone);
      const isValidSaudi = /^(05|5)[0-9]{8}$/.test(phone);
      if (!isValidYemen && !isValidSaudi) {
        errs.ownerPhone = 'صيغة الجوال غير صحيحة (٩ أرقام تبدأ بـ 7 لليمن أو 05/5 للسعودية)';
      }
    }

    // Location
    if (!draft.location.city.trim()) {
      errs.city = 'المدينة مطلوبة لتوزيع التغطية';
    }
    if (!draft.location.zone.trim()) {
      errs.zone = 'النطاق الجغرافي مطلوب لتنسيق العمليات الميدانية';
    }
    if (!draft.location.latitude.trim()) {
      errs.latitude = 'خط العرض مطلوب';
    } else if (isNaN(Number(draft.location.latitude))) {
      errs.latitude = 'قيمة خط العرض غير صحيحة';
    }
    if (!draft.location.longitude.trim()) {
      errs.longitude = 'خط الطول مطلوب';
    } else if (isNaN(Number(draft.location.longitude))) {
      errs.longitude = 'قيمة خط الطول غير صحيحة';
    }
    if (!draft.location.landmark.trim()) {
      errs.landmark = 'المعلم المميز مطلوب لمساعدة الكابتن في الوصول';
    }

    // Products
    if (!draft.products.featuredProductName.trim()) {
      errs.featuredProductName = 'اسم المنتج الافتتاحي مطلوب لإطلاق الكتالوج';
    }
    if (!draft.products.featuredProductPrice.trim()) {
      errs.featuredProductPrice = 'سعر المنتج مطلوب';
    } else if (isNaN(Number(draft.products.featuredProductPrice)) || Number(draft.products.featuredProductPrice) <= 0) {
      errs.featuredProductPrice = 'سعر المنتج يجب أن يكون قيمة موجبة';
    }

    // Offer
    if (!draft.offer.preliminaryOffer.trim()) {
      errs.preliminaryOffer = 'الاتفاق أو العمولة المبدئية مطلوبة للتفعيل';
    }
    if (!draft.offer.operatingHours.trim()) {
      errs.operatingHours = 'ساعات العمل مطلوبة لجدولة التوصيل الميداني';
    }

    return errs;
  }, [draft]);

  const canImportOwnerName = draft.documents.commercialRegistrationRef.trim().length > 0;

  const handleImportOwnerName = () => {
    setOcrLoading(true);
    setTimeout(() => {
      updateNestedField('basics', 'ownerName', 'عبدالرحمن بن ثنيان');
      setOcrLoading(false);
    }, 600);
  };

  const handleGPSAutofill = () => {
    setGpsLoading(true);
    setTimeout(() => {
      updateNestedField('location', 'city', 'الرياض');
      updateNestedField('location', 'zone', 'حي العليا');
      updateNestedField('location', 'latitude', '24.71358');
      updateNestedField('location', 'longitude', '46.67529');
      updateNestedField('location', 'landmark', 'برج المملكة - البوابة الشرقية');
      updateNestedField('location', 'addressLine', 'طريق الملك فهد، حي العليا');
      updateNestedField('location', 'coverageSummary', 'نطاق التغطية يغطي كامل مربع العليا وحطين');
      setGpsLoading(false);
    }, 800);
  };

  const handleCameraCapture = (field: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef') => {
    setCameraLoading((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const mockPhotoRef = `img_${field.replace('PhotoRef', '')}_upload_${randomSuffix}.jpg`;
      updateNestedField('photos', field, mockPhotoRef);
      setCameraLoading((prev) => ({ ...prev, [field]: false }));
    }, 700);
  };

  const resolveSectionSummary = (sectionId: FieldOnboardingSectionId): string => {
    if (sectionId === 'basics') {
      const storeName = draft.basics.storeName.trim();
      const ownerName = draft.basics.ownerName.trim();
      return `المتجر: ${storeName || 'غير محدد'} · المالك: ${ownerName || 'غير محدد'}`;
    }
    if (sectionId === 'classification') {
      const main = draft.classification.mainCategory.trim();
      const sub = draft.classification.subCategory.trim();
      return `التصنيف: ${main || 'غير محدد'} · ${sub || 'غير محدد'}`;
    }
    if (sectionId === 'location') {
      const city = draft.location.city.trim();
      const zone = draft.location.zone.trim();
      const lat = draft.location.latitude.trim();
      const lng = draft.location.longitude.trim();
      return `الموقع: ${city || 'غير محدد'}، ${zone || 'غير محدد'} (${lat || '0'}, ${lng || '0'})`;
    }
    if (sectionId === 'photos') {
      const storefront = draft.photos.storefrontPhotoRef.trim();
      const interior = draft.photos.interiorPhotoRef.trim();
      return storefront || interior ? 'تم إرفاق صور الواجهة والتجهيزات الداخلية' : 'لم يتم رفع صور بعد';
    }
    if (sectionId === 'documents') {
      const cr = draft.documents.commercialRegistrationRef.trim();
      const id = draft.documents.ownerIdRef.trim();
      return cr || id ? 'تم إرفاق وثائق السجل التجاري والهوية للمراجعة' : 'لم ترفع أي مستندات';
    }
    if (sectionId === 'products') {
      const name = draft.products.featuredProductName.trim();
      const price = draft.products.featuredProductPrice.trim();
      return `المنتج: ${name || 'غير محدد'} · السعر: ${price || '0'} ر.ي`;
    }
    if (sectionId === 'offer') {
      const offer = draft.offer.preliminaryOffer.trim();
      const hours = draft.offer.operatingHours.trim();
      return `العمولة: ${offer || 'غير محدد'} · ساعات العمل: ${hours || 'غير محدد'}`;
    }
    if (sectionId === 'review') {
      const notes = draft.review.fieldNotes.trim();
      return `ملاحظات الزيارة: ${notes || 'لا توجد ملاحظات إضافية'}`;
    }
    return '';
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
            onChangeText={(value) => updateNestedField('basics', 'storeName', value)}
            placeholder="مثال: أسواق العليا الطازجة"
          />

          <View style={{ gap: spacing[2] }}>
            <TextField
              label="اسم المالك الثنائي/الثلاثي"
              value={draft.basics.ownerName}
              editable={!readOnly}
              error={errors.ownerName}
              onChangeText={(value) => updateNestedField('basics', 'ownerName', value)}
              placeholder="الاسم مطابق للهوية أو السجل التجاري"
            />
            {!readOnly && (
              <Button
                label={ocrLoading ? 'جاري استيراد الاسم...' : 'استيراد اسم المالك من السجل التجاري'}
                size="sm"
                tone="secondary"
                disabled={ocrLoading || !canImportOwnerName}
                icon={<Icon name="cloud-download-outline" size={16} tone={canImportOwnerName ? 'brand' : 'muted'} />}
                onPress={handleImportOwnerName}
                style={{ alignSelf: 'flex-start' }}
              />
            )}
            {!canImportOwnerName && !readOnly && (
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                * ارفع السجل التجاري أولًا لتفعيل الاستيراد التلقائي لاسم المالك
              </Text>
            )}
          </View>

          <TextField
            label="رقم جوال المالك"
            value={draft.basics.ownerPhone}
            editable={!readOnly}
            keyboardType="phone-pad"
            error={errors.ownerPhone}
            onChangeText={(value) => updateNestedField('basics', 'ownerPhone', value)}
            placeholder="مثال: 777123456 أو 0551234567"
            hint="يستخدم لإرسال كود التفعيل والاتفاق النهائي"
          />

          <TextField
            label="المسؤول الميداني في المتجر"
            value={draft.basics.managerName}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('basics', 'managerName', value)}
            placeholder="اسم الشخص المتواجد في الموقع حاليًا"
          />
        </Box>
      );
    }

    if (activeSectionId === 'classification') {
      const typeOptions = [
        { value: 'بقالة ومواد غذائية', label: 'بقالة ومواد غذائية' },
        { value: 'مطعم', label: 'مطعم / وجبات' },
        { value: 'مخبز وحلويات', label: 'مخبز وحلويات' },
        { value: 'صيدلية', label: 'صيدلية ومستحضرات تجميل' },
      ];

      const mainCatOptions = [
        { value: 'مطاعم', label: 'مأكولات ووجبات' },
        { value: 'بقالة ومواد غذائية', label: 'طازج وفواكه ومواد استهلاكية' },
        { value: 'مخابز', label: 'مخبوزات ومعجنات' },
        { value: 'حلويات ومشروبات', label: 'حلويات ومشروبات' },
      ];

      const subCatOptions = [
        { value: 'وجبات سريعة', label: 'وجبات سريعة' },
        { value: 'شعبي ويمني', label: 'شعبي ويمني' },
        { value: 'سوبرماركت', label: 'سوبرماركت / هايبر' },
        { value: 'معجنات وفطائر', label: 'معجنات وفطائر' },
      ];

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
            options={getOptionsWithFallback(typeOptions, draft.classification.storeType)}
            placeholder="اختر نوع المنفذ الميداني"
            onValueChange={(value) => updateNestedField('classification', 'storeType', value)}
          />

          <SelectField
            label="التصنيف الرئيسي"
            value={draft.classification.mainCategory}
            disabled={readOnly}
            options={getOptionsWithFallback(mainCatOptions, draft.classification.mainCategory)}
            placeholder="اختر الفئة الرئيسية في بثواني"
            onValueChange={(value) => updateNestedField('classification', 'mainCategory', value)}
          />

          <SelectField
            label="التصنيف الفرعي للمتجر"
            value={draft.classification.subCategory}
            disabled={readOnly}
            options={getOptionsWithFallback(subCatOptions, draft.classification.subCategory)}
            placeholder="اختر التصنيف الأكثر دقة للفرع"
            onValueChange={(value) => updateNestedField('classification', 'subCategory', value)}
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

          {!readOnly && (
            <Button
              label={gpsLoading ? 'جاري الاتصال بالأقمار الصناعية...' : 'تحديد الموقع الحالي بدقة (GPS)'}
              tone="brand"
              size="md"
              disabled={gpsLoading}
              icon={<Icon name="locate-outline" size={18} color={theme.brandContrast} />}
              onPress={handleGPSAutofill}
              style={{ paddingVertical: spacing[3] }}
            />
          )}

          <TextField
            label="المدينة"
            value={draft.location.city}
            editable={!readOnly}
            error={errors.city}
            onChangeText={(value) => updateNestedField('location', 'city', value)}
            placeholder="مثال: الرياض"
          />

          <TextField
            label="النطاق / الحي الجغرافي"
            value={draft.location.zone}
            editable={!readOnly}
            error={errors.zone}
            onChangeText={(value) => updateNestedField('location', 'zone', value)}
            placeholder="مثال: حي العليا"
          />

          <TextField
            label="العنوان المختصر ووصف الشارع"
            value={draft.location.addressLine}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('location', 'addressLine', value)}
            placeholder="مثال: طريق الملك فهد، بجانب البنك الأهلي"
          />

          <View style={{ flexDirection: 'row-reverse', gap: spacing[3] }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Latitude (خط العرض)"
                value={draft.location.latitude}
                editable={!readOnly}
                keyboardType="decimal-pad"
                error={errors.latitude}
                onChangeText={(value) => updateNestedField('location', 'latitude', value)}
                placeholder="24.71358"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="Longitude (خط الطول)"
                value={draft.location.longitude}
                editable={!readOnly}
                keyboardType="decimal-pad"
                error={errors.longitude}
                onChangeText={(value) => updateNestedField('location', 'longitude', value)}
                placeholder="46.67529"
              />
            </View>
          </View>

          <TextField
            label="أقرب معلم مميز (Landmark)"
            value={draft.location.landmark}
            editable={!readOnly}
            error={errors.landmark}
            onChangeText={(value) => updateNestedField('location', 'landmark', value)}
            placeholder="مثال: أمام برج المملكة"
          />

          <TextField
            label="ملخص التغطية الجغرافية"
            value={draft.location.coverageSummary}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('location', 'coverageSummary', value)}
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

          {(['storefrontPhotoRef', 'interiorPhotoRef', 'signagePhotoRef'] as const).map((photoKey) => {
            const labels = {
              storefrontPhotoRef: 'صورة الواجهة الخارجية للمحل',
              interiorPhotoRef: 'صورة المتجر من الداخل والرفوف',
              signagePhotoRef: 'صورة اللوحة التجارية المطابقة للترخيص',
            };
            const photoErr = photoKey === 'storefrontPhotoRef' ? errors.storefrontPhotoRef : undefined;
            const isCapturing = cameraLoading[photoKey];

            return (
              <View key={photoKey} style={{ gap: spacing[2] }}>
                <TextField
                  label={labels[photoKey]}
                  value={draft.photos[photoKey]}
                  editable={!readOnly}
                  error={photoErr}
                  placeholder="لم يتم إرفاق مرجع الصورة بعد"
                  onChangeText={(value) => updateNestedField('photos', photoKey, value)}
                />
                {!readOnly && (
                  <Button
                    label={isCapturing ? 'جاري فتح الكاميرا والالتقاط...' : 'فتح الكاميرا والتقاط الصورة'}
                    size="sm"
                    tone="secondary"
                    disabled={isCapturing}
                    icon={<Icon name="camera-outline" size={16} tone="brand" />}
                    onPress={() => handleCameraCapture(photoKey)}
                    style={{ alignSelf: 'flex-start' }}
                  />
                )}
              </View>
            );
          })}
        </Box>
      );
    }

    if (activeSectionId === 'documents') {
      return (
        <Box gap={3}>
          <SectionHeader
            title="المستندات والتراخيص الرسمية"
            subtitle="حالات المستندات تعكس الواقع القانوني. التفعيل النهائي والاعتماد يملكه مدير العمليات عبر لوحة التحكم."
          />
          <DocumentVerificationSection
            state="ready"
            documents={documentItems}
            onUploadDocument={() => onUploadDocument?.(store.id)}
          />
          <Text role="caption" tone="soft" style={{ textAlign: 'right', marginTop: spacing[2] }}>
            تم ربط رفع المستندات مباشرة بنظام معالجة وتدقيق التراخيص المركزي في بثواني.
          </Text>
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
            onChangeText={(value) => updateNestedField('products', 'featuredProductName', value)}
            placeholder="مثال: برجر دجاج كلاسيك"
          />

          <TextField
            label="سعر المنتج الافتتاحي"
            value={draft.products.featuredProductPrice}
            editable={!readOnly}
            keyboardType="decimal-pad"
            error={errors.featuredProductPrice}
            onChangeText={(value) => updateNestedField('products', 'featuredProductPrice', value)}
            placeholder="السعر بالعملة المحلية شامل الضريبة"
          />

          <TextField
            label="ملاحظات وتفاصيل الكتالوج المختصرة"
            value={draft.products.sampleCatalogNote}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('products', 'sampleCatalogNote', value)}
            placeholder="تفاصيل إضافية للكتالوج الأولي للمتجر"
          />

          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {`سياسة كتالوج المنتجات: ${resolveDshOnDemandPolicyLabel(onboardingFlowSummary?.onDemandPolicy)} · المستندات المرفقة لا تراجع إلا عند اكتمال هذا القسم.`}
          </Text>

          <Divider style={{ marginVertical: 8 }} />

          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>المشاكل والباركود المكتشف</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
              المشاكل التشغيلية والباركود الميداني تعالج داخل هذا الملف لتفادي نقلها لنظام دعم شركاء بثواني.
            </Text>
            <Box gap={3} style={{ marginTop: spacing[2] }}>
              {FIELD_PRODUCT_OPERATION_FLOWS.map((flow, index) => (
                <View key={flow.flowId}>
                  {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                  <Box gap={1}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>{flow.title}</Text>
                    <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{flow.description}</Text>
                    <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{`التالي: ${flow.nextAction}`}</Text>
                  </Box>
                </View>
              ))}
            </Box>
          </Box>
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
            onChangeText={(value) => updateNestedField('offer', 'preliminaryOffer', value)}
            placeholder="مثال: 12% من قيمة الطلب"
          />

          <TextField
            label="ساعات العمل اليومية"
            value={draft.offer.operatingHours}
            editable={!readOnly}
            error={errors.operatingHours}
            onChangeText={(value) => updateNestedField('offer', 'operatingHours', value)}
            placeholder="مثال: من 8:00 صباحًا إلى 11:30 مساءً"
          />

          <TextField
            label="وضعية وجاهزية التوصيل الأولي"
            value={draft.offer.deliveryReadiness}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('offer', 'deliveryReadiness', value)}
            placeholder="مثال: جاهز بتغطية سريعة كباتن بثواني"
          />

          <TextField
            label="ملاحظات المحاسبة والمالية"
            value={draft.offer.financeNote}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('offer', 'financeNote', value)}
            placeholder="ملاحظات مرجعية للحسابات والعمولات"
          />

          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            * ملاحظة: الملاحظات المالية تشغيلية فقط. الربط المالي الفعلي والتسويات تدار حصرياً عبر المحفظة WLT.
          </Text>

          {store.fulfillmentAgreements && store.fulfillmentAgreements.length > 0 && (
            <>
              <Divider style={{ marginVertical: 8 }} />
              <Box gap={2}>
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>أنماط التشغيل والتسوية المتفق عليها</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                  بيانات مرجعية للعرض فقط — نسب العمولات الفعلية وأرقام التسوية يتم إدارتها وتعديلها من قِبل WLT وليس للميداني صلاحية تعديلها.
                </Text>
                <Box gap={3} style={{ marginTop: spacing[2] }}>
                  {store.fulfillmentAgreements.map((agreement, index) => (
                    <View key={agreement.mode}>
                      {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                      <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
                        <Box gap={0} style={{ flex: 1 }}>
                          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{agreement.modeLabel}</Text>
                          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{agreement.settlementBasis}</Text>
                        </Box>
                        <Box layoutDirection="row" gap={2}>
                          <Badge
                            label={
                              agreement.operationalReadiness === 'ready'
                                ? 'جاهز'
                                : agreement.operationalReadiness === 'pending'
                                ? 'قيد التفعيل'
                                : 'غير مفعّل'
                            }
                            tone={
                              agreement.operationalReadiness === 'ready'
                                ? 'success'
                                : agreement.operationalReadiness === 'pending'
                                ? 'warning'
                                : 'default'
                            }
                          />
                          <Badge
                            label={agreement.enabled ? 'مفعّل' : 'معطّل'}
                            tone={agreement.enabled ? 'success' : 'default'}
                          />
                        </Box>
                      </Box>
                    </View>
                  ))}
                </Box>
              </Box>
            </>
          )}
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

          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {`مدير تصعيد الملفات والجاهزية: قسم الشركاء (${resolveDshControlPanelSectionLabel('partners')}) · الإجراءات المحظورة ميدانيًا: التفعيل النهائي بدون تدقيق التراخيص`}
          </Text>

          <TextField
            label="ملاحظات الميداني الشخصية"
            value={draft.review.fieldNotes}
            editable={!readOnly}
            onChangeText={(value) => updateNestedField('review', 'fieldNotes', value)}
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

          <Divider style={{ marginVertical: 8 }} />

          <Box gap={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>مسارات التصعيد والتحقق الإداري</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
              {`في حالة تعذر استيفاء بعض النواقص ميدانيًا، يمكنك تصعيد الملف لطلب استثناء تشغيلي من قسم الشركاء (${resolveDshControlPanelSectionLabel('partners')})`}
            </Text>
            <Box gap={3} style={{ marginTop: spacing[2] }}>
              {FIELD_REVIEW_OPERATION_FLOWS.map((flow, index) => (
                <View key={flow.flowId}>
                  {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                  <Box gap={1}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>{flow.title}</Text>
                    <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{flow.description}</Text>
                    <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>{`التالي: ${flow.nextAction}`}</Text>
                  </Box>
                </View>
              ))}
            </Box>
          </Box>
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

          {/* Section 1: Store Metadata Header Card */}
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
            </Box>

            <Divider style={{ marginVertical: 4 }} />

            <Box gap={1} style={{ alignItems: 'flex-end' }}>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                {`آخر تحديث للملف: ${store.lastUpdatedLabel} · موعد الزيارة التالي: ${store.nextVisitLabel}`}
              </Text>
            </Box>

            <Divider style={{ marginVertical: 4 }} />

            <Pressable
              onPress={() => setPolicyExpanded(!policyExpanded)}
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 2,
              }}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
                <Icon name="information-circle-outline" size={16} tone="brand" />
                <Text role="bodyStrong" style={{ color: theme.brand }}>
                  سياسة الإضافة والربط للمحل
                </Text>
              </View>
              <Text role="label" tone="brand">
                {policyExpanded ? 'إخفاء ▲' : 'تفاصيل السياسة ▾'}
              </Text>
            </Pressable>

            {policyExpanded ? (
              <Box gap={2} style={{ padding: 10, backgroundColor: theme.surfaceSecondary, borderRadius: radius.xs2, marginTop: spacing[1] }}>
                <KeyValueList
                  dense
                  items={[
                    { label: 'المالك التشغيلي', value: onboardingFlowSummary?.ownerSurface ?? 'app-field', tone: 'brand' },
                    { label: 'سياسة التحميل والفتح', value: resolveDshOnDemandPolicyLabel(onboardingFlowSummary?.onDemandPolicy) },
                    { label: 'مالك قرار التصعيد والاعتماد', value: resolveDshControlPanelSectionLabel('partners') },
                  ]}
                />
                <Text role="caption" tone="soft" style={{ textAlign: 'right', marginTop: spacing[1] }}>
                  {onboardingFlowSummary?.nextPolicyActionPreview ?? 'افتح التفاصيل أو الوثائق عند الحاجة فقط، ولا تعتمد أي قرار مالي من هذه الشاشة.'}
                </Text>
              </Box>
            ) : null}
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
                  <View style={{ flex: 1, gap: spacing[2] }}>
                    <Pressable
                      onPress={() => setActiveSection(section.id)}
                      style={{
                        padding: spacing[3],
                        borderRadius: radius.sm2,
                        backgroundColor: isActive ? theme.brandSurface : theme.surface,
                        borderWidth: borders.hairline,
                        borderColor: isActive ? theme.brand : theme.line,
                        gap: spacing[1],
                        alignItems: 'flex-end',
                      }}
                    >
                      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Text
                          role="bodyStrong"
                          weight="black"
                          style={{
                            color: isActive ? theme.brand : theme.text,
                          }}
                        >
                          {section.label}
                        </Text>
                        {isActive ? (
                          <Badge label="قيد التعديل" tone="brand" />
                        ) : isComplete ? (
                          <Text role="caption" weight="bold" style={{ color: theme.success }}>مكتمل ✓</Text>
                        ) : sectionMissing > 0 ? (
                          <Badge label={`${sectionMissing} ناقص`} tone="danger" />
                        ) : null}
                      </View>
                      {!isActive && (
                        <Text
                          role="caption"
                          tone={isComplete ? 'muted' : 'danger'}
                          style={{ textAlign: 'right', marginTop: 2 }}
                        >
                          {isComplete ? resolveSectionSummary(section.id) : 'يتطلب استكمال الحقول الإلزامية للمرحلة'}
                        </Text>
                      )}
                    </Pressable>

                    {isActive && (
                      <Card padding={4} gap={4} style={{ marginTop: spacing[1], borderRadius: radius.sm2 }}>
                        {renderSectionContent()}
                      </Card>
                    )}
                  </View>
                </View>
              );
            })}
          </Box>

          <Divider />

          {/* Section 4: Scrollable Form Footer buttons */}
          <View style={{ flexDirection: 'row-reverse', gap: spacing[3] }}>
            <Button
              label="الخطوة السابقة"
              tone="secondary"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={goToPreviousSection}
            />
            <Button
              label="حفظ مسودة"
              tone="secondary"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={onSaveDraft}
            />
          </View>
        </Box>
      </MobileScrollView>

      {/* Sticky Bottom Action Controller */}
      <StickyActionBar
        note={stickyNote}
        primaryAction={{
          label: isLastSection
            ? 'إرسال للمراجعة'
            : `التالي: ${fieldSectionLabels[fieldSectionOrder[activeIndex + 1]]}`,
          tone: canSubmit && isLastSection ? 'success' : 'primary',
          disabled: isLastSection ? !canSubmit : false,
          onPress: goToNextSection,
        }}
        secondaryAction={
          onEscalate && missingItems.length > 0 && !readOnly
            ? {
                label: 'تصعيد عائق الميدان',
                tone: 'secondary' as const,
                onPress: onEscalate,
              }
            : undefined
        }
      />
    </View>
  );
}

export default DshFieldStoreOnboardingScreen;
