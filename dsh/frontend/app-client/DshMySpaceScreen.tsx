import React from 'react';
import { Pressable, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { Box, Icon, MobileScrollView, Surface, Text, TopBar, colorPalette, safeArea, spacing, useTheme } from '@bthwani/ui-kit';
import { DshOperationScreen } from './DshOperationScreen';
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

type PrimaryTabConfig = {
  id: MySpacePrimaryTab;
  label: string;
  summary: string;
  iconName: string;
};

const primaryTabs: PrimaryTabConfig[] = [
  { id: 'commercial', label: 'العروض والاشتراكات', summary: 'الولاء والمكافآت والاشتراكات والعروض في مساحة واحدة', iconName: 'grid' },
  { id: 'orders', label: 'طلباتي', summary: 'الطلب والتاريخ والتتبع', iconName: 'bag' },
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
  iconName: string;
  selected: boolean;
  onPress: () => void;
  details?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isExpanded = selected && Boolean(details);

  return (
    <Surface
      tone={isExpanded ? 'inset' : 'raised'}
      padding={2}
      gap={isExpanded ? 2 : 0}
      style={{
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isExpanded ? theme.brand : theme.line,
        backgroundColor: isExpanded ? theme.brandSurface : theme.surfaceRaised,
        shadowColor: isExpanded ? theme.brand : colorPalette.black,
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
        <Box layoutDirection="row" align="center" gap={3}>
          <Box
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
            <Icon name={iconName} size={21} tone={selected ? 'inverse' : 'brand'} />
          </Box>

          <Box gap={0} style={{ flex: 1 }}>
            <Text role="bodyStrong">{title}</Text>
            <Text role="bodySm" tone="muted" numberOfLines={2}>
              {subtitle}
            </Text>
          </Box>

          <Box style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-back'} size={20} color={isExpanded ? theme.brand : theme.textSoft} />
          </Box>
        </Box>
      </Pressable>

      {selected && details ? (
        <Box gap={2} style={{ borderTopWidth: 1, borderTopColor: theme.line, paddingTop: spacing[2] }}>
          {details}
        </Box>
      ) : null}
    </Surface>
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
  const { theme } = useTheme();

  if (state !== 'ready') {
    return <DshOperationScreen state={state} title="مساحتي" subtitle="الهوية الشخصية داخل DSH" onRetry={onRetry} />;
  }

  const activePrimarySection = primaryTabs.find((tab) => tab.id === activePrimaryTab) ?? primaryTabs[0];

  const handlePrimaryChange = (nextTab: MySpacePrimaryTab) => {
    setActivePrimaryTab(nextTab);
  };

  return (
    <Box flex={1}>
      <TopBar
        variant="surface"
        title="مساحتي"
        trailingAction={onBack ? { id: 'back', icon: <Icon name="arrow-back" size={24} tone="brand" />, mirrorInRtl: true, accessibilityLabel: 'رجوع', onPress: onBack } : undefined}
      />

      <MobileScrollView fill padding={2} gap={2} contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}>
        <Surface tone="raised" padding={2} gap={2}>
          <Box gap={0} style={{ alignItems: 'flex-end' }}>
            <Text role="titleSm">المسارات الرئيسية</Text>
          </Box>

          <Box gap={2}>
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
            </Box>
          </Surface>
      </MobileScrollView>
    </View>
  );
}

export default DshMySpaceScreen;