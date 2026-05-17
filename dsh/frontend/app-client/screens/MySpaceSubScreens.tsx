import React from 'react';
import { View } from 'react-native';
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
  return (
    <DshOperationScreen
      state={state}
      title="الولاء والمكافآت"
      subtitle="رصيد النقاط والمزايا المتاحة"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
}

export function DshSubscriptionsHubScreen({ state = 'ready', onRetry, onBack }: DshMySpaceSubScreenProps) {
  return (
    <DshOperationScreen
      state={state}
      title="الاشتراكات"
      subtitle="إدارة الباقات والخصومات الدورية"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
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
  return (
    <DshOperationScreen
      state={state}
      title="العروض الترويجية"
      subtitle="الحملات والخصومات المباشرة"
      primaryActionLabel="العودة لمساحتي"
      onPrimaryAction={onBack}
      onRetry={onRetry}
    />
  );
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
