/**
 * Field Partner Suspend — field_partner_suspend
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/{partnerId}/suspend
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';

interface AutoFieldPartnerSuspendProps {
  navigation?: any;
  route?: any;
}

const AutoFieldPartnerSuspend: React.FC<AutoFieldPartnerSuspendProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_suspend';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuspend = async () => {
    Alert.alert(t(`${ns}.done`), t(`${ns}.suspendMessage`));
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="pause-circle" size={64} color={semanticRoles.warning} />
          <Text style={styles.title}>{t(`${ns}.title`)}</Text>
          <Text style={styles.subtitle}>{t(`${ns}.subtitle`)}</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  content: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
});

export default AutoFieldPartnerSuspend;
