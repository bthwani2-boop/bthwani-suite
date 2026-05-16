import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, I18nManager, Platform, Pressable, View } from 'react-native';
import {
  Button,
  Box,
  Card,
  Chip,
  colorPalette,
  DateTimePicker,
  Icon,
  MobileScrollView,
  OptionRow,
  PaymentDecisionList,
  safeArea,
  SegmentedControl,
  sizes,
  spacing,
  SummaryCard,
  Surface,
  Text,
  TextField,
  Toast,
  TopBar,
  type PaymentDecisionOption,
} from '@bthwani/ui-kit';
import { DshCartDetails } from '../parts/CartDetails';
import { getDshClientStateMeta, type DshClientState } from '../data/client-state.preview-data';
import { getPartnerOfferItems } from '../../shared/partner-offer.preview-store';
import { isClientVisibleStatus, type CommercialLifecycleStatus } from '../../shared/commercial.preview-contract';
import { getEntitlements } from '../../shared/loyalty.preview-store';
import {
  resolveWltDshFinanceEventKindForPaymentMethod,
  useWltDshWalletPreview,
  type WltDshFinanceEventKind,
} from '../../../../wlt/frontend/app-client/dsh';

const PAGE_BG = colorPalette.pageBackground;
const SURFACE_SOFT = colorPalette.surfaceSecondary;
const BORDER_SOFT = colorPalette.borderSubtle;
const TEXT_PRIMARY = colorPalette.textPrimary;
const TEXT_SECONDARY = colorPalette.textSecondary;
const ACCENT_BLUE = colorPalette.accentBlue;
const ACCENT_ORANGE = colorPalette.accentOrange;
const CTA_PRIMARY = colorPalette.accentOrange;
const SURFACE_WARM = colorPalette.brandSoft;
const SURFACE_WARM_BORDER = colorPalette.brandSurface;
const DANGER = colorPalette.danger;
const DANGER_SOFT = colorPalette.dangerSoft;
const EXPERIMENTAL_PAYMENT_ENABLED = true;

type ScreenNotice = {
  title: string;
  description?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

type QuickActionKey = 'coupon' | 'address' | 'note' | 'extra';

type QuickActionMeta = {
  title: string;
  placeholder: string;
  helper?: string;
  saveLabel: string;
  multiline?: boolean;
  icon?: string;
};

type RecommendationProduct = {
  id: string;
  title: string;
  priceLabel: string;
  priceValue: number;
};

type PaymentMethodKey = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

type PaymentSelection = {
  method: PaymentMethodKey;
  walletAmountHalalas: number;
  amountDueOnDeliveryHalalas: number;
  valid: boolean;
  isExperimental?: boolean;
  summary: string;
  blockingReason?: string;
  feedbackTone: NonNullable<ScreenNotice['tone']>;
};

type CartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  priceValue?: number;
  qty?: number;
  storeId?: string;
  storeName?: string;
};

type CheckoutActionPayload = {
  paymentMethod: PaymentMethodKey;
  walletAmountHalalas: number;
  amountDueOnDeliveryHalalas: number;
  orderTotalHalalas: number;
  summary: string;
  financeEventKind: WltDshFinanceEventKind;
};

export type DshCartUnifiedScreenProps = {
  items?: CartItem[];
  clientState?: DshClientState;
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    ratingLabel?: string;
  };
  activeOrder?: {
    id: string;
    title: string;
    subtitle: string;
    meta: string;
    statusLabel: string;
  };
  statusTitle?: string;
  statusDescription?: string;
  onContinue?: (payload: CheckoutActionPayload) => void | Promise<void>;
  onOpenOrder?: (payload?: CheckoutActionPayload) => void | Promise<void>;
  onOpenStore?: () => void;
  onRetry?: () => void;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
};

const QUICK_ACTION_META: Record<QuickActionKey, QuickActionMeta> = {
  coupon: {
    title: 'إضافة قسيمة',
    placeholder: 'أدخل رمز التخفيض',
    helper: 'سيتم حفظ القسيمة داخل هذه الجلسة فقط حتى يكتمل الربط الخلفي.',
    saveLabel: 'حفظ القسيمة',
    icon: 'pricetag-outline',
  },
  address: {
    title: 'تحديث عنوان التوصيل',
    placeholder: 'اكتب عنوان التوصيل بالتفصيل',
    helper: 'العنوان المحلي سيظهر مباشرة في ملخص الطلب الحالي.',
    saveLabel: 'حفظ العنوان',
    multiline: true,
    icon: 'location-outline',
  },
  note: {
    title: 'ملاحظات الطلب',
    placeholder: 'أضف ملاحظة قصيرة للكابتن أو المتجر',
    helper: 'يمكن ترك الملاحظة فارغة إذا لم تكن هناك تعليمات إضافية.',
    saveLabel: 'حفظ الملاحظة',
    multiline: true,
    icon: 'document-text-outline',
  },
  extra: {
    title: 'طلب إضافي على الطريق',
    placeholder: 'مثال: ماء أو بسبس من أي ماركت على الطريق',
    helper: 'سيظهر الطلب الإضافي داخل نفس الشاشة كإضافة جاهزة للمراجعة.',
    saveLabel: 'حفظ الطلب',
    multiline: true,
    icon: 'add-circle-outline',
  },
};

const RECOMMENDED_PRODUCTS: RecommendationProduct[] = [
  { id: 'r1', title: 'كيس خبز', priceLabel: '100', priceValue: 100 },
  { id: 'r2', title: 'دجاج بروست', priceLabel: '1,500', priceValue: 1500 },
  { id: 'r3', title: 'بطاطس', priceLabel: '250', priceValue: 250 },
];

const PREVIEW_FALLBACK_ITEMS: CartItem[] = [
  { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
  { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
  { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
  { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
];

function formatAmount(value: number) {
  try {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(value);
  } catch {
    return `${value} ر.ي`;
  }
}

function formatHalalasAmount(value: number) {
  return formatAmount(value / 100);
}

function resolveCartItemPriceValue(item: CartItem): number {
  if (typeof item.priceValue === 'number' && Number.isFinite(item.priceValue)) {
    return item.priceValue;
  }

  if (typeof item.priceLabel === 'string' && item.priceLabel.trim()) {
    const normalizedValue = Number(item.priceLabel.replace(/[^\d.]/g, ''));
    if (Number.isFinite(normalizedValue)) {
      return normalizedValue;
    }
  }

  return 0;
}

type ExecutionScheduleOption = {
  value: string;
  label: string;
  fullLabel: string;
};

type ExecutionScheduleOptions = {
  dateOptions: ExecutionScheduleOption[];
  timeOptions: ExecutionScheduleOption[];
};

function padSchedulePart(value: number) {
  return String(value).padStart(2, '0');
}

function createExecutionScheduleOptions(referenceDate = new Date()): ExecutionScheduleOptions {
  const dateChipFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'short', day: 'numeric' });
  const dateSummaryFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeFormatter = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' });

  const dateOptions = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(referenceDate.getDate() + index + 1);

    return {
      value: `${date.getFullYear()}-${padSchedulePart(date.getMonth() + 1)}-${padSchedulePart(date.getDate())}`,
      label: index === 0 ? 'غدًا' : index === 1 ? 'بعد غد' : dateChipFormatter.format(date).replace('،', '').trim(),
      fullLabel: dateSummaryFormatter.format(date),
    };
  });

  const timeOptions = [9, 11, 13, 15, 17, 19].map((hour) => {
    const time = new Date(referenceDate);
    time.setHours(hour, 0, 0, 0);

    return {
      value: `${padSchedulePart(time.getHours())}:${padSchedulePart(time.getMinutes())}`,
      label: timeFormatter.format(time),
      fullLabel: timeFormatter.format(time),
    };
  });

  return { dateOptions, timeOptions };
}

type ExecutionSchedulePickerProps = {
  dateOptions: ExecutionScheduleOption[];
  timeOptions: ExecutionScheduleOption[];
  selectedDate: string;
  selectedTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

function ExecutionSchedulePicker({ selectedDate, selectedTime, onConfirm }: { selectedDate: string, selectedTime: string, onConfirm: (date: Date, time: string) => void }) {
  const [visible, setVisible] = useState(false);

  // Format display labels
  const dateObj = new Date(selectedDate);
  const dateLabel = new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' }).format(dateObj);

  const [h, m] = selectedTime.split(':');
  const timeLabel = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, parseInt(h), parseInt(m)));

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <Surface tone="default" padding={3} gap={2} radiusToken="lg" style={{ backgroundColor: SURFACE_WARM, borderColor: SURFACE_WARM_BORDER, borderStyle: 'dashed', borderWidth: 1.5 }}>
          <Box layoutDirection="row" align="center" gap={3}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colorPalette.white, alignItems: 'center', justifyContent: 'center', shadowColor: colorPalette.black, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
              <Icon name="calendar-outline" size={22} color={ACCENT_ORANGE} />
            </View>
            <Box style={{ flex: 1 }} gap={0.5}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{dateLabel}</Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY }}>الساعة {timeLabel}</Text>
            </Box>
            <Icon name="chevron-forward" size={18} color={colorPalette.textMuted} />
          </Box>
        </Surface>
      </Pressable>

      <DateTimePicker
        visible={visible}
        onClose={() => setVisible(false)}
        initialDate={dateObj}
        initialTime={selectedTime}
        onConfirm={(date, time) => {
          onConfirm(date, time);
          setVisible(false);
        }}
      />
    </>
  );
}

function PromoBanner({ onPress }: { onPress: () => void }) {
  const isRTL = I18nManager.isRTL;

  return (
    <Surface
      tone="default"
      padding={2}
      style={{
        backgroundColor: SURFACE_WARM,
        borderWidth: 1,
        borderColor: SURFACE_WARM_BORDER,
        borderRadius: 16,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        minHeight: 60,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 36 }}>
        <View style={{ width: 96, alignItems: 'center' }}>
          <Button
            label="اشترك الآن"
            size="sm"
            fullWidth={false}
            onPress={onPress}
            style={{ minWidth: 92, minHeight: 36, backgroundColor: ACCENT_BLUE, borderColor: ACCENT_BLUE, borderRadius: 18 }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center', lineHeight: 18 }}>
            اشترك بخدمة بثواني برو للاستفادة من أفضل العروض
          </Text>
        </View>

        <View style={{ width: 24, alignItems: 'center' }}>
          <Icon name="ribbon-outline" size={14} color={ACCENT_ORANGE} />
        </View>
      </View>
    </Surface>
  );
}

type RecommendationCardProps = {
  title: string;
  price: string;
  onPress: () => void;
};

function RecommendationCard({ title, price, onPress }: RecommendationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`أضف ${title} إلى السلة`}
      onPress={onPress}
      style={({ pressed }) => [{ width: 132, borderRadius: 18, overflow: 'hidden', backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT, opacity: pressed ? 0.92 : 1 }]}
    >
      <View style={{ height: 96, backgroundColor: SURFACE_SOFT, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colorPalette.white, shadowColor: colorPalette.black, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colorPalette.brandSoft }} />
        </View>

        <View style={{ position: 'absolute', bottom: 6, left: 6, borderRadius: 8, backgroundColor: ACCENT_ORANGE, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text role="bodySm" style={{ color: colorPalette.white, fontWeight: '700' }}>
            {price}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: spacing[1], gap: spacing[0] }}>
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
          {title}
        </Text>
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'center' }}>
          أضفه مباشرة إلى السلة
        </Text>
      </View>
    </Pressable>
  );
}

function RecommendedSection({ onShowAll, onAddProduct }: { onShowAll: () => void; onAddProduct: (product: RecommendationProduct) => void }) {
  const isRTL = I18nManager.isRTL;

  return (
    <View style={{ gap: spacing[1] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[1] }}>
        <Button label="عرض الكل" tone="ghost" size="sm" fullWidth={false} onPress={onShowAll} />
        <Text role="bodyMd" style={{ color: TEXT_PRIMARY, fontWeight: '600' }}>
          قد تعجبك هذه المنتجات أيضاً
        </Text>
      </View>

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing[1], overflow: 'hidden', paddingHorizontal: spacing[1] }}>
        {RECOMMENDED_PRODUCTS.map((product) => (
          <RecommendationCard key={product.id} title={product.title} price={product.priceLabel} onPress={() => onAddProduct(product)} />
        ))}
      </View>
    </View>
  );
}

type ItemsTableProps = {
  items: CartItem[];
  onOpenDetails: () => void;
};

function ItemsTable({ items, onOpenDetails }: ItemsTableProps) {
  return (
    <Card
      title="مراجعة السلة قبل التنفيذ"
      subtitle={`عناصر: ${items.length}`}
      padding={2}
      gap={1}
      footer={(
        <Button
          label="مراجعة التفاصيل"
          tone="secondary"
          size="sm"
          fullWidth={false}
          disabled={items.length === 0}
          onPress={onOpenDetails}
        />
      )}
    >
      {items.length === 0 ? (
        <Surface tone="default" padding={2} gap={1} style={{ backgroundColor: SURFACE_SOFT, borderColor: BORDER_SOFT }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
            السلة فارغة الآن
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'center' }}>
            أضف منتجات من المتجر أو من المقترحات حتى يظهر ملخص الطلب هنا.
          </Text>
        </Surface>
      ) : (
      <View style={{ borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 16, overflow: 'hidden', backgroundColor: colorPalette.surfacePrimary }}>
        <View style={{ flexDirection: 'row-reverse', backgroundColor: SURFACE_SOFT, borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0] }}>
          <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'right' }}>المنتج</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>السعر</Text>
          </View>
          <View style={{ flex: 1, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>الكمية</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>الإجمالي</Text>
          </View>
        </View>

        {items.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0] }}>
            <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>{item.title}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>{formatAmount(resolveCartItemPriceValue(item))}</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: spacing[1], alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY }}>{item.qty ?? 1}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>{formatAmount(resolveCartItemPriceValue(item) * (item.qty ?? 1))}</Text>
            </View>
          </View>
        ))}
      </View>
      )}
    </Card>
  );
}

type InlineActionEditorProps = {
  meta: QuickActionMeta;
  value: string;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitDisabled?: boolean;
};

function InlineActionEditor({ meta, value, onChangeValue, onSubmit, onClose, submitDisabled = false }: InlineActionEditorProps) {
  return (
    <Surface
      tone="default"
      padding={2}
      gap={1}
      style={{
        backgroundColor: colorPalette.surfacePrimary,
        borderWidth: 1,
        borderColor: colorPalette.borderStrong,
        borderRadius: 14,
      }}
    >
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
        {meta.icon ? <Icon name={meta.icon} size={15} color={ACCENT_ORANGE} /> : null}
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right', flex: 1 }}>
          {meta.title}
        </Text>
      </View>

      <TextField
        value={value}
        onChangeText={onChangeValue}
        placeholder={meta.placeholder}
        multiline={meta.multiline}
        style={meta.multiline ? { minHeight: 88, textAlignVertical: 'top' } : undefined}
      />

      {meta.helper ? (
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
          {meta.helper}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
        <Button
          label={meta.saveLabel}
          fullWidth={false}
          disabled={submitDisabled}
          onPress={onSubmit}
          style={{ flex: 1, backgroundColor: ACCENT_ORANGE, borderColor: ACCENT_ORANGE }}
        />
        <Button
          label="إلغاء"
          tone="secondary"
          fullWidth={false}
          onPress={onClose}
          style={{ flex: 1 }}
        />
      </View>
    </Surface>
  );
}

export default function DshCartUnifiedScreen(props: DshCartUnifiedScreenProps) {
  const [items, setItems] = useState<CartItem[]>(
    props.items !== undefined ? props.items : PREVIEW_FALLBACK_ITEMS,
  );

  useEffect(() => {
    if (props.items !== undefined) {
      setItems(props.items);
    }
  }, [props.items]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [pickupAddr, setPickupAddr] = useState('جوار الجبل الجديد');
  const [note, setNote] = useState('لا يوجد ملاحظة');
  const [extraRequest, setExtraRequest] = useState('');
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');
  const executionScheduleOptions = useMemo(() => createExecutionScheduleOptions(), []);
  const [scheduledDate, setScheduledDate] = useState(() => executionScheduleOptions.dateOptions[0]?.value ?? '');
  const [scheduledTime, setScheduledTime] = useState(() => executionScheduleOptions.timeOptions[0]?.value ?? '');
  const [quickActionKey, setQuickActionKey] = useState<QuickActionKey | null>(null);
  const [quickActionDraft, setQuickActionDraft] = useState('');
  const [notice, setNotice] = useState<ScreenNotice | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cartDetailsVisible, setCartDetailsVisible] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const {
    linked: walletLinked,
    balance: walletBalanceRaw,
    hydrated: walletHydrated,
    refreshing: walletRefreshing,
    refresh: refreshWallet,
    requestPayment: requestWalletPayment,
    link: linkWallet,
    topUp: topUpWallet,
  } = useWltDshWalletPreview();

  const checkoutAction = props.onContinue ?? props.onOpenOrder;
  const isRTL = I18nManager.isRTL;
  const quickActionMeta = quickActionKey ? QUICK_ACTION_META[quickActionKey] : null;
  const hasWltServiceRoute = typeof props.onOpenService === 'function';
  const clientState = useMemo<DshClientState>(
    () => props.clientState ?? (items.length > 0 ? 'cart_ready' : 'cart_empty'),
    [items.length, props.clientState],
  );
  const isOrderSubmitted = clientState === 'order_created' || clientState === 'order_confirmed';
  const canEditOrder = !isOrderSubmitted && Boolean(props.onOpenStore ?? props.onOpenOrder ?? props.onContinue);
  const clientStateMeta = useMemo(() => getDshClientStateMeta(clientState), [clientState]);
  const paymentPendingMeta = useMemo(() => getDshClientStateMeta('payment_pending'), []);
  const walletCreditMeta = useMemo(() => getDshClientStateMeta('wallet_credit_visible'), []);

  const subtotalHalalas = useMemo(
    () => items.reduce((acc, item) => acc + Math.round(resolveCartItemPriceValue(item) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const subtotalAmount = subtotalHalalas / 100;
  const deliveryAmount = 950;
  const grandTotalAmount = subtotalAmount + deliveryAmount;
  const grandTotalHalalas = subtotalHalalas + Math.round(deliveryAmount * 100);
  const walletBalance = walletBalanceRaw ?? 0;
  const walletShortfallHalalas = Math.max(grandTotalHalalas - walletBalance, 0);
  const canUseWalletFull = walletLinked && walletBalance >= grandTotalHalalas;
  const canUseMixedPayment = walletLinked && walletBalance > 0 && walletBalance < grandTotalHalalas;
  const formattedSubtotal = formatAmount(subtotalAmount);
  const formattedDelivery = formatAmount(deliveryAmount);
  const formattedGrandTotal = formatAmount(grandTotalAmount);
  const formattedWalletBalance = formatAmount(walletBalance / 100);
  const formattedWalletShortfall = formatHalalasAmount(walletShortfallHalalas);
  const canCheckout = items.length > 0;
  const androidSystemBottomInset = Platform.OS === 'android'
    ? Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height)
    : safeArea.comfortable;
  const footerSafePadding = androidSystemBottomInset + spacing[2];
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : sizes.controlMd + footerSafePadding + spacing[4];
  const actionBarBottomPadding = resolvedFooterHeight + spacing[2];

  const updateItemQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const showNotice = (title: string, description?: string, tone: ScreenNotice['tone'] = 'info') => {
    setNotice({ title, description, tone });
  };

  const dismissNotice = () => {
    setNotice(null);
  };

  const openWltService = (mode: 'wallet-topup' | 'official-wallets') => {
    if (hasWltServiceRoute) {
      props.onOpenService?.('wlt');
      return;
    }

    showNotice(
      mode === 'official-wallets' ? 'مسار المحافظ الرسمية غير موصول بعد' : 'مسار شحن المحفظة غير موصول بعد',
      mode === 'official-wallets'
        ? 'لا يوجد مسار مثبت داخل المضيف الحالي لفتح المحافظ الرسمية عبر WLT.'
        : 'لا يوجد مسار مثبت داخل المضيف الحالي لفتح شحن المحفظة عبر WLT.',
      'info',
    );
  };

  const linkWalletInline = async () => {
    try {
      const result = await linkWallet();
      if (!result.success) {
        showNotice('تعذر ربط المحفظة', 'لم يكتمل الربط، حاول مرة أخرى.', 'danger');
        return;
      }

      await refreshWallet();
      showNotice('تم ربط المحفظة', 'أصبح خيار الدفع من الرصيد متاحًا عند كفاية الرصيد.', 'success');
    } catch {
      showNotice('تعذر ربط المحفظة', 'حدث خطأ أثناء الربط المحلي للمحفظة.', 'danger');
    }
  };

  const topUpWalletInline = async (amountHalalas: number) => {
    try {
      const normalizedAmount = Math.max(amountHalalas, 0);
      if (!normalizedAmount) {
        showNotice('لا يوجد مبلغ مطلوب للشحن', 'الرصيد الحالي يغطي الطلب أو لا توجد بيانات كافية.', 'info');
        return;
      }

      await topUpWallet(normalizedAmount);
      await refreshWallet();
      showNotice('تم شحن الرصيد', `تم شحن ${formatHalalasAmount(normalizedAmount)} في المحفظة.`, 'success');
    } catch {
      showNotice('تعذر شحن الرصيد', 'حدث خطأ أثناء تحديث رصيد المحفظة.', 'danger');
    }
  };

  const paymentSelection = useMemo<PaymentSelection>(() => {
    if (paymentMethod === 'wallet') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'wallet',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال مزامنة حالة الربط والرصيد ثم أعد المحاولة.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'wallet',
            walletAmountHalalas: grandTotalHalalas,
            amountDueOnDeliveryHalalas: 0,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
          blockingReason: hasWltServiceRoute ? 'اربط المحفظة أو اشحنها عبر WLT أولًا ثم أعد الاختيار.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance < grandTotalHalalas) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'wallet',
            walletAmountHalalas: walletBalance,
            amountDueOnDeliveryHalalas: grandTotalHalalas - walletBalance,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي جزئي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountHalalas: walletBalance,
          amountDueOnDeliveryHalalas: grandTotalHalalas - walletBalance,
          valid: false,
          summary: 'الرصيد الحالي أقل من إجمالي الطلب.',
          blockingReason: `تحتاج شحن ${formattedWalletShortfall} قبل اعتماد هذا الخيار.`,
          feedbackTone: 'info',
        };
      }

      return {
        method: 'wallet',
        walletAmountHalalas: grandTotalHalalas,
        amountDueOnDeliveryHalalas: 0,
        valid: true,
        summary: 'الرصيد يكفي، سيتم الدفع كاملًا من المحفظة.',
        feedbackTone: 'success',
      };
    }

    if (paymentMethod === 'mixed') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'mixed',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال المزامنة قبل تفعيل الدفع المدمج.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked || walletBalance <= 0) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'mixed',
            walletAmountHalalas: 0,
            amountDueOnDeliveryHalalas: grandTotalHalalas,
            valid: true,
            isExperimental: true,
            summary: 'دفع مدمج تجريبي — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'mixed',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'الدفع المدمج يحتاج رصيدًا فعليًا في WLT.',
          blockingReason: 'لا يوجد رصيد لاستخدام الدفع المدمج الآن.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance >= grandTotalHalalas) {
        return {
          method: 'mixed',
          walletAmountHalalas: grandTotalHalalas,
          amountDueOnDeliveryHalalas: 0,
          valid: false,
          summary: 'الرصيد يكفي للدفع الكامل من المحفظة.',
          blockingReason: 'الرصيد يكفي للدفع الكامل من المحفظة، لذلك الدفع المدمج غير ضروري.',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'mixed',
        walletAmountHalalas: walletBalance,
        amountDueOnDeliveryHalalas: grandTotalHalalas - walletBalance,
        valid: true,
        summary: `سيُخصم ${formattedWalletBalance} من المحفظة ويُدفع ${formatHalalasAmount(grandTotalHalalas - walletBalance)} عند الاستلام.`,
        feedbackTone: 'info',
      };
    }

    if (paymentMethod === 'official-wallets') {
      if (!hasWltServiceRoute && EXPERIMENTAL_PAYMENT_ENABLED) {
        return {
          method: 'official-wallets',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: 0,
          valid: true,
          isExperimental: true,
          summary: 'دفع تجريبي عبر محافظ رسمية — سيُسجَّل محليًا فقط',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'official-wallets',
        walletAmountHalalas: 0,
        amountDueOnDeliveryHalalas: 0,
        valid: false,
        summary: hasWltServiceRoute
          ? 'سيتم تحويلك إلى WLT لاختيار محفظة رسمية وإكمال الدفع أو الشحن خارج هذه الشاشة.'
          : 'مسار المحافظ الرسمية غير موصول بعد داخل المضيف الحالي.',
        blockingReason: hasWltServiceRoute
          ? 'أكمل الدفع أو الشحن عبر WLT أولًا ثم عد لإتمام الطلب.'
          : 'مسار المحافظ الرسمية غير موصول بعد داخل المضيف الحالي.',
        feedbackTone: 'info',
      };
    }

    return {
      method: 'cod',
      walletAmountHalalas: 0,
      amountDueOnDeliveryHalalas: grandTotalHalalas,
      valid: true,
      summary: 'ستدفع كامل المبلغ عند الاستلام.',
      feedbackTone: 'info',
    };
  }, [formattedWalletBalance, formattedWalletShortfall, grandTotalHalalas, hasWltServiceRoute, paymentMethod, walletBalance, walletHydrated, walletLinked, walletRefreshing]);

  React.useEffect(() => {
    if (EXPERIMENTAL_PAYMENT_ENABLED) return;

    if (paymentMethod === 'wallet' && !canUseWalletFull) {
      setPaymentMethod(canUseMixedPayment ? 'mixed' : 'cod');
    }

    if (paymentMethod === 'mixed' && !canUseMixedPayment) {
      setPaymentMethod(canUseWalletFull ? 'wallet' : 'cod');
    }
  }, [canUseMixedPayment, canUseWalletFull, paymentMethod]);

  const paymentDecisionOptions = useMemo<PaymentDecisionOption[]>(() => {
    const walletPending = !walletHydrated || walletRefreshing;

    return [
      {
        id: 'cod',
        title: 'عند الاستلام',
        description: 'ادفع كامل الطلب عند الاستلام.',
        selected: paymentMethod === 'cod',
        statusLabel: paymentMethod === 'cod' ? 'محدد' : 'جاهز الآن',
        statusTone: paymentMethod === 'cod' ? 'brand' : 'info',
        amountRows: [
          { label: 'من المحفظة', value: formatHalalasAmount(0), tone: 'muted' },
          { label: 'عند الاستلام', value: formatHalalasAmount(grandTotalHalalas), tone: 'brand' },
        ],
        helperText: paymentMethod === 'cod' ? 'لا يستخدم رصيد المحفظة.' : undefined,
        helperTone: 'info',
        onSelect: () => setPaymentMethod('cod'),
      },
      {
        id: 'wallet',
        title: 'من رصيد المحفظة',
        description: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
        selected: paymentMethod === 'wallet',
        disabled: walletPending || (!canUseWalletFull && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'wallet' ? 'محدد' : walletPending ? 'قيد التحقق' : canUseWalletFull ? 'جاهز الآن' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : !walletLinked ? 'يتطلب إجراء' : walletBalance <= 0 ? 'يتطلب إجراء' : 'يتطلب إجراء',
        statusTone: paymentMethod === 'wallet' ? 'brand' : walletPending ? 'info' : canUseWalletFull ? 'success' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'warning',
        amountRows: canUseWalletFull
          ? [
              { label: 'من المحفظة', value: formatHalalasAmount(grandTotalHalalas), tone: 'brand' },
              { label: 'عند الاستلام', value: formatHalalasAmount(0), tone: 'muted' },
            ]
          : walletLinked
            ? [
                { label: 'الرصيد الحالي', value: formattedWalletBalance, tone: 'brand' },
                { label: 'المطلوب شحنه', value: formattedWalletShortfall, tone: 'muted' },
              ]
            : [
                { label: 'إجمالي الطلب', value: formattedGrandTotal, tone: 'brand' },
                { label: 'حالة المحفظة', value: 'غير مرتبطة', tone: 'muted' },
              ],
        helperText: canUseWalletFull
          ? 'الرصيد يكفي للدفع الكامل.'
          : walletPending
            ? 'جاري التحقق من حالة الربط والرصيد...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'اربط محفظتك أولًا عبر WLT.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.')
            : walletBalance <= 0
              ? 'لا يوجد رصيد متاح الآن.'
              : `المتبقي للشحن ${formattedWalletShortfall}.`,
        helperTone: canUseWalletFull ? 'success' : 'info',
        action: canUseWalletFull
          ? undefined
          : {
              label: walletLinked ? 'شحن الرصيد' : 'ربط المحفظة',
              tone: 'primary',
              onPress: walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallHalalas))
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline()),
              disabled: walletPending,
            },
        onSelect: (canUseWalletFull || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('wallet') : undefined,
      },
      {
        id: 'mixed',
        title: 'محفظة + عند الاستلام',
        description: 'استخدم الرصيد المتاح وادفع المتبقي عند الاستلام.',
        selected: paymentMethod === 'mixed',
        disabled: walletPending || (!canUseMixedPayment && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'mixed' ? 'محدد' : walletPending ? 'قيد التحقق' : canUseMixedPayment ? 'جاهز الآن' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : !walletLinked ? 'يتطلب إجراء' : walletBalance <= 0 ? 'يتطلب إجراء' : 'غير ضروري',
        statusTone: walletPending ? 'info' : canUseMixedPayment ? (paymentMethod === 'mixed' ? 'brand' : 'info') : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'info',
        amountRows: canUseMixedPayment
          ? [
              { label: 'من المحفظة', value: formattedWalletBalance, tone: 'brand' },
              { label: 'عند الاستلام', value: formatHalalasAmount(grandTotalHalalas - walletBalance), tone: 'brand' },
            ]
          : [
              { label: 'من المحفظة', value: walletLinked ? formattedWalletBalance : formatHalalasAmount(0), tone: 'muted' },
              { label: 'عند الاستلام', value: formattedGrandTotal, tone: 'brand' },
            ],
        helperText: canUseMixedPayment
          ? `من المحفظة ${formattedWalletBalance}، وعند الاستلام ${formatHalalasAmount(grandTotalHalalas - walletBalance)}.`
          : walletPending
            ? 'جاري التحقق من رصيد المحفظة...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'افتح WLT لربط المحفظة.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.')
            : walletBalance <= 0
              ? 'لا يوجد رصيد للدفع المدمج.'
              : 'الرصيد يكفي للدفع الكامل من المحفظة.',
        helperTone: 'info',
        action: canUseMixedPayment || walletBalance >= grandTotalHalalas
          ? undefined
          : {
              label: !walletLinked ? 'فتح WLT' : 'شحن الرصيد',
              tone: 'secondary',
              onPress: !walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline())
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallHalalas)),
              disabled: walletPending,
            },
        onSelect: (canUseMixedPayment || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('mixed') : undefined,
      },
      {
        id: 'official-wallets',
        title: 'الدفع عبر المحافظ الرسمية',
        description: 'اختر محفظة رسمية وأكمل عبر WLT.',
        selected: paymentMethod === 'official-wallets',
        disabled: !hasWltServiceRoute && !EXPERIMENTAL_PAYMENT_ENABLED,
        statusLabel: paymentMethod === 'official-wallets' ? 'محدد' : hasWltServiceRoute ? 'مسار خارجي' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : 'غير موصول',
        statusTone: paymentMethod === 'official-wallets' ? 'brand' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : 'info',
        amountRows: [
          { label: 'إجمالي الطلب', value: formattedGrandTotal, tone: 'brand' },
        ],
        helperText: hasWltServiceRoute
          ? 'خيار مستقل عن رصيد المحفظة الداخلي.'
          : 'هذا الخيار يحتاج ربط مسار المحافظ الرسمية داخل المضيف الحالي.',
        helperTone: 'info',
        action: {
          label: hasWltServiceRoute ? (walletLinked ? 'اختيار محفظة رسمية' : 'فتح WLT') : 'المسار غير موصول',
          tone: 'secondary',
          onPress: hasWltServiceRoute ? () => openWltService('official-wallets') : undefined,
          disabled: !hasWltServiceRoute,
        },
        onSelect: (hasWltServiceRoute || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('official-wallets') : undefined,
      },
    ];
  }, [canUseMixedPayment, canUseWalletFull, formattedGrandTotal, formattedWalletBalance, formattedWalletShortfall, grandTotalHalalas, hasWltServiceRoute, paymentMethod, topUpWalletInline, walletBalance, walletHydrated, walletLinked, walletRefreshing, walletShortfallHalalas]);

  const handleCheckoutPress = async () => {
    if (isOrderSubmitted) {
      showNotice('الطلب قيد التنفيذ', 'تم إرسال الطلب بالفعل. التعديل يتم عبر فريق العمليات فقط.', 'info');
      return;
    }

    if (!canCheckout) {
      showNotice(clientStateMeta.label, clientStateMeta.description, 'info');
      return;
    }

    if (!checkoutAction) {
      showNotice('تنفيذ الطلب محجوب', 'زر التنفيذ جاهز UI لكن المسار التالي غير موصول في هذا العرض.', 'info');
      return;
    }

    if (!paymentSelection.valid) {
      const blockedStateMeta = paymentSelection.method === 'official-wallets' ? walletCreditMeta : paymentPendingMeta;
      showNotice(blockedStateMeta.label, paymentSelection.blockingReason ?? blockedStateMeta.description, paymentSelection.feedbackTone);
      return;
    }

    if (paymentSelection.isExperimental) {
      showNotice('تم تسجيل الدفع التجريبي', paymentSelection.summary, 'success');
      await Promise.resolve(checkoutAction({
        paymentMethod: paymentSelection.method,
        walletAmountHalalas: paymentSelection.walletAmountHalalas,
        amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
        orderTotalHalalas: grandTotalHalalas,
        summary: paymentSelection.summary,
        financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
      }));
      return;
    }

    if (paymentSelection.method === 'wallet') {
      setCheckoutLoading(true);
      try {
        const paymentResult = await requestWalletPayment(paymentSelection.walletAmountHalalas);
        await refreshWallet();
        if (!paymentResult.success) {
          showNotice('تعذر خصم مبلغ المحفظة', paymentResult.error === 'insufficient_balance' ? 'الرصيد لم يعد كافيًا بعد آخر تحديث.' : 'حدث خطأ أثناء تهيئة الدفع من المحفظة.', 'danger');
          return;
        }

        await Promise.resolve(checkoutAction({
          paymentMethod: paymentSelection.method,
          walletAmountHalalas: paymentSelection.walletAmountHalalas,
          amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
          orderTotalHalalas: grandTotalHalalas,
          summary: paymentSelection.summary,
          financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
        }));
        return;
      } finally {
        setCheckoutLoading(false);
      }
    }

    await Promise.resolve(checkoutAction({
      paymentMethod: paymentSelection.method,
      walletAmountHalalas: paymentSelection.walletAmountHalalas,
      amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
      orderTotalHalalas: grandTotalHalalas,
      summary: paymentSelection.summary,
      financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
    }));
  };

  const handleEditPress = () => {
    if (!canEditOrder) {
      showNotice('تعديل الطلب غير متاح الآن', 'زر التعديل يحتاج مسار رجوع أو تحرير موصول داخل المضيف.', 'info');
      return;
    }

    if (props.onOpenStore) {
      props.onOpenStore();
      return;
    }

    const editPayload: CheckoutActionPayload = {
      paymentMethod: paymentSelection.method,
      walletAmountHalalas: paymentSelection.walletAmountHalalas,
      amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
      orderTotalHalalas: grandTotalHalalas,
      summary: paymentSelection.summary,
      financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
    };

    if (props.onOpenOrder) {
      props.onOpenOrder(editPayload);
      return;
    }

    props.onContinue?.(editPayload);
  };

  const openQuickAction = (actionKey: QuickActionKey) => {
    if (quickActionKey === actionKey) {
      setQuickActionKey(null);
      setQuickActionDraft('');
      return;
    }

    const initialValue = {
      coupon: couponCode,
      address: pickupAddr,
      note: note === 'لا يوجد ملاحظة' ? '' : note,
      extra: extraRequest,
    }[actionKey];

    setQuickActionKey(actionKey);
    setQuickActionDraft(initialValue);
  };

  const applyQuickAction = () => {
    if (!quickActionKey) {
      return;
    }

    const trimmedValue = quickActionDraft.trim();

    if (quickActionKey === 'coupon') {
      if (trimmedValue) {
        const activeCouponOffers = getPartnerOfferItems().filter(
          o => o.offerType === 'coupon' && isClientVisibleStatus(o.status as CommercialLifecycleStatus),
        );
        const entitlements = getEntitlements();
        const hasCouponEntitlement = entitlements.some(
          e => isClientVisibleStatus(e.status as CommercialLifecycleStatus),
        );
        if (activeCouponOffers.length === 0 && !hasCouponEntitlement) {
          showNotice('لا توجد قسائم نشطة', 'لا يوجد عرض قسيمة نشط حالياً لهذا المتجر.', 'warning');
          return;
        }
      }
      setCouponCode(trimmedValue);
      showNotice(
        trimmedValue ? 'تم حفظ القسيمة' : 'أزلت القسيمة المحلية',
        trimmedValue ? `القسيمة الحالية: ${trimmedValue}` : 'لن يتم إرسال أي قسيمة مع الطلب الحالي.',
        'success',
      );
    }

    if (quickActionKey === 'address') {
      setPickupAddr(trimmedValue || 'العنوان غير محدد بعد');
      showNotice('تم تحديث العنوان', trimmedValue || 'تم حفظ العنوان كحالة غير محددة حتى يتم إدخاله لاحقًا.', 'success');
    }

    if (quickActionKey === 'note') {
      const nextNote = trimmedValue || 'لا يوجد ملاحظة';
      setNote(nextNote);
      showNotice('تم تحديث الملاحظة', nextNote, 'success');
    }

    if (quickActionKey === 'extra') {
      setExtraRequest(trimmedValue);
      showNotice(
        trimmedValue ? 'تم حفظ الطلب الإضافي' : 'لا يوجد طلب إضافي محفوظ',
        trimmedValue || 'يمكنك إضافة طلب إضافي لاحقًا عند الحاجة.',
        'success',
      );
    }

    setQuickActionKey(null);
    setQuickActionDraft('');
  };

  const handleAddRecommendedProduct = (product: RecommendationProduct) => {
    setItems((previousItems) => {
      const matchedItem = previousItems.find((item) => item.title === product.title);
      if (matchedItem) {
        return previousItems.map((item) => (item.title === product.title ? { ...item, qty: (item.qty ?? 1) + 1 } : item));
      }

      return [...previousItems, { id: `recommended-${product.id}`, title: product.title, priceValue: product.priceValue, qty: 1 }];
    });

    showNotice('أضيف المنتج إلى السلة', `${product.title} أصبح ضمن الطلب الحالي.`, 'success');
  };

  const handleShowAllRecommendations = () => {
    showNotice('يعرض هذا النموذج 3 اقتراحات فقط', 'سيظهر كامل عرض التوصيات بعد ربط كتالوج المتجر داخل نفس الرحلة.', 'info');
  };

  const handleSubscribePress = () => {
    showNotice('الاشتراك جاهز UI فقط', 'زر الاشتراك واضح وفعال، لكن تفعيل الميزة يحتاج ربطًا لاحقًا خارج هذا النطاق.', 'info');
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <TopBar
        variant="secondary"
        title="تأكيد الطلب"
        titleSlot={(
          <Text style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: '900', lineHeight: 20, maxWidth: '100%', flexShrink: 1, minWidth: 0, textAlign: 'center' }} numberOfLines={1}>
            تأكيد الطلب
          </Text>
        )}
        actions={[
          {
            id: 'clear-cart',
            icon: (
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: DANGER_SOFT, borderWidth: 1, borderColor: DANGER_SOFT, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="trash-outline" size={18} color={DANGER} />
              </View>
            ),
            accessibilityLabel: 'تفريغ السلة',
            disabled: !items.length,
            onPress: () => {
              setItems([]);
              showNotice('تم تفريغ السلة', 'يمكنك الرجوع للمتجر أو إضافة عنصر من المقترحات أدناه.', 'success');
            },
          },
        ]}
      />

      <MobileScrollView fill padding={1} gap={1} contentContainerStyle={{ paddingBottom: spacing[2] }}>
        <PromoBanner onPress={handleSubscribePress} />

        <Surface tone="default" gap={0} style={{ backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 16, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right', flex: 1 }}>الخيارات السريعة</Text>
            <Text role="caption" style={{ color: TEXT_SECONDARY }}>القسيمة والعنوان والملاحظات</Text>
          </View>
          <OptionRow
            title="هل لديك قسيمة تخفيض؟"
            subtitle={couponCode ? `القسيمة الحالية: ${couponCode}` : 'أدخل رمز التخفيض إن وجد'}
            actionLabel={couponCode ? 'تعديل' : 'إضافة'}
            onAction={() => openQuickAction('coupon')}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'coupon' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                submitDisabled={quickActionDraft.trim().length === 0}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
          <OptionRow
            title="عنوان التوصيل"
            subtitle={pickupAddr}
            actionLabel="تغيير"
            onAction={() => openQuickAction('address')}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'address' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
          <OptionRow
            title="ملاحظات الطلب"
            subtitle={note}
            actionLabel={note === 'لا يوجد ملاحظة' ? 'إضافة' : 'تعديل'}
            onAction={() => openQuickAction('note')}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'note' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
          <OptionRow
            title="طلب إضافي على الطريق"
            subtitle={extraRequest || 'مثال: بسبس أو ماء من أي ماركت على طريق الكابتن'}
            actionLabel={extraRequest ? 'تعديل' : 'إضافة'}
            onAction={() => openQuickAction('extra')}
            style={{ paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'extra' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
        </Surface>

        <Card title="وقت التنفيذ" subtitle="اختر وقت تنفيذ الطلب" padding={2} gap={1}>
          <View style={{ gap: spacing[1] }}>
            <SegmentedControl
              options={[
                { value: 'now', label: 'الآن' },
                { value: 'later', label: 'في وقت لاحق' },
              ]}
              value={scheduling}
              onValueChange={(nextValue) => {
                setScheduling(nextValue);
                if (nextValue === 'later') {
                  setScheduledDate((current) => current || (executionScheduleOptions.dateOptions[0]?.value ?? ''));
                  setScheduledTime((current) => current || (executionScheduleOptions.timeOptions[0]?.value ?? ''));
                }
              }}
              size="sm"
              style={{ backgroundColor: SURFACE_SOFT, borderColor: BORDER_SOFT, padding: spacing[0] }}
            />
            {scheduling === 'now' ? (
              <Text role="caption" style={{ color: TEXT_SECONDARY }}>
                سيتم تنفيذ الطلب مباشرة بعد اعتماد السلة.
              </Text>
            ) : (
              <ExecutionSchedulePicker
                selectedDate={scheduledDate}
                selectedTime={scheduledTime}
                onConfirm={(date, time) => {
                  const val = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  setScheduledDate(val);
                  setScheduledTime(time);
                }}
              />
            )}
          </View>
        </Card>

        <View style={{ gap: spacing[2] }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', flex: 1, textAlign: 'right' }}>قرار الدفع</Text>
            {EXPERIMENTAL_PAYMENT_ENABLED ? (
              <View style={{ backgroundColor: colorPalette.warningSoft, borderRadius: 8, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
                <Text role="caption" style={{ color: colorPalette.warning, fontWeight: '700' }}>تجريبي</Text>
              </View>
            ) : null}
          </View>
          <PaymentDecisionList items={paymentDecisionOptions} />
        </View>

        <RecommendedSection onShowAll={handleShowAllRecommendations} onAddProduct={handleAddRecommendedProduct} />

        <SummaryCard
          padding={2}
          gap={1}
          items={[
            { label: 'حالة السلة', value: clientStateMeta.label },
            { label: 'الإجمالي', value: formattedSubtotal },
            { label: 'التوصيل', value: formattedDelivery },
          ]}
          totalLabel="الإجمالي الكلي"
          totalValue={formattedGrandTotal}
        />
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
          {clientStateMeta.description}
        </Text>

        <ItemsTable items={items} onOpenDetails={() => setCartDetailsVisible(true)} />
        <View style={{ height: actionBarBottomPadding }} />
      </MobileScrollView>

      <View
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingHorizontal: spacing[3],
          paddingTop: spacing[2],
          paddingBottom: footerSafePadding,
          backgroundColor: colorPalette.surfacePrimary,
          borderTopWidth: 1,
          borderColor: BORDER_SOFT,
          zIndex: 5,
          elevation: 12,
          shadowColor: colorPalette.black,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        {!canCheckout ? (
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], paddingBottom: spacing[1] }}>
            <Icon name="cart-outline" size={13} color={TEXT_SECONDARY} />
            <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right', flex: 1 }}>
              {clientStateMeta.label}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing[2] }}>
          <Button
            label={isOrderSubmitted ? 'الطلب قيد التنفيذ' : 'تنفيذ الطلب'}
            size="md"
            fullWidth={false}
            disabled={isOrderSubmitted || !canCheckout || checkoutLoading}
            loading={checkoutLoading}
            onPress={handleCheckoutPress}
            style={{ flex: 2, minHeight: 52, backgroundColor: isOrderSubmitted ? CTA_PRIMARY : CTA_PRIMARY, borderColor: CTA_PRIMARY, borderRadius: 18, opacity: isOrderSubmitted ? 0.6 : 1 }}
          />
          <Button
            label={isOrderSubmitted ? 'طلب تعديل عبر العمليات' : 'تعديل'}
            tone="secondary"
            size="md"
            fullWidth={false}
            disabled={!canEditOrder}
            onPress={isOrderSubmitted ? undefined : handleEditPress}
            style={{ flex: 1, minHeight: 52, borderRadius: 18 }}
          />
        </View>
      </View>

      <Toast
        visible={Boolean(notice)}
        title={notice?.title ?? ''}
        description={notice?.description}
        tone={notice?.tone ?? 'info'}
        onDismiss={dismissNotice}
      />

      <DshCartDetails
        visible={cartDetailsVisible}
        onClose={() => setCartDetailsVisible(false)}
        currency="YER"
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          subtotal: resolveCartItemPriceValue(item) * (item.qty ?? 1),
          qty: item.qty ?? 1,
          price: resolveCartItemPriceValue(item),
        }))}
        onChangeQty={updateItemQty}
        onRemove={removeItem}
        onCheckout={() => {
          setCartDetailsVisible(false);
          handleCheckoutPress();
        }}
      />
    </View>
  );
}

export { DshCartUnifiedScreen, DshCartUnifiedScreen as DshCartGetScreen };
