import React from 'react';
import {
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileCommandCenterShell,
  MobileCommandSectionList,
  MobileCommandSummaryStrip,
  MobileInlineManagementPanel,
  MobileOperationalWorkspace,
  MobileQuickActions,
  MobileStickyPrimaryAction,
  Surface,
  Text,
  TextField,
  useDirection,
} from '@bthwani/ui-kit';
import type {
  MobileCommandSectionItemData,
  MobileQuickActionItem,
} from '@bthwani/ui-kit';

type PartnerHubSection = 'hub' | 'profile' | 'operations' | 'inventory' | 'wallet' | 'analytics' | 'settings' | 'type-switch';

type PartnerServiceType = 'dsh' | 'arb';

type PartnerServiceMode = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

type PartnerTypeOption = {
  id: PartnerServiceType;
  label: string;
  description: string;
};

type PartnerDshConsoleScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

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
  serviceModes?: readonly PartnerServiceMode[];
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

const defaultServiceModes: readonly PartnerServiceMode[] = [
  { id: 'pickup', label: 'استلم بنفسك', description: 'استلام من الفرع مباشرة.', enabled: true },
  { id: 'delivery', label: 'توصيل المتجر', description: 'توصيل من الفرع بطاقم المتجر.', enabled: true },
  { id: 'scheduled', label: 'توصيل بثواني', description: 'قناة سريعة عند الحاجة.', enabled: false },
] as const;

function resolveOperationsModes(serviceModes: readonly PartnerServiceMode[]) {
  return [
    {
      id: 'pickup',
      title: 'استلم بنفسك',
      commission: '0%',
      enabled: serviceModes.find((mode) => mode.id === 'pickup')?.enabled ?? true,
    },
    {
      id: 'store-delivery',
      title: 'توصيل المتجر',
      commission: '8%',
      enabled: serviceModes.find((mode) => mode.id === 'delivery' || mode.id === 'store-delivery')?.enabled ?? true,
    },
    {
      id: 'seconds',
      title: 'توصيل بثواني',
      commission: '15%',
      enabled: serviceModes.find((mode) => mode.id === 'seconds' || mode.id === 'scheduled')?.enabled ?? false,
    },
  ] as const;
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
    managerLabel = 'خالد',
    todayHoursLabel = '09:00 - 23:00',
    activeZoneLabel = 'الياسمين + الملقا',
    storeOpen = true,
    listingEnabled = true,
    serviceModes = defaultServiceModes,
    activeOrdersCount = 13,
    urgentOrdersCount = 2,
    pendingActionsCount = 5,
    typeOptions = defaultTypeOptions,
    onSelectType,
    onOpenOrdersBoard,
    onOpenInventoryManagement,
    onOpenStoreScope,
    onOpenSupportDirectory,
    onOpenWalletHub,
    onOpenBell,
  } = props;
  const { language, setLanguage } = useDirection();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('hub');
  const [inventoryQuery, setInventoryQuery] = React.useState('');
  const [profilePanel, setProfilePanel] = React.useState<'full-profile' | 'identity' | 'scope' | null>(null);
  const [operationsPanel, setOperationsPanel] = React.useState<'team' | 'coverage' | null>(null);
  const [operationsSavedAt, setOperationsSavedAt] = React.useState<string | null>(null);
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;
  const operationalModes = React.useMemo(() => resolveOperationsModes(serviceModes), [serviceModes]);
  const activeModesCount = operationalModes.filter((mode) => mode.enabled).length;
  const typeSwitchBound = typeof onSelectType === 'function';
  const availableTypeOptions = typeOptions.length > 0 ? typeOptions : defaultTypeOptions;

  React.useEffect(() => {
    if (activeSection !== 'profile') {
      setProfilePanel(null);
    }
    if (activeSection !== 'operations') {
      setOperationsPanel(null);
    }
  }, [activeSection]);

  const stateConfig = {
    title: 'جاري تجهيز مركز حساب الشريك',
    description: 'نجهز الآن مركز الحساب ومساحات العمل التشغيلية.',
    actionLabel: onOpenOrdersBoard ? 'إعادة المحاولة' : undefined,
    onActionPress: onOpenOrdersBoard,
  };

  const commandSummary = [
    { id: 'store-status', label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
    { id: 'active-orders', label: 'الطلبات النشطة', value: String(activeOrdersCount), tone: 'brand' },
    { id: 'hours', label: 'ساعات العمل', value: todayHoursLabel, tone: 'info' },
    { id: 'branch', label: 'الفرع', value: branchLabel },
  ] as const;

  const commandSections: readonly MobileCommandSectionItemData[] = [
    {
      id: 'orders',
      title: 'الطلبات',
      subtitle: 'افتح الطلبات الجارية مباشرة دون المرور بأي لوحة إضافية.',
      icon: 'receipt-outline',
      meta: 'الهبوط الافتراضي لتطبيق الشريك',
      statusLabel: `${activeOrdersCount} نشطة`,
      statusTone: 'brand',
      onPress: onOpenOrdersBoard,
    },
    {
      id: 'profile',
      title: 'ملف المتجر',
      subtitle: 'بيانات المتجر، الهوية، والنطاق من مساحة عمل واحدة.',
      icon: 'storefront-outline',
      meta: branchLabel,
      statusLabel: listingEnabled ? 'جاهز' : 'يحتاج مراجعة',
      statusTone: listingEnabled ? 'success' : 'warning',
      onPress: () => updateSection('profile'),
    },
    {
      id: 'operations',
      title: 'العمليات والفريق',
      subtitle: 'حالة المتجر، أوضاع الخدمة، الفريق، ومناطق التغطية في سطح واحد.',
      icon: 'grid-outline',
      meta: `${activeModesCount}/3 أوضاع مفعلة`,
      statusLabel: 'تشغيل يومي',
      statusTone: 'brand',
      onPress: () => updateSection('operations'),
    },
    {
      id: 'inventory',
      title: 'المخزون والكتالوج',
      subtitle: 'بحث أولًا ثم إدخال سريع مع دعم GTIN و SKU و barcode.',
      icon: 'albums-outline',
      meta: 'Search-first central catalog',
      statusLabel: 'منع التكرار',
      statusTone: 'info',
      onPress: () => updateSection('inventory'),
    },
    {
      id: 'wallet',
      title: 'المحفظة والحسابات المالية',
      subtitle: 'الرصيد، المستحقات، التسويات، وآخر حركة من نفس الممر.',
      icon: 'wallet-outline',
      meta: 'رؤية مالية مختصرة',
      statusLabel: 'جاهزة',
      statusTone: 'success',
      onPress: () => updateSection('wallet'),
    },
    {
      id: 'analytics',
      title: 'التحليلات والنمو والتسويق',
      subtitle: 'الأداء، الفرص، العروض، الاشتراك، والتوصيات العملية.',
      icon: 'trending-up-outline',
      meta: 'قراءة تنفيذية سريعة',
      statusLabel: 'فرص جديدة',
      statusTone: 'warning',
      onPress: () => updateSection('analytics'),
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      subtitle: 'إعدادات مختصرة مع لغة الواجهة والنطاق وقنوات الإشعار.',
      icon: 'settings-outline',
      meta: 'إعدادات خفيفة',
      statusLabel: 'مختصرة',
      statusTone: 'default',
      onPress: () => updateSection('settings'),
    },
    {
      id: 'type-switch',
      title: 'تغيير النوع',
      subtitle: 'بدّل بين DSH و ARB من نفس المسار بدون تشتيت.',
      icon: 'swap-horizontal-outline',
      meta: activeServiceType === 'dsh' ? 'DSH مفعل' : 'ARB مفعل',
      statusLabel: typeSwitchBound ? 'مرتبط' : '[TBD-binding]',
      statusTone: typeSwitchBound ? 'success' : 'warning',
      onPress: () => updateSection('type-switch'),
    },
  ];

  const quickActions: readonly MobileQuickActionItem[] = [
    { id: 'notifications', label: 'الإشعارات', icon: 'notifications-outline', onPress: onOpenBell },
    { id: 'branch', label: 'اختيار الفرع', icon: 'git-branch-outline', onPress: onOpenStoreScope, tone: 'secondary' },
    { id: 'support', label: 'الدعم', icon: 'headset-outline', onPress: onOpenSupportDirectory, tone: 'ghost' },
  ];

  if (activeSection === 'hub') {
    return (
      <MobileCommandCenterShell
        state={state}
        stateConfig={stateConfig}
        badgeLabel={activeServiceType === 'dsh' ? 'DSH' : 'ARB'}
        badgeTone="warning"
        title="مركز حساب الشريك"
        description="كل ما تحتاجه لإدارة متجرك وتنمية أعمالك من مكان واحد. ابدأ بالقسم المطلوب وستبقى كل التفاصيل داخل مساحة عمل واحدة هادئة وواضحة."
        headerNote={`${storeName} · ${branchLabel}`}
        summaryStrip={<MobileCommandSummaryStrip items={commandSummary} />}
        quickActions={<MobileQuickActions title="إجراءات سريعة" items={quickActions} />}
      >
        <MobileCommandSectionList
          title="الأقسام الرئيسية"
          subtitle="قائمة عمودية واضحة بدل التبويبات الأفقية الرئيسية. كل عنصر يفتح مساحة عمل واحدة فقط."
          items={commandSections}
        />
      </MobileCommandCenterShell>
    );
  }

  if (activeSection === 'profile') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="ملف المتجر"
        description="إدارة ملف المتجر، الهوية، والاعتماد من مساحة تشغيل واحدة مضغوطة بدل تشتيت التفاصيل عبر شاشات متعددة."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'profile-ready', label: 'الملف', value: 'جاهز', tone: 'success' },
              { id: 'listing', label: 'الظهور', value: listingEnabled ? 'مفعّل' : 'موقوف', tone: listingEnabled ? 'success' : 'warning' },
              { id: 'identity', label: 'الاعتماد', value: 'قيد المتابعة', tone: 'info' },
              { id: 'scope', label: 'النطاق', value: activeZoneLabel },
            ]}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <KeyValueList
            items={[
              { label: 'اسم المتجر', value: storeName },
              { label: 'الفرع', value: branchLabel },
              { label: 'المدينة', value: cityLabel },
              { label: 'المدير', value: managerLabel },
              { label: 'ساعات العمل', value: todayHoursLabel },
            ]}
          />
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button label="عرض الملف الكامل" tone="secondary" fullWidth={false} onPress={() => setProfilePanel((current) => (current === 'full-profile' ? null : 'full-profile'))} />
            <Button label="الهوية والاعتماد" tone="secondary" fullWidth={false} onPress={() => setProfilePanel((current) => (current === 'identity' ? null : 'identity'))} />
            <Button label="اختيار النطاق" tone="ghost" fullWidth={false} onPress={() => setProfilePanel((current) => (current === 'scope' ? null : 'scope'))} />
          </Box>
        </Surface>

        <MobileInlineManagementPanel
          title="عرض الملف الكامل"
          subtitle="تفاصيل الملف الأساسية تظهر inline داخل نفس مساحة العمل."
          open={profilePanel === 'full-profile'}
          onToggle={() => setProfilePanel((current) => (current === 'full-profile' ? null : 'full-profile'))}
          summaryItems={[
            { label: 'الاسم التجاري', value: storeName },
            { label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
            { label: 'الظهور في القائمة', value: listingEnabled ? 'مفعّل' : 'موقوف', tone: listingEnabled ? 'success' : 'warning' },
          ]}
        >
          <KeyValueList
            items={[
              { label: 'اسم المسؤول', value: managerLabel },
              { label: 'الفرع الحالي', value: branchLabel },
              { label: 'المدينة', value: cityLabel },
              { label: 'ساعات اليوم', value: todayHoursLabel },
              { label: 'منطقة التغطية', value: activeZoneLabel, tone: 'brand' },
            ]}
          />
        </MobileInlineManagementPanel>

        <MobileInlineManagementPanel
          title="الهوية والاعتماد"
          subtitle="الهوية والامتثال داخل نفس الصفحة بدل فتح شاشة مشتتة."
          open={profilePanel === 'identity'}
          onToggle={() => setProfilePanel((current) => (current === 'identity' ? null : 'identity'))}
          summaryItems={[
            { label: 'السجل التجاري', value: 'محدث' },
            { label: 'هوية المفوض', value: 'قيد التحقق', tone: 'warning' },
            { label: 'SLA', value: '24 ساعة', tone: 'info' },
          ]}
        >
          <ListItem title="الهوية النظامية" subtitle="رفع وتحديث مستندات الهوية بدون الخروج من ملف المتجر." badgeLabel="Ready" />
          <ListItem title="حالة الاعتماد" subtitle="كل خطوة تظهر هنا بصيغة عملية واضحة وقابلة للمراجعة." badgeLabel="Inline" />
        </MobileInlineManagementPanel>

        <MobileInlineManagementPanel
          title="اختيار النطاق"
          subtitle="يمكن إدارة النطاق من هذا السطح أو فتح sheet خفيف عند الحاجة."
          open={profilePanel === 'scope'}
          onToggle={() => setProfilePanel((current) => (current === 'scope' ? null : 'scope'))}
          summaryItems={[
            { label: 'النطاق الحالي', value: activeZoneLabel, tone: 'brand' },
            { label: 'الفرع', value: branchLabel },
          ]}
          footer={onOpenStoreScope ? <Button label="فتح اختيار الفرع" tone="secondary" onPress={onOpenStoreScope} /> : null}
        >
          <ListItem title="نطاق الفرع الحالي" subtitle="تبديل النطاق يتم من نفس الممر دون شاشة مشتتة." badgeLabel="Scope" />
        </MobileInlineManagementPanel>
      </MobileOperationalWorkspace>
    );
  }

  if (activeSection === 'operations') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="العمليات والفريق"
        description="إدارة حالة المتجر، أوضاع التوصيل، الفريق، ومناطق التغطية من سطح واحد."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'operations-status', label: 'حالة التشغيل الآن', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
              { id: 'operations-hours', label: 'ساعات العمل', value: todayHoursLabel },
              { id: 'operations-modes', label: 'أوضاع الخدمة', value: `${activeModesCount}/3`, tone: 'brand' },
              { id: 'operations-zones', label: 'مناطق التغطية', value: 'منطقتان نشطتان', tone: 'info' },
            ]}
          />
        }
        stickyPrimaryAction={
          <MobileStickyPrimaryAction
            label="حفظ إعدادات العمليات"
            helperText={operationsSavedAt ? `آخر حفظ: ${operationsSavedAt}` : 'إجراء أساسي واحد وواضح لهذه الصفحة.'}
            onPress={() => setOperationsSavedAt(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }))}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <Text role="bodyStrong">أوضاع الخدمة</Text>
          <Box gap={2}>
            {operationalModes.map((mode) => (
              <ListItem
                key={mode.id}
                title={mode.title}
                subtitle={`${mode.enabled ? 'مفعّل' : 'غير مفعّل'} — عمولة ${mode.commission}`}
                meta={mode.id === 'pickup' ? 'استلام سريع من الفرع' : mode.id === 'store-delivery' ? 'توصيل المتجر بطاقم الفرع' : 'قناة سرعة عالية عند الحاجة'}
                badgeLabel={mode.enabled ? 'مفعّل' : 'غير مفعّل'}
              />
            ))}
          </Box>
        </Surface>

        <MobileInlineManagementPanel
          title="الفريق"
          subtitle="مشرف 1 · موظف 3 · موصل 2"
          open={operationsPanel === 'team'}
          onToggle={() => setOperationsPanel((current) => (current === 'team' ? null : 'team'))}
          summaryItems={[
            { label: 'المشرفون', value: '1' },
            { label: 'الموظفون', value: '3' },
            { label: 'الموصلون', value: '2' },
          ]}
          chips={[
            { id: 'manager', label: 'مشرف', tone: 'brand' },
            { id: 'staff', label: 'موظف', tone: 'info' },
            { id: 'rider', label: 'موصل', tone: 'success' },
          ]}
          footer={<Button label="إضافة عضو" tone="secondary" onPress={onOpenSupportDirectory} />}
        >
          <ListItem title="مشرف الفرع" subtitle="يدير القرار التشغيلي ويغلق التصعيد." badgeLabel="مشرف" />
          <ListItem title="طاقم التشغيل" subtitle="يتعامل مع التحضير والكتالوج والردود اليومية." badgeLabel="موظف" />
          <ListItem title="الموصلون" subtitle="يتعاملون مع التسليم والالتقاط فقط داخل نفس السطح." badgeLabel="موصل" />
        </MobileInlineManagementPanel>

        <MobileInlineManagementPanel
          title="مناطق التغطية"
          subtitle="منطقتان نشطتان"
          open={operationsPanel === 'coverage'}
          onToggle={() => setOperationsPanel((current) => (current === 'coverage' ? null : 'coverage'))}
          summaryItems={[
            { label: 'النطاق الحالي', value: activeZoneLabel, tone: 'brand' },
            { label: 'المدينة', value: cityLabel },
            { label: 'الحالة', value: 'منطقتان نشطتان', tone: 'success' },
          ]}
          footer={onOpenStoreScope ? <Button label="إدارة المناطق" tone="secondary" onPress={onOpenStoreScope} /> : null}
        >
          <ListItem title="الياسمين" subtitle="نطاق رئيسي عالي الجاهزية." badgeLabel="نشط" />
          <ListItem title="الملقا" subtitle="نطاق قريب مع طلب ثابت." badgeLabel="نشط" />
        </MobileInlineManagementPanel>
      </MobileOperationalWorkspace>
    );
  }

  if (activeSection === 'inventory') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="المخزون والكتالوج"
        description="مساحة بحث أولًا للكتالوج المركزي، مع إدخال سريع ودعم واضح لـ GTIN و SKU و barcode ومنع التكرار."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'catalog-search', label: 'Search-first', value: 'مفعّل', tone: 'brand' },
              { id: 'catalog-gtin', label: 'GTIN/SKU', value: 'جاهز', tone: 'info' },
              { id: 'catalog-dedupe', label: 'التكرار', value: 'ممنوع', tone: 'warning' },
              { id: 'catalog-intake', label: 'الإدخال السريع', value: 'متاح' },
            ]}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <TextField
            label="بحث في الكتالوج المركزي"
            placeholder="GTIN / SKU / barcode / الاسم"
            value={inventoryQuery}
            onChangeText={setInventoryQuery}
            hint="ابدأ دائمًا بالبحث قبل إنشاء عنصر جديد حتى لا يتكرر المنتج."
          />
          <Box gap={2}>
            <ListItem title="إدخال سريع" subtitle="ابدأ من البحث ثم أنشئ أو حدّث المنتج من نفس المسار." badgeLabel="Fast" />
            <ListItem title="مطابقة GTIN / SKU / barcode" subtitle="المسار جاهز لالتقاط المعرّفات المعيارية قبل الحفظ. [TBD-binding]" badgeLabel="Standard" />
            <ListItem title="مراجعة قبل النشر" subtitle="لا يتم حفظ أي دفعة قبل التأكد من عدم وجود تكرار أو تضارب." badgeLabel="Review" />
          </Box>
          <Button label="فتح إدارة المنتجات" tone="secondary" onPress={onOpenInventoryManagement} />
        </Surface>
      </MobileOperationalWorkspace>
    );
  }

  if (activeSection === 'wallet') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="المحفظة والحسابات المالية"
        description="الرصيد، المستحقات، التسويات، وآخر حركة في مساحة مالية واحدة واضحة."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'balance', label: 'الرصيد', value: 'SAR 12,480', tone: 'brand' },
              { id: 'dues', label: 'المستحقات', value: 'SAR 3,240', tone: 'success' },
              { id: 'settlements', label: 'التسويات', value: 'جاهزة', tone: 'info' },
              { id: 'movement', label: 'آخر حركة', value: 'اليوم 10:15' },
            ]}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <KeyValueList
            items={[
              { label: 'الرصيد المتاح', value: 'SAR 12,480', tone: 'brand' },
              { label: 'المستحق القادم', value: 'SAR 3,240', tone: 'success' },
              { label: 'التسوية القادمة', value: 'غدًا 09:00' },
              { label: 'آخر حركة', value: 'إيداع تسوية صباحية' },
            ]}
          />
          {onOpenWalletHub ? <Button label="فتح المحفظة والتسويات" tone="secondary" onPress={onOpenWalletHub} /> : null}
        </Surface>
      </MobileOperationalWorkspace>
    );
  }

  if (activeSection === 'analytics') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="التحليلات والنمو والتسويق"
        description="قراءة تنفيذية مختصرة للأداء والفرص والعروض والاشتراك والتوصيات العملية."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'performance', label: 'الأداء', value: 'مستقر', tone: 'success' },
              { id: 'opportunities', label: 'الفرص', value: '3 فرص', tone: 'warning' },
              { id: 'offers', label: 'العروض', value: '8%', tone: 'brand' },
              { id: 'subscription', label: 'الاشتراك', value: 'بثواني برو', tone: 'info' },
            ]}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <ListItem title="الأداء التشغيلي" subtitle={`يوجد ${activeOrdersCount} طلبًا نشطًا و${urgentOrdersCount} بحاجة متابعة دقيقة.`} badgeLabel="أداء" />
          <ListItem title="فرص النمو" subtitle="العروض القصيرة المرتبطة بفئة أو اشتراك واحد أكثر وضوحًا من الرسائل العامة." badgeLabel="فرص" />
          <ListItem title="التوصيات" subtitle="ابدأ بعرض واحد ثم راقب أثره قبل فتح مسار جديد. [TBD-binding]" badgeLabel="توصية" />
        </Surface>
      </MobileOperationalWorkspace>
    );
  }

  if (activeSection === 'settings') {
    return (
      <MobileOperationalWorkspace
        state={state}
        stateConfig={stateConfig}
        title="الإعدادات"
        description="إعدادات مختصرة وواضحة للغة الواجهة، النطاق، والتنبيهات الأساسية."
        onBack={() => updateSection('hub')}
        overview={
          <MobileCommandSummaryStrip
            items={[
              { id: 'settings-language', label: 'اللغة', value: language === 'ar' ? 'العربية' : 'English', tone: 'brand' },
              { id: 'settings-alerts', label: 'التنبيهات', value: 'مفعلة [TBD-binding]', tone: 'warning' },
              { id: 'settings-scope', label: 'الفرع', value: branchLabel },
              { id: 'settings-service', label: 'النوع', value: activeServiceType.toUpperCase(), tone: 'info' },
            ]}
          />
        }
      >
        <Surface tone="raised" gap={3}>
          <Text role="bodyStrong">لغة الواجهة</Text>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Button label="العربية" tone={language === 'ar' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setLanguage('ar')} />
            <Button label="English" tone={language === 'en' ? 'primary' : 'secondary'} fullWidth={false} onPress={() => setLanguage('en')} />
          </Box>
          <ListItem title="التنبيهات" subtitle="تخصيص التنبيهات سيُربط لاحقًا بمصدره الحي. [TBD-binding]" badgeLabel="TBD" />
          {onOpenStoreScope ? <Button label="تغيير النطاق" tone="secondary" onPress={onOpenStoreScope} /> : null}
        </Surface>
      </MobileOperationalWorkspace>
    );
  }

  return (
    <MobileOperationalWorkspace
      state={state}
      stateConfig={stateConfig}
      title="تغيير النوع"
      description="بدّل بين DSH و ARB من نفس الممر، مع توضيح حالة الربط الحالية بوضوح."
      onBack={() => updateSection('hub')}
      overview={
        <MobileCommandSummaryStrip
          items={[
            { id: 'current-type', label: 'النوع الحالي', value: activeServiceType.toUpperCase(), tone: 'brand' },
            { id: 'binding', label: 'حالة الربط', value: typeSwitchBound ? 'مرتبط محليًا' : '[TBD-binding]', tone: typeSwitchBound ? 'success' : 'warning' },
          ]}
        />
      }
    >
      <Surface tone="raised" gap={3}>
        <Box gap={2}>
          {availableTypeOptions.map((option) => (
            <Button
              key={option.id}
              label={`${option.label} · ${option.description}`}
              tone={option.id === activeServiceType ? 'primary' : 'secondary'}
              onPress={() => onSelectType?.(option.id)}
            />
          ))}
        </Box>
        <Text role="caption" tone="muted">
          {typeSwitchBound ? 'التبديل يحدّث shell الحالي مباشرة.' : '[TBD-binding] لا يوجد ربط تشغيلي فعلي بعد.'}
        </Text>
      </Surface>
    </MobileOperationalWorkspace>
  );
}

export default PartnerDshConsoleScreen;
