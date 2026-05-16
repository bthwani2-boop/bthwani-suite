import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Surface, Text } from '../primitives';
import { Button } from './button';
import { Icon } from './icons';
import { colorPalette } from '../foundation';

export type CartConfirmationBlockProps = {
  title: string;
  subtitle?: string;
  onGoToCart: () => void;
  onContinueShopping: () => void;
  isDarkGlass?: boolean;
};

export function CartConfirmationBlock({
  title,
  subtitle,
  onGoToCart,
  onContinueShopping,
  isDarkGlass = false,
}: CartConfirmationBlockProps) {
  return (
    <Box gap={6} padding={6} align="center" style={styles.container}>
      <Surface
        tone="success"
        radiusToken="full"
        padding={4}
        border={false}
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDarkGlass ? 'rgba(255, 80, 13, 0.15)' : 'rgba(255, 80, 13, 0.08)',
          }
        ]}
      >
        <Icon name="checkmark-circle" size={48} color={colorPalette.accentOrange} />
      </Surface>

      <Box align="center" gap={2}>
        <Text role="titleMd" align="center" style={{ color: isDarkGlass ? colorPalette.white : colorPalette.textPrimary }}>
          {title}
        </Text>
        {subtitle ? (
          <Text role="bodyMd" tone="muted" align="center" style={{ opacity: 0.8 }}>
            {subtitle}
          </Text>
        ) : null}
      </Box>

      <Box layoutDirection="row" gap={3} style={styles.actions}>
        <Button
          label="انتقل للسلة"
          tone="brand"
          onPress={onGoToCart}
          style={styles.flexButton}
          trailingAccessory={<Icon name="cart-outline" size={16} color={colorPalette.white} />}
        />
        <Button
          label="متابعة التسوق"
          tone={isDarkGlass ? 'glass' : 'secondary'}
          onPress={onContinueShopping}
          style={styles.flexButton}
        />
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colorPalette.accentOrange,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  actions: {
    width: '100%',
  },
  flexButton: {
    flex: 1,
  },
});
