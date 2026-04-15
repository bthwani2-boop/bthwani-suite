import { BthMobileRoot } from '@bthwani/ui-kit/mobile';
import CaptainSurfaceHost from '@bthwani/app-shells/mobile/captain/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot language="ar" themeMode="light">
			<CaptainSurfaceHost />
		</BthMobileRoot>
	);
}
