/**
 * Field Partner Service Attach — field_partner_service_attach
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts/{draft_id}/attach-service
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerServiceAttachProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_service_attach';

const AutoFieldPartnerServiceAttach: React.FC<AutoFieldPartnerServiceAttachProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const draftId = route?.params?.draftId || 'unknown';
  const [selectedService, setSelectedService] = useState<'DSH' | 'ARB' | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);

  const services = useMemo(() => [
    {
      id: 'DSH' as const,
      name: t(`${NS}.serviceDshName`),
      icon: '🏪',
      description: t(`${NS}.serviceDshDesc`),
      color: colorTokens.bthwani.orange,
    },
    {
      id: 'ARB' as const,
      name: t(`${NS}.serviceArbName`),
      icon: '🎭',
      description: t(`${NS}.serviceArbDesc`),
      color: colorTokens.warning['500'],
    },
  ], [t]);

  const handleServiceSelect = (serviceId: 'DSH' | 'ARB') => {
    setSelectedService(serviceId);
  };

  const handleAttach = async () => {
    if (!selectedService) {
      Alert.alert(t(`${NS}.warning`), t(`${NS}.selectServiceType`));
      return;
    }
    const serviceName = selectedService === 'DSH' ? t(`${NS}.serviceDshName`) : t(`${NS}.serviceArbName`);
    Alert.alert(
      t(`${NS}.confirmTitle`),
      t(`${NS}.confirmMessage`, { serviceName }),
      [
        { text: t(`${NS}.cancel`), style: 'cancel' },
        {
          text: t(`${NS}.attach`),
          onPress: async () => {
            setIsAttaching(true);
            try {
              // await attachFieldPartnerService(draftId, selectedService);
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert(t(`${NS}.success`), t(`${NS}.attachSuccess`), [
                { text: t(`${NS}.ok`), onPress: () => navigation?.goBack() },
              ]);
            } catch (err) {
              Alert.alert(t(`${NS}.error`), t(`${NS}.attachFailed`));
            } finally {
              setIsAttaching(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_service_attach"
      operationName="field_partner_service_attach"
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>🔗 {t(`${NS}.title`)}</Text>
            <Text style={styles.subtitle}>{t(`${NS}.subtitle`)}</Text>
          </View>

          <View style={styles.servicesList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService === service.id && styles.serviceCardSelected,
                  selectedService === service.id && { borderColor: service.color },
                ]}
                onPress={() => handleServiceSelect(service.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                  <Text style={styles.serviceIconText}>{service.icon}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                {selectedService === service.id && (
                  <View style={[styles.checkmark, { backgroundColor: service.color }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedService && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ {t(`${NS}.infoTitle`)}</Text>
              <Text style={styles.infoDesc}>{t(`${NS}.infoDesc`)}</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.footerButton, styles.attachButton, !selectedService && styles.disabledButton]}
            onPress={handleAttach}
            disabled={isAttaching || !selectedService}
            activeOpacity={0.8}
          >
            <Text style={styles.attachButtonText}>
              {isAttaching ? t(`${NS}.attaching`) : `🔗 ${t(`${NS}.attachButton`)}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => navigation?.goBack()}
            disabled={isAttaching}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>{t(`${NS}.cancel`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  servicesList: {
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  serviceCardSelected: {
    borderWidth: 2,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: BTHWANI_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  serviceIconText: {
    fontSize: 32,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  serviceDescription: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: BTHWANI_SPACING.md,
  },
  checkmarkText: {
    color: colorTokens.surface.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: colorTokens.primary['100'],
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: colorTokens.primary['300'],
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colorTokens.primary['800'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  infoDesc: {
    fontSize: 14,
    color: colorTokens.primary['800'],
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  attachButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  attachButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AutoFieldPartnerServiceAttach;
