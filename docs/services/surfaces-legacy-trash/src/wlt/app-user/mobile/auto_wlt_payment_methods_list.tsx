// Auto-generated screen for wlt_payment_methods_list
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildWltPaymentMethodsMock, type PaymentMethod } from '../../fixtures/paymentMethods';

interface auto_wlt_payment_methods_listProps {
  
}

export const auto_wlt_payment_methods_list: React.FC<auto_wlt_payment_methods_listProps> = (props) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    // Backend integration call
    const loadPaymentMethods = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (92% success rate)
        const mockSuccess = 0 > 0.08;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadPaymentMethods();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleSetDefault = (methodId: string) => {
    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 1500);
  };

  const handleRemoveMethod = (methodId: string) => {
    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 1500);
  };

  const paymentMethods = React.useMemo(() => buildWltPaymentMethodsMock(t), [t]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'card': return colorTokens.primary['500'];
      case 'bank': return colorTokens.success['600'];
      case 'wallet': return colorTokens.warning['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.methodCard}>
      <View style={[styles.methodHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <View style={[styles.methodInfo, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.methodIcon}>{item.icon}</Text>
          <View style={styles.methodDetails}>
            <Text style={styles.methodName}>{item.name}</Text>
            <Text style={styles.methodDetailsText}>{item.details}</Text>
            {item.expiryDate && (
              <Text style={styles.expiryText}>ينتهي في: {item.expiryDate}</Text>
            )}
          </View>
        </View>

        <View style={[styles.methodBadges, { flexDirection: 'row', direction: layoutDirection }]}>
          {item.isDefault && (
            <View style={[styles.badge, styles.defaultBadge]}>
              <Text style={styles.badgeText}>افتراضي</Text>
            </View>
          )}
          <View style={[styles.badge, item.isVerified ? styles.verifiedBadge : styles.unverifiedBadge]}>
            <Text style={[styles.badgeText, item.isVerified ? styles.verifiedText : styles.unverifiedText]}>
              {item.isVerified ? '✓' : '!'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.methodActions, { flexDirection: 'row', direction: layoutDirection }]}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionText}>اجعل افتراضي</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveMethod(item.id)}
        >
          <Text style={styles.removeText}>إزالة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={styles.title}>{t('wlt.payment_methods_title')}</Text>
          <Text style={styles.subtitle}>{t('wlt.payment_methods_subtitle')}</Text>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ {t('wlt.add_payment_method')}</Text>
          </TouchableOpacity>

          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentMethod}
            contentContainerStyle={styles.methodsList}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.securityBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              {t('wlt.security_banner')}
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_طرق_الدفع')}
      emptyMessage={t('surfaces.لا_توجد_طرق_دفع_محفوظة')}
      emptyActionText={t('surfaces.إضافة_طريقة_دفع')}
      onEmptyAction={() => setState('content')}
      errorMessage={t('surfaces.فشل_في_تحميل_طرق_الدفع')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.تم_تحديث_طريقة_الدفع_بنجاح')}
      successActionText={t('surfaces.العودة_لطرق_الدفع')}
      onSuccessAction={() => setState('content')}
      screenName="auto_wlt_payment_methods_list"
      operationName="wlt_payment_methods_list"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  addButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: BTHWANI_COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  methodsList: {
    padding: BTHWANI_SPACING.contentH,
  },
  methodCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 32,
    marginEnd: BTHWANI_SPACING.md,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  methodDetailsText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  expiryText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  methodBadges: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  badge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  verifiedBadge: {
    backgroundColor: colorTokens.success['600'],
  },
  unverifiedBadge: {
    backgroundColor: colorTokens.warning['500'],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  verifiedText: {
    color: 'white',
  },
  unverifiedText: {
    color: 'white',
  },
  methodActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: BTHWANI_COLORS.outline,
    paddingTop: BTHWANI_SPACING.md,
  },
  actionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.primary,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    flex: 1,
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.sm,
  },
  actionText: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
    fontWeight: '500',
  },
  removeButton: {
    borderColor: colorTokens.error['500'],
    marginEnd: 0,
    marginStart: BTHWANI_SPACING.sm,
    flex: 0.8,
  },
  removeText: {
    color: colorTokens.error['500'],
    fontSize: 14,
    fontWeight: '500',
  },
  securityBanner: {
    backgroundColor: colorTokens.primary['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colorTokens.primary['500'],
  },
  securityIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: colorTokens.primary['800'],
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default auto_wlt_payment_methods_list;

