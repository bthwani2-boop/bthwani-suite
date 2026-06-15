// DSH Media Runtime API Client
// Covers: POST /media/upload-intents, POST /media/{media_id}/complete,
//         GET /media/{media_id}, GET /media, DELETE /media/{media_id}
// Authority: dsh_media_assets is the runtime source. No media_key in runtime upload.
// WLT boundary: WLT stores media_id references only — never calls these endpoints.
// DEV_ONLY: /dev-fixtures/product-media (manifest-key fixture seeding) is separate.

// RETIRE_DEV_FIXTURES_AFTER_RUNTIME_MEDIA_CLOSURE

export type DshMediaType = 'image' | 'video' | 'document';

export type DshMediaStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'processing'
  | 'active'
  | 'rejected'
  | 'deleted';

export type DshMediaOwnerType =
  | 'product'
  | 'store'
  | 'banner'
  | 'campaign'
  | 'order'
  | 'field_visit'
  | 'support_ticket'
  | 'dispute';

export type DshMediaPurpose =
  | 'primary'
  | 'gallery'
  | 'thumbnail'
  | 'logo'
  | 'cover'
  | 'pickup_proof'
  | 'delivery_proof'
  | 'issue_proof'
  | 'inspection'
  | 'quality'
  | 'attachment'
  | 'evidence';

export type DshMediaAsset = {
  readonly id: string;
  readonly owner_service: string;
  readonly owner_type: DshMediaOwnerType;
  readonly owner_id: string;
  readonly media_type: DshMediaType;
  readonly purpose: DshMediaPurpose;
  readonly storage_provider: string;
  readonly bucket: string;
  readonly storage_key: string;
  readonly public_url?: string;
  readonly thumbnail_url?: string;
  readonly mime_type?: string;
  readonly file_size_bytes?: number;
  readonly width?: number;
  readonly height?: number;
  readonly duration_seconds?: number;
  readonly checksum_sha256?: string;
  readonly status: DshMediaStatus;
  readonly uploaded_by?: string;
  readonly approved_by?: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at?: string;
};

export type DshCreateMediaUploadIntentRequest = {
  readonly owner_type: DshMediaOwnerType;
  readonly owner_id: string;
  readonly media_type: DshMediaType;
  readonly purpose: DshMediaPurpose;
  readonly filename: string;
  readonly mime_type?: string;
  readonly file_size_bytes?: number;
  readonly checksum_sha256?: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration_seconds?: number;
};

export type DshMediaUploadIntentResponse = {
  readonly asset: DshMediaAsset;
  readonly intent: {
    readonly media_id: string;
    readonly upload_url: string;
    readonly storage_key: string;
    readonly expires_in_seconds: number;
  };
};

export type DshCompleteMediaUploadRequest = {
  readonly actor_id?: string;
};

export type DshListMediaAssetsResponse = {
  readonly items: DshMediaAsset[];
  readonly total: number;
};

export type DshListMediaQuery = {
  readonly owner_type?: DshMediaOwnerType;
  readonly owner_id?: string;
  readonly purpose?: DshMediaPurpose;
  readonly status?: DshMediaStatus;
};

type ApiError = { kind: 'api_error'; status: number; code: string; message: string };
type OfflineError = { kind: 'offline' };
type StorageUnavailableError = { kind: 'storage_unavailable' };
export type DshMediaApiError = ApiError | OfflineError | StorageUnavailableError;
export type DshMediaFetchFn = (input: string | URL, init?: RequestInit) => Promise<Response>;

function buildQuery(params: Record<string, string | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
    .join('&');
  return q ? `?${q}` : '';
}

async function apiFetch<T>(fetchFn: DshMediaFetchFn, url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetchFn(url, init);
  } catch {
    throw { kind: 'offline' } satisfies OfflineError;
  }
  if (response.status === 503) {
    throw { kind: 'storage_unavailable' } satisfies StorageUnavailableError;
  }
  if (!response.ok) {
    let code = 'UNKNOWN';
    let message = response.statusText;
    try {
      const body = await response.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch (err) { console.warn('[media:api-error-body]', err); }
    throw { kind: 'api_error', status: response.status, code, message } satisfies ApiError;
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type DshMediaApiHttpClient = {
  createUploadIntent(req: DshCreateMediaUploadIntentRequest, headers: Record<string, string>): Promise<DshMediaUploadIntentResponse>;
  completeUpload(mediaId: string, req: DshCompleteMediaUploadRequest, headers: Record<string, string>): Promise<DshMediaAsset>;
  getMedia(mediaId: string): Promise<DshMediaAsset>;
  listMedia(query: DshListMediaQuery): Promise<DshListMediaAssetsResponse>;
  deleteMedia(mediaId: string, headers: Record<string, string>): Promise<void>;
  putToPresignedUrl(uploadUrl: string, file: Blob, mimeType: string): Promise<void>;
};

export function createDshMediaApiHttpClient(
  baseUrl: string,
  fetchFn: DshMediaFetchFn = globalThis.fetch?.bind(globalThis) ?? (() => Promise.reject(new Error('fetch not available'))),
): DshMediaApiHttpClient {
  const base = baseUrl.replace(/\/$/, '');
  return {
    createUploadIntent(req, headers) {
      return apiFetch<DshMediaUploadIntentResponse>(fetchFn, `${base}/media/upload-intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(req),
      });
    },
    completeUpload(mediaId, req, headers) {
      return apiFetch<DshMediaAsset>(fetchFn, `${base}/media/${encodeURIComponent(mediaId)}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(req),
      });
    },
    getMedia(mediaId) {
      return apiFetch<DshMediaAsset>(fetchFn, `${base}/media/${encodeURIComponent(mediaId)}`);
    },
    listMedia(query) {
      const qs = buildQuery({
        owner_type: query.owner_type,
        owner_id: query.owner_id,
        purpose: query.purpose,
        status: query.status,
      });
      return apiFetch<DshListMediaAssetsResponse>(fetchFn, `${base}/media${qs}`);
    },
    deleteMedia(mediaId, headers) {
      return apiFetch<void>(fetchFn, `${base}/media/${encodeURIComponent(mediaId)}`, {
        method: 'DELETE',
        headers,
      });
    },
    async putToPresignedUrl(uploadUrl, file, mimeType) {
      let response: Response;
      try {
        response = await fetchFn(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': mimeType, 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD' },
          body: file,
        });
      } catch {
        throw { kind: 'offline' } satisfies OfflineError;
      }
      if (!response.ok) {
        throw { kind: 'api_error', status: response.status, code: 'STORAGE_PUT_FAILED', message: 'PUT to storage failed' } satisfies ApiError;
      }
    },
  };
}
