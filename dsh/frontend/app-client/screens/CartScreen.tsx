import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import {
  Button,
  Box,
  Card,
  colorPalette,
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
  type PaymentDecisionOption,
} from '@bthwani/ui-kit';
import { DshCartDetails } from '../parts/CartDetails';
import { getDshClientStateMeta, type DshClientState } from '../../data/operational-statuses.preview-data';
import { getPartnerOfferItems } from '../../data/offers.preview-data';
import { isClientVisibleStatus, type CommercialLifecycleStatus } from '../../shared/commercial.preview-contract';
import { getEntitlements } from '../../data/subscriptions.preview-data';
import {
  resolveWltDshFinanceEventKindForPaymentMethod,
  useWltDshWalletPreview,
  type WltDshFinanceEventKind,
} from '../../../../wlt/frontend/dsh/app-client';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import {
  type DshClientCreateOrderRequest,
  type DshFulfillmentDeliveryMode,
  getDshFulfillmentDeliveryModeMeta,
  getDshClientFlowPolicy,
} from '../contracts/dsh-client-binding.contracts';
// SSoT: COD availability per delivery mode â€” bthwani_delivery only.
import { isCodAllowedForMode } from '../dsh-client-wlt-payment-bridge';
import { getDshFlowPolicySummary } from '../../shared/dsh-flow-registry';
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

function resolveCheckoutPolicyLabel(policy: ReturnType<typeof getDshClientFlowPolicy>): string {
  if (policy === 'detail-on-open') {
    return 'ØªÙØ§ØµÙŠÙ„ Ø¹Ù†Ø¯ Ø§Ù„ÙØªØ­';
  }

  if (policy === 'summary-only') {
    return 'Ù…Ù„Ø®Øµ Ø£ÙˆÙ„Ù‹Ø§';
  }

  if (policy === 'finance-preview-only') {
    return 'Ù…Ø§Ù„ÙŠ Ù„Ù„Ù‚Ø±Ø§Ø¡Ø© ÙÙ‚Ø·';
  }

  return 'Ø³ÙŠØ§Ø³Ø© Ù…Ù† Ø§Ù„Ø³Ø¬Ù„';
}

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

import { dshCartRecommendedProductsFixture, dshCartPreviewFallbackItemsFixture } from '../../data/orders.preview-data';
import type { RecommendationProduct, CartItem } from '../../shared/dsh-order-preview.contract';

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
    title: 'Ø¥Ø¶Ø§ÙØ© Ù‚Ø³ÙŠÙ…Ø©',
    placeholder: 'Ø£Ø¯Ø®Ù„ Ø±Ù…Ø² Ø§Ù„ØªØ®ÙÙŠØ¶',
    helper: 'Ø³ÙŠØªÙ… Ø­ÙØ¸ Ø§Ù„Ù‚Ø³ÙŠÙ…Ø© Ø¯Ø§Ø®Ù„ Ù‡Ø°Ù‡ Ø§Ù„Ø¬Ù„Ø³Ø© ÙÙ‚Ø· Ø­ØªÙ‰ ÙŠÙƒØªÙ…Ù„ Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ø®Ù„ÙÙŠ.',
    saveLabel: 'Ø­ÙØ¸ Ø§Ù„Ù‚Ø³ÙŠÙ…Ø©',
    icon: 'pricetag-outline',
  },
  address: {
    title: 'Ù…ÙˆÙ‚Ø¹ Ø§Ù„ØªÙˆØµÙŠÙ„',
    placeholder: 'Ø§ÙƒØªØ¨ Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø£Ùˆ Ø­Ø¯Ø¯Ù‡ Ù…Ù† Ø§Ù„Ø®Ø±ÙŠØ·Ø© Ù„Ø§Ø­Ù‚Ù‹Ø§',
    helper: 'Ø³ÙŠØªÙ… Ù„Ø§Ø­Ù‚Ù‹Ø§ Ø¯Ø¹Ù… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø¨Ø¯Ø¨ÙˆØ³ Ø¹Ø¨Ø± Google Maps.',
    saveLabel: 'Ø­ÙØ¸ Ø§Ù„Ù…ÙˆÙ‚Ø¹',
    multiline: true,
    icon: 'location-outline',
  },
  note: {
    title: 'Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø·Ù„Ø¨',
    placeholder: 'Ø£Ø¶Ù Ù…Ù„Ø§Ø­Ø¸Ø© Ù‚ØµÙŠØ±Ø© Ù„Ù„ÙƒØ§Ø¨ØªÙ† Ø£Ùˆ Ø§Ù„Ù…ØªØ¬Ø±',
    helper: 'ÙŠÙ…ÙƒÙ† ØªØ±Ùƒ Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø© ÙØ§Ø±ØºØ© Ø¥Ø°Ø§ Ù„Ù… ØªÙƒÙ† Ù‡Ù†Ø§Ùƒ ØªØ¹Ù„ÙŠÙ…Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ©.',
    saveLabel: 'Ø­ÙØ¸ Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø©',
    multiline: true,
    icon: 'document-text-outline',
  },
  extra: {
    title: 'Ø¹Ù„Ù‰ Ø·Ø±ÙŠÙ‚ÙŠ',
    placeholder: 'Ù…Ø«Ø§Ù„: Ù…Ø§Ø¡ØŒ Ø¨Ø³Ø¨Ø³ØŒ Ù…Ù†Ø§Ø¯ÙŠÙ„...',
    helper: 'Ø£Ø¶Ù Ø´ÙŠØ¦Ù‹Ø§ Ø¨Ø³ÙŠØ·Ù‹Ø§ Ù…Ù† Ø·Ø±ÙŠÙ‚ Ø§Ù„ÙƒØ§Ø¨ØªÙ†.',
    saveLabel: 'Ø­ÙØ¸',
    multiline: true,
    icon: 'add-circle-outline',
  },
};

const FULFILLMENT_MODE_ORDER = ['bthwani_delivery', 'partner_delivery', 'pickup'] as const;

function getDeliveryModeSelectionSummary(mode: DshFulfillmentDeliveryMode) {
  switch (mode) {
    case 'partner_delivery':
      return 'ØªÙ… Ø§Ø®ØªÙŠØ§Ø± ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªØ¬Ø±';
    case 'pickup':
      return 'ØªÙ… Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø±';
    case 'bthwani_delivery':
    default:
      return 'ØªÙ… Ø§Ø®ØªÙŠØ§Ø± ØªÙˆØµÙŠÙ„ Ø¨Ø«ÙˆØ§Ù†ÙŠ';
  }
}

function getDeliveryModePickerDescription(mode: DshFulfillmentDeliveryMode) {
  switch (mode) {
    case 'partner_delivery':
      return 'Ø§Ù„ØªÙˆØµÙŠÙ„ ÙŠØªÙ… Ø¹Ø¨Ø± Ù…ÙˆØµÙ„ Ø§Ù„Ù…ØªØ¬Ø± Ø¥Ù„Ù‰ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¹Ù…ÙŠÙ„.';
    case 'pickup':
      return 'ØªØ³ØªÙ„Ù… Ø§Ù„Ø·Ù„Ø¨ Ù…Ù† Ø§Ù„Ù…ØªØ¬Ø± Ø¨Ù†ÙØ³Ùƒ Ø¨Ø¯ÙˆÙ† Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„.';
    case 'bthwani_delivery':
    default:
      return 'Ø§Ù„ØªÙˆØµÙŠÙ„ ÙŠØªÙ… Ø¹Ø¨Ø± ÙƒØ§Ø¨ØªÙ† Ø¨Ø«ÙˆØ§Ù†ÙŠ Ø¥Ù„Ù‰ Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø¹Ù…ÙŠÙ„.';
  }
}



function toEnglishDigits(str: string): string {
  return str
    .replace(/[Ù -Ù©]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[Û°-Û¹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

function formatAmount(value: number) {
  try {
    const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    return `${formatted} Ø±.ÙŠ.`;
  } catch {
    return `${value} Ø±.ÙŠ.`;
  }
}

function formatMinorUnitsAmount(value: number) {
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
      label: index === 0 ? 'ØºØ¯Ù‹Ø§' : index === 1 ? 'Ø¨Ø¹Ø¯ ØºØ¯' : toEnglishDigits(dateChipFormatter.format(date)).replace('ØŒ', '').trim(),
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
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colorPalette.white, alignItems: 'center', justifyContent: 'center', shadowColor: colorPalette.black, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
              <Icon name="calendar-outline" size={22} color={ACCENT_ORANGE} />
            </View>
            <Box style={{ flex: 1 }} gap={0.5}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{dateLabel}</Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY }}>Ø§Ù„Ø³Ø§Ø¹Ø© {timeLabel}</Text>
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
        borderRadius: 16,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        minHeight: 60,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 36 }}>
        <View style={{ width: 96, alignItems: 'center' }}>
          <Button
            label="Ø§Ø´ØªØ±Ùƒ Ø§Ù„Ø¢Ù†"
            size="sm"
            fullWidth={false}
            onPress={onPress}
            style={{ minWidth: 92, minHeight: 36, backgroundColor: ACCENT_ORANGE, borderColor: ACCENT_ORANGE, borderRadius: 18 }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center', lineHeight: 18 }}>
            Ø§Ø´ØªØ±Ùƒ Ø¨Ø®Ø¯Ù…Ø© Ø¨Ø«ÙˆØ§Ù†ÙŠ Ø¨Ø±Ùˆ Ù„Ù„Ø§Ø³ØªÙØ§Ø¯Ø© Ù…Ù† Ø£ÙØ¶Ù„ Ø§Ù„Ø¹Ø±ÙˆØ¶
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
  const imageSource = resolveDshImageSource(product.imageUri);

  return (
    <Pressable onPress={onOpenProductPreview} style={({ pressed }) => ({ opacity: pressed ? 0.94 : 1 })}>
      <Surface
        tone="default"
        style={{
          width: 140,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: BORDER_SOFT,
          backgroundColor: colorPalette.surfacePrimary,
          padding: spacing[2],
          gap: spacing[1.5],
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        {cartQty > 0 && (
          <View style={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: ACCENT_ORANGE,
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 2,
            zIndex: 2,
          }}>
            <Text role="caption" style={{ color: colorPalette.white, fontWeight: '700', fontSize: 10 }}>
              {`Ù…Ø¶Ø§Ù (${cartQty})`}
            </Text>
          </View>
        )}

        <View style={{ height: 80, backgroundColor: SURFACE_SOFT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {imageSource ? (
            <Image source={imageSource} style={{ width: 64, height: 64, borderRadius: 32 }} resizeMode="cover" />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colorPalette.brandSoft }} />
          )}
          <View style={{ position: 'absolute', bottom: 4, left: 4, borderRadius: 6, backgroundColor: withAlpha(colorPalette.brandStrong, 0.75), paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text role="caption" style={{ color: colorPalette.white, fontWeight: '700', fontSize: 10 }}>
              {product.priceLabel}
            </Text>
          </View>
        </View>

        <View style={{ gap: 2 }}>
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center', fontSize: 13 }} numberOfLines={1}>
            {product.title}
          </Text>
        </View>

        <Button
          label="Ø¹Ø±Ø¶ Ø§Ù„Ù…Ù†ØªØ¬"
          tone="secondary"
          size="sm"
          fullWidth
          onPress={onOpenProductPreview}
          style={{ minHeight: 32, borderRadius: 10 }}
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
  const horizontalProducts = dshCartRecommendedProductsFixture.slice(0, 4);

  return (
    <View style={{ gap: spacing[1.5] }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[1], gap: spacing[1] }}>
        <View style={{ flex: 1, gap: 2, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
            Ù‚Ø¯ ØªØ¹Ø¬Ø¨Ùƒ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø£ÙŠØ¶Ø§Ù‹
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
            Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ù‡Ù†Ø§ ÙÙ‚Ø·ØŒ ÙˆØ§Ù„Ø¥Ø¶Ø§ÙØ© Ù…Ù† Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„Ù…ÙØªÙˆØ­Ø©.
          </Text>
        </View>
        {onOpenStore && (
          <Button
            label="Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬Ø§Øª Ø£Ø®Ø±Ù‰"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={onOpenStore}
            style={{ borderRadius: 10, minHeight: 32, paddingHorizontal: spacing[2] }}
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
          paddingBottom: spacing[1],
        }}
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
  const imageSource = product ? resolveDshImageSource(product.imageUri) : undefined;
  const priceLabel = product ? formatAmount(product.priceValue) : '';
  const hasCartQty = cartQty > 0;
  const actionLabel = hasCartQty ? 'Ø²ÙŠØ§Ø¯Ø© Ø§Ù„ÙƒÙ…ÙŠØ©' : 'Ø¥Ø¶Ø§ÙØ© Ù„Ù„Ø³Ù„Ø©';
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
          backgroundColor: withAlpha(colorPalette.brandStrong, 0.48),
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ø¥ØºÙ„Ø§Ù‚ Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ù†ØªØ¬"
          onPress={onClose}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: withAlpha(colorPalette.brandStrong, 0.36),
          }}
        />

        <Surface
          tone="default"
          style={{
            zIndex: 1,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER_SOFT,
            backgroundColor: colorPalette.surfacePrimary,
            overflow: 'hidden',
            maxHeight: '90%',
            shadowColor: colorPalette.black,
            shadowOpacity: 0.16,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 16,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: spacing[3],
              gap: spacing[3],
              paddingBottom: spacing[4],
            }}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
              <View style={{ flex: 1, gap: spacing[0.5] }}>
                <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                  Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ù†ØªØ¬
                </Text>
                <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
                  Ø§Ù„ÙØªØ­ Ù‡Ù†Ø§ ÙÙ‚Ø·ØŒ ÙˆØ§Ù„Ø¥Ø¶Ø§ÙØ© Ù…Ù† Ø²Ø± Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø©
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø©"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 12,
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

            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER_SOFT }}>
              <View style={{ height: 240, position: 'relative', backgroundColor: colorPalette.surfaceSecondary }}>
                {imageSource ? (
                  <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colorPalette.brandSoft }}>
                    <Icon name="cart-outline" size={44} color={ACCENT_BLUE} />
                  </View>
                )}

                <View style={{ position: 'absolute', top: spacing[2], right: spacing[2], flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: 999, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: colorPalette.white, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                  <Icon name="cart-outline" size={14} color={ACCENT_ORANGE} />
                  <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
                    {hasCartQty ? `Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ø³Ù„Ø© Â· ${cartQty}` : 'ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ø³Ù„Ø©'}
                  </Text>
                </View>
              </View>

              <View style={{ gap: spacing[2], padding: spacing[3] }}>
                <View style={{ gap: spacing[0.5] }}>
                  <Text role="titleSm" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <Text role="titleMd" style={{ color: ACCENT_BLUE, textAlign: isRTL ? 'right' : 'left' }}>
                    {priceLabel}
                  </Text>
                </View>

                {product.description ? (
                  <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left', lineHeight: 20 }}>
                    {product.description}
                  </Text>
                ) : null}

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[2], borderRadius: 14, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: hasCartQty ? colorPalette.successSoft : colorPalette.surfaceSecondary, paddingHorizontal: spacing[2], paddingVertical: spacing[1.5] }}>
                  <Text role="bodySm" style={{ flex: 1, color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                    {hasCartQty ? 'Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ø³Ù„Ø©' : 'ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ø³Ù„Ø©'}
                  </Text>
                  <Text role="bodySm" style={{ color: hasCartQty ? colorPalette.success : TEXT_SECONDARY, fontWeight: '700' }}>
                    {hasCartQty ? `Ã— ${cartQty}` : '0'}
                  </Text>
                </View>

                {feedback ? (
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: 14, borderWidth: 1, borderColor: feedback.tone === 'success' ? colorPalette.success : BORDER_SOFT, backgroundColor: feedback.tone === 'success' ? colorPalette.successSoft : colorPalette.brandSoft, paddingHorizontal: spacing[2], paddingVertical: spacing[1.5] }}>
                    <Icon name={feedback.tone === 'success' ? 'checkmark-circle-outline' : 'information-circle-outline'} size={14} color={feedback.tone === 'success' ? colorPalette.success : ACCENT_BLUE} />
                    <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
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
                    style={{ flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY }}
                  />
                  <Button
                    label="Ø¥ØºÙ„Ø§Ù‚"
                    tone="secondary"
                    fullWidth={false}
                    onPress={onClose}
                    style={{ flex: 1, minHeight: 48, borderRadius: 16 }}
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
        borderRadius: 16,
        padding: spacing[3],
        gap: spacing[2],
      }}
    >
      {/* Product Name & Unit Price */}
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 4, paddingLeft: isRTL ? 0 : spacing[1], paddingRight: isRTL ? spacing[1] : 0 }}>
        <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
          {displayIndex}{item.title}
        </Text>
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
          Ø³Ø¹Ø± Ø§Ù„ÙˆØ­Ø¯Ø©: {formatAmount(price)}
        </Text>
      </View>

      {/* Controls and Subtotal */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[3] }}>
        {/* Quantity controls: - / Qty / + */}
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: SURFACE_SOFT,
          borderRadius: 12,
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
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: 8 }}
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
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: 8 }}
          />
        </View>

        {/* Subtotal */}
        <Text role="bodyStrong" style={{ color: ACCENT_BLUE, minWidth: 64, textAlign: isRTL ? 'left' : 'right' }}>
          {formatAmount(subtotal)}
        </Text>

        {/* Delete button */}
        {onRemove && (
          <Pressable
            onPress={() => onRemove(item.id)}
            style={({ pressed }) => [{
              padding: 8,
              borderRadius: 10,
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
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, fontWeight: '800', fontSize: 16 }}>
            Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø³Ù„Ø©
          </Text>
          {items.length > 0 && (
            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
                {items.length} Ø¹Ù†Ø§ØµØ±
              </Text>
            </View>
          )}
        </View>

        {items.length > 0 && onClearCart && (
          <Pressable onPress={onClearCart} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingVertical: 4, paddingHorizontal: 8 }]}>
            <Text role="bodyStrong" style={{ color: DANGER, fontSize: 14 }}>
              Ø­Ø°Ù Ø§Ù„ÙƒÙ„
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
            justifyContent: 'center',
          }}
        >
          <Icon name="basket-outline" size={32} color={colorPalette.textMuted} />
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
            Ø§Ù„Ø³Ù„Ø© ÙØ§Ø±ØºØ© Ø§Ù„Ø¢Ù†
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'center', maxWidth: '80%', lineHeight: 18 }}>
            Ø£Ø¶Ù Ù…Ù†ØªØ¬Ø§Øª Ù…Ù† Ø§Ù„Ù…Ù‚ØªØ±Ø­Ø§Øª Ø£Ø¯Ù†Ø§Ù‡ Ù„Ù„Ø¨Ø¯Ø¡ ÙÙŠ ØªØ¬Ù‡ÙŠØ² Ø·Ù„Ø¨Ùƒ.
          </Text>
          {onScrollToRecommendations && (
            <Button
              label="Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬Ø§Øª"
              tone="brand"
              size="sm"
              fullWidth={false}
              onPress={onScrollToRecommendations}
              style={{ marginTop: spacing[1], borderRadius: 12 }}
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
          <View style={{ height: 1, backgroundColor: BORDER_SOFT, marginVertical: spacing[1] }} />

          {/* Integrated Live Pricing Summary */}
          <View style={{ gap: spacing[1.5], paddingHorizontal: spacing[1] }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatAmount(subtotal)}</Text>
            </View>

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>Ø³Ø¹Ø± Ø§Ù„ØªÙˆØµÙŠÙ„</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatAmount(deliveryFee)}</Text>
            </View>

            {discount > 0 && (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="bodySm" style={{ color: colorPalette.success, textAlign: isRTL ? 'right' : 'left' }}>Ø§Ù„Ø®ØµÙ… (Ù‚Ø³ÙŠÙ…Ø©: {couponCode})</Text>
                <Text role="bodyStrong" style={{ color: colorPalette.success }}>-{formatAmount(discount)}</Text>
              </View>
            )}

            {/* Grand Total Divider */}
            <View style={{ height: 1, backgroundColor: BORDER_SOFT, marginVertical: spacing[0.5] }} />

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, fontWeight: '800', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ</Text>
              <Text role="titleMd" style={{ color: ACCENT_BLUE, fontWeight: '900' }}>{formatAmount(grandTotal)}</Text>
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
          label="Ø¥Ù„ØºØ§Ø¡"
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
    props.items !== undefined ? props.items : dshCartPreviewFallbackItemsFixture,
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
  // SSoT: COD is only available for bthwani_delivery â€” gated by dsh-client-wlt-payment-bridge.
  const codAllowedForMode = isCodAllowedForMode(selectedFulfillmentMode);
  // pickup carries no delivery fee; partner_delivery and bthwani_delivery carry a preview fee (PREVIEW_ONLY â€” real fee from WLT).
  const deliveryAmount = selectedFulfillmentMode === 'pickup' ? 0 : 950;
  const [clientAddress, setClientAddress] = useState('Ø¬ÙˆØ§Ø± Ø§Ù„Ø¬Ø¨Ù„ Ø§Ù„Ø¬Ø¯ÙŠØ¯');
  const [note, setNote] = useState('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø©');
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
  } = useWltDshWalletPreview(props.clientId, props.bearerToken);

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

    return 'Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯';
  }, [props.store?.name, props.store?.subtitle]);
  const hasStorePickupLocation = storePickupLocationLabel !== 'Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯';
  const locationTitle = isPickupMode ? 'Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…' : 'Ù…ÙˆÙ‚Ø¹ Ø§Ù„ØªÙˆØµÙŠÙ„';
  const locationSubtitle = isPickupMode ? storePickupLocationLabel : clientAddress;
  const deliveryModeSelectionSummary = getDeliveryModeSelectionSummary(selectedFulfillmentMode);
  const deliveryNotice = selectedFulfillmentMode === 'pickup'
    ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø±Ø³ÙˆÙ… ØªÙˆØµÙŠÙ„ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ù†ÙØ³Ùƒ.'
    : selectedFulfillmentMode === 'partner_delivery'
      ? 'Ù‚Ø¯ ÙŠØ­Ø¯Ø¯ Ø§Ù„Ù…ØªØ¬Ø± Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ© Ø¨Ø¹Ø¯ Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø·Ù„Ø¨.'
      : 'Ù‚Ø¯ ØªØªØºÙŠØ± Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„ Ø¨Ø¹Ø¯ Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ù…ÙˆÙ‚Ø¹.';
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
  const formattedSubtotal = formatAmount(subtotalAmount);
  const formattedDelivery = formatAmount(deliveryAmount);
  const formattedDiscount = couponDiscount > 0 ? `-${formatAmount(couponDiscount)}` : undefined;
  const formattedGrandTotal = formatAmount(grandTotalAmount);
  const formattedWalletBalance = formatAmount(walletBalance / 100);
  const formattedWalletShortfall = formatMinorUnitsAmount(walletShortfallMinorUnits);
  const canCheckout = totalItemsCount > 0;
  const androidSystemBottomInset = Platform.OS === 'android'
    ? Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height)
    : safeArea.comfortable;
  const footerSafePadding = androidSystemBottomInset + spacing[2];
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : sizes.controlMd + footerSafePadding + spacing[4];
  const actionBarBottomPadding = resolvedFooterHeight + spacing[2];
  const activePreviewCartItem = useMemo(
    () => (previewProduct ? findCartItemForProduct(items, previewProduct) : undefined),
    [items, previewProduct],
  );
  const previewCartQty = activePreviewCartItem?.qty ?? 0;

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
        `ØªÙ… Ø­Ø°Ù "${targetItem.title}" Ù…Ù† Ø§Ù„Ø³Ù„Ø©`,
        undefined,
        'warning',
        'ØªØ±Ø§Ø¬Ø¹',
        () => {
          const restored = [...updated];
          restored.splice(index, 0, targetItem);
          setItems(restored);
          showNotice(`ØªÙ…Øª Ø§Ø³ØªØ¹Ø§Ø¯Ø© "${targetItem.title}"`, undefined, 'success');
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
      `ØªÙ… Ø­Ø°Ù "${targetItem.title}" Ù…Ù† Ø§Ù„Ø³Ù„Ø©`,
      undefined,
      'warning',
      'ØªØ±Ø§Ø¬Ø¹',
      () => {
        const restored = [...updated];
        restored.splice(index, 0, targetItem);
        setItems(restored);
        showNotice(`ØªÙ…Øª Ø§Ø³ØªØ¹Ø§Ø¯Ø© "${targetItem.title}"`, undefined, 'success');
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
      mode === 'official-wallets' ? 'Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯' : 'Ù…Ø³Ø§Ø± Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯',
      mode === 'official-wallets'
        ? 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø³Ø§Ø± Ù…Ø«Ø¨Øª Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ Ù„ÙØªØ­ Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø¹Ø¨Ø± WLT.'
        : 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø³Ø§Ø± Ù…Ø«Ø¨Øª Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ Ù„ÙØªØ­ Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø¹Ø¨Ø± WLT.',
      'info',
    );
  };

  const linkWalletInline = async () => {
    try {
      const result = await linkWallet();
      if (!result.success) {
        showNotice('ØªØ¹Ø°Ø± Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø©', 'Ù„Ù… ÙŠÙƒØªÙ…Ù„ Ø§Ù„Ø±Ø¨Ø·ØŒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.', 'danger');
        return;
      }

      await refreshWallet();
      showNotice('ØªÙ… Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø©', 'Ø£ØµØ¨Ø­ Ø®ÙŠØ§Ø± Ø§Ù„Ø¯ÙØ¹ Ù…Ù† Ø§Ù„Ø±ØµÙŠØ¯ Ù…ØªØ§Ø­Ù‹Ø§ Ø¹Ù†Ø¯ ÙƒÙØ§ÙŠØ© Ø§Ù„Ø±ØµÙŠØ¯.', 'success');
    } catch {
      showNotice('ØªØ¹Ø°Ø± Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø©', 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø±Ø¨Ø· Ø§Ù„Ù…Ø­Ù„ÙŠ Ù„Ù„Ù…Ø­ÙØ¸Ø©.', 'danger');
    }
  };

  // PREVIEW_ONLY: in-memory simulation â€” no real ledger write
  const topUpWalletInline = async (amountMinorUnits: number) => {
    try {
      const normalizedAmount = Math.max(amountMinorUnits, 0);
      if (!normalizedAmount) {
        showNotice('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ø¨Ù„Øº Ù…Ø·Ù„ÙˆØ¨ Ù„Ù„Ø´Ø­Ù†', 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø­Ø§Ù„ÙŠ ÙŠØºØ·ÙŠ Ø§Ù„Ø·Ù„Ø¨ Ø£Ùˆ Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª ÙƒØ§ÙÙŠØ©.', 'info');
        return;
      }

      await topUpWallet(normalizedAmount);
      await refreshWallet();
      showNotice('ØªÙ… Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯', `ØªÙ… Ø´Ø­Ù† ${formatMinorUnitsAmount(normalizedAmount)} ÙÙŠ Ø§Ù„Ù…Ø­ÙØ¸Ø©.`, 'success');
    } catch {
      showNotice('ØªØ¹Ø°Ø± Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯', 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ­Ø¯ÙŠØ« Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©.', 'danger');
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
          summary: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
          blockingReason: 'Ø§Ù†ØªØ¸Ø± Ø§ÙƒØªÙ…Ø§Ù„ Ù…Ø²Ø§Ù…Ù†Ø© Ø­Ø§Ù„Ø© Ø§Ù„Ø±Ø¨Ø· ÙˆØ§Ù„Ø±ØµÙŠØ¯ Ø«Ù… Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.',
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
            summary: 'Ø¯ÙØ¹ ØªØ¬Ø±ÙŠØ¨ÙŠ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© â€” Ø³ÙŠÙØ³Ø¬ÙŽÙ‘Ù„ Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'Ø§Ø¯ÙØ¹ ÙƒØ§Ù…Ù„ Ø§Ù„Ø·Ù„Ø¨ Ù…Ù† Ø±ØµÙŠØ¯ WLT Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ.',
          blockingReason: hasWltServiceRoute ? 'Ø§Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø£Ùˆ Ø§Ø´Ø­Ù†Ù‡Ø§ Ø¹Ø¨Ø± WLT Ø£ÙˆÙ„Ù‹Ø§ Ø«Ù… Ø£Ø¹Ø¯ Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±.' : 'Ù…Ø³Ø§Ø± Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
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
            summary: 'Ø¯ÙØ¹ ØªØ¬Ø±ÙŠØ¨ÙŠ Ø¬Ø²Ø¦ÙŠ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© â€” Ø³ÙŠÙØ³Ø¬ÙŽÙ‘Ù„ Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: walletBalance,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
          valid: false,
          summary: 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø£Ù‚Ù„ Ù…Ù† Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨.',
          blockingReason: `ØªØ­ØªØ§Ø¬ Ø´Ø­Ù† ${formattedWalletShortfall} Ù‚Ø¨Ù„ Ø§Ø¹ØªÙ…Ø§Ø¯ Ù‡Ø°Ø§ Ø§Ù„Ø®ÙŠØ§Ø±.`,
          feedbackTone: 'info',
        };
      }

      return {
        method: 'wallet',
        walletAmountMinorUnits: grandTotalMinorUnits,
        amountDueOnDeliveryMinorUnits: 0,
        valid: true,
        summary: 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠØŒ Ø³ÙŠØªÙ… Ø§Ù„Ø¯ÙØ¹ ÙƒØ§Ù…Ù„Ù‹Ø§ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
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
          summary: 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
          blockingReason: 'Ø§Ù†ØªØ¸Ø± Ø§ÙƒØªÙ…Ø§Ù„ Ø§Ù„Ù…Ø²Ø§Ù…Ù†Ø© Ù‚Ø¨Ù„ ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬.',
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
            summary: 'Ø¯ÙØ¹ Ù…Ø¯Ù…Ø¬ ØªØ¬Ø±ÙŠØ¨ÙŠ â€” Ø³ÙŠÙØ³Ø¬ÙŽÙ‘Ù„ Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'mixed',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬ ÙŠØ­ØªØ§Ø¬ Ø±ØµÙŠØ¯Ù‹Ø§ ÙØ¹Ù„ÙŠÙ‹Ø§ ÙÙŠ WLT.',
          blockingReason: 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬ Ø§Ù„Ø¢Ù†.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance >= grandTotalMinorUnits) {
        return {
          method: 'mixed',
          walletAmountMinorUnits: grandTotalMinorUnits,
          amountDueOnDeliveryMinorUnits: 0,
          valid: false,
          summary: 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
          blockingReason: 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©ØŒ Ù„Ø°Ù„Ùƒ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬ ØºÙŠØ± Ø¶Ø±ÙˆØ±ÙŠ.',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'mixed',
        walletAmountMinorUnits: walletBalance,
        amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
        valid: true,
        summary: `Ø³ÙŠÙØ®ØµÙ… ${formattedWalletBalance} Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ÙˆÙŠÙØ¯ÙØ¹ ${formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance)} Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….`,
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
          summary: 'Ø¯ÙØ¹ ØªØ¬Ø±ÙŠØ¨ÙŠ Ø¹Ø¨Ø± Ù…Ø­Ø§ÙØ¸ Ø±Ø³Ù…ÙŠØ© â€” Ø³ÙŠÙØ³Ø¬ÙŽÙ‘Ù„ Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'official-wallets',
        walletAmountMinorUnits: 0,
        amountDueOnDeliveryMinorUnits: 0,
        valid: false,
        summary: hasWltServiceRoute
          ? 'Ø³ÙŠØªÙ… ØªØ­ÙˆÙŠÙ„Ùƒ Ø¥Ù„Ù‰ WLT Ù„Ø§Ø®ØªÙŠØ§Ø± Ù…Ø­ÙØ¸Ø© Ø±Ø³Ù…ÙŠØ© ÙˆØ¥ÙƒÙ…Ø§Ù„ Ø§Ù„Ø¯ÙØ¹ Ø£Ùˆ Ø§Ù„Ø´Ø­Ù† Ø®Ø§Ø±Ø¬ Ù‡Ø°Ù‡ Ø§Ù„Ø´Ø§Ø´Ø©.'
          : 'Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
        blockingReason: hasWltServiceRoute
          ? 'Ø£ÙƒÙ…Ù„ Ø§Ù„Ø¯ÙØ¹ Ø£Ùˆ Ø§Ù„Ø´Ø­Ù† Ø¹Ø¨Ø± WLT Ø£ÙˆÙ„Ù‹Ø§ Ø«Ù… Ø¹Ø¯ Ù„Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø·Ù„Ø¨.'
          : 'Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
        feedbackTone: 'info',
      };
    }

    return {
      method: 'cod',
      walletAmountMinorUnits: 0,
      amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
      valid: true,
      summary: 'Ø³ØªØ¯ÙØ¹ ÙƒØ§Ù…Ù„ Ø§Ù„Ù…Ø¨Ù„Øº Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….',
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
      // SSoT: COD only available for bthwani_delivery â€” gated by codAllowedForMode.
      ...(codAllowedForMode ? [{
        id: 'cod',
        title: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
        description: 'Ø§Ø¯ÙØ¹ ÙƒØ§Ù…Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….',
        selected: paymentMethod === 'cod',
        statusLabel: paymentMethod === 'cod' ? 'Ù…Ø­Ø¯Ø¯' : 'Ø¬Ø§Ù‡Ø² Ø§Ù„Ø¢Ù†',
        statusTone: paymentMethod === 'cod' ? 'brand' : 'info',
        amountRows: [
          { label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: formatMinorUnitsAmount(0), tone: 'muted' },
          { label: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formatMinorUnitsAmount(grandTotalMinorUnits), tone: 'brand' },
        ],
        helperText: paymentMethod === 'cod' ? 'Ù„Ø§ ÙŠØ³ØªØ®Ø¯Ù… Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©.' : undefined,
        helperTone: 'info' as const,
        onSelect: () => setPaymentMethod('cod'),
      } satisfies PaymentDecisionOption] : []),
      {
        id: 'wallet',
        title: 'Ù…Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©',
        description: 'Ø§Ø¯ÙØ¹ ÙƒØ§Ù…Ù„ Ø§Ù„Ø·Ù„Ø¨ Ù…Ù† Ø±ØµÙŠØ¯ WLT Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ.',
        selected: paymentMethod === 'wallet',
        disabled: walletPending || (!canUseWalletFull && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'wallet' ? 'Ù…Ø­Ø¯Ø¯' : walletPending ? 'Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ù‚Ù‚' : canUseWalletFull ? 'Ø¬Ø§Ù‡Ø² Ø§Ù„Ø¢Ù†' : EXPERIMENTAL_PAYMENT_ENABLED ? 'ØªØ¬Ø±ÙŠØ¨ÙŠ' : !walletLinked ? 'ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡' : walletBalance <= 0 ? 'ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡' : 'ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡',
        statusTone: paymentMethod === 'wallet' ? 'brand' : walletPending ? 'info' : canUseWalletFull ? 'success' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'warning',
        amountRows: canUseWalletFull
          ? [
              { label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: formatMinorUnitsAmount(grandTotalMinorUnits), tone: 'brand' },
              { label: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formatMinorUnitsAmount(0), tone: 'muted' },
            ]
          : walletLinked
            ? [
                { label: 'Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø­Ø§Ù„ÙŠ', value: formattedWalletBalance, tone: 'brand' },
                { label: 'Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ Ø´Ø­Ù†Ù‡', value: formattedWalletShortfall, tone: 'muted' },
              ]
            : [
                { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨', value: formattedGrandTotal, tone: 'brand' },
                { label: 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: 'ØºÙŠØ± Ù…Ø±ØªØ¨Ø·Ø©', tone: 'muted' },
              ],
        helperText: canUseWalletFull
          ? 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„ÙƒØ§Ù…Ù„.'
          : walletPending
            ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø­Ø§Ù„Ø© Ø§Ù„Ø±Ø¨Ø· ÙˆØ§Ù„Ø±ØµÙŠØ¯...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'Ø§Ø±Ø¨Ø· Ù…Ø­ÙØ¸ØªÙƒ Ø£ÙˆÙ„Ù‹Ø§ Ø¹Ø¨Ø± WLT.' : 'Ù…Ø³Ø§Ø± Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.')
            : walletBalance <= 0
              ? 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ Ù…ØªØ§Ø­ Ø§Ù„Ø¢Ù†.'
              : `Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ Ù„Ù„Ø´Ø­Ù† ${formattedWalletShortfall}.`,
        helperTone: canUseWalletFull ? 'success' : 'info',
        action: canUseWalletFull
          ? undefined
          : {
              label: walletLinked ? 'Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯' : 'Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø©',
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
        title: 'Ù…Ø­ÙØ¸Ø© + Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…',
        description: 'Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…ØªØ§Ø­ ÙˆØ§Ø¯ÙØ¹ Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù….',
        selected: paymentMethod === 'mixed',
        disabled: walletPending || (!canUseMixedPayment && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'mixed' ? 'Ù…Ø­Ø¯Ø¯' : walletPending ? 'Ù‚ÙŠØ¯ Ø§Ù„ØªØ­Ù‚Ù‚' : canUseMixedPayment ? 'Ø¬Ø§Ù‡Ø² Ø§Ù„Ø¢Ù†' : EXPERIMENTAL_PAYMENT_ENABLED ? 'ØªØ¬Ø±ÙŠØ¨ÙŠ' : !walletLinked ? 'ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡' : walletBalance <= 0 ? 'ÙŠØªØ·Ù„Ø¨ Ø¥Ø¬Ø±Ø§Ø¡' : 'ØºÙŠØ± Ø¶Ø±ÙˆØ±ÙŠ',
        statusTone: walletPending ? 'info' : canUseMixedPayment ? (paymentMethod === 'mixed' ? 'brand' : 'info') : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'info',
        amountRows: canUseMixedPayment
          ? [
              { label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: formattedWalletBalance, tone: 'brand' },
              { label: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance), tone: 'brand' },
            ]
          : [
              { label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: walletLinked ? formattedWalletBalance : formatMinorUnitsAmount(0), tone: 'muted' },
              { label: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formattedGrandTotal, tone: 'brand' },
            ],
        helperText: canUseMixedPayment
          ? `Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ${formattedWalletBalance}ØŒ ÙˆØ¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… ${formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance)}.`
          : walletPending
            ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø©...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'Ø§ÙØªØ­ WLT Ù„Ø±Ø¨Ø· Ø§Ù„Ù…Ø­ÙØ¸Ø©.' : 'Ù…Ø³Ø§Ø± Ø´Ø­Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¨Ø¹Ø¯ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.')
            : walletBalance <= 0
              ? 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„Ù…Ø¯Ù…Ø¬.'
              : 'Ø§Ù„Ø±ØµÙŠØ¯ ÙŠÙƒÙÙŠ Ù„Ù„Ø¯ÙØ¹ Ø§Ù„ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.',
        helperTone: 'info',
        action: canUseMixedPayment || walletBalance >= grandTotalMinorUnits
          ? undefined
          : {
              label: !walletLinked ? 'ÙØªØ­ WLT' : 'Ø´Ø­Ù† Ø§Ù„Ø±ØµÙŠØ¯',
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
        title: 'Ø§Ù„Ø¯ÙØ¹ Ø¹Ø¨Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ©',
        description: 'Ø§Ø®ØªØ± Ù…Ø­ÙØ¸Ø© Ø±Ø³Ù…ÙŠØ© ÙˆØ£ÙƒÙ…Ù„ Ø¹Ø¨Ø± WLT.',
        selected: paymentMethod === 'official-wallets',
        disabled: !hasWltServiceRoute && !EXPERIMENTAL_PAYMENT_ENABLED,
        statusLabel: paymentMethod === 'official-wallets' ? 'Ù…Ø­Ø¯Ø¯' : hasWltServiceRoute ? 'Ù…Ø³Ø§Ø± Ø®Ø§Ø±Ø¬ÙŠ' : EXPERIMENTAL_PAYMENT_ENABLED ? 'ØªØ¬Ø±ÙŠØ¨ÙŠ' : 'ØºÙŠØ± Ù…ÙˆØµÙˆÙ„',
        statusTone: paymentMethod === 'official-wallets' ? 'brand' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : 'info',
        amountRows: [
          { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø·Ù„Ø¨', value: formattedGrandTotal, tone: 'brand' },
        ],
        helperText: hasWltServiceRoute
          ? 'Ø®ÙŠØ§Ø± Ù…Ø³ØªÙ‚Ù„ Ø¹Ù† Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ.'
          : 'Ù‡Ø°Ø§ Ø§Ù„Ø®ÙŠØ§Ø± ÙŠØ­ØªØ§Ø¬ Ø±Ø¨Ø· Ù…Ø³Ø§Ø± Ø§Ù„Ù…Ø­Ø§ÙØ¸ Ø§Ù„Ø±Ø³Ù…ÙŠØ© Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
        helperTone: 'info',
        action: {
          label: hasWltServiceRoute ? (walletLinked ? 'Ø§Ø®ØªÙŠØ§Ø± Ù…Ø­ÙØ¸Ø© Ø±Ø³Ù…ÙŠØ©' : 'ÙØªØ­ WLT') : 'Ø§Ù„Ù…Ø³Ø§Ø± ØºÙŠØ± Ù…ÙˆØµÙˆÙ„',
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
      return 'Ø§Ù„Ø¢Ù†';
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
      { label: 'Ø¹Ø¯Ø¯ Ø§Ù„Ø¹Ù†Ø§ØµØ±', value: `${totalItemsCount} Ø¹Ù†Ø§ØµØ±` },
      { label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª', value: formattedSubtotal },
      { label: 'Ø±Ø³ÙˆÙ… Ø§Ù„ØªÙˆØµÙŠÙ„', value: formattedDelivery },
      { label: 'Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹', value: paymentMethodLabel, helper: paymentSelection.summary },
      { label: 'Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©', value: formatMinorUnitsAmount(paymentSelection.walletAmountMinorUnits) },
      { label: 'Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…', value: formatMinorUnitsAmount(paymentSelection.amountDueOnDeliveryMinorUnits) },
      { label: 'Ø®ÙŠØ§Ø± Ø§Ù„ØªÙˆØµÙŠÙ„', value: fulfillmentModeMeta.label },
      { label: locationTitle, value: locationSubtitle },
      { label: 'ÙˆÙ‚Øª Ø§Ù„ØªÙ†ÙÙŠØ°', value: executionTimingSummary },
    ];

    if (formattedDiscount) {
      items.splice(3, 0, { label: 'Ø§Ù„Ø®ØµÙ…', value: formattedDiscount });
    }

    if (couponCode) {
      items.push({ label: 'Ø§Ù„Ù‚Ø³ÙŠÙ…Ø©', value: couponCode });
    }

    if (note !== 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø©') {
      items.push({ label: 'Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø·Ù„Ø¨', value: note });
    }

    if (selectedFulfillmentMode === 'bthwani_delivery' && extraRequest) {
      items.push({ label: 'Ø¹Ù„Ù‰ Ø·Ø±ÙŠÙ‚ÙŠ', value: extraRequest });
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
      showNotice('Ø§Ù„Ø·Ù„Ø¨ Ù‚ÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ°', 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¨Ø§Ù„ÙØ¹Ù„. Ø§Ù„ØªØ¹Ø¯ÙŠÙ„ ÙŠØªÙ… Ø¹Ø¨Ø± ÙØ±ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ÙÙ‚Ø·.', 'info');
      return false;
    }

    if (!canCheckout) {
      showNotice(clientStateMeta.label, clientStateMeta.description, 'info');
      return false;
    }

    if (!checkoutAction) {
      showNotice('ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨ Ù…Ø­Ø¬ÙˆØ¨', 'Ø²Ø± Ø§Ù„ØªÙ†ÙÙŠØ° Ø¬Ø§Ù‡Ø² UI Ù„ÙƒÙ† Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„ØªØ§Ù„ÙŠ ØºÙŠØ± Ù…ÙˆØµÙˆÙ„ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø¹Ø±Ø¶.', 'info');
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
      showNotice('ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ', paymentSelection.summary, 'success');
      await Promise.resolve(checkoutAction?.(checkoutPayload));
      return;
    }

    if (paymentSelection.method === 'wallet') {
      setCheckoutLoading(true);
      try {
        const paymentResult = await requestWalletPayment(paymentSelection.walletAmountMinorUnits);
        await refreshWallet();
        if (!paymentResult.success) {
          showNotice('ØªØ¹Ø°Ø± Ø®ØµÙ… Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø­ÙØ¸Ø©', paymentResult.error === 'insufficient_balance' ? 'Ø§Ù„Ø±ØµÙŠØ¯ Ù„Ù… ÙŠØ¹Ø¯ ÙƒØ§ÙÙŠÙ‹Ø§ Ø¨Ø¹Ø¯ Ø¢Ø®Ø± ØªØ­Ø¯ÙŠØ«.' : 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªÙ‡ÙŠØ¦Ø© Ø§Ù„Ø¯ÙØ¹ Ù…Ù† Ø§Ù„Ù…Ø­ÙØ¸Ø©.', 'danger');
          return;
        }

        await Promise.resolve(checkoutAction?.(checkoutPayload));
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
    // This is the real code-level gate â€” not a doc claim.
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
            store_closed: 'Ø§Ù„Ù…ØªØ¬Ø± Ù…ØºÙ„Ù‚ Ø­Ø§Ù„ÙŠÙ‹Ø§ØŒ ÙŠÙØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ù‹Ø§.',
            delivery_zone_unavailable: 'Ù…ÙˆÙ‚Ø¹Ùƒ Ø®Ø§Ø±Ø¬ Ù†Ø·Ø§Ù‚ Ø§Ù„ØªÙˆØµÙŠÙ„ Ù„Ù‡Ø°Ø§ Ø§Ù„Ù…ØªØ¬Ø±.',
            items_unavailable: 'Ø¨Ø¹Ø¶ Ø¹Ù†Ø§ØµØ± Ø§Ù„Ø³Ù„Ø© ØºÙŠØ± Ù…ØªØ§Ø­Ø© Ø­Ø§Ù„ÙŠÙ‹Ø§.',
            partner_not_ready: 'Ø§Ù„Ø´Ø±ÙŠÙƒ ØºÙŠØ± Ø¬Ø§Ù‡Ø² Ù„Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¢Ù†.',
          };
          const reason = serviceability.reason_code ?? 'unknown';
          showNotice(
            'Ø§Ù„ØªÙˆØµÙŠÙ„ ØºÙŠØ± Ù…ØªØ§Ø­',
            reasonMessages[reason] ?? 'ØªØ¹Ø°Ø± Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø·Ù„Ø¨ â€” Ø§Ù„Ù…ØªØ¬Ø± Ø£Ùˆ Ø§Ù„Ù…ÙˆÙ‚Ø¹ ØºÙŠØ± Ù…ØªØ§Ø­ Ø­Ø§Ù„ÙŠÙ‹Ø§.',
            'danger',
          );
          return;
        }
      } catch {
        // Network failure â€” do not block checkout, let intent creation handle it.
        showNotice('ØªØ­Ù‚Ù‚ Ø§Ù„ØªÙˆÙØ±', 'ØªØ¹Ø°Ø± Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„ØªÙˆÙØ± â€” Ø³ÙŠØªÙ… Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ø¹Ù†Ø¯ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨.', 'info');
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
      showNotice('ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨ ØºÙŠØ± Ù…ØªØ§Ø­ Ø§Ù„Ø¢Ù†', 'Ø²Ø± Ø§Ù„ØªØ¹Ø¯ÙŠÙ„ ÙŠØ­ØªØ§Ø¬ Ù…Ø³Ø§Ø± Ø±Ø¬ÙˆØ¹ Ø£Ùˆ ØªØ­Ø±ÙŠØ± Ù…ÙˆØµÙˆÙ„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø¶ÙŠÙ.', 'info');
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
    showNotice('ØªÙ… ØªØ­Ø¯ÙŠØ« Ø®ÙŠØ§Ø± Ø§Ù„ØªÙˆØµÙŠÙ„', getDeliveryModeSelectionSummary(mode), 'success');
  };

  const handlePickupLocationPreview = () => {
    if (!hasStorePickupLocation) {
      showNotice('Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…Ø­Ø¯Ø¯', 'Ù„Ù… ÙŠØ±Ø³Ù„ Ø§Ù„Ù…ØªØ¬Ø± Ù…ÙˆÙ‚Ø¹ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ø¨Ø¹Ø¯.', 'info');
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
      address: clientAddress === 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø­Ø¯Ø¯ Ø¨Ø¹Ø¯' ? '' : clientAddress,
      note: note === 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø©' ? '' : note,
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
          showNotice('Ù„Ø§ ØªÙˆØ¬Ø¯ Ù‚Ø³Ø§Ø¦Ù… Ù†Ø´Ø·Ø©', 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø¹Ø±Ø¶ Ù‚Ø³ÙŠÙ…Ø© Ù†Ø´Ø· Ø­Ø§Ù„ÙŠØ§Ù‹ Ù„Ù‡Ø°Ø§ Ø§Ù„Ù…ØªØ¬Ø±.', 'warning');
          return;
        }
      }
      setCouponCode(trimmedValue);
      showNotice(
        trimmedValue ? 'ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù‚Ø³ÙŠÙ…Ø©' : 'Ø£Ø²Ù„Øª Ø§Ù„Ù‚Ø³ÙŠÙ…Ø© Ø§Ù„Ù…Ø­Ù„ÙŠØ©',
        trimmedValue ? `Ø§Ù„Ù‚Ø³ÙŠÙ…Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©: ${trimmedValue}` : 'Ù„Ù† ÙŠØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø£ÙŠ Ù‚Ø³ÙŠÙ…Ø© Ù…Ø¹ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø­Ø§Ù„ÙŠ.',
        'success',
      );
    }

    if (quickActionKey === 'address') {
      const nextLocation = trimmedValue || 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø­Ø¯Ø¯ Ø¨Ø¹Ø¯';
      setClientAddress(nextLocation);
      showNotice(
        `ØªÙ… ØªØ­Ø¯ÙŠØ« ${locationTitle}`,
        trimmedValue || 'ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…ÙˆÙ‚Ø¹ ÙƒØ­Ø§Ù„Ø© ØºÙŠØ± Ù…Ø­Ø¯Ø¯Ø© Ø­ØªÙ‰ ÙŠØªÙ… Ø¥Ø¯Ø®Ø§Ù„Ù‡ Ù„Ø§Ø­Ù‚Ù‹Ø§.',
        'success',
      );
    }

    if (quickActionKey === 'note') {
      const nextNote = trimmedValue || 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø©';
      setNote(nextNote);
      showNotice('ØªÙ… ØªØ­Ø¯ÙŠØ« Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø©', nextNote, 'success');
    }

    if (quickActionKey === 'extra') {
      setExtraRequest(trimmedValue);
      showNotice(
        trimmedValue ? 'ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„Ø¥Ø¶Ø§ÙÙŠ' : 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø¨ Ø¥Ø¶Ø§ÙÙŠ Ù…Ø­ÙÙˆØ¸',
        trimmedValue || 'ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø¶Ø§ÙØ© Ø·Ù„Ø¨ Ø¥Ø¶Ø§ÙÙŠ Ù„Ø§Ø­Ù‚Ù‹Ø§ Ø¹Ù†Ø¯ Ø§Ù„Ø­Ø§Ø¬Ø©.',
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
      setPreviewFeedback({ message: 'Ø²Ø§Ø¯Øª Ø§Ù„ÙƒÙ…ÙŠØ©', tone: 'success' });
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
    setPreviewFeedback({ message: 'ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ©', tone: 'success' });
  };

  const handleOpenFirstRecommendationPreview = () => {
    const firstProduct = RECOMMENDED_PRODUCTS[0];
    if (firstProduct) {
      openProductPreview(firstProduct);
    }
  };

  const handleSubscribePress = () => {
    showNotice('Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ Ø¬Ø§Ù‡Ø² UI ÙÙ‚Ø·', 'Ø²Ø± Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ ÙˆØ§Ø¶Ø­ ÙˆÙØ¹Ø§Ù„ØŒ Ù„ÙƒÙ† ØªÙØ¹ÙŠÙ„ Ø§Ù„Ù…ÙŠØ²Ø© ÙŠØ­ØªØ§Ø¬ Ø±Ø¨Ø·Ù‹Ø§ Ù„Ø§Ø­Ù‚Ù‹Ø§ Ø®Ø§Ø±Ø¬ Ù‡Ø°Ø§ Ø§Ù„Ù†Ø·Ø§Ù‚.', 'info');
  };

  const handleOpenStore = () => {
    if (props.onOpenStore) {
      props.onOpenStore();
    } else {
      showNotice('ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ù…ØªØ¬Ø± ØºÙŠØ± Ù…ÙˆØµÙˆÙ„Ø©', 'Ø²Ø± Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬Ø§Øª Ø£Ø®Ø±Ù‰ Ø¬Ø§Ù‡Ø²ØŒ ÙˆÙ„ÙƒÙ† Ù„Ù… ÙŠØªÙ… ØªÙ…Ø±ÙŠØ± Ù…Ø³Ø§Ø± ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ù…ØªØ¬Ø± ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ.', 'info');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <TopBar
        variant="secondary"
        title="ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨"
        titleSlot={(
          <Text style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: '900', lineHeight: 20, maxWidth: '100%', flexShrink: 1, minWidth: 0, textAlign: 'center' }} numberOfLines={1}>
            ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨
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
              borderRadius: 16,
              paddingHorizontal: spacing[2],
              paddingVertical: spacing[1.5],
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: spacing[1.5],
            }}
          >
            <Icon name="alert-circle-outline" size={20} color={colorPalette.warningStrong} />
            <Text role="bodySm" style={{ color: colorPalette.warningStrong, textAlign: isRTL ? 'right' : 'left', flex: 1, fontWeight: '700', lineHeight: 18 }}>
              {props.reorderAlertMessage}
            </Text>
          </Surface>
        ) : null}
        <PromoBanner onPress={handleSubscribePress} />

        <Surface
          tone="inset"
          padding={2}
          gap={1}
          style={{ backgroundColor: colorPalette.surfaceSecondary, borderRadius: 16, borderWidth: 1, borderColor: BORDER_SOFT }}
        >
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1.5] }}>
            <View style={{ flex: 1, gap: spacing[0.5], alignItems: 'flex-end' }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right' }}>
                Ø³ÙŠØ§Ø³Ø© ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨
              </Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                {checkoutFlowSummary?.nextPolicyActionPreview ?? 'Ù‡Ø°Ù‡ Ø§Ù„Ø´Ø§Ø´Ø© ØªØ¹Ø±Ø¶ Ø§Ù„Ù…Ù„Ø®Øµ Ø£ÙˆÙ„Ù‹Ø§ØŒ ÙˆØªÙØªØ­ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªÙØµÙŠÙ„ÙŠØ© Ø¹Ù†Ø¯ Ø§Ù„Ø·Ù„Ø¨ ÙÙ‚Ø·.'}
              </Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                {`Ø§Ù„Ø£Ø«Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ§Øª Ø§Ù„Ù…Ø±Ø¬Ø¹ÙŠØ© ÙŠØªØ¨Ø¹Ø§Ù† ${resolveDshControlPanelSectionLabel('finance')} ÙˆWLTØŒ Ø¨ÙŠÙ†Ù…Ø§ Ø§Ù„Ø³ÙŠØ§Ø³Ø© Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠØ© Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØ© ØªØªØ¨Ø¹ ${resolveDshControlPanelSectionLabel('platform')}.`}
              </Text>
            </View>
            <Text role="caption" style={{ color: ACCENT_ORANGE, fontWeight: '800', textAlign: 'right' }}>
              {resolveCheckoutPolicyLabel(checkoutFlowPolicy)}
            </Text>
          </View>
        </Surface>

        <Surface tone="default" gap={0} style={{ backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 16, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[2], gap: spacing[1.5], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <Surface tone="inset" padding={2} gap={1} style={{ borderRadius: 16 }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', gap: spacing[1.5], flex: 1 }}>
                  <Icon name={fulfillmentModeMeta.icon} size={18} color={TEXT_PRIMARY} />
                  <View style={{ flex: 1, gap: spacing[0.5], alignItems: 'flex-end' }}>
                    <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right' }}>
                      Ø®ÙŠØ§Ø± Ø§Ù„ØªÙˆØµÙŠÙ„
                    </Text>
                    <Text role="caption" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>
                      {deliveryModeSelectionSummary}
                    </Text>
                    <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                      Ø¥Ø°Ø§ Ø£Ø±Ø¯Øª ØªØºÙŠÙŠØ±Ù‡ Ø§Ø¶ØºØ· Ù‡Ù†Ø§
                    </Text>
                  </View>
                </View>
                <Button
                  label="ØªØºÙŠÙŠØ±"
                  tone="secondary"
                  size="sm"
                  fullWidth={false}
                  onPress={toggleDeliveryModePicker}
                />
              </View>
            </Surface>
            {deliveryModePickerOpen && (
              <View style={{ gap: spacing[1] }}>
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
                        borderRadius: 16,
                        paddingHorizontal: spacing[2],
                        paddingVertical: spacing[1.5],
                      }}
                    >
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1.5] }}>
                        <Icon name={option.icon} size={18} color={isSelected ? ACCENT_ORANGE : TEXT_PRIMARY} />
                        <View style={{ flex: 1, gap: spacing[0.5], alignItems: 'flex-end' }}>
                          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
                            <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right' }}>
                              {option.label}
                            </Text>
                            {isSelected && (
                              <Text role="caption" style={{ color: ACCENT_ORANGE, textAlign: 'right' }}>
                                Ù…Ø­Ø¯Ø¯
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
            title="Ù‡Ù„ Ù„Ø¯ÙŠÙƒ Ù‚Ø³ÙŠÙ…Ø© ØªØ®ÙÙŠØ¶ØŸ"
            subtitle={couponCode ? `Ø§Ù„Ù‚Ø³ÙŠÙ…Ø© Ø§Ù„Ø­Ø§Ù„ÙŠØ©: ${couponCode}` : 'Ø£Ø¯Ø®Ù„ Ø±Ù…Ø² Ø§Ù„ØªØ®ÙÙŠØ¶ Ø¥Ù† ÙˆØ¬Ø¯'}
            actionLabel={couponCode ? 'ØªØ¹Ø¯ÙŠÙ„' : 'Ø¥Ø¶Ø§ÙØ©'}
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
                onClose={closeQuickAction}
              />
            </View>
          )}
          <View style={{ paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <Surface tone="inset" padding={2} gap={1} style={{ borderRadius: 16 }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
                <View style={{ flex: 1, gap: spacing[0.5], alignItems: 'flex-end' }}>
                  <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right' }}>
                    {locationTitle}
                  </Text>
                  <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
                    {locationSubtitle}
                  </Text>
                </View>
                <Button
                  label={isPickupMode ? 'Ø¹Ø±Ø¶ Ø§Ù„Ù…ÙˆÙ‚Ø¹' : 'ØªØºÙŠÙŠØ±'}
                  tone="secondary"
                  size="sm"
                  fullWidth={false}
                  disabled={isPickupMode && !hasStorePickupLocation}
                  onPress={isPickupMode ? handlePickupLocationPreview : () => openQuickAction('address')}
                />
              </View>
            </Surface>
          </View>
          {quickActionKey === 'address' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={closeQuickAction}
              />
            </View>
          )}
          <View style={{ paddingHorizontal: spacing[3], paddingBottom: spacing[2] }}>
            <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
              {deliveryNotice}
            </Text>
          </View>
          <OptionRow
            title="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø·Ù„Ø¨"
            subtitle={note}
            actionLabel={note === 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø©' ? 'Ø¥Ø¶Ø§ÙØ©' : 'ØªØ¹Ø¯ÙŠÙ„'}
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
                onClose={closeQuickAction}
              />
            </View>
          )}
          {selectedFulfillmentMode === 'bthwani_delivery' && (
            <OptionRow
              title="Ø¹Ù„Ù‰ Ø·Ø±ÙŠÙ‚ÙŠ"
              subtitle={extraRequest || 'Ø£Ø¶Ù Ø´ÙŠØ¦Ù‹Ø§ Ø¨Ø³ÙŠØ·Ù‹Ø§ Ù…Ù† Ø·Ø±ÙŠÙ‚ Ø§Ù„ÙƒØ§Ø¨ØªÙ†'}
              actionLabel={extraRequest ? 'ØªØ¹Ø¯ÙŠÙ„' : 'Ø¥Ø¶Ø§ÙØ©'}
              onAction={() => openQuickAction('extra')}
              style={{ paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
            />
          )}
          {quickActionKey === 'extra' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
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

        <Card title="ÙˆÙ‚Øª Ø§Ù„ØªÙ†ÙÙŠØ°" subtitle="Ø§Ø®ØªØ± ÙˆÙ‚Øª ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨" padding={2} gap={1}>
          <View style={{ gap: spacing[1] }}>
            <SegmentedControl
              options={[
                { value: 'now', label: 'Ø§Ù„Ø¢Ù†' },
                { value: 'later', label: 'ÙÙŠ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚' },
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
                Ø³ÙŠØªÙ… ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø¹Ø¯ Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø³Ù„Ø©.
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
            <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', flex: 1, textAlign: 'right' }}>Ù‚Ø±Ø§Ø± Ø§Ù„Ø¯ÙØ¹</Text>
            {EXPERIMENTAL_PAYMENT_ENABLED ? (
              <View style={{ backgroundColor: colorPalette.warningSoft, borderRadius: 8, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
                <Text role="caption" style={{ color: colorPalette.warning, fontWeight: '700' }}>ØªØ¬Ø±ÙŠØ¨ÙŠ</Text>
              </View>
            ) : null}
          </View>
          {/* WLT finance preview notice â€” payment display is preview-only, not a real executed payment */}
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right', paddingHorizontal: spacing[1] }}>
            Ù…Ø¹Ø§ÙŠÙ†Ø© Ø¯ÙØ¹ â€” ØºÙŠØ± Ù…Ù†ÙØ°Ø© Ù…Ø§Ù„ÙŠÙ‹Ø§ Â· WLT ÙŠÙ…Ù„Ùƒ Ù…Ù†Ø·Ù‚ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„ÙØ¹Ù„ÙŠ
          </Text>
          <PaymentDecisionList items={paymentDecisionOptions} />
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
            showNotice('ØªÙ… ØªÙØ±ÙŠØº Ø§Ù„Ø³Ù„Ø©', 'ÙŠÙ…ÙƒÙ†Ùƒ ÙØªØ­ Ø£ÙˆÙ„ Ù…Ù†ØªØ¬ Ù…Ù‚ØªØ±Ø­ Ø£Ùˆ Ø§Ø®ØªÙŠØ§Ø± Ø£ÙŠ Ø¨Ø·Ø§Ù‚Ø© Ù…Ù† Ø§Ù„Ù…Ù‚ØªØ±Ø­Ø§Øª Ø£Ø¯Ù†Ø§Ù‡.', 'success');
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
            label={isOrderSubmitted ? 'Ø§Ù„Ø·Ù„Ø¨ Ù‚ÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ°' : canCheckout ? 'ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨' : 'Ø£Ø¶Ù Ø¹Ù†Ø§ØµØ± Ø£ÙˆÙ„Ø§Ù‹'}
            tone="brand"
            size="md"
            fullWidth={false}
            disabled={isOrderSubmitted || !canCheckout || checkoutLoading}
            loading={checkoutLoading}
            onPress={handleCheckoutPress}
            style={{ flex: 2, minHeight: 52, borderRadius: 18, opacity: isOrderSubmitted ? 0.6 : 1 }}
          />
          <Button
            label={isOrderSubmitted ? 'Ø·Ù„Ø¨ ØªØ¹Ø¯ÙŠÙ„ Ø¹Ø¨Ø± Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª' : 'ØªØ¹Ø¯ÙŠÙ„'}
            tone="secondary"
            size="md"
            fullWidth={false}
            disabled={!canEditOrder}
            onPress={isOrderSubmitted ? undefined : handleEditPress}
            style={{ flex: 1, minHeight: 52, borderRadius: 18 }}
          />
        </View>
      </View>

      <SheetFrame visible={checkoutReviewVisible} title="Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø·Ù„Ø¨" onClose={() => setCheckoutReviewVisible(false)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing[3], paddingBottom: Math.max(androidSystemBottomInset, safeArea.comfortable) }}
        >
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
            Ø±Ø§Ø¬Ø¹ ÙƒÙ„ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨ Ù‚Ø¨Ù„ ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ° Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ.
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
            {`Ù‡Ø°Ø§ Ù‡Ùˆ Ù…Ø³Ø§Ø± Ø§Ù„ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ Ù…Ù† Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠ: ${resolveCheckoutPolicyLabel(checkoutFlowPolicy)}.`}
          </Text>
          <SummaryCard
            items={checkoutReviewItems}
            totalLabel="Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠ"
            totalValue={formattedGrandTotal}
            padding={2}
            gap={2}
          />
          <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
            <Button
              label="ØªØ£ÙƒÙŠØ¯ Ø§Ù„ØªÙ†ÙÙŠØ°"
              tone="brand"
              fullWidth={false}
              disabled={checkoutLoading}
              loading={checkoutLoading}
              onPress={confirmCheckoutReview}
              style={{ flex: 1, minHeight: 50, borderRadius: 16, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY }}
            />
            <Button
              label="Ø±Ø¬ÙˆØ¹ Ù„Ù„ØªØ¹Ø¯ÙŠÙ„"
              tone="secondary"
              fullWidth={false}
              disabled={checkoutLoading}
              onPress={() => setCheckoutReviewVisible(false)}
              style={{ flex: 1, minHeight: 50, borderRadius: 16 }}
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
        cartQty={previewCartQty}
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
