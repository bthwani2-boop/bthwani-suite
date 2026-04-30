// Auto-generated screen for platform_captain_documents_upsert
// Surface: app-captain | Service: platform
// Operation: POST /api/captain/documents
// Description: Upload/update captain verification documents

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  icon: string;
}

interface AutoPlatformCaptainDocumentsUpsertProps {
  navigation?: any;
  route?: {
    params?: {
      documentId?: string;
    };
  };
}

export const AutoPlatformCaptainDocumentsUpsert: React.FC<AutoPlatformCaptainDocumentsUpsertProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes: DocumentType[] = [
    {
      id: 'id',
      name: 'الهوية الشخصية',
      description: t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.idDocumentFrontBack'),
      required: true,
      icon: '🆔'
    },
    {
      id: 'license',
      name: 'رخصة القيادة',
      description: t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.drivingLicenseValid'),
      required: true,
      icon: '🚗'
    },
    {
      id: 'vehicle',
      name: 'استمارة المركبة',
      description: t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.vehicleRegistrationAndInsurance'),
      required: true,
      icon: '🚙'
    },
    {
      id: 'background_check',
      name: 'فحص الخلفية',
      description: t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.backgroundCheckCertificate'),
      required: false,
      icon: '🔍'
    },
    {
      id: 'insurance',
      name: 'تأمين المركبة',
      description: t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.vehicleInsuranceValid'),
      required: true,
      icon: '🛡️'
    }
  ];

  const handleDocumentSelect = useCallback((document: DocumentType) => {
    setSelectedDocument(document);
  }, []);

  const handleUploadDocument = useCallback(async () => {
    if (!selectedDocument) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      clearInterval(progressInterval);
      setUploadProgress(100);

      Alert.alert(
        t('surfaces.تم_رفع_الوثيقة_بنجاح'),
        `تم رفع ${selectedDocument.name} بنجاح وسيتم مراجعتها خلال 24-48 ساعة.`,
        [
          {
            text: t('surfaces.موافق'),
            onPress: () => {
              navigation?.navigate('platform_captain_documents_get');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.errorMessage'), t('platform.app-captain.mobile.auto_platform_captain_documents_upsert.errorMessage'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedDocument, navigation]);

  const handleBackToDocuments = useCallback(() => {
    navigation?.navigate('platform_captain_documents_get');
  }, [navigation]);

  return (
    <ScreenWrapper
      state="content"
      screenName="platform_captain_documents_upsert"
      operationName="POST /api/captain/documents"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📤 رفع الوثائق</Text>
          <Text style={styles.subtitle}>
            اختر الوثيقة التي تريد رفعها واتبع التعليمات
          </Text>
        </View>

        {/* Document Types */}
        <View style={styles.documentTypes}>
          {documentTypes.map((document) => (
            <TouchableOpacity
              key={document.id}
              style={[
                styles.documentTypeCard,
                selectedDocument?.id === document.id && styles.selectedDocumentType
              ]}
              onPress={() => handleDocumentSelect(document)}
            >
              <View style={[styles.documentTypeHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.documentIcon}>
                  <Text style={styles.documentIconText}>{document.icon}</Text>
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>
                    {document.name}
                    {document.required && <Text style={styles.requiredStar}> *</Text>}
                  </Text>
                  <Text style={styles.documentDescription}>
                    {document.description}
                  </Text>
                </View>
                {selectedDocument?.id === document.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedCheckmark}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Instructions */}
        {selectedDocument && (
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>تعليمات الرفع لـ {selectedDocument.name}</Text>

            <View style={styles.instructionsList}>
              <Text style={styles.instruction}>• تأكد من وضوح الصورة وإضاءتها الجيدة</Text>
              <Text style={styles.instruction}>• يجب أن تكون جميع المعلومات واضحة القراءة</Text>
              <Text style={styles.instruction}>• حجم الملف لا يزيد عن 5 ميجابايت</Text>
              <Text style={styles.instruction}>• الصيغ المدعومة: JPG, PNG, PDF</Text>
            </View>

            {/* Upload Progress */}
            {isUploading && (
              <View style={styles.uploadProgress}>
                <Text style={styles.progressText}>جاري رفع الوثيقة...</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${uploadProgress}%` }]}
                  />
                </View>
                <Text style={styles.progressPercent}>{uploadProgress}%</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={[styles.actionsContainer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.backButton]}
            onPress={handleBackToDocuments}
          >
            <Text style={styles.backButtonText}>العودة للوثائق</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.uploadButton,
              (!selectedDocument || isUploading) && styles.buttonDisabled
            ]}
            onPress={handleUploadDocument}
            disabled={!selectedDocument || isUploading}
          >
            <Text style={[
              styles.uploadButtonText,
              (!selectedDocument || isUploading) && styles.buttonTextDisabled
            ]}>
              {isUploading ? 'جاري الرفع...' : t('surfaces.رفع_الوثيقة')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ معلومات مهمة</Text>
          <Text style={styles.infoText}>
            • الوثائق المطلوبة (*) إجبارية للعمل في المنصة{'\n'}
            • يتم مراجعة الوثائق خلال 24-48 ساعة{'\n'}
            • سيتم إشعارك عبر التطبيق بحالة المراجعة{'\n'}
            • جميع البيانات محمية ومشفرة
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  documentTypes: {
    padding: BTHWANI_SPACING.md,
  },
  documentTypeCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 2,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDocumentType: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  documentTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  documentIconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: 2,
  },
  requiredStar: {
    color: BTHWANI_COLORS.error,
  },
  documentDescription: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 18,
  },
  selectedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BTHWANI_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.surface,
  },
  uploadSection: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  instructionsList: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  instruction: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: 4,
    lineHeight: 20,
  },
  uploadProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: 4,
    marginBottom: BTHWANI_SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surface,
  },
  backButtonText: {
    color: BTHWANI_COLORS.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: BTHWANI_COLORS.primary,
  },
  uploadButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
  infoSection: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surface,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    lineHeight: 20,
  },
});

export default AutoPlatformCaptainDocumentsUpsert;
