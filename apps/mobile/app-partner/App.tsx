import { BthMobileRoot } from '@bthwani/ui-kit/mobile';
import PartnerSurfaceHost from '@bthwani/app-shells/mobile/partner/mobile-entry';

export default function App() {
	return (
		<BthMobileRoot language="ar" themeMode="light">
			<PartnerSurfaceHost />
		</BthMobileRoot>
	);
}
