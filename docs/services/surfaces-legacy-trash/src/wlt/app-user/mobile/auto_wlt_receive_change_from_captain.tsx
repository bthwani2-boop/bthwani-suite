// Receive change from captain — app-client | Service: wlt. Reference: WLT_WALLET_ID_AND_RECEIVE_CODE_REFERENCE.md
// WAVE 7: Central i18n only; all UI via t(ns); verified no stale locale.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import QRCode from 'react-native-qrcode-svg';

interface auto_wlt_receive_change_from_captainProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: Record<string, unknown> };
}

// في الإنتاج: الكود المؤقت يُصدر من الـ backend فقط لضمان عدم تكراره بين العملاء (ثغرة تحويل الفكة لعميل خاطئ)
function generateReceiveCode(): string {
  const n = Math.floor(1000 + 0 * 9000);
  return String(n);
}

export const auto_wlt_receive_change_from_captain: React.FC<auto_wlt_receive_change_from_captainProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [showCode, setShowCode] = useState(false);
  const [receiveCode, setReceiveCode] = useState(() => generateReceiveCode());

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const copyReceiveCode = useCallback(() => {
    if (Platform.OS === 'web') {
      try {
        navigator.clipboard.writeText(receiveCode);
        Alert.alert(t('wlt.app-client.mobile.auto_wlt_receive_change_from_captain.receiveCodeCopied'), t('wlt.app-client.mobile.auto_wlt_receive_change_from_captain.receiveCodeCopied'));
      } catch (_) {}
    } else {
      Share.share({ message: receiveCode, title: t('wlt.app-client.mobile.auto_wlt_receive_change_from_captain.shareCodeTitle') }).catch(() => {});
    }
  }, [receiveCode, t]);

  const refreshReceiveCode = useCallback(() => {
    setReceiveCode(generateReceiveCode());
  }, []);

  const ns = 'wlt.app-client.mobile.auto_wlt_receive_change_from_captain';
  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t(`${ns}.title`)}</Text>
        <Text style={styles.subtitle}>{t(`${ns}.subtitle`)}</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t(`${ns}.cardLabel`)}</Text>
          <Text style={styles.hint}>{t(`${ns}.hint`)}</Text>
          {!showCode ? (
            <TouchableOpacity
              style={styles.showCodeButton}
              onPress={() => setShowCode(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.qrPlaceholderIcon}>📱</Text>
              <Text style={styles.showCodeButtonText}>{t(`${ns}.showCodeButtonText`)}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qrWrap}>
              <Text style={styles.receiveCodeBig}>{receiveCode}</Text>
              <TouchableOpacity style={styles.copyCodeBtn} onPress={copyReceiveCode}>
                <Text style={styles.copyBtnText}>{t(`${ns}.copyBtnText`)}</Text>
              </TouchableOpacity>
              <QRCode value={receiveCode} size={180} backgroundColor={semanticRoles.surface} color={semanticRoles.text} />
              <TouchableOpacity style={styles.refreshCodeBtn} onPress={refreshReceiveCode}>
                <Text style={styles.hideCodeBtnText}>{t(`${ns}.refreshCodeBtnText`)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.hideCodeBtn} onPress={() => setShowCode(false)}>
                <Text style={styles.hideCodeBtnText}>{t(`${ns}.hideCodeBtnText`)}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.linkCard, { flexDirection: 'row', direction: layoutDirection }]}
          onPress={() => handleNavigate('WltTransfersList', { filter: 'incoming' })}
          activeOpacity={0.8}
        >
          <Text style={styles.linkCardText}>{t(`${ns}.linkCardText`)}</Text>
          <Text style={styles.linkCardArrow}>←</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl * 2 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  copyBtnText: { fontSize: 14, fontWeight: '600', color: semanticRoles.primaryCTA },
  hint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  showCodeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.xl,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: semanticRoles.border,
  },
  qrPlaceholderIcon: { fontSize: 48, marginBottom: BTHWANI_SPACING.sm },
  showCodeButtonText: { fontSize: 16, fontWeight: '600', color: semanticRoles.primaryCTA },
  qrWrap: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
  },
  receiveCodeBig: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 8,
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.sm,
  },
  copyCodeBtn: {
    alignSelf: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    marginBottom: BTHWANI_SPACING.md,
  },
  refreshCodeBtn: {
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  hideCodeBtn: {
    marginTop: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  hideCodeBtnText: { fontSize: 14, color: semanticRoles.textMuted },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  linkCardText: { fontSize: 16, fontWeight: '600', color: semanticRoles.text },
  linkCardArrow: { fontSize: 18, color: semanticRoles.primaryCTA },
});

export default auto_wlt_receive_change_from_captain;

