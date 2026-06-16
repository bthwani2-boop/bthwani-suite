// dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx
// Onboarding surface wizard for field stores. Orchestrates step timeline, headers, and actions.
// No Tamagui. No custom component extensions.

import React from 'react';
import { Platform, Pressable, View } from 'react-native';
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
  StateView,
  Text,
  TopBar,
  useTheme,
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
} from '../dsh-field.routes';
import {
  isFieldStoreReadOnly,
  touchFieldStoreDraft,
} from '../field.surface-model';
import {
  validatePartnerOnboarding,
  resolvePartnerSectionSummaryLabel,
  getPartnerRequiredMissingItems,
  resolvePartnerCompletionPercent,
  resolvePartnerSectionSummaries,
  resolvePartnerDocumentItems,
  type PartnerDocumentKind,
  getOperationsSupportFlowsForSurface,
} from '../../shared';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/runtime/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../control-panel/shared/dsh-control-panel-governance.map';

import { useOnboardingMedia } from './useOnboardingMedia';
import {
  OnboardingBasicsStep,
  OnboardingLocationStep,
  OnboardingPhotosStep,
  OnboardingDocumentsStep,
  OnboardingOfferStep,
  OnboardingReviewStep,
} from './DshFieldStoreOnboardingSteps';

const FIELD_ONBOARDING_OPERATION_FLOWS = getOperationsSupportFlowsForSurface('app-field');
const FIELD_PRODUCT_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'catalog-barcode-issue' || item.flowId === 'store-nomination-intake',
);
const FIELD_REVIEW_OPERATION_FLOWS = FIELD_ONBOARDING_OPERATION_FLOWS.filter(
  (item) => item.flowId === 'field-proof-required' || item.flowId === 'branch-readiness-escalation',
);

export type DshFieldStoreOnboardingScreenState = 'onboarding' | 'activated' | 'exit';

// Grouping definitions: Consolidates the 8 steps into 4 logical sections for a cleaner wizard experience.
export type OnboardingGroupSectionId = 'basics_profile' | 'location_media' | 'documents' | 'agreement_review';

export const onboardingGroupOrder: readonly OnboardingGroupSectionId[] = [
  'basics_profile',
  'location_media',
  'documents',
  'agreement_review',
];

export const onboardingGroupLabels: Record<OnboardingGroupSectionId, string> = {
  basics_profile: 'بيانات المتجر الأساسية',
  location_media: 'الموقع والصور الميدانية',
  documents: 'المستندات والتراخيص الرسمية',
  agreement_review: 'الاتفاق والمراجعة النهائية',
};

export function getGroupIdForSectionId(sectionId: FieldOnboardingSectionId): OnboardingGroupSectionId {
  if (sectionId === 'basics' || sectionId === 'classification') {
    return 'basics_profile';
  }
  if (sectionId === 'location' || sectionId === 'photos') {
    return 'location_media';
  }
  if (sectionId === 'documents') {
    return 'documents';
  }
  return 'agreement_review';
}

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
  onGoToProducts?: () => void;
  onGoToVisit?: () => void;
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
  onGoToProducts,
  onGoToVisit,
}: DshFieldStoreOnboardingScreenProps) {
  const { theme } = useTheme();

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
  const documentItems = React.useMemo(() => resolvePartnerDocumentItems(draft), [draft]);

  const activeGroupId = getGroupIdForSectionId(activeSectionId);
  const activeGroupIndex = onboardingGroupOrder.indexOf(activeGroupId);
  const isLastGroup = activeGroupIndex === onboardingGroupOrder.length - 1;
  const canSubmit = missingItems.length === 0 && !readOnly;

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

  const setActiveGroup = React.useCallback((groupId: OnboardingGroupSectionId) => {
    const firstSubSectionId =
      groupId === 'basics_profile'
        ? 'basics'
        : groupId === 'location_media'
        ? 'location'
        : groupId === 'documents'
        ? 'documents'
        : 'offer';
    setActiveSection(firstSubSectionId);
  }, [setActiveSection]);

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

  const goToNextGroup = React.useCallback(() => {
    if (isLastGroup) {
      if (canSubmit) {
        onSubmitReview();
      }
      return;
    }
    setActiveGroup(onboardingGroupOrder[activeGroupIndex + 1]);
  }, [activeGroupIndex, canSubmit, isLastGroup, onSubmitReview, setActiveGroup]);

  const goToPreviousGroup = React.useCallback(() => {
    if (activeGroupIndex <= 0) {
      onBack();
      return;
    }
    setActiveGroup(onboardingGroupOrder[activeGroupIndex - 1]);
  }, [activeGroupIndex, onBack, setActiveGroup]);

  const errors = React.useMemo(() => validatePartnerOnboarding(draft), [draft]);

  // Extract media upload actions using our hook
  const { cameraLoading, docLoading, handlePickFile, handlePickDocument, isNativePickerAvailable } = useOnboardingMedia(
    store,
    changeDraftField as any,
  );

  const groupSummaries = React.useMemo(() => {
    const basicsSummary = sections.find((s) => s.id === 'basics') || { complete: false, missingCount: 0 };
    const classificationSummary = sections.find((s) => s.id === 'classification') || { complete: false, missingCount: 0 };
    const locationSummary = sections.find((s) => s.id === 'location') || { complete: false, missingCount: 0 };
    const photosSummary = sections.find((s) => s.id === 'photos') || { complete: false, missingCount: 0 };
    const documentsSummary = sections.find((s) => s.id === 'documents') || { complete: false, missingCount: 0 };
    const offerSummary = sections.find((s) => s.id === 'offer') || { complete: false, missingCount: 0 };
    const reviewSummary = sections.find((s) => s.id === 'review') || { complete: false, missingCount: 0 };

    return [
      {
        id: 'basics_profile' as const,
        label: 'بيانات المتجر الأساسية',
        complete: basicsSummary.complete,
        missingCount: basicsSummary.missingCount,
        subSectionIds: ['basics'] as FieldOnboardingSectionId[],
      },
      {
        id: 'location_media' as const,
        label: 'الموقع والصور الميدانية',
        complete: locationSummary.complete && photosSummary.complete,
        missingCount: locationSummary.missingCount + photosSummary.missingCount,
        subSectionIds: ['location', 'photos'] as FieldOnboardingSectionId[],
      },
      {
        id: 'documents' as const,
        label: 'المستندات والتراخيص الرسمية',
        complete: documentsSummary.complete,
        missingCount: documentsSummary.missingCount,
        subSectionIds: ['documents'] as FieldOnboardingSectionId[],
      },
      {
        id: 'agreement_review' as const,
        label: 'الاتفاق والمراجعة النهائية',
        complete: offerSummary.complete && reviewSummary.complete,
        missingCount: offerSummary.missingCount + reviewSummary.missingCount,
        subSectionIds: ['offer', 'review'] as FieldOnboardingSectionId[],
      },
    ];
  }, [sections]);

  const resolveGroupDescription = (groupId: OnboardingGroupSectionId, complete: boolean): string => {
    if (groupId === 'basics_profile') {
      return complete
        ? `${draft.basics.ownerName || 'المالك'}`
        : 'يتطلب استكمال البيانات الأساسية للمتجر';
    }
    if (groupId === 'location_media') {
      return complete
        ? `${draft.location.city || 'المدينة'} · تم رفع الصور`
        : 'يتطلب تحديد الموقع ورفع الصور الميدانية';
    }
    if (groupId === 'documents') {
      return complete
        ? 'تم التحقق من المستندات والتراخيص الرسمية'
        : 'يتطلب إرفاق المستندات والتراخيص الرسمية';
    }
    if (groupId === 'agreement_review') {
      return complete
        ? 'تمت صياغة العرض والاتفاق ومراجعة الميدان'
        : 'يتطلب إكمال العرض والاتفاق النهائي والمراجعة';
    }
    return '';
  };

  const renderGroupContent = (groupId: OnboardingGroupSectionId) => {
    if (groupId === 'basics_profile') {
      return (
        <Box gap={4}>
          <OnboardingBasicsStep
            draft={draft}
            readOnly={readOnly}
            errors={errors}
            changeDraftField={changeDraftField as any}
          />
        </Box>
      );
    }

    if (groupId === 'location_media') {
      return (
        <Box gap={4}>
          <OnboardingLocationStep
            draft={draft}
            readOnly={readOnly}
            errors={errors}
            changeDraftField={changeDraftField as any}
          />
          <Divider style={{ marginVertical: spacing[2] }} />
          <OnboardingPhotosStep
            draft={draft}
            readOnly={readOnly}
            errors={errors}
            cameraLoading={cameraLoading}
            isNativePickerAvailable={isNativePickerAvailable}
            handlePickFile={handlePickFile}
          />
        </Box>
      );
    }

    if (groupId === 'documents') {
      return (
        <OnboardingDocumentsStep
          store={store}
          documentItems={documentItems}
          onUploadDocument={(_, kind) => handlePickDocument(kind as any)}
          loadingMap={docLoading}
        />
      );
    }

    if (groupId === 'agreement_review') {
      return (
        <Box gap={4}>
          <OnboardingOfferStep
            draft={draft}
            readOnly={readOnly}
            errors={errors}
            changeDraftField={changeDraftField as any}
          />
          <Divider style={{ marginVertical: spacing[2] }} />
          <OnboardingReviewStep
            draft={draft}
            readOnly={readOnly}
            changeDraftField={changeDraftField as any}
            missingItems={missingItems}
          />
        </Box>
      );
    }

    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title={draft.basics.storeName || store.name || 'تأهيل متجر جديد'}
        actions={[{
          id: 'save',
          icon: <Icon name="save-outline" size={20} tone="brand" />,
          accessibilityLabel: 'حفظ المسودة',
          onPress: onSaveDraft,
        }]}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />
      <MobileScrollView fill padding={0} gap={0}>
        <Box padding={4} gap={4}>
          {/* Section 1: Store Header Brief (Flat design, no Card, no Badge) */}
          <Box gap={1} style={{ alignItems: 'flex-end', paddingHorizontal: spacing[3], paddingTop: spacing[1] }}>
            <Text role="titleSm" weight="black" style={{ textAlign: 'right' }}>
              {draft.basics.storeName || store.name || 'متجر غير مسمى'}
            </Text>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], marginTop: spacing[1] }}>
              <Icon name="location-outline" size={14} tone="muted" />
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {store.location}
              </Text>
            </View>
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: spacing[1] }}>
              {`آخر تحديث للملف: ${store.lastUpdatedLabel} · موعد الزيارة التالي: ${store.nextVisitLabel}`}
            </Text>
          </Box>

          <Divider />

          {/* Products upload callout for missing products */}
          {(!draft.products.items || draft.products.items.length === 0) && onGoToProducts && (
            <Card
              padding={3}
              style={{
                borderColor: theme.warning,
                borderWidth: 1.5,
                backgroundColor: theme.surfaceSecondary,
                marginBottom: spacing[2],
                borderRadius: radius.md,
              }}
            >
              <Box gap={2} style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                  <Icon name="alert-circle-outline" size={20} tone="warning" />
                  <Text role="bodyStrong" weight="black" style={{ color: theme.warning, textAlign: 'right', fontSize: 16 }}>
                    بانتظار رفع المنتجات الابتدائية
                  </Text>
                </View>
                <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: spacing[1] }}>
                  تم استكمال البيانات الأساسية والتراخيص، ولكن المتجر لا يعتبر جاهزاً للتفعيل حتى يتم رفع المنتجات الابتدائية للكتالوج.
                </Text>
                <Button
                  label="رفع المنتجات الابتدائية الآن"
                  tone="warning"
                  size="sm"
                  onPress={onGoToProducts}
                  style={{ marginTop: spacing[2], alignSelf: 'flex-start' }}
                />
              </Box>
            </Card>
          )}

          {/* Section 2: Stepped Vertical Timeline Accordion */}
          <Box gap={2}>
            {groupSummaries.map((group, index) => {
              const isActive = activeGroupId === group.id;
              const isComplete = group.complete;
              const groupMissing = group.missingCount;

              return (
                <View key={group.id} style={{ flexDirection: 'row-reverse', alignItems: 'stretch', marginVertical: 4 }}>
                  {/* Timeline Column */}
                  <View style={{ alignItems: 'center', width: 36, marginStart: spacing[3], position: 'relative' }}>
                    {index < groupSummaries.length - 1 && (
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
                      onPress={() => setActiveGroup(group.id)}
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
                      onPress={() => setActiveGroup(group.id)}
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
                          {group.label}
                        </Text>
                        {!isActive && (
                          <Text
                            role="caption"
                            tone={isComplete ? 'muted' : 'danger'}
                            style={{ textAlign: 'right' }}
                          >
                            {resolveGroupDescription(group.id, isComplete)}
                          </Text>
                        )}
                      </Box>
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                        {isComplete ? (
                          <Icon name="checkmark-circle" size={18} tone="success" />
                        ) : groupMissing > 0 ? (
                          <Badge label={`${groupMissing} ناقص`} tone="danger" />
                        ) : null}
                      </View>
                    </Pressable>

                    {isActive && (
                      <Box
                        gap={4}
                        style={{
                          marginTop: spacing[2],
                          marginBottom: spacing[4],
                          paddingHorizontal: spacing[2],
                        }}
                      >
                        <Divider />
                        {renderGroupContent(group.id)}
                        <Divider />
                      </Box>
                    )}
                  </View>
                </View>
              );
            })}
          </Box>


        </Box>
      </MobileScrollView>

      {/* Sleek Modern Bottom Navigation Bar */}
      <Box
        padding={3}
        layoutDirection="row"
        justify="space-between"
        align="center"
        gap={3}
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.line,
          backgroundColor: theme.surface,
          paddingBottom: Platform.OS === 'ios' ? spacing[4] + 12 : 48,
        }}
      >
        {onEscalate && missingItems.length > 0 && !readOnly && (
          <Button
            tone="secondary"
            onPress={onEscalate}
            style={{
              flex: 1,
              backgroundColor: theme.surface,
              borderColor: theme.brand,
              borderWidth: 1,
            }}
          >
            <Text role="bodyStrong" weight="black" style={{ color: theme.brand }}>
              تصعيد عائق
            </Text>
          </Button>
        )}
        {readOnly ? (
          <Box layoutDirection="row" gap={2} style={{ flex: 2 }}>
            <Button
              label="العودة للمتاجر"
              tone="secondary"
              onPress={onBack}
              style={{ flex: 1 }}
            />
            {store.backendStoreId && onGoToVisit && (
              <Button
                label="متابعة اختيارية (زيارة)"
                tone="success"
                onPress={onGoToVisit}
                style={{ flex: 1 }}
              />
            )}
          </Box>
        ) : (
          <Button
            label={isLastGroup ? 'إرسال للمراجعة' : `التالي: ${onboardingGroupLabels[onboardingGroupOrder[activeGroupIndex + 1]]}`}
            tone={canSubmit && isLastGroup ? 'success' : 'brand'}
            disabled={isLastGroup ? !canSubmit : false}
            onPress={goToNextGroup}
            style={{ flex: 2 }}
          />
        )}
      </Box>
    </View>
  );
}

export default DshFieldStoreOnboardingScreen;
