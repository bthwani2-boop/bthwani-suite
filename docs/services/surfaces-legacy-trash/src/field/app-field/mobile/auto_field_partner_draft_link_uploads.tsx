/**
 * Field Partner Draft Link Uploads — field_partner_draft_link_uploads
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts/{draft_id}/uploads/link
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftLinkUploadsProps {
  navigation?: any;
  route?: any;
}

interface UploadItem {
  id: string;
  url: string;
  name: string;
}

const AutoFieldPartnerDraftLinkUploads: React.FC<AutoFieldPartnerDraftLinkUploadsProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_draft_link_uploads';
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const draftId = route?.params?.draftId || 'unknown';
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [linkedUploads, setLinkedUploads] = useState<UploadItem[]>([]);
  const [isLinking, setIsLinking] = useState(false);

  const handleAddUpload = () => {
    if (!uploadUrl.trim()) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.linkFilePrompt`));
      return;
    }

    const newUpload: UploadItem = {
      id: Date.now().toString(),
      url: uploadUrl.trim(),
      name: uploadName.trim() || `مرفق ${linkedUploads.length + 1}`,
    };

    setLinkedUploads(prev => [...prev, newUpload]);
    setUploadUrl('');
    setUploadName('');
  };

  const handleRemoveUpload = (id: string) => {
    setLinkedUploads(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    if (linkedUploads.length === 0) {
      Alert.alert(t(`${ns}.warning`), t(`${ns}.linkOneFile`));
      return;
    }

    setIsLinking(true);
    try {
      
      // await linkFieldPartnerDraftUploads(draftId, linkedUploads);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(t(`${ns}.success`), t(`${ns}.linkSuccess`), [
        { text: t('common.ok'), onPress: () => navigation?.goBack() },
      ]);
    } catch (err) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.linkFailed`));
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_draft_link_uploads"
      operationName="field_partner_draft_link_uploads"
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>🔗 ربط المرفقات</Text>
            <Text style={styles.subtitle}>ربط الملفات المرفقة بالمسودة عبر الروابط</Text>
          </View>

          <View style={styles.addSection}>
            <Text style={styles.sectionTitle}>إضافة رابط جديد</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>رابط الملف *</Text>
              <TextInput
                style={styles.input}
                value={uploadUrl}
                onChangeText={setUploadUrl}
                placeholder="https://example.com/file.pdf"
                placeholderTextColor={semanticRoles.textMuted}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t(`${ns}.fileNameOptional`)}</Text>
              <TextInput
                style={styles.input}
                value={uploadName}
                onChangeText={setUploadName}
                placeholder={t(`${ns}.fileNamePlaceholder`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddUpload}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>➕ إضافة</Text>
            </TouchableOpacity>
          </View>

          {linkedUploads.length > 0 && (
            <View style={styles.linkedSection}>
              <Text style={styles.sectionTitle}>المرفقات المربوطة ({linkedUploads.length})</Text>
              {linkedUploads.map((item) => (
                <View key={item.id} style={[styles.uploadItem, { flexDirection: 'row', direction: layoutDirection }]}>
                  <View style={styles.uploadInfo}>
                    <Text style={styles.uploadName}>{item.name}</Text>
                    <Text style={styles.uploadUrl} numberOfLines={1}>{item.url}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveUpload(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {linkedUploads.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>لا توجد مرفقات مربوطة</Text>
              <Text style={styles.emptyStateSubtext}>استخدم النموذج أعلاه لإضافة المرفقات</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.footerButton, styles.saveButton, linkedUploads.length === 0 && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLinking || linkedUploads.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {isLinking ? t('surfaces.جاري_الربط') : `💾 حفظ (${linkedUploads.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => navigation?.goBack()}
            disabled={isLinking}
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
  addSection: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.bg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
  },
  addButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  addButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  linkedSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  uploadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadName: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  uploadUrl: {
    fontSize: 12,
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
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.5,
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

export default AutoFieldPartnerDraftLinkUploads;
