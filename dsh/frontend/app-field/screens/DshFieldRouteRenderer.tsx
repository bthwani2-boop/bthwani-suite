import React from 'react';
import { useAppFieldAppearance } from '../../../../app-field/shell/appearance';
import {
  DshFieldStoreOnboardingScreen,
} from './DshFieldStoreOnboardingScreen';
import {
  DshFieldStoreVisitScreen,
} from './DshFieldStoreVisitScreen';
import { DshFieldProfileHomeScreen } from './DshFieldProfileHomeScreen';
import { DshFieldProfileScreen } from './DshFieldProfileScreen';
import { DshFieldStoresHistoryScreen } from './DshFieldStoresHistoryScreen';
import { DshFieldFinanceScreen } from './DshFieldFinanceScreen';
import { DshFieldDocumentUploadScreen } from './DshFieldDocumentUploadScreen';
import { DshFieldReadinessEscalationScreen } from './DshFieldReadinessEscalationScreen';
import { DshFieldStoresScreen } from './DshFieldStoresScreen';
import type { useDshFieldSurfaceModel } from '../field.surface-model';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';

type FieldSurfaceBinding = ReturnType<typeof useDshFieldSurfaceModel>;

type Props = {
  model: FieldSurfaceBinding['model'];
  actions: FieldSurfaceBinding['actions'];
  appearanceHydrated: boolean;
  appearanceMode: BThwaniAppearanceMode;
  onAppearanceModeChange: (mode: BThwaniAppearanceMode) => void;
};

export function DshFieldRouteRenderer({
  model,
  actions,
  appearanceHydrated,
  appearanceMode,
  onAppearanceModeChange,
}: Props): React.ReactElement {
  const { route, stores, activeStore, visitValues, visitErrors, readinessEscalationStateByStore } = model;
  if (route.kind === 'onboarding' && activeStore) {
    return (
      <DshFieldStoreOnboardingScreen
        store={activeStore}
        onBack={actions.popRoute}
        onUploadDocument={(storeId, kind) => actions.pushRoute({ kind: 'document-upload', storeId, docKind: kind })}
        onStoreChange={(updater) => actions.patchStore(activeStore.id, updater)}
        onSaveDraft={() => actions.handleSaveDraft(activeStore.id)}
        onSubmitReview={() => actions.handleSubmitReview(activeStore)}
        onEscalate={() => actions.pushRoute({ kind: 'readiness-escalation', storeId: activeStore.id })}
      />
    );
  }

  if (route.kind === 'visit' && activeStore) {
    const values = visitValues[activeStore.id] ?? { visitSummary: '', followUpAction: '' };
    return (
      <DshFieldStoreVisitScreen
        values={values}
        errors={visitErrors[activeStore.id]}
        onRetry={actions.popRoute}
        onChange={(field, value) => actions.handleVisitValueChange(activeStore.id, values, field, value)}
        onSubmit={() => actions.handleVisitSubmit(activeStore, values)}
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
        onBack={actions.popRoute}
        onOpenProfile={() => actions.pushRoute({ kind: 'profile' })}
        onOpenHistory={() => actions.pushRoute({ kind: 'history' })}
        onOpenFinance={() => actions.pushRoute({ kind: 'finance' })}
        onLogout={actions.resetToStores}
      />
    );
  }

  if (route.kind === 'profile') return <DshFieldProfileScreen onBack={actions.popRoute} />;
  if (route.kind === 'history') return <DshFieldStoresHistoryScreen stores={stores} onBack={actions.popRoute} />;
  if (route.kind === 'finance') return <DshFieldFinanceScreen stores={stores} onBack={actions.popRoute} />;

  if (route.kind === 'document-upload' && activeStore) {
    return (
      <DshFieldDocumentUploadScreen
        storeId={activeStore.id}
        docKind={route.docKind}
        onBack={actions.popRoute}
        onSubmit={(kind, uploadedRef) => actions.handleDocumentUpload(activeStore, kind, uploadedRef)}
      />
    );
  }

  if (route.kind === 'readiness-escalation' && activeStore) {
    const escalationState = readinessEscalationStateByStore[activeStore.id] ?? 'ready';
    const targets = actions.resolveEscalationTargets(activeStore.id);
    return (
      <DshFieldReadinessEscalationScreen
        state={escalationState}
        storeName={activeStore.name}
        missingRequirements={['التحقق من إعداد موصل المتجر إذا طلب الشريك تفعيل توصيل المتجر (partner_delivery)']}
        escalationTargets={targets}
        onSelectTarget={(id) => actions.handleEscalationTargetSelect(activeStore.id, id)}
        onSubmit={(reason) => actions.handleEscalationSubmit(activeStore, reason)}
        onBack={actions.popRoute}
        onRetry={() => actions.handleEscalationRetry(activeStore.id)}
      />
    );
  }

  return (
    <DshFieldStoresScreen
      stores={stores}
      onOpenStore={(storeId) => actions.pushRoute({ kind: 'onboarding', storeId })}
      onOpenAccount={() => actions.pushRoute({ kind: 'account' })}
      onCreateStore={actions.handleCreateStore}
    />
  );
}
