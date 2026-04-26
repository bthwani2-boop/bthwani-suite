import React from 'react';
import {
  Badge,
  Box,
  Button,
  KeyValueList,
  ListItem,
  MobileScrollView,
  SectionHeader,
  StateView,
  StatCard,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
} from '@bthwani/ui-kit';
import type { PartnerSupportScreenId } from './support/screens/DshPartnerGeneratedSupportScreens';

type PartnerHubSection =
  | 'orders'
  | 'profile'
  | 'operations'
  | 'inventory'
  | 'wallet'
  | 'analytics'
  | 'settings'
  | 'type-switch';

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
  onOpenMaintenance?: () => void;
  onOpenHours?: () => void;
  onOpenZones?: () => void;
  onOpenStoreScope?: () => void;
  onOpenSupportScreen?: (screenId: PartnerSupportScreenId) => void;
  onOpenSupportDirectory?: () => void;
  onOpenWalletHub?: () => void;
};

const defaultTypeOptions: readonly PartnerTypeOption[] = [
  { id: 'dsh', label: 'DSH', description: 'تشغيل الطلبات والتسليم' },
  { id: 'arb', label: 'ARB', description: 'تشغيل عرب الشركاء والمسارات' },
] as const;

const defaultServiceModes: readonly PartnerServiceMode[] = [
  { id: 'pickup', label: 'استلم بنفسك', description: 'استلام من المتجر فقط مع قناة واضحة وسريعة.', enabled: true },
  { id: 'store-delivery', label: 'توصيل المتجر', description: 'التوصيل من المتجر مع تتبع يدعم العمليات اليومية.', enabled: true },
  { id: 'seconds', label: 'توصيل بثواني', description: 'مسار سريع مخصص عندما تكون السرعة هي الأولوية.', enabled: false },
] as const;

const hubTabs: ReadonlyArray<{ value: PartnerHubSection; label: string }> = [
  { value: 'orders', label: 'الطلبات' },
  { value: 'profile', label: 'ملف المتجر' },
  { value: 'operations', label: 'العمليات والفريق' },
  { value: 'inventory', label: 'المنتجات والكتالوج' },
  { value: 'wallet', label: 'المحفظة والحسابات المالية' },
  { value: 'analytics', label: 'النمو والتسويق' },
  { value: 'settings', label: 'الإعدادات' },
  { value: 'type-switch', label: 'تبديل النوع' },
] as const;

function resolveStateNode(state: Exclude<PartnerDshConsoleScreenState, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <StateView stateId="loading" title="جاري فتح مركز الحساب" description="نجهز الآن تبويبات الشريك والاختصارات التشغيلية." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'empty') {
    return <StateView stateId="empty" title="لا يوجد محتوى حساب محمّل" description="أعد تحميل لوحة الحساب حتى تبقى التبويبات واضحة ومترابطة." actionLabel={onRetry ? 'إعادة التحميل' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <StateView stateId="offline" title="مركز الحساب غير متصل" description="أعد المحاولة عندما تعود الشبكة، مع إبقاء سياق الشريك محفوظًا." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <StateView kind="warning" title="مركز الحساب متوقف مؤقتًا" description="يتم تقييد بعض المداخل إلى أن يكتمل التحقق التشغيلي." actionLabel={onRetry ? 'تحقق الآن' : undefined} onActionPress={onRetry} />;
  }

  return <StateView stateId="recoverableError" title="تعذر عرض مركز الحساب" description="أعد المحاولة من نفس المسار دون فقدان سياق العمل." actionLabel={onRetry ? 'إعادة المحاولة' : undefined} onActionPress={onRetry} />;
}

function sectionTone(section: PartnerHubSection) {
  return section === 'orders' ? 'brand' : 'raised';
}

function resolveSupportScreen(
  screenId: PartnerSupportScreenId,
  callbacks: {
    onOpenSupportScreen?: (screenId: PartnerSupportScreenId) => void;
    onOpenSupportDirectory?: () => void;
    onOpenInventoryManagement?: () => void;
    onOpenOrdersBoard?: () => void;
    onOpenWalletHub?: () => void;
  },
) {
  if (callbacks.onOpenSupportScreen) {
    callbacks.onOpenSupportScreen(screenId);
    return;
  }

  if (screenId === 'subscription' && callbacks.onOpenWalletHub) {
    callbacks.onOpenWalletHub();
    return;
  }

  if (screenId === 'inventory-update' || screenId === 'inventory-adjust' || screenId === 'items-upsert') {
    callbacks.onOpenInventoryManagement?.();
    return;
  }

  if (screenId === 'order-get' || screenId === 'order-issue-queue' || screenId === 'order-accept' || screenId === 'order-prepare' || screenId === 'order-ready' || screenId === 'order-handoff' || screenId === 'order-out-for-delivery' || screenId === 'order-reject' || screenId === 'order-store-delivered') {
    callbacks.onOpenOrdersBoard?.();
    return;
  }

  callbacks.onOpenSupportDirectory?.();
}

export function PartnerDshConsoleScreen({
  state = 'ready',
  activeServiceType,
  section,
  onSectionChange,
  storeName = 'Burger Lab',
  branchLabel = 'الرياض، فرع الياسمين',
  cityLabel = 'الرياض',
  managerLabel = 'Khaled A.',
  todayHoursLabel = '09:00 - 23:30',
  activeZoneLabel = 'Yasmin + Al Malqa',
  storeOpen = true,
  listingEnabled = true,
  serviceModes = defaultServiceModes,
  activeOrdersCount = 12,
  urgentOrdersCount = 3,
  pendingActionsCount = 5,
  typeOptions = defaultTypeOptions,
  onSelectType,
  onOpenOrdersBoard,
  onOpenInventoryManagement,
  onOpenMaintenance,
  onOpenHours,
  onOpenZones,
  onOpenStoreScope,
  onOpenSupportScreen,
  onOpenSupportDirectory,
  onOpenWalletHub,
}: Props) {
  const { language, setLanguage } = useDirection();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('orders');
  const [inventoryQuery, setInventoryQuery] = React.useState('');
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;
  const openStoreScope = onOpenStoreScope ?? onOpenSupportDirectory ?? onOpenMaintenance;
  const openOrdersBoard = onOpenOrdersBoard ?? onOpenSupportDirectory;
  const openInventoryManagement = onOpenInventoryManagement ?? onOpenSupportDirectory;
  const openMaintenance = onOpenMaintenance ?? onOpenSupportDirectory;
  const openHours = onOpenHours ?? onOpenMaintenance ?? onOpenSupportDirectory;
  const openZones = onOpenZones ?? onOpenMaintenance ?? onOpenSupportDirectory;
  const openWalletHub = onOpenWalletHub ?? (() => resolveSupportScreen('subscription', { onOpenSupportDirectory, onOpenWalletHub }));

  if (state !== 'ready') {
    return <MobileScrollView padding={4} gap={4}>{resolveStateNode(state, openOrdersBoard)}</MobileScrollView>;
  }

  const activeModesCount = serviceModes.filter((mode) => mode.enabled).length;
  const availableTypeOptions = typeOptions.length > 0 ? typeOptions : defaultTypeOptions;

  function openSupport(screenId: PartnerSupportScreenId) {
    resolveSupportScreen(screenId, {
      onOpenSupportScreen,
      onOpenSupportDirectory,
      onOpenInventoryManagement,
      onOpenOrdersBoard,
      onOpenWalletHub,
    });
  }

  function renderOrdersSection() {
    return (
      <Surface tone={sectionTone('orders')} gap={3}>
        <SectionHeader title="الطلبات" subtitle="القلب التشغيلي الأول للشريك ويبقى مرئيًا من داخل الحساب أيضًا." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="نشطة" value={String(activeOrdersCount)} deltaLabel="اليوم" tone="brand" />
          <StatCard label="عاجلة" value={String(urgentOrdersCount)} deltaLabel="تحتاج إجراء" tone="warning" />
          <StatCard label="معلّقة" value={String(pendingActionsCount)} deltaLabel="تنتظر القرار" tone="default" />
        </Box>
        <KeyValueList
          items={[
            { label: 'المتجر', value: storeName },
            { label: 'الفرع', value: branchLabel },
            { label: 'الحالة الحالية', value: storeOpen ? 'مفتوح' : 'مغلق', tone: storeOpen ? 'success' : 'warning' },
            { label: 'الظهور', value: listingEnabled ? 'ظاهر' : 'مخفي', tone: listingEnabled ? 'success' : 'warning' },
          ]}
        />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="فتح لوحة الطلبات" onPress={openOrdersBoard} />
          <Button label="إلى الملف" tone="secondary" onPress={() => openSupport('profile-get')} />
          <Button label="إدارة مشكلة" tone="ghost" onPress={() => openSupport('order-issue-queue')} />
        </Box>
      </Surface>
    );
  }

  function renderProfileSection() {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="ملف المتجر والهوية" subtitle="الملف، الظهور، والاعتماد في سطح واحد بدل التشعب بين الشاشات." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="الملف" value="جاهز" deltaLabel="ملف المتجر" tone="brand" />
          <StatCard label="الظهور" value={listingEnabled ? 'مفعّل' : 'موقوف'} deltaLabel="الاكتشاف" tone={listingEnabled ? 'success' : 'warning'} />
          <StatCard label="الهوية" value="معتمد" deltaLabel="الامتثال" tone="info" />
        </Box>
        <KeyValueList
          items={[
            { label: 'اسم المتجر', value: storeName },
            { label: 'الفرع', value: branchLabel },
            { label: 'المدينة', value: cityLabel },
            { label: 'المدير', value: managerLabel },
            { label: 'ساعات اليوم', value: todayHoursLabel },
            { label: 'منطقة التغطية', value: activeZoneLabel, tone: 'brand' },
            { label: 'حالة المتجر', value: storeOpen ? 'مفتوح' : 'مغلق', tone: storeOpen ? 'success' : 'warning' },
            { label: 'الظهور في القائمة', value: listingEnabled ? 'مفعّل' : 'موقوف', tone: listingEnabled ? 'success' : 'warning' },
          ]}
        />
        <Box gap={2}>
          <ListItem title="ملف الفرع" subtitle="تحديث الاسم والعنوان والاتصال من مسار واحد واضح." meta="ملف المتجر" badgeLabel="Profile" />
          <ListItem title="الهوية والاعتماد" subtitle="الهوية منفصلة عن التشغيل حتى يبقى الأثر قابلاً للتدقيق." meta="اعتماد" badgeLabel="Identity" />
          <ListItem title="الظهور العام" subtitle="افصل حالة المتجر عن الظهور في القائمة والبحث." meta="اكتشاف" badgeLabel="Listing" />
        </Box>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="عرض الملف الكامل" onPress={() => openSupport('profile-get')} />
          <Button label="تعديل بيانات الفرع" tone="secondary" onPress={() => openSupport('store-update')} />
          <Button label="حالة المتجر" tone="secondary" onPress={() => openSupport('store-status-update')} />
          <Button label="الظهور والهوية" tone="ghost" onPress={() => openSupport('listing-status-update')} />
          <Button label="الامتثال والهوية" tone="ghost" onPress={() => openSupport('identity-submit')} />
          <Button label="اختيار النطاق" tone="ghost" onPress={openStoreScope} />
        </Box>
      </Surface>
    );
  }

  function renderOperationsSection() {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="العمليات والفريق" subtitle="الأوقات والمناطق والطاقم والعمولة من سطح واحد واضح." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="القنوات" value={`${activeModesCount}/${serviceModes.length}`} deltaLabel="مفعلة" tone="brand" />
          <StatCard label="الطاقم" value="3" deltaLabel="مدير + موصل + موظف" tone="info" />
          <StatCard label="الوضع" value={storeOpen ? 'نشط' : 'متوقف'} deltaLabel="حالة الفرع" tone={storeOpen ? 'success' : 'warning'} />
        </Box>
        <KeyValueList
          items={[
            { label: 'ساعات العمل', value: todayHoursLabel },
            { label: 'المناطق الفعالة', value: activeZoneLabel },
            { label: 'القنوات المفعلة', value: `${activeModesCount}/${serviceModes.length}`, tone: 'brand' },
            { label: 'وضع المتجر', value: storeOpen ? 'جاهز للتشغيل' : 'متوقف مؤقتًا', tone: storeOpen ? 'success' : 'warning' },
            { label: 'عمولة بثواني', value: 'واضحة لكل وضع', tone: 'info' },
            { label: 'الطاقم', value: 'مدير + موصل + موظف', tone: 'brand' },
          ]}
        />
        <Box gap={2}>
          <ListItem title="المدير" subtitle="يعتمد القرارات التشغيلية ويستلم التغيير الحرج." meta="دور" badgeLabel="Manager" />
          <ListItem title="الموصل" subtitle="صلاحيات تسليم فقط لطاقم التوصيل دون توسيع نطاق المتجر." meta="دور" badgeLabel="موصل" />
          <ListItem title="الموظف" subtitle="يدير الطلبات والكتالوج اليومي وفق الصلاحيات المحددة." meta="دور" badgeLabel="Staff" />
          {serviceModes.map((mode) => (
            <ListItem
              key={mode.id}
              title={mode.label}
              subtitle={mode.description}
              meta={mode.enabled ? 'مفعّل' : 'متوقف'}
              badgeLabel={mode.enabled ? 'Live' : 'Off'}
            />
          ))}
        </Box>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="إدارة الطاقم" onPress={() => openSupport('team-management')} />
          <Button label="دعوة مدير" tone="secondary" onPress={() => openSupport('manager-invite')} />
          <Button label="مساحة الصيانة" onPress={openMaintenance} />
          <Button label="ساعات العمل" tone="secondary" onPress={openHours} />
          <Button label="المناطق" tone="secondary" onPress={openZones} />
          <Button label="حالة المتجر" tone="ghost" onPress={() => openSupport('store-status-update')} />
          <Button label="أوضاع الخدمة" tone="ghost" onPress={() => openSupport('store-service-modes-update')} />
          <Button label="عمولة الوضع" tone="ghost" onPress={() => openSupport('commission-by-mode')} />
          <Button label="تحليلات الطاقم" tone="ghost" onPress={() => openSupport('staff-analytics')} />
        </Box>
      </Surface>
    );
  }

  function renderInventorySection() {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="المنتجات والكتالوج" subtitle="ابحث أولًا في الكتالوج المركزي ثم افتح القالب أو المراجعة المرحلية قبل أي حفظ." />
        <TextField
          label="بحث في الكتالوج المركزي"
          placeholder="SKU / GTIN / الاسم"
          value={inventoryQuery}
          onChangeText={setInventoryQuery}
          hint="البحث الأول يمنع تكرار المنتج ويختار النسخة المعيارية قبل التعديل."
        />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="البحث الأول" value="مفعّل" deltaLabel="بحث مركزي" tone="brand" />
          <StatCard label="الاستيراد" value="Excel / CSV" deltaLabel="إدخال جماعي" tone="info" />
          <StatCard label="التكرار" value="ممنوع" deltaLabel="مضاد للتكرار" tone="warning" />
        </Box>
        <Box gap={2}>
          <ListItem title="الكتالوج المركزي" subtitle="ابحث عن المنتج المعياري قبل إنشاء أي عنصر جديد." meta="البحث أولًا" badgeLabel="Central" />
          <ListItem title="الإدخال الجماعي" subtitle="خريطة أعمدة Excel / CSV ثم مراجعة قبل النشر." meta="استيراد" badgeLabel="Batch" />
          <ListItem title="تعديل الأسعار الجماعي" subtitle="غيّر السعر على دفعات دون خلق نسخ مكررة من المنتج نفسه." meta="تسعير جماعي" badgeLabel="Price" />
          <ListItem title="المراجعة المرحلية" subtitle="راجع الفروقات ثم احفظ دفعة واحدة بعد التأكد من التطابق." meta="مرحلة الحفظ" badgeLabel="Review" />
        </Box>
        <Text role="caption" tone="muted">
          {inventoryQuery.trim() ? `جارٍ تضييق النتائج وفقًا لـ: ${inventoryQuery}` : 'هذا القسم مصمم لإدخال آلاف المنتجات بسرعة من دون تضخيم البيانات أو تكرار الأسماء والصور.'}
        </Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="إدارة المنتجات" onPress={openInventoryManagement} />
          <Button label="بحث ثم إدخال" tone="secondary" onPress={() => openSupport('items-upsert')} />
          <Button label="تحديث جماعي" tone="secondary" onPress={() => openSupport('inventory-update')} />
          <Button label="تعديل سريع" tone="ghost" onPress={() => openSupport('inventory-adjust')} />
        </Box>
      </Surface>
    );
  }

  function renderWalletSection() {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="المحفظة والحسابات المالية" subtitle="الاشتراك والعمولات والتسويات في مكان واحد مفهوم." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="الخطة" value="بثواني برو" deltaLabel="مفعلة" tone="brand" />
          <StatCard label="التسويات" value="جاهزة" deltaLabel="على المسار المالي" tone="success" />
          <StatCard label="العمولة" value="واضحة" deltaLabel="حسب الوضع" tone="info" />
        </Box>
        <KeyValueList
          items={[
            { label: 'الاشتراك', value: 'بثواني برو' },
            { label: 'العمولة بحسب الوضع', value: 'مفصلة ومفهومة' },
            { label: 'السحب والتسويات', value: 'مرتبطة بمسار مالي واحد', tone: 'brand' },
            { label: 'المزامنة', value: 'فورية', tone: 'success' },
          ]}
        />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="إدارة الاشتراك" onPress={() => openSupport('subscription')} />
          <Button label="عمولة الأوضاع" tone="secondary" onPress={() => openSupport('commission-by-mode')} />
          <Button label="التسويات المالية" tone="ghost" onPress={openWalletHub} />
        </Box>
      </Surface>
    );
  }

  function renderAnalyticsSection() {
    const insightRows = [
      {
        label: 'تشغيلي',
        value: `${activeOrdersCount} طلبًا نشطًا و${urgentOrdersCount} عاجلًا يحتاجان ترتيبًا قبل الذروة. [TBD-binding]`,
        tone: 'brand' as const,
      },
      {
        label: 'تسويقي',
        value: 'العروض القصيرة المرتبطة بفئة أو اشتراك أو منتج أقوى من الرسائل العامة. [TBD-binding]',
        tone: 'warning' as const,
      },
      {
        label: 'الطلب',
        value: 'الفئات الأعلى دورانًا تستحق الظهور الأول في العروض والشريط الإخباري. [TBD-binding]',
        tone: 'info' as const,
      },
      {
        label: 'المنتجات والفئات',
        value: 'اربط المنتجات الأعلى طلبًا بباندل أو عرض واضح بدل تركها كعنصر منفصل فقط. [TBD-binding]',
        tone: 'success' as const,
      },
      {
        label: 'التوصية التالية',
        value: 'افتح audience-insights ثم subscription ثم video-upload لتصعيد فرصة النمو من نفس المركز. [TBD-binding]',
        tone: 'brand' as const,
      },
    ] as const;

    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="التحليلات والنمو والتسويق" subtitle="قراءات تشغيلية وتسويقية تحوّل الأرقام إلى قرار واضح وخطوة تالية واحدة." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="التشغيل" value={String(activeOrdersCount)} deltaLabel="طلبات نشطة" tone="brand" />
          <StatCard label="النمو" value="12%" deltaLabel="آخر 7 أيام" tone="success" />
          <StatCard label="الطلب" value="5" deltaLabel="فئات تقود الأداء" tone="info" />
          <StatCard label="العروض" value="8%" deltaLabel="أثر الخصم" tone="warning" />
        </Box>
        <Surface tone="inset" gap={2}>
          <SectionHeader title="قراءة تنفيذية" subtitle="كل سطر هنا ينتهي بإجراء يمكن فتحه من نفس المركز." />
          <KeyValueList items={insightRows} />
        </Surface>
        <Box gap={2}>
          <ListItem title="العروض والخصومات" subtitle="اربط الخصم القصير بفئة أو اشتراك أو منتج واضح بدل الرسائل العامة." meta="Offer lift" badgeLabel="Offers" />
          <ListItem title="الاشتراكات والفرص" subtitle="افهم أين ينتقل الشريك إلى الخطة الأعلى أو إضافة مزايا جديدة." meta="Plan move" badgeLabel="Plans" />
          <ListItem title="أفضل المنتجات والفئات" subtitle="حدّد الفئات التي تحرك الطلب أسرع من غيرها واعطها الأولوية في العرض." meta="Category mix" badgeLabel="Growth" />
        </Box>
        <Text role="caption" tone="muted">
          القراءات الحالية fixtures مرئية فقط حتى يثبت مصدر البيانات الحي [TBD-binding].
        </Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="تحليلات الجمهور" onPress={() => openSupport('audience-insights')} />
          <Button label="الاشتراك" tone="secondary" onPress={() => openSupport('subscription')} />
          <Button label="العمولة حسب الوضع" tone="secondary" onPress={() => openSupport('commission-by-mode')} />
          <Button label="فيديوهات التسويق" tone="ghost" onPress={() => openSupport('video-upload')} />
        </Box>
      </Surface>
    );
  }

  function renderSettingsSection() {
    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="الإعدادات" subtitle="لغة الواجهة، نطاق العرض، ومسارات التشغيل الأساسية، مع تمييز واضح لما هو [TBD-binding]." />
        <KeyValueList
          items={[
            { label: 'اللغة الحالية', value: language === 'ar' ? 'العربية' : 'English' },
            { label: 'التنبيهات', value: 'مفعلة [TBD-binding]' },
            { label: 'النطاق', value: branchLabel },
            { label: 'النوع', value: activeServiceType === 'dsh' ? 'DSH [TBD-binding]' : 'ARB [TBD-binding]', tone: 'brand' },
          ]}
        />
        <Text role="caption" tone="muted">
          اللغة متصلة فعليًا عبر direction، أما التنبيهات والتبديل التشغيلي فتبقى [TBD-binding] حتى يثبت الربط.
        </Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="العربية" tone={language === 'ar' ? 'primary' : 'secondary'} onPress={() => setLanguage('ar')} />
          <Button label="English" tone={language === 'en' ? 'primary' : 'secondary'} onPress={() => setLanguage('en')} />
          <Button label="تغيير النطاق" tone="secondary" onPress={openStoreScope} />
          <Button label="دليل الدعم" tone="ghost" onPress={onOpenSupportDirectory} />
        </Box>
      </Surface>
    );
  }

  function renderTypeSwitchSection() {
    const typeSwitchIsBound = typeof onSelectType === 'function';

    return (
      <Surface tone="raised" gap={3}>
        <SectionHeader title="تغيير النوع" subtitle="بدّل بين DSH و ARB دون خلط مسارين أو هويات تشغيلية." />
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
          {typeSwitchIsBound
            ? activeServiceType === 'dsh'
              ? 'الآن أنت داخل DSH. النوع الآخر يبقى متاحًا من نفس الممر.'
              : 'الآن أنت داخل ARB. النوع الآخر متاح من هنا أيضًا بدون فقدان السياق.'
            : '[TBD-binding] تبديل النوع غير موصول بعد، لكن البنية واضحة ومهيأة للربط.'}
        </Text>
      </Surface>
    );
  }

  function renderSectionContent() {
    if (activeSection === 'profile') return renderProfileSection();
    if (activeSection === 'operations') return renderOperationsSection();
    if (activeSection === 'inventory') return renderInventorySection();
    if (activeSection === 'wallet') return renderWalletSection();
    if (activeSection === 'analytics') return renderAnalyticsSection();
    if (activeSection === 'settings') return renderSettingsSection();
    if (activeSection === 'type-switch') return renderTypeSwitchSection();
    return renderOrdersSection();
  }

  return (
    <MobileScrollView padding={4} gap={4}>
      <Surface tone="brand" gap={3}>
        <Box gap={1}>
          <Badge label={activeServiceType === 'dsh' ? 'DSH' : 'ARB'} tone="warning" />
          <Text role="titleLg" tone="inverse">{activeServiceType === 'dsh' ? 'مركز حساب الشريك' : 'مركز حساب الشريك - ARB'}</Text>
          <Text role="bodySm" tone="inverse" style={{ opacity: 0.95 }}>
            {activeServiceType === 'dsh'
              ? 'التبويبات الأساسية هنا: الطلبات، ملف المتجر، العمليات والفريق، المنتجات والكتالوج، المحفظة المالية، النمو والتسويق، والإعدادات. كل شيء في سطح واحد بدون تشتيت.'
              : 'يمكنك تبديل النوع، ورؤية المسارات الأساسية من نفس المركز دون خلط سياقات التشغيل.'}
          </Text>
        </Box>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <StatCard label="طلب نشط" value={String(activeOrdersCount)} deltaLabel="اليوم" tone="brand" />
          <StatCard label="عاجل" value={String(urgentOrdersCount)} deltaLabel="يحتاج قرارًا" tone="warning" />
          <StatCard label="معلّق" value={String(pendingActionsCount)} deltaLabel="مرئي الآن" tone="default" />
        </Box>

        <KeyValueList
          items={[
            { label: 'المتجر', value: storeName, tone: 'default' },
            { label: 'الفرع', value: branchLabel, tone: 'default' },
            { label: 'الساعات', value: todayHoursLabel, tone: 'default' },
            { label: 'المنطقة', value: activeZoneLabel, tone: 'default' },
          ]}
        />
      </Surface>

      <Tabs
        items={hubTabs}
        value={activeSection}
        onValueChange={updateSection}
        variant="pill"
        scrollable
        wrap
      />

      {renderSectionContent()}

      <Surface tone="inset" gap={2}>
        <SectionHeader title="اختصارات سريعة" subtitle="وصول مباشر إلى المسارات الأكثر استخدامًا دون تكرار واجهات." />
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="الطلبات" onPress={openOrdersBoard} />
          <Button label="المخزون" tone="secondary" onPress={openInventoryManagement} />
          <Button label="الصيانة" tone="secondary" onPress={openMaintenance} />
          <Button label="الدعم" tone="ghost" onPress={onOpenSupportDirectory} />
        </Box>
      </Surface>
    </MobileScrollView>
  );
}

export default PartnerDshConsoleScreen;
