import { BthMobileRoot } from '@bthwani/ui-kit';
import ClientSurfaceHost from '@bthwani/app-shells/mobile/client/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<ClientSurfaceHost />
		</BthMobileRoot>
	);
}
