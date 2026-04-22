import React from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from './foundation';
import { BthButton } from './components';
import { BthSurface, BthText } from './primitives';

export type BthFormScreenShellProps = {
	title: string;
	subtitle?: string;
	submitLabel?: string;
	onSubmit?: () => void;
	submitDisabled?: boolean;
	children?: React.ReactNode;
};

export function BthFormScreenShell({
	title,
	subtitle,
	submitLabel = 'متابعة',
	onSubmit,
	submitDisabled = false,
	children
}: BthFormScreenShellProps) {
	return (
		<ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
			<View style={{ gap: spacing[2] }}>
				<BthText role="titleLg">{title}</BthText>
				{subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
			</View>
			<BthSurface gap={4}>{children}</BthSurface>
			<BthButton label={submitLabel} onPress={onSubmit} disabled={submitDisabled} />
		</ScrollView>
	);
}

export { BthTextField } from './components';
