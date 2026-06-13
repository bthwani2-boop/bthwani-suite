import { PlatformVarsRegistry } from 'platform/PlatformVarsProvider';

export function resolveDevMediaUrl(path: string): string | null {
	const trimmedPath = path.trim();

	if (!trimmedPath) {
		return null;
	}

	const baseUrl = PlatformVarsRegistry.get('devMediaBaseUrl') ?? '';

	if (!baseUrl.trim()) {
		return null;
	}

	return `${baseUrl.replace(/\/+$/, '')}/${trimmedPath.replace(/^\/+/, '')}`;
}
