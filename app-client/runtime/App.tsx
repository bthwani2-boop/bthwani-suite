import React from 'react';
import { MobileRoot } from '@bthwani/ui-kit/mobile';
import { ClientSurfaceHost } from '../shell';

export default function App() {
	return (
		<MobileRoot language="ar" themeMode="light">
			<ClientSurfaceHost />
		</MobileRoot>
	);
}
