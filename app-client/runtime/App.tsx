import React from 'react';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppClientAppearanceProvider, useAppClientAppearance } from '../shell/appearance';
import { ClientSurfaceHost } from '../shell/ClientSurfaceHost';

function AppClientRuntimeRoot() {
	const { mode } = useAppClientAppearance();

	return (
		<MobileRoot language="ar" themeMode="light" appearanceMode={mode}>
			<ClientSurfaceHost />
		</MobileRoot>
	);
}

export default function App() {
	return (
		<AppClientAppearanceProvider>
			<AppClientRuntimeRoot />
		</AppClientAppearanceProvider>
	);
}
