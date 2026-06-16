// dsh/frontend/app-field/utils/onboarding-simulation.ts
// Developer-only onboarding simulation helper functions.
// Isolated within app-field to prevent polluting shared domain logic.

export type OnboardingLocationAutofill = {
  city: string;
  zone: string;
  latitude: string;
  longitude: string;
  landmark: string;
  addressLine: string;
  coverageSummary: string;
};

export function simulateGPSAutofill(): OnboardingLocationAutofill {
  return {
    city: 'الرياض',
    zone: 'حي العليا',
    latitude: '24.71358',
    longitude: '46.67529',
    landmark: 'برج المملكة - البوابة الشرقية',
    addressLine: 'طريق الملك فهد، حي العليا',
    coverageSummary: 'نطاق التغطية يغطي كامل مربع العليا وحطين',
  };
}

export function simulateOwnerNameOCR(): string {
  return 'عبدالرحمن بن ثنيان';
}

export function simulateCameraCapture(photoKey: string): string {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `img_${photoKey.replace('PhotoRef', '')}_upload_${randomSuffix}.jpg`;
}
