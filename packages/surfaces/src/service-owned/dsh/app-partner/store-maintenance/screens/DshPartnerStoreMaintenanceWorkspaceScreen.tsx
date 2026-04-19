import React from 'react';
import {
  BthBox,
  BthButton,
  BthKeyValueList,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthSwitch,
  BthText,
} from '@bthwani/ui-kit';

export type DshPartnerStoreMaintenanceWorkspaceState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshPartnerStoreMaintenanceProfile = {
  storeName: string;
  branchLabel: string;
  cityLabel: string;
  managerLabel: string;
  todayHoursLabel: string;
  activeZoneLabel: string;
};

export type DshPartnerServiceMode = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type DshPartnerStoreMaintenanceWorkspaceScreenProps = {
  state?: DshPartnerStoreMaintenanceWorkspaceState;
  profile?: DshPartnerStoreMaintenanceProfile;
  serviceModes?: DshPartnerServiceMode[];
  listingEnabled?: boolean;
  storeOpen?: boolean;
  onToggleListingEnabled?: (nextValue: boolean) => void;
  onToggleStoreOpen?: (nextValue: boolean) => void;
  onToggleServiceMode?: (modeId: string, nextValue: boolean) => void;
  onOpenHours?: () => void;
  onOpenZones?: () => void;
  onOpenDeliveryBoard?: () => void;
  onOpenSupportDirectory?: () => void;
  onSave?: () => void;
  onRetry?: () => void;
};

const demoProfile: DshPartnerStoreMaintenanceProfile = {
  storeName: 'Burger Lab',
  branchLabel: 'Yasmin branch',
  cityLabel: 'Riyadh',
  managerLabel: 'Khaled A.',
  todayHoursLabel: '09:00 - 23:30',
  activeZoneLabel: 'Yasmin + Al Malqa',
};

const demoServiceModes: DshPartnerServiceMode[] = [
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'Accept delivery demand and keep captain handoff open.',
    enabled: true,
  },
  {
    id: 'pickup',
    label: 'Pickup',
    description: 'Expose pickup-only capacity without slowing the delivery branch flow.',
    enabled: true,
  },
  {
    id: 'scheduled',
    label: 'Scheduled orders',
    description: 'Allow future slots when the branch team can commit to preparation timing.',
    enabled: false,
  },
];

function renderState(state: Exclude<DshPartnerStoreMaintenanceWorkspaceState, 'ready' | 'disabled'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="لا يوجد ملف فرع محمّل"
        description="أعد تحميل مساحة الصيانة قبل تغيير التوفر أو القنوات أو أوقات العمل."
        actionLabel={onRetry ? 'إعادة التحميل' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  if (state === 'offline') {
    return (
      <BthStateView
        stateId="offline"
        title="مساحة الصيانة غير متصلة"
        description="أعد المحاولة عندما تعود الشبكة مع إبقاء سياق الفرع محفوظًا."
        actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="تعذر فتح مساحة الصيانة"
      description="أعد المحاولة دون فقدان سياق الفرع الحالي."
      actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
      onActionPress={onRetry}
    />
  );
}

export function DshPartnerStoreMaintenanceWorkspaceScreen({
  state = 'ready',
  profile = demoProfile,
  serviceModes = demoServiceModes,
  listingEnabled = true,
  storeOpen = true,
  onToggleListingEnabled,
  onToggleStoreOpen,
  onToggleServiceMode,
  onOpenHours,
  onOpenZones,
  onOpenDeliveryBoard,
  onOpenSupportDirectory,
  onSave,
  onRetry,
}: DshPartnerStoreMaintenanceWorkspaceScreenProps) {
  if (state !== 'ready' && state !== 'disabled') {
    return renderState(state, onRetry);
  }

  const isDisabled = state === 'disabled';

  return (
    <BthMobileScrollView padding={4} gap={4}>
      <BthBox gap={2}>
        <BthText role="titleLg">مساحة صيانة الفرع</BthText>
        <BthText role="bodyMd" tone="muted">
          تبقى حالة المتجر والقنوات والأوقات والمناطق في مساحة واحدة واضحة وسريعة.
        </BthText>
      </BthBox>

      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader title="ملف الفرع" subtitle="ابدأ من ملخص واضح واحد قبل أي تعديل تشغيلي." />
        <BthKeyValueList
          items={[
            { label: 'المتجر', value: profile.storeName },
            { label: 'الفرع', value: profile.branchLabel },
            { label: 'المدينة', value: profile.cityLabel },
            { label: 'المدير', value: profile.managerLabel },
            { label: 'أوقات اليوم', value: profile.todayHoursLabel },
            { label: 'منطقة التغطية', value: profile.activeZoneLabel, tone: 'brand' },
          ]}
        />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="حالة التوفر" subtitle="التشغيل والظهور منفصلان حتى تبقى القرارات واضحة." />
        <BthSwitch
          label="المتجر مفتوح"
          description="يتحكم في استقبال أعمال DSH الجديدة لهذا الفرع."
          value={storeOpen}
          disabled={isDisabled}
          onValueChange={onToggleStoreOpen}
        />
        <BthSwitch
          label="الظهور في القوائم"
          description="يتحكم في ظهور الفرع للمستخدمين دون تغيير هوية المتجر."
          value={listingEnabled}
          disabled={isDisabled}
          onValueChange={onToggleListingEnabled}
        />
      </BthSurface>

      <BthSurface tone="default" gap={3}>
        <BthSectionHeader title="قنوات الخدمة" subtitle="كل قناة لها مفتاح مستقل حتى يبقى السجل التشغيلي واضحًا." />
        <BthBox gap={2}>
          {serviceModes.map((mode) => (
            <BthSwitch
              key={mode.id}
              label={mode.label}
              description={mode.description}
              value={mode.enabled}
              disabled={isDisabled}
              onValueChange={(nextValue) => onToggleServiceMode?.(mode.id, nextValue)}
            />
          ))}
        </BthBox>
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="إجراءات الفرع" subtitle="الأوقات والمناطق والعمليات تبقى خطوة واحدة بعيدة." />
        <BthBox gap={2}>
          <BthButton label="تحديث أوقات العمل" tone="secondary" onPress={onOpenHours} disabled={isDisabled} />
          <BthButton label="تحديث مناطق التغطية" tone="secondary" onPress={onOpenZones} disabled={isDisabled} />
          <BthButton label="فتح لوحة العمليات" tone="ghost" onPress={onOpenDeliveryBoard} disabled={isDisabled} />
          <BthButton label="فتح دليل الدعم" tone="ghost" onPress={onOpenSupportDirectory} disabled={isDisabled} />
        </BthBox>
      </BthSurface>

      <BthButton label="حفظ التغييرات" onPress={onSave} disabled={isDisabled} />
    </BthMobileScrollView>
  );
}

export default DshPartnerStoreMaintenanceWorkspaceScreen;
