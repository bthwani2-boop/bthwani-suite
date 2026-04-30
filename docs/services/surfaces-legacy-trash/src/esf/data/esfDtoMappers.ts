import type {
  BloodDonationRequest,
  EsfRequestCancelDetail,
  EsfRequestDetail,
  EsfRequestStatusUi,
  EsfUrgencyUi,
} from '../uiTypes';

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** API envelope: { success, data, ... } from services/esf */
export function assertEsfSuccess(raw: unknown): Record<string, unknown> {
  const rec = asRecord(raw);
  if (!rec) {
    throw new Error('Invalid ESF response');
  }
  if (rec.success === false) {
    const err =
      typeof rec.error === 'string'
        ? rec.error
        : (asRecord(rec.error)?.message as string) || 'ESF operation failed';
    throw new Error(err);
  }
  const data = rec.data;
  const inner = asRecord(data);
  if (!inner) {
    throw new Error('ESF response missing data');
  }
  return inner;
}

function mapBackendStatus(s: string | undefined): EsfRequestStatusUi {
  const u = (s ?? '').toUpperCase();
  if (u === 'COMPLETED') return 'completed';
  if (u === 'CANCELLED') return 'cancelled';
  if (u === 'ASSIGNED' || u === 'IN_PROGRESS') return 'matched';
  return 'pending';
}

function mapBackendPriority(p: string | undefined): EsfUrgencyUi {
  const u = (p ?? '').toUpperCase();
  if (u === 'CRITICAL') return 'critical';
  if (u === 'HIGH') return 'high';
  if (u === 'MEDIUM') return 'medium';
  if (u === 'LOW') return 'low';
  return 'medium';
}

function coordString(coords: unknown): string {
  const c = asRecord(coords);
  if (!c) return '';
  const lat = c.lat;
  const lng = c.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
    return `${lat}, ${lng}`;
  }
  return '';
}

export interface BackendRequestRow {
  request_id?: string;
  emergency_type?: string;
  priority?: string;
  description?: string;
  location?: string;
  coordinates?: unknown;
  status?: string;
  reported_at?: string;
  assigned_responders?: unknown[];
}

export function mapRequestRowToBloodDonation(r: BackendRequestRow): BloodDonationRequest {
  const loc = typeof r.location === 'string' ? r.location : '';
  const responders = Array.isArray(r.assigned_responders) ? r.assigned_responders.length : 0;
  return {
    id: String(r.request_id ?? ''),
    bloodType: String(r.emergency_type ?? ''),
    units: 1,
    status: mapBackendStatus(r.status),
    location: loc,
    hospitalName: loc || String(r.description ?? '').slice(0, 80),
    timestamp: String(r.reported_at ?? ''),
    urgency: mapBackendPriority(r.priority),
    matchedDonors: responders > 0 ? responders : undefined,
  };
}

export function mapRequestGetToDetail(r: BackendRequestRow): EsfRequestDetail {
  const loc = typeof r.location === 'string' ? r.location : '';
  const desc = typeof r.description === 'string' ? r.description : '';
  const coords = coordString(r.coordinates);
  const responders = Array.isArray(r.assigned_responders) ? r.assigned_responders : [];
  const donorRows = responders.map((x, i) => {
    const o = asRecord(x);
    return {
      id: String(o?.id ?? `responder-${i}`),
      name: String(o?.name ?? ''),
      distance: String(o?.distance ?? ''),
      eta: String(o?.eta ?? ''),
    };
  });
  return {
    id: String(r.request_id ?? ''),
    bloodType: String(r.emergency_type ?? ''),
    units: 1,
    status: mapBackendStatus(r.status),
    urgency: mapBackendPriority(r.priority),
    location: { address: loc, coordinates: coords },
    hospitalName: loc,
    requester: { name: '', phone: '' },
    patient: { name: '', age: 0, condition: desc },
    matchedDonors: donorRows,
    timeline: [
      {
        time: '',
        event: '',
        details: String(r.reported_at ?? ''),
      },
    ],
    notes: desc,
    createdAt: String(r.reported_at ?? ''),
    expiresAt: '',
  };
}

export function mapRequestRowToCancelDetail(r: BackendRequestRow): EsfRequestCancelDetail {
  const row = mapRequestRowToBloodDonation(r);
  return {
    id: row.id,
    bloodType: row.bloodType,
    units: row.units,
    location: row.location,
    hospitalName: row.hospitalName,
    status: row.status,
    matchedDonors: row.matchedDonors ?? 0,
  };
}

export function parseRequestsListPayload(raw: unknown): BloodDonationRequest[] {
  const data = assertEsfSuccess(raw);
  const requests = data.requests;
  if (!Array.isArray(requests)) {
    return [];
  }
  return requests.map((x) => mapRequestRowToBloodDonation(asRecord(x) as BackendRequestRow));
}
