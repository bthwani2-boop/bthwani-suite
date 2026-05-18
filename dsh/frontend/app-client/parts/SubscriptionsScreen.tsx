import React from 'react';
import { View } from 'react-native';
import {
  Badge,
  Box,
  Button,
  Surface,
  Text,
  spacing,
  useTheme,
} from '@bthwani/ui-kit';
import { subscriptionHeroCopy, subscriptionPlanCards } from '../data/subscriptions-commercial.preview-data';

export type DshSubscriptionsScreenProps = {
  title?: string;
  compact?: boolean;
  onStatusChange?: (message: string) => void;
};

function resolveRenewalLabel(cadence?: string) {
  if (!cadence) {
    return 'تتجدد حسب الباقة المختارة';
  }

  return cadence.includes('أسبوع') ? 'تتجدد أسبوعيًا' : 'تتجدد شهريًا';
}

function resolvePaymentSummary(cadence?: string) {
  if (!cadence) {
    return 'من وسيلة الدفع المحفوظة';
  }

  return cadence.includes('أسبوع')
    ? 'من وسيلة الدفع المحفوظة للاشتراك الأسبوعي'
    : 'من وسيلة الدفع المحفوظة للاشتراك الشهري';
}

function SubscriptionActionRow({
  title,
  subtitle,
  helperText,
  badgeLabel,
  badgeTone,
  actionLabel,
  onActionPress,
  showDivider = false,
}: {
  title: string;
  subtitle: string;
  helperText?: string;
  badgeLabel?: string;
  badgeTone?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'info';
  actionLabel?: string;
  onActionPress?: () => void;
  showDivider?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        borderTopWidth: showDivider ? 1 : 0,
        borderTopColor: theme.line,
        paddingTop: showDivider ? spacing[3] : 0,
        marginTop: showDivider ? spacing[3] : 0,
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing[3],
        }}
      >
        <View style={{ flex: 1, alignItems: 'flex-end', gap: spacing[1] }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: spacing[2],
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {badgeLabel ? <Badge label={badgeLabel} tone={badgeTone ?? 'default'} /> : null}
            <Text role="bodyStrong" numberOfLines={1} style={{ textAlign: 'right' }}>
              {title}
            </Text>
          </View>
          <Text role="bodySm" tone="muted" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
            {subtitle}
          </Text>
          {helperText ? (
            <Text role="caption" tone="soft" numberOfLines={2} style={{ textAlign: 'right', width: '100%' }}>
              {helperText}
            </Text>
          ) : null}
        </View>

        {actionLabel ? (
          <Button
            label={actionLabel}
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={onActionPress}
          />
        ) : null}
      </View>
    </View>
  );
}

export function DshSubscriptionsScreen({
  title = 'الاشتراك',
  compact = false,
  onStatusChange,
}: DshSubscriptionsScreenProps = {}) {
  const { theme } = useTheme();
  const defaultPlan = subscriptionPlanCards.find((plan) => plan.current) ?? subscriptionPlanCards[0];
  const [selectedPlanId, setSelectedPlanId] = React.useState(defaultPlan?.id ?? '');
  const [showPlanOptions, setShowPlanOptions] = React.useState(false);
  const activePlan = subscriptionPlanCards.find((plan) => plan.id === selectedPlanId) ?? defaultPlan;
  const alternativePlans = subscriptionPlanCards.filter((plan) => plan.id !== activePlan?.id);

  const content = (
    <Box gap={3}>
      {!compact ? (
        <Box gap={1} style={{ alignItems: 'flex-end' }}>
          <Text role="titleSm" style={{ textAlign: 'right' }}>
            {title}
          </Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
            الخطة الحالية فقط، مع التبديل عند الحاجة بدل عرض جميع الباقات دفعة واحدة.
          </Text>
        </Box>
      ) : null}

      {activePlan ? (
        <Box gap={0}>
          <SubscriptionActionRow
            title={activePlan.title}
            subtitle={`${activePlan.price} • ${activePlan.cadence}`}
            helperText={activePlan.highlight}
            badgeLabel={subscriptionHeroCopy.eyebrow}
            badgeTone="brand"
            actionLabel="تغيير"
            onActionPress={() => setShowPlanOptions((current) => !current)}
          />
          <SubscriptionActionRow
            title="التجديد"
            subtitle={resolveRenewalLabel(activePlan.cadence)}
            helperText={activePlan.note}
            badgeLabel="التالي"
            badgeTone="info"
            actionLabel="راجع"
            onActionPress={() => onStatusChange?.(`التجديد الحالي: ${resolveRenewalLabel(activePlan.cadence)}.`)}
            showDivider
          />
          <SubscriptionActionRow
            title="طريقة الدفع"
            subtitle={resolvePaymentSummary(activePlan.cadence)}
            helperText="استخدم نفس وسيلة الدفع المحفوظة عند استمرار الاشتراك."
            badgeLabel="دفع"
            badgeTone="default"
            actionLabel="تأكيد"
            onActionPress={() => onStatusChange?.('تمت مراجعة طريقة الدفع المختصرة للاشتراك الحالي.')}
            showDivider
          />
        </Box>
      ) : (
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          لا توجد باقة معروضة حاليًا.
        </Text>
      )}

      {showPlanOptions && alternativePlans.length > 0 ? (
        <Box gap={0}>
          {alternativePlans.map((plan, index) => (
            <SubscriptionActionRow
              key={plan.id}
              title={plan.title}
              subtitle={`${plan.price} • ${plan.cadence}`}
              helperText={plan.note}
              badgeLabel="متاحة"
              badgeTone="success"
              actionLabel="اختيار"
              onActionPress={() => {
                setSelectedPlanId(plan.id);
                setShowPlanOptions(false);
                onStatusChange?.(`تم اختيار ${plan.title} كخطة بديلة للمتابعة.`);
              }}
              showDivider={index > 0}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );

  if (compact) {
    return content;
  }

  return (
    <Surface
      tone="raised"
      padding={3}
      gap={3}
      style={{
        borderWidth: 1,
        borderColor: theme.line,
        borderRadius: 22,
      }}
    >
      {content}
    </Surface>
  );
}

export default DshSubscriptionsScreen;
