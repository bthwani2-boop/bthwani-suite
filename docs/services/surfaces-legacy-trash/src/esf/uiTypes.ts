/**
 * ESF UI view-models shared by hooks (runtime). Fixtures may import these types only.
 */

export type EsfRequestStatusUi =
  | 'pending'
  | 'matched'
  | 'completed'
  | 'cancelled';
export type EsfUrgencyUi = 'low' | 'medium' | 'high' | 'critical';
export type EsfContactMethod = 'phone' | 'whatsapp' | 'in_app';
export type EsfBeneficiaryUi = 'self' | 'other';
export type EsfMedicalReasonUi =
  | 'major_surgery'
  | 'open_heart'
  | 'blood_disorder'
  | 'severe_bleeding'
  | 'postpartum_bleeding'
  | 'accident'
  | 'cancer_treatment'
  | 'other';

export interface EsfUserProfile {
  bloodType?: string;
  location?: { lat: number; lng: number };
  /**
   * Max distance in kilometers.
   * Default: `10` in filter logic.
   */
  maxDistance?: number;
}

export interface EsfRequest {
  id: string;
  bloodType: string;
  units: number;
  status: EsfRequestStatusUi;
  location: string;
  locationCoords?: { lat: number; lng: number };
  timestamp: string;
  urgency: EsfUrgencyUi;
  hospitalName?: string;
  /** Distance in kilometers (derived). */
  distance?: number;
  /** Number of matched donors/responses (derived). */
  responsesCount?: number;
  /** Whether the request belongs to current user (derived). */
  isMyRequest?: boolean;
  /** Match identifier when the backend resolves a concrete donor/requester pairing. */
  matchId?: string;

  // Requester-mode fields (derived/mapped)
  patientName?: string;
  beneficiary?: EsfBeneficiaryUi;
  medicalReason?: EsfMedicalReasonUi;
  medicalReasonLabel?: string;
  medicalReasonNote?: string;
  contactMethod?: EsfContactMethod;
  contactInfo?: string;
  identificationMethod?: 'code' | 'hospital_reception' | 'photo';
  secureCode?: string;
  patientPhoto?: string;
  matchedDonors?: Array<{
    id: string;
    name: string;
    distance: string;
    eta: string;
    donorBloodType?: string;
    donorRating?: number;
  }>;
}

export interface BloodDonationRequest {
  id: string;
  bloodType: string;
  units: number;
  status: EsfRequestStatusUi;
  location: string;
  hospitalName: string;
  timestamp: string;
  urgency: EsfUrgencyUi;
  matchedDonors?: number;
}

export interface EsfRequestDetail {
  id: string;
  bloodType: string;
  units: number;
  status: string;
  urgency: string;
  location: { address: string; coordinates: string };
  hospitalName: string;
  beneficiary?: EsfBeneficiaryUi;
  medicalReason?: EsfMedicalReasonUi;
  medicalReasonLabel?: string;
  medicalReasonNote?: string;
  contactMethod?: EsfContactMethod;
  contactInfo?: string;
  requester: { name: string; phone: string };
  patient: { name: string; age: number; condition: string };
  matchedDonors: Array<{
    id: string;
    name: string;
    distance: string;
    eta: string;
  }>;
  timeline: Array<{ time: string; event: string; details: string }>;
  notes: string;
  createdAt: string;
  expiresAt: string;
}

export interface EsfRequestCancelDetail {
  id: string;
  bloodType: string;
  units: number;
  location: string;
  hospitalName: string;
  status: string;
  matchedDonors: number;
}

export interface EsfMatchPreview {
  id: string;
  requestBloodType: string;
  requestUnits: number;
  donorName: string;
  donorBloodType: string;
  location: string;
  distance: string;
  eta: string;
  donorRating: number;
  donationCount: number;
  medicalReasonLabel?: string;
  medicalReasonNote?: string;
  contactMethod?: EsfContactMethod;
  contactInfo?: string;
}
