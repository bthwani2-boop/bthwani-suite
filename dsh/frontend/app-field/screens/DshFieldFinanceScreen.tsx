import React from 'react';
import { StateView } from '@bthwani/ui-kit';
import { WltDshFieldBridge } from '../../../../wlt/frontend/dsh/app-field';
import { resolveFieldStoreStatus, type FieldStoreFile } from '../../shared/field-store-model';

type DshFieldFinanceScreenProps = {
  state?: 'ready' | 'loading' | 'error' | 'offline';
  stores: readonly FieldStoreFile[];
  onBack: () => void;
  onRetry?: () => void;
};

export function DshFieldFinanceScreen({ state = 'ready', stores, onBack, onRetry }: DshFieldFinanceScreenProps) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل البيانات المالية" description="نحسب المستحقات والعمولات للملفات المعتمدة." />;
  }

  if (state === 'error' || state === 'offline') {
    return (
      <StateView
        stateId={state === 'offline' ? 'offline' : 'recoverableError'}
        title="تعذر الوصول للبيانات المالية"
        description="تحقق من الاتصال بالخادم لمراجعة المستحقات الميدانية."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  const eligibleStoreIds = stores
    .filter((store) => resolveFieldStoreStatus(store) === 'offer-approved')
    .map((store) => store.id);

  return <WltDshFieldBridge storeIds={eligibleStoreIds} onBack={onBack} />;
}

export default DshFieldFinanceScreen;
