import React from 'react';
import { Pressable, Switch as RNSwitch, View, Share, BackHandler } from 'react-native';
import {
  AppearanceOptionCard,
  Box,
  Button,
  Chip,
  colorPalette,
  Divider,
  Icon,
  KeyValueList,
  MobileCommandSectionList,
  MobileScrollView,
  MobileStickyPrimaryAction,
  ModernPremiumHeader,
  StateView,
  Surface,
  Text,
  TextField,
  useDirection,
  useTheme,
  StoreHero,
  TopBar,
  ListItem,
} from '@bthwani/ui-kit';
import type { BThwaniAppearanceMode } from '@bthwani/ui-kit';
import {
  getWltDshPartnerCommissionLabel,
  getWltDshPartnerOperationalModeCommission,
  wltDshPartnerUiCopy,
} from '../../../../wlt/frontend/app-partner/dsh/wlt-dsh-partner.ui-copy';
import { useAppPartnerAppearance } from '../../../../app-partner/shell/appearance';
import { canonicalPreviewStores, getCanonicalPreviewStoreCard } from '../../shared/dshStoreProductCardModel';
import { mapPublishStageToPartnerActivationStatus, resolveDshStoreClientVisibility } from '../../shared/dsh-client-visibility.model';
import { dshPromotionCandidates, type DshPromotionCandidate } from '../../shared/workflow';
import { WltDshPartnerBridge, wltDshPartnerPreviewData } from '../../../../wlt/frontend/app-partner/dsh';
import type { DshFulfillmentDeliveryMode } from '../../app-client/contracts/dsh-client-binding.contracts';
import type { DshPartnerHubSurfaceProps, PartnerHubSection } from '../dsh-partner.types';
import { getDshControlPanelGovernanceEntry, resolveDshControlPanelSectionLabel } from '../../shared';
import {
  getDshPartnerJourneyStep,
  resolveDshPartnerLifecycleStageLabel,
  type DshPartnerLifecycleStage,
} from '../../shared/dsh-partner-onboarding-journey.map';
import { getDshPartnerActivationStatusLabel } from '../../shared/dsh-partner-activation.model';
import { resolveDshImageSource } from '../../shared/resolve-dsh-image-source';
import { InventoryCatalogScreen } from './InventoryCatalogScreen';
import { PromotionsScreen } from './PromotionsScreen';
import { StoreProfileScreen } from './StoreProfileScreen';

type PartnerOperationalMode = {
  id: DshFulfillmentDeliveryMode;
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

type HubNavigationItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  section: Exclude<PartnerHubSection, 'hub'>;
};

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'info';
};

type NotificationPreferenceId =
  | 'orders'
  | 'operations'
  | 'inventory'
  | 'finance'
  | 'marketing'
  | 'system'
  | 'sound'
  | 'dailyDigest'
  | 'priorityOnly';

type NotificationPreferenceState = Record<NotificationPreferenceId, boolean>;

const defaultOperationalModes: readonly PartnerOperationalMode[] = [
  { id: 'pickup', title: 'استلم بنفسك', subtitle: 'استلام من الفرع مباشرة.', commission: getWltDshPartnerOperationalModeCommission('pickup'), enabled: true },
  { id: 'partner_delivery', title: 'توصيل المتجر', subtitle: 'قناة توصيل داخلية بموصل الشريك.', commission: getWltDshPartnerOperationalModeCommission('partner_delivery'), enabled: true },
  { id: 'bthwani_delivery', title: 'توصيل بثواني', subtitle: 'توصيل عبر كابتن بثواني.', commission: getWltDshPartnerOperationalModeCommission('bthwani_delivery'), enabled: false },
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

const partnerHubBottomInset = 144;

const defaultNotificationPreferences: NotificationPreferenceState = {
  orders: true,
  operations: true,
  inventory: true,
  finance: true,
  marketing: false,
  system: true,
  sound: true,
  dailyDigest: false,
  priorityOnly: false,
};

const partnerAppearanceOptions: ReadonlyArray<{
  mode: BThwaniAppearanceMode;
  title: string;
  description: string;
}> = [
  {
    mode: 'lightPremium',
    title: 'فاتح أبيض',
    description: 'واجهة فاتحة واضحة، والزجاج يظهر فقط فيما يحدده المطور أثناء مراجعة الشاشات',
  },
  {
    mode: 'darkGlass',
    title: 'داكن زجاجي',
    description: 'مظهر داكن فاخر مع حواف زجاجية وطبقات واضحة بدون إزعاج بصري',
  },
] as const;

const hubNavigationItems: readonly HubNavigationItem[] = [
  {
    id: 'profile',
    title: 'ملف المتجر',
    description: 'بيانات المتجر، الهوية، الظهور، الفرع، والنطاق في مساحة واحدة.',
    icon: 'storefront-outline',
    section: 'profile',
  },
  {
    id: 'wallet',
    title: wltDshPartnerUiCopy.walletSectionTitle,
    description: wltDshPartnerUiCopy.walletSectionDescription,
    icon: 'wallet-outline',
    section: 'wallet',
  },
  {
    id: 'operations',
    title: 'المتجر والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
    section: 'operations',
  },
  {
    id: 'inventory',
    title: 'المخزون والكتالوج',
    description: 'بحث أولًا، إضافة ذكية، أسعار ومخزون بدون تكرار.',
    icon: 'cube-outline',
    section: 'inventory',
  },
  {
    id: 'analytics',
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، الاشتراك، والتوصيات العملية.',
    icon: 'trending-up-outline',
    section: 'analytics',
  },
  {
    id: 'settings',
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
    section: 'settings',
  },
] as const;

const sectionCopy: Record<Exclude<PartnerHubSection, 'hub'>, { title: string; description: string; icon: React.ComponentProps<typeof Icon>['name'] }> = {
  profile: {
    title: 'ملف المتجر',
    description: 'بيانات المتجر، الهوية، الظهور، الفرع، والنطاق في مساحة واحدة.',
    icon: 'storefront-outline',
  },
  operations: {
    title: 'المتجر والفريق',
    description: 'حالة المتجر، التوصيل، الفريق، ومناطق التغطية.',
    icon: 'people-outline',
  },
  inventory: {
    title: 'المخزون والكتالوج',
    description: 'بحث أولًا، إضافة ذكية، أسعار ومخزون بدون تكرار.',
    icon: 'cube-outline',
  },
  wallet: {
    title: wltDshPartnerUiCopy.walletSectionTitle,
    description: wltDshPartnerUiCopy.walletSectionDescription,
    icon: 'wallet-outline',
  },
  analytics: {
    title: 'التحليلات والنمو والتسويق',
    description: 'الأداء، الفرص، العروض، الاشتراك، والتوصيات العملية.',
    icon: 'trending-up-outline',
  },
  settings: {
    title: 'الإعدادات',
    description: 'التنبيهات، اللغة، التفضيلات، وإعدادات المتجر.',
    icon: 'settings-outline',
  },
};

type PromotionIntentState = 'ready' | 'empty' | 'pending' | 'blocked';

function resolvePromotionIntentStateMeta(state: PromotionIntentState) {
  if (state === 'pending') {
    return {
      stateId: 'empty' as const,
      title: 'طلب الترويج قيد المراجعة',
      description: 'النية الترويجية مسجلة محليًا وتنتظر مواءمة التسويق أو الشريك.',
      actionLabel: 'تحديث النية',
    };
  }

  if (state === 'blocked') {
    return {
      stateId: 'blockingError' as const,
      title: 'لا يمكن إعداد النية الآن',
      description: 'العنصر المختار غير جاهز للترويج أو يحتاج معالجة قبل الإرسال.',
      actionLabel: 'مراجعة الجاهزية',
    };
  }

  if (state === 'empty') {
    return {
      stateId: 'empty' as const,
      title: 'لا توجد عناصر قابلة للترويج',
      description: 'أضف منتجًا أو متجرًا مناسبًا ثم أعد فتح المسار الترويجي.',
      actionLabel: 'اختيار عنصر',
    };
  }

  return {
    stateId: 'loading' as const,
    title: 'مسار الترويج قيد التحضير',
    description: 'نجهز مساحة الشريك لالتقاط نية الترويج قبل تسليمها للتسويق.',
    actionLabel: 'فتح المسار',
  };
}

function PromotionCandidateRow({
  item,
  selected,
  onPress,
}: {
  item: DshPromotionCandidate;
  selected: boolean;
  onPress: () => void;
}) {
  const tone = item.eligibility === 'eligible' ? 'success' : item.eligibility === 'review' ? 'warning' : 'danger';

  const statusLabel =
    item.status === 'draft' ? 'مسودة' :
    item.status === 'partner-review' ? 'قيد الإرسال' :
    item.status === 'marketing-ready' ? 'معتمد ومؤهل' :
    'مرفوض';

  const statusTone =
    item.status === 'marketing-ready' ? 'success' :
    item.status === 'partner-review' ? 'warning' :
    item.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Surface tone="default" padding={3} gap={2} style={{ borderWidth: 1, borderColor: selected ? colorPalette.brand : undefined }}>
      <Box gap={1}>
        <Text role="bodyStrong">{item.title}</Text>
        <Text role="bodySm" tone="muted">{item.subtitle}</Text>
      </Box>

      <Box gap={1}>
        <Text role="caption" tone="muted">{item.availability}</Text>
        <Text role="caption" tone="muted">{item.offerHint}</Text>
      </Box>

      <Box layoutDirection="row" style={{ flexWrap: 'wrap' }} gap={2}>
        <Chip label={item.kind === 'product' ? 'منتج' : 'متجر'} tone="brand" selected />
        <Chip label={item.eligibility === 'eligible' ? 'مؤهل' : item.eligibility === 'review' ? 'تحت المراجعة' : 'محجوب'} tone={tone} />
        <Chip label={statusLabel} tone={statusTone} />
      </Box>

      <Button label={selected ? 'العنصر مفتوح' : 'اختيار العنصر'} tone={selected ? 'secondary' : 'ghost'} fullWidth={false} onPress={onPress} />
    </Surface>
  );
}

function PromotionIntentPanel({
  storeName,
  branchLabel,
  activeZoneLabel,
  todayHoursLabel,
}: {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
}) {
  const { direction } = useDirection();
  const [selectedId, setSelectedId] = React.useState<string>(dshPromotionCandidates[0]?.id ?? '');
  const [offerTitle, setOfferTitle] = React.useState('عرض نهاية الأسبوع');
  const [offerNote, setOfferNote] = React.useState('خصم قصير على المنتجات الأعلى طلبًا مع إبراز واضح.');
  const [actionMessage, setActionMessage] = React.useState('النية الترويجية محلية حتى يتم تسليمها للتسويق.');

  const selectedItem = dshPromotionCandidates.find((item) => item.id === selectedId) ?? dshPromotionCandidates[0];

  const statusLabel =
    selectedItem?.status === 'draft' ? 'مسودة' :
    selectedItem?.status === 'partner-review' ? 'قيد الإرسال' :
    selectedItem?.status === 'marketing-ready' ? 'معتمد ومؤهل' :
    'مرفوض';
  const statusTone =
    selectedItem?.status === 'marketing-ready' ? 'success' :
    selectedItem?.status === 'partner-review' ? 'warning' :
    selectedItem?.status === 'marketing-rejected' ? 'danger' :
    'default';

  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">نية الترويج من الشريك</Text>
        <Text role="titleSm">اختر منتجًا أو متجرًا قابلًا للترويج ثم جهّز الطلب للتسويق</Text>
        <Text role="bodySm" tone="muted">
          هذه الشاشة تلتقط نية الترويج فقط: اختيار العنصر، وصف العرض، وتحديد حالة الإرسال.
        </Text>

        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap' }} gap={2}>
          <Chip label={storeName} tone="brand" />
          <Chip label={branchLabel} tone="info" />
          <Chip label={activeZoneLabel} tone="success" />
          <Chip label={todayHoursLabel} tone="warning" />
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="titleSm">العناصر القابلة للترويج</Text>
        <Box gap={2}>
          {dshPromotionCandidates.map((item) => (
            <PromotionCandidateRow key={item.id} item={item} selected={item.id === selectedItem?.id} onPress={() => setSelectedId(item.id)} />
          ))}
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="titleSm">تفاصيل نية الترويج</Text>
        <KeyValueList
          dense
          items={[
            { label: 'العنصر المختار', value: selectedItem?.title ?? 'غير محدد' },
            { label: 'النوع', value: selectedItem?.kind === 'store' ? 'متجر' : 'منتج', tone: 'brand' },
            { label: 'الأهلية', value: selectedItem?.eligibility === 'eligible' ? 'مؤهل' : selectedItem?.eligibility === 'review' ? 'تحت المراجعة' : 'محجوب', tone: selectedItem?.eligibility === 'eligible' ? 'success' : selectedItem?.eligibility === 'review' ? 'warning' : 'danger' },
            { label: 'الحالة', value: statusLabel, tone: statusTone },
          ]}
        />

        <Box gap={2}>
          <TextField label="عنوان العرض" value={offerTitle} onChangeText={setOfferTitle} placeholder="عنوان العرض" />
          <TextField label="ملاحظات النية" value={offerNote} onChangeText={setOfferNote} placeholder="وصف مختصر للعرض أو سبب الترويج" multiline />
        </Box>

        <Surface tone="inset" padding={3} gap={2}>
          <Text role="bodyStrong">آخر رسالة</Text>
          <Text role="bodySm" tone="muted">{actionMessage}</Text>
        </Surface>

        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <Button label="تأكيد نية الترويج" tone="primary" fullWidth={false} onPress={() => setActionMessage(`تم إرسال النية: ${offerTitle}`)} />
          <Button label="طلب إبراز في الرئيسية" tone="secondary" fullWidth={false} onPress={() => setActionMessage(`طلب إبراز: ${selectedItem?.title ?? 'غير محدد'}`)} />
          <Button label="تمييز المنتج" tone="ghost" fullWidth={false} onPress={() => setActionMessage(`تم وضع العنصر ضمن قائمة الترويج: ${selectedItem?.title ?? 'غير محدد'}`)} />
        </Box>
      </Surface>

      <MobileStickyPrimaryAction
        label="إرسال طلب الترويج"
        helperText="النية الترويجية محلية وتذهب للمراجعة فور إرسالها."
        onPress={() => setActionMessage(`تم إرسال النية: ${offerTitle}`)}
      />
    </Box>
  );
}

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

function SettingsOptionRow({
  title,
  subtitle,
  icon,
  value,
  onValueChange,
  onPress,
  last = false,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  value?: boolean;
  onValueChange?: (nextValue: boolean) => void;
  onPress?: () => void;
  last?: boolean;
  disabled?: boolean;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  const isSwitchRow = typeof value === 'boolean' && typeof onValueChange === 'function';

  return (
    <Pressable
      accessibilityRole={isSwitchRow ? undefined : 'button'}
      accessibilityLabel={title}
      accessibilityState={isSwitchRow ? undefined : { disabled }}
      disabled={disabled}
      onPress={isSwitchRow ? undefined : onPress}
      style={({ pressed }) => [
        {
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: pressed ? theme.surfaceInset : theme.surface,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: theme.line,
          opacity: disabled ? 0.56 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: rowDirection, alignItems: 'center' }}>
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 12, flexShrink: 1, minWidth: 0 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.surfaceInset,
              borderWidth: 1,
              borderColor: theme.line,
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={17} tone={isSwitchRow && value ? 'brand' : 'default'} />
          </View>

          <View style={{ flexShrink: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={1}>
              {title}
            </Text>
            <Text role="bodySm" tone="muted" style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {isSwitchRow ? (
          <RNSwitch
            disabled={disabled}
            value={value}
            onValueChange={onValueChange}
            thumbColor={value ? theme.brandContrast : theme.surfaceRaised}
            trackColor={{ false: theme.lineStrong, true: theme.brand }}
            ios_backgroundColor={theme.lineStrong}
          />
        ) : (
          <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
        )}
      </View>
    </Pressable>
  );
}

/** Section shell — no TopBar/back button; hardware back handles navigation.
 * Section title is displayed inline as a visual header inside the content. */
function HubSectionShell({
  title,
  icon,
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
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

  React.useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      {/* Visual section title — no back button, hardware back handles it */}
      <View
        style={{
          flexDirection: rowDirection,
          alignItems: 'center',
          gap: 12,
          paddingBottom: 4,
          borderBottomWidth: 1,
          borderBottomColor: theme.line,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.brandSurface,
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={18} tone="brand" />
        </View>
        <Text
          role="titleSm"
          style={{ textAlign: direction === 'rtl' ? 'right' : 'left', flex: 1 }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {children}
      </View>
    </MobileScrollView>
  );
}

/** Premium nav row: icon + title + subtitle on the content side, chevron on the action side. RTL-correct. */
function HubNavRow({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onPress: () => void;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: rowDirection,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: pressed ? theme.surfaceInset : theme.surfaceRaised,
        gap: 12,
        borderWidth: 1,
        borderColor: theme.line,
      })}
    >
      {/* Icon + Text cluster — stays together on the content side */}
      <View
        style={{
          flexDirection: rowDirection,
          alignItems: 'center',
          gap: 12,
          flex: 1,
          minWidth: 0,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.brandSurface,
            borderWidth: 1,
            borderColor: theme.brand + '33',
            flexShrink: 0,
          }}
        >
          <Icon name={icon} size={20} tone="brand" />
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 0,
            gap: 2,
            alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start',
          }}
        >
          <Text
            role="bodyStrong"
            numberOfLines={1}
            style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
          >
            {title}
          </Text>
          <Text
            role="bodySm"
            tone="muted"
            numberOfLines={2}
            style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
          >
            {description}
          </Text>
        </View>
      </View>

      {/* Chevron — always on the action/opposite side */}
      <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
    </Pressable>
  );
}


function resolveServiceModeEnabled(serviceModes: readonly { id: string; enabled: boolean }[] | undefined, modeId: PartnerOperationalMode['id'], fallback: boolean) {
  const matched = serviceModes?.find((mode) => {
    if (modeId === 'pickup') return mode.id === 'pickup';
    // transitional aliases: legacy `delivery` plus textual `store delivery` / `partner delivery`
    // all map to canonical `partner_delivery` which is displayed as "توصيل المتجر".
    if (modeId === 'partner_delivery') {
      return mode.id === 'partner_delivery'
        || mode.id === 'partner delivery'
        || mode.id === 'delivery'
        || mode.id === 'store-delivery'
        || mode.id === 'store delivery';
    }
    // transitional aliases: legacy 'scheduled' / 'seconds' map to bthwani_delivery
    return mode.id === 'bthwani_delivery' || mode.id === 'scheduled' || mode.id === 'seconds';
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
            <Icon name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline'} size={16} tone={selected ? 'brand' : 'default'} />
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
            {getWltDshPartnerCommissionLabel(mode.commission)}
          </Text>
        </View>

        <Icon name="chevron-forward-outline" mirrored tone="muted" size={18} />
      </View>
    </Pressable>
  );
}

function OperationsPanel({
  branchLabel,
  cityLabel,
  storeName,
  todayHoursLabel,
  storeOpen,
  activeZoneLabel,
  serviceModes,
  onBack,
  onOpenStoreCourierSetup,
  listingEnabled,
  storeVisibility,
  visibilityLabel,
}: {
  branchLabel: string;
  cityLabel: string;
  storeName: string;
  todayHoursLabel: string;
  storeOpen: boolean;
  activeZoneLabel: string;
  serviceModes: readonly { id: string; label: string; description: string; enabled: boolean }[];
  onBack: () => void;
  onOpenStoreCourierSetup?: () => void;
  listingEnabled: boolean;
  storeVisibility: ReturnType<typeof resolveDshStoreClientVisibility>;
  visibilityLabel: string;
}) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const [selectedModeId, setSelectedModeId] = React.useState<PartnerOperationalMode['id']>('pickup');
  const [modeOverrides, setModeOverrides] = React.useState<Partial<Record<PartnerOperationalMode['id'], boolean>>>({});
  const [teamPanelOpen, setTeamPanelOpen] = React.useState(false);
  const [coveragePanelOpen, setCoveragePanelOpen] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>('');
  const [selectedZoneId, setSelectedZoneId] = React.useState<string>('');
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

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
      <TopBar
        variant="secondary"
        title="المتجر والفريق"
        subtitle={`${storeName} · ${branchLabel}`}
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />

      {/* 1) Flat Header & Status Indicator Chips */}
      <Box gap={2} paddingVertical={2}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>
          حالة التشغيل الآن
        </Text>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label={`حالة المتجر: ${storeOpen ? 'مفتوح' : 'مغلق'}`} tone={storeOpen ? 'success' : 'warning'} selected />
          <Chip label={`ساعات العمل: ${todayHoursLabel}`} tone="info" selected />
          <Chip label={`أوضاع نشطة: ${activeModesCount}/3`} tone="brand" selected />
          <Chip label="مناطق التغطية: منطقتان" tone="success" selected />
        </Box>
      </Box>

      <Divider />

      {/* 2) Flat Visibility and Coverage Zones (Read-Only) */}
      <Box gap={3} paddingVertical={2}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>الظهور ونقاط الخدمة</Text>
        <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>شروط وجاهزية الظهور لعملاء بثواني (للمعلومة فقط).</Text>
        <KeyValueList
          dense
          items={[
            { label: 'الظهور في القائمة', value: visibilityLabel, tone: listingEnabled ? 'success' : 'warning' },
            { label: 'النطاق الحالي', value: branchLabel },
            { label: 'المنطقة', value: activeZoneLabel },
            {
              label: 'المعروض للعملاء',
              value: storeVisibility.visible ? 'ظاهر للعميل' : 'محجوب عن العميل',
              tone: storeVisibility.visible ? 'success' : 'warning',
            },
            {
              label: 'حالة التفعيل',
              value: getDshPartnerActivationStatusLabel(storeVisibility.activationStatus),
              tone: storeVisibility.visible ? 'success' : 'warning',
            },
          ]}
        />
        <Box gap={2} style={{ paddingHorizontal: 4, marginTop: 4 }}>
          <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>تفاصيل تدقيق شروط الظهور</Text>
          {storeVisibility.checklist.map((check) => (
            <Box key={check.id} style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <Text role="bodySm" tone={check.satisfied ? 'success' : 'danger'} style={{ fontWeight: 'bold' }}>
                {check.satisfied ? '✓' : '✗'}
              </Text>
              <Text role="bodySm" tone={check.satisfied ? 'default' : 'danger'} style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                {check.label}
              </Text>
              {!check.satisfied && check.blockedReason ? (
                <>
                  <View style={{ flex: 1 }} />
                  <Text role="caption" tone="muted" style={{ textAlign: direction === 'rtl' ? 'left' : 'right' }}>
                    {check.blockedReason}
                  </Text>
                </>
              ) : null}
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      {/* 3) Flat Partnership operational boundaries notice */}
      <Box paddingVertical={2} gap={1}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>حدود تشغيل الشريك</Text>
        <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
          التنفيذ المحلي للطلبات والفريق يبقى هنا، لكن تصعيد التذاكر يتبع {resolveDshControlPanelSectionLabel('support')}، وأي pricing policy أو zone pricing مركزي يتبع {resolveDshControlPanelSectionLabel('platform')}، وأي payout أو commission مرجعه finance/WLT.
        </Text>
      </Box>

      <Divider />

      {/* 4) Flat Operational Modes Row List with inline expansion */}
      <Box gap={2} paddingVertical={2}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>
          أوضاع الخدمة
        </Text>
        <Box gap={0}>
          {resolvedModes.map((mode) => {
            const isSelected = mode.id === selectedModeId;
            return (
              <Box key={mode.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '33' }}>
                <Pressable
                  onPress={() => setSelectedModeId(isSelected ? '' : mode.id)}
                  style={({ pressed }) => ({
                    flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 4,
                    backgroundColor: pressed ? theme.surfaceInset : undefined,
                  })}
                >
                  <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <Icon
                      name={mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline'}
                      size={18}
                      tone={isSelected ? 'brand' : 'default'}
                    />
                    <Box style={{ gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
                      <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>{mode.title}</Text>
                      <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>{mode.subtitle}</Text>
                    </Box>
                  </Box>
                  <Box style={{ alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end', gap: 4, marginEnd: 8 }}>
                    <Chip label={mode.enabled ? 'مفعّل' : 'غير مفعّل'} tone={mode.enabled ? 'success' : 'warning'} />
                    <Text role="caption" tone="muted">
                      {getWltDshPartnerCommissionLabel(mode.commission)}
                    </Text>
                  </Box>
                  <Icon name={isSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={16} />
                </Pressable>

                {isSelected && (
                  <Box paddingHorizontal={4} paddingBottom={4} gap={3} style={{ paddingTop: 4 }}>
                    <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
                      تفاصيل هذا الوضع تظهر داخل نفس الصفحة فقط، ويمكن تبديل حالته محليًا دون أي route جديد.
                    </Text>
                    <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', gap: 8 }}>
                      <Button
                        label={mode.enabled ? 'إيقاف الوضع' : 'تفعيل الوضع'}
                        tone="secondary"
                        size="sm"
                        fullWidth={false}
                        onPress={() => {
                          setModeOverrides((current) => ({
                            ...current,
                            [mode.id]: !mode.enabled,
                          }));
                        }}
                      />
                      {mode.id === 'partner_delivery' && onOpenStoreCourierSetup ? (
                        <Button
                          label="إعداد موصل المتجر"
                          tone="brand"
                          size="sm"
                          fullWidth={false}
                          onPress={onOpenStoreCourierSetup}
                        />
                      ) : null}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider />

      {/* 5) Flat Team Section with inline expansion */}
      <Box paddingVertical={2} gap={2}>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>الفريق</Text>
            <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>مشرف 1 · موظف 3 · موصل 2</Text>
          </Box>
          <Button
            label={teamPanelOpen ? 'إخفاء الأعضاء' : 'إدارة الفريق'}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setTeamPanelOpen((current) => !current)}
          />
        </Box>

        {teamPanelOpen && (
          <Box gap={3} style={{ paddingHorizontal: 4, marginTop: 4 }}>
            <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
              <Chip label="مشرف" tone="brand" />
              <Chip label="موظف" tone="info" />
              <Chip label="موصل" tone="success" />
            </Box>

            <Box gap={0}>
              {defaultTeamMembers.map((member) => {
                const isMemberSelected = selectedMemberId === member.id;
                return (
                  <Box key={member.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '22', paddingVertical: 8 }}>
                    <Pressable
                      onPress={() => setSelectedMemberId(isMemberSelected ? '' : member.id)}
                      style={({ pressed }) => ({
                        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: pressed ? theme.surfaceInset : undefined,
                        padding: 4,
                      })}
                    >
                      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Icon name="person-outline" size={16} tone="brand" />
                        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>{member.name}</Text>
                      </Box>
                      <Chip label={member.roleLabel} tone={member.roleLabel === 'مشرف' ? 'brand' : member.roleLabel === 'موظف' ? 'info' : 'success'} />
                      <Icon name={isMemberSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={14} style={{ marginStart: 8 }} />
                    </Pressable>

                    {isMemberSelected && (
                      <Box paddingHorizontal={4} paddingTop={2} gap={1}>
                        <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>{member.subtitle}</Text>
                        <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>الصلاحية: {member.roleLabel}</Text>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box gap={3} style={{ marginTop: 8 }}>
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
                size="sm"
                fullWidth={false}
                onPress={() => {
                  if (!inviteDraft.trim()) {
                    return;
                  }
                  setLastSaveLabel(`دعوة محلية: ${inviteDraft.trim()}`);
                  setInviteDraft('');
                }}
              />
              {lastSaveLabel && (
                <Text role="caption" tone="success" align={direction === 'rtl' ? 'end' : 'start'}>
                  {lastSaveLabel}
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {/* 6) Flat Coverage Zones Section with inline expansion */}
      <Box paddingVertical={2} gap={2}>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box style={{ gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
            <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>مناطق التغطية</Text>
            <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>منطقتان نشطتان</Text>
          </Box>
          <Button
            label={coveragePanelOpen ? 'إخفاء المناطق' : 'إدارة المناطق'}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setCoveragePanelOpen((current) => !current)}
          />
        </Box>

        {coveragePanelOpen && (
          <Box gap={3} style={{ paddingHorizontal: 4, marginTop: 4 }}>
            <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
              {`النطاق الحالي: ${activeZoneLabel}`}
            </Text>

            <Box gap={0}>
              {defaultCoverageZones.map((zone) => {
                const isZoneSelected = selectedZoneId === zone.id;
                return (
                  <Box key={zone.id} style={{ borderBottomWidth: 1, borderBottomColor: theme.line + '22', paddingVertical: 8 }}>
                    <Pressable
                      onPress={() => setSelectedZoneId(isZoneSelected ? '' : zone.id)}
                      style={({ pressed }) => ({
                        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: pressed ? theme.surfaceInset : undefined,
                        padding: 4,
                      })}
                    >
                      <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Icon name="location-outline" size={16} tone="brand" />
                        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>{zone.name}</Text>
                      </Box>
                      <Chip label={zone.active ? 'نشط' : 'موقوف'} tone={zone.active ? 'success' : 'warning'} />
                      <Icon name={isZoneSelected ? 'chevron-down' : 'chevron-forward-outline'} mirrored tone="muted" size={14} style={{ marginStart: 8 }} />
                    </Pressable>

                    {isZoneSelected && (
                      <Box paddingHorizontal={4} paddingTop={2} gap={1}>
                        <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>{zone.subtitle}</Text>
                        <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>حالة المنطقة: {zone.active ? 'تستقبل الطلبات' : 'مغلقة مؤقتًا'}</Text>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <MobileStickyPrimaryAction
        label="حفظ إعدادات العمليات"
        helperText={lastSaveLabel ? `آخر حفظ: ${lastSaveLabel}` : 'التعديلات تحفظ من نفس الصفحة.'}
        onPress={() => setLastSaveLabel(new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }))}
      />
    </MobileScrollView>
  );
}

/** Analytics view-model — preview/seed data only.
 * No customer PII. Summary metrics only per on-demand retrieval contract.
 * Designed for later real-data binding without layout changes. */
const dshPartnerAnalyticsPreview = {
  storeFavoritesCount: 847,
  productFavoritesCount: 2_340,
  followersCount: 1_200,
  totalRatings: 318,
  averageRating: 4.9,
  topOrderedProduct: { name: 'علبة تمر فاخر', ordersCount: 214 },
  topFavoritedProduct: { name: 'تمر المجدول الملكي', favoritesCount: 189 },
  topViewedProduct: { name: 'تمر الأمبر الذهبي', viewsCount: 1_080 },
  opportunityProduct: {
    name: 'تمر المجدول الملكي',
    favoritesCount: 189,
    ordersCount: 22,
    insight: 'مفضّل كثيرًا لكنه لم يتحول لطلبات كافية. فرصة عرض قصير.',
  },
  smartRecommendation: 'فعّل خصمًا قصيرًا 15٪ على المنتج الأعلى حفظًا لمدة 3 أيام.',
} as const;

function AnalyticsInsightMetric({ label, value, tone = 'default', icon }: { label: string; value: string; tone?: 'default' | 'brand' | 'success' | 'info'; icon: React.ComponentProps<typeof Icon>['name'] }) {
  const { theme } = useTheme();
  const { direction } = useDirection();
  const accentColor = tone === 'brand' ? theme.brand : tone === 'success' ? theme.success : tone === 'info' ? theme.info : theme.lineStrong;

  return (
    <Surface
      tone="default"
      padding={3}
      gap={1}
      style={{ flex: 1, minWidth: 140, borderWidth: 1, borderColor: accentColor }}
    >
      <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={14} tone={tone} />
        <Text role="caption" tone="muted" numberOfLines={1} style={{ flex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
          {label}
        </Text>
      </View>
      <Text role="titleSm" tone={tone} numberOfLines={1} align="start">
        {value}
      </Text>
    </Surface>
  );
}

function AnalyticsInsightsPanel({ storeName }: { storeName: string }) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const d = dshPartnerAnalyticsPreview;

  return (
    <Box gap={4}>
      {/* Summary headline */}
      <Surface tone="raised" padding={3} gap={2}>
        <Text role="label" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
          ملخص الأداء — {storeName}
        </Text>
        <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'}>
          مؤشرات موجزة للتفاعل والنمو. لا تتضمن بيانات عملاء تفصيلية.
        </Text>
      </Surface>

      {/* Engagement metrics grid */}
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>مؤشرات التفاعل</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="حفظ المتجر في المفضلة" value={d.storeFavoritesCount.toLocaleString('ar')} tone="brand" icon="heart-outline" />
          <AnalyticsInsightMetric label="متابعو المتجر" value={d.followersCount.toLocaleString('ar')} tone="info" icon="people-outline" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="حفظ المنتجات في المفضلة" value={d.productFavoritesCount.toLocaleString('ar')} tone="success" icon="bookmark-outline" />
          <AnalyticsInsightMetric label="عدد التقييمات" value={d.totalRatings.toLocaleString('ar')} tone="default" icon="star-half-outline" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <AnalyticsInsightMetric label="متوسط التقييم" value={`${d.averageRating} ⭐`} tone="brand" icon="star" />
        </View>
      </Surface>

      {/* Top products */}
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'}>أبرز المنتجات</Text>
        <KeyValueList
          dense
          items={[
            { label: 'الأكثر طلبًا', value: `${d.topOrderedProduct.name} (${d.topOrderedProduct.ordersCount} طلب)`, tone: 'brand' },
            { label: 'الأكثر تفضيلًا', value: `${d.topFavoritedProduct.name} (${d.topFavoritedProduct.favoritesCount} حفظ)`, tone: 'success' },
            { label: 'الأعلى مشاهدة', value: `${d.topViewedProduct.name} (${d.topViewedProduct.viewsCount} مشاهدة)`, tone: 'info' },
          ]}
        />
      </Surface>

      {/* Opportunity spotlight */}
      <Surface
        tone="inset"
        padding={3}
        gap={2}
        style={{ borderWidth: 1.5, borderColor: theme.warning + '66' }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="bulb-outline" size={18} tone="warning" />
          <Text role="bodyStrong" tone="warning">فرصة تسويقية</Text>
        </View>
        <Text role="bodySm" align={direction === 'rtl' ? 'end' : 'start'}>
          <Text role="bodySm" tone="default">{d.opportunityProduct.name}: </Text>
          {d.opportunityProduct.insight}
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'المفضلات', value: String(d.opportunityProduct.favoritesCount), tone: 'success' },
            { label: 'الطلبات الفعلية', value: String(d.opportunityProduct.ordersCount), tone: 'warning' },
          ]}
        />
      </Surface>

      {/* Smart recommendation */}
      <Surface
        tone="raised"
        padding={3}
        gap={2}
        style={{ borderWidth: 1.5, borderColor: theme.brand + '55' }}
      >
        <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="trending-up-outline" size={18} tone="brand" />
          <Text role="bodyStrong" tone="brand">توصية ذكية</Text>
        </View>
        <Text role="bodySm" align={direction === 'rtl' ? 'end' : 'start'}>{d.smartRecommendation}</Text>
        <Button
          label="فعّل العرض"
          tone="primary"
          fullWidth={false}
          onPress={() => {/* promotion intent — UI only, no backend */}}
        />
      </Surface>

      {/* Promotion intent panel below */}
      <PromotionIntentPanel
        storeName={storeName}
        branchLabel="اليرموك · الرياض"
        activeZoneLabel="اليرموك"
        todayHoursLabel="09:00 - 23:00"
      />
    </Box>
  );
}

export function DshPartnerHubSurface(props: DshPartnerHubSurfaceProps) {

  const {
    state = 'ready',
    section,
    onSectionChange,
    storeName = 'متجر الفخامة',
    branchLabel = 'الرياض، فرع الياسمين',
    cityLabel = 'الرياض',
    managerLabel = 'خالد',
    todayHoursLabel = '09:00 - 23:00',
    storeOpen = true,
    listingEnabled = true,
    activeZoneLabel = 'الياسمين / الندى',
    activeOrdersCount = 13,
    serviceModes = [],
    onOpenOrdersBoard,
    onOpenOrdersSearch,
    onOpenStoreScope,
    onOpenSupportDirectory,
    onOpenWalletHub,
    onOpenBell,
    onOpenOperationalFlow,
    onOpenSupportScreen,
    onOpenStoreCourierSetup,
    onToggleAvailability,
    canonicalStoreId,
    // ML-T1: partner lifecycle stage for readiness status summary (read-only, summary-only per on-demand contract)
    partnerLifecycleStage = 'partner-review' as DshPartnerLifecycleStage,
  } = props as DshPartnerHubSurfaceProps & { partnerLifecycleStage?: DshPartnerLifecycleStage };

  const [isAvailable, setIsAvailable] = React.useState<boolean>(storeOpen);

  const { direction } = useDirection();
  const { theme } = useTheme();
  const partnersGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('partners'), []);
  const catalogsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('catalogs'), []);
  const marketingGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('marketing'), []);
  const financeGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('finance'), []);
  // ML-T1: journey map reference — summary-only; details on-demand per on-demand contract
  const partnerStatusStep = React.useMemo(() => getDshPartnerJourneyStep('partner-status-visibility'), []);
  const {
    hydrated: appearanceHydrated,
    mode: appearanceMode,
    setMode: setAppearanceMode,
  } = useAppPartnerAppearance();
  const [internalSection, setInternalSection] = React.useState<PartnerHubSection>('hub');
  const [notificationPreferences, setNotificationPreferences] = React.useState<NotificationPreferenceState>(defaultNotificationPreferences);
  const activeSection = section ?? internalSection;
  const updateSection = onSectionChange ?? setInternalSection;
  const activeCanonicalStore = React.useMemo(() => {
    const activeCanonicalStoreId = canonicalStoreId ?? canonicalPreviewStores[0]?.id;
    return activeCanonicalStoreId ? getCanonicalPreviewStoreCard(activeCanonicalStoreId) : undefined;
  }, [canonicalStoreId]);
  const resolvedActiveZoneLabel = activeCanonicalStore?.zoneLabel ?? activeZoneLabel;

  const [selectedModeId, setSelectedModeId] = React.useState<string>('pickup');
  const resolvedStoreName = activeCanonicalStore?.storeName ?? storeName;
  const resolvedCityLabel = activeCanonicalStore?.cityLabel ?? cityLabel;
  const resolvedBranchLabel = activeCanonicalStore?.branchLabel ?? branchLabel;
  const resolvedManagerLabel = activeCanonicalStore?.managerName ?? managerLabel;
  const resolvedTodayHoursLabel = activeCanonicalStore?.operatingHoursLabel ?? todayHoursLabel;
  const [branchContact] = React.useState('011 555 0123');

  const activeHubNavigationItems = React.useMemo(() => {
    return hubNavigationItems.filter((item) => item.id !== 'profile');
  }, []);

  const storeVisibility = React.useMemo(() => {
    return resolveDshStoreClientVisibility({
      publishStage: activeCanonicalStore?.publishStage,
      activationStatus: mapPublishStageToPartnerActivationStatus(activeCanonicalStore?.publishStage),
      catalogPublished: listingEnabled,
      deliveryModesReady: serviceModes.some((mode) => mode.enabled),
      serviceabilityAvailable: true,
      storeOpen: isAvailable,
    });
  }, [listingEnabled, activeCanonicalStore?.publishStage, serviceModes, isAvailable]);

  const visibilityLabel = listingEnabled ? 'مفعّل' : 'موقوف';

  const enabledNotificationChannelsCount = React.useMemo(
    () => ['orders', 'operations', 'inventory', 'finance', 'marketing', 'system'].filter((key) => notificationPreferences[key as NotificationPreferenceId]).length,
    [notificationPreferences],
  );

  function updateNotificationPreference(preferenceId: NotificationPreferenceId, nextValue: boolean) {
    setNotificationPreferences((current) => ({
      ...current,
      [preferenceId]: nextValue,
    }));
  }

  function openOrderAlerts() {
    onOpenOperationalFlow?.('order-alerts');
    onOpenBell?.();
  }

  function openOperationsDirectory() {
    onOpenOperationalFlow?.('order-issue-queue');
    onOpenSupportDirectory?.();
    onOpenSupportScreen?.('order-issue-queue');
  }

  const openOrdersSearch = React.useCallback(() => {
    if (onOpenOrdersSearch) {
      onOpenOrdersSearch();
      return;
    }

    onOpenOrdersBoard?.();
  }, [onOpenOrdersBoard, onOpenOrdersSearch]);

  const summaryItems = React.useMemo<readonly SummaryItem[]>(
    () => [
      { id: 'store-status', label: 'حالة المتجر', value: isAvailable ? 'مفتوح الآن' : 'مغلق الآن', tone: isAvailable ? 'success' : 'warning' },
      { id: 'active-orders', label: 'الطلبات النشطة', value: String(activeOrdersCount), tone: 'brand' },
      { id: 'hours', label: 'ساعات العمل', value: resolvedTodayHoursLabel, tone: 'info' },
    ],
    [activeOrdersCount, resolvedTodayHoursLabel, isAvailable],
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
    if (activeSection === 'profile') {
      return (
        <HubSectionShell title={sectionCopy.profile.title} description={sectionCopy.profile.description} icon={sectionCopy.profile.icon} onBack={() => updateSection('hub')}>
          <StoreProfileScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            cityLabel={resolvedCityLabel}
            managerLabel={resolvedManagerLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            storeOpen={storeOpen}
            listingEnabled={listingEnabled}
            canonicalStoreId={activeCanonicalStore?.id}
            sourceRecordId={activeCanonicalStore?.sourceRecordId}
            deliveryReadinessLabel={activeCanonicalStore?.deliveryReadinessLabel}
            coverageSummary={activeCanonicalStore?.coverageSummary}
            publishStage={activeCanonicalStore?.publishStage}
            activationStatus={mapPublishStageToPartnerActivationStatus(activeCanonicalStore?.publishStage)}
            serviceModes={serviceModes}
            onOpenStoreScope={onOpenStoreScope}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'analytics') {
      return (
        <HubSectionShell title={sectionCopy.analytics.title} description={sectionCopy.analytics.description} icon={sectionCopy.analytics.icon} onBack={() => updateSection('hub')}>
          <AnalyticsInsightsPanel storeName={resolvedStoreName} />
        </HubSectionShell>
      );
    }

    if (activeSection === 'wallet') {
      return (
        <WltDshPartnerBridge
          branchLabel={resolvedBranchLabel}
          activeZoneLabel={resolvedActiveZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
          onOpenExpandedWallet={onOpenWalletHub}
          onOpenSettlementReview={onOpenWalletHub}
          onOpenFinancialReport={onOpenWalletHub}
        />
      );
    }

    if (activeSection === 'settings') {
      const notificationSettingRows = [
        {
          id: 'orders' as const,
          title: 'تنبيهات الطلبات',
          subtitle: 'الطلبات الجديدة، التأخير، وحالات الموافقة والإفراج.',
          icon: 'receipt-outline' as const,
          value: notificationPreferences.orders,
        },
        {
          id: 'operations' as const,
          title: 'تنبيهات التشغيل',
          subtitle: 'الفرع، الفريق، ساعات العمل، والتوصيات السريعة للورديات.',
          icon: 'people-outline' as const,
          value: notificationPreferences.operations,
        },
        {
          id: 'inventory' as const,
          title: 'تنبيهات المخزون',
          subtitle: 'النواقص، المنتجات منخفضة الكمية، وتغييرات الجاهزية.',
          icon: 'cube-outline' as const,
          value: notificationPreferences.inventory,
        },
        {
          id: 'finance' as const,
          title: wltDshPartnerUiCopy.financeNotificationTitle,
          subtitle: wltDshPartnerUiCopy.financeNotificationSubtitle,
          icon: 'wallet-outline' as const,
          value: notificationPreferences.finance,
        },
        {
          id: 'marketing' as const,
          title: 'التسويق والنمو',
          subtitle: 'العروض والتوصيات الموسمية والفرص المقترحة للنمو.',
          icon: 'megaphone-outline' as const,
          value: notificationPreferences.marketing,
        },
        {
          id: 'system' as const,
          title: 'تنبيهات النظام',
          subtitle: 'الهوية، الإعدادات، وحالة الربط العام للحساب.',
          icon: 'shield-checkmark-outline' as const,
          value: notificationPreferences.system,
        },
        {
          id: 'sound' as const,
          title: 'الصوت والاهتزاز',
          subtitle: 'تفعيل التنبيه السمعي والاهتزازي عند وجود حدث مهم.',
          icon: 'volume-high-outline' as const,
          value: notificationPreferences.sound,
        },
        {
          id: 'dailyDigest' as const,
          title: 'ملخص يومي مختصر',
          subtitle: 'استلام ملخص يومي موحّد بدل فتح أكثر من شاشة منفصلة.',
          icon: 'calendar-outline' as const,
          value: notificationPreferences.dailyDigest,
        },
        {
          id: 'priorityOnly' as const,
          title: 'العاجلة فقط',
          subtitle: 'تقليل التشويش وإبراز الحالات ذات الأولوية العالية فقط.',
          icon: 'flash-outline' as const,
          value: notificationPreferences.priorityOnly,
        },
      ];

      const settingsActionRows = [
        {
          id: 'order-alerts',
          title: 'فتح تنبيهات الطلب',
          subtitle: 'الانتقال إلى نفس مسار تنبيهات الطلب المرتبط مباشرةً بلوحة الطلبات.',
          icon: 'notifications-outline' as const,
          onPress: openOrderAlerts,
        },
        {
          id: 'branch-scope',
          title: 'اختيار الفرع',
          subtitle: 'مراجعة النطاق والفرع المرتبطين بالإشعارات والتشغيل.',
          icon: 'git-branch-outline' as const,
          onPress: onOpenStoreScope,
        },
        {
          id: 'operations-directory',
          title: 'دليل العمليات',
          subtitle: 'الوصول إلى المسارات التشغيلية المرتبطة بالمشكلات والتنفيذ من نفس مساحة الإعدادات.',
          icon: 'headset-outline' as const,
          onPress: openOperationsDirectory,
        },
      ];

      return (
        <HubSectionShell title={sectionCopy.settings.title} description={sectionCopy.settings.description} icon={sectionCopy.settings.icon} onBack={() => updateSection('hub')}>
          <Box gap={4}>
            <Surface tone="raised" padding={3} gap={3}>
              <Text role="label" tone="muted">
                المظهر
              </Text>
              <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
                {appearanceHydrated
                  ? 'يتم حفظ اختيار المظهر محليًا واستعادته عند فتح مساحة الشريك.'
                  : 'جارٍ استعادة اختيار المظهر المحفوظ...'}
              </Text>
              <Box gap={3}>
                {partnerAppearanceOptions.map((option) => (
                  <AppearanceOptionCard
                    key={option.mode}
                    title={option.title}
                    description={option.description}
                    mode={option.mode}
                    modeLabel={option.mode === 'lightPremium' ? 'Light Premium' : 'Dark Glass'}
                    statusLabel={appearanceMode === option.mode ? 'مفعّل الآن' : 'اضغط للتفعيل'}
                    selected={appearanceMode === option.mode}
                    onPress={() => setAppearanceMode(option.mode)}
                  />
                ))}
              </Box>
            </Surface>

            <Surface tone="raised" padding={3} gap={3}>
              <Text role="label" tone="muted">
                التفضيلات الحالية
              </Text>
              <KeyValueList
                dense
                items={[
                  { label: 'القنوات المفعّلة', value: `${enabledNotificationChannelsCount}/6`, tone: 'brand' },
                  { label: 'مستوى التنبيه', value: notificationPreferences.priorityOnly ? 'العاجلة فقط' : 'كل التنبيهات', tone: notificationPreferences.priorityOnly ? 'warning' : 'success' },
                  { label: 'الصوت والاهتزاز', value: notificationPreferences.sound ? 'مفعّل' : 'موقوف', tone: notificationPreferences.sound ? 'success' : 'warning' },
                  { label: 'الملخص اليومي', value: notificationPreferences.dailyDigest ? 'مفعّل' : 'موقوف', tone: notificationPreferences.dailyDigest ? 'info' : 'default' },
                  { label: 'الظهور في القائمة', value: listingEnabled ? 'مفعل' : 'موقوف', tone: listingEnabled ? 'success' : 'warning' },
                  { label: 'حالة المتجر', value: storeOpen ? 'مفتوح الآن' : 'مغلق الآن', tone: storeOpen ? 'success' : 'warning' },
                  { label: 'ساعات العمل', value: todayHoursLabel },
                ]}
              />
            </Surface>

            <Surface tone="raised" padding={0} gap={0}>
              <Text role="label" tone="muted">
                إعدادات الإشعارات
              </Text>
              <Text role="caption" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}>
                كل سطر يضبط نوعًا واحدًا من التنبيهات دون إنشاء شاشة إعدادات ثانية أو نظام محلي منفصل.
              </Text>
              {notificationSettingRows.map((item, index) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  value={item.value}
                  onValueChange={(nextValue) => updateNotificationPreference(item.id, nextValue)}
                  last={index === notificationSettingRows.length - 1}
                />
              ))}
            </Surface>

            <Surface tone="raised" padding={0} gap={0}>
              <Text role="label" tone="muted" style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                الوصول السريع
              </Text>
              <Text role="caption" tone="muted" style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }}>
                كل الطرق التالية تعود إلى نفس الوجهة الموحدة بدل تكرار مركز إشعارات آخر داخل الحساب.
              </Text>
              {settingsActionRows.map((item, index) => (
                <SettingsOptionRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  onPress={item.onPress}
                  disabled={typeof item.onPress !== 'function'}
                  last={index === settingsActionRows.length - 1}
                />
              ))}
            </Surface>
          </Box>
        </HubSectionShell>
      );
    }

    if (activeSection === 'inventory') {
      return (
        <HubSectionShell title={sectionCopy.inventory.title} description={sectionCopy.inventory.description} icon={sectionCopy.inventory.icon} onBack={() => updateSection('hub')}>
          <InventoryCatalogScreen
            storeName={resolvedStoreName}
            branchLabel={resolvedBranchLabel}
            activeZoneLabel={resolvedActiveZoneLabel}
            todayHoursLabel={resolvedTodayHoursLabel}
            canonicalStoreId={activeCanonicalStore?.id}
          />
        </HubSectionShell>
      );
    }

    if (activeSection === 'operations') {
      return (
        <OperationsPanel
          branchLabel={resolvedBranchLabel}
          cityLabel={resolvedCityLabel}
          storeName={resolvedStoreName}
          todayHoursLabel={resolvedTodayHoursLabel}
          storeOpen={isAvailable}
          activeZoneLabel={resolvedActiveZoneLabel}
          serviceModes={serviceModes}
          onBack={() => updateSection('hub')}
          onOpenStoreCourierSetup={onOpenStoreCourierSetup}
          listingEnabled={listingEnabled}
          storeVisibility={storeVisibility}
          visibilityLabel={visibilityLabel}
        />
      );
    }

    const copy = sectionCopy[activeSection as Exclude<PartnerHubSection, 'hub'>];

    return (
      <HubSectionShell
        title={copy.title}
        description={copy.description}
        icon={copy.icon}
        onBack={() => updateSection('hub')}
      />
    );
  }

  return (
    <Box style={{ flex: 1, position: 'relative' }} background="background">
      <MobileScrollView fill padding={0} gap={4} contentContainerStyle={{ paddingBottom: partnerHubBottomInset }}>
        <StoreHero
          coverImage={resolveDshImageSource(activeCanonicalStore?.imageUri || 'dsh.store.malqa.cover.v1')}
          logoImage={resolveDshImageSource(
            activeCanonicalStore?.imageUri
              ? activeCanonicalStore.imageUri.replace('cover', 'logo')
              : 'dsh.store.malqa.logo.v1'
          )}
          name={resolvedStoreName}
          locationLabel={`${resolvedBranchLabel} · ${resolvedActiveZoneLabel}`}
          isOpen={isAvailable}
          hasBthwaniPro={activeCanonicalStore?.hasBthwaniPro ?? true}
          distanceLabel={activeCanonicalStore?.distanceLabel || '1.8 كم'}
          deliveryTimeLabel={activeCanonicalStore?.deliveryLabel || resolvedTodayHoursLabel}
          rating={activeCanonicalStore?.rating || 4.9}
          contactNumber={branchContact}
          onSearchPress={openOrdersSearch}
          serviceModesBehavior="readonly"
          deliveryModes={defaultOperationalModes.map((mode) => ({
            id: mode.id,
            label: mode.title,
            icon: mode.id === 'pickup' ? 'hand-left-outline' : mode.id === 'partner_delivery' ? 'car-outline' : 'bicycle-outline',
          }))}
          selectedMode={selectedModeId}
          onModeChange={(id) => setSelectedModeId(id)}
          topOppositeAction={
            <Pressable
              onPress={onOpenStoreScope}
              style={({ pressed }) => [
                {
                  flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: pressed ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="اختيار الفرع"
            >
              <Icon name="git-branch-outline" size={14} color={theme.textInverse} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textInverse, fontFamily: 'Outfit-Bold' }}>
                اختيار الفرع
              </Text>
            </Pressable>
          }
        />

        <Box padding={4} gap={4}>
          {/* 1) Wallet Balance Block */}
          <Surface tone="raised" padding={3} gap={2}>
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
                <Text role="caption" tone="muted">رصيد المتجر الحالي</Text>
                <Text role="titleLg" tone="brand">{wltDshPartnerPreviewData.wallet.balanceLabel}</Text>
              </View>
              <Button
                label="عرض المحفظة"
                tone="secondary"
                fullWidth={false}
                onPress={() => updateSection('wallet')}
              />
            </View>
          </Surface>
          {/* 4) Main Sections Nav — icon + title + subtitle + chevron, RTL-correct */}
          <View style={{ gap: 8 }}>
            {activeHubNavigationItems.map((item) => (
              <HubNavRow
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onPress={() => updateSection(item.section)}
              />
            ))}
          </View>
        </Box>
      </MobileScrollView>
    </Box>
  );
}

export type PartnerHomeScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerHomeScreen(props: PartnerHomeScreenProps) {
  return <DshPartnerHubSurface {...props} section="hub" />;
}

export type OperationsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function OperationsScreen(props: OperationsScreenProps) {
  return <DshPartnerHubSurface {...props} section="operations" />;
}

export type PartnerSettingsScreenProps = Omit<DshPartnerHubSurfaceProps, 'section'>;

export function PartnerSettingsScreen(props: PartnerSettingsScreenProps) {
  return <DshPartnerHubSurface {...props} section="settings" />;
}
