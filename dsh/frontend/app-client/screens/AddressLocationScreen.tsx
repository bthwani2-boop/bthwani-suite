import React from 'react';
import { Pressable, View, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import {
  Box,
  Button,
  Icon,
  MobileScrollView,
  Surface,
  Text,
  TextField,
  TopBar,
  safeArea,
  spacing,
  useTheme,
  ActionStrip,
  Badge,
  Divider,
  radius,
} from '@bthwani/ui-kit';

export type DshAddressLocationScreenProps = {
  onBack?: () => void;
};

type SavedAddress = {
  id: string;
  label: string;
  isDefault: boolean;
};

const defaultSavedAddresses: SavedAddress[] = [
  { id: 'addr-home', label: 'المنزل', isDefault: true },
  { id: 'addr-work', label: 'العمل', isDefault: false },
  { id: 'addr-other', label: 'عنوان آخر', isDefault: false },
];

interface AddressRowProps {
  address: SavedAddress;
  isLast?: boolean;
  onSetDefault: (id: string) => void;
  onEdit: (id: string) => void;
}

function AddressRow({ address, isLast = false, onSetDefault, onEdit }: AddressRowProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <ActionStrip
      icon={address.isDefault ? 'location' : 'location-outline'}
      title={address.label}
      subtitle={
        address.isDefault ? (
          <View style={{ alignItems: 'flex-end', marginTop: 2 }}>
            <Badge label="افتراضي" tone="brand" />
          </View>
        ) : undefined
      }
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      hideDivider={isLast}
    >
      <View style={{ gap: spacing[3], paddingTop: spacing[1] }}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', gap: spacing[2], marginTop: spacing[1] }}>
          {!address.isDefault && (
            <Button
              label="تعيين كافتراضي"
              tone="brand"
              size="sm"
              fullWidth={false}
              style={{ borderRadius: radius.xs2 }}
              onPress={() => {
                onSetDefault(address.id);
                setExpanded(false);
              }}
            />
          )}
          <Button
            label="تعديل"
            tone="secondary"
            size="sm"
            fullWidth={false}
            style={{ borderRadius: radius.xs2 }}
            onPress={() => {
              onEdit(address.id);
              setExpanded(false);
            }}
          />
        </View>
      </View>
    </ActionStrip>
  );
}

export function DshAddressLocationScreen({ onBack }: DshAddressLocationScreenProps) {
  const { theme } = useTheme();
  const [addressText, setAddressText] = React.useState('');
  const [savedAddresses, setSavedAddresses] = React.useState<SavedAddress[]>(defaultSavedAddresses);

  const handleSetDefault = (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
    );
  };

  // Edit flow wired to management panel in a later phase — Maps provider from control-panel/platform/Providers
  const handleEdit = (_id: string) => { };

  const handleSave = () => {
    if (!addressText.trim()) return;
    const newAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: addressText.trim(),
      isDefault: false,
    };
    setSavedAddresses((prev) => [...prev, newAddress]);
    setAddressText('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="العناوين والموقع"
        actions={onBack ? [{
          id: 'back',
          icon: <Icon name="chevron-back" mirrored size={18} />,
          accessibilityLabel: 'العودة',
          onPress: onBack,
        }] : []}
      />

      <MobileScrollView
        fill
        padding={4}
        gap={4}
        contentContainerStyle={{ paddingBottom: safeArea.comfortable + spacing[12] }}
      >
        <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
          أدخل عنوانك الوصفي أو حدد موقعك من الخريطة.
        </Text>

        <Box gap={3}>
          <TextField
            label="العنوان الوصفي"
            placeholder="مثال: المنزل، شارع الستين، بجانب صيدلية..."
            value={addressText}
            onChangeText={setAddressText}
            returnKeyType="done"
            textAlign="right"
          />

          <Button
            tone="secondary"
            leadingAccessory={<Icon name="map-outline" size={18} color={theme.brand} />}
            label="تحديد من Google Map"
            onPress={() => { /* placeholder — Maps provider wired from control-panel/platform/Providers */ }}
          />

          <View
            style={{
              backgroundColor: theme.brandSurface,
              borderRadius: radius.sm2,
              borderWidth: 1,
              borderColor: theme.line,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            }}
          >
            <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
              سيتم ربط اختيار الموقع بمزود الخرائط من لوحة التحكم لاحقًا.
            </Text>
          </View>

          <Button
            tone="primary"
            label="حفظ العنوان"
            onPress={handleSave}
          />
        </Box>

        <Divider style={{ marginVertical: spacing[1] }} />

        <View style={{ marginTop: spacing[4], gap: spacing[2] }}>
          <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right', paddingHorizontal: spacing[4] }}>
            العناوين المحفوظة
          </Text>
          <Divider />
          {savedAddresses.map((address: SavedAddress, index: number) => (
            <AddressRow
              key={address.id}
              address={address}
              isLast={index === savedAddresses.length - 1}
              onSetDefault={handleSetDefault}
              onEdit={handleEdit}
            />
          ))}
          <Divider />
        </View>
      </MobileScrollView>
    </View>
  );
}

export default DshAddressLocationScreen;
