import * as React from 'react';
import { View } from 'react-native';
import { StateView } from '@bthwani/ui-kit';

export function StoreNonReadyState({
  state,
  storeText,
  onRetry,
  screenBackground,
  styles,
}: any) {
  if (state === 'loading') {
    return (
      <View style={[styles.blockingState, { backgroundColor: screenBackground }]}>
        <StateView stateId="loading" />
      </View>
    );
  }

  if (state === 'empty') {
    return (
      <View style={[styles.blockingState, { backgroundColor: screenBackground }]}>
        <StateView
          stateId="empty"
          title={storeText.states.storeEmptyTitle}
          description={storeText.states.storeEmptyDescription}
        />
      </View>
    );
  }

  if (state === 'not-found') {
    return (
      <View style={[styles.blockingState, { backgroundColor: screenBackground }]}>
        <StateView
          stateId="blockingError"
          title="المتجر غير موجود"
          description="عذراً، لم نتمكن من العثور على المتجر المطلوب في نظام الاستكشاف."
        />
      </View>
    );
  }

  if (state === 'offline') {
    return (
      <View style={[styles.blockingState, { backgroundColor: screenBackground }]}>
        <StateView
          stateId="recoverableError"
          title="أنت غير متصل بالشبكة"
          description="يرجى التحقق من اتصال الإنترنت ثم إعادة المحاولة."
          actionLabel={storeText.states.retry}
          onActionPress={onRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.blockingState, { backgroundColor: screenBackground }]}>
      <StateView
        stateId="recoverableError"
        title={storeText.states.storeErrorTitle}
        description={storeText.states.storeErrorDescription}
        actionLabel={storeText.states.retry}
        onActionPress={onRetry}
      />
    </View>
  );
}

export function StoreMissingState({ storeText }: any) {
  return (
    <StateView
      stateId="blockingError"
      title={storeText.states.contextMissingTitle}
      description={storeText.states.contextMissingDescription}
    />
  );
}

export function StoreVisibilityBlockedState({ storeVisibility, onBack }: any) {
  return (
    <StateView
      stateId="blockingError"
      title="المتجر غير متاح للعميل الآن"
      description={storeVisibility.blockedReason ?? 'لم يجتز هذا المتجر بوابة الظهور الكاملة بعد.'}
      actionLabel={onBack ? 'العودة' : undefined}
      onActionPress={onBack}
    />
  );
}
