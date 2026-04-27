import React from 'react';
import { Pressable, View } from 'react-native';
import { Box, Button, Chip, Icon, ListItem, MobileCommandSectionList, MobileScrollView, MobileStickyPrimaryAction, StateView, Surface, Text, TextField, useDirection, useTheme } from '@bthwani/ui-kit';

type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings' | 'type-switch';

type PartnerServiceType = 'dsh' | 'arb';

type PartnerOperationalMode = {
  id: 'pickup' | 'delivery' | 'scheduled';
  title: string;
  subtitle: string;
  commission: string;
  enabled: boolean;
};

type PartnerTeamMember = {
  id: string;
  name: string;
  roleLabel: 'مشرف' | 'موظف' | 'موصل';
  subtitle: string;
};

type PartnerCoverageZone = {
  id: string;
  name: string;
  subtitle: string;
  active: boolean;
};

type PartnerDshConsoleScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

type PartnerTypeOption = {
  id: PartnerServiceType;
  label: string;
  description: string;
};

type HubNavigationItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  kind: 'orders' | 'section';
  section?: Exclude<PartnerHubSection, 'hub'>;
};

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'info';
};

type Props = {
  state?: PartnerDshConsoleScreenState;
  activeServiceType: PartnerServiceType;
  section?: PartnerHubSection;
  onSectionChange?: (section: PartnerHubSection) => void;
  storeName?: string;
  branchLabel?: string;
  cityLabel?: string;
  managerLabel?: string;
  todayHoursLabel?: string;
  activeZoneLabel?: string;
  storeOpen?: boolean;
  listingEnabled?: boolean;
  serviceModes?: readonly { id: string; label: string; description: string; enabled: boolean }[];
  activeOrdersCount?: number;
  urgentOrdersCount?: number;
  pendingActionsCount?: number;
  typeOptions?: readonly PartnerTypeOption[];
  onSelectType?: (typeId: PartnerServiceType) => void;
  onOpenOrdersBoard?: () => void;
  onOpenInventoryManagement?: () => void;
  onOpenStoreScope?: () => void;
  onOpenSupportDirectory?: () => void;
  onOpenWalletHub?: () => void;
  onOpenBell?: () => void;
  onOpenSupportScreen?: (screenId: string) => void;
};

const defaultTypeOptions: readonly PartnerTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والتسليم' },
  { id: 'arb', label: 'ARB', description: 'تشغيل عرب الشركاء والمسارات' },
] as const;

const defaultOperationalModes: readonly PartnerOperationalMode[] = [
  { id: 'pickup', title: 'استلم بنفسك', subtitle: 'استلام من الفرع مباشرة.', commission: '0%', enabled: true },
  { id: 'delivery', title: 'توصيل المتجر', subtitle: 'قناة توصيل داخلية.', commission: '8%', enabled: true },
  { id: 'scheduled', title: 'توصيل بثواني', subtitle: 'جدولة سريعة عند الحاجة.', commission: '15%', enabled: false },
] as const;

const defaultTeamMembers: readonly PartnerTeamMember[] = [
  { id: 'manager', name: 'خالد', roleLabel: 'مشرف', subtitle: 'مشرف الفرع الحالي' },
  { id: 'staff-1', name: 'سارة', roleLabel: 'موظف', subtitle: 'إدارة الطلبات والردود' },
  { id: 'staff-2', name: 'مروان', roleLabel: 'موظف', subtitle: 'التجهيز والكتالوج' },
  { id: 'rider-1', name: 'عمر', roleLabel: 'موصل', subtitle: 'التسليم والحركة' },
] as const;

const defaultCoverageZones: readonly PartnerCoverageZone[] = [
  { id: 'yasmin', name: 'الياسمين', subtitle: 'نطاق رئيسي عالي الجاهزية.', active: true },
  { id: 'nada', name: 'الندى', subtitle: 'نطاق قريب مع طلب ثابت.', active: true },
] as const;

const partnerHubBottomInset = 112;

const hubNavigationItems: readonly HubNavigationItem[] = [
  {
    id: 'orders',
    title: 'الطلبات',
    description: 'إدارة الطلبات الحالية والسابقة وتتبع حالتها.',
    icon: 'receipt-outline',
    kind: 'orders',
  },
  {
    id: 'profile',
    title: 'ملف المتجر',
    description: 'تحديث معلومات المتجر والهوية والظهور.',
    icon: 'storefront-outline',
    kind: 'section',
    section: 'profile',
  },
  {
    id: 'operations',
    title: 'العمليات والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
    kind: 'section',
    section: 'operations',
  },
  {
    id: 'inventory',
    title: 'المخزون والكتالوج',
    description: 'إدارة المنتجات، الأسعار، والمخزون.',
    icon: 'cube-outline',
    kind: 'section',
    section: 'inventory',
  },
  {
    id: 'wallet',
    title: 'المحفظة والحسابات المالية',
    description: 'الرصيد، المستحقات، التسويات، وآخر حركة.',
    icon: 'wallet-outline',
    kind: 'section',
    section: 'wallet',
  },
  {
    id: 'analytics',
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، والتوصيات.',
    icon: 'trending-up-outline',
    kind: 'section',
    section: 'analytics',
  },
  {
    id: 'settings',
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
    kind: 'section',
    section: 'settings',
  },
  {
    id: 'type-switch',
    title: 'تغيير النوع',
    description: 'تبديل نوع الحساب أو الخدمة.',
    icon: 'swap-horizontal-outline',
    kind: 'section',
    section: 'type-switch',
  },
] as const;

const sectionCopy: Record<Exclude<PartnerHubSection, 'hub'>, { title: string; description: string; icon: React.ComponentProps<typeof Icon>['name'] }> = {
  profile: {
    title: 'ملف المتجر',
    description: 'تحديث معلومات المتجر والهوية والظهور.',
    icon: 'storefront-outline',
  },
  operations: {
    title: 'العمليات والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
  },
  inventory: {
    title: 'المخزون والكتالوج',
    description: 'إدارة المنتجات، الأسعار، والمخزون.',
    icon: 'cube-outline',
  },
  wallet: {
    title: 'المحفظة والحسابات المالية',
    description: 'الرصيد، المستحقات، التسويات، وآخر حركة.',
    icon: 'wallet-outline',
  },
  analytics: {
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، والتوصيات.',
    icon: 'trending-up-outline',
  },
  settings: {
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
  },
  'type-switch': {
    title: 'تغيير النوع',
    description: 'تبديل نوع الحساب أو الخدمة.',
    icon: 'swap-horizontal-outline',
  },
};

function SummaryCell({ label, value, tone = 'default' }: Omit<SummaryItem, 'id'>) {
  const { theme } = useTheme();
  const accentColor =
    tone === 'success'
      ? theme.success
      : tone === 'warning'
        ? theme.warning
        : tone === 'brand'
          ? theme.brand
          : tone === 'info'
            ? theme.info
            : theme.lineStrong;

  return (
    <Surface
      tone="default"
      padding={3}
      gap={1}
      style={{ flex: 1, minWidth: 96, borderWidth: 1, borderColor: accentColor }}
    >
      <Text role="caption" tone="muted" numberOfLines={1} align="start">
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={1} align="start">
        {value}
      </Text>
    </Surface>
  );
}

function HubWorkspaceShell({
  title,
  description,
  icon,
  onBack,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onBack: () => void;
  children?: React.ReactNode;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <Surface tone="raised" padding={4} gap={3}>
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
            }}
          >
            <Icon name={icon} size={20} tone="brand" />
          </View>

          <View style={{ flex: 1, gap: 2 }}>
            <Text role="titleMd" align={direction === 'rtl' ? 'end' : 'start'}>
              {title}
            </Text>
            <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
              {description}
            </Text>
          </View>
        </View>

        <Surface tone="default" padding={3} gap={1}>
          <Text role="bodyStrong">[TBD-workspace-binding]</Text>
          <Text role="bodySm" tone="muted">
            هذه مساحة مؤقتة مضغوطة للمرحلة 1 فقط. التفاصيل الكاملة لهذا القسم ستأتي لاحقًا.
          </Text>
        </Surface>

        {children}

        <Box>
          <Button label="العودة إلى مركز الحساب" tone="secondary" fullWidth={false} onPress={onBack} />
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

function TypeSwitchWorkspace({
  activeServiceType,
  typeOptions,
  onSelectType,
  onBack,
}: {
  activeServiceType: PartnerServiceType;
  typeOptions: readonly PartnerTypeOption[];
  onSelectType?: (typeId: PartnerServiceType) => void;
  onBack: () => void;
}) {
  const { direction } = useDirection();
  const canSwitch = typeof onSelectType === 'function';

  return (
    <HubWorkspaceShell
      title="تغيير النوع"
      description="بدّل بين نوعي الخدمة من نفس المسار دون فتح صفحة جديدة أو إنشاء تبويب مستقل."
      icon="swap-horizontal-outline"
      onBack={onBack}
    >
      <Surface tone="default" padding={3} gap={3}>
        <Text role="bodyStrong">اختر النوع النشط</Text>
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {typeOptions.map((option) => (
            <Button
              key={option.id}
              label={`${option.label} · ${option.description}`}
              tone={option.id === activeServiceType ? 'primary' : 'secondary'}
              fullWidth={false}
              disabled={!canSwitch}
              onPress={() => onSelectType?.(option.id)}
            />
          ))}
        </View>
        {!canSwitch ? (
          <Text role="caption" tone="muted">
            [TBD-workspace-binding] الربط الفعلي للتبديل سيكتمل لاحقًا.
          </Text>
        ) : null}
      </Surface>
    </HubWorkspaceShell>
  );
}

function resolveServiceModeEnabled(serviceModes: readonly { id: string; enabled: boolean }[] | undefined, modeId: PartnerOperationalMode['id'], fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    if (modeId === 'delivery') return mode.id === 'delivery' || mode.id === 'store-delivery';
    return mode.id === 'scheduled' || mode.id === 'seconds';
  });

  return matched?.enabled ?? fallback;
}

function OperationsModeRow({
  mode,
  selected,
  onPress,
}: {
  mode: PartnerOperationalMode;
  selected: boolean;
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mode.title}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
        },
      ]}
    >
      <View
        style={{
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 10,
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? theme.brandSurface : theme.surfaceInset,
              borderWidth: 1,
              borderColor: selected ? theme.brand : theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'delivery' ? 'car-outline' : 'time-outline'} size={16} tone={selected ? 'brand' : 'default'} />
          </View>

          <View style={{ flexShrink: 1, minWidth: 0, gap: 2 }}>
            <Text role="bodyStrong" align="start" numberOfLines={1}>
              {mode.title}
            </Text>
            <Text role="bodySm" tone="muted" align="start" numberOfLines={1}>
              {mode.subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, marginEnd: 10 }}>
          <Chip label={mode.enabled ? 'مفعّل' : 'غير مفعّل'} tone={mode.enabled ? 'success' : 'warning'} />
          <Text role="caption" tone="muted">
            {`عمولة ${mode.commission}`}
          </Text>
        </View>

        <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
      </View>
    </Pressable>
  );
}

function OperationsWorkspace({
  activeServiceType,
  branchLabel,
  cityLabel,
  storeName,
  todayHoursLabel,
  storeOpen,
  activeZoneLabel,
  serviceModes,
  onBack,
}: {
  activeServiceType: PartnerServiceType;
  branchLabel: string;
  cityLabel: string;
  storeName: string;
  todayHoursLabel: string;
  storeOpen: boolean;
  activeZoneLabel: string;
  serviceModes: readonly { id: string; label: string; description: string; enabled: boolean }[];
  onBack: () => void;
}) {
  const { direction } = useDirection();
  const [selectedModeId, setSelectedModeId] = React.useState<PartnerOperationalMode['id']>('pickup');
  const [modeOverrides, setModeOverrides] = React.useState<Partial<Record<PartnerOperationalMode['id'], boolean>>>({});
  const [teamPanelOpen, setTeamPanelOpen] = React.useState(false);
  const [coveragePanelOpen, setCoveragePanelOpen] = React.useState(false);
  const [inviteDraft, setInviteDraft] = React.useState('');
  const [lastSaveLabel, setLastSaveLabel] = React.useState<string | null>(null);

  const resolvedModes = React.useMemo(
    () =>
      defaultOperationalModes.map((mode) => ({
        ...mode,
        enabled: modeOverrides[mode.id] ?? resolveServiceModeEnabled(serviceModes, mode.id, mode.enabled),
      })),
    [modeOverrides, serviceModes],
  );

  const activeModesCount = resolvedModes.filter((mode) => mode.enabled).length;
  const selectedMode = resolvedModes.find((mode) => mode.id === selectedModeId) ?? resolvedModes[0];

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <Surface tone="raised" padding={4} gap={3}>
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Button
            label="العودة"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="chevron-forward-outline" mirrored size={16} />}
            onPress={onBack}
          />

          <View style={{ flex: 1, gap: 2 }}>
            <Text role="titleMd" align="start">
              العمليات والفريق
            </Text>
            <Text role="bodySm" tone="muted" align="start">
              {`${storeName} · ${branchLabel} · ${cityLabel} · نوع الخدمة ${activeServiceType === 'dsh' ? 'DSH' : 'ARB'}`}
            </Text>
          </View>
        </View>
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          حالة التشغيل الآن
        </Text>

        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <SummaryCell label="حالة المتجر" value={storeOpen ? 'مفتوح الآن' : 'مغلق الآن'} tone={storeOpen ? 'success' : 'warning'} />
          <SummaryCell label="ساعات العمل" value={todayHoursLabel} tone="info" />
          <SummaryCell label="أوضاع مفعلة" value={`${activeModesCount}/3`} tone="brand" />
          <SummaryCell label="مناطق نشطة" value="منطقتان" tone="success" />
        </View>
      </Surface>

      <Surface tone="raised" padding={0} gap={0} style={{ overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
          <Text role="label" tone="muted">
            أوضاع الخدمة
          </Text>
        </View>

        {resolvedModes.map((mode) => (
          <OperationsModeRow
            key={mode.id}
            mode={mode}
            selected={mode.id === selectedMode.id}
            onPress={() => setSelectedModeId(mode.id)}
          />
        ))}

        <Surface tone="default" padding={3} gap={2} style={{ margin: 16, marginTop: 12 }}>
          <View
            style={{
              flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text role="bodyStrong" align="start">
                {selectedMode.title}
              </Text>
              <Text role="bodySm" tone="muted" align="start">
                {selectedMode.subtitle}
              </Text>
            </View>
            <Chip label={selectedMode.enabled ? 'مفعّل' : 'غير مفعّل'} tone={selectedMode.enabled ? 'success' : 'warning'} />
          </View>
          <Text role="caption" tone="muted" align="start">
            {`عمولة ${selectedMode.commission}`}
          </Text>
          <Text role="bodySm" tone="muted" align="start">
            تفاصيل هذا الوضع تظهر داخل نفس الصفحة فقط، ويمكن تبديل حالته محليًا دون أي route جديد.
          </Text>
          <Button
            label={selectedMode.enabled ? 'إيقاف الوضع' : 'تفعيل الوضع'}
            tone="secondary"
            fullWidth={false}
            onPress={() => {
              setModeOverrides((current) => ({
                ...current,
                [selectedMode.id]: !selectedMode.enabled,
              }));
            }}
          />
        </Surface>
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          الفريق
        </Text>
        <Text role="bodyStrong" align="start">
          مشرف 1 · موظف 3 · موصل 2
        </Text>
        <Button
          label="إدارة الفريق"
          tone="secondary"
          fullWidth={false}
          onPress={() => setTeamPanelOpen((current) => !current)}
        />

        {teamPanelOpen ? (
          <Surface tone="inset" padding={3} gap={3}>
            <View
              style={{
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <Chip label="مشرف" tone="brand" />
              <Chip label="موظف" tone="info" />
              <Chip label="موصل" tone="success" />
            </View>

            <View style={{ gap: 10 }}>
              {defaultTeamMembers.map((member) => (
                <ListItem key={member.id} title={member.name} subtitle={member.subtitle} meta={member.roleLabel} badgeLabel={member.roleLabel} />
              ))}
            </View>

            <Surface tone="default" padding={3} gap={3}>
              <TextField
                label="اسم العضو أو البريد"
                placeholder="مثال: staff@bthwani.sa"
                value={inviteDraft}
                onChangeText={setInviteDraft}
                hint="إضافة عضو تتم داخل نفس الصفحة بدون انتقال إلى أي route جديد."
              />
              <Button
                label="إضافة عضو"
                tone="secondary"
                fullWidth={false}
                onPress={() => {
                  if (!inviteDraft.trim()) {
                    return;
                  }

                  setLastSaveLabel(`دعوة محلية: ${inviteDraft.trim()}`);
                  setInviteDraft('');
                }}
              />
              {lastSaveLabel ? (
                <Text role="caption" tone="success">
                  {lastSaveLabel}
                </Text>
              ) : null}
            </Surface>
          </Surface>
        ) : null}
      </Surface>

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          مناطق التغطية
        </Text>
        <Text role="bodyStrong" align="start">
          منطقتان نشطتان
        </Text>
        <Button
          label="إدارة المناطق"
          tone="secondary"
          fullWidth={false}
          onPress={() => setCoveragePanelOpen((current) => !current)}
        />

        {coveragePanelOpen ? (
          <Surface tone="inset" padding={3} gap={3}>
            <Text role="bodySm" tone="muted" align="start">
              {`النطاق الحالي: ${activeZoneLabel}`}
            </Text>

            <View style={{ gap: 10 }}>
              {defaultCoverageZones.map((zone) => (
                <ListItem key={zone.id} title={zone.name} subtitle={zone.subtitle} badgeLabel={zone.active ? 'نشط' : 'موقوف'} />
              ))}
            </View>
          </Surface>
        ) : null}
      </Surface>

      <MobileStickyPrimaryAction
        label="حفظ إعدادات العمليات"
        helperText={lastSaveLabel ? `آخر حفظ: ${lastSaveLabel}` : 'التعديلات تحفظ من نفس الصفحة.'}
        onPress={() => setLastSaveLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }))}
      />
    </MobileScrollView>
  );
}

export function PartnerDshConsoleScreen(props: Props) {
  const {
    state = 'ready',
    activeServiceType,
    section,
    onSectionChange,
    storeName = 'متجر الفخامة',
    branchLabel = 'الرياض، فرع الياسمين',
    cityLabel = 'الرياض',
    todayHoursLabel = '09:00 - 23:00',
    storeOpen = true,
    activeZoneLabel = 'الياسمين / الندى',
    activeOrdersCount = 13,
    serviceModes = [],
    typeOptions = defaultTypeOptions,
    onSelectType,
    onOpenOrdersBoard,
    onOpenStoreScope,
    onOpenSupportDirectory,
    onOpenBell,
  } = props;

  const { direction } = useDirection();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('hub');
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;

  const summaryItems = React.useMemo<readonly SummaryItem[]>(
    () => [
      { id: 'store-status', label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
      { id: 'active-orders', label: 'الطلبات النشطة', value: String(activeOrdersCount), tone: 'brand' },
      { id: 'hours', label: 'ساعات العمل', value: todayHoursLabel, tone: 'info' },
    ],
    [activeOrdersCount, storeOpen, todayHoursLabel],
  );

  if (state !== 'ready') {
    const stateId = state === 'loading' ? 'loading' : state === 'empty' ? 'empty' : state === 'offline' ? 'offline' : 'blockingError';

    return (
      <StateView
        stateId={stateId}
        title="مركز حساب الشريك"
        description="نجهز الآن نموذج التنقل الخاص بالحساب. سيبقى المسار واضحًا ومضغوطًا حتى يكتمل التحميل."
        actionLabel={onOpenOrdersBoard ? 'فتح الطلبات' : undefined}
        onActionPress={onOpenOrdersBoard}
      />
    );
  }

  if (activeSection !== 'hub') {
    if (activeSection === 'operations') {
      return (
        <OperationsWorkspace
          activeServiceType={activeServiceType}
          branchLabel={branchLabel}
          cityLabel={cityLabel}
          storeName={storeName}
          todayHoursLabel={todayHoursLabel}
          storeOpen={storeOpen}
          activeZoneLabel={activeZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
        />
      );
    }

    if (activeSection === 'type-switch') {
      return (
        <TypeSwitchWorkspace
          activeServiceType={activeServiceType}
          typeOptions={typeOptions.length > 0 ? typeOptions : defaultTypeOptions}
          onSelectType={onSelectType}
          onBack={() => updateSection('hub')}
        />
      );
    }

    const copy = sectionCopy[activeSection];

    return (
      <HubWorkspaceShell
        title={copy.title}
        description={copy.description}
        icon={copy.icon}
        onBack={() => updateSection('hub')}
      />
    );
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <Surface tone="raised" padding={4} gap={2}>
        <Text role="titleLg">مركز حساب الشريك</Text>
        <Text role="bodySm" tone="muted">
          كل ما تحتاجه لإدارة متجرك وتنمية أعمالك من مكان واحد.
        </Text>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {summaryItems.map((item) => (
            <SummaryCell key={item.id} {...item} />
          ))}
        </View>
      </Surface>

      <MobileCommandSectionList
        title="الأقسام الرئيسية"
        subtitle="قائمة عمودية واضحة لكل قسم داخل الحساب."
        items={hubNavigationItems.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.description,
          icon: item.icon,
          onPress: () => {
            if (item.kind === 'orders') {
              onOpenOrdersBoard?.();
              return;
            }

            if (item.section) {
              updateSection(item.section);
            }
          },
        }))}
      />

      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">
          إجراءات سريعة
        </Text>

        <View
          style={{
            flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <Button
            label="الإشعارات"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="notifications-outline" size={16} />}
            onPress={onOpenBell}
          />
          <Button
            label="اختيار الفرع"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="git-branch-outline" size={16} />}
            onPress={onOpenStoreScope}
          />
          <Button
            label="الدعم"
            tone="secondary"
            fullWidth={false}
            icon={<Icon name="headset-outline" size={16} />}
            onPress={onOpenSupportDirectory}
          />
        </View>

        <Text role="caption" tone="muted">
          {storeName} · {branchLabel}
        </Text>
      </Surface>
    </MobileScrollView>
  );
}

export default PartnerDshConsoleScreen;
