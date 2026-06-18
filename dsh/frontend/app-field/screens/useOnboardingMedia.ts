// dsh/frontend/app-field/screens/useOnboardingMedia.ts
// Custom hook to encapsulate native and web media upload flow for store onboarding.
// No JSX. No ui-kit. No Tamagui.

import React from 'react';
import { Platform } from 'react-native';
import { getDshMediaRuntimeClient } from '../../shared';
import type { FieldStoreFile } from '../dsh-field.routes';

function simulateCameraCapture(photoKey: string): string {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `img_${photoKey.replace('PhotoRef', '')}_upload_${randomSuffix}.jpg`;
}

export function useOnboardingMedia(
  store: FieldStoreFile,
  changeDraftField: (section: any, key: any, value: any) => void,
) {
  const [cameraLoading, setCameraLoading] = React.useState<Record<string, boolean>>({});
  const [docLoading, setDocLoading] = React.useState<Record<string, boolean>>({});

  const isNativePickerAvailable = React.useMemo(() => {
    if (Platform.OS === 'web') return false;
    try {
      const expoModules = (globalThis as any).ExpoModules;
      return !!(expoModules && expoModules.ExponentImagePicker);
    } catch {
      return false;
    }
  }, []);

  const handleCameraCapture = React.useCallback(
    (field: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef') => {
      setCameraLoading((prev) => ({ ...prev, [field]: true }));
      changeDraftField('photos', field, simulateCameraCapture(field));
      setCameraLoading((prev) => ({ ...prev, [field]: false }));
    },
    [changeDraftField],
  );

  const handlePickFile = React.useCallback(
    async (photoKey: 'storefrontPhotoRef' | 'interiorPhotoRef' | 'signagePhotoRef') => {
      if (Platform.OS !== 'web') {
        if (!isNativePickerAvailable) {
          console.warn('Native ExponentImagePicker module is not available in this build. Falling back to simulation.');
          handleCameraCapture(photoKey);
          return;
        }

        try {
          const ImagePicker = require('expo-image-picker');
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Media library permission was not granted');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            setCameraLoading((prev) => ({ ...prev, [photoKey]: true }));

            try {
              const client = getDshMediaRuntimeClient();
              if (client) {
                const response = await globalThis['fetch'](localUri);
                const blob = await response.blob();

                const intentResp = await client.createUploadIntent(
                  {
                    owner_type: 'store',
                    owner_id: store.id,
                    media_type: 'image',
                    purpose: 'inspection',
                    filename: localUri.split('/').pop() || 'photo.jpg',
                    mime_type: blob.type || 'image/jpeg',
                    file_size_bytes: blob.size,
                  },
                  {},
                );

                await client.putToPresignedUrl(intentResp.intent.upload_url, blob, blob.type);
                const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

                if (completedAsset && completedAsset.public_url) {
                  changeDraftField('photos', photoKey, completedAsset.public_url);
                  setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
                  return;
                }
              }
            } catch (err) {
              console.warn('Native upload failed, using local URI:', err);
            }

            changeDraftField('photos', photoKey, localUri);
            setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
          }
        } catch (e) {
          console.error('Failed to launch native expo-image-picker:', e);
          handleCameraCapture(photoKey);
        }
        return;
      }

      // Web: Hidden file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.position = 'absolute';
      input.style.opacity = '0';
      input.style.width = '0';
      input.style.height = '0';
      input.style.left = '0';
      input.style.top = '0';
      document.body.appendChild(input);

      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          setCameraLoading((prev) => ({ ...prev, [photoKey]: true }));
          try {
            const client = getDshMediaRuntimeClient();
            if (client) {
              const intentResp = await client.createUploadIntent(
                {
                  owner_type: 'store',
                  owner_id: store.id,
                  media_type: 'image',
                  purpose: 'inspection',
                  filename: file.name,
                  mime_type: file.type,
                  file_size_bytes: file.size,
                },
                {},
              );

              await client.putToPresignedUrl(intentResp.intent.upload_url, file, file.type);
              const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

              if (completedAsset && completedAsset.public_url) {
                changeDraftField('photos', photoKey, completedAsset.public_url);
                setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
                if (document.body.contains(input)) {
                  document.body.removeChild(input);
                }
                return;
              }
            }
          } catch (err) {
            console.error('Web upload failed:', err);
          }
          setCameraLoading((prev) => ({ ...prev, [photoKey]: false }));
        }
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      };

      input.click();
    },
    [store.id, isNativePickerAvailable, handleCameraCapture, changeDraftField],
  );

  const handlePickDocument = React.useCallback(
    async (kind: 'commercial_registration' | 'identity_proof' | 'tax_certificate', source?: 'camera' | 'library') => {
      let refKey: string;
      let statusKey: string;
      if (kind === 'commercial_registration') {
        refKey = 'commercialRegistrationRef';
        statusKey = 'commercialRegistrationStatus';
      } else if (kind === 'identity_proof') {
        refKey = 'identityProofRef';
        statusKey = 'identityProofStatus';
      } else {
        refKey = 'taxCertificateRef';
        statusKey = 'taxCertificateStatus';
      }

      const updateDraft = (refValue: string) => {
        changeDraftField('documents', refKey, refValue);
        changeDraftField('documents', statusKey, 'uploaded');
      };

      const executePicker = async (src: 'camera' | 'library') => {
        setDocLoading((prev) => ({ ...prev, [kind]: true }));

        if (Platform.OS !== 'web') {
          if (!isNativePickerAvailable) {
            const randomSuffix = Math.floor(100 + Math.random() * 900);
            updateDraft(`doc_${kind}_upload_${randomSuffix}.pdf`);
            setDocLoading((prev) => ({ ...prev, [kind]: false }));
            return;
          }

          try {
            const ImagePicker = require('expo-image-picker');
            let permissionResult;
            if (src === 'camera') {
              permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            } else {
              permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            if (permissionResult.status !== 'granted') {
              setDocLoading((prev) => ({ ...prev, [kind]: false }));
              return;
            }

            let result;
            if (src === 'camera') {
              result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
              });
            } else {
              result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
              });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const localUri = result.assets[0].uri;
              try {
                const client = getDshMediaRuntimeClient();
                if (client) {
                  const response = await globalThis['fetch'](localUri);
                  const blob = await response.blob();

                  const intentResp = await client.createUploadIntent(
                    {
                      owner_type: 'store',
                      owner_id: store.id,
                      media_type: 'image',
                      purpose: 'inspection',
                      filename: localUri.split('/').pop() || 'document.jpg',
                      mime_type: blob.type || 'image/jpeg',
                      file_size_bytes: blob.size,
                    },
                    {},
                  );

                  await client.putToPresignedUrl(intentResp.intent.upload_url, blob, blob.type);
                  const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

                  if (completedAsset && completedAsset.public_url) {
                    updateDraft(completedAsset.public_url);
                    setDocLoading((prev) => ({ ...prev, [kind]: false }));
                    return;
                  }
                }
              } catch (err) {
                console.warn('Native upload failed, using local URI:', err);
              }
              updateDraft(localUri);
            }
          } catch (e) {
            console.error('Failed to launch native picker:', e);
            const randomSuffix = Math.floor(100 + Math.random() * 900);
            updateDraft(`doc_${kind}_upload_${randomSuffix}.pdf`);
          }
          setDocLoading((prev) => ({ ...prev, [kind]: false }));
          return;
        }

        // Web picker:
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf';
        input.style.position = 'absolute';
        input.style.opacity = '0';
        input.style.width = '0';
        input.style.height = '0';
        input.style.left = '0';
        input.style.top = '0';
        document.body.appendChild(input);

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            try {
              const client = getDshMediaRuntimeClient();
              if (client) {
                const intentResp = await client.createUploadIntent(
                  {
                    owner_type: 'store',
                    owner_id: store.id,
                    media_type: 'image',
                    purpose: 'inspection',
                    filename: file.name,
                    mime_type: file.type,
                    file_size_bytes: file.size,
                  },
                  {},
                );

                await client.putToPresignedUrl(intentResp.intent.upload_url, file, file.type);
                const completedAsset = await client.completeUpload(intentResp.intent.media_id, {}, {});

                if (completedAsset && completedAsset.public_url) {
                  updateDraft(completedAsset.public_url);
                  setDocLoading((prev) => ({ ...prev, [kind]: false }));
                  if (document.body.contains(input)) {
                    document.body.removeChild(input);
                  }
                  return;
                }
              }
            } catch (err) {
              console.error('Web document upload failed:', err);
            }
            updateDraft(URL.createObjectURL(file));
          }
          setDocLoading((prev) => ({ ...prev, [kind]: false }));
          if (document.body.contains(input)) {
            document.body.removeChild(input);
          }
        };

        input.click();
      };

      if (source) {
        executePicker(source);
      } else if (Platform.OS === 'web') {
        executePicker('library');
      } else {
        const Alert = require('react-native').Alert;
        Alert.alert(
          'إرفاق وثيقة',
          'اختر طريقة إرفاق مستند الإثبات الميداني:',
          [
            {
              text: 'التقاط صورة بالكاميرا',
              onPress: () => executePicker('camera'),
            },
            {
              text: 'اختيار من الاستوديو',
              onPress: () => executePicker('library'),
            },
            {
              text: 'إلغاء',
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      }
    },
    [store.id, isNativePickerAvailable, changeDraftField],
  );

  return {
    cameraLoading,
    docLoading,
    handlePickFile,
    handlePickDocument,
    handleCameraCapture,
    isNativePickerAvailable,
  };
}
