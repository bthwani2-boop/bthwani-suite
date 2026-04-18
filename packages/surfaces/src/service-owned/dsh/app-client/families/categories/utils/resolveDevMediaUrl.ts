declare const process: any;

export function resolveDevMediaUrl(path: string): string | null {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return null;
  }

  const baseUrl =
    process.env.EXPO_PUBLIC_DEV_MEDIA_BASE_URL ??
    process.env.EXPO_PUBLIC_DEV_MEDIA_BASE ??
    process.env.NEXT_PUBLIC_DEV_MEDIA_BASE_URL ??
    process.env.NEXT_PUBLIC_DEV_MEDIA_BASE ??
    process.env.DEV_MEDIA_BASE_URL ??
    process.env.DEV_MEDIA_BASE ??
    '';

  if (!baseUrl.trim()) {
    return null;
  }

  return `${baseUrl.replace(/\/+$/, '')}/${trimmedPath.replace(/^\/+/, '')}`;
}