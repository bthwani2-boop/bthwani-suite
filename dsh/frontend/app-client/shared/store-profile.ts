export function formatDshStoreFollowerCount(value?: number | null) {
	const count = Number(value ?? 0);

	if (!Number.isFinite(count) || count <= 0) {
		return '0';
	}

	if (count >= 1_000_000) {
		return `${Math.round(count / 1_000_000)} مليون`;
	}

	if (count >= 1_000) {
		const compactValue = count / 1_000;
		return Number.isInteger(compactValue)
			? `${compactValue} ألف`
			: `${compactValue.toFixed(1).replace(/\.0$/, '')} ألف`;
	}

	return `${count}`;
}

export function formatDshStoreFollowersLabel(value?: number | null, suffix = 'متابع') {
	const countLabel = formatDshStoreFollowerCount(value);
	return suffix ? `${countLabel} ${suffix}` : countLabel;
}
