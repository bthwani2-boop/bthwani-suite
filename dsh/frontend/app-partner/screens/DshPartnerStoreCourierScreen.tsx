import React from 'react';
import { View } from 'react-native';
import {
  Box,
  Button,
  Chip,
  Icon,
  KeyValueList,
  MobileScrollView,
  MobileStickyPrimaryAction,
  Surface,
  Switch,
  Text,
  TextField,
  TopBar,
  useDirection,
} from '@bthwani/ui-kit';
import { resolveDshControlPanelSectionLabel } from '../../shared';
import type {
  StoreCourierCompensation,
  StoreDeliveryPolicy,
  StoreDeliveryPricingSource,
} from '../contracts/dsh-partner-binding.contracts';

type PolicyOption = { id: StoreDeliveryPolicy; label: string; description: string };
type PricingOption = { id: StoreDeliveryPricingSource; label: string; description: string };
type CompensationOption = { id: StoreCourierCompensation; label: string; description: string };

const POLICY_OPTIONS: readonly PolicyOption[] = [
  { id: 'free_delivery', label: 'توصيل مجاني', description: 'المتجر يتحمل تكلفة التوصيل — لا رسوم على العميل.' },
  { id: 'courier_per_delivery_payout', label: 'مستحق لكل توصيلة', description: 'الموصل يحصل على مبلغ محدد عن كل طلب يوصله.' },
  { id: 'store_retained_fee_salary_courier', label: 'رسوم للمتجر + راتب للموصل', description: 'رسوم التوصيل تذهب للمتجر، والموصل على راتب ثابت.' },
];

const PRICING_OPTIONS: readonly PricingOption[] = [
  { id: 'bthwani_pricing', label: 'تسعير بثواني', description: 'يعتمد جدول الأسعار الموحد من بثواني.' },
  { id: 'store_fixed_price', label: 'سعر ثابت من المتجر', description: 'المتجر يحدد سعرًا موحدًا للتوصيل لكل الطلبات.' },
  { id: 'control_panel_zone_pricing', label: 'تسعير المناطق — لوحة التحكم', description: 'يعتمد التسعير المناطقي المُدار من لوحة التحكم.' },
];

const COMPENSATION_OPTIONS: readonly CompensationOption[] = [
  { id: 'none', label: 'لا مستحق إضافي', description: 'الموصل على راتب ثابت أو بدون عمولة منفصلة.' },
  { id: 'fixed_per_delivery', label: 'مبلغ ثابت لكل توصيلة', description: 'مبلغ محدد يُضاف لكل طلب يتم توصيله.' },
  { id: 'percentage_of_delivery_fee', label: 'نسبة من رسوم التوصيل', description: 'نسبة مئوية من رسوم التوصيل لكل طلب.' },
];

const BRANCH_OPTIONS = [
  { id: 'all', label: 'كل الفروع' },
  { id: 'yasmin', label: 'فرع الياسمين' },
  { id: 'nada', label: 'فرع الندى' },
] as const;

const BOTTOM_INSET = 144;

function SelectionBlock<T extends string>({
  options,
  selectedId,
  onSelect,
  direction,
}: {
  options: readonly { id: T; label: string; description: string }[];
  selectedId: T;
  onSelect: (id: T) => void;
  direction: 'ltr' | 'rtl';
}) {
  return (
    <>
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <Surface key={option.id} tone={isSelected ? 'inset' : 'default'} padding={3} gap={2}>
            <View
              style={{
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <Text role="bodyStrong" align="start" style={{ flex: 1 }}>{option.label}</Text>
              {isSelected ? <Chip label="محدد" tone="brand" /> : null}
            </View>
            <Text role="caption" tone="muted" align="start">{option.description}</Text>
            {!isSelected ? (
              <Button label="اختيار" size="sm" tone="secondary" fullWidth={false} onPress={() => onSelect(option.id)} />
            ) : null}
          </Surface>
        );
      })}
    </>
  );
}

export function DshPartnerStoreCourierScreen({ onBack }: { onBack: () => void }) {
  const { direction } = useDirection();
  const [courierName, setCourierName] = React.useState('');
  const [courierPhone, setCourierPhone] = React.useState('');
  const [selectedBranchIds, setSelectedBranchIds] = React.useState<string[]>(['all']);
  const [isActive, setIsActive] = React.useState(false);
  const [policy, setPolicy] = React.useState<StoreDeliveryPolicy>('free_delivery');
  const [pricingSource, setPricingSource] = React.useState<StoreDeliveryPricingSource>('bthwani_pricing');
  const [compensation, setCompensation] = React.useState<StoreCourierCompensation>('none');
  const [savedLabel, setSavedLabel] = React.useState<string | null>(null);

  const requiresCompensation = policy !== 'free_delivery';
  const canSave = courierName.trim().length > 0 && courierPhone.trim().length > 0;

  const selectedPolicyLabel = POLICY_OPTIONS.find((o) => o.id === policy)?.label ?? '';
  const selectedPricingLabel = PRICING_OPTIONS.find((o) => o.id === pricingSource)?.label ?? '';
  const selectedCompensationLabel = COMPENSATION_OPTIONS.find((o) => o.id === compensation)?.label ?? '';

  const branchLabel = selectedBranchIds.includes('all')
    ? 'كل الفروع'
    : BRANCH_OPTIONS.filter((b) => selectedBranchIds.includes(b.id)).map((b) => b.label).join(' · ');

  function toggleBranch(id: string) {
    setSelectedBranchIds((current) => {
      if (id === 'all') {
        return ['all'];
      }
      const without = current.filter((b) => b !== 'all' && b !== id);
      const next = current.includes(id) ? without : [...without, id];
      return next.length === 0 ? ['all'] : next;
    });
  }

  return (
    <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: BOTTOM_INSET }}>
      <TopBar
        variant="secondary"
        title="إعداد موصل المتجر"
        subtitle="منح صلاحية التوصيل الداخلي"
        style={{ marginHorizontal: -16, marginTop: -16 }}
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />

      <Surface tone="inset" padding={3} gap={2}>
        <Text role="bodyStrong" align="start">حدود السياسة والمال</Text>
        <Text role="bodySm" tone="muted" align="start">
          إعداد الموصل محلي للشريك فقط. التسعير المناطقي والسياسات المركزية يملكها {resolveDshControlPanelSectionLabel('platform')}، وأي payout أو commission أو settlement يبقى مرجعًا إلى {resolveDshControlPanelSectionLabel('finance')} وWLT.
        </Text>
      </Surface>

      {/* ─── Basic Info ──────────────────────────────────────────────────── */}
      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">بيانات الموصل</Text>
        <TextField
          label="اسم موصل المتجر"
          placeholder="مثال: عمر"
          value={courierName}
          onChangeText={setCourierName}
        />
        <TextField
          label="رقم الجوال"
          placeholder="05XXXXXXXX"
          value={courierPhone}
          onChangeText={setCourierPhone}
          keyboardType="phone-pad"
        />
        <Switch
          label="حالة التفعيل"
          description={isActive ? 'الموصل مفعّل وجاهز لاستقبال الطلبات' : 'الموصل غير مفعّل حاليًا'}
          value={isActive}
          onValueChange={setIsActive}
        />
      </Surface>

      {/* ─── Branch Scope ────────────────────────────────────────────────── */}
      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">الفروع المخصصة</Text>
        <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 8 }}>
          {BRANCH_OPTIONS.map((branch) => {
            const isSelected = selectedBranchIds.includes(branch.id);
            return (
              <Chip
                key={branch.id}
                label={branch.label}
                tone={isSelected ? 'brand' : 'default'}
                selected={isSelected}
                onPress={() => toggleBranch(branch.id)}
              />
            );
          })}
        </Box>
      </Surface>

      {/* ─── Delivery Policy ─────────────────────────────────────────────── */}
      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">سياسة التوصيل</Text>
        <SelectionBlock
          options={POLICY_OPTIONS}
          selectedId={policy}
          onSelect={setPolicy}
          direction={direction}
        />
      </Surface>

      {/* ─── Pricing Source ──────────────────────────────────────────────── */}
      <Surface tone="raised" padding={4} gap={3}>
        <Text role="label" tone="muted">مصدر التسعير</Text>
        <SelectionBlock
          options={PRICING_OPTIONS}
          selectedId={pricingSource}
          onSelect={setPricingSource}
          direction={direction}
        />
      </Surface>

      {/* ─── Courier Compensation (only when policy requires it) ─────────── */}
      {requiresCompensation ? (
        <Surface tone="raised" padding={4} gap={3}>
          <Text role="label" tone="muted">مستحق الموصل</Text>
          <SelectionBlock
            options={COMPENSATION_OPTIONS}
            selectedId={compensation}
            onSelect={setCompensation}
            direction={direction}
          />
        </Surface>
      ) : null}

      {/* ─── Summary ─────────────────────────────────────────────────────── */}
      {canSave ? (
        <Surface tone="raised" padding={4} gap={3}>
          <Text role="label" tone="muted">ملخص قبل الحفظ</Text>
          <KeyValueList
            items={[
              { label: 'الاسم', value: courierName },
              { label: 'الجوال', value: courierPhone },
              { label: 'الفروع', value: branchLabel },
              { label: 'الحالة', value: isActive ? 'مفعّل' : 'غير مفعّل' },
              { label: 'سياسة التوصيل', value: selectedPolicyLabel },
              { label: 'مصدر التسعير', value: selectedPricingLabel },
              ...(requiresCompensation
                ? [{ label: 'مستحق الموصل', value: selectedCompensationLabel }]
                : []),
            ]}
          />
          {savedLabel ? (
            <Text role="caption" tone="success">{savedLabel}</Text>
          ) : null}
        </Surface>
      ) : null}

      <MobileStickyPrimaryAction
        label="حفظ إعدادات الموصل"
        helperText={canSave ? 'البيانات كاملة وجاهزة للحفظ.' : 'أدخل اسم الموصل ورقم جواله للمتابعة.'}
        onPress={() => {
          if (!canSave) {
            return;
          }
          setSavedLabel('تم الحفظ محليًا — يحتاج تفعيل backend لاحقًا.');
        }}
      />
    </MobileScrollView>
  );
}
