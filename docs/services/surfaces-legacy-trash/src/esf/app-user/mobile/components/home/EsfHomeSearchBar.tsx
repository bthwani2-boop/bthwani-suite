import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface EsfHomeSearchBarProps {
  value: string;
  onChangeText: (next: string) => void;
}

export const EsfHomeSearchBar: React.FC<EsfHomeSearchBarProps> = ({
  value,
  onChangeText,
}) => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputPrefix}
        value='بحث'
        editable={false}
        pointerEvents='none'
      />
      <TextInput
        style={styles.input}
        placeholder={t(
          'esf.app-client.mobile.auto_esf_home_get.feedSearchPlaceholder'
        )}
        placeholderTextColor={semanticRoles.textMuted}
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={t(
          'esf.app-client.mobile.auto_esf_home_get.feedSearchAccessibility'
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  inputPrefix: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    backgroundColor: semanticRoles.surface,
  },
  input: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    fontSize: 16,
    color: semanticRoles.text,
  },
});

