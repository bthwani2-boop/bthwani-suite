import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  MobileScrollView,
  SectionHeader,
  StateView,
  Surface,
  Switch,
  Text,
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
    return <StateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <StateView
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
      <StateView
        stateId="offline"
        title="مساحة الصيانة غير متصلة"
        description="أعد المحاولة عندما تعود الشبكة مع إبقاء سياق الفرع محفوظًا."
        actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
        onActionPress={onRetry}
      />
    );
  }

  return (
    <StateView
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
    <MobileScrollView padding={4} gap={4}>
      <Box gap={2}>
        <Text role="titleLg">مساحة صيانة الفرع</Text>
        <Text role="bodyMd" tone="muted">
          تبقى حالة المتجر والقنوات والأوقات والمناطق في مساحة واحدة واضحة وسريعة.
        </Text>
      </Box>

      <Surface tone="brand" gap={3}>
        <SectionHeader title="ملف الفرع" subtitle="ابدأ من ملخص واضح واحد قبل أي تعديل تشغيلي." />
        <KeyValueList
          items={[
            { label: 'المتجر', value: profile.storeName },
            { label: 'الفرع', value: profile.branchLabel },
            { label: 'المدينة', value: profile.cityLabel },
            { label: 'المدير', value: profile.managerLabel },
            { label: 'أوقات اليوم', value: profile.todayHoursLabel },
            { label: 'منطقة التغطية', value: profile.activeZoneLabel, tone: 'brand' },
          ]}
        />
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="حالة التوفر" subtitle="التشغيل والظهور منفصلان حتى تبقى القرارات واضحة." />
        <Switch
          label="المتجر مفتوح"
          description="يتحكم في استقبال أعمال DSH الجديدة لهذا الفرع."
          value={storeOpen}
          disabled={isDisabled}
          onValueChange={onToggleStoreOpen}
        />
        <Switch
          label="الظهور في القوائم"
          description="يتحكم في ظهور الفرع للمستخدمين دون تغيير هوية المتجر."
          value={listingEnabled}
          disabled={isDisabled}
          onValueChange={onToggleListingEnabled}
        />
      </Surface>

      <Surface tone="default" gap={3}>
        <SectionHeader title="قنوات الخدمة" subtitle="كل قناة لها مفتاح مستقل حتى يبقى السجل التشغيلي واضحًا." />
        <Box gap={2}>
          {serviceModes.map((mode) => (
            <Switch
              key={mode.id}
              label={mode.label}
              description={mode.description}
              value={mode.enabled}
              disabled={isDisabled}
              onValueChange={(nextValue) => onToggleServiceMode?.(mode.id, nextValue)}
            />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" gap={3}>
        <SectionHeader title="إجراءات الفرع" subtitle="الأوقات والمناطق والعمليات تبقى خطوة واحدة بعيدة." />
        <Box gap={2}>
          <Button label="تحديث أوقات العمل" tone="secondary" onPress={onOpenHours} disabled={isDisabled} />
          <Button label="تحديث مناطق التغطية" tone="secondary" onPress={onOpenZones} disabled={isDisabled} />
          <Button label="فتح لوحة العمليات" tone="ghost" onPress={onOpenDeliveryBoard} disabled={isDisabled} />
          <Button label="فتح دليل الدعم" tone="ghost" onPress={onOpenSupportDirectory} disabled={isDisabled} />
        </Box>
      </Surface>

      <Button label="حفظ التغييرات" onPress={onSave} disabled={isDisabled} />
    </MobileScrollView>
  );
}

export default DshPartnerStoreMaintenanceWorkspaceScreen;
