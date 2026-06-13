import React from 'react';
import { useAppFieldAppearance } from '../../../../app-field/shell/appearance';
import {
  DshFieldStoreOnboardingScreen,
} from './DshFieldStoreOnboardingScreen';
import {
  DshFieldStoreVisitScreen,
  type DshFieldStoreVisitErrors,
  type DshFieldStoreVisitValues,
} from './DshFieldStoreVisitScreen';
import { DshFieldProfileHomeScreen } from './DshFieldProfileHomeScreen';
import { DshFieldProfileScreen } from './DshFieldProfileScreen';
import { DshFieldStoresHistoryScreen } from './DshFieldStoresHistoryScreen';
import { DshFieldFinanceScreen } from './DshFieldFinanceScreen';
import { DshFieldDocumentUploadScreen } from './DshFieldDocumentUploadScreen';
import { DshFieldReadinessEscalationScreen } from './DshFieldReadinessEscalationScreen';
import { DshFieldStoresScreen } from './DshFieldStoresScreen';
import {
  submitFieldStoreForReview,
  touchFieldStoreDraft,
  type FieldStoreFile,
} from '../../shared/contracts/field-store-model';
import { applyFieldDocumentUploadToStore } from '../../shared';
import { getFieldRouteForLifecycle } from '../dsh-field.navigation-bridge';
import type { DshFieldRouteState } from '../dsh-field.types';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';

type EscalationState = NonNullable<React.ComponentProps<typeof DshFieldReadinessEscalationScreen>['state']>;

const DEFAULT_ESCALATION_TARGET = 'partner-management';
const ESCALATION_TARGETS = [
  { id: 'partner-management', label: 'قسم الشركاء (Partner Management)' },
  { id: 'control-panel', label: 'لوحة التحكم المركزية (Control Panel)' },
  { id: 'marketing', label: 'فريق التسويق (Marketing)' },
];

type Props = {
  route: DshFieldRouteState;
  stores: FieldStoreFile[];
  activeStore: FieldStoreFile | null;
  visitValues: Record<string, DshFieldStoreVisitValues>;
  visitErrors: Record<string, DshFieldStoreVisitErrors>;
  selectedEscalationTargetByStore: Record<string, string>;
  readinessEscalationStateByStore: Record<string, EscalationState>;
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  onAppearanceModeChange: (mode: BThwaniAppearanceMode) => void;
  fieldRuntime: {
    createStoreFromDraft: (store: FieldStoreFile) => Promise<void>;
    submitVisit: (storeId: string, values: DshFieldStoreVisitValues) => Promise<void>;
    submitDocument: (storeId: string, kind: string, ref: string) => Promise<void>;
  };
  pushRoute: (route: DshFieldRouteState) => void;
  popRoute: () => void;
  resetToStores: () => void;
  patchStore: (storeId: string, updater: (store: FieldStoreFile) => FieldStoreFile) => void;
  handleCreateStore: () => void;
  setVisitValues: React.Dispatch<React.SetStateAction<Record<string, DshFieldStoreVisitValues>>>;
  setVisitErrors: React.Dispatch<React.SetStateAction<Record<string, DshFieldStoreVisitErrors>>>;
  setSelectedEscalationTargetByStore: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setReadinessEscalationStateByStore: React.Dispatch<React.SetStateAction<Record<string, EscalationState>>>;
};

export function DshFieldRouteRenderer({
  route,
  stores,
  activeStore,
  visitValues,
  visitErrors,
  selectedEscalationTargetByStore,
  readinessEscalationStateByStore,
  appearanceHydrated,
  appearanceMode,
  onAppearanceModeChange,
  fieldRuntime,
  pushRoute,
  popRoute,
  resetToStores,
  patchStore,
  handleCreateStore,
  setVisitValues,
  setVisitErrors,
  setSelectedEscalationTargetByStore,
  setReadinessEscalationStateByStore,
}: Props): React.ReactElement {
  if (route.kind === 'onboarding' && activeStore) {
    return (
      <DshFieldStoreOnboardingScreen
        store={activeStore}
        onBack={popRoute}
        onUploadDocument={(storeId) => pushRoute({ kind: 'document-upload', storeId })}
        onStoreChange={(updater) => patchStore(activeStore.id, updater)}
        onSaveDraft={() => patchStore(activeStore.id, (store) => ({ ...store, lastUpdatedLabel: 'الآن', draft: { ...store.draft, lastSavedLabel: 'الآن' } }))}
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
          setVisitErrors((cur) => {
            const next = { ...cur[activeStore.id] };
            delete next[field as keyof typeof next];
            return { ...cur, [activeStore.id]: next };
          });
        }}
        onSubmit={() => {
          const nextValues = visitValues[activeStore.id] ?? values;
          const nextErrors: DshFieldStoreVisitErrors = {};
          if (!nextValues.visitSummary.trim()) nextErrors.visitSummary = 'اكتب ملخص الزيارة قبل الإرسال.';
          if (!nextValues.followUpAction.trim()) nextErrors.followUpAction = 'حدد خطوة المتابعة قبل الإرسال.';
          if (nextErrors.visitSummary || nextErrors.followUpAction) { setVisitErrors((cur) => ({ ...cur, [activeStore.id]: nextErrors })); return; }
          void fieldRuntime.submitVisit(activeStore.id, nextValues).catch(() => {});
          patchStore(activeStore.id, (store) => ({
            ...store,
            lifecycleNote: nextValues.visitSummary.trim() || store.lifecycleNote,
            reviewFeedback: nextValues.followUpAction.trim() || store.reviewFeedback,
            lastUpdatedLabel: 'الآن',
          }));
          const _completedRoute = getFieldRouteForLifecycle('visit_completed').primaryRoute;
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
        onAppearanceModeChange={onAppearanceModeChange}
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
          patchStore(activeStore.id, (store) => applyFieldDocumentUploadToStore(store, kind, uploadedRef));
        }}
      />
    );
  }

  if (route.kind === 'readiness-escalation' && activeStore) {
    const selectedTargetId = selectedEscalationTargetByStore[activeStore.id] ?? DEFAULT_ESCALATION_TARGET;
    const escalationState = readinessEscalationStateByStore[activeStore.id] ?? 'ready';
    const targets = ESCALATION_TARGETS.map((t) => ({ ...t, isSelected: t.id === selectedTargetId }));
    return (
      <DshFieldReadinessEscalationScreen
        state={escalationState}
        storeName={activeStore.name}
        missingRequirements={['التحقق من إعداد موصل المتجر إذا طلب الشريك تفعيل توصيل المتجر (partner_delivery)']}
        escalationTargets={targets}
        onSelectTarget={(id) => setSelectedEscalationTargetByStore((cur) => ({ ...cur, [activeStore.id]: id }))}
        onSubmit={(reason) => {
          const target = targets.find((t) => t.id === selectedTargetId);
          const label = target?.label ?? 'قسم الشركاء (Partner Management)';
          patchStore(activeStore.id, (store) => touchFieldStoreDraft({
            ...store,
            lockedStatus: 'follow-up-required',
            statusNoteOverride: `بانتظار رد ${label}`,
            reviewFeedback: reason.trim() || store.reviewFeedback,
            draft: { ...store.draft, review: { ...store.draft.review, partnerReviewNote: reason.trim() || store.draft.review.partnerReviewNote } },
          }, `تم تصعيد عائق الجاهزية إلى ${label}.`));
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
