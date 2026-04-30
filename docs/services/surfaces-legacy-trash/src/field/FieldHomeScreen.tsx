/**
 * FieldHomeScreen — §87 SSoT in packages/surfaces
 * All UI logic here; app-field shell imports and wires only.
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
 * WAVE 11 (Phase 8): Central contract only; empty state via t(field.FieldHomeScreen.emptyTitle/emptySubtitle).
 */
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { AnimatedCard } from '../mobile/components/MicroInteractions';
import { ServiceIcon } from '../mobile/components';
import { useFieldType } from '../mobile/app-field/FieldTypeContext';
import { FieldModeSwitchSheet, type FieldType as ModeSwitchFieldType } from './FieldModeSwitchSheet';

export interface FieldHomeScreenProps {
  navigation?: { navigate: (name: string) => void };
  fieldType?: 'dsh' | 'arb' | null;
  isLoading?: boolean;
}

export const FieldHomeScreen: React.FC<FieldHomeScreenProps> = ({
  navigation,
  fieldType: propFieldType,
  isLoading = false,
}) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.FieldHomeScreen';
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const DSH_FIELD_ACTIONS = useMemo(() => [
    { screen: 'field_partner_draft_create', label: t(`${ns}.createDraft`), icon: 'new', primary: true },
    { screen: 'field_partner_draft_get', label: t(`${ns}.viewDrafts`), icon: 'list' },
    { screen: 'field_partner_products_list', label: t(`${ns}.productsList`), icon: 'inventory' },
    { screen: 'field_partner_lead_update', label: t(`${ns}.leadUpdate`), icon: 'person' },
    { screen: 'field_partner_draft_reject', label: t(`${ns}.rejectDraft`), icon: 'cancel' },
    { screen: 'field_partner_activate', label: t(`${ns}.activatePartner`), icon: 'check-circle' },
    { screen: 'field_partner_suspend', label: t(`${ns}.suspendPartner`), icon: 'pause-circle' },
    { screen: 'dsh_field_store_activation_request', label: t(`${ns}.storeActivationRequest`), icon: 'store' },
    { screen: 'dsh_field_store_geo_pin', label: t(`${ns}.storeGeoPin`), icon: 'location-on' },
    { screen: 'dsh_field_store_visit_log', label: t(`${ns}.storeVisitLog`), icon: 'history' },
  ], [t]);
  const ARB_FIELD_ACTIONS = useMemo(() => [
    { screen: 'arb_field_partner_draft_create', label: t(`${ns}.createDraft`), icon: 'new', primary: true },
    { screen: 'arb_field_partner_draft_get', label: t(`${ns}.viewDrafts`), icon: 'list' },
    { screen: 'arb_field_partner_products_list', label: t(`${ns}.productsList`), icon: 'inventory' },
    { screen: 'arb_field_partner_lead_update', label: t(`${ns}.leadUpdate`), icon: 'person' },
    { screen: 'arb_field_partner_draft_reject', label: t(`${ns}.rejectDraft`), icon: 'cancel' },
    { screen: 'arb_field_partner_activate', label: t(`${ns}.activatePartner`), icon: 'check-circle' },
    { screen: 'arb_field_partner_suspend', label: t(`${ns}.suspendPartner`), icon: 'pause-circle' },
  ], [t]);
  const { fieldType: contextFieldType, setFieldType } = useFieldType();
  const fieldType = propFieldType || contextFieldType;
  const [modeSwitchVisible, setModeSwitchVisible] = useState(false);

  const handleModeSwitch = async (newType: ModeSwitchFieldType) => {
    await setFieldType(newType);
    if (navigation) {
      navigation.navigate('Home');
    }
  };

  const actions = fieldType === 'dsh' ? DSH_FIELD_ACTIONS : fieldType === 'arb' ? ARB_FIELD_ACTIONS : [];

  const canNavigate = !!navigation?.navigate;

  const getTypeTitle = () => {
    if (fieldType === 'dsh') return t(`${ns}.titleDsh`);
    if (fieldType === 'arb') return t(`${ns}.titleArb`);
    return t(`${ns}.titleApp`);
  };

  const getTypeIcon = () => {
    if (fieldType === 'dsh') return 'directions-car';
    if (fieldType === 'arb') return 'work';
    return 'build';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Simple loading indicator */}
        </View>
      </View>
    );
  }

  if (!fieldType) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="build" size={64} color={semanticRoles.primaryCTA} />
          <Text style={styles.title}>{t(`${ns}.emptyTitle`)}</Text>
          <Text style={styles.subtitle}>{t(`${ns}.emptySubtitle`)}</Text>
        </View>
      </View>
    );
  }

  const primaryActions = actions.filter(a => a.primary);
  const secondaryActions = actions.filter(a => !a.primary);

  return (
    <>
    <ScrollView 
      style={styles.scroll} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerGradient}>
          <View style={styles.headerIconContainer}>
            <ServiceIcon name={getTypeIcon()} size={56} color={semanticRoles.primaryCTAText} />
          </View>
          <Text style={styles.greeting}>{getTypeTitle()}</Text>
          <Text style={styles.greetingSubtitle}>{t('field.greeting_subtitle')}</Text>
        </View>
      </View>

      {/* Primary Actions */}
      {primaryActions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>{t(`${ns}.primarySection`)}</Text>
          {primaryActions.map(({ screen, label, icon }) => (
            <AnimatedCard
              key={screen}
              style={styles.primaryActionCard}
              onPress={() => canNavigate && navigation!.navigate(screen)}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIconContainer}>
                  <ServiceIcon name={icon} size={24} color={semanticRoles.primaryCTAText} />
                </View>
                <Text style={styles.primaryActionText}>{label}</Text>
              </View>
            </AnimatedCard>
          ))}
        </View>
      )}

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>{t(`${ns}.allToolsSection`)}</Text>
          <View style={styles.actionsGrid}>
            {secondaryActions.map(({ screen, label, icon }) => (
              <AnimatedCard
                key={screen}
                style={styles.actionCard}
                onPress={() => canNavigate && navigation!.navigate(screen)}
              >
                <View style={styles.actionIconContainerSmall}>
                  <ServiceIcon name={icon} size={20} color={semanticRoles.primaryCTA} />
                </View>
                <Text style={styles.actionText} numberOfLines={2}>{label}</Text>
              </AnimatedCard>
            ))}
          </View>
        </View>
      )}

      {/* سداد — مشترك لجميع أنواع الميدان */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textAlignStart]}>{t(`${ns}.sudadSection`)}</Text>
        <View style={styles.actionsGrid}>
          <AnimatedCard
            style={styles.actionCard}
            onPress={() => canNavigate && navigation!.navigate('wlt_sudad_home')}
          >
            <View style={styles.actionIconContainerSmall}>
              <ServiceIcon name="receipt" size={20} color={semanticRoles.primaryCTA} />
            </View>
            <Text style={styles.actionText} numberOfLines={2}>{t(`${ns}.sudad`)}</Text>
          </AnimatedCard>
        </View>
      </View>

      {/* Mode Switch Button */}
      {canNavigate && (
        <AnimatedCard
          style={styles.modeSwitchButton}
          onPress={() => setModeSwitchVisible(true)}
        >
          <View style={styles.modeSwitchContent}>
            <ServiceIcon name="settings" size={20} color={semanticRoles.primaryCTA} />
            <Text style={styles.modeSwitchText}>تبديل نوع العمل الميداني</Text>
          </View>
        </AnimatedCard>
      )}

      {/* Dev Mode Switch */}
      {typeof __DEV__ !== 'undefined' && __DEV__ && canNavigate && (
        <AnimatedCard
          style={styles.devButton}
          onPress={() => navigation!.navigate('FieldTypeSelect')}
        >
          <Text style={styles.devButtonText}>تغيير النوع (تطوير)</Text>
        </AnimatedCard>
      )}
    </ScrollView>

    {/* Mode Switch Sheet */}
    <FieldModeSwitchSheet
      visible={modeSwitchVisible}
      currentType={fieldType}
      onSelect={handleModeSwitch}
      onClose={() => setModeSwitchVisible(false)}
    />
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: BTHWANI_SPACING.contentH,
  },
  scroll: { 
    flex: 1, 
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollContent: { 
    padding: BTHWANI_SPACING.contentH, 
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  headerSection: {
    marginBottom: BTHWANI_SPACING.xl,
    borderRadius: BTHWANI_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  headerGradient: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xxl,
    paddingBottom: BTHWANI_SPACING.xxl,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: semanticRoles.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: semanticRoles.primaryCTAText + '20',
  },
  greeting: { 
    fontSize: 28,
    fontWeight: '700', 
    color: semanticRoles.primaryCTAText, 
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  greetingSubtitle: {
    fontSize: 16,
    color: semanticRoles.primaryCTAText,
    opacity: 0.95,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.lg,
    letterSpacing: 0.3,
  },
  primaryActionCard: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTAText + '10',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.primaryCTA + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  actionIconContainerSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: semanticRoles.primaryCTA + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA + '20',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: semanticRoles.text, 
    marginBottom: BTHWANI_SPACING.sm, 
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: semanticRoles.textMuted, 
    marginBottom: BTHWANI_SPACING.xl, 
    textAlign: 'center',
  },
  modeSwitchButton: {
    marginTop: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '30',
  },
  modeSwitchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  modeSwitchText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  devButton: {
    marginTop: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  devButtonText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
});
