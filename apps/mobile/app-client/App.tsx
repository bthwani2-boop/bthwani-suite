import { BthMobileRoot } from '@bthwani/ui-kit/mobile';
import ClientSurfaceHost from '@bthwani/app-shells/mobile/client/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot language="ar" themeMode="light">
			<ClientSurfaceHost />
		</BthMobileRoot>
	);
}
