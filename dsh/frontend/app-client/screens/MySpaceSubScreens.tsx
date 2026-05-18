import React from 'react';
import {
  DshBenefitsHubScreen,
  type DshBenefitsInitialSection,
} from './BenefitsScreen';
import { DshOperationScreen, type DshOperationScreenState } from '../parts/OperationScreen';

export type DshMySpaceSubScreenProps = {
  state?: DshOperationScreenState;
  onRetry?: () => void;
  onBack?: () => void;
};

export function DshWalletHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="المحفظة"
      subtitle="الرصيد، الاسترداد، وطرق الدفع"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshLoyaltyHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('loyalty', { state, onRetry, onBack });
}

function renderBenefitsCompatibilityScreen(
  initialSection: DshBenefitsInitialSection,
  props: DshMySpaceSubScreenProps,
) {
  const { onBack, onRetry, state = 'ready' } = props;

  return (
    <DshBenefitsHubScreen
      initialSection={initialSection}
      onBack={onBack}
      onRetry={onRetry}
      state={state}
    />
  );
}

export function DshSubscriptionsHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('subscription', { state, onRetry, onBack });
}

export function DshAddressesHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="العناوين المحفوظة"
      subtitle="إدارة مواقع التوصيل والاستلام"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshLocationHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="الموقع الحالي"
      subtitle="تحديد وتحديث موقعك الميداني"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshIdentityHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="الملف الشخصي"
      subtitle="البيانات الشخصية والأمان"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshCommercialHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return renderBenefitsCompatibilityScreen('offers', { state, onRetry, onBack });
}

export function DshAppearanceHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="المظهر"
      subtitle="فاتح أبيض أو داكن زجاجي"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshPreferencesHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="تفضيلات التوصيل"
      subtitle="إعدادات خاصة بالتسليم والاستبدال"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}
