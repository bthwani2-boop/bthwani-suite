import React from 'react';
import { Pressable } from 'react-native';
import { BthBox, BthButton, BthListItem, BthMobileScrollView, BthSectionHeader, BthSurface, BthTabs, BthText } from '@bthwani/ui-kit';
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

type MySpacePrimaryTab = 'loyalty' | 'subscriptions' | 'preferences' | 'offers' | 'orders' | 'address';

type MySpaceDetailTab =
  | 'loyalty-balance'
  | 'loyalty-redeem'
  | 'subscriptions-overview'
  | 'subscriptions-sync'
  | 'preferences-profile'
  | 'preferences-density'
  | 'offers-personal'
  | 'offers-discounts'
  | 'orders-recent'
  | 'orders-history'
  | 'address-current'
  | 'address-change';

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  defaultDetail: MySpaceDetailTab;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'loyalty', label: 'الولاء', summary: 'إدارة النقاط والمكافآت', defaultDetail: 'loyalty-balance' },
  { id: 'subscriptions', label: 'الاشتراكات', summary: 'الباقات والمزامنة', defaultDetail: 'subscriptions-overview' },
  { id: 'preferences', label: 'التفضيلات', summary: 'الملف والعرض', defaultDetail: 'preferences-profile' },
  { id: 'offers', label: 'العروض', summary: 'العروض والخصومات', defaultDetail: 'offers-personal' },
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ', defaultDetail: 'orders-recent' },
  { id: 'address', label: 'العنوان', summary: 'العنوان الحالي والتغيير', defaultDetail: 'address-current' },
];

const detailTabsByPrimary: Record<MySpacePrimaryTab, Array<{ id: MySpaceDetailTab; label: string }>> = {
  loyalty: [
    { id: 'loyalty-balance', label: 'الرصيد' },
    { id: 'loyalty-redeem', label: 'المكافآت' },
  ],
  subscriptions: [
    { id: 'subscriptions-overview', label: 'النظرة العامة' },
    { id: 'subscriptions-sync', label: 'المزامنة' },
  ],
  preferences: [
    { id: 'preferences-profile', label: 'الملف' },
    { id: 'preferences-density', label: 'العرض' },
  ],
  offers: [
    { id: 'offers-personal', label: 'العروض الشخصية' },
    { id: 'offers-discounts', label: 'الخصومات' },
  ],
  orders: [
    { id: 'orders-recent', label: 'الحديثة' },
    { id: 'orders-history', label: 'السجل' },
  ],
  address: [
    { id: 'address-current', label: 'العنوان الحالي' },
    { id: 'address-change', label: 'تغيير العنوان' },
  ],
};

const defaultDetailTabByPrimary: Record<MySpacePrimaryTab, MySpaceDetailTab> = {
  loyalty: 'loyalty-balance',
  subscriptions: 'subscriptions-overview',
  preferences: 'preferences-profile',
  offers: 'offers-personal',
  orders: 'orders-recent',
  address: 'address-current',
};

function getPrimaryTabLabel(primaryTab: MySpacePrimaryTab) {
  return primaryTabs.find((tab) => tab.id === primaryTab)?.label ?? 'مساحتي';
}

function renderDetailRail(
  primaryTab: MySpacePrimaryTab,
  activeDetailTab: MySpaceDetailTab,
  onChange: (tab: MySpaceDetailTab) => void,
) {
  return (
    <BthTabs<MySpaceDetailTab>
      value={activeDetailTab}
      onValueChange={onChange}
      variant="line"
      stretch
      items={detailTabsByPrimary[primaryTab]}
    />
  );
}

function renderSectionShell(
  section: PrimaryTabConfig,
  expanded: boolean,
  onToggle: () => void,
  children?: React.ReactNode,
) {
  return (
    <BthSurface
      tone={expanded ? 'raised' : 'default'}
      padding={expanded ? 2 : 2}
      gap={expanded ? 1 : 1}
      style={{
        borderWidth: 1,
        borderColor: expanded ? 'rgba(255, 106, 0, 0.35)' : 'rgba(15, 23, 42, 0.08)',
      }}
    >
      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onToggle}>
        <BthBox layoutDirection="row" justify="space-between" align="center" gap={2}>
          <BthBox gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
            <BthText role="bodyStrong">{section.label}</BthText>
            <BthText role="bodySm" tone="muted">
              {section.summary}
            </BthText>
          </BthBox>
          <BthBox gap={1} style={{ alignItems: 'flex-start' }}>
            <BthText role="caption" tone={expanded ? 'brand' : 'soft'}>
              {expanded ? 'مفتوح' : 'افتح'}
            </BthText>
            <BthText role="bodyStrong" tone={expanded ? 'brand' : 'muted'}>
              {expanded ? '▾' : '▸'}
            </BthText>
          </BthBox>
        </BthBox>
      </Pressable>

      {expanded ? children : null}
    </BthSurface>
  );
}

function renderLoyaltyContent(
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenBenefits?: () => void,
  onOpenSubscriptions?: () => void,
  onOpenOffers?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('loyalty', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'loyalty-balance' ? (
          <>
              <BthOptionRow title="رصيد الولاء" subtitle="اطلع على رصيد نقاطك" actionLabel="فتح" onAction={onOpenBenefits} />
              <BthOptionRow title="المكافآت" subtitle="انتقل إلى تبويب الاستبدال داخل نفس الصفحة" actionLabel="عرض" onAction={() => onChangeDetailTab('loyalty-redeem')} />
          </>
        ) : null}

        {activeDetailTab === 'loyalty-redeem' ? (
          <>
              <BthOptionRow title="استبدال النقاط" subtitle="استخدم نقاطك بالمكافآت المتاحة" actionLabel="فتح" onAction={onOpenBenefits} />
              <BthOptionRow title="العروض" subtitle="اذهب إلى العروض داخل نفس الشاشة" actionLabel="عرض" onAction={onOpenOffers} />
              <BthOptionRow title="الاشتراكات" subtitle="واصل إلى بطاقة الاشتراكات أسفل الصفحة" actionLabel="فتح" onAction={onOpenSubscriptions} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
  );
}

function renderSubscriptionsContent(
  subscriptionLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenSubscriptions?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('subscriptions', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'subscriptions-overview' ? (
          <>
              <BthOptionRow title="الحالة الحالية" subtitle={subscriptionLabel} actionLabel="فتح" onAction={onOpenSubscriptions} />
              <BthOptionRow title="الباقة النشطة" subtitle="استعراض مختصر للباقات والامتيازات المرتبطة" actionLabel="عرض" onAction={onOpenSubscriptions} />
          </>
        ) : null}

        {activeDetailTab === 'subscriptions-sync' ? (
          <>
              <BthOptionRow title="مزامنة الاشتراك" subtitle="يفتح المزامنة كمسار فعلي داخل هذه الصفحة" actionLabel="تحديث" onAction={onOpenSubscriptions} />
              <BthOptionRow title="إعادة الفحص" subtitle="تحديث مباشر للحالة والبيانات المرتبطة" actionLabel="فحص" onAction={onOpenSubscriptions} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
  );
}

function renderPreferencesContent(
  preferenceLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenPreferences?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('preferences', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'preferences-profile' ? (
          <>
              <BthOptionRow title="التفضيل الحالي" subtitle={preferenceLabel} actionLabel="فتح" onAction={onOpenPreferences} />
              <BthOptionRow title="لغة وتجربة" subtitle="إعداد مختصر للسلوك العام للمساحة الشخصية" actionLabel="ضبط" onAction={onOpenPreferences} />
          </>
        ) : null}

        {activeDetailTab === 'preferences-density' ? (
          <>
              <BthOptionRow title="العرض المختصر" subtitle="تقليل الكثافة مع الحفاظ على وضوح المسارات" actionLabel="ضبط" onAction={onOpenPreferences} />
              <BthOptionRow title="اللغة" subtitle="تبديل اللغة حسب الحاجة من نفس الصفحة" actionLabel="لغة" onAction={onOpenPreferences} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
  );
}

function renderOffersContent(
  offersLabel: string,
  discountsLabel: string,
  marketingPrograms: DshMySpaceItem[],
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenOffers?: () => void,
  onOpenDiscounts?: () => void,
  onOpenSubscriptions?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('offers', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'offers-personal' ? (
          <>
              <BthOptionRow title="العروض الشخصية" subtitle={offersLabel} actionLabel="فتح" onAction={onOpenOffers} />
              <BthOptionRow title="حزمة الواجهة" subtitle="عرض خفيف للأشياء الأكثر صلة بالمستخدم" actionLabel="عرض" onAction={onOpenOffers} />
          </>
        ) : null}

        {activeDetailTab === 'offers-discounts' ? (
          <>
              <BthOptionRow title="الخصومات النشطة" subtitle={discountsLabel} actionLabel="فتح" onAction={onOpenDiscounts} />
            {marketingPrograms.length ? marketingPrograms.map((item) => (
                <BthOptionRow
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                  actionLabel={item.badgeLabel}
                  onAction={item.id.includes('subscription') ? onOpenSubscriptions ?? onOpenOffers : item.id.includes('promo') ? onOpenDiscounts ?? onOpenOffers : onOpenOffers}
              />
            )) : (
              <BthText role="bodySm" tone="muted">
                لا توجد حملات مباشرة مفعلة الآن. افتح العروض أو الخصومات للوصول إلى المسارات الحية.
              </BthText>
            )}
              <BthOptionRow title="فتح الخصومات" subtitle="انتقل مباشرة إلى مسار الخصومات داخل نفس الشاشة" actionLabel="فتح" onAction={onOpenDiscounts} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
  );
}

function renderOrdersContent(
  ordersLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenOrders?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('orders', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'orders-recent' ? (
          <>
              <BthOptionRow title="الطلبات الحديثة" subtitle={ordersLabel} actionLabel="فتح" onAction={onOpenOrders} />
              <BthOptionRow title="الطلب النشط" subtitle="اختصار واضح إلى آخر حالة تحتاجها الآن" actionLabel="تتبع" onAction={onOpenOrders} />
          </>
        ) : null}

        {activeDetailTab === 'orders-history' ? (
          <>
              <BthOptionRow title="سجل الطلبات" subtitle="استعراض الطلبات السابقة بسرعة" actionLabel="فتح" onAction={onOpenOrders} />
              <BthOptionRow title="التتبع" subtitle="الانتقال إلى الحالة الحالية إذا كانت الطلبات المفتوحة مهمة" actionLabel="تتبع" onAction={onOpenOrders} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
  );
}

function renderAddressContent(
  addressLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onChangeAddress?: () => void,
) {
  return (
    <BthBox gap={3}>
      {renderDetailRail('address', activeDetailTab, onChangeDetailTab)}
      <BthSurface tone="inset" padding={1} gap={1}>
        {activeDetailTab === 'address-current' ? (
          <>
              <BthOptionRow title="العنوان الحالي" subtitle={addressLabel} actionLabel="فتح" onAction={onChangeAddress} />
              <BthOptionRow title="نقطة الخدمة" subtitle="عرض واضح للعقدة الحالية التي يعتمدها المسار" actionLabel="عرض" onAction={onChangeAddress} />
          </>
        ) : null}

        {activeDetailTab === 'address-change' ? (
          <>
              <BthOptionRow title="تغيير العنوان" subtitle="انتقل إلى zone-set أو المسار المكافئ لتحديث نقطة الخدمة" actionLabel="بدء" onAction={onChangeAddress} />
              <BthOptionRow title="خطوة مؤكدة" subtitle="عملية تغيير منطقية وواضحة مع مسار رجوع آمن" actionLabel="مراجعة" onAction={onChangeAddress} />
          </>
        ) : null}
      </BthSurface>
    </BthBox>
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
  const [activePrimaryTab, setActivePrimaryTab] = React.useState<MySpacePrimaryTab>('loyalty');
  const [activeDetailTab, setActiveDetailTab] = React.useState<MySpaceDetailTab>(defaultDetailTabByPrimary.loyalty);

  React.useEffect(() => {
    setActiveDetailTab(defaultDetailTabByPrimary[activePrimaryTab]);
  }, [activePrimaryTab]);

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const activePrimaryLabel = getPrimaryTabLabel(activePrimaryTab);
  const activeDetailLabel = detailTabsByPrimary[activePrimaryTab].find((tab) => tab.id === activeDetailTab)?.label ?? '';

  const handlePrimaryChange = (nextTab: MySpacePrimaryTab) => {
    setActivePrimaryTab(nextTab);
    setActiveDetailTab(defaultDetailTabByPrimary[nextTab]);
  };

  const handleDetailChange = (nextTab: MySpaceDetailTab) => {
    setActiveDetailTab(nextTab);
  };

  return (
    <BthMobileScrollView padding={2} gap={1}>
      <BthSurface tone="brand" padding={2} gap={1}>
        <BthBox gap={0} style={{ alignItems: 'flex-end' }}>
          <BthText role="titleLg" tone="inverse">مساحتي</BthText>
          <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{name}</BthText>
        </BthBox>

        <BthSurface tone="inset" padding={1} gap={0}>
          <BthText role="caption" tone="muted">
            المسار الحالي
          </BthText>
          <BthText role="bodyStrong">
            {activePrimaryLabel}{activeDetailLabel ? ` / ${activeDetailLabel}` : ''}
          </BthText>
        </BthSurface>
      </BthSurface>

      <BthBox gap={1}>
        {primaryTabs.map((section) => {
          const expanded = section.id === activePrimaryTab;

          return (
            <React.Fragment key={section.id}>
              {renderSectionShell(
                section,
                expanded,
                () => handlePrimaryChange(section.id),
                expanded ? (
                  <>
                    {section.id === 'loyalty' ? renderLoyaltyContent(activeDetailTab, handleDetailChange, onOpenBenefits, onOpenSubscriptions, onOpenOffers) : null}
                    {section.id === 'subscriptions' ? renderSubscriptionsContent(subscriptionLabel, activeDetailTab, handleDetailChange, onOpenSubscriptions) : null}
                    {section.id === 'preferences' ? renderPreferencesContent(preferenceLabel, activeDetailTab, handleDetailChange, onOpenPreferences) : null}
                    {section.id === 'offers' ? renderOffersContent(offersLabel, discountsLabel, marketingPrograms, activeDetailTab, handleDetailChange, onOpenOffers, onOpenDiscounts, onOpenSubscriptions) : null}
                    {section.id === 'orders' ? renderOrdersContent(ordersLabel, activeDetailTab, handleDetailChange, onOpenOrders) : null}
                    {section.id === 'address' ? renderAddressContent(addressLabel, activeDetailTab, handleDetailChange, onChangeAddress) : null}
                  </>
                ) : null,
              )}
            </React.Fragment>
          );
        })}
      </BthBox>
    </BthMobileScrollView>
  );
}

export default DshMySpaceScreen;