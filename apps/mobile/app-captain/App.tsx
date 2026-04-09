import { BthMobileRoot } from '@bthwani/ui-kit';
import CaptainSurfaceHost from '@bthwani/app-shells/mobile/captain/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot direction="rtl" language="ar" themeMode="light">
			<CaptainSurfaceHost />
		</BthMobileRoot>
	);
}
