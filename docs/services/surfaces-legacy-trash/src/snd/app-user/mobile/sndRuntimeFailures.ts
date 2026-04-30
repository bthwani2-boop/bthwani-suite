export type SndRuntimeFailureKind =
  | 'offline'
  | 'forbidden'
  | 'not_found'
  | 'config'
  | 'upstream'
  | 'unknown';

const NETWORK_ERROR_FRAGMENTS = [
  'Network request failed',
  'timeout',
  'NetworkError',
  'Failed to fetch',
];

export function isSndRuntimeNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === 'AbortError' ||
    NETWORK_ERROR_FRAGMENTS.some(fragment => error.message.includes(fragment))
  );
}

export function classifySndRuntimeFailure(options: {
  status?: number;
  error?: unknown;
}): SndRuntimeFailureKind {
  const { status, error } = options;

  if (typeof status === 'number') {
    if (status === 401 || status === 403) {
      return 'forbidden';
    }

    if (status === 404) {
      return 'not_found';
    }

    if (status === 408 || status === 429 || status >= 500) {
      return 'upstream';
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('SND_APP_CLIENT_API_BASE_URL_MISSING')) {
      return 'config';
    }

    if (isSndRuntimeNetworkError(error)) {
      return 'offline';
    }
  }

  return 'unknown';
}

export function isSndRetriableFailure(
  kind: SndRuntimeFailureKind | null
): boolean {
  return kind === 'offline' || kind === 'upstream' || kind === 'unknown';
}

export function sanitizeSndRuntimeMessage(
  fallback: string | null | undefined,
  genericMessage: string
): string {
  const normalized = fallback?.trim();

  if (!normalized) {
    return genericMessage;
  }

  if (
    normalized.startsWith('HTTP ') ||
    normalized.includes('Network request failed') ||
    normalized.includes('NetworkError') ||
    normalized.includes('Failed to fetch') ||
    normalized.includes('SND_APP_CLIENT_API_BASE_URL_MISSING')
  ) {
    return genericMessage;
  }

  return normalized;
}

export function getSndSubmissionFailureMessage(
  kind: SndRuntimeFailureKind,
  fallback?: string
): string {
  switch (kind) {
    case 'config':
      return 'إعداد الاتصال غير مكتمل حاليًا، لذلك لم يُرسل الطلب. بقيت بيانات النموذج كما هي لتتمكن من المحاولة لاحقًا.';
    case 'offline':
      return 'تعذر إرسال الطلب بسبب الاتصال. بقيت بيانات النموذج كما هي لتعيد المحاولة عند عودة الشبكة.';
    case 'forbidden':
      return 'لا توجد صلاحية كافية لإرسال هذا الطلب الآن. بقيت بيانات النموذج كما هي.';
    case 'upstream':
      return sanitizeSndRuntimeMessage(
        fallback,
        'خدمة سند لا تستجيب حاليًا. بقيت بيانات النموذج كما هي لتتمكن من إعادة المحاولة.'
      );
    default:
      return sanitizeSndRuntimeMessage(
        fallback,
        'تعذر إرسال الطلب حاليًا. بقيت بيانات النموذج كما هي لتتمكن من إعادة المحاولة.'
      );
  }
}

