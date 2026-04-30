/**
 * PartnerProfileScreen — Unified Account hub (store snapshot + presence + settings)
 * §87 SSoT in packages/surfaces | §UX-SUPREME-001
 * - Hero: صورة البروفايل والتفاصيل
 * - DSH tabs (order): الحساب → التشغيل → المخزون والمنتجات → المحفظة → التحليلات → التسويق والنمو → الإعدادات
 * - الحساب: الهوية، المتجر، التشغيل، الدعم، المستندات، الاشتراك
 * - التشغيل: إعدادات التشغيل اليومي للطلبات (الرد السريع، ساعات العمل، مناطق التوصيل)
 */
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import {
  LanguageSettingBlock,
  AppThemeSettingBlock,
  PreferenceSection,
} from '../mobile/components';
import { AnimatedCard } from '../mobile/components/MicroInteractions';
import { PartnerAccountStoreHero } from '../mobile/app-partner/components';
import {
  usePartnerSessionUi,
  PARTNER_ALL_STORES_SCOPE,
} from '../mobile/app-partner/PartnerSessionUiContext';
import { usePartnerType } from '../mobile/app-partner/PartnerTypeContext';
import { buildPartnerProfileScreenFixture } from '../dsh/fixtures/partnerStaff';
import { PartnerModeSwitchSheet, type PartnerType as ModeSwitchPartnerType } from './PartnerModeSwitchSheet';

export interface PartnerProfileScreenProps {
  navigation?: { navigate: (name: string, params?: Record<string, unknown>) => void };
  partnerType?: 'dsh' | 'arb' | null;
}

const BTHWANI_SECTION_GAP = BTHWANI_SPACING.md;

export const PartnerProfileScreen: React.FC<PartnerProfileScreenProps> = ({
  navigation,
  partnerType: propPartnerType,
}) => {
  const { t, isRTL } = useI18n();
  const { partnerType: contextPartnerType, setPartnerType } = usePartnerType();
  const partnerType = propPartnerType ?? contextPartnerType;
  const [modeSwitchVisible, setModeSwitchVisible] = useState(false);
  const { partnerDisplayName, partnerStatus, gpsStatus, activeStoreScope, openWalletSheet } =
    usePartnerSessionUi();

  const profileFixture = useMemo(() => buildPartnerProfileScreenFixture(), []);
  const hero = profileFixture.hero;

  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL],
  );

  const canNavigate = !!navigation?.navigate;
  const navigateTo = useCallback(
    (screen: string) => {
      if (!canNavigate) return;
      const isDshRoute = screen.startsWith('dsh_');
      const scopedStoreId =
        partnerType === 'dsh' &&
        activeStoreScope &&
        activeStoreScope !== PARTNER_ALL_STORES_SCOPE
          ? activeStoreScope
          : undefined;
      if (isDshRoute && scopedStoreId) {
        navigation!.navigate(screen, { storeId: scopedStoreId });
        return;
      }
      navigation!.navigate(screen);
    },
    [canNavigate, navigation, activeStoreScope, partnerType],
  );

  type TabId =
    | 'account'
    | 'operations'
    | 'inventory'
    | 'wallet'
    | 'analytics'
    | 'marketingGrowth'
    | 'settings'
    | 'arbAccount';
  const [activeTab, setActiveTab] = useState<TabId>('account');

  React.useEffect(() => {
    if (partnerType === 'arb') setActiveTab('arbAccount');
    else if (partnerType === 'dsh') setActiveTab('account');
  }, [partnerType]);

  const handleModeSwitch = useCallback(
    async (newType: ModeSwitchPartnerType) => {
      await setPartnerType(newType);
      setModeSwitchVisible(false);
      if (navigation?.navigate) {
        navigation.navigate('Home');
      }
    },
    [setPartnerType, navigation],
  );

  type ActionItem = { screen: string; label: string };
  // §UX-SUPREME-001: كل المالي في PartnerWalletHubSheet — تبويب المحفظة يفتح الـ sheet
  // المتجر والتشغيل → داخل الحساب. التحليلات → تبويب مستقل.
  // المخزون: إدارة المخزون → المنتجات
  const dshInventoryActions: ActionItem[] = useMemo(
    () => [
      { screen: 'dsh_partner_inventory_update', label: t('partner.PartnerProfileScreen.navManageInventory') },
      { screen: 'dsh_partner_items_upsert', label: t('partner.PartnerHomeScreen.navProducts') },
    ],
    [t],
  );
  // التشغيل: شاشة تشغيل موحدة داخل نفس التبويب (بدون شاشات منفصلة)
  const dshOperationsActions: ActionItem[] = useMemo(
    () => [
      { screen: 'dsh_partner_manager_invite', label: t('partner.PartnerHomeScreen.navManagerInvite') },
    ],
    [t],
  );
  // التحليلات: موظفين + عمولة
  const dshAnalyticsActions: ActionItem[] = useMemo(
    () => [
      { screen: 'dsh_partner_staff_analytics_get', label: t('partner.PartnerHomeScreen.navStaffAnalytics') },
      { screen: 'dsh_partner_commission_by_mode_get', label: t('partner.PartnerHomeScreen.navCommissionByMode') },
    ],
    [t],
  );
  // التسويق والنمو: جمهور + تحليلات الاشتراك (مؤشرات نمو وتجربة)
  const dshMarketingGrowthActions: ActionItem[] = useMemo(
    () => [
      { screen: 'dsh_partner_audience_insights_get', label: t('partner.PartnerHomeScreen.navAudienceInsights') },
      { screen: 'dsh_partner_subscription_analytics_get', label: t('partner.PartnerHomeScreen.navSubscriptionAnalytics') },
    ],
    [t],
  );
  // الحساب: الملف والهوية والتوثيق والدعم والاشتراك
  const dshAccountActions: ActionItem[] = useMemo(
    () => [
      { screen: 'dsh_partner_store_get', label: t('partner.PartnerHomeScreen.navViewStore') },
      { screen: 'platform_partner_profile_get', label: t('partner.PartnerProfileScreen.accountInfo') },
      { screen: 'platform_partner_support', label: t('partner.PartnerProfileScreen.support') },
      { screen: 'dsh_partner_identity_submit', label: t('partner.PartnerHomeScreen.navIdentity') },
      { screen: 'dsh_partner_doc_upload', label: t('partner.PartnerHomeScreen.navDocuments') },
      { screen: 'dsh_partner_subscription_get', label: t('partner.PartnerHomeScreen.navSubscription') },
    ],
    [t],
  );
  // ARB الحساب: المتجر (عرض، حالة) + التشغيل (ساعات) + معلومات → دعم → توثيق → مستندات → فريق
  const arbAccountActions: ActionItem[] = useMemo(
    () => [
      { screen: 'arb_partner_store_get', label: t('partner.PartnerHomeScreen.navViewStoreAlt') },
      { screen: 'arb_partner_store_status_update', label: t('partner.PartnerHomeScreen.navStoreStatusAlt') },
      { screen: 'arb_partner_hours_update', label: t('partner.PartnerHomeScreen.navHoursAlt') },
      { screen: 'platform_partner_profile_get', label: t('partner.PartnerProfileScreen.accountInfo') },
      { screen: 'platform_partner_support', label: t('partner.PartnerProfileScreen.support') },
      { screen: 'arb_partner_identity_submit', label: t('partner.PartnerHomeScreen.navIdentityAlt') },
      { screen: 'arb_partner_doc_upload', label: t('partner.PartnerHomeScreen.navDocumentsAlt') },
      { screen: 'dsh_partner_manager_invite', label: t('partner.PartnerHomeScreen.navManagerInvite') },
      { screen: 'dsh_partner_staff_analytics_get', label: t('partner.PartnerHomeScreen.navStaffAnalytics') },
    ],
    [t],
  );
  const fallbackAccountActions: ActionItem[] = useMemo(
    () => [
      { screen: 'platform_partner_profile_get', label: t('partner.PartnerProfileScreen.accountInfo') },
      { screen: 'platform_partner_support', label: t('partner.PartnerProfileScreen.support') },
    ],
    [t],
  );

  const dshTabs = useMemo(
    () => [
      { id: 'account' as TabId, title: t('partner.PartnerProfileScreen.navAccount'), actions: dshAccountActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'operations' as TabId, title: t('partner.PartnerProfileScreen.navOperations'), actions: dshOperationsActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'inventory' as TabId, title: t('partner.PartnerHomeScreen.navInventoryProducts'), actions: dshInventoryActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'wallet' as TabId, title: t('partner.PartnerProfileScreen.navWalletSection'), actions: [], opensWalletSheet: true, isSettingsTab: false },
      { id: 'analytics' as TabId, title: t('partner.PartnerProfileScreen.navAnalytics'), actions: dshAnalyticsActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'marketingGrowth' as TabId, title: t('partner.PartnerProfileScreen.navMarketingGrowth'), actions: dshMarketingGrowthActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'settings' as TabId, title: t('partner.PartnerProfileScreen.navSettingsTab'), actions: [], opensWalletSheet: false, isSettingsTab: true },
    ],
    [t, dshAccountActions, dshOperationsActions, dshInventoryActions, dshAnalyticsActions, dshMarketingGrowthActions],
  );
  const arbTabs = useMemo(
    () => [
      { id: 'wallet' as TabId, title: t('partner.PartnerProfileScreen.navWalletSection'), actions: [], opensWalletSheet: true, isSettingsTab: false },
      { id: 'arbAccount' as TabId, title: t('partner.PartnerProfileScreen.navAccount'), actions: arbAccountActions, opensWalletSheet: false, isSettingsTab: false },
      { id: 'settings' as TabId, title: t('partner.PartnerProfileScreen.navSettingsTab'), actions: [], opensWalletSheet: false, isSettingsTab: true },
    ],
    [t, arbAccountActions],
  );
  const tabs = partnerType === 'dsh' ? dshTabs : partnerType === 'arb' ? arbTabs : [];
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const isSettingsTab = currentTab?.isSettingsTab === true;
  const currentActions = currentTab?.opensWalletSheet
    ? [{ screen: '_open_wallet_sheet', label: t('partner.PartnerProfileScreen.navWalletSection') }]
    : (currentTab?.actions ?? fallbackAccountActions);
  const [hoursFrom, setHoursFrom] = useState('09:00');
  const [hoursTo, setHoursTo] = useState('22:00');
  const [zone, setZone] = useState<'local' | 'city' | 'regional'>('city');
  const [storeOpen, setStoreOpen] = useState(true);
  const [modePickup, setModePickup] = useState(true);
  const [modeInhouse, setModeInhouse] = useState(true);
  const [modeThirdParty, setModeThirdParty] = useState(false);
  const commissionByMode = useMemo(
    () => [
      { id: 'pickup', label: 'الاستلام من الفرع', value: '5%' },
      { id: 'inhouse', label: 'توصيل المتجر', value: '12%' },
      { id: 'third_party', label: 'طرف ثالث', value: '15%' },
    ],
    [],
  );
  const [campaignEnabled, setCampaignEnabled] = useState(true);
  const [discountPercent, setDiscountPercent] = useState('15');
  const [dailyBudget, setDailyBudget] = useState('300');
  const [audienceSegment, setAudienceSegment] = useState<'new' | 'repeat' | 'all'>('all');

  const showSaved = useCallback(() => {
    Alert.alert('تم الحفظ', 'تم حفظ إعدادات التشغيل بنجاح.');
  }, []);

  const renderListRow = (item: ActionItem, index: number, arr: ActionItem[]) => {
    const isWalletSheet = item.screen === '_open_wallet_sheet';
    const onPress = isWalletSheet
      ? () => openWalletSheet?.()
      : () => navigateTo(item.screen);
    return (
      <TouchableOpacity
        key={item.screen}
        style={[
          styles.listRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          index === arr.length - 1 && styles.listRowLast,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.listRowLabel, textAlignStart]} numberOfLines={1}>
          {item.label}
        </Text>
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={semanticRoles.textMuted}
        />
      </TouchableOpacity>
    );
  };

  const renderOperationsHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>{t('partner.PartnerHomeScreen.navHours')}</Text>
        <View style={styles.operationInputsRow}>
          <TextInput
            value={hoursFrom}
            onChangeText={setHoursFrom}
            placeholder="09:00"
            style={[styles.timeInput, textAlignStart]}
          />
          <Text style={styles.timeDash}>-</Text>
          <TextInput
            value={hoursTo}
            onChangeText={setHoursTo}
            placeholder="22:00"
            style={[styles.timeInput, textAlignStart]}
          />
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={showSaved} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>حفظ ساعات العمل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>{t('partner.PartnerHomeScreen.navDeliveryZones')}</Text>
        <View style={styles.zoneChipsRow}>
          {[
            { id: 'local' as const, label: 'محلي' },
            { id: 'city' as const, label: 'المدينة' },
            { id: 'regional' as const, label: 'إقليمي' },
          ].map((z) => (
            <TouchableOpacity
              key={z.id}
              style={[styles.zoneChip, zone === z.id && styles.zoneChipActive]}
              onPress={() => setZone(z.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.zoneChipText, zone === z.id && styles.zoneChipTextActive]}>{z.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={showSaved} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>حفظ مناطق التوصيل</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.operationCard}>
        <View style={styles.operationSwitchRow}>
          <Text style={[styles.operationTitle, textAlignStart]}>{t('partner.PartnerHomeScreen.navStoreStatus')}</Text>
          <Switch value={storeOpen} onValueChange={setStoreOpen} />
        </View>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>{t('partner.PartnerHomeScreen.navServiceModes')}</Text>
        <View style={styles.operationSwitchRow}>
          <Switch value={modePickup} onValueChange={setModePickup} />
          <Text style={styles.readonlyInlineValue}>{commissionByMode[0].value}</Text>
          <Text style={[styles.operationLabel, textAlignStart]}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_profile_get.deliveryModePickup')}
          </Text>
        </View>
        <View style={styles.operationSwitchRow}>
          <Switch value={modeInhouse} onValueChange={setModeInhouse} />
          <Text style={styles.readonlyInlineValue}>{commissionByMode[1].value}</Text>
          <Text style={[styles.operationLabel, textAlignStart]}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_profile_get.deliveryModeInhouse')}
          </Text>
        </View>
        <View style={styles.operationSwitchRow}>
          <Switch value={modeThirdParty} onValueChange={setModeThirdParty} />
          <Text style={styles.readonlyInlineValue}>{commissionByMode[2].value}</Text>
          <Text style={[styles.operationLabel, textAlignStart]}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_profile_get.deliveryModeThirdParty')}
          </Text>
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={showSaved} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>حفظ أوضاع الخدمة</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.operationCard}
        onPress={() => navigateTo('dsh_partner_intake_start')}
        activeOpacity={0.8}
      >
        <Text style={[styles.operationTitle, textAlignStart]}>{t('partner.PartnerHomeScreen.navIntakeStart')}</Text>
      </TouchableOpacity>

      <View style={styles.tabContent}>
        {renderListRow(
          { screen: 'dsh_partner_manager_invite', label: t('partner.PartnerHomeScreen.navManagerInvite') },
          0,
          [{ screen: 'dsh_partner_manager_invite', label: t('partner.PartnerHomeScreen.navManagerInvite') }],
        )}
      </View>
    </View>
  );

  const renderAccountHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>بيانات المتجر</Text>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>اسم المتجر</Text>
          <Text style={styles.readonlyValueStrong}>{partnerDisplayName || '—'}</Text>
        </View>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>حالة الشريك</Text>
          <Text style={styles.readonlyValueStrong}>{partnerStatus || '—'}</Text>
        </View>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>حالة GPS</Text>
          <Text style={styles.readonlyValueStrong}>{gpsStatus || '—'}</Text>
        </View>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>الهوية والتوثيق</Text>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>الهوية</Text>
          <Text style={styles.statusBadge}>مكتمل</Text>
        </View>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>المستندات</Text>
          <Text style={styles.statusBadge}>مكتمل</Text>
        </View>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>الدعم والاشتراك</Text>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>الدعم</Text>
          <Text style={styles.readonlyValueStrong}>متاح 24/7</Text>
        </View>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>الباقة</Text>
          <Text style={styles.readonlyValueStrong}>Pro</Text>
        </View>
      </View>
    </View>
  );

  const renderMarketingGrowthHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <View style={styles.operationSwitchRow}>
          <Text style={[styles.operationTitle, textAlignStart]}>تفعيل الحملة</Text>
          <Switch value={campaignEnabled} onValueChange={setCampaignEnabled} />
        </View>
        <View style={styles.operationInputsRow}>
          <TextInput
            value={discountPercent}
            onChangeText={setDiscountPercent}
            placeholder="15"
            keyboardType="numeric"
            style={[styles.timeInput, textAlignStart]}
          />
          <Text style={[styles.operationLabel, textAlignStart]}>% نسبة الخصم</Text>
        </View>
        <View style={styles.operationInputsRow}>
          <TextInput
            value={dailyBudget}
            onChangeText={setDailyBudget}
            placeholder="300"
            keyboardType="numeric"
            style={[styles.timeInput, textAlignStart]}
          />
          <Text style={[styles.operationLabel, textAlignStart]}>ميزانية يومية</Text>
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={showSaved} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>حفظ إعدادات الحملة</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>استهداف الجمهور</Text>
        <View style={styles.zoneChipsRow}>
          {[
            { id: 'new' as const, label: 'عملاء جدد' },
            { id: 'repeat' as const, label: 'عملاء متكررين' },
            { id: 'all' as const, label: 'الكل' },
          ].map((segment) => (
            <TouchableOpacity
              key={segment.id}
              style={[styles.zoneChip, audienceSegment === segment.id && styles.zoneChipActive]}
              onPress={() => setAudienceSegment(segment.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.zoneChipText,
                  audienceSegment === segment.id && styles.zoneChipTextActive,
                ]}
              >
                {segment.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>ملخص الأداء</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>38%</Text>
            <Text style={styles.metricMiniLabel}>معدل التحويل</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>+22%</Text>
            <Text style={styles.metricMiniLabel}>نمو الطلبات</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>2.8x</Text>
            <Text style={styles.metricMiniLabel}>عائد الحملة</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>1,240</Text>
            <Text style={styles.metricMiniLabel}>وصول الجمهور</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderInventoryHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>ملخص المخزون</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>128</Text>
            <Text style={styles.metricMiniLabel}>منتج نشط</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>14</Text>
            <Text style={styles.metricMiniLabel}>قارب النفاد</Text>
          </View>
        </View>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>إدارة المنتجات</Text>
        <TouchableOpacity
          style={styles.inlineActionRow}
          onPress={() => navigateTo('dsh_partner_items_upsert')}
          activeOpacity={0.8}
        >
          <Text style={[styles.operationLabel, textAlignStart]}>{t('partner.PartnerHomeScreen.navProducts')}</Text>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={18}
            color={semanticRoles.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inlineActionRow}
          onPress={() => navigateTo('dsh_partner_inventory_update')}
          activeOpacity={0.8}
        >
          <Text style={[styles.operationLabel, textAlignStart]}>{t('partner.PartnerProfileScreen.navManageInventory')}</Text>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={18}
            color={semanticRoles.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>تشغيل المخزون</Text>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>مزامنة الأسعار</Text>
          <Text style={styles.readonlyValueStrong}>كل 15 دقيقة</Text>
        </View>
        <View style={styles.readonlyRowInline}>
          <Text style={[styles.operationLabel, textAlignStart]}>آخر تحديث</Text>
          <Text style={styles.readonlyValueStrong}>منذ 3 دقائق</Text>
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={showSaved} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>تحديث المخزون الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWalletHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>ملخص المحفظة</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>4,850</Text>
            <Text style={styles.metricMiniLabel}>الرصيد الحالي</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>1,420</Text>
            <Text style={styles.metricMiniLabel}>قيد التسوية</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.operationSaveBtn} onPress={() => openWalletSheet?.()} activeOpacity={0.8}>
          <Text style={styles.operationSaveBtnText}>فتح مركز المحفظة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAnalyticsHub = () => (
    <View style={styles.operationsContent}>
      <View style={styles.operationCard}>
        <Text style={[styles.operationTitle, textAlignStart]}>لوحة التحليلات</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>312</Text>
            <Text style={styles.metricMiniLabel}>طلبات اليوم</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>94%</Text>
            <Text style={styles.metricMiniLabel}>نسبة النجاح</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>8.7k</Text>
            <Text style={styles.metricMiniLabel}>إجمالي الأسبوع</Text>
          </View>
          <View style={styles.metricMiniCard}>
            <Text style={styles.metricMiniValue}>12%</Text>
            <Text style={styles.metricMiniLabel}>نمو أسبوعي</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero = SSoT للمتجر: صورة + تفاصيل + زر تعديل (نقرة واحدة) — لا تكرار */}
      <PartnerAccountStoreHero
        hero={hero}
        storeName={partnerDisplayName}
        marginBottom={BTHWANI_SECTION_GAP}
        onEditPress={canNavigate && partnerType ? () => navigateTo(partnerType === 'dsh' ? 'dsh_partner_store_update' : 'arb_partner_store_update') : undefined}
      />

      {/* Smart sequential tabs — الإعدادات منفصلة (لغة + مظهر) */}
      {tabs.length > 0 ? (
        <View style={styles.tabsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabChip,
                  activeTab === tab.id && styles.tabChipActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === tab.id && styles.tabChipTextActive,
                    { textAlign: isRTL ? 'right' : 'left' },
                  ]}
                  numberOfLines={1}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.tabContent}>
            {isSettingsTab ? (
              <View style={styles.settingsContent}>
                <PreferenceSection title={t('preferences.app_language_title')}>
                  <LanguageSettingBlock compact />
                </PreferenceSection>
                <PreferenceSection title={t('partner.PartnerProfileScreen.settingsAppearance')}>
                  <AppThemeSettingBlock />
                </PreferenceSection>
              </View>
            ) : currentTab?.id === 'account' && partnerType === 'dsh' ? (
              renderAccountHub()
            ) : currentTab?.id === 'operations' && partnerType === 'dsh' ? (
              renderOperationsHub()
            ) : currentTab?.id === 'inventory' && partnerType === 'dsh' ? (
              renderInventoryHub()
            ) : currentTab?.id === 'wallet' && partnerType === 'dsh' ? (
              renderWalletHub()
            ) : currentTab?.id === 'analytics' && partnerType === 'dsh' ? (
              renderAnalyticsHub()
            ) : currentTab?.id === 'marketingGrowth' && partnerType === 'dsh' ? (
              renderMarketingGrowthHub()
            ) : (
              currentActions.map((item, i, arr) => renderListRow(item, i, arr))
            )}
          </View>
        </View>
      ) : (
        <View style={styles.tabContent}>
          {fallbackAccountActions.map((item, i, arr) => renderListRow(item, i, arr))}
        </View>
      )}

      {/* تبديل نوع الشريك — زر واحد */}
      {canNavigate && partnerType && (
        <View style={styles.section}>
          <AnimatedCard
            style={styles.modeSwitchButton}
            onPress={() => setModeSwitchVisible(true)}
          >
            <Text style={[styles.modeSwitchText, textAlignStart]}>
              {t('partner.PartnerHomeScreen.switchPartnerMode')}
            </Text>
          </AnimatedCard>
        </View>
      )}

      {typeof __DEV__ !== 'undefined' && __DEV__ && canNavigate && (
        <View style={styles.section}>
          <AnimatedCard
            style={styles.devButton}
            onPress={() => navigation!.navigate('PartnerTypeSelect')}
          >
            <Text style={styles.devButtonText}>
              {t('partner.PartnerHomeScreen.devChangeType')}
            </Text>
          </AnimatedCard>
        </View>
      )}
    </ScrollView>

    <PartnerModeSwitchSheet
      visible={modeSwitchVisible}
      currentType={partnerType === 'dsh' || partnerType === 'arb' ? partnerType : null}
      onSelect={handleModeSwitch}
      onClose={() => setModeSwitchVisible(false)}
    />
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  tabsSection: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  tabBar: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  tabChip: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minWidth: 72,
    alignItems: 'center',
  },
  tabChipActive: {
    backgroundColor: semanticRoles.primaryCTA + '18',
    borderColor: semanticRoles.primaryCTA,
  },
  tabChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  tabChipTextActive: {
    color: semanticRoles.primaryCTA,
  },
  tabContent: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  settingsContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  operationsContent: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  operationCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  operationLabel: {
    fontSize: 14,
    color: semanticRoles.text,
  },
  operationInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    color: semanticRoles.text,
    backgroundColor: semanticRoles.surface,
  },
  timeDash: {
    color: semanticRoles.textMuted,
    fontWeight: '700',
  },
  operationSaveBtn: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  operationSaveBtnText: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '700',
  },
  zoneChipsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  zoneChip: {
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.surface,
  },
  zoneChipActive: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '18',
  },
  zoneChipText: {
    color: semanticRoles.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  zoneChipTextActive: {
    color: semanticRoles.primaryCTA,
  },
  operationSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readonlyInlineValue: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  readonlyRowInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.xs,
  },
  readonlyValueStrong: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '18',
    borderRadius: BTHWANI_RADIUS.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
  },
  inlineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  metricMiniCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.sm,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  metricMiniValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  metricMiniLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: semanticRoles.border,
  },
  listRowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.sm,
  },
  listRowLast: {
    borderBottomWidth: 0,
  },
  modeSwitchButton: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modeSwitchText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  devButton: {
    backgroundColor: semanticRoles.warning,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});
