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
} from '@bthwani/ui-kit';

export type DshAddressLocationScreenProps = {
  onBack?: () => void;
};

type SavedAddress = {
  id: string;
  label: string;
  isDefault: boolean;
};

const mockSavedAddresses: SavedAddress[] = [
  { id: 'addr-home', label: 'المنزل', isDefault: true },
  { id: 'addr-work', label: 'العمل', isDefault: false },
  { id: 'addr-other', label: 'عنوان آخر', isDefault: false },
];

interface AddressRowProps {
  address: SavedAddress;
  onSetDefault: (id: string) => void;
  onEdit: (id: string) => void;
}

function AddressRow({ address, onSetDefault, onEdit }: AddressRowProps) {
  const { theme } = useTheme();

  return (
    <Surface
      tone="raised"
      padding={0}
      gap={0}
      style={{
        width: '100%',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: address.isDefault ? theme.brand : theme.line,
        backgroundColor: theme.surfaceRaised,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: spacing[3],
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: address.isDefault ? theme.brandSurface : theme.surface,
            borderWidth: 1,
            borderColor: address.isDefault ? theme.brand : theme.line,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={address.isDefault ? 'location' : 'location-outline'}
            size={19}
            color={address.isDefault ? theme.brand : theme.textSoft}
          />
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>
            {address.label}
          </Text>
          {address.isDefault ? (
            <Text role="bodySm" tone="muted" style={{ textAlign: 'right', marginTop: 2 }}>
              افتراضي
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
          {!address.isDefault ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => onSetDefault(address.id)}
              style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.brand,
                backgroundColor: pressed ? theme.brandSurface : 'transparent',
              })}
            >
              <Text role="bodySm" style={{ color: theme.brand, textAlign: 'center' }}>
                تعيين كافتراضي
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => onEdit(address.id)}
            style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: pressed ? theme.line : 'transparent',
            })}
          >
            <Text role="bodySm" style={{ color: theme.textSoft, textAlign: 'center' }}>
              تعديل
            </Text>
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}

export function DshAddressLocationScreen({ onBack }: DshAddressLocationScreenProps) {
  const { theme } = useTheme();
  const [addressText, setAddressText] = React.useState('');
  const [savedAddresses, setSavedAddresses] = React.useState<SavedAddress[]>(mockSavedAddresses);

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
        onBack={onBack}
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
              borderRadius: 12,
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

        <View style={{ height: 1, backgroundColor: theme.line, marginVertical: spacing[1] }} />

        <Box gap={2}>
          <Text role="label" style={{ textAlign: 'right', color: theme.text }}>
            العناوين المحفوظة
          </Text>
          {savedAddresses.map((address) => (
            <AddressRow
              key={address.id}
              address={address}
              onSetDefault={handleSetDefault}
              onEdit={handleEdit}
            />
          ))}
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshAddressLocationScreen;
