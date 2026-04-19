import React from 'react';
import { BthBox, BthMobileScrollView, BthOptionRow, BthSegmentedControl, BthSurface, BthTabs, BthText } from '@bthwani/ui-kit';
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

type DetailRowConfig = {
  id: MySpaceDetailTab;
  label: string;
  summary: string;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'loyalty', label: 'الولاء', summary: 'إدارة النقاط والمكافآت', defaultDetail: 'loyalty-balance' },
  { id: 'subscriptions', label: 'الاشتراكات', summary: 'الباقات والمزامنة', defaultDetail: 'subscriptions-overview' },
  { id: 'preferences', label: 'التفضيلات', summary: 'الملف والعرض', defaultDetail: 'preferences-profile' },
  { id: 'offers', label: 'العروض', summary: 'العروض والخصومات', defaultDetail: 'offers-personal' },
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ', defaultDetail: 'orders-recent' },
  { id: 'address', label: 'العنوان', summary: 'العنوان الحالي والتغيير', defaultDetail: 'address-current' },
];

const detailRowsByPrimary: Record<MySpacePrimaryTab, DetailRowConfig[]> = {
  loyalty: [
    { id: 'loyalty-balance', label: 'الرصيد', summary: 'عرض النقاط الحالية والمكافآت' },
    { id: 'loyalty-redeem', label: 'المكافآت', summary: 'استبدال النقاط والعروض المرتبطة' },
  ],
  subscriptions: [
    { id: 'subscriptions-overview', label: 'ملخص', summary: 'نظرة سريعة على الاشتراك' },
    { id: 'subscriptions-sync', label: 'مزامنة', summary: 'تحديث الحالة والربط' },
  ],
  preferences: [
    { id: 'preferences-profile', label: 'الملف', summary: 'التفضيل الحالي والتجربة' },
    { id: 'preferences-density', label: 'العرض', summary: 'اللغة والكثافة' },
  ],
  offers: [
    { id: 'offers-personal', label: 'شخصية', summary: 'العروض الأقرب لك' },
    { id: 'offers-discounts', label: 'الخصومات', summary: 'الخصومات والحملات النشطة' },
  ],
  orders: [
    { id: 'orders-recent', label: 'حديثة', summary: 'آخر الطلبات الحالية' },
    { id: 'orders-history', label: 'السجل', summary: 'الطلبات السابقة' },
  ],
  address: [
    { id: 'address-current', label: 'الحالي', summary: 'العنوان المعتمد الآن' },
    { id: 'address-change', label: 'تغيير', summary: 'تحديث نقطة الخدمة' },
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

function renderDetailStack(
  detailRows: DetailRowConfig[],
  activeDetailTab: MySpaceDetailTab,
  onChange: (tab: MySpaceDetailTab) => void,
  renderBody: (tab: MySpaceDetailTab) => React.ReactNode,
) {
  const activeDetailRow = detailRows.find((row) => row.id === activeDetailTab) ?? detailRows[0];

  return (
    <BthSurface tone="inset" padding={2} gap={2}>
      <BthBox gap={1}>
        <BthText role="caption" tone="soft">
          صفوف مختصرة داخل الصفحة نفسها
        </BthText>
        <BthSegmentedControl
          value={activeDetailTab}
          onValueChange={onChange}
          options={detailRows.map((row) => ({ value: row.id, label: row.label }))}
          size="sm"
        />
      </BthBox>

      <BthBox gap={1}>
        {activeDetailRow ? (
          <BthText role="bodySm" tone="muted">
            {activeDetailRow.summary}
          </BthText>
        ) : null}

        <BthBox gap={1}>
          {renderBody(activeDetailTab)}
        </BthBox>
      </BthBox>
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
    renderDetailStack(detailRowsByPrimary.loyalty, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'loyalty-balance') {
        return (
          <>
            <BthOptionRow title="رصيد الولاء" subtitle="اطلع على رصيدك الحالي" actionLabel="فتح" onAction={onOpenBenefits} />
            <BthOptionRow title="المكافآت" subtitle="انتقل إلى الاستبدال داخل نفس الصفحة" actionLabel="عرض" onAction={() => onChangeDetailTab('loyalty-redeem')} />
          </>
        );
      }

      return (
        <>
          <BthOptionRow title="استبدال النقاط" subtitle="استخدم نقاطك بالمكافآت المتاحة" actionLabel="فتح" onAction={onOpenBenefits} />
          <BthOptionRow title="العروض" subtitle="اذهب إلى العروض داخل هذه الصفحة" actionLabel="عرض" onAction={onOpenOffers} />
          <BthOptionRow title="الاشتراكات" subtitle="واصل إلى بطاقة الاشتراكات أسفل الصفحة" actionLabel="فتح" onAction={onOpenSubscriptions} />
        </>
      );
    })
  );
}

function renderPrimarySectionContent(
  section: MySpacePrimaryTab,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  subscriptionLabel: string,
  preferenceLabel: string,
  addressLabel: string,
  ordersLabel: string,
  offersLabel: string,
  discountsLabel: string,
  marketingPrograms: DshMySpaceItem[],
  onOpenBenefits?: () => void,
  onOpenSubscriptions?: () => void,
  onOpenPreferences?: () => void,
  onOpenOffers?: () => void,
  onOpenDiscounts?: () => void,
  onOpenOrders?: () => void,
  onChangeAddress?: () => void,
) {
  if (section === 'loyalty') {
    return renderLoyaltyContent(activeDetailTab, onChangeDetailTab, onOpenBenefits, onOpenSubscriptions, onOpenOffers);
  }

  if (section === 'subscriptions') {
    return renderSubscriptionsContent(subscriptionLabel, activeDetailTab, onChangeDetailTab, onOpenSubscriptions);
  }

  if (section === 'preferences') {
    return renderPreferencesContent(preferenceLabel, activeDetailTab, onChangeDetailTab, onOpenPreferences);
  }

  if (section === 'offers') {
    return renderOffersContent(offersLabel, discountsLabel, marketingPrograms, activeDetailTab, onChangeDetailTab, onOpenOffers, onOpenDiscounts, onOpenSubscriptions);
  }

  if (section === 'orders') {
    return renderOrdersContent(ordersLabel, activeDetailTab, onChangeDetailTab, onOpenOrders);
  }

  return renderAddressContent(addressLabel, activeDetailTab, onChangeDetailTab, onChangeAddress);
}

function renderSubscriptionsContent(
  subscriptionLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenSubscriptions?: () => void,
) {
  return (
    renderDetailStack(detailRowsByPrimary.subscriptions, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'subscriptions-overview') {
        return (
          <>
            <BthOptionRow title="الحالة الحالية" subtitle={subscriptionLabel} actionLabel="فتح" onAction={onOpenSubscriptions} />
            <BthOptionRow title="الباقة النشطة" subtitle="استعراض مختصر للباقات والامتيازات المرتبطة" actionLabel="عرض" onAction={onOpenSubscriptions} />
          </>
        );
      }

      return (
        <>
          <BthOptionRow title="مزامنة الاشتراك" subtitle="تحديث الحالة والربط الحالي" actionLabel="تحديث" onAction={onOpenSubscriptions} />
          <BthOptionRow title="إعادة الفحص" subtitle="فحص مباشر للبيانات المرتبطة" actionLabel="فحص" onAction={onOpenSubscriptions} />
        </>
      );
    })
  );
}

function renderPreferencesContent(
  preferenceLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenPreferences?: () => void,
) {
  return (
    renderDetailStack(detailRowsByPrimary.preferences, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'preferences-profile') {
        return (
          <>
            <BthOptionRow title="التفضيل الحالي" subtitle={preferenceLabel} actionLabel="فتح" onAction={onOpenPreferences} />
            <BthOptionRow title="لغة وتجربة" subtitle="إعداد مختصر للسلوك العام للمساحة الشخصية" actionLabel="ضبط" onAction={onOpenPreferences} />
          </>
        );
      }

      return (
        <>
          <BthOptionRow title="العرض المختصر" subtitle="تقليل الكثافة مع الحفاظ على وضوح المسارات" actionLabel="ضبط" onAction={onOpenPreferences} />
          <BthOptionRow title="اللغة" subtitle="تبديل اللغة من نفس الصفحة" actionLabel="لغة" onAction={onOpenPreferences} />
        </>
      );
    })
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
    renderDetailStack(detailRowsByPrimary.offers, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'offers-personal') {
        return (
          <>
            <BthOptionRow title="العروض الشخصية" subtitle={offersLabel} actionLabel="فتح" onAction={onOpenOffers} />
            <BthOptionRow title="حزمة الواجهة" subtitle="عرض خفيف للأشياء الأكثر صلة بالمستخدم" actionLabel="عرض" onAction={onOpenOffers} />
          </>
        );
      }

      return (
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
      );
    })
  );
}

function renderOrdersContent(
  ordersLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onOpenOrders?: () => void,
) {
  return (
    renderDetailStack(detailRowsByPrimary.orders, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'orders-recent') {
        return (
          <>
            <BthOptionRow title="الطلبات الحديثة" subtitle={ordersLabel} actionLabel="فتح" onAction={onOpenOrders} />
            <BthOptionRow title="الطلب النشط" subtitle="اختصار واضح إلى آخر حالة تحتاجها الآن" actionLabel="تتبع" onAction={onOpenOrders} />
          </>
        );
      }

      return (
        <>
          <BthOptionRow title="سجل الطلبات" subtitle="استعراض الطلبات السابقة بسرعة" actionLabel="فتح" onAction={onOpenOrders} />
          <BthOptionRow title="التتبع" subtitle="الانتقال إلى الحالة الحالية عند الحاجة" actionLabel="تتبع" onAction={onOpenOrders} />
        </>
      );
    })
  );
}

function renderAddressContent(
  addressLabel: string,
  activeDetailTab: MySpaceDetailTab,
  onChangeDetailTab: (tab: MySpaceDetailTab) => void,
  onChangeAddress?: () => void,
) {
  return (
    renderDetailStack(detailRowsByPrimary.address, activeDetailTab, onChangeDetailTab, (tab) => {
      if (tab === 'address-current') {
        return (
          <>
            <BthOptionRow title="العنوان الحالي" subtitle={addressLabel} actionLabel="فتح" onAction={onChangeAddress} />
            <BthOptionRow title="نقطة الخدمة" subtitle="عرض واضح للعقدة الحالية التي يعتمدها المسار" actionLabel="عرض" onAction={onChangeAddress} />
          </>
        );
      }

      return (
        <>
          <BthOptionRow title="تغيير العنوان" subtitle="انتقل إلى zone-set أو المسار المكافئ" actionLabel="بدء" onAction={onChangeAddress} />
          <BthOptionRow title="خطوة مؤكدة" subtitle="عملية تغيير واضحة مع مسار رجوع آمن" actionLabel="مراجعة" onAction={onChangeAddress} />
        </>
      );
    })
  );
}

export function DshMySpaceScreen({
  state = 'ready',
  name = 'مساحتي داخل DSH',
  subscriptionLabel = 'يفتح المسار الحقيقي للاشتراك والفِرَق المرتبطة به',
  preferenceLabel = 'يفتح service-settings كمسار التفضيلات الحقيقي',
  addressLabel = 'يفتح zone-set أو المسار المكافئ لتغيير العنوان',
  ordersLabel = 'يفتح orders-list أو tracking بحسب الحالة الحقيقية',
  offersLabel = 'يفتح الصفحة الرئيسية أو categories-list كمسارات عرض فعلية',
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
  const activePrimarySection = primaryTabs.find((tab) => tab.id === activePrimaryTab) ?? primaryTabs[0];
  const activeDetailLabel = detailRowsByPrimary[activePrimaryTab].find((tab) => tab.id === activeDetailTab)?.label ?? '';

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

      <BthBox gap={2}>
        <BthSurface tone="inset" padding={2} gap={1}>
          <BthTabs<MySpacePrimaryTab>
            value={activePrimaryTab}
            onValueChange={handlePrimaryChange}
            variant="pill"
            scrollable
            items={primaryTabs.map((section) => ({
              value: section.id,
              label: section.label,
            }))}
          />

          <BthText role="bodySm" tone="muted">
            {activePrimarySection.summary}
          </BthText>
        </BthSurface>

        <BthSurface tone="raised" padding={3} gap={2}>
          <BthBox gap={0} style={{ alignItems: 'flex-end' }}>
            <BthText role="titleSm">{activePrimarySection.label}</BthText>
            <BthText role="bodySm" tone="muted">
              صفحة واحدة لكل ما يتعلق بهذا القسم، مع تفاصيله داخل الصفحة نفسها.
            </BthText>
          </BthBox>

          {renderPrimarySectionContent(
            activePrimaryTab,
            activeDetailTab,
            handleDetailChange,
            subscriptionLabel,
            preferenceLabel,
            addressLabel,
            ordersLabel,
            offersLabel,
            discountsLabel,
            marketingPrograms,
            onOpenBenefits,
            onOpenSubscriptions,
            onOpenPreferences,
            onOpenOffers,
            onOpenDiscounts,
            onOpenOrders,
            onChangeAddress,
          )}
        </BthSurface>
      </BthBox>
    </BthMobileScrollView>
  );
}

export default DshMySpaceScreen;