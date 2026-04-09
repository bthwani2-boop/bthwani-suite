// Auto-generated screen for arb_amendments_list
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content
// ARB_UX_FLOW: قائمة + زر أساسي واحد (عودة للحجوزات)

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildArbAmendmentsListMock, type AmendmentItem } from '../../hooks';

interface auto_arb_amendments_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_amendments_list: React.FC<auto_arb_amendments_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('loading');

  const amendments = useMemo(() => buildArbAmendmentsListMock(t), [t]);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 500));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 500);
  };

  const renderItem = ({ item }: { item: AmendmentItem }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemId}>{item.id}</Text>
      <Text style={styles.itemType}>{t('arb.app-client.mobile.auto_arb_amendments_list.itemTypeBooking', { type: item.type, bookingId: item.bookingId })}</Text>
      <Text style={styles.itemStatus}>{item.status}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('arb.app-client.mobile.auto_arb_amendments_list.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('arb.app-client.mobile.auto_arb_amendments_list.subtitle')}</Text>
          <FlatList
            data={amendments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>{t('arb.app-client.mobile.auto_arb_amendments_list.noAmendments')}</Text>}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('ArbBookingsList')}>
            <Text style={styles.primaryButtonText}>{t('arb.app-client.mobile.auto_arb_amendments_list.primaryButtonText')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_amendments_list.loadingMessage')}
      errorMessage={t('arb.app-client.mobile.auto_arb_amendments_list.errorLoadMessage')}
      onErrorAction={handleRetry}
      emptyMessage={t('arb.app-client.mobile.auto_arb_amendments_list.noAmendments')}
      emptyActionText={t('arb.app-client.mobile.auto_arb_amendments_list.backToBookings')}
      onEmptyAction={() => handleNavigate('ArbBookingsList')}
      screenName="auto_arb_amendments_list"
      operationName="arb_amendments_list"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  listContent: { paddingVertical: BTHWANI_SPACING.md },
  itemCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemId: { fontSize: 14, fontWeight: '600', color: semanticRoles.primaryCTA },
  itemType: { fontSize: 14, color: semanticRoles.onSurface },
  itemStatus: { fontSize: 12, color: semanticRoles.onSurfaceMuted },
  itemDate: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  emptyText: { textAlign: 'center', color: semanticRoles.onSurfaceMuted, padding: BTHWANI_SPACING.contentH },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: { color: semanticRoles.textInverse, fontSize: 14, fontWeight: '600' },
});

export default auto_arb_amendments_list;

