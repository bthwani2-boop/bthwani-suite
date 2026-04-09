// Auto-generated screen for wlt_balance_get
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

interface auto_wlt_balance_getProps {
  
}

export const auto_wlt_balance_get: React.FC<auto_wlt_balance_getProps> = (props) => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    // Backend integration call
    const loadBalance = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate different states - change this to test different states
        const mockSuccess = 0 > 0.3; // 70% success rate
        const mockHasBalance = 0 > 0.2; // 80% have balance

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasBalance) {
          setState('empty');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadBalance();
  }, []);

  const handleRetry = () => {
    setState('loading');
    // Re-trigger the effect
    setTimeout(() => {
      // Simulate retry
      setState(0 > 0.5 ? 'content' : 'error');
    }, 1500);
  };

  const handleRefresh = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.balanceContainer}>
          <Text style={styles.title}>{t('surfaces.رصيد_المحفظة')}</Text>
          <Text style={styles.balance}>{t('surfaces.رصيد_المحفظة_القيمة', { amount: '2,450.75' })}</Text>
          <Text style={styles.subtitle}>{t('surfaces.الرصيد_المتاح')}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
              <Text style={styles.actionText}>{t('surfaces.تحديث')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_رصيد_المحفظة')}
      emptyMessage={t('surfaces.لا_يوجد_رصيد_في_المحفظة')}
      emptyActionText={t('surfaces.إضافة_رصيد')}
      onEmptyAction={() => setState('success')}
      errorMessage={t('surfaces.فشل_في_تحميل_الرصيد')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_إضافة_الرصيد_بنجاح')}
      successActionText={t('surfaces.العودة_للرصيد')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_balance_get"
      operationName="wlt_balance_get"
    />
  );
};

const styles = StyleSheet.create({
  balanceContainer: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xl,
  },
  actions: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  actionText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_wlt_balance_get;

