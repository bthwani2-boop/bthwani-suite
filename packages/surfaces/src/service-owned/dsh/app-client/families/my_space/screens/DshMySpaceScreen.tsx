import React from 'react';
import { Pressable } from 'react-native';
import { BthBox, BthButton, BthListItem, BthMobileScrollView, BthSectionHeader, BthSurface, BthText } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../../patterns/screens/DshOperationScreen';

export type DshMySpaceItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  name?: string;
  subscriptionLabel?: string;
  preferenceLabel?: string;
  addressLabel?: string;
  ordersLabel?: string;
  offersLabel?: string;
  discountsLabel?: string;
  marketingPrograms?: DshMySpaceItem[];
  onOpenBenefits?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenPreferences?: () => void;
  onOpenOffers?: () => void;
  onOpenDiscounts?: () => void;
  onOpenOrders?: () => void;
  onChangeAddress?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

const defaultItems: DshMySpaceItem[] = [
  {
    id: 'subscriptions',
    title: 'الاشتراكات',
    subtitle: 'subscription-family-get و subscription-sync و subscription-upgrade-post',
    meta: 'إدارة فورية',
    badgeLabel: 'Live',
  },
  {
    id: 'preferences',
    title: 'التفضيلات',
    subtitle: 'اللغة، الكثافة، والخيارات الشخصية',
    meta: 'قابلة للتعديل',
    badgeLabel: 'عام',
  },
  {
    id: 'offers',
    title: 'العروض والخصومات',
    subtitle: 'أفضل العروض المتاحة الآن داخل المسار الحالي',
    meta: 'موصى به',
    badgeLabel: 'Offer',
  },
  {
    id: 'orders',
    title: 'طلباتي',
    subtitle: 'الطلبات الحديثة والنشطة والجاهزة للمتابعة',
    meta: 'سجل مباشر',
    badgeLabel: 'Orders',
  },
  {
    id: 'address',
    title: 'عنوان DSH',
    subtitle: 'تغيير العنوان أو نقطة الخدمة المستخدمة حاليًا',
    meta: 'تحديث فوري',
    badgeLabel: 'Address',
  },
];

type MySpaceTab = 'loyalty' | 'subscriptions' | 'preferences' | 'offers' | 'orders' | 'address';

const tabs: Array<{ id: MySpaceTab; label: string }> = [
  { id: 'loyalty', label: 'الولاء' },
  { id: 'subscriptions', label: 'الاشتراكات' },
  { id: 'preferences', label: 'التفضيلات' },
  { id: 'offers', label: 'العروض' },
  { id: 'orders', label: 'طلباتي' },
  { id: 'address', label: 'العنوان' },
];

function renderTabChips(activeTab: MySpaceTab, setActiveTab: (tab: MySpaceTab) => void) {
  return (
    <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;

        return (
          <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
            <BthSurface
              tone={active ? 'brand' : 'inset'}
              padding={2}
              style={{
                borderRadius: 999,
                borderWidth: active ? 0 : 1,
                borderColor: 'rgba(15,23,42,0.08)',
              }}
            >
              <BthText role="caption" tone={active ? 'inverse' : 'muted'}>{tab.label}</BthText>
            </BthSurface>
          </Pressable>
        );
      })}
    </BthBox>
  );
}

function renderLoyaltyTab(name: string, onOpenBenefits?: () => void, onOpenSubscriptions?: () => void, onOpenOffers?: () => void) {
  return (
    <BthSurface tone="brand" padding={4} gap={3}>
      <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
        <BthText role="titleLg" tone="inverse">مساحتي</BthText>
        <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>
          {name}
        </BthText>
        <BthText role="bodySm" tone="inverse" style={{ opacity: 0.86 }}>
          مساحة شخصية سريعة تجمع الاشتراكات والتفضيلات والعروض والطلبات والعنوان دون تعقيد.
        </BthText>
      </BthBox>

      {/* تم إزالة البلوكات الإرشادية وادراج محتوى ودي للولاء فقط */}

      <BthSurface tone="raised" padding={4} gap={3}>
        <BthSectionHeader title="الولاء" subtitle="إدارة نقاط الولاء والمكافآت" />
        <BthListItem title="رصيد الولاء" subtitle="اطلع على رصيد نقاطك" meta="Balance" badgeLabel="الولاء" onPress={onOpenBenefits} />
        <BthListItem title="استبدال النقاط" subtitle="استخدم نقاطك بالمكافآت المتاحة" meta="Redeem" badgeLabel="الولاء" onPress={onOpenBenefits} />
        <BthListItem title="سجل النقاط" subtitle="عرض تاريخ المكافآت والنشاط" meta="History" badgeLabel="الولاء" onPress={onOpenBenefits} />
        <BthBox layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          <BthButton label="الولاء" tone="secondary" onPress={onOpenBenefits ?? onOpenSubscriptions} />
          <BthButton label="الاشتراكات" tone="secondary" onPress={onOpenSubscriptions} />
          <BthButton label="العروض" tone="ghost" onPress={onOpenOffers} />
        </BthBox>
      </BthSurface>
    </BthSurface>
  );
}

function renderSubscriptionsTab(subscriptionLabel: string, onOpenSubscriptions?: () => void) {
  return (
    <BthBox gap={3}>
      <BthSurface tone="raised" padding={4} gap={3}>
        <BthSectionHeader title="الاشتراكات" subtitle="ملخص الخدمة الحالية وما يرتبط بها" />
        <BthListItem title="الحالة الحالية" subtitle={subscriptionLabel} meta="subscription-family-get" badgeLabel="Route" onPress={onOpenSubscriptions} />
        <BthListItem title="باقات الاشتراك" subtitle="يفتح subscription-pro-catalog و subscription-upgrade-post" meta="Catalog" badgeLabel="Route" onPress={onOpenSubscriptions} />
        <BthListItem title="مزامنة الاشتراك" subtitle="يفتح subscription-sync كمسار فعلي" meta="Sync" badgeLabel="Route" onPress={onOpenSubscriptions} />
      </BthSurface>
    </BthBox>
  );
}

function renderPreferencesTab(preferenceLabel: string, onOpenPreferences?: () => void) {
  return (
    <BthSurface tone="raised" padding={4} gap={3}>
      <BthSectionHeader title="التفضيلات" subtitle="لغة وتجربة وعرض خاص بالمستخدم" />
      <BthListItem title="التفضيل الحالي" subtitle={preferenceLabel} meta="Profile" badgeLabel="عام" onPress={onOpenPreferences} />
      <BthListItem title="اللغة" subtitle="تغيير لغة الواجهة حسب الحاجة" meta="Arabic / English" badgeLabel="Lang" onPress={onOpenPreferences} />
      <BthListItem title="العرض المختصر" subtitle="تقليل الكثافة والاحتفاظ بالوضوح" meta="Compact" badgeLabel="View" onPress={onOpenPreferences} />
    </BthSurface>
  );
}

function renderOffersTab(
  offersLabel: string,
  discountsLabel: string,
  marketingPrograms: DshMySpaceItem[] = [],
  onOpenOffers?: () => void,
  onOpenDiscounts?: () => void,
  onOpenSubscriptions?: () => void,
) {
  return (
    <BthBox gap={3}>
      <BthSurface tone="raised" padding={4} gap={3}>
        <BthSectionHeader title="العروض والخصومات" subtitle="ما هو متاح الآن داخل مسارك الشخصي" />
        <BthListItem title="العروض الشخصية" subtitle={offersLabel} meta="Offer lane" badgeLabel="Offer" onPress={onOpenOffers} />
        <BthListItem title="الخصومات النشطة" subtitle={discountsLabel} meta="Discount lane" badgeLabel="Deal" onPress={onOpenDiscounts} />
      </BthSurface>
      <BthSurface tone="inset" padding={4} gap={3}>
        <BthSectionHeader title="ما يديره التسويق الآن" subtitle="هذه العناصر مرتبطة مباشرة بملكية التسويق داخل لوحة التحكم" />
        {marketingPrograms.length ? marketingPrograms.map((item) => (
          <BthListItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            meta={item.meta}
            badgeLabel={item.badgeLabel}
            onPress={item.id.includes('subscription') ? onOpenSubscriptions ?? onOpenOffers : item.id.includes('promo') ? onOpenDiscounts ?? onOpenOffers : onOpenOffers}
          />
        )) : null}
        <BthButton label="فتح العروض" tone="secondary" onPress={onOpenOffers} />
      </BthSurface>
    </BthBox>
  );
}

function renderOrdersTab(ordersLabel: string, onOpenOrders?: () => void) {
  return (
    <BthSurface tone="raised" padding={4} gap={3}>
      <BthSectionHeader title="طلباتي" subtitle="الطلب النشط وسجل الحركة الأخيرة" />
      <BthListItem title="الطلبات الحديثة" subtitle={ordersLabel} meta="Activity" badgeLabel="Orders" onPress={onOpenOrders} />
      <BthListItem title="التتبع" subtitle="انتقال مباشر إلى حالة الطلب الحالية" meta="Track" badgeLabel="Live" onPress={onOpenOrders} />
      <BthListItem title="سجل الطلبات" subtitle="استعراض الطلبات السابقة بسرعة" meta="History" badgeLabel="Orders" onPress={onOpenOrders} />
    </BthSurface>
  );
}

function renderAddressTab(addressLabel: string, onChangeAddress?: () => void) {
  return (
    <BthSurface tone="raised" padding={4} gap={3}>
      <BthSectionHeader title="عنوان DSH" subtitle="نقطة الخدمة الحالية التي يعتمدها المسار" />
      <BthListItem title="العنوان الحالي" subtitle={addressLabel} meta="Service point" badgeLabel="Address" onPress={onChangeAddress} />
      <BthButton label="تغيير العنوان" tone="secondary" onPress={onChangeAddress} />
    </BthSurface>
  );
}

export function DshMySpaceScreen({
  state = 'ready',
  name = 'مساحتي داخل DSH',
  subscriptionLabel = 'يفتح المسار الحقيقي للاشتراك والفِرَق المرتبطة به',
  preferenceLabel = 'يفتح service-settings كمسار التفضيلات الحقيقي',
  addressLabel = 'يفتح zone-set أو المسار المكافئ لتغيير العنوان',
  ordersLabel = 'يفتح orders-list أو tracking بحسب الحالة الحقيقية',
  offersLabel = 'يفتح stores-list أو categories-list كمسارات عرض فعلية',
  discountsLabel = 'يفتح checkout و promo-apply عبر المسار الفعلي',
  marketingPrograms = [],
  onOpenBenefits,
  onOpenSubscriptions,
  onOpenPreferences,
  onOpenOffers,
  onOpenDiscounts,
  onOpenOrders,
  onChangeAddress,
  onBack,
  onRetry,
}: DshMySpaceScreenProps) {
  const [activeTab, setActiveTab] = React.useState<MySpaceTab>('loyalty');

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" padding={4} gap={3}>
        <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
          <BthText role="titleLg" tone="inverse">مساحتي</BthText>
          <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{name}</BthText>
          <BthText role="bodySm" tone="inverse" style={{ opacity: 0.86 }}>
            مساحة شخصية سريعة تجمع الاشتراكات والتفضيلات والعروض والطلبات والعنوان دون تعقيد.
          </BthText>
        </BthBox>
        {renderTabChips(activeTab, setActiveTab)}
      </BthSurface>

      {activeTab === 'loyalty' ? renderLoyaltyTab(name, onOpenBenefits, onOpenSubscriptions, onOpenOffers) : null}
      {activeTab === 'subscriptions' ? renderSubscriptionsTab(subscriptionLabel, onOpenSubscriptions) : null}
      {activeTab === 'preferences' ? renderPreferencesTab(preferenceLabel, onOpenPreferences) : null}
      {activeTab === 'offers' ? renderOffersTab(offersLabel, discountsLabel, marketingPrograms, onOpenOffers, onOpenDiscounts, onOpenSubscriptions) : null}
      {activeTab === 'orders' ? renderOrdersTab(ordersLabel, onOpenOrders) : null}
      {activeTab === 'address' ? renderAddressTab(addressLabel, onChangeAddress) : null}
    </BthMobileScrollView>
  );
}

export default DshMySpaceScreen;