// Auto-generated screen for dsh_cart_item_add
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/cart/items
// §30 States: Loading / Error / Success / Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { dshCartItemAdd } from '@bthwani/api-clients/dsh/dsh-cart-api';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_cart_item_add: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [menuItemId, setMenuItemId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [lastItemId, setLastItemId] = useState<string | null>(null);

  const submit = useCallback(async () => {
    const menuId = menuItemId.trim();
    if (!menuId) {
      setState('error');
      return;
    }
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    setState('loading');
    try {
      const json = await dshCartItemAdd({
        menuItemId: menuId,
        quantity: qty,
        specialInstructions: specialInstructions.trim() || undefined,
      });
      if (!json?.success) throw new Error(json?.error || 'Add failed');
      setLastItemId(json?.data?.itemId ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [menuItemId, quantity, specialInstructions]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_cart_item_add.loadingMessage')}
        screenName="auto_dsh_cart_item_add"
        operationName="dsh_cart_item_add"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_cart_item_add.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_cart_item_add"
        operationName="dsh_cart_item_add"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_cart_item_add.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_cart_item_add.subtitle')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={menuItemId}
          onChangeText={setMenuItemId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_cart_item_add.menuItemIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TextInput
          style={[styles.input, textAlignStart]}
          value={quantity}
          onChangeText={setQuantity}
          placeholder={t('dsh.app-client.mobile.auto_dsh_cart_item_add.quantityLabel')}
          keyboardType="number-pad"
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TextInput
          style={[styles.input, textAlignStart, styles.instructions]}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder={t('dsh.app-client.mobile.auto_dsh_cart_item_add.specialInstructionsPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!menuItemId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_cart_item_add.primaryButtonText')}</Text>
        </TouchableOpacity>
        {lastItemId && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>تمت الإضافة: {lastItemId}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshCartGet')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_cart_item_add.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  instructions: { marginBottom: BTHWANI_SPACING.lg },
  primaryButton: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, alignItems: 'center', marginBottom: BTHWANI_SPACING.sm },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  result: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_cart_item_add;


