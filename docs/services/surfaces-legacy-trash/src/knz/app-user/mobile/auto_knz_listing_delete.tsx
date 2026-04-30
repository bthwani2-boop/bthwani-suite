// KNZ Listing Delete — تأكيد حذف إعلان ثم العودة للقائمة
// Surface: app-client | Service: knz
// §30 States: Loading / Content / Error / Success
// Contract (Phase 0.2 خيار ب): الإجراء = entity_close أو entity_delete(domain=KNZ, entityType=listing, entityId). استبدال المحاكاة عند توفر @bthwani/api-clients.

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_knz_listing_deleteProps {
  listingId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, string>) => void; goBack?: () => void };
}

export const auto_knz_listing_delete: React.FC<auto_knz_listing_deleteProps> = ({
  listingId,
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, string>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const handleDelete = useCallback(() => {
    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 1200);
  }, []);

  const handleSuccessAction = useCallback(() => {
    if (navigation?.goBack) navigation.goBack();
    else handleNavigate('KnzListingsList');
  }, [navigation, handleNavigate]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>حذف الإعلان</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation?.goBack?.() ?? handleNavigate('KnzListingsList')}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>حذف الإعلان</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_listing_delete.loadingMessage')}
      errorMessage={t('knz.app-client.mobile.auto_knz_listing_delete.errorMessage')}
      successMessage={t('knz.app-client.mobile.auto_knz_listing_delete.successMessage')}
      successActionText={t('knz.app-client.mobile.auto_knz_listing_delete.successActionText')}
      onSuccessAction={handleSuccessAction}
      screenName="auto_knz_listing_delete"
      operationName="knz_listing_delete"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  deleteButton: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.error,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.surface,
  },
});

export default auto_knz_listing_delete;

