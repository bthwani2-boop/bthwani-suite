import React from 'react';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { AppClientAppearanceProvider } from '../shell/appearance';
import { ClientSurfaceHost } from '../shell/ClientSurfaceHost';

export default function App() {
	return (
		<MobileRoot language="ar" themeMode="light">
			<AppClientAppearanceProvider>
				<ClientSurfaceHost />
			</AppClientAppearanceProvider>
		</MobileRoot>
	);
}
