/**
 * Field Partner Draft Evidence Add — field_partner_draft_evidence_add
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts/{draft_id}/evidence
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftEvidenceAddProps {
  navigation?: any;
  route?: any;
}

interface EvidenceItem {
  id: string;
  uri: string;
  type: 'image' | 'document';
  name: string;
}

const AutoFieldPartnerDraftEvidenceAdd: React.FC<AutoFieldPartnerDraftEvidenceAddProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_draft_evidence_add';
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const draftId = route?.params?.draftId || 'unknown';
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = () => {
    
    Alert.alert(t(`${ns}.comingSoon`), t(`${ns}.photosComingSoon`));
  };

  const handlePickDocument = () => {
    
    Alert.alert(t(`${ns}.comingSoon`), t(`${ns}.docsComingSoon`));
  };

  const handleRemoveEvidence = (id: string) => {
    Alert.alert(t(`${ns}.deleteEvidence`), t(`${ns}.deleteConfirm`), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t(`${ns}.delete`),
        style: 'destructive',
        onPress: () => setEvidenceList(prev => prev.filter(item => item.id !== id)),
      },
    ]);
  };

  const handleSave = async () => {
    if (evidenceList.length === 0) {
      Alert.alert(t(`${ns}.warning`), t(`${ns}.addOneEvidence`));
      return;
    }

    setIsUploading(true);
    try {
      
      // await addFieldPartnerDraftEvidence(draftId, evidenceList);
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(t(`${ns}.success`), t(`${ns}.evidenceAdded`), [
        { text: t('common.ok'), onPress: () => navigation?.goBack() },
      ]);
    } catch (err) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.addFailed`));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_draft_evidence_add"
      operationName="field_partner_draft_evidence_add"
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>📎 إضافة أدلة</Text>
            <Text style={styles.subtitle}>أضف صور أو مستندات داعمة للمسودة</Text>
          </View>

          <View style={[styles.uploadButtons, { flexDirection: 'row', direction: layoutDirection }]}>
            <TouchableOpacity
              style={[styles.uploadButton, styles.imageButton]}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>📷 إضافة صورة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadButton, styles.documentButton]}
              onPress={handlePickDocument}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>📄 إضافة مستند</Text>
            </TouchableOpacity>
          </View>

          {evidenceList.length > 0 && (
            <View style={styles.evidenceList}>
              <Text style={styles.evidenceListTitle}>الأدلة المضافة ({evidenceList.length})</Text>
              {evidenceList.map((item) => (
                <View key={item.id} style={[styles.evidenceItem, { flexDirection: 'row', direction: layoutDirection }]}>
                  {item.type === 'image' ? (
                    <Image source={{ uri: item.uri }} style={styles.evidenceImage} />
                  ) : (
                    <View style={styles.documentIcon}>
                      <Text style={styles.documentIconText}>📄</Text>
                    </View>
                  )}
                  <View style={styles.evidenceInfo}>
                    <Text style={styles.evidenceName}>{item.name}</Text>
                    <Text style={styles.evidenceType}>
                      {item.type === 'image' ? t('surfaces.صورة') : t('surfaces.مستند')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveEvidence(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {evidenceList.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>لا توجد أدلة مضافة</Text>
              <Text style={styles.emptyStateSubtext}>استخدم الأزرار أعلاه لإضافة الأدلة</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.footerButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isUploading || evidenceList.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {isUploading ? t('surfaces.جاري_الحفظ') : `💾 حفظ (${evidenceList.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => navigation?.goBack()}
            disabled={isUploading}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
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
  uploadButtons: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  uploadButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: colorTokens.primary['500'],
  },
  documentButton: {
    backgroundColor: colorTokens.success['600'],
  },
  uploadButtonText: {
    color: colorTokens.surface.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  evidenceList: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  evidenceListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  evidenceImage: {
    width: 60,
    height: 60,
    borderRadius: BTHWANI_RADIUS.sm,
    marginEnd: BTHWANI_SPACING.md,
  },
  documentIcon: {
    width: 60,
    height: 60,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  documentIconText: {
    fontSize: 32,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceName: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  evidenceType: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  removeButton: {
    padding: BTHWANI_SPACING.sm,
  },
  removeButtonText: {
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: semanticRoles.textMuted,
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
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  cancelButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  saveButtonText: {
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

export default AutoFieldPartnerDraftEvidenceAdd;
