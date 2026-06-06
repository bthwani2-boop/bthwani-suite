import React from 'react';
import { ScrollView, View } from 'react-native';
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
  StickyActionBar,
  Text,
  TextField,
  TopBar,
  useTheme,
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
} from '../../data/stores.preview-data';
import { DocumentVerificationSection } from '../sections/DocumentVerificationSection';
import { getOperationsSupportFlowsForSurface } from '../../data/support.preview-data';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';

const FIELD_ONBOARDING_OPERATION_FLOWS = getOperationsSupportFlowsForSurface('app-field');
const FIELD_PRODUCT_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'catalog-barcode-issue' || item.flowId === 'store-nomination-intake',
);
const FIELD_REVIEW_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'field-proof-required' || item.flowId === 'branch-readiness-escalation',
);

function resolveFieldPolicyLabel(policy?: string): string {
  if (policy === 'detail-on-open') {
    return 'تفاصيل عند الفتح';
  }

  if (policy === 'evidence-on-open') {
    return 'أدلة عند الفتح';
  }

  if (policy === 'summary-only') {
    return 'ملخص أولًا';
  }

  return policy ?? 'سياسة من السجل';
}

// ML-005: added activated/exit states so field knows when onboarding is complete
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

export function DshFieldStoreOnboardingScreen({ store, screenState = 'onboarding', onBack, onStoreChange, onSaveDraft, onSubmitReview, onActivationComplete, onEscalate, onUploadDocument }: DshFieldStoreOnboardingScreenProps) {
  const { theme } = useTheme();

  if (screenState === 'activated') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <TopBar variant="surface" title="تم تفعيل المتجر" onBack={onBack} />
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
        <TopBar variant="surface" title="الخروج" onBack={onBack} />
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
  const readinessFlowSummary = getDshFlowPolicySummary('field-readiness-escalation');

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

  const updateField = React.useCallback(
    <T extends keyof FieldOnboardingDraft>(key: T, value: FieldOnboardingDraft[T]) => {
      patchStore((current) => ({
        ...current,
        draft: updateDraftSection(current.draft, key, value),
      }));
    },
    [patchStore],
  );

  const updateNestedField = React.useCallback(
    <T extends keyof FieldOnboardingDraft, K extends keyof FieldOnboardingDraft[T]>(sectionKey: T, fieldKey: K, value: FieldOnboardingDraft[T][K]) => {
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

  const renderSectionContent = () => {
    if (activeSectionId === 'basics') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="البيانات الأساسية" subtitle="ملف انضمام واحد يلتقط بيانات المتجر والمسؤول من أول مرة." />
          <TextField label="اسم المتجر" value={draft.basics.storeName} editable={!readOnly} onChangeText={(value) => updateNestedField('basics', 'storeName', value)} />
          <TextField label="اسم المالك" value={draft.basics.ownerName} editable={!readOnly} onChangeText={(value) => updateNestedField('basics', 'ownerName', value)} />
          <TextField label="جوال المالك" value={draft.basics.ownerPhone} editable={!readOnly} keyboardType="phone-pad" onChangeText={(value) => updateNestedField('basics', 'ownerPhone', value)} />
          <TextField label="المسؤول الميداني في المتجر" value={draft.basics.managerName} editable={!readOnly} onChangeText={(value) => updateNestedField('basics', 'managerName', value)} />
        </Box>
      );
    }

    if (activeSectionId === 'classification') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="النوع والتصنيف" subtitle="نوع المتجر يبقى داخل ملف الانضمام نفسه، وليس كخيار مستقل في الحساب." />
          <TextField label="نوع المتجر" value={draft.classification.storeType} editable={!readOnly} onChangeText={(value) => updateNestedField('classification', 'storeType', value)} />
          <TextField label="التصنيف الرئيسي" value={draft.classification.mainCategory} editable={!readOnly} onChangeText={(value) => updateNestedField('classification', 'mainCategory', value)} />
          <TextField label="التصنيف الفرعي" value={draft.classification.subCategory} editable={!readOnly} onChangeText={(value) => updateNestedField('classification', 'subCategory', value)} />
        </Box>
      );
    }

    if (activeSectionId === 'location') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="الموقع والتغطية" subtitle="GPS والعنوان والنطاق داخل هذا القسم، وليس كصفحة تشغيلية منفصلة." />
          <TextField label="المدينة" value={draft.location.city} editable={!readOnly} onChangeText={(value) => updateNestedField('location', 'city', value)} />
          <TextField label="النطاق" value={draft.location.zone} editable={!readOnly} onChangeText={(value) => updateNestedField('location', 'zone', value)} />
          <TextField label="العنوان المختصر" value={draft.location.addressLine} editable={!readOnly} onChangeText={(value) => updateNestedField('location', 'addressLine', value)} />
          <TextField label="ملخص التغطية" value={draft.location.coverageSummary} editable={!readOnly} onChangeText={(value) => updateNestedField('location', 'coverageSummary', value)} />
          <TextField label="Latitude" value={draft.location.latitude} editable={!readOnly} keyboardType="decimal-pad" onChangeText={(value) => updateNestedField('location', 'latitude', value)} />
          <TextField label="Longitude" value={draft.location.longitude} editable={!readOnly} keyboardType="decimal-pad" onChangeText={(value) => updateNestedField('location', 'longitude', value)} />
          <TextField label="Landmark" value={draft.location.landmark} editable={!readOnly} onChangeText={(value) => updateNestedField('location', 'landmark', value)} />
        </Box>
      );
    }

    if (activeSectionId === 'photos') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="الصور" subtitle="صور المتجر تبقى داخل الملف نفسه. أي عنصر ناقص هنا يظهر في قائمة النواقص قبل الإرسال." />
          <TextField label="مرجع صورة الواجهة" value={draft.photos.storefrontPhotoRef} editable={!readOnly} onChangeText={(value) => updateNestedField('photos', 'storefrontPhotoRef', value)} />
          <TextField label="مرجع صورة الداخل" value={draft.photos.interiorPhotoRef} editable={!readOnly} onChangeText={(value) => updateNestedField('photos', 'interiorPhotoRef', value)} />
          <TextField label="مرجع صورة اللوحة" value={draft.photos.signagePhotoRef} editable={!readOnly} onChangeText={(value) => updateNestedField('photos', 'signagePhotoRef', value)} />
        </Box>
      );
    }

    if (activeSectionId === 'documents') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="التحقق من المستندات" subtitle="الحالات هنا تعكس الملف الفعلي: مفقود، مرفوع، معتمد، يحتاج إعادة رفع، أو مرفوض." />
          <DocumentVerificationSection
            state="ready"
            documents={documentItems}
            onUploadDocument={() => onUploadDocument?.(store.id)}
          />
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            تم ربط رفع الوثائق وتحديث جاهزية المتجر مباشرة عبر خادم API للوثائق.
          </Text>
        </Box>
      );
    }

    if (activeSectionId === 'products') {
      return (
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="المنتجات الأولية" subtitle="عينة الكتالوج الأولية داخل الملف، بدون بوابة منتجات تشغيلية منفصلة." />
          <TextField label="اسم المنتج الافتتاحي" value={draft.products.featuredProductName} editable={!readOnly} onChangeText={(value) => updateNestedField('products', 'featuredProductName', value)} />
          <TextField label="سعر المنتج الافتتاحي" value={draft.products.featuredProductPrice} editable={!readOnly} keyboardType="decimal-pad" onChangeText={(value) => updateNestedField('products', 'featuredProductPrice', value)} />
          <TextField label="ملاحظة الكتالوج المختصرة" value={draft.products.sampleCatalogNote} editable={!readOnly} onChangeText={(value) => updateNestedField('products', 'sampleCatalogNote', value)} />
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            {`سياسة هذا القسم: ${resolveFieldPolicyLabel(onboardingFlowSummary?.onDemandPolicy)} · الوثائق والصور لا تُفتح إلا عند الحاجة.`}
          </Text>

          <Divider style={{ marginVertical: 8 }} />

          <Box gap={2} paddingVertical={2}>
            <Text role="bodyStrong" style={{ textAlign: 'right' }}>مسارات الكتالوج والباركود</Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>تبقى هذه المشاكل داخل onboarding والكتالوج الميداني فقط، ولا تتحول إلى مركز عمليات الشريك.</Text>
            <Box gap={3} style={{ marginTop: 8 }}>
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
        <Box gap={3} paddingVertical={2}>
          <SectionHeader title="العرض والاتفاق" subtitle="العرض، ساعات العمل، والجاهزية التشغيلية الأولية تظل هنا داخل الملف." />
          <TextField label="العرض أو الاتفاق المبدئي" value={draft.offer.preliminaryOffer} editable={!readOnly} onChangeText={(value) => updateNestedField('offer', 'preliminaryOffer', value)} />
          <TextField label="ساعات العمل" value={draft.offer.operatingHours} editable={!readOnly} onChangeText={(value) => updateNestedField('offer', 'operatingHours', value)} />
          <TextField label="الجاهزية / التوصيل" value={draft.offer.deliveryReadiness} editable={!readOnly} onChangeText={(value) => updateNestedField('offer', 'deliveryReadiness', value)} />
          <TextField label="ملاحظة مالية" value={draft.offer.financeNote} editable={!readOnly} onChangeText={(value) => updateNestedField('offer', 'financeNote', value)} />
          <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
            الملاحظة المالية هنا للمرجعية فقط. لا يوجد اعتماد مالي أو تفعيل نهائي من شاشة الميداني.
          </Text>

          {store.fulfillmentAgreements && store.fulfillmentAgreements.length > 0 && (
            <>
              <Divider style={{ marginVertical: 8 }} />
              <Box gap={2} paddingVertical={2}>
                <Text role="bodyStrong" style={{ textAlign: 'right' }}>أوضاع التنفيذ المتفق عليها</Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>UI_PREVIEW_ONLY — أرقام العمولة والتسوية مملوكة لـ WLT وليست مصدر حقيقي هنا.</Text>
                <Box gap={3} style={{ marginTop: 8 }}>
                  {store.fulfillmentAgreements.map((agreement, index) => (
                    <View key={agreement.mode}>
                      {index > 0 && <Divider style={{ marginVertical: 8 }} />}
                      <Box layoutDirection="row" justify="space-between" align="center" gap={2}>
                        <Box gap={0} style={{ flex: 1 }}>
                          <Text role="bodyStrong" style={{ textAlign: 'right' }}>{agreement.modeLabel}</Text>
                          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{agreement.settlementBasis}</Text>
                        </Box>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Badge
                            label={agreement.operationalReadiness === 'ready' ? 'جاهز' : agreement.operationalReadiness === 'pending' ? 'قيد التفعيل' : 'غير مفعّل'}
                            tone={agreement.operationalReadiness === 'ready' ? 'success' : agreement.operationalReadiness === 'pending' ? 'warning' : 'neutral'}
                          />
                          <Badge
                            label={agreement.enabled ? 'مفعّل' : 'معطّل'}
                            tone={agreement.enabled ? 'success' : 'neutral'}
                          />
                        </View>
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

    return (
      <Box gap={3} paddingVertical={2}>
        <SectionHeader title="المراجعة والإرسال" subtitle="الحفظ كمسودة مسموح دائمًا. الإرسال يبقى مغلقًا حتى اكتمال الأساسيات فقط." />
        <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
          {`مالك قرار التصعيد: ${resolveDshControlPanelSectionLabel('partners')} · الممنوع: ${onboardingFlowSummary?.forbiddenActions.join('، ') ?? 'غير محدد'}`}
        </Text>
        <TextField label="ملاحظات الميداني" value={draft.review.fieldNotes} editable={!readOnly} onChangeText={(value) => updateNestedField('review', 'fieldNotes', value)} />
        <TextField label="ملاحظة مراجعة الشركاء" value={draft.review.partnerReviewNote} editable={!readOnly} onChangeText={(value) => updateNestedField('review', 'partnerReviewNote', value)} />

        <Divider style={{ marginVertical: 8 }} />

        <Box gap={2} paddingVertical={2}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>قائمة النواقص</Text>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{missingItems.length ? 'هذه العناصر تمنع زر الإرسال حاليًا.' : 'لا توجد نواقص أساسية. الملف جاهز للإرسال.'}</Text>
          <Box gap={2} style={{ marginTop: 4 }}>
            {missingItems.length ? (
              missingItems.map((item) => (
                <Text key={item} role="bodySm" tone="muted" style={{ textAlign: 'right' }}>• {item}</Text>
              ))
            ) : (
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>تم استيفاء الأساسيات المطلوبة للمراجعة.</Text>
            )}
          </Box>
        </Box>

        {store.reviewFeedback ? (
          <>
            <Divider style={{ marginVertical: 8 }} />
            <Box gap={2} paddingVertical={2}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>ملاحظة راجعة</Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>عادت من المراجعة وتحتاج معالجة محلية قبل إعادة الإرسال.</Text>
              <Text role="bodySm" tone="warning" style={{ textAlign: 'right', marginTop: 4 }}>{store.reviewFeedback}</Text>
            </Box>
          </>
        ) : null}

        <Divider style={{ marginVertical: 8 }} />

        <Box gap={2} paddingVertical={2}>
          <Text role="bodyStrong" style={{ textAlign: 'right' }}>التحقق والتصعيد</Text>
          <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>{`الإثباتات والتصعيد تبقى on-demand فقط، والقرار النهائي يملكه ${resolveDshControlPanelSectionLabel('partners')} عند الحاجة.`}</Text>
          <Box gap={3} style={{ marginTop: 8 }}>
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
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title={store.name}
        subtitle={`${resolveFieldStoreStatusLabel(store)} · ${resolveFieldStoreLifecycleLabel(store)}`}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'العودة',
          onPress: onBack,
        }}
      />
      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 148 }}>
        <Box padding={4} gap={4}>
          <Box gap={3} paddingVertical={2}>
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
              <Badge label={resolveFieldStoreStatusLabel(store)} tone={resolveFieldStoreStatusTone(store)} />
              <Badge label={`اكتمال ${completionPercent}%`} tone="info" />
              <Badge label={draft.lastSavedLabel} tone="default" />
            </View>
            <Text role="titleSm" style={{ textAlign: 'right' }}>ملف انضمام واحد لكل متجر</Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
              كل البيانات الميدانية، GPS، الصور، المنتجات الأولية، والعرض أصبحت داخل هذا الملف فقط، بدون صفحات تشغيلية منفصلة.
            </Text>
            <KeyValueList
              dense
              items={[
                { label: 'المتجر', value: store.name, tone: 'brand' },
                { label: 'الموقع', value: store.location },
                { label: 'الموعد / آخر تحديث', value: `${store.nextVisitLabel} · ${store.lastUpdatedLabel}` },
              ]}
            />
          </Box>

          <Divider />

          <Box gap={2} paddingVertical={2}>
            <SectionHeader title="سياسة onboarding من السجل" subtitle="الملف يبقى مملوكًا للميداني، لكن لا توجد قرارات مالية أو تفعيل نهائي محلي." />
            <KeyValueList
              dense
              items={[
                { label: 'المالك', value: onboardingFlowSummary?.ownerSurface ?? 'app-field', tone: 'brand' },
                { label: 'سياسة الفتح', value: resolveFieldPolicyLabel(onboardingFlowSummary?.onDemandPolicy) },
                { label: 'مالك التصعيد', value: resolveDshControlPanelSectionLabel('partners') },
              ]}
            />
            <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
              {onboardingFlowSummary?.nextPolicyActionPreview ?? 'افتح التفاصيل أو الوثائق عند الحاجة فقط، ولا تعتمد أي قرار مالي من هذه الشاشة.'}
            </Text>
          </Box>

          <Divider />

          <Box gap={3} paddingVertical={2}>
            <SectionHeader title="مراحل الملف" subtitle="تنقل ذكي قصير، وكل قسم يحتفظ بتقدمه ويعود إليه مباشرة." />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ transform: [{ scaleX: -1 }] }} contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
              {sections.map((section) => (
                <View key={section.id} style={{ transform: [{ scaleX: -1 }] }}>
                  <Button
                    label={section.complete ? `${section.label} · مكتمل` : `${section.label} · ${section.missingCount}`}
                    tone={activeSectionId === section.id ? 'primary' : 'secondary'}
                    size="sm"
                    fullWidth={false}
                    onPress={() => setActiveSection(section.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </Box>

          <Divider />

          {renderSectionContent()}

          <Divider />

          <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
            <Button label="الرجوع" tone="secondary" fullWidth={false} style={{ flex: 1 }} onPress={goToPreviousSection} />
            <Button label="حفظ مسودة" tone="secondary" fullWidth={false} style={{ flex: 1 }} onPress={onSaveDraft} />
          </View>
        </Box>
      </MobileScrollView>

      <StickyActionBar
        note={readOnly ? 'الملف في حالة للقراءة فقط الآن. بقي للميداني السجل والحالة والمالية فقط.' : missingItems.length ? `النواقص الحالية: ${missingItems.join('، ')}` : 'كل الأساسيات مكتملة. يمكنك الإرسال للمراجعة.'}
        primaryAction={{
          label: isLastSection ? 'إرسال للمراجعة' : `التالي: ${fieldSectionLabels[fieldSectionOrder[activeIndex + 1]]}`,
          tone: canSubmit && isLastSection ? 'success' : 'primary',
          disabled: isLastSection ? !canSubmit : false,
          onPress: goToNextSection,
        }}
        secondaryAction={onEscalate && missingItems.length > 0 && !readOnly ? {
          label: 'تصعيد عائق',
          tone: 'secondary' as const,
          onPress: onEscalate,
        } : undefined}
      />
    </View>
  );
}

export default DshFieldStoreOnboardingScreen;
