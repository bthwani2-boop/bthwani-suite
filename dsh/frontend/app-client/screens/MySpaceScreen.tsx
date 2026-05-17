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
  onOpenOrders?: () => void;
  onOpenWallet?: () => void;
  onOpenLoyalty?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenAddresses?: () => void;
  onOpenLocation?: () => void;
  onOpenIdentity?: () => void;
  onOpenCommercial?: () => void;
  onOpenAppearance?: () => void;
  onOpenPreferences?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

type MySpacePrimaryTab = 'orders' | 'wallet' | 'loyalty' | 'subscriptions' | 'addresses' | 'location' | 'identity' | 'commercial' | 'appearance' | 'preferences';

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: any;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ والتتبع', iconName: 'bag-outline' },
  { id: 'wallet', label: 'المحفظة', summary: 'الرصيد، الاسترداد، وطرق الدفع', iconName: 'wallet-outline' },
  { id: 'loyalty', label: 'الولاء والمكافآت', summary: 'رصيد النقاط والمزايا المتاحة', iconName: 'star-outline' },
  { id: 'subscriptions', label: 'الاشتراكات', summary: 'إدارة الباقات والخصومات الدورية', iconName: 'flash-outline' },
  { id: 'addresses', label: 'العناوين المحفوظة', summary: 'إدارة مواقع التوصيل والاستلام', iconName: 'location-outline' },
  { id: 'location', label: 'الموقع الحالي', summary: 'تحديد وتحديث موقعك الميداني', iconName: 'map-outline' },
  { id: 'identity', label: 'الملف الشخصي', summary: 'البيانات الشخصية والأمان', iconName: 'person-outline' },
  { id: 'commercial', label: 'العروض الترويجية', summary: 'الحملات والخصومات المباشرة', iconName: 'megaphone-outline' },
  { id: 'appearance', label: 'المظهر', summary: 'فاتح أبيض أو داكن زجاجي', iconName: 'color-palette-outline' },
  { id: 'preferences', label: 'تفضيلات التوصيل', summary: 'إعدادات خاصة بالتسليم والاستبدال', iconName: 'options-outline' },
];

interface MySpacePrimaryRowProps {
  title: string;
  subtitle: string;
  iconName: any;
  onPress: () => void;
}

function MySpacePrimaryRow({
  title,
  subtitle,
  iconName,
  onPress,
}: MySpacePrimaryRowProps) {
  const { theme } = useTheme();

  return (
    <Surface
      tone="raised"
      padding={0}
      gap={0}
      style={{
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.surfaceRaised,
        shadowColor: colorPalette.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        overflow: 'hidden',
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
          width: '100%',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[3],
          backgroundColor: pressed ? theme.line : 'transparent',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: spacing[3],
        })}
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

        <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron-back" size={20} color={theme.textSoft} />
        </View>
      </Pressable>
    </Surface>
  );
}

export function DshMySpaceScreen({
  state = 'ready',
  onOpenOrders,
  onOpenWallet,
  onOpenLoyalty,
  onOpenSubscriptions,
  onOpenAddresses,
  onOpenLocation,
  onOpenIdentity,
  onOpenCommercial,
  onOpenAppearance,
  onOpenPreferences,
  onRetry,
}: DshMySpaceScreenProps) {
  const { theme } = useTheme();

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const handleRowPress = (sectionId: MySpacePrimaryTab) => {
    switch (sectionId) {
      case 'orders':
        return onOpenOrders ? onOpenOrders() : console.warn('Missing onOpenOrders callback');
      case 'wallet':
        return onOpenWallet ? onOpenWallet() : console.warn('Missing onOpenWallet callback');
      case 'loyalty':
        return onOpenLoyalty ? onOpenLoyalty() : console.warn('Missing onOpenLoyalty callback');
      case 'subscriptions':
        return onOpenSubscriptions ? onOpenSubscriptions() : console.warn('Missing onOpenSubscriptions callback');
      case 'addresses':
        return onOpenAddresses ? onOpenAddresses() : console.warn('Missing onOpenAddresses callback');
      case 'location':
        return onOpenLocation ? onOpenLocation() : console.warn('Missing onOpenLocation callback');
      case 'identity':
        return onOpenIdentity ? onOpenIdentity() : console.warn('Missing onOpenIdentity callback');
      case 'commercial':
        return onOpenCommercial ? onOpenCommercial() : console.warn('Missing onOpenCommercial callback');
      case 'appearance':
        return onOpenAppearance ? onOpenAppearance() : console.warn('Missing onOpenAppearance callback');
      case 'preferences':
        return onOpenPreferences ? onOpenPreferences() : console.warn('Missing onOpenPreferences callback');
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
        <Box gap={3}>
          {primaryTabs.map((section) => (
            <MySpacePrimaryRow
              key={section.id}
              title={section.label}
              subtitle={section.summary}
              iconName={section.iconName}
              onPress={() => handleRowPress(section.id)}
            />
          ))}
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
