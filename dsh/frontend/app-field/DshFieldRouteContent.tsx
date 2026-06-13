import React from 'react';
import { DshFieldStoresScreen } from './screens/DshFieldStoresScreen';
import { DshFieldStoreOnboardingScreen } from './screens/DshFieldStoreOnboardingScreen';
import {
  DshFieldStoreVisitScreen,
  type DshFieldStoreVisitErrors,
  type DshFieldStoreVisitValues,
} from './screens/DshFieldStoreVisitScreen';
import { DshFieldProfileHomeScreen } from './screens/DshFieldProfileHomeScreen';
import { DshFieldProfileScreen } from './screens/DshFieldProfileScreen';
import { DshFieldStoresHistoryScreen } from './screens/DshFieldStoresHistoryScreen';
import { DshFieldFinanceScreen } from './screens/DshFieldFinanceScreen';
import { DshFieldDocumentUploadScreen } from './screens/DshFieldDocumentUploadScreen';
import { DshFieldReadinessEscalationScreen } from './screens/DshFieldReadinessEscalationScreen';
import {
  submitFieldStoreForReview,
  touchFieldStoreDraft,
  type FieldStoreFile,
} from '../shared/contracts/field-store-model';
import { applyFieldDocumentUploadToStore } from '../shared';
import { getFieldRouteForLifecycle } from './dsh-field.navigation-bridge';
import type { DshFieldRouteState } from './dsh-field.types';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';

type DshFieldReadinessEscalationState = NonNullable<React.ComponentProps<typeof DshFieldReadinessEscalationScreen>['state']>;

type FieldRuntime = {
  createStoreFromDraft: (store: FieldStoreFile) => Promise<void>;
  submitVisit: (storeId: string, values: DshFieldStoreVisitValues) => Promise<void>;
  submitDocument: (storeId: string, kind: string, ref: string) => Promise<void>;
};

const DEFAULT_FIELD_ESCALATION_TARGET_ID = 'partner-management';

type Props = {
  route: DshFieldRouteState;
  stores: FieldStoreFile[];
  activeStore: FieldStoreFile | null;
  visitValues: Record<string, DshFieldStoreVisitValues>;
  visitErrors: Record<string, DshFieldStoreVisitErrors>;
  selectedEscalationTargetByStore: Record<string, string>;
  readinessEscalationStateByStore: Record<string, DshFieldReadinessEscalationState>;
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  onSetAppearanceMode: (mode: BThwaniAppearanceMode) => void;
  fieldRuntime: FieldRuntime;
  pushRoute: (r: DshFieldRouteState) => void;
  popRoute: () => void;
  patchStore: (storeId: string, updater: (s: FieldStoreFile) => FieldStoreFile) => void;
  setVisitValues: (updater: (v: Record<string, DshFieldStoreVisitValues>) => Record<string, DshFieldStoreVisitValues>) => void;
  setVisitErrors: (updater: (v: Record<string, DshFieldStoreVisitErrors>) => Record<string, DshFieldStoreVisitErrors>) => void;
  setSelectedEscalationTargetByStore: (updater: (v: Record<string, string>) => Record<string, string>) => void;
  setReadinessEscalationStateByStore: (updater: (v: Record<string, DshFieldReadinessEscalationState>) => Record<string, DshFieldReadinessEscalationState>) => void;
  resetToStores: () => void;
  handleCreateStore: () => void;
};

export function DshFieldRouteContent({
  route, stores, activeStore, visitValues, visitErrors,
  selectedEscalationTargetByStore, readinessEscalationStateByStore,
  appearanceHydrated, appearanceMode, onSetAppearanceMode, fieldRuntime,
  pushRoute, popRoute, patchStore, setVisitValues, setVisitErrors,
  setSelectedEscalationTargetByStore, setReadinessEscalationStateByStore,
  resetToStores, handleCreateStore,
}: Props) {
  if (route.kind === 'onboarding' && activeStore) {
    return (
      <DshFieldStoreOnboardingScreen
        store={activeStore}
        onBack={popRoute}
        onUploadDocument={(storeId) => pushRoute({ kind: 'document-upload', storeId })}
        onStoreChange={(updater) => patchStore(activeStore.id, updater)}
        onSaveDraft={() => patchStore(activeStore.id, (s) => ({ ...s, lastUpdatedLabel: 'الآن', draft: { ...s.draft, lastSavedLabel: 'الآن' } }))}
        onSubmitReview={() => {
          void fieldRuntime.createStoreFromDraft(activeStore).catch(() => {});
          patchStore(activeStore.id, submitFieldStoreForReview);
          pushRoute({ kind: 'visit', storeId: activeStore.id });
        }}
        onEscalate={() => pushRoute({ kind: 'readiness-escalation', storeId: activeStore.id })}
      />
    );
  }

  if (route.kind === 'visit' && activeStore) {
    const values = visitValues[activeStore.id] ?? { visitSummary: '', followUpAction: '' };
    return (
      <DshFieldStoreVisitScreen
        values={values}
        errors={visitErrors[activeStore.id]}
        onRetry={popRoute}
        onChange={(field, value) => {
          setVisitValues((cur) => ({ ...cur, [activeStore.id]: { ...values, [field]: value } }));
          setVisitErrors((cur) => { const next = { ...cur[activeStore.id] }; delete next[field as keyof typeof next]; return { ...cur, [activeStore.id]: next }; });
        }}
        onSubmit={() => {
          const next = visitValues[activeStore.id] ?? values;
          const errors: DshFieldStoreVisitErrors = {};
          if (!next.visitSummary.trim()) errors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
          if (!next.followUpAction.trim()) errors.followUpAction = 'حدد خطوة المتابعة قبل الإرسال.';
          if (errors.visitSummary || errors.followUpAction) { setVisitErrors((cur) => ({ ...cur, [activeStore.id]: errors })); return; }
          void fieldRuntime.submitVisit(activeStore.id, next).catch(() => {});
          patchStore(activeStore.id, (s) => ({ ...s, lifecycleNote: next.visitSummary.trim() || s.lifecycleNote, reviewFeedback: next.followUpAction.trim() || s.reviewFeedback, lastUpdatedLabel: 'الآن' }));
          void getFieldRouteForLifecycle('visit_completed').primaryRoute;
          pushRoute({ kind: 'history' });
        }}
      />
    );
  }

  if (route.kind === 'account') {
    return (
      <DshFieldProfileHomeScreen
        stores={stores}
        appearanceHydrated={appearanceHydrated}
        appearanceMode={appearanceMode}
        onAppearanceModeChange={onSetAppearanceMode}
        onBack={popRoute}
        onOpenProfile={() => pushRoute({ kind: 'profile' })}
        onOpenHistory={() => pushRoute({ kind: 'history' })}
        onOpenFinance={() => pushRoute({ kind: 'finance' })}
        onLogout={resetToStores}
      />
    );
  }

  if (route.kind === 'profile') return <DshFieldProfileScreen onBack={popRoute} />;
  if (route.kind === 'history') return <DshFieldStoresHistoryScreen stores={stores} onBack={popRoute} />;
  if (route.kind === 'finance') return <DshFieldFinanceScreen stores={stores} onBack={popRoute} />;

  if (route.kind === 'document-upload' && activeStore) {
    return (
      <DshFieldDocumentUploadScreen
        storeId={activeStore.id}
        onBack={popRoute}
        onSubmit={async (kind, uploadedRef) => {
          await fieldRuntime.submitDocument(activeStore.id, kind, uploadedRef);
          patchStore(activeStore.id, (s) => applyFieldDocumentUploadToStore(s, kind, uploadedRef));
        }}
      />
    );
  }

  if (route.kind === 'readiness-escalation' && activeStore) {
    const selectedTargetId = selectedEscalationTargetByStore[activeStore.id] ?? DEFAULT_FIELD_ESCALATION_TARGET_ID;
    const escalationState = readinessEscalationStateByStore[activeStore.id] ?? 'ready';
    const targets = [
      { id: 'partner-management', label: 'قسم الشركاء (Partner Management)' },
      { id: 'control-panel', label: 'لوحة التحكم المركزية (Control Panel)' },
      { id: 'marketing', label: 'فريق التسويق (Marketing)' },
    ].map((t) => ({ ...t, isSelected: t.id === selectedTargetId }));

    return (
      <DshFieldReadinessEscalationScreen
        state={escalationState}
        storeName={activeStore.name}
        missingRequirements={['التحقق من إعداد موصل المتجر إذا طلب الشريك تفعيل توصيل المتجر (partner_delivery)']}
        escalationTargets={targets}
        onSelectTarget={(id) => setSelectedEscalationTargetByStore((cur) => ({ ...cur, [activeStore.id]: id }))}
        onSubmit={(reason) => {
          const target = targets.find((t) => t.id === selectedTargetId);
          const targetLabel = target?.label ?? 'قسم الشركاء (Partner Management)';
          patchStore(activeStore.id, (s) => touchFieldStoreDraft({ ...s, lockedStatus: 'follow-up-required', statusNoteOverride: `بانتظار رد ${targetLabel}`, reviewFeedback: reason.trim() || s.reviewFeedback, draft: { ...s.draft, review: { ...s.draft.review, partnerReviewNote: reason.trim() || s.draft.review.partnerReviewNote } } }, `تم تصعيد عائق الجاهزية إلى ${targetLabel}.`));
          setReadinessEscalationStateByStore((cur) => ({ ...cur, [activeStore.id]: 'pending-response' }));
        }}
        onBack={popRoute}
        onRetry={() => setReadinessEscalationStateByStore((cur) => ({ ...cur, [activeStore.id]: 'ready' }))}
      />
    );
  }

  return (
    <DshFieldStoresScreen
      stores={stores}
      onOpenStore={(storeId) => pushRoute({ kind: 'onboarding', storeId })}
      onOpenAccount={() => pushRoute({ kind: 'account' })}
      onCreateStore={handleCreateStore}
    />
  );
}
