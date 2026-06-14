import { resolveDevMediaUrl } from '../../media/resolve-dev-media-url';

export const DSH_CATEGORY_ICONS_PATH = 'categories/dsh';

const ICON_CACHE_VERSION = 6;

export function getDshCategoryIconUrl(categoryId: string): string | null {
	if (!categoryId?.trim()) {
		return null;
	}

	const url = resolveDevMediaUrl(`${DSH_CATEGORY_ICONS_PATH}/${categoryId.trim()}.png`);

	if (!url) {
		return null;
	}

	return `${url}?v=${ICON_CACHE_VERSION}`;
}
