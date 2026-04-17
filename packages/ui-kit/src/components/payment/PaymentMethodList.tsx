import React from 'react';
import { View, Pressable, Image, StyleSheet } from 'react-native';
import { useDirection, useTheme } from '../../hooks';
import { spacing, radius, borders } from '../../foundation/tokens';
import { BthText, BthSurface } from '../../primitives';

export type PaymentMethod = { id: string; label: string; icon?: string };

export type PaymentMethodListProps = {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ methods, selectedId, onSelect }) => {
  const { direction } = useDirection();
  const { theme } = useTheme();

  const getInitial = (label: string) => {
    if (!label) return '?';
    const words = label.trim().split(/\s+/);
    // prefer first letter of last word (works for Arabic short labels)
    const last = words[words.length - 1];
    return last ? last.charAt(0) : label.charAt(0);
  };

  return (
    <View style={{ gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] }}>
      {methods.map((m) => {
        const selected = selectedId === m.id;
        const hasRemoteIcon = typeof m.icon === 'string' && (m.icon.startsWith('http://') || m.icon.startsWith('https://'));
        return (
          <Pressable
            key={m.id}
            onPress={() => onSelect?.(m.id)}
            style={({ pressed }) => [
              styles.card,
              {
                borderColor: selected ? theme.brand : theme.line,
                backgroundColor: pressed ? theme.surfaceInset : theme.surface
              }
            ]}
          >
            <View style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[3] }}>
              <View style={[styles.radio, selected ? { borderColor: theme.brand, backgroundColor: theme.brand } : { borderColor: theme.line }]} />
              <View style={styles.iconWrap}>
                {hasRemoteIcon ? (
                  <Image source={{ uri: m.icon as string }} style={styles.icon} />
                ) : (
                  <View style={[styles.placeholder, { backgroundColor: theme.surfaceInset, borderColor: theme.line }] as any}>
                    <BthText role="bodyMd" style={{ textAlign: 'center' }}>{getInitial(m.label)}</BthText>
                  </View>
                )}
              </View>
              <BthText role="bodyStrong" style={{ flex: 1 }}>{m.label}</BthText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginEnd: spacing[3]
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing[3]
  },
  icon: { width: 44, height: 44 }
  ,
  placeholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default PaymentMethodList;
