// Auto-generated screen for dsh_captain_proof_upload
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/captain/jobs/{jobId}/proof
// Description: Upload proof of delivery for job

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { uploadDshCaptainProof } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface AutoDshCaptainProofUploadProps {
  navigation?: any;
  route?: {
    params?: {
      jobId: string;
      job?: {
        id: string;
        customer_name: string;
        delivery_location: string;
      };
    };
  };
}

export const AutoDshCaptainProofUpload: React.FC<AutoDshCaptainProofUploadProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const jobId = route?.params?.jobId || '';
  const job = route?.params?.job;

  const handleSelectImage = () => {
    // In real app, use image picker
    Alert.alert(
      t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.chooseImageTitle'),
      t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.chooseImageMethodTitle'),
      [
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.optionCamera'), onPress: () => handleImagePicked('camera') },
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.optionGallery'), onPress: () => handleImagePicked('gallery') },
        { text: t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.cancelButton'), style: 'cancel' },
      ]
    );
  };

  const handleImagePicked = (source: string) => {
    // Mock: In real app, use expo-image-picker or react-native-image-picker
    setProofImage('mock_image_uri');
  };

  const handleUpload = async () => {
    if (!proofImage) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.validationImageRequired'), t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.validationImageRequired'));
      return;
    }

    if (isUploading) return;

    setIsUploading(true);
    try {
      const success = await uploadDshCaptainProof(jobId, { proofType: 'delivery', imageUrl: proofImage, notes: '' });
      if (!success) throw new Error('فشل في الرفع');
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.successTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.successUploadMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.okButton'), onPress: () => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home')) }]
      );
    } catch (error) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.errorUploadMessage'), t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.errorUploadMessage'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>رفع إثبات التسليم</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            قم برفع صورة تثبت تسليم الطلب للعميل
          </Text>

          {job && (
            <View style={styles.jobInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>العميل:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{job.customer_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>عنوان التسليم:</Text>
                <Text style={[styles.infoValue, textAlignStart]}>{job.delivery_location}</Text>
              </View>
            </View>
          )}

          <View style={styles.imageContainer}>
            {proofImage ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: proofImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setProofImage(null)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectImage}
                activeOpacity={0.8}
              >
                <Text style={styles.selectButtonText}>📷 اختر صورة</Text>
                <Text style={styles.selectButtonSubtext}>
                  اضغط لاختيار صورة من الكاميرا أو المعرض
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.requirements}>
            <Text style={[styles.requirementsTitle, textAlignStart]}>متطلبات الصورة:</Text>
            <Text style={[styles.requirementItem, textAlignStart]}>• يجب أن تكون الصورة واضحة</Text>
            <Text style={[styles.requirementItem, textAlignStart]}>• يجب أن تظهر عنوان التسليم</Text>
            <Text style={[styles.requirementItem, textAlignStart]}>• الحد الأقصى لحجم الملف: 5 MB</Text>
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, (!proofImage || isUploading) && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={!proofImage || isUploading}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadButtonText}>
              {isUploading ? t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.uploadProofButton') : t('dsh.app-captain.mobile.auto_dsh_captain_proof_upload.uploadProofButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  jobInfo: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.sm,
  },
  imageContainer: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: semanticRoles.bg,
  },
  removeButton: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    end: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.stateError.icon,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colorTokens.surface.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.border,
    borderStyle: 'dashed',
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  selectButtonSubtext: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  requirements: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  requirementItem: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  uploadButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainProofUpload;
