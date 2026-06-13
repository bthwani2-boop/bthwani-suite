import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import {
  Button,
  Box,
  Card,
  colorPalette,
  Divider,
  withAlpha,
  DateTimePicker,
  Icon,
  MobileScrollView,
  OptionRow,
  PaymentDecisionList,
  safeArea,
  SegmentedControl,
  SheetFrame,
  sizes,
  spacing,
  SummaryCard,
  Surface,
  Text,
  TextField,
  Toast,
  TopBar,
  useDirection,
  shadowPresets,
  type PaymentDecisionOption,
  radius,
  typographyRoles,
} from '@bthwani/ui-kit';
import { DshCartDetails } from '../parts/CartDetails';
import { formatDshPrice, formatDshPriceMinorUnits } from '../../shared/dsh-price-format';
import { getDshClientStateMeta, type DshClientState } from '../../shared/client-state';
// getPartnerOfferItems removed — offers come from API, not fixtures.
import { isClientVisibleStatus, type CommercialLifecycleStatus } from '../../shared/commercial-contract';
// getEntitlements removed — subscriptions/entitlements come from API, not fixtures.
import {
  resolveWltDshFinanceEventKindForPaymentMethod,
  useWltDshWalletSession,
  type WltDshFinanceEventKind,
} from '../../../../wlt/frontend/dsh/app-client';
import { resolveDshRuntimeImageSource } from '../shared/resolve-runtime-image-source';
import {
  type DshClientCreateOrderRequest,
  type DshFulfillmentDeliveryMode,
  getDshFulfillmentDeliveryModeMeta,
  getDshClientFlowPolicy,
} from '../contracts/dsh-client-binding.contracts';
// SSoT: COD availability per delivery mode — bthwani_delivery only.
import { isCodAllowedForMode } from '../dsh-client-wlt-payment-bridge';
import { getDshFlowPolicySummary, resolveDshOnDemandPolicyLabel } from '../../shared/dsh-flow-registry';
import { resolveDshControlPanelSectionLabel } from '../../shared';
import type { DshCheckoutClient } from '../../shared/dsh-checkout-client';

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
const EXPERIMENTAL_PAYMENT_ENABLED = false;

type ScreenNotice = {
  title: string;
  description?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  actionLabel?: string;
  onActionPress?: () => void;
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

// Cart fixtures removed — recommended products and fallback items come from API, not fixtures.
import type { RecommendationProduct, CartItem } from '../../shared/dsh-order.contract';

type PaymentMethodKey = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

type PaymentSelection = {
  method: PaymentMethodKey;
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  valid: boolean;
  isExperimental?: boolean;
  summary: string;
  blockingReason?: string;
  feedbackTone: NonNullable<ScreenNotice['tone']>;
};



type CheckoutOrderDraft = Pick<
  DshClientCreateOrderRequest,
  'fulfillmentMode' | 'pickupAddress' | 'dropoffAddress' | 'note'
>;

type CheckoutActionPayload = {
  paymentMethod: PaymentMethodKey;
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  orderTotalMinorUnits: number;
  summary: string;
  financeEventKind: WltDshFinanceEventKind;
  fulfillmentMode: DshFulfillmentDeliveryMode;
  orderDraft: CheckoutOrderDraft;
  wltPaymentRefId?: string;
};

export type DshCartUnifiedScreenProps = {
  items?: CartItem[];
  clientState?: DshClientState;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
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
  reorderAlertMessage?: string;
  /** J-003A: live checkout client for GET /cart/serviceability. When absent, preflight skips API check. */
  checkoutClient?: DshCheckoutClient;
  clientId?: string;
  bearerToken?: string;
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
    title: 'موقع التوصيل',
    placeholder: 'اكتب العنوان أو حدده من الخريطة لاحقًا',
    helper: 'سيتم لاحقًا دعم تحديد الموقع بدبوس عبر Google Maps.',
    saveLabel: 'حفظ الموقع',
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
    title: 'على طريقي',
    placeholder: 'مثال: ماء، بسبس، مناديل...',
    helper: 'أضف شيئًا بسيطًا من طريق الكابتن.',
    saveLabel: 'حفظ',
    multiline: true,
    icon: 'add-circle-outline',
  },
};

const FULFILLMENT_MODE_ORDER = ['bthwani_delivery', 'partner_delivery', 'pickup'] as const;

function getDeliveryModeSelectionSummary(mode: DshFulfillmentDeliveryMode) {
  switch (mode) {
    case 'partner_delivery':
      return 'تم اختيار توصيل المتجر';
    case 'pickup':
      return 'تم اختيار الاستلام من المتجر';
    case 'bthwani_delivery':
    default:
      return 'تم اختيار توصيل بثواني';
  }
}

function getDeliveryModePickerDescription(mode: DshFulfillmentDeliveryMode) {
  switch (mode) {
    case 'partner_delivery':
      return 'التوصيل يتم عبر موصل المتجر إلى موقع العميل.';
    case 'pickup':
      return 'تستلم الطلب من المتجر بنفسك بدون رسوم توصيل.';
    case 'bthwani_delivery':
    default:
      return 'التوصيل يتم عبر كابتن بثواني إلى موقع العميل.';
  }
}



function toEnglishDigits(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
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

function normalizeRecommendationMatchKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findCartItemForProduct(items: CartItem[], product: RecommendationProduct) {
  const normalizedProductTitle = normalizeRecommendationMatchKey(product.title);

  return items.find((item) => (
    item.id === product.id
    || normalizeRecommendationMatchKey(item.title) === normalizedProductTitle
  ));
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
  const dateChipFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'short', day: 'numeric', numberingSystem: 'latn' });
  const dateSummaryFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long', numberingSystem: 'latn' });
  const timeFormatter = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' });

  const dateOptions = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(referenceDate.getDate() + index + 1);

    return {
      value: `${date.getFullYear()}-${padSchedulePart(date.getMonth() + 1)}-${padSchedulePart(date.getDate())}`,
      label: index === 0 ? 'غدًا' : index === 1 ? 'بعد غد' : toEnglishDigits(dateChipFormatter.format(date)).replace('،', '').trim(),
      fullLabel: toEnglishDigits(dateSummaryFormatter.format(date)),
    };
  });

  const timeOptions = [9, 11, 13, 15, 17, 19].map((hour) => {
    const time = new Date(referenceDate);
    time.setHours(hour, 0, 0, 0);

    return {
      value: `${padSchedulePart(time.getHours())}:${padSchedulePart(time.getMinutes())}`,
      label: toEnglishDigits(timeFormatter.format(time)),
      fullLabel: toEnglishDigits(timeFormatter.format(time)),
    };
  });

  return { dateOptions, timeOptions };
}


function ExecutionSchedulePicker({ selectedDate, selectedTime, onConfirm }: { selectedDate: string, selectedTime: string, onConfirm: (date: Date, time: string) => void }) {
  const [visible, setVisible] = useState(false);

  // Format display labels
  const dateObj = new Date(selectedDate);
  const dateLabel = toEnglishDigits(new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long', numberingSystem: 'latn' }).format(dateObj));

  const [h, m] = selectedTime.split(':');
  const timeLabel = toEnglishDigits(new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' }).format(new Date(2026, 0, 1, parseInt(h), parseInt(m))));

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <Surface tone="default" padding={3} gap={2} radiusToken="lg" style={{ backgroundColor: SURFACE_WARM, borderColor: SURFACE_WARM_BORDER, borderStyle: 'dashed', borderWidth: 1.5 }}>
          <Box layoutDirection="row" align="center" gap={3}>
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colorPalette.white, alignItems: 'center', justifyContent: 'center', ...shadowPresets.raised }}>
              <Icon name="calendar-outline" size={22} color={ACCENT_ORANGE} />
            </View>
            <Box style={{ flex: 1 }} gap={1}>
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
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  return (
    <Surface
      tone="default"
      padding={2}
      style={{
        backgroundColor: colorPalette.warningSoft,
        borderWidth: 1,
        borderColor: colorPalette.warning,
        borderRadius: radius.md2,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        minHeight: 60 }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 36 }}>
        <View style={{ width: 96, alignItems: 'center' }}>
          <Button
            label="اشترك الآن"
            size="sm"
            fullWidth={false}
            onPress={onPress}
            style={{ minWidth: 92, minHeight: 36, backgroundColor: ACCENT_ORANGE, borderColor: ACCENT_ORANGE, borderRadius: radius.lg }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
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
  product: RecommendationProduct;
  cartQty: number;
  onOpenProductPreview: () => void;
};

function RecommendationCard({ product, cartQty, onOpenProductPreview }: RecommendationCardProps) {
  const imageSource = resolveDshRuntimeImageSource(product.imageUri);

  return (
    <Pressable onPress={onOpenProductPreview} style={({ pressed }) => ({ opacity: pressed ? 0.94 : 1 })}>
      <Surface
        tone="default"
        style={{
          width: 140,
          borderRadius: radius.md2,
          borderWidth: 1,
          borderColor: BORDER_SOFT,
          backgroundColor: colorPalette.surfacePrimary,
          padding: spacing[2],
          gap: spacing[2],
          position: 'relative',
          justifyContent: 'space-between' }}
      >
        {cartQty > 0 && (
          <View style={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: ACCENT_ORANGE,
            borderRadius: radius.xs2,
            paddingHorizontal: 6,
            paddingVertical: 2,
            zIndex: 2 }}>
            <Text role="caption" weight="bold" style={{ color: colorPalette.white, fontSize: 10 }}>
              {`مضاف (${cartQty})`}
            </Text>
          </View>
        )}

        <View style={{ height: 80, backgroundColor: SURFACE_SOFT, borderRadius: radius.sm2, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {imageSource ? (
            <Image source={imageSource} style={{ width: 64, height: 64, borderRadius: 32 }} resizeMode="cover" />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: radius.xl, backgroundColor: colorPalette.brandSoft }} />
          )}
          <View style={{ position: 'absolute', bottom: 4, left: 4, borderRadius: radius.xs, backgroundColor: withAlpha(colorPalette.brandStrong, 0.75), paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text role="caption" weight="bold" style={{ color: colorPalette.white, fontSize: 10 }}>
              {product.priceLabel}
            </Text>
          </View>
        </View>

        <View style={{ gap: 2 }}>
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center', fontSize: typographyRoles.label.fontSize }} numberOfLines={1}>
            {product.title}
          </Text>
        </View>

        <Button
          label="عرض المنتج"
          tone="secondary"
          size="sm"
          fullWidth
          onPress={onOpenProductPreview}
          style={{ minHeight: 32, borderRadius: radius.sm }}
        />
      </Surface>
    </Pressable>
  );
}

type RecommendedSectionProps = {
  items: CartItem[];
  onOpenProductPreview: (product: RecommendationProduct) => void;
  onOpenStore?: () => void;
};

function RecommendedSection({
  items,
  onOpenProductPreview,
  onOpenStore,
}: RecommendedSectionProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  // Display a subset of products in horizontal view
  const horizontalProducts: RecommendationProduct[] = [];

  return (
    <View style={{ gap: spacing[2] }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[1], gap: spacing[1] }}>
        <View style={{ flex: 1, gap: 2, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text role="bodyMd" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
            قد تعجبك هذه المنتجات أيضاً
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
            المعاينة هنا فقط، والإضافة من داخل البطاقة المفتوحة.
          </Text>
        </View>
        {onOpenStore && (
          <Button
            label="إضافة منتجات أخرى"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={onOpenStore}
            style={{ borderRadius: radius.sm, minHeight: 32, paddingHorizontal: spacing[2] }}
          />
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: spacing[2],
          paddingHorizontal: spacing[1],
          paddingBottom: spacing[1] }}
      >
        {horizontalProducts.map((product) => {
          const cartItem = items.find((it) => it.title === product.title);
          const cartQty = cartItem ? (cartItem.qty ?? 0) : 0;
          return (
            <RecommendationCard
              key={product.id}
              product={product}
              cartQty={cartQty}
              onOpenProductPreview={() => onOpenProductPreview(product)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

type PreviewFeedback = {
  message: string;
  tone: 'info' | 'success';
};

type ProductPreviewModalProps = {
  visible: boolean;
  product: RecommendationProduct | null;
  cartQty: number;
  feedback: PreviewFeedback | null;
  bottomInset: number;
  onClose: () => void;
  onPrimaryAction: () => void;
};

function ProductPreviewModal({
  visible,
  product,
  cartQty,
  feedback,
  bottomInset,
  onClose,
  onPrimaryAction,
}: ProductPreviewModalProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const imageSource = product ? resolveDshRuntimeImageSource(product.imageUri) : undefined;
  const priceLabel = product ? formatDshPrice(product.priceValue) : '';
  const hasCartQty = cartQty > 0;
  const actionLabel = hasCartQty ? 'زيادة الكمية' : 'إضافة للسلة';
  const sheetBottomInset = Math.max(bottomInset, safeArea.comfortable) + spacing[2];
  const sheetTopInset = safeArea.comfortable + spacing[2];

  if (!visible || !product) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: spacing[2],
          paddingTop: sheetTopInset,
          paddingBottom: sheetBottomInset,
          backgroundColor: withAlpha(colorPalette.brandStrong, 0.48) }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="إغلاق معاينة المنتج"
          onPress={onClose}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: withAlpha(colorPalette.brandStrong, 0.36) }}
        />

        <Surface
          tone="default"
          style={{
            zIndex: 1,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: BORDER_SOFT,
            backgroundColor: colorPalette.surfacePrimary,
            overflow: 'hidden',
            maxHeight: '90%',
            ...shadowPresets.floating }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: spacing[3],
              gap: spacing[3],
              paddingBottom: spacing[4] }}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
              <View style={{ flex: 1, gap: spacing[1] }}>
                <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                  معاينة المنتج
                </Text>
                <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
                  الفتح هنا فقط، والإضافة من زر داخل البطاقة
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إغلاق المعاينة"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: radius.sm2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: BORDER_SOFT,
                  backgroundColor: colorPalette.surfaceSecondary,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Icon name="close" size={18} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: radius.lg2, overflow: 'hidden', borderWidth: 1, borderColor: BORDER_SOFT }}>
              <View style={{ height: 240, position: 'relative', backgroundColor: colorPalette.surfaceSecondary }}>
                {imageSource ? (
                  <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colorPalette.brandSoft }}>
                    <Icon name="cart-outline" size={44} color={ACCENT_BLUE} />
                  </View>
                )}

                <View style={{ position: 'absolute', top: spacing[2], right: spacing[2], flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: radius.pill, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: colorPalette.white, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                  <Icon name="cart-outline" size={14} color={ACCENT_ORANGE} />
                  <Text role="caption" weight="bold" style={{ color: TEXT_PRIMARY }}>
                    {hasCartQty ? `موجود في السلة · ${cartQty}` : 'غير موجود في السلة'}
                  </Text>
                </View>
              </View>

              <View style={{ gap: spacing[2], padding: spacing[3] }}>
                <View style={{ gap: spacing[1] }}>
                  <Text role="titleSm" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <Text role="titleMd" style={{ color: ACCENT_BLUE, textAlign: isRTL ? 'right' : 'left' }}>
                    {priceLabel}
                  </Text>
                </View>

                {product.description ? (
                  <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
                    {product.description}
                  </Text>
                ) : null}

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[2], borderRadius: radius.md, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: hasCartQty ? colorPalette.successSoft : colorPalette.surfaceSecondary, paddingHorizontal: spacing[2], paddingVertical: spacing[2] }}>
                  <Text role="bodySm" weight="bold" style={{ flex: 1, color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                    {hasCartQty ? 'موجود في السلة' : 'غير موجود في السلة'}
                  </Text>
                  <Text role="bodySm" weight="bold" style={{ color: hasCartQty ? colorPalette.success : TEXT_SECONDARY }}>
                    {hasCartQty ? `× ${cartQty}` : '0'}
                  </Text>
                </View>

                {feedback ? (
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: radius.md, borderWidth: 1, borderColor: feedback.tone === 'success' ? colorPalette.success : BORDER_SOFT, backgroundColor: feedback.tone === 'success' ? colorPalette.successSoft : colorPalette.brandSoft, paddingHorizontal: spacing[2], paddingVertical: spacing[2] }}>
                    <Icon name={feedback.tone === 'success' ? 'checkmark-circle-outline' : 'information-circle-outline'} size={14} color={feedback.tone === 'success' ? colorPalette.success : ACCENT_BLUE} />
                    <Text role="caption" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                      {feedback.message}
                    </Text>
                  </View>
                ) : null}

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing[2] }}>
                  <Button
                    label={actionLabel}
                    tone="brand"
                    fullWidth={false}
                    onPress={onPrimaryAction}
                    style={{ flex: 1, minHeight: 48, borderRadius: radius.md2, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY }}
                  />
                  <Button
                    label="إغلاق"
                    tone="secondary"
                    fullWidth={false}
                    onPress={onClose}
                    style={{ flex: 1, minHeight: 48, borderRadius: radius.md2 }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Surface>
      </View>
    </Modal>
  );
}

type CartItemRowProps = {
  item: CartItem;
  index?: number;
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
};

function CartItemRow({ item, index, onChangeQty, onRemove }: CartItemRowProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const price = resolveCartItemPriceValue(item);
  const subtotal = price * (item.qty ?? 1);

  const displayIndex = index !== undefined ? `${index + 1}- ` : '';

  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colorPalette.surfacePrimary,
        borderWidth: 1,
        borderColor: BORDER_SOFT,
        borderRadius: radius.md2,
        padding: spacing[3],
        gap: spacing[2] }}
    >
      {/* Product Name & Unit Price */}
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: spacing[1], paddingLeft: isRTL ? 0 : spacing[1], paddingRight: isRTL ? spacing[1] : 0 }}>
        <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
          {displayIndex}{item.title}
        </Text>
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
          سعر الوحدة: {formatDshPrice(price)}
        </Text>
      </View>

      {/* Controls and Subtotal */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[3] }}>
        {/* Quantity controls: - / Qty / + */}
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: SURFACE_SOFT,
          borderRadius: radius.sm2,
          padding: 2,
          gap: spacing[1]
        }}>
          <Button
            label="-"
            tone="ghost"
            size="sm"
            fullWidth={false}
            disabled={!onChangeQty}
            onPress={() => {
              if (onChangeQty) {
                onChangeQty(item.id, (item.qty ?? 1) - 1);
              }
            }}
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: radius.xs2 }}
          />
          <Text role="bodyStrong" style={{ minWidth: 20, textAlign: 'center', color: TEXT_PRIMARY }}>
            {item.qty ?? 1}
          </Text>
          <Button
            label="+"
            tone="brand"
            size="sm"
            fullWidth={false}
            disabled={!onChangeQty}
            onPress={() => {
              if (onChangeQty) {
                onChangeQty(item.id, (item.qty ?? 1) + 1);
              }
            }}
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: radius.xs2 }}
          />
        </View>

        {/* Subtotal */}
        <Text role="bodyStrong" style={{ color: ACCENT_BLUE, minWidth: 64, textAlign: isRTL ? 'left' : 'right' }}>
          {formatDshPrice(subtotal)}
        </Text>

        {/* Delete button */}
        {onRemove && (
          <Pressable
            onPress={() => onRemove(item.id)}
            style={({ pressed }) => [{
              padding: spacing[2],
              borderRadius: radius.sm,
              backgroundColor: DANGER_SOFT,
              minWidth: 32,
              minHeight: 32,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Icon name="trash-outline" size={16} color={DANGER} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

type CartItemEditorProps = {
  items: CartItem[];
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onClearCart?: () => void;
  onScrollToRecommendations?: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  couponCode?: string;
};

function CartItemEditor({
  items,
  onChangeQty,
  onRemove,
  onClearCart,
  onScrollToRecommendations,
  subtotal,
  deliveryFee,
  discount,
  grandTotal,
  couponCode,
}: CartItemEditorProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  return (
    <Card padding={3} gap={2}>
      {/* Header Row */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingBottom: spacing[1] }}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
          <Icon name="cart-outline" size={18} color={TEXT_PRIMARY} />
          <Text role="bodyStrong" weight="black" style={{ color: TEXT_PRIMARY, fontSize: 16 }}>
            مراجعة السلة
          </Text>
          {items.length > 0 && (
            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: radius.xs2, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
              <Text role="caption" weight="bold" style={{ color: TEXT_PRIMARY }}>
                {items.length} عناصر
              </Text>
            </View>
          )}
        </View>

        {items.length > 0 && onClearCart && (
          <Pressable onPress={onClearCart} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingVertical: spacing[1], paddingHorizontal: spacing[2] }]}>
            <Text role="bodyStrong" style={{ color: DANGER, fontSize: typographyRoles.bodySm.fontSize }}>
              حذف الكل
            </Text>
          </Pressable>
        )}
      </View>

      {/* Cart Items List or Empty View */}
      {items.length === 0 ? (
        <Surface
          tone="default"
          padding={4}
          gap={2}
          radiusToken="md"
          style={{
            backgroundColor: SURFACE_SOFT,
            borderColor: BORDER_SOFT,
            borderStyle: 'dashed',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center' }}
        >
          <Icon name="basket-outline" size={32} color={colorPalette.textMuted} />
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
            السلة فارغة الآن
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'center', maxWidth: '80%' }}>
            أضف منتجات من المقترحات أدناه للبدء في تجهيز طلبك.
          </Text>
          {onScrollToRecommendations && (
            <Button
              label="إضافة منتجات"
              tone="brand"
              size="sm"
              fullWidth={false}
              onPress={onScrollToRecommendations}
              style={{ marginTop: spacing[1], borderRadius: radius.sm2 }}
            />
          )}
        </Surface>
      ) : (
        <>
          <View style={{ gap: spacing[2] }}>
            {items.map((item, index) => (
              <CartItemRow
                key={item.id}
                item={item}
                index={index}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
              />
            ))}
          </View>

          {/* Divider */}
          <Divider style={{ marginVertical: spacing[1] }} />

          {/* Integrated Live Pricing Summary */}
          <View style={{ gap: spacing[2], paddingHorizontal: spacing[1] }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>إجمالي المنتجات</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatDshPrice(subtotal)}</Text>
            </View>

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>سعر التوصيل</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatDshPrice(deliveryFee)}</Text>
            </View>

            {discount > 0 && (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="bodySm" style={{ color: colorPalette.success, textAlign: isRTL ? 'right' : 'left' }}>الخصم (قسيمة: {couponCode})</Text>
                <Text role="bodyStrong" style={{ color: colorPalette.success }}>-{formatDshPrice(discount)}</Text>
              </View>
            )}

            {/* Grand Total Divider */}
            <Divider style={{ marginVertical: spacing[1] }} />

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodyStrong" weight="black" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>الإجمالي النهائي</Text>
              <Text role="titleMd" weight="black" style={{ color: ACCENT_BLUE }}>{formatDshPrice(grandTotal)}</Text>
            </View>
          </View>
        </>
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
        borderRadius: radius.md }}
    >
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
        {meta.icon ? <Icon name={meta.icon} size={15} color={ACCENT_ORANGE} /> : null}
        <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: 'right', flex: 1 }}>
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
  const checkoutFlowPolicy = getDshClientFlowPolicy('client-cart-checkout');
  const checkoutFlowSummary = getDshFlowPolicySummary('client-cart-checkout');
  const [items, setItems] = useState<CartItem[]>(
    props.items !== undefined ? props.items : [],
  );

  useEffect(() => {
    if (props.items !== undefined) {
      setItems(props.items);
    }
  }, [props.items]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [selectedFulfillmentMode, setSelectedFulfillmentMode] = useState<DshFulfillmentDeliveryMode>(
    () => props.fulfillmentMode ?? 'bthwani_delivery',
  );
  const fulfillmentModeMeta = getDshFulfillmentDeliveryModeMeta(selectedFulfillmentMode);
  // SSoT: COD is only available for bthwani_delivery — gated by dsh-client-wlt-payment-bridge.
  const codAllowedForMode = isCodAllowedForMode(selectedFulfillmentMode);
  // pickup carries no delivery fee; partner_delivery and bthwani_delivery carry a preview fee (PREVIEW_ONLY — real fee from WLT).
  const deliveryAmount = selectedFulfillmentMode === 'pickup' ? 0 : 950;
  const [clientAddress, setClientAddress] = useState('جوار الجبل الجديد');
  const [note, setNote] = useState('لا يوجد ملاحظة');
  const [extraRequest, setExtraRequest] = useState('');
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');
  const executionScheduleOptions = useMemo(() => createExecutionScheduleOptions(), []);
  const [scheduledDate, setScheduledDate] = useState(() => executionScheduleOptions.dateOptions[0]?.value ?? '');
  const [scheduledTime, setScheduledTime] = useState(() => executionScheduleOptions.timeOptions[0]?.value ?? '');
  const [deliveryModePickerOpen, setDeliveryModePickerOpen] = useState(false);
  const [quickActionKey, setQuickActionKey] = useState<QuickActionKey | null>(null);
  const [quickActionDraft, setQuickActionDraft] = useState('');
  const [notice, setNotice] = useState<ScreenNotice | null>(null);
  const [previewProduct, setPreviewProduct] = useState<RecommendationProduct | null>(null);
  const [previewFeedback, setPreviewFeedback] = useState<PreviewFeedback | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutReviewVisible, setCheckoutReviewVisible] = useState(false);
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
  } = useWltDshWalletSession(props.clientId, props.bearerToken);

  const checkoutAction = props.onContinue ?? props.onOpenOrder;
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const isPickupMode = selectedFulfillmentMode === 'pickup';
  const storePickupLocationLabel = useMemo(() => {
    const storeSubtitle = props.store?.subtitle?.trim();
    if (storeSubtitle) {
      return storeSubtitle;
    }

    const storeName = props.store?.name?.trim();
    if (storeName) {
      return storeName;
    }

    return 'موقع المتجر غير محدد';
  }, [props.store?.name, props.store?.subtitle]);
  const hasStorePickupLocation = storePickupLocationLabel !== 'موقع المتجر غير محدد';
  const locationTitle = isPickupMode ? 'موقع الاستلام' : 'موقع التوصيل';
  const locationSubtitle = isPickupMode ? storePickupLocationLabel : clientAddress;
  const deliveryModeSelectionSummary = getDeliveryModeSelectionSummary(selectedFulfillmentMode);
  const deliveryNotice = selectedFulfillmentMode === 'pickup'
    ? 'لا توجد رسوم توصيل عند الاستلام بنفسك.'
    : selectedFulfillmentMode === 'partner_delivery'
      ? 'قد يحدد المتجر رسوم التوصيل النهائية بعد اعتماد الطلب.'
      : 'قد تتغير رسوم التوصيل بعد اعتماد الموقع.';
  const quickActionMeta = useMemo(() => {
    if (!quickActionKey) {
      return null;
    }

    if (quickActionKey !== 'address') {
      return QUICK_ACTION_META[quickActionKey];
    }

    return {
      ...QUICK_ACTION_META.address,
      title: locationTitle,
    };
  }, [locationTitle, quickActionKey]);
  const fulfillmentModeOptions = useMemo(
    () => FULFILLMENT_MODE_ORDER.map((mode) => ({
      value: mode,
      label: getDshFulfillmentDeliveryModeMeta(mode).label,
      icon: getDshFulfillmentDeliveryModeMeta(mode).icon,
      summary: getDeliveryModeSelectionSummary(mode),
      description: getDeliveryModePickerDescription(mode),
    })),
    [],
  );
  const hasWltServiceRoute = typeof props.onOpenService === 'function';
  const totalItemsCount = useMemo(
    () => items.reduce((acc, item) => acc + (item.qty ?? 1), 0),
    [items],
  );
  const clientState = useMemo<DshClientState>(
    () => props.clientState ?? (totalItemsCount > 0 ? 'cart_ready' : 'cart_empty'),
    [props.clientState, totalItemsCount],
  );
  const isOrderSubmitted = clientState === 'order_created' || clientState === 'order_confirmed';
  const canEditOrder = !isOrderSubmitted && Boolean(props.onOpenStore ?? props.onOpenOrder ?? props.onContinue);
  const clientStateMeta = useMemo(() => getDshClientStateMeta(clientState), [clientState]);
  const paymentPendingMeta = useMemo(() => getDshClientStateMeta('payment_pending'), []);
  const walletCreditMeta = useMemo(() => getDshClientStateMeta('wallet_credit_visible'), []);

  const subtotalMinorUnits = useMemo(
    () => items.reduce((acc, item) => acc + Math.round(resolveCartItemPriceValue(item) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const subtotalAmount = subtotalMinorUnits / 100;
  const couponDiscount = couponCode ? 500 : 0;
  const grandTotalAmount = Math.max(subtotalAmount + deliveryAmount - couponDiscount, 0);
  const grandTotalMinorUnits = Math.max(subtotalMinorUnits + Math.round(deliveryAmount * 100) - Math.round(couponDiscount * 100), 0);
  const walletBalance = walletBalanceRaw ?? 0;
  const walletShortfallMinorUnits = Math.max(grandTotalMinorUnits - walletBalance, 0);
  const canUseWalletFull = walletLinked && walletBalance >= grandTotalMinorUnits;
  const canUseMixedPayment = walletLinked && walletBalance > 0 && walletBalance < grandTotalMinorUnits;
  const formattedSubtotal = formatDshPrice(subtotalAmount);
  const formattedDelivery = formatDshPrice(deliveryAmount);
  const formattedDiscount = couponDiscount > 0 ? `-${formatDshPrice(couponDiscount)}` : undefined;
  const formattedGrandTotal = formatDshPrice(grandTotalAmount);
  const formattedWalletBalance = formatDshPrice(walletBalance / 100);
  const formattedWalletShortfall = formatDshPriceMinorUnits(walletShortfallMinorUnits);
  const canCheckout = totalItemsCount > 0;
  const androidSystemBottomInset = Platform.OS === 'android'
    ? Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height)
    : safeArea.comfortable;
  const footerSafePadding = androidSystemBottomInset + spacing[2];
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : 140;
  const actionBarBottomPadding = resolvedFooterHeight + spacing[2];
  const activePreviewCartItem = useMemo(
    () => (previewProduct ? findCartItemForProduct(items, previewProduct) : undefined),
    [items, previewProduct],
  );
  const activeCartQty = activePreviewCartItem?.qty ?? 0;

  useEffect(() => {
    const nextMode = props.fulfillmentMode ?? 'bthwani_delivery';
    setSelectedFulfillmentMode((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
  }, [props.fulfillmentMode]);

  const updateItemQty = (id: string, qty: number) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    if (qty <= 0) {
      const index = items.findIndex((item) => item.id === id);
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);

      showNotice(
        `تم حذف "${targetItem.title}" من السلة`,
        undefined,
        'warning',
        'تراجع',
        () => {
          const restored = [...updated];
          restored.splice(index, 0, targetItem);
          setItems(restored);
          showNotice(`تمت استعادة "${targetItem.title}"`, undefined, 'success');
        }
      );
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    const index = items.findIndex((item) => item.id === id);
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    showNotice(
      `تم حذف "${targetItem.title}" من السلة`,
      undefined,
      'warning',
      'تراجع',
      () => {
        const restored = [...updated];
        restored.splice(index, 0, targetItem);
        setItems(restored);
        showNotice(`تمت استعادة "${targetItem.title}"`, undefined, 'success');
      }
    );
  };

  const showNotice = (
    title: string,
    description?: string,
    tone: ScreenNotice['tone'] = 'info',
    actionLabel?: string,
    onActionPress?: () => void,
  ) => {
    setNotice({ title, description, tone, actionLabel, onActionPress });
  };

  const dismissNotice = () => {
    setNotice(null);
  };

  const closeQuickAction = () => {
    setQuickActionKey(null);
    setQuickActionDraft('');
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

  // PREVIEW_ONLY: in-memory simulation — no real ledger write
  const topUpWalletInline = async (amountMinorUnits: number) => {
    try {
      const normalizedAmount = Math.max(amountMinorUnits, 0);
      if (!normalizedAmount) {
        showNotice('لا يوجد مبلغ مطلوب للشحن', 'الرصيد الحالي يغطي الطلب أو لا توجد بيانات كافية.', 'info');
        return;
      }

      await topUpWallet(normalizedAmount);
      await refreshWallet();
      showNotice('تم شحن الرصيد', `تم شحن ${formatDshPriceMinorUnits(normalizedAmount)} في المحفظة.`, 'success');
    } catch {
      showNotice('تعذر شحن الرصيد', 'حدث خطأ أثناء تحديث رصيد المحفظة.', 'danger');
    }
  };

  const paymentSelection = useMemo<PaymentSelection>(() => {
    if (paymentMethod === 'wallet') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'wallet',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
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
            walletAmountMinorUnits: grandTotalMinorUnits,
            amountDueOnDeliveryMinorUnits: 0,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
          blockingReason: hasWltServiceRoute ? 'اربط المحفظة أو اشحنها عبر WLT أولًا ثم أعد الاختيار.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance < grandTotalMinorUnits) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'wallet',
            walletAmountMinorUnits: walletBalance,
            amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي جزئي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: walletBalance,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
          valid: false,
          summary: 'الرصيد الحالي أقل من إجمالي الطلب.',
          blockingReason: `تحتاج شحن ${formattedWalletShortfall} قبل اعتماد هذا الخيار.`,
          feedbackTone: 'info',
        };
      }

      return {
        method: 'wallet',
        walletAmountMinorUnits: grandTotalMinorUnits,
        amountDueOnDeliveryMinorUnits: 0,
        valid: true,
        summary: 'الرصيد يكفي، سيتم الدفع كاملًا من المحفظة.',
        feedbackTone: 'success',
      };
    }

    if (paymentMethod === 'mixed') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'mixed',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
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
            walletAmountMinorUnits: 0,
            amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
            valid: true,
            isExperimental: true,
            summary: 'دفع مدمج تجريبي — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'mixed',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'الدفع المدمج يحتاج رصيدًا فعليًا في WLT.',
          blockingReason: 'لا يوجد رصيد لاستخدام الدفع المدمج الآن.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance >= grandTotalMinorUnits) {
        return {
          method: 'mixed',
          walletAmountMinorUnits: grandTotalMinorUnits,
          amountDueOnDeliveryMinorUnits: 0,
          valid: false,
          summary: 'الرصيد يكفي للدفع الكامل من المحفظة.',
          blockingReason: 'الرصيد يكفي للدفع الكامل من المحفظة، لذلك الدفع المدمج غير ضروري.',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'mixed',
        walletAmountMinorUnits: walletBalance,
        amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
        valid: true,
        summary: `سيُخصم ${formattedWalletBalance} من المحفظة ويُدفع ${formatDshPriceMinorUnits(grandTotalMinorUnits - walletBalance)} عند الاستلام.`,
        feedbackTone: 'info',
      };
    }

    if (paymentMethod === 'official-wallets') {
      if (!hasWltServiceRoute && EXPERIMENTAL_PAYMENT_ENABLED) {
        return {
          method: 'official-wallets',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: 0,
          valid: true,
          isExperimental: true,
          summary: 'دفع تجريبي عبر محافظ رسمية — سيُسجَّل محليًا فقط',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'official-wallets',
        walletAmountMinorUnits: 0,
        amountDueOnDeliveryMinorUnits: 0,
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
      walletAmountMinorUnits: 0,
      amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
      valid: true,
      summary: 'ستدفع كامل المبلغ عند الاستلام.',
      feedbackTone: 'info',
    };
  }, [codAllowedForMode, formattedWalletBalance, formattedWalletShortfall, grandTotalMinorUnits, hasWltServiceRoute, paymentMethod, walletBalance, walletHydrated, walletLinked, walletRefreshing]);

  React.useEffect(() => {
    if (EXPERIMENTAL_PAYMENT_ENABLED) return;

    // SSoT: fall back to wallet when COD is not available for this mode.
    const fallbackMethod = codAllowedForMode ? 'cod' : 'wallet';

    if (paymentMethod === 'wallet' && !canUseWalletFull) {
      setPaymentMethod(canUseMixedPayment ? 'mixed' : fallbackMethod);
    }

    if (paymentMethod === 'mixed' && !canUseMixedPayment) {
      setPaymentMethod(canUseWalletFull ? 'wallet' : fallbackMethod);
    }

    // If currently on COD but mode doesn't support it, switch to wallet.
    if (paymentMethod === 'cod' && !codAllowedForMode) {
      setPaymentMethod('wallet');
    }
  }, [canUseMixedPayment, canUseWalletFull, codAllowedForMode, paymentMethod]);

  useEffect(() => {
    if (quickActionKey === 'extra' && selectedFulfillmentMode !== 'bthwani_delivery') {
      closeQuickAction();
      return;
    }

    if (quickActionKey === 'address' && selectedFulfillmentMode === 'pickup') {
      closeQuickAction();
    }
  }, [quickActionKey, selectedFulfillmentMode]);

  const paymentDecisionOptions = useMemo<PaymentDecisionOption[]>(() => {
    const walletPending = !walletHydrated || walletRefreshing;

    return [
      // SSoT: COD only available for bthwani_delivery — gated by codAllowedForMode.
      ...(codAllowedForMode ? [{
        id: 'cod',
        title: 'عند الاستلام',
        description: 'ادفع كامل الطلب عند الاستلام.',
        selected: paymentMethod === 'cod',
        statusLabel: paymentMethod === 'cod' ? 'محدد' : 'جاهز الآن',
        statusTone: paymentMethod === 'cod' ? 'brand' : 'info',
        amountRows: [
          { label: 'من المحفظة', value: formatDshPriceMinorUnits(0), tone: 'muted' },
          { label: 'عند الاستلام', value: formatDshPriceMinorUnits(grandTotalMinorUnits), tone: 'brand' },
        ],
        helperText: paymentMethod === 'cod' ? 'لا يستخدم رصيد المحفظة.' : undefined,
        helperTone: 'info' as const,
        onSelect: () => setPaymentMethod('cod'),
      } satisfies PaymentDecisionOption] : []),
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
              { label: 'من المحفظة', value: formatDshPriceMinorUnits(grandTotalMinorUnits), tone: 'brand' },
              { label: 'عند الاستلام', value: formatDshPriceMinorUnits(0), tone: 'muted' },
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
              tone: 'warning',
              onPress: walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallMinorUnits))
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
              { label: 'عند الاستلام', value: formatDshPriceMinorUnits(grandTotalMinorUnits - walletBalance), tone: 'brand' },
            ]
          : [
              { label: 'من المحفظة', value: walletLinked ? formattedWalletBalance : formatDshPriceMinorUnits(0), tone: 'muted' },
              { label: 'عند الاستلام', value: formattedGrandTotal, tone: 'brand' },
            ],
        helperText: canUseMixedPayment
          ? `من المحفظة ${formattedWalletBalance}، وعند الاستلام ${formatDshPriceMinorUnits(grandTotalMinorUnits - walletBalance)}.`
          : walletPending
            ? 'جاري التحقق من رصيد المحفظة...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'افتح WLT لربط المحفظة.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.')
            : walletBalance <= 0
              ? 'لا يوجد رصيد للدفع المدمج.'
              : 'الرصيد يكفي للدفع الكامل من المحفظة.',
        helperTone: 'info',
        action: canUseMixedPayment || walletBalance >= grandTotalMinorUnits
          ? undefined
          : {
              label: !walletLinked ? 'فتح WLT' : 'شحن الرصيد',
              tone: 'warning',
              onPress: !walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline())
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallMinorUnits)),
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
  }, [canUseMixedPayment, canUseWalletFull, formattedGrandTotal, formattedWalletBalance, formattedWalletShortfall, grandTotalMinorUnits, hasWltServiceRoute, paymentMethod, topUpWalletInline, walletBalance, walletHydrated, walletLinked, walletRefreshing, walletShortfallMinorUnits]);

  const executionTimingSummary = useMemo(() => {
    if (scheduling === 'now') {
      return 'الآن';
    }

    const selectedDateOption = executionScheduleOptions.dateOptions.find((option) => option.value === scheduledDate);
    const selectedTimeOption = executionScheduleOptions.timeOptions.find((option) => option.value === scheduledTime);

    return [selectedDateOption?.fullLabel ?? scheduledDate, selectedTimeOption?.fullLabel ?? scheduledTime]
      .filter(Boolean)
      .join(' - ');
  }, [executionScheduleOptions, scheduledDate, scheduledTime, scheduling]);

  const paymentMethodLabel = useMemo(
    () => paymentDecisionOptions.find((option) => option.id === paymentMethod)?.title ?? paymentSelection.method,
    [paymentDecisionOptions, paymentMethod, paymentSelection.method],
  );

  const checkoutReviewItems = useMemo(() => {
    const items = [
      { label: 'عدد العناصر', value: `${totalItemsCount} عناصر` },
      { label: 'إجمالي المنتجات', value: formattedSubtotal },
      { label: 'رسوم التوصيل', value: formattedDelivery },
      { label: 'طريقة الدفع', value: paymentMethodLabel, helper: paymentSelection.summary },
      { label: 'من المحفظة', value: formatDshPriceMinorUnits(paymentSelection.walletAmountMinorUnits) },
      { label: 'عند الاستلام', value: formatDshPriceMinorUnits(paymentSelection.amountDueOnDeliveryMinorUnits) },
      { label: 'خيار التوصيل', value: fulfillmentModeMeta.label },
      { label: locationTitle, value: locationSubtitle },
      { label: 'وقت التنفيذ', value: executionTimingSummary },
    ];

    if (formattedDiscount) {
      items.splice(3, 0, { label: 'الخصم', value: formattedDiscount });
    }

    if (couponCode) {
      items.push({ label: 'القسيمة', value: couponCode });
    }

    if (note !== 'لا يوجد ملاحظة') {
      items.push({ label: 'ملاحظات الطلب', value: note });
    }

    if (selectedFulfillmentMode === 'bthwani_delivery' && extraRequest) {
      items.push({ label: 'على طريقي', value: extraRequest });
    }

    return items;
  }, [
    couponCode,
    executionTimingSummary,
    extraRequest,
    formattedDelivery,
    formattedDiscount,
    formattedSubtotal,
    fulfillmentModeMeta.label,
    locationSubtitle,
    locationTitle,
    note,
    paymentMethodLabel,
    paymentSelection.amountDueOnDeliveryMinorUnits,
    paymentSelection.summary,
    paymentSelection.walletAmountMinorUnits,
    selectedFulfillmentMode,
    totalItemsCount,
  ]);

  const buildCheckoutPayload = (): CheckoutActionPayload => ({
    paymentMethod: paymentSelection.method,
    walletAmountMinorUnits: paymentSelection.walletAmountMinorUnits,
    amountDueOnDeliveryMinorUnits: paymentSelection.amountDueOnDeliveryMinorUnits,
    orderTotalMinorUnits: grandTotalMinorUnits,
    summary: paymentSelection.summary,
    financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
    fulfillmentMode: selectedFulfillmentMode,
    orderDraft: {
      fulfillmentMode: selectedFulfillmentMode,
      pickupAddress: storePickupLocationLabel,
      dropoffAddress: selectedFulfillmentMode === 'pickup' ? '' : clientAddress,
      note,
    },
  });

  const runCheckoutPreflight = () => {
    if (isOrderSubmitted) {
      showNotice('الطلب قيد التنفيذ', 'تم إرسال الطلب بالفعل. التعديل يتم عبر فريق العمليات فقط.', 'info');
      return false;
    }

    if (!canCheckout) {
      showNotice(clientStateMeta.label, clientStateMeta.description, 'info');
      return false;
    }

    if (!checkoutAction) {
      showNotice('تنفيذ الطلب محجوب', 'زر التنفيذ جاهز UI لكن المسار التالي غير موصول في هذا العرض.', 'info');
      return false;
    }

    if (!paymentSelection.valid) {
      const blockedStateMeta = paymentSelection.method === 'official-wallets' ? walletCreditMeta : paymentPendingMeta;
      showNotice(blockedStateMeta.label, paymentSelection.blockingReason ?? blockedStateMeta.description, paymentSelection.feedbackTone);
      return false;
    }

    return true;
  };

  const submitCheckoutAfterReview = async () => {
    const checkoutPayload = buildCheckoutPayload();

    if (paymentSelection.isExperimental) {
      showNotice('تم تسجيل الدفع التجريبي', paymentSelection.summary, 'success');
      await Promise.resolve(checkoutAction?.(checkoutPayload));
      return;
    }

    if (paymentSelection.method === 'wallet') {
      setCheckoutLoading(true);
      try {
        const paymentResult = await requestWalletPayment(paymentSelection.walletAmountMinorUnits);
        await refreshWallet();
        if (!paymentResult.success) {
          showNotice('تعذر خصم مبلغ المحفظة', paymentResult.error === 'insufficient_balance' ? 'الرصيد لم يعد كافيًا بعد آخر تحديث.' : 'حدث خطأ أثناء تهيئة الدفع من المحفظة.', 'danger');
          return;
        }

        await Promise.resolve(checkoutAction?.({
          ...checkoutPayload,
          wltPaymentRefId: paymentResult.txId,
        }));
        return;
      } finally {
        setCheckoutLoading(false);
      }
    }

    await Promise.resolve(checkoutAction?.(checkoutPayload));
  };

  const handleCheckoutPress = async () => {
    if (!runCheckoutPreflight()) {
      return;
    }

    // J-003A: call GET /cart/serviceability if a live client is available.
    // This is the real code-level gate — not a doc claim.
    if (props.checkoutClient && props.store?.id) {
      setCheckoutLoading(true);
      try {
        const itemIds = items.map((item) => item.id);
        const serviceability = await props.checkoutClient.checkServiceability(
          props.store.id,
          itemIds,
        );
        if (!serviceability.serviceable) {
          const reasonMessages: Record<string, string> = {
            store_closed: 'المتجر مغلق حاليًا، يُرجى المحاولة لاحقًا.',
            delivery_zone_unavailable: 'موقعك خارج نطاق التوصيل لهذا المتجر.',
            items_unavailable: 'بعض عناصر السلة غير متاحة حاليًا.',
            partner_not_ready: 'الشريك غير جاهز لاستقبال الطلبات الآن.',
          };
          const reason = serviceability.reason_code ?? 'unknown';
          showNotice(
            'التوصيل غير متاح',
            reasonMessages[reason] ?? 'تعذر إتمام الطلب — المتجر أو الموقع غير متاح حاليًا.',
            'danger',
          );
          return;
        }
      } catch {
        // Network failure — do not block checkout, let intent creation handle it.
        showNotice('تحقق التوفر', 'تعذر التحقق من التوفر — سيتم المحاولة عند إنشاء الطلب.', 'info');
      } finally {
        setCheckoutLoading(false);
      }
    }

    setCheckoutReviewVisible(true);
  };

  const confirmCheckoutReview = async () => {
    setCheckoutReviewVisible(false);
    await submitCheckoutAfterReview();
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

    const editPayload = buildCheckoutPayload();

    if (props.onOpenOrder) {
      props.onOpenOrder(editPayload);
      return;
    }

    props.onContinue?.(editPayload);
  };

  const toggleDeliveryModePicker = () => {
    if (!deliveryModePickerOpen) {
      closeQuickAction();
    }
    setDeliveryModePickerOpen((current) => !current);
  };

  const handleDeliveryModeSelection = (mode: DshFulfillmentDeliveryMode) => {
    setSelectedFulfillmentMode(mode);
    setDeliveryModePickerOpen(false);
    showNotice('تم تحديث خيار التوصيل', getDeliveryModeSelectionSummary(mode), 'success');
  };

  const handlePickupLocationPreview = () => {
    if (!hasStorePickupLocation) {
      showNotice('موقع المتجر غير محدد', 'لم يرسل المتجر موقع الاستلام بعد.', 'info');
      return;
    }

    showNotice(locationTitle, storePickupLocationLabel, 'info');
  };

  const openQuickAction = (actionKey: QuickActionKey) => {
    setDeliveryModePickerOpen(false);

    if (actionKey === 'address' && isPickupMode) {
      handlePickupLocationPreview();
      return;
    }

    if (actionKey === 'extra' && selectedFulfillmentMode !== 'bthwani_delivery') {
      return;
    }

    if (quickActionKey === actionKey) {
      closeQuickAction();
      return;
    }

    const initialValue = {
      coupon: couponCode,
      address: clientAddress === 'العنوان غير محدد بعد' ? '' : clientAddress,
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
        // Coupon offer validation — API-driven when offers endpoint is available.
        // For now, allow coupon attempts (empty offer list = no validation block).
        const activeCouponOffers: never[] = [];
        const hasCouponEntitlement = false;
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
      const nextLocation = trimmedValue || 'العنوان غير محدد بعد';
      setClientAddress(nextLocation);
      showNotice(
        `تم تحديث ${locationTitle}`,
        trimmedValue || 'تم حفظ الموقع كحالة غير محددة حتى يتم إدخاله لاحقًا.',
        'success',
      );
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

    closeQuickAction();
  };

  const openProductPreview = (product: RecommendationProduct) => {
    setPreviewProduct(product);
    setPreviewFeedback(null);
  };

  const closeProductPreview = () => {
    setPreviewProduct(null);
    setPreviewFeedback(null);
  };

  const handlePreviewPrimaryAction = () => {
    if (!previewProduct) {
      return;
    }

    const matchingCartItem = findCartItemForProduct(items, previewProduct);
    if (matchingCartItem) {
      setItems((prev) => prev.map((item) => (
        item.id === matchingCartItem.id
          ? { ...item, qty: (item.qty ?? 1) + 1 }
          : item
      )));
      setPreviewFeedback({ message: 'زادت الكمية', tone: 'success' });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: previewProduct.id,
        title: previewProduct.title,
        priceLabel: previewProduct.priceLabel,
        priceValue: previewProduct.priceValue,
        qty: 1,
      },
    ]);
    setPreviewFeedback({ message: 'تمت الإضافة', tone: 'success' });
  };

  const handleOpenFirstRecommendationPreview = () => {
    // Recommended products come from API — no fixture fallback.
  };

  const handleSubscribePress = () => {
    showNotice('الاشتراك جاهز UI فقط', 'زر الاشتراك واضح وفعال، لكن تفعيل الميزة يحتاج ربطًا لاحقًا خارج هذا النطاق.', 'info');
  };

  const handleOpenStore = () => {
    if (props.onOpenStore) {
      props.onOpenStore();
    } else {
      showNotice('واجهة المتجر غير موصولة', 'زر إضافة منتجات أخرى جاهز، ولكن لم يتم تمرير مسار واجهة المتجر في هذا العرض التجريبي.', 'info');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <TopBar
        variant="secondary"
        title="تأكيد الطلب"
        titleSlot={(
          <Text role="titleSm" weight="black" style={{ color: TEXT_PRIMARY, maxWidth: '100%', flexShrink: 1, minWidth: 0, textAlign: 'center' }} numberOfLines={1}>
            تأكيد الطلب
          </Text>
        )}
        actions={[]}
      />

      <MobileScrollView fill padding={1} gap={1} contentContainerStyle={{ paddingBottom: spacing[2] }}>
        {props.reorderAlertMessage ? (
          <Surface
            tone="default"
            padding={2}
            style={{
              backgroundColor: colorPalette.warningSoft,
              borderWidth: 1,
              borderColor: colorPalette.warning,
              borderRadius: radius.md2,
              paddingHorizontal: spacing[2],
              paddingVertical: spacing[2],
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: spacing[2] }}
          >
            <Icon name="alert-circle-outline" size={20} color={colorPalette.warningStrong} />
            <Text role="bodySm" weight="bold" style={{ color: colorPalette.warningStrong, textAlign: isRTL ? 'right' : 'left', flex: 1 }}>
              {props.reorderAlertMessage}
            </Text>
          </Surface>
        ) : null}
        <PromoBanner onPress={handleSubscribePress} />

        <Surface
          tone="inset"
          padding={2}
          gap={1}
          style={{ backgroundColor: colorPalette.surfaceSecondary, borderRadius: radius.md2, borderWidth: 1, borderColor: BORDER_SOFT }}
        >
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
            <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
              <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                سياسة تأكيد الطلب
              </Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                {checkoutFlowSummary?.nextPolicyActionPreview ?? 'هذه الشاشة تعرض الملخص أولًا، وتفتح المراجعة التفصيلية عند الطلب فقط.'}
              </Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                {`الأثر المالي والتسويات المرجعية يتبعان ${resolveDshControlPanelSectionLabel('finance')} وWLT، بينما السياسة التشغيلية المركزية تتبع ${resolveDshControlPanelSectionLabel('platform')}.`}
              </Text>
            </View>
            <Text role="caption" weight="black" style={{ color: ACCENT_ORANGE, textAlign: 'right' }}>
              {resolveDshOnDemandPolicyLabel(checkoutFlowPolicy)}
            </Text>
          </View>
        </Surface>

        <Surface tone="default" gap={0} style={{ backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: radius.md2, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: spacing[2], flex: 1 }}>
                <Icon name={fulfillmentModeMeta.icon} size={18} color={TEXT_PRIMARY} style={{ marginTop: 2, flexShrink: 0 }} />
                <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
                  <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                    خيار التوصيل
                  </Text>
                  <Text role="caption" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                    {deliveryModeSelectionSummary}
                  </Text>
                  <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                    إذا أردت تغييره اضغط هنا
                  </Text>
                </View>
              </View>
              <Button
                label="تغيير"
                tone="secondary"
                size="sm"
                fullWidth={false}
                onPress={toggleDeliveryModePicker}
              />
            </View>
            {deliveryModePickerOpen && (
              <View style={{ gap: spacing[1], marginTop: spacing[2] }}>
                {fulfillmentModeOptions.map((option) => {
                  const isSelected = option.value === selectedFulfillmentMode;

                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      onPress={() => handleDeliveryModeSelection(option.value)}
                      style={{
                        borderWidth: 1,
                        borderColor: isSelected ? SURFACE_WARM_BORDER : BORDER_SOFT,
                        backgroundColor: isSelected ? SURFACE_WARM : colorPalette.surfacePrimary,
                        borderRadius: radius.md2,
                        paddingHorizontal: spacing[2],
                        paddingVertical: spacing[2] }}
                    >
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                        <Icon name={option.icon} size={18} color={isSelected ? ACCENT_ORANGE : TEXT_PRIMARY} style={{ flexShrink: 0 }} />
                        <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
                          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
                            <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                              {option.label}
                            </Text>
                            {isSelected && (
                              <Text role="caption" style={{ color: ACCENT_ORANGE, textAlign: 'right' }}>
                                محدد
                              </Text>
                            )}
                          </View>
                          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                            {option.description}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
          <OptionRow
            title="هل لديك قسيمة تخفيض؟"
            subtitle={couponCode ? `القسيمة الحالية: ${couponCode}` : 'أدخل رمز التخفيض إن وجد'}
            actionLabel={couponCode ? 'تعديل' : 'إضافة'}
            onAction={() => openQuickAction('coupon')}
            flat
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[3], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'coupon' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[3], paddingBottom: spacing[3] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                submitDisabled={quickActionDraft.trim().length === 0}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={closeQuickAction}
              />
            </View>
          )}
          <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[3], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
              <View style={{ flex: 1, gap: spacing[1], alignItems: 'flex-end' }}>
                <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                  {locationTitle}
                </Text>
                <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                  {locationSubtitle}
                </Text>
              </View>
              <Button
                label={isPickupMode ? 'عرض الموقع' : 'تغيير'}
                tone="secondary"
                size="sm"
                fullWidth={false}
                disabled={isPickupMode && !hasStorePickupLocation}
                onPress={isPickupMode ? handlePickupLocationPreview : () => openQuickAction('address')}
              />
            </View>
          </View>
          {quickActionKey === 'address' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[3], paddingBottom: spacing[3] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={closeQuickAction}
              />
            </View>
          )}
          {deliveryNotice ? (
            <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[2], backgroundColor: colorPalette.surfaceSecondary, borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
              <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                {deliveryNotice}
              </Text>
            </View>
          ) : null}
          <OptionRow
            title="ملاحظات الطلب"
            subtitle={note}
            actionLabel={note === 'لا يوجد ملاحظة' ? 'إضافة' : 'تعديل'}
            onAction={() => openQuickAction('note')}
            flat
            style={{ borderBottomWidth: selectedFulfillmentMode === 'bthwani_delivery' ? 1 : 0, borderColor: BORDER_SOFT, paddingVertical: spacing[3], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'note' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[3], paddingBottom: spacing[3] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={closeQuickAction}
              />
            </View>
          )}
          {selectedFulfillmentMode === 'bthwani_delivery' && (
            <OptionRow
              title="على طريقي"
              subtitle={extraRequest || 'أضف شيئًا بسيطًا من طريق الكابتن'}
              actionLabel={extraRequest ? 'تعديل' : 'إضافة'}
              onAction={() => openQuickAction('extra')}
              flat
              style={{ paddingVertical: spacing[3], paddingHorizontal: spacing[3] }}
            />
          )}
          {quickActionKey === 'extra' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[3], paddingBottom: spacing[3] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={closeQuickAction}
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
            <Text role="bodySm" weight="bold" style={{ color: TEXT_PRIMARY, flex: 1, textAlign: 'right' }}>قرار الدفع</Text>
            {EXPERIMENTAL_PAYMENT_ENABLED ? (
              <View style={{ backgroundColor: colorPalette.warningSoft, borderRadius: radius.xs2, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
                <Text role="caption" weight="bold" style={{ color: colorPalette.warning }}>تجريبي</Text>
              </View>
            ) : null}
          </View>
          {/* WLT finance preview notice — payment display is preview-only, not a real executed payment */}
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right', paddingHorizontal: spacing[1] }}>
            معاينة دفع — غير منفذة ماليًا · WLT يملك منطق الدفع الفعلي
          </Text>
          <PaymentDecisionList items={paymentDecisionOptions} flat />
        </View>

        <RecommendedSection
          items={items}
          onOpenProductPreview={openProductPreview}
          onOpenStore={handleOpenStore}
        />

        <CartItemEditor
          items={items}
          onChangeQty={updateItemQty}
          onRemove={removeItem}
          onClearCart={() => {
            setItems([]);
            showNotice('تم تفريغ السلة', 'يمكنك فتح أول منتج مقترح أو اختيار أي بطاقة من المقترحات أدناه.', 'success');
          }}
          onScrollToRecommendations={handleOpenFirstRecommendationPreview}
          subtotal={subtotalAmount}
          deliveryFee={deliveryAmount}
          discount={couponDiscount}
          grandTotal={grandTotalAmount}
          couponCode={couponCode}
        />
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
           ...shadowPresets.overlay }}
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
            label={isOrderSubmitted ? 'الطلب قيد التنفيذ' : canCheckout ? 'تنفيذ الطلب' : 'أضف عناصر أولاً'}
            tone="brand"
            size="md"
            fullWidth={false}
            disabled={isOrderSubmitted || !canCheckout || checkoutLoading}
            loading={checkoutLoading}
            onPress={handleCheckoutPress}
            style={{ flex: 2, minHeight: 52, borderRadius: radius.lg, opacity: isOrderSubmitted ? 0.6 : 1 }}
          />
          <Button
            label={isOrderSubmitted ? 'طلب تعديل عبر العمليات' : 'تعديل'}
            tone="secondary"
            size="md"
            fullWidth={false}
            disabled={!canEditOrder}
            onPress={isOrderSubmitted ? undefined : handleEditPress}
            style={{ flex: 1, minHeight: 52, borderRadius: radius.lg }}
          />
        </View>
      </View>

      <SheetFrame visible={checkoutReviewVisible} title="مراجعة الطلب" onClose={() => setCheckoutReviewVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing[3], paddingBottom: Math.max(androidSystemBottomInset, safeArea.comfortable) }}
        >
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
            راجع كل تفاصيل الطلب قبل تأكيد التنفيذ النهائي.
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
            {`هذا هو مسار التفاصيل المعتمد من السجل المركزي: ${resolveDshOnDemandPolicyLabel(checkoutFlowPolicy)}.`}
          </Text>
          <SummaryCard
            items={checkoutReviewItems}
            totalLabel="الإجمالي النهائي"
            totalValue={formattedGrandTotal}
            padding={2}
            gap={2}
          />
          <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
            <Button
              label="تأكيد التنفيذ"
              tone="brand"
              fullWidth={false}
              disabled={checkoutLoading}
              loading={checkoutLoading}
              onPress={confirmCheckoutReview}
              style={{ flex: 1, minHeight: 50, borderRadius: radius.md2, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY }}
            />
            <Button
              label="رجوع للتعديل"
              tone="secondary"
              fullWidth={false}
              disabled={checkoutLoading}
              onPress={() => setCheckoutReviewVisible(false)}
              style={{ flex: 1, minHeight: 50, borderRadius: radius.md2 }}
            />
          </View>
        </ScrollView>
      </SheetFrame>

      <Toast
        visible={Boolean(notice)}
        title={notice?.title ?? ''}
        description={notice?.description}
        tone={notice?.tone ?? 'info'}
        onDismiss={dismissNotice}
        actionLabel={notice?.actionLabel}
        onActionPress={() => {
          notice?.onActionPress?.();
          dismissNotice();
        }}
      />

      <ProductPreviewModal
        visible={Boolean(previewProduct)}
        product={previewProduct}
        cartQty={activeCartQty}
        feedback={previewFeedback}
        bottomInset={androidSystemBottomInset}
        onClose={closeProductPreview}
        onPrimaryAction={handlePreviewPrimaryAction}
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
