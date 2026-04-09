// Auto-generated screen for platform_captain_documents_get
// Surface: app-captain | Service: platform
// Operation: GET /api/captain/documents
// Description: Unified documents screen - shows all verification documents across services

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { AlertButton } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { buildPlatformCaptainDocumentsGetMock, type Document } from '../../fixtures/captainDocumentsGet';

interface AutoPlatformCaptainDocumentsGetProps {
  navigation?: any;
}

export const AutoPlatformCaptainDocumentsGet: React.FC<AutoPlatformCaptainDocumentsGetProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise(resolve => setTimeout(resolve, 1200));
      setDocuments(buildPlatformCaptainDocumentsGetMock(t));
    } catch (err) {
      setError(t('surfaces.فشل_في_تحميل_الوثائق'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id': return '🆔 الهوية الشخصية';
      case 'license': return '🚗 رخصة القيادة';
      case 'vehicle': return '🚙 استمارة المركبة';
      case 'background_check': return '🔍 فحص الخلفية';
      case 'insurance': return '🛡️ تأمين المركبة';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colorTokens.success['600'];
      case 'pending': return BTHWANI_COLORS.accent;
      case 'rejected': return BTHWANI_COLORS.error;
      case 'expired': return colorTokens.warning['500'];
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('surfaces.موثق');
      case 'pending': return 'قيد المراجعة';
      case 'rejected': return 'مرفوض';
      case 'expired': return t('surfaces.منتهي_الصلاحية');
      default: return status;
    }
  };

  const handleDocumentPress = useCallback((document: Document) => {
    const buttons: AlertButton[] = [{ text: 'إغلاق' }];

    if (document.status === 'expired' || document.status === 'rejected') {
      buttons.push({
        text: 'إعادة رفع',
        onPress: () => handleReuploadDocument(document),
      });
    }

    Alert.alert(
      document.name,
      `الحالة: ${getStatusText(document.status)}
تاريخ الرفع: ${new Date(document.upload_date).toLocaleDateString('ar-SA')}
${document.expiry_date ? `تاريخ الانتهاء: ${new Date(document.expiry_date).toLocaleDateString('ar-SA')}` : ''}
${document.rejection_reason ? `سبب الرفض: ${document.rejection_reason}` : ''}`,
      buttons
    );
  }, []);

  const handleReuploadDocument = useCallback((document: Document) => {
    Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_documents_get.reuploadDocument'), `سيتم توجيهك لإعادة رفع ${document.name}`);
    // Navigate to upsert screen
    navigation?.navigate('platform_captain_documents_upsert', { documentId: document.id });
  }, [navigation]);

  const getPendingDocumentsCount = () => {
    return documents.filter(doc => doc.status === 'pending').length;
  };

  const getExpiredDocumentsCount = () => {
    return documents.filter(doc => doc.status === 'expired').length;
  };

  if (isLoading) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('surfaces.جاري_تحميل_الوثائق')}
        screenName="platform_captain_documents_get"
        operationName="GET /api/captain/documents"
      />
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={loadDocuments}
        errorActionText={t('surfaces.إعادة_المحاولة')}
        screenName="platform_captain_documents_get"
        operationName="GET /api/captain/documents"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="platform_captain_documents_get"
      operationName="GET /api/captain/documents"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📄 {t('platform.captain_documents_title')}</Text>
          <Text style={styles.subtitle}>
            {t('platform.captain_documents_subtitle')}
          </Text>

          {/* Status Summary */}
          <View style={[styles.statusSummary, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{getPendingDocumentsCount()}</Text>
              <Text style={styles.statusLabel}>{t('platform.under_review')}</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={[styles.statusNumber, { color: colorTokens.warning['500'] }]}>{getExpiredDocumentsCount()}</Text>
              <Text style={styles.statusLabel}>{t('platform.expired')}</Text>
            </View>
          </View>
        </View>

        {/* Documents List */}
        <View style={styles.documentsList}>
          {documents.map((document) => (
            <TouchableOpacity
              key={document.id}
              style={styles.documentCard}
              onPress={() => handleDocumentPress(document)}
            >
              <View style={[styles.documentHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.documentType}>{getDocumentTypeLabel(document.type)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
                  <Text style={styles.statusBadgeText}>{getStatusText(document.status)}</Text>
                </View>
              </View>

              <View style={styles.documentDetails}>
                <Text style={styles.uploadDate}>
                  تاريخ الرفع: {new Date(document.upload_date).toLocaleDateString('ar-SA')}
                </Text>
                {document.expiry_date && (
                  <Text style={styles.expiryDate}>
                    تاريخ الانتهاء: {new Date(document.expiry_date).toLocaleDateString('ar-SA')}
                  </Text>
                )}
                {document.rejection_reason && (
                  <Text style={styles.rejectionReason}>
                    سبب الرفض: {document.rejection_reason}
                  </Text>
                )}
              </View>

              {(document.status === 'expired' || document.status === 'rejected') && (
                <TouchableOpacity
                  style={styles.reuploadButton}
                  onPress={() => handleReuploadDocument(document)}
                >
                  <Text style={styles.reuploadButtonText}>إعادة الرفع</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ معلومات مهمة</Text>
          <Text style={styles.infoText}>
            • جميع الوثائق مطلوبة للعمل في المنصة{'\n'}
            • الوثائق المرفوضة تحتاج إعادة رفع{'\n'}
            • الوثائق المنتهية الصلاحية تحتاج تجديد{'\n'}
            • يتم مراجعة الوثائق خلال 24-48 ساعة
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
    marginBottom: BTHWANI_SPACING.lg,
    lineHeight: 22,
  },
  statusSummary: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  statusDivider: {
    width: 1,
    backgroundColor: BTHWANI_COLORS.surface,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  documentsList: {
    padding: BTHWANI_SPACING.md,
  },
  documentCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  documentType: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    flex: 1,
    marginEnd: BTHWANI_SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  documentDetails: {
    marginBottom: BTHWANI_SPACING.md,
  },
  uploadDate: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: 2,
  },
  rejectionReason: {
    fontSize: 14,
    color: BTHWANI_COLORS.error,
    fontStyle: 'italic',
  },
  reuploadButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  reuploadButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
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

export default AutoPlatformCaptainDocumentsGet;
