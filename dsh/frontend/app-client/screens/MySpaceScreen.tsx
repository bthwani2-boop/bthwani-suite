import React from 'react';
import {
  Pressable,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  type BThwaniAppearanceMode,
  Box,
  Icon,
  MobileScrollView,
  Surface,
  Text,
  TopBar,
  colorPalette,
  safeArea,
  spacing,
  useTheme,
  SegmentedControl,
  useDirection,
  type Language,
} from '@bthwani/ui-kit';
import { DshOperationScreen } from '../parts/OperationScreen';

export type DshMySpaceItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceScreenProps = {
  appearanceHydrated?: boolean;
  appearanceMode?: BThwaniAppearanceMode;
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  marketingPrograms?: DshMySpaceItem[];
  onAppearanceModeChange?: (mode: BThwaniAppearanceMode) => void;
  onOpenBenefits?: () => void;
  onOpenOrders?: () => void;
  onOpenWallet?: () => void;
  onOpenLoyalty?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenAddressesLocation?: () => void;
  onOpenIdentity?: () => void;
  onOpenCommercial?: () => void;
  onOpenAppearance?: () => void;
  onOpenPreferences?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

type MySpacePrimaryTab =
  | 'orders'
  | 'wallet'
  | 'loyalty'
  | 'subscription'
  | 'offers'
  | 'addresses-location'
  | 'identity'
  | 'appearance'
  | 'language'
  | 'preferences';

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: any;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ والتتبع', iconName: 'bag-outline' },
  { id: 'wallet', label: 'المحفظة', summary: 'الرصيد، الاسترداد، وطرق الدفع', iconName: 'wallet-outline' },
  { id: 'loyalty', label: 'النقاط والمكافآت', summary: 'الرصيد، المستوى، وأقرب ثلاث مكافآت', iconName: 'star-outline' },
  { id: 'subscription', label: 'الاشتراك', summary: 'الخطة الحالية والتبديل عند الحاجة فقط', iconName: 'card-outline' },
  { id: 'offers', label: 'العروض والكوبونات', summary: 'ثلاث فرص قابلة للاستخدام بدل قائمة طويلة', iconName: 'pricetag-outline' },
  { id: 'addresses-location', label: 'العناوين والموقع', summary: 'إدارة العناوين وموقع التوصيل', iconName: 'location-outline' },
  { id: 'identity', label: 'الملف الشخصي', summary: 'البيانات الشخصية والأمان', iconName: 'person-outline' },
  { id: 'appearance', label: 'المظهر', summary: 'فاتح أبيض أو داكن زجاجي', iconName: 'color-palette-outline' },
  { id: 'language', label: 'اللغة', summary: 'العربية أو الإنجليزية', iconName: 'globe-outline' },
  { id: 'preferences', label: 'تفضيلات التوصيل', summary: 'إعدادات خاصة بالتسليم والاستبدال', iconName: 'options-outline' },
];

interface MySpacePrimaryRowProps {
  title: string;
  subtitle: string;
  iconName: any;
  onPress?: () => void;
  isExpanded?: boolean;
  actionElement?: React.ReactNode;
}

function MySpacePrimaryRow({
  title,
  subtitle,
  iconName,
  onPress,
  isExpanded = false,
  actionElement,
}: MySpacePrimaryRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole={actionElement ? undefined : 'button'}
      onPress={actionElement ? undefined : onPress}
      disabled={!!actionElement}
      style={({ pressed }): StyleProp<ViewStyle> => ({
        width: '100%',
        backgroundColor: pressed ? theme.surfaceInset : 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: theme.line,
      })}
    >
      <View
        style={{
          width: '100%',
          paddingHorizontal: spacing[1],
          paddingVertical: spacing[3],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: spacing[3],
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.brandSurface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={iconName} size={21} color={theme.brand} />
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>{title}</Text>
          <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: 2 }}>
            {subtitle}
          </Text>
        </View>

        {actionElement ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {actionElement}
          </View>
        ) : (
          <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-back'} size={20} color={theme.textSoft} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function DshMySpaceScreen({
  state = 'ready',
  appearanceHydrated,
  appearanceMode = 'lightPremium',
  onAppearanceModeChange,
  onOpenBenefits,
  onOpenOrders,
  onOpenWallet,
  onOpenLoyalty,
  onOpenSubscriptions,
  onOpenAddressesLocation,
  onOpenIdentity,
  onOpenCommercial,
  onOpenAppearance,
  onOpenPreferences,
  onRetry,
}: DshMySpaceScreenProps) {
  const { theme } = useTheme();
  const { language, setLanguage } = useDirection();

  const runOptionalAction = React.useCallback((action?: () => void) => {
    action?.();
  }, []);

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const handleRowPress = (sectionId: MySpacePrimaryTab) => {
    if (sectionId === 'identity') {
      runOptionalAction(onOpenIdentity);
      return;
    }

    switch (sectionId) {
      case 'orders':
        return runOptionalAction(onOpenOrders);
      case 'wallet':
        return runOptionalAction(onOpenWallet);
      case 'loyalty':
        if (onOpenLoyalty) {
          onOpenLoyalty();
          return;
        }
        return runOptionalAction(onOpenBenefits);
      case 'subscription':
        if (onOpenSubscriptions) {
          onOpenSubscriptions();
          return;
        }
        return runOptionalAction(onOpenBenefits);
      case 'offers':
        if (onOpenCommercial) {
          onOpenCommercial();
          return;
        }
        return runOptionalAction(onOpenBenefits);
      case 'addresses-location':
        return runOptionalAction(onOpenAddressesLocation);
      case 'appearance':
        return runOptionalAction(onOpenAppearance);
      case 'preferences':
        return runOptionalAction(onOpenPreferences);
      default:
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="مساحتي"
      />

      <MobileScrollView
        fill
        padding={4}
        gap={3}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <Box gap={0}>
          {primaryTabs.map((section) => {
            let actionElement: React.ReactNode = undefined;

            if (section.id === 'appearance') {
              actionElement = (
                <SegmentedControl
                  size="sm"
                  fullWidth={false}
                  style={{ width: 140 }}
                  options={[
                    { value: 'lightPremium', label: 'فاتح' },
                    { value: 'darkGlass', label: 'داكن' },
                  ]}
                  value={appearanceMode === 'darkGlass' ? 'darkGlass' : 'lightPremium'}
                  onValueChange={(nextValue) => {
                    onAppearanceModeChange?.(nextValue as BThwaniAppearanceMode);
                  }}
                />
              );
            } else if (section.id === 'language') {
              actionElement = (
                <SegmentedControl
                  size="sm"
                  fullWidth={false}
                  style={{ width: 140 }}
                  options={[
                    { value: 'ar', label: 'عربي' },
                    { value: 'en', label: 'EN' },
                  ]}
                  value={language === 'en' ? 'en' : 'ar'}
                  onValueChange={(nextValue) => {
                    setLanguage(nextValue as Language);
                  }}
                />
              );
            }

            return (
              <MySpacePrimaryRow
                key={section.id}
                title={section.label}
                subtitle={section.summary}
                iconName={section.iconName}
                actionElement={actionElement}
                onPress={() => handleRowPress(section.id)}
              />
            );
          })}
        </Box>
      </MobileScrollView>
    </View>
  );
}

/**
 * Compatibility alias for deprecated split component.
 * @deprecated Integrated into MySpaceScreen as MySpaceOrdersSection.
 */
export const DshMySpaceOrdersScreen = DshMySpaceScreen;

export default DshMySpaceScreen;
