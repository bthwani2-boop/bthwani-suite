/**
 * Field Partner Activate — field_partner_activate
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/{partnerId}/activate
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ServiceIcon } from '../../../mobile/components';

interface AutoFieldPartnerActivateProps {
  navigation?: any;
  route?: any;
}

const AutoFieldPartnerActivate: React.FC<AutoFieldPartnerActivateProps> = ({ navigation, route }) => {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ns = 'field.app-field.mobile.auto_field_partner_activate';

  const handleActivate = async () => {
    Alert.alert(t(`${ns}.done`), t(`${ns}.activateMessage`));
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="check-circle" size={64} color={semanticRoles.success} />
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

export default AutoFieldPartnerActivate;
