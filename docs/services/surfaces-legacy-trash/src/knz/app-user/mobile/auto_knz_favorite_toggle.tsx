// Auto-generated screen for knz_favorite_toggle
// Surface: app-client | Service: knz
// §30 States: Loading / Empty / Error / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_knz_favorite_toggleProps {
  listingId?: string;
  onNavigate?: (screen: string, params?: Record<string, string>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, string>) => void;
    goBack?: () => void;
  };
}

export const auto_knz_favorite_toggle: React.FC<auto_knz_favorite_toggleProps> = ({
  listingId,
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = (screen: string, params?: Record<string, string>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 400));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 400);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>إضافة للمفضلة</Text>
          <Text style={[styles.subtitle, textAlignStart]}>إضافة أو إزالة الإعلان من المفضلة</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.() ?? handleNavigate('KnzListingsList')}
          >
            <Text style={styles.backButtonText}>عودة للقائمة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('knz.app-client.mobile.auto_knz_favorite_toggle.loadingMessage')}
      errorMessage={t('knz.app-client.mobile.auto_knz_favorite_toggle.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_knz_favorite_toggle"
      operationName="knz_favorite_toggle"
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
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  backButton: {
    marginTop: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
});

export default auto_knz_favorite_toggle;

