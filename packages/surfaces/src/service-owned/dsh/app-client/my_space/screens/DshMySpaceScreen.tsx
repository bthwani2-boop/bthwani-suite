import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { BthBox, BthIcon, BthMobileScrollView, BthSurface, BthText, BthTopBar, spacing, useTheme } from '@bthwani/ui-kit';
import { DshOperationScreen } from '../../patterns/screens/DshOperationScreen';
import { DshMySpaceCommercialScreen } from './DshMySpaceCommercialScreen';
import { DshMySpaceOrdersScreen } from './DshMySpaceOrdersScreen';

export type DshMySpaceItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badgeLabel: string;
};

export type DshMySpaceScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  marketingPrograms?: DshMySpaceItem[];
  onOpenOrders?: () => void;
  onOpenTracking?: () => void;
  onRepeatOrder?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
};

type MySpacePrimaryTab = 'commercial' | 'orders';

type SectionIconName = React.ComponentProps<typeof Ionicons>['name'];

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: SectionIconName;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'commercial', label: 'العروض والاشتراكات', summary: 'الولاء والمكافآت والاشتراكات والعروض في مساحة واحدة', iconName: 'grid-outline' },
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ والتتبع', iconName: 'bag-outline' },
];

function MySpacePrimaryRow({
  title,
  subtitle,
  iconName,
  selected,
  onPress,
  details,
}: {
  title: string;
  subtitle: string;
  iconName: SectionIconName;
  selected: boolean;
  onPress: () => void;
  details?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isExpanded = selected && Boolean(details);

  return (
    <BthSurface
      tone={isExpanded ? 'inset' : 'raised'}
      padding={2}
      gap={isExpanded ? 2 : 0}
      style={{
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isExpanded ? theme.brand : theme.line,
        backgroundColor: isExpanded ? theme.brandSurface : theme.surfaceRaised,
        shadowColor: isExpanded ? theme.brand : '#020617',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isExpanded ? 0.1 : 0.05,
        shadowRadius: isExpanded ? 14 : 10,
        elevation: isExpanded ? 3 : 2,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
          width: '100%',
          borderRadius: 16,
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          opacity: pressed ? 0.96 : 1,
        })}
      >
        <BthBox layoutDirection="row" align="center" gap={3}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: selected ? theme.brand : theme.line,
              backgroundColor: selected ? theme.brand : theme.brandSurface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={iconName} size={21} color={selected ? theme.brandContrast : theme.brand} />
          </View>

          <BthBox gap={0} style={{ flex: 1 }}>
            <BthText role="bodyStrong">{title}</BthText>
            <BthText role="bodySm" tone="muted" numberOfLines={2}>
              {subtitle}
            </BthText>
          </BthBox>

          <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-back'} size={20} color={isExpanded ? theme.brand : theme.textSoft} />
          </View>
        </BthBox>
      </Pressable>

      {selected && details ? (
        <BthBox gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: spacing[2] }}>
          {details}
        </BthBox>
      ) : null}
    </BthSurface>
  );
}

function renderPrimarySectionContent(
  section: MySpacePrimaryTab,
  marketingPrograms: DshMySpaceItem[],
  onOpenOrders?: () => void,
  onOpenTracking?: () => void,
  onRepeatOrder?: () => void,
) {
  if (section === 'commercial') {
    return (
      <DshMySpaceCommercialScreen
        compact
        marketingPrograms={marketingPrograms}
      />
    );
  }

  if (section === 'orders') {
    return (
      <DshMySpaceOrdersScreen
        onOpenOrders={onOpenOrders}
        onOpenTracking={onOpenTracking}
        onRepeatOrder={onRepeatOrder}
      />
    );
  }

  return null;
}

export function DshMySpaceScreen({
  state = 'ready',
  marketingPrograms = [],
  onOpenOrders,
  onOpenTracking,
  onRepeatOrder,
  onBack,
  onRetry,
}: DshMySpaceScreenProps) {
  const [activePrimaryTab, setActivePrimaryTab] = React.useState<MySpacePrimaryTab>('orders');

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const activePrimarySection = primaryTabs.find((tab) => tab.id === activePrimaryTab) ?? primaryTabs[0];
  const activePrimaryLabel = activePrimarySection.label;

  const handlePrimaryChange = (nextTab: MySpacePrimaryTab) => {
    setActivePrimaryTab(nextTab);
  };

  return (
    <View style={{ flex: 1 }}>
      <BthTopBar
        variant="surface"
        title="مساحتي"
        trailingAction={onBack ? { id: 'back', icon: <BthIcon name="arrow-back" size={24} color={theme.brand} />, mirrorInRtl: true, accessibilityLabel: 'رجوع', onPress: onBack } : undefined}
      />

      <BthMobileScrollView fill padding={2} gap={2}>
        <BthSurface tone="raised" padding={2} gap={2}>
          <BthBox gap={0} style={{ alignItems: 'flex-end' }}>
            <BthText role="titleSm">المسارات الرئيسية</BthText>
          </BthBox>

          <BthBox gap={2}>
            {primaryTabs.map((section) => (
              <MySpacePrimaryRow
                key={section.id}
                title={section.label}
                subtitle={section.summary}
                iconName={section.iconName}
                selected={section.id === activePrimaryTab}
                onPress={() => handlePrimaryChange(section.id)}
                details={
                  section.id === activePrimaryTab ? (
                    renderPrimarySectionContent(
                      activePrimaryTab,
                      marketingPrograms,
                      onOpenOrders,
                      onOpenTracking,
                      onRepeatOrder,
                    )
                  ) : undefined
                }
              />
            ))}
          </BthBox>
        </BthSurface>
      </BthMobileScrollView>
    </View>
  );
}

export default DshMySpaceScreen;